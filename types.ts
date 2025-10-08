
export enum Role {
  STUDENT = 'Mahasiswa',
  LECTURER = 'Dosen',
  STAFF = 'Staf / Admin Kampus',
}

export enum StaffRole {
  ACADEMIC = 'Akademik',
  STUDENT_AFFAIRS = 'Kemahasiswaan',
  CURRICULUM = 'Kurikulum',
  ALUMNI = 'Alumni',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  staffRole?: StaffRole;
  nim_nip: string;
  avatarUrl?: string;
  faculty?: string;
  expertise?: ConsultationCategory[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text?: string;
  timestamp: string;
  read: boolean;
  file?: {
    name: string;
    type: string;
    url: string;
  };
}

export type MessageContent = Pick<ChatMessage, 'text' | 'file'>;

export interface Chat {
  id: string;
  participants: User[];
  messages: ChatMessage[];
  topic?: ConsultationCategory;
  type: 'private' | 'group';
  name?: string; // For group chats
  avatarUrl?: string; // For group chats
}

export enum ConsultationCategory {
  ACADEMIC = 'Akademik',
  CAREER = 'Karir & Magang',
  SCHOLARSHIP = 'Beasiswa',
  STUDENT_AFFAIRS = 'Kemahasiswaan',
  GENERAL = 'Umum',
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: string;
  date: string;
  author: string;
}