import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { validatePassword } from "@/utils/auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Register() {
  useDocumentTitle("Register");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    role: "Student",
  });
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string[];
    confirmPassword?: string;
    fullName?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (formData.email.includes('@')) {
      newErrors.email = "Please enter only the username part without @bitscollege.edu.et";
    }

    // Password validation
    const { isValid, errors: passwordErrors } = validatePassword(formData.password);
    if (!isValid) {
      newErrors.password = passwordErrors;
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      // Add the domain to the email
      const emailWithDomain = `${formData.email}@bitscollege.edu.et`;
      const submitData = { ...formData, email: emailWithDomain };
      
      // TODO: Implement registration logic
      console.log("Registration data:", submitData);
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      setErrors({
        ...errors,
        submit: "Registration failed. Please try again.",
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof formData
  ) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: undefined,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/login-bg.jpg')] bg-cover bg-center bg-no-repeat p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-10">
          <h2 className="text-3xl font-semibold mb-8">Create Account</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-3">
              <label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange(e, "fullName")}
                className="py-6 px-4"
                required
              />
              {errors.fullName && (
                <p className="text-sm text-red-500">{errors.fullName}</p>
              )}
            </div>

            <div className="space-y-3">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <Input
                  id="email"
                  type="text"
                  placeholder="username"
                  className="py-6 px-4 pr-[180px]"
                  value={formData.email}
                  onChange={(e) => {
                    const value = e.target.value.replace(/@bitscollege\.edu\.et$/, '');
                    handleInputChange({ ...e, target: { ...e.target, value: value } }, "email");
                  }}
                  required
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                  @bitscollege.edu.et
                </span>
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-3">
              <label htmlFor="role" className="text-sm font-medium text-gray-700">
                Role
              </label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value })
                }
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

            <div className="space-y-3">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange(e, "password")}
                  className="py-6 px-4 pr-12"
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5 text-gray-500" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
              {errors.password && (
                <div className="space-y-1">
                  {errors.password.map((error, index) => (
                    <p key={index} className="text-sm text-red-500">
                      {error}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange(e, "confirmPassword")}
                className="py-6 px-4"
                required
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            <Button type="submit" className="w-full py-6">
              Create Account
            </Button>

            <div className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Button
                variant="link"
                className="p-0"
                onClick={() => navigate("/login")}
              >
                Sign in
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
