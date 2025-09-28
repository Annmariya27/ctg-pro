"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { HeaderMenu } from "@/components/header-menu"

export default function DetailsPage() {
  const handleGenerateReport = () => {
    // Generate PDF report logic
    console.log("Generating PDF report...")
    alert("PDF Report Generated Successfully!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 to-pink-200 p-4 relative">
      <HeaderMenu />
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-4 border-b">
            <h1 className="text-lg font-semibold text-purple-700">Details</h1>
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

          <div className="p-6">
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
