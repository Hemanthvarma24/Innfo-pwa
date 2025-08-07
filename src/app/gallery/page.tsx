"use client";

import { Suspense, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GalleryPageSkeleton } from "@/components/skeleton-loader";
import { motion } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import { X } from "lucide-react";
import gallery1 from "@/assets/gallery/img10.jpg";
import gallery2 from "@/assets/gallery/img11.jpg";
import gallery3 from "@/assets/gallery/img4.jpg";
import gallery4 from "@/assets/gallery/img3.webp";
import gallery5 from "@/assets/gallery/img5.jpg";
import gallery6 from "@/assets/gallery/img6.jpg";
import gallery7 from "@/assets/gallery/img7.jpg";
import gallery8 from "@/assets/gallery/img8.jpg";
import gallery9 from "@/assets/gallery/img9.jpg";
import UserLayout from "@/components/userlayout";

const galleryImages = {
  rooms: [
    {
      src: gallery1,
      alt: "Single Room",
      title: "Single Room",
    },
    {
      src: gallery2,
      alt: "Double Sharing Room",
      title: "Double Sharing Room",
    },
    {
      src: gallery3,
      alt: "Triple Sharing Room",
      title: "Triple Sharing Room",
    },
    {
      src: gallery4,
      alt: "Deluxe Room",
      title: "Deluxe Room",
    },
    {
      src: gallery6,
      alt: "Premium Room",
      title: "Premium Room",
    },
    {
      src: gallery5,
      alt: "AC Room",
      title: "AC Room",
    },
  ],
  facilities: [
    {
      src: gallery8,
      alt: "Dining Area",
      title: "Dining Area",
    },
    {
      src: gallery5,
      alt: "Common Room",
      title: "Common Room",
    },
    {
      src: gallery6,
      alt: "Laundry Area",
      title: "Laundry Area",
    },
    {
      src: gallery9,
      alt: "Study Room",
      title: "Study Room",
    },
    {
      src: gallery2,
      alt: "Kitchen",
      title: "Kitchen",
    },
    {
      src: gallery3,
      alt: "Reception",
      title: "Reception",
    },
  ],
};

function GalleryPageContent() {
  const [selectedImage, setSelectedImage] = useState<{
    src: StaticImageData;
    alt: string;
    title: string;
  } | null>(null);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1 },
  };

  return (
    <div className="container mx-auto px-4 pt-[80px] py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-xl font-bold mb">Gallery</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Take a visual tour of our PG accommodation and facilities.
        </p>

        <Tabs defaultValue="rooms" className="mb-8">
          <TabsList className="grid w-full  grid-cols-2 mb-4">
            <TabsTrigger value="rooms">Rooms</TabsTrigger>
            <TabsTrigger value="facilities">Facilities</TabsTrigger>
          </TabsList>

          {["rooms", "facilities"].map((tab) => (
            <TabsContent value={tab} key={tab}>
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2  gap-4"
              >
                {galleryImages[tab as "rooms" | "facilities"].map(
                  (image, index) => (
                    <motion.div
                      key={index}
                      variants={item}
                      className="overflow-hidden rounded-xl group cursor-pointer"
                      onClick={() => setSelectedImage(image)}
                    >
                      <div className="relative w-full h-64">
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          className="object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 rounded-xl">
                          <div className="text-white text-center">
                            <h3 className="font-semibold text-lg">
                              {image.title}
                            </h3>
                            <p className="text-sm">Click to view</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                )}
              </motion.div>

              {/* Popup viewer */}
              {selectedImage && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                  <div className="relative max-w-4xl w-full max-h-full overflow-auto bg-white rounded-lg">
                    <button
                      className="absolute top-4 right-4 z-10 text-white bg-black/50 hover:bg-black/70 p-2 rounded-full"
                      onClick={() => setSelectedImage(null)}
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <Image
                      src={selectedImage.src}
                      alt={selectedImage.alt}
                      width={1200}
                      height={800}
                      className="w-full h-auto object-contain rounded-lg"
                    />
                    <div className="p-4 text-center text-white">
                      {selectedImage.title}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Lightbox popup */}
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2"
                onClick={() => setSelectedImage(null)}
              >
                <X size={24} />
              </button>
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="w-full h-auto max-h-[80vh] object-contain"
                width={800}
                height={600}
              />
              <div className="bg-black bg-opacity-70 p-4 text-white">
                <h3 className="text-xl font-medium">{selectedImage.title}</h3>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function GalleryPage() {
  return (
       <UserLayout>
    <Suspense fallback={<GalleryPageSkeleton />}>
      <GalleryPageContent />
    </Suspense>
    </UserLayout>
  );
}
