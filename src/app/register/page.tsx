"use client";
import type React from "react";
import { useState, useEffect, useRef, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, User, FileText, Loader2, Home, Briefcase, Building, Camera, Upload, Trash2 } from 'lucide-react';
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import UserLayout from "@/components/userlayout";
import { HomePageSkeleton } from "@/components/skeleton-loader";

interface GuestFormData {
  name: string;
  mobile: string;
  email: string;
  idProofType: string;
  idProofNumber: string;
  checkInDate: string;
  roomId: string;
  bedId: string;
  rentAmount: string;
  rentDueDate: string;
  foodPlan: string;
  address: string;
  bloodGroup: string;
  emergencyContact: string;
  occupation: string;
  companyName: string;
  vehicleDetails: string;
  dateOfJoining: string;
  expectedStayDuration: string;
  referenceName: string;
  referenceContact: string;
  notes: string;
  photo: string;
}

interface Room {
  room_id: number;
  room_no: string;
  room_type: string;
  rent_amount: string;
}

interface Bed {
  bed_id: number;
  bed_no: string;
  ava_status: string;
}

function AddGuestPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("user_id")
const buildingId= searchParams.get("building_id");
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [beds, setBeds] = useState<Bed[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [loadingBeds, setLoadingBeds] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadErrors, setUploadErrors] = useState<{ photo?: string }>({});
  const [isInitialized, setIsInitialized] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [formData, setFormData] = useState<GuestFormData>({
    name: "",
    mobile: "",
    email: "",
    idProofType: "",
    idProofNumber: "",
    checkInDate: "",
    roomId: "",
    bedId: "",
    rentAmount: "",
    rentDueDate: "",
    foodPlan: "",
    address: "",
    bloodGroup: "",
    emergencyContact: "",
    occupation: "",
    companyName: "",
    vehicleDetails: "",
    dateOfJoining: "",
    expectedStayDuration: "",
    referenceName: "",
    referenceContact: "",
    notes: "",
    photo: "",
  });

  // Initialize component and fetch rooms
  useEffect(() => {
    if (userId && !isInitialized) {
      fetchRooms();
      setIsInitialized(true);
    }
  }, [userId, isInitialized]);

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (reader.result) {
          const base64String = reader.result.toString().split(',')[1];
          resolve(base64String);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Get proper image URL
  const getImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.startsWith("/")) return `https://innfo.top/App${imagePath}`;
    return `https://innfo.top/App/${imagePath}`;
  };

  // Upload photo
  const uploadPhoto = async (file: File): Promise<string | null> => {
    try {
      setIsUploadingPhoto(true);
      setUploadErrors(prev => ({ ...prev, photo: undefined }));
      
      const base64String = await fileToBase64(file);
      const uploadData = {
        gofor: "image_upload",
        imgname: base64String,
        type: "guest",
      };

      const response = await fetch("https://innfo.top/App/api.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(uploadData),
      });

      const data = await response.json();
      
      if (data.success && data.url) {
        const uploadedUrl = data.url;
        setFormData((prev) => ({ ...prev, photo: uploadedUrl }));
        setPhotoPreview(getImageUrl(uploadedUrl));
        toast.success("Photo uploaded successfully!");
        return uploadedUrl;
      } else {
        throw new Error(data.message || "Failed to upload image");
      }
    } catch (error) {
      console.error("Photo upload error:", error);
      setUploadErrors((prev) => ({
        ...prev,
        photo: "Upload failed. Please try again.",
      }));
      toast.error("Failed to upload photo");
      return null;
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Validate file before upload
  const validateFile = (file: File): string | null => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

    if (!allowedTypes.includes(file.type)) {
      return "Please select a valid image file (JPEG, PNG, GIF)";
    }

    if (file.size > maxSize) {
      return "File size must be less than 5MB";
    }

    return null;
  };

  // Handle photo selection
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setUploadErrors(prev => ({ ...prev, photo: validationError }));
      toast.error(validationError);
      return;
    }

    await uploadPhoto(file);
  };

  // Remove photo
  const removePhoto = () => {
    setFormData((prev) => ({ ...prev, photo: "" }));
    setPhotoPreview(null);
    setUploadErrors(prev => ({ ...prev, photo: undefined }));
    if (photoInputRef.current) {
      photoInputRef.current.value = "";
    }
  };

  // Fetch rooms - FIXED VERSION
  const fetchRooms = async () => {
    if (!userId) return;
    
    try {
      setLoadingRooms(true);
      const response = await fetch(
        `https://innfo.top/App/api.php?gofor=roomlist&user_id=${userId}`
      );
      
      if (!response.ok) throw new Error("Failed to fetch rooms");
      
      const data = await response.json();
      console.log("Rooms data:", data);
      
      // The API returns an array directly, not wrapped in an object
      if (Array.isArray(data)) {
        setRooms(data);
        console.log("Rooms set successfully:", data);
      } else {
        console.error("Unexpected rooms response structure:", data);
        setRooms([]);
        toast.error("Invalid response format for rooms");
      }
    } catch (err) {
      console.error("Error fetching rooms:", err);
      toast.error("Failed to fetch rooms");
      setRooms([]);
    } finally {
      setLoadingRooms(false);
    }
  };

  // Fetch beds for selected room
  const fetchBeds = async (roomId: string) => {
    if (!roomId) return;
    
    try {
      setLoadingBeds(true);
      const response = await fetch(
        `https://innfo.top/App/api.php?gofor=bedlist&room_id=${roomId}`
      );
      
      if (!response.ok) throw new Error("Failed to fetch beds");
      
      const data = await response.json();
      console.log("Beds data:", data);
      
      if (Array.isArray(data)) {
        setBeds(data);
      } else if (data.success && Array.isArray(data.data)) {
        setBeds(data.data);
      } else if (data.beds && Array.isArray(data.beds)) {
        setBeds(data.beds);
      } else {
        console.error("Unexpected beds response structure:", data);
        setBeds([]);
      }
    } catch (err) {
      console.error("Error fetching beds:", err);
      toast.error("Failed to fetch beds");
      setBeds([]);
    } finally {
      setLoadingBeds(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: keyof GuestFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));

    // Auto-fill rent amount when room is selected
    if (id === "roomId") {
      // Clear bed selection when room changes
      setFormData((prev) => ({ ...prev, bedId: "" }));
      setBeds([]);
      
      if (value) {
        fetchBeds(value);
        // Auto-fill rent amount when room is selected
        const selectedRoom = rooms.find((room) => room.room_id.toString() === value);
        if (selectedRoom) {
          setFormData((prev) => ({
            ...prev,
            rentAmount: selectedRoom.rent_amount,
          }));
        }
      } else {
        setBeds([]);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      mobile: "",
      email: "",
      idProofType: "",
      idProofNumber: "",
      checkInDate: "",
      roomId: "",
      bedId: "",
      rentAmount: "",
      rentDueDate: "",
      foodPlan: "",
      address: "",
      bloodGroup: "",
      emergencyContact: "",
      occupation: "",
      companyName: "",
      vehicleDetails: "",
      dateOfJoining: "",
      expectedStayDuration: "",
      referenceName: "",
      referenceContact: "",
      notes: "",
      photo: "",
    });
    setPhotoPreview(null);
    setUploadErrors({});
    setBeds([]);
    setIsInitialized(false);
    if (photoInputRef.current) {
      photoInputRef.current.value = "";
    }
  };

  const validateForm = () => {
    const errors: string[] = [];
    
    if (!formData.name.trim()) errors.push("Guest name is required");
    if (!formData.mobile.trim()) errors.push("Mobile number is required");
    if (!formData.roomId.trim()) errors.push("Room selection is required");
    if (!formData.rentAmount.trim()) errors.push("Rent amount is required");
    if (!formData.checkInDate) errors.push("Check-in date is required");
    if (!formData.rentDueDate) errors.push("Rent due date is required");

    // Validate mobile number
    const mobileRegex = /^[6-9]\d{9}$/;
    if (formData.mobile && !mobileRegex.test(formData.mobile.replace(/\D/g, ""))) {
      errors.push("Please enter a valid 10-digit mobile number");
    }

    // Validate rent amount
    if (formData.rentAmount && (isNaN(Number(formData.rentAmount)) || Number(formData.rentAmount) <= 0)) {
      errors.push("Please enter a valid rent amount");
    }

    // Validate email if provided
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push("Please enter a valid email address");
    }

    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      return;
    }

    if (!userId) {
      toast.error("User ID is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        gofor: "addguest",
        name: formData.name.trim(),
        mobile: formData.mobile.trim(),
        email: formData.email.trim(),
        id_proof_type: formData.idProofType,
        id_proof_number: formData.idProofNumber.trim(),
        check_in_date: formData.checkInDate,
        room_id: formData.roomId,
        bed_id: formData.bedId || "",
        rent_amount: formData.rentAmount,
        rent_due_date: formData.rentDueDate,
        food_plan: formData.foodPlan,
        address: formData.address.trim(),
        blood_group: formData.bloodGroup,
        emergency_contact: formData.emergencyContact.trim(),
        occupation: formData.occupation.trim(),
        company_name: formData.companyName.trim(),
        vehicle_details: formData.vehicleDetails.trim(),
        date_of_joining: formData.dateOfJoining,
        expected_stay_duration: formData.expectedStayDuration.trim(),
        reference_name: formData.referenceName.trim(),
        reference_contact: formData.referenceContact.trim(),
        notes: formData.notes.trim(),
        photo: formData.photo,
        user_id: userId,
        stay_status: "Active"
      };

      console.log("Submitting payload:", payload);

      const response = await fetch("https://innfo.top/App/api.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      console.log("Response:", responseText);

      if (response.ok) {
        let responseData;
        try {
          responseData = JSON.parse(responseText);
        } catch (e) {
          if (
            responseText.toLowerCase().includes("success") ||
            responseText.toLowerCase().includes("added")
          ) {
            responseData = { success: true };
          } else {
            throw new Error("Invalid response format");
          }
        }

        if (responseData.success !== false && !responseText.toLowerCase().includes("error")) {
          const successMessage = "Guest added successfully!";
          toast.success(successMessage);
          resetForm();
          router.push(`/user_id=${userId}`);
        } else {
          throw new Error(responseData.message || "Failed to add guest");
        }
      } else {
        throw new Error(`Server error: ${response.status}`);
      }
    } catch (error) {
      console.error("Error adding guest:", error);
      toast.error("Failed to add guest. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Photo upload component
  const PhotoUploadComponent = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-center w-full">
        <div className="w-full max-w-xs">
          {photoPreview ? (
            <div className="relative">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-[#52018E] shadow-lg">
                <img
                  src={photoPreview || "/placeholder.svg"}
                  alt="Guest photo"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={removePhoto}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-colors"
                disabled={isUploadingPhoto || isSubmitting}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="w-32 h-32 mx-auto rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
              <Camera className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>
      </div>

      <div className="text-center space-y-2">
        <input
          ref={photoInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoSelect}
          className="hidden"
          disabled={isUploadingPhoto || isSubmitting}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => photoInputRef.current?.click()}
          disabled={isUploadingPhoto || isSubmitting}
          className="w-full max-w-xs mx-auto rounded-xl border-2 border-[#52018E] text-[#52018E] hover:bg-[#52018E] hover:text-white transition-colors"
        >
          {isUploadingPhoto ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              {photoPreview ? "Change Photo" : "Upload Photo"}
            </>
          )}
        </Button>
        
        {uploadErrors.photo && (
          <p className="text-sm text-red-600">{uploadErrors.photo}</p>
        )}
        
        <p className="text-xs text-gray-500">
          Supported formats: JPEG, PNG, GIF (Max: 5MB)
        </p>
      </div>
    </div>
  );

  return (
    <div>
        <div className="min-h-screen bg-gray-50 p-4 mt-[60px]">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg">
            {/* Header */}
            <div className="px-6 py-6 border-b border-gray-100">
              <h1 className="text-2xl font-bold text-gray-900">Add New Register</h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-6">
                
                {/* Photo Upload */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Camera className="w-5 h-5 text-[#52018E]" />
                    Add Photo
                  </h3>
                  <PhotoUploadComponent />
                </div>

                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#52018E]" />
                    Personal Information
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                        Guest Name *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter guest's full name"
                        className="w-full rounded-xl border-2 h-12 border-gray-200 focus:border-[#52018E] focus:ring-4 focus:ring-[#52018E]/10"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="mobile" className="text-sm font-semibold text-gray-700">
                          Mobile Number *
                        </Label>
                        <Input
                          id="mobile"
                          value={formData.mobile}
                          onChange={handleChange}
                          placeholder="Enter mobile number"
                          className="w-full rounded-xl border-2 h-12 border-gray-200 focus:border-[#52018E] focus:ring-4 focus:ring-[#52018E]/10"
                          required
                          disabled={isSubmitting}
                          maxLength={10}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter email address"
                          className="w-full rounded-xl border-2 h-12 border-gray-200 focus:border-[#52018E] focus:ring-4 focus:ring-[#52018E]/10"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm font-semibold text-gray-700">
                        Address
                      </Label>
                      <Textarea
                        id="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter complete address"
                        className="rounded-xl border-2 border-gray-200 focus:border-[#52018E] focus:ring-4 focus:ring-[#52018E]/10 min-h-[80px]"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bloodGroup" className="text-sm font-semibold text-gray-700">
                          Blood Group
                        </Label>
                        <Select
                          value={formData.bloodGroup}
                          onValueChange={(value) => handleSelectChange("bloodGroup", value)}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger className="w-full rounded-xl border-2 h-12 border-gray-200 focus:border-[#52018E]">
                            <SelectValue placeholder="Select blood group" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="A+">A+</SelectItem>
                            <SelectItem value="A-">A-</SelectItem>
                            <SelectItem value="B+">B+</SelectItem>
                            <SelectItem value="B-">B-</SelectItem>
                            <SelectItem value="AB+">AB+</SelectItem>
                            <SelectItem value="AB-">AB-</SelectItem>
                            <SelectItem value="O+">O+</SelectItem>
                            <SelectItem value="O-">O-</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergencyContact" className="text-sm font-semibold text-gray-700">
                          Emergency Contact
                        </Label>
                        <Input
                          id="emergencyContact"
                          value={formData.emergencyContact}
                          onChange={handleChange}
                          placeholder="Emergency contact number"
                          className="w-full rounded-xl border-2 h-12 border-gray-200 focus:border-[#52018E] focus:ring-4 focus:ring-[#52018E]/10"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="idProofType" className="text-sm font-semibold text-gray-700">
                          ID Proof Type
                        </Label>
                        <Select
                          value={formData.idProofType}
                          onValueChange={(value) => handleSelectChange("idProofType", value)}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger className="w-full rounded-xl border-2 h-12 border-gray-200 focus:border-[#52018E]">
                            <SelectValue placeholder="ID proof type" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="Aadhar">Aadhar Card</SelectItem>
                            <SelectItem value="PAN">PAN Card</SelectItem>
                            <SelectItem value="Driving License">Driving License</SelectItem>
                            <SelectItem value="Passport">Passport</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="idProofNumber" className="text-sm font-semibold text-gray-700">
                          ID Proof Number
                        </Label>
                        <Input
                          id="idProofNumber"
                          value={formData.idProofNumber}
                          onChange={handleChange}
                          placeholder="Enter ID proof number"
                          className="w-full rounded-xl border-2 h-12 border-gray-200 focus:border-[#52018E] focus:ring-4 focus:ring-[#52018E]/10"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-[#52018E]" />
                    Professional Information
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
      <Label
        htmlFor="occupation"
        className="text-sm font-semibold text-gray-700"
      >
        Occupation
      </Label>
      <Select
        value={formData.occupation}
        onValueChange={(value) =>
          setFormData((prev: any) => ({ ...prev, occupation: value }))
        }
        disabled={isSubmitting}
      >
        <SelectTrigger
          id="occupation"
          className="w-full h-12 rounded-xl border-2 border-gray-200 focus:border-[#52018E] focus:ring-4 focus:ring-[#52018E]/10"
        >
          <SelectValue placeholder="Select occupation" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="student">Student</SelectItem>
          <SelectItem value="employee">Employee</SelectItem>
        </SelectContent>
      </Select>
    </div>
                      <div className="space-y-2">
                        <Label htmlFor="companyName" className="text-sm font-semibold text-gray-700">
                          Company Name
                        </Label>
                        <Input
                          id="companyName"
                          value={formData.companyName}
                          onChange={handleChange}
                          placeholder="Enter company name"
                          className="w-full rounded-xl border-2 h-12 border-gray-200 focus:border-[#52018E] focus:ring-4 focus:ring-[#52018E]/10"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfJoining" className="text-sm font-semibold text-gray-700">
                        Date of Joining
                      </Label>
                      <Input
                        id="dateOfJoining"
                        type="date"
                        value={formData.dateOfJoining}
                        onChange={handleChange}
                        className="h-12 rounded-xl border-2 border-gray-200 focus:border-[#52018E] focus:ring-4 focus:ring-[#52018E]/10"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>

                {/* Room & Rent Details */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Home className="w-5 h-5 text-[#52018E]" />
                    Room & Rent Details
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="roomId" className="text-sm font-semibold text-gray-700">
                          Room No. *
                        </Label>
                        <Select
                          value={formData.roomId}
                          onValueChange={(value) => handleSelectChange("roomId", value)}
                          disabled={loadingRooms || isSubmitting}
                        >
                          <SelectTrigger className="w-full rounded-xl border-2 h-12 border-gray-200 focus:border-[#52018E]">
                            <SelectValue placeholder={loadingRooms ? "Loading rooms..." : "Select Room"} />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            {rooms.length > 0 ? (
                              rooms.map((room) => (
                                <SelectItem key={room.room_id} value={room.room_id.toString()}>
                                  {room.room_no} - {room.room_type} (₹{room.rent_amount})
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="no-rooms" disabled>
                                {loadingRooms ? "Loading..." : "No rooms available"}
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bedId" className="text-sm font-semibold text-gray-700">
                          Bed No.
                        </Label>
                        <Select
                          value={formData.bedId}
                          onValueChange={(value) => handleSelectChange("bedId", value)}
                          disabled={loadingBeds || !formData.roomId || isSubmitting}
                        >
                          <SelectTrigger className="w-full rounded-xl border-2 h-12 border-gray-200 focus:border-[#52018E]">
                            <SelectValue placeholder={loadingBeds ? "Loading beds..." : "Select Bed"} />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            {beds
                              .filter((bed) => bed.ava_status === "vacant" || bed.bed_id.toString() === formData.bedId)
                              .map((bed) => (
                                <SelectItem key={bed.bed_id} value={bed.bed_id.toString()}>
                                  Bed {bed.bed_no} ({bed.ava_status})
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="rentAmount" className="text-sm font-semibold text-gray-700">
                          Rent Amount (₹) *
                        </Label>
                        <Input
                          id="rentAmount"
                          type="number"
                          value={formData.rentAmount}
                          onChange={handleChange}
                          placeholder="7500"
                          className="w-full rounded-xl border-2 h-12 border-gray-200 focus:border-[#52018E] focus:ring-4 focus:ring-[#52018E]/10"
                          required
                          disabled={isSubmitting}
                          min="0"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rentDueDate" className="text-sm font-semibold text-gray-700">
                          Rent Due Date *
                        </Label>
                        <Input
                          id="rentDueDate"
                          type="date"
                          value={formData.rentDueDate}
                          onChange={handleChange}
                          className="h-12 rounded-xl border-2 border-gray-200 focus:border-[#52018E] focus:ring-4 focus:ring-[#52018E]/10"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="checkInDate" className="text-sm font-semibold text-gray-700">
                          Check-in Date *
                        </Label>
                        <Input
                          id="checkInDate"
                          type="date"
                          value={formData.checkInDate}
                          onChange={handleChange}
                          className="h-12 rounded-xl border-2 border-gray-200 focus:border-[#52018E] focus:ring-4 focus:ring-[#52018E]/10"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="foodPlan" className="text-sm font-semibold text-gray-700">
                          Food Plan
                        </Label>
                        <Select
                          value={formData.foodPlan}
                          onValueChange={(value) => handleSelectChange("foodPlan", value)}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger className="w-full rounded-xl border-2 h-12 border-gray-200 focus:border-[#52018E]">
                            <SelectValue placeholder="Select food plan" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl">
                            <SelectItem value="With Food">With Food</SelectItem>
                            <SelectItem value="Without Food">Without Food</SelectItem>
                            <SelectItem value="Veg">Veg</SelectItem>
                            <SelectItem value="Non-Veg">Non-Veg</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
  <Label
    htmlFor="expectedStayDuration"
    className="text-sm font-semibold text-gray-700"
  >
    Expected Stay Duration
  </Label>
  <Select
    value={formData.expectedStayDuration}
    onValueChange={(value) =>
      setFormData((prev: any) => ({ ...prev, expectedStayDuration: value }))
    }
    disabled={isSubmitting}
  >
    <SelectTrigger
      id="expectedStayDuration"
      className="w-full h-12 rounded-xl border-2 border-gray-200 focus:border-[#52018E] focus:ring-4 focus:ring-[#52018E]/10"
    >
      <SelectValue placeholder="Select expected stay duration" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="1">1 Month</SelectItem>
      <SelectItem value="3">3 Months</SelectItem>
      <SelectItem value="6">6 Months</SelectItem>
      <SelectItem value="12">12 Months</SelectItem>
    </SelectContent>
  </Select>
</div>

                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Building className="w-5 h-5 text-[#52018E]" />
                    Additional Information
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="vehicleDetails" className="text-sm font-semibold text-gray-700">
                        Vehicle Details
                      </Label>
                      <Input
                        id="vehicleDetails"
                        value={formData.vehicleDetails}
                        onChange={handleChange}
                        placeholder="Honda Activa - MH12AB1234"
                        className="w-full rounded-xl border-2 h-12 border-gray-200 focus:border-[#52018E] focus:ring-4 focus:ring-[#52018E]/10"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="referenceName" className="text-sm font-semibold text-gray-700">
                          Reference Name
                        </Label>
                        <Input
                          id="referenceName"
                          value={formData.referenceName}
                          onChange={handleChange}
                          placeholder="Reference person name"
                          className="w-full rounded-xl border-2 h-12 border-gray-200 focus:border-[#52018E] focus:ring-4 focus:ring-[#52018E]/10"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="referenceContact" className="text-sm font-semibold text-gray-700">
                          Reference Contact
                        </Label>
                        <Input
                          id="referenceContact"
                          value={formData.referenceContact}
                          onChange={handleChange}
                          placeholder="Reference contact number"
                          className="w-full rounded-xl border-2 h-12 border-gray-200 focus:border-[#52018E] focus:ring-4 focus:ring-[#52018E]/10"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#52018E]" />
                    Additional Notes
                  </h3>
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-sm font-semibold text-gray-700">
                      Notes
                    </Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Any specific notes or comments"
                      className="rounded-xl border-2 border-gray-200 focus:border-[#52018E] focus:ring-4 focus:ring-[#52018E]/10 min-h-[80px]"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 border-t border-gray-100 bg-white">
                <Button
                  type="submit"
                  className="w-full h-12 bg-[#52018E] text-white hover:opacity-90 rounded-2xl font-semibold disabled:opacity-50"
                  disabled={isSubmitting || isUploadingPhoto}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    "Register"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <UserLayout>
      <Suspense fallback={<HomePageSkeleton />}>
        <AddGuestPage />
      </Suspense>
    </UserLayout>
  );
}
