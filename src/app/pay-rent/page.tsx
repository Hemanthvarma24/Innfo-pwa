"use client"

import type React from "react"

import { Suspense, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload } from "lucide-react"
import { motion } from "framer-motion"
import { PayRentPageSkeleton } from "@/components/skeleton-loader"
import qrcode from "@/assets/qr code.png"
import Image from "next/image"
import UserLayout from "@/components/userlayout"
import { useRouter, useSearchParams } from "next/navigation"
import toast, { Toaster } from "react-hot-toast"

interface Guest {
  guest_id: number
  name: string
  mobile: string
  email: string
  room_no: string
  bed_no: string
  rent_amount: string
  rent_due_date: string
  room_id: number
  bed_id: number
}

interface Invoice {
  invoice_id: number
  guest_id: number
  month_year: string
  amount: string
  generated_date: string
  due_date: string
  payment_date: string | null
  payment_mode: string | null
  notes: string | null
  proof: string | null
  status: string
  user_id: number
  guest_name: string
  room_no: string
}

function PayRentPageContent() {
  const [paymentMethod, setPaymentMethod] = useState("upi")
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [guests, setGuests] = useState<Guest[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [isLoadingGuests, setIsLoadingGuests] = useState(false) // Changed to false, will load on dropdown click
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false) // Renamed from isLoadingGuestDetails
  const [transactionId, setTransactionId] = useState("")
  const [uploadedImageUrl, setUploadedImageUrl] = useState("")
  const searchParams = useSearchParams()
  const userId = searchParams.get("user_id")
  const buildingId = searchParams.get("building_id")
  const router = useRouter()

  const fetchGuestList = async () => {
    if (guests.length > 0) return // Don't fetch if already loaded

    try {
      setIsLoadingGuests(true)
      const response = await fetch("https://innfo.top/App/api.php?gofor=guestlist")
      const data = await response.json()
      setGuests(data)
    } catch (error) {
      console.error("Error fetching guest list:", error)
      alert("Failed to load guest list")
    } finally {
      setIsLoadingGuests(false)
    }
  }

  const fetchDuePayments = async (guestId: number) => {
    if (!userId) {
      alert("User ID not found")
      return
    }

    try {
      setIsLoadingInvoices(true)
      const response = await fetch(
        `https://innfo.top/App/api.php?gofor=duepayments&user_id=${userId}&guest_id=${guestId}`,
      )
      const data = await response.json()

      // Filter only unpaid invoices
      const unpaidInvoices = data.filter((invoice: Invoice) => invoice.status === "unpaid")
      setInvoices(unpaidInvoices)

      // If only one unpaid invoice, select it automatically
      if (unpaidInvoices.length === 1) {
        setSelectedInvoice(unpaidInvoices[0])
      } else {
        setSelectedInvoice(null)
      }
    } catch (error) {
      console.error("Error fetching due payments:", error)
      alert("Failed to load due payments")
    } finally {
      setIsLoadingInvoices(false)
    }
  }

  const handleGuestSelect = (guestId: string) => {
    const guest = guests.find((g) => g.guest_id.toString() === guestId)
    if (guest) {
      fetchDuePayments(guest.guest_id)
    }
  }

  const handleInvoiceSelect = (invoiceId: string) => {
    const invoice = invoices.find((inv) => inv.invoice_id.toString() === invoiceId)
    if (invoice) {
      setSelectedInvoice(invoice)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedInvoice) {
      alert("Please select an invoice first")
      return
    }

    if (!transactionId && paymentMethod !== "cash") {
      alert("Please enter transaction/reference ID")
      return
    }

    if ((paymentMethod === "upi" || paymentMethod === "bank") && !uploadedImageUrl) {
      alert("Please upload a payment screenshot first")
      return
    }

    setIsSubmitting(true)

    try {
      const paymentData = {
        gofor: "payrent",
        invoice_id: selectedInvoice.invoice_id.toString(),
        amount: selectedInvoice.amount,
        payment_date: new Date().toISOString().split("T")[0],
        payment_mode: paymentMethod === "upi" ? "UPI" : paymentMethod === "bank" ? "Bank Transfer" : "Cash",
        notes: transactionId,
        proof: uploadedImageUrl || (paymentMethod === "cash" ? "cash_payment" : ""),
      }

      const response = await fetch("https://innfo.top/App/api.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      })

      const result = await response.json()

      if (result.response === "Rent Paid successfully") {
        setIsSubmitted(true)
        setTimeout(() => {
          router.push(`/?user_id=${userId}&building_id=${buildingId}`)
        }, 1000)
      } else {
        alert("Payment submission failed. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting payment:", error)
      alert("Payment submission failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleFileUpload = async () => {
  if (!selectedFile) return
  setIsUploading(true)

  const reader = new FileReader()
  reader.onloadend = async () => {
    const base64 = reader.result?.toString().split(",")[1]

    try {
      const res = await fetch("https://innfo.top/App/api.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gofor: "image_upload",
          imgname: base64,
          type: "rent",
        }),
      })

      const data = await res.json()
      if (data.success) {
        setUploadedImageUrl(data.url) // ✅ uploaded file URL
        toast.success("Upload successful!") // ✅ toast
      } else {
        toast.error("Upload failed.") // ✅ toast
      }
    } catch (err) {
      console.error("Upload error:", err)
      toast.error("Upload error.") // ✅ toast
    } finally {
      setIsUploading(false)
    }
  }

  reader.readAsDataURL(selectedFile)
}

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  return (
    
    <><Toaster position="top-center" reverseOrder={false}/><div className="container mx-auto px-4 pt-[80px] pb-12">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-bold">Pay Rent</h1>
          <p className="text-muted-foreground">Secure your monthly rent with easy payment options.</p>
        </div>

        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-green-100 border border-green-300 rounded-xl p-6 text-center"
          >
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-green-200 flex items-center justify-center">✅</div>
            <h3 className="text-xl font-semibold text-green-800">Payment Recorded Successfully!</h3>
            <p className="text-green-700 mt-2 text-sm">
              Your payment has been recorded. Confirmation will be sent to your registered contact.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Guest Selection */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-[#4f008c]/40 text-white px-4 py-3">
                <h2 className="text-lg text-white font-semibold">Select Guest</h2>
              </div>
              <div className="px-4 py-5">
                <Label className="text-sm">Choose Guest</Label>
                <Select
                  onValueChange={handleGuestSelect}
                  disabled={isLoadingGuests}
                  onOpenChange={(open) => open && fetchGuestList()}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingGuests ? "Loading guests..." : "Select a guest"} />
                  </SelectTrigger>
                  <SelectContent>
                    {guests.map((guest) => (
                      <SelectItem key={guest.guest_id} value={guest.guest_id.toString()}>
                        {guest.name} - {guest.room_no} ({guest.bed_no})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Due Payments */}
            {isLoadingInvoices ? (
              <div className="px-4 py-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4f008c] mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Loading due payments...</p>
              </div>
            ) : invoices.length > 0 ? (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-[#4f008c]/40 text-white px-4 py-3">
                  <h2 className="text-lg text-white font-semibold">
                    Due Payments - {invoices[0]?.guest_name}
                  </h2>
                </div>
                <div className="px-4 py-5 space-y-4">
                  {invoices.length > 1 && (
                    <div>
                      <Label className="text-sm">Select Invoice</Label>
                      <Select onValueChange={handleInvoiceSelect}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an invoice to pay" />
                        </SelectTrigger>
                        <SelectContent>
                          {invoices.map((invoice) => (
                            <SelectItem key={invoice.invoice_id} value={invoice.invoice_id.toString()}>
                              {invoice.month_year} - ₹{invoice.amount} (Due: {formatDate(invoice.due_date)})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {selectedInvoice && (
                    <div className="grid grid-cols-2 gap-y-4 gap-x-6 border-t pt-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Room Number</p>
                        <p className="font-semibold text-gray-800">{selectedInvoice.room_no}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Month/Year</p>
                        <p className="font-semibold text-gray-800">{selectedInvoice.month_year}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Amount</p>
                        <p className="font-semibold text-green-600">₹{selectedInvoice.amount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Due Date</p>
                        <p className="font-semibold text-red-600">{formatDate(selectedInvoice.due_date)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
                No pending due payments 🎉
              </div>
            )}

            {/* Payment Method */}
            {selectedInvoice && !isLoadingInvoices && (
              <div className="bg-white rounded-xl shadow p-4 space-y-4">
                <div>
                  <Label className="text-sm">Payment Method</Label>
                  <Select defaultValue="upi" onValueChange={setPaymentMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {paymentMethod === "upi" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Scan QR to pay</p>
                      <div className="bg-white mx-auto">
                        <Image
                          src={qrcode}
                          alt="QR Code"
                          width={200}
                          height={200}
                          className="w-full h-full object-contain" />
                      </div>
                      <p className="text-sm mt-2 font-medium">
                        UPI ID: <span className="text-primary">innfo@upi</span>
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label>Transaction ID</Label>
                        <Input
                          placeholder="Enter UPI Transaction ID"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          required />
                      </div>

                      <div>
                        <Label>Upload Screenshot</Label>
                        <div className="border-2 border-dashed rounded-lg p-4 text-center space-y-3">
                          <Input type="file" accept="image/*" onChange={handleFileChange} />
                          <Button
                            type="button"
                            onClick={handleFileUpload}
                            className="w-full"
                            disabled={!selectedFile || isUploading}
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            {isUploading ? "Uploading..." : "Upload Screenshot"}
                          </Button>
                          <p className="text-xs text-gray-500">JPG or PNG (Max: 5MB)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "bank" && (
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg text-sm">
                      <p>
                        <strong>Account Name:</strong> Innfo PG
                      </p>
                      <p>
                        <strong>Number:</strong> 1234567890
                      </p>
                      <p>
                        <strong>IFSC:</strong> ABCD0001234
                      </p>
                      <p>
                        <strong>Bank:</strong> Example Bank
                      </p>
                    </div>
                    <div>
                      <Label>Reference Number</Label>
                      <Input
                        placeholder="Enter Reference Number"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        required />
                    </div>
                    <div>
                      <Label>Upload Screenshot</Label>
                      <div className="border-2 border-dashed mt-2 rounded-lg p-4 text-center space-y-3">
                        <Input type="file" accept="image/*" onChange={handleFileChange} />
                        <Button
                          type="button"
                          onClick={handleFileUpload}
                          className="w-full"
                          disabled={!selectedFile || isUploading}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          {isUploading ? "Uploading..." : "Upload Screenshot"}
                        </Button>
                        <p className="text-xs text-gray-500">JPG or PNG (Max: 5MB)</p>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "cash" && (
                  <div className="space-y-4">
                    <p className="text-sm bg-gray-100 p-3 rounded">Please pay in person and collect a receipt.</p>
                    <div>
                      <Label>Receipt Number</Label>
                      <Input
                        placeholder="Enter Receipt Number"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        required />
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting ||
                    !selectedInvoice ||
                    ((paymentMethod === "upi" || paymentMethod === "bank") && !uploadedImageUrl)}
                >
                  {isSubmitting
                    ? "Processing..."
                    : (paymentMethod === "upi" || paymentMethod === "bank") && !uploadedImageUrl
                      ? "Upload Screenshot First"
                      : `Submit Payment - ₹${selectedInvoice?.amount}`}
                </Button>
              </div>
            )}

            {/* Payment Guidelines */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-xl font-semibold mb-4">Payment Guidelines</h3>
              <ul className="space-y-3 text-sm">
                {[
                  "Rent is due on the 5th of every month.",
                  "Keep payment receipts for reference.",
                  "Contact the PG owner for payment issues.",
                ].map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-5 h-5 bg-primary/20 text-primary rounded-full flex items-center justify-center mr-2">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </form>
        )}
      </div>
    </div></>
  )
}

export default function PayRentPage() {
  return (
    <UserLayout>
      <Suspense fallback={<PayRentPageSkeleton />}>
        <PayRentPageContent />
      </Suspense>
    </UserLayout>
  )
}
