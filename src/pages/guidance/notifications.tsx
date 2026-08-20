import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Trash2, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  FileText,
  Mail,
  X,
  Sparkles
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

interface NotificationItem {
  id: string;
  type: 'submission' | 'deadline' | 'system' | 'inquiry';
  title: string;
  description: string;
  studentName?: string;
  studentId?: string;
  scholarship?: string;
  timestamp: string;
  read: boolean;
  priority: 'high' | 'normal' | 'low';
}

export function GuidanceNotifications() {
  const navigate = useNavigate();

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'submissions' | 'urgent'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      type: 'submission',
      title: 'New Scholarship Submission Uploaded',
      description: 'Anna Marie A. Santos uploaded Certificate of Grades (COG) and Certificate of Registration (COR) for Pag-Ulikid Provincial Scholarship.',
      studentName: 'Anna Marie A. Santos',
      studentId: '2024-CAPSU-0182',
      scholarship: 'Pag-Ulikid',
      timestamp: '10 minutes ago',
      read: false,
      priority: 'high'
    },
    {
      id: 'notif-2',
      type: 'deadline',
      title: 'CHED Tulong Dunong Renewal Deadline Approaching',
      description: 'The submission window for 2nd semester renewal closes in 3 days. 18 scholars have pending document uploads.',
      scholarship: 'Tulong Dunong',
      timestamp: '2 hours ago',
      read: false,
      priority: 'high'
    },
    {
      id: 'notif-3',
      type: 'submission',
      title: 'Updated Registration Form Submitted',
      description: 'Damian James O. Emilio re-uploaded NCIP Indigenous Peoples Certificate for ANAC-IP grant validation.',
      studentName: 'Damian James O. Emilio',
      studentId: '2022-CAPSU-0041',
      scholarship: 'ANAC-IP',
      timestamp: '5 hours ago',
      read: true,
      priority: 'normal'
    },
    {
      id: 'notif-4',
      type: 'inquiry',
      title: 'Student Inquiry on Leave of Absence (LOA)',
      description: 'Paul John N. Dela Cruz requested guidance advisory regarding LOA status for President—FLP Scholarship.',
      studentName: 'Paul John N. Dela Cruz',
      studentId: '2022-CAPSU-0089',
      scholarship: 'President—FLP',
      timestamp: 'Yesterday at 3:45 PM',
      read: true,
      priority: 'normal'
    },
    {
      id: 'notif-5',
      type: 'system',
      title: 'Masterlist Synchronized with OSAS Central',
      description: 'Academic Year 2025–2026 2nd Semester scholarship records successfully verified and backed up.',
      timestamp: 'Aug 17, 2026',
      read: true,
      priority: 'low'
    }
  ]);

  const filteredNotifications = notifications.filter(n => {
    const matchesSearch = !searchQuery || 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.studentName && n.studentName.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeFilter === 'unread') return !n.read;
    if (activeFilter === 'submissions') return n.type === 'submission';
    if (activeFilter === 'urgent') return n.priority === 'high';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleToggleRead = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const handleDeleteNotification = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (selectedNotification?.id === id) {
      setSelectedNotification(null);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all notifications?')) {
      setNotifications([]);
    }
  };

  return (
    <div className="p-8 max-w-[1550px] mx-auto space-y-6 select-none font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold text-[#0c2340] tracking-tight flex items-center gap-3">
            <span>Notifications & Alerts</span>
            {unreadCount > 0 && (
              <span className="px-3 py-1 bg-rose-100 text-rose-800 text-xs font-bold rounded-full border border-rose-200">
                {unreadCount} unread
              </span>
            )}
          </h1>
          <p className="text-xs text-gray-500 mt-1">Real-time alerts for student document uploads, deadlines, and advisories</p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 bg-blue-50 text-[#1864db] hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Mark all as read</span>
            </button>
          )}

          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-3 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Tabs */}
        <div className="flex items-center gap-1 bg-gray-100/80 p-1 rounded-xl">
          {[
            { id: 'all', label: 'All Alerts', count: notifications.length },
            { id: 'unread', label: 'Unread', count: unreadCount },
            { id: 'submissions', label: 'Submissions', count: notifications.filter(n => n.type === 'submission').length },
            { id: 'urgent', label: 'High Priority', count: notifications.filter(n => n.priority === 'high').length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer",
                activeFilter === tab.id
                  ? "bg-white text-[#0c2340] shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <span>{tab.label}</span>
              <span className={cn(
                "px-1.5 py-0.2 rounded-full text-[10px]",
                activeFilter === tab.id ? "bg-blue-100 text-blue-800" : "bg-gray-200 text-gray-600"
              )}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search alerts..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1864db]/20"
          />
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs divide-y divide-gray-100 overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="p-16 text-center text-gray-500 space-y-2">
            <Bell className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="font-bold text-sm text-gray-700">No notifications found</p>
            <p className="text-xs text-gray-400">You're all caught up with recent submissions and alerts.</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                setSelectedNotification(notif);
                if (!notif.read) handleToggleRead(notif.id);
              }}
              className={cn(
                "p-5 flex items-start justify-between gap-4 transition-colors cursor-pointer hover:bg-blue-50/30",
                !notif.read ? "bg-blue-50/20" : "bg-white"
              )}
            >
              <div className="flex items-start gap-4 min-w-0">
                {/* Status Dot / Icon */}
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                  notif.type === 'submission' ? "bg-emerald-100 text-emerald-700" :
                  notif.type === 'deadline' ? "bg-amber-100 text-amber-700" :
                  notif.type === 'inquiry' ? "bg-blue-100 text-blue-700" :
                  "bg-purple-100 text-purple-700"
                )}>
                  {notif.type === 'submission' && <CheckCircle2 className="w-5 h-5" />}
                  {notif.type === 'deadline' && <Clock className="w-5 h-5" />}
                  {notif.type === 'inquiry' && <Mail className="w-5 h-5" />}
                  {notif.type === 'system' && <Bell className="w-5 h-5" />}
                </div>

                {/* Content */}
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className={cn("text-xs font-bold text-gray-900", !notif.read && "font-black text-[#0c2340]")}>
                      {notif.title}
                    </h4>
                    {notif.priority === 'high' && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-md text-[10px] font-bold">
                        High Priority
                      </span>
                    )}
                    {notif.scholarship && (
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-[10px] font-semibold">
                        {notif.scholarship}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {notif.description}
                  </p>
                  <p className="text-[11px] text-gray-400 pt-0.5">
                    {notif.timestamp} {notif.studentName && `• Scholar: ${notif.studentName} (${notif.studentId})`}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={(e) => handleToggleRead(notif.id, e)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100 transition-colors"
                  title={notif.read ? "Mark as unread" : "Mark as read"}
                >
                  <Check className={cn("w-4 h-4", notif.read ? "text-gray-300" : "text-blue-600 font-bold")} />
                </button>
                <button
                  onClick={(e) => handleDeleteNotification(notif.id, e)}
                  className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Delete alert"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Navigation Arrows */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => navigate('/admin/submissions')}
          className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-xl px-5 py-2 shadow-xs transition-colors flex items-center justify-center cursor-pointer hover:border-gray-400"
          title="Back to Submissions"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        <button
          onClick={() => navigate('/admin/communications')}
          className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-xl px-5 py-2 shadow-xs transition-colors flex items-center justify-center cursor-pointer hover:border-gray-400"
          title="Next to Communications"
        >
          <ChevronRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-blue-50/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{selectedNotification.title}</h3>
                  <p className="text-[11px] text-gray-500">{selectedNotification.timestamp}</p>
                </div>
              </div>
              <button onClick={() => setSelectedNotification(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs leading-relaxed text-gray-700">
              <p>{selectedNotification.description}</p>

              {selectedNotification.studentName && (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/80 space-y-2">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-500">Scholar:</span>
                    <span className="font-semibold text-gray-900">{selectedNotification.studentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-500">Student ID:</span>
                    <span className="font-mono text-gray-900">{selectedNotification.studentId}</span>
                  </div>
                  {selectedNotification.scholarship && (
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-500">Scholarship:</span>
                      <span className="text-blue-700 font-bold">{selectedNotification.scholarship}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between">
              <button
                onClick={() => {
                  navigate('/admin/communications');
                  setSelectedNotification(null);
                }}
                className="px-4 py-2 bg-[#1864db] text-white rounded-xl text-xs font-bold hover:bg-[#114ba3] transition-colors"
              >
                Draft Response in Communications
              </button>
              <button
                onClick={() => setSelectedNotification(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
