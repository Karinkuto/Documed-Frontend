export interface MockUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'Faculty' | 'Student';
  department: string;
  status: 'confirmed' | 'pending';
}

export const mockUsers: MockUser[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    avatar: '/avatars/john.jpg',
    role: 'Faculty',
    department: 'Computer Science',
    status: 'confirmed'
  },
  {
    id: '2',
    name: 'Emma Wilson',
    email: 'emma.w@example.com',
    avatar: '/avatars/emma.jpg',
    role: 'Student',
    department: 'Engineering',
    status: 'pending'
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'm.brown@example.com',
    avatar: '/avatars/michael.jpg',
    role: 'Faculty',
    department: 'Physics',
    status: 'confirmed'
  },
  {
    id: '4',
    name: 'Sarah Davis',
    email: 'sarah.d@example.com',
    avatar: '/avatars/sarah.jpg',
    role: 'Student',
    department: 'Mathematics',
    status: 'confirmed'
  },
  {
    id: '5',
    name: 'James Wilson',
    email: 'j.wilson@example.com',
    avatar: '/avatars/james.jpg',
    role: 'Faculty',
    department: 'Biology',
    status: 'pending'
  },
  {
    id: '6',
    name: 'Lisa Anderson',
    email: 'l.anderson@example.com',
    avatar: '/avatars/lisa.jpg',
    role: 'Student',
    department: 'Chemistry',
    status: 'confirmed'
  },
  {
    id: '7',
    name: 'Robert Taylor',
    email: 'r.taylor@example.com',
    avatar: '/avatars/robert.jpg',
    role: 'Faculty',
    department: 'Mathematics',
    status: 'confirmed'
  },
  {
    id: '8',
    name: 'Emily White',
    email: 'e.white@example.com',
    avatar: '/avatars/emily.jpg',
    role: 'Student',
    department: 'Physics',
    status: 'pending'
  }
];

// Keep track of all users, including those added later
let allUsers = [...mockUsers];

export const addMockUser = (user: Omit<MockUser, 'id' | 'status'>) => {
  const newUser = {
    ...user,
    id: `USER-${Math.random().toString(36).substr(2, 9)}`,
    status: 'pending' as const
  };
  allUsers.push(newUser);
  return newUser;
};

export const getRandomParticipants = (count: number) => {
  const shuffled = [...allUsers].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const searchUsers = (query: string, role?: 'Faculty' | 'Student') => {
  return allUsers.filter(user => {
    const matchesQuery = user.name.toLowerCase().includes(query.toLowerCase()) ||
                        user.email.toLowerCase().includes(query.toLowerCase()) ||
                        user.department.toLowerCase().includes(query.toLowerCase());
    const matchesRole = !role || user.role === role;
    return matchesQuery && matchesRole;
  });
};

export const getUsersByDepartment = (department: string) => {
  return allUsers.filter(user => user.department === department);
};

export const updateUserStatus = (userId: string, status: 'confirmed' | 'pending') => {
  allUsers = allUsers.map(user => 
    user.id === userId ? { ...user, status } : user
  );
  return allUsers.find(user => user.id === userId);
};

export const removeUser = (userId: string) => {
  allUsers = allUsers.filter(user => user.id !== userId);
}; 