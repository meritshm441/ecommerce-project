"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { ShoppingCart, Heart, Search, Filter, Star, Grid, List } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useFavorites } from "@/hooks/use-favorites"
import { useToast } from "@/hooks/use-toast"
import { canonEosR5, dell, iPhone14Pro, macBookProM3Max, samsungGalaxyS23Ultra, sonyWh1000xm5 } from "@/lib/constants/image"

const products = [
  {
    id: "1",
    name: "MacBook Pro 16-inch M3 Max",
    price: 2399.99,
    originalPrice: 2799.99,
    brand: "Apple",
    category: "laptops",
    image: macBookProM3Max,
    rating: 4.8,
    reviews: 124,
    inStock: 15,
    discount: 15,
    featured: true,
  },
  {
    id: "2",
    name: "iPhone 15 Pro Max 256GB",
    price: 1199.99,
    originalPrice: 1299.99,
    brand: "Apple",
    category: "phones",
    image: iPhone14Pro,
    rating: 4.9,
    reviews: 89,
    inStock: 8,
    discount: 8,
    featured: true,
  },
  {
    id: "3",
    name: "Canon EOS R5 Mirrorless Camera",
    price: 3899.99,
    originalPrice: 4299.99,
    brand: "Canon",
    category: "cameras",
    image: canonEosR5,
    rating: 4.7,
    reviews: 56,
    inStock: 0,
    discount: 10,
    featured: false,
  },
  {
    id: "4",
    name: "Sony WH-1000XM5 Wireless Headphones",
    price: 349.99,
    originalPrice: 399.99,
    brand: "Sony",
    category: "audio",
    image: sonyWh1000xm5,
    rating: 4.6,
    reviews: 203,
    inStock: 25,
    discount: 12,
    featured: false,
  },
  {
    id: "5",
    name: "Dell XPS 13 Plus Laptop",
    price: 1299.99,
    originalPrice: 1499.99,
    brand: "Dell",
    category: "laptops",
    image: dell,
    rating: 4.5,
    reviews: 78,
    inStock: 12,
    discount: 13,
    featured: false,
  },
  {
    id: "6",
    name: "Samsung Galaxy S24 Ultra",
    price: 1099.99,
    originalPrice: 1199.99,
    brand: "Samsung",
    category: "phones",
    image: samsungGalaxyS23Ultra,
    rating: 4.7,
    reviews: 156,
    inStock: 18,
    discount: 8,
    featured: true,
  },
]

export default function ShopPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [brandFilter, setBrandFilter] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const { addItem } = useCart()
  const { addFavorite, removeFavorite, isFavorite } = useFavorites()
  const { toast } = useToast()

  const brands = ["Apple", "Samsung", "Sony", "Canon", "Dell"]

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
      const matchesBrand = brandFilter.length === 0 || brandFilter.includes(product.brand)
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      return matchesSearch && matchesCategory && matchesBrand && matchesPrice
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "name":
          return a.name.localeCompare(b.name)
        default:
          return b.featured ? 1 : -1
      }
    })

  const handleAddToCart = (product: (typeof products)[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    })

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const handleToggleFavorite = (product: (typeof products)[0]) => {
    if (isFavorite(product.id)) {
      removeFavorite(product.id)
      toast({
        title: "Removed from Favorites",
        description: `${product.name} has been removed from your favorites.`,
      })
    } else {
      addFavorite({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        brand: product.brand,
        category: product.category,
        image: product.image,
        rating: product.rating,
        reviews: product.reviews,
        inStock: product.inStock,
        discount: product.discount,
      })
      toast({
        title: "Added to Favorites",
        description: `${product.name} has been added to your favorites.`,
      })
    }
  }

  const toggleBrandFilter = (brand: string) => {
    setBrandFilter((prev) => (prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Shop</h1>
          <p className="text-gray-600">Discover our latest collection of premium electronics</p>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="laptops">Laptops</SelectItem>
                <SelectItem value="phones">Phones</SelectItem>
                <SelectItem value="cameras">Cameras</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Filter Toggle */}
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Brand Filter */}
              <div>
                <h3 className="font-semibold mb-3">Brand</h3>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <div key={brand} className="flex items-center space-x-2">
                      <Checkbox
                        id={brand}
                        checked={brandFilter.includes(brand)}
                        onCheckedChange={() => toggleBrandFilter(brand)}
                      />
                      <label htmlFor={brand} className="text-sm">
                        {brand}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold mb-3">Price Range</h3>
                <div className="space-y-4">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={5000}
                    min={0}
                    step={50}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </div>

        {/* Products Grid */}
        <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className={`group hover:shadow-xl transition-all duration-300 overflow-hidden ${
                viewMode === "list" ? "flex flex-row" : ""
              }`}
            >
              <CardHeader className={`p-0 relative ${viewMode === "list" ? "w-48 flex-shrink-0" : ""}`}>
                <Link href={`/product/${product.id}`}>
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
                      viewMode === "list" ? "w-full h-full" : "w-full h-64"
                    }`}
                  />
                </Link>
                {product.discount > 0 && (
                  <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600">-{product.discount}%</Badge>
                )}
                {product.featured && (
                  <Badge className="absolute top-3 right-3 bg-gradient-to-r from-purple-600 to-blue-600">
                    Featured
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className={`absolute bottom-3 right-3 bg-white/80 hover:bg-white transition-colors ${
                    isFavorite(product.id) ? "text-red-500" : "text-gray-500 hover:text-red-500"
                  }`}
                  onClick={() => handleToggleFavorite(product)}
                >
                  <Heart className={`h-4 w-4 ${isFavorite(product.id) ? "fill-current" : ""}`} />
                </Button>
              </CardHeader>

              <div className={viewMode === "list" ? "flex-1 flex flex-col" : ""}>
                <CardContent className="p-4 flex-1">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">{product.brand}</p>
                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-semibold text-gray-900 hover:text-purple-600 transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-purple-600">${product.price}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                      )}
                    </div>

                    {/* Stock Status */}
                    <Badge variant={product.inStock > 0 ? "default" : "destructive"} className="text-xs">
                      {product.inStock > 0 ? `${product.inStock} in stock` : "Out of stock"}
                    </Badge>
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0">
                  <Button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.inStock === 0}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
