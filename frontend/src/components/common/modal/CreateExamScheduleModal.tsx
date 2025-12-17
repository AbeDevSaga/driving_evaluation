"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { XIcon, Calendar, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CreateExamSchedulePayload } from "@/redux/types/examSchedule";
import { useCreateExamScheduleMutation } from "@/redux/api/examScheduleApi";

interface CreateExamScheduleModal {
  exam_id: string;
  isOpen: boolean;
  onClose: () => void;
}

export const CreateExamScheduleModal = ({
  exam_id,
  isOpen,
  onClose,
}: CreateExamScheduleModal) => {
  const [examDate, setExamDate] = useState("");
  const [location, setLocation] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [createExamSchedule, { isLoading }] = useCreateExamScheduleMutation();

  const handleSubmit = async () => {
    if (!examDate) {
      toast.error("Please select an exam date");
      return;
    }

    // Format the date to ISO string
    const formattedDate = new Date(examDate).toISOString();

    const payload: CreateExamSchedulePayload = {
      exam_id: exam_id,
      exam_date: formattedDate,
      ...(location && { location: location.trim() }),
    };

    try {
      await createExamSchedule(payload).unwrap();
      toast.success("Exam schedule created successfully!");
      handleClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create exam schedule");
    }
  };

  const handleClose = () => {
    setExamDate("");
    setLocation("");
    setIsActive(true);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) handleClose();
  };

  // Calculate minimum date (today) for the date picker
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white p-6 rounded-2xl w-full max-w-[700px] shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[#094C81]">
            Create Exam Schedule
          </h2>
          <button
            onClick={handleClose}
            className="text-[#094C81] hover:text-gray-600 transition"
          >
            <XIcon className="w-6 h-6 cursor-pointer" />
          </button>
        </div>

        {/* Content */}
        <div className="w-full flex flex-col space-y-4">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 pr-2">
            {/* Exam Date */}
            <div className="space-y-2 md:col-span-2">
              <Label className="block text-sm text-[#094C81] font-medium mb-2">
                Exam Date <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  type="datetime-local"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  min={getTodayDate()}
                  className="w-full h-12 border border-gray-300 px-4 py-3 rounded-md focus:ring focus:ring-[#094C81] focus:border-transparent transition-all duration-200 outline-none pl-12"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Select the date and time for the exam
              </p>
            </div>

            {/* Location */}
            <div className="space-y-2 md:col-span-2">
              <Label className="block text-sm text-[#094C81] font-medium mb-2">
                Location
              </Label>
              <div className="relative">
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter exam location (optional)"
                  className="w-full h-12 border border-gray-300 px-4 py-3 rounded-md focus:ring focus:ring-[#094C81] focus:border-transparent transition-all duration-200 outline-none pl-12"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Optional: Enter the venue or address for the exam
              </p>
            </div>

            {/* Preview Section */}
            {examDate && (
              <div className="space-y-2 md:col-span-2">
                <Label className="block text-sm text-[#094C81] font-medium mb-2">
                  Schedule Preview
                </Label>
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Exam Date:</span>
                      <span className="font-medium">
                        {new Date(examDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">
                        {new Date(examDate).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    </div>
                    {location && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium text-right max-w-[200px] break-words">
                          {location}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span
                        className={`font-medium ${
                          isActive ? "text-green-600" : "text-gray-500"
                        }`}
                      >
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !examDate}
            className="min-w-24"
          >
            {isLoading ? "Creating..." : "Create Schedule"}
          </Button>
        </div>
      </div>
    </div>
  );
};
