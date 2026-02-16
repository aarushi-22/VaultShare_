"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Phone, Building, Save, Edit } from "lucide-react"

interface UserProfile {
  name: string
  email: string
  phone: string
  userType: "organization" | "personal"
  joinedDate: string
  lastLogin: string
  username: string
}

const getUserTypeFromEmail = (email: string): "organization" | "personal" => {
  const personalDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "icloud.com", "aol.com"]
  const domain = email.split("@")[1]?.toLowerCase()
  return personalDomains.includes(domain) ? "personal" : "organization"
}

const generateUsername = (name: string, email: string, userType: "organization" | "personal"): string => {
  const cleanName = name.toLowerCase().replace(/\s+/g, "")
  const randomNumbers = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")

  if (userType === "personal") {
    return `${cleanName}${randomNumbers}.vs`
  } else {
    // Extract organization tag from email domain
    const domain = email.split("@")[1]?.toLowerCase()
    const orgTag = domain?.split(".")[0] || "org"
    return `${cleanName}${randomNumbers}.${orgTag}`
  }
}

export function ProfileForm() {
  const mockEmail = "john.doe@techcorp.com" // Change this to test different scenarios
  const mockName = "John Doe"
  const detectedUserType = getUserTypeFromEmail(mockEmail)
  const generatedUsername = generateUsername(mockName, mockEmail, detectedUserType)

  const [profile, setProfile] = useState<UserProfile>({
    name: mockName,
    email: mockEmail,
    phone: "+1 (555) 123-4567",
    userType: detectedUserType,
    joinedDate: "2024-01-15",
    lastLogin: "2024-03-15T10:30:00Z",
    username: generatedUsername,
  })

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [editForm, setEditForm] = useState({
    name: profile.name,
    phone: profile.phone,
  })

  const handleSave = async () => {
    setIsSaving(true)
    setSuccessMessage("")

    try {
      // Mock API call - in real app, this would update the backend
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newUsername = generateUsername(editForm.name, profile.email, profile.userType)

      // Update profile with edited values
      setProfile((prev) => ({
        ...prev,
        name: editForm.name,
        phone: editForm.phone,
        username: newUsername,
      }))

      setIsEditing(false)
      setSuccessMessage("Profile updated successfully!")

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error) {
      console.error("Failed to update profile:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditForm({
      name: profile.name,
      phone: profile.phone,
    })
    setIsEditing(false)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Profile Information
            </CardTitle>
            <CardDescription>View and edit your account details</CardDescription>
          </div>
          {!isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {successMessage && (
          <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
            <AlertDescription className="text-green-700 dark:text-green-300">{successMessage}</AlertDescription>
          </Alert>
        )}

        {/* Profile Avatar & Basic Info */}
        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20">
            <AvatarFallback className="bg-primary text-primary-foreground text-xl">
              {getInitials(profile.name)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold">{profile.name}</h3>
              <Badge variant={profile.userType === "organization" ? "default" : "secondary"}>
                {profile.userType === "organization" ? "Organization" : "Personal"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">@{profile.username}</p>
            <p className="text-sm text-muted-foreground">
              Member since {new Date(profile.joinedDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        <Separator />

        {/* Editable Fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Full Name
            </Label>
            {isEditing ? (
              <Input
                id="name"
                value={editForm.name}
                onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
              />
            ) : (
              <div className="p-3 bg-muted/50 rounded-md">{profile.name}</div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone Number
            </Label>
            {isEditing ? (
              <Input
                id="phone"
                value={editForm.phone}
                onChange={(e) => setEditForm((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="Enter your phone number"
              />
            ) : (
              <div className="p-3 bg-muted/50 rounded-md">{profile.phone}</div>
            )}
          </div>
        </div>

        <Separator />

        {/* Read-only Fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address
            </Label>
            <div className="p-3 bg-muted/30 rounded-md text-muted-foreground">
              {profile.email}
              <p className="text-xs mt-1">Email cannot be changed</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              User Type
            </Label>
            <div className="p-3 bg-muted/30 rounded-md text-muted-foreground">
              <div className="flex items-center gap-2">
                {profile.userType === "organization" ? (
                  <>
                    <Building className="w-4 h-4" />
                    Organization User
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4" />
                    Personal User
                  </>
                )}
              </div>
              <p className="text-xs mt-1">User type cannot be changed</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-primary/90">
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
            <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
