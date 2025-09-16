"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { HomePageSkeleton } from "@/components/skeleton-loader"
import { Utensils, ImageIcon, CreditCard, MapPin, Phone, Star, Share2, HelpCircle, ScrollText } from "lucide-react"
import UserLayout from "@/components/userlayout"
import { useSearchParams } from "next/navigation"


function HomePageContent() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("user_id")
  const buildingId = searchParams.get("building_id")
  const [companyName, setCompanyName] = useState("N/A");
  const [companyAddress, setCompanyAddress] = useState("N/A");
  const [whyUsList, setWhyUsList] = useState<string[]>([]);
  const [facilitiesList, setFacilitiesList] = useState<string[]>([]);

  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      try {
        const res = await fetch(
          `https://innfo.top/App/api.php?gofor=userget&user_id=${userId}`
        );
        const data = await res.json();

        setCompanyName(data.company_name || "Innfo PG Accommodation");
        setCompanyAddress(data.company_address || "N/A");

        // Extract and split "whyus" into an array
        setWhyUsList(
          data.whyus ? data.whyus.split(",").map((item: string) => item.trim()) : []
        );

        // Extract and split "facilities" into an array
        setFacilitiesList(
          data.facilities
            ? data.facilities.split(",").map((item: string) => item.trim())
            : []
        );
      } catch (err) {
        console.error("Failed to fetch user data", err);
        setCompanyName("Innfo PG Accommodation");
        setCompanyAddress("N/A");
        setWhyUsList([]);
        setFacilitiesList([]);
      }
    };

    fetchUserData();
  }, [userId]);

  const features = [
    {
      name: "Food Plan",
      description: "Monthly menu",
      icon: <Utensils className="h-5 w-5" />,
      href: `/food?user_id=${userId}&building_id=${buildingId}`,
    },
    {
      name: "Rules",
      description: "Rules & Facilities",
      icon: <ScrollText className="h-5 w-5" />,
      href: `/rules?user_id=${userId}&building_id=${buildingId}`,
    },
    {
      name: "Pay Rent",
      description: "Payment options",
      icon: <CreditCard className="h-5 w-5" />,
      href: `/pay-rent?user_id=${userId}&building_id=${buildingId}`,
    },
    {
      name: "Location",
      description: "Map directions",
      icon: <MapPin className="h-5 w-5" />,
      href: `/location?user_id=${userId}&building_id=${buildingId}`,
    },
    {
      name: "Reviews",
      description: "Guest ratings",
      icon: <Star className="h-5 w-5" />,
      href: `/reviews?user_id=${userId}&building_id=${buildingId}`,
    },
    {
      name: "Help",
      description: "Contacts",
      icon: <HelpCircle className="h-5 w-5" />,
      href: `/help?user_id=${userId}&building_id=${buildingId}`,
    },
  ]


  const iconBgColors = [
    "bg-pink-100 text-pink-600",
    "bg-blue-100 text-blue-600",
    "bg-green-100 text-green-600",
    "bg-yellow-100 text-yellow-600",
    "bg-indigo-100 text-indigo-600",
    "bg-red-100 text-red-600",
    "bg-teal-100 text-teal-600",
    "bg-purple-100 text-purple-600",
  ]

  return (
    <div className="container mx-auto px-4 pt-[80px] py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl mb-4">
        <div className="bg-gradient-to-br from-[#52018E] via-[#7B2CBF] to-[#9D4EDD] p-4 rounded-3xl">
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold text-white mb-2">
              Welcome to {companyName}
            </h1>
            <p className="text-sm text-white/90 mb-2">
              Your home away from home with all the comfort and convenience you need
            </p>
            <p className="text-sm text-white/80 mb-4 flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {companyAddress}
            </p>
            <div className="flex flex-wrap gap-6">
              <Button size="lg" className="bg-white text-[#52018E] hover:bg-white/90 btn-animate" asChild>
                <Link href={`/register?user_id=${userId}&building_id=${buildingId}`}>Register Now</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white/20 btn-animate"
                asChild
              >
                <Link href={`/gallery?user_id=${userId}&building_id=${buildingId}`}>View Gallery</Link>
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
                <Card className="shadow-md transition-all rounded-2xl border border-gray-200 p-3">
                  <CardContent className="flex items-start gap-3 p-0">
                    <div className={`p-2 rounded-md flex-shrink-0 ${bg}`}>
                      {feature.icon}
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-sm font-semibold">{feature.name}</h3>
                      <p className="text-xs text-gray-500">
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
          {/* Why Choose Us */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 shadow-md rounded-2xl">
            <h3 className="text-xl font-bold mb-4">Why Choose Us?</h3>
            <ul className="space-y-2 text-sm">
              {whyUsList.map((text, idx) => (
                <li key={idx} className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/20 p-1 rounded-full">
                    <svg
                      className="h-3 w-3 text-primary"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
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

          {/* Facilities */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 shadow-md rounded-2xl">
            <h3 className="text-xl font-bold mb-4">Facilities</h3>
            <ul className="space-y-2 text-sm">
              {facilitiesList.map((text, idx) => (
                <li key={idx} className="flex items-start">
                  <div className="mr-2 mt-1 bg-primary/20 p-1 rounded-full">
                    <svg
                      className="h-3 w-3 text-primary"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
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
        <div className="bg-gray-100 rounded-2xl p-6 md:p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to join our PG community?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Fill out our enquiry form and we'll get back to you within 24 hours
          </p>
          <Button size="lg" className="btn-animate" asChild>
            <Link href={`/register?user_id=${userId}&building_id=${buildingId}`}>Enquire Now</Link>
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