import { Skeleton } from "@/components/ui/skeleton"

export default function CartLoading() {
  return (
    <div className="min-h-screen bg-[#f9fbfc] p-6">
      <div className="max-w-4xl mx-auto">
        <Skeleton className="h-10 w-48 mb-8" />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items Skeleton */}
          <div className="lg:col-span-2 space-y-4">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-20 h-20 rounded" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              ))}
          </div>

          {/* Order Summary Skeleton */}
          <div>
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b">
                <Skeleton className="h-6 w-32" />
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="border-t pt-4 flex justify-between">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
              <div className="p-6 pt-0">
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
