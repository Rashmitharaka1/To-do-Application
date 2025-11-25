"use client";

import { useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "manager" | "admin";
};

type Todo = {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  userId: string;
  userName: string;
  userEmail: string;
  createdAt: string;
  updatedAt: string;
};

type Props = {
  todo: Todo;
  currentUser: User;
  onUpdated: (todo: Todo) => void;
  onDeleted: (id: string) => void;
};

export function TodoItem({ todo, currentUser, onUpdated, onDeleted }: Props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isOwner = todo.userId === currentUser.id;
  const isAdmin = currentUser.role === "admin";
  const isManager = currentUser.role === "manager";

  // Permissions based on role
  const canEdit = isOwner || isAdmin;
  const canDelete = isOwner || isAdmin;
  const canToggleComplete = isOwner || isAdmin || isManager;

  async function handleToggleComplete() {
    if (!canToggleComplete) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/todos/${todo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !todo.completed }),
      });

      const data = await res.json();

      if (res.ok) {
        onUpdated(data.todo);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to update todo");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!canEdit) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/todos/${todo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      const data = await res.json();

      if (res.ok) {
        onUpdated(data.todo);
        setEditing(false);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to update todo");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!canDelete) return;
    if (!confirm("Are you sure you want to delete this task?")) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/todos/${todo.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        onDeleted(todo.id);
      } else {
        const data = await res.json();
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to delete todo");
    } finally {
      setLoading(false);
    }
  }

  if (editing) {
    return (
      <div className="glass-card animate-in slide-in-from-top-2 duration-200">
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm flex items-center gap-2">
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-3">
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                className="w-5 h-5 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-background/60 backdrop-blur-sm border border-border/50 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 focus:bg-background/80 transition-all duration-200 shadow-sm"
              placeholder="Task title"
              autoFocus
            />
          </div>

          <div className="relative">
            <div className="absolute left-3 top-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-muted-foreground/70"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add description (optional)..."
              rows={3}
              className="w-full pl-11 pr-4 py-3 bg-background/60 backdrop-blur-sm border border-border/50 rounded-xl text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 focus:bg-background/80 transition-all duration-200 shadow-sm"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-border/50">
          <button
            onClick={() => {
              setEditing(false);
              setTitle(todo.title);
              setDescription(todo.description || "");
              setError("");
            }}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/50 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading || !title.trim()}
            className="group/btn relative px-5 py-2 bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-primary/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/10 to-primary/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700"></span>
            {loading ? (
              <span className="relative z-10 flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </span>
            ) : (
              <span className="relative z-10 flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Save Changes
              </span>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`glass-card group transition-all duration-200 ${
        loading ? "opacity-50 pointer-events-none" : ""
      } ${todo.completed ? "opacity-75" : ""}`}
    >
      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm flex items-center gap-2 animate-in slide-in-from-top-2 duration-200">
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-start gap-4">
        <button
          onClick={handleToggleComplete}
          disabled={loading || !canToggleComplete}
          className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
            todo.completed
              ? "bg-gradient-to-br from-success to-success/80 border-success text-success-foreground shadow-lg shadow-success/25"
              : "border-border hover:border-primary/50 bg-background/50 hover:bg-background/80"
          } ${
            !canToggleComplete
              ? "opacity-50 cursor-not-allowed"
              : "hover:scale-110 cursor-pointer"
          }`}
          aria-label={
            todo.completed ? "Mark as incomplete" : "Mark as complete"
          }
        >
          {todo.completed && (
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0 space-y-2">
          <div>
            <p
              className={`text-base font-semibold leading-tight ${
                todo.completed
                  ? "line-through text-muted-foreground/60"
                  : "text-foreground"
              }`}
            >
              {todo.title}
            </p>
            {todo.description && (
              <p
                className={`text-sm mt-2 leading-relaxed ${
                  todo.completed
                    ? "line-through text-muted-foreground/50"
                    : "text-muted-foreground"
                }`}
              >
                {todo.description}
              </p>
            )}
          </div>

          {!isOwner && (
            <div className="flex items-center gap-2 pt-1">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <p className="text-xs text-muted-foreground">
                Created by <span className="font-medium">{todo.userName}</span>
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {canEdit && (
            <button
              onClick={() => setEditing(true)}
              disabled={loading}
              className="p-2.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200 hover:scale-110"
              aria-label="Edit task"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
          )}
          {canDelete && (
            <button
              onClick={handleDelete}
              disabled={loading}
              className="p-2.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 hover:scale-110"
              aria-label="Delete task"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
