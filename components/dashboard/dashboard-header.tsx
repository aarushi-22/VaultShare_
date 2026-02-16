"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Bell, User, Settings, LogOut, Files, Home } from "lucide-react"
import { useAuth } from '@/hooks/useAuth'
import { enhancedSignOut } from '@/lib/authEvents'

interface Notification {
  id: string
  type: "access" | "expiry" | "newFile"
  title: string
  message: string
  timestamp: string
  isRead: boolean
  fileName?: string
  userName?: string
  userEmail?: string
  actionUrl?: string
}

export function DashboardHeader() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    const loadNotifications = () => {
      const savedNotifications = localStorage.getItem("vaultshare_notifications")
      if (savedNotifications) {
        const parsedNotifications = JSON.parse(savedNotifications)
        setNotifications(parsedNotifications)
        setUnreadCount(parsedNotifications.filter((n: Notification) => !n.isRead).length)
      }
    }

    // Load on mount
    loadNotifications()

    // Listen for storage changes (when localStorage is updated from other tabs/components)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "vaultshare_notifications") {
        loadNotifications()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  useEffect(() => {
    const handleNotificationsUpdate = (event: CustomEvent) => {
      const updatedNotifications = event.detail.notifications
      setNotifications(updatedNotifications)
      setUnreadCount(updatedNotifications.filter((n: Notification) => !n.isRead).length)
    }

    window.addEventListener("notificationsUpdated", handleNotificationsUpdate as EventListener)
    return () => {
      window.removeEventListener("notificationsUpdated", handleNotificationsUpdate as EventListener)
    }
  }, [])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const savedNotifications = localStorage.getItem("vaultshare_notifications")
        if (savedNotifications) {
          const parsedNotifications = JSON.parse(savedNotifications)
          setNotifications(parsedNotifications)
          setUnreadCount(parsedNotifications.filter((n: Notification) => !n.isRead).length)
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [])

  const handleSignOut = async () => {
    await enhancedSignOut();
    window.location.href = '/';
  }

  const getInitials = (email: string) => {
    return email
      .split('@')[0]
      .split('.')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  if (authLoading) {
    return (
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-muted rounded animate-pulse" />
              <div className="h-6 w-32 bg-muted rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 bg-muted rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">
                Vault<span className="text-primary">Share</span>
              </h1>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                <Home className="w-4 h-4" />
                Dashboard
              </Link>
              <Link
                href="/dashboard/files"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                <Files className="w-4 h-4" />
                My Files
              </Link>
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative" asChild>
              <Link href="/dashboard/notifications">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs min-w-[20px] max-w-[24px] overflow-hidden"
                  >
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user ? getInitials(user.email) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                {user && (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground border-b border-border/50 mb-1">
                    <p className="font-medium text-foreground truncate">{user.email}</p>
                  </div>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/profile" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="flex items-center gap-2 text-destructive cursor-pointer"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}