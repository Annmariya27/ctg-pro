"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { HeaderMenu } from "@/components/header-menu"

export default function ResultsPage() {
  const [currentResult] = useState<"normal" | "suspect" | "pathological">("suspect")
  const router = useRouter()

  const handleViewDetails = () => {
    router.push("/details")
  }

  const getResultConfig = () => {
    switch (currentResult) {
      case "normal":
        return {
          title: "Normal",
          bgColor: "bg-purple-600",
          showDetails: false,
        }
      case "suspect":
        return {
          title: "Suspect",
          bgColor: "bg-purple-600",
          showDetails: true,
        }
      case "pathological":
        return {
          title: "Pathological",
          bgColor: "bg-purple-600",
          showDetails: true,
        }
    }
  }

  const config = getResultConfig()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 to-pink-200 p-4 relative">
      <HeaderMenu />
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
            <Card className="w-full max-w-sm bg-gray-50">
              <CardContent className="p-8 text-center">
                <h2 className="text-xl font-semibold mb-6">Result</h2>
                <Button
                  className={`${config.bgColor} hover:opacity-90 text-white font-semibold py-4 px-8 rounded-lg text-lg w-full mb-4`}
                >
                  {config.title}
                </Button>
                {config.showDetails && (
                  <Button onClick={handleViewDetails} variant="link" className="text-gray-600 hover:text-gray-800">
                    View Details
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
