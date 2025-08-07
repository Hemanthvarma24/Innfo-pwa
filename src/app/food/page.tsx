"use client"

import { Suspense, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FoodPageSkeleton } from "@/components/skeleton-loader"
import { motion } from "framer-motion"
import Image from "next/image"
import breakfastImage from "@/assets/food2.jpg"
import lunchImage from "@/assets/food1.jpg"
import dinnerImage from "@/assets/food3.jpg"
import UserLayout from "@/components/userlayout"

const weeklyMenu = {
  monday: {
    breakfast: ["Idli/Dosa", "Sambar", "Tea/Coffee"],
    lunch: ["Rice", "Dal", "Mixed Vegetable", "Salad"],
    dinner: ["Chapati", "Paneer Curry", "Rice", "Pickle"],
  },
  tuesday: {
    breakfast: ["Bread Toast", "Jam/Butter", "Tea/Coffee"],
    lunch: ["Rice", "Rajma", "Aloo Gobi", "Salad"],
    dinner: ["Chapati", "Egg Curry", "Rice", "Papad"],
  },
  wednesday: {
    breakfast: ["Upma", "Fruits", "Tea/Coffee"],
    lunch: ["Rice", "Dal Tadka", "Bhindi Fry", "Salad"],
    dinner: ["Chapati", "Chicken/Soya Curry", "Rice", "Raita"],
  },
  thursday: {
    breakfast: ["Idli/Dosa", "Sambar", "Tea/Coffee"],
    lunch: ["Rice", "Dal", "Aloo Matar", "Salad"],
    dinner: ["Chapati", "Mix Veg Curry", "Rice", "Pickle"],
  },
  friday: {
    breakfast: ["Paratha", "Curd", "Tea/Coffee"],
    lunch: ["Rice", "Chole", "Aloo Jeera", "Salad"],
    dinner: ["Chapati", "Paneer Butter Masala", "Rice", "Papad"],
  },
  saturday: {
    breakfast: ["Poha", "Boiled Eggs", "Tea/Coffee"],
    lunch: ["Rice", "Dal Fry", "Seasonal Vegetable", "Salad"],
    dinner: ["Chapati", "Egg/Paneer Curry", "Rice", "Raita"],
  },
  sunday: {
    breakfast: ["Aloo Paratha", "Curd", "Tea/Coffee"],
    lunch: ["Pulao", "Raita", "Papad", "Sweet"],
    dinner: ["Chapati", "Special Curry", "Rice"],
  },
}

const monthlyPlan = [
  {
    title: "Week 1",
    description: "Balanced meals with South and North Indian cuisines",
  },
  {
    title: "Week 2",
    description: "Special dishes with added proteins and variety",
  },
  {
    title: "Week 3",
    description: "Home-style simple meals with light dinners",
  },
  {
    title: "Week 4",
    description: "Special Sunday sweets and seasonal veggies",
  },
]

const mealImages = {
  breakfast: breakfastImage,
  lunch: lunchImage,
  dinner: dinnerImage,
}

function FoodPageContent() {
  const [activeDay, setActiveDay] = useState("monday")

  return (
    <div className="container max-w-6xl px-4 pt-[80px] pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Right Content */}
        <div>
          <h1 className="text-xl font-bold mb">Food Plan</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Discover our delicious and nutritious weekly meal plan.
          </p>

          <div className="p-4">
            <Tabs defaultValue="weekly">
              <TabsList className="grid grid-cols-2 w-full mb-4">
                <TabsTrigger value="weekly">Weekly Menu</TabsTrigger>
                <TabsTrigger value="monthly">Monthly Plan</TabsTrigger>
              </TabsList>

              {/* --- Weekly Tab --- */}
              <TabsContent value="weekly">
                <div
                  className="flex overflow-x-auto pb-2 gap-2 mb-6"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {Object.keys(weeklyMenu).map((day) => (
                    <button
                      key={day}
                      onClick={() => setActiveDay(day)}
                      className={`px-4 py-2 rounded-md whitespace-nowrap transition-colors text-sm font-medium ${
                        activeDay === day
                          ? "bg-primary text-white"
                          : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                    >
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </button>
                  ))}
                </div>

                <motion.div
  key={activeDay}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3 }}
  className="space-y-6"
>
  {["breakfast", "lunch", "dinner"].map((meal) => (
    <div
      key={meal}
      className="flex flex-row items-start bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4"
    >
      <div className="w-1/3 min-w-[100px] max-w-[200px] rounded-lg overflow-hidden mr-4">
        <Image
          src={mealImages[meal as keyof typeof mealImages]}
          alt={`${meal} image`}
          className="w-full h-40 object-cover rounded-md"
        />
      </div>

      <div className="flex-1">
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2 bg-opacity-20">
            <span className="text-lg">
              {meal === "breakfast" && "🍳"}
              {meal === "lunch" && "🍲"}
              {meal === "dinner" && "🍽️"}
            </span>
          </div>
          <h3 className="font-medium text-lg capitalize">{meal}</h3>
        </div>

        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 mb-2">
          {weeklyMenu[activeDay as keyof typeof weeklyMenu][
            meal as keyof typeof weeklyMenu["monday"]
          ].map((item, i) => (
            <li key={i}>• {item}</li>
          ))}
        </ul>

        <div className="text-xs text-gray-500">
          Served:{" "}
          {meal === "breakfast"
            ? "7:00 AM - 9:00 AM"
            : meal === "lunch"
            ? "12:30 PM - 2:30 PM"
            : "8:00 PM - 10:00 PM"}
        </div>
      </div>
    </div>
  ))}
</motion.div>

              </TabsContent>

              {/* --- Monthly Tab --- */}
              <TabsContent value="monthly">
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-x-auto">
    <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-300">
      <thead className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white  text-xs tracking-wider">
        <tr>
          <th scope="col" className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            Week
          </th>
          <th scope="col" className="px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            Description
          </th>
        </tr>
      </thead>
      <tbody>
        {monthlyPlan.map((week, idx) => (
          <tr
            key={idx}
            className={idx % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}
          >
            <td className="px-6 py-4 font-medium border-b border-gray-100 dark:border-gray-700">
              {week.title}
            </td>
            <td className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              {week.description}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</TabsContent>
            </Tabs>
          </div>

          {/* --- Mess Rules & Timings --- */}
          <div className="mt-10 bg-gray-50 dark:bg-gray-900 rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">Mess Rules & Timings</h2>
            <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>Carry your mess card while taking food.</li>
              <li>Maintain proper queue and hygiene in the mess hall.</li>
              <li>Wastage of food is strictly discouraged.</li>
              <li>Guests are not allowed inside mess without prior permission.</li>
              <li>Mess timings are strictly followed and will not be extended.</li>
            </ul>
            <div className="mt-4 px-2 text-sm text-gray-500">
              <p>Breakfast: 7:00 AM - 9:00 AM</p>
              <p>Lunch: 12:30 PM - 2:30 PM</p>
              <p>Dinner: 8:00 PM - 10:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FoodPage() {
  return (
      <UserLayout>
    <Suspense fallback={<FoodPageSkeleton />}>
      <FoodPageContent />
    </Suspense>
    </UserLayout>
  )
}
