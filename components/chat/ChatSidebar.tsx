import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, User, LogOut, ChevronLeft } from "lucide-react";
import { useState, useMemo } from "react";
import { SearchUserDialog } from "./SearchUserDialog";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import CoolLoader from "../CoolLoader"

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

function formatChatTime(timestamp: number) {
  const date = new Date(timestamp);
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
}

interface ChatSidebarProps {
  currentUserId: string;
  onSelectConversation: (conversationId: Id<"conversations">) => void;
  activeConversationId: Id<"conversations"> | null;
  isMobile?: boolean;
  onCloseSidebar?: () => void;
}

export function ChatSidebar({ 
  currentUserId, 
  onSelectConversation, 
  activeConversationId,
  isMobile = false,
  onCloseSidebar 
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { signOut } = useClerk();

  const currentUser = useQuery(api.users.readUser, {
    userId: currentUserId,
  });

  const conversations = useQuery(api.chats.getConversation, {
    userId: currentUserId,
  });

  const updatePresence = useMutation(api.users.updatePresence);

  const filteredConversations = useMemo(() => {
    if (!conversations) return [];
    if (!searchQuery) return conversations;
    
    const q = searchQuery.toLowerCase();
    return conversations.filter((conv: any) =>
      conv.name?.toLowerCase().includes(q)
    );
  }, [conversations, searchQuery]);

  const handleSelect = (conversationId: Id<"conversations">) => {
    onSelectConversation(conversationId);
    if (isMobile && onCloseSidebar) {
      onCloseSidebar();
    }
  };

  const handleLogout = async () => {
    try {
      await updatePresence({
        userId: currentUserId,
        status: "offline",
      });
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!currentUser || !conversations) {
    return (
      <div className="w-full h-full flex flex-col bg-chat-sidebar border-r border-border">
        <div className="flex-1 flex items-center justify-center">
          <CoolLoader />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-chat-sidebar border-r border-border">
      {/* Header */}
      <div className="shrink-0 px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-2 sm:gap-3">
          {isMobile && activeConversationId && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onCloseSidebar}
              className="md:hidden h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          <Link href={'/profile'} className="flex-shrink-0">
            <div className="relative cursor-pointer hover:opacity-80 transition-opacity">
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                {currentUser.profileImage ? (
                  <img src={currentUser.profileImage} alt={currentUser.name} className="object-cover" />
                ) : (
                  <AvatarFallback className="bg-gradient-to-br from-primary to-emerald-600 text-primary-foreground font-semibold text-xs sm:text-sm">
                    {getInitials(currentUser.name || "User")}
                  </AvatarFallback>
                )}
              </Avatar>
              <span className="absolute bottom-0 right-0 w-2 h-2 sm:w-3 sm:h-3 bg-chat-online rounded-full border-2 border-chat-sidebar" />
            </div>
          </Link>
          <div className="min-w-0">
            <h1 className="font-semibold text-foreground text-xs sm:text-sm truncate">Messages</h1>
            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{conversations.length} conversations</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <SearchUserDialog 
            currentUserId={currentUserId} 
            onSelectConversation={handleSelect}
          />
        </div>
      </div>

      {/* Search */}
      <div className="px-3 sm:px-4 py-2 sm:pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 sm:pl-9 pr-7 sm:pr-8 h-8 sm:h-9 bg-muted border-none text-xs sm:text-sm rounded-lg focus-visible:ring-1 focus-visible:ring-primary/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-2">
        <AnimatePresence>
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center px-4">
              <Search className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground/40 mb-2" />
              <p className="text-xs sm:text-sm text-muted-foreground">No conversations found</p>
            </div>
          ) : (
            filteredConversations.map((conv: any) => {
              const isActive = activeConversationId === conv.id;
              const gradient = getGradient(conv.name || "Unknown");
              console.log("conv",conv)
              return (
                <motion.div
                  key={conv.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className={`
                      flex items-center gap-3 p-3 rounded-md cursor-pointer transition-colors
                      ${conv.unreadCount > 0 ? 'bg-primary/8 hover:bg-primary/10' : 'hover:bg-muted'}
                    `}
                  >
                  <button
                    onClick={() => handleSelect(conv.id)}
                    className={`w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 sm:py-3 rounded-xl transition-all duration-200 mb-0.5 text-left cursor-pointer
                      ${isActive
                        ? "bg-chat-active shadow-sm"
                        : "hover:bg-chat-sidebar-hover"
                      }`}
                  >
                    <div className="relative shrink-0">
                      <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                        <AvatarFallback className={`bg-gradient-to-br ${gradient} text-white font-semibold text-xs sm:text-sm`}>
                          {getInitials(conv.name || "Unknown")}
                        </AvatarFallback>
                      </Avatar>
                      {conv.participantOnline && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-chat-online rounded-full border-2 border-chat-sidebar" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <h3 className={`font-medium text-xs sm:text-sm truncate ${isActive ? "text-accent-foreground" : "text-foreground"}`}>
                          {conv.name || "Unknown"}
                        </h3>
                        <span className="text-[10px] sm:text-xs text-muted-foreground shrink-0 ml-2">
                          {formatChatTime(conv.updatedAt ? new Date(conv.updatedAt).getTime() : Date.now())}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] sm:text-xs text-muted-foreground truncate pr-2">
                          {conv.lastMessageType === "image" ? "📸 Photo" : conv.lastMessage || "Start a conversation"}
                        </p>
                        {conv.unreadCount > 0 && (
                          <span className="shrink-0 min-w-[18px] sm:min-w-[20px] h-4 sm:h-5 bg-primary text-primary-foreground text-[10px] sm:text-[11px] font-bold rounded-full flex items-center justify-center px-1 sm:px-1.5">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="shrink-0 border-t border-border p-2 sm:p-3 mt-auto">
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
          <Link href="/profile" className="flex-1">
            <Button 
              variant="ghost" 
              size="sm"
              className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground hover:bg-chat-sidebar-hover text-xs sm:text-sm px-2 sm:px-3"
            >
              <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="truncate">Profile</span>
            </Button>
          </Link>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleLogout}
            className="flex-1 justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 text-xs sm:text-sm px-2 sm:px-3"
          >
            <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="truncate">Logout</span>
          </Button>
        </div>

        {/* User info */}
        <div className="hidden sm:flex mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-border items-center gap-2">
          <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
            {currentUser.profileImage ? (
              <img src={currentUser.profileImage} alt={currentUser.name} className="object-cover" />
            ) : (
              <AvatarFallback className="bg-gradient-to-br from-primary to-emerald-600 text-primary-foreground font-semibold text-[10px] sm:text-xs">
                {getInitials(currentUser.name || "User")}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] sm:text-xs font-medium text-foreground truncate">{currentUser.name || "User"}</p>
            <p className="text-[8px] sm:text-[10px] text-muted-foreground truncate">{currentUser.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}