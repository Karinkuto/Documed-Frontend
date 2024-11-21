interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "info" | "warning" | "success" | "error";
  avatar?: string;
}

const STORAGE_KEY = 'documed_notifications';

// Initial mock notifications
const initialNotifications: Notification[] = [
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
];

export const notificationService = {
  getNotifications: (): Promise<Notification[]> => {
    return new Promise((resolve) => {
      const stored = localStorage.getItem(STORAGE_KEY);
      const notifications = stored ? JSON.parse(stored) : initialNotifications;
      resolve(notifications);
    });
  },

  markAsRead: (id: string): Promise<void> => {
    return new Promise((resolve) => {
      const stored = localStorage.getItem(STORAGE_KEY);
      let notifications = stored ? JSON.parse(stored) : initialNotifications;
      
      notifications = notifications.map((notification: Notification) => 
        notification.id === id ? { ...notification, read: true } : notification
      );

      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
      resolve();
    });
  },

  markAllAsRead: (): Promise<void> => {
    return new Promise((resolve) => {
      const stored = localStorage.getItem(STORAGE_KEY);
      let notifications = stored ? JSON.parse(stored) : initialNotifications;
      
      notifications = notifications.map((notification: Notification) => ({
        ...notification,
        read: true
      }));

      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
      resolve();
    });
  },

  deleteNotification: (id: string): Promise<void> => {
    return new Promise((resolve) => {
      const stored = localStorage.getItem(STORAGE_KEY);
      let notifications = stored ? JSON.parse(stored) : initialNotifications;
      
      notifications = notifications.filter((notification: Notification) => 
        notification.id !== id
      );

      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
      resolve();
    });
  },

  addNotification: (notification: Omit<Notification, 'id'>): Promise<void> => {
    return new Promise((resolve) => {
      const stored = localStorage.getItem(STORAGE_KEY);
      let notifications = stored ? JSON.parse(stored) : initialNotifications;
      
      const newNotification = {
        ...notification,
        id: Date.now().toString(),
        time: 'Just now'
      };

      notifications = [newNotification, ...notifications];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
      resolve();
    });
  }
};
