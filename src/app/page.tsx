"use client"

import { Suspense } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { HomePageSkeleton } from "@/components/skeleton-loader"
import { Utensils, ImageIcon, CreditCard, MapPin, Phone, Star, Share2, HelpCircle } from "lucide-react"
import UserLayout from "@/components/userlayout"


function HomePageContent() {
  const features = [
    {
      name: "Food Plan",
      description: "View monthly menu",
      icon: <Utensils className="h-5 w-5" />,
      href: "/food",
    },
    {
      name: "Gallery",
      description: "Photos of rooms & facilities",
      icon: <ImageIcon className="h-5 w-5" />,
      href: "/gallery",
    },
    {
      name: "Pay Rent",
      description: "Easy payment options",
      icon: <CreditCard className="h-5 w-5" />,
      href: "/pay-rent",
    },
    {
      name: "Location",
      description: "Find us on the map",
      icon: <MapPin className="h-5 w-5" />,
      href: "/location",
    },
    {
      name: "Reviews",
      description: "Guest feedback and ratings",
      icon: <Star className="h-5 w-5" />,
      href: "/reviews",
    },
    
    {
      name: "Help",
      description: "Emergency contacts",
      icon: <HelpCircle className="h-5 w-5" />,
      href: "/help",
    },
  ]

  const iconBgColors = [
    "bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-400",
    "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400",
    "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400",
    "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400",
    "bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400",
    "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400",
    "bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-400",
    "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400",
  ]

  return (
    <div className="container mx-auto px-4 pt-[80px] py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl mb-4">
        <div className="bg-gradient-to-br from-[#52018E] via-[#7B2CBF] to-[#9D4EDD] p-4 rounded-3xl">
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold text-white mb-2">
              Welcome to Innfo PG Accommodation
            </h1>
            <p className="text-sm text-white/90 mb-4">
              Your home away from home with all the comfort and convenience you need
            </p>
            <div className="flex flex-wrap gap-6">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 btn-animate" asChild>
                <Link href="/register">Register Now</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white/20 btn-animate"
                asChild
              >
                <Link href="/gallery">View Gallery</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
{/* Features Grid */}
<section className="mb-8">
  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
    Everything You Need
  </h2>
  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {features.map((feature, index) => {
      const bg = iconBgColors[index % iconBgColors.length]
      return (
        <Link key={feature.name} href={feature.href}>
          <Card className="shadow-md transition-all rounded-2xl border border-gray-200 dark:border-gray-700 p-3">
            <CardContent className="flex items-start gap-3 p-0">
              <div className={`p-2 rounded-md flex-shrink-0 ${bg}`}>
                {feature.icon}
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm font-semibold">{feature.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      )
    })}
  </div>
</section>


      {/* Highlights Section */}
      <section className="mb-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-4 shadow-md rounded-2xl">
            <h3 className="text-xl font-bold mb-4">Why Choose Us?</h3>
            <ul className="space-y-2 text-sm">
              {[
                "Prime location with excellent connectivity",
                "Hygienic and nutritious meals",
                "24/7 security and power backup",
                "High-speed WiFi internet",
              ].map((text, idx) => (
                <li key={idx} className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/20 p-1 rounded-full">
                    <svg className="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 p-4 shadow-md rounded-2xl">
            <h3 className="text-xl font-bold mb-4">Facilities</h3>
            <ul className="space-y-2 text-sm">
              {[
                "Fully furnished rooms",
                "Common TV and recreation area",
                "Washing machine and laundry area",
                "Clean drinking water",
              ].map((text, idx) => (
                <li key={idx} className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/20 p-1 rounded-full">
                    <svg className="h-3 w-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 md:p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to join our PG community?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Fill out our enquiry form and we'll get back to you within 24 hours
          </p>
          <Button size="lg" className="btn-animate" asChild>
            <Link href="/register">Enquire Now</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

export default function HomePage() {
  return (
    <UserLayout>
      <Suspense fallback={<HomePageSkeleton />}>
        <HomePageContent />
      </Suspense>
    </UserLayout>
  )
}
