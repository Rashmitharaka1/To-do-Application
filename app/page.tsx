import { getServerSession } from "@/lib/auth-utils"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function HomePage() {
  const session = await getServerSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elemnts */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}} />
      
      <div className="glass-card max-w-lg w-full text-center space-y-8 relative z-10">
        <div className="space-y-4">
          <div className="inline-block p-3 glass-surface rounded-2xl mb-4">
            <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold tracking-tight heading-gradient">
            Todo App
          </h1>
          <p className="text-muted-foreground text-xl font-medium">
            Modern role-based task management
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Experience seamless task management with role-based access control, beautiful design, and intuitive workflows.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Link href="/login" className="btn-primary group">
            <span className="flex items-center justify-center gap-2">
              Sign In
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
              </svg>
            </span>
          </Link>
          <Link href="/register" className="btn-secondary">
            Create Account
          </Link>
        </div>

        <div className="pt-6 border-t border-border/50">
          <h3 className="text-sm font-semibold text-foreground mb-4 tracking-wide uppercase">
            Role Permissions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="glass-surface p-4 rounded-xl hover:scale-105 transition-all duration-200">
              <div className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <svg className="w-4 h-4 text-secondary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <p className="font-semibold text-foreground mb-1">User</p>
              <p className="text-muted-foreground">Manage personal tasks</p>
            </div>
            <div className="glass-surface p-4 rounded-xl hover:scale-105 transition-all duration-200">
              <div className="w-8 h-8 bg-warning/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <svg className="w-4 h-4 text-warning-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
                </svg>
              </div>
              <p className="font-semibold text-foreground mb-1">Manager</p>
              <p className="text-muted-foreground">View all, mark complete</p>
            </div>
            <div className="glass-surface p-4 rounded-xl hover:scale-105 transition-all duration-200">
              <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center mb-3 mx-auto">
                <svg className="w-4 h-4 text-success-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <p className="font-semibold text-foreground mb-1">Admin</p>
              <p className="text-muted-foreground">Full system access</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
