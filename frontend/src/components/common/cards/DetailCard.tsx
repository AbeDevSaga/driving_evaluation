"use client";
import React from "react";
import { CheckCircle, XCircle, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export type DetailCardItem = {
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  date: Date;
  active: boolean;
};

function DetailCard({ item }: { item: DetailCardItem }) {
  const Icon = item.icon;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div
        className={cn(
          "p-4 rounded-lg border",
          item.active
            ? "bg-emerald-50 border-emerald-100"
            : "bg-gray-50 border-gray-100"
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={cn(
                "p-2 rounded-lg",
                item.active
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-gray-100 text-gray-600"
              )}
            >
              <Icon className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm text-gray-500">{item.title}</p>
              <p className="text-lg font-semibold mt-1">
                {item.subtitle || "N/A"}
              </p>
            </div>
          </div>

          {item.active ? (
            <CheckCircle className="h-5 w-5 text-emerald-500" />
          ) : (
            <XCircle className="h-5 w-5 text-gray-400" />
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            {item.date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>

          <span
            className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              item.active
                ? "bg-emerald-100 text-emerald-700"
                : "bg-gray-100 text-gray-700"
            )}
          >
            {item.active ? "Active" : "Inactive"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default DetailCard;
