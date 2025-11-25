import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getServerSession } from "@/lib/auth-utils"

// POST - Set user role (for new registratons)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { role } = await request.json()

    if (!role) {
      return NextResponse.json({ error: "Role is required" }, { status: 400 })
    }

    if (!["user", "manager", "admin"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    const userId = session.user.id

    // Allow users to set their own role (for new registrations)
    // or allow admin to set any role via admin panel
    // For now, we will allow users to set their own role during registration

    // Update  role
    const [updatedUser] = await sql`
      UPDATE "user"
      SET role = ${role}, "updatedAt" = NOW()
      WHERE id = ${userId}
      RETURNING id, name, email, role
    `

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user: updatedUser, success: true })
  } catch (error) {
    console.error("Error setting user role:", error)
    return NextResponse.json({ error: "Failed to set user role" }, { status: 500 })
  }
}

