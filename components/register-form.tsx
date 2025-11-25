"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signUp } from "@/lib/auth-client"

export function RegisterForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"user" | "manager" | "admin">("user")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      setLoading(false)
      return
    }

    try {
      const result = await signUp.email({
        email,
        password,
        name,
      })

      if (result.error) {
        setError(result.error.message || "Failed to create account")
        setLoading(false)
        return
      }

      // Update user role if not default "user"
      if (role !== "user") {
        try {
          // Wait a moment for session to be established
          await new Promise(resolve => setTimeout(resolve, 300))
          
          const roleRes = await fetch("/api/auth/set-role", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role }),
          })

          if (!roleRes.ok) {
            const errorData = await roleRes.json()
            console.error("Failed to set role:", errorData.error)
            // Don't block navigation, role can be updated later
          }
        } catch (roleErr) {
          console.error("Error setting role:", roleErr)
          // Don't block navigation
        }
      }

      router.push("/dashboard")
      router.refresh()
    } catch (err) {
      setError("An unexpected error occurred")
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-lg">
      <div className="glass-card">
        <div className="text-center mb-8">
          <div className="inline-block p-3 glass-surface rounded-2xl mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold heading-gradient mb-2">Create Account</h1>
          <p className="text-muted-foreground">Join us and start managing your tasks</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="glass-surface p-4 border border-destructive/20 rounded-xl">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-destructive text-sm font-medium">{error}</span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-semibold text-foreground tracking-wide">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="input-modern"
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-semibold text-foreground tracking-wide">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-modern"
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-semibold text-foreground tracking-wide">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-modern"
              placeholder="Create a secure password"
            />
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Must be at least 8 characters long
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="role" className="block text-sm font-semibold text-foreground tracking-wide">
              Account Type
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as "user" | "manager" | "admin")}
              className="input-modern"
            >
              <option value="user">User - Manage your own tasks</option>
              <option value="manager">Manager - View all tasks and mark them complete</option>
              <option value="admin">Admin - Full access to all tasks and users</option>
            </select>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Select your account role
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
                  </svg>
                </>
              )}
            </span>
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-border/30 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link 
              href="/login" 
              className="text-primary font-semibold hover:underline transition-all duration-200 hover:text-primary/80"
            >
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
