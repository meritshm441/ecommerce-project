import { Skeleton } from "@/components/ui/skeleton"

export default function CreateProductLoading() {
  return (
    <div className="min-h-screen bg-[#f9fbfc] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button Skeleton */}
        <Skeleton className="h-6 w-16 mb-6" />

        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-32" />
        </div>

        <div className="space-y-6">
          {/* Image Upload Skeleton */}
          <div className="bg-[#e6eff5] rounded-lg">
            <div className="p-12 flex justify-center">
              <Skeleton className="h-10 w-32" />
            </div>
          </div>

          {/* Form Fields Skeleton */}
          <div className="grid md:grid-cols-2 gap-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>

          <Skeleton className="h-32 w-full" />

          <Skeleton className="h-12 w-32" />
        </div>
      </div>
    </div>
  )
}
