"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, ShoppingCart, Users, DollarSign, Plus, Shield, TrendingUp, AlertTriangle } from "lucide-react"
import { userAPI, productAPI, orderAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalCustomers: number
  totalRevenue: number
  pendingOrders: number
  lowStockProducts: number
  recentGrowth: {
    products: number
    orders: number
    customers: number
    revenue: number
  }
}

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockProducts: 0,
    recentGrowth: {
      products: 0,
      orders: 0,
      customers: 0,
      revenue: 0,
    },
  })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkAdminAndLoadData = async () => {
      try {
        const token = localStorage.getItem("userToken")
        if (!token) {
          router.push("/")
          return
        }

        // Check if user is admin
        const profile = await userAPI.getProfile()
        if (!profile.isAdmin) {
          router.push("/")
          return
        }

        setIsAdmin(true)

        // Load dashboard statistics
        await loadDashboardStats()
      } catch (error: any) {
        console.error("Error checking admin status:", error)
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the admin panel.",
          variant: "destructive",
        })
        router.push("/")
      } finally {
        setIsLoading(false)
      }
    }

    checkAdminAndLoadData()
  }, [router, toast])

  const loadDashboardStats = async () => {
    try {
      // Fetch all data in parallel
      const [products, orders, users, totalSales] = await Promise.all([
        productAPI.getAllProducts(),
        orderAPI.getAllOrders(),
        userAPI.getAllUsers(),
        orderAPI.getTotalSales(),
      ])

      // Calculate statistics
      const totalProducts = Array.isArray(products) ? products.length : 0
      const totalOrders = Array.isArray(orders) ? orders.length : 0
      const totalCustomers = Array.isArray(users) ? users.filter((user: any) => !user.isAdmin).length : 0
      const totalRevenue = totalSales?.totalSales || 0

      // Calculate pending orders
      const pendingOrders = Array.isArray(orders) ? orders.filter((order: any) => !order.isPaid).length : 0

      // Calculate low stock products (assuming stock < 10 is low)
      const lowStockProducts = Array.isArray(products)
        ? products.filter((product: any) => (product.countInStock || 0) < 10).length
        : 0

      setStats({
        totalProducts,
        totalOrders,
        totalCustomers,
        totalRevenue,
        pendingOrders,
        lowStockProducts,
        recentGrowth: {
          products: 2, // Mock growth data - you can implement real calculation
          orders: 12,
          customers: 5,
          revenue: 8,
        },
      })
    } catch (error: any) {
      console.error("Error loading dashboard stats:", error)
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics.",
        variant: "destructive",
      })
    }
  }

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
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-[#666666]">
              <TrendingUp className="h-3 w-3 inline mr-1" />+{stats.recentGrowth.products} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-[#009cde]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-[#666666]">
              <TrendingUp className="h-3 w-3 inline mr-1" />+{stats.recentGrowth.orders} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-[#009cde]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-[#666666]">
              <TrendingUp className="h-3 w-3 inline mr-1" />+{stats.recentGrowth.customers} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-[#009cde]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-[#666666]">
              <TrendingUp className="h-3 w-3 inline mr-1" />+{stats.recentGrowth.revenue}% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alert Cards */}
      {(stats.pendingOrders > 0 || stats.lowStockProducts > 0) && (
        <div className="grid md:grid-cols-2 gap-6">
          {stats.pendingOrders > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-800">Pending Orders</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-800">{stats.pendingOrders}</div>
                <p className="text-xs text-orange-600">Orders awaiting payment</p>
              </CardContent>
            </Card>
          )}

          {stats.lowStockProducts > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-red-800">Low Stock Alert</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-800">{stats.lowStockProducts}</div>
                <p className="text-xs text-red-600">Products need restocking</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

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
                View All Products ({stats.totalProducts})
              </Button>
            </Link>
            <Link href="/admin/products/create">
              <Button variant="outline" className="w-full justify-start">
                Add New Product
              </Button>
            </Link>
            <Link href="/admin/categories">
              <Button variant="outline" className="w-full justify-start">
                Manage Categories
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
                View All Orders ({stats.totalOrders})
              </Button>
            </Link>
            {stats.pendingOrders > 0 && (
              <Link href="/admin/orders?filter=pending">
                <Button variant="outline" className="w-full justify-start text-orange-600">
                  Pending Orders ({stats.pendingOrders})
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Management</CardTitle>
            <CardDescription>Manage customer accounts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/customers">
              <Button variant="outline" className="w-full justify-start">
                View All Customers ({stats.totalCustomers})
              </Button>
            </Link>
            <Link href="/admin/reviews">
              <Button variant="outline" className="w-full justify-start">
                Manage Reviews
              </Button>
            </Link>
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
