"use client"

import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Home, ShoppingBag, ShoppingCart, Heart } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useFavorites } from "@/hooks/use-favorites"
import AuthStatus from "@/components/auth-status"

export function Header() {
  const { items } = useCart()
  const { items: favorites } = useFavorites()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-gray-900">
            Azushop
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors">
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link
              href="/shop"
              className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors"
            >
              <ShoppingBag className="h-4 w-4" />
              Shop
            </Link>
            <Link
              href="/cart"
              className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors relative"
            >
              <ShoppingCart className="h-4 w-4" />
              Cart
              {itemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-purple-600"
                >
                  {itemCount}
                </Badge>
              )}
            </Link>
            <Link
              href="/favorites"
              className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors relative"
            >
              <Heart className="h-4 w-4" />
              Favourite
              {favorites.length > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500"
                >
                  {favorites.length}
                </Badge>
              )}
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {/* Auth Status */}
            <AuthStatus />
          </div>
        </div>
      </div>
    </header>
  )
}
