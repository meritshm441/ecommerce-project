"use client"

import { useEffect, useState } from "react"
import { testAPIConnection } from "@/lib/api"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

export default function APIStatus() {
  const [status, setStatus] = useState<{
    connected: boolean
    message: string
    loading: boolean
    showAlert: boolean
  }>({
    connected: false,
    message: "Checking connection...",
    loading: true,
    showAlert: true,
  })

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const result = await testAPIConnection()
        setStatus({
          connected: result.connected,
          message: result.message,
          loading: false,
          showAlert: !result.connected, // Only show alert if not connected
        })
      } catch (error) {
        setStatus({
          connected: false,
          message: "Backend server not available - Using demo mode with sample data",
          loading: false,
          showAlert: true,
        })
      }
    }

    checkConnection()
  }, [])

  // Don't show anything while loading
  if (status.loading) {
    return null
  }

  // Don't show alert if connected successfully
  if (status.connected) {
    return null
  }

  // Only show alert when using mock data
  if (!status.showAlert) {
    return null
  }

  return (
    <div className="mb-4">
      <Alert variant="default" className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Demo Mode:</strong> Backend server not available. Using sample data for demonstration. All features
          are functional with mock data.
        </AlertDescription>
      </Alert>
    </div>
  )
}
