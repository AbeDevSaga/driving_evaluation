"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";




import { User2Icon, XCircleIcon } from "lucide-react";

// import { getFileUrl } from 
import { toast } from "sonner";

// import { useUpdatePasswordMutation } from "@/redux/services/authApi";
import { LockClosedIcon } from "@radix-ui/react-icons";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

/* -------------------- Types -------------------- */
type ChangePasswordFormData = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};

const ProfilePage = () => {
    const { data: session, status } = useSession();
    const user = session?.user;

    // const [updatePassword] = useUpdatePasswordMutation();

    const [showPasswords, setShowPasswords] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
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
            // const res = await updatePassword({
            //     current_password: data.currentPassword,
            //     new_password: data.newPassword,
            // } as Parameters<typeof updatePassword>[0]);

            // if ("error" in res && res.error) {
            //     const message =
            //         "data" in res.error &&
            //             typeof res.error.data === "object" &&
            //             res.error.data !== null &&
            //             "message" in res.error.data
            //             ? String(res.error.data.message)
            //             : "Failed to change password";
            //     throw new Error(message);
            // }

            // toast.success("Password changed successfully");
            reset();
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Failed to change password"
            );
        }
    };

    /* -------------------- Loading -------------------- */

    /* -------------------- No User -------------------- */
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <XCircleIcon className="h-14 w-14 text-red-500 mx-auto mb-3" />
                    <p>No user data found</p>
                </div>
            </div>
        );
    }

    /* -------------------- UI -------------------- */
    return (
        <>

            <div className="min-h-screen w-full bg-[#F9FBFC] p-6">
                <div className="w-full mx-auto space-y-6">

                    <div className="bg-white w-full rounded-xl border shadow-sm">
                        {/* Header */}
                        <div className="flex items-center gap-4 border-b px-6 py-4">
                            <div className="relative w-20 h-20 rounded-full border overflow-hidden flex items-center justify-center">
                                {user.profile_image ? (
                                    <Image
                                        src={getFileUrl(user.profile_image)}
                                        alt={user.name || "Profile Image"}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <User2Icon className="h-10 w-10 text-[#094C81]" />
                                )}
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold text-[#094C81]">
                                    {user.name}
                                </h2>
                                <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                        </div>
                        {/* <div className="flex p-6">
                            <p className="text-sm text-gray-600">{user.phone_number}</p>
                        </div> */}
                        {/* Change Password */}
                        <div className="border-t px-6 py-6">
                            <div className="flex items-center gap-2 mb-4">
                                <LockClosedIcon className="h-5 w-5" />
                                <h3 className="font-semibold">Change Password</h3>
                            </div>

                            <form
                                onSubmit={handleSubmit(handleChangePassword)}
                                className="flex flex-col gap-4"
                            >
                                <div className="flex gap-4 flex-col md:flex-row">
                                    <div className="w-full">
                                        <Label className="mb-2">Current password</Label>
                                        <Input
                                            type={showPasswords ? "text" : "password"}
                                            {...register("currentPassword")}
                                        // error={!!errors.currentPassword}
                                        // hint={errors.currentPassword?.message}
                                        />
                                    </div>

                                    <div className="w-full">
                                        <Label className="mb-2">New password</Label>
                                        <Input
                                            type={showPasswords ? "text" : "password"}
                                            {...register("newPassword")}
                                        // error={!!errors.newPassword}
                                        // hint={errors.newPassword?.message}
                                        />
                                    </div>

                                    <div className="w-full">
                                        <Label className="mb-2">Confirm password</Label>
                                        <Input
                                            type={showPasswords ? "text" : "password"}
                                            {...register("confirmPassword")}
                                        // error={!!errors.confirmPassword}
                                        // hint={errors.confirmPassword?.message}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="showPassword"
                                        className="w-4 h-4"
                                        onChange={() => setShowPasswords((v) => !v)}
                                    />
                                    <label htmlFor="showPassword">Show Password</label>
                                </div>

                                <div className="flex gap-3">
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? "Changing..." : "Change Password"}
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
