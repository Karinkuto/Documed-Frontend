import { useParams, useNavigate, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Download,
  Calendar,
  Mail,
  MapPin,
  AlertCircle,
  Pill,
  ChevronRight,
  PencilIcon,
  Stethoscope,
  TestTube,
  CalendarCheck,
  Activity,
  LogIn,
  Upload,
  FileText as FileTextIcon,
  ClipboardCheck,
  UserCog,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import mockMedicalRecords from "@/data/mockData";
import { cn } from "@/lib/utils";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import InfoItem from "@/components/InfoItem";
import Timeline from "@/components/Timeline";
import { getStatusColor } from "@/types/MedicalRecord";

// New components
import MedicalMetricsChart from "./MedicalMetricsChart";
import MedicalTimeline from "./MedicalTimeline";
import DocumentGrid from "./DocumentGrid";

// Add type definitions for VitalSign props
interface VitalSignProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit: string;
  trend: "up" | "down";
}

const VitalSign = ({ icon, label, value, unit, trend }: VitalSignProps) => (
  <div className="flex items-center gap-3 p-4 bg-white rounded-lg border">
    <div
      className={cn(
        "h-10 w-10 rounded-full flex items-center justify-center",
        trend === "up" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
      )}
    >
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <div className="flex items-center gap-2">
        <p className="text-xl font-semibold">{value}</p>
        <span className="text-sm text-gray-500">{unit}</span>
      </div>
    </div>
  </div>
);

export default function MedicalProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const record = mockMedicalRecords.find((r) => r.id === id);

  if (!record) {
    return <div>Patient not found</div>;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-6">
        {/* Breadcrumb */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm">
            <Link
              to="/medical-repository"
              className="text-gray-500 hover:text-gray-700"
            >
              Medical Repository
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-500" />
            <span className="font-medium">{record.patientName}</span>
          </div>
        </div>

        {/* Profile Header Card - Enhanced */}
        <Card className="mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 ring-4 ring-white">
                <AvatarImage
                  src={record.patientAvatar}
                  alt={record.patientName}
                />
                <AvatarFallback className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-2xl">
                  {record.patientName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {record.patientName}
                    </h2>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                        ID: {record.patientId}
                      </Badge>
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
                        {record.bloodType}
                      </Badge>
                      <Badge
                        className={cn(
                          "capitalize",
                          record.status === "active"
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        )}
                      >
                        {record.status}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white hover:bg-gray-50"
                  >
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    Last Visit: {record.lastVisit}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Badge variant="outline" className="bg-white">
                      {record.role}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <CardContent className="p-6 bg-white">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <Mail className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Email</p>
                  <p className="text-sm text-gray-900">
                    {record.personalInfo.email}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Address</p>
                  <p className="text-sm text-gray-900">
                    {record.personalInfo.address.street}
                    <br />
                    {record.personalInfo.address.city},{" "}
                    {record.personalInfo.address.country}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <Calendar className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Date of Birth
                  </p>
                  <p className="text-sm text-gray-900">
                    {record.personalInfo.dateOfBirth}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <AlertCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Gender</p>
                  <p className="text-sm text-gray-900">
                    {record.personalInfo.gender}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <FileText className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Nationality
                  </p>
                  <p className="text-sm text-gray-900">
                    {record.personalInfo.nationality}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <FileText className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Marital Status
                  </p>
                  <p className="text-sm text-gray-900">
                    {record.personalInfo.maritalStatus}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white p-1 border">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="history">Medical History</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-12 gap-6">
              {/* Main Column - 70% */}
              <div className="col-span-8">
                {/* Medical History Summary Card - Enhanced */}
                <Card>
                  <CardHeader className="border-b">
                    <CardTitle className="text-lg">Medical Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-8">
                      {/* Key Stats Section */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 rounded-lg border bg-gray-50">
                          <p className="text-sm font-medium text-gray-500">
                            Height
                          </p>
                          <p className="text-2xl font-semibold mt-1">175 cm</p>
                        </div>
                        <div className="p-4 rounded-lg border bg-gray-50">
                          <p className="text-sm font-medium text-gray-500">
                            Weight
                          </p>
                          <p className="text-2xl font-semibold mt-1">68 kg</p>
                        </div>
                        <div className="p-4 rounded-lg border bg-gray-50">
                          <p className="text-sm font-medium text-gray-500">
                            Blood Pressure
                          </p>
                          <p className="text-2xl font-semibold mt-1">120/80</p>
                        </div>
                      </div>

                      {/* Past Conditions Section */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-4">
                          Conditions & Diagnoses
                        </h4>
                        <div className="grid gap-3">
                          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                            <div>
                              <p className="font-medium text-gray-900">
                                Hypertension
                              </p>
                              <p className="text-sm text-gray-500">
                                Diagnosed: Jan 2023
                              </p>
                            </div>
                            <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                              Ongoing
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                            <div>
                              <p className="font-medium text-gray-900">
                                Type 2 Diabetes
                              </p>
                              <p className="text-sm text-gray-500">
                                Diagnosed: Mar 2022
                              </p>
                            </div>
                            <Badge className="bg-green-100 text-green-700 border-green-200">
                              Managed
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                            <div>
                              <p className="font-medium text-gray-900">
                                Asthma
                              </p>
                              <p className="text-sm text-gray-500">
                                Diagnosed: Sep 2020
                              </p>
                            </div>
                            <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                              Controlled
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Allergies Section */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-4">
                          Allergies & Reactions
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {record.allergies.map((allergy, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="px-3 py-1 bg-red-50 text-red-700 border-red-200"
                            >
                              {allergy}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Past Surgeries Section */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-4">
                          Surgical History
                        </h4>
                        <div className="grid gap-3">
                          <div className="p-3 rounded-lg bg-gray-50">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-medium text-gray-900">
                                  Appendectomy
                                </p>
                                <p className="text-sm text-gray-500">
                                  Laparoscopic Surgery
                                </p>
                              </div>
                              <Badge variant="outline">2021</Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              Performed at Central Hospital
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-gray-50">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-medium text-gray-900">
                                  Knee Arthroscopy
                                </p>
                                <p className="text-sm text-gray-500">
                                  Right Knee
                                </p>
                              </div>
                              <Badge variant="outline">2019</Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              Performed at Sports Medicine Center
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Family History Section */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-4">
                          Family History
                        </h4>
                        <div className="grid gap-3">
                          <div className="p-3 rounded-lg bg-gray-50">
                            <p className="font-medium text-gray-900">
                              Diabetes Type 2
                            </p>
                            <p className="text-sm text-gray-500">
                              Father's side
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-gray-50">
                            <p className="font-medium text-gray-900">
                              Hypertension
                            </p>
                            <p className="text-sm text-gray-500">
                              Mother's side
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Lifestyle Section */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-4">
                          Lifestyle Factors
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 rounded-lg bg-gray-50">
                            <p className="text-sm font-medium text-gray-500">
                              Smoking Status
                            </p>
                            <p className="font-medium text-gray-900">
                              Non-smoker
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-gray-50">
                            <p className="text-sm font-medium text-gray-500">
                              Exercise Frequency
                            </p>
                            <p className="font-medium text-gray-900">
                              3-4 times/week
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar - Enhanced */}
              <div className="col-span-4 space-y-6">
                {/* Quick Actions Card - Enhanced */}
                <Card className="bg-[#111827] text-white">
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant="secondary"
                      className="w-full justify-start bg-white/10 hover:bg-white/20 text-white border-0"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      View Full History
                    </Button>
                    <Button
                      variant="secondary"
                      className="w-full justify-start bg-white/10 hover:bg-white/20 text-white border-0"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Records
                    </Button>
                    <Button
                      variant="secondary"
                      className="w-full justify-start bg-white/10 hover:bg-white/20 text-white border-0"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Appointment
                    </Button>
                  </CardContent>
                </Card>

                {/* Current Medications Card - Without View All Button */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Pill className="h-5 w-5 text-gray-500" />
                      Current Medications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {record.prescriptions
                        ?.filter(
                          (prescription) => prescription.status === "Active"
                        )
                        .map((prescription, index) => (
                          <div
                            key={index}
                            className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-gray-900">
                                    {prescription.medication}
                                  </span>
                                  <Badge
                                    variant="outline"
                                    className="bg-green-50 text-green-700 border-green-200"
                                  >
                                    Active
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                  {prescription.dosage} -{" "}
                                  {prescription.frequency}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activities Card - Without View All Button */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="h-5 w-5 text-gray-500" />
                      Recent Activities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative space-y-3">
                      <div className="absolute top-0 bottom-0 left-[16px] w-[1px] bg-gray-100" />
                      {record.activityLog.slice(0, 5).map((activity, index) => (
                        <div key={index} className="relative pl-10">
                          <div
                            className={cn(
                              "absolute left-0 w-8 h-8 rounded-full flex items-center justify-center",
                              activity.action === "Login"
                                ? "bg-blue-50 text-blue-600"
                                : activity.action === "Document Upload"
                                ? "bg-purple-50 text-purple-600"
                                : activity.action === "File Access"
                                ? "bg-green-50 text-green-600"
                                : activity.action === "Form Submission"
                                ? "bg-amber-50 text-amber-600"
                                : activity.action === "Profile Update"
                                ? "bg-rose-50 text-rose-600"
                                : "bg-gray-50 text-gray-600"
                            )}
                          >
                            {activity.action === "Login" ? (
                              <LogIn className="h-4 w-4" />
                            ) : activity.action === "Document Upload" ? (
                              <Upload className="h-4 w-4" />
                            ) : activity.action === "File Access" ? (
                              <FileTextIcon className="h-4 w-4" />
                            ) : activity.action === "Form Submission" ? (
                              <ClipboardCheck className="h-4 w-4" />
                            ) : activity.action === "Profile Update" ? (
                              <UserCog className="h-4 w-4" />
                            ) : (
                              <Activity className="h-4 w-4" />
                            )}
                          </div>
                          <div className="bg-gray-50 rounded-lg p-3 ml-2 border border-gray-100">
                            <div className="flex flex-col space-y-1">
                              <div className="flex items-center justify-between">
                                <Badge
                                  className={cn(
                                    "px-2 py-0.5 text-xs font-medium rounded",
                                    activity.action === "Login"
                                      ? "bg-blue-50 text-blue-700"
                                      : activity.action === "Document Upload"
                                      ? "bg-purple-50 text-purple-700"
                                      : activity.action === "File Access"
                                      ? "bg-green-50 text-green-700"
                                      : activity.action === "Form Submission"
                                      ? "bg-amber-50 text-amber-700"
                                      : activity.action === "Profile Update"
                                      ? "bg-rose-50 text-rose-700"
                                      : "bg-gray-50 text-gray-700"
                                  )}
                                >
                                  {activity.action}
                                </Badge>
                                <time className="text-xs text-gray-500">
                                  {activity.date}
                                </time>
                              </div>
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-900">
                                  {activity.details}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="metrics">
            <Card>
              <CardContent className="p-6">
                <MedicalMetricsChart />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardContent className="p-6">
                <MedicalTimeline />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardContent className="p-6">
                <DocumentGrid documents={record.documents} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prescriptions">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Pill className="h-5 w-5 text-gray-500" />
                      Current Medications
                    </CardTitle>
                    <Button>
                      <FileText className="mr-2 h-4 w-4" />
                      New Prescription
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {record.prescriptions?.map((prescription, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">
                                {prescription.medication}
                              </h4>
                              <p className="text-sm text-gray-500 mt-1">
                                {prescription.dosage} - {prescription.frequency}
                              </p>
                              <p className="text-sm text-gray-500">
                                Prescribed by Dr. {prescription.prescribedBy}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge
                                variant={
                                  prescription.status === "Active"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {prescription.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t">
                            <p className="text-sm text-gray-600">
                              <strong>Instructions:</strong>{" "}
                              {prescription.instructions}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Prescription History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {record.prescriptionHistory?.map((prescription, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center py-3 border-b last:border-0"
                      >
                        <div>
                          <h4 className="font-medium">
                            {prescription.medication}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {prescription.period}
                          </p>
                        </div>
                        <Badge variant="outline">{prescription.status}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
