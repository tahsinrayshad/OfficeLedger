"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export default function DashboardPage() {
  const router = useRouter()
  const { user, token, isLoading } = useAuth()

  useEffect(() => {
    // Redirect to signin if not authenticated
    if (!isLoading && !token) {
      router.push("/signin")
    }
  }, [token, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-slate-600 mt-1">Welcome back, {user.fullName}!</p>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem("token")
                localStorage.removeItem("user")
                router.push("/signin")
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* User Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Card 1: User Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-slate-600 mb-2">Full Name</div>
            <p className="text-2xl font-bold text-slate-900">{user.fullName}</p>
          </div>

          {/* Card 2: Email */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-slate-600 mb-2">Email</div>
            <p className="text-lg font-semibold text-slate-900 break-all">{user.email}</p>
          </div>

          {/* Card 3: Phone */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-slate-600 mb-2">Phone</div>
            <p className="text-lg font-semibold text-slate-900">{user.phone}</p>
          </div>

          {/* Card 4: Team Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-slate-600 mb-2">Team</div>
            <p className="text-lg font-semibold text-slate-900">
              {user.currentTeamId ? "Active" : "No Team"}
            </p>
          </div>
        </div>

        {/* Roles Section */}
        <div className="bg-white rounded-lg shadow p-8 mb-12">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Your Roles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className={`w-3 h-3 rounded-full ${user.isTeamLead ? "bg-green-500" : "bg-slate-300"}`}></div>
              <span className="text-slate-700 font-medium">Team Lead</span>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className={`w-3 h-3 rounded-full ${user.isFundManager ? "bg-green-500" : "bg-slate-300"}`}></div>
              <span className="text-slate-700 font-medium">Fund Manager</span>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className={`w-3 h-3 rounded-full ${user.isFoodManager ? "bg-green-500" : "bg-slate-300"}`}></div>
              <span className="text-slate-700 font-medium">Food Manager</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left">
              <div className="text-sm font-medium text-slate-600">Create Team</div>
              <div className="text-slate-900 font-semibold mt-1">New Team</div>
            </button>
            <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left">
              <div className="text-sm font-medium text-slate-600">Manage Snacks</div>
              <div className="text-slate-900 font-semibold mt-1">View Snacks</div>
            </button>
            <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left">
              <div className="text-sm font-medium text-slate-600">Fund Management</div>
              <div className="text-slate-900 font-semibold mt-1">View Funds</div>
            </button>
            <button className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-left">
              <div className="text-sm font-medium text-slate-600">Team Members</div>
              <div className="text-slate-900 font-semibold mt-1">View Members</div>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
