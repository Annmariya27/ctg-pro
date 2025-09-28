"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { User, Mail, Lock, X, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SignUpPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [showGoogleAuth, setShowGoogleAuth] = useState(false)
  const [googleAuthStep, setGoogleAuthStep] = useState(1) // 1: email selection, 2: password entry
  const [selectedEmail, setSelectedEmail] = useState("")
  const [googlePassword, setGooglePassword] = useState("")

  // Mock Google accounts for demonstration
  const googleAccounts = [
    { email: "john.doe@gmail.com", name: "John Doe" },
    { email: "jane.smith@gmail.com", name: "Jane Smith" },
    { email: "doctor.wilson@gmail.com", name: "Dr. Wilson" },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle signup logic
    if (formData.username && formData.email && formData.password && formData.confirmPassword) {
      if (formData.password === formData.confirmPassword) {
        localStorage.setItem("isAuthenticated", "true")
        router.push("/dashboard")
      }
    }
  }

  const handleGoogleSignIn = () => {
    setShowGoogleAuth(true)
    setGoogleAuthStep(1)
  }

  const handleEmailSelection = (email: string) => {
    setSelectedEmail(email)
    setGoogleAuthStep(2)
  }

  const handleGooglePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (googlePassword) {
      localStorage.setItem("isAuthenticated", "true")
      router.push("/dashboard")
    }
  }

  const closeGoogleAuth = () => {
    setShowGoogleAuth(false)
    setGoogleAuthStep(1)
    setSelectedEmail("")
    setGooglePassword("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Sign Up</h1>
            <p className="text-gray-600 mt-2">Create an account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="pl-10 bg-purple-50 border-purple-200 rounded-full py-3"
                required
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="pl-10 bg-purple-50 border-purple-200 rounded-full py-3"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="password"
                placeholder="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pl-10 bg-purple-50 border-purple-200 rounded-full py-3"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="password"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="pl-10 bg-purple-50 border-purple-200 rounded-full py-3"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 rounded-full py-3 text-white font-semibold"
            >
              Sign Up
            </Button>
          </form>

          <div className="text-center my-4">
            <span className="text-gray-500">or</span>
          </div>

          <Button
            onClick={handleGoogleSignIn}
            variant="outline"
            className="w-full rounded-full py-3 border-purple-200 text-purple-600 hover:bg-purple-50 bg-transparent"
          >
            Sign in with Google
          </Button>

          <div className="text-center mt-6">
            <span className="text-gray-600 text-sm">Already have an account? </span>
            <Link href="/login" className="text-purple-600 hover:underline text-sm">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>

      {showGoogleAuth && (
        <div className="fixed inset-0 bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                {googleAuthStep === 2 && (
                  <Button variant="ghost" size="sm" onClick={() => setGoogleAuthStep(1)} className="p-1">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                )}
                <h2 className="text-xl font-semibold text-gray-900 flex-1 text-center">
                  {googleAuthStep === 1 ? "Choose an account" : "Enter your password"}
                </h2>
                <Button variant="ghost" size="sm" onClick={closeGoogleAuth} className="p-1">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {googleAuthStep === 1 && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 text-center mb-4">to continue to CTG Data Management</p>
                  {googleAccounts.map((account, index) => (
                    <div
                      key={index}
                      onClick={() => handleEmailSelection(account.email)}
                      className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                        <User className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{account.name}</p>
                        <p className="text-sm text-gray-600">{account.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {googleAuthStep === 2 && (
                <div>
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                      <User className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{selectedEmail}</p>
                    </div>
                  </div>

                  <form onSubmit={handleGooglePasswordSubmit} className="space-y-4">
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        value={googlePassword}
                        onChange={(e) => setGooglePassword(e.target.value)}
                        className="pl-10 bg-purple-50 border-purple-200 rounded-full py-3"
                        required
                        autoFocus
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-purple-600 hover:bg-purple-700 rounded-full py-3 text-white font-semibold"
                    >
                      Next
                    </Button>
                  </form>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
