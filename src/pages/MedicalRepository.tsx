import { useState } from "react";
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
import { MedicalRecord } from "@/types/MedicalRecord";
import { useNavigate, Link } from "react-router-dom";
import mockMedicalRecords from "@/data/mockData";
import { StatCard } from "@/components/StatCard";
import { AddMedicalRecordDialog } from "@/components/AddMedicalRecordDialog";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [records, setRecords] = useState<MedicalRecord[]>(mockMedicalRecords);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const navigate = useNavigate();

  const filteredAndSortedRecords = records
    .filter((record) => {
      const matchesSearch =
        record.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.patientId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        filterStatus === "all" || record.status === filterStatus;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "name":
          comparison = a.patientName.localeCompare(b.patientName);
          break;
        case "lastVisit":
          comparison = a.lastVisit.localeCompare(b.lastVisit);
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

  const handleAddRecord = (newRecord: Partial<MedicalRecord>) => {
    setRecords((prevRecords) => [...prevRecords, newRecord as MedicalRecord]);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">Medical Repository</span>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-4 gap-4">
          <StatCard title="Total Patients" value="1,234" trend="+12%" />
          <StatCard title="Active Cases" value="89" trend="+5%" />
          <StatCard title="Pending Reports" value="23" trend="-2%" />
          <StatCard title="Recent Updates" value="45" trend="+8%" />
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by patient name, ID, or diagnosis..."
                  className="pl-9"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={
                    filterStatus === "active"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : ""
                  }
                  onClick={() => setFilterStatus("active")}
                >
                  Active Cases
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={
                    filterStatus === "pending"
                      ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                      : ""
                  }
                  onClick={() => setFilterStatus("pending")}
                >
                  Pending
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <SlidersHorizontal className="h-4 w-4" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                      All Records
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setFilterStatus("active")}>
                      Active
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setFilterStatus("archived")}
                    >
                      Archived
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setFilterStatus("missing")}
                    >
                      Missing
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setFilterStatus("pending")}
                    >
                      Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setFilterStatus("complete")}
                    >
                      Complete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <ArrowUpDown className="h-4 w-4" />
                      Sort
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={() => {
                        setSortField("name");
                        setSortOrder("asc");
                      }}
                    >
                      Name (A-Z)
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSortField("name");
                        setSortOrder("desc");
                      }}
                    >
                      Name (Z-A)
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSortField("lastVisit");
                        setSortOrder("desc");
                      }}
                    >
                      Latest Visit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSortField("lastVisit");
                        setSortOrder("asc");
                      }}
                    >
                      Oldest Visit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSortField("status");
                        setSortOrder("asc");
                      }}
                    >
                      Status
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <AddMedicalRecordDialog onAdd={handleAddRecord}>
                  <Button className="bg-[#7EC143] hover:bg-[#7EC143]/90">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Record
                  </Button>
                </AddMedicalRecordDialog>
              </div>
            </div>

            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-4 text-left font-medium text-gray-600">
                      Patient
                    </th>
                    <th className="p-4 text-left font-medium text-gray-600">
                      ID
                    </th>
                    <th className="p-4 text-left font-medium text-gray-600">
                      Last Visit
                    </th>
                    <th className="p-4 text-left font-medium text-gray-600">
                      Diagnosis
                    </th>
                    <th className="p-4 text-left font-medium text-gray-600">
                      Status
                    </th>
                    <th className="p-4 text-left font-medium text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAndSortedRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="group hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="p-4">
                        <div
                          onClick={() =>
                            navigate(`/medical-profile/${record.id}`)
                          }
                          className="flex items-center gap-3 cursor-pointer hover:text-[#7EC143] transition-colors"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={record.patientAvatar} />
                            <AvatarFallback>
                              {record.patientName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          {record.patientName}
                        </div>
                      </td>
                      <td className="p-4">{record.patientId}</td>
                      <td className="p-4">{record.lastVisit}</td>
                      <td className="p-4">{record.diagnosis}</td>
                      <td className="p-4">
                        <Badge
                          variant={
                            record.status === "active" ? "default" : "secondary"
                          }
                        >
                          {record.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              Actions
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>Edit Record</DropdownMenuItem>
                            <DropdownMenuItem>
                              Download Documents
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              Delete Record
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
