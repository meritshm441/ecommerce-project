"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Tag, RefreshCw } from "lucide-react"
import { categoryAPI, productAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface Category {
  _id: string
  name: string
  description?: string
  slug?: string
  createdAt?: string
  productCount?: number
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    // Filter categories based on search term
    const filtered = categories.filter((category) => category.name.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredCategories(filtered)
  }, [categories, searchTerm])

  const loadCategories = async () => {
    try {
      setLoading(true)
      const [categoriesData, productsData] = await Promise.all([
        categoryAPI.getAllCategories(),
        productAPI.getAllProducts(),
      ])

      const categoriesArray = Array.isArray(categoriesData) ? categoriesData : []
      const productsArray = Array.isArray(productsData) ? productsData : []

      // Calculate product count for each category
      const categoriesWithCount = categoriesArray.map((category: any) => ({
        ...category,
        productCount: productsArray.filter(
          (product: any) => product.category?._id === category._id || product.category === category._id,
        ).length,
      }))

      setCategories(categoriesWithCount)
      setFilteredCategories(categoriesWithCount)
    } catch (error: any) {
      console.error("Error loading categories:", error)
      toast({
        title: "Error",
        description: "Failed to load categories. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveCategory = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Category name is required.",
        variant: "destructive",
      })
      return
    }

    try {
      setSaving(true)

      if (editingCategory) {
        // Update existing category
        const updatedCategory = await categoryAPI.updateCategory(editingCategory._id, {
          name: formData.name.trim(),
        })

        // Update local state
        setCategories((prev) =>
          prev.map((cat) =>
            cat._id === editingCategory._id
              ? { ...cat, name: formData.name.trim(), description: formData.description.trim() }
              : cat,
          ),
        )

        toast({
          title: "Category Updated",
          description: "Category has been updated successfully.",
        })
      } else {
        // Create new category
        const newCategory = await categoryAPI.createCategory({
          name: formData.name.trim(),
        })

        // Add to local state
        const categoryWithCount = {
          ...newCategory,
          productCount: 0,
          description: formData.description.trim(),
        }
        setCategories((prev) => [...prev, categoryWithCount])

        toast({
          title: "Category Created",
          description: "New category has been created successfully.",
        })
      }

      // Reset form and close dialog
      setFormData({ name: "", description: "" })
      setEditingCategory(null)
      setIsDialogOpen(false)
    } catch (error: any) {
      console.error("Error saving category:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save category.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      description: category.description || "",
    })
    setIsDialogOpen(true)
  }

  const handleDeleteCategory = async (categoryId: string) => {
    const category = categories.find((c) => c._id === categoryId)

    if (category && (category.productCount || 0) > 0) {
      toast({
        title: "Cannot Delete Category",
        description: "This category has products assigned to it. Please reassign or delete the products first.",
        variant: "destructive",
      })
      return
    }

    if (!confirm("Are you sure you want to delete this category?")) {
      return
    }

    try {
      setDeleting(categoryId)
      await categoryAPI.deleteCategory(categoryId)

      // Remove from local state
      setCategories((prev) => prev.filter((cat) => cat._id !== categoryId))

      toast({
        title: "Category Deleted",
        description: "Category has been deleted successfully.",
      })
    } catch (error: any) {
      console.error("Error deleting category:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete category.",
        variant: "destructive",
      })
    } finally {
      setDeleting(null)
    }
  }

  const calculateStats = () => {
    const totalCategories = categories.length
    const activeCategories = categories.filter((c) => (c.productCount || 0) > 0).length
    const emptyCategories = categories.filter((c) => (c.productCount || 0) === 0).length
    const mostPopular = categories.reduce(
      (prev, current) => ((prev.productCount || 0) > (current.productCount || 0) ? prev : current),
      categories[0],
    )

    return { totalCategories, activeCategories, emptyCategories, mostPopular }
  }

  const stats = calculateStats()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#000000]">Categories</h1>
            <p className="text-[#666666]">Loading categories...</p>
          </div>
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
          <h1 className="text-3xl font-bold text-[#000000]">Categories</h1>
          <p className="text-[#666666]">Organize your products into categories</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadCategories} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-[#009cde] hover:bg-[#01589a]"
                onClick={() => {
                  setEditingCategory(null)
                  setFormData({ name: "", description: "" })
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingCategory ? "Edit Category" : "Create New Category"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Category Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter category name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Category description (optional)"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false)
                      setEditingCategory(null)
                      setFormData({ name: "", description: "" })
                    }}
                    className="flex-1"
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveCategory}
                    className="flex-1 bg-[#009cde] hover:bg-[#01589a]"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : editingCategory ? "Update" : "Create"} Category
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Total Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#000000]">{stats.totalCategories}</div>
            <p className="text-xs text-[#666666]">All product categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Active Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#000000]">{stats.activeCategories}</div>
            <p className="text-xs text-[#666666]">With products</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Empty Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#f79e1b]">{stats.emptyCategories}</div>
            <p className="text-xs text-[#666666]">No products assigned</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[#666666]">Most Popular</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#009cde]">{stats.mostPopular?.name || "None"}</div>
            <p className="text-xs text-[#666666]">{stats.mostPopular?.productCount || 0} products</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#666666] h-4 w-4" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Categories ({filteredCategories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCategories.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#e6eff5] rounded-lg flex items-center justify-center">
                          <Tag className="h-6 w-6 text-[#009cde]" />
                        </div>
                        <div>
                          <div className="font-medium text-[#000000]">{category.name}</div>
                          {category.description && (
                            <div className="text-sm text-[#666666] max-w-xs truncate">{category.description}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-[#666666]">{category.productCount || 0} products</TableCell>
                    <TableCell className="text-[#666666]">
                      {category.createdAt ? new Date(category.createdAt).toLocaleDateString() : "Unknown"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={(category.productCount || 0) > 0 ? "default" : "secondary"}>
                        {(category.productCount || 0) > 0 ? "Active" : "Empty"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" disabled={deleting === category._id}>
                            {deleting === category._id ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <MoreHorizontal className="h-4 w-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Category
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteCategory(category._id)}
                            disabled={deleting === category._id}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Category
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
              <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "No categories found" : "No categories yet"}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm
                  ? `No categories match "${searchTerm}". Try a different search term.`
                  : "Get started by creating your first product category."}
              </p>
              {!searchTerm && (
                <Button
                  className="bg-[#009cde] hover:bg-[#01589a]"
                  onClick={() => {
                    setEditingCategory(null)
                    setFormData({ name: "", description: "" })
                    setIsDialogOpen(true)
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Category
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
