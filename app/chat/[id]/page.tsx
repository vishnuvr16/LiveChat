"use client";

import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatInput } from "@/components/chat/ChatInput";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const conversationId = params?.conversationId as Id<"conversations">;

  const currentUser = useQuery(api.users.readUser, {
    userId: user?.id || "",
  });

  const conversations = useQuery(api.chats.getConversation, {
    userId: user?.id || "",
  });

  const conversation = useQuery(api.chats.getConversationById, {
    conversationId,
  });

  // Find the active conversation details
  const activeConversation = conversations?.find(
    (conv: any) => conv.id === conversationId
  );

  // Verify user has access to this conversation
  useEffect(() => {
    if (conversations && !activeConversation) {
      router.push('/chat');
    }
  }, [conversations, activeConversation, router]);

  if (!user) return null;
  
  if (!currentUser || !conversations || !activeConversation) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ChatHeader
        conversationId={conversationId}
        currentUserId={user.id}
        participantName={activeConversation.name || "Unknown"}
        participantOnline={activeConversation.participantOnline}
      />
      <ChatMessages
        conversationId={conversationId}
        currentUserId={user.id}
      />
      <ChatInput
        conversationId={conversationId}
        currentUserId={user.id}
      />
    </>
  );
}