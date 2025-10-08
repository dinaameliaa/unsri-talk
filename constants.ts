
import { User, Role, StaffRole, Chat, Announcement, ConsultationCategory } from './types';

export const FACULTIES = [
    'Ekonomi', 'Teknik', 'Pertanian', 'Hukum', 'FISIP', 
    'FASILKOM', 'FKM', 'FKIP', 'MIPA', 'Kedokteran'
];

export const MOCK_USERS: { [key: string]: User } = {
  // Students
  student1: { id: 's1', name: 'Budi Santoso', email: 'budi.santoso@student.unsri.ac.id', role: Role.STUDENT, nim_nip: '09031282126001', faculty: 'FASILKOM' },
  student2: { id: 's2', name: 'Citra Lestari', email: 'citra.lestari@student.unsri.ac.id', role: Role.STUDENT, nim_nip: '09031282126002', faculty: 'FASILKOM' },
  student3: { id: 's3', name: 'Doni Firmansyah', email: 'doni.f@student.unsri.ac.id', role: Role.STUDENT, nim_nip: '09031282126003', faculty: 'FASILKOM' },
  student4: { id: 's4', name: 'Eka Wijaya', email: 'eka.w@student.unsri.ac.id', role: Role.STUDENT, nim_nip: '09021182126004', faculty: 'Teknik' },
  student5: { id: 's5', name: 'Fitriani', email: 'fitriani@student.unsri.ac.id', role: Role.STUDENT, nim_nip: '09011282126005', faculty: 'Ekonomi' },
  student6: { id: 's6', name: 'Gilang Pratama', email: 'gilang.p@student.unsri.ac.id', role: Role.STUDENT, nim_nip: '09031382126006', faculty: 'FASILKOM' },
  student7: { id: 's7', name: 'Dina Amelia', email: 'dina.amelia@student.unsri.ac.id', role: Role.STUDENT, nim_nip: '09031282126007', faculty: 'FASILKOM', avatarUrl: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=100&h=100&fit=crop' },
  
  // Lecturers with expertise
  lecturer1: { id: 'l1', name: 'Dr. Siti Aminah', email: 'siti.aminah@unsri.ac.id', role: Role.LECTURER, nim_nip: '198001012005012001', faculty: 'FASILKOM', expertise: [ConsultationCategory.ACADEMIC, ConsultationCategory.CAREER] },
  lecturer2: { id: 'l2', name: 'Prof. Dr. Ir. Anis Saggaff, MSCE', email: 'anis.s@unsri.ac.id', role: Role.LECTURER, nim_nip: '196304051988031002', faculty: 'Teknik', expertise: [ConsultationCategory.ACADEMIC, ConsultationCategory.GENERAL] },
  lecturer3: { id: 'l3', name: 'Dr. Febrian, S.H., M.S.', email: 'febrian@unsri.ac.id', role: Role.LECTURER, nim_nip: '197002101995031001', faculty: 'Hukum', expertise: [ConsultationCategory.STUDENT_AFFAIRS, ConsultationCategory.GENERAL] },
  lecturer4: { id: 'l4', name: 'Dra. Yulia P, M.Si.', email: 'yulia.p@unsri.ac.id', role: Role.LECTURER, nim_nip: '196507201990032001', faculty: 'Ekonomi', expertise: [ConsultationCategory.CAREER, ConsultationCategory.SCHOLARSHIP] },
  lecturer5: { id: 'l5', name: 'Dr. A. Muslim, M.Agr.', email: 'a.muslim@unsri.ac.id', role: Role.LECTURER, nim_nip: '196808171994031002', faculty: 'Pertanian', expertise: [ConsultationCategory.ACADEMIC, ConsultationCategory.GENERAL] },
  lecturer6: { id: 'l6', name: 'Prof. Dr. Alfitri, M.Si.', email: 'alfitri@unsri.ac.id', role: Role.LECTURER, nim_nip: '196603031991031002', faculty: 'FISIP', expertise: [ConsultationCategory.STUDENT_AFFAIRS, ConsultationCategory.GENERAL] },
  lecturer7: { id: 'l7', name: 'Dr. Irsan, M.Kes', email: 'irsan@unsri.ac.id', role: Role.LECTURER, nim_nip: '197505052000031002', faculty: 'FKM', expertise: [ConsultationCategory.GENERAL] },
  lecturer8: { id: 'l8', name: 'Dr. Hartono, M.A.', email: 'hartono@unsri.ac.id', role: Role.LECTURER, nim_nip: '196901011994031005', faculty: 'FKIP', expertise: [ConsultationCategory.ACADEMIC, ConsultationCategory.STUDENT_AFFAIRS] },
  lecturer9: { id: 'l9', name: 'Prof. Dr. Iskhaq Iskandar, M.Sc.', email: 'iskhaq@unsri.ac.id', role: Role.LECTURER, nim_nip: '197010101995121001', faculty: 'MIPA', expertise: [ConsultationCategory.ACADEMIC, ConsultationCategory.SCHOLARSHIP] },
  lecturer10: { id: 'l10', name: 'dr. H.M. Zulkarnain, M.Med.Sc, PKK', email: 'zulkarnain@unsri.ac.id', role: Role.LECTURER, nim_nip: '196409091990031002', faculty: 'Kedokteran', expertise: [ConsultationCategory.ACADEMIC, ConsultationCategory.GENERAL] },

  // Staff
  staff1: { id: 'st1', name: 'Ahmad Fauzi', email: 'ahmad.fauzi@unsri.ac.id', role: Role.STAFF, staffRole: StaffRole.ACADEMIC, nim_nip: '199002022015031002' },
  staff2: { id: 'st2', name: 'Rina Marlina', email: 'rina.marlina@unsri.ac.id', role: Role.STAFF, staffRole: StaffRole.STUDENT_AFFAIRS, nim_nip: '199203032018012003' },
};


export const MOCK_CHATS: Chat[] = [
  {
    id: 'chat1',
    participants: [MOCK_USERS.student1, MOCK_USERS.lecturer1],
    topic: ConsultationCategory.ACADEMIC,
    type: 'private',
    messages: [
      { id: 'm1', senderId: 's1', text: 'Selamat pagi, Bu. Saya ingin bertanya mengenai jadwal KRS semester depan.', timestamp: '10:00 AM', read: true },
      { id: 'm2', senderId: 'l1', text: 'Selamat pagi, Budi. Tentu, jadwal KRS akan diumumkan minggu depan di portal akademik. Ada lagi yang bisa dibantu?', timestamp: '10:01 AM', read: true },
      { id: 'm3', senderId: 's1', text: 'Baik, Bu. Terima kasih banyak atas informasinya.', timestamp: '10:02 AM', read: false },
    ],
  },
  {
    id: 'chat2',
    participants: [MOCK_USERS.student1, MOCK_USERS.staff2],
    topic: ConsultationCategory.SCHOLARSHIP,
    type: 'private',
    messages: [
      { id: 'm4', senderId: 's1', text: 'Permisi, Pak/Bu. Saya ingin menanyakan informasi mengenai beasiswa PPA.', timestamp: '11:30 AM', read: true },
      { id: 'm5', senderId: 'st2', text: 'Halo. Pendaftaran Beasiswa PPA akan dibuka tanggal 1-15 bulan depan. Silakan siapkan berkas-berkasnya ya. Info lengkap ada di menu pengumuman.', timestamp: '11:32 AM', read: true },
    ],
  },
  {
    id: 'chat3',
    participants: [MOCK_USERS.student2, MOCK_USERS.lecturer4],
    topic: ConsultationCategory.CAREER,
    type: 'private',
    messages: [
      { id: 'm6', senderId: 's2', text: 'Selamat siang, Bu Yulia. Saya Citra, ingin bertanya tentang peluang magang di perusahaan teknologi.', timestamp: '12:05 PM', read: true },
      { id: 'm7', senderId: 'l4', text: 'Siang, Citra. Tentu, ada beberapa info baru dari pusat karir. Kamu tertarik di bidang apa spesifiknya? Software engineering, data science?', timestamp: '12:07 PM', read: true },
      { id: 'm8', senderId: 's2', text: 'Saya lebih tertarik ke software engineering, Bu.', timestamp: '12:08 PM', read: true },
      { id: 'm9', senderId: 'l4', text: 'Baik. Coba siapkan CV terbaikmu. Minggu depan ada webinar dari perusahaan X, sangat relevan. Nanti saya teruskan infonya di grup info karir ya.', timestamp: '12:09 PM', read: true },
      { id: 'm9a', senderId: 's2', text: 'Wah, baik Bu! Terima kasih banyak atas bimbingannya. Saya akan siapkan CV saya.', timestamp: '12:10 PM', read: true },
      { id: 'm9b', senderId: 'l4', text: 'Sama-sama, Citra. Sukses ya!', timestamp: '12:11 PM', read: false },
    ],
  },
  {
    id: 'chat4',
    participants: [MOCK_USERS.student3, MOCK_USERS.staff1],
    topic: ConsultationCategory.ACADEMIC,
    type: 'private',
    messages: [
      { id: 'm10', senderId: 's3', text: 'Pagi, Pak Ahmad. Saya Doni, mau konfirmasi apakah transkrip nilai sementara saya sudah bisa diambil?', timestamp: '09:15 AM', read: true },
      { id: 'm11', senderId: 'st1', text: 'Pagi, Doni. Coba saya cek dulu ya. Atas nama Doni Firmansyah, NIM 09031282126003. Mohon ditunggu.', timestamp: '09:16 AM', read: true },
      { id: 'm12', senderId: 'st1', text: 'Sudah ada, Don. Bisa diambil di loket akademik jam kerja ya.', timestamp: '09:18 AM', read: true },
      { id: 'm13', senderId: 's3', text: 'Siap, Pak. Terima kasih infonya.', timestamp: '09:19 AM', read: true },
      { id: 'm13a', senderId: 'st1', text: 'Sama-sama. Jangan lupa bawa KTM ya.', timestamp: '09:20 AM', read: false },
    ],
  },
   {
    id: 'chat5',
    participants: [MOCK_USERS.student7, MOCK_USERS.lecturer2],
    topic: ConsultationCategory.GENERAL,
    type: 'private',
    messages: [
      { id: 'm14', senderId: 's7', text: 'Selamat sore, Prof. Anis. Saya Dina Amelia, ingin bertanya mengenai kegiatan riset di fakultas teknik.', timestamp: '03:10 PM', read: true },
      { id: 'm15', senderId: 'l2', text: 'Sore, Dina. Tentu, silakan. Riset apa yang kamu minati?', timestamp: '03:11 PM', read: false },
    ],
  },
  {
    id: 'group1',
    name: 'Diskusi Tugas Akhir TI \'21',
    participants: [MOCK_USERS.student1, MOCK_USERS.student2, MOCK_USERS.student3],
    type: 'group',
    messages: [
        { id: 'gm1', senderId: 's2', text: 'Guys, ada referensi buat bab 2 ga? Aku agak buntu nih.', timestamp: '08:30 PM', read: true },
        { id: 'gm2', senderId: 's3', text: 'Coba cek di perpus online unsri, Cit. Kemarin aku nemu beberapa jurnal bagus di sana.', timestamp: '08:31 PM', read: true },
        { id: 'gm3', senderId: 's1', text: 'Betul, di IEEE Xplore juga banyak. Nanti aku share link-nya ya kalau ketemu.', timestamp: '08:32 PM', read: true },
        { id: 'gm3a', senderId: 's3', text: 'Linknya udah aku kirim di grup ya, Bud. Cekidot.', timestamp: '08:35 PM', read: true },
        { id: 'gm4', senderId: 's2', text: 'Wah, makasih banyak yaa!! Sangat membantu.', timestamp: '08:33 PM', read: true },
        { id: 'gm4a', senderId: 's1', text: 'Mantap, Don. Makasih!', timestamp: '08:36 PM', read: true },
        { id: 'gm4b', senderId: 's2', text: 'Oke, aku cek sekarang juga. Thanks guys!', timestamp: '08:37 PM', read: false },
    ]
  },
  {
    id: 'group2',
    name: 'Kelompok KKN Desa Suka Maju',
    participants: [MOCK_USERS.student1, MOCK_USERS.student4, MOCK_USERS.student5],
    type: 'group',
    messages: [
        { id: 'gm5', senderId: 's4', text: 'Jangan lupa besok kita kumpul jam 9 di rektorat ya buat pelepasan KKN.', timestamp: 'Kemarin', read: true },
        { id: 'gm6', senderId: 's1', text: 'Siap, Eka. Bawa apa aja ya kira-kira?', timestamp: 'Kemarin', read: true },
        { id: 'gm7', senderId: 's5', text: 'Bawa jaket almamater sama perlengkapan pribadi aja, Bud.', timestamp: 'Kemarin', read: true },
        { id: 'gm7a', senderId: 's4', text: 'Oke, jangan ada yang telat ya teman-teman. Biar gak ketinggalan bus.', timestamp: 'Kemarin', read: true },
        { id: 'gm7b', senderId: 's1', text: 'Noted!', timestamp: 'Kemarin', read: false },
    ]
  },
  {
    id: 'group3',
    name: 'Panitia Acara Fasilkom',
    participants: [MOCK_USERS.student1, MOCK_USERS.student2, MOCK_USERS.student3, MOCK_USERS.student6, MOCK_USERS.student7],
    type: 'group',
    messages: [
        { id: 'gm8', senderId: 's6', text: 'Rapat panitia nanti sore jadi kan?', timestamp: '09:15 AM', read: true },
        { id: 'gm9', senderId: 's2', text: 'Jadi dong, Gilang. Di ruang rapat BEM kan?', timestamp: '09:16 AM', read: true },
        { id: 'gm10', senderId: 's6', text: 'Betul, Cit. Jangan lupa bawa progress dari divisi masing-masing ya.', timestamp: '09:17 AM', read: true },
        { id: 'gm10a', senderId: 's7', text: 'Siap, aku juga ikut ya. Divisi acara sudah siap presentasi.', timestamp: '09:18 AM', read: true },
        { id: 'gm10b', senderId: 's3', text: 'Oke, divisi perlengkapan juga udah siap lapor.', timestamp: '09:19 AM', read: false },
    ]
  },
  {
    id: 'group4',
    name: 'UKM Fotografi UNSRI',
    participants: [MOCK_USERS.student1, MOCK_USERS.student2, MOCK_USERS.student5, MOCK_USERS.student6],
    type: 'group',
    messages: [
        { id: 'gm11', senderId: 's5', text: 'Teman-teman, hunting foto bareng hari Minggu jadi?', timestamp: '10:45 AM', read: true },
        { id: 'gm12', senderId: 's6', text: 'Jadi dong, Fit. Lokasi di Kambang Iwak aja gimana? Pagi-pagi biar cahayanya bagus.', timestamp: '10:46 AM', read: true },
        { id: 'gm13', senderId: 's1', text: 'Setuju. Jam 7 pagi kumpul di depan McDonald\'s.', timestamp: '10:48 AM', read: true },
        { id: 'gm14', senderId: 's2', text: 'Aku ikut!', timestamp: '11:00 AM', read: true },
        { id: 'gm15', senderId: 's6', text: 'Sipp. Yang punya lensa tele boleh dibawa ya, buat candid.', timestamp: '11:02 AM', read: false },
    ]
  }
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
    { id: 'a1', title: 'Jadwal Pengisian KRS Semester Ganjil 2024/2025', category: 'Jadwal Akademik', date: '20 Juli 2024', author: 'Bagian Akademik', content: 'Pengisian Kartu Rencana Studi (KRS) untuk semester ganjil akan dimulai pada tanggal 1 Agustus 2024 hingga 15 Agustus 2024. Pastikan untuk berkonsultasi dengan Dosen Pembimbing Akademik Anda.'},
    { id: 'a2', title: 'Pembukaan Pendaftaran Beasiswa Bank Indonesia 2024', category: 'Beasiswa', date: '18 Juli 2024', author: 'Bagian Kemahasiswaan', content: 'Telah dibuka pendaftaran Beasiswa Bank Indonesia bagi mahasiswa S1 semester 3-7. Batas akhir pendaftaran pada tanggal 30 Juli 2024. Syarat dan ketentuan dapat dilihat di website kemahasiswaan.'},
    { id: 'a3', title: 'Seminar Karir: "Membangun Personal Branding di Era Digital"', category: 'Karir & Alumni', date: '15 Juli 2024', author: 'Pusat Karir UNSRI', content: 'Ikuti seminar karir yang akan diadakan pada hari Sabtu, 27 Juli 2024 di Aula Fakultas Ekonomi. Pendaftaran gratis dan tempat terbatas!'},
];
