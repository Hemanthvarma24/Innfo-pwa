import { Skeleton } from "@/components/ui/skeleton"

export function HomePageSkeleton() {
  return (
    <div className="container mx-auto px-4 mt-12 py-8">
      {/* Hero Section Skeleton */}
      <div className="relative overflow-hidden rounded-3xl mb-12">
        <Skeleton className="h-64 md:h-80 w-full rounded-3xl" />
      </div>

      {/* Features Grid Skeleton */}
      <div className="mb-12">
        <Skeleton className="h-8 w-64 mx-auto mb-8" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="border rounded-xl p-3">
              <div className="flex flex-col items-center space-y-2">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Highlights Section Skeleton */}
      <div className="mb-12">
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </div>

      {/* CTA Section Skeleton */}
      <Skeleton className="h-32 rounded-2xl" />
    </div>
  )
}

export function EnquiryPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96 mb-8" />

        <div className="space-y-6">
          <Skeleton className="h-96 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export function FoodPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-96 mb-8" />

        <div className="mb-8">
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>

        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    </div>
  )
}

export function GalleryPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-96 mb-8" />

        <div className="mb-8">
          <Skeleton className="h-10 w-full mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-lg" />
            ))}
          </div>
        </div>

        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
    </div>
  )
}

export function PayRentPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-96 mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Skeleton className="h-96 w-full rounded-lg" />
          </div>
          <div className="md:col-span-1">
            <Skeleton className="h-64 w-full rounded-lg mb-4" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        </div>

        <Skeleton className="h-32 w-full rounded-lg mt-8" />
      </div>
    </div>
  )
}

export function RulesPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-96 mb-8" />

        <div className="mb-8">
          <Skeleton className="h-10 w-full mb-4" />
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export function LocationPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-96 mb-8" />

        <Skeleton className="h-96 w-full rounded-lg mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>

        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
    </div>
  )
}

export function ContactPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-96 mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Skeleton className="h-32 w-full rounded-lg" />
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}

export function NoticePageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <Skeleton className="h-8 w-8 rounded-full mr-3" />
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
        </div>

        <div className="space-y-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>

        <Skeleton className="h-32 w-full rounded-lg mt-8" />
      </div>
    </div>
  )
}

export function ReviewsPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-96 mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-32 w-full rounded-lg" />
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Skeleton className="h-64 w-full rounded-lg" />
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ReferPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Skeleton className="h-8 w-48 mx-auto mb-2" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-96 w-full rounded-lg" />
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>

        <Skeleton className="h-48 w-full rounded-lg mt-8" />
        <Skeleton className="h-32 w-full rounded-lg mt-8" />
      </div>
    </div>
  )
}

export function HelpPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-96 mb-8" />

        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Skeleton className="h-6 w-6 mr-2" />
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Skeleton className="h-6 w-32 mb-4" />
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
          <div className="space-y-4">
            <Skeleton className="h-6 w-48 mb-4" />
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        </div>

        <Skeleton className="h-48 w-full rounded-lg mt-8" />
        <Skeleton className="h-32 w-full rounded-lg mt-8" />
      </div>
    </div>
  )
}
