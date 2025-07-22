"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { UserIcon, ShoppingBag, Shield, LogOut, Loader2, LogIn, UserPlus, Settings } from "lucide-react"
import { userAPI, sessionManager } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { AuthModals } from "./auth-modals"

interface AuthUser {
  _id: string
  username: string
  email: string
  isAdmin: boolean
  profilePicture?: string
}

export default function AuthStatus() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { toast } = useToast()

  // Check authentication status
  const checkAuthStatus = async () => {
    try {
      console.log("🔍 Checking authentication status...")
      setIsLoading(true)

      // Get session data using session manager
      const session = sessionManager.getSession()

      if (session && session.userData) {
        console.log("👤 Found valid session:", session.userData.email)
        setUser(session.userData)
        setIsLoading(false)

        // Try to refresh profile data in background
        try {
          const freshProfile = await userAPI.getProfile()
          console.log("✅ Fresh profile data received:", freshProfile)

          const updatedUser = {
            _id: freshProfile._id || freshProfile.id,
            username: freshProfile.username || freshProfile.name || session.userData.username,
            email: freshProfile.email,
            isAdmin: freshProfile.isAdmin || false,
            profilePicture: freshProfile.profilePicture,
          }

          // Update session with fresh data
          sessionManager.setSession(updatedUser, session.token)
          setUser(updatedUser)
          console.log("🔄 User data refreshed successfully")
        } catch (profileError: any) {
          console.warn("⚠️ Could not refresh profile, using session data:", profileError.message)
          // Keep using session data if API fails
        }
      } else {
        console.log("❌ No valid session found")
        setUser(null)
        setIsLoading(false)
      }
    } catch (error: any) {
      console.error("❌ Auth check failed:", error)
      setUser(null)
      setIsLoading(false)
    }
  }

  // Handle logout
  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      console.log("🚪 Logging out user...")

      // Call logout API
      await userAPI.logout()

      // Update state
      setUser(null)

      // Dispatch logout event for other components
      window.dispatchEvent(new CustomEvent("logout"))
      window.dispatchEvent(new CustomEvent("authStateChange", { detail: { user: null } }))

      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      })

      // Redirect to home page
      router.push("/")

      console.log("✅ Logout completed successfully")
    } catch (error: any) {
      console.error("❌ Logout error:", error)

      // Even if API fails, clear local session
      sessionManager.clearSession()
      setUser(null)

      // Dispatch logout event
      window.dispatchEvent(new CustomEvent("logout"))
      window.dispatchEvent(new CustomEvent("authStateChange", { detail: { user: null } }))

      toast({
        title: "Logged Out",
        description: "You have been logged out.",
      })

      router.push("/")
    } finally {
      setIsLoggingOut(false)
    }
  }

  // Handle login success
  const handleLoginSuccess = (userData: AuthUser) => {
    console.log("🎉 Login success event received:", userData)
    setUser(userData)
    setIsLoading(false)

    // Dispatch auth state change event
    window.dispatchEvent(new CustomEvent("authStateChange", { detail: { user: userData } }))
  }

  // Set up event listeners
  useEffect(() => {
    // Check auth status on mount
    checkAuthStatus()

    // Listen for login success events
    const handleLoginSuccessEvent = (event: CustomEvent) => {
      handleLoginSuccess(event.detail)
    }

    // Listen for storage changes (multi-tab sync)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "userToken" || event.key === "userData" || event.key === "sessionExpiry") {
        console.log("🔄 Session data changed in another tab, rechecking...")
        checkAuthStatus()
      }
    }

    // Listen for logout events
    const handleLogoutEvent = () => {
      console.log("👋 Logout event received")
      setUser(null)
    }

    // Listen for auth errors (token expired, etc.)
    const handleAuthError = () => {
      console.log("🔒 Auth error event received, clearing session")
      sessionManager.clearSession()
      setUser(null)
      toast({
        title: "Session Expired",
        description: "Please log in again to continue.",
        variant: "destructive",
      })
    }

    // Set up periodic session validation (every 5 minutes)
    const sessionCheckInterval = setInterval(
      () => {
        const session = sessionManager.getSession()
        if (!session && user) {
          console.log("⏰ Session expired, logging out user")
          setUser(null)
          window.dispatchEvent(new CustomEvent("logout"))
        }
      },
      5 * 60 * 1000,
    ) // 5 minutes

    // Add event listeners
    window.addEventListener("loginSuccess", handleLoginSuccessEvent as EventListener)
    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("logout", handleLogoutEvent)
    window.addEventListener("authError", handleAuthError)

    // Cleanup
    return () => {
      window.removeEventListener("loginSuccess", handleLoginSuccessEvent as EventListener)
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("logout", handleLogoutEvent)
      window.removeEventListener("authError", handleAuthError)
      clearInterval(sessionCheckInterval)
    }
  }, [user, toast])

  // Get user initials for avatar
  const getUserInitials = (username: string) => {
    if (!username) return "U"
    return username
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Get profile picture URL
  const getProfilePictureUrl = (profilePicture?: string) => {
    if (!profilePicture) return undefined

    // If it's already a full URL, return as is
    if (profilePicture.startsWith("http")) {
      return profilePicture
    }

    // If it's a relative path, construct full URL
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
    const baseUrl = API_BASE_URL.replace("/api", "")
    return `${baseUrl}${profilePicture}`
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>
    )
  }

  // Authenticated user
  if (user) {
    return (
      <div className="flex items-center space-x-2">
        {/* Admin Portal Link */}
        {user.isAdmin && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin")}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700"
          >
            <Settings className="h-4 w-4" />
            Admin
          </Button>
        )}

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={getProfilePictureUrl(user.profilePicture) || "/placeholder.svg"}
                  alt={user.username}
                  onError={(e) => {
                    console.warn("Failed to load profile picture:", user.profilePicture)
                    e.currentTarget.style.display = "none"
                  }}
                />
                <AvatarFallback className="bg-purple-100 text-purple-600">
                  {getUserInitials(user.username)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.username}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                {user.isAdmin && (
                  <Badge variant="secondary" className="w-fit mt-1">
                    <Shield className="mr-1 h-3 w-3" />
                    Admin
                  </Badge>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/profile?tab=orders")}>
              <ShoppingBag className="mr-2 h-4 w-4" />
              <span>My Orders</span>
            </DropdownMenuItem>
            {user.isAdmin && (
              <DropdownMenuItem onClick={() => router.push("/admin")}>
                <Shield className="mr-2 h-4 w-4" />
                <span>Admin Portal</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
              {isLoggingOut ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
              <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  // Not authenticated - show login/register buttons
  return (
    <>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" onClick={() => setIsLoginOpen(true)} className="flex items-center gap-2">
          <LogIn className="h-4 w-4" />
          Login
        </Button>
        <Button
          onClick={() => setIsRegisterOpen(true)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
        >
          <UserPlus className="h-4 w-4" />
          Register
        </Button>
      </div>

      <AuthModals
        isLoginOpen={isLoginOpen}
        isRegisterOpen={isRegisterOpen}
        onLoginClose={() => setIsLoginOpen(false)}
        onRegisterClose={() => setIsRegisterOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginOpen(false)
          setIsRegisterOpen(true)
        }}
        onSwitchToLogin={() => {
          setIsRegisterOpen(false)
          setIsLoginOpen(true)
        }}
      />
    </>
  )
}
