import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContainer,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@/components/AnimatedDialog";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";
import { MedicalRecord } from "@/types/MedicalRecord";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar as CalendarIcon,
  Loader2,
  Plus,
  X,
  AlertCircle,
} from "lucide-react";
import { TagInput } from "@/components/ui/tag-input";
import { convertFileToBase64 } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { useMedicalRecordStore } from "@/stores/medicalRecordStore";

interface AddMedicalRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface FormData {
  // Basic Information
  patientName: string;
  patientId: string;
  status: string;
  role: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  maritalStatus: string;

  // Address
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;

  // Medical Information
  bloodType: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  conditions: string[];
  allergies: string[];
  medications: string[];

  // Family History
  familyHistory: Array<{
    condition: string;
    relation: string;
  }>;

  // Past Surgeries
  pastSurgeries: Array<{
    procedure: string;
    date: string;
    hospital: string;
  }>;

  // Emergency Contact
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    email: string;
  };
}

const initialFormData: FormData = {
  patientName: "",
  patientId: "",
  status: "active",
  role: "patient",
  email: "",
  dateOfBirth: "",
  gender: "",
  nationality: "",
  maritalStatus: "",
  street: "",
  city: "",
  state: "",
  zipCode: "",
  country: "",
  bloodType: "",
  diagnosis: "",
  treatment: "",
  notes: "",
  conditions: [],
  allergies: [],
  medications: [],
  familyHistory: [],
  pastSurgeries: [],
  emergencyContact: {
    name: "",
    relationship: "",
    phone: "",
    email: "",
  },
};

export function AddMedicalRecordDialog({
  open,
  onOpenChange,
  children,
}: AddMedicalRecordDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTab, setCurrentTab] = useState("basic");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      // Generate patient ID when dialog opens
      setFormData((prev) => ({
        ...prev,
        patientId: generatePatientId(),
      }));
    }
  }, [open]);

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Avatar file size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarFile(file);
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generatePatientId = () => {
    const prefix = "PT";
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `${prefix}${timestamp}${random}`;
  };

  const validateForm = (data: FormData): Record<string, string> => {
    const errors: Record<string, string> = {};

    // Required fields
    if (!data.patientName?.trim()) {
      errors.patientName = "Patient name is required";
    }

    if (!data.bloodType || data.bloodType.toLowerCase() === "unknown") {
      errors.bloodType = "Blood type is required";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (data.email && !emailRegex.test(data.email)) {
      errors.email = "Invalid email format";
    }

    // Date validation
    if (data.dateOfBirth) {
      const dob = new Date(data.dateOfBirth);
      const today = new Date();
      if (dob > today) {
        errors.dateOfBirth = "Date of birth cannot be in the future";
      }
    }

    // Emergency contact validation
    if (data.emergencyContact.phone && !/^\+?[\d\s-]{10,}$/.test(data.emergencyContact.phone)) {
      errors.emergencyContactPhone = "Invalid phone number format";
    }

    if (data.emergencyContact.name && !data.emergencyContact.name.trim()) {
      errors.emergencyContactName = "Emergency contact name is required";
    }

    if (data.emergencyContact.relationship && !data.emergencyContact.relationship.trim()) {
      errors.emergencyContactRelationship = "Emergency contact relationship is required";
    }

    return errors;
  };

  const { addRecord } = useMedicalRecordStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Submit button clicked');

    // Validate form
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await addRecord({
        ...formData,
        patientId: formData.patientId || generatePatientId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Reset form and close dialog
      setFormData(initialFormData);
      setErrors({});
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding medical record:', error);
      setErrors({
        submit: 'Failed to add medical record. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isTabComplete = (tab: string) => {
    switch (tab) {
      case "basic":
        return Boolean(formData.patientName);
      case "personal":
        return Boolean(formData.email && formData.dateOfBirth);
      case "medical":
        return Boolean(formData.bloodType);
      case "history":
        return Boolean(formData.notes);
      case "emergency":
        return Boolean(formData.emergencyContact.name && formData.emergencyContact.relationship && formData.emergencyContact.phone);
      default:
        return false;
    }
  };

  const handleAddFamilyHistory = () => {
    setFormData((prev) => ({
      ...prev,
      familyHistory: [
        ...prev.familyHistory,
        { condition: "", relation: "" }
      ],
    }));
  };

  const handleRemoveFamilyHistory = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      familyHistory: prev.familyHistory.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateFamilyHistory = (
    index: number,
    field: "condition" | "relation",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      familyHistory: prev.familyHistory.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleAddSurgery = () => {
    setFormData((prev) => ({
      ...prev,
      pastSurgeries: [
        ...prev.pastSurgeries,
        { procedure: "", date: "", hospital: "" }
      ],
    }));
  };

  const handleRemoveSurgery = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      pastSurgeries: prev.pastSurgeries.filter((_, i) => i !== index),
    }));
  };

  const handleUpdateSurgery = (
    index: number,
    field: "procedure" | "date" | "hospital",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      pastSurgeries: prev.pastSurgeries.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContainer>
        <DialogContent className="w-[90vw] max-w-4xl rounded-xl bg-white shadow-lg">
          <DialogTitle className="text-xl font-semibold p-6 border-b">
            Add New Medical Record
          </DialogTitle>
          <ScrollArea className="h-[70vh]">
            <div className="p-6">
              <div className="text-xl font-semibold p-6 border-b">
                Add New Medical Record
              </div>

              <Tabs
                value={currentTab}
                onValueChange={setCurrentTab}
                className="space-y-6"
              >
                <TabsList className="grid w-full grid-cols-5">
                  {[
                    { value: "basic", label: "Basic Info" },
                    { value: "personal", label: "Personal Info" },
                    { value: "medical", label: "Medical Info" },
                    { value: "history", label: "Medical History" },
                    { value: "emergency", label: "Emergency Contact" },
                  ].map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="relative flex items-center gap-2"
                    >
                      {tab.label}
                      {isTabComplete(tab.value) && (
                        <div className="flex items-center justify-center w-2 h-2">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                        </div>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="basic" className="space-y-6">
                  {/* Avatar Upload */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={avatarPreview || ""} />
                        <AvatarFallback>
                          {formData.patientName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <label
                        htmlFor="avatar-upload"
                        className="absolute -bottom-2 -right-2 p-1 bg-white rounded-full border cursor-pointer hover:bg-gray-50"
                      >
                        <Plus className="h-4 w-4" />
                      </label>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium">Patient Photo</h3>
                      <p className="text-sm text-gray-500">
                        Upload a photo of the patient. Max file size: 5MB
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="patientName"
                        className="flex items-center gap-2"
                      >
                        Patient Name <span className="text-red-500">*</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertCircle className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Enter the patient's full legal name</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <Input
                        id="patientName"
                        required
                        value={formData.patientName}
                        onChange={(e) => {
                          setFormData((prev) => ({
                            ...prev,
                            patientName: e.target.value,
                          }));
                          if (errors.patientName) {
                            setErrors((prev) => ({ ...prev, patientName: "" }));
                          }
                        }}
                        placeholder="Enter patient name"
                        className={errors.patientName ? "border-red-500" : ""}
                      />
                      {errors.patientName && (
                        <p className="text-sm text-red-500">
                          {errors.patientName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        Patient ID <span className="text-red-500">*</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <AlertCircle className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Automatically generated unique identifier</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <Input
                        value={formData.patientId}
                        readOnly
                        className="bg-gray-50"
                        placeholder="Auto-generated ID"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Record Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, status: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-green-500" />
                              Active
                            </div>
                          </SelectItem>
                          <SelectItem value="pending">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-yellow-500" />
                              Pending
                            </div>
                          </SelectItem>
                          <SelectItem value="archived">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-gray-500" />
                              Archived
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="personal" className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        placeholder="patient@example.com"
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500">{errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Date of Birth</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {/* Day Dropdown */}
                        <Select
                          value={formData.dateOfBirth ? new Date(formData.dateOfBirth).getDate().toString() : ''}
                          onValueChange={(value) => {
                            const currentDate = formData.dateOfBirth ? new Date(formData.dateOfBirth) : new Date();
                            currentDate.setDate(parseInt(value));
                            setFormData((prev) => ({
                              ...prev,
                              dateOfBirth: currentDate.toISOString().split('T')[0],
                            }));
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Day" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                              <SelectItem key={day} value={day.toString()}>
                                {day}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Month Dropdown */}
                        <Select
                          value={formData.dateOfBirth ? (new Date(formData.dateOfBirth).getMonth() + 1).toString() : ''}
                          onValueChange={(value) => {
                            const currentDate = formData.dateOfBirth ? new Date(formData.dateOfBirth) : new Date();
                            currentDate.setMonth(parseInt(value) - 1);
                            setFormData((prev) => ({
                              ...prev,
                              dateOfBirth: currentDate.toISOString().split('T')[0],
                            }));
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              "January", "February", "March", "April", "May", "June",
                              "July", "August", "September", "October", "November", "December"
                            ].map((month, index) => (
                              <SelectItem key={month} value={(index + 1).toString()}>
                                {month}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Year Dropdown */}
                        <Select
                          value={formData.dateOfBirth ? new Date(formData.dateOfBirth).getFullYear().toString() : ''}
                          onValueChange={(value) => {
                            const currentDate = formData.dateOfBirth ? new Date(formData.dateOfBirth) : new Date();
                            currentDate.setFullYear(parseInt(value));
                            setFormData((prev) => ({
                              ...prev,
                              dateOfBirth: currentDate.toISOString().split('T')[0],
                            }));
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from(
                              { length: 100 },
                              (_, i) => new Date().getFullYear() - i
                            ).map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {errors.dateOfBirth && (
                        <p className="text-sm text-red-500">{errors.dateOfBirth}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Gender</Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, gender: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          {["Male", "Female", "Other"].map((gender) => (
                            <SelectItem
                              key={gender}
                              value={gender.toLowerCase()}
                            >
                              {gender}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Nationality</Label>
                      <Input
                        value={formData.nationality}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            nationality: e.target.value,
                          }))
                        }
                        placeholder="Enter nationality"
                      />
                    </div>

                    <div className="col-span-2 space-y-2">
                      <Label>Address</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          value={formData.street}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              street: e.target.value,
                            }))
                          }
                          placeholder="Street address"
                        />
                        <Input
                          value={formData.city}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              city: e.target.value,
                            }))
                          }
                          placeholder="City"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="medical" className="space-y-6">
                  {/* Physical Measurements Section */}
                  <div className="rounded-lg border p-4 bg-gray-50">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">
                      Physical Information
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          Height (cm) <span className="text-red-500">*</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <AlertCircle className="h-4 w-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Enter height in centimeters</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          max="300"
                          value={formData.height}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (Number(value) <= 300) {
                              setFormData((prev) => ({
                                ...prev,
                                height: value,
                              }));
                            }
                          }}
                          placeholder="e.g., 175"
                          className={errors.height ? "border-red-500" : ""}
                        />
                        {errors.height && (
                          <p className="text-sm text-red-500">{errors.height}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          Weight (kg) <span className="text-red-500">*</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <AlertCircle className="h-4 w-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Enter weight in kilograms</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Input
                          type="number"
                          min="0"
                          max="500"
                          value={formData.weight}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (Number(value) <= 500) {
                              setFormData((prev) => ({
                                ...prev,
                                weight: value,
                              }));
                            }
                          }}
                          placeholder="e.g., 70"
                          className={errors.weight ? "border-red-500" : ""}
                        />
                        {errors.weight && (
                          <p className="text-sm text-red-500">{errors.weight}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          Blood Type <span className="text-red-500">*</span>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <AlertCircle className="h-4 w-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Select your blood type</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Select
                          value={formData.bloodType}
                          onValueChange={(value) =>
                            setFormData((prev) => ({ ...prev, bloodType: value }))
                          }
                        >
                          <SelectTrigger className={errors.bloodType ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select blood type" />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              "A+",
                              "A-",
                              "B+",
                              "B-",
                              "O+",
                              "O-",
                              "AB+",
                              "AB-",
                              "Unknown",
                            ].map((type) => (
                              <SelectItem key={type} value={type.toLowerCase()}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.bloodType && (
                          <p className="text-sm text-red-500">{errors.bloodType}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Medical Conditions Section */}
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-900">
                        Medical Conditions
                      </h3>
                      <Badge variant="outline" className="text-gray-500">
                        {formData.conditions.length} conditions
                      </Badge>
                    </div>
                    <TagInput
                      value={formData.conditions}
                      onChange={(conditions) =>
                        setFormData((prev) => ({ ...prev, conditions }))
                      }
                      placeholder="Type condition and press Enter"
                      className="w-full"
                    />
                  </div>

                  {/* Allergies Section */}
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-900">
                        Allergies
                      </h3>
                      <Badge variant="outline" className="text-gray-500">
                        {formData.allergies.length} allergies
                      </Badge>
                    </div>
                    <TagInput
                      value={formData.allergies}
                      onChange={(allergies) =>
                        setFormData((prev) => ({ ...prev, allergies }))
                      }
                      placeholder="Type allergy and press Enter"
                      className="w-full"
                    />
                  </div>

                  {/* Medications Section */}
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-900">
                        Medications
                      </h3>
                      <Badge variant="outline" className="text-gray-500">
                        {formData.medications.length} medications
                      </Badge>
                    </div>
                    <TagInput
                      value={formData.medications}
                      onChange={(medications) =>
                        setFormData((prev) => ({ ...prev, medications }))
                      }
                      placeholder="Type medication name and press Enter"
                      className="w-full"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="history" className="space-y-6">
                  {/* Lifestyle Section */}
                  <div className="rounded-lg border p-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">
                      Lifestyle Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Smoking Status</Label>
                        <Select
                          value={formData.smokingStatus}
                          onValueChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              smokingStatus: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="never">Never Smoked</SelectItem>
                            <SelectItem value="former">
                              Former Smoker
                            </SelectItem>
                            <SelectItem value="current">
                              Current Smoker
                            </SelectItem>
                            <SelectItem value="occasional">
                              Occasional Smoker
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Exercise Frequency</Label>
                        <Select
                          value={formData.exerciseFrequency}
                          onValueChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              exerciseFrequency: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sedentary">Sedentary</SelectItem>
                            <SelectItem value="light">
                              Light (1-2 days/week)
                            </SelectItem>
                            <SelectItem value="moderate">
                              Moderate (3-4 days/week)
                            </SelectItem>
                            <SelectItem value="active">
                              Active (5+ days/week)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Family History Section */}
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-900">
                        Family History
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAddFamilyHistory}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Entry
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {formData.familyHistory.map((item, index) => (
                        <div key={index} className="flex gap-3 items-start">
                          <div className="flex-1 space-y-2">
                            <Input
                              value={item.condition}
                              onChange={(e) =>
                                handleUpdateFamilyHistory(
                                  index,
                                  "condition",
                                  e.target.value
                                )
                              }
                              placeholder="Medical condition"
                            />
                          </div>
                          <div className="w-[200px]">
                            <Select
                              value={item.relation}
                              onValueChange={(value) =>
                                handleUpdateFamilyHistory(
                                  index,
                                  "relation",
                                  value
                                )
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select relation" />
                              </SelectTrigger>
                              <SelectContent>
                                {[
                                  "Father",
                                  "Mother",
                                  "Brother",
                                  "Sister",
                                  "Grandfather",
                                  "Grandmother",
                                  "Uncle",
                                  "Aunt",
                                ].map((relation) => (
                                  <SelectItem
                                    key={relation}
                                    value={relation.toLowerCase()}
                                  >
                                    {relation}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <Button
                            variant="outline"
                            size="icon"
                            className="shrink-0"
                            onClick={() => handleRemoveFamilyHistory(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Past Surgeries Section */}
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-900">
                        Past Surgeries
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAddSurgery}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Surgery
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {formData.pastSurgeries.map((surgery, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-3 gap-3 items-start"
                        >
                          <Input
                            value={surgery.procedure}
                            onChange={(e) =>
                              handleUpdateSurgery(
                                index,
                                "procedure",
                                e.target.value
                              )
                            }
                            placeholder="Procedure name"
                          />
                          <Input
                            type="date"
                            value={surgery.date}
                            onChange={(e) =>
                              handleUpdateSurgery(index, "date", e.target.value)
                            }
                          />
                          <div className="flex gap-2">
                            <Input
                              value={surgery.hospital}
                              onChange={(e) =>
                                handleUpdateSurgery(
                                  index,
                                  "hospital",
                                  e.target.value
                                )
                              }
                              placeholder="Hospital name"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="shrink-0"
                              onClick={() => handleRemoveSurgery(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Additional Notes Section */}
                  <div className="rounded-lg border p-4">
                    <Label className="mb-2">Additional Notes</Label>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      placeholder="Any additional notes or observations about the patient's medical history..."
                      className="min-h-[100px]"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="emergency" className="space-y-6">
                  <div className="space-y-6 rounded-lg border p-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Emergency Contact Information</h3>
                      <p className="text-sm text-gray-500 mb-6">
                        Please provide details of someone we can contact in case of an emergency.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Contact Name <span className="text-red-500">*</span></Label>
                        <Input
                          value={formData.emergencyContact.name}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              emergencyContact: {
                                ...prev.emergencyContact,
                                name: e.target.value,
                              },
                            }))
                          }
                          placeholder="Full name"
                          className={errors.emergencyContactName ? "border-red-500" : ""}
                        />
                        {errors.emergencyContactName && (
                          <p className="text-sm text-red-500">{errors.emergencyContactName}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Relationship to Patient <span className="text-red-500">*</span></Label>
                        <Select
                          value={formData.emergencyContact.relationship}
                          onValueChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              emergencyContact: {
                                ...prev.emergencyContact,
                                relationship: value,
                              },
                            }))
                          }
                        >
                          <SelectTrigger className={errors.emergencyContactRelationship ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              "Spouse",
                              "Parent",
                              "Child",
                              "Sibling",
                              "Friend",
                              "Other",
                            ].map((relation) => (
                              <SelectItem
                                key={relation}
                                value={relation.toLowerCase()}
                              >
                                {relation}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.emergencyContactRelationship && (
                          <p className="text-sm text-red-500">{errors.emergencyContactRelationship}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Phone Number <span className="text-red-500">*</span></Label>
                        <Input
                          type="tel"
                          value={formData.emergencyContact.phone}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              emergencyContact: {
                                ...prev.emergencyContact,
                                phone: e.target.value,
                              },
                            }))
                          }
                          placeholder="Emergency contact phone number"
                          className={errors.emergencyContactPhone ? "border-red-500" : ""}
                        />
                        {errors.emergencyContactPhone && (
                          <p className="text-sm text-red-500">{errors.emergencyContactPhone}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>

          <div className="flex justify-between items-center gap-3 p-6 border-t">
            <div className="text-sm text-gray-500">
              {currentTab === "history"
                ? "All fields are optional in this section"
                : "* Required fields"}
            </div>
            <div className="flex gap-3">
              <DialogClose asChild>
                <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              </DialogClose>
              <Button
                className="bg-[#7EC143] hover:bg-[#7EC143]/90 text-white"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Record"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </DialogContainer>
    </Dialog>
  );
}
