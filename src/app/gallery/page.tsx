"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserLayout from "@/components/userlayout";
import { ReviewsPageSkeleton } from "@/components/skeleton-loader";

type GalleryImage = {
  image_url: string;
  title: string;
};

function GalleryPageContent() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
        const userId = searchParams.get("user_id")
const buildingId= searchParams.get("building_id")
  

  useEffect(() => {
    if (!userId) {
      return;
    }

    const fetchImages = async () => {
      try {
        const res = await fetch(`https://innfo.top/App/api.php?gofor=gallerylist&user_id=${userId}`);
        const data = await res.json();
        setImages(data.filter((img: any) => img.status === 1));
      } catch (error) {
        console.error("Failed to fetch gallery:", error);
      }
    };

    fetchImages();
  }, []);


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
    <div>
        <div className="container mx-auto px-4 pt-[80px] py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-xl font-bold mb">Gallery</h1>
        <p className="text-gray-600 mb-4">
          Take a visual tour of our PG accommodation and facilities.
        </p>

        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 mb-4">
            <TabsTrigger value="all">All Images</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 md:grid-cols-3 gap-4"
            >
              {images.map((image, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  className="overflow-hidden rounded-xl group cursor-pointer"
                  onClick={() => setSelectedImage(image)}
                >
                  <div className="relative w-full h-64">
                    <Image
                      src={image.image_url}
                      alt={image.title}
                      fill
                      className="object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 rounded-xl">
                      <div className="text-white text-center">
                        <h3 className="font-semibold text-lg">{image.title}</h3>
                        <p className="text-sm">Click to view</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
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
                src={selectedImage.image_url}
                alt={selectedImage.title}
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
    </div>
    
  );
}


export default function GalleryPage() {
  return (
    <UserLayout>
      <Suspense fallback={<ReviewsPageSkeleton />}>
        <GalleryPageContent />
      </Suspense>
    </UserLayout>
  )
}