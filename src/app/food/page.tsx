"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import breakfastImage from "@/assets/food2.jpg";
import lunchImage from "@/assets/food1.jpg";
import dinnerImage from "@/assets/food3.jpg";
import UserLayout from "@/components/userlayout";
import { ReviewsPageSkeleton } from "@/components/skeleton-loader";

const mealImages = {
  breakfast: breakfastImage,
  lunch: lunchImage,
  dinner: dinnerImage,
};

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
];

function FoodPageContent() {
  const [weeklyMenu, setWeeklyMenu] = useState<Record<string, Record<string, string[]>>>({});
  const [activeDay, setActiveDay] = useState("monday");
  const searchParams = useSearchParams();
  const userId = searchParams.get("user_id")
const buildingId= searchParams.get("building_id")
  const router = useRouter();

  useEffect(() => {

    if (!userId) {
      return;
    }

    const fetchMenu = async () => {
      try {
        const res = await fetch(`https://innfo.top/App/api.php?gofor=foodplanlist&user_id=${userId}`);
        const data = await res.json();

        const formattedMenu: Record<string, Record<string, string[]>> = {};

        data.forEach((item: any) => {
          const dayKey = item.day.toLowerCase();
          const mealKey = item.meal_type.toLowerCase();

          if (!formattedMenu[dayKey]) {
            formattedMenu[dayKey] = {
              breakfast: [],
              lunch: [],
              dinner: [],
            };
          }

          formattedMenu[dayKey][mealKey] = item.menu.split(",").map((m: string) => m.trim());
        });

        setWeeklyMenu(formattedMenu);
      } catch (err) {
        console.error("Failed to fetch food plan", err);
      }
    };

    fetchMenu();
  }, []);

  const allDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const meals = ["breakfast", "lunch", "dinner"];

  return (
    <div>
        <div className="container px-4 pt-[80px] pb-10">
          <h1 className="text-xl font-bold mb">Food Plan</h1>
          <p className="text-gray-600 mb-2">Discover our delicious and nutritious weekly meal plan.</p>

          <Tabs defaultValue="weekly">
            <TabsList className="grid grid-cols-2 w-full mb-4">
              <TabsTrigger value="weekly">Weekly Menu</TabsTrigger>
              <TabsTrigger value="monthly">Monthly Plan</TabsTrigger>
            </TabsList>

            {/* Weekly Tab */}
            <TabsContent value="weekly">
              <div className="flex overflow-x-auto pb-2 gap-2 mb-6">
                {allDays.map((day) => (
                  <button
                    key={day}
                    onClick={() => setActiveDay(day)}
                    className={`px-4 py-2 rounded-md whitespace-nowrap text-sm font-medium transition-colors ${activeDay === day
                        ? "bg-primary text-white"
                        : "bg-gray-100 hover:bg-gray-200"
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
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {meals.map((meal) => (
                  <div
                    key={meal}
                    className="flex flex-row items-start bg-white rounded-xl shadow-lg p-4"
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

                      <ul className="space-y-2 text-sm text-gray-700 mb-2">
                        {(weeklyMenu?.[activeDay]?.[meal] || []).map((item, i) => (
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

            {/* Monthly Tab */}
            <TabsContent value="monthly">
              <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
                <table className="min-w-full text-sm text-left text-gray-700">
                  <thead className="bg-gray-100 text-gray-900 text-xs tracking-wider">
                    <tr>
                      <th className="px-6 py-4 border-b border-gray-200">Week</th>
                      <th className="px-6 py-4 border-b border-gray-200">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyPlan.map((week, idx) => (
                      <tr
                        key={idx}
                        className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-6 py-4 font-medium border-b border-gray-100">
                          {week.title}
                        </td>
                        <td className="px-6 py-4 border-b border-gray-100">
                          {week.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>

          {/* Mess Rules */}
          <div className="mt-10 bg-gray-50 rounded-xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">Mess Rules & Timings</h2>
            <ul className="list-disc pl-6 space-y-2 text-sm text-gray-700">
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

  );
}


export default function FoodPage() {
  return (
    <UserLayout>
      <Suspense fallback={<ReviewsPageSkeleton />}>
        <FoodPageContent />
      </Suspense>
    </UserLayout>
  )
}
