

import React, { useState, useEffect } from 'react';
import { User, Chat, ConsultationCategory, MessageContent, Role, Announcement } from '../types';
import { MOCK_ANNOUNCEMENTS } from '../constants';
import ChatWindow from './ChatWindow';
import { UsersIcon, ArrowLeftIcon, SearchIcon, TargetIcon, PlusCircleIcon } from './icons';

interface StudentDashboardProps {
  user: User;
  users: { [key: string]: User };
  activeMenu: string;
  chats: Chat[];
  onSendMessage: (chatId: string, messageContent: MessageContent) => void;
  onCreateChat: (participants: User[], topic: ConsultationCategory) => Promise<Chat>;
  onCreateGroupChat: (groupName: string, memberIds: string[]) => void;
  typingStatus: Record<string, boolean>;
  onUpdateGroup: (chatId: string, details: { name?: string; avatarUrl?: string }) => void;
  onAddMembersToGroup: (chatId: string, newUserIds: string[]) => void;
  onRemoveMemberFromGroup: (chatId: string, memberId: string) => void;
}

const consultationCategories = Object.values(ConsultationCategory);

const StudentDashboard: React.FC<StudentDashboardProps> = (props) => {
    const { user, users, activeMenu, chats, onSendMessage, onCreateChat, onCreateGroupChat, typingStatus, onUpdateGroup, onAddMembersToGroup, onRemoveMemberFromGroup } = props;
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<ConsultationCategory | null>(null);
    const [filteredLecturers, setFilteredLecturers] = useState<User[]>([]);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    
    // Create group modal state
    const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

    const allLecturers = Object.values(users).filter(u => u.role === Role.LECTURER);
    const allStudents = Object.values(users).filter(u => u.role === Role.STUDENT);

    // Effect to reset view when sidebar menu changes
    useEffect(() => {
        setSelectedChatId(null);
        setSelectedCategory(null);
        setSelectedAnnouncement(null);
        setSearchQuery('');
    }, [activeMenu]);

    const privateChats = chats.filter(chat => chat.type === 'private' && chat.participants.some(p => p.id === user.id));
    const groupChats = chats.filter(chat => chat.type === 'group' && chat.participants.some(p => p.id === user.id));
    const allUserChats = [...privateChats, ...groupChats].sort((a, b) => {
        const lastMsgA = a.messages[a.messages.length - 1];
        const lastMsgB = b.messages[b.messages.length - 1];
        if (!lastMsgA || !lastMsgB) return 0;
        // A simple string comparison might not be robust for time.
        // For this mock, it's okay. A real app would use Date objects.
        if (!lastMsgA.timestamp || !lastMsgB.timestamp) return 0;
        return lastMsgB.timestamp.localeCompare(lastMsgA.timestamp);
    });

    const filteredPrivateChats = privateChats.filter(chat => {
        const otherUser = chat.participants.find(p => p.id !== user.id);
        return otherUser?.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
    
    const filteredGroupChats = groupChats.filter(chat =>
        chat.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelectCategory = (category: ConsultationCategory) => {
        const lecturers = allLecturers.filter(lecturer => lecturer.expertise?.includes(category));
        setFilteredLecturers(lecturers);
        setSelectedCategory(category);
    }

    const handleSelectLecturer = async (lecturer: User) => {
        const existingChat = chats.find(c =>
            c.type === 'private' &&
            c.topic === selectedCategory &&
            c.participants.some(p => p.id === user.id) &&
            c.participants.some(p => p.id === lecturer.id)
        );

        if (existingChat) {
            setSelectedChatId(existingChat.id);
        } else {
            const newChat = await onCreateChat([user, lecturer], selectedCategory!);
            setSelectedChatId(newChat.id);
        }
    }

    const handleCreateGroupSubmit = () => {
        if (newGroupName.trim() && selectedMembers.length > 0) {
            onCreateGroupChat(newGroupName, selectedMembers);
            setIsCreateGroupModalOpen(false);
            setNewGroupName('');
            setSelectedMembers([]);
        } else {
            alert('Nama grup tidak boleh kosong dan minimal pilih 1 anggota.');
        }
    };
    
    const selectedChat = chats.find(c => c.id === selectedChatId);

    if (selectedChat) {
        return <ChatWindow
                    chat={selectedChat}
                    currentUser={user}
                    users={users}
                    onBack={() => setSelectedChatId(null)}
                    onSendMessage={onSendMessage}
                    isTyping={typingStatus[selectedChat.id]}
                    onUpdateGroup={onUpdateGroup}
                    onAddMembersToGroup={onAddMembersToGroup}
                    onRemoveMemberFromGroup={onRemoveMemberFromGroup}
                />;
    }

    const renderCreateGroupModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col">
                <header className="p-4 border-b">
                    <h2 className="text-lg font-bold text-slate-text">Buat Grup Baru</h2>
                </header>
                <main className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
                     <div>
                        <label htmlFor="groupName" className="text-sm font-medium text-gray-700">Nama Grup</label>
                        <input id="groupName" type="text" value={newGroupName} onChange={e => setNewGroupName(e.target.value)} placeholder="Contoh: Diskusi Proyek Akhir" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-unsri-yellow focus:border-unsri-yellow" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-text mb-2 text-sm">Pilih Anggota</h3>
                        <div className="space-y-2 max-h-56 overflow-y-auto border rounded-lg p-2">
                           {allStudents.filter(student => student.id !== user.id).map(student => (
                               <label key={student.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                                   <input type="checkbox" className="h-4 w-4 text-unsri-yellow border-gray-300 rounded focus:ring-unsri-yellow"
                                        value={student.id}
                                        checked={selectedMembers.includes(student.id)}
                                        onChange={e => {
                                            if (e.target.checked) {
                                                setSelectedMembers([...selectedMembers, student.id]);
                                            } else {
                                                setSelectedMembers(selectedMembers.filter(id => id !== student.id));
                                            }
                                        }}
                                   />
                                   <img src={student.avatarUrl || `https://picsum.photos/seed/${student.id}/32/32`} alt={student.name} className="w-8 h-8 rounded-full object-cover"/>
                                   <span className="text-sm text-gray-800">{student.name}</span>
                               </label>
                           ))}
                        </div>
                    </div>
                </main>
                <footer className="p-4 border-t bg-gray-50 flex justify-end space-x-3">
                    <button onClick={() => setIsCreateGroupModalOpen(false)} className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Batal</button>
                    <button onClick={handleCreateGroupSubmit} className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-slate-800 bg-unsri-yellow hover:bg-yellow-500">Buat Grup</button>
                </footer>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeMenu) {
            case 'Chat Pribadi':
                return (
                    <div className="bg-white rounded-2xl shadow-lg p-6 h-full flex flex-col">
                        <h2 className="text-2xl font-bold text-slate-text mb-6">{activeMenu}</h2>
                        <div className="relative mb-4">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <SearchIcon className="w-5 h-5 text-gray-400" />
                            </span>
                            <input
                                type="text"
                                placeholder="Cari berdasarkan nama..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-unsri-yellow"
                            />
                        </div>
                        <ul className="space-y-2 overflow-y-auto flex-1">
                           {filteredPrivateChats.map(chat => {
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
            case 'Grup Chat':
                 return (
                    <div className="bg-white rounded-2xl shadow-lg p-6 h-full flex flex-col">
                         <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-slate-text">{activeMenu}</h2>
                             <button onClick={() => setIsCreateGroupModalOpen(true)} className="flex items-center space-x-2 text-sm font-semibold text-unsri-yellow hover:text-yellow-600 transition-colors">
                                <PlusCircleIcon className="w-5 h-5" />
                                <span>Buat Grup Baru</span>
                            </button>
                        </div>
                        <div className="relative mb-4">
                             <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <SearchIcon className="w-5 h-5 text-gray-400" />
                            </span>
                            <input
                                type="text"
                                placeholder="Cari berdasarkan nama grup..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-unsri-yellow"
                            />
                        </div>
                        <ul className="space-y-2 overflow-y-auto flex-1">
                           {filteredGroupChats.map(chat => {
                               const lastMessage = chat.messages[chat.messages.length - 1];
                               const sender = chat.participants.find(p => p.id === lastMessage?.senderId);
                               return (
                                <li key={chat.id} onClick={() => setSelectedChatId(chat.id)} className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                                    <div className="w-12 h-12 rounded-full mr-4 bg-unsri-yellow-light flex items-center justify-center flex-shrink-0">
                                        <UsersIcon className="w-6 h-6 text-unsri-yellow"/>
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex justify-between">
                                            <h3 className="font-semibold text-slate-text truncate">{chat.name}</h3>
                                            <p className="text-xs text-gray-400 flex-shrink-0 ml-2">{lastMessage?.timestamp}</p>
                                        </div>
                                        <p className="text-sm text-gray-500 truncate">
                                            {lastMessage ? (
                                                <>
                                                    <span className="font-medium">{sender?.id === user.id ? 'Anda' : sender?.name?.split(' ')[0]}:</span> {lastMessage?.text || 'File'}
                                                </>
                                            ) : (
                                                <span className="italic">Belum ada pesan.</span>
                                            )}
                                        </p>
                                    </div>
                                </li>
                               )
                           })}
                        </ul>
                    </div>
                );
            case 'Riwayat Chat':
                return (
                    <div className="bg-white rounded-2xl shadow-lg p-6 h-full overflow-y-auto">
                        <h2 className="text-2xl font-bold text-slate-text mb-6">{activeMenu}</h2>
                        <ul className="space-y-2">
                           {allUserChats.map(chat => {
                               const otherUser = chat.participants.find(p => p.id !== user.id);
                               const lastMessage = chat.messages[chat.messages.length - 1];
                               const isGroup = chat.type === 'group';
                               const sender = chat.participants.find(p => p.id === lastMessage?.senderId);
                               return (
                                <li key={chat.id} onClick={() => setSelectedChatId(chat.id)} className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                                    {isGroup ? (
                                         <div className="w-12 h-12 rounded-full mr-4 bg-unsri-yellow-light flex items-center justify-center flex-shrink-0">
                                            <UsersIcon className="w-6 h-6 text-unsri-yellow"/>
                                        </div>
                                    ) : (
                                        <img src={otherUser?.avatarUrl || `https://picsum.photos/seed/${otherUser?.id}/50/50`} alt="avatar" className="w-12 h-12 rounded-full mr-4 flex-shrink-0 object-cover"/>
                                    )}
                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex justify-between">
                                            <h3 className="font-semibold text-slate-text truncate">{isGroup ? chat.name : otherUser?.name}</h3>
                                            <p className="text-xs text-gray-400 flex-shrink-0 ml-2">{lastMessage?.timestamp}</p>
                                        </div>
                                        <p className="text-sm text-gray-500 truncate">
                                           {lastMessage ? `${isGroup && sender ? `${sender.id === user.id ? 'Anda' : sender.name?.split(' ')[0]}: ` : ''}${lastMessage.text || 'File'}`: 'Tidak ada pesan'}
                                        </p>
                                    </div>
                                </li>
                               )
                           })}
                        </ul>
                    </div>
                );
            case 'Konsultasi Kampus':
                return (
                    <div className="bg-white rounded-2xl shadow-lg h-full flex overflow-hidden">
                        {/* Left Column: Topics */}
                        <div className="w-1/3 border-r p-6 overflow-y-auto">
                            <h2 className="text-xl font-bold text-slate-text mb-2">Pilih Topik</h2>
                            <p className="text-gray-500 mb-6 text-sm">Pilih topik untuk melihat dosen yang tersedia.</p>
                            <div className="space-y-2">
                                {consultationCategories.map(category => (
                                    <div key={category} 
                                        onClick={() => handleSelectCategory(category)} 
                                        className={`p-4 rounded-lg cursor-pointer transition ${selectedCategory === category ? 'bg-unsri-yellow-light border-unsri-yellow' : 'border border-transparent hover:bg-gray-50'}`}>
                                        <h3 className={`font-semibold ${selectedCategory === category ? 'text-yellow-800' : 'text-slate-text'}`}>{category}</h3>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Right Column: Lecturers */}
                        <div className="w-2/3 p-6 overflow-y-auto">
                            {selectedCategory ? (
                                <>
                                    <h2 className="text-xl font-bold text-slate-text mb-6">Dosen Tersedia untuk Topik <span className="text-unsri-yellow">{selectedCategory}</span></h2>
                                    <ul className="space-y-2">
                                        {filteredLecturers.length > 0 ? filteredLecturers.map(lecturer => (
                                            <li key={lecturer.id} onClick={() => handleSelectLecturer(lecturer)} className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                                                <img src={lecturer.avatarUrl || `https://picsum.photos/seed/${lecturer.id}/50/50`} alt="avatar" className="w-12 h-12 rounded-full mr-4 object-cover"/>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-slate-text">{lecturer.name}</h3>
                                                    <p className="text-sm text-gray-500">{lecturer.faculty}</p>
                                                </div>
                                            </li>
                                        )) : <p className="text-gray-500">Tidak ada dosen yang tersedia untuk topik ini.</p>}
                                    </ul>
                                </>
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center">
                                        <TargetIcon className="w-16 h-16 text-gray-300 mx-auto mb-4"/>
                                        <p className="text-gray-500">Pilih topik di samping untuk <br/> memulai konsultasi.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 'Info & Pengumuman':
                if (selectedAnnouncement) {
                    return (
                        <div className="bg-white rounded-2xl shadow-lg p-6 h-full overflow-y-auto">
                            <button 
                                onClick={() => setSelectedAnnouncement(null)} 
                                className="flex items-center text-sm text-gray-600 hover:text-slate-text mb-6 font-semibold">
                                <ArrowLeftIcon className="w-4 h-4 mr-2"/>
                                Kembali ke Daftar Pengumuman
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
                        <h2 className="text-2xl font-bold text-slate-text mb-6">Informasi & Pengumuman</h2>
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
    };
    
    return (
        <div>
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-text">Halo, {user.name}! 👋</h1>
                <p className="text-gray-600">Ada yang ingin kamu tanyakan hari ini?</p>
            </header>
            <div style={{height: 'calc(100vh - 12rem)'}}>
              {renderContent()}
            </div>
            {isCreateGroupModalOpen && renderCreateGroupModal()}
        </div>
    );
};

export default StudentDashboard;