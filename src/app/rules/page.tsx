"use client";

import { Suspense, useEffect, useState } from "react";
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
  Repeat ,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RulesPageSkeleton } from "@/components/skeleton-loader";
import UserLayout from "@/components/userlayout";

import { useRouter, useSearchParams } from "next/navigation";


type APIRule = {
  id: number;
  rule_title: string;
  rule_description: string;
  priority: number;
  status: number;
};

function RulesPageContent() {
  const [rules, setRules] = useState<APIRule[]>([]);
    const router = useRouter();
    const searchParams = useSearchParams();
   const userId = searchParams.get("user_id")
const buildingId= searchParams.get("building_id")

  useEffect(() => {
      if (!userId) {
        return;
      }
    const fetchRules = async () => {
      try {
        const res = await fetch(`https://innfo.top/App/api.php?gofor=ruleslist&user_id=${userId}`);
        const data: APIRule[] = await res.json();

        const activeRules = data.filter((r) => r.status === 1);
        const sortedRules = activeRules.sort((a, b) => a.priority - b.priority);
        setRules(sortedRules);
      } catch (error) {
        console.error("Failed to fetch rules:", error);
      }
    };

    fetchRules();
  }, []);

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

          {/* RULES TAB */}
          <TabsContent value="rules">
            <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
              <Section title="House Rules" icon={<ShieldAlert className="text-primary" />}>
                {rules.length > 0 ? (
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    {rules.map((rule) => (
                      <li key={rule.id}>
                        <span className="font-semibold">{rule.rule_title}: </span>
                        {rule.rule_description}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No rules available at the moment.</p>
                )}
              </Section>
            </div>
          </TabsContent>

          {/* FACILITIES TAB */}
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
                <h3 className="text-lg font-medium mb-3">Amenities Checklist</h3>
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
                    [<Repeat />, "Laundry service"],
                  ].map(([icon, label], i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="p-1.5 rounded-full bg-primary/10 text-primary">
                        {icon}
                      </div>
                      <span className="text-gray-700">
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
                      className="bg-gray-50 p-4 rounded-xl"
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

export default function RulesPage() {
  return (
    <UserLayout>
      <Suspense fallback={<RulesPageSkeleton />}>
        <RulesPageContent />
      </Suspense>
    </UserLayout>
  );
}
