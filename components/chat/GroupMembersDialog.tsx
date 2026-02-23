"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, MessageCircle } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface GroupMembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conversationId: Id<"conversations">;
  currentUserId: string;
//   onStartChat?: (userId: string) => void;
}

export function GroupMembersDialog({ 
  open, 
  onOpenChange, 
  conversationId,
  currentUserId,
//   onStartChat 
}: GroupMembersDialogProps) {
  
  const groupDetails = useQuery(api.chats.getGroupDetails, {
    conversationId,
    currentUserId,
  });

  const members = groupDetails?.members || [];
  const onlineCount = members.filter(m => m.isOnline).length;

  if (!groupDetails) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md bg-chat-sidebar border-border">
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-chat-sidebar border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            {groupDetails.name} - {members.length} members
          </DialogTitle>
        </DialogHeader>

        {/* Online status summary */}
        <div className="text-xs text-muted-foreground px-2">
          {onlineCount} online, {members.length - onlineCount} offline
        </div>

        {/* Members list */}
        <div className="max-h-96 overflow-y-auto space-y-1 py-2">
          {members.map((member) => (
            <div
              key={member.userId}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-chat-sidebar-hover transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    {member.profileImage ? (
                      <img src={member.profileImage} alt={member.name} />
                    ) : (
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {member.name?.[0] || "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  {member.isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-chat-online rounded-full border-2 border-chat-sidebar" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {member.name}
                    {member.userId === currentUserId && " (You)"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {member.isOnline ? "Online" : `Last seen ${formatLastSeen(member.lastSeenAt)}`}
                  </p>
                </div>
              </div>
              
              {/* Message button (for other users) */}
              {/* {member.userId !== currentUserId && onStartChat && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onStartChat(member.userId);
                    onOpenChange(false);
                  }}
                  className="text-muted-foreground hover:text-primary"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              )} */}
            </div>
          ))}
        </div>

        {/* Group info footer */}
        <div className="text-xs text-muted-foreground border-t border-border pt-3 mt-2">
          <p>Created by {groupDetails.createdBy}</p>
          <p>Group ID: {conversationId}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper function for last seen
function formatLastSeen(timestamp?: number) {
  if (!timestamp) return "Unknown";
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return date.toLocaleDateString();
}