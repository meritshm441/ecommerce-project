"use client"

import { useState, useEffect } from "react"
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
import { useToast } from "@/hooks/use-toast"
import { AuthModals } from "@/components/auth-modals"
import { LogIn, UserPlus, User, Settings, LogOut, Package } from "lucide-react"
import Link from "next/link"
import { userAPI } from "@/lib/api"

interface UserProfile {
  _id: string
  username: string
  email: string
  profilePicture?: string
  isAdmin: boolean
}

export default function AuthStatus() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Check if user is logged in and fetch profile
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = localStorage.getItem("userToken")
        if (token) {
          const profile = await userAPI.getProfile()
          setUserProfile(profile)
          setIsLoggedIn(true)
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        localStorage.removeItem("userToken")
        setIsLoggedIn(false)
        setUserProfile(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkLoginStatus()

    // Listen for storage events (for multi-tab support)
    const handleStorageChange = () => {
      checkLoginStatus()
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await userAPI.logout()
    } catch (error) {
      console.warn("Logout API failed, proceeding with local logout")
    }

    // Clear token and user data
    localStorage.removeItem("userToken")
    localStorage.removeItem("isAdmin")
    localStorage.removeItem("userData")
    setIsLoggedIn(false)
    setUserProfile(null)

    // Trigger storage event for other components
    window.dispatchEvent(new Event("storage"))

    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
  }

  const handleSwitchToRegister = () => {
    setIsLoginOpen(false)
    setIsRegisterOpen(true)
  }

  const handleSwitchToLogin = () => {
    setIsRegisterOpen(false)
    setIsLoginOpen(true)
  }

  const getProfileImageUrl = (profilePicture?: string) => {
    if (!profilePicture) return null

    // If it's already a full URL, return as is
    if (profilePicture.startsWith("http")) {
      return profilePicture
    }

    // If it's a relative path, construct full URL
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
    const baseUrl = API_BASE_URL.replace("/api", "") // Remove /api suffix
    return `${baseUrl}${profilePicture}`
  }

  const getUserInitials = (username: string) => {
    return username
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
      </div>
    )
  }

  if (isLoggedIn && userProfile) {
    return (
      <div className="flex items-center gap-2">
        {userProfile.isAdmin && (
          <Link href="/admin">
            <Button variant="ghost" className="text-gray-700 hover:text-purple-600 flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Admin Portal
            </Button>
          </Link>
        )}

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={getProfileImageUrl(userProfile.profilePicture) || undefined}
                  alt={userProfile.username}
                  className="object-cover"
                />
                <AvatarFallback className="bg-purple-100 text-purple-600">
                  {getUserInitials(userProfile.username)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium leading-none">{userProfile.username}</p>
                  {userProfile.isAdmin && (
                    <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800">
                      Admin
                    </Badge>
                  )}
                </div>
                <p className="text-xs leading-none text-muted-foreground">{userProfile.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/profile?tab=orders" className="cursor-pointer">
                <Package className="mr-2 h-4 w-4" />
                <span>My Orders</span>
              </Link>
            </DropdownMenuItem>
            {userProfile.isAdmin && (
              <DropdownMenuItem asChild>
                <Link href="/admin" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Admin Panel</span>
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          onClick={() => setIsLoginOpen(true)}
          className="text-gray-700 hover:text-purple-600 flex items-center gap-2"
        >
          <LogIn className="h-4 w-4" />
          Login
        </Button>
        <Button
          onClick={() => setIsRegisterOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
          size="sm"
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
        onSwitchToRegister={handleSwitchToRegister}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  )
}
