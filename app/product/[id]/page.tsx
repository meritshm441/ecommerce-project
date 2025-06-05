"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Heart, Star, Truck, Shield, RotateCcw, ChevronLeft, Plus, Minus, Share2 } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useFavorites } from "@/hooks/use-favorites"
import { useToast } from "@/hooks/use-toast"
import { jhon, laptop2, laptop3, laptop4, macBookProM3Max, mike, sara } from "@/lib/constants/image"

// Mock product data
const product = {
  id: "1",
  name: "MacBook Pro 16-inch M3 Max",
  price: 2399.99,
  originalPrice: 2799.99,
  brand: "Apple",
  category: "laptops",
  images: [
    macBookProM3Max,
    laptop2,
    laptop3,
    laptop4,
  ],
  rating: 4.8,
  reviews: 124,
  inStock: 15,
  discount: 15,
  description:
    "The MacBook Pro 16-inch with M3 Max chip delivers exceptional performance for professionals. With its stunning Liquid Retina XDR display, advanced camera system, and all-day battery life, it's the ultimate creative powerhouse.",
  features: [
    "M3 Max chip with 12-core CPU and 30-core GPU",
    "16-inch Liquid Retina XDR display",
    "36GB unified memory",
    "1TB SSD storage",
    "1080p FaceTime HD camera",
    "Six-speaker sound system with force-cancelling woofers",
    "Up to 22 hours battery life",
  ],
  specifications: {
    Display: "16-inch Liquid Retina XDR",
    Processor: "Apple M3 Max chip",
    Memory: "36GB unified memory",
    Storage: "1TB SSD",
    Graphics: "30-core GPU",
    Camera: "1080p FaceTime HD",
    Audio: "Six-speaker system",
    Battery: "Up to 22 hours",
    Weight: "4.7 pounds (2.1 kg)",
    Dimensions: "14.01 x 9.77 x 0.66 inches",
  },
}

const reviews = [
  {
    id: 1,
    user: "John D.",
    avatar: jhon,
    rating: 5,
    date: "2024-01-15",
    title: "Exceptional Performance",
    content:
      "This MacBook Pro is absolutely incredible. The M3 Max chip handles everything I throw at it with ease. Perfect for video editing and development work.",
  },
  {
    id: 2,
    user: "Sarah M.",
    avatar: sara,
    rating: 5,
    date: "2024-01-10",
    title: "Best laptop I've ever owned",
    content:
      "The display quality is stunning and the battery life is amazing. Highly recommend for creative professionals.",
  },
  {
    id: 3,
    user: "Mike R.",
    avatar: mike,
    rating: 4,
    date: "2024-01-05",
    title: "Great but expensive",
    content: "Fantastic performance and build quality, but the price is quite high. Worth it if you need the power.",
  },
]

const ratingDistribution = [
  { stars: 5, count: 89, percentage: 72 },
  { stars: 4, count: 25, percentage: 20 },
  { stars: 3, count: 7, percentage: 6 },
  { stars: 2, count: 2, percentage: 1 },
  { stars: 1, count: 1, percentage: 1 },
]

export default function ProductDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const { addFavorite, removeFavorite, isFavorite } = useFavorites()
  const { toast } = useToast()

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images[0],
    })

    toast({
      title: "Added to Cart",
      description: `${quantity} ${product.name} added to your cart.`,
    })
  }

  const handleToggleFavorite = () => {
    if (isFavorite(product.id)) {
      removeFavorite(product.id)
      toast({
        title: "Removed from Favorites",
        description: "Product removed from your favorites.",
      })
    } else {
      addFavorite({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        brand: product.brand,
        category: product.category,
        image: product.images[0],
        rating: product.rating,
        reviews: product.reviews,
        inStock: product.inStock,
        discount: product.discount,
      })
      toast({
        title: "Added to Favorites",
        description: "Product added to your favorites.",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-purple-600">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-purple-600">
            Shop
          </Link>
          <span>/</span>
          <Link href={`/shop?category=${product.category}`} className="hover:text-purple-600">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        {/* Back Button */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Shop
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-lg overflow-hidden">
              <img
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? "border-purple-600" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-purple-600 font-medium">{product.brand}</p>
              <h1 className="text-3xl font-bold text-gray-900 mt-1">{product.name}</h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-lg font-medium">{product.rating}</span>
              </div>
              <span className="text-gray-600">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-purple-600">${product.price}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
                  <Badge className="bg-red-500 hover:bg-red-600">Save {product.discount}%</Badge>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <Badge variant={product.inStock > 0 ? "default" : "destructive"}>
                {product.inStock > 0 ? `${product.inStock} in stock` : "Out of stock"}
              </Badge>
              {product.inStock > 0 && product.inStock <= 5 && (
                <span className="text-orange-600 text-sm font-medium">Only {product.inStock} left!</span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">{product.description}</p>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.min(product.inStock, quantity + 1))}
                    disabled={quantity >= product.inStock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.inStock === 0}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-12"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" onClick={handleToggleFavorite} className="h-12 px-6">
                  <Heart
                    className={`h-5 w-5 ${isFavorite(product.id) ? "fill-current text-red-500" : "text-gray-500"}`}
                  />
                </Button>
                <Button variant="outline" className="h-12 px-6">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Key Features</h3>
              <div className="grid gap-2">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Info */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Truck className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-gray-600">On orders over $100</p>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                <p className="text-sm font-medium">2 Year Warranty</p>
                <p className="text-xs text-gray-600">Full coverage</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                <p className="text-sm font-medium">30-Day Returns</p>
                <p className="text-xs text-gray-600">No questions asked</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="specifications" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({product.reviews})</TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            </TabsList>

            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Technical Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                        <span className="font-medium text-gray-700">{key}</span>
                        <span className="text-gray-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Rating Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Reviews</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-purple-600">{product.rating}</div>
                      <div className="flex justify-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-600 mt-1">Based on {product.reviews} reviews</p>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      {ratingDistribution.map((rating) => (
                        <div key={rating.stars} className="flex items-center gap-2 text-sm">
                          <span className="w-8">{rating.stars}★</span>
                          <Progress value={rating.percentage} className="flex-1" />
                          <span className="w-8 text-gray-600">{rating.count}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Reviews List */}
                <div className="lg:col-span-2 space-y-6">
                  {reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarImage src={review.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{review.user.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{review.user}</h4>
                              <span className="text-sm text-gray-600">{review.date}</span>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="font-medium">{review.title}</span>
                            </div>
                            <p className="text-gray-700">{review.content}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="shipping" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Shipping & Returns</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Shipping Information</h4>
                    <ul className="space-y-1 text-gray-700">
                      <li>• Free standard shipping on orders over $100</li>
                      <li>• Express shipping available for $15</li>
                      <li>• Standard delivery: 3-5 business days</li>
                      <li>• Express delivery: 1-2 business days</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Return Policy</h4>
                    <ul className="space-y-1 text-gray-700">
                      <li>• 30-day return window</li>
                      <li>• Items must be in original condition</li>
                      <li>• Free return shipping</li>
                      <li>• Refunds processed within 5-7 business days</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Warranty</h4>
                    <ul className="space-y-1 text-gray-700">
                      <li>• 2-year manufacturer warranty</li>
                      <li>• Covers defects in materials and workmanship</li>
                      <li>• Extended warranty options available</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
