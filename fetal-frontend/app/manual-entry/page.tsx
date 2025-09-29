"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { HeaderMenu } from "@/components/header-menu"
import { analysisService } from "@/services/api-services"

interface FormData {
  [key: string]: string
}

export default function ManualEntryPage() {
  const router = useRouter()
  const [patientName, setPatientName] = useState("")
  const [patientId, setPatientId] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    LB: "",
    AC: "",
    FM: "",
    UC: "",
    ASTV: "",
    MSTV: "",
    ALTV: "",
    MLTV: "",
    DL: "",
    DS: "",
    DP: "",
    Width: "",
    Min: "",
    Max: "",
    Nmax: "",
    Nzeros: "",
    Mode: "",
    Mean: "",
    Median: "",
    Variance: "",
    Tendency: "",
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [showValidation, setShowValidation] = useState(false)

  const fields = [
    { key: "LB", label: "Baseline Fetal Heart Rate (LB)", placeholder: "e.g., 120" },
    { key: "AC", label: "Accelerations (AC)", placeholder: "e.g., 0.003" },
    { key: "FM", label: "Fetal Movements (FM)", placeholder: "e.g., 0" },
    { key: "UC", label: "Uterine Contractions (UC)", placeholder: "e.g., 0.006" },
    { key: "ASTV", label: "Abnormal Short-Term Variability (%)", placeholder: "e.g., 43" },
    { key: "MSTV", label: "Mean Short-Term Variability (MSTV)", placeholder: "e.g., 2.1" },
    { key: "ALTV", label: "Abnormal Long-Term Variability (%)", placeholder: "e.g., 0" },
    { key: "MLTV", label: "Mean Long-Term Variability (MLTV)", placeholder: "e.g., 12.4" },
    { key: "DL", label: "Light Decelerations (DL)", placeholder: "e.g., 0.002" },
    { key: "DS", label: "Severe Decelerations (DS)", placeholder: "e.g., 0" },
    { key: "DP", label: "Prolonged Decelerations (DP)", placeholder: "e.g., 0" },
    { key: "Width", label: "Histogram Width", placeholder: "e.g., 68" },
    { key: "Min", label: "Histogram Minimum", placeholder: "e.g., 62" },
    { key: "Max", label: "Histogram Maximum", placeholder: "e.g., 130" },
    { key: "Nmax", label: "Histogram # of Peaks", placeholder: "e.g., 4" },
    { key: "Nzeros", label: "Histogram # of Zeros", placeholder: "e.g., 0" },
    { key: "Mode", label: "Histogram Mode", placeholder: "e.g., 120" },
    { key: "Mean", label: "Histogram Mean", placeholder: "e.g., 107" },
    { key: "Median", label: "Histogram Median", placeholder: "e.g., 121" },
    { key: "Variance", label: "Histogram Variance", placeholder: "e.g., 73" },
    { key: "Tendency", label: "Histogram Tendency", placeholder: "e.g., 1" },
  ]

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }))

    // Clear error for this field when user starts typing
    if (errors[key]) {
      setErrors((prev) => ({
        ...prev,
        [key]: "",
      }))
    }
  }

  const handlePatientInfoChange = (field: string, value: string) => {
    if (field === "name") {
      setPatientName(value)
      if (errors.patientName) {
        setErrors((prev) => ({ ...prev, patientName: "" }))
      }
    } else if (field === "id") {
      setPatientId(value)
      if (errors.patientId) {
        setErrors((prev) => ({ ...prev, patientId: "" }))
      }
    }
  }

  const handleClear = () => {
    const clearedData: FormData = {}
    Object.keys(formData).forEach((key) => {
      clearedData[key] = ""
    })
    setFormData(clearedData)
    setPatientName("")
    setPatientId("")
    setErrors({})
    setShowValidation(false)
  }

  const handleSubmit = async () => {
    setShowValidation(true)
    if (!validateForm()) {
      return // Stop if validation fails
    }

    setIsLoading(true)
    try {
      // 1. Convert form data to an array of numbers in the correct order
      const featureValues = fields.map(field => parseFloat(formData[field.key]))

      // 2. Call the API service
      const result = await analysisService.submitManualEntry(featureValues)

      // 3. Store patient info and result for the next page
      const resultData = { ...result, patientName, patientId }
      sessionStorage.setItem("analysisResult", JSON.stringify(resultData))

      // 4. Navigate to the results page
      router.push("/results")
    } catch (error: any) {
      console.error("Submission failed:", error)
      setErrors({ api: error.message || "Failed to connect to the server. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    // Validate patient information
    if (!patientName.trim()) {
      newErrors.patientName = "Fill this box"
    }
    if (!patientId.trim()) {
      newErrors.patientId = "Fill this box"
    }

    // Validate all 22 fields
    fields.forEach(field => {
      if (!formData[field.key] || formData[field.key].trim() === "") {
        newErrors[field.key] = "Fill this box"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 to-pink-200 p-4 relative">
      <HeaderMenu />
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-4 border-b">
            <h1 className="text-lg font-semibold">Manual Entry</h1>
          </div>

          <div className="p-4 max-h-[70vh] overflow-y-auto">
            <div className="space-y-4">
              {/* Patient Information Section */}
              <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200 mb-6">
                <h3 className="text-sm font-semibold text-purple-700 mb-3">Patient Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-purple-700 mb-1">Patient Name</label>
                    <Input
                      type="text"
                      placeholder="Enter patient name"
                      value={patientName}
                      onChange={(e) => handlePatientInfoChange("name", e.target.value)}
                      className={`bg-white border-purple-200 rounded-lg ${
                        showValidation && errors.patientName ? "border-red-500 bg-red-50" : ""
                      }`}
                    />
                    {showValidation && errors.patientName && (
                      <p className="text-red-500 text-xs mt-1">{errors.patientName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-purple-700 mb-1">Patient ID</label>
                    <Input
                      type="text"
                      placeholder="Enter unique patient ID"
                      value={patientId}
                      onChange={(e) => handlePatientInfoChange("id", e.target.value)}
                      className={`bg-white border-purple-200 rounded-lg ${
                        showValidation && errors.patientId ? "border-red-500 bg-red-50" : ""
                      }`}
                    />
                    {showValidation && errors.patientId && (
                      <p className="text-red-500 text-xs mt-1">{errors.patientId}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Medical Parameters Section */}
              <h3 className="text-sm font-semibold text-purple-700 mb-3">Medical Parameters</h3>
              {fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-purple-700 mb-1">{field.label}</label>
                  <Input
                    type="text"
                    placeholder={field.placeholder}
                    value={formData[field.key]}
                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                    className={`bg-purple-50 border-purple-200 rounded-lg placeholder:text-gray-400 placeholder:font-normal ${
                      showValidation && errors[field.key] ? "border-red-500 bg-red-50" : ""
                    }`}
                  />
                  {showValidation && errors[field.key] && (
                    <p className="text-red-500 text-xs mt-1">{errors[field.key]}</p>
                  )}
                  {errors.api && (
                    <p className="text-red-500 text-xs mt-1">{errors.api}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border-t flex justify-between">
            <Button
              onClick={handleClear}
              variant="outline"
              className="text-purple-600 border-purple-300 hover:bg-purple-50 bg-transparent"
            >
              Clear All
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-purple-600 text-white hover:bg-purple-700 disabled:bg-gray-400"
            >
              {isLoading ? "Analyzing..." : "Submit"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
