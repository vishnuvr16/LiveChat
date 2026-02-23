"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, X, Check, Users } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserId: string;
  onGroupCreated: (conversationId: Id<"conversations">) => void;
}

export function CreateGroupDialog({ 
  open, 
  onOpenChange, 
  currentUserId,
  onGroupCreated 
}: CreateGroupDialogProps) {
  const [groupName, setGroupName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const users = useQuery(api.users.getAllUsers);
  const createGroup = useMutation(api.chats.createGroupConversation);

  const filteredUsers = users?.filter(user => 
    user.userId !== currentUserId &&
    user.name?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const toggleUser = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreate = async () => {
    if (!groupName.trim() || selectedUsers.length === 0) return;

    try {
      const conversationId = await createGroup({
        name: groupName.trim(),
        participantIds: selectedUsers,
        createdBy: currentUserId,
      });
      
      onGroupCreated(conversationId);
      setGroupName("");
      setSelectedUsers([]);
    } catch (error) {
      console.error("Failed to create group:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-chat-sidebar border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Create New Group
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Group Name Input */}
          <Input
            placeholder="Group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="bg-chat-input-bg border-border"
          />

          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map(userId => {
                const user = users?.find(u => u.userId === userId);
                return (
                  <div
                    key={userId}
                    className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs"
                  >
                    <span>{user?.name}</span>
                    <button onClick={() => toggleUser(userId)}>
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Search Users */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users to add..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-chat-input-bg border-border"
            />
          </div>

          {/* Users List */}
          <div className="max-h-60 overflow-y-auto space-y-1">
            {filteredUsers.map((user) => {
              const isSelected = selectedUsers.includes(user.userId);
              return (
                <button
                  key={user.userId}
                  onClick={() => toggleUser(user.userId)}
                  className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-chat-sidebar-hover transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      {user.profileImage ? (
                        <img src={user.profileImage} alt={user.name} />
                      ) : (
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {user.name?.[0] || "U"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span className="text-sm text-foreground">{user.name}</span>
                  </div>
                  {isSelected && <Check className="h-4 w-4 text-primary" />}
                </button>
              );
            })}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-border"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!groupName.trim() || selectedUsers.length === 0}
            className="bg-primary hover:bg-primary/90"
          >
            Create Group
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}