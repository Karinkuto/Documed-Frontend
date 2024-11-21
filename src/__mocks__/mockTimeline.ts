import { TimelineItem } from '@/types/Timeline';
import { 
  Stethoscope, 
  Pill, 
  FileText, 
  Syringe, 
  Activity,
  CalendarCheck 
} from 'lucide-react';

export const mockTimeline: TimelineItem[] = [
  {
    id: 1,
    patientId: "REC-001",
    date: '2024-03-15',
    type: 'appointment',
    title: 'Regular Checkup',
    description: 'Annual physical examination with Dr. Smith',
    icon: Stethoscope,
    category: 'Checkup',
  },
  {
    id: 2,
    patientId: "REC-001",
    date: '2024-03-10',
    type: 'prescription',
    title: 'New Prescription',
    description: 'Prescribed antibiotics for respiratory infection',
    icon: Pill,
    category: 'Medication',
  },
  // Add more mock timeline items as needed
];
