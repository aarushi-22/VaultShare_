"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Eye, Clock, FileText, Filter, CheckCheck } from "lucide-react"

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

interface NotificationFiltersProps {
  activeFilter: string
  onFilterChange: (filter: string) => void
  notifications: Notification[]
}

export function NotificationFilters({ activeFilter, onFilterChange, notifications }: NotificationFiltersProps) {
  const counts = useMemo(() => {
    return {
      all: notifications.length,
      access: notifications.filter((n) => n.type === "access").length,
      expiry: notifications.filter((n) => n.type === "expiry").length,
      newFile: notifications.filter((n) => n.type === "newFile").length,
      unread: notifications.filter((n) => !n.isRead).length,
    }
  }, [notifications])

  const filters = [
    {
      id: "all",
      label: "All Notifications",
      icon: Filter,
      count: counts.all,
    },
    {
      id: "unread",
      label: "Unread",
      icon: CheckCheck,
      count: counts.unread,
    },
    {
      id: "access",
      label: "File Access",
      icon: Eye,
      count: counts.access,
    },
    {
      id: "expiry",
      label: "Expiry Warnings",
      icon: Clock,
      count: counts.expiry,
    },
    {
      id: "newFile",
      label: "New Files",
      icon: FileText,
      count: counts.newFile,
    },
  ]

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Filter className="w-5 h-5 text-primary" />
          Filter Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {filters.map((filter, index) => (
          <div key={filter.id}>
            <Button
              variant={activeFilter === filter.id ? "default" : "ghost"}
              className="w-full justify-start h-auto p-3 overflow-hidden"
              onClick={() => onFilterChange(filter.id)}
            >
              <div className="flex items-center justify-between w-full min-w-0">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <filter.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm text-left truncate">{filter.label}</span>
                </div>
                <Badge
                  variant={activeFilter === filter.id ? "secondary" : "outline"}
                  className="text-xs ml-2 flex-shrink-0 min-w-[28px] h-5 flex items-center justify-center px-2"
                >
                  {filter.count}
                </Badge>
              </div>
            </Button>
            {index < filters.length - 1 && <Separator className="my-1" />}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
