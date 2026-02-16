import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Files, Upload, Download, Clock, Shield, Activity } from "lucide-react"

export function ProfileStats() {
  // Mock stats data - in real app, this would come from API
  const stats = {
    totalFilesShared: 45,
    totalFilesReceived: 23,
    activeShares: 12,
    storageUsed: "2.4 GB",
    storageLimit: "10 GB",
    lastActivity: "2 hours ago",
    accountStatus: "active" as const,
  }

  const storagePercentage = (2.4 / 10) * 100

  return (
    <div className="space-y-6">
      {/* Account Status */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="w-5 h-5 text-primary" />
            Account Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge variant="default" className="bg-green-500 hover:bg-green-600">
              {stats.accountStatus.charAt(0).toUpperCase() + stats.accountStatus.slice(1)}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Last Activity</span>
            <span className="text-sm font-medium">{stats.lastActivity}</span>
          </div>
        </CardContent>
      </Card>

      {/* File Statistics */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity className="w-5 h-5 text-secondary" />
            Activity Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-primary/5 rounded-lg">
              <Upload className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-primary">{stats.totalFilesShared}</div>
              <div className="text-xs text-muted-foreground">Files Shared</div>
            </div>
            <div className="text-center p-3 bg-secondary/5 rounded-lg">
              <Download className="w-6 h-6 text-secondary mx-auto mb-2" />
              <div className="text-2xl font-bold text-secondary">{stats.totalFilesReceived}</div>
              <div className="text-xs text-muted-foreground">Files Received</div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <Files className="w-4 h-4" />
              Active Shares
            </span>
            <span className="text-sm font-medium">{stats.activeShares}</span>
          </div>
        </CardContent>
      </Card>

      {/* Storage Usage */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="w-5 h-5 text-primary" />
            Storage Usage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Used</span>
              <span className="font-medium">
                {stats.storageUsed} of {stats.storageLimit}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${storagePercentage}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground text-center">
              {Math.round(storagePercentage)}% of storage used
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
