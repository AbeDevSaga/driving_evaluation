"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, FileText, Users, Car } from "lucide-react";

const dataCards: DataCardItem[] = [
  {
    id: 1,
    title: "Total Exams",
    subtitle: "All registered exams",
    icon: FileText,
  },
  {
    id: 2,
    title: "Applicants",
    subtitle: "Registered drivers",
    icon: Users,
  },
  {
    id: 3,
    title: "Vehicle Categories",
    subtitle: "License classifications",
    icon: Car,
  },
];

/* =========================
   Component
========================= */
function BaseDataCard01() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {dataCards.map((item) => {
        const Icon = item.icon;

        return (
          <Card
            key={item.id}
            className="rounded-2xl shadow-md transition hover:shadow-lg"
          >
            <CardContent className="flex items-center justify-between p-6">
              {/* Left Section */}
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>

                <div>
                  <h4 className="text-sm font-semibold">{item.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              {/* Action */}
              <Button variant="outline" size="sm" className="rounded-lg gap-1">
                <Eye className="h-4 w-4" />
                View
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default BaseDataCard01;
