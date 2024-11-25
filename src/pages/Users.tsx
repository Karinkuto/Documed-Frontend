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
import {
  Search,
  Filter,
  MoreVertical,
  UserPlus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  MockUser,
  getPaginatedUsers,
  getUserStats,
  updateUserStatus,
  removeUser,
  addMockUser,
} from "@/data/mockUsers";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { DEPARTMENTS } from "@/data/mockUsers";

export default function Users() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<
    "Medical" | "Staff" | "Teacher" | "Student" | "Admin" | undefined
  >();
  const [currentPage, setCurrentPage] = useState(1);
  const [userStats, setUserStats] = useState(getUserStats());
  const [paginatedData, setPaginatedData] = useState<{
    users: MockUser[];
    totalUsers: number;
    totalPages: number;
    currentPage: number;
  }>({ users: [], totalUsers: 0, totalPages: 0, currentPage: 1 });
  const [dialogOpen, setDialogOpen] = useState(false);

  useDocumentTitle("Users");

  useEffect(() => {
    const data = getPaginatedUsers(searchQuery, selectedRole, currentPage, 4);
    setPaginatedData(data);
    setUserStats(getUserStats());
  }, [searchQuery, selectedRole, currentPage]);

  const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    role: z.enum(["Medical", "Staff", "Teacher", "Student", "Admin"]),
    department: z.string().min(1, "Please select a department"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "Student",
      department: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const newUser = {
      ...values,
      avatar: `/avatars/default.jpg`, // You might want to implement avatar upload later
    };
    
    addMockUser(newUser);
    const data = getPaginatedUsers(searchQuery, selectedRole, currentPage, 4);
    setPaginatedData(data);
    setUserStats(getUserStats());
    setDialogOpen(false);
    form.reset();
  };

  const handleStatusChange = (
    userId: string,
    newStatus: "confirmed" | "pending"
  ) => {
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
            <h3 className="text-sm text-gray-500 font-medium">
              Medical Personnel
            </h3>
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
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#7EC143] hover:bg-[#7EC143]/90">
              <UserPlus className="mr-2 h-4 w-4" />
              Add New User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john.doe@bitscollege.edu.et" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Medical">Medical Personnel</SelectItem>
                          <SelectItem value="Staff">Staff</SelectItem>
                          <SelectItem value="Teacher">Teacher</SelectItem>
                          <SelectItem value="Student">Student</SelectItem>
                          <SelectItem value="Admin">Administrator</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(DEPARTMENTS).map(([key, value]) => (
                            <SelectItem key={key} value={value}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">Add User</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
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
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>

                <div className="flex-1">
                  <div>
                    {user.department.split(" - ")[0]}
                    <div className="text-xs text-gray-500 mt-1">
                      {user.department.split(" - ")[1]}
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
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
              Showing {(currentPage - 1) * 4 + 1} to{" "}
              {Math.min(currentPage * 4, paginatedData.totalUsers)} of{" "}
              {paginatedData.totalUsers} users
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: paginatedData.totalPages }, (_, i) => i + 1)
                .filter(
                  (page) =>
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
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(paginatedData.totalPages, prev + 1)
                  )
                }
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
