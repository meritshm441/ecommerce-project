"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function UsersPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to admin customers page
    router.push("/admin/customers")
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Redirecting...</h1>
        <p className="text-gray-600">Taking you to the admin customers page.</p>
      </div>
    </div>
  )
}
