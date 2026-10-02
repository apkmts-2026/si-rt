import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  User,
  RTSettings,
  FinancialTransaction,
  Warga,
  MonthlyDueRecord,
  Pengurus,
  Kegiatan,
  Pengumuman,
  AgendaItem,
  DonasiCampaign,
  AuditLog,
  NotificationItem,
  UserRole,
  PublicationStatus,
} from '../types';
import {
  initialSettings,
  initialUsers,
  initialPengurus,
  initialWarga,
  initialMonthlyDues,
  initialTransactions,
  initialKegiatan,
  initialPengumuman,
  initialAgenda,
  initialDonasi,
  initialAuditLogs,
  initialNotifications,
} from '../data/initialData';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
}

interface AppContextType {
  currentUser: User | null;
  settings: RTSettings;
  transactions: FinancialTransaction[];
  wargaList: Warga[];
  monthlyDues: MonthlyDueRecord[];
  pengurusList: Pengurus[];
  kegiatanList: Kegiatan[];
  pengumumanList: Pengumuman[];
  agendaList: AgendaItem[];
  donasiList: DonasiCampaign[];
  auditLogs: AuditLog[];
  notifications: NotificationItem[];
  toasts: ToastMessage[];
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Auth
  login: (username: string, pass: string) => { success: boolean; message: string };
  logout: () => void;

  // Transactions CRUD
  createTransaction: (data: Omit<FinancialTransaction, 'id' | 'trxNumber' | 'createdAt' | 'createdBy' | 'createdByName'>) => FinancialTransaction;
  updateTransaction: (id: string, data: Partial<FinancialTransaction>) => void;
  deleteTransaction: (id: string) => void;
  setTransactionStatus: (id: string, status: PublicationStatus) => void;

  // Warga CRUD
  createWarga: (data: Omit<Warga, 'id'>) => void;
  updateWarga: (id: string, data: Partial<Warga>) => void;
  deleteWarga: (id: string) => void;
  importWargaBatch: (wargaArray: Omit<Warga, 'id'>[]) => void;

  // Dues / Iuran
  toggleMonthlyDue: (wargaId: string, month: number, paid: boolean) => void;

  // Other Entities CRUD
  createKegiatan: (data: Omit<Kegiatan, 'id'>) => void;
  updateKegiatan: (id: string, data: Partial<Kegiatan>) => void;
  deleteKegiatan: (id: string) => void;

  createPengumuman: (data: Omit<Pengumuman, 'id'>) => void;
  updatePengumuman: (id: string, data: Partial<Pengumuman>) => void;
  deletePengumuman: (id: string) => void;

  createAgenda: (data: Omit<AgendaItem, 'id'>) => void;
  updateAgenda: (id: string, data: Partial<AgendaItem>) => void;
  deleteAgenda: (id: string) => void;

  createDonasi: (data: Omit<DonasiCampaign, 'id'>) => void;
  updateDonasi: (id: string, data: Partial<DonasiCampaign>) => void;
  deleteDonasi: (id: string) => void;

  createPengurus: (data: Omit<Pengurus, 'id'>) => void;
  updatePengurus: (id: string, data: Partial<Pengurus>) => void;
  deletePengurus: (id: string) => void;

  updateSettings: (newSettings: Partial<RTSettings>) => void;

  // User Management
  users: (User & { passwordHash: string })[];
  createUser: (userData: Omit<User, 'id'> & { passwordHash: string }) => void;
  updateUser: (id: string, userData: Partial<User & { passwordHash: string }>) => void;
  deleteUser: (id: string) => void;

  // Notifications & Toasts
  showToast: (type: 'success' | 'error' | 'info' | 'warning', message: string, title?: string) => void;
  dismissToast: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Backup & Reset
  resetToDefaults: () => void;
  exportDatabaseJSON: () => void;
  importDatabaseJSON: (jsonString: string) => boolean;

  // Financial Computations
  cashStats: {
    initialBalance: number;
    totalPemasukan: number;
    totalPengeluaran: number;
    currentBalance: number;
    pemasukanBulanIni: number;
    pengeluaranBulanIni: number;
    saldoBulanIni: number;
    surplusStatus: 'Surplus' | 'Defisit' | 'Seimbang';
  };

  // Demographics
  demographics: {
    totalWarga: number;
    totalKK: number;
    maleCount: number;
    femaleCount: number;
    anakCount: number;
    remajaCount: number;
    dewasaCount: number;
    lansiaCount: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER: 'si_rt_current_user',
  SETTINGS: 'si_rt_settings',
  TRANSACTIONS: 'si_rt_transactions',
  WARGA: 'si_rt_warga',
  DUES: 'si_rt_monthly_dues',
  PENGURUS: 'si_rt_pengurus',
  KEGIATAN: 'si_rt_kegiatan',
  PENGUMUMAN: 'si_rt_pengumuman',
  AGENDA: 'si_rt_agenda',
  DONASI: 'si_rt_donasi',
  LOGS: 'si_rt_logs',
  NOTIFICATIONS: 'si_rt_notifications',
  USERS: 'si_rt_users',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial states from localStorage with fallbacks
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return saved ? JSON.parse(saved) : null;
  });

  const [settings, setSettings] = useState<RTSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return saved ? JSON.parse(saved) : initialSettings;
  });

  const [transactions, setTransactions] = useState<FinancialTransaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [wargaList, setWargaList] = useState<Warga[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WARGA);
    return saved ? JSON.parse(saved) : initialWarga;
  });

  const [monthlyDues, setMonthlyDues] = useState<MonthlyDueRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DUES);
    return saved ? JSON.parse(saved) : initialMonthlyDues;
  });

  const [pengurusList, setPengurusList] = useState<Pengurus[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PENGURUS);
    return saved ? JSON.parse(saved) : initialPengurus;
  });

  const [kegiatanList, setKegiatanList] = useState<Kegiatan[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.KEGIATAN);
    return saved ? JSON.parse(saved) : initialKegiatan;
  });

  const [pengumumanList, setPengumumanList] = useState<Pengumuman[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PENGUMUMAN);
    return saved ? JSON.parse(saved) : initialPengumuman;
  });

  const [agendaList, setAgendaList] = useState<AgendaItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AGENDA);
    return saved ? JSON.parse(saved) : initialAgenda;
  });

  const [donasiList, setDonasiList] = useState<DonasiCampaign[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DONASI);
    return saved ? JSON.parse(saved) : initialDonasi;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [users, setUsers] = useState<(User & { passwordHash: string })[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [activeTab, setActiveTab] = useState<string>('beranda');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  useEffect(() => { localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.WARGA, JSON.stringify(wargaList)); }, [wargaList]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.DUES, JSON.stringify(monthlyDues)); }, [monthlyDues]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PENGURUS, JSON.stringify(pengurusList)); }, [pengurusList]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.KEGIATAN, JSON.stringify(kegiatanList)); }, [kegiatanList]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PENGUMUMAN, JSON.stringify(pengumumanList)); }, [pengumumanList]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.AGENDA, JSON.stringify(agendaList)); }, [agendaList]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.DONASI, JSON.stringify(donasiList)); }, [donasiList]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(auditLogs)); }, [auditLogs]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users)); }, [users]);

  // Toast Helper
  const showToast = (type: 'success' | 'error' | 'info' | 'warning', message: string, title?: string) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, type, message, title }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Audit Log Helper
  const recordAudit = (activity: string, details: string, type: AuditLog['type']) => {
    const now = new Date();
    const timestamp = now.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' +
      now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    const newLog: AuditLog = {
      id: 'log-' + Date.now(),
      timestamp,
      userId: currentUser?.id || 'sys',
      userName: currentUser?.name || 'Sistem',
      userRole: currentUser?.role || 'ADMIN',
      activity,
      details,
      type,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Auth Methods
  const login = (username: string, pass: string): { success: boolean; message: string } => {
    const found = users.find((u) => u.username.toLowerCase() === username.trim().toLowerCase());
    if (!found) {
      return { success: false, message: 'Username tidak ditemukan. Periksa kembali username Anda.' };
    }
    if (!found.isActive) {
      return { success: false, message: 'Akun Anda dinonaktifkan oleh Administrator.' };
    }
    if (found.passwordHash !== pass) {
      return { success: false, message: 'Kata sandi salah. Silakan coba lagi.' };
    }

    const { passwordHash, ...userClean } = found;
    const updatedUser: User = {
      ...userClean,
      lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    setCurrentUser(updatedUser);

    // Update user's lastLogin in user list
    setUsers((prev) =>
      prev.map((u) => (u.id === found.id ? { ...u, lastLogin: updatedUser.lastLogin } : u))
    );

    recordAudit('Login Pengelola', `${found.name} (${found.role}) berhasil masuk ke aplikasi`, 'LOGIN');
    showToast('success', `Selamat datang kembali, ${found.name}!`, 'Login Berhasil');

    // Route to appropriate view
    if (found.role === 'ADMIN') {
      setActiveTab('admin-dashboard');
    } else if (found.role === 'BENDAHARA') {
      setActiveTab('admin-keuangan');
    } else {
      setActiveTab('admin-dashboard');
    }

    return { success: true, message: 'Login berhasil!' };
  };

  const logout = () => {
    if (currentUser) {
      recordAudit('Logout Pengelola', `${currentUser.name} keluar dari sistem`, 'LOGIN');
    }
    setCurrentUser(null);
    setActiveTab('beranda');
    showToast('info', 'Anda telah keluar dari mode pengelola.', 'Logout Berhasil');
  };

  // Transactions CRUD
  const generateTrxNumber = (dateStr: string): string => {
    // Format TRX-YYYYMM-XXXX
    const date = dateStr ? new Date(dateStr) : new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const prefix = `TRX-${yyyy}${mm}-`;

    const existingThisMonth = transactions.filter((t) => t.trxNumber.startsWith(prefix));
    const nextSeq = existingThisMonth.length + 1;
    return `${prefix}${String(nextSeq).padStart(4, '0')}`;
  };

  const createTransaction = (
    data: Omit<FinancialTransaction, 'id' | 'trxNumber' | 'createdAt' | 'createdBy' | 'createdByName'>
  ): FinancialTransaction => {
    const trxNumber = generateTrxNumber(data.date);
    const now = new Date();
    const createdAt = now.toISOString().replace('T', ' ').substring(0, 16);

    const newTrx: FinancialTransaction = {
      ...data,
      id: 'trx-' + Date.now(),
      trxNumber,
      createdAt,
      createdBy: currentUser?.id || 'admin',
      createdByName: currentUser?.name || 'Administrator',
    };

    setTransactions((prev) => [newTrx, ...prev]);

    recordAudit(
      `Menambahkan ${data.type === 'PEMASUKAN' ? 'Pemasukan' : 'Pengeluaran'}`,
      `${newTrx.trxNumber} - ${newTrx.category} (Rp ${newTrx.amount.toLocaleString('id-ID')})`,
      'CREATE'
    );

    // If published, trigger real-time notification
    if (newTrx.status === 'DIPUBLIKASIKAN') {
      const notif: NotificationItem = {
        id: 'notif-' + Date.now(),
        title: data.type === 'PEMASUKAN' ? 'Pemasukan Kas Baru' : 'Pengeluaran Kas Baru',
        message: `${newTrx.trxNumber}: ${newTrx.description} senilai Rp ${newTrx.amount.toLocaleString('id-ID')}`,
        timestamp: newTrx.createdAt,
        type: 'financial',
        isRead: false,
        linkTab: 'keuangan',
      };
      setNotifications((prev) => [notif, ...prev]);
    }

    showToast('success', `Transaksi ${trxNumber} berhasil disimpan.`, 'Berhasil Disimpan');
    return newTrx;
  };

  const updateTransaction = (id: string, data: Partial<FinancialTransaction>) => {
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updated = { ...t, ...data };
          recordAudit('Memperbarui Transaksi', `Update ${t.trxNumber}: ${updated.description}`, 'UPDATE');
          return updated;
        }
        return t;
      })
    );
    showToast('success', 'Perubahan transaksi berhasil disimpan.', 'Berhasil Diperbarui');
  };

  const deleteTransaction = (id: string) => {
    const target = transactions.find((t) => t.id === id);
    if (!target) return;

    setTransactions((prev) => prev.filter((t) => t.id !== id));
    recordAudit('Menghapus Transaksi', `Hapus ${target.trxNumber} (${target.category})`, 'DELETE');
    showToast('success', `Transaksi ${target.trxNumber} telah dihapus.`, 'Berhasil Dihapus');
  };

  const setTransactionStatus = (id: string, status: PublicationStatus) => {
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updated = { ...t, status };
          recordAudit('Ubah Status Transaksi', `${t.trxNumber} diubah menjadi ${status}`, 'PUBLISH');
          return updated;
        }
        return t;
      })
    );
    showToast('info', `Status transaksi diubah menjadi ${status}.`);
  };

  // Warga CRUD
  const createWarga = (data: Omit<Warga, 'id'>) => {
    const newWarga: Warga = {
      ...data,
      id: 'warga-' + Date.now(),
    };
    setWargaList((prev) => [...prev, newWarga]);

    // If head of family, initialize monthly dues record
    if (newWarga.isHeadOfFamily) {
      const newDue: MonthlyDueRecord = {
        id: 'due-' + Date.now(),
        wargaId: newWarga.id,
        wargaName: newWarga.name,
        noKk: newWarga.noKk,
        addressBlock: newWarga.addressBlock,
        phone: newWarga.phone,
        year: 2026,
        months: {
          1: { paid: false, amount: settings.monthlyDuesAmount },
          2: { paid: false, amount: settings.monthlyDuesAmount },
          3: { paid: false, amount: settings.monthlyDuesAmount },
          4: { paid: false, amount: settings.monthlyDuesAmount },
          5: { paid: false, amount: settings.monthlyDuesAmount },
          6: { paid: false, amount: settings.monthlyDuesAmount },
          7: { paid: false, amount: settings.monthlyDuesAmount },
          8: { paid: false, amount: settings.monthlyDuesAmount },
          9: { paid: false, amount: settings.monthlyDuesAmount },
          10: { paid: false, amount: settings.monthlyDuesAmount },
          11: { paid: false, amount: settings.monthlyDuesAmount },
          12: { paid: false, amount: settings.monthlyDuesAmount },
        },
      };
      setMonthlyDues((prev) => [...prev, newDue]);
    }

    recordAudit('Menambahkan Data Warga', `Warga baru: ${newWarga.name} (${newWarga.addressBlock})`, 'CREATE');
    showToast('success', `Data warga ${newWarga.name} berhasil ditambahkan.`, 'Berhasil Disimpan');
  };

  const updateWarga = (id: string, data: Partial<Warga>) => {
    setWargaList((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          const updated = { ...w, ...data };
          recordAudit('Memperbarui Data Warga', `Update ${updated.name}`, 'UPDATE');
          return updated;
        }
        return w;
      })
    );
    showToast('success', 'Data warga berhasil diperbarui.', 'Berhasil Diperbarui');
  };

  const deleteWarga = (id: string) => {
    const target = wargaList.find((w) => w.id === id);
    if (!target) return;
    setWargaList((prev) => prev.filter((w) => w.id !== id));
    // also remove dues record if exists
    setMonthlyDues((prev) => prev.filter((d) => d.wargaId !== id));
    recordAudit('Menghapus Data Warga', `Hapus warga: ${target.name}`, 'DELETE');
    showToast('success', `Data warga ${target.name} telah dihapus.`, 'Berhasil Dihapus');
  };

  const importWargaBatch = (wargaArray: Omit<Warga, 'id'>[]) => {
    const newItems: Warga[] = wargaArray.map((w, index) => ({
      ...w,
      id: 'warga-imp-' + Date.now() + '-' + index,
    }));
    setWargaList((prev) => [...prev, ...newItems]);
    recordAudit('Import Data Warga', `Berhasil import ${newItems.length} data warga`, 'CREATE');
    showToast('success', `Berhasil menambahkan ${newItems.length} data warga.`, 'Import Sukses');
  };

  // Dues / Iuran toggle
  const toggleMonthlyDue = (wargaId: string, month: number, paid: boolean) => {
    const now = new Date();
    const paidAt = paid
      ? now.toLocaleDateString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit' })
      : undefined;

    setMonthlyDues((prev) =>
      prev.map((d) => {
        if (d.wargaId === wargaId) {
          const currentMonthData = d.months[month] || { paid: false, amount: settings.monthlyDuesAmount };
          return {
            ...d,
            months: {
              ...d.months,
              [month]: {
                ...currentMonthData,
                paid,
                paidAt,
              },
            },
          };
        }
        return d;
      })
    );

    const targetWarga = wargaList.find((w) => w.id === wargaId);
    showToast(
      'info',
      `Status iuran ${targetWarga?.name || 'warga'} bulan ke-${month} ditandai ${paid ? 'LUNAS' : 'BELUM LUNAS'}.`
    );
  };

  // Kegiatan CRUD
  const createKegiatan = (data: Omit<Kegiatan, 'id'>) => {
    const item: Kegiatan = { ...data, id: 'keg-' + Date.now() };
    setKegiatanList((prev) => [item, ...prev]);
    recordAudit('Menambahkan Kegiatan', item.title, 'CREATE');
    showToast('success', `Kegiatan "${item.title}" berhasil ditambahkan.`);
  };

  const updateKegiatan = (id: string, data: Partial<Kegiatan>) => {
    setKegiatanList((prev) =>
      prev.map((k) => (k.id === id ? { ...k, ...data } : k))
    );
    showToast('success', 'Kegiatan berhasil diperbarui.');
  };

  const deleteKegiatan = (id: string) => {
    const target = kegiatanList.find((k) => k.id === id);
    setKegiatanList((prev) => prev.filter((k) => k.id !== id));
    if (target) recordAudit('Menghapus Kegiatan', target.title, 'DELETE');
    showToast('success', 'Kegiatan berhasil dihapus.');
  };

  // Pengumuman CRUD
  const createPengumuman = (data: Omit<Pengumuman, 'id'>) => {
    const item: Pengumuman = { ...data, id: 'peng-' + Date.now() };
    setPengumumanList((prev) => [item, ...prev]);
    recordAudit('Menambahkan Pengumuman', item.title, 'CREATE');

    // Create notification for warga
    const notif: NotificationItem = {
      id: 'notif-' + Date.now(),
      title: 'Pengumuman Baru',
      message: item.title,
      timestamp: item.date,
      type: 'announcement',
      isRead: false,
      linkTab: 'pengumuman',
    };
    setNotifications((prev) => [notif, ...prev]);

    showToast('success', `Pengumuman "${item.title}" berhasil disiarkan.`);
  };

  const updatePengumuman = (id: string, data: Partial<Pengumuman>) => {
    setPengumumanList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data } : p))
    );
    showToast('success', 'Pengumuman berhasil diperbarui.');
  };

  const deletePengumuman = (id: string) => {
    setPengumumanList((prev) => prev.filter((p) => p.id !== id));
    showToast('success', 'Pengumuman berhasil dihapus.');
  };

  // Agenda CRUD
  const createAgenda = (data: Omit<AgendaItem, 'id'>) => {
    const item: AgendaItem = { ...data, id: 'agd-' + Date.now() };
    setAgendaList((prev) => [item, ...prev]);
    recordAudit('Menambahkan Agenda', item.title, 'CREATE');
    showToast('success', `Agenda "${item.title}" berhasil ditambahkan.`);
  };

  const updateAgenda = (id: string, data: Partial<AgendaItem>) => {
    setAgendaList((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...data } : a))
    );
    showToast('success', 'Agenda berhasil diperbarui.');
  };

  const deleteAgenda = (id: string) => {
    setAgendaList((prev) => prev.filter((a) => a.id !== id));
    showToast('success', 'Agenda telah dihapus.');
  };

  // Donasi CRUD
  const createDonasi = (data: Omit<DonasiCampaign, 'id'>) => {
    const item: DonasiCampaign = { ...data, id: 'donasi-' + Date.now() };
    setDonasiList((prev) => [item, ...prev]);
    recordAudit('Menambahkan Kampanye Donasi', item.title, 'CREATE');
    showToast('success', `Program donasi "${item.title}" berhasil dibuat.`);
  };

  const updateDonasi = (id: string, data: Partial<DonasiCampaign>) => {
    setDonasiList((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...data } : d))
    );
    showToast('success', 'Program donasi berhasil diperbarui.');
  };

  const deleteDonasi = (id: string) => {
    setDonasiList((prev) => prev.filter((d) => d.id !== id));
    showToast('success', 'Program donasi telah dihapus.');
  };

  // Pengurus CRUD
  const createPengurus = (data: Omit<Pengurus, 'id'>) => {
    const item: Pengurus = { ...data, id: 'pengurus-' + Date.now() };
    setPengurusList((prev) => [...prev, item]);
    recordAudit('Menambahkan Pengurus', `${item.name} (${item.roleTitle})`, 'CREATE');
    showToast('success', `Pengurus ${item.name} berhasil ditambahkan.`);
  };

  const updatePengurus = (id: string, data: Partial<Pengurus>) => {
    setPengurusList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data } : p))
    );
    showToast('success', 'Data pengurus berhasil diperbarui.');
  };

  const deletePengurus = (id: string) => {
    setPengurusList((prev) => prev.filter((p) => p.id !== id));
    showToast('success', 'Pengurus berhasil dihapus.');
  };

  // Settings
  const updateSettings = (newSettings: Partial<RTSettings>) => {
    setSettings((prev) => {
      const merged = { ...prev, ...newSettings };
      recordAudit('Pengaturan RT Diperbarui', 'Admin memperbarui profil dan identitas RT', 'SETTING');
      return merged;
    });
    showToast('success', 'Pengaturan informasi RT berhasil disimpan.');
  };

  // User Management
  const createUser = (userData: Omit<User, 'id'> & { passwordHash: string }) => {
    const newUser = {
      ...userData,
      id: 'usr-' + Date.now(),
    };
    setUsers((prev) => [...prev, newUser]);
    recordAudit('Menambahkan User Pengelola', `User baru: ${newUser.username} (${newUser.role})`, 'CREATE');
    showToast('success', `Akun ${newUser.username} berhasil dibuat.`);
  };

  const updateUser = (id: string, userData: Partial<User & { passwordHash: string }>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...userData } : u))
    );
    recordAudit('Memperbarui Akun Pengelola', `Update user ID: ${id}`, 'UPDATE');
    showToast('success', 'Informasi akun pengelola berhasil diperbarui.');
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    recordAudit('Menghapus Akun Pengelola', `Hapus user ID: ${id}`, 'DELETE');
    showToast('success', 'Akun berhasil dihapus.');
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast('info', 'Semua notifikasi ditandai telah dibaca.');
  };

  // Reset to Defaults
  const resetToDefaults = () => {
    setSettings(initialSettings);
    setUsers(initialUsers);
    setPengurusList(initialPengurus);
    setWargaList(initialWarga);
    setMonthlyDues(initialMonthlyDues);
    setTransactions(initialTransactions);
    setKegiatanList(initialKegiatan);
    setPengumumanList(initialPengumuman);
    setAgendaList(initialAgenda);
    setDonasiList(initialDonasi);
    setAuditLogs(initialAuditLogs);
    setNotifications(initialNotifications);

    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.WARGA);
    localStorage.removeItem(STORAGE_KEYS.DUES);
    localStorage.removeItem(STORAGE_KEYS.PENGURUS);
    localStorage.removeItem(STORAGE_KEYS.KEGIATAN);
    localStorage.removeItem(STORAGE_KEYS.PENGUMUMAN);
    localStorage.removeItem(STORAGE_KEYS.AGENDA);
    localStorage.removeItem(STORAGE_KEYS.DONASI);
    localStorage.removeItem(STORAGE_KEYS.LOGS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.USERS);

    recordAudit('Reset Database', 'Semua data di-reset kembali ke bawaan sistem', 'SETTING');
    showToast('warning', 'Semua data telah dikembalikan ke data default bawaan.', 'Reset Berhasil');
  };

  // Backup & Restore
  const exportDatabaseJSON = () => {
    const dump = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      settings,
      users,
      pengurusList,
      wargaList,
      monthlyDues,
      transactions,
      kegiatanList,
      pengumumanList,
      agendaList,
      donasiList,
      auditLogs,
    };

    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup-sistem-informasi-rt-${new Date().toISOString().substring(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);

    recordAudit('Backup Database', 'Pengelola mengunduh berkas cadangan database JSON', 'SETTING');
    showToast('success', 'Cadangan database (JSON) berhasil diunduh.', 'Backup Berhasil');
  };

  const importDatabaseJSON = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.settings) setSettings(parsed.settings);
      if (parsed.transactions) setTransactions(parsed.transactions);
      if (parsed.wargaList) setWargaList(parsed.wargaList);
      if (parsed.monthlyDues) setMonthlyDues(parsed.monthlyDues);
      if (parsed.pengurusList) setPengurusList(parsed.pengurusList);
      if (parsed.kegiatanList) setKegiatanList(parsed.kegiatanList);
      if (parsed.pengumumanList) setPengumumanList(parsed.pengumumanList);
      if (parsed.agendaList) setAgendaList(parsed.agendaList);
      if (parsed.donasiList) setDonasiList(parsed.donasiList);
      if (parsed.users) setUsers(parsed.users);

      recordAudit('Restore Database', 'Database dipulihkan dari berkas cadangan JSON', 'SETTING');
      showToast('success', 'Database berhasil dipulihkan dari berkas cadangan.', 'Restore Sukses');
      return true;
    } catch {
      showToast('error', 'Format berkas cadangan tidak valid atau rusak.', 'Gagal Restore');
      return false;
    }
  };

  // Financial Computations
  const cashStats = useMemo(() => {
    const publishedTrx = transactions.filter((t) => t.status === 'DIPUBLIKASIKAN');

    let totalPemasukan = 0;
    let totalPengeluaran = 0;

    const currentYear = 2026;
    const currentMonth = 10; // Oktober
    let pemasukanBulanIni = 0;
    let pengeluaranBulanIni = 0;

    publishedTrx.forEach((trx) => {
      const amount = Number(trx.amount) || 0;
      const trxDate = new Date(trx.date);
      const isCurrentMonth = trxDate.getFullYear() === currentYear && trxDate.getMonth() + 1 === currentMonth;

      if (trx.type === 'PEMASUKAN') {
        totalPemasukan += amount;
        if (isCurrentMonth) pemasukanBulanIni += amount;
      } else if (trx.type === 'PENGELUARAN') {
        totalPengeluaran += amount;
        if (isCurrentMonth) pengeluaranBulanIni += amount;
      }
    });

    const initialBalance = Number(settings.initialCashBalance) || 0;
    // RUMUS SESUAI PROMPT: SALDO AKHIR = SALDO AWAL + TOTAL PEMASUKAN - TOTAL PENGELUARAN
    const currentBalance = initialBalance + totalPemasukan - totalPengeluaran;
    const saldoBulanIni = pemasukanBulanIni - pengeluaranBulanIni;

    const surplusStatus: 'Surplus' | 'Defisit' | 'Seimbang' =
      currentBalance > 0 ? 'Surplus' : currentBalance < 0 ? 'Defisit' : 'Seimbang';

    return {
      initialBalance,
      totalPemasukan,
      totalPengeluaran,
      currentBalance,
      pemasukanBulanIni,
      pengeluaranBulanIni,
      saldoBulanIni,
      surplusStatus,
    };
  }, [transactions, settings.initialCashBalance]);

  // Demographics
  const demographics = useMemo(() => {
    const totalWarga = wargaList.length;
    const totalKK = wargaList.filter((w) => w.isHeadOfFamily).length;
    const maleCount = wargaList.filter((w) => w.gender === 'L').length;
    const femaleCount = wargaList.filter((w) => w.gender === 'P').length;

    const anakCount = wargaList.filter((w) => w.ageGroup === 'ANAK').length;
    const remajaCount = wargaList.filter((w) => w.ageGroup === 'REMAJA').length;
    const dewasaCount = wargaList.filter((w) => w.ageGroup === 'DEWASA').length;
    const lansiaCount = wargaList.filter((w) => w.ageGroup === 'LANSIA').length;

    return {
      totalWarga,
      totalKK,
      maleCount,
      femaleCount,
      anakCount,
      remajaCount,
      dewasaCount,
      lansiaCount,
    };
  }, [wargaList]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        settings,
        transactions,
        wargaList,
        monthlyDues,
        pengurusList,
        kegiatanList,
        pengumumanList,
        agendaList,
        donasiList,
        auditLogs,
        notifications,
        toasts,
        activeTab,
        setActiveTab,
        login,
        logout,
        createTransaction,
        updateTransaction,
        deleteTransaction,
        setTransactionStatus,
        createWarga,
        updateWarga,
        deleteWarga,
        importWargaBatch,
        toggleMonthlyDue,
        createKegiatan,
        updateKegiatan,
        deleteKegiatan,
        createPengumuman,
        updatePengumuman,
        deletePengumuman,
        createAgenda,
        updateAgenda,
        deleteAgenda,
        createDonasi,
        updateDonasi,
        deleteDonasi,
        createPengurus,
        updatePengurus,
        deletePengurus,
        updateSettings,
        users,
        createUser,
        updateUser,
        deleteUser,
        showToast,
        dismissToast,
        markNotificationAsRead,
        markAllNotificationsRead,
        resetToDefaults,
        exportDatabaseJSON,
        importDatabaseJSON,
        cashStats,
        demographics,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
