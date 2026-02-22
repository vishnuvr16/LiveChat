import { Button } from "@/components/ui/button";
import { MessageSquare, Users, Shield, Zap, Globe, Smartphone, Sparkles, Lock, Send, Heart, Star, ArrowRight, Github, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const features = [
    {
      icon: Zap,
      title: "Real-time Messaging",
      description: "Lightning fast message delivery with instant updates and typing indicators."
    },
    {
      icon: Shield,
      title: "End-to-End Encrypted",
      description: "Your conversations are private and secure with enterprise-grade encryption."
    },
    {
      icon: Users,
      title: "Group Chats",
      description: "Create groups with up to 500 members. Perfect for teams and communities."
    },
    {
      icon: Globe,
      title: "Cross-Platform",
      description: "Access your chats from anywhere - web, mobile, or desktop."
    },
    {
      icon: Smartphone,
      title: "Mobile Friendly",
      description: "Fully responsive design that works seamlessly on all devices."
    },
    {
      icon: Lock,
      title: "Privacy First",
      description: "We never store your messages. Complete control over your data."
    }
  ];

  const stats = [
    { value: "10K+", label: "Active Users" },
    { value: "1M+", label: "Messages Sent" },
    { value: "50+", label: "Countries" },
    { value: "99.9%", label: "Uptime" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Product Manager",
      content: "Best chat app I've ever used. The real-time features are incredible!",
      avatar: "SJ",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Developer",
      content: "Open source, secure, and beautifully designed. Exactly what we needed.",
      avatar: "MC",
      rating: 5
    },
    {
      name: "Emma Wilson",
      role: "Designer",
      content: "The UI is so clean and intuitive. Love using it every day.",
      avatar: "EW",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-chat-bg">
      {/* Navigation */}
      <nav className="bg-chat-header border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-xl">💬</span>
              </div>
              <span className="text-xl font-bold text-foreground">ChatApp</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-foreground/80 hover:text-primary transition-colors">
                Features
              </Link>
              <Link href="#testimonials" className="text-foreground/80 hover:text-primary transition-colors">
                Testimonials
              </Link>
              <Link href="#pricing" className="text-foreground/80 hover:text-primary transition-colors">
                Pricing
              </Link>
              <Link href="#about" className="text-foreground/80 hover:text-primary transition-colors">
                About
              </Link>
            </div>

            {/* Auth Buttons */}
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
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/30 rounded-full filter blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">The Future of Messaging</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Connect with{' '}
                <span className="text-primary relative">
                  Everyone
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 8" preserveAspectRatio="none">
                    <path d="M0,5 Q25,0 50,5 T100,5" stroke="hsl(172, 66%, 40%)" strokeWidth="3" fill="none" />
                  </svg>
                </span>
                <br />in Real-Time
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
                Experience seamless communication with our modern chat platform. 
                Secure, fast, and beautifully designed for teams and friends alike.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                <Link href="/sign-up">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 w-full sm:w-auto">
                    Start Chatting Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline" className="border-border hover:bg-chat-sidebar-hover w-full sm:w-auto">
                    Learn More
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center lg:text-left">
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Chat Preview */}
            <div className="relative hidden lg:block">
              <div className="bg-chat-sidebar rounded-3xl border border-border shadow-2xl p-4">
                {/* Chat Header */}
                <div className="flex items-center gap-3 pb-4 border-b border-border">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-semibold">JD</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">John Doe</h3>
                    <p className="text-xs text-muted-foreground">Online</p>
                  </div>
                </div>

                {/* Chat Messages */}
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
                      <p className="text-sm text-foreground">It looks amazing! Love the design.</p>
                      <p className="text-[10px] text-muted-foreground text-right mt-1">10:32 AM</p>
                    </div>
                  </div>
                </div>

                {/* Chat Input */}
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

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-chat-sidebar border border-border rounded-lg p-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Shield className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">End-to-End Encrypted</p>
                    <p className="text-[10px] text-muted-foreground">Your messages are safe</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-chat-sidebar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need in a Chat App
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Powerful features that make messaging simple, secure, and enjoyable.
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
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Loved by Users Worldwide
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Don't just take our word for it - hear from our happy users.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-chat-sidebar rounded-2xl border border-border p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground mb-6">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-semibold">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-chat-sidebar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Start for free, upgrade when you need more.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-chat-bg rounded-2xl border border-border p-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">Free</h3>
              <p className="text-muted-foreground mb-6">For casual users</p>
              <div className="text-3xl font-bold text-foreground mb-6">$0</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-foreground">
                  <Heart className="h-4 w-4 text-primary" /> Unlimited messages
                </li>
                <li className="flex items-center gap-2 text-sm text-foreground">
                  <Heart className="h-4 w-4 text-primary" /> 1-on-1 chats
                </li>
                <li className="flex items-center gap-2 text-sm text-foreground">
                  <Heart className="h-4 w-4 text-primary" /> Basic features
                </li>
              </ul>
              <Link href="/sign-up">
                <Button className="w-full bg-primary hover:bg-primary/90">Get Started</Button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-chat-bg rounded-2xl border-2 border-primary p-8 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                Popular
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">Pro</h3>
              <p className="text-muted-foreground mb-6">For power users</p>
              <div className="text-3xl font-bold text-foreground mb-6">$9<span className="text-base font-normal text-muted-foreground">/mo</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-foreground">
                  <Heart className="h-4 w-4 text-primary" /> Everything in Free
                </li>
                <li className="flex items-center gap-2 text-sm text-foreground">
                  <Heart className="h-4 w-4 text-primary" /> Group chats (up to 500)
                </li>
                <li className="flex items-center gap-2 text-sm text-foreground">
                  <Heart className="h-4 w-4 text-primary" /> File sharing
                </li>
                <li className="flex items-center gap-2 text-sm text-foreground">
                  <Heart className="h-4 w-4 text-primary" /> Priority support
                </li>
              </ul>
              <Link href="/sign-up">
                <Button className="w-full bg-primary hover:bg-primary/90">Start Free Trial</Button>
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-chat-bg rounded-2xl border border-border p-8">
              <h3 className="text-2xl font-bold text-foreground mb-2">Enterprise</h3>
              <p className="text-muted-foreground mb-6">For teams</p>
              <div className="text-3xl font-bold text-foreground mb-6">Custom</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-foreground">
                  <Heart className="h-4 w-4 text-primary" /> Everything in Pro
                </li>
                <li className="flex items-center gap-2 text-sm text-foreground">
                  <Heart className="h-4 w-4 text-primary" /> SSO integration
                </li>
                <li className="flex items-center gap-2 text-sm text-foreground">
                  <Heart className="h-4 w-4 text-primary" /> Audit logs
                </li>
                <li className="flex items-center gap-2 text-sm text-foreground">
                  <Heart className="h-4 w-4 text-primary" /> SLA guarantee
                </li>
              </ul>
              <Link href="/contact">
                <Button variant="outline" className="w-full border-border hover:bg-chat-sidebar-hover">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Start Chatting?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of users who are already using ChatApp.
          </p>
          <Link href="/sign-up">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
              Create Free Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-chat-sidebar border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link href="#features" className="text-muted-foreground hover:text-primary text-sm">Features</Link></li>
                <li><Link href="#pricing" className="text-muted-foreground hover:text-primary text-sm">Pricing</Link></li>
                <li><Link href="/download" className="text-muted-foreground hover:text-primary text-sm">Download</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-muted-foreground hover:text-primary text-sm">About</Link></li>
                <li><Link href="/blog" className="text-muted-foreground hover:text-primary text-sm">Blog</Link></li>
                <li><Link href="/careers" className="text-muted-foreground hover:text-primary text-sm">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link href="/help" className="text-muted-foreground hover:text-primary text-sm">Help Center</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-primary text-sm">Contact</Link></li>
                <li><Link href="/status" className="text-muted-foreground hover:text-primary text-sm">Status</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-muted-foreground hover:text-primary text-sm">Privacy</Link></li>
                <li><Link href="/terms" className="text-muted-foreground hover:text-primary text-sm">Terms</Link></li>
                <li><Link href="/security" className="text-muted-foreground hover:text-primary text-sm">Security</Link></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                <span className="text-white text-xs">💬</span>
              </div>
              <span className="text-sm text-foreground">© 2024 ChatApp. All rights reserved.</span>
            </div>
            <div className="flex space-x-4">
              <Link href="https://github.com" className="text-muted-foreground hover:text-primary">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="https://twitter.com" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="https://linkedin.com" className="text-muted-foreground hover:text-primary">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}