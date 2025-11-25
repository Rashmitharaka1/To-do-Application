"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "@/lib/auth-client"
import Link from "next/link"

type User = {
  id: string
  name: string
  email: string
  role: "user" | "manager" | "admin"
}

type UserWithStats = User & {
  banned: boolean
  createdAt: string
  todoCount: number
}

export function AdminDashboard({ user }: { user: User }) {
  const router = useRouter()
  const [users, setUsers] = useState<UserWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [updating, setUpdating] = useState<string | null>(null)

  async function fetchUsers() {
    try {
      const res = await fetch("/api/admin/users")
      const data = await res.json()

      if (res.ok) {
        setUsers(data.users)
      } else {
        setError(data.error || "Failed to fetch users")
      }
    } catch (err) {
      setError("Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  async function handleSignOut() {
    await signOut()
    router.push("/")
    router.refresh()
  }

  async function handleRoleChange(userId: string, newRole: string) {
    setUpdating(userId)
    setError("")

    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      })

      const data = await res.json()

      if (res.ok) {
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole as any } : u)))
      } else {
        setError(data.error || "Failed to update role")
      }
    } catch (err) {
      setError("Failed to update role")
    } finally {
      setUpdating(null)
    }
  }

  const roleConfig = {
    user: {
      badge: "bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-500/20",
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    manager: {
      badge: "bg-gradient-to-r from-amber-500/10 to-orange-600/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    admin: {
      badge: "bg-gradient-to-r from-emerald-500/10 to-green-600/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
  }

  const getRoleConfig = (role: "user" | "manager" | "admin") => roleConfig[role]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-card/80 border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                    Admin Panel
                  </h1>
                </div>
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs capitalize ${getRoleConfig(user.role).badge}`}>
                {getRoleConfig(user.role).icon}
                <span>{user.role}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-medium text-sm transition-all duration-200 hover:scale-105"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </Link>
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 text-sm">
                <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-muted-foreground font-medium">{user.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive font-medium text-sm transition-all duration-200 hover:scale-105"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="glass-card mb-6">
            <h2 className="text-3xl font-bold mb-2 text-muted-foreground bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text">
              User Management
            </h2>
            <p className="text-muted-foreground text-base">
              Manage user roles and permissions. Changes take effect immediately.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive flex items-center gap-3 backdrop-blur-sm animate-in slide-in-from-top-2 duration-200">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        )}

        {loading ? (
          <div className="glass-card text-center py-16">
            <div className="inline-flex items-center gap-3 text-muted-foreground">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-lg font-medium">Loading users...</span>
            </div>
          </div>
        ) : (
          <div className="glass-card overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">User</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Role</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Todos</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Joined</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => {
                    const roleInfo = getRoleConfig(u.role)
                    return (
                      <tr key={u.id} className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">{u.name}</p>
                              <p className="text-sm text-muted-foreground">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs capitalize w-fit ${roleInfo.badge}`}>
                            {roleInfo.icon}
                            <span>{u.role}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <span className="font-semibold text-foreground">{u.todoCount}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground text-sm">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          {u.id === user.id ? (
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Current user
                            </span>
                          ) : (
                            <select
                              value={u.role}
                              onChange={(e) => handleRoleChange(u.id, e.target.value)}
                              disabled={updating === u.id}
                              className="px-3 py-2 bg-background/60 backdrop-blur-sm border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:bg-background/80"
                            >
                              <option value="user">User</option>
                              <option value="manager">Manager</option>
                              <option value="admin">Admin</option>
                            </select>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {users.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-lg font-medium">No users found.</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 glass-card">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground">Role Permissions</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/5 to-blue-600/5 border border-blue-500/10">
              <div className="flex items-center gap-2 mb-3">
                {getRoleConfig("user").icon}
                <p className="font-semibold text-foreground">User</p>
              </div>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Create own todos</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Read own todos</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Update own todos</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Delete own todos</span>
                </li>
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/5 to-orange-600/5 border border-amber-500/10">
              <div className="flex items-center gap-2 mb-3">
                {getRoleConfig("manager").icon}
                <p className="font-semibold text-foreground">Manager</p>
              </div>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>All User permissions</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>View all todos</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Mark any todo as done</span>
                </li>
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/5 to-green-600/5 border border-emerald-500/10">
              <div className="flex items-center gap-2 mb-3">
                {getRoleConfig("admin").icon}
                <p className="font-semibold text-foreground">Admin</p>
              </div>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>All Manager permissions</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Edit any todo</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Delete any todo</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Manage user roles</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
