"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

export default function ReportPage() {
  const [patientName, setPatientName] = useState("")
  const [patientId, setPatientId] = useState("")
  const [showReport, setShowReport] = useState(false)
  const [errors, setErrors] = useState({ name: "", id: "" })

  const handleViewReport = () => {
    // Validate inputs
    const newErrors = { name: "", id: "" }

    if (!patientName.trim()) {
      newErrors.name = "Please enter patient name"
    }

    if (!patientId.trim()) {
      newErrors.id = "Please enter patient ID"
    }

    setErrors(newErrors)

    // If no errors, show the report
    if (!newErrors.name && !newErrors.id) {
      setShowReport(true)
    }
  }

  const handleGenerateReport = () => {
    // Generate PDF report logic
    console.log("Generating PDF report for:", { patientName, patientId })
    alert(`PDF Report Generated Successfully for ${patientName} (ID: ${patientId})!`)
  }

  if (!showReport) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-200 to-pink-200 p-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-4 border-b">
              <h1 className="text-lg font-semibold text-purple-700">Patient Report Access</h1>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-purple-700 mb-2">Patient Name</label>
                <Input
                  type="text"
                  placeholder="Enter patient name"
                  value={patientName}
                  onChange={(e) => {
                    setPatientName(e.target.value)
                    if (errors.name) setErrors((prev) => ({ ...prev, name: "" }))
                  }}
                  className={`bg-purple-50 border-purple-200 rounded-lg ${
                    errors.name ? "border-red-500 bg-red-50" : ""
                  }`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-700 mb-2">Patient ID</label>
                <Input
                  type="text"
                  placeholder="Enter patient ID given by doctor"
                  value={patientId}
                  onChange={(e) => {
                    setPatientId(e.target.value)
                    if (errors.id) setErrors((prev) => ({ ...prev, id: "" }))
                  }}
                  className={`bg-purple-50 border-purple-200 rounded-lg ${errors.id ? "border-red-500 bg-red-50" : ""}`}
                />
                {errors.id && <p className="text-red-500 text-xs mt-1">{errors.id}</p>}
              </div>

              <Button
                onClick={handleViewReport}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-full"
              >
                View My Report
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 to-pink-200 p-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-4 border-b">
            <h1 className="text-lg font-semibold text-purple-700">Patient Report</h1>
            <div className="text-sm text-gray-600 mt-1">
              <p>Patient: {patientName}</p>
              <p>ID: {patientId}</p>
            </div>
          </div>

          <div className="p-6">
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <div className="space-y-3 text-sm">
                  <div className="text-purple-700">
                    <span className="font-semibold">1. ASTV {"<"} 20</span> Hypoxia risk
                  </div>
                  <div className="text-purple-700">
                    <span className="font-semibold">2. DL {">"} 0</span> Late deceleration
                    <br />
                    <span className="ml-4">(Placenta not supplying oxygen properly)</span>
                  </div>
                  <div className="text-purple-700">
                    <span className="font-semibold">3. UC {">"} 2</span> Over-contractions
                    <br />
                    <span className="ml-4">(Fetal stress)</span>
                  </div>
                  <div className="text-purple-700">
                    <span className="font-semibold">4. AC = 0</span> No heart rate increase
                    <br />
                    <span className="ml-4">(Poor fetal reactivity)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="p-6 space-y-4">
            <Button
              onClick={handleGenerateReport}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-full"
            >
              Generate Report PDF
            </Button>

            <Button
              onClick={() => setShowReport(false)}
              variant="outline"
              className="w-full text-purple-600 border-purple-300 hover:bg-purple-50 rounded-full py-3"
            >
              Back to Patient Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
