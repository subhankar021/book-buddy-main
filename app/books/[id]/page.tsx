"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Calendar, Star, MessageSquare, ArrowLeft, Share2 } from "lucide-react"
import { NavBar } from "@/components/nav-bar"
import { Footer } from "@/components/footer"
import { bookDetails, books } from "@/data/books"

export default function BookDetailPage() {
  const params = useParams()
  const bookId = Number(params.id)
  const [book, setBook] = useState(bookDetails.find((b) => b.id === bookId) || bookDetails[0])
  const [message, setMessage] = useState("")
  const [similarBooks, setSimilarBooks] = useState(books.filter((b) => b.id !== bookId).slice(0, 2))

  // Check if this is a user-added book
  useEffect(() => {
    const userBooks = JSON.parse(localStorage.getItem("userBooks") || "[]")
    const userBook = userBooks.find((b: any) => b.id === bookId)

    if (userBook) {
      // Convert user book to book detail format
      const userBookDetail = {
        ...userBook,
        owner: {
          name: userBook.owner,
          avatar: "/avatars/avatar1.jpg",
          rating: 4.5,
          joinedDate: "2023",
        },
        language: "English",
        publishYear: 2020,
        description: userBook.description || "No description provided.",
        exchangePreferences:
          userBook.type === "exchange" ? userBook.exchangePreferences || "No preferences specified." : undefined,
        rentPrice: userBook.type === "rent" ? "₹200 per week" : undefined,
      }
      setBook(userBookDetail)
    }
  }, [bookId])

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <main className="flex-1 container py-8">
        <Link
          href="/books"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to books
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="sticky top-24">
              <div className="aspect-[2/3] relative overflow-hidden bg-gray-100 rounded-lg mb-4">
                <img
                  src={book.cover || "/placeholder.svg?height=400&width=300"}
                  alt={book.title}
                  className="object-cover w-full h-full"
                />
                <Badge
                  className={`absolute top-4 right-4 ${book.type === "exchange" ? "bg-green-500" : "bg-purple-500"}`}
                >
                  {book.type === "exchange" ? "Exchange" : "Rent"}
                </Badge>
              </div>

              <div className="flex justify-between mb-6">
                <Button variant="outline" size="sm" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Contact Owner
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Contact {book.owner.name}</DialogTitle>
                      <DialogDescription>Send a message about &quot;{book.title}&quot;</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <Textarea
                        placeholder={`Hi ${book.owner.name}, I'm interested in your book "${book.title}"...`}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="min-h-[120px]"
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
                      >
                        Send Message
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar>
                      <AvatarImage
                        src={book.owner.avatar || "/placeholder.svg?height=40&width=40"}
                        alt={book.owner.name}
                      />
                      <AvatarFallback>{book.owner.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{book.owner.name}</h3>
                      <div className="flex items-center text-sm text-gray-500">
                        <Star className="h-3 w-3 text-yellow-500 mr-1" />
                        <span>
                          {book.owner.rating} • Joined {book.owner.joinedDate}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{book.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Usually responds within 24 hours</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <p className="text-xl text-gray-500 mb-4">by {book.author}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="secondary">{book.genre}</Badge>
              <Badge variant="secondary">{book.condition}</Badge>
              <Badge variant="secondary">{book.language}</Badge>
              <Badge variant="secondary">Published {book.publishYear}</Badge>
            </div>

            <Tabs defaultValue="about" className="mb-8">
              <TabsList>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                {book.type === "exchange" && <TabsTrigger value="exchange">Exchange Info</TabsTrigger>}
                {book.type === "rent" && <TabsTrigger value="rent">Rental Info</TabsTrigger>}
              </TabsList>
              <TabsContent value="about" className="pt-4">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-gray-700 mb-6">{book.description}</p>
              </TabsContent>
              <TabsContent value="details" className="pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-500">Title</h3>
                    <p>{book.title}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-500">Author</h3>
                    <p>{book.author}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-500">Genre</h3>
                    <p>{book.genre}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-500">Condition</h3>
                    <p>{book.condition}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-500">Language</h3>
                    <p>{book.language}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-500">Published</h3>
                    <p>{book.publishYear}</p>
                  </div>
                </div>
              </TabsContent>
              {book.type === "exchange" && (
                <TabsContent value="exchange" className="pt-4">
                  <h2 className="text-xl font-semibold mb-2">Exchange Preferences</h2>
                  <p className="text-gray-700 mb-4">{book.exchangePreferences}</p>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-medium text-green-800 mb-2">How Exchange Works</h3>
                    <ol className="list-decimal list-inside text-green-700 space-y-2">
                      <li>Contact the owner through the messaging system</li>
                      <li>Discuss exchange details and preferences</li>
                      <li>Arrange a meeting place or shipping method</li>
                      <li>Complete the exchange and enjoy your new book!</li>
                    </ol>
                  </div>
                </TabsContent>
              )}
              {book.type === "rent" && (
                <TabsContent value="rent" className="pt-4">
                  <h2 className="text-xl font-semibold mb-2">Rental Information</h2>
                  <p className="text-gray-700 mb-2">Price: {book.rentPrice}</p>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-medium text-purple-800 mb-2">How Rental Works</h3>
                    <ol className="list-decimal list-inside text-purple-700 space-y-2">
                      <li>Contact the owner to confirm availability</li>
                      <li>Agree on rental period and payment method</li>
                      <li>Pay the rental fee and receive the book</li>
                      <li>Return the book in the same condition by the agreed date</li>
                    </ol>
                  </div>
                </TabsContent>
              )}
            </Tabs>

            <h2 className="text-xl font-semibold mb-4">Similar Books</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {books
                .filter((b) => b.id !== bookId)
                .slice(0, 2)
                .map((similarBook) => (
                  <Link href={`/books/${similarBook.id}`} key={similarBook.id}>
                    <Card className="overflow-hidden transition-all hover:shadow-md">
                      <div className="flex">
                        <div className="w-1/3">
                          <img
                            src={similarBook.cover || "/placeholder.svg?height=200&width=150"}
                            alt={similarBook.title}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <CardContent className="w-2/3 p-4">
                          <h3 className="font-semibold line-clamp-1">{similarBook.title}</h3>
                          <p className="text-sm text-gray-500 mb-2">{similarBook.author}</p>
                          <Badge
                            className={`${similarBook.type === "exchange" ? "bg-green-500" : "bg-purple-500"} text-xs`}
                          >
                            {similarBook.type === "exchange" ? "Exchange" : "Rent"}
                          </Badge>
                        </CardContent>
                      </div>
                    </Card>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
