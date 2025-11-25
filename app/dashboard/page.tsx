import { getServerSession, getCurrentUserWithRole } from "@/lib/auth-utils"
import { redirect } from "next/navigation"
import { DashboardContent } from "@/components/dashboard-content"

export default async function DashboardPage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/login")
  }

  // Get user with role from database to ensure we have the latest rolew
  const user = await getCurrentUserWithRole()

  if (!user) {
    redirect("/login")
  }

  return <DashboardContent user={user} />
}
