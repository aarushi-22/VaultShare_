"use client"

import { useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Eye, Clock, FileText, MoreHorizontal, Check, Trash2, ExternalLink } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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

interface NotificationsListProps {
  activeFilter: string
  notifications: Notification[]
  onNotificationsUpdate: (notifications: Notification[]) => void
}

export function NotificationsList({ activeFilter, notifications, onNotificationsUpdate }: NotificationsListProps) {
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "access":
        return <Eye className="w-5 h-5 text-primary" />
      case "expiry":
        return <Clock className="w-5 h-5 text-orange-500" />
      case "newFile":
        return <FileText className="w-5 h-5 text-secondary" />
    }
  }

  const getNotificationBadge = (type: Notification["type"]) => {
    switch (type) {
      case "access":
        return (
          <Badge variant="outline" className="text-xs border-primary text-primary">
            Access
          </Badge>
        )
      case "expiry":
        return (
          <Badge variant="outline" className="text-xs border-orange-500 text-orange-500">
            Expiry
          </Badge>
        )
      case "newFile":
        return (
          <Badge variant="outline" className="text-xs border-secondary text-secondary">
            New File
          </Badge>
        )
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60)
      return `${diffInMinutes} minutes ago`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif))
    onNotificationsUpdate(updatedNotifications)
  }

  const deleteNotification = (id: string) => {
    const updatedNotifications = notifications.filter((notif) => notif.id !== id)
    onNotificationsUpdate(updatedNotifications)
  }

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map((notif) => ({ ...notif, isRead: true }))
    onNotificationsUpdate(updatedNotifications)
  }

  const handleViewDetails = (notification: Notification) => {
    setSelectedNotification(notification)
    setIsDetailsOpen(true)

    // Mark as read if it's unread
    if (!notification.isRead) {
      markAsRead(notification.id)
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const filteredNotifications = useMemo(() => {
    switch (activeFilter) {
      case "unread":
        return notifications.filter((n) => !n.isRead)
      case "access":
        return notifications.filter((n) => n.type === "access")
      case "expiry":
        return notifications.filter((n) => n.type === "expiry")
      case "newFile":
        return notifications.filter((n) => n.type === "newFile")
      case "all":
      default:
        return notifications
    }
  }, [notifications, activeFilter])

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {unreadCount} unread
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <Check className="w-4 h-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <Card className="border-border/50">
        <CardContent className="p-0">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FileText className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No notifications</h3>
              <p className="text-muted-foreground text-center">
                {activeFilter === "all"
                  ? "You're all caught up! New notifications will appear here."
                  : `No ${activeFilter} notifications found.`}
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[600px]">
              <div className="divide-y divide-border">
                {filteredNotifications.map((notification, index) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-muted/30 transition-colors ${
                      !notification.isRead ? "bg-primary/5 border-l-4 border-l-primary" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className="mt-1">{getNotificationIcon(notification.type)}</div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4
                                className={`text-sm font-medium ${!notification.isRead ? "text-foreground" : "text-muted-foreground"}`}
                              >
                                {notification.title}
                              </h4>
                              {getNotificationBadge(notification.type)}
                              {!notification.isRead && <div className="w-2 h-2 bg-primary rounded-full" />}
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>

                            {/* User info for access/newFile notifications */}
                            {(notification.type === "access" || notification.type === "newFile") &&
                              notification.userName && (
                                <div className="flex items-center gap-2 mb-2">
                                  <Avatar className="w-6 h-6">
                                    <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                                      {getInitials(notification.userName)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-xs text-muted-foreground">{notification.userEmail}</span>
                                </div>
                              )}

                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                {formatTimestamp(notification.timestamp)}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 text-xs"
                                onClick={() => handleViewDetails(notification)}
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                View Details
                              </Button>
                            </div>
                          </div>

                          {/* Actions */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {!notification.isRead && (
                                <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                  <Check className="w-4 h-4 mr-2" />
                                  Mark as read
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem
                                onClick={() => deleteNotification(notification.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedNotification && getNotificationIcon(selectedNotification.type)}
              {selectedNotification?.title}
            </DialogTitle>
            <DialogDescription>
              {selectedNotification && formatTimestamp(selectedNotification.timestamp)}
            </DialogDescription>
          </DialogHeader>

          {selectedNotification && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Details</h4>
                <p className="text-sm text-muted-foreground">{selectedNotification.message}</p>
              </div>

              {selectedNotification.fileName && (
                <div>
                  <h4 className="font-medium mb-2">File</h4>
                  <p className="text-sm text-muted-foreground">{selectedNotification.fileName}</p>
                </div>
              )}

              {selectedNotification.userName && (
                <div>
                  <h4 className="font-medium mb-2">User</h4>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                        {getInitials(selectedNotification.userName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{selectedNotification.userName}</p>
                      <p className="text-xs text-muted-foreground">{selectedNotification.userEmail}</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedNotification.actionUrl && (
                <div className="pt-4">
                  <Button
                    className="w-full"
                    onClick={() => {
                      window.location.href = selectedNotification.actionUrl!
                      setIsDetailsOpen(false)
                    }}
                  >
                    Go to File
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
