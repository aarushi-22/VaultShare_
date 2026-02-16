"use client"

import React, { useState, useCallback, useEffect } from "react"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, X, Users, Calendar, Camera, Send, CameraOff } from "lucide-react"
import { useAuth } from '@/hooks/useAuth'

interface SelectedFile {
  file: File
  id: string
  uploadUrl?: string
  downloadUrl?: string
}

export function FileUploadCard() {
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([])
  const [recipients, setRecipients] = useState<string[]>([])
  const [recipientInput, setRecipientInput] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [expiryTime, setExpiryTime] = useState("")
  const [screenshotsEnabled, setScreenshotsEnabled] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const { user, loading: authLoading } = useAuth()

  const userSuggestions = ["john.doe@company.xyv", "jane.smith@company.xyv", "alice@personal.com", "bob@personal.com"]

  // Set default expiry (24 hours from now)
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setExpiryDate(tomorrow.toISOString().split('T')[0]);
    setExpiryTime('23:59');
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true)
    else if (e.type === "dragleave") setDragActive(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files)
      const newFiles = files.map((file) => ({
        file,
        id: Math.random().toString(36).substr(2, 9),
      }))
      setSelectedFiles((prev) => [...prev, ...newFiles])
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      const newFiles = files.map((file) => ({
        file,
        id: Math.random().toString(36).substr(2, 9),
      }))
      setSelectedFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (id: string) => setSelectedFiles((prev) => prev.filter((f) => f.id !== id))
  const addRecipient = (email: string) => {
    if (email && !recipients.includes(email)) {
      setRecipients((prev) => [...prev, email])
      setRecipientInput("")
    }
  }
  const removeRecipient = (email: string) => setRecipients((prev) => prev.filter((r) => r !== email))
  const handleRecipientKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addRecipient(recipientInput.trim())
    }
  }

  const handleSendFile = async () => {
    if (selectedFiles.length === 0 || recipients.length === 0 || !user) return

    setIsUploading(true)
    try {
      let successfulUploads = 0;
      let failedUploads = 0;

      for (const fileObj of selectedFiles) {
        // Convert local date+time to UTC epoch seconds (with fallback to 24 hours)
        const expiryDateTime = expiryDate && expiryTime
          ? Date.UTC(
              parseInt(expiryDate.split("-")[0]),
              parseInt(expiryDate.split("-")[1]) - 1,
              parseInt(expiryDate.split("-")[2]),
              parseInt(expiryTime.split(":")[0]),
              parseInt(expiryTime.split(":")[1]),
              0
            )
          : Date.now() + 24 * 60 * 60 * 1000 // Default 24 hours
        const expiryTimestamp = Math.floor(expiryDateTime / 1000)

        try {
          // 1. Get upload URL and store metadata - THIS WILL NOW VALIDATE RECIPIENTS
          const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/getUploadUrl`, {
            fileName: fileObj.file.name,
            contentType: fileObj.file.type,
            owner_email: user.email,
            owner_name: user.username || user.email.split('@')[0],
            owner_id: user.username || user.email, // Use username or email as fallback for userId
            recipients, // Send all recipients for validation
            expiry_timestamp: expiryTimestamp,
            file_size: fileObj.file.size,
            screenshots_allowed: screenshotsEnabled
          });

          const { uploadURL, file_id, invalidRecipients } = response.data;

          // Check if any recipients were invalid
          if (invalidRecipients && invalidRecipients.length > 0) {
            alert(`The following recipients are not registered users: ${invalidRecipients.join(', ')}\n\nFile "${fileObj.file.name}" not sent.`);
            failedUploads++;
            continue; // Skip this file
          }

          // 2. Upload file to S3 only if recipients are valid
          await fetch(uploadURL, {
            method: "PUT",
            headers: { "Content-Type": fileObj.file.type },
            body: fileObj.file,
          })

          console.log("Uploaded:", fileObj.file.name, "File ID:", file_id);
          successfulUploads++;
          
        } catch (error: any) {
          console.error("Error uploading file:", error);
          
          if (error.response?.data?.error === 'INVALID_RECIPIENTS') {
            const invalidRecipients = error.response.data.invalidRecipients || [];
            alert(`Invalid recipients found: ${invalidRecipients.join(', ')}\n\nFile "${fileObj.file.name}" not sent.`);
          } else {
            alert(`Failed to upload "${fileObj.file.name}". Please try again.`);
          }
          failedUploads++;
        }
      }

      // Show summary alert
      if (successfulUploads > 0) {
        if (failedUploads > 0) {
          alert(`${successfulUploads} file(s) sent successfully! ${failedUploads} file(s) failed due to invalid recipients.`);
        } else {
          alert("All files sent successfully!");
        }
        
        // Reset form only if some files were successful
        setSelectedFiles([]);
        setRecipients([]);
        setRecipientInput("");
        setScreenshotsEnabled(true);
      } else {
        alert("No files were sent. Please check recipient emails and try again.");
      }

    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to send files. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  if (authLoading) {
    return (
      <Card className="border-border/50">
        <CardContent className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-2" />
          <span>Loading...</span>
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return (
      <Card className="border-border/50">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertDescription className="text-center">
            Please sign in to upload and share files
          </AlertDescription>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-primary" />
          Share Files Securely
        </CardTitle>
        <CardDescription>Upload files and share them with specific users with custom expiry settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? "border-primary bg-primary/5"
              : selectedFiles.length > 0
              ? "border-green-500 bg-green-50 dark:bg-green-950/20"
              : "border-border hover:border-primary/50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium mb-2">Drop files here or click to browse</p>
          <p className="text-sm text-muted-foreground mb-4">Support for all file types up to 100MB</p>
          <Input type="file" multiple onChange={handleFileSelect} className="hidden" id="file-upload" accept="*/*" />
          <Button asChild variant="outline">
            <label htmlFor="file-upload" className="cursor-pointer">
              Choose Files
            </label>
          </Button>
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="space-y-2">
            <Label>Selected Files ({selectedFiles.length})</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {selectedFiles.map((selectedFile) => (
                <div key={selectedFile.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{selectedFile.file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.file.size)}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeFile(selectedFile.id)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recipients */}
        <div className="space-y-2">
          <Label htmlFor="recipients" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Recipients
          </Label>
          <div className="space-y-2">
            <Input
              id="recipients"
              placeholder="Enter email addresses..."
              value={recipientInput}
              onChange={(e) => setRecipientInput(e.target.value)}
              onKeyDown={handleRecipientKeyPress}
              onBlur={() => addRecipient(recipientInput.trim())}
            />
            {recipientInput && (
              <div className="flex flex-wrap gap-1">
                {userSuggestions
                  .filter((email) => email.toLowerCase().includes(recipientInput.toLowerCase()))
                  .slice(0, 3)
                  .map((email) => (
                    <Button key={email} variant="ghost" size="sm" className="h-6 text-xs" onClick={() => addRecipient(email)}>
                      {email}
                    </Button>
                  ))}
              </div>
            )}
            {recipients.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {recipients.map((email) => (
                  <Badge key={email} variant="secondary" className="flex items-center gap-1">
                    {email}
                    <Button variant="ghost" size="sm" className="h-4 w-4 p-0 hover:bg-transparent" onClick={() => removeRecipient(email)}>
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Expiry Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiry-date" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Expiry Date
            </Label>
            <Input id="expiry-date" type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} min={new Date().toISOString().split("T")[0]} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expiry-time">Expiry Time</Label>
            <Input id="expiry-time" type="time" value={expiryTime} onChange={(e) => setExpiryTime(e.target.value)} />
          </div>
        </div>

        {/* Screenshot Toggle */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            {screenshotsEnabled ? <Camera className="w-5 h-5 text-green-500" /> : <CameraOff className="w-5 h-5 text-red-500" />}
            <div>
              <Label htmlFor="screenshots" className="text-sm font-medium">
                Allow Screenshots
              </Label>
              <p className="text-xs text-muted-foreground">Recipients can take screenshots of shared files</p>
            </div>
          </div>
          <Switch id="screenshots" checked={screenshotsEnabled} onCheckedChange={setScreenshotsEnabled} />
        </div>

        {/* Validation Alert */}
        {selectedFiles.length === 0 || recipients.length === 0 ? (
          <Alert>
            <AlertDescription>Please select files and add at least one recipient to share your files.</AlertDescription>
          </Alert>
        ) : null}

        {/* Send Button */}
        <Button
          onClick={handleSendFile}
          disabled={selectedFiles.length === 0 || recipients.length === 0 || isUploading || !user}
          className="w-full bg-primary hover:bg-primary/90"
          size="lg"
        >
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Uploading...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send Files ({selectedFiles.length})
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}