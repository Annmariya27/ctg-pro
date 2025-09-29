"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { HeaderMenu } from "@/components/header-menu"
import { ShapChart } from "@/components/ShapChart"

interface ResultData {
  class_index: number
  probability: number
  patientName: string
  patientId: string
  shap_values: { feature: string; value: number }[]
}

// A mapping of feature keys to their medical significance.
const FEATURE_EXPLANATIONS: Record<string, { title: string; reason: string }> = {
  ASTV: {
    title: "Abnormal Short-Term Variability",
    reason: "A high percentage suggests reduced fetal autonomic responsiveness, a sign of hypoxia.",
  },
  ALTV: {
    title: "Abnormal Long-Term Variability",
    reason: "A high percentage indicates issues with longer-term heart rate regulation, linked to fetal stress.",
  },
  DL: {
    title: "Late Decelerations",
    reason: "Indicates the placenta may not be supplying enough oxygen, a sign of uteroplacental insufficiency.",
  },
  DS: {
    title: "Severe Decelerations",
    reason: "Significant drops in heart rate that are a strong indicator of fetal distress.",
  },
  DP: {
    title: "Prolonged Decelerations",
    reason: "Long-lasting drops in heart rate that are a critical sign of potential fetal compromise.",
  },
  AC: {
    title: "Accelerations",
    reason: "The absence of heart rate accelerations (a value of 0) suggests poor fetal reactivity.",
  },
  UC: { title: "Uterine Contractions", reason: "Excessive contractions can reduce blood flow, leading to fetal stress." },
}

export default function DetailsPage() {
  const [resultData, setResultData] = useState<ResultData | null>(null)

  useEffect(() => {
    const storedResult = sessionStorage.getItem("analysisResult")
    if (storedResult) {
      setResultData(JSON.parse(storedResult))
    }
  }, [])

  const handleGenerateReport = () => {
    alert("PDF Report Generated Successfully!")
  }

  // Get the top 3 most impactful features from SHAP data that have an explanation.
  const topReasons = resultData?.shap_values
    .filter(shap => FEATURE_EXPLANATIONS[shap.feature]) // Keep only features we can explain
    .sort((a, b) => b.value - a.value) // Sort by impact
    .slice(0, 3) // Take the top 3
    .map(shap => ({
      key: shap.feature,
      ...FEATURE_EXPLANATIONS[shap.feature],
    }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 to-pink-200 p-4 relative">
      <HeaderMenu />
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-4 border-b">
            <h1 className="text-lg font-semibold text-purple-700">Details</h1>
          </div>

          <div className="p-6 space-y-6">
            {/* SHAP Explanation Chart */}
            {resultData && resultData.shap_values && (
              <ShapChart data={resultData.shap_values} />
            )}

            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4 space-y-4">
                <h3 className="text-sm font-semibold text-purple-800">Key Contributing Factors</h3>
                <div className="space-y-3 text-sm">
                  {topReasons && topReasons.length > 0 ? (
                    topReasons.map((reason, index) => (
                      <div key={reason.key} className="text-purple-700">
                        <span className="font-semibold">
                          {index + 1}. {reason.title}
                        </span>
                        <p className="ml-4 text-xs text-purple-600">{reason.reason}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500">No specific risk factors identified from the top features.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="p-4 border-t">
            <Button
              onClick={handleGenerateReport}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-full"
            >
              Generate Report PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
