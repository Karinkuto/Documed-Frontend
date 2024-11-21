import { useState, useEffect } from "react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronRight,
} from "lucide-react";
import type { MedicalRecord } from "@/types/MedicalRecord";
import { useNavigate, Link } from "react-router-dom";
import { AddMedicalRecordDialog } from "@/components/AddMedicalRecordDialog";
import { toast } from "sonner";
import { useMedicalRecordStore } from "@/stores/medicalRecordStore";
import { StatCard } from "@/components/StatCard";

type SortField = "name" | "lastVisit" | "status";
type SortOrder = "asc" | "desc";
type FilterStatus =
  | "all"
  | "active"
  | "archived"
  | "missing"
  | "pending"
  | "complete";

export default function MedicalRepository() {
  useDocumentTitle("Medical Records Repository");
  const navigate = useNavigate();
  
  // Zustand store
  const { records, isLoading, error, loadRecords, addRecord, searchRecords } = useMedicalRecordStore();
  
  // Local state for UI
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  useEffect(() => {
    // Only load if we don't have any records
    if (!records || records.length === 0) {
      loadRecords();
    }
  }, [loadRecords, records]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      // Don't reload if we already have records
      if (!records || records.length === 0) {
        loadRecords();
      }
      return;
    }
    await searchRecords(query);
  };

  const handleAddRecord = async (record: Omit<MedicalRecord, "id">) => {
    try {
      const newRecord = await addRecord(record);
      setIsAddDialogOpen(false);
      toast.success("Medical record created successfully");
      // Navigate to the new record
      navigate(`/medical-profile/${newRecord.id}`);
    } catch (error) {
      console.error("Error adding record:", error);
      toast.error("Failed to create medical record");
      throw error;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      case "missing":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "complete":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const stats = [
    {
      title: "Total Records",
      value: records?.length?.toString() ?? "0",
      change: "+2.1%",
      changeType: "increase" as const,
    },
    {
      title: "Active Records",
      value: records?.filter((r) => r?.status === "active")?.length?.toString() ?? "0",
      change: "+1.2%",
      changeType: "increase" as const,
    },
    {
      title: "Pending Records",
      value: records?.filter((r) => r?.status === "pending")?.length?.toString() ?? "0",
      change: "-0.4%",
      changeType: "decrease" as const,
    },
  ];

  const filteredAndSortedRecords = (records || [])
    .filter((record) => {
      if (filterStatus === "all") return true;
      return record.status.toLowerCase() === filterStatus;
    })
    .sort((a, b) => {
      const aValue = sortField === "name" ? a.patientName : a[sortField];
      const bValue = sortField === "name" ? b.patientName : b[sortField];
      const modifier = sortOrder === "asc" ? 1 : -1;
      return aValue > bValue ? modifier : -modifier;
    });

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Medical Records</h1>
        <AddMedicalRecordDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
        >
          <Button className="bg-black text-white hover:bg-black/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Record
          </Button>
        </AddMedicalRecordDialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  placeholder="Search records..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                    All Records
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("active")}>
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("archived")}>
                    Archived
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus("pending")}>
                    Pending
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    onClick={() => {
                      setSortField("name");
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    }}
                  >
                    By Name
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSortField("lastVisit");
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    }}
                  >
                    By Last Visit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSortField("status");
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    }}
                  >
                    By Status
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAndSortedRecords.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-4 bg-white border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/medical-profile/${record.id}`)}
                >
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={record.patientAvatar} />
                      <AvatarFallback>
                        {record.patientName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{record.patientName}</h3>
                      <p className="text-sm text-gray-500">ID: {record.patientId}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge
                      className={`${getStatusColor(record.status)} capitalize`}
                    >
                      {record.status}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      Last Visit: {new Date(record.lastVisit).toLocaleDateString()}
                    </span>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
