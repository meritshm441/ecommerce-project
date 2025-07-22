"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { sessionManager } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, AlertTriangle } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const checkAdminAccess = () => {
      try {
        console.log("🔍 Checking admin access...")

        // Get session data
        const session = sessionManager.getSession()

        if (!session || !session.userData) {
          console.log("❌ No valid session found, redirecting to login")
          setError("Please log in to access the admin panel")
          setTimeout(() => router.push("/"), 2000)
          return
        }

        if (!session.userData.isAdmin) {
          console.log("❌ User is not an admin, redirecting to home")
          setError("You don't have permission to access the admin panel")
          setTimeout(() => router.push("/"), 2000)
          return
        }

        console.log("✅ Admin access granted for:", session.userData.email)
        setIsAuthorized(true)
      } catch (error) {
        console.error("❌ Admin access check failed:", error)
        setError("Failed to verify admin access")
        setTimeout(() => router.push("/"), 2000)
      } finally {
        setIsLoading(false)
      }
    }

    checkAdminAccess()

    // Listen for auth state changes
    const handleAuthStateChange = (event: CustomEvent) => {
      const { user } = event.detail
      if (!user || !user.isAdmin) {
        console.log("🔒 Admin access revoked, redirecting...")
        setIsAuthorized(false)
        router.push("/")
      }
    }

    const handleLogout = () => {
      console.log("👋 Logout detected in admin panel")
      setIsAuthorized(false)
      router.push("/")
    }

    window.addEventListener("authStateChange", handleAuthStateChange as EventListener)
    window.addEventListener("logout", handleLogout)

    return () => {
      window.removeEventListener("authStateChange", handleAuthStateChange as EventListener)
      window.removeEventListener("logout", handleLogout)
    }
  }, [router])

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-center">
              <div className="font-semibold mb-2">Access Denied</div>
              {error}
              <div className="text-sm mt-2 opacity-75">Redirecting...</div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  // Authorized admin user
  if (isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
        </div>
        <div className="p-8">{children}</div>
      </div>
    )
  }

  // Fallback
  return null
}
