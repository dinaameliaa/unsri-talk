

import React, { useState, useEffect } from 'react';
import { User, Chat, MessageContent, Announcement } from '../types';
import { MOCK_ANNOUNCEMENTS } from '../constants';
import ChatWindow from './ChatWindow';
import { ArrowLeftIcon } from './icons';

interface LecturerDashboardProps {
  user: User;
  users: { [key: string]: User };
  activeMenu: string;
  chats: Chat[];
  onSendMessage: (chatId: string, messageContent: MessageContent) => void;
  typingStatus: Record<string, boolean>;
}

const LecturerDashboard: React.FC<LecturerDashboardProps> = ({ user, users, activeMenu, chats, onSendMessage, typingStatus }) => {
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

    // Effect to reset view when sidebar menu changes
    useEffect(() => {
        setSelectedChatId(null);
        setSelectedAnnouncement(null);
    }, [activeMenu]);

    const userChats = chats.filter(chat => chat.participants.some(p => p.id === user.id));
    
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
            case 'Pesan Masuk':
            case 'Chat Pribadi':
            case 'Bimbingan & Konsultasi':
                 return (
                    <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
                        <h2 className="text-2xl font-bold text-slate-text mb-6">{activeMenu}</h2>
                        <ul className="space-y-2">
                           {userChats.map(chat => {
                               const otherUser = chat.participants.find(p => p.id !== user.id);
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
            case 'Informasi Kampus':
                 if (selectedAnnouncement) {
                    return (
                        <div className="bg-white rounded-2xl shadow-lg p-6 h-full overflow-y-auto">
                            <button 
                                onClick={() => setSelectedAnnouncement(null)} 
                                className="flex items-center text-sm text-gray-600 hover:text-slate-text mb-6 font-semibold">
                                <ArrowLeftIcon className="w-4 h-4 mr-2"/>
                                Kembali ke Daftar Informasi
                            </button>
                             <div className="border-l-4 border-unsri-yellow pl-4 py-2 mb-6">
                                <span className="text-sm font-semibold text-yellow-700 bg-unsri-yellow-light px-3 py-1 rounded-full">{selectedAnnouncement.category}</span>
                                <h2 className="text-3xl font-bold text-slate-text mt-4">{selectedAnnouncement.title}</h2>
                                <p className="text-sm text-gray-500 mt-2">
                                    Diposting oleh <span className="font-medium">{selectedAnnouncement.author}</span> pada {selectedAnnouncement.date}
                                </p>
                            </div>
                            <div className="prose max-w-none text-gray-800 leading-relaxed">
                                {selectedAnnouncement.content.split('\n').map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))}
                            </div>
                        </div>
                    );
                }
                return (
                    <div className="bg-white rounded-2xl shadow-lg p-6 h-full overflow-y-auto">
                        <h2 className="text-2xl font-bold text-slate-text mb-6">Informasi Kampus</h2>
                         <div className="space-y-4">
                            {MOCK_ANNOUNCEMENTS.map(ann => (
                                <div key={ann.id} onClick={() => setSelectedAnnouncement(ann)} className="border-l-4 border-unsri-yellow bg-yellow-50 p-4 rounded-r-lg hover:shadow-md hover:bg-unsri-yellow-light cursor-pointer transition-all duration-200">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-bold text-slate-800 text-lg mb-1">{ann.title}</h3>
                                        <span className="text-xs text-gray-500 flex-shrink-0 ml-4 mt-1">{ann.date}</span>
                                    </div>
                                    <span className="text-xs font-semibold text-yellow-600 bg-yellow-200 px-2 py-0.5 rounded-full">{ann.category}</span>
                                    <p className="text-sm text-gray-700 mt-2 truncate">{ann.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            default:
                return <div>Pilih menu di samping.</div>;
        }
    }

    return (
        <div>
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-text">Selamat datang, {user.name}! 👋</h1>
                <p className="text-gray-600">Siap membantu mahasiswa hari ini?</p>
            </header>
            <div style={{height: 'calc(100vh - 12rem)'}}>
                {renderContent()}
            </div>
        </div>
    );
};

export default LecturerDashboard;