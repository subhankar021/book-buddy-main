"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Search, MapPin, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import { books, genres, indianCities } from "@/data/books"

export default function BooksPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [filters, setFilters] = useState({
    genre: "all",
    condition: "all",
    location: "all",
    maxDistance: 50,
  })
  const [availableBooks, setAvailableBooks] = useState(books)

  // Load any books added by the user from localStorage
  useEffect(() => {
    const userBooks = JSON.parse(localStorage.getItem("userBooks") || "[]")
    setAvailableBooks([...books, ...userBooks])
  }, [])

  // Filter books based on search term and filters
  const filteredBooks = availableBooks.filter((book) => {
    // Search term filter
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())

    // Tab filter
    const matchesTab = activeTab === "all" || book.type === activeTab

    // Genre filter
    const matchesGenre = filters.genre === "all" || book.genre === filters.genre

    // Condition filter
    const matchesCondition = filters.condition === "all" || book.condition === filters.condition

    // Location filter
    const matchesLocation = filters.location === "all" || book.location === filters.location

    return matchesSearch && matchesTab && matchesGenre && matchesCondition && matchesLocation
  })

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1 container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
          <div className="w-full md:w-2/3">
            <h1 className="text-3xl font-bold mb-2">Find Your Next Book</h1>
            <p className="text-gray-500 mb-4">Browse books available for exchange or rent</p>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by title or author..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full md:w-1/3 flex justify-end">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Books</SheetTitle>
                  <SheetDescription>Refine your search results</SheetDescription>
                </SheetHeader>
                <div className="grid gap-6 py-6">
                  <div className="space-y-2">
                    <Label>Genre</Label>
                    <Select value={filters.genre} onValueChange={(value) => setFilters({ ...filters, genre: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select genre" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Genres</SelectItem>
                        {genres.map((genre) => (
                          <SelectItem key={genre} value={genre}>
                            {genre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Select
                      value={filters.location}
                      onValueChange={(value) => setFilters({ ...filters, location: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        {indianCities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Condition</Label>
                    <Select
                      value={filters.condition}
                      onValueChange={(value) => setFilters({ ...filters, condition: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any Condition</SelectItem>
                        <SelectItem value="Like New">Like New</SelectItem>
                        <SelectItem value="Excellent">Excellent</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Fair">Fair</SelectItem>
                        <SelectItem value="Poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Maximum Distance</Label>
                      <span className="text-sm text-gray-500">{filters.maxDistance} km</span>
                    </div>
                    <Slider
                      defaultValue={[filters.maxDistance]}
                      max={100}
                      step={5}
                      onValueChange={(value) => setFilters({ ...filters, maxDistance: value[0] })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Availability</Label>
                    <div className="flex items-center space-x-2 pt-2">
                      <Checkbox id="available-now" />
                      <label
                        htmlFor="available-now"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Available now
                      </label>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setFilters({ genre: "all", condition: "all", location: "all", maxDistance: 50 })}
                  >
                    Reset
                  </Button>
                  <Button>Apply Filters</Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Books</TabsTrigger>
            <TabsTrigger value="exchange">For Exchange</TabsTrigger>
            <TabsTrigger value="rent">For Rent</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <Link href={`/books/${book.id}`} key={book.id}>
                <Card className="h-full overflow-hidden transition-all hover:shadow-lg">
                  <div className="aspect-[2/3] relative overflow-hidden bg-gray-100">
                    <img
                      src={book.cover || "/placeholder.svg?height=200&width=150"}
                      alt={book.title}
                      className="object-cover w-full h-full"
                    />
                    <Badge
                      className={`absolute top-2 right-2 ${book.type === "exchange" ? "bg-green-500" : "bg-purple-500"}`}
                    >
                      {book.type === "exchange" ? "Exchange" : "Rent"}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg line-clamp-1">{book.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">{book.author}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-2">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span>{book.location}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between items-center">
                    <div className="text-xs text-gray-500">Owner: {book.owner}</div>
                    <Badge variant="outline">{book.condition}</Badge>
                  </CardFooter>
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium">No books found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
