"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Edit, Camera } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { HeaderMenu } from "@/components/header-menu"

export default function ProfilePage() {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [profileImage, setProfileImage] = useState("/placeholder.svg?height=96&width=96")
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    about: "",
  })

  const handleBack = () => {
    router.back()
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing)
  }

  const handleSave = () => {
    // Here you would typically save the data to a backend
    console.log("Saving profile data:", profileData)
    setIsEditing(false)
    // Show success message or handle save logic
  }

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 p-4 relative">
      <HeaderMenu />
      <div className="max-w-md mx-auto">
        <Card className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-6 text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-white">
                  <Image
                    src={profileImage || "/placeholder.svg"}
                    alt="Doctor Avatar"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                {isEditing && (
                  <label className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <Camera className="h-4 w-4 text-purple-600" />
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <Input
                  type="text"
                  placeholder="Enter the name"
                  value={profileData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  readOnly={!isEditing}
                  className={`bg-purple-50 border-purple-200 rounded-lg placeholder:text-gray-400 placeholder:font-normal ${
                    isEditing ? "bg-white border-purple-300" : "bg-purple-50"
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Input
                  type="email"
                  placeholder="Enter the email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  readOnly={!isEditing}
                  className={`bg-purple-50 border-purple-200 rounded-lg placeholder:text-gray-400 placeholder:font-normal ${
                    isEditing ? "bg-white border-purple-300" : "bg-purple-50"
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <Input
                  type="tel"
                  placeholder="Enter the phone number"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  readOnly={!isEditing}
                  className={`bg-purple-50 border-purple-200 rounded-lg placeholder:text-gray-400 placeholder:font-normal ${
                    isEditing ? "bg-white border-purple-300" : "bg-purple-50"
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
                <Input
                  type="text"
                  placeholder={isEditing ? "Tell us about yourself" : "About"}
                  value={profileData.about}
                  onChange={(e) => handleInputChange("about", e.target.value)}
                  readOnly={!isEditing}
                  className={`bg-purple-50 border-purple-200 rounded-lg placeholder:text-gray-400 placeholder:font-normal ${
                    isEditing ? "bg-white border-purple-300" : "bg-purple-50"
                  }`}
                />
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="bg-purple-600 text-white hover:bg-purple-700 rounded-full px-8"
                >
                  Back
                </Button>
                {isEditing ? (
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => setIsEditing(false)}
                      variant="outline"
                      className="text-purple-600 border-purple-300 hover:bg-purple-50 rounded-full px-6"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      className="bg-purple-600 text-white hover:bg-purple-700 rounded-full px-8"
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={handleEditToggle}
                    className="bg-purple-600 text-white hover:bg-purple-700 rounded-full px-8 flex items-center space-x-2"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
