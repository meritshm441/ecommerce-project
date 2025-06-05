"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function LogoutPage() {
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Clear user token
    localStorage.removeItem("userToken")

    // Trigger storage event for other components
    window.dispatchEvent(new Event("storage"))

    // Show logout message
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })

    // Redirect to home page
    setTimeout(() => {
      router.push("/")
    }, 1000)
  }, [router, toast])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Logging Out...</h1>
        <p className="text-gray-600">Please wait while we log you out.</p>
      </div>
    </div>
  )
}
