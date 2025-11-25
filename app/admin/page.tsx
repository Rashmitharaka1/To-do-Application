import { getServerSession, getCurrentUserWithRole } from "@/lib/auth-utils"
import { redirect } from "next/navigation"
import { AdminDashboard } from "@/components/admin-dashboard"

export default async function AdminPage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/login")
  }

  // Get user with role from database to ensure we have the lates role
  const user = await getCurrentUserWithRole()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "admin") {
    redirect("/dashboard")
  }

  return <AdminDashboard user={user} />
}
