import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MessageSquarePlus, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const GRADIENT_COLORS = [
  "from-teal-400 to-emerald-500",
  "from-violet-400 to-purple-500",
  "from-amber-400 to-orange-500",
  "from-rose-400 to-pink-500",
  "from-sky-400 to-blue-500",
  "from-lime-400 to-green-500",
];

function getGradient(name: string) {
  const idx = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % GRADIENT_COLORS.length;
  return GRADIENT_COLORS[idx];
}

function getInitials(name: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface SearchUserDialogProps {
  currentUserId: string;
  onSelectConversation: (conversationId: Id<"conversations">) => void;
}

export function SearchUserDialog({ currentUserId, onSelectConversation }: SearchUserDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const users = useQuery(api.users.searchUsers, {
    searchTerm,
    currentUserId,
  });

  const conversations = useQuery(api.chats.getConversation, {
    userId: currentUserId,
  });

  const onlineUsers = useQuery(api.users.getOnlineUsers);

  const createOrGetConversation = useMutation(api.chats.createOrGetConversation);

  const handleStartChat = async (participantUserId: string) => {
    try {
      const conversationId = await createOrGetConversation({
        participantUserId,
        currentUserId,
      });
      
      if (conversationId) {
        onSelectConversation(conversationId);
        setIsOpen(false);
        setSearchTerm("");
      }
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  // Create a map of existing conversations for quick lookup
  const existingConversationsMap = useMemo(() => {
    const map = new Map();
    if (conversations) {
      conversations.forEach((conv: any) => {
        if (!conv.isGroup) {
          map.set(conv.participantId, conv.id);
        }
      });
    }
    return map;
  }, [conversations]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg">
          <MessageSquarePlus className="h-4.5 w-4.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="text-base">New Chat</DialogTitle>
        </DialogHeader>

        <div className="px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search contacts..."
              className="w-full bg-muted border-none rounded-lg pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              autoFocus
            />
          </div>
        </div>

        <div className="overflow-y-auto max-h-80 min-h-[200px] pb-2">
          {users?.map((user: any) => {
            const gradient = getGradient(user.name || "Unknown");
            const existingConvId = existingConversationsMap.get(user.userId);

            return (
              <button
                key={user._id}
                onClick={() => handleStartChat(user.userId)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left"
              >
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={`bg-gradient-to-br ${gradient} text-white font-semibold text-xs`}>
                      {getInitials(user.name || "Unknown")}
                    </AvatarFallback>
                  </Avatar>
                  {onlineUsers?.includes(user.userId) && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-chat-online rounded-full border-2 border-card" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{user.name || "Unknown"}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                {existingConvId && (
                  <span className="text-[10px] text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </button>
            );
          })}

          {users?.length === 0 && searchTerm && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No contacts found
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}