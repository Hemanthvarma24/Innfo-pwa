"use client";

import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EnquiryPageSkeleton } from "@/components/skeleton-loader";
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UserLayout from "@/components/userlayout";

const inputClass =
  "w-full rounded-xl border-2 py-5.5 mb-0 border-gray-200 focus:border-[#3578D9] focus:ring-2 focus:ring-[#3578D9]/10";

function EnquiryPageContent() {
  const [formState, setFormState] = useState({
    name: "",
    mobile: "",
    email: "",
    idProofType: "",
    idProofNumber: "",
    idProofFile: "",
    photo: "",
    checkInDate: "",
    foodPlan: "",
    address: "",
    bloodGroup: "",
    emergencyContact: "",
    occupation: "",
    companyName: "",
    companyProof: "",
    vehicleDetails: "",
    dateOfJoining: "",
    expectedStayDuration: "",
    referenceName: "",
    referenceContact: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormState((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 pt-[80px] pb-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-xl font-bold mb">Registration</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Please fill out all details carefully.
        </p>

        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center"
          >
            <div className="w-16 h-16 bg-green-100 dark:bg-green-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-green-800 dark:text-green-300 mb-2">
              Submitted Successfully!
            </h3>
            <p className="text-green-700 dark:text-green-400 mb-4">
              We will contact you shortly.
            </p>
            <Button onClick={() => setIsSubmitted(false)} variant="outline">
              Submit Another
            </Button>
          </motion.div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
              <CardDescription>
                All fields are required unless stated otherwise.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  {/* Personal Details */}
                  <div className="space-y-1">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your full name"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="mobile">Mobile</Label>
                    <Input
                      id="mobile"
                      name="mobile"
                      value={formState.mobile}
                      onChange={handleChange}
                      required
                      placeholder="Enter mobile number"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formState.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="photo">Upload Photo</Label>
                    <Input
                      id="photo"
                      name="photo"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className={inputClass}
                    />
                  </div>

                  {/* ID Proof */}
                  <div className="space-y-1">
                    <Label>ID Proof Type</Label>
                    <Select
                      onValueChange={(value) =>
                        handleSelectChange("idProofType", value)
                      }
                      value={formState.idProofType}
                    >
                      <SelectTrigger className="w-full rounded-xl border-2 py-5.5 mb-0 border-gray-200 focus:border-[#3578D9] focus:ring-2 focus:ring-[#3578D9]/10">
                        <SelectValue placeholder="Select ID Proof Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Aadhar">Aadhar</SelectItem>
                        <SelectItem value="PAN">PAN</SelectItem>
                        <SelectItem value="Passport">Passport</SelectItem>
                        <SelectItem value="Driving License">
                          Driving License
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="idProofNumber">ID Proof Number</Label>
                    <Input
                      id="idProofNumber"
                      name="idProofNumber"
                      value={formState.idProofNumber}
                      onChange={handleChange}
                      placeholder="Enter ID number"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="idProofFile">Upload ID Proof</Label>
                    <Input
                      id="idProofFile"
                      name="idProofFile"
                      type="file"
                      onChange={handleFileChange}
                      className={inputClass}
                    />
                  </div>

                  {/* Stay Details */}
                  <div className="space-y-1">
                    <Label htmlFor="checkInDate">Check-in Date</Label>
                    <Input
                      id="checkInDate"
                      name="checkInDate"
                      type="date"
                      value={formState.checkInDate}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Food Plan</Label>
                    <Select
                      onValueChange={(value) =>
                        handleSelectChange("foodPlan", value)
                      }
                      value={formState.foodPlan}
                    >
                      <SelectTrigger className="w-full rounded-xl border-2 py-5.5 mb-0 border-gray-200 focus:border-[#3578D9] focus:ring-2 focus:ring-[#3578D9]/10">
                        <SelectValue placeholder="Select Food Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Veg">Veg</SelectItem>
                        <SelectItem value="Non-Veg">Non-Veg</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formState.address}
                      onChange={handleChange}
                      placeholder="Enter full address"
                      className={inputClass}
                    />
                  </div>

                  {/* Other Info */}
                  <div className="space-y-1">
                    <Label>Blood Group</Label>
                    <Select
                      onValueChange={(value) =>
                        handleSelectChange("bloodGroup", value)
                      }
                      value={formState.bloodGroup}
                    >
                      <SelectTrigger className="w-full rounded-xl border-2 py-5.5 mb-0 border-gray-200 focus:border-[#3578D9] focus:ring-2 focus:ring-[#3578D9]/10">
                        <SelectValue placeholder="Select Blood Group" />
                      </SelectTrigger>
                      <SelectContent>
                        {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(
                          (bg) => (
                            <SelectItem key={bg} value={bg}>
                              {bg}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <Input
                      id="emergencyContact"
                      name="emergencyContact"
                      value={formState.emergencyContact}
                      onChange={handleChange}
                      placeholder="Enter emergency contact number"
                      className={inputClass}
                    />
                  </div>

                  {/* Professional Info */}
                  <div className="space-y-1">
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input
                      id="occupation"
                      name="occupation"
                      value={formState.occupation}
                      onChange={handleChange}
                      placeholder="Enter your occupation"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      value={formState.companyName}
                      onChange={handleChange}
                      placeholder="Enter company name"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="companyProof">Upload Company Proof</Label>
                    <Input
                      id="companyProof"
                      name="companyProof"
                      type="file"
                      onChange={handleFileChange}
                      className={inputClass}
                    />
                  </div>

                  {/* Additional Info */}
                  <div className="space-y-1">
                    <Label htmlFor="vehicleDetails">Vehicle Details</Label>
                    <Input
                      id="vehicleDetails"
                      name="vehicleDetails"
                      value={formState.vehicleDetails}
                      onChange={handleChange}
                      placeholder="Enter vehicle number/model"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="dateOfJoining">Date of Joining</Label>
                    <Input
                      id="dateOfJoining"
                      name="dateOfJoining"
                      type="date"
                      value={formState.dateOfJoining}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="expectedStayDuration">
                      Expected Stay Duration
                    </Label>
                    <Input
                      id="expectedStayDuration"
                      name="expectedStayDuration"
                      value={formState.expectedStayDuration}
                      onChange={handleChange}
                      placeholder="e.g., 3 months"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="referenceName">Reference Name</Label>
                    <Input
                      id="referenceName"
                      name="referenceName"
                      value={formState.referenceName}
                      onChange={handleChange}
                      placeholder="Enter reference name"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="referenceContact">Reference Contact</Label>
                    <Input
                      id="referenceContact"
                      name="referenceContact"
                      value={formState.referenceContact}
                      onChange={handleChange}
                      placeholder="Enter reference contact number"
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      rows={3}
                      value={formState.notes}
                      onChange={handleChange}
                      placeholder="Any other info..."
                      className={inputClass}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full mt-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Registration"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function EnquiryPage() {
  return (
    <UserLayout>
    <Suspense fallback={<EnquiryPageSkeleton />}>
      <EnquiryPageContent />
    </Suspense>
    </UserLayout>
  );
}
