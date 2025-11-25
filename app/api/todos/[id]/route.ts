import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getServerSession, canEditAnyTodo, canDeleteAnyTodo, canMarkAnyTodoDone, canViewAllTodos, getUserWithRole } from "@/lib/auth-utils"

// GET - Fetch a single todo
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession()
    const { id } = await params

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user role from database to ensure we have the latest values
    const user = await getUserWithRole(session.user.id)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userRole = user.role
    const userId = session.user.id

    const [todo] = await sql`
      SELECT * FROM "todo" WHERE id = ${id}
    `

    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 })
    }

    // Check permissions - users can view their own todos, managers/admins can view all
    if (todo.userId !== userId && !canViewAllTodos(userRole)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json({ todo })
  } catch (error) {
    console.error("Error fetching todo:", error)
    return NextResponse.json({ error: "Failed to fetch todo" }, { status: 500 })
  }
}

// PATCH - Update a todo
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession()
    const { id } = await params

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user role from database to ensure we have the latest value
    const user = await getUserWithRole(session.user.id)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userRole = user.role
    const userId = session.user.id

    const [existingTodo] = await sql`
      SELECT * FROM "todo" WHERE id = ${id}
    `

    if (!existingTodo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 })
    }

    const body = await request.json()
    const { title, description, completed } = body

    // Permission checks
    const isOwner = existingTodo.userId === userId
    const isAdmin = canEditAnyTodo(userRole)
    const isManager = userRole === "manager"
    const canMarkDone = canMarkAnyTodoDone(userRole)

    // Determine what fields are updated
    const hasTitleUpdate = title !== undefined
    const hasDescriptionUpdate = description !== undefined
    const hasCompletedUpdate = completed !== undefined
    const isOnlyCompletedUpdate = hasCompletedUpdate && !hasTitleUpdate && !hasDescriptionUpdate

    // Validation rules:
    // 1. Owners can update any field of their own todos
    // 2. Admins can update any field of any todos
    // 3. Managers can only update completed status of todos they don't own
    // 4. Regular users can only update their own todos

    if (isOwner || isAdmin) {
      // Owner or Admin: can update any field
    } else if (isManager && !isOwner) {
      // Manager updating non-owned todo: can only update completed field
      if (hasTitleUpdate || hasDescriptionUpdate) {
        return NextResponse.json({ error: "Managers can only mark todos as complete, not edit title or description" }, { status: 403 })
      }
      if (!isOnlyCompletedUpdate || !canMarkDone) {
        return NextResponse.json({ error: "Managers can only update the completed status of todos" }, { status: 403 })
      }
    } else {
      // Regular user trying to update someone else's todo
      return NextResponse.json({ error: "You don't have permission to edit this todo" }, { status: 403 })
    }

    // Build update object based on permissions
    const finalTitle = hasTitleUpdate && (isOwner || isAdmin) ? title.trim() : existingTodo.title
    const finalDescription = hasDescriptionUpdate && (isOwner || isAdmin) ? (description?.trim() || null) : existingTodo.description
    const finalCompleted = hasCompletedUpdate && (isOwner || isAdmin || (isManager && canMarkDone)) ? completed : existingTodo.completed

    const [updatedTodo] = await sql`
      UPDATE "todo"
      SET 
        title = ${finalTitle},
        description = ${finalDescription},
        completed = ${finalCompleted},
        "updatedAt" = NOW()
      WHERE id = ${id}
      RETURNING *
    `

    return NextResponse.json({ todo: updatedTodo })
  } catch (error) {
    console.error("Error updating todo:", error)
    return NextResponse.json({ error: "Failed to update todo" }, { status: 500 })
  }
}

// DELTE - Delete a todo
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession()
    const { id } = await params

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user role from database to ensure we have the latest value
    const user = await getUserWithRole(session.user.id)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userRole = user.role
    const userId = session.user.id

    const [existingTodo] = await sql`
      SELECT * FROM "todo" WHERE id = ${id}
    `

    if (!existingTodo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 })
    }

    // Check permissions - only owner or admiin can delete
    const isOwner = existingTodo.userId === userId
    const isAdmin = canDeleteAnyTodo(userRole)

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "You don't have permission to delete this todo" }, { status: 403 })
    }

    await sql`DELETE FROM "todo" WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting todo:", error)
    return NextResponse.json({ error: "Failed to delete todo" }, { status: 500 })
  }
}
