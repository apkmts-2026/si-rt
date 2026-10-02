import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckCheck, DollarSign, Bell, Megaphone, CalendarCheck, ArrowRight } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationAsRead, markAllNotificationsRead, setActiveTab } = useApp();

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'financial':
        return <DollarSign className="w-4 h-4 text-[#E53935]" />;
      case 'announcement':
        return <Megaphone className="w-4 h-4 text-[#FF8F00]" />;
      case 'dues':
        return <CalendarCheck className="w-4 h-4 text-[#E53935]" />;
      default:
        return <Bell className="w-4 h-4 text-[#FF8F00]" />;
    }
  };

  const getBg = (type: string) => {
    switch (type) {
      case 'financial':
        return 'bg-red-50';
      case 'announcement':
        return 'bg-amber-50';
      case 'dues':
        return 'bg-orange-50';
      default:
        return 'bg-red-50';
    }
  };

  const handleItemClick = (notifId: string, linkTab?: string) => {
    markNotificationAsRead(notifId);
    if (linkTab) {
      setActiveTab(linkTab);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden no-print">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-8">
        <div className="w-screen max-w-sm sm:max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-4 py-3.5 border-b border-[#F1E1DC] flex items-center justify-between bg-[#FFF8F5]">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-red-100 text-[#E53935]">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-[#333333] text-sm">Notifikasi & Informasi RT</h3>
                <p className="text-[10px] text-[#777777]">
                  {unreadCount > 0 ? `${unreadCount} pemberitahuan baru` : 'Semua telah dibaca'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllNotificationsRead}
                  className="px-2 py-1 text-[11px] text-[#E53935] hover:bg-red-50 rounded-lg font-bold flex items-center gap-1 transition"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tandai Dibaca</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5">
            {notifications.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <Bell className="w-10 h-10 mx-auto stroke-1 text-slate-300 mb-2" />
                <p className="text-xs font-semibold">Belum ada notifikasi baru</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleItemClick(n.id, n.linkTab)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer relative ${
                    n.isRead
                      ? 'bg-white border-[#F1E1DC] hover:border-slate-300'
                      : 'bg-[#FFF8F5] border-red-200 shadow-xs'
                  }`}
                >
                  {!n.isRead && (
                    <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#E53935] ring-2 ring-red-100" />
                  )}
                  <div className="flex items-start gap-2.5">
                    <div className={`p-1.5 rounded-lg shrink-0 ${getBg(n.type)}`}>
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0 pr-2">
                      <h4 className="text-xs font-bold text-[#333333] mb-0.5 truncate">{n.title}</h4>
                      <p className="text-[11px] text-[#555555] leading-relaxed line-clamp-2">{n.message}</p>
                      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#F1E1DC]/60 text-[10px] text-[#777777]">
                        <span>{n.timestamp}</span>
                        {n.linkTab && (
                          <span className="text-[#E53935] font-bold flex items-center gap-0.5">
                            Lihat <ArrowRight className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
