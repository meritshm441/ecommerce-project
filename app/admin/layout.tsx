"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Tag,
  Star,
  Warehouse,
  Menu,
  X,
  Home,
} from "lucide-react"
import { userAPI, productAPI, orderAPI, categoryAPI } from "@/lib/api"

interface SidebarCounts {
  pendingOrders: number
  lowStockProducts: number
  totalProducts: number
  totalCustomers: number
  totalCategories: number
  pendingReviews: number
}

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package, countKey: "totalProducts" as keyof SidebarCounts },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart, countKey: "pendingOrders" as keyof SidebarCounts },
  { name: "Customers", href: "/admin/customers", icon: Users, countKey: "totalCustomers" as keyof SidebarCounts },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Categories", href: "/admin/categories", icon: Tag, countKey: "totalCategories" as keyof SidebarCounts },
  { name: "Inventory", href: "/admin/inventory", icon: Warehouse, countKey: "lowStockProducts" as keyof SidebarCounts },
  { name: "Reviews", href: "/admin/reviews", icon: Star, countKey: "pendingReviews" as keyof SidebarCounts },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [counts, setCounts] = useState<SidebarCounts>({
    pendingOrders: 0,
    lowStockProducts: 0,
    totalProducts: 0,
    totalCustomers: 0,
    totalCategories: 0,
    pendingReviews: 0,
  })

  useEffect(() => {
    const checkAdminStatus = async () => {
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
        await loadSidebarCounts()
      } catch (error) {
        console.error("Error checking admin status:", error)
        router.push("/")
      } finally {
        setIsLoading(false)
      }
    }

    checkAdminStatus()

    // Listen for storage events
    window.addEventListener("storage", checkAdminStatus)
    return () => window.removeEventListener("storage", checkAdminStatus)
  }, [router])

  const loadSidebarCounts = async () => {
    try {
      // Load all data in parallel
      const [products, orders, users, categories] = await Promise.all([
        productAPI.getAllProducts().catch(() => []),
        orderAPI.getAllOrders().catch(() => []),
        userAPI.getAllUsers().catch(() => []),
        categoryAPI.getAllCategories().catch(() => []),
      ])

      const productsArray = Array.isArray(products) ? products : []
      const ordersArray = Array.isArray(orders) ? orders : []
      const usersArray = Array.isArray(users) ? users : []
      const categoriesArray = Array.isArray(categories) ? categories : []

      // Calculate counts
      const pendingOrders = ordersArray.filter((order: any) => !order.isPaid).length
      const lowStockProducts = productsArray.filter(
        (product: any) => (product.countInStock || 0) < 10 && (product.countInStock || 0) > 0,
      ).length
      const totalProducts = productsArray.length
      const totalCustomers = usersArray.filter((user: any) => !user.isAdmin).length
      const totalCategories = categoriesArray.length
      const pendingReviews = 0 // Mock data - implement when reviews API is available

      setCounts({
        pendingOrders,
        lowStockProducts,
        totalProducts,
        totalCustomers,
        totalCategories,
        pendingReviews,
      })
    } catch (error) {
      console.error("Error loading sidebar counts:", error)
    }
  }

  // Refresh counts every 30 seconds
  useEffect(() => {
    if (isAdmin) {
      const interval = setInterval(loadSidebarCounts, 30000)
      return () => clearInterval(interval)
    }
  }, [isAdmin])

  const getBadgeVariant = (item: any, count: number) => {
    // Special styling for urgent items
    if (item.countKey === "pendingOrders" && count > 0) {
      return "destructive" // Red for pending orders
    }
    if (item.countKey === "lowStockProducts" && count > 0) {
      return "secondary" // Orange/yellow for low stock
    }
    if (item.countKey === "pendingReviews" && count > 0) {
      return "destructive" // Red for pending reviews
    }
    return "default" // Default blue for counts
  }

  const shouldShowBadge = (item: any, count: number) => {
    // Only show badges for items that need attention or have meaningful counts
    if (item.countKey === "pendingOrders") return count > 0 // Only show if there are pending orders
    if (item.countKey === "lowStockProducts") return count > 0 // Only show if there are low stock items
    if (item.countKey === "pendingReviews") return count > 0 // Only show if there are pending reviews
    if (item.countKey === "totalProducts") return count > 0 // Show product count if any exist
    if (item.countKey === "totalCustomers") return count > 0 // Show customer count if any exist
    if (item.countKey === "totalCategories") return count > 0 // Show category count if any exist
    return false
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
    <div className="flex h-screen bg-[#f9fbfc] overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 flex-shrink-0">
            <Link href="/admin" className="text-xl font-bold text-[#000000]">
              Admin Portal
            </Link>
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
              const count = item.countKey ? counts[item.countKey] : 0
              const showBadge = item.countKey ? shouldShowBadge(item, count) : false

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? "bg-[#009cde] text-white" : "text-[#666666] hover:bg-[#e6eff5] hover:text-[#000000]"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="flex items-center">
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </div>
                  {showBadge && (
                    <Badge
                      variant={getBadgeVariant(item, count)}
                      className={`text-xs ${
                        item.countKey === "pendingOrders"
                          ? "bg-red-500 hover:bg-red-600 text-white"
                          : item.countKey === "lowStockProducts"
                            ? "bg-orange-500 hover:bg-orange-600 text-white"
                            : item.countKey === "pendingReviews"
                              ? "bg-red-500 hover:bg-red-600 text-white"
                              : ""
                      }`}
                    >
                      {count > 99 ? "99+" : count}
                    </Badge>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Back to Store */}
          <div className="p-4 border-t border-gray-200 flex-shrink-0">
            <Link href="/">
              <Button variant="ghost" className="w-full justify-start text-[#666666] hover:text-[#000000]">
                <Home className="h-5 w-5 mr-3" />
                Back to Store
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 flex-shrink-0">
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-[#000000]">Admin Portal</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
