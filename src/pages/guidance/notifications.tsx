import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Search, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  Mail,
  User,
  Files
} from 'lucide-react';
import { cn, formatTimeAgo } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';
import { db, NotificationItem } from '../../lib/db';
import { defaultNotifications } from '../../lib/defaultData';

export function GuidanceNotifications() {
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'submissions' | 'urgent'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const cached = db.notifications.getCached();
    if (cached && cached.length > 0) return cached;
    return defaultNotifications;
  });

  // Re-render relative timestamps in real-time every 30 seconds
  const [, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setTick(t => t + 1);
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const unsub = db.notifications.subscribe(list => {
      if (Array.isArray(list)) {
        setNotifications(list);
      }
    });
    return () => unsub();
  }, []);

  const filteredNotifications = notifications.filter(n => {
    if (!n) return false;
    const matchesSearch = !searchQuery || 
      (n.title && n.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (n.description && n.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (n.studentName && n.studentName.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeFilter === 'unread') return !n.read;
    if (activeFilter === 'submissions') return n.type === 'submission';
    if (activeFilter === 'urgent') return n.priority === 'high';
    return true;
  });

  const unreadCount = notifications.filter(n => n && !n.read).length;

  const handleMarkAllAsRead = async () => {
    // If activeFilter is 'unread', transition to 'all' so that notifications remain visible on screen instead of disappearing
    if (activeFilter === 'unread') {
      setActiveFilter('all');
    }
    // Optimistic UI update
    setNotifications(prev => (prev || []).map(n => ({ ...n, read: true })));
    if (selectedNotification) {
      setSelectedNotification(prev => prev ? { ...prev, read: true } : null);
    }
    // Real database sync
    try {
      await db.notifications.markAllAsRead();
    } catch (e) {
      console.error("Failed to mark all as read in DB", e);
    }
  };

  const handleMarkAllAsUnread = async () => {
    // Optimistic UI update
    setNotifications(prev => (prev || []).map(n => ({ ...n, read: false })));
    if (selectedNotification) {
      setSelectedNotification(prev => prev ? { ...prev, read: false } : null);
    }
    // Real database sync
    try {
      await db.notifications.markAllAsUnread();
    } catch (e) {
      console.error("Failed to mark all as unread in DB", e);
    }
  };

  const handleToggleRead = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const notif = notifications.find(n => n && n.id === id);
    if (!notif) return;
    
    const newReadStatus = !notif.read;

    // Optimistic UI update
    setNotifications(prev => (prev || []).map(n => n.id === id ? { ...n, read: newReadStatus } : n));
    if (selectedNotification?.id === id) {
      setSelectedNotification(prev => prev ? { ...prev, read: newReadStatus } : null);
    }
    
    // Real database sync
    try {
      await db.notifications.set(id, { ...notif, read: newReadStatus });
    } catch (err) {
      console.error("Failed to toggle read in DB", err);
    }
  };

  const handleDeleteNotification = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    // Optimistic UI update
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (selectedNotification?.id === id) {
      setSelectedNotification(null);
    }
    // Real database sync
    try {
      await db.notifications.delete(id);
    } catch (err) {
      console.error("Failed to delete notification in DB", err);
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Clear all notifications?')) {
      const allIds = notifications.map(n => n.id);
      // Optimistic UI update
      setNotifications([]);
      setSelectedNotification(null);
      // Real database sync
      try {
        await Promise.all(allIds.map(id => db.notifications.delete(id)));
      } catch (err) {
        console.error("Failed to clear notifications in DB", err);
      }
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto select-none font-sans bg-[#f8fafc] min-h-full">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[32px] font-serif font-bold text-[#1e3a8a] tracking-tight">
          Notifications
        </h1>
      </div>

      {/* Filter Tabs & Actions */}
      <div className="flex items-center justify-between border-b-[2px] border-gray-300 mb-6 relative">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveFilter('all')}
            className={cn(
              "text-[15px] font-bold pb-2 transition-colors relative top-[2px]",
              activeFilter === 'all'
                ? "text-[#2563eb] border-b-[3px] border-[#2563eb]"
                : "text-[#475569] hover:text-gray-900"
            )}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter('unread')}
            className={cn(
              "text-[15px] font-bold pb-2 transition-colors relative top-[2px]",
              activeFilter === 'unread'
                ? "text-[#2563eb] border-b-[3px] border-[#2563eb]"
                : "text-[#475569] hover:text-gray-900"
            )}
          >
            Unread
          </button>
        </div>
        
        <button
          id="mark-all-read-btn"
          onClick={handleMarkAllAsRead}
          className={cn(
            "text-[14px] font-bold pb-2 transition-colors cursor-pointer",
            unreadCount > 0
              ? "text-[#2563eb] hover:text-blue-800 underline"
              : "text-gray-400 hover:text-gray-600 underline"
          )}
          title={unreadCount > 0 ? "Mark all notifications as read" : "All notifications are already marked as read"}
        >
          Mark as all read
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="p-16 text-center text-gray-500 space-y-2 bg-white rounded-2xl shadow-sm">
            <Bell className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="font-bold text-sm text-gray-700">No notifications found</p>
            <p className="text-xs text-gray-400">You're all caught up with recent submissions and alerts.</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={async () => {
                if (!notif.read) {
                  await handleToggleRead(notif.id);
                }
                if (notif.submissionId) {
                  navigate('/admin/submissions', { state: { autoOpenSubmissionId: notif.submissionId } });
                } else {
                  setSelectedNotification(notif);
                }
              }}
              className={cn(
                "p-4 rounded-xl shadow-sm border transition-all cursor-pointer flex items-center justify-between group",
                !notif.read ? "bg-[#dce4fb] border-[#b4c6f0]" : "bg-white border-gray-200 hover:bg-gray-50"
              )}
            >
              <div className="flex items-center gap-4">
                {/* Status Dot (interactive toggle) */}
                <button
                  type="button"
                  onClick={(e) => handleToggleRead(notif.id, e)}
                  title={notif.read ? "Mark as unread" : "Mark as read"}
                  className="p-1 hover:scale-110 transition-transform cursor-pointer rounded-full"
                >
                  <div className={cn(
                    "w-3 h-3 rounded-full shrink-0 transition-colors",
                    !notif.read ? "bg-[#2563eb] ring-2 ring-blue-200" : "bg-transparent border border-gray-400"
                  )} />
                </button>
                
                {/* Icon */}
                <div className="w-10 h-10 rounded-full border border-[#1e3a8a]/40 flex items-center justify-center shrink-0 bg-transparent">
                  <Files className="w-5 h-5 text-[#1e3a8a]" />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-0.5 ml-2">
                  <p className="text-[15px] text-[#1e293b]">
                    {notif.studentName ? (
                      <>
                        <span className="font-bold">{notif.studentName}</span> 
                        {' '}submitted scholarship requirements
                      </>
                    ) : (
                      <span className="font-bold">{notif.title}</span>
                    )}
                  </p>
                  <p className="text-[13px] font-medium text-[#475569]">
                    {formatTimeAgo(notif.timestamp, notif.createdAt || notif.id)}
                  </p>
                </div>
              </div>

              {/* Action buttons (Mark read/unread + Delete) */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={(e) => handleToggleRead(notif.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-[#2563eb] transition-all rounded-md hover:bg-blue-50 cursor-pointer"
                  title={notif.read ? "Mark as unread" : "Mark as read"}
                >
                  <Mail className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => handleDeleteNotification(notif.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-600 transition-all rounded-md hover:bg-red-50 cursor-pointer"
                  title="Delete alert"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* (Navigation Arrows removed) */}

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <div className="bg-[#b3c5e5] text-[#0f2e60] text-center font-black py-3 rounded-xl mb-6 tracking-wide">
                STUDENT DEMOGRAPHICS
              </div>
              
              {/* PERSONAL INFORMATION */}
              <div className="border border-[#b3c5e5] rounded-xl overflow-hidden mb-6">
                <div className="bg-white border-b border-[#b3c5e5] px-4 py-2 flex items-center gap-2 text-[#0f2e60] font-bold text-xs uppercase">
                   <User className="w-4 h-4 text-[#1864db]" /> PERSONAL INFORMATION
                </div>
                <table className="w-full text-xs text-left border-collapse">
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-gray-800 w-[40%] border-r border-gray-200">Last Name</td>
                      <td className="py-2.5 px-4 text-gray-700">{selectedNotification.studentName ? selectedNotification.studentName.split(' ').pop() : 'Santos'}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-gray-800 border-r border-gray-200">First Name</td>
                      <td className="py-2.5 px-4 text-gray-700">{selectedNotification.studentName ? selectedNotification.studentName.split(' ').slice(0, -1).join(' ') : 'Anna Marie'}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-gray-800 border-r border-gray-200">Middle Name</td>
                      <td className="py-2.5 px-4 text-gray-700">Abelardo</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-gray-800 border-r border-gray-200">Birthdate</td>
                      <td className="py-2.5 px-4 text-gray-700">06/14/2007</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-gray-800 border-r border-gray-200">Age</td>
                      <td className="py-2.5 px-4 text-gray-700">19</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-gray-800 border-r border-gray-200">Sex</td>
                      <td className="py-2.5 px-4 text-gray-700">Female</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-gray-800 border-r border-gray-200">Year Level</td>
                      <td className="py-2.5 px-4 text-gray-700">2nd Year</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-gray-800 border-r border-gray-200">Course</td>
                      <td className="py-2.5 px-4 text-gray-700">BAEL</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-gray-800 border-r border-gray-200">Section</td>
                      <td className="py-2.5 px-4 text-gray-700">A</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-gray-800 border-r border-gray-200">Civil Status</td>
                      <td className="py-2.5 px-4 text-gray-700">Single</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-gray-800 border-r border-gray-200">Contact No.</td>
                      <td className="py-2.5 px-4 text-gray-700">09335691234</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-gray-800 border-r border-gray-200">Permanent Address</td>
                      <td className="py-2.5 px-4 text-gray-700">Poblacion Proper Mambusao, Capiz 5807, Philippines</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {/* FAMILY BACKGROUND */}
              <div className="border border-[#b3c5e5] rounded-xl overflow-hidden mb-2">
                <div className="bg-white border-b border-[#b3c5e5] px-4 py-2 flex items-center gap-2 text-[#0f2e60] font-bold text-xs uppercase">
                   <User className="w-4 h-4 text-[#1864db]" /> FAMILY BACKGROUND
                </div>
                <table className="w-full text-xs text-left border-collapse">
                  <tbody className="divide-y divide-gray-200">
                    <tr className="bg-gray-50/50">
                      <td colSpan={2} className="py-2 px-4 font-bold text-[#0f2e60] text-center italic text-[11px] underline">Father Information</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-gray-800 w-[40%] border-r border-gray-200">Name</td>
                      <td className="py-2.5 px-4 text-gray-700">John Daniel O. Santos</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-gray-800 border-r border-gray-200">Occupation</td>
                      <td className="py-2.5 px-4 text-gray-700">Teacher</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-gray-800 border-r border-gray-200">Contact No.</td>
                      <td className="py-2.5 px-4 text-gray-700">0912345678910</td>
                    </tr>
                    <tr className="bg-gray-50/50 border-t border-gray-300">
                      <td colSpan={2} className="py-2 px-4 font-bold text-[#0f2e60] text-center italic text-[11px] underline">Mother Information</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-gray-800 border-r border-gray-200">Name</td>
                      <td className="py-2.5 px-4 text-gray-700">Loren C. Abelardo</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-gray-800 border-r border-gray-200">Occupation</td>
                      <td className="py-2.5 px-4 text-gray-700">Teacher</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-gray-800 border-r border-gray-200">Contact No.</td>
                      <td className="py-2.5 px-4 text-gray-700">0901897654321</td>
                    </tr>
                    <tr className="bg-gray-50/50 border-t border-gray-300">
                      <td colSpan={2} className="py-2 px-4 font-bold text-[#0f2e60] text-center italic text-[11px] underline">Guardian Information</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-gray-800 border-r border-gray-200">Name</td>
                      <td className="py-2.5 px-4 text-gray-700">John Daniel O. Santos</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-gray-800 border-r border-gray-200">Occupation</td>
                      <td className="py-2.5 px-4 text-gray-700">Teacher</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-gray-800 border-r border-gray-200">Contact No.</td>
                      <td className="py-2.5 px-4 text-gray-700">0912345678910</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end shrink-0 bg-white">
               <button onClick={() => setSelectedNotification(null)} className="px-6 py-2 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 text-xs">Close</button>
            </div>
          </div>
        </div>
      )}    </div>
  );
}
