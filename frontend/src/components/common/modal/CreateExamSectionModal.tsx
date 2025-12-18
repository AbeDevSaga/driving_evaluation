"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

import { CreateExamSectionPayload } from "@/redux/types/examSection";
import { useCreateExamSectionMutation } from "@/redux/api/examSectionApi";

interface CreateExamSectionModal {
  exam_id: string;
  isOpen: boolean;
  onClose: () => void;
}

export const CreateExamSectionModal = ({
  exam_id,
  isOpen,
  onClose,
}: CreateExamSectionModal) => {
  const [name, setName] = useState("");
  const [maxScore, setMaxScore] = useState(0);
  const [weightPercentage, setWeightPercentage] = useState<number>(70);

  const [createExamSection, { isLoading }] = useCreateExamSectionMutation();

  const handleSubmit = async () => {
    if (!name || !weightPercentage) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload: CreateExamSectionPayload = {
      exam_id: exam_id,
      name: name,
      max_score: maxScore,
      weight_percentage: weightPercentage,
    };

    try {
      await createExamSection(payload).unwrap();
      toast.success("Exam Section created successfully!");
      handleClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create exam section");
    }
  };

  const handleClose = () => {
    setName("");
    setMaxScore(0);
    setWeightPercentage(0);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) handleClose();
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
            Create Exam Section
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
          {/* User Detail */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4  mt-2 pr-2">
            <div className="space-y-2">
              <Label className="block text-sm text-[#094C81] font-medium mb-2">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full h-12 border border-gray-300 px-4 py-3 rounded-md focus:ring focus:ring-[#094C81] focus:border-transparent transition-all duration-200 outline-none"
              />
            </div>
            <div className="space-y-2">
              <Label className="block text-sm text-[#094C81] font-medium mb-2">
                Weight Percentage <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={weightPercentage}
                onChange={(e) => setWeightPercentage(Number(e.target.value))}
                placeholder="e.g. 60"
                className="w-full h-12 border border-gray-300 px-4 py-3 rounded-md focus:ring focus:ring-[#094C81] focus:border-transparent transition-all duration-200 outline-none"
              />
            </div>
            <div className="space-y-2">
              <Label className="block text-sm text-[#094C81] font-medium mb-2">
                Max Score <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={maxScore}
                onChange={(e) => setMaxScore(Number(e.target.value))}
                placeholder="e.g. 60"
                className="w-full h-12 border border-gray-300 px-4 py-3 rounded-md focus:ring focus:ring-[#094C81] focus:border-transparent transition-all duration-200 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="min-w-24"
          >
            {isLoading ? "Creating..." : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
};
