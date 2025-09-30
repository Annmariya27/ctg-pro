"use client"

interface ShapValue {
  feature: string
  value: number
}

interface ShapChartProps {
  data: ShapValue[]
  isAnimationActive?: boolean // Prop to control animations, though not used here yet
}

// A mapping to make meta-feature names more readable
export const PRETTY_FEATURE_NAMES: Record<string, string> = {
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

export function ShapChart({ data, isAnimationActive = true }: ShapChartProps) {
  // Sort by value and take top 10 for clarity
  const sortedData = [...data].sort((a, b) => b.value - a.value).slice(0, 10)
  const maxValue = sortedData.length > 0 ? sortedData[0].value : 0

  return (
    <div>
      <h3 className="text-sm font-semibold" style={{ color: '#6d28d9' }}>
        Feature Impact on Prediction (Top 10)
      </h3>
      {sortedData.map(({ feature, value }) => (
        <div
          key={feature}
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '0.75rem',
            marginTop: '0.5rem', // Replaces space-y-2
          }}
        >
          <div
            style={{ width: '33.33%', paddingRight: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'right', fontWeight: 500 }}
            title={feature}
          >
            {PRETTY_FEATURE_NAMES[feature] || feature}
          </div>
          <div style={{ width: '66.67%' }}>
            <div
              style={{
                backgroundColor: '#8b5cf6', // bg-purple-500
                height: '1.25rem',
                borderTopRightRadius: '0.125rem',
                borderBottomRightRadius: '0.125rem',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '0.5rem',
                width: maxValue > 0 ? `${(value / maxValue) * 100}%` : "0%",
                // When generating for PDF, remove transition to prevent rendering issues
                transition: isAnimationActive ? 'width 0.3s ease-in-out' : 'none',
                minWidth: "25px", // Ensure even small values are visible and have text
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
