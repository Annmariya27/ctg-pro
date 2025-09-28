"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { User, Lock } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simple authentication - in real app, validate against backend
    if (username && password) {
      localStorage.setItem("isAuthenticated", "true")
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600 mt-2">Enter your credential to login</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 bg-purple-50 border-purple-200 rounded-full py-3"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-purple-50 border-purple-200 rounded-full py-3"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 rounded-full py-3 text-white font-semibold"
            >
              Login
            </Button>
          </form>

          <div className="text-center mt-6">
            <Link href="/forgot-password" className="text-purple-600 hover:underline text-sm">
              Forgot password?
            </Link>
          </div>

          <div className="text-center mt-4">
            <span className="text-gray-600 text-sm">{"Don't Have an account? "}</span>
            <Link href="/signup" className="text-purple-600 hover:underline text-sm">
              Sign Up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
