

import React, { useState } from 'react';
import { User, Role, Chat, MessageContent, ConsultationCategory } from '../types';
import StudentDashboard from './StudentDashboard';
import LecturerDashboard from './LecturerDashboard';
import StaffDashboard from './StaffDashboard';
import AccountSettings from './AccountSettings';
import { MessageCircleIcon, TargetIcon, MegaphoneIcon, HistoryIcon, LogOutIcon, InboxIcon, BookUserIcon, FileTextIcon, BarChart3Icon, UsersIcon, SettingsIcon } from './icons';

interface DashboardProps {
  user: User;
  users: { [key: string]: User };
  onLogout: () => void;
  onUpdateUser: (user: User) => void;
  chats: Chat[];
  onSendMessage: (chatId: string, messageContent: MessageContent) => Promise<void>;
  onCreateChat: (participants: User[], topic: ConsultationCategory) => Promise<Chat>;
  onCreateGroupChat: (groupName: string, memberIds: string[]) => void;
  typingStatus: Record<string, boolean>;
  onUpdateGroup: (chatId: string, details: { name?: string; avatarUrl?: string }) => void;
  onAddMembersToGroup: (chatId: string, newUserIds: string[]) => void;
  onRemoveMemberFromGroup: (chatId: string, memberId: string) => void;
}

const getMenuItems = (role: Role) => {
    switch (role) {
        case Role.STUDENT:
            return [
                { name: 'Chat Pribadi', icon: MessageCircleIcon },
                { name: 'Grup Chat', icon: UsersIcon },
                { name: 'Konsultasi Kampus', icon: TargetIcon },
                { name: 'Info & Pengumuman', icon: MegaphoneIcon },
                { name: 'Riwayat Chat', icon: HistoryIcon },
            ];
        case Role.LECTURER:
            return [
                { name: 'Pesan Masuk', icon: InboxIcon },
                { name: 'Chat Pribadi', icon: MessageCircleIcon },
                { name: 'Bimbingan & Konsultasi', icon: BookUserIcon },
                { name: 'Informasi Kampus', icon: MegaphoneIcon },
            ];
        case Role.STAFF:
            return [
                { name: 'Kotak Masuk', icon: InboxIcon },
                { name: 'Data Konsultasi', icon: FileTextIcon },
                { name: 'Pengumuman Kampus', icon: MegaphoneIcon },
                { name: 'Laporan Aktivitas', icon: BarChart3Icon },
            ];
        default:
            return [];
    }
};

const Dashboard: React.FC<DashboardProps> = (props) => {
  const { user, users, onLogout, onUpdateUser, chats, onSendMessage, onCreateChat, onCreateGroupChat, typingStatus, onUpdateGroup, onAddMembersToGroup, onRemoveMemberFromGroup } = props;
  const menuItems = getMenuItems(user.role);
  const [activeMenu, setActiveMenu] = useState(menuItems[0]?.name || '');

  const renderDashboardContent = () => {
    if (activeMenu === 'Pengaturan Akun') {
        return <AccountSettings user={user} onUpdateUser={onUpdateUser} />;
    }
    switch (user.role) {
      case Role.STUDENT:
        return <StudentDashboard 
                    user={user} 
                    users={users}
                    activeMenu={activeMenu} 
                    chats={chats} 
                    onSendMessage={onSendMessage} 
                    onCreateChat={onCreateChat}
                    onCreateGroupChat={onCreateGroupChat}
                    typingStatus={typingStatus}
                    onUpdateGroup={onUpdateGroup}
                    onAddMembersToGroup={onAddMembersToGroup}
                    onRemoveMemberFromGroup={onRemoveMemberFromGroup}
                />;
      case Role.LECTURER:
        return <LecturerDashboard 
                    user={user} 
                    users={users}
                    activeMenu={activeMenu} 
                    chats={chats} 
                    onSendMessage={onSendMessage} 
                    typingStatus={typingStatus}
                />;
      case Role.STAFF:
        return <StaffDashboard 
                    user={user} 
                    users={users}
                    activeMenu={activeMenu} 
                    chats={chats} 
                    onSendMessage={onSendMessage} 
                    typingStatus={typingStatus}
                />;
      default:
        return <div>Peran tidak dikenal.</div>;
    }
  };

  return (
    <div className="min-h-screen bg-unsri-bg font-sans flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-6 flex-shrink-0 flex flex-col justify-between">
        <div>
          <div className="text-center mb-10">
            <h1 className="text-xl font-bold text-slate-text">UNSRI <span className="text-unsri-yellow">TALK</span></h1>
          </div>
          
          <div className="text-center mb-10">
              <img src={user.avatarUrl || `https://picsum.photos/seed/${user.id}/100/100`} alt="User Avatar" className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"/>
              <h2 className="font-semibold text-slate-text">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.role}{user.staffRole ? ` (${user.staffRole})` : ''}</p>
          </div>
          
          <nav>
            <ul>
              {menuItems.map(item => (
                <li key={item.name}>
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); setActiveMenu(item.name); }}
                    className={`flex items-center space-x-3 p-3 rounded-lg mb-2 transition-colors ${
                      activeMenu === item.name 
                        ? 'bg-unsri-yellow-light text-unsri-yellow font-semibold' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
             <hr className="my-4 border-gray-200" />
            <ul>
                 <li>
                    <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); setActiveMenu('Pengaturan Akun'); }}
                        className={`flex items-center space-x-3 p-3 rounded-lg mb-2 transition-colors ${
                        activeMenu === 'Pengaturan Akun' 
                            ? 'bg-unsri-yellow-light text-unsri-yellow font-semibold' 
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        <SettingsIcon className="w-5 h-5" />
                        <span>Pengaturan Akun</span>
                    </a>
                </li>
            </ul>
          </nav>
        </div>

        <button 
          onClick={onLogout}
          className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors w-full"
        >
          <LogOutIcon className="w-5 h-5" />
          <span>Keluar</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {renderDashboardContent()}
      </main>
    </div>
  );
};

export default Dashboard;