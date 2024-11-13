import { Bell, CheckCheck, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "./ui/tooltip"

interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: "info" | "warning" | "success" | "error"
  avatar?: string
}

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Medical Record",
      message: "Dr. Sarah Wilson has uploaded a new medical record",
      time: "2 min ago",
      read: false,
      type: "info",
      avatar: "/avatars/sarah.jpg"
    },
    {
      id: "2",
      title: "Appointment Reminder",
      message: "You have an upcoming appointment tomorrow at 10:00 AM",
      time: "1 hour ago",
      read: false,
      type: "warning"
    },
    {
      id: "3",
      title: "System Update",
      message: "The system will undergo maintenance tonight",
      time: "2 hours ago",
      read: true,
      type: "info"
    }
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const clearAll = () => {
    setNotifications([])
  }

  const getTimeColor = (time: string) => {
    if (time.includes("min")) return "bg-green-50 text-green-600"
    if (time.includes("hour")) return "bg-orange-50 text-orange-600"
    return "bg-gray-50 text-gray-600"
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="relative hover:bg-gray-100/50 transition-colors"
        >
          <Bell className="text-gray-600 h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1.5 -right-1.5 h-4 min-w-[16px] px-1 flex items-center justify-center bg-red-500 text-[10px] font-medium shadow-sm"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-[380px] p-0 shadow-lg rounded-xl border-none bg-white/80 backdrop-blur-sm"
        sideOffset={8}
      >
        <div className="flex items-center justify-between p-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Notifications</h4>
            <p className="text-xs text-gray-500 mt-0.5">
              {unreadCount} unread {unreadCount === 1 ? 'message' : 'messages'}
            </p>
          </div>
          <div className="flex gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-gray-500 hover:text-gray-900 rounded-lg" 
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0}
                  >
                    <CheckCheck className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent 
                  side="bottom" 
                  className="bg-gray-900 text-white text-xs px-2 py-1"
                >
                  Mark all as read
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-gray-500 hover:text-gray-900 rounded-lg" 
                    onClick={clearAll}
                    disabled={notifications.length === 0}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent 
                  side="bottom"
                  className="bg-gray-900 text-white text-xs px-2 py-1"
                >
                  Clear all
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <ScrollArea className="h-[400px] px-2">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Bell className="h-10 w-10 mb-3 opacity-20" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <div className="space-y-1 py-2">
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg hover:bg-gray-100/50 cursor-pointer",
                    !notification.read && "bg-blue-50/50 hover:bg-blue-50/70"
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  {notification.avatar ? (
                    <Avatar className="h-9 w-9 ring-2 ring-white shadow-sm">
                      <AvatarImage src={notification.avatar} />
                      <AvatarFallback className="bg-gray-100 text-gray-600 text-xs">
                        {notification.title.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className={cn(
                      "h-9 w-9 rounded-full flex items-center justify-center shadow-sm",
                      notification.type === "warning" && "bg-yellow-50 text-yellow-600",
                      notification.type === "info" && "bg-blue-50 text-blue-600",
                      notification.type === "success" && "bg-green-50 text-green-600",
                      notification.type === "error" && "bg-red-50 text-red-600"
                    )}>
                      <Bell className="h-4 w-4" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {notification.title}
                      </p>
                      <span className={cn(
                        "text-[11px] font-medium whitespace-nowrap px-1.5 py-0.5 rounded-full",
                        getTimeColor(notification.time)
                      )}>
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                      {notification.message}
                    </p>
                  </div>
                  {!notification.read && (
                    <span className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0 shadow-sm" />
                  )}
                </DropdownMenuItem>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 