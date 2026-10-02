export type UserRole = 'ADMIN' | 'KETUA_RT' | 'BENDAHARA';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  email?: string;
  phone?: string;
  isActive: boolean;
  avatar?: string;
  lastLogin?: string;
}

export interface RTSettings {
  appName: string;
  rtNumber: string;
  rwNumber: string;
  kelurahan: string;
  kecamatan: string;
  city: string;
  province: string;
  postalCode: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  serviceHours: string;
  leadName: string; // Ketua RT
  viceLeadName: string; // Wakil Ketua RT
  secretaryName: string; // Sekretaris
  treasurerName: string; // Bendahara
  period: string; // e.g. "2024 - 2027"
  logoUrl: string;
  monthlyDuesAmount: number; // e.g. 50000
  initialCashBalance: number; // Saldo awal RT
}

export type TransactionType = 'PEMASUKAN' | 'PENGELUARAN';
export type PublicationStatus = 'DRAFT' | 'DIPUBLIKASIKAN' | 'DISEMBUNYIKAN';

export interface FinancialTransaction {
  id: string;
  trxNumber: string; // TRX-YYYYMM-XXXX
  type: TransactionType;
  date: string; // YYYY-MM-DD
  category: string;
  description: string;
  sourceOrRecipient: string; // Sumber pemasukan atau penerima pengeluaran
  amount: number;
  status: PublicationStatus;
  receiptName?: string;
  receiptUrl?: string; // Data URL or URL
  receiptType?: 'image' | 'pdf';
  notes?: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  approvedByKetua?: boolean;
}

export interface Warga {
  id: string;
  noKk: string; // censored in public view
  nik: string;  // censored in public view
  name: string;
  gender: 'L' | 'P';
  birthDate: string; // YYYY-MM-DD to calculate age
  ageGroup: 'ANAK' | 'REMAJA' | 'DEWASA' | 'LANSIA';
  occupation: string;
  phone?: string;
  addressBlock: string; // e.g. "Blok A1 No. 12"
  isHeadOfFamily: boolean;
  statusKeluarga: 'Kepala Keluarga' | 'Istri' | 'Anak' | 'Famili Lain';
  religion: string;
}

export interface MonthlyDueRecord {
  id: string;
  wargaId: string;
  wargaName: string;
  noKk: string;
  addressBlock: string;
  phone?: string;
  year: number;
  // months 1..12 mapping to boolean (paid or not)
  months: { [month: number]: { paid: boolean; paidAt?: string; trxId?: string; amount: number } };
}

export interface Pengurus {
  id: string;
  name: string;
  roleTitle: string; // Ketua RT, Wakil Ketua, Sekretaris, Bendahara, Sie Keamanan, etc.
  phone: string;
  photoUrl?: string;
  period: string;
}

export interface Kegiatan {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  photoUrl?: string;
  status: 'Akan Datang' | 'Sedang Berlangsung' | 'Selesai';
  category: 'Kerja Bakti' | 'Rapat' | 'Sosial' | 'Keagamaan' | 'Posyandu' | '17 Agustus' | 'Olahraga' | 'Lainnya';
}

export interface Pengumuman {
  id: string;
  title: string;
  content: string;
  date: string;
  attachmentName?: string;
  attachmentUrl?: string;
  isActive: boolean;
  isPinned: boolean;
  category: 'Pemberitahuan' | 'Himbauan' | 'Kegiatan' | 'Darurat' | 'Lainnya';
}

export interface AgendaItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  picName: string; // Penanggung Jawab
  category: 'Rapat RT' | 'Kerja Bakti' | 'Kegiatan Sosial' | 'Kegiatan Warga' | 'Lainnya';
}

export interface DonasiCampaign {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  collectedAmount: number;
  usedAmount: number;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  donorCount: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  activity: string;
  details: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'SETTING' | 'PUBLISH';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'financial' | 'announcement' | 'dues' | 'system';
  isRead: boolean;
  linkTab?: string;
}
