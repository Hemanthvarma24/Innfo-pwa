"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LocationPageSkeleton } from "@/components/skeleton-loader";
import { MapPin, Navigation, Clock, PhoneCall } from "lucide-react";
import UserLayout from "@/components/userlayout";

interface Building {
  id: string;
  name: string;
  address: string;
  area: string;
  city: string;
  google_map: string;
  notes: string;
  nearby_landmarks: string;
}

interface User {
  mobileno: string;
}

function LocationPageContent() {
  const searchParams = useSearchParams();
  const buildingId = searchParams.get("building_id");
  const userId = searchParams.get("user_id");

  const [building, setBuilding] = useState<Building | null>(null);
  const [mobileNo, setMobileNo] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!buildingId || !userId) {
        setError("Missing building ID or user ID");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Combine both API calls to reduce re-renders
        const [buildingRes, userRes] = await Promise.all([
          fetch(
            `https://innfo.top/App/api.php?gofor=getbuilding&building_id=${buildingId}`
          ),
          fetch(
            `https://innfo.top/App/api.php?gofor=userget&user_id=${userId}`
          )
        ]);

        if (!buildingRes.ok || !userRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const buildingData = await buildingRes.json();
        const userData = await userRes.json();

        setBuilding(buildingData);
        setMobileNo(userData.mobileno || "");
      } catch (err) {
        console.error("Failed to fetch data", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [buildingId, userId]);

  // Show loading state
  if (loading) {
    return <LocationPageSkeleton />;
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto px-4 pt-[80px] pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">
              Error Loading Location
            </h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Show not found state
  if (!building) {
    return (
      <div className="container mx-auto px-4 pt-[80px] pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">
              Location Not Found
            </h2>
            <p className="text-yellow-600">
              The requested location could not be found.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Create a clean Google Maps URL for directions
  const getDirectionsUrl = () => {
    if (!building.google_map) return "#";
    
    // Convert embed URL to regular maps URL
    const embedUrl = building.google_map;
    if (embedUrl.includes("embed?")) {
      return embedUrl.replace("/embed?", "?");
    }
    return embedUrl;
  };

  return (
    <div className="container mx-auto px-4 pt-[80px] pb-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Heading */}
        <div>
          <h1 className="text-xl font-bold mb-1">Location</h1>
          <p className="text-gray-600">
            Find our PG accommodation and explore the neighborhood
          </p>
        </div>

        {/* 1. Map Box */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {building.google_map ? (
            <iframe
              key={`map-${buildingId}`} // Add unique key for better React reconciliation
              title={`${building.name} Map`}
              src={building.google_map}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            />
          ) : (
            <div className="h-[400px] flex items-center justify-center bg-gray-100">
              <p className="text-gray-500">Map not available</p>
            </div>
          )}
        </div>

        {/* 2. Address Box */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold">Address</h3>
            {building.google_map && (
              <a
                href={getDirectionsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-primary text-sm font-medium hover:underline transition-colors"
              >
                <span className="mr-1">Get Directions</span>
                <Navigation className="h-4 w-4" />
              </a>
            )}
          </div>

          <div className="flex items-start mt-4">
            <div className="bg-primary/10 p-2 rounded-full mt-1 flex-shrink-0">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-gray-700 leading-relaxed">
                {building.name}
                {building.address && (
                  <>
                    <br />
                    {building.address}
                  </>
                )}
                {(building.area || building.city) && (
                  <>
                    <br />
                    {[building.area, building.city].filter(Boolean).join(", ")}
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* 3. Landmark Box */}
        {building.nearby_landmarks && (
  <div className="bg-white rounded-xl shadow-md p-4">
    <div className="flex items-start">
      <div className="bg-primary/10 p-2 rounded-full mt-1 flex-shrink-0">
        <Clock className="h-5 w-5 text-primary" />
      </div>
      <div className="ml-4">
        <h3 className="text-lg font-semibold mb-1">Nearby Landmarks</h3>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          {building.nearby_landmarks
            .split(",")
            .map((landmark, index) => (
              <li key={index}>{landmark.trim()}</li>
            ))}
        </ul>
      </div>
    </div>
  </div>
)}


        {/* 4. Contact Box */}
        {mobileNo && (
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex items-start">
              <div className="bg-primary/10 p-2 rounded-full mt-1 flex-shrink-0">
                <PhoneCall className="h-5 w-5 text-primary" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold mb-1">Contact Us</h3>
                <a
                  href={`tel:+91${mobileNo}`}
                  className="text-gray-700 hover:text-primary transition-colors"
                >
                  📞 +91 {mobileNo}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LocationPage() {
  return (
    <UserLayout>
      <Suspense fallback={<LocationPageSkeleton />}>
      <LocationPageContent />
      </Suspense>
    </UserLayout>
  );
}