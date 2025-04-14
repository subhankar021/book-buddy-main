"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { BookMarked, Menu, MessageSquare, User, LogOut, Bell } from "lucide-react"

export function NavBar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)

  // Use useEffect to safely access localStorage after component mounts
  useEffect(() => {
    setUserRole(localStorage.getItem("userRole"))
  }, [])

  // Determine if user is on dashboard or books page
  const isOnDashboard = pathname?.includes("/dashboard")
  const isOnBooks = pathname?.includes("/books") && !pathname?.includes("/dashboard")

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">BookBuddy</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/books"
            className={`text-sm font-medium transition-colors hover:text-primary ${isOnBooks ? "text-pink-500" : "text-foreground/60"}`}
          >
            Browse Books
          </Link>
          {userRole === "owner" && (
            <Link
              href="/dashboard"
              className={`text-sm font-medium transition-colors hover:text-primary ${isOnDashboard ? "text-pink-500" : "text-foreground/60"}`}
            >
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-pink-500" />
            <span className="sr-only">Notifications</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">Jane Doe</p>
                  <p className="text-sm text-muted-foreground">jane.doe@example.com</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              {userRole === "owner" && (
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
                    <BookMarked className="h-4 w-4" />
                    <span>My Books</span>
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link href="/dashboard?tab=messages" className="flex items-center gap-2 cursor-pointer">
                  <MessageSquare className="h-4 w-4" />
                  <span>Messages</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard?tab=profile" className="flex items-center gap-2 cursor-pointer">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <LogOut className="h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 py-6">
                <Link
                  href="/books"
                  className="flex items-center gap-2 text-lg font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <BookMarked className="h-5 w-5" />
                  Browse Books
                </Link>
                {userRole === "owner" && (
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 text-lg font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="h-5 w-5" />
                    Dashboard
                  </Link>
                )}
                <div className="flex flex-col gap-2 pt-6">
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    Log out
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
