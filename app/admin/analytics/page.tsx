"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package } from "lucide-react"

const salesData = [
  { month: "Jan", sales: 12000, orders: 145 },
  { month: "Feb", sales: 15000, orders: 178 },
  { month: "Mar", sales: 18000, orders: 203 },
  { month: "Apr", sales: 22000, orders: 245 },
  { month: "May", sales: 19000, orders: 221 },
  { month: "Jun", sales: 25000, orders: 289 },
]

const topProducts = [
  { name: "iPhone 15 Pro Max", sales: 89, revenue: 106788, growth: 12 },
  { name: "MacBook Pro M3", sales: 45, revenue: 107955, growth: 8 },
  { name: "Sony Headphones", sales: 156, revenue: 54594, growth: -3 },
  { name: "Canon Camera", sales: 23, revenue: 89698, growth: 15 },
]

const topCategories = [
  { name: "Phones", percentage: 35, revenue: 156000 },
  { name: "Laptops", percentage: 28, revenue: 124000 },
  { name: "Audio", percentage: 20, revenue: 89000 },
  { name: "Cameras", percentage: 17, revenue: 76000 },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#000000]">Analytics</h1>
        <p className="text-[#666666]">Track your business performance and insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-[#009cde]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#000000]">$45,231</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +20.1% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-[#009cde]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#000000]">+2,350</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +180.1% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Customers</CardTitle>
            <Users className="h-4 w-4 text-[#009cde]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#000000]">+12,234</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              +19% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Products Sold</CardTitle>
            <Package className="h-4 w-4 text-[#009cde]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#000000]">+573</div>
            <div className="flex items-center text-xs text-red-600">
              <TrendingDown className="h-3 w-3 mr-1" />
              -2% from last month
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
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-medium text-[#000000]">{product.name}</div>
                  <div className="text-sm text-[#666666]">{product.sales} units sold</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-[#000000]">${product.revenue.toLocaleString()}</div>
                  <div
                    className={`text-xs flex items-center ${product.growth > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {product.growth > 0 ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(product.growth)}%
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topCategories.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#000000]">{category.name}</span>
                  <span className="text-sm text-[#666666]">${category.revenue.toLocaleString()}</span>
                </div>
                <Progress value={category.percentage} className="h-2" />
                <div className="text-xs text-[#666666]">{category.percentage}% of total sales</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Sales Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-6 gap-4">
            {salesData.map((data, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-[#009cde]">${(data.sales / 1000).toFixed(0)}k</div>
                <div className="text-sm text-[#666666]">{data.month}</div>
                <div className="text-xs text-[#666666]">{data.orders} orders</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
