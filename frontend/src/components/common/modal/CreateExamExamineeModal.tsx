"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  useGetExternalUserTypesQuery,
  useGetUsersQuery,
} from "@/redux/api/userApi";
import { Check, XIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateExamineeExamPayload } from "@/redux/types/examineeExam";
import { useGetExamByIdQuery } from "@/redux/api/examApi";
import { useCreateExamineeExamMutation } from "@/redux/api/examineeExamApi";

interface CreateExamExaminerProps {
  exam_id: string;
  exam_schedule_id: string;
  isOpen: boolean;
  onClose: () => void;
}

export const CreateExamExamineeModal = ({
  exam_id,
  exam_schedule_id,
  isOpen,
  onClose,
}: CreateExamExaminerProps) => {
  const [selectedSchedule, setSelectedSchedule] = useState<string>("");
  const [selectedExaminees, setSelectedExaminees] = useState<string[]>([]);

  const { data: examData, isLoading: examLoading, isError: examError } = useGetExamByIdQuery(exam_id);

  const { data: userTypes = [] } = useGetExternalUserTypesQuery();
  const userTypeId = userTypes?.find(
    (type: any) => type.name === "examinee"
  )?.external_user_type_id;

  const vehicle_category_id = examData?.vehicleCategory?.vehicle_category_id

  const { data: eximineeResponse } = useGetUsersQuery({
    external_user_type_id: userTypeId,
    structure_node_id: examData?.structure_node_id,
    vehicle_category_id: vehicle_category_id,
    exam_schedule_id: exam_schedule_id,

  });

  const examinees = eximineeResponse || [];

  const [createExamineeExam, { isLoading }] = useCreateExamineeExamMutation();

  const handleSubmit = async () => {
    if (!exam_schedule_id || selectedExaminees.length === 0) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload: CreateExamineeExamPayload = {
      exam_id: exam_id,
      examinee_ids: selectedExaminees,
      exam_schedule_id: exam_schedule_id,
    };

    try {
      await createExamineeExam(payload).unwrap();
      toast.success("Examier Assigned successfully!");
      handleClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to assign examiner");
    }
  };

  const handleClose = () => {
    setSelectedExaminees([]);
    setSelectedSchedule("");
    onClose();
  };

  const toggleExaminee = (userId: string) => {
    setSelectedExaminees((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
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
            Assign Examiner
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
          {/* Examiner Detail */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4  mt-2 pr-2">
            <div className="w-full space-y-2">
              <Label className="block text-sm text-[#094C81] font-medium mb-2">
                Examinees <span className="text-red-500">*</span>
              </Label>
              <Select>
                <SelectTrigger className="w-full h-12 border border-gray-300 px-4 py-5 rounded-md focus:ring focus:ring-[#094C81] focus:border-transparent transition-all duration-200 outline-none">
                  <SelectValue placeholder="Select Examinees" />
                </SelectTrigger>

                <SelectContent className="text-[#094C81] bg-white max-h-64 overflow-y-auto">
                  {examinees.map((s: any) => {
                    const checked = selectedExaminees.includes(s.user_id);

                    return (
                      <div
                        key={s.user_id}
                        className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-100"
                        onClick={() => toggleExaminee(s.user_id)}
                      >
                        {/* Checkbox */}
                        <div className="flex items-center justify-center w-4 h-4 border rounded-sm">
                          {checked && <Check className="w-3 h-3 text-[#094C81]" />}
                        </div>

                        {/* Label */}
                        <span className="text-sm">
                          {s.full_name} ({s.email})
                        </span>
                      </div>
                    );
                  })}
                </SelectContent>

              </Select>
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
