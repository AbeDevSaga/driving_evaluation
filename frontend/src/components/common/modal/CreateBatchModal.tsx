"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CreateBatchPayload } from "@/redux/types/batch";
import { useCreateBatchMutation } from "@/redux/api/batchApi";

interface CreateBatchModalProps {
  vehicle_category_id: string;
  isOpen: boolean;
  onClose: () => void;
}

export const CreateBatchModal = ({
  vehicle_category_id,
  isOpen,
  onClose,
}: CreateBatchModalProps) => {
  const [name, setName] = useState("");
  const [batchCode, setBatchCode] = useState("");
  const [year, setYear] = useState(0);

  const [createBatch, { isLoading }] = useCreateBatchMutation();
  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!name || !year || !batchCode) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload: CreateBatchPayload = {
      vehicle_category_id: vehicle_category_id,
      batch_code: batchCode,
      name: name,
      year: year,
    };

    try {
      await createBatch(payload).unwrap();
      toast.success("Batch created successfully!");
      handleClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create batch");
    }
  };

  const handleClose = () => {
    setName("");
    setBatchCode("");
    setYear(0);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) handleClose();
  };


  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white p-6 rounded-2xl w-full max-w-[700px] shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-secondary">Create Batch</h2>
          <button
            onClick={handleClose}
            className="text-secondary hover:text-gray-600 transition"
          >
            <XIcon className="w-6 h-6 cursor-pointer" />
          </button>
        </div>

        {/* Content */}
        <div className="w-full flex flex-col space-y-4">
          {/* User Detail */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4  mt-2 pr-2">
            <div className="space-y-2">
              <Label className="block text-sm text-secondary font-medium mb-2">
                Batch Code <span className="text-red-500">*</span>
              </Label>
              <Input
                value={batchCode}
                onChange={(e) => setBatchCode(e.target.value)}
                placeholder="Batch Code"
                className="w-full h-12 border border-gray-300 px-4 py-3 rounded-md focus:ring focus:ring-[#094C81] focus:border-transparent transition-all duration-200 outline-none"
              />
            </div>
            <div className="space-y-2">
              <Label className="block text-sm text-secondary font-medium mb-2">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Batch Name"
                className="w-full h-12 border border-gray-300 px-4 py-3 rounded-md focus:ring focus:ring-[#094C81] focus:border-transparent transition-all duration-200 outline-none"
              />
            </div>
            <div className="space-y-2">
              <Label className="block text-sm text-secondary font-medium mb-2">
                Year <span className="text-red-500">*</span>
              </Label>

              <Input
                type="number"
                value={year || ""}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value >= 1900 && value <= new Date().getFullYear() + 1) {
                    setYear(value);
                  }
                }}
                placeholder="Year"
                min={1900}
                max={new Date().getFullYear() + 1}
                className="w-full h-12 border border-gray-300 px-4 py-3 rounded-md
      focus:ring focus:ring-[#094C81] focus:border-transparent
      transition-all duration-200 outline-none"
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
