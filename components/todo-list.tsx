"use client"

import { TodoItem } from "@/components/todo-item"

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

type Props = {
  todos: Todo[]
  currentUser: User
  onTodoUpdated: (todo: Todo) => void
  onTodoDeleted: (id: string) => void
}

export function TodoList({ todos, currentUser, onTodoUpdated, onTodoDeleted }: Props) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-border rounded-[var(--radius)]">
        <p className="text-muted">No tasks yet. Create your first task above.</p>
      </div>
    )
  }

  const pendingTodos = todos.filter((t) => !t.completed)
  const completedTodos = todos.filter((t) => t.completed)

  return (
    <div className="space-y-6">
      {pendingTodos.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted mb-3">Pending ({pendingTodos.length})</h3>
          <div className="space-y-2">
            {pendingTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                currentUser={currentUser}
                onUpdated={onTodoUpdated}
                onDeleted={onTodoDeleted}
              />
            ))}
          </div>
        </div>
      )}

      {completedTodos.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted mb-3">Completed ({completedTodos.length})</h3>
          <div className="space-y-2">
            {completedTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                currentUser={currentUser}
                onUpdated={onTodoUpdated}
                onDeleted={onTodoDeleted}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
