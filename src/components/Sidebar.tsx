import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Settings,
  Users,
  Bell,
  LogOut,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { setCurrentUser } from "@/utils/auth";

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

// Add this new interface for sidebar groups
interface SidebarGroup {
  label?: string;
  items: {
    icon: React.ReactNode;
    label: string;
    path: string;
  }[];
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile } = useUser();

  const handleLogout = () => {
    setCurrentUser(null);
    navigate("/login");
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // Define sidebar navigation groups
  const sidebarGroups: SidebarGroup[] = [
    {
      label: "Main",
      items: [
        {
          icon: <LayoutDashboard size={20} />,
          label: "Dashboard",
          path: "/dashboard",
        },
        {
          icon: <CalendarIcon size={20} />,
          label: "Calendar",
          path: "/calendar",
        },
      ],
    },
    {
      label: "Management",
      items: [
        { icon: <Users size={20} />, label: "Users", path: "/users" },
        {
          icon: <FileText size={20} />,
          label: "Medical Repository",
          path: "/medical-repository",
        },
      ],
    },
    {
      label: "System",
      items: [
        {
          icon: <Bell size={20} />,
          label: "Announcements",
          path: "/announcements",
        },
        { icon: <Settings size={20} />, label: "Settings", path: "/settings" },
      ],
    },
  ];

  return (
    <aside
      className={`bg-gray-900 text-white flex-shrink-0 flex flex-col relative transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <nav className="mt-6 flex-1 flex flex-col overflow-hidden">
        <div className="flex-1">
          {sidebarGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-6">
              <div
                className={`px-4 mb-2 h-6 transition-all duration-300 ease-in-out ${
                  isCollapsed ? "opacity-0" : "opacity-100"
                }`}
              >
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {group.label}
                </span>
              </div>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <SidebarItem
                    key={item.path}
                    icon={item.icon}
                    label={item.label}
                    onClick={() => handleNavigation(item.path)}
                    isCollapsed={isCollapsed}
                    active={location.pathname === item.path}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-3">
          <div
            className={`relative h-[68px] transition-all duration-300 ease-in-out ${
              !isCollapsed ? "bg-[#1f2937] rounded-lg p-4" : ""
            }`}
          >
            <div className="absolute left-2 bottom-3">
              <Avatar>
                <AvatarImage src={userProfile.avatar} alt="User avatar" />
                <AvatarFallback
                  style={{
                    background: `linear-gradient(45deg, ${stringToColor(
                      userProfile.username
                    )}, ${stringToColor(userProfile.role)})`,
                  }}
                >
                  {userProfile.username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-[32px]" />
                <div
                  className={`ml-3 transition-all duration-300 ease-in-out overflow-hidden ${
                    isCollapsed ? "w-0 opacity-0" : "w-32 opacity-100"
                  }`}
                >
                  <p className="font-semibold text-sm text-white whitespace-nowrap">
                    {userProfile.fullName}
                  </p>
                  <p className="text-xs text-gray-500 text-white whitespace-nowrap">
                    {userProfile.role}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className={`text-gray-400 hover:text-red-500 transition-all duration-300 ease-in-out ${
                  isCollapsed ? "w-0 opacity-0" : "w-8 opacity-100"
                }`}
                title="Logout"
              >
                <LogOut size={20} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </nav>
      <button
        onClick={onToggle}
        className="absolute -right-3 bottom-[16%] bg-gray-900 text-white rounded-full p-1 border-2 border-[#f3f4f6] transition-transform duration-300 ease-in-out hover:scale-110"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  isCollapsed: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  active = false,
  onClick,
  isCollapsed,
}) => {
  return (
    <div
      className={`flex items-center h-10 cursor-pointer hover:bg-gray-800 transition-all duration-300 ease-in-out ${
        active
          ? "border-r-4 border-[#7EC143] bg-gray-800"
          : "border-r-4 border-transparent"
      }`}
      onClick={onClick}
    >
      <div className="w-20 flex justify-center items-center h-full">
        <span
          className={`${
            active ? "text-[#7EC143]" : "text-white"
          } transition-colors duration-300 ease-in-out`}
        >
          {icon}
        </span>
      </div>
      <div
        className={`flex items-center h-full transition-all duration-300 ease-in-out overflow-hidden ${
          isCollapsed ? "w-0 opacity-0" : "w-44 opacity-100"
        }`}
      >
        <span
          className={`text-sm whitespace-nowrap ${
            active ? "font-semibold text-[#7EC143]" : "text-white"
          } transition-colors duration-300 ease-in-out`}
        >
          {label}
        </span>
      </div>
    </div>
  );
};

export default Sidebar;
