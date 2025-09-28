"use client"

import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Edit } from "lucide-react"
import { useRouter } from "next/navigation"
import { HeaderMenu } from "@/components/header-menu"

export default function Dashboard() {
  const router = useRouter()

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [router])

  const handleUploadImages = () => {
    router.push("/upload-images")
  }

  const handleManualEntry = () => {
    router.push("/manual-entry")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 to-pink-200 p-4 relative">
      <HeaderMenu />
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-4 border-b">
            <h1 className="text-lg font-semibold">CTG Data Management System</h1>
          </div>

          <div className="p-6">
            <h2 className="text-center text-lg font-medium mb-8 bg-purple-100 py-3 rounded-lg">Choose Input Method</h2>

            <div className="space-y-6">
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow bg-purple-50 border-purple-200"
                onClick={handleUploadImages}
              >
                <CardContent className="p-6 text-center">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                  <h3 className="font-semibold text-gray-900 mb-2">Upload Images of Waveform</h3>
                  <p className="text-sm text-gray-600">Upload CTG waveform images for automated processing</p>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:shadow-md transition-shadow bg-purple-50 border-purple-200"
                onClick={handleManualEntry}
              >
                <CardContent className="p-6 text-center">
                  <Edit className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                  <h3 className="font-semibold text-gray-900 mb-2">Manual Entries</h3>
                  <p className="text-sm text-gray-600">Manually enter CTG data values</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
