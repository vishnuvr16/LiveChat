import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, SmilePlus, ArrowDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { TypingIndicator } from "../TypingIndicator";
import { Button } from "@/components/ui/button";

interface ChatMessagesProps {
  conversationId: Id<"conversations">;
  currentUserId: string;
}

interface Reaction {
  emojiCode: string;
  count: number;
  users: string[];
}

interface Message {
  _id: Id<"messages">;
  _creationTime: number;
  conversationId: Id<"conversations">;
  senderId: Id<"users">;
  sender_userId: string;
  senderName?: string;
  senderImage?: string;
  content: string;
  type: string;
  mediaUrl?: string;
  createdAt: number;
  updatedAt: number;
  isEdited: boolean;
  isDeleted?: boolean;
  reactions?: Reaction[];
}

const reactionEmojis = [
  { emoji: "👍", code: "thumbs_up" },
  { emoji: "❤️", code: "heart" },
  { emoji: "😄", code: "smile" },
  { emoji: "🎉", code: "party" },
  { emoji: "😢", code: "cry" },
  { emoji: "😮", code: "surprise" }
];

// Helper to get emoji from code
const getEmojiFromCode = (code: string): string => {
  const mapping: Record<string, string> = {
    "thumbs_up": "👍",
    "heart": "❤️",
    "smile": "😄",
    "party": "🎉",
    "cry": "😢",
    "surprise": "😮"
  };
  return mapping[code] || "👍";
};

// Helper to get code from emoji
const getCodeFromEmoji = (emoji: string): string => {
  const mapping: Record<string, string> = {
    "👍": "thumbs_up",
    "❤️": "heart",
    "😄": "smile",
    "🎉": "party",
    "😢": "cry",
    "😮": "surprise"
  };
  return mapping[emoji] || "thumbs_up";
};

const formatDetailedTime = (timestamp: number) => {
  const date = new Date(timestamp);
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

const formatDateBadge = (timestamp: number) => {
  const date = new Date(timestamp);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === now.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }
};

const groupMessagesByDate = (messages: Message[]) => {
  const groups = new Map<string, Message[]>();
  
  messages.forEach((message) => {
    const date = new Date(message.createdAt).toDateString();
    if (!groups.has(date)) {
      groups.set(date, []);
    }
    groups.get(date)!.push(message);
  });
  
  return groups;
};

export function ChatMessages({ conversationId, currentUserId }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const prevMessagesLengthRef = useRef(0);

  const messages = useQuery(api.chats.getMessages, {
    conversationId,
    limit: 50,
  }) as Message[] | undefined;

  const deleteMessage = useMutation(api.chats.deleteMessage);
  const addReaction = useMutation(api.chats.addReaction);
  const removeReaction = useMutation(api.chats.removeReaction);

  const typingUsers = useQuery(api.chats.getTypingUsers, {
    conversationId,
    currentUserId,
  });
  
  const markAsRead = useMutation(api.chats.markConversationAsRead);

  useEffect(() => {
    if (conversationId && currentUserId) {
      markAsRead({
        conversationId,
        userId: currentUserId,
      });
    }
  }, [conversationId, currentUserId, markAsRead]);

  // Check if user is at bottom
  const checkIfAtBottom = () => {
    if (!containerRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const bottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 50;
    return bottom;
  };

  // Handle scroll events
  const handleScroll = () => {
    const atBottom = checkIfAtBottom();
    setIsAtBottom(atBottom);
    
    // Hide button if user scrolls to bottom
    if (atBottom) {
      setShowScrollButton(false);
    }
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setIsAtBottom(true);
    setShowScrollButton(false);
  };

  // Handle new messages
  useEffect(() => {
    if (!messages) return;

    const currentLength = messages.length;
    const prevLength = prevMessagesLengthRef.current;

    // Check if new messages arrived
    if (currentLength > prevLength) {
      if (isAtBottom) {
        // If user was at bottom, auto-scroll
        scrollToBottom();
      } else {
        // If user scrolled up, show button
        setShowScrollButton(true);
      }
    }

    prevMessagesLengthRef.current = currentLength;
  }, [messages]);

  // Initial scroll to bottom when conversation loads
  useEffect(() => {
    if (messages && messages.length > 0) {
      scrollToBottom();
    }
  }, [conversationId]); // Run when conversation changes

  const handleDeleteMessage = async (messageId: Id<"messages">) => {
    try {
      await deleteMessage({
        messageId,
        userId: currentUserId,
      });
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  const handleReaction = async (messageId: Id<"messages">, emoji: string, hasReacted: boolean) => {
    try {
      if (hasReacted) {
        await removeReaction({
          messageId,
          userId: currentUserId,
          emoji,
        });
      } else {
        await addReaction({
          messageId,
          userId: currentUserId,
          emoji,
        });
      }
    } catch (error) {
      console.error("Failed to toggle reaction:", error);
    }
  };

  if (!messages) {
    return (
      <div className="flex-1 flex items-center justify-center bg-chat-bg">
        <div className="text-center space-y-3">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto animate-pulse">
            <span className="text-4xl">💬</span>
          </div>
          <h3 className="text-lg font-semibold text-foreground">Loading messages...</h3>
        </div>
      </div>
    );
  }

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div 
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto scrollbar-thin bg-chat-bg px-4 py-4 relative"
    >
      {/* New Messages Button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="sticky bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
          >
            <Button
              onClick={scrollToBottom}
              className="pointer-events-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg rounded-full px-4 py-2 h-auto"
              size="sm"
            >
              <ArrowDown className="h-4 w-4 mr-2" />
              New Messages
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {Array.from(groupedMessages.entries()).map(([dateKey, msgs]) => (
        <div key={dateKey}>
          {/* Date Badge */}
          <div className="flex justify-center my-4">
            <span className="text-[11px] font-medium text-chat-date-badge-fg bg-chat-date-badge px-3 py-1 rounded-full shadow-sm">
              {formatDateBadge(msgs[0].createdAt)}
            </span>
          </div>

          {/* Messages */}
          {msgs.map((message) => {
            const isMine = message.sender_userId === currentUserId;
            const isHovered = hoveredMessageId === message._id;

            // Check if current user has reacted with specific emoji
            const hasReacted = (emoji: string) => {
              const emojiCode = getCodeFromEmoji(emoji);
              const reaction = message.reactions?.find(r => r.emojiCode === emojiCode);
              return reaction ? reaction.users.includes(currentUserId) : false;
            };

            return (
              <div
                key={message._id}
                className={`flex mb-2 ${isMine ? "justify-end" : "justify-start"}`}
                onMouseEnter={() => setHoveredMessageId(message._id)}
                onMouseLeave={() => setHoveredMessageId(null)}
              >
                <div className={`relative group max-w-[75%] lg:max-w-[60%] ${isMine ? "animate-message-in-right" : "animate-message-in-left"}`}>
                  {/* Action buttons on hover */}
                  <AnimatePresence>
                    {isHovered && !message.isDeleted && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.1 }}
                        className={`absolute top-0 ${isMine ? "-left-16" : "-right-16"} flex items-center gap-0.5 z-10`}
                      >
                        {/* Reaction picker */}
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className="h-7 w-7 flex items-center justify-center rounded-lg bg-card hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shadow-sm border border-border">
                              <SmilePlus className="h-3.5 w-3.5" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-2" side={isMine ? "left" : "right"}>
                            <div className="flex gap-1">
                              {reactionEmojis.map(({ emoji, code }) => (
                                <button
                                  key={code}
                                  onClick={() => handleReaction(message._id, emoji, hasReacted(emoji))}
                                  className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-base hover:scale-125 active:scale-95"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>

                        {/* Delete (only own messages) */}
                        {isMine && (
                          <button
                            onClick={() => handleDeleteMessage(message._id)}
                            className="h-7 w-7 flex items-center justify-center rounded-lg bg-card hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors shadow-sm border border-border"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Message Bubble */}
                  <div
                    className={`rounded-2xl px-3.5 py-2 shadow-sm ${
                      message.isDeleted
                        ? "bg-muted/50 border border-border"
                        : isMine
                        ? "bg-chat-bubble-sent text-chat-bubble-sent-fg rounded-br-md"
                        : "bg-chat-bubble-received text-chat-bubble-received-fg rounded-bl-md border border-border/50"
                    }`}
                  >
                    {message.isDeleted ? (
                      <p className="text-sm italic text-muted-foreground flex items-center gap-1.5">
                        <Trash2 className="h-3 w-3" />
                        This message was deleted
                      </p>
                    ) : (
                      <>
                        {message.type === "image" && message.mediaUrl ? (
                          <img
                            src={message.mediaUrl}
                            alt="Shared image"
                            className="rounded-lg max-h-64 object-contain"
                          />
                        ) : (
                          <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                            {message.content}
                          </p>
                        )}
                      </>
                    )}

                    <p className={`text-[10px] mt-1 text-right ${
                      message.isDeleted
                        ? "text-muted-foreground/50"
                        : isMine
                        ? "text-chat-bubble-sent-fg/60"
                        : "text-muted-foreground"
                    }`}>
                      {formatDetailedTime(message.createdAt)}
                    </p>
                  </div>

                  {/* Reactions */}
                  {message.reactions && message.reactions.length > 0 && !message.isDeleted && (
                    <div className={`flex gap-1 mt-1 ${isMine ? "justify-end" : "justify-start"}`}>
                      {message.reactions.map((reaction) => {
                        const emoji = getEmojiFromCode(reaction.emojiCode);
                        const isMyReaction = reaction.users.includes(currentUserId);
                        
                        return (
                          <button
                            key={reaction.emojiCode}
                            onClick={() => handleReaction(message._id, emoji, isMyReaction)}
                            className={`animate-reaction-pop inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs transition-colors border ${
                              isMyReaction
                                ? "bg-chat-reaction-active border-primary/30"
                                : "bg-chat-reaction-bg border-border hover:bg-muted"
                            }`}
                          >
                            <span>{emoji}</span>
                            {reaction.count > 1 && (
                              <span className="text-[10px] text-muted-foreground">{reaction.count}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
      
      {/* Typing Indicator */}
      {typingUsers && typingUsers.length > 0 && (
        <div className="px-4 pb-1">
          <TypingIndicator names={typingUsers} />
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}