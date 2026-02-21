import { SignUp } from '@clerk/nextjs'
import { MessageSquare, Users, Shield, Zap, Sparkles, Globe, Lock, Smartphone, Rocket } from 'lucide-react'
import Link from 'next/link'

export default function SignUpPage() {
  const stats = [
    { label: 'Active Users', value: '10K+' },
    { label: 'Messages Sent', value: '1M+' },
    { label: 'Countries', value: '50+' },
  ]

  return (
    <div className="min-h-screen bg-chat-bg flex">
      {/* Left Side - Features/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/20 to-primary/5 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/30 rounded-full filter blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
              <span className="text-3xl text-white">💬</span>
            </div>
            <span className="text-3xl font-bold text-foreground">ChatApp</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl font-bold text-foreground mb-6 leading-tight">
            Start your journey<br />with{' '}
            <span className="text-primary relative">
              ChatApp
              <Sparkles className="absolute -top-6 -right-8 h-6 w-6 text-primary animate-pulse" />
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-md">
            Join thousands of users who are already connecting and sharing moments every day.
          </p>

          {/* Stats */}
          <div className="flex gap-8 mb-12">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Feature List */}
          <div className="space-y-4 max-w-md">
            <CheckItem text="Unlimited messages and group chats" />
            <CheckItem text="End-to-end encryption for privacy" />
            <CheckItem text="Cross-platform support" />
            <CheckItem text="Free forever, no hidden fees" />
          </div>
        </div>

        {/* User Avatars */}
        <div className="relative z-10 flex items-center gap-4">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full bg-primary/20 border-2 border-chat-bg flex items-center justify-center"
              >
                <span className="text-primary text-sm font-medium">U{i}</span>
              </div>
            ))}
          </div>
          <p className="text-muted-foreground text-sm">
            Join <span className="text-primary font-medium">10,000+</span> users today
          </p>
        </div>
      </div>

      {/* Right Side - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-transparent">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-4xl text-white">💬</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground">Create Account</h2>
            <p className="text-muted-foreground mt-2">Join our community today</p>
          </div>

          {/* Clerk SignUp Component */}
          <div className="bg-chat-sidebar rounded-2xl border border-border overflow-hidden">
              <SignUp 
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "bg-transparent shadow-none p-0",
                    header: "hidden",
                    socialButtonsBlockButton: "bg-chat-input-bg border-border hover:bg-chat-sidebar-hover text-foreground h-11",
                    socialButtonsBlockButtonText: "text-foreground font-medium",
                    dividerLine: "bg-border",
                    dividerText: "text-muted-foreground",
                    formFieldLabel: "text-foreground text-sm font-medium mb-1.5",
                    formFieldInput: "bg-chat-input-bg border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary h-11",
                    formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-11 shadow-sm",
                    footerAction: "mt-6",
                    footerActionText: "text-muted-foreground",
                    footerActionLink: "text-primary hover:text-primary/80 font-medium",
                    identityPreviewText: "text-foreground",
                    identityPreviewEditButton: "text-primary hover:text-primary/80",
                    alert: "bg-destructive/10 text-destructive border border-destructive/20 rounded-lg",
                    alertText: "text-destructive",
                    alertIcon: "text-destructive",
                  },
                  layout: {
                    socialButtonsPlacement: "top",
                    showOptionalFields: false,
                  },
                  variables: {
                    colorPrimary: 'hsl(172, 66%, 40%)',
                    colorText: 'hsl(220, 20%, 10%)',
                    colorTextSecondary: 'hsl(220, 10%, 50%)',
                    colorBackground: 'hsl(0, 0%, 100%)',
                    colorInputBackground: 'hsl(220, 16%, 97%)',
                    colorInputText: 'hsl(220, 20%, 10%)',
                    borderRadius: '0.5rem',
                  }
                }}
                routing="path"
                path="/sign-up"
                signInUrl="/sign-in"
                redirectUrl="/chat"
              />
          </div>

          {/* Trust Badge */}
          <div className="text-center mt-6">
            <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
              <Lock className="h-3 w-3" />
              Your data is encrypted and secure
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function CheckItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
        <svg className="h-3 w-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <span className="text-foreground/80 text-sm">{text}</span>
    </div>
  )
}