"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { ArrowLeftIcon, EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { login } from "@/actions/user";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function ExternalLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { update } = useSession();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log(formData.email, formData.password, "formData");
    const result = await login(formData.email as string, formData.password as string);
    console.log(result, "result");
    if (result?.error) {
      setAuthError(result.error);
    }

    if (result?.success) {
      await update(); // Force session refresh
      router.push(callbackUrl || "/dashboard");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F9FBFC]  flex items-center justify-center px-4">
      <div className="w-full relative max-w-6xl min-h-[80vh] shadow-2xl rounded-2xl border border-[#DCE7F1] overflow-hidden flex flex-col lg:flex-row">
        
        {/* Back Button */}
        <Button
          onClick={() => router.push("/")}
          className="cursor-pointer shadow-none z-50 bg-transparent hover:bg-slate-100 p-2 top-4 left-4 absolute flex items-center gap-1"
        >
          <ArrowLeftIcon className="w-5 h-5 text-secondary" />
          <span className="text-sm text-secondary font-medium">Back</span>
        </Button>

        {/* Left Section */}
        <div className="w-full bg-cover bg-center p-8 flex items-center justify-center">
          <div className="backdrop-blur-md p-6 rounded-xl text-center">
            {/* <div className="w-48   text-white text-2xl font-bold h-48 bg-primary rounded-xl flex items-center justify-center">
              Logo
            </div> */}
            <Image
              src="/logo-ego.png"
              alt="Organization Logo"
              width={300}
              height={300}
              className="mx-auto mb-3 rounded-xl p-2"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full px-16 py-8 flex items-center justify-center">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold text-center text-secondary  mb-6">
              Login
            </h1>

            {authError && (
              <div className="rounded-md w-full text-center bg-red-50 border border-red-200 px-3 py-2 mb-4">
                <div className="text-sm text-red-700">{authError}</div>
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">

              {/* Email */}
              <div>
                <Label className="text-secondary">Email</Label>
                <Input
                  placeholder="example.xx@gov.et"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full h-14 mt-1 px-3 py-2 text-gray-700   rounded-md text-sm border-primary/50   focus:border-primary"
                />
              </div>

              {/* Password */}
              <div>
                <Label className="text-secondary">Password</Label>
                <div className="relative mt-1">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full h-14 px-3 py-2 pr-10 border rounded-md text-sm text-gray-700 border-primary/50 focus:ring-none focus:outline-none focus:border-primary/50"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="h-5 w-5 text-gray-700" />
                    ) : (
                      <EyeOffIcon className="h-5 w-5 text-gray-700" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="w-full text-right">
                <Link href="/forgot-password" className="text-sm text-secondary hover:underline">
                  Forgot Password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className=" disabled:opacity-50 w-full bg-primary h-14 text-center items-center justify-center hover:bg-secondary/90 text-xl text-white font-bold py-2 rounded-xl shadow-md"
              >
                {isLoading ? <span className="flex w-full items-center justify-center"><Loader2 className="w-5 h-5 animate-spin" /> </span>: "Log In"}
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}
