
import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { CheckCircleIcon } from './icons';

interface AccountSettingsProps {
    user: User;
    onUpdateUser: (user: User) => void;
}

const SuccessPopup: React.FC = () => (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 flex items-center space-x-4">
            <CheckCircleIcon className="w-8 h-8 text-green-500" />
            <span className="text-lg font-semibold text-slate-text">Perubahan berhasil disimpan</span>
        </div>
    </div>
);

const AccountSettings: React.FC<AccountSettingsProps> = ({ user, onUpdateUser }) => {
    const [name, setName] = useState(user.name);
    const [nimNip, setNimNip] = useState(user.nim_nip);
    const [email, setEmail] = useState(user.email);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profilePic, setProfilePic] = useState<string | null>(user.avatarUrl || `https://picsum.photos/seed/${user.id}/128/128`);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const newPicUrl = URL.createObjectURL(e.target.files[0]);
            setProfilePic(newPicUrl);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword && newPassword !== confirmPassword) {
            alert("Password baru tidak cocok.");
            return;
        }
        
        const updatedUser: User = {
            ...user,
            name,
            nim_nip: nimNip,
            email,
            avatarUrl: profilePic || user.avatarUrl,
        };

        onUpdateUser(updatedUser);
        setShowSuccessPopup(true);
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setShowSuccessPopup(false), 3000);
    };

    useEffect(() => {
        setName(user.name);
        setNimNip(user.nim_nip);
        setEmail(user.email);
        setProfilePic(user.avatarUrl || `https://picsum.photos/seed/${user.id}/128/128`);
    }, [user]);

    return (
        <>
            {showSuccessPopup && <SuccessPopup />}
            <div>
                 <header className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-text">Pengaturan Akun</h1>
                    <p className="text-gray-600">Kelola informasi profil dan keamanan akun Anda.</p>
                </header>
                <div className="bg-white rounded-2xl shadow-lg p-8">
                   <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
                       {/* Profile Picture Section */}
                       <div className="md:col-span-1 flex flex-col items-center">
                           <h3 className="font-semibold text-lg text-slate-text mb-4">Foto Profil</h3>
                           <img 
                                src={profilePic || `https://picsum.photos/seed/${user.id}/128/128`} 
                                alt="Profile" 
                                className="w-32 h-32 rounded-full object-cover mb-4"
                           />
                           <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileChange} 
                                accept="image/*" 
                                className="hidden"
                           />
                           <button 
                                type="button" 
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full text-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                           >
                                Unggah Foto
                           </button>
                           <p className="text-xs text-gray-500 mt-2">JPG, GIF atau PNG. Ukuran maks 800K.</p>
                       </div>

                       {/* User Details Section */}
                       <div className="md:col-span-2 space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                                <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-unsri-yellow focus:border-unsri-yellow" />
                            </div>
                            <div>
                                <label htmlFor="nimNip" className="block text-sm font-medium text-gray-700">NIM / NIP</label>
                                <input type="text" id="nimNip" value={nimNip} onChange={e => setNimNip(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-unsri-yellow focus:border-unsri-yellow" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-unsri-yellow focus:border-unsri-yellow" />
                            </div>

                             <hr className="my-4"/>

                            <h3 className="font-semibold text-lg text-slate-text">Ubah Password</h3>
                             <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">Password Baru</label>
                                <input type="password" id="newPassword" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-unsri-yellow focus:border-unsri-yellow" />
                            </div>
                             <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Konfirmasi Password Baru</label>
                                <input type="password" id="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-unsri-yellow focus:border-unsri-yellow" />
                            </div>
                       </div>
                       
                        {/* Save Button */}
                       <div className="md:col-span-3 text-right">
                           <button type="submit" className="bg-unsri-yellow text-slate-800 font-bold py-2 px-6 rounded-lg hover:bg-yellow-500 transition-colors">
                               Simpan Perubahan
                           </button>
                       </div>
                   </form>
                </div>
            </div>
        </>
    );
};

export default AccountSettings;