"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useGetRolesQuery } from "@/redux/api/roleApi";
import {
  useCreateUserMutation,
  useGetUserTypesQuery,
} from "@/redux/api/userApi";
import { CreateUserPayload } from "@/redux/types/user";
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

interface CreateUserModalProps {
  user_type?: string;
  structure_node_id?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  user_type,
  structure_node_id,
  isOpen,
  onClose,
}) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedStructure, setSelectedStructure] = useState<string>("");

  const { data: rolesResponse } = useGetRolesQuery();
  const { data: structureResponse = [] } = useGetStructureNodesQuery(
    undefined,
    { skip: !!structure_node_id }
  );
  const roles = rolesResponse || [];
  const structures = structureResponse || [];

  const {
    data: userTypes = [],
    isLoading: isLoadingType,
    isError: typeError,
    refetch: refetchType,
  } = useGetUserTypesQuery();

  const [createUser, { isLoading }] = useCreateUserMutation();
  const userTypeId = userTypes?.find(
    (type: any) => type.name === user_type
  )?.user_type_id;

  const handleSubmit = async () => {
    if (!fullName || !email || !selectedRoles.length) {
      toast.error("Please fill all required fields");
      return;
    }

    if (user_type && !userTypeId) {
      toast.error("User type not resolved yet");
      return;
    }

    const payload: CreateUserPayload = {
      full_name: fullName,
      email,
      role_ids: selectedRoles,
      ...(phoneNumber && { phone_number: phoneNumber }),
      ...(userTypeId && { user_type_id: userTypeId }),
      ...(structure_node_id && { structure_node_id }),
    };

    try {
      await createUser(payload).unwrap();
      toast.success("User created successfully!");
      handleClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create user");
    }
  };

  const handleClose = () => {
    setFullName("");
    setEmail("");
    setPhoneNumber("");
    setSelectedRoles([]);
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
          <h2 className="text-xl font-semibold text-[#094C81]">Create User</h2>
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
            {!structure_node_id && user_type === "external" && (
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

            <div className="space-y-2">
              <Label className="block text-sm text-[#094C81] font-medium mb-2">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full h-12 border border-gray-300 px-4 py-3 rounded-md focus:ring focus:ring-[#094C81] focus:border-transparent transition-all duration-200 outline-none"
              />
            </div>
            <div className="space-y-2">
              <Label className="block text-sm text-[#094C81] font-medium mb-2">
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+251 9xxxxxxx"
                className="w-full h-12 border border-gray-300 px-4 py-3 rounded-md focus:ring focus:ring-[#094C81] focus:border-transparent transition-all duration-200 outline-none"
              />
            </div>
            <div className="space-y-2">
              <Label className="block text-sm text-[#094C81] font-medium mb-2">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full h-12 border border-gray-300 px-4 py-3 rounded-md focus:ring focus:ring-[#094C81] focus:border-transparent transition-all duration-200 outline-none"
              />
            </div>
            {/* ROLE */}
            {/* ROLE MULTI SELECT */}

            <div className="w-full space-y-2">
              <Label className="block text-sm text-[#094C81] font-medium mb-2">
                Role <span className="text-red-500">*</span>
              </Label>
              <Select
                value="multi" // dummy value to prevent Radix from overriding
                onValueChange={(value) => {
                  setSelectedRoles(
                    (prev) =>
                      prev.includes(value)
                        ? prev.filter((id) => id !== value) // unselect
                        : [...prev, value] // select
                  );
                }}
              >
                <SelectTrigger className="w-full h-12 border border-gray-300 px-4 py-5 rounded-md focus:ring focus:ring-[#094C81] focus:border-transparent transition-all duration-200 outline-none">
                  <div className="flex items-center justify-between w-full">
                    <SelectValue asChild>
                      <span>
                        {selectedRoles.length === 0
                          ? "Select Role"
                          : `${selectedRoles.length} role${
                              selectedRoles.length > 1 ? "s" : ""
                            } selected`}
                      </span>
                    </SelectValue>
                    {selectedRoles.length > 0 && (
                      <span className="text-xs bg-[#094C81] text-white rounded-full w-5 h-5 flex items-center justify-center">
                        {selectedRoles.length}
                      </span>
                    )}
                  </div>
                </SelectTrigger>

                <SelectContent className="text-[#094C81] bg-white max-h-64 overflow-y-auto">
                  {roles.map((r: any) => {
                    const isSelected = selectedRoles.includes(r.role_id);
                    return (
                      <SelectItem
                        key={r.role_id}
                        value={r.role_id}
                        className="relative pr-8 cursor-pointer"
                        onPointerDown={(e) => e.preventDefault()} // ✅ keep dropdown open
                      >
                        <span className="block truncate">{r.name}</span>

                        <div
                          className={`absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 border-2 rounded flex items-center justify-center transition-all duration-200 ${
                            isSelected
                              ? "bg-[#094C81] border-[#094C81] text-white"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-3" />}
                        </div>
                      </SelectItem>
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
