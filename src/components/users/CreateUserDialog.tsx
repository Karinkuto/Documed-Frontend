import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { generateTemporaryPassword } from "@/utils/auth";

interface CreateUserDialogProps {
  onUserCreated: () => void;
}

export function CreateUserDialog({ onUserCreated }: CreateUserDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    role: "Student",
    department: "",
    specialization: "", // For medical personnel
    licenseNumber: "", // For medical personnel
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const tempPassword = generateTemporaryPassword();
      
      // TODO: Replace with actual API call
      // await createUser({
      //   ...formData,
      //   temporaryPassword: tempPassword,
      // });

      // TODO: Replace with actual email service
      console.log("Would send email to:", formData.email, "with temporary password:", tempPassword);

      toast({
        title: "User Created Successfully",
        description: "An email has been sent to the user with temporary credentials.",
      });

      setOpen(false);
      onUserCreated();
    } catch (error) {
      console.error("Error creating user:", error);
      toast({
        title: "Error Creating User",
        description: "There was an error creating the user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof typeof formData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create New User</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="fullName" className="text-sm font-medium">
              Full Name
            </label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium">
              Role
            </label>
            <Select
              value={formData.role}
              onValueChange={(value) => handleInputChange("role", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Student">Student</SelectItem>
                <SelectItem value="Medical">Medical Personnel</SelectItem>
                <SelectItem value="Staff">Staff</SelectItem>
                <SelectItem value="Teacher">Teacher</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="department" className="text-sm font-medium">
              Department
            </label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => handleInputChange("department", e.target.value)}
              required
            />
          </div>

          {formData.role === "Medical" && (
            <>
              <div className="space-y-2">
                <label htmlFor="specialization" className="text-sm font-medium">
                  Specialization
                </label>
                <Input
                  id="specialization"
                  value={formData.specialization}
                  onChange={(e) =>
                    handleInputChange("specialization", e.target.value)
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="licenseNumber" className="text-sm font-medium">
                  License Number
                </label>
                <Input
                  id="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={(e) =>
                    handleInputChange("licenseNumber", e.target.value)
                  }
                  required
                />
              </div>
            </>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create User"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
