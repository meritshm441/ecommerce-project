"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Eye, Package, CheckCircle, RefreshCw } from "lucide-react"
import { orderAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface Order {
  _id: string
  user: {
    _id: string
    username: string
    email: string
  }
  orderItems: Array<{
    name: string
    quantity: number
    price: number
    product: string
  }>
  shippingAddress: {
    address: string
    city: string
    postalCode: string
    country: string
  }
  paymentMethod: string
  totalPrice: number
  isPaid: boolean
  isDelivered: boolean
  paidAt?: string
  deliveredAt?: string
  createdAt: string
}

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  Processing: "bg-blue-100 text-blue-800",
  Paid: "bg-green-100 text-green-800",
  Shipped: "bg-purple-100 text-purple-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    // Filter orders based on search term and status
    const filtered = orders.filter((order) => {
      const matchesSearch =
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user.email.toLowerCase().includes(searchTerm.toLowerCase())

      const orderStatus = getOrderStatus(order)
      const matchesStatus = statusFilter === "all" || orderStatus === statusFilter

      return matchesSearch && matchesStatus
    })

    setFilteredOrders(filtered)
  }, [orders, searchTerm, statusFilter])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const data = await orderAPI.getAllOrders()
      const ordersArray = Array.isArray(data) ? data : []
      setOrders(ordersArray)
      setFilteredOrders(ordersArray)
    } catch (error: any) {
      console.error("Error loading orders:", error)
      toast({
        title: "Error",
        description: "Failed to load orders. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getOrderStatus = (order: Order) => {
    if (order.isDelivered) return "Delivered"
    if (order.isPaid) return "Paid"
    return "Pending"
  }

  const handleMarkAsDelivered = async (orderId: string) => {
    try {
      setUpdating(orderId)
      await orderAPI.markAsDelivered(orderId)

      // Update local state
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, isDelivered: true, deliveredAt: new Date().toISOString() } : order,
        ),
      )

      toast({
        title: "Order Updated",
        description: "Order has been marked as delivered.",
      })
    } catch (error: any) {
      console.error("Error updating order:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update order.",
        variant: "destructive",
      })
    } finally {
      setUpdating(null)
    }
  }

  const calculateStats = () => {
    const totalOrders = orders.length
    const pendingOrders = orders.filter((order) => !order.isPaid).length
    const processingOrders = orders.filter((order) => order.isPaid && !order.isDelivered).length
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0)

    return { totalOrders, pendingOrders, processingOrders, totalRevenue }
  }

  const stats = calculateStats()

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#000000]">Orders</h1>
          <p className="text-[#666666]">Loading orders...</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-[#009cde]" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#000000]">Orders</h1>
          <p className="text-[#666666]">Manage customer orders and fulfillment</p>
        </div>
        <Button variant="outline" onClick={loadOrders} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#000000]">{stats.totalOrders}</div>
            <p className="text-xs text-[#666666]">All time orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Pending Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#f79e1b]">{stats.pendingOrders}</div>
            <p className="text-xs text-[#666666]">Need attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#009cde]">{stats.processingOrders}</div>
            <p className="text-xs text-[#666666]">Being prepared</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#000000]">${stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-[#666666]">Total revenue</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#666666] h-4 w-4" />
              <Input
                placeholder="Search orders by ID, customer name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredOrders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const status = getOrderStatus(order)
                  return (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium text-[#009cde]">{order._id.slice(-8).toUpperCase()}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-[#000000]">{order.user.username}</div>
                          <div className="text-sm text-[#666666]">{order.user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-[#666666]">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-[#666666]">{order.orderItems.length} items</TableCell>
                      <TableCell className="font-medium text-[#000000]">${order.totalPrice.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[status as keyof typeof statusColors]}>{status}</Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" disabled={updating === order._id}>
                              {updating === order._id ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <MoreHorizontal className="h-4 w-4" />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {order.isPaid && !order.isDelivered && (
                              <DropdownMenuItem onClick={() => handleMarkAsDelivered(order._id)}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Mark as Delivered
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || statusFilter !== "all" ? "No orders found" : "No orders yet"}
              </h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== "all"
                  ? "No orders match your current filters."
                  : "Orders will appear here when customers make purchases."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
