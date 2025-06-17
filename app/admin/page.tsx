"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, ShoppingCart, Users, DollarSign, Plus, Shield } from "lucide-react"

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAdminStatus = () => {
      const token = localStorage.getItem("userToken")
      const adminStatus = localStorage.getItem("isAdmin")

      if (!token) {
        router.push("/")
        return
      }

      if (adminStatus !== "true") {
        router.push("/")
        return
      }

      setIsAdmin(true)
      setIsLoading(false)
    }

    checkAdminStatus()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f9fbfc] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#009cde] mx-auto mb-4"></div>
          <p className="text-[#666666]">Loading admin portal...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-[#009cde] to-[#01589a] rounded-lg p-8 text-white">
        <div className="flex items-center gap-4 mb-4">
          <Shield className="h-12 w-12" />
          <div>
            <h1 className="text-3xl font-bold">Welcome to Admin Portal</h1>
            <p className="text-blue-100">Manage your e-commerce platform with powerful admin tools</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#000000]">Dashboard Overview</h2>
          <p className="text-[#666666]">Monitor your business performance and manage operations</p>
        </div>
        <Link href="/admin/products/create">
          <Button className="bg-[#009cde] hover:bg-[#01589a]">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-[#009cde]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-[#666666]">+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-[#009cde]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-[#666666]">+12 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-[#009cde]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-[#666666]">+5 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-[#009cde]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,847</div>
            <p className="text-xs text-[#666666]">+8% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Product Management</CardTitle>
            <CardDescription>Manage your product catalog</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/products">
              <Button variant="outline" className="w-full justify-start">
                View All Products
              </Button>
            </Link>
            <Link href="/admin/products/create">
              <Button variant="outline" className="w-full justify-start">
                Add New Product
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Management</CardTitle>
            <CardDescription>Track and manage orders</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/orders">
              <Button variant="outline" className="w-full justify-start">
                View All Orders
              </Button>
            </Link>
            <Button variant="outline" className="w-full justify-start">
              Pending Orders
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
            <CardDescription>View sales and performance data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/analytics">
              <Button variant="outline" className="w-full justify-start">
                Sales Report
              </Button>
            </Link>
            <Button variant="outline" className="w-full justify-start">
              Customer Analytics
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Back to Store */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-[#000000]">Return to Store</h3>
              <p className="text-sm text-[#666666]">Go back to the main shopping experience</p>
            </div>
            <Link href="/">
              <Button variant="outline">Back to Store</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
