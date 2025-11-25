import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getServerSession, canViewAllTodos, getUserWithRole } from "@/lib/auth-utils"
import { nanoid } from "nanoid"

// GET - Fetch todos (based on role)
export async function GET() {
  try {
    const session = await getServerSession()

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

    let todos

    if (canViewAllTodos(userRole)) {
      // Managers and Admins can view all todos
      todos = await sql`
        SELECT t.*, u.name as "userName", u.email as "userEmail"
        FROM "todo" t
        JOIN "user" u ON t."userId" = u.id
        ORDER BY t."createdAt" DESC
      `
    } else {
      // Regular users can only view their own todos
      todos = await sql`
        SELECT t.*, u.name as "userName", u.email as "userEmail"
        FROM "todo" t
        JOIN "user" u ON t."userId" = u.id
        WHERE t."userId" = ${userId}
        ORDER BY t."createdAt" DESC
      `
    }

    return NextResponse.json({ todos })
  } catch (error) {
    console.error("Error fetching todos:", error)
    return NextResponse.json({ error: "Failed to fetch todos" }, { status: 500 })
  }
}

// POST - Create a new todo
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, description } = await request.json()

    if (!title || title.trim() === "") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    const id = nanoid()
    const userId = session.user.id

    const [todo] = await sql`
      INSERT INTO "todo" (id, title, description, "userId")
      VALUES (${id}, ${title.trim()}, ${description?.trim() || null}, ${userId})
      RETURNING *
    `

    return NextResponse.json({ todo }, { status: 201 })
  } catch (error) {
    console.error("Error creating todo:", error)
    return NextResponse.json({ error: "Failed to create todo" }, { status: 500 })
  }
}
