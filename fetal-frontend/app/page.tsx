"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function SplashScreen() {
  const [showUserSelection, setShowUserSelection] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Show splash screen for 3 seconds
    const timer = setTimeout(() => {
      setFadeOut(true)
      // After fade out animation, show user selection
      setTimeout(() => {
        setShowUserSelection(true)
      }, 500)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handlePatientClick = () => {
    router.push("/report")
  }

  const handleDoctorClick = () => {
    router.push("/login")
  }

  // Splash Screen
  if (!showUserSelection) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 flex items-center justify-center transition-all duration-500 ${
          fadeOut ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        <div className="text-center">
          <h1 className="text-7xl md:text-8xl font-bold text-white mb-2 animate-pulse">Tiny beats</h1>
          <h2 className="text-lg md:text-xl font-medium text-white/90 mb-8">Fetal Health Analyzer</h2>
          <div className="flex justify-center space-x-2 mt-8">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>
        </div>
      </div>
    )
  }

  // User Selection Screen
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-8 shadow-2xl">
          <div className="space-y-6">
            <Button
              onClick={handleDoctorClick}
              className="w-full bg-white text-purple-600 hover:bg-gray-100 hover:scale-105 rounded-full py-4 text-lg font-semibold transform transition-all duration-200 shadow-lg"
            >
              Doctor
            </Button>
            <Button
              onClick={handlePatientClick}
              className="w-full bg-white text-purple-600 hover:bg-gray-100 hover:scale-105 rounded-full py-4 text-lg font-semibold transform transition-all duration-200 shadow-lg"
            >
              Patient
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
