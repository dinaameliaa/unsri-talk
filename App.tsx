

import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import { Role, User, Chat, MessageContent, ChatMessage, ConsultationCategory, StaffRole } from './types';
import { MOCK_USERS, MOCK_CHATS } from './constants';

type Page = 'landing' | 'login' | 'dashboard';

export interface LoginDetails {
  name: string;
  nim_nip: string;
  email: string;
  pass: string;
}

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('landing');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS);
  const [typingStatus, setTypingStatus] = useState<Record<string, boolean>>({});
  const [users, setUsers] = useState<{ [key: string]: User }>(MOCK_USERS);

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setPage('login');
  };

  const generateLecturerResponse = async (chat: Chat, student: User): Promise<string> => {
      const lecturer = chat.participants.find(p => p.role === Role.LECTURER);
      if (!lecturer) return "Maaf, saya sedang tidak bisa menjawab.";

      const systemInstruction = `You are ${lecturer.name}, a helpful and professional lecturer at Universitas Sriwijaya, specializing in ${lecturer.expertise?.join(', ') || 'general topics'}. You are chatting with a student named ${student.name}. The topic of this consultation is "${chat.topic}". Keep your answers concise, supportive, and relevant to the student's questions. Always respond in Bahasa Indonesia.`;
      
      const formattedHistory = chat.messages.map(msg => ({
          role: msg.senderId === lecturer.id ? 'model' : 'user',
          parts: [{ text: msg.text || '(file attached)' }],
      }));

      try {
          const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: formattedHistory,
              config: { systemInstruction },
          });
          return response.text;
      } catch (error) {
          console.error("Gemini API error:", error);
          return "Maaf, terjadi kesalahan pada sistem AI. Silakan coba lagi nanti.";
      }
  };

  const generateInitialMessage = async (lecturer: User, student: User, topic: ConsultationCategory): Promise<string> => {
    const systemInstruction = `You are ${lecturer.name}, a helpful and professional lecturer at Universitas Sriwijaya, specializing in ${lecturer.expertise?.join(', ') || 'general topics'}. 
    You are starting a new consultation chat with a student named ${student.name} about the topic "${topic}". 
    Your task is to write a single, friendly, and welcoming opening message. 
    Invite the student to ask their question. 
    Keep it concise and respond in Bahasa Indonesia.`;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [{ role: 'user', parts: [{ text: 'Please provide the opening message.' }] }],
            config: { systemInstruction },
        });
        return response.text;
    } catch (error) {
        console.error("Gemini API error (initial message):", error);
        return `Halo ${student.name}, saya ${lecturer.name}. Selamat datang di sesi konsultasi topik "${topic}". Silakan ajukan pertanyaan Anda.`;
    }
  };


  const handleSendMessage = async (chatId: string, messageContent: MessageContent) => {
    if (!currentUser) return;

    const userMessage: ChatMessage = {
      id: `m${Date.now()}`,
      senderId: currentUser.id,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      read: false,
      ...messageContent,
    };

    let updatedChat: Chat | null = null;
    
    setChats(prevChats => {
        const newChats = prevChats.map(c => {
            if (c.id === chatId) {
                updatedChat = { ...c, messages: [...c.messages, userMessage] };
                return updatedChat;
            }
            return c;
        });
        return newChats;
    });

    if (updatedChat && currentUser.role === Role.STUDENT && updatedChat.participants.some(p => p.role === Role.LECTURER)) {
        setTypingStatus(prev => ({ ...prev, [chatId]: true }));
        
        const aiText = await generateLecturerResponse(updatedChat, currentUser);

        const lecturer = updatedChat.participants.find(p => p.role === Role.LECTURER)!;
        const aiMessage: ChatMessage = {
          id: `m${Date.now() + 1}`,
          senderId: lecturer.id,
          text: aiText,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          read: false,
        };

        setChats(prev => prev.map(c =>
          c.id === chatId ? { ...c, messages: [...(c.messages || []), aiMessage] } : c
        ));
        setTypingStatus(prev => ({ ...prev, [chatId]: false }));
    }
  };

  const handleCreateChat = async (participants: User[], topic: ConsultationCategory): Promise<Chat> => {
    const student = participants.find(p => p.role === Role.STUDENT)!;
    const lecturer = participants.find(p => p.role === Role.LECTURER)!;

    const initialText = await generateInitialMessage(lecturer, student, topic);
    
    const initialMessage: ChatMessage = {
        id: `m${Date.now()}`,
        senderId: lecturer.id,
        text: initialText,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        read: true,
    };

    const newChat: Chat = {
        id: `chat-${Date.now()}`,
        participants,
        messages: [initialMessage],
        topic,
        type: 'private',
    };

    setChats(prev => [...prev, newChat]);
    return newChat;
  };

  const handleLogin = (details: LoginDetails) => {
    const userToLogin = Object.values(users).find(u =>
        u.email.toLowerCase() === details.email.toLowerCase() &&
        u.nim_nip === details.nim_nip &&
        u.role === selectedRole
    );

    if (userToLogin) {
      setCurrentUser(userToLogin);
      setPage('dashboard');
    } else {
      alert('Login gagal. Email, NIM/NIP, atau peran tidak cocok.');
    }
  };
  
  const handleRegister = (details: LoginDetails): boolean => {
    console.log('Registration attempt with details:', details);
    if (!selectedRole) {
        alert('Peran tidak valid. Silakan coba lagi.');
        return false;
    }

    const userExists = Object.values(users).some(u => u.email.toLowerCase() === details.email.toLowerCase());
    if (userExists) {
        alert('Email sudah terdaftar. Silakan gunakan email lain atau masuk.');
        return false;
    }

    const newUserId = `user-${Date.now()}`;
    const newUser: User = {
        id: newUserId,
        name: details.name,
        email: details.email,
        role: selectedRole,
        nim_nip: details.nim_nip,
        ...(selectedRole === Role.STUDENT && { faculty: 'FASILKOM' }),
        ...(selectedRole === Role.LECTURER && { faculty: 'FASILKOM', expertise: [ConsultationCategory.ACADEMIC] }),
        ...(selectedRole === Role.STAFF && { staffRole: StaffRole.ACADEMIC }),
    };
    
    setUsers(prevUsers => ({
      ...prevUsers,
      [newUserId]: newUser,
    }));
    
    return true;
  };
  
  const handleUpdateUser = (updatedUser: User) => {
      setCurrentUser(updatedUser);
  }
  
  const handleUpdateGroup = (chatId: string, details: { name?: string; avatarUrl?: string }) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId && chat.type === 'group') {
        return { ...chat, ...details };
      }
      return chat;
    }));
  };

  const handleAddMembersToGroup = (chatId: string, newUserIds: string[]) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId && chat.type === 'group') {
        const existingMemberIds = new Set(chat.participants.map(p => p.id));
        const membersToAdd = newUserIds
          .map(id => Object.values(users).find(u => u.id === id))
          .filter((user): user is User => !!user && !existingMemberIds.has(user.id));
        
        return { ...chat, participants: [...chat.participants, ...membersToAdd] };
      }
      return chat;
    }));
  };

  const handleRemoveMemberFromGroup = (chatId: string, memberIdToRemove: string) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId && chat.type === 'group') {
        return { 
          ...chat, 
          participants: chat.participants.filter(p => p.id !== memberIdToRemove) 
        };
      }
      return chat;
    }));
  };

  const handleCreateGroupChat = (groupName: string, memberIds: string[]) => {
    if (!currentUser) return;

    const members = memberIds
      .map(id => Object.values(users).find(u => u.id === id))
      .filter((user): user is User => !!user);
    
    const newChat: Chat = {
      id: `group-${Date.now()}`,
      name: groupName,
      participants: [currentUser, ...members],
      messages: [],
      type: 'group',
    };

    setChats(prev => [...prev, newChat]);
  };


  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedRole(null);
    setPage('landing');
  };
  
  const handleBackToLanding = () => {
    setSelectedRole(null);
    setPage('landing');
  };

  const renderPage = () => {
    switch (page) {
      case 'landing':
        return <LandingPage onRoleSelect={handleRoleSelect} />;
      case 'login':
        if (selectedRole) {
          return <LoginPage 
                    role={selectedRole} 
                    onLogin={handleLogin} 
                    onRegister={handleRegister}
                    onBack={handleBackToLanding}
                 />;
        }
        // Fallback to landing if role is not selected
        setPage('landing');
        return <LandingPage onRoleSelect={handleRoleSelect} />;
      case 'dashboard':
        if (currentUser) {
          return <Dashboard 
                    user={currentUser} 
                    users={users}
                    onLogout={handleLogout} 
                    onUpdateUser={handleUpdateUser}
                    chats={chats}
                    onSendMessage={handleSendMessage}
                    onCreateChat={handleCreateChat}
                    onCreateGroupChat={handleCreateGroupChat}
                    typingStatus={typingStatus}
                    onUpdateGroup={handleUpdateGroup}
                    onAddMembersToGroup={handleAddMembersToGroup}
                    onRemoveMemberFromGroup={handleRemoveMemberFromGroup}
                    />;
        }
         // Fallback to landing if user is not set
        setPage('landing');
        return <LandingPage onRoleSelect={handleRoleSelect} />;
      default:
        return <LandingPage onRoleSelect={handleRoleSelect} />;
    }
  };

  return <div className="antialiased">{renderPage()}</div>;
};

export default App;