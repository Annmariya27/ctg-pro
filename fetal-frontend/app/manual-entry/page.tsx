"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { HeaderMenu } from "@/components/header-menu"

interface FormData {
  [key: string]: string
}

export default function ManualEntryPage() {
  const router = useRouter()
  const [patientName, setPatientName] = useState("")
  const [patientId, setPatientId] = useState("")
  const [formData, setFormData] = useState<FormData>({
    baseline: "",
    acceleration: "",
    fetalMovement: "",
    uterineContraction: "",
    abnormalShortTerm: "",
    shortTermVariability: "",
    abnormalLongTerm: "",
    longTermVariability: "",
    histogramWidth: "",
    histogramMin: "",
    histogramMax: "",
    histogramPeaks: "",
    histogramZeros: "",
    histogramMode: "",
    histogramMean: "",
    histogramMedian: "",
    histogramVariance: "",
    histogramTendency: "",
    prolongedDecelerations: "",
    abnormalDecelerations: "",
    severeDecleration: "",
  })

  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [showValidation, setShowValidation] = useState(false)

  const fields = [
    { key: "baseline", label: "Baseline value (SisPorto)", placeholder: "Enter the value" },
    { key: "acceleration", label: "Acceleration (SisPorto)", placeholder: "Enter the value" },
    { key: "fetalMovement", label: "Fetal movement (SisPorto)", placeholder: "Enter the value" },
    { key: "uterineContraction", label: "Uterine contraction (SisPorto)", placeholder: "Enter the value" },
    {
      key: "abnormalShortTerm",
      label: "Percentage of time with abnormal short-term variability (SisPorto)",
      placeholder: "Enter the value",
    },
    {
      key: "shortTermVariability",
      label: "Mean value of short-term variability (SisPorto)",
      placeholder: "Enter the value",
    },
    {
      key: "abnormalLongTerm",
      label: "Percentage of time with abnormal long-term variability (SisPorto)",
      placeholder: "Enter the value",
    },
    {
      key: "longTermVariability",
      label: "Mean value of long-term variability (SisPorto)",
      placeholder: "Enter the value",
    },
   
    { key: "histogramWidth", label: "Histogram width", placeholder: "Enter the value" },
    { key: "histogramMin", label: "Histogram minimum", placeholder: "Enter the value" },
    { key: "histogramMax", label: "Histogram maximum", placeholder: "Enter the value" },
    { key: "histogramPeaks", label: "Histogram number of peaks", placeholder: "Enter the value" },
    { key: "histogramZeros", label: "Histogram number of zeros", placeholder: "Enter the value" },
    { key: "histogramMode", label: "Histogram mode", placeholder: "Enter the value" },
    { key: "histogramMean", label: "Histogram mean", placeholder: "Enter the value" },
    { key: "histogramMedian", label: "Histogram median", placeholder: "Enter the value" },
    { key: "histogramVariance", label: "Histogram variance", placeholder: "Enter the value" },
    { key: "histogramTendency", label: "Histogram tendency", placeholder: "Enter the value" },
    { key: "prolongedDecelerations", label: "Prolonged decelerations", placeholder: "Enter the value" },
    { key: "abnormalDecelerations", label: "Abnormal decelerations", placeholder: "Enter the value" },
    { key: "severeDecleration", label: "Severe decleration", placeholder: "Enter the value" },
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

  const handleSubmit = () => {
    setShowValidation(true)
    if (validateForm()) {
      // Store patient info for the report
      localStorage.setItem("currentPatient", JSON.stringify({ name: patientName, id: patientId }))
      router.push("/results")
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
    fields.forEach((field) => {
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
            <Button onClick={handleSubmit} className="bg-purple-600 text-white hover:bg-purple-700">
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
