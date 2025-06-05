"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { AuthModals } from "@/components/auth-modals"
import { LogIn, UserPlus } from "lucide-react"

export function AuthStatus() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const { toast } = useToast()

  // Check if user is logged in (simulated)
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("userToken")
      setIsLoggedIn(!!token)
    }

    checkLoginStatus()

    // Listen for storage events (for multi-tab support)
    window.addEventListener("storage", checkLoginStatus)

    return () => {
      window.removeEventListener("storage", checkLoginStatus)
    }
  }, [])

  const handleLogout = () => {
    // Clear token
    localStorage.removeItem("userToken")
    setIsLoggedIn(false)

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
      <Button variant="ghost" onClick={handleLogout} className="text-gray-700 hover:text-purple-600">
        Logout
      </Button>
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
