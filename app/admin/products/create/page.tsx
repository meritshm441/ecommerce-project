"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function CreateProductPage() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    brand: "",
    countInStock: "",
    category: "",
    description: "",
    image: null as File | null,
  })
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Simulate product creation
    toast({
      title: "Product Created",
      description: "Your product has been successfully created.",
    })

    // Reset form
    setFormData({
      name: "",
      price: "",
      quantity: "",
      brand: "",
      countInStock: "",
      category: "",
      description: "",
      image: null,
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }))
    }
  }

  return (
    <div className="min-h-screen bg-[#f9fbfc] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-[#000000] hover:text-[#009cde] mb-6"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Link>

        {/* Breadcrumb */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/products" className="text-[#666666] hover:text-[#009cde]">
            Products
          </Link>
          <span className="text-[#009cde] font-medium">Create Product</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <Card className="bg-[#e6eff5] border-0">
            <CardContent className="p-12">
              <div className="text-center">
                <input type="file" id="image" accept="image/*" onChange={handleFileChange} className="hidden" />
                <label htmlFor="image">
                  <Button
                    type="button"
                    className="bg-[#009cde] hover:bg-[#01589a] text-white px-8 py-3"
                    onClick={() => document.getElementById("image")?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose file
                  </Button>
                </label>
                {formData.image && <p className="mt-2 text-sm text-[#666666]">{formData.image.name}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Form Fields */}
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              className="bg-[#e6eff5] border-0 placeholder:text-[#999999] h-12"
              required
            />
            <Input
              placeholder="Price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
              className="bg-[#e6eff5] border-0 placeholder:text-[#999999] h-12"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Input
              placeholder="Quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData((prev) => ({ ...prev, quantity: e.target.value }))}
              className="bg-[#e6eff5] border-0 placeholder:text-[#999999] h-12"
              required
            />
            <Input
              placeholder="Brand"
              value={formData.brand}
              onChange={(e) => setFormData((prev) => ({ ...prev, brand: e.target.value }))}
              className="bg-[#e6eff5] border-0 placeholder:text-[#999999] h-12"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Input
              placeholder="Count in stock"
              type="number"
              value={formData.countInStock}
              onChange={(e) => setFormData((prev) => ({ ...prev, countInStock: e.target.value }))}
              className="bg-[#e6eff5] border-0 placeholder:text-[#999999] h-12"
              required
            />
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="bg-[#e6eff5] border-0 h-12">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="books">Books</SelectItem>
                <SelectItem value="home">Home & Garden</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            className="bg-[#e6eff5] border-0 placeholder:text-[#999999] min-h-32"
            required
          />

          <Button type="submit" className="bg-[#003087] hover:bg-[#172b85] text-white w-full md:w-auto px-12 py-3 h-12">
            Submit
          </Button>
        </form>
      </div>
    </div>
  )
}
