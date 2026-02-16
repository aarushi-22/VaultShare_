"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { File, Users, Eye, Calendar, Camera, CameraOff, AlertCircle, CheckCircle, XCircle, Loader2 } from "lucide-react"
import axios from "axios"
import { useAuth } from '@/hooks/useAuth'

// Helper to convert UTC timestamp to IST
const formatToIST = (input: string | number) => {
  let date: Date
  if (typeof input === "number") {
    date = new Date(input * 1000)
  } else {
    date = new Date(input)
  }
  const istOffset = 5.5 * 60 // minutes
  const istDate = new Date(date.getTime() + istOffset * 60 * 1000)
  return istDate.toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

interface AccessLog {
  user_email: string
  action: string
  timestamp: number
  human_time: string
}

interface SentFile {
  file_id: string
  file_name: string
  file_size: string
  uploaded_at: string
  expires_at: string
  status: string
  screenshots_allowed: boolean
  recipients_count: number
  recipients: string[]
  access_logs: AccessLog[]
}

export function SentFilesTab() {
  const [sentFiles, setSentFiles] = useState<SentFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    const fetchSentFiles = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/getSentFiles`, {
          owner_email: user.email
        }, {
          headers: { 'Content-Type': 'application/json' }
        })
        setSentFiles(response.data.sent_files || [])
      } catch (err: any) {
        console.error("Error fetching sent files:", err)
        if (err.response?.status === 400) {
          if (err.response.data?.error === "owner_email required") {
            setError("Authentication error: Please sign in again")
          } else {
            setError(`API Error: ${err.response.data?.error || "Bad request"}`)
          }
        } else {
          setError("Failed to load sent files. Please try again.")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchSentFiles()
  }, [user])

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "expired":
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-orange-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-500 hover:bg-green-600">
            Active
          </Badge>
        )
      case "expired":
        return <Badge variant="destructive">Expired</Badge>
      default:
        return (
          <Badge variant="secondary" className="bg-orange-500 hover:bg-orange-600">
            {status}
          </Badge>
        )
    }
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

  const getUserNameFromEmail = (email: string) => {
    const namePart = email.split('@')[0];
    return namePart
      .split('.')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Checking authentication...</span>
      </div>
    )
  }

  if (!user) {
    return (
      <Card className="border-border/50">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-12 h-12 text-destructive mb-4" />
          <h3 className="text-lg font-medium mb-2">Authentication required</h3>
          <p className="text-muted-foreground text-center">Please sign in to view your sent files</p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Loading sent files...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-border/50">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-12 h-12 text-destructive mb-4" />
          <h3 className="text-lg font-medium mb-2">Error loading files</h3>
          <p className="text-muted-foreground text-center">{error}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {sentFiles.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <File className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No files sent yet</h3>
            <p className="text-muted-foreground text-center">
              Files you share will appear here with access controls and logs
            </p>
          </CardContent>
        </Card>
      ) : (
        sentFiles.map((file) => (
          <Card key={file.file_id} className="border-border/50">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <File className="w-8 h-8 text-primary mt-1" />
                  <div>
                    <CardTitle className="text-lg">{file.file_name}</CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-1">
                      <span>{file.file_size} KB</span>
                      <span>•</span>
                      <span>Uploaded {formatToIST(file.uploaded_at)}</span>
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(file.status)}
                  {getStatusBadge(file.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Expires</p>
                    <p className="text-sm font-medium">{formatToIST(file.expires_at)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Recipients</p>
                    <p className="text-sm font-medium">{file.recipients_count}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {file.screenshots_allowed ? (
                    <Camera className="w-4 h-4 text-green-500" />
                  ) : (
                    <CameraOff className="w-4 h-4 text-red-500" />
                  )}
                  <div>
                    <p className="text-xs text-muted-foreground">Screenshots</p>
                    <p className="text-sm font-medium">{file.screenshots_allowed ? "Allowed" : "Blocked"}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Recipients ({file.recipients_count})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {file.recipients.map((email) => (
                    <Badge key={email} variant="outline" className="text-xs">
                      {email}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Access Activity ({file.access_logs?.length || 0})
                </h4>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Access Log - {file.file_name}</DialogTitle>
                      <DialogDescription>Detailed access history for this file</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">File Size:</span>
                            <span className="ml-2 font-medium">{file.file_size}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Status:</span>
                            <span className="ml-2">{getStatusBadge(file.status)}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Uploaded:</span>
                            <span className="ml-2 font-medium">{formatToIST(file.uploaded_at)}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Expires:</span>
                            <span className="ml-2 font-medium">{formatToIST(file.expires_at)}</span>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h4 className="font-medium mb-3">Access History</h4>
                        {!file.access_logs || file.access_logs.length === 0 ? (
                          <p className="text-muted-foreground text-center py-8">No access activity yet</p>
                        ) : (
                          <ScrollArea className="h-64">
                            <div className="space-y-3">
                              {file.access_logs.map((log, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                                  <Avatar className="w-8 h-8">
                                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                      {getInitials(log.user_email)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium text-sm">{getUserNameFromEmail(log.user_email)}</span>
                                      <Badge
                                        variant={log.action === "downloaded" ? "default" : "secondary"}
                                        className="text-xs"
                                      >
                                        {log.action}
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{log.user_email}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-xs text-muted-foreground">{formatToIST(log.human_time)}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {file.access_logs && file.access_logs.length > 0 && (
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Last accessed by {getUserNameFromEmail(file.access_logs[0].user_email)}</span>
                  <span>•</span>
                  <span>{formatToIST(file.access_logs[0].human_time)}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
