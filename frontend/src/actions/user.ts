"use server";

import { signIn, signOut, auth } from "@/auth";
import { AuthError } from "next-auth";

export const login = async (email: string, password: string) => {
  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password." };
        default:
          return { error: "Something went wrong." };
      }
    }
    throw error;
  }
};

export const logout = async () => {
  await signOut({ redirectTo: "/login" });
};

export const getSession = async () => {
  return await auth();
};

export const getCurrentUser = async () => {
  const session = await auth();
  return session?.user ?? null;
};

export const checkPermission = async (permissionKey: string) => {
  const session = await auth();
  if (!session?.user?.permissions) return false;
  return session.user.permissions.includes(permissionKey);
};

export const hasRole = async (roleName: string) => {
  const session = await auth();
  if (!session?.user?.roles) return false;
  return session.user.roles.some((role) => role.name === roleName);
};