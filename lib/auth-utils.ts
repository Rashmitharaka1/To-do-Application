import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { sql } from "@/lib/db"

export async function getServerSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  return session
}

export type Role = "user" | "manager" | "admin"

export async function getUserWithRole(userId: string) {
  const [user] = await sql`
    SELECT id, name, email, role
    FROM "user"
    WHERE id = ${userId}
  `
  return user as { id: string; name: string; email: string; role: Role } | undefined
}

export async function getCurrentUserWithRole() {
  const session = await getServerSession()
  if (!session) {
    return null
  }

  const user = await getUserWithRole(session.user.id)
  if (!user) {
    return null
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
}

export function canViewAllTodos(role: Role): boolean {
  return role === "manager" || role === "admin"
}

export function canMarkAnyTodoDone(role: Role): boolean {
  return role === "manager" || role === "admin"
}

export function canEditAnyTodo(role: Role): boolean {
  return role === "admin"
}

export function canDeleteAnyTodo(role: Role): boolean {
  return role === "admin"
}
