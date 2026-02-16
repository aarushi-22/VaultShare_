import { AuthGuard } from "@/components/auth-guard"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { FileUploadCard } from "@/components/dashboard/file-upload-card"
import { QuickStats } from "@/components/dashboard/quick-stats"

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="grid gap-8">
            <QuickStats />
            <FileUploadCard />
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
