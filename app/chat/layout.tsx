"use client";

import { ConvexProvider, ConvexReactClient, useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";
import CoolLoader from "@/components/CoolLoader"

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function ChatLayout({children} : {
  children: React.ReactNode;
}) {
  const { isLoaded, isSignedIn, user } = useUser();
  const updatePresence = useMutation(api.users.updatePresence);

  useEffect(() => {
    if (isSignedIn && user) {
      // Update user presence when component mounts
      updatePresence({
        userId: user.id,
        status: "online",
        deviceInfo: navigator.userAgent,
      });

      // Cleanup when component unmounts
      return () => {
        updatePresence({
          userId: user.id,
          status: "offline",
        });
      };
    }
  }, [isSignedIn, user, updatePresence]);

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <CoolLoader />
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Please sign in to continue</h1>
          <a href="/sign-in" className="text-primary hover:underline">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <ConvexProvider client={convex}>
      {children}
    </ConvexProvider>
  );
}