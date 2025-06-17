"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { AuthModals } from "@/components/auth-modals"
import { LogIn, UserPlus, Settings } from "lucide-react"
import Link from "next/link"
import { userAPI } from "@/lib/api"

export default function AuthStatus() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const { toast } = useToast()

  // Check if user is logged in and if they're an admin
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("userToken")
      const adminStatus = localStorage.getItem("isAdmin")
      setIsLoggedIn(!!token)
      setIsAdmin(adminStatus === "true")
    }

    checkLoginStatus()

    // Listen for storage events (for multi-tab support)
    window.addEventListener("storage", checkLoginStatus)

    return () => {
      window.removeEventListener("storage", checkLoginStatus)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await userAPI.logout()
    } catch (error) {
      console.warn("Logout API failed, proceeding with local logout")
    }

    // Clear token and admin status
    localStorage.removeItem("userToken")
    localStorage.removeItem("isAdmin")
    localStorage.removeItem("userData")
    setIsLoggedIn(false)
    setIsAdmin(false)

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

  if (isLoggedIn) {
    return (
      <div className="flex items-center gap-2">
        {isAdmin && (
          <Link href="/admin">
            <Button variant="ghost" className="text-gray-700 hover:text-purple-600 flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Admin Portal
            </Button>
          </Link>
        )}
        <Link href="/profile">
          <Button variant="ghost" className="text-gray-700 hover:text-purple-600">
            Profile
          </Button>
        </Link>
        <Button variant="ghost" onClick={handleLogout} className="text-gray-700 hover:text-purple-600">
          Logout
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center  justify-between gap-2">
        <Button
          variant="ghost"
          onClick={() => setIsLoginOpen(true)}
          className="text-gray-700 w-full hover:text-purple-600 flex items-center gap-2"
        >
          <LogIn className="h-4 w-4" />
          Login
        </Button>
        <Button
          onClick={() => setIsRegisterOpen(true)}
          className="bg-purple-600 w-full hover:bg-purple-700 text-white flex items-center gap-2"
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
