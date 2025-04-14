"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, MessageSquare, BookMarked, User, Edit, Trash2, AlertCircle, Upload } from "lucide-react"
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import { myBooks, messages, genres, indianCities } from "@/data/books"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const { toast } = useToast()
  const [userBooks, setUserBooks] = useState<any[]>([])
  const [editingBook, setEditingBook] = useState<any>(null)
  const [isAddingBook, setIsAddingBook] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [newBookData, setNewBookData] = useState({
    id: Date.now(),
    title: "",
    author: "",
    genre: "",
    location: "",
    email: "",
    phone: "",
    condition: "Good",
    type: "exchange",
    description: "",
    exchangePreferences: "",
    cover: "/placeholder.svg?height=200&width=150",
    owner: "You",
    status: "available",
    listedDate: "Just now",
    views: 0,
    requests: 0,
  })

  // Load user books from localStorage
  useEffect(() => {
    const storedBooks = JSON.parse(localStorage.getItem("userBooks") || "[]")
    setUserBooks(storedBooks)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (editingBook) {
      setEditingBook({ ...editingBook, [name]: value })
    } else {
      setNewBookData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    if (editingBook) {
      setEditingBook({ ...editingBook, [name]: value })
    } else {
      setNewBookData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault()

    // Create a new book with a unique ID
    const newBook = {
      ...newBookData,
      id: Date.now(),
      cover: imagePreview || newBookData.cover,
    }

    // Add to user books
    const updatedBooks = [...userBooks, newBook]
    setUserBooks(updatedBooks)

    // Save to localStorage
    localStorage.setItem("userBooks", JSON.stringify(updatedBooks))

    // Also save to global books for browsing
    const allBooks = JSON.parse(localStorage.getItem("userBooks") || "[]")
    localStorage.setItem("userBooks", JSON.stringify([...allBooks, newBook]))

    // Reset form
    setNewBookData({
      id: Date.now(),
      title: "",
      author: "",
      genre: "",
      location: "",
      email: "",
      phone: "",
      condition: "Good",
      type: "exchange",
      description: "",
      exchangePreferences: "",
      cover: "/placeholder.svg?height=200&width=150",
      owner: "You",
      status: "available",
      listedDate: "Just now",
      views: 0,
      requests: 0,
    })
    setSelectedImage(null)
    setImagePreview(null)
    setIsAddingBook(false)

    toast({
      title: "Book Added",
      description: "Your book has been successfully listed.",
    })
  }

  const handleEditBook = (e: React.FormEvent) => {
    e.preventDefault()

    if (!editingBook) return

    // Update the book
    const updatedBook = {
      ...editingBook,
      cover: imagePreview || editingBook.cover,
    }

    // Update user books
    const updatedBooks = userBooks.map((book) => (book.id === updatedBook.id ? updatedBook : book))
    setUserBooks(updatedBooks)

    // Save to localStorage
    localStorage.setItem("userBooks", JSON.stringify(updatedBooks))

    // Reset form
    setEditingBook(null)
    setSelectedImage(null)
    setImagePreview(null)

    toast({
      title: "Book Updated",
      description: "Your book has been successfully updated.",
    })
  }

  const handleDeleteBook = (id: number) => {
    // Remove the book
    const updatedBooks = userBooks.filter((book) => book.id !== id)
    setUserBooks(updatedBooks)

    // Save to localStorage
    localStorage.setItem("userBooks", JSON.stringify(updatedBooks))

    toast({
      title: "Book Removed",
      description: "Your book has been successfully removed.",
      variant: "destructive",
    })
  }

  const startEditingBook = (book: any) => {
    setEditingBook(book)
    setImagePreview(book.cover)
  }

  // Combine sample books with user books for display
  const allBooks = [...myBooks, ...userBooks]

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1 container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Owner Dashboard</h1>
            <p className="text-gray-500">Manage your books, messages, and account</p>
          </div>
          <Dialog open={isAddingBook} onOpenChange={setIsAddingBook}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700">
                <Plus className="h-4 w-4" />
                Add New Book
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add a New Book</DialogTitle>
                <DialogDescription>Fill in the details about the book you want to list.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddBook}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="cover">Book Cover</Label>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-32 bg-gray-100 rounded-md overflow-hidden">
                        {imagePreview ? (
                          <img
                            src={imagePreview || "/placeholder.svg"}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Upload className="h-8 w-8" />
                          </div>
                        )}
                      </div>
                      <Input id="cover" type="file" accept="image/*" onChange={handleImageChange} className="flex-1" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Title*</Label>
                      <Input id="title" name="title" value={newBookData.title} onChange={handleInputChange} required />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="author">Author*</Label>
                      <Input
                        id="author"
                        name="author"
                        value={newBookData.author}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="genre">Genre (Optional)</Label>
                      <Select value={newBookData.genre} onValueChange={(value) => handleSelectChange("genre", value)}>
                        <SelectTrigger id="genre">
                          <SelectValue placeholder="Select genre" />
                        </SelectTrigger>
                        <SelectContent>
                          {genres.map((genre) => (
                            <SelectItem key={genre} value={genre}>
                              {genre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="condition">Condition*</Label>
                      <Select
                        value={newBookData.condition}
                        onValueChange={(value) => handleSelectChange("condition", value)}
                      >
                        <SelectTrigger id="condition">
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Like New">Like New</SelectItem>
                          <SelectItem value="Excellent">Excellent</SelectItem>
                          <SelectItem value="Good">Good</SelectItem>
                          <SelectItem value="Fair">Fair</SelectItem>
                          <SelectItem value="Poor">Poor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">City/Location*</Label>
                    <Select
                      value={newBookData.location}
                      onValueChange={(value) => handleSelectChange("location", value)}
                      required
                    >
                      <SelectTrigger id="location">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {indianCities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email*</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={newBookData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone*</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={newBookData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="type">Listing Type*</Label>
                    <Select value={newBookData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="exchange">For Exchange</SelectItem>
                        <SelectItem value="rent">For Rent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={newBookData.description}
                      onChange={handleInputChange}
                      className="min-h-[80px]"
                    />
                  </div>
                  {newBookData.type === "exchange" && (
                    <div className="grid gap-2">
                      <Label htmlFor="exchangePreferences">Exchange Preferences</Label>
                      <Textarea
                        id="exchangePreferences"
                        name="exchangePreferences"
                        value={newBookData.exchangePreferences}
                        onChange={handleInputChange}
                        placeholder="What books would you like to receive in exchange?"
                        className="min-h-[80px]"
                      />
                    </div>
                  )}
                  {newBookData.type === "rent" && (
                    <div className="grid gap-2">
                      <Label htmlFor="rentPrice">Rental Price (per week)</Label>
                      <Input id="rentPrice" name="rentPrice" type="text" placeholder="₹200" />
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
                  >
                    Add Book
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Edit Book Dialog */}
          <Dialog open={!!editingBook} onOpenChange={(open) => !open && setEditingBook(null)}>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Edit Book</DialogTitle>
                <DialogDescription>Update the details of your book listing.</DialogDescription>
              </DialogHeader>
              {editingBook && (
                <form onSubmit={handleEditBook}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-cover">Book Cover</Label>
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-32 bg-gray-100 rounded-md overflow-hidden">
                          {imagePreview ? (
                            <img
                              src={imagePreview || "/placeholder.svg"}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <img
                              src={editingBook.cover || "/placeholder.svg"}
                              alt={editingBook.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <Input
                          id="edit-cover"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="edit-title">Title*</Label>
                        <Input
                          id="edit-title"
                          name="title"
                          value={editingBook.title}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-author">Author*</Label>
                        <Input
                          id="edit-author"
                          name="author"
                          value={editingBook.author}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="edit-genre">Genre (Optional)</Label>
                        <Select value={editingBook.genre} onValueChange={(value) => handleSelectChange("genre", value)}>
                          <SelectTrigger id="edit-genre">
                            <SelectValue placeholder="Select genre" />
                          </SelectTrigger>
                          <SelectContent>
                            {genres.map((genre) => (
                              <SelectItem key={genre} value={genre}>
                                {genre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-condition">Condition*</Label>
                        <Select
                          value={editingBook.condition}
                          onValueChange={(value) => handleSelectChange("condition", value)}
                        >
                          <SelectTrigger id="edit-condition">
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Like New">Like New</SelectItem>
                            <SelectItem value="Excellent">Excellent</SelectItem>
                            <SelectItem value="Good">Good</SelectItem>
                            <SelectItem value="Fair">Fair</SelectItem>
                            <SelectItem value="Poor">Poor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-location">City/Location*</Label>
                      <Select
                        value={editingBook.location}
                        onValueChange={(value) => handleSelectChange("location", value)}
                        required
                      >
                        <SelectTrigger id="edit-location">
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          {indianCities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="edit-email">Email*</Label>
                        <Input
                          id="edit-email"
                          name="email"
                          type="email"
                          value={editingBook.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-phone">Phone*</Label>
                        <Input
                          id="edit-phone"
                          name="phone"
                          type="tel"
                          value={editingBook.phone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-type">Listing Type*</Label>
                      <Select value={editingBook.type} onValueChange={(value) => handleSelectChange("type", value)}>
                        <SelectTrigger id="edit-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="exchange">For Exchange</SelectItem>
                          <SelectItem value="rent">For Rent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-description">Description</Label>
                      <Textarea
                        id="edit-description"
                        name="description"
                        value={editingBook.description}
                        onChange={handleInputChange}
                        className="min-h-[80px]"
                      />
                    </div>
                    {editingBook.type === "exchange" && (
                      <div className="grid gap-2">
                        <Label htmlFor="edit-exchangePreferences">Exchange Preferences</Label>
                        <Textarea
                          id="edit-exchangePreferences"
                          name="exchangePreferences"
                          value={editingBook.exchangePreferences}
                          onChange={handleInputChange}
                          placeholder="What books would you like to receive in exchange?"
                          className="min-h-[80px]"
                        />
                      </div>
                    )}
                    {editingBook.type === "rent" && (
                      <div className="grid gap-2">
                        <Label htmlFor="edit-rentPrice">Rental Price (per week)</Label>
                        <Input
                          id="edit-rentPrice"
                          name="rentPrice"
                          type="text"
                          placeholder="₹200"
                          value={editingBook.rentPrice}
                          onChange={handleInputChange}
                        />
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
                    >
                      Save Changes
                    </Button>
                  </DialogFooter>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="books" className="mb-8">
          <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
            <TabsTrigger value="books" className="gap-2">
              <BookMarked className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">My Books</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="gap-2">
              <MessageSquare className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Messages</span>
              <Badge className="ml-1 bg-pink-500">3</Badge>
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Profile</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="books" className="pt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">My Listed Books</h2>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Books</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="exchanged">Exchanged/Rented</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allBooks.map((book) => (
                <Card key={book.id} className="overflow-hidden">
                  <div className="flex h-full">
                    <div className="w-1/3 bg-gray-100">
                      <img
                        src={book.cover || "/placeholder.svg?height=200&width=150"}
                        alt={book.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="w-2/3 flex flex-col">
                      <CardHeader className="p-4 pb-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg line-clamp-1">{book.title}</CardTitle>
                            <CardDescription>{book.author}</CardDescription>
                          </div>
                          <Badge
                            className={`
                              ${
                                book.status === "available"
                                  ? "bg-green-500"
                                  : book.status === "pending"
                                    ? "bg-yellow-500"
                                    : "bg-gray-500"
                              }
                            `}
                          >
                            {book.status.charAt(0).toUpperCase() + book.status.slice(1)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-2 flex-grow">
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                          <span>{book.type === "exchange" ? "For Exchange" : "For Rent"}</span>
                          <span>{book.condition}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>Listed {book.listedDate}</span>
                          <span>{book.views} views</span>
                        </div>
                        {book.requests > 0 && (
                          <div className="mt-2 text-sm font-medium text-pink-600">
                            {book.requests} new request{book.requests > 1 ? "s" : ""}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-between">
                        <Button variant="outline" size="sm" className="gap-1" onClick={() => startEditingBook(book)}>
                          <Edit className="h-3 w-3" />
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1 text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                              Remove
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete your book listing. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteBook(book.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </CardFooter>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="messages" className="pt-6">
            <h2 className="text-xl font-semibold mb-6">Messages & Requests</h2>

            <div className="space-y-4">
              {messages.map((message) => (
                <Card key={message.id} className={`${message.unread ? "border-l-4 border-l-pink-500" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage
                          src={message.sender.avatar || "/placeholder.svg?height=40&width=40"}
                          alt={message.sender.name}
                        />
                        <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{message.sender.name}</h3>
                            <p className="text-sm text-gray-500">About: {message.book}</p>
                          </div>
                          <div className="text-xs text-gray-500">{message.date}</div>
                        </div>
                        <p className="mt-2 text-gray-700">{message.message}</p>
                        <div className="mt-4 flex gap-2">
                          <Button size="sm">Reply</Button>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src="/avatars/avatar1.jpg" alt="Profile" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-medium">Jane Doe</h3>
                  <p className="text-gray-500">jane.doe@example.com</p>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <span>Member since January 2023</span>
                  </div>
                  <Button className="mt-4 gap-2" variant="outline">
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue="Jane Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="jane.doe@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" defaultValue="+91 9876543210" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Select defaultValue="Mumbai, Maharashtra">
                      <SelectTrigger id="location">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {indianCities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preferences">Exchange Preferences</Label>
                    <Textarea
                      id="preferences"
                      placeholder="What kinds of books are you interested in?"
                      defaultValue="I'm interested in fiction, science fiction, and mystery novels."
                    />
                  </div>
                  <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                    <p className="text-sm text-yellow-700">
                      Your profile is 80% complete. Add a profile picture to complete your profile.
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700">
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>

              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-sm text-gray-500">Receive email notifications for messages and requests</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="email-notifications" className="sr-only">
                          Email Notifications
                        </Label>
                        <input
                          type="checkbox"
                          id="email-notifications"
                          className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                          defaultChecked
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">SMS Notifications</h4>
                        <p className="text-sm text-gray-500">Receive text messages for urgent updates</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="sms-notifications" className="sr-only">
                          SMS Notifications
                        </Label>
                        <input
                          type="checkbox"
                          id="sms-notifications"
                          className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Marketing Emails</h4>
                        <p className="text-sm text-gray-500">Receive updates about new features and promotions</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="marketing-emails" className="sr-only">
                          Marketing Emails
                        </Label>
                        <input
                          type="checkbox"
                          id="marketing-emails"
                          className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                          defaultChecked
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">Update Preferences</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}
