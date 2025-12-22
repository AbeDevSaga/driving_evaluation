"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  useGetExternalUserTypesQuery,
  useGetUsersQuery,
  useGetUserTypesQuery,
} from "@/redux/api/userApi";
import { Check, XIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateAssignmentMutation } from "@/redux/api/examinerAssignmentApi";
import { useGetSchedulesByExamQuery } from "@/redux/api/examScheduleApi";
import { CreateExaminerAssignmentPayload } from "@/redux/types/examinerAssignment";
import { formatExamDateTime } from "@/utils/examScheduleConverter";

interface CreateExamExaminerProps {
  exam_id: string;
  section_id: string;
  user_type?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const CreateExamExaminerModal = ({
  user_type,
  exam_id,
  section_id,
  isOpen,
  onClose,
}: CreateExamExaminerProps) => {
  const [selectedSchedule, setSelectedSchedule] = useState<string>("");
  const [selectedExaminer, setSelectedExaminer] = useState<string>("");

  const { data: userTypes = [] } = useGetExternalUserTypesQuery();
  const userTypeId = userTypes?.find(
    (type: any) => type.name === user_type
  )?.external_user_type_id;

  const { data: scheduleResponse } = useGetSchedulesByExamQuery(exam_id);
  const { data: eximinerResponse } = useGetUsersQuery({
    external_user_type_id: userTypeId,
  });

  const schedules = scheduleResponse || [];
  const examiners = eximinerResponse || [];

  const [createExaminer, { isLoading }] = useCreateAssignmentMutation();

  const handleSubmit = async () => {
    if (!selectedSchedule || !section_id || !selectedExaminer) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload: CreateExaminerAssignmentPayload = {
      examiner_id: selectedExaminer,
      section_id: section_id,
      exam_schedule_id: selectedSchedule,
    };

    try {
      await createExaminer(payload).unwrap();
      toast.success("Examier Assigned successfully!");
      handleClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to assign examiner");
    }
  };

  const handleClose = () => {
    setSelectedExaminer("");
    setSelectedSchedule("");
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
                Examiner <span className="text-red-500">*</span>
              </Label>

              <Select
                value={selectedExaminer}
                onValueChange={setSelectedExaminer}
              >
                <SelectTrigger className="w-full h-12 border border-gray-300 px-4 py-5 rounded-md focus:ring focus:ring-[#094C81] focus:border-transparent transition-all duration-200 outline-none">
                  <SelectValue placeholder="Select Structure" />
                </SelectTrigger>

                <SelectContent className="text-[#094C81] bg-white max-h-64 overflow-y-auto">
                  {examiners.map((s: any) => (
                    <SelectItem key={s.user_id} value={s.user_id}>
                      {`${s.full_name} (${s.email})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Exam Schedules */}
            <div className="w-full space-y-2">
              <Label className="block text-sm text-[#094C81] font-medium mb-2">
                Exam Schedule <span className="text-red-500">*</span>
              </Label>

              <Select
                value={selectedSchedule}
                onValueChange={setSelectedSchedule}
              >
                <SelectTrigger className="w-full h-12 border border-gray-300 px-4 py-5 rounded-md focus:ring focus:ring-[#094C81] focus:border-transparent transition-all duration-200 outline-none">
                  <SelectValue placeholder="Select User Type" />
                </SelectTrigger>

                <SelectContent className="text-[#094C81] bg-white max-h-64 overflow-y-auto">
                  {schedules.map((s: any) => (
                    <SelectItem key={s.schedule_id} value={s.schedule_id}>
                      {formatExamDateTime(s.exam_date)}
                    </SelectItem>
                  ))}
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
