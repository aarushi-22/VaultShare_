"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Bell, Shield, Eye, Mail, Smartphone } from "lucide-react"

interface Settings {
  emailNotifications: boolean
  pushNotifications: boolean
  fileAccessAlerts: boolean
  expiryReminders: boolean
  twoFactorAuth: boolean
  screenshotProtection: boolean
  autoDeleteExpired: boolean
}

const defaultSettings: Settings = {
  emailNotifications: true,
  pushNotifications: true,
  fileAccessAlerts: true,
  expiryReminders: true,
  twoFactorAuth: false,
  screenshotProtection: true,
  autoDeleteExpired: true,
}

export function SettingsForm() {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    const loadSettings = () => {
      const savedSettings = localStorage.getItem("vaultshare_settings")
      if (savedSettings) {
        try {
          const parsedSettings = JSON.parse(savedSettings)
          setSettings(parsedSettings)
        } catch (error) {
          console.error("Failed to parse saved settings:", error)
          setSettings(defaultSettings)
        }
      }
    }

    loadSettings()

    // Listen for storage changes from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "vaultshare_settings") {
        loadSettings()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const handleSettingChange = (key: keyof Settings, value: boolean) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)

    // Save immediately to localStorage
    localStorage.setItem("vaultshare_settings", JSON.stringify(newSettings))

    // Show brief success message
    setSuccessMessage("Setting updated!")
    setTimeout(() => setSuccessMessage(""), 2000)
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSuccessMessage("")

    try {
      // Mock API call - in real app, this would update the backend
      await new Promise((resolve) => setTimeout(resolve, 1000))

      localStorage.setItem("vaultshare_settings", JSON.stringify(settings))
      setSuccessMessage("All settings saved successfully!")

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error) {
      console.error("Failed to save settings:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {successMessage && (
        <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
          <AlertDescription className="text-green-700 dark:text-green-300">{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Notification Settings */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Notification Preferences
          </CardTitle>
          <CardDescription>Choose how you want to be notified about file activity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Notifications
              </Label>
              <p className="text-sm text-muted-foreground">Receive notifications via email</p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(value) => handleSettingChange("emailNotifications", value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                Push Notifications
              </Label>
              <p className="text-sm text-muted-foreground">Receive push notifications in your browser</p>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={(value) => handleSettingChange("pushNotifications", value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>File Access Alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified when someone accesses your files</p>
            </div>
            <Switch
              checked={settings.fileAccessAlerts}
              onCheckedChange={(value) => handleSettingChange("fileAccessAlerts", value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Expiry Reminders</Label>
              <p className="text-sm text-muted-foreground">Receive reminders before files expire</p>
            </div>
            <Switch
              checked={settings.expiryReminders}
              onCheckedChange={(value) => handleSettingChange("expiryReminders", value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-secondary" />
            Security & Privacy
          </CardTitle>
          <CardDescription>Manage your security preferences and privacy settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
            </div>
            <Switch
              checked={settings.twoFactorAuth}
              onCheckedChange={(value) => handleSettingChange("twoFactorAuth", value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Screenshot Protection
              </Label>
              <p className="text-sm text-muted-foreground">Enable screenshot protection by default for new shares</p>
            </div>
            <Switch
              checked={settings.screenshotProtection}
              onCheckedChange={(value) => handleSettingChange("screenshotProtection", value)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-Delete Expired Files</Label>
              <p className="text-sm text-muted-foreground">Automatically delete files after they expire</p>
            </div>
            <Switch
              checked={settings.autoDeleteExpired}
              onCheckedChange={(value) => handleSettingChange("autoDeleteExpired", value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-primary/90">
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Saving...
            </>
          ) : (
            "Save All Settings"
          )}
        </Button>
      </div>
    </div>
  )
}
