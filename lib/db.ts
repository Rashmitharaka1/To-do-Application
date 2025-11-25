import { neon } from "@neondatabase/serverless"

export const sql = neon(process.env.DATABASE_URL!)

export type User = {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image: string | null
  role: "user" | "manager" | "admin"
  banned: boolean
  banReason: string | null
  banExpires: Date | null
  createdAt: Date
  updatedAt: Date
}

export type Todo = {
  id: string
  title: string
  description: string | null
  completed: boolean
  userId: string
  createdAt: Date
  updatedAt: Date
}
