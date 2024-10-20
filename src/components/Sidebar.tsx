import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileText, Image as ImageIcon, LayoutDashboard, MessageSquare, Settings, Users, Bell, LogOut, Calendar as CalendarIcon } from "lucide-react"
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

  const handleLogout = () => {
    setCurrentUser(null);
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-gray-900 text-white flex-shrink-0 flex flex-col">
      <nav className="mt-6 flex-1 flex flex-col">
        <div className="flex-1">
          <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" onClick={() => onTabChange("Dashboard")} />
          <SidebarItem icon={<CalendarIcon size={20} />} label="Calendar" onClick={() => onTabChange("Calendar")} />
          <SidebarItem icon={<Users size={20} />} label="Users" />
          
          <div className="my-2 mx-auto border-t border-gray-700 w-4/5"></div>
          
          <SidebarItem icon={<FileText size={20} />} label="Documents" />
          <SidebarItem icon={<ImageIcon size={20} />} label="Photos" />
          
          <div className="my-2 mx-auto border-t border-gray-700 w-4/5"></div>
          
          <SidebarItem icon={<Users size={20} />} label="Upcoming Tasks" />
          <SidebarItem icon={<MessageSquare size={20} />} label="Messages" />
          <SidebarItem icon={<Bell size={20} />} label="Announcements" />
          <SidebarItem icon={<Users size={20} />} label="Reports" />
          
          <div className="my-2 mx-auto border-t border-gray-700 w-4/5"></div>
          
          <SidebarItem icon={<Settings size={20} />} label="Settings" />
        </div>
        
        <div className="p-4">
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
        </div>
      </nav>
    </aside>
  )
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active = false, onClick }) => {
  return (
    <div
      className={`flex items-center py-3 px-6 hover:bg-gray-800 cursor-pointer ${
        active ? 'border-r-4 border-[#7EC143]' : ''
      }`}
      onClick={onClick}
    >
      <span className={`mr-4 ${active ? 'text-[#7EC143]' : 'text-white'}`}>{icon}</span>
      <span className={`text-sm ${active ? 'font-semibold text-[#7EC143]' : 'text-white'}`}>{label}</span>
    </div>
  )
}

export default Sidebar