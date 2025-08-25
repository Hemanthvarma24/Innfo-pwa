"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Menu,
  X,
  Home,
  Phone,
  Utensils,
  CreditCard,
  Camera,
  MapPin,
  FileText,
  Bell,
  Star,
  Users,
  HelpCircle,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import logo from "@/assets/Innfo-Logo.png";


export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("user_id")
const buildingId= searchParams.get("building_id")

  const navigation = [
    { name: "Home", href: `/?user_id=${userId}&building_id=${buildingId}`, icon: Home },
    { name: "Register", href: `/register?user_id=${userId}&building_id=${buildingId}`, icon: Phone },
    { name: "Food Plan", href: `/food?user_id=${userId}&building_id=${buildingId}`, icon: Utensils },
    { name: "Gallery", href: `/gallery?user_id=${userId}&building_id=${buildingId}`, icon: Camera },
    { name: "Pay Rent", href: `/pay-rent?user_id=${userId}&building_id=${buildingId}`, icon: CreditCard },
    { name: "Rules", href: `/rules?user_id=${userId}&building_id=${buildingId}`, icon: FileText },
    { name: "Location", href: `/location?user_id=${userId}&building_id=${buildingId}`, icon: MapPin },
    { name: "Notices", href: `/notice?user_id=${userId}&building_id=${buildingId}`, icon: Bell },
    { name: "Reviews", href: `/reviews?user_id=${userId}&building_id=${buildingId}`, icon: Star },
    { name: "Help", href: `/help?user_id=${userId}&building_id=${buildingId}`, icon: HelpCircle },
  ];

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out this PG!",
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    }
  };


  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 mb-2 bg-white  border-b border-gray-200"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href={`/?user_id=${userId}&building_id=${buildingId}`} className="flex items-center space-x-3">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Image
                  src={logo}
                  alt="Sunshine PG Logo"
                  className="h-auto max-w-[100px]"
                  priority
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigation.slice(0, 6).map((item) => {
                const Icon = item.icon;

                // Extract the path part from the href (remove query string)
                const itemPath = item.href.split("?")[0];
                const isActive = pathname === itemPath;

                return (
                  <Link key={item.name} href={item.href}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${isActive
                          ? "bg-[#4f008c] text-white shadow-md"
                          : "text-gray-600"
                        }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-2 lg:hidden">
              {/* Bell Icon */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/notice")}
              >
                <Bell className="w-6 h-6 text-gray-700" />
              </Button>

              {/* Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
              >
                <motion.div animate={{ rotate: isOpen ? 90 : 0 }}>
                  {isOpen ? (
                    <X className="w-8 h-8" />
                  ) : (
                    <Menu className="w-8 h-8" />
                  )}
                </motion.div>
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-80 z-50 lg:hidden shadow-2xl bg-[#4f008c]"
            >
              <div className="p-6 flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <p className="text-xs text-white tracking-wider">MENU</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="w-5 h-5 text-white" />
                  </Button>
                </div>

                {/* Menu List */}
                <nav className="space-y-2 flex-1 overflow-y-auto"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                  {navigation.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                            ? "bg-white/20 text-white"
                            : "text-white hover:bg-white/10"
                            }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{item.name}</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </nav>

                {/* Floating Share Button */}
                <Button
                  onClick={handleShare}
                  className="fixed bottom-6 right-6 z-50 bg-white text-[#4f008c] rounded-full"
                >
                  <Share2 className="w-5 h-5" />
                </Button>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
