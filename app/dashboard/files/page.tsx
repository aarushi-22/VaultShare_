import { AuthGuard } from "@/components/auth-guard"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { FileTabs } from "@/components/files/file-tabs"

export default function FilesPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">File Management</h1>
              <p className="text-muted-foreground">Manage your sent and received files with access controls</p>
            </div>

            <FileTabs />
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
