import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreVertical, Trash2, AlertTriangle, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";

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

interface ChatHeaderProps {
  conversationId: Id<"conversations">;
  currentUserId: string;
  participantName: string;
  participantOnline?: boolean;
  onBack?: () => void;
  showBackButton?: boolean;
}

export function ChatHeader({ 
  conversationId, 
  currentUserId, 
  participantName, 
  participantOnline,
  onBack,
  showBackButton = false
}: ChatHeaderProps) {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const router = useRouter();

  const deleteConversation = useMutation(api.chats.deleteConversation);

  const gradient = getGradient(participantName);

  const handleDelete = async () => {
    try {
      await deleteConversation({
        userId: currentUserId,
        conversationId,
      });
      setShowDeleteAlert(false);
      // Redirect to chat home after deletion
      router.push('/chat');
    } catch (error) {
      console.error("Failed to delete conversation:", error);
    }
  };

  return (
    <>
      <div className="shrink-0 h-14 sm:h-16 bg-chat-header border-b border-border px-3 sm:px-5 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Back button for mobile */}
          {showBackButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="md:hidden h-8 w-8 shrink-0"
              aria-label="Go back"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          
          {/* Avatar */}
          <div className="relative shrink-0">
            <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
              <AvatarFallback className={`bg-gradient-to-br ${gradient} text-white font-semibold text-xs sm:text-sm`}>
                {getInitials(participantName)}
              </AvatarFallback>
            </Avatar>
            {participantOnline && (
              <span className="absolute bottom-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-chat-online rounded-full border-2 border-chat-header" />
            )}
          </div>

          {/* Name and status */}
          <div className="min-w-0">
            <h2 className="font-semibold text-xs sm:text-sm text-foreground truncate max-w-[150px] sm:max-w-[200px] md:max-w-full">
              {participantName}
            </h2>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              {participantOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5 sm:gap-1">
          {/* Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-foreground rounded-lg"
                aria-label="More options"
              >
                <MoreVertical className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 sm:w-48">
              <DropdownMenuItem
                onClick={() => setShowDeleteAlert(true)}
                className="text-destructive focus:text-destructive cursor-pointer text-xs sm:text-sm"
              >
                <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                Delete Chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-sm mx-4 sm:mx-auto p-4 sm:p-6">
          <AlertDialogHeader>
            <div className="mx-auto flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-destructive/10 mb-3">
              <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-destructive" />
            </div>
            <AlertDialogTitle className="text-center text-sm sm:text-base">
              Delete Chat
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-xs sm:text-sm">
              Delete your chat with{" "}
              <span className="font-medium text-foreground">{participantName}</span>?
              <br />
              All messages will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-col gap-2 mt-4">
            <AlertDialogCancel className="w-full text-xs sm:text-sm">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs sm:text-sm"
            >
              Delete Chat
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}