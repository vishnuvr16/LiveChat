import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Emoji code mapping
export const EMOJI_CODES = {
  "👍": "thumbs_up",
  "❤️": "heart",
  "😄": "smile",
  "🎉": "party",
  "😢": "cry",
  "😮": "surprise",
} as const;

export const EMOJI_REVERSE_MAP = {
  thumbs_up: "👍",
  heart: "❤️",
  smile: "😄",
  party: "🎉",
  cry: "😢",
  surprise: "😮",
} as const;

export type EmojiCode = keyof typeof EMOJI_REVERSE_MAP;

export default defineSchema({
  users: defineTable({
    userId: v.string(),
    email: v.string(),
    createdAt: v.number(),
    username: v.optional(v.string()),
    name: v.optional(v.string()),
    profileImage: v.optional(v.string()),
    lastSeenAt: v.optional(v.number()),
    isOnline: v.optional(v.boolean()),
    bio: v.optional(v.string()),
    phone: v.optional(v.string()),
    github: v.optional(v.string()),
    linkedin: v.optional(v.string()),
    twitter: v.optional(v.string()),
  })
    .index("by_userId", ["userId"])
    .index("by_name", ["name"])
    .index("by_email", ["email"])
    .index("by_online", ["isOnline"]),

  conversations: defineTable({
    participantOne: v.optional(v.id("users")),
    participantTwo: v.optional(v.id("users")),
    createdAt: v.number(),
    updatedAt: v.number(),
    lastMessageId: v.optional(v.id("messages")),
    isGroup: v.optional(v.boolean()),
    name: v.optional(v.string()),
    participants: v.optional(v.array(v.id("users"))),
    createdBy: v.optional(v.id("users")),
    groupImage: v.optional(v.string()),
  })
    .index("by_participants", ["participantOne", "participantTwo"])
    .index("by_participantOne", ["participantOne"])
    .index("by_participantTwo", ["participantTwo"])
    .index("by_updated", ["updatedAt"])
    .index("by_participant", ["participants"])
    .index("by_isGroup", ["isGroup"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    content: v.string(),
    type: v.union(
      v.literal("text"),
      v.literal("image"),
      v.literal("video"),
      v.literal("audio"),
      v.literal("file"),
      v.literal("deleted")
    ),
    mediaUrl: v.optional(v.string()),
    replyTo: v.optional(v.id("messages")),
    createdAt: v.number(),
    updatedAt: v.number(),
    isEdited: v.boolean(),
    isDeleted: v.optional(v.boolean()),
    // Store reactions with emoji codes instead of actual emojis
    reactions: v.optional(v.array(v.object({
      emojiCode: v.union(
        v.literal("thumbs_up"),
        v.literal("heart"),
        v.literal("smile"),
        v.literal("party"),
        v.literal("cry"),
        v.literal("surprise")
      ),
      count: v.number(),
      users: v.array(v.string()), // Array of userIds who reacted
    }))),
  })
    .index("by_conversation", ["conversationId", "createdAt"])
    .index("by_sender", ["senderId"])
    .index("by_conversation_updated", ["conversationId", "updatedAt"]),

  media: defineTable({
    messageId: v.id("messages"),
    url: v.string(),
    type: v.union(
      v.literal("image"),
      v.literal("video"),
      v.literal("audio"),
      v.literal("file")
    ),
    size: v.number(),
    mimeType: v.string(),
    duration: v.optional(v.number()),
    fileName: v.string(),
    createdAt: v.number(),
  })
    .index("by_message", ["messageId"])
    .index("by_type", ["type"]),

  typingIndicators: defineTable({
    conversationId: v.id("conversations"),
    userId: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_conversation_user", ["conversationId", "userId"])
    .index("by_user", ["userId"])
    .index("by_updated", ["updatedAt"]),

  presence: defineTable({
    userId: v.id("users"),
    status: v.union(v.literal("online"), v.literal("offline"), v.literal("away")),
    lastSeen: v.number(),
    deviceInfo: v.optional(v.string()),
  })
    .index("by_userId", ["userId"])
    .index("by_status", ["status"])
    .index("by_lastSeen", ["lastSeen"]),

  messageReads: defineTable({
    messageId: v.id("messages"),
    userId: v.id("users"),
    conversationId: v.id("conversations"),
    readAt: v.number(),
  })
    .index("by_message", ["messageId"])
    .index("by_user_conversation", ["userId", "conversationId"])
    .index("by_conversation", ["conversationId"]),

  blockedUsers: defineTable({
    userId: v.id("users"),
    blockedUserId: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_blocked", ["blockedUserId"])
    .index("by_user_blocked", ["userId", "blockedUserId"]),
});