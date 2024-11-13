import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContainer,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/AnimatedDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Smile, Paperclip, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface EmojiData {
  native: string;
}

interface NewAnnouncementDialogProps {
  onSubmit: (announcement: {
    title: string;
    content: string;
    category: "General" | "Medical" | "Academic" | "Emergency";
    commentsDisabled: boolean;
    targetAudience: "all" | "students" | "faculty" | "staff";
    author: {
      name: string;
      avatar: string;
      role: string;
    };
    date: string;
    priorityLevel: "low" | "medium" | "high";
    expirationDate: string | null;
    attachments: File[];
  }) => void;
  currentUser: {
    name: string;
    avatar: string;
    role: string;
  };
}

type DatePickerProps = {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
};

function DatePicker({ date, setDate }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal bg-[#374151] border-0 text-gray-200 hover:bg-gray-700 hover:text-gray-200",
            !date && "text-gray-400"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

export function NewAnnouncementDialog({
  onSubmit,
  currentUser,
}: NewAnnouncementDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<
    "General" | "Medical" | "Academic" | "Emergency"
  >("General");
  const [commentsDisabled, setCommentsDisabled] = useState(false);
  const [targetAudience, setTargetAudience] = useState<
    "all" | "students" | "faculty" | "staff"
  >("all");
  const [priorityLevel, setPriorityLevel] = useState<"low" | "medium" | "high">(
    "low"
  );
  const [expirationDate, setExpirationDate] = useState<Date>();
  const [attachments, setAttachments] = useState<File[]>([]);

  const getDefaultExpirationDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7); // 7 days from now
    return date.toISOString().slice(0, 16);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Required fields missing", {
        description: "Please fill in both title and content.",
      });
      return;
    }

    try {
      await onSubmit({
        title,
        content,
        category,
        commentsDisabled,
        targetAudience,
        priorityLevel,
        expirationDate: expirationDate
          ? expirationDate.toISOString()
          : getDefaultExpirationDate(),
        attachments,
        author: currentUser,
        date: new Date().toISOString(),
      });

      // Reset form
      resetForm();

      // Close dialog
      setIsOpen(false);

      // Show success toast after dialog closes
      toast.success("Announcement published successfully", {
        description: "Your announcement has been shared with the team.",
      });
    } catch (error) {
      console.error("Failed to submit announcement:", error);
      toast.error("Failed to publish announcement", {
        description: "Please try again later.",
      });
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setCategory("General");
    setCommentsDisabled(false);
    setTargetAudience("all");
    setPriorityLevel("low");
    setExpirationDate(undefined);
    setAttachments([]);
  };

  const addEmoji = (emoji: EmojiData) => {
    const cursorPosition =
      (document.querySelector("textarea") as HTMLTextAreaElement)
        ?.selectionStart || content.length;
    const textBeforeCursor = content.slice(0, cursorPosition);
    const textAfterCursor = content.slice(cursorPosition);
    setContent(textBeforeCursor + emoji.native + textAfterCursor);
  };

  const getCategoryColor = (cat: typeof category) => {
    switch (cat) {
      case "Medical":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "Academic":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "Emergency":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#7EC143] hover:bg-[#7EC143]/90">
          <Plus className="mr-2 h-4 w-4" />
          New Announcement
        </Button>
      </DialogTrigger>

      <DialogContainer>
        <DialogContent className="bg-white rounded-xl shadow-lg w-full max-w-6xl p-0 overflow-hidden max-h-[90vh]">
          {/* Header with actions */}
          <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
            <DialogTitle className="flex-1">
              <h2 className="text-xl font-bold">Create New Announcement</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Share important updates
              </p>
            </DialogTitle>
            <div className="flex items-center gap-2">
              <DialogClose>
                <Button
                  type="button"
                  variant="outline"
                  size="default"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                size="default"
                className="bg-[#7EC143] hover:bg-[#7EC143]/90 min-w-[100px] mx-20"
                onClick={handleSubmit}
              >
                Publish
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-5 gap-6 p-6">
              {/* Left Column - Settings (2/5 width) */}
              <div className="col-span-2">
                <div className="bg-[#1F2937] p-4 rounded-xl space-y-4">
                  {/* Category */}
                  <div>
                    <h3 className="text-xs font-medium text-white mb-2">
                      Category
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {["General", "Medical", "Academic", "Emergency"].map(
                        (cat) => (
                          <Badge
                            key={cat}
                            variant={category === cat ? "default" : "outline"}
                            className={cn(
                              "cursor-pointer px-3 py-1 text-xs transition-colors",
                              category === cat
                                ? getCategoryColor(cat as typeof category)
                                : "hover:bg-gray-700 border-gray-600 text-gray-200"
                            )}
                            onClick={() => setCategory(cat as typeof category)}
                          >
                            {cat}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>

                  {/* Settings */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-medium text-white">Settings</h3>
                    <div className="flex items-center space-x-2 bg-[#374151] p-2 rounded-lg">
                      <Switch
                        id="comments-disabled"
                        checked={commentsDisabled}
                        onCheckedChange={setCommentsDisabled}
                      />
                      <Label
                        htmlFor="comments-disabled"
                        className="text-xs text-gray-300"
                      >
                        Disable comments for this announcement
                      </Label>
                    </div>
                  </div>

                  {/* Priority Level */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-medium text-white">
                      Priority Level
                    </h3>
                    <div className="flex gap-2">
                      {[
                        {
                          value: "low",
                          label: "Low",
                          color: "bg-gray-600/20 text-gray-200",
                        },
                        {
                          value: "medium",
                          label: "Medium",
                          color: "bg-yellow-600/20 text-yellow-200",
                        },
                        {
                          value: "high",
                          label: "High",
                          color: "bg-red-600/20 text-red-200",
                        },
                      ].map(({ value, label, color }) => (
                        <Badge
                          key={value}
                          variant="outline"
                          className={cn(
                            "cursor-pointer flex-1 justify-center px-4 py-1.5 text-xs transition-colors",
                            priorityLevel === value
                              ? color
                              : "hover:bg-gray-700 border-gray-600 text-gray-200"
                          )}
                          onClick={() =>
                            setPriorityLevel(value as "low" | "medium" | "high")
                          }
                        >
                          {label}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Target Audience */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-medium text-white">
                      Target Audience
                    </h3>
                    <RadioGroup
                      value={targetAudience}
                      onValueChange={(value: typeof targetAudience) =>
                        setTargetAudience(value)
                      }
                      className="grid grid-cols-2 gap-2"
                    >
                      {[
                        { value: "all", label: "All Users", icon: "🌐" },
                        {
                          value: "students",
                          label: "Students Only",
                          icon: "👨‍🎓",
                        },
                        { value: "faculty", label: "Faculty Only", icon: "👨‍🏫" },
                        { value: "staff", label: "Staff Only", icon: "👥" },
                      ].map(({ value, label, icon }) => (
                        <Label
                          key={value}
                          className={cn(
                            "flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-colors",
                            targetAudience === value
                              ? "bg-[#374151] border-2 border-[#7EC143]"
                              : "bg-[#374151]/80 border-2 border-transparent hover:bg-[#374151]"
                          )}
                        >
                          <RadioGroupItem
                            value={value}
                            id={value}
                            className="sr-only"
                          />
                          <span className="text-sm">{icon}</span>
                          <span className="text-xs font-medium text-gray-200">
                            {label}
                          </span>
                        </Label>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Note */}
                  <div>
                    <h3 className="text-xs font-medium text-white mb-1">
                      Note
                    </h3>
                    <p className="text-xs text-gray-300">
                      {targetAudience === "all"
                        ? "This announcement will be visible to all users immediately after posting."
                        : `This announcement will only be visible to ${targetAudience} immediately after posting.`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column - Content (3/5 width) */}
              <div className="col-span-3 flex flex-col h-full">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title
                  </label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a descriptive title"
                    className="h-9 focus-visible:ring-0 focus-visible:ring-offset-0"
                    required
                  />
                </div>

                <div className="flex-1 mt-4">
                  <label className="block text-sm font-medium mb-1">
                    Content
                  </label>
                  <div
                    className={cn(
                      "relative rounded-xl border bg-white h-[calc(100%-2rem)]"
                    )}
                  >
                    <Textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write your announcement here..."
                      className="h-full min-h-0 border-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none rounded-xl text-sm"
                      data-gramm="false"
                      data-gramm_editor="false"
                      data-enable-grammarly="false"
                      required
                    />

                    {attachments.length > 0 && (
                      <div className="absolute bottom-2 left-2 flex flex-wrap gap-1 max-w-[70%]">
                        {attachments.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1.5 bg-[#1F2937] px-2 py-1 rounded-md text-xs group"
                          >
                            <Paperclip className="h-3 w-3 text-gray-400" />
                            <span className="truncate max-w-[150px] text-gray-200">
                              {file.name}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAttachment(index)}
                              className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-600 rounded-full text-gray-400"
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="absolute bottom-2 right-2 flex gap-1">
                      {/* Archive Date Button */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 relative"
                          >
                            <Clock className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                            {expirationDate && (
                              <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#7EC143] rounded-full" />
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-auto p-4 bg-[#1F2937] border-gray-700"
                          side="bottom"
                          align="end"
                          sideOffset={5}
                          style={{ zIndex: 9999 }}
                        >
                          <div className="space-y-3">
                            <h3 className="text-xs font-medium text-white">
                              Archive Date
                            </h3>
                            <Calendar
                              mode="single"
                              selected={expirationDate}
                              onSelect={setExpirationDate}
                              initialFocus
                              className="bg-[#374151] text-white rounded-lg"
                            />
                            {expirationDate && (
                              <div className="flex items-center gap-2">
                                <Input
                                  type="time"
                                  value={
                                    expirationDate
                                      ? format(expirationDate, "HH:mm")
                                      : ""
                                  }
                                  onChange={(e) => {
                                    if (expirationDate) {
                                      const [hours, minutes] =
                                        e.target.value.split(":");
                                      const newDate = new Date(expirationDate);
                                      newDate.setHours(
                                        parseInt(hours),
                                        parseInt(minutes)
                                      );
                                      setExpirationDate(newDate);
                                    }
                                  }}
                                  className="flex-1 bg-[#374151] border-0 text-gray-200"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setExpirationDate(undefined)}
                                  className="border-gray-600 text-gray-200 hover:bg-gray-700"
                                >
                                  Clear
                                </Button>
                              </div>
                            )}
                            <p className="text-xs text-gray-400">
                              {expirationDate
                                ? `Archives on ${format(
                                    expirationDate,
                                    "PPP"
                                  )} at ${format(expirationDate, "HH:mm")}`
                                : "Defaults to 7 days if not set"}
                            </p>
                          </div>
                        </PopoverContent>
                      </Popover>

                      {/* File Upload Button */}
                      <div className="relative">
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                        >
                          <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            multiple
                            onChange={handleFileUpload}
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                          />
                          <Paperclip className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                          {attachments.length > 0 && (
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#7EC143] rounded-full" />
                          )}
                        </Button>
                      </div>

                      {/* Emoji Picker */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                          >
                            <Smile className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-[352px] p-0"
                          side="top"
                          align="end"
                          sideOffset={5}
                          style={{ zIndex: 9999 }}
                        >
                          <div className="border rounded-lg bg-white shadow-lg">
                            <Picker
                              data={data}
                              onEmojiSelect={addEmoji}
                              theme="light"
                              previewPosition="none"
                              skinTonePosition="none"
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </DialogContent>
      </DialogContainer>
    </Dialog>
  );
}
