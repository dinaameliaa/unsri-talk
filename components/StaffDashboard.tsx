

import React, { useState, useEffect } from 'react';
import { User, Chat, MessageContent } from '../types';
import { MOCK_ANNOUNCEMENTS } from '../constants';
import ChatWindow from './ChatWindow';

interface StaffDashboardProps {
  user: User;
  users: { [key: string]: User };
  activeMenu: string;
  chats: Chat[];
  onSendMessage: (chatId: string, messageContent: MessageContent) => void;
  typingStatus: Record<string, boolean>;
}

const StaffDashboard: React.FC<StaffDashboardProps> = ({ user, users, activeMenu, chats, onSendMessage, typingStatus }) => {
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

    useEffect(() => {
        setSelectedChatId(null);
    }, [activeMenu]);

    const userChats = chats.filter(chat => chat.participants.some(p => p.id === user.id || p.role === 'Staf / Admin Kampus'));

    const selectedChat = chats.find(c => c.id === selectedChatId);

     if (selectedChat) {
        return <ChatWindow 
                    chat={selectedChat} 
                    currentUser={user} 
                    // FIX: Pass the 'users' prop to ChatWindow.
                    users={users}
                    onBack={() => setSelectedChatId(null)} 
                    onSendMessage={onSendMessage}
                    isTyping={typingStatus[selectedChat.id]}
                />;
    }

    const renderContent = () => {
        switch (activeMenu) {
            case 'Kotak Masuk':
                 return (
                    <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
                        <h2 className="text-2xl font-bold text-slate-text mb-6">{activeMenu}</h2>
                        <ul className="space-y-2">
                           {userChats.map(chat => {
                               const otherUser = chat.participants.find(p => p.id !== user.id && p.role !== user.role);
                               const lastMessage = chat.messages[chat.messages.length - 1];
                               return (
                                <li key={chat.id} onClick={() => setSelectedChatId(chat.id)} className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                                    <img src={otherUser?.avatarUrl || `https://picsum.photos/seed/${otherUser?.id}/50/50`} alt="avatar" className="w-12 h-12 rounded-full mr-4 object-cover"/>
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <h3 className="font-semibold text-slate-text">{otherUser?.name}</h3>
                                            <p className="text-xs text-gray-400">{lastMessage?.timestamp}</p>
                                        </div>
                                        <p className="text-sm text-gray-500 truncate">{lastMessage?.text || 'File'}</p>
                                    </div>
                                </li>
                               )
                           })}
                        </ul>
                    </div>
                );
            case 'Data Konsultasi':
                return <div className="bg-white rounded-2xl shadow-lg p-6 h-full"><h2 className="text-2xl font-bold text-slate-text mb-6">Data Konsultasi</h2><p>Rekap topik konsultasi berdasarkan kategori akan ditampilkan di sini.</p></div>
            case 'Pengumuman Kampus':
                return (
                     <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
                        <h2 className="text-2xl font-bold text-slate-text mb-6">Buat & Sebarkan Pengumuman</h2>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Judul</label>
                                <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Kategori</label>
                                <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Konten</label>
                                <textarea className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" rows={4}></textarea>
                            </div>
                            <button type="submit" className="bg-unsri-yellow text-slate-800 font-semibold py-2 px-4 rounded-lg">Publikasikan</button>
                        </form>
                    </div>
                )
            case 'Laporan Aktivitas':
                return <div className="bg-white rounded-2xl shadow-lg p-6 h-full"><h2 className="text-2xl font-bold text-slate-text mb-6">Laporan Aktivitas</h2><p>Statistik percakapan dan kategori pertanyaan terbanyak akan ditampilkan di sini.</p></div>;
            default:
                return <div>Pilih menu di samping.</div>;
        }
    }
    
    return (
        <div>
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-text">Selamat datang, {user.name} 👋</h1>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl shadow">
                        <h3 className="font-semibold text-gray-500">Jumlah Konsultasi Hari Ini</h3>
                        <p className="text-3xl font-bold text-slate-text">12</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow">
                        <h3 className="font-semibold text-gray-500">Pesan Belum Dibalas</h3>
                        <p className="text-3xl font-bold text-slate-text">3</p>
                    </div>
                </div>
            </header>
            <div style={{height: 'calc(100vh - 16rem)'}}>
                {renderContent()}
            </div>
        </div>
    );
};

export default StaffDashboard;