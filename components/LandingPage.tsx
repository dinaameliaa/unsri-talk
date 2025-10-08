
import React, { useState } from 'react';
import { Role } from '../types';
import { UserGraduateIcon, UserTieIcon, BuildingIcon } from './icons';

interface LandingPageProps {
  onRoleSelect: (role: Role) => void;
}

const roleOptions = [
  { role: Role.STUDENT, icon: <UserGraduateIcon className="w-12 h-12 text-unsri-yellow" />, subRoles: [] },
  { role: Role.LECTURER, icon: <UserTieIcon className="w-12 h-12 text-unsri-yellow" />, subRoles: [] },
  { 
    role: Role.STAFF, 
    icon: <BuildingIcon className="w-12 h-12 text-unsri-yellow" />,
    subRoles: ['Akademik', 'Kemahasiswaan', 'Kurikulum', 'Alumni']
  },
];


const LandingPage: React.FC<LandingPageProps> = ({ onRoleSelect }) => {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const handleSelectRole = (role: Role) => {
    setSelectedRole(role);
  };
  
  const handleLoginClick = () => {
    if (selectedRole) {
      onRoleSelect(selectedRole);
    }
  };

  return (
    <div className="min-h-screen bg-unsri-bg flex items-center justify-center p-4 font-poppins">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-text mb-2">
          Selamat datang di <span className="text-unsri-yellow">UNSRI TALK</span> 👋
        </h1>
        <p className="text-slate-600 text-lg mb-8">Silakan pilih peran Anda untuk melanjutkan.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {roleOptions.map((option) => (
            <div
              key={option.role}
              onClick={() => handleSelectRole(option.role)}
              className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                selectedRole === option.role
                  ? 'border-unsri-yellow bg-yellow-50'
                  : 'border-gray-200 hover:border-unsri-yellow hover:bg-yellow-50'
              }`}
            >
              <div className="flex justify-center mb-3">{option.icon}</div>
              <h2 className="font-semibold text-slate-text">{option.role}</h2>
              {option.subRoles.length > 0 && (
                 <p className="text-xs text-slate-500 mt-1">{option.subRoles.join(', ')}</p>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleLoginClick}
          disabled={!selectedRole}
          className="w-full bg-unsri-yellow text-slate-800 font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:bg-yellow-200 disabled:cursor-not-allowed hover:bg-yellow-500"
        >
          Masuk Sekarang
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
