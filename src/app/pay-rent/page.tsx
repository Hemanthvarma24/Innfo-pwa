"use client";

import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Download } from "lucide-react";
import { motion } from "framer-motion";
import { PayRentPageSkeleton } from "@/components/skeleton-loader";
import Image from "next/image";
import qrcode from "@/assets/qr code.png";
import UserLayout from "@/components/userlayout";

function PayRentPageContent() {
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result?.toString().split(",")[1];

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
        });

        const data = await res.json();
        if (data.status === "success") {
          alert("Upload successful!");
        } else {
          alert("Upload failed.");
        }
      } catch (err) {
        alert("Upload error.");
      } finally {
        setIsUploading(false);
      }
    };

    reader.readAsDataURL(selectedFile);
  };

  return (
    <div className="container mx-auto px-4 pt-[80px] pb-12">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-bold">Pay Rent</h1>
          <p className="text-muted-foreground">
            Secure your monthly rent with easy payment options.
          </p>
        </div>

        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-xl p-6 text-center"
          >
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-green-200 dark:bg-green-700 flex items-center justify-center">
              ✅
            </div>
            <h3 className="text-xl font-semibold text-green-800 dark:text-green-300">
              Payment Recorded Successfully!
            </h3>
            <p className="text-green-700 dark:text-green-400 mt-2 text-sm">
              Your payment has been recorded. Confirmation will be sent to your
              registered contact.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setIsSubmitted(false)}
            >
              Close
            </Button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rent Info */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-[#4f008c]/40 text-white px-4 py-3">
                <h2 className="text-lg text-white font-semibold">
                  Rent Details
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 px-4 py-5">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Room Number</p>
                  <p className="font-semibold text-gray-800">101</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Bed Number</p>
                  <p className="font-semibold text-gray-800">B1</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Rent Amount</p>
                  <p className="font-semibold text-green-600">₹8000</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Due Date</p>
                  <p className="font-semibold text-red-600">5th Aug 2025</p>
                </div>
              </div>
            </div>

            {/* Payment Method */}
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
                    <p className="text-sm text-muted-foreground mb-2">
                      Scan QR to pay
                    </p>
                    <div className="bg-white mx-auto">
                      <Image
                        src={qrcode}
                        alt="QR Code"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <p className="text-sm mt-2 font-medium">
                      UPI ID: <span className="text-primary">innfo@upi</span>
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Transaction ID</Label>
                      <Input placeholder="Enter UPI Transaction ID" required />
                    </div>

                    <div>
                      <Label>Upload Screenshot</Label>
                      <div className="border-2 border-dashed rounded-lg p-4 text-center space-y-3">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                        <Button
                          type="button"
                          onClick={handleFileUpload}
                          className="w-full"
                          disabled={!selectedFile || isUploading}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          {isUploading ? "Uploading..." : "Upload Screenshot"}
                        </Button>
                        <p className="text-xs text-gray-500">
                          JPG or PNG (Max: 5MB)
                        </p>
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
                  <Input placeholder="Enter Reference Number" required />
                  <div>
                    <div className="mb-2">Upload Screenshot</div>
                    <div className="border-2 border-dashed mt-2 rounded-lg p-4 text-center space-y-3">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <Button
                        type="button"
                        onClick={handleFileUpload}
                        className="w-full"
                        disabled={!selectedFile || isUploading}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {isUploading ? "Uploading..." : "Upload Screenshot"}
                      </Button>
                      <p className="text-xs text-gray-500">
                        JPG or PNG (Max: 5MB)
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "cash" && (
                <div className="space-y-4">
                  <p className="text-sm bg-gray-100 p-3 rounded">
                    Please pay in person and collect a receipt.
                  </p>
                  <Input placeholder="Enter Receipt Number" required />
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Submit Payment"}
              </Button>
            </div>

            {/* Payment History */}
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Payment History</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-gray-100"
                >
                  <Download className="w-5 h-5" />
                </Button>
              </div>
              <div className="divide-y text-sm">
                {[
                  {
                    month: "July 2025",
                    status: "Paid",
                    date: "05 Jul 2025",
                    time: "10:32 AM",
                  },
                  {
                    month: "June 2025",
                    status: "Paid",
                    date: "05 Jun 2025",
                    time: "09:45 AM",
                  },
                  {
                    month: "May 2025",
                    status: "Paid",
                    date: "05 May 2025",
                    time: "11:10 AM",
                  },
                ].map((entry, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row md:items-center justify-between py-2"
                  >
                    <div className="font-medium">{entry.month}</div>
                    <div className="text-gray-500">
                      {entry.date} at {entry.time}
                    </div>
                     <div className="absolute right-0 top-0 text-green-600 font-medium">
    {entry.status}
  </div>
                  </div>
                ))}
              </div>
            </div>

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
                      <svg
                        className="h-3 w-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
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
    </div>
  );
}

export default function PayRentPage() {
  return (
    <UserLayout>
    <Suspense fallback={<PayRentPageSkeleton />}>
      <PayRentPageContent />
    </Suspense>
    </UserLayout>
  );
}
