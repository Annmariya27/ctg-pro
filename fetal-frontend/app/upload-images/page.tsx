"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import { HeaderMenu } from "@/components/header-menu"

export default function UploadImagesPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragIn = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true)
    }
  }

  const handleDragOut = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      if (file.type.startsWith("image/")) {
        setUploadedFile(file)
        setErrorMessage("")
      } else {
        setErrorMessage("Please upload only image files")
      }
      e.dataTransfer.clearData()
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type.startsWith("image/")) {
        setUploadedFile(file)
        setErrorMessage("")
      } else {
        setErrorMessage("Please upload only image files")
      }
    }
  }

  const handleCancel = () => {
    setUploadedFile(null)
    setErrorMessage("")
    router.back()
  }

  const handleDone = () => {
    if (!uploadedFile) {
      setErrorMessage("Please drag or upload the image first")
      return
    }
    setErrorMessage("")
    router.push("/results")
  }

  const handleReset = () => {
    setUploadedFile(null)
    setErrorMessage("")
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }

  const onButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 to-pink-200 p-4 relative">
      <HeaderMenu />
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-4 border-b">
            <h1 className="text-lg font-semibold">Upload Images of waveform</h1>
          </div>

          <div className="p-6">
            <div
              className={`border-2 border-dashed rounded-lg transition-all duration-200 ${
                dragActive ? "border-purple-500 bg-purple-100" : "border-purple-300 bg-purple-50"
              }`}
              onDragEnter={handleDragIn}
              onDragLeave={handleDragOut}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="p-8 text-center">
                <Upload
                  className={`h-16 w-16 mx-auto mb-4 transition-colors duration-200 ${
                    dragActive ? "text-purple-700" : "text-purple-600"
                  }`}
                />

                {uploadedFile ? (
                  <div className="space-y-2">
                    <p className="text-gray-700 font-medium">{uploadedFile.name}</p>
                    <p className="text-sm text-gray-500">File uploaded successfully!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p
                      className={`text-gray-700 transition-colors duration-200 ${
                        dragActive ? "text-purple-700 font-medium" : ""
                      }`}
                    >
                      {dragActive ? "Drop the image here" : "Drop a image here to upload"}
                    </p>
                    <p className="text-gray-500">or</p>
                    <button
                      type="button"
                      onClick={onButtonClick}
                      className="text-purple-600 hover:text-purple-700 hover:underline font-medium transition-colors duration-200"
                    >
                      click here to browse
                    </button>
                  </div>
                )}

                <input ref={inputRef} type="file" className="hidden" accept="image/*" onChange={handleFileSelect} />
              </div>
            </div>

            {uploadedFile && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-800">Uploaded: {uploadedFile.name}</p>
                    <p className="text-xs text-green-600">Size: {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    size="sm"
                    className="text-purple-600 border-purple-300 bg-transparent hover:bg-purple-50"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm font-medium">{errorMessage}</p>
              </div>
            )}

            <div className="flex justify-between mt-8">
              <Button
                onClick={handleCancel}
                variant="outline"
                className="bg-purple-600 text-white hover:bg-purple-700 rounded-full px-8"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDone}
                className={`rounded-full px-8 transition-all duration-200 ${
                  uploadedFile
                    ? "bg-purple-600 text-white hover:bg-purple-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
