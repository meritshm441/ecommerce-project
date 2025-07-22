import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Truck, Palette, Gem } from "lucide-react"
import { HeroSlideshow } from "@/components/hero-slideshow"
import { canonEosR5, iPhone14Pro, macBookProM3Max } from "@/lib/constants/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Slideshow Section */}
      <HeroSlideshow />

      {/* Top Trending Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Top Trending Products</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover the latest must-have items that are taking the market by storm. Stay ahead with our curated
              collection of trending products designed to elevate your lifestyle.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Macbook Card */}
            <Card className="group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-gray-50 to-gray-100">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900">Macbook</h3>
                  <p className="text-lg text-gray-600">Up to 50% off laptop</p>
                  <div className="flex justify-center py-8">
                    <img
                      src={macBookProM3Max || "/placeholder.svg"}
                      alt="MacBook"
                      className="w-full max-w-xs group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <Link href="/shop?category=laptops">
                    <Button
                      variant="ghost"
                      className="w-full justify-between text-gray-900 hover:text-purple-600 font-semibold"
                    >
                      Shop now
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* iPhone Card */}
            <Card className="group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-cyan-50">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900">Iphones</h3>
                  <p className="text-lg text-gray-600">Free shipping</p>
                  <div className="flex justify-center py-8">
                    <img
                      src={iPhone14Pro || "/placeholder.svg"}
                      alt="iPhone"
                      className="w-full max-w-xs group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <Link href="/shop?category=phones">
                    <Button
                      variant="ghost"
                      className="w-full justify-between text-gray-900 hover:text-purple-600 font-semibold"
                    >
                      Shop now
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Digital Lens Card */}
            <Card className="group hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900">Digital Lens</h3>
                  <p className="text-lg text-gray-600">Up to 40% off Camera</p>
                  <div className="flex justify-center py-8">
                    <img
                      src={canonEosR5 || "/placeholder.svg"}
                      alt="Digital Camera"
                      className="w-full max-w-xs group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <Link href="/shop?category=cameras">
                    <Button
                      variant="ghost"
                      className="w-full justify-between text-gray-900 hover:text-purple-600 font-semibold"
                    >
                      Shop now
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              We're tackling the biggest challenges in laptops
              <br />
              and electronic products.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Fast & Free Shipping */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-blue-500/30 rounded-full">
                  <Truck className="h-12 w-12" />
                </div>
              </div>
              <h3 className="text-xl font-bold">Fast & free shipping</h3>
              <p className="text-blue-100 leading-relaxed">
                Every single order ships for free. No minimums, no tiers, no fine print whatsoever.
              </p>
            </div>

            {/* Innovative Design */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-blue-500/30 rounded-full">
                  <Palette className="h-12 w-12" />
                </div>
              </div>
              <h3 className="text-xl font-bold">Innovative, User-Centric Design</h3>
              <p className="text-blue-100 leading-relaxed">
                Our cutting-edge designs prioritize performance, portability, and seamless integration into your
                lifestyle.
              </p>
            </div>

            {/* High-Quality Materials */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="p-4 bg-blue-500/30 rounded-full">
                  <Gem className="h-12 w-12" />
                </div>
              </div>
              <h3 className="text-xl font-bold">Durable, High-Quality Materials</h3>
              <p className="text-blue-100 leading-relaxed">
                We use premium aluminum, high-resolution OLED displays, and durable batteries for superior quality.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
