"use client";

import { Suspense } from "react";
import {
  Clock,
  Utensils,
  Wifi,
  Tv,
  Users,
  Volume2,
  Trash2,
  ShieldAlert,
  Zap,
  Droplet,
  Bed,
  Sofa,
  ShieldCheck,
  Refrigerator,
  Microwave,
  Home,
  Brush,
  WashingMachine,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RulesPageSkeleton } from "@/components/skeleton-loader";
import UserLayout from "@/components/userlayout";

function RulesPageContent() {
  return (
    <div className="container mx-auto px-4 pt-[80px] pb-12">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-bold mb">Rules & Facilities</h1>
          <p className="text-muted-foreground">
            House rules and available facilities at PG accommodation.
          </p>
        </div>

        <Tabs defaultValue="rules" className="w-full">
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="rules">House Rules</TabsTrigger>
            <TabsTrigger value="facilities">Facilities</TabsTrigger>
          </TabsList>

          {/* RULES */}
          <TabsContent value="rules">
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-8">
              <Section
                title="Timings"
                icon={<Clock className="text-primary" />}
              >
                <RuleList
                  items={[
                    "Gate Closing Time: 11:00 PM. Entry after this time requires prior permission.",
                    "Breakfast: 7:00 AM - 9:00 AM",
                    "Lunch: 12:30 PM - 2:30 PM",
                    "Dinner: 8:00 PM - 10:00 PM",
                  ]}
                />
              </Section>

              <Section
                title="Visitors"
                icon={<Users className="text-primary" />}
              >
                <RuleList
                  items={[
                    "Visitors are allowed only in the common area from 9:00 AM to 8:00 PM.",
                    "Overnight guests are not permitted without prior approval.",
                    "All visitors must register at the reception.",
                  ]}
                />
              </Section>

              <Section
                title="Noise & Disturbance"
                icon={<Volume2 className="text-primary" />}
              >
                <RuleList
                  items={[
                    "Maintain silence between 10:00 PM and 6:00 AM.",
                    "Use headphones when listening to music or watching videos.",
                    "Group gatherings in rooms should not disturb others.",
                  ]}
                />
              </Section>

              <Section
                title="Cleanliness"
                icon={<Trash2 className="text-primary" />}
              >
                <RuleList
                  items={[
                    "Keep your room clean and tidy.",
                    "Dispose of waste in designated bins only.",
                    "Room cleaning service is provided twice a week.",
                    "Common areas should be kept clean after use.",
                  ]}
                />
              </Section>

              <Section
                title="Prohibited Items"
                icon={<ShieldAlert className="text-primary" />}
              >
                <RuleList
                  items={[
                    "Smoking is strictly prohibited inside the premises.",
                    "Alcohol consumption is not allowed.",
                    "Cooking in rooms is not permitted.",
                    "Pets are not allowed.",
                  ]}
                />
              </Section>
            </div>
          </TabsContent>

          {/* FACILITIES */}
          <TabsContent value="facilities">
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    icon: <Wifi className="text-primary" />,
                    title: "High-Speed WiFi",
                    desc: "24/7 internet access with 100 Mbps speed",
                  },
                  {
                    icon: <Utensils className="text-primary" />,
                    title: "Dining Area",
                    desc: "Spacious dining hall with nutritious meals",
                  },
                  {
                    icon: <Tv className="text-primary" />,
                    title: "Common Room",
                    desc: "TV, indoor games, and comfortable seating",
                  },
                  {
                    icon: <Zap className="text-primary" />,
                    title: "Power Backup",
                    desc: "24/7 power backup for uninterrupted service",
                  },
                  {
                    icon: <Droplet className="text-primary" />,
                    title: "Water Purifier",
                    desc: "RO purified drinking water available 24/7",
                  },
                ].map(({ icon, title, desc }, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-full">{icon}</div>
                    <div>
                      <h4 className="font-semibold">{title}</h4>
                      <p className="text-sm text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">
                  Amenities Checklist
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    [<Home />, "Fully furnished rooms"],
                    [<ShieldCheck />, "24/7 security"],
                    [<Sofa />, "Study table and chair"],
                    [<Bed />, "Wardrobe"],
                    [<Refrigerator />, "Refrigerator in common area"],
                    [<Microwave />, "Microwave in common area"],
                    [<Droplet />, "Hot water supply"],
                    [<Brush />, "Housekeeping"],
                    [<WashingMachine />, "Laundry service"],
                  ].map(([icon, label], i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="p-1.5 rounded-full bg-primary/10 text-primary">
                        {icon}
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">Room Types</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    {
                      title: "Single Room",
                      features: [
                        "Private room for one person",
                        "Single bed with mattress",
                        "Study table and chair",
                        "Wardrobe",
                        "Attached/Shared bathroom",
                      ],
                    },
                    {
                      title: "Double Sharing",
                      features: [
                        "Room shared by two people",
                        "Two single beds with mattresses",
                        "Two study tables and chairs",
                        "Two wardrobes",
                        "Attached/Shared bathroom",
                      ],
                    },
                    {
                      title: "Triple Sharing",
                      features: [
                        "Room shared by three people",
                        "Three single beds with mattresses",
                        "Three study tables and chairs",
                        "Three wardrobes",
                        "Attached/Shared bathroom",
                      ],
                    },
                  ].map((room, i) => (
                    <div
                      key={i}
                      className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl"
                    >
                      <h4 className="font-semibold mb-2">{room.title}</h4>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        {room.features.map((f, j) => (
                          <li key={j}>• {f}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

const Section = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div>
    <h3 className="text-lg font-semibold flex items-center gap-2 mb-2">
      {icon}
      {title}
    </h3>
    {children}
  </div>
);

const RuleList = ({ items }: { items: string[] }) => (
  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
    {items.map((item, i) => (
      <li key={i}>{item}</li>
    ))}
  </ul>
);

export default function RulesPage() {
  return (
     <UserLayout>
    <Suspense fallback={<RulesPageSkeleton />}>
      <RulesPageContent />
    </Suspense>
    </UserLayout>
  );
}
