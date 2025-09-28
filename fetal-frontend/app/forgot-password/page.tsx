"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Lock } from "lucide-react"

export default function ForgotPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password && confirmPassword && password === confirmPassword) {
      // Handle password reset logic
      console.log("Password reset successful")
      // Redirect to login page after successful reset
      router.push("/login")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Reset account Password</h1>
            <p className="text-gray-600 mt-2">Enter a new password for Tiny beats</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 bg-purple-50 border-purple-200 rounded-full py-3"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 rounded-full py-3 text-white font-semibold"
            >
              Reset password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
