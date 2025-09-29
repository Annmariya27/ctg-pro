"use client"

interface ShapValue {
  feature: string
  value: number
}

interface ShapChartProps {
  data: ShapValue[]
}

// A mapping to make meta-feature names more readable
const PRETTY_FEATURE_NAMES: Record<string, string> = {
  "SVM_p0": "SVM (Normal)",
  "SVM_p1": "SVM (Suspect)",
  "SVM_p2": "SVM (Pathological)",
  "RandomForest_p0": "RF (Normal)",
  "RandomForest_p1": "RF (Suspect)",
  "RandomForest_p2": "RF (Pathological)",
  "XGBoost_p0": "XGB (Normal)",
  "XGBoost_p1": "XGB (Suspect)",
  "XGBoost_p2": "XGB (Pathological)",
  "CatBoost_p0": "CatBoost (Normal)",
  "CatBoost_p1": "CatBoost (Suspect)",
  "CatBoost_p2": "CatBoost (Pathological)",
}

export function ShapChart({ data }: ShapChartProps) {
  // Sort by value and take top 10 for clarity
  const sortedData = [...data].sort((a, b) => b.value - a.value).slice(0, 10)
  const maxValue = sortedData.length > 0 ? sortedData[0].value : 0

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-purple-700">Feature Impact on Prediction (Top 10)</h3>
      {sortedData.map(({ feature, value }) => (
        <div key={feature} className="flex items-center text-xs">
          <div className="w-1/3 pr-2 truncate text-right font-medium" title={feature}>
            {PRETTY_FEATURE_NAMES[feature] || feature}
          </div>
          <div className="w-2/3">
            <div
              className="bg-purple-500 h-5 rounded-r-sm text-white flex items-center pl-2"
              style={{
                width: maxValue > 0 ? `${(value / maxValue) * 100}%` : "0%",
                minWidth: "20px", // Ensure even small values are visible
              }}
            >
              {value.toFixed(4)}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
