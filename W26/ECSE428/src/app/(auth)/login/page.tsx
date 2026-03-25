"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginAction } from "@/app/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/player/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">IT</span>
            </div>
            <span className="text-2xl font-bold">ITMS</span>
          </Link>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground mt-1">
            Sign in to your account
          </p>
        </div>

        <div className="rounded-xl border border-border/50 bg-card p-6 space-y-6">
          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@mail.mcgill.ca"
                required
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Register
            </Link>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-border/50 bg-card/50 p-4">
          <p className="text-xs text-muted-foreground mb-2 font-medium">
            Quick Login (MVP Mock Users):
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              { email: "john.doe@mail.mcgill.ca", role: "Player" },
              { email: "captain.kirk@mail.mcgill.ca", role: "Captain" },
              { email: "admin@mcgill.ca", role: "Admin" },
              { email: "ref.jones@mail.mcgill.ca", role: "Official" },
            ].map((user) => (
              <button
                key={user.email}
                type="button"
                onClick={() => {
                  const emailInput = document.getElementById("email") as HTMLInputElement;
                  const passwordInput = document.getElementById("password") as HTMLInputElement;
                  if (emailInput && passwordInput) {
                    emailInput.value = user.email;
                    passwordInput.value = "Password1!";
                  }
                }}
                className="rounded-md border border-border/50 p-2 text-left hover:bg-accent transition-colors"
              >
                <div className="font-medium">{user.role}</div>
                <div className="text-muted-foreground truncate">{user.email}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
