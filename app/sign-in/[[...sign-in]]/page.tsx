import { SignIn } from '@clerk/nextjs'
import { MessageSquare, Users, Shield, Zap, Sparkles, Globe, Lock, Smartphone } from 'lucide-react'
import Link from 'next/link'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-chat-bg flex">
      {/* Left Side - Features/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/20 to-primary/5 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/30 rounded-full filter blur-3xl"></div>
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
            Connect with your<br />friends in{' '}
            <span className="text-primary relative">
              real-time
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 8" preserveAspectRatio="none">
                <path d="M0,5 Q25,0 50,5 T100,5" stroke="hsl(172, 66%, 40%)" strokeWidth="2" fill="none" />
              </svg>
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-md">
            Experience seamless communication with our modern chat platform. Secure, fast, and beautiful.
          </p>

          {/* Feature Grid */}
          <div className="grid grid-cols-2 gap-6 max-w-lg">
            <FeatureItem 
              icon={Zap} 
              title="Lightning Fast" 
              description="Real-time message delivery"
            />
            <FeatureItem 
              icon={Shield} 
              title="End-to-End Encrypted" 
              description="Your privacy is our priority"
            />
            <FeatureItem 
              icon={Globe} 
              title="Available Everywhere" 
              description="Web, mobile, and desktop"
            />
            <FeatureItem 
              icon={Smartphone} 
              title="Mobile Friendly" 
              description="Chat on the go"
            />
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative z-10 bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <p className="text-foreground/90 text-lg italic mb-4">
            "The best chat application I've ever used. Simple, elegant, and powerful."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-semibold">JD</span>
            </div>
            <div>
              <p className="text-foreground font-medium">John Doe</p>
              <p className="text-muted-foreground text-sm">Product Designer</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-muted-foreground text-sm">
          © 2024 ChatApp. All rights reserved.
        </p>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo (visible only on mobile) */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-4xl text-white">💬</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground">Welcome Back!</h2>
            <p className="text-muted-foreground mt-2">Sign in to continue chatting</p>
          </div>

          {/* Clerk SignIn Component */}
          <div className="bg-chat-sidebar rounded-2xl border border-border shadow-xl overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-foreground mb-2 lg:block hidden">Welcome Back</h2>
              <p className="text-muted-foreground mb-6 lg:block hidden">Sign in to your account to continue</p>
              
              <SignIn 
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "bg-transparent shadow-none p-0",
                    header: "hidden", // Hide default header
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
                path="/sign-in"
                signUpUrl="/sign-up"
                redirectUrl="/chat"
              />
            </div>
          </div>

          {/* Mobile Footer Links */}
          <div className="lg:hidden text-center mt-6 space-x-4 text-sm">
            <Link href="/terms" className="text-muted-foreground hover:text-primary">
              Terms
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link href="/privacy" className="text-muted-foreground hover:text-primary">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureItem({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div>
        <h3 className="text-foreground font-medium text-sm">{title}</h3>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
    </div>
  )
}