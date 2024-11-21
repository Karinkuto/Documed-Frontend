import { useState } from "react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Pin, MessageSquare, Paperclip } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { NewAnnouncementDialog } from "@/components/NewAnnouncementDialog";
import { AnnouncementComments } from "@/components/AnnouncementComments";
import { cn } from "@/lib/utils";
import { useUser } from "@/contexts/UserContext";

interface Comment {
  id: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  date: string;
  isPinned: boolean;
  category: "General" | "Medical" | "Academic" | "Emergency";
  comments: Comment[];
  commentsDisabled: boolean;
  priorityLevel: "low" | "medium" | "high";
  targetAudience: "all" | "students" | "faculty" | "staff";
  expirationDate: string | null;
  attachments: File[];
}

const FilterBadge = ({
  active,
  onClick,
  children,
  variant = "default",
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  variant?: "default" | "priority";
}) => {
  const getVariantStyles = () => {
    if (variant === "priority") {
      if (children === "High")
        return "border-red-100 text-red-700 hover:bg-red-50/50";
      if (children === "Medium")
        return "border-amber-100 text-amber-700 hover:bg-amber-50/50";
      if (children === "Low")
        return "border-green-100 text-green-700 hover:bg-green-50/50";
    }
    return "";
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "justify-center cursor-pointer transition-all duration-150",
        "rounded-md border hover:shadow-[0_1px_2px_rgba(0,0,0,0.05)]",
        "focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
        "focus-visible:ring-transparent focus-visible:ring-offset-transparent",
        "focus:ring-0 focus:ring-offset-0 focus:ring-transparent",
        active &&
          "bg-[#7EC143]/5 border-[#7EC143]/50 text-[#7EC143] shadow-[0_1px_2px_rgba(0,0,0,0.05)]",
        !active &&
          "hover:border-[#7EC143]/30 hover:text-[#7EC143]/80 hover:bg-[#7EC143]/5",
        getVariantStyles()
      )}
      onClick={onClick}
    >
      {children}
    </Badge>
  );
};

export default function Announcements() {
  useDocumentTitle("Announcements");
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useUser();

  const currentUser = {
    name: user?.fullName || "Anonymous",
    avatar: user?.avatar || "/avatars/default.jpg",
    role: user?.role || "User",
  };

  // Mock data for announcements
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: "1",
      title: "COVID-19 Vaccination Schedule Update",
      content:
        "New vaccination schedule for all students and faculty members. Please check your email for your designated time slot.",
      author: {
        name: "Dr. Sarah Wilson",
        avatar: "/avatars/sarah.jpg",
        role: "Medical Director",
      },
      date: "2024-03-15",
      isPinned: true,
      category: "Medical",
      comments: [
        {
          id: "1",
          content:
            "Great news! I'm excited to see the vaccination schedule update.",
          author: {
            name: "John Smith",
            avatar: "/avatars/john.jpg",
          },
          date: "2024-03-15",
        },
      ],
      commentsDisabled: false,
      priorityLevel: "medium",
      targetAudience: "all",
      expirationDate: null,
      attachments: [],
    },
    {
      id: "2",
      title: "Annual Medical Checkup Reminder",
      content:
        "All students must complete their annual medical checkup by the end of this month.",
      author: {
        name: "John Smith",
        avatar: "/avatars/john.jpg",
        role: "Health Coordinator",
      },
      date: "2024-03-14",
      isPinned: true,
      category: "Medical",
      comments: [
        {
          id: "2",
          content:
            "I'm on it! I'll make sure to complete my medical checkup by the end of this month.",
          author: {
            name: "Dr. Sarah Wilson",
            avatar: "/avatars/sarah.jpg",
          },
          date: "2024-03-14",
        },
      ],
      commentsDisabled: false,
      priorityLevel: "low",
      targetAudience: "all",
      expirationDate: null,
      attachments: [],
    },
    {
      id: "3",
      title: "New Medical Records System Training",
      content:
        "Mandatory training session for all medical staff on the new electronic health records system.",
      author: {
        name: "Admin",
        avatar: "/avatars/admin.jpg",
        role: "System Administrator",
      },
      date: "2024-03-13",
      isPinned: false,
      category: "General",
      comments: [
        {
          id: "3",
          content:
            "I'm looking forward to the training session. I'm sure it will be very informative.",
          author: {
            name: "Dr. Sarah Wilson",
            avatar: "/avatars/sarah.jpg",
          },
          date: "2024-03-13",
        },
      ],
      commentsDisabled: false,
      priorityLevel: "high",
      targetAudience: "faculty",
      expirationDate: "2024-04-13",
      attachments: [],
    },
  ]);

  const getCategoryColor = (category: Announcement["category"]) => {
    switch (category) {
      case "Medical":
        return "bg-blue-100 text-blue-800";
      case "Academic":
        return "bg-purple-100 text-purple-800";
      case "Emergency":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const [selectedCategory, setSelectedCategory] = useState<
    Announcement["category"] | "All"
  >("All");

  const [priorityFilter, setPriorityFilter] = useState<
    "all" | "low" | "medium" | "high"
  >("all");
  const [showPinned, setShowPinned] = useState(false);
  const [targetAudienceFilter, setTargetAudienceFilter] = useState<
    "all" | "students" | "faculty" | "staff"
  >("all");
  const [timeFilter, setTimeFilter] = useState<
    "all" | "today" | "week" | "month"
  >("all");

  const filteredAnnouncements = announcements
    .filter((announcement) => {
      // Category filter
      const categoryMatch =
        selectedCategory === "All" ||
        announcement.category === selectedCategory;

      // Search filter
      const searchMatch =
        announcement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchQuery.toLowerCase());

      // Priority filter
      const priorityMatch =
        priorityFilter === "all" ||
        announcement.priorityLevel === priorityFilter;

      // Pinned filter
      const pinnedMatch = !showPinned || announcement.isPinned;

      // New filters
      const audienceMatch =
        targetAudienceFilter === "all" ||
        announcement.targetAudience === targetAudienceFilter;

      // Time filter
      const announcementDate = new Date(announcement.date);
      const today = new Date();
      const timeMatch =
        timeFilter === "all" ||
        (timeFilter === "today" &&
          announcementDate.toDateString() === today.toDateString()) ||
        (timeFilter === "week" &&
          today.getTime() - announcementDate.getTime() <=
            7 * 24 * 60 * 60 * 1000) ||
        (timeFilter === "month" &&
          announcementDate.getMonth() === today.getMonth());

      return (
        categoryMatch &&
        searchMatch &&
        priorityMatch &&
        pinnedMatch &&
        audienceMatch &&
        timeMatch
      );
    })
    .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  const togglePin = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((announcement) =>
        announcement.id === id
          ? { ...announcement, isPinned: !announcement.isPinned }
          : announcement
      )
    );
  };

  const [expandedAnnouncement, setExpandedAnnouncement] = useState<
    string | null
  >(null);

  const [expandedContent, setExpandedContent] = useState<string[]>([]);

  return (
    <div className="flex gap-6">
      {/* Main content column */}
      <div className="flex-1 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">Announcements</h1>
          <NewAnnouncementDialog
            currentUser={currentUser}
            onSubmit={(newAnnouncement) => {
              setAnnouncements((prev) => [
                {
                  id: String(Date.now()),
                  ...newAnnouncement,
                  isPinned: false,
                  comments: [],
                },
                ...prev,
              ]);
            }}
          />
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {filteredAnnouncements.map((announcement) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
              >
                <Card className="relative hover:shadow-sm hover:border-[#7EC143] transition-all duration-200 bg-white border-gray-100">
                  <CardContent className="p-5">
                    <div className="space-y-4">
                      {/* Header section with author info */}
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10 rounded-full">
                          <AvatarImage src={announcement.author.avatar} />
                          <AvatarFallback>
                            {announcement.author.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          {/* Author and role info */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-medium text-gray-900 truncate">
                                {announcement.author.name}
                              </span>
                              <span className="text-xs text-gray-500">·</span>
                              <span className="text-xs text-gray-500 truncate">
                                {announcement.author.role}
                              </span>
                            </div>

                            {/* Pin button */}
                            <div
                              className="cursor-pointer hover:text-[#7EC143] transition-colors"
                              onClick={() => togglePin(announcement.id)}
                            >
                              <Pin
                                className="h-4 w-4"
                                fill={
                                  announcement.isPinned ? "#7EC143" : "none"
                                }
                                color={
                                  announcement.isPinned ? "#7EC143" : "#6b7280"
                                }
                              />
                            </div>
                          </div>

                          {/* Main announcement content */}
                          <div className="py-3">
                            <h2 className="text-sm font-medium text-gray-900 mb-1.5">
                              {announcement.title}
                            </h2>
                            <div className="relative">
                              <div className="relative">
                                <p 
                                  className={cn(
                                    "text-sm text-gray-600 leading-normal",
                                    "overflow-hidden transition-all duration-300 ease-in-out",
                                    expandedContent.includes(announcement.id) 
                                      ? "max-h-[2000px] opacity-100"
                                      : announcement.content.length > 280 
                                        ? "max-h-[120px]"
                                        : "max-h-[2000px]"
                                  )}
                                >
                                  {announcement.content}
                                </p>
                                
                                {/* Fade overlay */}
                                <div 
                                  className={cn(
                                    "absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none",
                                    "transition-opacity duration-300 ease-in-out",
                                    expandedContent.includes(announcement.id) || announcement.content.length <= 280
                                      ? "opacity-0"
                                      : "opacity-100"
                                  )}
                                />
                              </div>
                              
                              {announcement.content.length > 280 && (
                                <button
                                  onClick={() => {
                                    setExpandedContent(prev =>
                                      prev.includes(announcement.id)
                                        ? prev.filter(id => id !== announcement.id)
                                        : [...prev, announcement.id]
                                    );
                                  }}
                                  className={cn(
                                    "text-xs font-medium text-gray-600 hover:text-gray-800",
                                    "bg-gray-100 hover:bg-gray-200",
                                    "px-3 py-1.5 rounded-md mt-2",
                                    "transition-colors duration-200"
                                  )}
                                >
                                  {expandedContent.includes(announcement.id) ? "Show less" : "Show more"}
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Attachments */}
                          {announcement.attachments?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3 border-t border-gray-100 pt-3">
                              {announcement.attachments.map(
                                (attachment, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 
                                           px-2.5 py-1 rounded-full text-xs transition-colors cursor-pointer"
                                  >
                                    <Paperclip className="h-3.5 w-3.5 text-gray-500" />
                                    <span className="text-gray-700">
                                      {attachment.name}
                                    </span>
                                  </div>
                                )
                              )}
                            </div>
                          )}

                          {/* Bottom section with engagement and metadata */}
                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            {/* Engagement section on the left */}
                            <div
                              className={cn(
                                "flex items-center gap-1.5 transition-colors",
                                !announcement.commentsDisabled &&
                                  "cursor-pointer hover:text-[#7EC143]"
                              )}
                              onClick={() => {
                                if (!announcement.commentsDisabled) {
                                  setExpandedAnnouncement(
                                    expandedAnnouncement === announcement.id
                                      ? null
                                      : announcement.id
                                  );
                                }
                              }}
                            >
                              <MessageSquare className="h-4 w-4" />
                              <span className="text-xs text-gray-600">
                                {announcement.commentsDisabled
                                  ? "Comments disabled"
                                  : `${announcement.comments.length} ${
                                      announcement.comments.length === 1
                                        ? "comment"
                                        : "comments"
                                    }`}
                              </span>
                            </div>

                            {/* Metadata section on the right */}
                            <div className="flex items-center gap-2">
                              <Badge
                                className={cn(
                                  "text-xs rounded-full px-2 py-0.5",
                                  {
                                    "bg-gray-100 text-gray-700":
                                      announcement.priorityLevel === "low",
                                    "bg-amber-100 text-amber-700":
                                      announcement.priorityLevel === "medium",
                                    "bg-red-100 text-red-700":
                                      announcement.priorityLevel === "high",
                                  }
                                )}
                              >
                                {announcement.priorityLevel
                                  .charAt(0)
                                  .toUpperCase() +
                                  announcement.priorityLevel.slice(1)}
                              </Badge>

                              <Badge className="text-xs bg-blue-100 text-blue-700 rounded-full px-2 py-0.5">
                                {announcement.targetAudience
                                  .charAt(0)
                                  .toUpperCase() +
                                  announcement.targetAudience.slice(1)}
                              </Badge>

                              <Badge
                                className={cn(
                                  "text-xs rounded-full px-2 py-0.5",
                                  getCategoryColor(announcement.category)
                                )}
                              >
                                {announcement.category}
                              </Badge>

                              <span className="text-xs text-gray-500 ml-2">
                                {new Date(
                                  announcement.date
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  {!announcement.commentsDisabled && (
                    <AnnouncementComments
                      comments={announcement.comments}
                      isExpanded={expandedAnnouncement === announcement.id}
                      onAddComment={(content) => {
                        setAnnouncements((prev) =>
                          prev.map((a) => {
                            if (a.id === announcement.id) {
                              return {
                                ...a,
                                comments: [
                                  ...a.comments,
                                  {
                                    id: String(Date.now()),
                                    content,
                                    author: {
                                      name: "Current User", // Replace with actual user data
                                      avatar: "/avatars/default.jpg",
                                    },
                                    date: new Date().toISOString(),
                                  },
                                ],
                              };
                            }
                            return a;
                          })
                        );
                      }}
                    />
                  )}
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Right sidebar with filters */}
      <div className="w-80 space-y-4">
        <Card className="sticky top-4 rounded-lg border-gray-100">
          <CardContent className="p-5 space-y-6">
            {/* Search */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2.5">
                Search Announcements
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Type to search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-white border-gray-200 rounded-md h-9 transition-all duration-150
                           focus:ring-0 focus:border-gray-300 hover:border-gray-300
                           focus-visible:ring-0 focus-visible:ring-offset-0
                           focus:outline-none focus-visible:ring-transparent"
                />
              </div>
            </div>

            {/* View options */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2.5">
                View Mode
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <FilterBadge
                  active={!showPinned}
                  onClick={() => setShowPinned(false)}
                >
                  All Posts
                </FilterBadge>
                <FilterBadge
                  active={showPinned}
                  onClick={() => setShowPinned(true)}
                >
                  Pinned Only
                </FilterBadge>
              </div>
            </div>

            {/* Time filter */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2.5">
                Time Period
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "All Time", value: "all" },
                  { label: "Today", value: "today" },
                  { label: "This Week", value: "week" },
                  { label: "This Month", value: "month" },
                ].map((period) => (
                  <FilterBadge
                    key={period.value}
                    active={timeFilter === period.value}
                    onClick={() =>
                      setTimeFilter(period.value as typeof timeFilter)
                    }
                  >
                    {period.label}
                  </FilterBadge>
                ))}
              </div>
            </div>

            {/* Priority Level */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2.5">
                Priority Level
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "All", value: "all" },
                  { label: "Low", value: "low" },
                  { label: "Medium", value: "medium" },
                  { label: "High", value: "high" },
                ].map((priority) => (
                  <FilterBadge
                    key={priority.value}
                    active={priorityFilter === priority.value}
                    onClick={() =>
                      setPriorityFilter(priority.value as typeof priorityFilter)
                    }
                    variant="priority"
                  >
                    {priority.label}
                  </FilterBadge>
                ))}
              </div>
            </div>

            {/* Target Audience */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2.5">
                Target Audience
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "All", value: "all" },
                  { label: "Students", value: "students" },
                  { label: "Faculty", value: "faculty" },
                  { label: "Staff", value: "staff" },
                ].map((audience) => (
                  <FilterBadge
                    key={audience.value}
                    active={targetAudienceFilter === audience.value}
                    onClick={() =>
                      setTargetAudienceFilter(
                        audience.value as typeof targetAudienceFilter
                      )
                    }
                  >
                    {audience.label}
                  </FilterBadge>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2.5">
                Category
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {["All", "General", "Medical", "Academic", "Emergency"].map(
                  (category) => (
                    <FilterBadge
                      key={category}
                      active={selectedCategory === category}
                      onClick={() =>
                        setSelectedCategory(category as typeof selectedCategory)
                      }
                    >
                      {category}
                    </FilterBadge>
                  )
                )}
              </div>
            </div>

            {/* Reset filters button */}
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setPriorityFilter("all");
                setShowPinned(false);
                setTargetAudienceFilter("all");
                setTimeFilter("all");
              }}
              className="w-full px-4 py-2 text-sm font-medium text-[#7EC143] border border-[#7EC143]/50 
                         hover:bg-[#7EC143]/5 rounded-md transition-all duration-150 
                         hover:shadow-[0_1px_2px_rgba(0,0,0,0.05)] mt-2"
            >
              Reset All Filters
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
