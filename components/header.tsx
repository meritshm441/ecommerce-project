"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingCart, Heart, Search, Menu, X, Home, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"
import { useFavorites } from "@/hooks/use-favorites"
import AuthStatus from "@/components/auth-status"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { items } = useCart()
  const { items: favorites } = useFavorites()
  const router = useRouter()
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
      setIsMenuOpen(false)
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-gray-900">
            Azushop
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden flex-1 max-w-md mx-8 md:flex">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
            </div>
          </form>

          {/* Desktop Navigation */}
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

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Auth Status - Single source of authentication UI */}
          <div className="flex items-center gap-4">
            <AuthStatus />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="border-t md:hidden">
            <div className="space-y-4 p-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4"
                />
              </form>

              {/* Mobile Navigation */}
              <nav className="space-y-2">
                <Link
                  href="/"
                  className="block py-2 text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>

                <Link
                  href="/shop"
                  className="block py-2 text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Shop
                </Link>

                <Link
                  href="/cart"
                  className="flex items-center justify-between py-2 text-sm font-medium hover:text-primary transition-colors relative"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>Cart</span>
                  {itemCount > 0 && (
                    <Badge variant="secondary" className="h-5 w-5 rounded-full p-0 text-xs bg-purple-600">
                      {itemCount}
                    </Badge>
                  )}
                </Link>

                <Link
                  href="/favorites"
                  className="flex items-center justify-between py-2 text-sm font-medium hover:text-primary transition-colors relative"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>Favourite</span>
                  {favorites.length > 0 && (
                    <Badge variant="secondary" className="h-5 w-5 rounded-full p-0 text-xs bg-red-500">
                      {favorites.length}
                    </Badge>
                  )}
                </Link>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
