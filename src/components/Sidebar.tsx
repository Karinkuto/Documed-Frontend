import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Settings,
  Users,
  Bell,
  LogOut as LogOutIcon,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  FileText,
  Home,
  ClipboardList,
  AlertCircle,
  UserCog,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
}

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

interface SidebarGroup {
  label?: string;
  items: {
    icon: React.ReactNode;
    label: string;
    path: string;
    roles?: string[];
    badge?: string;
    badgeVariant?: "default" | "secondary" | "destructive" | "outline";
  }[];
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log('Sidebar mounted, user data:', user);
  }, [user]);

  const handleLogout = async () => {
    console.log('Logging out user');
    await logout();
    navigate("/login");
  };

  const sidebarGroups: SidebarGroup[] = [
    {
      label: "Overview",
      items: [
        {
          icon: <Home className="h-5 w-5" />,
          label: "Home",
          path: "/dashboard",
        },
        {
          icon: <CalendarIcon className="h-5 w-5" />,
          label: "Calendar",
          path: "/calendar",
          badge: "New",
          badgeVariant: "default",
        },
      ],
    },
    {
      label: "Medical Management",
      items: [
        {
          icon: <ClipboardList className="h-5 w-5" />,
          label: "Medical Records",
          path: "/medical-repository",
          roles: ["Admin", "Medical", "Staff"],
        },
        {
          icon: <Users className="h-5 w-5" />,
          label: "Users",
          path: "/users",
          roles: ["Admin", "Medical"],
          badge: user?.role === "Admin" ? "12 new" : undefined,
          badgeVariant: "secondary",
        },
      ],
    },
    {
      label: "Communication",
      items: [
        {
          icon: <Bell className="h-5 w-5" />,
          label: "Announcements",
          path: "/announcements",
          badge: "3",
          badgeVariant: "destructive",
        },
      ],
    },
    {
      label: "Settings",
      items: [
        {
          icon: <Settings className="h-5 w-5" />,
          label: "Settings",
          path: "/settings",
        },
      ],
    },
  ];

  if (!mounted) {
    return null;
  }

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "bg-[#111827] h-[calc(100vh-80px)] relative transition-all duration-300 group",
          isCollapsed ? "w-[70px]" : "w-[240px]",
        )}
      >
        {/* Collapse Toggle Button */}
        <button
          onClick={onToggle}
          className={cn(
            "absolute -right-3 top-4",
            "bg-[#111827] text-gray-400 hover:text-gray-100",
            "w-6 h-6 rounded-full flex items-center justify-center",
            "border-2 border-[#f3f4f6]",
            "transition-colors z-20"
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>

        <div className="flex flex-col h-full">
          <div className="flex-1 py-6 flex flex-col">
            <div className="px-4 mb-6 flex items-center justify-end">
            </div>

            <nav className="flex-1 px-2 space-y-6">
              {sidebarGroups.map((group, index) => {
                const filteredItems = group.items.filter(
                  (item) =>
                    !item.roles || (user?.role && item.roles.includes(user.role))
                );

                if (filteredItems.length === 0) return null;

                return (
                  <div key={index} className="space-y-2">
                    {!isCollapsed && group.label && (
                      <h3 className="px-3 text-sm font-medium text-gray-400">
                        {group.label}
                      </h3>
                    )}
                    {filteredItems.map((item) => (
                      <SidebarItem
                        key={item.path}
                        icon={item.icon}
                        label={item.label}
                        active={location.pathname === item.path}
                        onClick={() => navigate(item.path)}
                        isCollapsed={isCollapsed}
                        badge={item.badge}
                        badgeVariant={item.badgeVariant}
                      />
                    ))}
                  </div>
                );
              })}
            </nav>
          </div>

          <div className="p-4 border-t border-gray-700">
            <div className={cn(
              "flex items-center justify-between",
              !isCollapsed && "space-x-3"
            )}>
              <div className="flex items-center space-x-3 min-w-0">
                <Avatar className="shrink-0 h-10 w-10">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-gray-700 text-gray-200">
                    {user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {!isCollapsed && (
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-200 truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{user?.role}</p>
                  </div>
                )}
              </div>
              {!isCollapsed && (
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                  title="Logout"
                >
                  <LogOutIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  isCollapsed: boolean;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
}

function SidebarItem({
  icon,
  label,
  active = false,
  onClick,
  isCollapsed,
  badge,
  badgeVariant = "default",
}: SidebarItemProps) {
  // Helper function to determine badge classes based on variant
  const getBadgeClasses = (isCollapsed: boolean = false) => {
    const baseClasses = "shrink-0 font-medium";
    const collapsedClasses = isCollapsed ? "h-4 w-4 p-0 flex items-center justify-center rounded-full text-[10px]" : "";
    
    if (badgeVariant === "destructive") {
      return cn(baseClasses, collapsedClasses, "bg-red-500 text-white");
    }
    return cn(baseClasses, collapsedClasses, "bg-white text-black");
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            className={cn(
              "flex items-center w-full px-3 py-2.5 text-sm rounded-lg relative",
              "transition-colors group",
              active
                ? "bg-gray-700/50 text-[#7EC143] font-medium"
                : "text-gray-400 hover:bg-gray-700/50 hover:text-gray-100"
            )}
          >
            {active && (
              <div className="absolute right-0 top-0 w-1 h-full bg-[#7EC143] rounded-r-full" />
            )}
            <div className="flex items-center min-w-0 flex-1">
              <span className={cn(
                "shrink-0",
                active && "text-[#7EC143]",
                isCollapsed ? "mx-auto" : "mr-3"
              )}>{icon}</span>
              {!isCollapsed && (
                <span className="truncate">{label}</span>
              )}
            </div>
            {!isCollapsed && badge && (
              <Badge 
                variant={badgeVariant}
                className={cn("ml-3", getBadgeClasses())}
              >
                {badge}
              </Badge>
            )}
            {isCollapsed && badge && (
              <div className="absolute -right-1 -top-1">
                <Badge 
                  variant={badgeVariant}
                  className={getBadgeClasses(true)}
                >
                  {typeof badge === 'string' && badge.match(/^\d+$/) ? badge : '•'}
                </Badge>
              </div>
            )}
          </button>
        </TooltipTrigger>
        {isCollapsed && (
          <TooltipContent 
            side="right" 
            sideOffset={20}
            align="center"
            className="flex items-center gap-2 bg-gray-800 text-gray-100 border-gray-700 px-3 py-1.5 z-50"
          >
            <span className="text-sm whitespace-nowrap">{label}</span>
            {badge && (
              <Badge 
                variant={badgeVariant}
                className={cn("text-xs", getBadgeClasses())}
              >
                {badge}
              </Badge>
            )}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}

export default Sidebar;
