"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { NotificationsList } from "@/components/notifications/notifications-list"
import { NotificationFilters } from "@/components/notifications/notification-filters"

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

// Mock notifications - in real app, this would come from API/context
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "access",
    title: "File Accessed",
    message: "Jane Smith accessed your file 'Project_Proposal_2024.pdf'",
    timestamp: "2024-03-15T14:30:00Z",
    isRead: false,
    fileName: "Project_Proposal_2024.pdf",
    userName: "Jane Smith",
    userEmail: "jane.smith@company.com",
    actionUrl: "/dashboard/files",
  },
  {
    id: "2",
    type: "expiry",
    title: "File Expiring Soon",
    message: "Your file 'Meeting_Notes.docx' will expire in 2 hours",
    timestamp: "2024-03-15T12:00:00Z",
    isRead: false,
    fileName: "Meeting_Notes.docx",
    actionUrl: "/dashboard/files",
  },
  {
    id: "3",
    type: "newFile",
    title: "New File Received",
    message: "Alex Rodriguez shared 'Product_Demo.mp4' with you",
    timestamp: "2024-03-15T11:45:00Z",
    isRead: true,
    fileName: "Product_Demo.mp4",
    userName: "Alex Rodriguez",
    userEmail: "alex.rodriguez@company.com",
    actionUrl: "/dashboard/files",
  },
  {
    id: "4",
    type: "access",
    title: "File Downloaded",
    message: "Bob Wilson downloaded your file 'Design_Assets.zip'",
    timestamp: "2024-03-15T10:20:00Z",
    isRead: true,
    fileName: "Design_Assets.zip",
    userName: "Bob Wilson",
    userEmail: "bob.wilson@company.com",
    actionUrl: "/dashboard/files",
  },
  {
    id: "5",
    type: "expiry",
    title: "File Expired",
    message: "Your file 'Contract_Template.docx' has expired and is no longer accessible",
    timestamp: "2024-03-15T09:00:00Z",
    isRead: false,
    fileName: "Contract_Template.docx",
    actionUrl: "/dashboard/files",
  },
  {
    id: "6",
    type: "newFile",
    title: "New File Received",
    message: "Sarah Johnson shared 'Q1_Financial_Report.xlsx' with you",
    timestamp: "2024-03-14T16:30:00Z",
    isRead: true,
    fileName: "Q1_Financial_Report.xlsx",
    userName: "Sarah Johnson",
    userEmail: "sarah.johnson@company.com",
    actionUrl: "/dashboard/files",
  },
]

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    const savedNotifications = localStorage.getItem("vaultshare_notifications")
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications))
    } else {
      setNotifications(mockNotifications)
      localStorage.setItem("vaultshare_notifications", JSON.stringify(mockNotifications))
    }
  }, [])

  const updateNotifications = (updatedNotifications: Notification[]) => {
    setNotifications(updatedNotifications)
    localStorage.setItem("vaultshare_notifications", JSON.stringify(updatedNotifications))
    // Dispatch custom event to update header notification count
    window.dispatchEvent(
      new CustomEvent("notificationsUpdated", {
        detail: { notifications: updatedNotifications },
      }),
    )
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Notifications</h1>
              <p className="text-muted-foreground">Stay updated on file activity, expiry warnings, and new shares</p>
            </div>

            <div className="grid gap-8 lg:grid-cols-4">
              <div className="lg:col-span-1">
                <NotificationFilters
                  activeFilter={activeFilter}
                  onFilterChange={setActiveFilter}
                  notifications={notifications}
                />
              </div>
              <div className="lg:col-span-3">
                <NotificationsList
                  activeFilter={activeFilter}
                  notifications={notifications}
                  onNotificationsUpdate={updateNotifications}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
