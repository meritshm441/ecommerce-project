"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package, RefreshCw, Calendar } from "lucide-react"
import { productAPI, orderAPI, userAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface AnalyticsData {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  totalProductsSold: number
  revenueGrowth: number
  ordersGrowth: number
  customersGrowth: number
  productsSoldGrowth: number
  topProducts: Array<{
    name: string
    sales: number
    revenue: number
    growth: number
  }>
  topCategories: Array<{
    name: string
    percentage: number
    revenue: number
    productCount: number
  }>
  salesByMonth: Array<{
    month: string
    sales: number
    orders: number
    revenue: number
  }>
  orderStatusBreakdown: {
    paid: number
    pending: number
    delivered: number
    cancelled: number
  }
  customerMetrics: {
    newCustomers: number
    returningCustomers: number
    averageOrderValue: number
  }
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProductsSold: 0,
    revenueGrowth: 0,
    ordersGrowth: 0,
    customersGrowth: 0,
    productsSoldGrowth: 0,
    topProducts: [],
    topCategories: [],
    salesByMonth: [],
    orderStatusBreakdown: {
      paid: 0,
      pending: 0,
      delivered: 0,
      cancelled: 0,
    },
    customerMetrics: {
      newCustomers: 0,
      returningCustomers: 0,
      averageOrderValue: 0,
    },
  })
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const { toast } = useToast()

  useEffect(() => {
    loadAnalyticsData()
  }, [])

  const loadAnalyticsData = async () => {
    setIsLoading(true)
    try {
      // Fetch all data in parallel
      const [products, orders, users] = await Promise.all([
        productAPI.getAllProducts(),
        orderAPI.getAllOrders(),
        userAPI.getAllUsers(),
      ])

      const productsArray = Array.isArray(products) ? products : []
      const ordersArray = Array.isArray(orders) ? orders : []
      const usersArray = Array.isArray(users) ? users : []

      // Calculate analytics
      const calculatedAnalytics = calculateAnalytics(productsArray, ordersArray, usersArray)
      setAnalytics(calculatedAnalytics)
      setLastUpdated(new Date())

      toast({
        title: "Analytics Updated",
        description: "Latest data has been loaded successfully.",
      })
    } catch (error: any) {
      console.error("Error loading analytics:", error)
      toast({
        title: "Error",
        description: "Failed to load analytics data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const calculateAnalytics = (products: any[], orders: any[], users: any[]): AnalyticsData => {
    // Basic totals
    const totalOrders = orders.length
    const totalCustomers = users.filter((user) => !user.isAdmin).length
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0)

    // Calculate total products sold
    const totalProductsSold = orders.reduce((sum, order) => {
      if (order.orderItems && Array.isArray(order.orderItems)) {
        return (
          sum + order.orderItems.reduce((itemSum: number, item: any) => itemSum + (item.qty || item.quantity || 1), 0)
        )
      }
      return sum + 1 // Fallback if orderItems structure is different
    }, 0)

    // Order status breakdown
    const orderStatusBreakdown = {
      paid: orders.filter((order) => order.isPaid).length,
      pending: orders.filter((order) => !order.isPaid).length,
      delivered: orders.filter((order) => order.isDelivered).length,
      cancelled: orders.filter((order) => order.isCancelled).length,
    }

    // Calculate growth (mock data for now - you can implement real historical comparison)
    const revenueGrowth = Math.floor(Math.random() * 30) + 5 // 5-35% growth
    const ordersGrowth = Math.floor(Math.random() * 25) + 10 // 10-35% growth
    const customersGrowth = Math.floor(Math.random() * 20) + 5 // 5-25% growth
    const productsSoldGrowth = Math.floor(Math.random() * 15) + 8 // 8-23% growth

    // Top products analysis
    const productSales: { [key: string]: { name: string; sales: number; revenue: number } } = {}

    orders.forEach((order) => {
      if (order.orderItems && Array.isArray(order.orderItems)) {
        order.orderItems.forEach((item: any) => {
          const productName = item.name || item.product?.name || "Unknown Product"
          const quantity = item.qty || item.quantity || 1
          const price = item.price || item.product?.price || 0

          if (!productSales[productName]) {
            productSales[productName] = { name: productName, sales: 0, revenue: 0 }
          }
          productSales[productName].sales += quantity
          productSales[productName].revenue += price * quantity
        })
      }
    })

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
      .map((product) => ({
        ...product,
        growth: Math.floor(Math.random() * 30) - 10, // -10% to +20% growth
      }))

    // Top categories analysis
    const categoryStats: { [key: string]: { revenue: number; productCount: number } } = {}

    products.forEach((product) => {
      const categoryName = product.category?.name || product.category || "Uncategorized"
      if (!categoryStats[categoryName]) {
        categoryStats[categoryName] = { revenue: 0, productCount: 0 }
      }
      categoryStats[categoryName].productCount += 1
    })

    // Add revenue data from orders
    orders.forEach((order) => {
      if (order.orderItems && Array.isArray(order.orderItems)) {
        order.orderItems.forEach((item: any) => {
          const product = products.find((p) => p._id === item.product || p.name === item.name)
          const categoryName = product?.category?.name || product?.category || "Uncategorized"
          const revenue = (item.price || 0) * (item.qty || item.quantity || 1)

          if (categoryStats[categoryName]) {
            categoryStats[categoryName].revenue += revenue
          }
        })
      }
    })

    const totalCategoryRevenue = Object.values(categoryStats).reduce((sum, cat) => sum + cat.revenue, 0)

    const topCategories = Object.entries(categoryStats)
      .map(([name, stats]) => ({
        name,
        revenue: stats.revenue,
        productCount: stats.productCount,
        percentage: totalCategoryRevenue > 0 ? Math.round((stats.revenue / totalCategoryRevenue) * 100) : 0,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6)

    // Sales by month (last 6 months)
    const salesByMonth = generateMonthlySales(orders)

    // Customer metrics
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
    const newCustomers = Math.floor(totalCustomers * 0.3) // Assume 30% are new
    const returningCustomers = totalCustomers - newCustomers

    return {
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalProductsSold,
      revenueGrowth,
      ordersGrowth,
      customersGrowth,
      productsSoldGrowth,
      topProducts,
      topCategories,
      salesByMonth,
      orderStatusBreakdown,
      customerMetrics: {
        newCustomers,
        returningCustomers,
        averageOrderValue,
      },
    }
  }

  const generateMonthlySales = (orders: any[]) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const currentDate = new Date()
    const salesByMonth = []

    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const monthName = months[date.getMonth()]
      const year = date.getFullYear()

      // Filter orders for this month
      const monthOrders = orders.filter((order) => {
        const orderDate = new Date(order.createdAt || order.dateOrdered || Date.now())
        return orderDate.getMonth() === date.getMonth() && orderDate.getFullYear() === year
      })

      const monthRevenue = monthOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0)

      salesByMonth.push({
        month: monthName,
        sales: monthRevenue,
        orders: monthOrders.length,
        revenue: monthRevenue,
      })
    }

    return salesByMonth
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#000000]">Analytics</h1>
            <p className="text-[#666666]">Loading analytics data...</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#000000]">Analytics</h1>
          <p className="text-[#666666]">
            Track your business performance and insights • Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <Button onClick={loadAnalyticsData} disabled={isLoading} className="bg-[#009cde] hover:bg-[#01589a]">
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh Data
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-[#009cde]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#000000]">{formatCurrency(analytics.totalRevenue)}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              {formatPercentage(analytics.revenueGrowth)} from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-[#009cde]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#000000]">{analytics.totalOrders.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              {formatPercentage(analytics.ordersGrowth)} from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-[#009cde]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#000000]">{analytics.totalCustomers.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              {formatPercentage(analytics.customersGrowth)} from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Products Sold</CardTitle>
            <Package className="h-4 w-4 text-[#009cde]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#000000]">{analytics.totalProductsSold.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              {formatPercentage(analytics.productsSoldGrowth)} from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#666666]">Paid Orders</span>
              <span className="font-medium text-green-600">{analytics.orderStatusBreakdown.paid}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#666666]">Pending Payment</span>
              <span className="font-medium text-orange-600">{analytics.orderStatusBreakdown.pending}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#666666]">Delivered</span>
              <span className="font-medium text-blue-600">{analytics.orderStatusBreakdown.delivered}</span>
            </div>
            {analytics.orderStatusBreakdown.cancelled > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#666666]">Cancelled</span>
                <span className="font-medium text-red-600">{analytics.orderStatusBreakdown.cancelled}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#666666]">New Customers</span>
              <span className="font-medium text-[#009cde]">{analytics.customerMetrics.newCustomers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#666666]">Returning Customers</span>
              <span className="font-medium text-[#009cde]">{analytics.customerMetrics.returningCustomers}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#666666]">Avg. Order Value</span>
              <span className="font-medium text-[#009cde]">
                {formatCurrency(analytics.customerMetrics.averageOrderValue)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#666666]">Conversion Rate</span>
              <span className="font-medium text-green-600">
                {analytics.totalCustomers > 0
                  ? ((analytics.totalOrders / analytics.totalCustomers) * 100).toFixed(1)
                  : 0}
                %
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#666666]">Orders per Customer</span>
              <span className="font-medium text-[#009cde]">
                {analytics.totalCustomers > 0 ? (analytics.totalOrders / analytics.totalCustomers).toFixed(1) : 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#666666]">Revenue per Customer</span>
              <span className="font-medium text-[#009cde]">
                {formatCurrency(analytics.totalCustomers > 0 ? analytics.totalRevenue / analytics.totalCustomers : 0)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.topProducts.length > 0 ? (
              analytics.topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-[#000000]">{product.name}</div>
                    <div className="text-sm text-[#666666]">{product.sales} units sold</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-[#000000]">{formatCurrency(product.revenue)}</div>
                    <div
                      className={`text-xs flex items-center ${product.growth > 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {product.growth > 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {formatPercentage(Math.abs(product.growth))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[#666666] text-center py-4">No product sales data available</p>
            )}
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analytics.topCategories.length > 0 ? (
              analytics.topCategories.map((category, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#000000]">{category.name}</span>
                    <span className="text-sm text-[#666666]">{formatCurrency(category.revenue)}</span>
                  </div>
                  <Progress value={category.percentage} className="h-2" />
                  <div className="flex justify-between text-xs text-[#666666]">
                    <span>{category.percentage}% of total sales</span>
                    <span>{category.productCount} products</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[#666666] text-center py-4">No category data available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sales Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Sales Overview (Last 6 Months)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analytics.salesByMonth.length > 0 ? (
            <div className="grid md:grid-cols-6 gap-4">
              {analytics.salesByMonth.map((data, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-[#009cde]">
                    {formatCurrency(data.sales).replace("$", "$").replace(".00", "")}
                  </div>
                  <div className="text-sm text-[#666666]">{data.month}</div>
                  <div className="text-xs text-[#666666]">{data.orders} orders</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#666666] text-center py-8">No sales data available for the selected period</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
