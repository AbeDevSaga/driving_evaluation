"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";

import { User2Icon, XCircleIcon } from "lucide-react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useGetUserByIdQuery } from "@/redux/api/userApi";

/* -------------------- Types -------------------- */
type ChangePasswordFormData = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};

const ProfilePage = () => {
    const { userId } = useParams();
    const [showPasswords, setShowPasswords] = useState(false);
    const { data: userData } = useGetUserByIdQuery(userId as string);
    console.log(userData, "check userData", userId)

    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
        reset,
        setError,
    } = useForm<ChangePasswordFormData>({
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    /* -------------------- Handlers -------------------- */
    const handleChangePassword = async (data: ChangePasswordFormData) => {
        /* ---- Manual validation ---- */
        if (!data.currentPassword) {
            setError("currentPassword", {
                type: "manual",
                message: "Current password is required",
            });
            return;
        }

        if (!data.newPassword) {
            setError("newPassword", {
                type: "manual",
                message: "New password is required",
            });
            return;
        }

        if (data.newPassword.length < 8) {
            setError("newPassword", {
                type: "manual",
                message: "Password must be at least 8 characters",
            });
            return;
        }

        if (data.newPassword !== data.confirmPassword) {
            setError("confirmPassword", {
                type: "manual",
                message: "Passwords do not match",
            });
            return;
        }

        try {

            reset();
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Failed to change password"
            );
        }
    };
    if (!userData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <XCircleIcon className="h-14 w-14 text-red-500 mx-auto mb-3" />
                    <p>No user data found</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen w-full bg-[#F9FBFC] p-6">
                <div className="w-full mx-auto space-y-6">
                    <div className="bg-white w-full rounded-xl border shadow-sm">
                        <div className="flex items-center gap-4 border-b px-6 py-4">
                            <div className="relative w-20 h-20 rounded-full border overflow-hidden flex items-center justify-center">
                                {userData.profile_image ? (
                                    <Image
                                        src={userData.profile_image}
                                        alt={userData.full_name || "Profile Image"}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <User2Icon className="h-10 w-10 text-[#094C81]" />
                                )}
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-[#094C81]">
                                    {userData.full_name}
                                </h2>
                                <p className="text-sm text-gray-600">{userData.email}</p>
                            </div>
                        </div>

                        <div className="border-t px-6 py-6">
                            <form
                                onSubmit={handleSubmit(handleChangePassword)}
                                className="flex flex-col gap-4"
                            >
                                <div className="flex gap-3">
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? "Updating..." : "Update User"}
                                    </Button>
                                    <Button variant="outline" type="button"  >
                                        Clear
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfilePage;
