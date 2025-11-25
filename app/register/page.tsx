import { getServerSession } from "@/lib/auth-utils"
import { redirect } from "next/navigation"
import { RegisterForm } from "@/components/register-form"

export default async function RegisterPage() {
  const session = await getServerSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/*floating elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
      <div className="absolute top-1/3 right-1/3 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1.5s'}} />
      
      <div className="relative z-10">
        <RegisterForm />
      </div>
    </main>
  )
}
