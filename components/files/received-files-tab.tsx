"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, Camera, CameraOff, Users, File, AlertCircle, Loader2 } from "lucide-react"
import axios from "axios"
import { useAuth } from '@/hooks/useAuth'

// Helper to convert UTC to IST
const formatToIST = (input?: string | null) => {
  if (!input) return "N/A"
  const date = new Date(input)
  if (isNaN(date.getTime())) return "N/A"
  const istOffset = 5.5 * 60 // IST is UTC +5:30
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

interface ReceivedFile {
  id: string
  file_name: string
  file_size: string
  sender_name: string
  sender_email: string
  received_date: string | null
  expiry_date: string | null
  status: "active" | "expired"
  screenshots_enabled: boolean
  is_downloaded: boolean
  download_date?: string
  access_logs?: AccessLog[]
}

export function ReceivedFilesTab() {
  const [receivedFiles, setReceivedFiles] = useState<ReceivedFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, loading: authLoading } = useAuth()

  const getUserNameFromEmail = (email: string) => {
    if (!email) return "Unknown"
    const namePart = email.split("@")[0]
    return namePart.split(".").map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(" ")
  }

  const getInitials = (name: string) => name ? name.split(" ").map(n => n[0]).join("").toUpperCase() : "NA"

  useEffect(() => {
    const fetchReceivedFiles = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/getReceivedFiles`, { recipient: user.email })

        const mappedFiles: ReceivedFile[] = (response.data.received_files || []).map((item: any) => {
          const downloadedLog = item.access_logs?.find((log: any) => log.action === "downloaded")
          const receivedAt = item.uploadedAt ? new Date(item.uploadedAt) : null
          const expiresAt = item.expiresAt ? new Date(item.expiresAt) : null

          const currentTime = new Date().getTime()
          const expiryTime = expiresAt ? expiresAt.getTime() : 0
          const isExpired = currentTime > expiryTime

          return {
            id: item.id,
            file_name: item.filename || "Unnamed file",
            file_size: item.file_size || "Unknown size",
            sender_name: getUserNameFromEmail(item.owner),
            sender_email: item.owner,
            received_date: receivedAt && !isNaN(receivedAt.getTime()) ? receivedAt.toISOString() : null,
            expiry_date: expiresAt && !isNaN(expiresAt.getTime()) ? expiresAt.toISOString() : null,
            status: isExpired ? "expired" : "active",
            screenshots_enabled: !!item.screenshots_allowed,
            is_downloaded: !!downloadedLog,
            download_date: downloadedLog?.human_time || null,
            access_logs: item.access_logs || [],
          }
        })

        setReceivedFiles(mappedFiles)
      } catch (err) {
        console.error("Error fetching received files:", err)
        setError("Failed to load received files")
      } finally {
        setLoading(false)
      }
    }

    fetchReceivedFiles()
  }, [user])

  const handleDownload = async (fileId: string) => {
    if (!user) {
      alert("Please sign in to download files")
      return
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/getDownloadUrl`, {
        file_id: fileId,
        user_email: user.email,
        action: "downloaded"
      })

      const { downloadURL } = response.data
      const link = document.createElement("a")
      link.href = downloadURL
      link.download = ""
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setReceivedFiles(prev =>
        prev.map(file => file.id === fileId ? { ...file, is_downloaded: true, download_date: new Date().toISOString() } : file)
      )
    } catch (err: any) {
      console.error("Error downloading file:", err)
      alert(err.response?.data?.error || "Failed to download file")
    }
  }

  const getStatusBadge = (status: ReceivedFile["status"]) =>
    status === "active"
      ? <Badge variant="default" className="bg-green-500 hover:bg-green-600">Active</Badge>
      : <Badge variant="destructive">Expired</Badge>

  if (authLoading) return <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /><span className="ml-2">Checking authentication...</span></div>
  if (!user) return <Card className="border-border/50"><CardContent className="flex flex-col items-center justify-center py-12"><AlertCircle className="w-12 h-12 text-destructive mb-4" /><h3 className="text-lg font-medium mb-2">Authentication required</h3><p className="text-muted-foreground text-center">Please sign in to view your received files</p></CardContent></Card>
  if (loading) return <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /><span className="ml-2">Loading received files...</span></div>
  if (error) return <Card className="border-border/50"><CardContent className="flex flex-col items-center justify-center py-12"><AlertCircle className="w-12 h-12 text-destructive mb-4" /><h3 className="text-lg font-medium mb-2">Error loading files</h3><p className="text-muted-foreground text-center">{error}</p><Button className="mt-4" onClick={() => window.location.reload()}>Try Again</Button></CardContent></Card>

  return (
    <div className="space-y-4">
      {receivedFiles.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <File className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No files received yet</h3>
            <p className="text-muted-foreground text-center">Files shared with you will appear here</p>
          </CardContent>
        </Card>
      ) : receivedFiles.map(file => (
        <Card key={file.id} className="border-border/50">
          <CardHeader className="flex justify-between items-start">
            <div className="flex items-start gap-3">
              <File className="w-8 h-8 text-primary mt-1" />
              <div>
                <CardTitle className="text-lg">{file.file_name}</CardTitle>
                <CardDescription className="flex items-center gap-4 mt-1">
                  <span>{file.file_size} KB</span>
                  <span>•</span>
                  <span>Received {formatToIST(file.received_date)}</span>
                </CardDescription>
              </div>
            </div>
            {getStatusBadge(file.status)}
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-secondary text-secondary-foreground">{getInitials(file.sender_name)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{file.sender_name}</p>
                <p className="text-xs text-muted-foreground">{file.sender_email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/20 rounded-lg">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Expires</p>
                  <p className="text-sm font-medium">{formatToIST(file.expiry_date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {file.screenshots_enabled ? <Camera className="w-4 h-4 text-green-500" /> : <CameraOff className="w-4 h-4 text-red-500" />}
                <div>
                  <p className="text-xs text-muted-foreground">Screenshots</p>
                  <p className="text-sm font-medium">{file.screenshots_enabled ? "Allowed" : "Blocked"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Downloaded</p>
                  <p className="text-sm font-medium">{file.is_downloaded ? "Yes" : "No"}</p>
                </div>
              </div>
            </div>

            {file.status === "active" ? (
              <Button onClick={() => handleDownload(file.id)} className={file.is_downloaded ? "bg-green-500 hover:bg-green-600" : "bg-primary hover:bg-primary/90"}>
                {file.is_downloaded ? "Download Again" : "Download"}
              </Button>
            ) : (
              <Button disabled variant="outline" className="text-muted-foreground cursor-not-allowed">
                Expired
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
