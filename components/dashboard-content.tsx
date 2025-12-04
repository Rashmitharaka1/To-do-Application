"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "@/lib/auth-client"
import { TodoList } from "@/components/todo-list"
import { AddTodoForm } from "@/components/add-todo-form"
import Link from "next/link"

type User = {
  id: string
  name: string
  email: string
  role: "user" | "manager" | "admin"
}

type Todo = {
  id: string
  title: string
  description: string | null
  completed: boolean
  userId: string
  userName: string
  userEmail: string
  createdAt: string
  updatedAt: string
}

export function DashboardContent({ user }: { user: User }) {
  const router = useRouter()
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function fetchTodos() { //makes an api call to the backend route
    try {
      const res = await fetch("/api/todos")
      const data = await res.json()

      if (res.ok) {
        setTodos(data.todos)
      } else {
        setError(data.error || "Failed to fetch todos")
      }
    } catch (err) {
      setError("Failed to fetch todos")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  async function handleSignOut() {
    await signOut()
    router.push("/")
    router.refresh()
  }

  function handleTodoAdded(todo: { id: string; title: string; description: string | null; completed: boolean; userId: string; createdAt: string; updatedAt: string }) {
    const newTodo: Todo = {
      ...todo,
      userName: user.name,
      userEmail: user.email,
    }
    setTodos((prev) => [newTodo, ...prev])
  }

  function handleTodoUpdated(updatedTodo: Todo) {
    setTodos((prev) => prev.map((t) => (t.id === updatedTodo.id ? { ...t, ...updatedTodo } : t)))
  }

  function handleTodoDeleted(id: string) {
    setTodos((prev) => prev.filter((t) => t.id !== id))
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

  const roleInfo = roleConfig[user.role]
  const pendingCount = todos.filter((t) => !t.completed).length
  const completedCount = todos.filter((t) => t.completed).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background">
      {/* Modern Header with Glassmorphism */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-card/80 border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                    Todo App
                  </h1>
                </div>
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium text-xs capitalize ${roleInfo.badge}`}>
                {roleInfo.icon}
                <span>{user.role}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-medium text-sm transition-all duration-200 hover:scale-105"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Admin Panel
                </Link>
              )}
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
        {/* Hero Section */}
        <div className="mb-8">
          <div className="glass-card mb-6">
            <h2 className="text-3xl font-bold mb-2 text-muted-foreground bg-gradient-to-r from-foreground via-foreground to-foreground/60 bg-clip-text">
              {user.role === "user" ? "My Tasks" : "All Tasks"}
            </h2>
            <p className="text-muted-foreground text-base">
              {user.role === "user" && "Create and manage your personal tasks with ease."}
              {user.role === "manager" && "View all tasks and mark them as complete to help your team stay organized."}
              {user.role === "admin" && "Full access to all tasks and comprehensive user management capabilities."}
            </p>
          </div>

          {/* Stats Cards */}
          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="glass-card flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Tasks</p>
                  <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
                </div>
              </div>
              <div className="glass-card flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed Tasks</p>
                  <p className="text-2xl font-bold text-foreground">{completedCount}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Add Todo Form */}
        <div className="mb-8">
          <AddTodoForm onTodoAdded={handleTodoAdded} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive flex items-center gap-3 backdrop-blur-sm">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Todo List */}
        {loading ? (
          <div className="glass-card text-center py-16">
            <div className="inline-flex items-center gap-3 text-muted-foreground">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-lg font-medium">Loading todos...</span>
            </div>
          </div>
        ) : (
          <TodoList
            todos={todos}
            currentUser={user}
            onTodoUpdated={handleTodoUpdated}
            onTodoDeleted={handleTodoDeleted}
          />
        )}
      </main>
    </div>
  )
}
