export interface Participant {
  name: string;
  email: string;
  avatar: string;
  status: 'confirmed' | 'pending';
}

export interface Document {
  name: string;
  url: string;
}

export interface Event {
  id: string;
  title?: string;
  date: Date;
  createdAt: Date;
  description?: string;
  group?: 'Students' | 'Faculty' | 'Both';
  issuer: string;
  issuerAvatar?: string;
  status: 'upcoming' | 'in-progress' | 'completed';
  users: number;
  avatars: string[];
  location?: string;
  participants: Participant[];
  documents?: Document[];
  color?: string;
  textColor?: string;
  borderColor?: string;
}
