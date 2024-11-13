import React, { useState } from "react";
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

interface AddMedicalRecordDialogProps {
  children: React.ReactNode;
  onAdd: (record: Partial<MedicalRecord>) => void;
}

interface FormData {
  // Basic Information
  patientName: string;
  patientId: string;
  bloodType: string;
  status: "active" | "pending" | "archived";
  role: "Patient" | "Doctor" | "Nurse" | "Pharmacist";

  // Personal Information
  email: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  maritalStatus: string;
  address: {
    street: string;
    city: string;
    country: string;
  };

  // Medical Information
  height: string;
  weight: string;
  bloodPressure: string;
  conditions: string[];
  allergies: string[];
  medications: string[];

  // Family History
  familyHistory: { condition: string; relation: string }[];

  // Lifestyle
  smokingStatus: string;
  exerciseFrequency: string;

  // Additional Notes
  notes: string;

  // Emergency Contact
  includeEmergencyContact: boolean;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };

  // Past Surgeries
  pastSurgeries: Array<{
    procedure: string;
    date: string;
    hospital: string;
  }>;
}

export function AddMedicalRecordDialog({
  children,
  onAdd,
}: AddMedicalRecordDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTab, setCurrentTab] = useState("basic");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    // Basic Information
    patientName: "",
    patientId: "",
    bloodType: "",
    status: "active",
    role: "Patient",

    // Personal Information
    email: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    maritalStatus: "",
    address: {
      street: "",
      city: "",
      country: "",
    },

    // Medical Information
    height: "",
    weight: "",
    bloodPressure: "",
    conditions: [],
    allergies: [],
    medications: [],

    // Family History
    familyHistory: [],

    // Lifestyle
    smokingStatus: "",
    exerciseFrequency: "",

    // Additional Notes
    notes: "",

    // Emergency Contact
    includeEmergencyContact: false,
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
    },

    // Past Surgeries
    pastSurgeries: [],
  });

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

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();

    // Validate required fields
    const newErrors: Record<string, string> = {};

    if (!formData.patientName) {
      newErrors.patientName = "Patient name is required";
    }

    if (!formData.patientId) {
      newErrors.patientId = "Patient ID is required";
    }

    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors before submitting");
      return;
    }

    setIsSubmitting(true);
    try {
      const newRecord: Partial<MedicalRecord> = {
        id: `MR-${Math.floor(Math.random() * 100000)
          .toString()
          .padStart(6, "0")}`,
        patientName: formData.patientName,
        patientId: formData.patientId,
        patientAvatar: avatarFile ? await convertFileToBase64(avatarFile) : "",
        bloodType: formData.bloodType,
        status: formData.status,
        role: formData.role,
        lastVisit: new Date().toLocaleDateString(),

        personalInfo: {
          email: formData.email,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          nationality: formData.nationality,
          address: formData.address,
          maritalStatus: formData.maritalStatus,
        },

        medicalInfo: {
          height: formData.height,
          weight: formData.weight,
          bloodPressure: formData.bloodPressure,
          conditions: formData.conditions,
          familyHistory: formData.familyHistory,
          lifestyle: {
            smokingStatus: formData.smokingStatus,
            exerciseFrequency: formData.exerciseFrequency,
          },
        },

        allergies: formData.allergies,
        medications: formData.medications,
        activityLog: [
          {
            date: new Date().toLocaleDateString(),
            action: "Record Created",
            details: "New medical record created",
          },
        ],
        documents: [],
      };

      onAdd(newRecord);

      toast.success("Medical record created successfully");
    } catch (err: unknown) {
      console.error("Error creating medical record:", err);
      toast.error("Failed to create medical record");
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
        return Boolean(formData.height && formData.weight);
      case "history":
        return Boolean(
          formData.familyHistory.length > 0 ||
            formData.pastSurgeries.length > 0 ||
            formData.smokingStatus ||
            formData.exerciseFrequency ||
            formData.notes
        );
      default:
        return false;
    }
  };

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContainer>
        <DialogContent className="w-[90vw] max-w-4xl rounded-xl bg-white shadow-lg">
          <DialogTitle className="text-xl font-semibold p-6 border-b">
            Add New Medical Record
          </DialogTitle>

          <ScrollArea className="h-[70vh]">
            <div className="p-6">
              <Tabs
                value={currentTab}
                onValueChange={setCurrentTab}
                className="space-y-6"
              >
                <TabsList className="grid w-full grid-cols-4">
                  {[
                    { value: "basic", label: "Basic Info" },
                    { value: "personal", label: "Personal Info" },
                    { value: "medical", label: "Medical Info" },
                    { value: "history", label: "Medical History" },
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
                        value={generatePatientId()}
                        readOnly
                        className="bg-gray-50"
                        placeholder="Auto-generated ID"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Blood Type</Label>
                      <Select
                        value={formData.bloodType}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, bloodType: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unknown">Unknown</SelectItem>
                          {[
                            "A+",
                            "A-",
                            "B+",
                            "B-",
                            "O+",
                            "O-",
                            "AB+",
                            "AB-",
                          ].map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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

                    <div className="col-span-2 flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <Label>Emergency Contact Information</Label>
                        <p className="text-sm text-gray-500">
                          Include emergency contact details in the record
                        </p>
                      </div>
                      <Switch
                        checked={formData.includeEmergencyContact}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({
                            ...prev,
                            includeEmergencyContact: checked,
                          }))
                        }
                      />
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
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !formData.dateOfBirth && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {formData.dateOfBirth ? (
                              format(new Date(formData.dateOfBirth), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              formData.dateOfBirth
                                ? new Date(formData.dateOfBirth)
                                : undefined
                            }
                            onSelect={(date) => {
                              setFormData((prev) => ({
                                ...prev,
                                dateOfBirth: date
                                  ? format(date, "yyyy-MM-dd")
                                  : "",
                              }));
                              if (errors.dateOfBirth) {
                                setErrors((prev) => ({
                                  ...prev,
                                  dateOfBirth: "",
                                }));
                              }
                            }}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
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
                          value={formData.address.street}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              address: {
                                ...prev.address,
                                street: e.target.value,
                              },
                            }))
                          }
                          placeholder="Street address"
                        />
                        <Input
                          value={formData.address.city}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              address: {
                                ...prev.address,
                                city: e.target.value,
                              },
                            }))
                          }
                          placeholder="City"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="medical" className="space-y-6">
                  {/* Vital Signs Section */}
                  <div className="rounded-lg border p-4 bg-gray-50">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">
                      Vital Signs
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          Height (cm)
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
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          Weight (kg)
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
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          Blood Pressure
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <AlertCircle className="h-4 w-4 text-gray-400" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Format: systolic/diastolic (e.g., 120/80)</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Input
                          value={formData.bloodPressure}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d{0,3}\/?\d{0,3}$/.test(value)) {
                              setFormData((prev) => ({
                                ...prev,
                                bloodPressure: value,
                              }));
                            }
                          }}
                          placeholder="e.g., 120/80"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Current Medications Section */}
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-900">
                        Current Medications
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
                      maxTags={15}
                    />
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
                      maxTags={10}
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
                      maxTags={10}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="history" className="space-y-6">
                  {/* Family History Section */}
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-900">
                        Family History
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            familyHistory: [
                              ...prev.familyHistory,
                              { condition: "", relation: "" },
                            ],
                          }));
                        }}
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
                              onChange={(e) => {
                                const newHistory = [...formData.familyHistory];
                                newHistory[index].condition = e.target.value;
                                setFormData((prev) => ({
                                  ...prev,
                                  familyHistory: newHistory,
                                }));
                              }}
                              placeholder="Medical condition"
                            />
                          </div>
                          <div className="w-[200px]">
                            <Select
                              value={item.relation}
                              onValueChange={(value) => {
                                const newHistory = [...formData.familyHistory];
                                newHistory[index].relation = value;
                                setFormData((prev) => ({
                                  ...prev,
                                  familyHistory: newHistory,
                                }));
                              }}
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
                            onClick={() => {
                              const newHistory = formData.familyHistory.filter(
                                (_, i) => i !== index
                              );
                              setFormData((prev) => ({
                                ...prev,
                                familyHistory: newHistory,
                              }));
                            }}
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
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            pastSurgeries: [
                              ...prev.pastSurgeries,
                              { procedure: "", date: "", hospital: "" },
                            ],
                          }));
                        }}
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
                            onChange={(e) => {
                              const newSurgeries = [...formData.pastSurgeries];
                              newSurgeries[index].procedure = e.target.value;
                              setFormData((prev) => ({
                                ...prev,
                                pastSurgeries: newSurgeries,
                              }));
                            }}
                            placeholder="Procedure name"
                          />
                          <Input
                            type="date"
                            value={surgery.date}
                            onChange={(e) => {
                              const newSurgeries = [...formData.pastSurgeries];
                              newSurgeries[index].date = e.target.value;
                              setFormData((prev) => ({
                                ...prev,
                                pastSurgeries: newSurgeries,
                              }));
                            }}
                          />
                          <div className="flex gap-2">
                            <Input
                              value={surgery.hospital}
                              onChange={(e) => {
                                const newSurgeries = [
                                  ...formData.pastSurgeries,
                                ];
                                newSurgeries[index].hospital = e.target.value;
                                setFormData((prev) => ({
                                  ...prev,
                                  pastSurgeries: newSurgeries,
                                }));
                              }}
                              placeholder="Hospital name"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="shrink-0"
                              onClick={() => {
                                const newSurgeries =
                                  formData.pastSurgeries.filter(
                                    (_, i) => i !== index
                                  );
                                setFormData((prev) => ({
                                  ...prev,
                                  pastSurgeries: newSurgeries,
                                }));
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

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
              <DialogClose>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <DialogClose>
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
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </DialogContainer>
      <style jsx global>{`
        .radix-select-content {
          z-index: 50 !important;
        }
        .radix-popover-content {
          z-index: 50 !important;
        }
        .radix-tooltip-content {
          z-index: 50 !important;
        }
      `}</style>
    </Dialog>
  );
}
