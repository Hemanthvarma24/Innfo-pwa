"use client"

import { Suspense } from "react"
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Info,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { NoticePageSkeleton } from "@/components/skeleton-loader"
import UserLayout from "@/components/userlayout"

const notices = [
  {
    id: 1,
    title: "Maintenance-Water Supply",
    description: "Water supply will be interrupted on Sunday, July 30th from 10 AM to 2 PM for maintenance work.",
    date: "2024-07-28",
    type: "maintenance",
    priority: "high",
    icon: <AlertTriangle className="h-5 w-5" />,
  },
  
  {
    id: 3,
    title: "Festival Celebration - Diwali",
    description: "Join us for Diwali celebration on November 12th at 7 PM in the common area. Snacks and sweets will be provided.",
    date: "2024-07-20",
    type: "event",
    priority: "low",
    icon: <CheckCircle className="h-5 w-5" />,
  },
  {
    id: 4,
    title: "Rent Payment Reminder",
    description: "Monthly rent for August is due on 5th August. Please make the payment on time to avoid late fees.",
    date: "2024-07-18",
    type: "payment",
    priority: "high",
    icon: <AlertTriangle className="h-5 w-5" />,
  },
  {
    id: 5,
    title: "New House Rules",
    description: "Updated house rules regarding visitor timings and common area usage. Please check the Rules section for details.",
    date: "2024-07-15",
    type: "rules",
    priority: "medium",
    icon: <Info className="h-5 w-5" />,
  },
  {
    id: 6,
    title: "Laundry Service Update",
    description: "Laundry service will now be available on Tuesdays and Fridays. Please plan your laundry accordingly.",
    date: "2024-07-10",
    type: "service",
    priority: "low",
    icon: <CheckCircle className="h-5 w-5" />,
  },
]

const getTypeColor = (type: string) => {
  switch (type) {
    case "maintenance":
      return "bg-red-100 text-red-700"
    case "payment":
      return "bg-orange-100 text-orange-700"
    case "update":
      return "bg-blue-100 text-blue-700"
    case "event":
      return "bg-green-100 text-green-700"
    case "rules":
      return "bg-purple-100 text-purple-700"
    case "service":
      return "bg-gray-100 text-gray-700"
    default:
      return "bg-gray-100 text-gray-700"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-50 text-red-700 border border-red-200"
    case "medium":
      return "bg-yellow-50 text-yellow-700 border border-yellow-200"
    case "low":
      return "bg-green-50 text-green-700 border border-green-200"
    default:
      return "bg-gray-50 text-gray-700 border border-gray-200"
  }
}

function NoticePageContent() {
  return (
    <div className="container mx-auto px-4 pt-[80px] pb-16">
      <div className="max-w-4xl mx-auto ">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold mb-1">Notices & Updates</h1>
          <p className="text-gray-600">
            Stay updated with announcements, maintenance, rules, and reminders.
          </p>
        </div>

        {/* Notice Cards */}
        <div className="space-y-4">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 hover:scale-[1.01]"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full flex-shrink-0 ${getTypeColor(notice.type)}`}>
                    {notice.icon}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {notice.title}
                    </h2>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      <Badge className={getTypeColor(notice.type)}>
                        {notice.type.charAt(0).toUpperCase() + notice.type.slice(1)}
                      </Badge>
                      
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-1 whitespace-nowrap">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(notice.date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
              <p className="text-sm text-gray-700 mt-4 leading-relaxed">
                {notice.description}
              </p>
            </div>
          ))}
        </div>

        {/* How to Stay Updated */}
        <div className="mt-14 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-5 text-gray-900">
            📬 How to Stay Updated
          </h3>
          <ul className="space-y-4 text-sm text-gray-700">
            {[
              "Check this page regularly for the latest updates",
              "Important notices are also posted on the notice board",
              "Urgent updates are sent via WhatsApp group",
              "Contact the owner for any clarifications",
            ].map((text, i) => (
              <li key={i} className="flex items-start">
                <div className="mr-3 mt-1 bg-primary/20 p-2 rounded-full">
                  <svg className="h-4 w-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
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
    </div>
  )
}

export default function NoticePage() {
  return (
    <UserLayout>
      <Suspense fallback={<NoticePageSkeleton />}>
        <NoticePageContent />
      </Suspense>
    </UserLayout>
  )
}
