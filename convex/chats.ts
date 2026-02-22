import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { EMOJI_CODES, EMOJI_REVERSE_MAP } from "./schema";

// ============= HELPER FUNCTIONS =============

const formatChatTime = (date: Date) => {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else if (now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};

const formatDetailedTime = (date: Date) => {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  } else if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
  } else if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + 
           ` at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
  } else {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) + 
           ` at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
  }
};

// Helper to convert emoji to code
const emojiToCode = (emoji: string): string => {
  return EMOJI_CODES[emoji as keyof typeof EMOJI_CODES] || emoji;
};

// Helper to convert code to emoji
const codeToEmoji = (code: string): string => {
  return EMOJI_REVERSE_MAP[code as keyof typeof EMOJI_REVERSE_MAP] || code;
};

// ============= CONVERSATION MUTATIONS =============

export const createOrGetConversation = mutation({
  args: {
    participantUserId: v.string(),
    currentUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.currentUserId))
      .first();

    const otherUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.participantUserId))
      .first();

    if (!currentUser || !otherUser) {
      throw new Error("User not found");
    }

    const existingConversation = await ctx.db
      .query("conversations")
      .filter((q) =>
        q.or(
          q.and(
            q.eq(q.field("participantOne"), currentUser._id),
            q.eq(q.field("participantTwo"), otherUser._id)
          ),
          q.and(
            q.eq(q.field("participantOne"), otherUser._id),
            q.eq(q.field("participantTwo"), currentUser._id)
          )
        )
      )
      .first();

    if (existingConversation) {
      return existingConversation?._id;
    }

    const conversationId = await ctx.db.insert("conversations", {
      participantOne: currentUser._id,
      participantTwo: otherUser._id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return conversationId;
  },
});

export const createGroupConversation = mutation({
  args: {
    name: v.string(),
    participantIds: v.array(v.string()),
    createdBy: v.string(),
  },
  handler: async (ctx, args) => {
    const creator = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.createdBy))
      .first();

    if (!creator) throw new Error("Creator not found");

    const participants = await Promise.all(
      args.participantIds.map(async (userId) => {
        const user = await ctx.db
          .query("users")
          .filter((q) => q.eq(q.field("userId"), userId))
          .first();
        return user?._id;
      })
    );

    const validParticipants = participants.filter((id): id is NonNullable<typeof id> => id !== undefined);
    validParticipants.push(creator._id);

    const conversationId = await ctx.db.insert("conversations", {
      name: args.name,
      participants: validParticipants,
      createdBy: creator._id,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isGroup: true,
    });

    return conversationId;
  },
});

export const deleteConversation = mutation({
  args: {
    userId: v.string(),
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();

    if (!user) throw new Error("User not found");

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) throw new Error("Conversation not found");

    const isParticipant = conversation.isGroup
      ? conversation.participants?.includes(user._id)
      : conversation.participantOne === user._id || conversation.participantTwo === user._id;

    if (!isParticipant) throw new Error("Unauthorized to delete this conversation");

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect();

    await Promise.all(messages.map((message) => ctx.db.delete(message._id)));

    await ctx.db.delete(args.conversationId);

    return { success: true, deletedMessages: messages.length };
  },
});

// ============= MESSAGE MUTATIONS =============

export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    content: v.string(),
    senderId: v.string(),
    type: v.optional(v.union(v.literal("text"), v.literal("image"), v.literal("deleted"))),
    mediaUrl: v.optional(v.string()),
    replyTo: v.optional(v.id("messages")),
  },
  handler: async (ctx, args) => {
    const sender = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.senderId))
      .first();

    if (!sender) throw new Error("Sender not found");

    const messageId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: sender._id,
      content: args.content,
      type: args.type ?? "text",
      mediaUrl: args.mediaUrl,
      replyTo: args.replyTo,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isEdited: false,
    });

    await ctx.db.patch(args.conversationId, {
      lastMessageId: messageId,
      updatedAt: Date.now(),
    });

    return messageId;
  },
});

export const deleteMessage = mutation({
  args: {
    messageId: v.id("messages"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (!user) throw new Error("User not found");

    const message = await ctx.db.get(args.messageId);
    if (!message) throw new Error("Message not found");

    if (message.senderId !== user._id) {
      throw new Error("Unauthorized to delete this message");
    }

    await ctx.db.patch(args.messageId, {
      content: "This message was deleted",
      type: "deleted",
      isDeleted: true,
      updatedAt: Date.now(),
      mediaUrl: undefined,
    });

    return { success: true };
  },
});

// Updated addReaction mutation using emoji codes
export const addReaction = mutation({
  args: {
    messageId: v.id("messages"),
    userId: v.string(),
    emoji: v.string(), // This is the actual emoji from frontend
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (!user) throw new Error("User not found");

    const message = await ctx.db.get(args.messageId);
    if (!message) throw new Error("Message not found");

    // Convert emoji to code for storage
    const emojiCode = emojiToCode(args.emoji);
    
    // Get current reactions or initialize empty array
    const reactions = (message.reactions as any[]) || [];
    
    // Find if this emoji code already exists in reactions
    const existingReactionIndex = reactions.findIndex(r => r.emojiCode === emojiCode);
    
    if (existingReactionIndex !== -1) {
      // Update existing reaction
      const existingReaction = reactions[existingReactionIndex];
      
      // Check if user hasn't already reacted
      if (!existingReaction.users.includes(args.userId)) {
        existingReaction.count += 1;
        existingReaction.users.push(args.userId);
        
        reactions[existingReactionIndex] = existingReaction;
      }
    } else {
      // Create new reaction
      reactions.push({
        emojiCode,
        count: 1,
        users: [args.userId],
      });
    }
    
    await ctx.db.patch(args.messageId, {
      reactions: reactions as any,
      updatedAt: Date.now(),
    });

    return reactions;
  },
});

// Updated removeReaction mutation
export const removeReaction = mutation({
  args: {
    messageId: v.id("messages"),
    userId: v.string(),
    emoji: v.string(),
  },
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.messageId);
    if (!message) throw new Error("Message not found");

    // Convert emoji to code
    const emojiCode = emojiToCode(args.emoji);

    const reactions = (message.reactions as any[]) || [];
    
    // Find the reaction with this emoji code
    const reactionIndex = reactions.findIndex(r => r.emojiCode === emojiCode);
    
    if (reactionIndex !== -1) {
      const reaction = reactions[reactionIndex];
      
      // Remove user from users array
      const userIndex = reaction.users.indexOf(args.userId);
      if (userIndex !== -1) {
        reaction.users.splice(userIndex, 1);
        reaction.count -= 1;
        
        // If count becomes 0, remove the reaction entirely
        if (reaction.count <= 0) {
          reactions.splice(reactionIndex, 1);
        } else {
          reactions[reactionIndex] = reaction;
        }
      }
    }
    
    await ctx.db.patch(args.messageId, {
      reactions: reactions as any,
      updatedAt: Date.now(),
    });

    return reactions;
  },
});

// ============= TYPING INDICATOR =============

export const sendTypingIndicator = mutation({
  args: {
    conversationId: v.id("conversations"),
    userId: v.string(), // Clerk user ID
    isTyping: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Get user's Convex ID from their Clerk ID
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();
    
    if (!user) throw new Error("User not found");

    // Update or create typing indicator
    const existing = await ctx.db
      .query("typingIndicators")
      .withIndex("by_conversation_user", (q) => 
        q.eq("conversationId", args.conversationId)
         .eq("userId", user._id)
      )
      .first();

    if (args.isTyping) {
      if (existing) {
        await ctx.db.patch(existing._id, { updatedAt: Date.now() });
      } else {
        await ctx.db.insert("typingIndicators", {
          conversationId: args.conversationId,
          userId: user._id,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });
      }
    } else {
      if (existing) {
        await ctx.db.delete(existing._id);
      }
    }
  }
});

export const getTypingUsers = query({
  args: {
    conversationId: v.id("conversations"),
    currentUserId: v.string(), // Clerk user ID
  },
  handler: async (ctx, args) => {
    const currentUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.currentUserId))
      .first();

    if (!currentUser) return [];

    const typingIndicators = await ctx.db
      .query("typingIndicators")
      .withIndex("by_conversation", (q) => 
        q.eq("conversationId", args.conversationId)
      )
      .collect();

    // Filter out old indicators (> 3 seconds) and current user
    const now = Date.now();
    const activeTypers = typingIndicators
      .filter(t => now - t.updatedAt < 3000 && t.userId !== currentUser._id);

    // Get user names
    const typers = await Promise.all(
      activeTypers.map(async (t) => {
        const user = await ctx.db.get(t.userId);
        return user?.name;
      })
    );

    return typers.filter(Boolean);
  }
});

// ============= QUERIES =============

export const getConversation = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (!user) return [];

    const conversations = await ctx.db
      .query("conversations")
      .filter((q) =>
        q.or(
          q.eq(q.field("participantOne"), user._id),
          q.eq(q.field("participantTwo"), user._id),
          q.and(
            q.eq(q.field("isGroup"), true),
          )
        )
      )
      .collect();

    const onlinePresence = await ctx.db
      .query("presence")
      .withIndex("by_status", (q) => q.eq("status", "online"))
      .collect();
    
    const onlineUserIds = new Set(onlinePresence.map(p => p.userId));

    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conv) => {
        let name = "";
        let chatImage = "";
        let participantOnline = false;
        let participantId = "";

        if (conv.isGroup) {
          name = conv.name || "Group Chat";
          chatImage = conv.groupImage || "";
        } else {
          const otherParticipantId =
            conv.participantOne === user._id
              ? conv.participantTwo
              : conv.participantOne;

          const otherUser = otherParticipantId ? await ctx.db.get(otherParticipantId) : null;
          name = otherUser?.name ?? "Unknown";
          chatImage = otherUser?.profileImage ?? "";
          participantId = otherUser?.userId ?? "";
          participantOnline = otherUser ? onlineUserIds.has(otherUser._id) : false;
        }

        const lastMessage = conv.lastMessageId
          ? await ctx.db.get(conv.lastMessageId)
          : null;

        const unreadCount = await ctx.db
          .query("messages")
          .withIndex("by_conversation", (q) => q.eq("conversationId", conv._id))
          .filter((q) =>
            q.and(
              q.gt(q.field("createdAt"), user.lastSeenAt || 0),
              q.neq(q.field("senderId"), user._id)
            )
          )
          .collect();

        return {
          id: conv._id,
          name,
          chatImage,
          lastMessage: lastMessage?.content ?? "",
          lastMessageTime: conv.updatedAt,
          lastMessageType: lastMessage?.type,
          unreadCount: unreadCount.length,
          isGroup: conv.isGroup || false,
          participantCount: conv.participants?.length,
          participantId,
          participantOnline,
          updatedAt: conv.updatedAt
        };
      })
    );

    return conversationsWithDetails.sort((a, b) => b.updatedAt - a.updatedAt);
  },
});

// Updated getMessages query
export const getMessages = query({
  args: {
    conversationId: v.id("conversations"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .order("desc")
      .take(args.limit ?? 50);

    const formattedMessages = await Promise.all(
      messages.map(async (message) => {
        const sender = await ctx.db.get(message.senderId);
        
        // Get reactions array (this is safe - it uses codes, not emojis)
        const reactionsArray = (message.reactions as any[]) || [];
        
        // Return the array directly - don't create an object with emoji keys
        return {
          ...message,
          sender_userId: sender?.userId,
          senderName: sender?.name || sender?.email,
          senderImage: sender?.profileImage,
          time: message.createdAt,
          reactions: reactionsArray, // Send the array, not a map with emoji keys
        };
      })
    );

    return formattedMessages.reverse();
  },
});

export const getConversationById = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) return null;

    if (conversation.isGroup) {
      return {
        id: conversation._id,
        name: conversation.name,
        isGroup: true,
        participantCount: conversation.participants?.length || 0,
      };
    } else {
      return {
        id: conversation._id,
        isGroup: false,
      };
    }
  },
});

// Mark messages as read when opening a conversation
export const markConversationAsRead = mutation({
  args: {
    conversationId: v.id("conversations"),
    userId: v.string(), // Clerk user ID
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (!user) throw new Error("User not found");

    // Update user's lastSeenAt
    await ctx.db.patch(user._id, {
      lastSeenAt: Date.now(),
    });

    // Get all unread messages in this conversation not sent by current user
    const unreadMessages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
      .filter((q) => 
        q.and(
          q.gt(q.field("createdAt"), user.lastSeenAt || 0),
          q.neq(q.field("senderId"), user._id)
        )
      )
      .collect();

    // Create read receipts for all unread messages
    await Promise.all(
      unreadMessages.map(msg => 
        ctx.db.insert("messageReads", {
          messageId: msg._id,
          userId: user._id,
          conversationId: args.conversationId,
          readAt: Date.now(),
        })
      )
    );

    return { success: true };
  },
});

export const getUnreadCount = query({
  args: {
    conversationId: v.id("conversations"),
    userId: v.string(), // Clerk user ID
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (!user) return 0;

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) => 
        q.eq("conversationId", args.conversationId)
      )
      .filter((q) => q.gt(q.field("createdAt"), user.lastSeenAt || 0))
      .collect();

    // Filter out user's own messages
    const unreadMessages = messages.filter(m => m.senderId !== user._id);

    return unreadMessages.length;
  }
});

// ============= FILE UPLOAD =============

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const getUploadUrl = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const url = await ctx.storage.getUrl(args.storageId);
    return url;
  },
});