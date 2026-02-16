"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users, Clock, Bell } from "lucide-react"
import { useAuth } from '@/hooks/useAuth'

export default function HomePage() {
  const { user, loading } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-4 text-balance">
            Vault<span className="text-primary">Share</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Secure file sharing platform designed for both organizations and personal users
          </p>
          <div className="flex gap-4 justify-center">
            {loading ? (
              // Show loading state
              <Button size="lg" disabled>Loading...</Button>
            ) : user ? (
              // Show dashboard button if user is logged in
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              // Show auth buttons if user is not logged in
              <>
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                  <Link href="/auth/login">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="border-border/50 hover:border-primary/50 transition-colors">
            <CardHeader className="text-center">
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-lg">Secure Sharing</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                End-to-end encryption ensures your files stay private and secure
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover:border-secondary/50 transition-colors">
            <CardHeader className="text-center">
              <Users className="w-12 h-12 text-secondary mx-auto mb-4" />
              <CardTitle className="text-lg">Organization Support</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Dedicated features for organizational users with .xyv domains
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover:border-primary/50 transition-colors">
            <CardHeader className="text-center">
              <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-lg">Expiry Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Set custom expiry times for shared files with automatic cleanup
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover:border-secondary/50 transition-colors">
            <CardHeader className="text-center">
              <Bell className="w-12 h-12 text-secondary mx-auto mb-4" />
              <CardTitle className="text-lg">Smart Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Real-time alerts for file access, expiry warnings, and new shares
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl text-balance">
                {user ? 'Continue securing your files' : 'Ready to secure your files?'}
              </CardTitle>
              <CardDescription className="text-lg">
                {user 
                  ? `Welcome back, ${user.email}! Access your secure files`
                  : 'Join thousands of users who trust VaultShare for secure file sharing'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90">
                <Link href={user ? "/dashboard" : "/auth/signup"}>
                  {user ? "Go to Dashboard" : "Start Sharing Securely"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}