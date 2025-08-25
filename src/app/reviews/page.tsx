"use client"

import { Suspense, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ReviewsPageSkeleton } from "@/components/skeleton-loader"
import { Star, User, Calendar } from "lucide-react"
import { motion } from "framer-motion"
import UserLayout from "@/components/userlayout"
import { useRouter, useSearchParams } from "next/navigation"


function StarRating({
  rating,
  interactive = false,
  onRatingChange,
}: {
  rating: number
  interactive?: boolean
  onRatingChange?: (rating: number) => void
}) {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 ${
            star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
          } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
          onClick={() => interactive && onRatingChange?.(star)}
        />
      ))}
    </div>
  )
}

function ReviewsPageContent() {
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newRating, setNewRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const searchParams = useSearchParams();
  const userId = searchParams.get("user_id")
const buildingId= searchParams.get("building_id")

  useEffect(() => {

    if (!userId) {
      return;
    }
    const fetchReviews = async () => {
      try {
        const response = await fetch(`https://innfo.top/App/api.php?gofor=reviewlist&user_id=${userId}`);
        const data = await response.json()
        const filtered = data.filter((r: any) => r.status === 1)
        setReviews(filtered)
      } catch (error) {
        console.error("Failed to fetch reviews:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [])

  const averageRating =
    reviews.reduce((sum, review) => sum + Number(review.rating), 0) /
    (reviews.length || 1)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setShowReviewForm(false)
    }, 1500)
  }

  return (
    <div className="container mx-auto px-4 pt-[80px] py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-xl font-bold">Reviews & Feedback</h1>
        <p className="text-gray-600 mb-4">See what our residents have to say about their experience</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white shadow-lg rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-bold block mb-1">{averageRating.toFixed(1)}</span>
                  <StarRating rating={Math.round(averageRating)} />
                  <p className="text-gray-600 mt-2">Based on {reviews.length} reviews</p>
                </div>
                <div className="text-right space-y-1 text-sm">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = reviews.filter((r) => r.rating === stars).length
                    const percentage = (count / (reviews.length || 1)) * 100
                    return (
                      <div key={stars} className="flex items-center space-x-2">
                        <span>{stars}</span>
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <div className="w-20 h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 bg-yellow-400 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-gray-500 w-8">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {loading ? (
              <p>Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <p className="text-gray-500">No reviews found.</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Guest #{review.guest_id}</h4>
                        <p className="text-sm text-gray-600">Resident</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <StarRating rating={review.rating} />
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(review.created_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">{review.review_text}</p>
                </div>
              ))
            )}
          </div>

          {/* Sidebar Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-green-50 border border-green-200 rounded-lg p-6 text-center shadow-lg"
                >
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-green-800 mb-2">Review Submitted!</h3>
                  <p className="text-green-700 mb-4">Thank you for your feedback. It will be published after review.</p>
                  <Button onClick={() => setIsSubmitted(false)} variant="outline">
                    Submit Another Review
                  </Button>
                </motion.div>
              ) : !showReviewForm ? (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-lg font-semibold mb-1">Share Your Experience</h3>
                  <p className="text-sm text-gray-500 mb-4">Help others by sharing your experience at our PG</p>
                  <Button onClick={() => setShowReviewForm(true)} className="w-full">
                    Write a Review
                  </Button>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-lg p-4">
                  <h3 className="text-lg font-semibold mb-1">Write a Review</h3>
                  <p className="text-sm text-gray-500 mb-4">Share your honest feedback about your stay</p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="reviewerName">Your Name</Label>
                      <Input id="reviewerName" required placeholder="Enter your name" />
                    </div>
                    <div>
                      <Label>Occupation</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select occupation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="professional">Working Professional</SelectItem>
                          <SelectItem value="freelancer">Freelancer</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Rating</Label>
                      <StarRating rating={newRating} interactive onRatingChange={setNewRating} />
                    </div>
                    <div>
                      <Label htmlFor="reviewText">Your Review</Label>
                      <Textarea id="reviewText" rows={4} required placeholder="Share your experience..." />
                    </div>
                    <div className="flex space-x-2">
                      <Button type="button" variant="outline" className="flex-1" onClick={() => setShowReviewForm(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="flex-1" disabled={isSubmitting || newRating === 0}>
                        {isSubmitting ? "Submitting..." : "Submit Review"}
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ReviewsPage() {
  return (
    <UserLayout>
      <Suspense fallback={<ReviewsPageSkeleton />}>
        <ReviewsPageContent />
      </Suspense>
    </UserLayout>
  )
}
