"use client"

import { Suspense } from "react"
import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ContactPageSkeleton } from "@/components/skeleton-loader"
import { Phone, Mail, MessageSquare, Clock, MapPin } from "lucide-react"
import { motion } from "framer-motion"
import UserLayout from "@/components/userlayout"

// Move all the existing content into ContactPageContent component
function ContactPageContent() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 1500)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Contact Owner</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Get in touch with us for any queries or assistance</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="hover:shadow-md transition-shadow feature-card">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">Call Us</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">Speak directly with our team</p>
                  <a
                    href="tel:+919876543210"
                    className="text-primary hover:text-primary/80 font-medium btn-animate inline-block px-4 py-2 rounded-md bg-primary/10"
                  >
                    +91 98765 43210
                  </a>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow feature-card">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-medium mb-2">WhatsApp</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">Chat with us instantly</p>
                  <a
                    href="https://wa.me/919876543210"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 font-medium btn-animate inline-block px-4 py-2 rounded-md bg-green-100 dark:bg-green-900"
                  >
                    Chat Now
                  </a>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="mt-1 bg-primary/10 p-2 rounded-full">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium mb-1">Email</h3>
                      <a href="mailto:info@innfopg.com" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                        info@innfopg.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="mt-1 bg-primary/10 p-2 rounded-full">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium mb-1">Address</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        123 PG Street, Koramangala
                        <br />
                        Bengaluru, Karnataka 560034
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="mt-1 bg-primary/10 p-2 rounded-full">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium mb-1">Office Hours</h3>
                      <p className="text-gray-600 dark:text-gray-400">Monday - Sunday: 9:00 AM - 8:00 PM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Owner Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-600 dark:text-gray-300">RK</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Rajesh Kumar</h3>
                    <p className="text-gray-600 dark:text-gray-400">PG Owner & Manager</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">15+ years experience in hospitality</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div>
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center"
              >
                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-800/50 rounded-full flex items-center justify-center mb-4">
                  <svg
                    className="w-8 h-8 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-2">
                  Message Sent Successfully!
                </h3>
                <p className="text-green-700 dark:text-green-400 mb-4">We'll get back to you within 24 hours.</p>
                <Button onClick={() => setIsSubmitted(false)} variant="outline" className="mt-2">
                  Send Another Message
                </Button>
              </motion.div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                  <CardDescription>We'll respond to your query as soon as possible</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="Your name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" type="tel" placeholder="Your phone number" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Your email address" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" placeholder="What is this about?" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea id="message" placeholder="Your message..." rows={5} required />
                    </div>
                    <Button type="submit" className="w-full btn-animate" disabled={isSubmitting}>
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ContactPage() {
  return (
     <UserLayout>
    <Suspense fallback={<ContactPageSkeleton />}>
      <ContactPageContent />
    </Suspense>
    </UserLayout>
  )
}
