"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Eye, Mail, Ban, RefreshCw, Users, UserCheck, UserX } from "lucide-react"
import { userAPI, orderAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface Customer {
  _id: string
  username: string
  email: string
  profilePicture?: string
  isAdmin: boolean
  createdAt: string
  orders?: number
  totalSpent?: number
  lastOrder?: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadCustomers()
  }, [])

  useEffect(() => {
    // Filter customers based on search term
    const filtered = customers.filter(
      (customer) =>
        customer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredCustomers(filtered)
  }, [customers, searchTerm])

  const loadCustomers = async () => {
    try {
      setLoading(true)
      const [users, orders] = await Promise.all([userAPI.getAllUsers(), orderAPI.getAllOrders()])

      const usersArray = Array.isArray(users) ? users : []
      const ordersArray = Array.isArray(orders) ? orders : []

      // Calculate customer statistics
      const customersWithStats = usersArray.map((user: any) => {
        const userOrders = ordersArray.filter((order: any) => order.user?._id === user._id)
        const totalSpent = userOrders.reduce((sum: number, order: any) => sum + (order.totalPrice || 0), 0)
        const lastOrder =
          userOrders.length > 0
            ? userOrders.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
                .createdAt
            : null

        return {
          ...user,
          orders: userOrders.length,
          totalSpent,
          lastOrder,
        }
      })

      setCustomers(customersWithStats)
      setFilteredCustomers(customersWithStats)
    } catch (error: any) {
      console.error("Error loading customers:", error)
      toast({
        title: "Error",
        description: "Failed to load customers. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleAdminStatus = async (userId: string, currentAdminStatus: boolean) => {
    try {
      setUpdating(userId)
      await userAPI.updateUser(userId, { isAdmin: !currentAdminStatus })

      // Update local state
      setCustomers((prev) =>
        prev.map((customer) => (customer._id === userId ? { ...customer, isAdmin: !currentAdminStatus } : customer)),
      )

      toast({
        title: "User Updated",
        description: `User ${!currentAdminStatus ? "promoted to" : "removed from"} admin status.`,
      })
    } catch (error: any) {
      console.error("Error updating user:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update user.",
        variant: "destructive",
      })
    } finally {
      setUpdating(null)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return
    }

    try {
      setUpdating(userId)
      await userAPI.deleteUser(userId)

      // Remove user from local state
      setCustomers((prev) => prev.filter((customer) => customer._id !== userId))

      toast({
        title: "User Deleted",
        description: "User has been successfully deleted.",
      })
    } catch (error: any) {
      console.error("Error deleting user:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete user.",
        variant: "destructive",
      })
    } finally {
      setUpdating(null)
    }
  }

  const calculateStats = () => {
    const totalCustomers = customers.length
    const activeCustomers = customers.filter((c) => (c.orders || 0) > 0).length
    const adminUsers = customers.filter((c) => c.isAdmin).length
    const avgOrderValue =
      customers.length > 0
        ? customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0) /
            customers.filter((c) => (c.orders || 0) > 0).length || 0
        : 0

    return { totalCustomers, activeCustomers, adminUsers, avgOrderValue }
  }

  const stats = calculateStats()

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-[#000000]">Customers</h1>
          <p className="text-[#666666]">Loading customers...</p>
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
          <h1 className="text-3xl font-bold text-[#000000]">Customers</h1>
          <p className="text-[#666666]">Manage your customer base and relationships</p>
        </div>
        <Button variant="outline" onClick={loadCustomers} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#000000]">{stats.totalCustomers}</div>
            <p className="text-xs text-[#666666]">Registered users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Active Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#000000]">{stats.activeCustomers}</div>
            <p className="text-xs text-[#666666]">Have placed orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Admin Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#009cde]">{stats.adminUsers}</div>
            <p className="text-xs text-[#666666]">Admin privileges</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Avg. Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#000000]">${stats.avgOrderValue.toFixed(2)}</div>
            <p className="text-xs text-[#666666]">Per customer</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#666666] h-4 w-4" />
            <Input
              placeholder="Search customers by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Customers ({filteredCustomers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCustomers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Last Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={customer.profilePicture || "/placeholder.svg?height=40&width=40"}
                            alt={customer.username}
                          />
                          <AvatarFallback>
                            {customer.username
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-[#000000] flex items-center gap-2">
                            {customer.username}
                            {customer.isAdmin && (
                              <Badge variant="secondary" className="text-xs">
                                Admin
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-[#666666]">{customer.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-[#666666]">{customer.orders || 0} orders</TableCell>
                    <TableCell className="font-medium text-[#000000]">
                      ${(customer.totalSpent || 0).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-[#666666]">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-[#666666]">
                      {customer.lastOrder ? new Date(customer.lastOrder).toLocaleDateString() : "Never"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={(customer.orders || 0) > 0 ? "default" : "secondary"}>
                        {(customer.orders || 0) > 0 ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" disabled={updating === customer._id}>
                            {updating === customer._id ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <MoreHorizontal className="h-4 w-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleAdminStatus(customer._id, customer.isAdmin)}>
                            {customer.isAdmin ? (
                              <>
                                <UserX className="h-4 w-4 mr-2" />
                                Remove Admin
                              </>
                            ) : (
                              <>
                                <UserCheck className="h-4 w-4 mr-2" />
                                Make Admin
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteUser(customer._id)}>
                            <Ban className="h-4 w-4 mr-2" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "No customers found" : "No customers yet"}
              </h3>
              <p className="text-gray-600">
                {searchTerm
                  ? `No customers match "${searchTerm}". Try a different search term.`
                  : "Customer accounts will appear here when users register."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
