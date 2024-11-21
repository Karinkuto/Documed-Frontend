import { Announcement } from '@/types/Announcement';

export const mockAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "COVID-19 Vaccination Schedule Update",
    content: "New vaccination schedule for all students and faculty members. Please check your email for your designated time slot.",
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
        content: "Great news! I'm excited to see the vaccination schedule update.",
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
  // Add more mock announcements as needed
];
