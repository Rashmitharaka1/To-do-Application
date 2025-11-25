import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getServerSession, getUserWithRole } from "@/lib/auth-utils"

// PATCH - Update user role (admin only)
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession()
    const { id } = await params

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user role from databse to ensure we have the latest value
    const currentUser = await getUserWithRole(session.user.id)
    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (currentUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 })
    }

    // Prevent admin from changing their own role
    if (session.user.id === id) {
      return NextResponse.json({ error: "Cannot change your own role" }, { status: 400 })
    }

    const { role } = await request.json()

    if (!["user", "manager", "admin"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    const [updatedUser] = await sql`
      UPDATE "user"
      SET role = ${role}, "updatedAt" = NOW()
      WHERE id = ${id}
      RETURNING id, name, email, role, banned, "createdAt"
    `

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error("Error updating user role:", error)
    return NextResponse.json({ error: "Failed to update user role" }, { status: 500 })
  }
}
