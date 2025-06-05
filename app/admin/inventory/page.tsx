"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, AlertTriangle, Package, TrendingDown } from "lucide-react"

const inventory = [
  {
    id: 1,
    name: "MacBook Pro 16-inch M3 Max",
    sku: "MBP-16-M3-001",
    category: "Laptops",
    currentStock: 15,
    minStock: 5,
    maxStock: 50,
    status: "In Stock",
    lastRestocked: "2024-01-10",
    supplier: "Apple Inc.",
  },
  {
    id: 2,
    name: "iPhone 15 Pro Max 256GB",
    sku: "IP15-PM-256-001",
    category: "Phones",
    currentStock: 3,
    minStock: 10,
    maxStock: 100,
    status: "Low Stock",
    lastRestocked: "2024-01-08",
    supplier: "Apple Inc.",
  },
  {
    id: 3,
    name: "Canon EOS R5 Camera",
    sku: "CAN-R5-001",
    category: "Cameras",
    currentStock: 0,
    minStock: 3,
    maxStock: 20,
    status: "Out of Stock",
    lastRestocked: "2023-12-15",
    supplier: "Canon USA",
  },
  {
    id: 4,
    name: "Sony WH-1000XM5 Headphones",
    sku: "SNY-WH1000-001",
    category: "Audio",
    currentStock: 25,
    minStock: 15,
    maxStock: 75,
    status: "In Stock",
    lastRestocked: "2024-01-12",
    supplier: "Sony Electronics",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "In Stock":
      return "bg-green-100 text-green-800"
    case "Low Stock":
      return "bg-yellow-100 text-yellow-800"
    case "Out of Stock":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const lowStockItems = inventory.filter((item) => item.currentStock <= item.minStock && item.currentStock > 0).length
  const outOfStockItems = inventory.filter((item) => item.currentStock === 0).length
  const totalValue = inventory.reduce((sum, item) => sum + item.currentStock * 100, 0) // Simplified calculation

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#000000]">Inventory Management</h1>
        <p className="text-[#666666]">Track and manage your product inventory levels</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Total Products</CardTitle>
            <Package className="h-4 w-4 text-[#009cde]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#000000]">{inventory.length}</div>
            <p className="text-xs text-[#666666]">Items in inventory</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-[#f79e1b]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#f79e1b]">{lowStockItems}</div>
            <p className="text-xs text-[#666666]">Need restocking</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Out of Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-[#ff5f00]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#ff5f00]">{outOfStockItems}</div>
            <p className="text-xs text-[#666666]">Urgent attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Inventory Value</CardTitle>
            <Package className="h-4 w-4 text-[#009cde]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#000000]">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-[#666666]">Total stock value</p>
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
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 outline-none"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="In Stock">In Stock</SelectItem>
                <SelectItem value="Low Stock">Low Stock</SelectItem>
                <SelectItem value="Out of Stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Min/Max</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Restocked</TableHead>
                <TableHead>Supplier</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium text-[#000000]">{item.name}</TableCell>
                  <TableCell className="text-[#666666]">{item.sku}</TableCell>
                  <TableCell className="text-[#666666]">{item.category}</TableCell>
                  <TableCell>
                    <div className="font-medium text-[#000000]">{item.currentStock} units</div>
                  </TableCell>
                  <TableCell className="text-[#666666]">
                    {item.minStock} / {item.maxStock}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                  </TableCell>
                  <TableCell className="text-[#666666]">{item.lastRestocked}</TableCell>
                  <TableCell className="text-[#666666]">{item.supplier}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
