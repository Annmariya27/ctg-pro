"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Menu, User, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

export function HeaderMenu() {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const router = useRouter()

  const handleProfile = () => {
    router.push("/profile")
  }

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    router.push("/")
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="absolute top-4 right-4">
            <Menu className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleProfile} className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowLogoutDialog(true)} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="bg-purple-100 border-purple-200">
          <DialogHeader>
            <DialogTitle className="text-center">Do you really want to logout?</DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
              className="bg-purple-600 text-white hover:bg-purple-700 rounded-full px-8"
            >
              No
            </Button>
            <Button onClick={handleLogout} className="bg-purple-600 text-white hover:bg-purple-700 rounded-full px-8">
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
