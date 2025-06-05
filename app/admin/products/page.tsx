"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { canonEosR5, iPhone14Pro, macBookProM3Max, sonyWh1000xm5 } from "@/lib/constants/image"

const products = [
  {
    id: 1,
    name: "MacBook Pro 16-inch M3 Max",
    sku: "MBP-16-M3-001",
    category: "Laptops",
    price: 2399.99,
    stock: 15,
    status: "Active",
    image: macBookProM3Max,
    sales: 24,
  },
  {
    id: 2,
    name: "iPhone 15 Pro Max 256GB",
    sku: "IP15-PM-256-001",
    category: "Phones",
    price: 1199.99,
    stock: 8,
    status: "Active",
    image: iPhone14Pro,
    sales: 89,
  },
  {
    id: 3,
    name: "Canon EOS R5 Camera",
    sku: "CAN-R5-001",
    category: "Cameras",
    price: 3899.99,
    stock: 0,
    status: "Out of Stock",
    image: canonEosR5,
    sales: 12,
  },
  {
    id: 4,
    name: "Sony WH-1000XM5 Headphones",
    sku: "SNY-WH1000-001",
    category: "Audio",
    price: 349.99,
    stock: 25,
    status: "Active",
    image: sonyWh1000xm5,
    sales: 156,
  },
]

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#000000]">Products</h1>
          <p className="text-[#666666]">Manage your product catalog</p>
        </div>
        <Link href="/admin/products/create">
          <Button className="bg-[#009cde] hover:bg-[#01589a]">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#000000]">24</div>
            <p className="text-xs text-[#666666]">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Active Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#000000]">21</div>
            <p className="text-xs text-[#666666]">87.5% of total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#ff5f00]">3</div>
            <p className="text-xs text-[#666666]">Need restocking</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Low Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#f79e1b]">5</div>
            <p className="text-xs text-[#666666]">Below 10 units</p>
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
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <div className="font-medium text-[#000000]">{product.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-[#666666]">{product.sku}</TableCell>
                  <TableCell className="text-[#666666]">{product.category}</TableCell>
                  <TableCell className="font-medium text-[#000000]">${product.price}</TableCell>
                  <TableCell>
                    <Badge variant={product.stock > 10 ? "default" : product.stock > 0 ? "secondary" : "destructive"}>
                      {product.stock} units
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[#666666]">{product.sales} sold</TableCell>
                  <TableCell>
                    <Badge variant={product.status === "Active" ? "default" : "destructive"}>{product.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
