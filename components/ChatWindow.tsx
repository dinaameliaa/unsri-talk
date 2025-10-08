

import React, { useState, useRef, useEffect } from 'react';
import { Chat, User, ChatMessage, MessageContent, Role } from '../types';
import { SendIcon, PaperclipIcon, UsersIcon, ArrowLeftIcon, SmileIcon, FileIcon, Settings2Icon, UserPlusIcon, Edit3Icon, XIcon } from './icons';

interface ChatWindowProps {
    chat: Chat;
    currentUser: User;
    users: { [key: string]: User };
    onBack: () => void;
    onSendMessage: (chatId: string, messageContent: MessageContent) => void;
    isTyping?: boolean;
    onUpdateGroup?: (chatId: string, details: { name?: string; avatarUrl?: string }) => void;
    onAddMembersToGroup?: (chatId: string, newUserIds: string[]) => void;
    onRemoveMemberFromGroup?: (chatId: string, memberId: string) => void;
}

const EMOJIS = ['😀', '😂', '😍', '🤔', '👍', '🙏', '🎉', '🔥', '😊', '😭', '🚀', '💯'];

const ChatWindow: React.FC<ChatWindowProps> = ({ chat, currentUser, users, onBack, onSendMessage, isTyping, onUpdateGroup, onAddMembersToGroup, onRemoveMemberFromGroup }) => {
    const [newMessage, setNewMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    
    // Group settings modal state
    const [groupName, setGroupName] = useState(chat.name || '');
    const [groupAvatar, setGroupAvatar] = useState<string | null>(chat.avatarUrl || null);
    const [selectedNewMembers, setSelectedNewMembers] = useState<string[]>([]);
    
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const fileInputRef = useRef<null | HTMLInputElement>(null);
    const groupAvatarInputRef = useRef<null | HTMLInputElement>(null);
    const emojiPickerRef = useRef<null | HTMLDivElement>(null);

    const otherUser = chat.type === 'private' ? chat.participants.find(p => p.id !== currentUser.id) : null;
    const potentialNewMembers = Object.values(users).filter(
        user => user.role === Role.STUDENT && !chat.participants.some(p => p.id === user.id)
    );

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chat.messages, isTyping]);
    
    useEffect(() => {
        if(isSettingsOpen) {
            setGroupName(chat.name || '');
            setGroupAvatar(chat.avatarUrl || null);
            setSelectedNewMembers([]);
        }
    }, [isSettingsOpen, chat]);
    
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [emojiPickerRef]);

    const handleSendMessageSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;
        onSendMessage(chat.id, { text: newMessage });
        setNewMessage('');
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            onSendMessage(chat.id, {
                file: {
                    name: file.name,
                    type: file.type,
                    url: URL.createObjectURL(file),
                },
            });
        }
    };
    
    const handleEmojiSelect = (emoji: string) => {
        setNewMessage(newMessage + emoji);
        setShowEmojiPicker(false);
    }
    
    const handleGroupAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const newPicUrl = URL.createObjectURL(e.target.files[0]);
            setGroupAvatar(newPicUrl);
        }
    };
    
    const handleSaveGroupSettings = () => {
        if (onUpdateGroup && (groupName !== chat.name || groupAvatar !== chat.avatarUrl)) {
            onUpdateGroup(chat.id, { name: groupName, avatarUrl: groupAvatar || undefined });
        }
        if (onAddMembersToGroup && selectedNewMembers.length > 0) {
            onAddMembersToGroup(chat.id, selectedNewMembers);
        }
        setIsSettingsOpen(false);
    };

    const getSender = (senderId: string) => {
        return chat.participants.find(p => p.id === senderId);
    };

    const renderMessageContent = (message: ChatMessage) => {
        if (message.file) {
            if (message.file.type.startsWith('image/')) {
                return <img src={message.file.url} alt={message.file.name} className="max-w-xs rounded-lg cursor-pointer" onClick={() => window.open(message.file!.url, '_blank')} />;
            }
            if (message.file.type.startsWith('video/')) {
                return <video src={message.file.url} controls className="max-w-xs rounded-lg" />;
            }
            return (
                 <a href={message.file.url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition">
                    <FileIcon className="w-8 h-8 text-gray-500 flex-shrink-0" />
                    <div className="overflow-hidden">
                        <p className="font-semibold text-sm text-slate-text truncate">{message.file.name}</p>
                        <p className="text-xs text-gray-500">Dokumen</p>
                    </div>
                </a>
            );
        }
        return <p className="text-sm text-slate-text break-words">{message.text}</p>;
    }
    
    const renderGroupSettingsModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md m-4 flex flex-col">
                <header className="p-4 border-b">
                    <h2 className="text-lg font-bold text-slate-text">Pengaturan Grup</h2>
                </header>
                <main className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
                    {/* Edit Info */}
                    <div>
                        <h3 className="font-semibold text-slate-text mb-3">Profil Grup</h3>
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                {groupAvatar ? (
                                     <img src={groupAvatar} alt="Group Avatar" className="w-20 h-20 rounded-full object-cover"/>
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-unsri-yellow-light flex items-center justify-center">
                                        <UsersIcon className="w-10 h-10 text-unsri-yellow"/>
                                    </div>
                                )}
                                <input type="file" ref={groupAvatarInputRef} onChange={handleGroupAvatarChange} className="hidden" accept="image/*" />
                                <button onClick={() => groupAvatarInputRef.current?.click()} className="absolute -bottom-1 -right-1 bg-white p-1.5 rounded-full shadow border text-gray-600 hover:text-slate-text">
                                    <Edit3Icon className="w-4 h-4"/>
                                </button>
                            </div>
                            <div className="flex-1">
                                <label htmlFor="groupName" className="text-sm font-medium text-gray-700">Nama Grup</label>
                                <input id="groupName" type="text" value={groupName} onChange={e => setGroupName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-unsri-yellow focus:border-unsri-yellow" />
                            </div>
                        </div>
                    </div>
                    {/* Member List */}
                    <div>
                        <h3 className="font-semibold text-slate-text mb-2">{chat.participants.length} Anggota</h3>
                        <ul className="space-y-2 max-h-40 overflow-y-auto">
                            {chat.participants.map(p => (
                                <li key={p.id} className="flex items-center justify-between p-1 rounded-md hover:bg-gray-50">
                                    <div className="flex items-center">
                                        <img src={p.avatarUrl || `https://picsum.photos/seed/${p.id}/32/32`} alt={p.name} className="w-8 h-8 rounded-full mr-3 object-cover"/>
                                        <span className="text-sm text-gray-800">{p.name}</span>
                                    </div>
                                    {p.id !== currentUser.id && onRemoveMemberFromGroup && (
                                        <button onClick={() => onRemoveMemberFromGroup(chat.id, p.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors">
                                            <XIcon className="w-4 h-4" />
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* Add Members */}
                    {potentialNewMembers.length > 0 && (
                        <div>
                            <h3 className="font-semibold text-slate-text mb-2">Tambah Anggota</h3>
                            <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-2">
                               {potentialNewMembers.map(user => (
                                   <label key={user.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                                       <input type="checkbox" className="h-4 w-4 text-unsri-yellow border-gray-300 rounded focus:ring-unsri-yellow"
                                            value={user.id}
                                            onChange={e => {
                                                if (e.target.checked) {
                                                    setSelectedNewMembers([...selectedNewMembers, user.id]);
                                                } else {
                                                    setSelectedNewMembers(selectedNewMembers.filter(id => id !== user.id));
                                                }
                                            }}
                                       />
                                       <img src={user.avatarUrl || `https://picsum.photos/seed/${user.id}/32/32`} alt={user.name} className="w-8 h-8 rounded-full object-cover"/>
                                       <span className="text-sm text-gray-800">{user.name}</span>
                                   </label>
                               ))}
                            </div>
                        </div>
                    )}
                </main>
                <footer className="p-4 border-t bg-gray-50 flex justify-end space-x-3">
                    <button onClick={() => setIsSettingsOpen(false)} className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Batal</button>
                    <button onClick={handleSaveGroupSettings} className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-slate-800 bg-unsri-yellow hover:bg-yellow-500">Simpan Perubahan</button>
                </footer>
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-2xl shadow-lg h-full flex flex-col">
            <header className="p-4 border-b flex items-center">
                <button onClick={onBack} className="p-2 -ml-2 mr-2 text-gray-500 hover:text-slate-text rounded-full hover:bg-gray-100 transition">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                 {chat.type === 'group' ? (
                    <img src={chat.avatarUrl || undefined} onError={(e) => (e.currentTarget.style.display = 'none')} alt="Avatar" className="w-10 h-10 rounded-full mr-4 object-cover"/>
                 ) : null}
                 {chat.type === 'group' && !chat.avatarUrl ? (
                    <div className="w-10 h-10 rounded-full mr-4 bg-unsri-yellow-light flex items-center justify-center flex-shrink-0">
                        <UsersIcon className="w-5 h-5 text-unsri-yellow"/>
                    </div>
                 ) : null}
                 {chat.type === 'private' ? (
                    <img src={otherUser?.avatarUrl || `https://picsum.photos/seed/${otherUser?.id}/40/40`} alt="Avatar" className="w-10 h-10 rounded-full mr-4 object-cover"/>
                 ) : null}

                <div className="flex-1">
                    <h2 className="font-semibold text-slate-text">{chat.type === 'group' ? chat.name : otherUser?.name}</h2>
                    {chat.type === 'group' ? (
                        <p className="text-sm text-gray-500">{chat.participants.length} anggota</p>
                    ) : (
                        <p className="text-sm text-gray-500">{otherUser?.role}</p>
                    )}
                </div>
                {chat.type === 'group' && onUpdateGroup && (
                    <button onClick={() => setIsSettingsOpen(true)} className="p-2 text-gray-500 hover:text-slate-text rounded-full hover:bg-gray-100 transition">
                        <Settings2Icon className="w-6 h-6"/>
                    </button>
                )}
            </header>
            <main className="flex-1 p-6 overflow-y-auto space-y-1">
                {chat.messages.map((message) => {
                    const isCurrentUser = message.senderId === currentUser.id;
                    const sender = getSender(message.senderId);
                    
                    const bubbleClass = isCurrentUser
                        ? 'bg-unsri-yellow-light self-end rounded-br-none'
                        : 'bg-white self-start rounded-bl-none border border-gray-100';

                    return (
                        <div key={message.id} className={`flex flex-col mb-3 ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                            {chat.type === 'group' && !isCurrentUser && (
                                <p className="text-xs text-slate-500 mb-1 ml-2">{sender?.name}</p>
                            )}
                            <div className={`p-3 rounded-xl max-w-md ${bubbleClass}`}>
                                {renderMessageContent(message)}
                                <p className="text-xs text-gray-400 mt-1 text-right">{message.timestamp}</p>
                            </div>
                        </div>
                    );
                })}
                {isTyping && (
                    <div className="flex flex-col mb-3 items-start">
                         <div className="p-3 rounded-xl max-w-md bg-white self-start rounded-bl-none border border-gray-100">
                             <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                             </div>
                         </div>
                     </div>
                )}
                 <div ref={messagesEndRef} />
            </main>
            <footer className="p-4 border-t bg-white">
                <div className="relative">
                     {showEmojiPicker && (
                        <div ref={emojiPickerRef} className="absolute bottom-14 bg-white border rounded-lg shadow-lg p-2 grid grid-cols-6 gap-2">
                            {EMOJIS.map(emoji => (
                                <button key={emoji} onClick={() => handleEmojiSelect(emoji)} className="text-2xl p-1 rounded-lg hover:bg-gray-100">
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    )}
                    <form onSubmit={handleSendMessageSubmit} className="flex items-center space-x-3">
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                        <button type="button" onClick={() => fileInputRef.current?.click()} className="text-gray-500 hover:text-unsri-yellow p-2 rounded-full hover:bg-gray-100 transition">
                            <PaperclipIcon className="w-6 h-6"/>
                        </button>
                        <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="text-gray-500 hover:text-unsri-yellow p-2 rounded-full hover:bg-gray-100 transition">
                            <SmileIcon className="w-6 h-6"/>
                        </button>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Ketik pesan Anda..."
                            className="flex-1 bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-unsri-yellow"
                        />
                        <button type="submit" className="bg-unsri-yellow p-2 rounded-full text-white hover:bg-yellow-500 transition">
                            <SendIcon className="w-5 h-5 text-slate-800"/>
                        </button>
                    </form>
                </div>
            </footer>
            {isSettingsOpen && renderGroupSettingsModal()}
        </div>
    );
};

export default ChatWindow;