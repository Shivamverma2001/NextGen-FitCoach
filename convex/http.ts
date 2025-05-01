import { httpRouter } from "convex/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const http = httpRouter();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const MAX_RETRIES = 5;
const RETRY_DELAY = 2000; // 2 seconds

async function generateContentWithRetry(model: any, prompt: string, retries = 0) {
  try {
    const result = await model.generateContent(prompt);
    return result;
  } catch (error: any) {
    if (error.status === 503 && retries < MAX_RETRIES) {
      console.log(`Retrying Gemini API call (attempt ${retries + 1}/${MAX_RETRIES})...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return generateContentWithRetry(model, prompt, retries + 1);
    }
    throw error;
  }
}

http.route({
    path: "/clerk-webhook",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
        if (!webhookSecret) {
            throw new Error("Missing CLERK_WEBHOOK_SECRET environment variable");
        }

        const svix_id = request.headers.get("svix-id");
        const svix_signature = request.headers.get("svix-signature");
        const svix_timestamp = request.headers.get("svix-timestamp");

        if (!svix_id || !svix_signature || !svix_timestamp) {
            return new Response("No svix headers found", {
                status: 400
            });
        }

        const payload = await request.json();
        const body = JSON.stringify(payload);

        const webhook = new Webhook(webhookSecret);
        let event: WebhookEvent;

        try {
            event = webhook.verify(body, {
                "svix-id": svix_id,
                "svix-signature": svix_signature,
                "svix-timestamp": svix_timestamp
            }) as WebhookEvent;
        } catch (error) {
            console.log("Error verifying webhook: ", error);
            return new Response("Error occurred", { status: 400 });
        }

        const eventType = event.type;

        if (eventType === "user.created") {
            const { id, first_name, last_name, image_url, email_addresses, phone_numbers } = event.data;
            const email = email_addresses[0].email_address;
            const name = `${first_name || ""} ${last_name || ""}`.trim();
            const phoneNumber = phone_numbers[0].phone_number;

            try {
                await ctx.runMutation(api.users.syncUser, {
                    email,
                    phoneNumber,
                    name,
                    image: image_url,
                    clerkId: id
                });
                return new Response("User created successfully", { status: 200 });
            } catch (error) {
                console.log("Error creating user:", error);
                return new Response("Error creating user", {
                    status: 500
                });
            }
        }

        if (eventType === "user.updated") {
          const { id, email_addresses, first_name, last_name, image_url } = event.data;
    
          const email = email_addresses[0].email_address;
          const name = `${first_name || ""} ${last_name || ""}`.trim();
    
          try {
            await ctx.runMutation(api.users.updateUser, {
              clerkId: id,
              email,
              name,
              image: image_url,
            });
          } catch (error) {
            console.log("Error updating user:", error);
            return new Response("Error updating user", { status: 500 });
          }
        }

        return new Response("Event type not handled", { status: 200 });
    })
});

function validateWorkoutPlan(plan: any) {
    const validatedPlan = {
      schedule: plan.schedule,
      exercises: plan.exercises.map((exercise: any) => ({
        day: exercise.day,
        routines: exercise.routines.map((routine: any) => ({
          name: routine.name,
          sets: typeof routine.sets === "number" ? routine.sets : parseInt(routine.sets) || 1,
          reps: typeof routine.reps === "number" ? routine.reps : parseInt(routine.reps) || 10,
        })),
      })),
    };
    return validatedPlan;
  }
  
  // validate diet plan to ensure it strictly follows schema
  function validateDietPlan(plan: any) {
    // only keep the fields we want
    const validatedPlan = {
      dailyCalories: plan.dailyCalories,
      meals: plan.meals.map((meal: any) => ({
        name: meal.name,
        foods: meal.foods,
      })),
    };
    return validatedPlan;
  }
  
  http.route({
    path: "/vapi/generate-program",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
      try {
        const payload = await request.json();
  
        const {
          user_id,
          age,
          height,
          weight,
          injuries,
          workout_days,
          fitness_goal,
          fitness_level,
          dietary_restrictions,
        } = payload;
  
        console.log("Payload is here:", payload);
  
        const model = genAI.getGenerativeModel({
          model: "gemini-2.0-flash-001",
          generationConfig: {
            temperature: 0.4, // lower temperature for more predictable outputs
            topP: 0.9,
            responseMimeType: "application/json",
          },
        });
  
        const workoutPrompt = `You are an experienced fitness coach creating a personalized workout plan based on:
        Age: ${age}
        Height: ${height}
        Weight: ${weight}
        Injuries or limitations: ${injuries}
        Available days for workout: ${workout_days}
        Fitness goal: ${fitness_goal}
        Fitness level: ${fitness_level}
        
        As a professional coach:
        - Consider muscle group splits to avoid overtraining the same muscles on consecutive days
        - Design exercises that match the fitness level and account for any injuries
        - Structure the workouts to specifically target the user's fitness goal
        
        CRITICAL SCHEMA INSTRUCTIONS:
        - Your output MUST contain ONLY the fields specified below, NO ADDITIONAL FIELDS
        - "sets" and "reps" MUST ALWAYS be NUMBERS, never strings
        - For example: "sets": 3, "reps": 10
        - Do NOT use text like "reps": "As many as possible" or "reps": "To failure"
        - Instead use specific numbers like "reps": 12 or "reps": 15
        - For cardio, use "sets": 1, "reps": 1 or another appropriate number
        - NEVER include strings for numerical fields
        - NEVER add extra fields not shown in the example below
        
        Return a JSON object with this EXACT structure:
        {
          "schedule": ["Monday", "Wednesday", "Friday"],
          "exercises": [
            {
              "day": "Monday",
              "routines": [
                {
                  "name": "Exercise Name",
                  "sets": 3,
                  "reps": 10
                }
              ]
            }
          ]
        }
        
        DO NOT add any fields that are not in this example. Your response must be a valid JSON object with no additional text.`;
  
        // Use retry logic for workout plan generation
        const workoutResult = await generateContentWithRetry(model, workoutPrompt);
        const workoutPlanText = workoutResult.response.text();
  
        // VALIDATE THE INPUT COMING FROM AI
        let workoutPlan = JSON.parse(workoutPlanText);
        workoutPlan = validateWorkoutPlan(workoutPlan);
  
        const dietPrompt = `You are an experienced nutrition coach creating a personalized diet plan based on:
          Age: ${age}
          Height: ${height}
          Weight: ${weight}
          Fitness goal: ${fitness_goal}
          Dietary restrictions: ${dietary_restrictions}
          
          As a professional nutrition coach:
          - Calculate appropriate daily calorie intake based on the person's stats and goals
          - Create a balanced meal plan with proper macronutrient distribution
          - Include a variety of nutrient-dense foods while respecting dietary restrictions
          - Consider meal timing around workouts for optimal performance and recovery
          
          CRITICAL SCHEMA INSTRUCTIONS:
          - Your output MUST contain ONLY the fields specified below, NO ADDITIONAL FIELDS
          - "dailyCalories" MUST be a NUMBER, not a string
          - DO NOT add fields like "supplements", "macros", "notes", or ANYTHING else
          - ONLY include the EXACT fields shown in the example below
          - Each meal should include ONLY a "name" and "foods" array
  
          Return a JSON object with this EXACT structure and no other fields:
          {
            "dailyCalories": 2000,
            "meals": [
              {
                "name": "Breakfast",
                "foods": ["Oatmeal with berries", "Greek yogurt", "Black coffee"]
              },
              {
                "name": "Lunch",
                "foods": ["Grilled chicken salad", "Whole grain bread", "Water"]
              }
            ]
          }
          
          DO NOT add any fields that are not in this example. Your response must be a valid JSON object with no additional text.`;
  
        // Use retry logic for diet plan generation
        const dietResult = await generateContentWithRetry(model, dietPrompt);
        const dietPlanText = dietResult.response.text();
  
        // VALIDATE THE INPUT COMING FROM AI
        let dietPlan = JSON.parse(dietPlanText);
        dietPlan = validateDietPlan(dietPlan);
  
        // save to our DB: CONVEX
        const planId = await ctx.runMutation(api.plans.createPlan, {
          userId: user_id,
          dietPlan,
          isActive: true,
          workoutPlan,
          name: `${fitness_goal} Plan - ${new Date().toLocaleDateString()}`,
        });
  
        return new Response(
          JSON.stringify({
            success: true,
            data: {
              planId,
              workoutPlan,
              dietPlan,
            },
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      } catch (error) {
        console.error("Error generating fitness plan:", error);
        
        // Return a more user-friendly error message
        const errorMessage = error instanceof Error 
          ? error.message.includes("503") 
            ? "The AI service is currently busy. Please try again in a few minutes."
            : error.message
          : "An unexpected error occurred";

        return new Response(
          JSON.stringify({
            success: false,
            error: errorMessage,
          }),
          {
            status: error instanceof Error && error.message.includes("503") ? 503 : 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }),
  });

export default http;