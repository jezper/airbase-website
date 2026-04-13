"use server";

import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { redirect } from "next/navigation";

export interface SessionData {
  isAuthenticated: boolean;
}

const sessionOptions = {
  cookieName: "airbase_admin_session",
  password: process.env.SESSION_SECRET || (() => { throw new Error("SESSION_SECRET env var is required"); })(),
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session.isAuthenticated === true;
}

export async function login(password: string): Promise<{ success: boolean; error?: string }> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return { success: false, error: "Admin password not configured." };
  }
  if (password !== adminPassword) {
    return { success: false, error: "Incorrect password." };
  }
  const session = await getSession();
  session.isAuthenticated = true;
  await session.save();
  return { success: true };
}

export async function logout(): Promise<void> {
  const session = await getSession();
  session.destroy();
  redirect("/admin/login");
}
