import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Files, Clock, Users, Bell } from "lucide-react"

export function QuickStats() {
  // Mock data - in real app, this would come from API
  const stats = {
    activeFiles: 12,
    notifications: 3,
    totalShares: 45,
    expiringFiles: 2,
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Files</CardTitle>
          <Files className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeFiles}</div>
          <p className="text-xs text-muted-foreground">Files currently shared</p>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Notifications</CardTitle>
          <Bell className="h-4 w-4 text-secondary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.notifications}</div>
          <p className="text-xs text-muted-foreground">Unread notifications</p>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Shares</CardTitle>
          <Users className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalShares}</div>
          <p className="text-xs text-muted-foreground">Files shared to date</p>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
          <Clock className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.expiringFiles}</div>
          <p className="text-xs text-muted-foreground">Files expiring today</p>
        </CardContent>
      </Card>
    </div>
  )
}
