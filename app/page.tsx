import { Button } from "@/components/ui/button";
import { MessageSquare, Users, Zap, Smile,Send, Bell, Eye, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const features = [
    {
      icon: Zap,
      title: "Real-time Messaging",
      description: "Messages appear instantly with no refresh needed."
    },
    {
      icon: Smile,
      title: "Emoji Reactions",
      description: "React to messages with 👍, ❤️, 😄 and more."
    },
    {
      icon: Eye,
      title: "Typing Indicators",
      description: "See when someone is typing a response."
    },
    {
      icon: Bell,
      title: "Unread Counts",
      description: "Know which conversations have new messages."
    },
    {
      icon: Users,
      title: "1-on-1 Chats",
      description: "Private conversations between two users."
    },
    {
      icon: MessageSquare,
      title: "Message History",
      description: "Scroll back to see past conversations."
    }
  ];

  return (
    <div className="min-h-screen bg-chat-bg">
      {/* Navigation */}
      <nav className="bg-chat-header border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-xl">💬</span>
              </div>
              <span className="text-xl font-bold text-foreground">LiveChat</span>
            </Link>

            <div className="flex items-center space-x-3">
              <Link href="/sign-in">
                <Button variant="ghost" className="text-foreground hover:bg-chat-sidebar-hover">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/30 rounded-full filter blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">Assignment Project</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Real-Time{' '}
                <span className="text-primary relative">
                  Chat
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 8" preserveAspectRatio="none">
                    <path d="M0,5 Q25,0 50,5 T100,5" stroke="hsl(172, 66%, 40%)" strokeWidth="3" fill="none" />
                  </svg>
                </span>
                <br />Application
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
                A feature-rich chat app built with Next.js, Convex, and Clerk. 
                Includes real-time messaging, emoji reactions, typing indicators, and unread message counts.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                <Link href="/sign-up">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 w-full sm:w-auto">
                    Try It Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline" className="border-border hover:bg-chat-sidebar-hover w-full sm:w-auto">
                    View Features
                  </Button>
                </Link>
              </div>

              {/* Tech Stack Pills - Honest instead of fake stats */}
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">Next.js 15</span>
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">Convex</span>
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">Clerk Auth</span>
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">Tailwind CSS</span>
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">TypeScript</span>
              </div>
            </div>

            {/* Right Column - Chat Preview (keep this) */}
            <div className="relative hidden lg:block">
              <div className="bg-chat-sidebar rounded-3xl border border-border shadow-2xl p-4">
                <div className="flex items-center gap-3 pb-4 border-b border-border">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-semibold">JD</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">John Doe</h3>
                    <p className="text-xs text-muted-foreground">Online</p>
                  </div>
                </div>

                <div className="space-y-4 py-4">
                  <div className="flex justify-start">
                    <div className="bg-chat-bubble-received rounded-2xl rounded-bl-md px-4 py-2 max-w-[80%]">
                      <p className="text-sm text-foreground">Hey! How's it going?</p>
                      <p className="text-[10px] text-muted-foreground text-right mt-1">10:30 AM</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-primary rounded-2xl rounded-br-md px-4 py-2 max-w-[80%]">
                      <p className="text-sm text-white">Pretty good! Just checking out this new chat app 🚀</p>
                      <p className="text-[10px] text-white/60 text-right mt-1">10:31 AM</p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-chat-bubble-received rounded-2xl rounded-bl-md px-4 py-2 max-w-[80%]">
                      <p className="text-sm text-foreground">The reactions feature is really cool!</p>
                      <p className="text-[10px] text-muted-foreground text-right mt-1">10:32 AM</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="bg-chat-input-bg rounded-full px-4 py-2 flex items-center">
                    <input 
                      type="text" 
                      placeholder="Type a message..." 
                      className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-sm"
                      disabled
                    />
                    <Send className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Now Honest */}
      <section id="features" className="py-20 bg-chat-sidebar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Features I Built
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Here's what this chat application actually does.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-chat-bg rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Honest Note */}
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground">
              Built with Next.js, Convex, and Clerk. Complete with real-time updates and a polished UI.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}