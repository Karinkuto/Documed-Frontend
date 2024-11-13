import { useState, useEffect, Fragment } from "react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Filter, MoreVertical, UserPlus, ChevronLeft, ChevronRight } from "lucide-react";
import {
  MockUser,
  getPaginatedUsers,
  getUserStats,
  updateUserStatus,
  removeUser,
} from "@/data/mockUsers";

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<
    'Medical' | 'Staff' | 'Teacher' | 'Student' | 'Admin' | undefined
  >();
  const [currentPage, setCurrentPage] = useState(1);
  const [userStats, setUserStats] = useState(getUserStats());
  const [paginatedData, setPaginatedData] = useState<{
    users: MockUser[];
    totalUsers: number;
    totalPages: number;
    currentPage: number;
  }>({ users: [], totalUsers: 0, totalPages: 0, currentPage: 1 });

  useDocumentTitle("Users");

  useEffect(() => {
    const data = getPaginatedUsers(searchQuery, selectedRole, currentPage, 4);
    setPaginatedData(data);
    setUserStats(getUserStats());
  }, [searchQuery, selectedRole, currentPage]);

  const handleStatusChange = (userId: string, newStatus: "confirmed" | "pending") => {
    updateUserStatus(userId, newStatus);
    const data = getPaginatedUsers(searchQuery, selectedRole, currentPage, 4);
    setPaginatedData(data);
    setUserStats(getUserStats());
  };

  const handleRemoveUser = (userId: string) => {
    removeUser(userId);
    const data = getPaginatedUsers(searchQuery, selectedRole, currentPage, 4);
    setPaginatedData(data);
    setUserStats(getUserStats());
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-5 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm text-gray-500 font-medium">Medical Personnel</h3>
            <p className="text-3xl font-bold mt-2">{userStats.medical}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm text-gray-500 font-medium">Staff</h3>
            <p className="text-3xl font-bold mt-2">{userStats.staff}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm text-gray-500 font-medium">Teachers</h3>
            <p className="text-3xl font-bold mt-2">{userStats.teachers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm text-gray-500 font-medium">Students</h3>
            <p className="text-3xl font-bold mt-2">{userStats.students}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm text-gray-500 font-medium">Administrator</h3>
            <p className="text-3xl font-bold mt-2">{userStats.admin}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="pl-9"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              {selectedRole || "All Roles"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSelectedRole(undefined)}>
              All Roles
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedRole("Medical")}>
              Medical Personnel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedRole("Staff")}>
              Staff
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedRole("Teacher")}>
              Teacher
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedRole("Student")}>
              Student
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedRole("Admin")}>
              Administrator
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button className="bg-[#7EC143] hover:bg-[#7EC143]/90">
          <UserPlus className="mr-2 h-4 w-4" />
          Add New User
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center px-4 py-2 text-sm font-medium text-gray-500">
            <div className="flex-[2]">User</div>
            <div className="flex-1">Department</div>
            <div className="w-[100px]">Role</div>
            <div className="w-[100px]">Status</div>
            <div className="w-[40px]"></div>
          </div>
          
          <div className="space-y-2">
            {paginatedData.users.map((user) => (
              <div
                key={user.id}
                className="flex items-center p-4 rounded-lg border border-gray-100 hover:border-[#7EC143] transition-colors duration-200"
              >
                <div className="flex items-center gap-4 flex-[2]">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{user.name}</h3>
                    <p className="text-sm text-gray-500">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex-1">
                  <div>
                    {user.department.split(' - ')[0]}
                    <div className="text-xs text-gray-500 mt-1">
                      {user.department.split(' - ')[1]}
                    </div>
                  </div>
                </div>
                
                <div className="w-[100px]">
                  <Badge
                    variant="outline"
                    className={
                      user.role === "Medical"
                        ? "bg-blue-100 text-blue-800"
                        : user.role === "Staff"
                        ? "bg-gray-100 text-gray-800"
                        : user.role === "Teacher"
                        ? "bg-purple-100 text-purple-800"
                        : user.role === "Student"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {user.role}
                  </Badge>
                </div>

                <div className="w-[100px]">
                  <Badge
                    variant="outline"
                    className={
                      user.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {user.status}
                  </Badge>
                </div>

                <div className="w-[40px]">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          handleStatusChange(
                            user.id,
                            user.status === "confirmed"
                              ? "pending"
                              : "confirmed"
                          )
                        }
                      >
                        {user.status === "confirmed"
                          ? "Mark as Pending"
                          : "Mark as Confirmed"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleRemoveUser(user.id)}
                        className="text-red-600"
                      >
                        Remove User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="text-sm text-gray-500">
              Showing {((currentPage - 1) * 4) + 1} to {Math.min(currentPage * 4, paginatedData.totalUsers)} of {paginatedData.totalUsers} users
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: paginatedData.totalPages }, (_, i) => i + 1)
                .filter(page => 
                  page === 1 || 
                  page === paginatedData.totalPages || 
                  Math.abs(page - currentPage) <= 1
                )
                .map((page, i, arr) => (
                  <Fragment key={page}>
                    {i > 0 && arr[i - 1] !== page - 1 && (
                      <span className="text-gray-400">...</span>
                    )}
                    <Button
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  </Fragment>
                ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(paginatedData.totalPages, prev + 1))}
                disabled={currentPage === paginatedData.totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
