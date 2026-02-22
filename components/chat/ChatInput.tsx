import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Paperclip, Smile, Mic } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface ChatInputProps {
  conversationId: Id<"conversations">;
  currentUserId: string;
}

export function ChatInput({ conversationId, currentUserId }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sendMessage = useMutation(api.chats.sendMessage);
  const sendTypingIndicator = useMutation(api.chats.sendTypingIndicator);

  const handleTyping = () => {
    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Send typing indicator
    if (message.trim().length > 0) {
      sendTypingIndicator({
        conversationId,
        userId: currentUserId,
        isTyping: true,
      });
    }

    // Set timeout to stop typing after 2 seconds of inactivity
    const timeout = setTimeout(() => {
      sendTypingIndicator({
        conversationId,
        userId: currentUserId,
        isTyping: false,
      });
    }, 2000);

    setTypingTimeout(timeout);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    try {
      await sendMessage({
        conversationId,
        content: message.trim(),
        senderId: currentUserId,
        type: "text",
      });
      setMessage("");
      inputRef.current?.focus();
      
      // Clear typing indicator
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      await sendTypingIndicator({
        conversationId,
        userId: currentUserId,
        isTyping: false,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // Clean up typing indicator on unmount
  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      sendTypingIndicator({
        conversationId,
        userId: currentUserId,
        isTyping: false,
      });
    };
  }, [conversationId, currentUserId]);

  const hasContent = message.trim().length > 0;

  return (
    <div className="shrink-0 bg-chat-header border-t border-border px-4 py-3">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground rounded-lg"
        >
          <Paperclip className="h-4.5 w-4.5" />
        </Button>

        <div className="flex-1 relative">
          <Input
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleTyping}
            onKeyUp={handleTyping}
            placeholder="Type a message..."
            className="h-10 bg-chat-input-bg border border-border rounded-xl pl-4 pr-10 text-sm focus-visible:ring-1 focus-visible:ring-primary/50"
          />
        </div>

        <motion.div
          animate={{ scale: hasContent ? 1 : 0.9, opacity: hasContent ? 1 : 0.5 }}
          transition={{ duration: 0.15 }}
        >
          {hasContent ? (
            <Button
              type="submit"
              size="icon"
              className="h-9 w-9 shrink-0 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/25"
            >
              <Send className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setIsListening(!isListening)}
              className={`h-9 w-9 shrink-0 rounded-xl ${isListening ? "text-destructive animate-pulse" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Mic className="h-4.5 w-4.5" />
            </Button>
          )}
        </motion.div>
      </form>
    </div>
  );
}