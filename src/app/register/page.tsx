"use client";
import React, { useState, useEffect, useRef } from "react";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  User,
  FileText,
  Loader2,
  Briefcase,
  Building,
  Camera,
  Upload,
  Trash2,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import UserLayout from "@/components/userlayout";

interface Country {
  id: string;
  name: string;
}

interface State {
  id: string;
  name: string;
}

interface City {
  id: string;
  name: string;
}

function RegisterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadErrors, setUploadErrors] = useState<{ photo?: string }>({});

  // States for searchable selects
  const [countryOpen, setCountryOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);

  const photoInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    idProofType: "",
    idProofNumber: "",
    address: "",
    pincode: "",
    country: "",
    state: "",
    city: "",
    bloodGroup: "",
    emerContactName: "",
    emerContactNo: "",
    occupation: "",
    companyName: "",
    vehicleName: "",
    vehicleNo: "",
    dateOfJoining: "",
    referenceName: "",
    referenceContact: "",
    notes: "",
    photo: "",
  });

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (reader.result) {
          const base64String = reader.result.toString().split(",")[1];
          resolve(base64String);
        } else {
          reject(new Error("Failed to convert file to base64"));
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
      setUploadErrors((prev) => ({ ...prev, photo: undefined }));

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
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

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
      setUploadErrors((prev) => ({ ...prev, photo: validationError }));
      toast.error(validationError);
      return;
    }

    await uploadPhoto(file);
  };

  // Remove photo
  const removePhoto = () => {
    setFormData((prev) => ({ ...prev, photo: "" }));
    setPhotoPreview(null);
    setUploadErrors((prev) => ({ ...prev, photo: undefined }));
    if (photoInputRef.current) {
      photoInputRef.current.value = "";
    }
  };

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      setLoadingCountries(true);
      try {
        const response = await fetch(
          "https://innfo.top/App/api.php?gofor=countrieslist"
        );
        const data: Country[] = await response.json();
        setCountries(data);
      } catch (error) {
        console.error("Error fetching countries:", error);
        toast.error("Failed to load countries");
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  // Fetch states based on country
  const fetchStates = async (countryId: string) => {
    setLoadingStates(true);
    try {
      const response = await fetch(
        `https://innfo.top/App/api.php?gofor=stateslist&country_id=${countryId}`
      );
      const data: State[] = await response.json();
      setStates(data);
    } catch (error) {
      console.error("Error fetching states:", error);
      toast.error("Failed to load states");
    } finally {
      setLoadingStates(false);
    }
  };

  // Fetch cities based on state
  const fetchCities = async (stateId: string) => {
    setLoadingCities(true);
    try {
      const response = await fetch(
        `https://innfo.top/App/api.php?gofor=citieslist&state_id=${stateId}`
      );
      const data: City[] = await response.json();
      setCities(data);
    } catch (error) {
      console.error("Error fetching cities:", error);
      toast.error("Failed to load cities");
    } finally {
      setLoadingCities(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    // Filter to digits only for mobile
    if (id === "mobile") {
      setFormData((prev) => ({ ...prev, [id]: value.replace(/\D/g, "") }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (id === "country") {
      setFormData((prev) => ({ ...prev, state: "", city: "" }));
      setStates([]);
      setCities([]);
      if (value) {
        const selectedCountry = countries.find((c) => c.name === value);
        if (selectedCountry) {
          fetchStates(selectedCountry.id);
        }
      }
    } else if (id === "state") {
      setFormData((prev) => ({ ...prev, city: "" }));
      setCities([]);
      if (value) {
        const selectedState = states.find((s) => s.name === value);
        if (selectedState) {
          fetchCities(selectedState.id);
        }
      }
    }
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.name.trim()) errors.push("Guest name is required");
    if (!formData.mobile.trim()) errors.push("Mobile number is required");

    // Validate mobile number
    const mobileRegex = /^[6-9]\d{9}$/;
    if (formData.mobile && !mobileRegex.test(formData.mobile)) {
      errors.push(
        "Please enter a valid 10-digit mobile number starting with 6-9"
      );
    }

    // Validate email if provided
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push("Please enter a valid email address");
    }

    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
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
        address: formData.address.trim(),
        pincode: formData.pincode.trim(),
        country: formData.country,
        state: formData.state,
        city: formData.city,
        blood_group: formData.bloodGroup,
        emer_contactname: formData.emerContactName.trim(),
        emer_contactno: formData.emerContactNo.trim(),
        occupation: formData.occupation.trim(),
        company_name: formData.companyName.trim(),
        vehicle_name: formData.vehicleName.trim(),
        vehicle_no: formData.vehicleNo.trim(),
        date_of_joining: formData.dateOfJoining,
        reference_name: formData.referenceName.trim(),
        reference_contact: formData.referenceContact.trim(),
        notes: formData.notes.trim(),
        photo: formData.photo,
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

        if (
          responseData.success !== false &&
          !responseText.toLowerCase().includes("error")
        ) {
          const successMessage = "Guest added successfully!";
          toast.success(successMessage);
          // Reset form or navigate as needed
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
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-[#3578D9] shadow-lg">
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
          className="w-full max-w-xs mx-auto rounded-xl border-2 border-[#3578D9] text-[#3578D9] hover:bg-[#3578D9] hover:text-white transition-colors"
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
    <UserLayout>
      <div className="min-h-screen bg-gray-50 p-4 mt-[60px]">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm">
          {/* Header */}
          <div className="px-6 py-6 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-gray-900">
              Register New Guest
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6">
              {/* Photo Upload */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-[#3578D9]" />
                  Add Photo
                </h3>
                <PhotoUploadComponent />
              </div>

              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#3578D9]" />
                  Personal Information
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Guest Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter guest's full name"
                      className="w-full h-11 rounded-xl border-2 py-3 border-gray-200 focus:border-[#3578D9] focus:ring-4 focus:ring-[#3578D9]/10"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="mobile"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Mobile Number *
                    </Label>
                    <Input
                      id="mobile"
                      type="tel"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="Enter mobile number"
                      className="w-full h-11 rounded-xl border-2 py-3 border-gray-200 focus:border-[#3578D9] focus:ring-4 focus:ring-[#3578D9]/10"
                      required
                      disabled={isSubmitting}
                      maxLength={10}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                      className="w-full h-11 rounded-xl border-2 py-3 border-gray-200 focus:border-[#3578D9] focus:ring-4 focus:ring-[#3578D9]/10"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="address"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Address
                    </Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter complete address"
                      className="w-full h-11 rounded-xl border-2 py-3 border-gray-200 focus:border-[#3578D9] focus:ring-4 focus:ring-[#3578D9]/10"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="pincode"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Pincode
                    </Label>
                    <Input
                      id="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="Enter pincode"
                      className="w-full h-11 rounded-xl border-2 py-3 border-gray-200 focus:border-[#3578D9] focus:ring-4 focus:ring-[#3578D9]/10"
                      disabled={isSubmitting}
                    />
                  </div>
                  {/* Searchable Country */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="country"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Country
                    </Label>
                    <Popover open={countryOpen} onOpenChange={setCountryOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={countryOpen}
                          className="w-full h-11 rounded-xl border-2 py-3 border-gray-200 focus:border-[#3578D9] focus:ring-4 focus:ring-[#3578D9]/10 justify-between text-left"
                          disabled={loadingCountries || isSubmitting}
                        >
                          {formData.country
                            ? formData.country
                            : loadingCountries
                            ? "Loading countries..."
                            : "Select Country"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search country..." />
                          <CommandEmpty>No country found.</CommandEmpty>
                          <CommandGroup className="max-h-60 overflow-auto">
                            {countries.map((country) => (
                              <CommandItem
                                key={country.id}
                                value={country.name}
                                onSelect={() => {
                                  handleSelectChange("country", country.name);
                                  setCountryOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    formData.country === country.name
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {country.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  {/* Searchable State */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="state"
                      className="text-sm font-semibold text-gray-700"
                    >
                      State
                    </Label>
                    <Popover open={stateOpen} onOpenChange={setStateOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={stateOpen}
                          className="w-full h-11 rounded-xl border-2 py-3 border-gray-200 focus:border-[#3578D9] focus:ring-4 focus:ring-[#3578D9]/10 justify-between text-left"
                          disabled={
                            loadingStates || !formData.country || isSubmitting
                          }
                        >
                          {formData.state
                            ? formData.state
                            : loadingStates
                            ? "Loading states..."
                            : "Select State"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search state..." />
                          <CommandEmpty>No state found.</CommandEmpty>
                          <CommandGroup className="max-h-60 overflow-auto">
                            {states.map((state) => (
                              <CommandItem
                                key={state.id}
                                value={state.name}
                                onSelect={() => {
                                  handleSelectChange("state", state.name);
                                  setStateOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    formData.state === state.name
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {state.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  {/* Searchable City */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="city"
                      className="text-sm font-semibold text-gray-700"
                    >
                      City
                    </Label>
                    <Popover open={cityOpen} onOpenChange={setCityOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={cityOpen}
                          className="w-full h-11 rounded-xl border-2 py-3 border-gray-200 focus:border-[#3578D9] focus:ring-4 focus:ring-[#3578D9]/10 justify-between text-left"
                          disabled={
                            loadingCities || !formData.state || isSubmitting
                          }
                        >
                          {formData.city
                            ? formData.city
                            : loadingCities
                            ? "Loading cities..."
                            : "Select City"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search city..." />
                          <CommandEmpty>No city found.</CommandEmpty>
                          <CommandGroup className="max-h-60 overflow-auto">
                            {cities.map((city) => (
                              <CommandItem
                                key={city.id}
                                value={city.name}
                                onSelect={() => {
                                  handleSelectChange("city", city.name);
                                  setCityOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    formData.city === city.name
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {city.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="bloodGroup"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Blood Group
                    </Label>
                    <Select
                      value={formData.bloodGroup}
                      onValueChange={(value) =>
                        handleSelectChange("bloodGroup", value)
                      }
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="w-full  rounded-xl border-2 py-5 border-gray-200 focus:border-[#3578D9] focus:ring-4 focus:ring-[#3578D9]/10">
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
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="emerContactName"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Emergency Contact Name
                      </Label>
                      <Input
                        id="emerContactName"
                        value={formData.emerContactName}
                        onChange={handleChange}
                        placeholder="Emergency contact name"
                        className="w-full h-11 rounded-xl border-2 py-3 border-gray-200 focus:border-[#3578D9] focus:ring-4 focus:ring-[#3578D9]/10"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="emerContactNo"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Emergency Contact Number
                      </Label>
                      <Input
                        id="emerContactNo"
                        value={formData.emerContactNo}
                        onChange={handleChange}
                        placeholder="Emergency contact number"
                        className="w-full h-11 rounded-xl border-2 py-3 border-gray-200 focus:border-[#3578D9] focus:ring-4 focus:ring-[#3578D9]/10"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="idProofType"
                        className="text-sm font-semibold text-gray-700"
                      >
                        ID Proof Type
                      </Label>
                      <Select
                        value={formData.idProofType}
                        onValueChange={(value) =>
                          handleSelectChange("idProofType", value)
                        }
                        disabled={isSubmitting}
                      >
                        <SelectTrigger className="w-full  rounded-xl border-2 py-5 border-gray-200 focus:border-[#3578D9] focus:ring-4 focus:ring-[#3578D9]/10">
                          <SelectValue placeholder="ID proof type" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="Aadhar">Aadhar Card</SelectItem>
                          <SelectItem value="PAN">PAN Card</SelectItem>
                          <SelectItem value="Driving License">
                            Driving License
                          </SelectItem>
                          <SelectItem value="Passport">Passport</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="idProofNumber"
                        className="text-sm font-semibold text-gray-700"
                      >
                        ID Proof Number
                      </Label>
                      <Input
                        id="idProofNumber"
                        value={formData.idProofNumber}
                        onChange={handleChange}
                        placeholder="Enter ID proof number"
                        className="w-full h-11 rounded-xl border-2 py-3 border-gray-200 focus:border-[#3578D9] focus:ring-4 focus:ring-[#3578D9]/10"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-[#3578D9]" />
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
                          handleSelectChange("occupation", value)
                        }
                        disabled={isSubmitting}
                      >
                        <SelectTrigger className="w-full rounded-xl border-2 py-5 border-gray-200 focus:border-[#3578D9] focus:ring-4 focus:ring-[#3578D9]/10">
                          <SelectValue placeholder="Select occupation" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="employee">Employee</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="companyName"
                        className="text-sm font-semibold text-gray-700"
                      >
                        Company Name
                      </Label>
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="Enter company name"
                        className="w-full h-11 rounded-xl border-2 py-3 border-gray-200 focus:border-[#3578D9] focus:ring-4 focus:ring-[#3578D9]/10"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="dateOfJoining"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Date of Joining
                    </Label>
                    <Input
                      id="dateOfJoining"
                      type="date"
                      value={formData.dateOfJoining}
                      onChange={handleChange}
                      className="w-full h-11 rounded-xl border-2 py-3 border-gray-200 focus:border-[#3578D9] focus:ring-4 focus:ring-[#3578D9]/10"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Building className="w-5 h-5 text-[#3578D9]" />
                  Additional Information
                </h3>
                <div className="space-y-4">
                  {/* Vehicle Details - Single Column */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="vehicleName"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Vehicle Name (optional)
                    </Label>
                    <Input
                      id="vehicleName"
                      value={formData.vehicleName}
                      onChange={handleChange}
                      placeholder="Vehicle name"
                      className="w-full h-11 rounded-xl border-2 py-3 border-gray-200 focus:border-[#3578D9] focus:ring-4 focus:ring-[#3578D9]/10"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="vehicleNo"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Vehicle Number (optional)
                    </Label>
                    <Input
                      id="vehicleNo"
                      value={formData.vehicleNo}
                      onChange={handleChange}
                      placeholder="Vehicle number"
                      className="w-full h-11 rounded-xl border-2 py-3 border-gray-200 focus:border-[#3578D9] focus:ring-4 focus:ring-[#3578D9]/10"
                      disabled={isSubmitting}
                    />
                  </div>
                  {/* Reference Details - Single Column */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="referenceName"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Reference Name
                    </Label>
                    <Input
                      id="referenceName"
                      value={formData.referenceName}
                      onChange={handleChange}
                      placeholder="Reference name"
                      className="w-full h-11 rounded-xl border-2 py-3 border-gray-200 focus:border-[#3578D9] focus:ring-4 focus:ring-[#3578D9]/10"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="referenceContact"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Reference Contact
                    </Label>
                    <Input
                      id="referenceContact"
                      value={formData.referenceContact}
                      onChange={handleChange}
                      placeholder="Reference contact number"
                      className="w-full h-11 rounded-xl border-2 py-3 border-gray-200 focus:border-[#3578D9] focus:ring-4 focus:ring-[#3578D9]/10"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>
              {/* Additional Notes */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#3578D9]" />
                  Additional Notes
                </h3>
                <div className="space-y-2">
                  <Label
                    htmlFor="notes"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any notes"
                    className="w-full h-11 rounded-xl border-2 py-3 border-gray-200 focus:border-[#3578D9] focus:ring-4 focus:ring-[#3578D9]/10"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="p-6 border-t border-gray-100 bg-white">
              <Button
                type="submit"
                className="w-full h-11 bg-primary text-white hover:opacity-90 rounded-2xl font-semibold disabled:opacity-50"
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
    </UserLayout>
  );
}

export default RegisterForm;
