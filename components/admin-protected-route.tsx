"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated, getUserData } from "@/lib/auth"

interface AdminProtectedRouteProps {
  children: React.ReactNode
}

export default function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    // Check authentication and admin role
    const checkAuth = () => {
      const authenticated = isAuthenticated()
      const userData = getUserData()
      const isAdmin = userData?.role === 'admin'

      setIsAuthorized(authenticated && isAdmin)
      setIsChecking(false)

      if (!authenticated) {
        // Redirect to login if not authenticated
        router.push("/login")
      } else if (!isAdmin) {
        // Redirect to dashboard if not admin
        router.push("/dashboard")
      }
    }

    checkAuth()
  }, [router])

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking authorization...</p>
        </div>
      </div>
    )
  }

  // Only render children if authorized
  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}

