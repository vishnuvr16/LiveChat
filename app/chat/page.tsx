"use client";

import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatMessages } from "@/components/chat/ChatMessages";
import { ChatInput } from "@/components/chat/ChatInput";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createOrGetConversation } from "@/convex/chats";

export default function ChatPage() {
  const { user } = useUser();
  const [activeConversationId, setActiveConversationId] = useState<Id<"conversations"> | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [activeConversation, setActiveConversation] = useState<any>(null);

  // Check if mobile on mount and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-close sidebar on mobile when conversation is selected
      if (window.innerWidth < 768 && activeConversationId) {
        setIsSidebarOpen(false);
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, [activeConversationId]);

  const currentUser = useQuery(api.users.readUser, {
    userId: user?.id || "",
  });

  const conversations = useQuery(api.chats.getConversation, {
    userId: user?.id || "",
  });

  // Find the active conversation details
  // const activeConversation = conversations?.find(
  //   (conv: any) => conv.id === activeConversationId
  // );

  // Handle conversation selection
  const handleSelectConversation = (conversationId: Id<"conversations">) => {
    setActiveConversationId(conversationId);
    const conv = conversations?.find(c => c.id === conversationId);
    setActiveConversation(conv);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  // Handle back button on mobile
  const handleBack = () => {
    setIsSidebarOpen(true);
  };

  if (!user) return null;

  return (
    <div className="flex h-screen bg-chat-bg overflow-hidden relative">
      {/* Mobile Sidebar Toggle - Only visible when sidebar is closed on mobile */}
      {isMobile && !isSidebarOpen && activeConversationId && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-3 left-3 z-50 md:hidden bg-background/80 backdrop-blur-sm shadow-md"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {/* Sidebar - Responsive */}
      <div
        className={`
          ${isMobile 
            ? `fixed inset-y-0 left-0 z-40 w-80 transform transition-transform duration-300 ease-in-out ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
              }`
            : 'relative w-80 lg:w-96 flex-shrink-0'
          }
          h-full
        `}
      >
        <ChatSidebar
          currentUserId={user.id}
          onSelectConversation={handleSelectConversation}
          activeConversationId={activeConversationId}
          isMobile={isMobile}
          onCloseSidebar={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Mobile Overlay - Only visible when sidebar is open on mobile */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Chat Area - Responsive */}
      <div className={`
        flex-1 flex flex-col min-w-0
        ${isMobile && isSidebarOpen ? 'hidden' : 'flex'}
      `}>
        {activeConversationId && activeConversation ? (
          <>
            <ChatHeader
              conversationId={activeConversationId}
              currentUserId={user.id}
              conversation={activeConversation}
              participantName={activeConversation.name || "Unknown"}
              participantOnline={activeConversation.participantOnline}
              onBack={isMobile ? handleBack : undefined}
              showBackButton={isMobile}
              // onStartChat={(userId) => {
              //   createOrGetConversation({ 
              //     participantUserId: userId, 
              //     currentUserId: user.id 
              //   }).then(id => handleSelectConversation(id));
              // }}
            />
            <ChatMessages
              conversationId={activeConversationId}
              currentUserId={user.id}
            />
            <ChatInput
              conversationId={activeConversationId}
              currentUserId={user.id}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="text-center space-y-4 max-w-md">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto animate-float">
                <span className="text-4xl sm:text-5xl">💬</span>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">Welcome to Chat</h2>
              <p className="text-sm text-muted-foreground px-4">
                {isMobile 
                  ? "Tap the menu icon to select a conversation or start a new one."
                  : "Select a conversation from the sidebar or start a new one to begin messaging."
                }
              </p>
              {isMobile && (
                <Button
                  onClick={() => setIsSidebarOpen(true)}
                  className="mt-4"
                >
                  <Menu className="h-4 w-4 mr-2" />
                  Open Conversations
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}