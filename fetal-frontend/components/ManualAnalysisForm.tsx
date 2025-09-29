"use client"

import { useState } from "react"
import { FEATURES_22 } from "@/app/constants/features"
import { createInitialFeaturesState } from "@/lib/utils"
import { analysisService } from "@/services/api-services"

// Define the structure for the form state
type FeaturesState = Record<(typeof FEATURES_22)[number], string>

export function ManualAnalysisForm() {
  const [features, setFeatures] = useState<FeaturesState>(
    createInitialFeaturesState(FEATURES_22)
  )
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFeatures(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      // 1. Convert string inputs to an array of numbers
      const featureValues = FEATURES_22.map(key => parseFloat(features[key]))

      // 2. Check for invalid numbers (e.g., empty strings become NaN)
      if (featureValues.some(isNaN)) {
        throw new Error("All fields must be filled with valid numbers.")
      }

      // 3. THIS IS THE KEY STEP: Call the API service
      console.log("Sending features to backend:", featureValues)
      const response = await analysisService.submitManualEntry(featureValues)

      // 4. Handle the successful response
      console.log("Received response from backend:", response)
      setResult(response)
    } catch (err: any) {
      // 5. Handle any errors during the process
      console.error("Failed to get prediction:", err)
      setError(err.message || "An unknown error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {FEATURES_22.map(featureName => (
          <div key={featureName}>
            <label htmlFor={featureName} className="block text-sm font-medium">
              {featureName}
            </label>
            <input
              type="number"
              step="any"
              id={featureName}
              name={featureName}
              value={features[featureName]}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>
        ))}
      </div>
      <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400">
        {isLoading ? "Analyzing..." : "Get Prediction"}
      </button>
      {error && <p className="text-red-500">Error: {error}</p>}
      {result && <pre className="mt-4 p-2 bg-gray-100 rounded">Result: {JSON.stringify(result, null, 2)}</pre>}
    </form>
  )
}