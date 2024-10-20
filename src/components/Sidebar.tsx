import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileText, Image as ImageIcon, LayoutDashboard, MessageSquare, Settings, Users, Bell, LogOut, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { getCurrentUser, setCurrentUser } from "@/utils/auth"

function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
}

interface SidebarProps {
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onTabChange }) => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");

  const handleLogout = () => {
    setCurrentUser(null);
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  return (
    <aside className={`bg-gray-900 text-white flex-shrink-0 flex flex-col relative transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <nav className="mt-6 flex-1 flex flex-col overflow-hidden">
        <div className="flex-1">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" onClick={() => handleTabChange("Dashboard")} isCollapsed={isCollapsed} active={activeTab === "Dashboard"} />
          <SidebarItem icon={<CalendarIcon size={20} />} label="Calendar" onClick={() => handleTabChange("Calendar")} isCollapsed={isCollapsed} active={activeTab === "Calendar"} />
          <SidebarItem icon={<Users size={20} />} label="Users" onClick={() => handleTabChange("Users")} isCollapsed={isCollapsed} active={activeTab === "Users"} />
          
          <div className="my-2 mx-auto border-t border-gray-700 w-4/5"></div>
          
          <SidebarItem icon={<FileText size={20} />} label="Documents" isCollapsed={isCollapsed} active={activeTab === "Documents"} onClick={() => handleTabChange("Documents")} />
          <SidebarItem icon={<ImageIcon size={20} />} label="Photos" isCollapsed={isCollapsed} active={activeTab === "Photos"} onClick={() => handleTabChange("Photos")} />
          
          <div className="my-2 mx-auto border-t border-gray-700 w-4/5"></div>
          
          <SidebarItem icon={<Users size={20} />} label="Upcoming Tasks" isCollapsed={isCollapsed} active={activeTab === "Upcoming Tasks"} onClick={() => handleTabChange("Upcoming Tasks")} />
          <SidebarItem icon={<MessageSquare size={20} />} label="Messages" isCollapsed={isCollapsed} active={activeTab === "Messages"} onClick={() => handleTabChange("Messages")} />
          <SidebarItem icon={<Bell size={20} />} label="Announcements" isCollapsed={isCollapsed} active={activeTab === "Announcements"} onClick={() => handleTabChange("Announcements")} />
          <SidebarItem icon={<Users size={20} />} label="Reports" isCollapsed={isCollapsed} active={activeTab === "Reports"} onClick={() => handleTabChange("Reports")} />
          
          <div className="my-2 mx-auto border-t border-gray-700 w-4/5"></div>
          
          <SidebarItem icon={<Settings size={20} />} label="Settings" onClick={() => handleTabChange("Settings")} isCollapsed={isCollapsed} active={activeTab === "Settings"} />
        </div>
        
        <div className={`p-4 ${isCollapsed ? 'flex justify-center' : ''}`}>
          {isCollapsed ? (
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User avatar" />
              <AvatarFallback style={{ background: `linear-gradient(45deg, ${stringToColor(currentUser?.username || '')}, ${stringToColor(currentUser?.role || '')})` }}>
                {currentUser?.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="bg-white rounded-lg p-3 flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="mr-3">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User avatar" />
                  <AvatarFallback style={{ background: `linear-gradient(45deg, ${stringToColor(currentUser?.username || '')}, ${stringToColor(currentUser?.role || '')})` }}>
                    {currentUser?.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm text-gray-900">{currentUser?.username}</p>
                  <p className="text-xs text-gray-500">{currentUser?.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                title="Logout"
              >
                <LogOut size={20} strokeWidth={1.5} />
              </button>
            </div>
          )}
        </div>
      </nav>
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 bottom-[16%] bg-gray-900 text-white rounded-full p-1 border-2 border-[#f3f4f6] transition-transform duration-300 ease-in-out hover:scale-110"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  )
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  isCollapsed: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active = false, onClick, isCollapsed }) => {
  return (
    <div
      className={`flex items-center h-10 cursor-pointer hover:bg-gray-800 transition-all duration-300 ease-in-out ${
        active ? 'border-r-4 border-[#7EC143] bg-gray-800' : 'border-r-4 border-transparent'
      }`}
      onClick={onClick}
    >
      <div className="w-20 flex justify-center items-center h-full">
        <span className={`${active ? 'text-[#7EC143]' : 'text-white'} transition-all duration-300 ease-in-out`}>{icon}</span>
      </div>
      <div className={`flex items-center h-full transition-all duration-300 ease-in-out ${isCollapsed ? 'w-0 opacity-0' : 'w-44 opacity-100'} overflow-hidden`}>
        <span className={`text-sm ${active ? 'font-semibold text-[#7EC143]' : 'text-white'} transition-all duration-300 ease-in-out`}>{label}</span>
      </div>
    </div>
  )
}

export default Sidebar
