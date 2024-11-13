export interface MockUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'Medical' | 'Staff' | 'Teacher' | 'Student' | 'Admin';
  department: string;
  status: 'confirmed' | 'pending';
}

const DEPARTMENTS = {
  SE_UG: "Software Engineering - Undergraduate Program",
  ITS_UG: "Information Technology and Systems - Undergraduate Program",
  ESE_G: "Enterprise Systems Engineering - Graduate Program",
  ITM_G: "Information Technology Management - Graduate Program"
} as const;

export const mockUsers: MockUser[] = [
  {
    id: '1',
    name: 'Dr. John Smith',
    email: 'john.smith@example.com',
    avatar: '/avatars/john.jpg',
    role: 'Medical',
    department: DEPARTMENTS.SE_UG,
    status: 'confirmed'
  },
  {
    id: '2',
    name: 'Emma Wilson',
    email: 'emma.w@example.com',
    avatar: '/avatars/emma.jpg',
    role: 'Student',
    department: DEPARTMENTS.SE_UG,
    status: 'pending'
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'm.brown@example.com',
    avatar: '/avatars/michael.jpg',
    role: 'Teacher',
    department: DEPARTMENTS.ITS_UG,
    status: 'confirmed'
  },
  {
    id: '4',
    name: 'Sarah Davis',
    email: 'sarah.d@example.com',
    avatar: '/avatars/sarah.jpg',
    role: 'Student',
    department: DEPARTMENTS.ITS_UG,
    status: 'confirmed'
  },
  {
    id: '5',
    name: 'James Wilson',
    email: 'j.wilson@example.com',
    avatar: '/avatars/james.jpg',
    role: 'Teacher',
    department: DEPARTMENTS.ESE_G,
    status: 'pending'
  },
  {
    id: '6',
    name: 'Lisa Anderson',
    email: 'l.anderson@example.com',
    avatar: '/avatars/lisa.jpg',
    role: 'Student',
    department: DEPARTMENTS.ESE_G,
    status: 'confirmed'
  },
  {
    id: '7',
    name: 'Robert Taylor',
    email: 'r.taylor@example.com',
    avatar: '/avatars/robert.jpg',
    role: 'Teacher',
    department: DEPARTMENTS.ITM_G,
    status: 'confirmed'
  },
  {
    id: '8',
    name: 'Emily White',
    email: 'e.white@example.com',
    avatar: '/avatars/emily.jpg',
    role: 'Student',
    department: DEPARTMENTS.ITM_G,
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

export const getUserStats = () => {
  return {
    medical: allUsers.filter(user => user.role === 'Medical').length,
    staff: allUsers.filter(user => user.role === 'Staff').length,
    teachers: allUsers.filter(user => user.role === 'Teacher').length,
    students: allUsers.filter(user => user.role === 'Student').length,
    admin: allUsers.filter(user => user.role === 'Admin').length,
  };
};

export const getPaginatedUsers = (
  query: string, 
  role?: 'Medical' | 'Staff' | 'Teacher' | 'Student' | 'Admin',
  page: number = 1,
  pageSize: number = 10
) => {
  const filteredUsers = allUsers.filter(user => {
    const matchesQuery = user.name.toLowerCase().includes(query.toLowerCase()) ||
                        user.email.toLowerCase().includes(query.toLowerCase()) ||
                        user.department.toLowerCase().includes(query.toLowerCase());
    const matchesRole = !role || user.role === role;
    return matchesQuery && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  
  return {
    users: filteredUsers.slice(start, end),
    totalUsers: filteredUsers.length,
    totalPages,
    currentPage: page
  };
};

// Export the departments constant for use in other components
export { DEPARTMENTS };