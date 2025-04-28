import { httpRouter } from "convex/server";
import { WebhookEvent } from "@clerk/nextjs/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

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

        return new Response("Event type not handled", { status: 200 });
    })
});

export default http;