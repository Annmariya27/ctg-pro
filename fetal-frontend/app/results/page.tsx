"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { HeaderMenu } from "@/components/header-menu"

type ResultCategory = "Normal" | "Suspect" | "Pathological"

interface ResultData {
  class_index: number // 1 for Normal, 2 for Suspect, 3 for Pathological
  probability: number
  patientName: string
  patientId: string
}

export default function ResultsPage() {
  const [resultData, setResultData] = useState<ResultData | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedResult = sessionStorage.getItem("analysisResult")
    if (storedResult) {
      setResultData(JSON.parse(storedResult))
    }
  }, [])

  const handleViewDetails = () => {
    router.push("/details")
  }

  // 🔹 Make currentResult first
  const resultMapping: ResultCategory[] = ["Normal", "Suspect", "Pathological"]
  const currentResult =
    resultData && resultData.class_index
      ? resultMapping[resultData.class_index - 1]
      : null

  // 🔹 Pass currentResult into function
  const getResultConfig = (result: ResultCategory | null) => {
    switch (result) {
      case "Normal":
        return {
          title: "Normal",
          bgColor: "bg-purple-600",
          showDetails: false,
        }
      case "Suspect":
        return {
          title: "Suspect",
          bgColor: "bg-purple-600",
          showDetails: true,
        }
      case "Pathological":
        return {
          title: "Pathological",
          bgColor: "bg-purple-600",
          showDetails: true,
        }
      default:
        return {
          title: "Awaiting Result...",
          bgColor: "bg-gray-400",
          showDetails: false,
        }
    }
  }

  const config = getResultConfig(currentResult)

  if (!resultData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 to-pink-200">
        <p>Loading results...</p>
      </div>
    )
  }

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
                  <Button
                    onClick={handleViewDetails}
                    variant="link"
                    className="text-gray-600 hover:text-gray-800"
                  >
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
