"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetStructureNodesQuery } from "@/redux/api/structureNodeApi";
import { useGetVehicleCategoriesQuery } from "@/redux/api/vehicleCategoryApi";
import { useCreateExamMutation } from "@/redux/api/examApi";
import { CreateExamPayload } from "@/redux/types/exam";
import { Textarea } from "@/components/ui/textarea";

interface CreateExamModal {
  structure_node_id?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const CreateExamModal = ({
  structure_node_id,
  isOpen,
  onClose,
}: CreateExamModal) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [passPercentage, setPassPercentage] = useState<number>(70);
  const [selectedStructure, setSelectedStructure] = useState<string>("");
  const [selectedVehicleCategory, setSelectedVehicleCategory] =
    useState<string>("");

  const { data: vehicleCategoryResponse } = useGetVehicleCategoriesQuery();
  const { data: structureResponse = [] } = useGetStructureNodesQuery(
    undefined,
    { skip: !!structure_node_id }
  );
  const categories = vehicleCategoryResponse || [];
  const structures = structureResponse || [];

  const [createExam, { isLoading }] = useCreateExamMutation();

  const handleSubmit = async () => {
    if (
      !name ||
      !passPercentage ||
      !selectedStructure.length ||
      !selectedVehicleCategory.length
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload: CreateExamPayload = {
      name: name,
      description,
      pass_percentage: passPercentage,
      vehicle_category_id: selectedVehicleCategory,
      structure_node_id: structure_node_id
        ? structure_node_id
        : selectedStructure,
    };

    try {
      await createExam(payload).unwrap();
      toast.success("Exam created successfully!");
      handleClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create exam");
    }
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setPassPercentage(0);
    setSelectedVehicleCategory("");
    setSelectedStructure("");
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
          <h2 className="text-xl font-semibold text-[#094C81]">Create Exam</h2>
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
            {/* Structure Selection (only if not passed from parent) */}
            {!structure_node_id && (
              <div className="w-full space-y-2">
                <Label className="block text-sm text-[#094C81] font-medium mb-2">
                  Structure <span className="text-red-500">*</span>
                </Label>

                <Select
                  value={selectedStructure}
                  onValueChange={setSelectedStructure}
                >
                  <SelectTrigger className="w-full h-12 border border-gray-300 px-4 py-5 rounded-md focus:ring focus:ring-[#094C81] focus:border-transparent transition-all duration-200 outline-none">
                    <SelectValue placeholder="Select Structure" />
                  </SelectTrigger>

                  <SelectContent className="text-[#094C81] bg-white max-h-64 overflow-y-auto">
                    {structures.map((s: any) => (
                      <SelectItem
                        key={s.structure_node_id}
                        value={s.structure_node_id}
                      >
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {/* Vehicle Category selection */}
            <div className="w-full space-y-2">
              <Label className="block text-sm text-[#094C81] font-medium mb-2">
                Vehicle Category <span className="text-red-500">*</span>
              </Label>

              <Select
                value={selectedVehicleCategory}
                onValueChange={setSelectedVehicleCategory}
              >
                <SelectTrigger className="w-full h-12 border border-gray-300 px-4 py-5 rounded-md focus:ring focus:ring-[#094C81] focus:border-transparent transition-all duration-200 outline-none">
                  <SelectValue placeholder="Select Structure" />
                </SelectTrigger>

                <SelectContent className="text-[#094C81] bg-white max-h-64 overflow-y-auto">
                  {categories.map((s: any) => (
                    <SelectItem
                      key={s.vehicle_category_id}
                      value={s.vehicle_category_id}
                    >
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="block text-sm text-[#094C81] font-medium mb-2">
                Exam Name <span className="text-red-500">*</span>
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter exam name"
                className="w-full h-12 border border-gray-300 px-4 py-3 rounded-md focus:ring focus:ring-[#094C81] focus:border-transparent transition-all duration-200 outline-none"
              />
            </div>

            <div className="space-y-2">
              <Label className="block text-sm text-[#094C81] font-medium mb-2">
                Pass Percentage <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={passPercentage}
                onChange={(e) => setPassPercentage(Number(e.target.value))}
                placeholder="e.g. 60"
                className="w-full h-12 border border-gray-300 px-4 py-3 rounded-md focus:ring focus:ring-[#094C81] focus:border-transparent transition-all duration-200 outline-none"
              />
            </div>
            <div className="space-y-2">
              <Label className="block text-sm text-[#094C81] font-medium mb-2">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                value={description}
                rows={3}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
                className="w-full border border-gray-300 px-4 py-3 rounded-md focus:ring focus:ring-[#094C81] focus:border-transparent transition-all duration-200 outline-none"
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
