"use client"

import { useState } from "react"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Phone, Shield, Wrench, MessageSquare, Clock, AlertTriangle, X } from "lucide-react"
import { HelpPageSkeleton } from "@/components/skeleton-loader"
import { motion, AnimatePresence } from "framer-motion"
import UserLayout from "@/components/userlayout"

function HelpPageContent() {
  const [showQuickActions, setShowQuickActions] = useState(false)

  const pgContacts = [
    {
      title: "PG Owner",
      name: "Rajesh Kumar",
      number: "+91 98765 43210",
      available: "24/7 Emergency",
      icon: <Phone className="h-6 w-6" />,
    },
    {
      title: "PG Manager",
      name: "Priya Sharma",
      number: "+91 98765 43211",
      available: "9 AM - 8 PM",
      icon: <MessageSquare className="h-6 w-6" />,
    },
    {
      title: "Maintenance",
      name: "Maintenance Team",
      number: "+91 98765 43212",
      available: "9 AM - 6 PM",
      icon: <Wrench className="h-6 w-6" />,
    },
  ]

  const commonIssues = [
    {
      issue: "Power Outage",
      solution: "Check the main switch in your room. If the issue persists, contact the PG manager.",
      urgent: false,
    },
    {
      issue: "Water Supply Issue",
      solution: "Check if other residents are facing the same issue. Contact maintenance team.",
      urgent: true,
    },
    {
      issue: "WiFi Not Working",
      solution: "Restart your device and reconnect. If issue persists, contact PG manager.",
      urgent: false,
    },
    {
      issue: "Room Lock Issues",
      solution: "Contact PG manager immediately. Do not force the lock.",
      urgent: true,
    },
    {
      issue: "Noise Complaints",
      solution: "First try to resolve amicably. If unsuccessful, contact PG manager.",
      urgent: false,
    },
    {
      issue: "Medical Emergency",
      solution: "Call 108 immediately. Inform PG owner and nearby residents for assistance.",
      urgent: true,
    },
  ]

  const quickActions = [
    {
      icon: <Shield className="h-5 w-5 text-red-500" />,
      label: "Call Police",
      onClick: () => window.open("tel:100"),
    },
    {
      icon: <Phone className="h-5 w-5 text-green-500" />,
      label: "Call Ambulance",
      onClick: () => window.open("tel:108"),
    },
    {
      icon: <MessageSquare className="h-5 w-5 text-primary" />,
      label: "Call PG Owner",
      onClick: () => window.open("tel:+919876543210"),
    },
    {
      icon: <Wrench className="h-5 w-5 text-blue-500" />,
      label: "Call Maintenance",
      onClick: () => window.open("tel:+919876543212"),
    },
  ]

  return (
    <div className="relative container mx-auto px-4 pt-[80px] py-8">
      <div className="max-w-6xl mx-auto space-y-4">
        <div>
          <h1 className="text-xl font-bold">Emergency & Help</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Quick access to emergency contacts and help resources
          </p>
        </div>

        {/* PG Contacts & Common Issues */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-lg font-bold">PG Contacts</h2>
            {pgContacts.map((contact, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-md p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      {contact.icon}
                    </div>
                    <div>
                      <h3 className="font-medium">{contact.title}</h3>
                      <p className="text-sm text-gray-600">{contact.name}</p>
                      <div className="text-xs flex items-center text-gray-500 mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {contact.available}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline" onClick={() => window.open(`tel:${contact.number}`)}>Call</Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(`https://wa.me/${contact.number.replace(/[^0-9]/g, "")}`)}
                    >
                      WhatsApp
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold">Common Issues & Solutions</h2>
            {commonIssues.map((item, idx) => (
              <div
                key={idx}
                className={`bg-white rounded-lg shadow-lg p-4 ${item.urgent ? "border border-orange-200 dark:border-orange-800" : ""}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{item.issue}</h3>
                  {item.urgent && (
                    <span className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 text-xs px-2 py-1 rounded-full">
                      Urgent
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.solution}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Quick Actions */}
      <AnimatePresence>
        {showQuickActions && (
          <>
            {/* Black background */}
            <motion.div
              className="fixed inset-0 bg-black/40 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQuickActions(false)}
            />

            {/* Floating Buttons */}
            <div className="fixed bottom-20 right-6 z-50 flex flex-col items-end space-y-2">
              {quickActions.map((action, idx) => (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-lg shadow-xl px-4 py-2 flex items-center gap-2 text-sm hover:bg-gray-100"
                  onClick={() => {
                    setShowQuickActions(false)
                    action.onClick()
                  }}
                >
                  {action.icon}
                  {action.label}
                </motion.button>
              ))}
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Floating FAB Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          className="rounded-full h-14 w-14 shadow-xl bg-primary text-white"
          onClick={() => setShowQuickActions((prev) => !prev)}
        >
          {showQuickActions ? <X className="w-6 h-6" /> : <Phone className="w-6 h-6" />}
        </Button>
      </div>
    </div>
  )
}

export default function HelpPage() {
  return (
    <UserLayout>
    <Suspense fallback={<HelpPageSkeleton />}>
      <HelpPageContent />
    </Suspense>
    </UserLayout>
  )
}
