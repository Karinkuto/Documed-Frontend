import { useState } from "react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Bell, Lock, Globe, Sliders, User, Upload } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { stringToColor } from "@/utils/helpers";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function Settings() {
  useDocumentTitle("Settings");
  const [isSaving, setIsSaving] = useState(false);
  const { userProfile, updateUserProfile } = useUser();
  const [formData, setFormData] = useState({
    bio: "",
    phone: "",
    expertise: "general",
    isPublicProfile: false,
    isAvailableConsult: false,
  });

  const [bio, setBio] = useState("");

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateUserProfile({ fullName: e.target.value });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateUserProfile({ email: e.target.value });
  };

  const handleAvatarChange = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      updateUserProfile({ avatar: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update all form data at once
      updateUserProfile({
        ...userProfile,
        ...formData,
      });

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFormChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleCheckboxChange =
    (field: keyof typeof formData) => (checked: boolean) => {
      setFormData((prev) => ({
        ...prev,
        [field]: checked,
      }));
    };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">
          Manage your account preferences and system settings
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="general">
            <Globe className="w-4 h-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="w-4 h-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="system">
            <Sliders className="w-4 h-4 mr-2" />
            System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardContent className="p-6">
              {/* Profile Header */}
              <div className="mb-8">
                <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24">
                      <AvatarImage
                        src={userProfile.avatar}
                        alt="Profile picture"
                      />
                      <AvatarFallback
                        style={{
                          background: `linear-gradient(45deg, ${stringToColor(
                            userProfile.fullName || ""
                          )}, ${stringToColor("Administrator")})`,
                        }}
                      >
                        {userProfile.fullName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0 bg-white"
                      onClick={() =>
                        document.getElementById("avatar-upload")?.click()
                      }
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                    <input
                      type="file"
                      id="avatar-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleAvatarChange(file);
                        }
                      }}
                    />
                  </div>
                  <div className="text-center sm:text-left">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {userProfile.fullName}
                    </h2>
                    <p className="text-sm text-gray-500">{userProfile.email}</p>
                    <Badge variant="outline" className="mt-2">
                      Administrator
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator className="mb-8" />

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Left Column - Personal Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Personal Information
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="font-medium">
                          Full Name
                        </Label>
                        <Input
                          id="fullName"
                          value={userProfile.fullName}
                          onChange={handleFullNameChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="font-medium">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={userProfile.email}
                          onChange={handleEmailChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="font-medium">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Account Information
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="role" className="font-medium">
                          Role
                        </Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id="role"
                            value="Administrator"
                            disabled
                            className="bg-gray-50 max-w-md"
                          />
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700"
                          >
                            Active
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">
                          Your role determines your permissions within the
                          system
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="department" className="font-medium">
                          Department
                        </Label>
                        <Select defaultValue="medical">
                          <SelectTrigger className="max-w-md">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="medical">
                              Medical Staff
                            </SelectItem>
                            <SelectItem value="admin">
                              Administration
                            </SelectItem>
                            <SelectItem value="it">IT Department</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Additional Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Additional Information
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="bio" className="font-medium">
                          Bio
                        </Label>
                        <textarea
                          id="bio"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          className="min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Tell us about yourself..."
                        />
                        <p className="text-sm text-gray-500">
                          Brief description for your profile. URLs are
                          hyperlinked.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="expertise" className="font-medium">
                          Areas of Expertise
                        </Label>
                        <Select defaultValue="general">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">
                              General Medicine
                            </SelectItem>
                            <SelectItem value="pediatrics">
                              Pediatrics
                            </SelectItem>
                            <SelectItem value="cardiology">
                              Cardiology
                            </SelectItem>
                            <SelectItem value="neurology">Neurology</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="font-medium">Preferences</Label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="public-profile" />
                            <Label htmlFor="public-profile">
                              Make profile public
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="available-consult" />
                            <Label htmlFor="available-consult">
                              Available for consultation
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-8" />

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  type="button"
                  disabled={isSaving}
                  onClick={() => {
                    // Reset form to original values
                    setFormData({
                      bio: userProfile.bio || "",
                      phone: userProfile.phone || "",
                      expertise: userProfile.expertise || "general",
                      isPublicProfile: userProfile.isPublicProfile || false,
                      isAvailableConsult:
                        userProfile.isAvailableConsult || false,
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general">
          <Card>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-2">
                <Label>Language</Label>
                <Select
                  value={userProfile.language}
                  onValueChange={(value) =>
                    updateUserProfile({ language: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select
                  value={userProfile.timezone}
                  onValueChange={(value) =>
                    updateUserProfile({ timezone: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC+8">
                      UTC+8 (Singapore/Manila)
                    </SelectItem>
                    <SelectItem value="UTC+0">UTC+0 (London)</SelectItem>
                    <SelectItem value="UTC-5">UTC-5 (New York)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div>
                  {/* User Updates Section */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">User updates</h3>
                      <p className="text-sm text-muted-foreground">
                        How frequent do you want to get updates on user activity
                        and status
                      </p>
                    </div>
                    <RadioGroup defaultValue="daily" className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="daily" id="daily" />
                        <Label htmlFor="daily">Daily</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="weekly" id="weekly" />
                        <Label htmlFor="weekly">Weekly</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="monthly" id="monthly" />
                        <Label htmlFor="monthly">Monthly</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Separator className="my-6" />

                  {/* Platform Section */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Platform</h3>
                      <p className="text-sm text-muted-foreground">
                        Via what platforms do you want to get the Notification
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>E-mail</Label>
                        <Switch
                          checked={userProfile.emailNotifications}
                          onCheckedChange={(checked) =>
                            updateUserProfile({ emailNotifications: checked })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>SMS</Label>
                        <Switch
                          checked={userProfile.smsNotifications}
                          onCheckedChange={(checked) =>
                            updateUserProfile({ smsNotifications: checked })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Tasks Reminder Section */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Tasks Reminder</h3>
                      <p className="text-sm text-muted-foreground">
                        How often should the user be reminded of there tasks
                      </p>
                    </div>
                    <RadioGroup defaultValue="daily" className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="daily" id="tasks-daily" />
                        <Label htmlFor="tasks-daily">Daily</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="weekly" id="tasks-weekly" />
                        <Label htmlFor="tasks-weekly">Weekly</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="monthly" id="tasks-monthly" />
                        <Label htmlFor="tasks-monthly">Monthly</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                {/* Right Column with vertical separator */}
                <div className="relative pl-8 border-l">
                  <h3 className="text-lg font-semibold">Notify me when</h3>
                  <div className="space-y-4 mt-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="roles" defaultChecked />
                      <Label htmlFor="roles">Role and Permission Changes</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="submissions" defaultChecked />
                      <Label htmlFor="submissions">
                        Users have submitted there required information
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="security" defaultChecked />
                      <Label htmlFor="security">
                        Password changes and resets
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="logins" defaultChecked />
                      <Label htmlFor="logins">Successful logins</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="updates" defaultChecked />
                      <Label htmlFor="updates">Application Updates</Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-6 mt-6 border-t">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardContent className="space-y-6 p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Label>Two-Factor Authentication</Label>
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800"
                    >
                      Recommended
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch
                  checked={userProfile.twoFactorAuth}
                  onCheckedChange={(checked) =>
                    updateUserProfile({ twoFactorAuth: checked })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Change Password</Label>
                <div className="space-y-2">
                  <Input type="password" placeholder="Current password" />
                  <Input type="password" placeholder="New password" />
                  <Input type="password" placeholder="Confirm new password" />
                  <Button className="mt-2">Update Password</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-2">
                <Label>Data Retention Period</Label>
                <Select defaultValue="90">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">180 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Export Data</Label>
                <p className="text-sm text-gray-500 mb-2">
                  Download all your system data in CSV format
                </p>
                <Button variant="outline">Export Data</Button>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium text-red-600 mb-2">
                  Danger Zone
                </h3>
                <Button variant="destructive">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
