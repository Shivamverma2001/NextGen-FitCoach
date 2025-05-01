import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const syncUser = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        phoneNumber: v.string(),
        image: v.optional(v.string()),
        clerkId: v.string()
    },

    handler: async(ctx,args)=>{
        console.log("Syncing user with args:", args);
        
        try {
            // Check if user already exists
            const existingUser = await ctx.db
                .query("users")
                .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
                .first();

            if(existingUser) {
                console.log("User already exists:", existingUser);
                return existingUser;
            }

            // Create new user
            const userData = {
                name: args.name,
                email: args.email,
                phoneNumber: args.phoneNumber,
                image: args.image,
                clerkId: args.clerkId
            };

            console.log("Creating new user with data:", userData);
            const result = await ctx.db.insert("users", userData);
            console.log("User created successfully:", result);
            return result;
        } catch (error) {
            console.error("Error in syncUser mutation:", error);
            throw error;
        }
    }
});

export const updateUser = mutation({
    args: {
      name: v.string(),
      email: v.string(),
      clerkId: v.string(),
      image: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
        .first();
  
      if (!existingUser) return;
  
      return await ctx.db.patch(existingUser._id, args);
    },
  });