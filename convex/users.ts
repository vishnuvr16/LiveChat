import { update } from "lodash";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
    name: v.string(),
    createdAt: v.number(),
    profileImage: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const newUser = await ctx.db.insert("users", {
        userId: args.userId,
        email: args.email,
        name: args.name,
        createdAt: args.createdAt,
        profileImage: args.profileImage,
      });

      return newUser;
    } catch (error) {
      throw new Error("User informated did not insert successfully");
    }
  },
});

export const readUser = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const userInfo = await ctx.db
        .query("users")
        .filter((user) => {
          return user.eq(user.field("userId"), args.userId);
        })
        .first();

      return userInfo;
    } catch (error) {
      throw new Error("Reading user did not work");
    }
  },
});

export const updateName = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const updateUser = await ctx.db.patch(user._id, {
      name: args.name,
    });

    return updateUser;
  },
});

export const updateProfileImage = mutation({
  args: {
    userId: v.string(),
    profileImage: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const updateUser = await ctx.db.patch(user._id, {
      profileImage: args.profileImage,
    });

    return updateUser;
  },
});

export const searchUsers = query({
  args: {
    searchTerm: v.string(),
    currentUserId: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Get all users except the current user
    // Using filter here is fine for small/medium apps, 
    // but eventually, you'll want to use an Index for better performance.
    const allOtherUsers = await ctx.db
      .query("users")
      .filter((q) => q.neq(q.field("userId"), args.currentUserId))
      .collect();

    // 2. If no search term, return the full list (limited to 10 or 20)
    if (!args.searchTerm.trim()) {
      return allOtherUsers.slice(0, 10);
    }

    // 3. If there is a search term, filter the results
    const searchTermLower = args.searchTerm.toLowerCase();

    return allOtherUsers
      .filter((user) => {
        const nameMatch = user?.name?.toLowerCase().includes(searchTermLower);
        const emailMatch = user?.email?.toLowerCase().includes(searchTermLower);
        const usernameMatch = user?.username?.toLowerCase().includes(searchTermLower);

        return nameMatch || emailMatch || usernameMatch;
      })
      .slice(0, 10);
  },
});


export const getOnlineUsers = query({
  args: {},
  handler: async (ctx) => {
    const onlineUsers = await ctx.db
      .query("presence")
      .withIndex("by_status", (q) => q.eq("status", "online"))
      .collect();

    // Get user IDs
    const userIds = await Promise.all(
      onlineUsers.map(async (presence) => {
        const user = await ctx.db.get(presence.userId);
        return user?.userId;
      })
    );

    return userIds.filter(id => id !== undefined);
  },
});

// updatePresence
export const updatePresence = mutation({
  args: {
    userId: v.string(),
    status: v.union(v.literal("online"), v.literal("offline"), v.literal("away")),
    deviceInfo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (!user) throw new Error("User not found");

    const existingPresence = await ctx.db
      .query("presence")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    const presenceData = {
      userId: user._id,
      status: args.status,
      lastSeen: Date.now(),
      deviceInfo: args.deviceInfo,
    };

    if (existingPresence) {
      await ctx.db.patch(existingPresence._id, presenceData);
    } else {
      await ctx.db.insert("presence", presenceData);
    }

    // Also update user's lastSeenAt and isOnline
    await ctx.db.patch(user._id, {
      lastSeenAt: Date.now(),
      isOnline: args.status === "online",
    });
  },
});

export const updateProfile = mutation({
  args: {
    userId: v.string(),
    name: v.optional(v.string()),
    username: v.optional(v.string()),
    bio: v.optional(v.string()),
    phone: v.optional(v.string()), // More flexible
    github: v.optional(v.string()),
    twitter: v.optional(v.string()),
    linkedin: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (!user) throw new Error("User not found");

    // Filter out undefined values to create the patch object
    const { userId, ...updates } = args;
    
    // Clean up empty strings or undefined
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, v]) => v !== undefined)
    );

    await ctx.db.patch(user._id, cleanUpdates);
    return { success: true };
  },
});

export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return users;
  },
});