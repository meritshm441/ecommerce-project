"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Trash2, Star } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useFavorites } from "@/hooks/use-favorites"
import { useToast } from "@/hooks/use-toast"

export default function FavoritesPage() {
  const { items: favorites, removeFavorite } = useFavorites()
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleRemoveFavorite = (productId: string) => {
    removeFavorite(productId)
    toast({
      title: "Removed from Favorites",
      description: "Product has been removed from your favorites.",
    })
  }

  const addToCart = (product: (typeof favorites)[0]) => {
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

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
            <Heart className="w-12 h-12 text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Your favorites list is empty</h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Start adding products to your favorites by clicking the heart icon on any product.
          </p>
          <Link href="/shop">
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Favorites</h1>
          <p className="text-gray-600">
            You have {favorites.length} item{favorites.length !== 1 ? "s" : ""} in your favorites
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((product) => (
            <Card key={product.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <CardHeader className="p-0 relative">
                <Link href={`/product/${product.id}`}>
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                {product.discount && product.discount > 0 && (
                  <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600">-{product.discount}%</Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-3 right-3 bg-white/80 hover:bg-white text-red-500 hover:text-red-600"
                  onClick={() => handleRemoveFavorite(product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>

              <CardContent className="p-4">
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
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
                    )}
                  </div>

                  {/* Stock Status */}
                  <Badge variant={product.inStock > 0 ? "default" : "destructive"} className="text-xs">
                    {product.inStock > 0 ? "In Stock" : "Out of Stock"}
                  </Badge>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0 space-y-2">
                <Button
                  onClick={() => addToCart(product)}
                  disabled={product.inStock === 0}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
