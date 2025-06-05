"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ArrowRight, Play, Pause } from "lucide-react"
import {
  canonEosR5,
  iPhone14Pro,
  macBookProM3Max,
  sonyWh1000xm5,
} from "@/lib/constants/image"

const slides = [
  {
    id: 1,
    title: "Next-Gen Mobility",
    subtitle: "iPhone 15 Pro Max",
    description:
      "Power, performance, and style—experience the future of smartphones today",
    image: iPhone14Pro,
    buttonText: "Shop iPhones",
    buttonLink: "/shop?category=phones",
    gradient: "from-purple-600 via-purple-500 to-blue-500",
  },
  {
    id: 2,
    title: "Creative Powerhouse",
    subtitle: "MacBook Pro M3 Max",
    description:
      "Unleash your creativity with the most powerful MacBook ever built",
    image: macBookProM3Max,
    buttonText: "Shop MacBooks",
    buttonLink: "/shop?category=laptops",
    gradient: "from-blue-600 via-indigo-500 to-purple-500",
  },
  {
    id: 3,
    title: "Capture Every Moment",
    subtitle: "Canon EOS R5 Camera",
    description:
      "Professional photography redefined with cutting-edge mirrorless technology",
    image: canonEosR5,
    buttonText: "Shop Cameras",
    buttonLink: "/shop?category=cameras",
    gradient: "from-emerald-600 via-teal-500 to-cyan-500",
  },
  {
    id: 4,
    title: "Immersive Audio",
    subtitle: "Sony WH-1000XM5",
    description:
      "Experience music like never before with industry-leading noise cancellation",
    image: sonyWh1000xm5,
    buttonText: "Shop Audio",
    buttonLink: "/shop?category=audio",
    gradient: "from-orange-600 via-red-500 to-pink-500",
  },
]

export function HeroSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isPaused, setIsPaused] = useState(false)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }, [])

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index)
  }, [])

  useEffect(() => {
    if (!isAutoPlaying || isPaused) return

    const interval = setInterval(() => {
      nextSlide()
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, isPaused, nextSlide])

  const handlePrevious = () => {
    prevSlide()
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 8000)
  }

  const handleNext = () => {
    nextSlide()
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 8000)
  }

  const handleDotClick = (index: number) => {
    goToSlide(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 8000)
  }

  const toggleAutoPlay = () => {
    setIsPaused(!isPaused)
  }

  const currentSlideData = slides[currentSlide]

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Slideshow */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
          >
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`} />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/30" />

            {/* Background Image */}
            <div
              className="absolute inset-0 bg-no-repeat bg-center bg-cover opacity-20 lg:opacity-40"
              style={{
                backgroundImage: `url(${slide.image || "/placeholder.svg"})`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center h-full">
            {/* Text Content */}
            <div className="space-y-6 text-white">
              <div className="space-y-2">
                <p className="text-lg font-medium opacity-90 animate-fade-in">
                  {currentSlideData.subtitle}
                </p>
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight animate-slide-up">
                  {currentSlideData.title}
                </h1>
              </div>
              <p className="text-xl text-white/90 max-w-md leading-relaxed animate-fade-in-delay">
                {currentSlideData.description}
              </p>
              <div className="animate-fade-in-delay-2">
                <Link href={currentSlideData.buttonLink}>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="bg-white text-gray-900 hover:bg-gray-100 font-semibold"
                  >
                    {currentSlideData.buttonText}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Optional Floating Decorations */}
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-white/30 rounded-full animate-pulse" />
                <div
                  className="absolute top-3/4 right-1/4 w-6 h-6 bg-white/20 rounded-full animate-pulse"
                  style={{ animationDelay: "1s" }}
                />
                <div
                  className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-white/40 rounded-full animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-200 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-all duration-200 group"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-white scale-125 shadow-lg"
                : "bg-white/50 hover:bg-white/75 hover:scale-110"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-20">
        <div
          className="h-full bg-white transition-all duration-300 ease-linear"
          style={{
            width: `${((currentSlide + 1) / slides.length) * 100}%`,
          }}
        />
      </div>

      {/* Auto-play Control */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={toggleAutoPlay}
          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-200 group"
          aria-label={isPaused ? "Resume slideshow" : "Pause slideshow"}
        >
          {isPaused ? (
            <Play className="h-4 w-4 text-white group-hover:scale-110 transition-transform" />
          ) : (
            <Pause className="h-4 w-4 text-white group-hover:scale-110 transition-transform" />
          )}
        </button>
      </div>

      {/* Slide Counter */}
      <div className="absolute top-4 left-4 z-20 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
        <span className="text-white text-sm font-medium">
          {currentSlide + 1} / {slides.length}
        </span>
      </div>
    </section>
  )
}
