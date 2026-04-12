"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/logo";

async function loginAction(password: string): Promise<{ success: boolean; error?: string }> {
  const res = await fetch("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  return res.json();
}

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await loginAction(password);

    if (result.success) {
      router.push("/admin/posts");
    } else {
      setError(result.error ?? "Login failed.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-10 flex justify-center">
          <Logo className="h-6 text-text" />
        </div>

        <div className="bg-bg-card border border-border rounded-lg p-8">
          <h1 className="font-display text-xl font-semibold text-text mb-1">Admin</h1>
          <p className="text-text-muted font-body text-sm mb-6">Enter your password to continue.</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label htmlFor="password" className="block font-body text-sm font-medium text-text-muted mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="w-full bg-bg border border-border rounded px-3 py-2.5 font-body text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                placeholder="Password"
              />
            </div>

            {error && (
              <p className="text-red-400 font-body text-sm mb-4" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-accent hover:bg-accent-hover text-bg font-body text-sm font-bold py-2.5 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
