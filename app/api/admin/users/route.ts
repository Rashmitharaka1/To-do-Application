import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getServerSession, getUserWithRole } from "@/lib/auth-utils"

// GET - Fetch all users (admin only)
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

    if (user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
    }

    const users = await sql`
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.role, 
        u.banned,
        u."createdAt",
        COUNT(t.id) as "todoCount"
      FROM "user" u
      LEFT JOIN "todo" t ON t."userId" = u.id
      GROUP BY u.id
      ORDER BY u."createdAt" DESC
    `

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}
