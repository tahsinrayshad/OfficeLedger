"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Eye, EyeOff, UserCircle } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

export function SignUpForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const { signup, isLoading, error, clearError } = useAuth()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    // Validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match")
      return
    }

    if (formData.password.length < 8) {
      alert("Password must be at least 8 characters long")
      return
    }

    // Calculate age
    const birthDate = new Date(formData.dateOfBirth)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    if (age < 18) {
      alert("You must be at least 18 years old")
      return
    }

    try {
      // Call signup from context
      await signup({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        dob: formData.dateOfBirth,
        password: formData.password,
        isTeamLead: false,
        isFundManager: false,
        isFoodManager: false,
      })

      // Redirect to dashboard on success
      router.push('/dashboard')
    } catch (err) {
      // Error is already handled in AuthContext and displayed
      console.error('Signup error:', err)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    clearError()
  }

  return (
    <div className="max-w-2xl mx-auto w-full">
      {/* Header with animation */}
      <div className="text-center mb-8 space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 backdrop-blur-sm border border-blue-200 mb-4 animate-in fade-in zoom-in duration-500">
          <UserCircle className="w-8 h-8 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-balance animate-in fade-in slide-in-from-bottom-4 duration-700">
          {"Create Account"}
        </h1>
        <p className="text-slate-600 text-balance animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          {"Join us today and start your journey"}
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

          {/* Full Name and Email */}
          <div className="grid grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-2 animate-in fade-in slide-in-from-left-4 duration-500 delay-300">
              <Label htmlFor="fullName" className="text-sm font-medium">
                {"Full Name"}
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                onFocus={() => setFocusedField("fullName")}
                onBlur={() => setFocusedField(null)}
                className={`transition-all duration-300 ${
                  focusedField === "fullName" ? "ring-2 ring-blue-500 border-blue-500 shadow-lg shadow-blue-100" : ""
                }`}
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2 animate-in fade-in slide-in-from-left-4 duration-500 delay-[350ms]">
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
          </div>

          {/* Phone Number and Date of Birth */}
          <div className="grid grid-cols-2 gap-4">
            {/* Phone Number */}
            <div className="space-y-2 animate-in fade-in slide-in-from-left-4 duration-500 delay-[400ms]">
              <Label htmlFor="phone" className="text-sm font-medium">
                {"Phone Number"}
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                onFocus={() => setFocusedField("phone")}
                onBlur={() => setFocusedField(null)}
                className={`transition-all duration-300 ${
                  focusedField === "phone" ? "ring-2 ring-blue-500 border-blue-500 shadow-lg shadow-blue-100" : ""
                }`}
                required
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-2 animate-in fade-in slide-in-from-left-4 duration-500 delay-[450ms]">
              <Label htmlFor="dateOfBirth" className="text-sm font-medium">
                {"Date of Birth"}
              </Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                onFocus={() => setFocusedField("dateOfBirth")}
                onBlur={() => setFocusedField(null)}
                className={`transition-all duration-300 ${
                  focusedField === "dateOfBirth" ? "ring-2 ring-blue-500 border-blue-500 shadow-lg shadow-blue-100" : ""
                }`}
                required
              />
            </div>
          </div>

          {/* Password and Confirm Password */}
          <div className="grid grid-cols-2 gap-4">
            {/* Password */}
            <div className="space-y-2 animate-in fade-in slide-in-from-left-4 duration-500 delay-500">
              <Label htmlFor="password" className="text-sm font-medium">
                {"Password"}
              </Label>
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

            {/* Confirm Password */}
            <div className="space-y-2 animate-in fade-in slide-in-from-left-4 duration-500 delay-[550ms]">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                {"Confirm Password"}
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  onFocus={() => setFocusedField("confirmPassword")}
                  onBlur={() => setFocusedField(null)}
                  className={`pr-10 transition-all duration-300 ${
                    focusedField === "confirmPassword"
                      ? "ring-2 ring-blue-500 border-blue-500 shadow-lg shadow-blue-100"
                      : ""
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-200 hover:scale-[1.02] active:scale-[0.98] animate-in fade-in slide-in-from-bottom-4 duration-500 delay-[600ms]"
            size="lg"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>

          {/* Sign In Link */}
          <p className="text-center text-sm text-slate-600 animate-in fade-in duration-500 delay-[650ms]">
            {"Already have an account? "}
            <a href="/signin" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
              {"Sign in"}
            </a>
          </p>
        </form>
      </Card>

      {/* Footer */}
      <p className="text-center text-xs text-slate-500 mt-8 animate-in fade-in duration-500 delay-700">
        {"By signing up, you agree to our "}
        <a href="/terms" className="text-blue-600 hover:text-blue-700 transition-colors">
          {"Terms of Service"}
        </a>
        {" and "}
        <a href="/privacy" className="text-blue-600 hover:text-blue-700 transition-colors">
          {"Privacy Policy"}
        </a>
      </p>
    </div>
  )
}
