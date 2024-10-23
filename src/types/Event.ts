export interface Event {
  id: string;
  title: string;
  date: Date;
  color: string;
  textColor: string;
  borderColor: string;
  description?: string;
  issuer: string;
  group: string;
  users: number;
  status?: 'upcoming' | 'in-progress' | 'completed';
  location?: string;
  duration: number; // in minutes
  avatars: string[]; // URLs for avatar images
}
