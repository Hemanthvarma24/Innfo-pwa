"use client";

import { Suspense } from "react";
import { LocationPageSkeleton } from "@/components/skeleton-loader";
import { MapPin, Navigation, Clock, PhoneCall } from "lucide-react";
import UserLayout from "@/components/userlayout";

function LocationPageContent() {
  // Use embed URL (static, works without API key)
  const mapSrc =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.08000340087!2d80.26143627481885!3d13.072090887263783!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5265da7f59a3a1%3A0x4c6d63a59fbb8d85!2sEgmore%20High%20Rd%2C%20Egmore%2C%20Chennai%2C%20Tamil%20Nadu%20600008!5e0!3m2!1sen!2sin!4v1691496400000!5m2!1sen!2sin";

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
          <iframe
            title="Rahman Khan PG Map"
            src={mapSrc}
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* 2. Address Box */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold">Address</h3>
            <a
              href="https://maps.app.goo.gl/62DCfB5k2swi42328"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-primary text-sm font-medium hover:underline"
            >
              <span className="mr-1">Get Directions</span>
              <Navigation className="h-4 w-4" />
            </a>
          </div>

          <div className="flex items-start mt-4">
            <div className="bg-primary/10 p-2 rounded-full mt-1">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-gray-700 leading-relaxed">
                Rahman Khan PG
                <br />
                No. 45, Egmore High Road,
                <br />
                Egmore, Chennai – 600008
                <br />
                Tamil Nadu, India
              </p>
            </div>
          </div>
        </div>

        {/* 3. Landmark Box */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-start">
            <div className="bg-primary/10 p-2 rounded-full mt-1">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold mb-1">Nearby Landmarks</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Egmore Railway Station – 500m</li>
                <li>Government Museum – 1.2 km</li>
                <li>Spencer Plaza – 2.1 km</li>
                <li>Marina Beach – 4.5 km</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 4. Contact Box */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-start">
            <div className="bg-primary/10 p-2 rounded-full mt-1">
              <PhoneCall className="h-5 w-5 text-primary" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold mb-1">Contact Us</h3>
              <p className="text-gray-700">📞 +91 98765 43210</p>
            </div>
          </div>
        </div>
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
