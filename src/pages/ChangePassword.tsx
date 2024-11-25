import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { validatePassword } from "@/utils/auth";

export default function ChangePassword() {
  useDocumentTitle("Change Password");
  const navigate = useNavigate();
  const { user } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string[];
    confirmPassword?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};

    // Validate new password
    const { isValid, errors: passwordErrors } = validatePassword(formData.newPassword);
    if (!isValid) {
      newErrors.newPassword = passwordErrors;
    }

    // Confirm password validation
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
      // TODO: Replace with actual API call
      // await changePassword({
      //   userId: user.id,
      //   currentPassword: formData.currentPassword,
      //   newPassword: formData.newPassword,
      // });

      // Navigate to dashboard after successful password change
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to change password:", error);
      setErrors({
        currentPassword: "Current password is incorrect",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-10">
          <h2 className="text-3xl font-semibold mb-8">Change Password</h2>
          <p className="text-gray-500 mb-6">
            Your password must be changed before continuing.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label
                htmlFor="currentPassword"
                className="text-sm font-medium text-gray-700"
              >
                Current Password
              </label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, currentPassword: e.target.value })
                  }
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
              {errors.currentPassword && (
                <p className="text-sm text-red-500">{errors.currentPassword}</p>
              )}
            </div>

            <div className="space-y-3">
              <label
                htmlFor="newPassword"
                className="text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, newPassword: e.target.value })
                  }
                  className="py-6 px-4 pr-12"
                  required
                />
              </div>
              {errors.newPassword && (
                <div className="space-y-1">
                  {errors.newPassword.map((error, index) => (
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
                Confirm New Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="py-6 px-4"
                required
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            <Button type="submit" className="w-full py-6">
              Change Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
