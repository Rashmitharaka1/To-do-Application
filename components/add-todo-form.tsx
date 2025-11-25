"use client"

import type React from "react"

import { useState } from "react"

type Todo = {
  id: string
  title: string
  description: string | null
  completed: boolean
  userId: string
  createdAt: string
  updatedAt: string
}

export function AddTodoForm({ onTodoAdded }: { onTodoAdded: (todo: Todo) => void }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [expanded, setExpanded] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      })

      const data = await res.json()

      if (res.ok) {
        onTodoAdded(data.todo)
        setTitle("")
        setDescription("")
        setExpanded(false)
      } else {
        setError(data.error || "Failed to create todo")
      }
    } catch (err) {
      setError("Failed to create todo")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-card group">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20">
          <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground">Create New Task</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm flex items-center gap-3 backdrop-blur-sm animate-in slide-in-from-top-2 duration-200">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        )}

        <div className="space-y-3">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={() => setExpanded(true)}
              placeholder="What needs to be done?"
              required
              className="w-full pl-12 pr-4 py-3.5 bg-background/60 backdrop-blur-sm border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 focus:bg-background/80 transition-all duration-200 shadow-sm hover:shadow-md"
            />
          </div>

          {expanded && (
            <div className="relative animate-in slide-in-from-top-2 duration-200">
              <div className="absolute left-4 top-3 pointer-events-none">
                <svg className="w-5 h-5 text-muted-foreground/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add more details (optional)..."
                rows={3}
                className="w-full pl-12 pr-4 py-3.5 bg-background/60 backdrop-blur-sm border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 focus:bg-background/80 resize-none transition-all duration-200 shadow-sm hover:shadow-md"
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => {
              setExpanded(!expanded)
              if (expanded) {
                setDescription("")
              }
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {expanded ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              )}
            </svg>
            <span>{expanded ? "Less details" : "More details"}</span>
          </button>

          <button
            type="submit"
            disabled={loading || !title.trim()}
            className="group/btn relative px-6 py-3 bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center gap-2 min-w-[120px] overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/10 to-primary/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></span>
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 relative z-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="relative z-10">Adding...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span className="relative z-10">Add Task</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
