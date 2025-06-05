import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section Skeleton */}
      <div className="bg-gradient-to-br from-purple-600 via-purple-500 to-blue-500 py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Skeleton className="h-16 w-80 bg-white/20" />
              <Skeleton className="h-6 w-96 bg-white/20" />
              <Skeleton className="h-12 w-32 bg-white/20" />
            </div>
            <div className="flex justify-center">
              <Skeleton className="h-96 w-64 bg-white/20" />
            </div>
          </div>
        </div>
      </div>

      {/* Top Trending Products Skeleton */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-80 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-8 shadow-sm">
                  <Skeleton className="h-8 w-32 mb-2" />
                  <Skeleton className="h-6 w-40 mb-8" />
                  <Skeleton className="h-48 w-full mb-8" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Features Section Skeleton */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-96 mx-auto bg-white/20" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="text-center space-y-4">
                  <Skeleton className="h-20 w-20 mx-auto rounded-full bg-white/20" />
                  <Skeleton className="h-6 w-48 mx-auto bg-white/20" />
                  <Skeleton className="h-16 w-full bg-white/20" />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
