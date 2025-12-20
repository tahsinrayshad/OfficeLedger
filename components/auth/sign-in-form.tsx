"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Eye, EyeOff, LogIn } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

export function SignInForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const { signin, isLoading, error, clearError } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    
    try {
      await signin(formData.email, formData.password)
      // Redirect to dashboard on success
      router.push('/dashboard')
    } catch (err) {
      // Error is already handled in AuthContext and displayed
      console.error('Signin error:', err)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    clearError()
  }

  return (
    <div className="max-w-md mx-auto w-full">
      {/* Header with animation */}
      <div className="text-center mb-8 space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 backdrop-blur-sm border border-blue-200 mb-4 animate-in fade-in zoom-in duration-500">
          <LogIn className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-balance animate-in fade-in slide-in-from-bottom-4 duration-700">
          {"Welcome Back"}
        </h1>
        <p className="text-slate-600 text-balance animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          {"Sign in to continue your journey"}
        </p>
      </div>

      {/* Form Card */}
      <Card className="p-8 backdrop-blur-sm bg-white border-slate-200 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="space-y-2 animate-in fade-in slide-in-from-left-4 duration-500 delay-300">
            <Label htmlFor="email" className="text-sm font-medium">
              {"Email Address"}
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              className={`transition-all duration-300 ${
                focusedField === "email" ? "ring-2 ring-blue-500 border-blue-500 shadow-lg shadow-blue-100" : ""
              }`}
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-2 animate-in fade-in slide-in-from-left-4 duration-500 delay-[350ms]">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium">
                {"Password"}
              </Label>
              <a href="/forgot-password" className="text-xs text-blue-600 hover:text-blue-700 transition-colors">
                {"Forgot password?"}
              </a>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                className={`pr-10 transition-all duration-300 ${
                  focusedField === "password" ? "ring-2 ring-blue-500 border-blue-500 shadow-lg shadow-blue-100" : ""
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center animate-in fade-in slide-in-from-left-4 duration-500 delay-[400ms]">
            <input
              id="remember"
              type="checkbox"
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-slate-600">
              {"Remember me for 30 days"}
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-200 hover:scale-[1.02] active:scale-[0.98] animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[450ms]"
            size="lg"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-slate-600 animate-in fade-in duration-500 delay-500">
            {"Don't have an account? "}
            <a href="/signup" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
              {"Sign up"}
            </a>
          </p>
        </form>
      </Card>

      {/* Footer */}
      <p className="text-center text-xs text-slate-500 mt-8 animate-in fade-in duration-500 delay-[550ms]">
        {"Protected by industry-standard encryption"}
      </p>
    </div>
  )
}
