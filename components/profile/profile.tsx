"use client"
import { Button } from "@/components/ui/button"
import { api } from "@/convex/_generated/api"
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react"
import { ArrowLeft, Camera, Edit2, Check, X, User, Mail, Info, AtSign, Phone, MapPin, Calendar, Globe, Github, Twitter, Linkedin } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { fetchMutation } from "convex/nextjs"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"

interface ProfileFormData {
  name: string;
  username: string;
  bio: string;
  phone: string;
  github: string;
  twitter: string;
  linkedin: string;
}

export default function ProfileComponent({ preloadedUserInfo }: {
  preloadedUserInfo: Preloaded<typeof api.users.readUser>
}) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [activeTab, setActiveTab] = useState<"profile" | "privacy" | "about">("profile")
  const userInfo = usePreloadedQuery(preloadedUserInfo)
  const updateUserMutation = useMutation(api.users.updateName)
  const updateProfileMutation = useMutation(api.users.updateProfile)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch
  } = useForm({
    defaultValues: {
      name: userInfo?.name || "",
      username: userInfo?.name || "",
      bio: userInfo?.bio || "",
      phone: userInfo?.phone || "",
      // location: userInfo?.location || "",
      // website: userInfo?.website || "",
      github: userInfo?.github || "",
      twitter: userInfo?.twitter || "",
      linkedin: userInfo?.linkedin || "",
      // birthday: userInfo?.birthday || "",
      // showLastSeen: userInfo?.showLastSeen ?? true,
    }
  })

  const onSubmit = async (data: ProfileFormData) => {
    try {
      if (userInfo?.userId) {
        await updateProfileMutation({
          userId: userInfo.userId,
          ...data,
        })

        setIsEditing(false)
        reset(data)
        router.refresh()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    reset()
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const postUrl = await fetchMutation(api.chats.generateUploadUrl)
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file
      })

      if (!result.ok) {
        throw new Error(`Upload failed: ${result.statusText}`)
      }

      const { storageId } = await result.json()
      const url = await fetchMutation(api.chats.getUploadUrl, { storageId })

      if (url && userInfo?.userId) {
        await fetchMutation(api.users.updateProfileImage, {
          userId: userInfo.userId,
          profileImage: url
        })
      }
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const watchedName = watch("name")

  return (
    <div className="flex flex-col h-full bg-chat-bg">
      {/* Header */}
      <header className="bg-chat-header border-b border-border px-4 py-3 flex items-center sticky top-0 z-10">
        <Link href="/chat">
          <Button variant="ghost" size="icon" className="mr-2 hover:bg-chat-sidebar-hover">
            <ArrowLeft className="h-5 w-5 text-primary" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold text-foreground flex-1">Profile</h1>
        {!isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="text-primary hover:text-primary/80 hover:bg-chat-sidebar-hover"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
      </header>

      {/* Profile Header Image */}
      <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/5 relative">
        
      </div>

      {/* Avatar Section */}
      <div className="px-4 pb-4">
        <div className="relative -mt-16 mb-4 flex items-end justify-between">
          <div className="relative group">
            <Avatar className="h-24 w-24 border-4 border-chat-bg ring-2 ring-primary/20">
              <AvatarImage src={userInfo?.profileImage} alt={userInfo?.name || ""} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg">
                {userInfo?.name ? getInitials(userInfo.name) : "U"}
              </AvatarFallback>
            </Avatar>
            <label
              htmlFor="profile-image"
              className={`
                absolute bottom-0 right-0 bg-primary rounded-full p-2 
                cursor-pointer transition-all duration-200
                ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90 hover:scale-110'}
                shadow-lg border-2 border-chat-bg
              `}
            >
              {isUploading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Camera className="w-4 h-4 text-white" />
              )}
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                disabled={isUploading}
              />
            </label>
          </div>
          
          {!isEditing && (
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                Online
              </Badge>
            </div>
          )}
        </div>

        {/* Name and Basic Info */}
        {!isEditing ? (
          <div className="space-y-1 mb-4">
            <h2 className="text-2xl font-bold text-foreground">{userInfo?.name}</h2>
            {userInfo?.username && (
              <p className="text-muted-foreground flex items-center gap-2">
                <AtSign className="h-4 w-4" />
                {userInfo.username}
              </p>
            )}
            {userInfo?.bio && (
              <p className="text-foreground/80 mt-2 text-sm leading-relaxed">{userInfo.bio}</p>
            )}
          </div>
        ) : null}

        {/* Tabs */}
        <div className="flex gap-1 mb-4 border-b border-border">
          {(["profile", "about"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-4 py-2 text-sm font-medium capitalize transition-all relative
                ${activeTab === tab 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "profile" && (
              <div className="space-y-4">
                {/* Profile Fields */}
                <Card className="bg-chat-sidebar border-border">
                  <CardContent className="p-4 space-y-4">
                    {isEditing ? (
                      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                          <Label htmlFor="name" className="text-muted-foreground">Display Name</Label>
                          <Input
                            {...register("name", { required: "Name is required" })}
                            className="bg-chat-input-bg border-border focus-visible:ring-primary"
                            placeholder="Enter your name"
                          />
                          {errors.name && (
                            <p className="text-destructive text-xs mt-1">{errors.name.message}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="username" className="text-muted-foreground">Username</Label>
                          <div className="flex items-center">
                            <span className="text-muted-foreground bg-chat-input-bg px-3 py-2 border border-r-0 border-border rounded-l-md">@</span>
                            <Input
                              {...register("username")}
                              className="bg-chat-input-bg border-border rounded-l-none focus-visible:ring-primary"
                              placeholder="username"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="bio" className="text-muted-foreground">Bio</Label>
                          <Textarea
                            {...register("bio")}
                            className="bg-chat-input-bg border-border focus-visible:ring-primary"
                            placeholder="Tell something about yourself"
                            rows={3}
                          />
                        </div>

                        <div>
                          <Label htmlFor="phone" className="text-muted-foreground">Phone</Label>
                          <Input
                            {...register("phone")}
                            className="bg-chat-input-bg border-border focus-visible:ring-primary"
                            placeholder="+1 234 567 890"
                          />
                        </div>

                        <div className="pt-4 flex gap-2">
                          <Button
                            type="submit"
                            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                            disabled={!isDirty}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Save Changes
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            className="flex-1 border-border hover:bg-chat-sidebar-hover"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <>
                        {/* Display Profile Info */}
                        {userInfo?.name && (
                          <InfoRow icon={AtSign} label="Username" value={`@${userInfo.username}`} />
                        )}
                        {userInfo?.bio && (
                          <InfoRow icon={Info} label="Bio" value={userInfo.bio} multiline />
                        )}
                        {userInfo?.phone && (
                          <InfoRow icon={Phone} label="Phone" value={userInfo.phone} />
                        )}
                        {/* {userInfo?.location && (
                          <InfoRow icon={MapPin} label="Location" value={userInfo.location} />
                        )} */}
                        {/* {userInfo?.birthday && (
                          <InfoRow icon={Calendar} label="Birthday" value={new Date(userInfo.birthday).toLocaleDateString()} />
                        )} */}
                        {/* {userInfo?.website && (
                          <InfoRow icon={Globe} label="Website" value={userInfo.website} link />
                        )} */}
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Social Links */}
                {!isEditing && (userInfo?.github || userInfo?.twitter || userInfo?.linkedin) && (
                  <Card className="bg-chat-sidebar border-border">
                    <CardContent className="p-4">
                      <h3 className="text-sm font-medium text-muted-foreground mb-3">Social Links</h3>
                      <div className="space-y-3">
                        {userInfo?.github && (
                          <SocialLink icon={Github} username={userInfo.github} platform="GitHub" />
                        )}
                        {userInfo?.twitter && (
                          <SocialLink icon={Twitter} username={userInfo.twitter} platform="Twitter" />
                        )}
                        {userInfo?.linkedin && (
                          <SocialLink icon={Linkedin} username={userInfo.linkedin} platform="LinkedIn" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeTab === "about" && (
              <Card className="bg-chat-sidebar border-border">
                <CardContent className="p-4 space-y-4">
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="text-foreground flex items-center gap-2 mt-1">
                      <Mail className="h-4 w-4 text-primary" />
                      {userInfo?.email}
                    </p>
                  </div>
                  <Separator className="bg-border" />
                  <div>
                    <Label className="text-muted-foreground">Member Since</Label>
                    <p className="text-foreground mt-1">
                      {new Date(userInfo?._creationTime || Date.now()).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <Separator className="bg-border" />
                  <div>
                    <Label className="text-muted-foreground">Account ID</Label>
                    <p className="text-xs text-muted-foreground mt-1 font-mono">
                      {userInfo?.userId}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

// Helper Components
function InfoRow({ icon: Icon, label, value, multiline = false, link = false }: any) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 text-primary mt-0.5" />
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        {link ? (
          <a 
            href={value.startsWith('http') ? value : `https://${value}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline"
          >
            {value}
          </a>
        ) : multiline ? (
          <p className="text-sm text-foreground whitespace-pre-wrap">{value}</p>
        ) : (
          <p className="text-sm text-foreground">{value}</p>
        )}
      </div>
    </div>
  )
}

function SocialLink({ icon: Icon, username, platform }: any) {
  return (
    <a
      href={`https://${platform.toLowerCase()}.com/${username}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-2 rounded-lg hover:bg-chat-sidebar-hover transition-colors"
    >
      <Icon className="h-4 w-4 text-primary" />
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">{platform}</p>
        <p className="text-sm text-foreground">@{username}</p>
      </div>
    </a>
  )
}