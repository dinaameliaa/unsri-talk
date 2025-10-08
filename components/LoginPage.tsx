

import React, { useState } from 'react';
import { Role } from '../types';
import { LoginDetails } from '../App';

interface LoginPageProps {
  role: Role;
  onLogin: (details: LoginDetails) => void;
  onRegister: (details: LoginDetails) => boolean;
  onBack: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ role, onLogin, onRegister, onBack }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [name, setName] = useState('');
  const [nimNip, setNimNip] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = "Nama Lengkap wajib diisi.";
    if (!nimNip.trim()) {
      newErrors.nimNip = "NIM / NIP wajib diisi.";
    } else if (!/^\d+$/.test(nimNip.trim())) {
      newErrors.nimNip = "NIM / NIP harus berupa angka.";
    }
    if (!email.trim()) {
      newErrors.email = "Email wajib diisi.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Format email tidak valid.";
    }
    if (!password) {
      newErrors.password = "Password wajib diisi.";
    }
    if (isRegistering) {
        if (!confirmPassword) {
            newErrors.confirmPassword = "Konfirmasi password wajib diisi.";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Password tidak cocok.";
        }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (registrationSuccess) setRegistrationSuccess(false);

    if (validateForm()) {
        const details = { name, nim_nip: nimNip, email, pass: password };
        if (isRegistering) {
            const success = onRegister(details);
            if (success) {
                setRegistrationSuccess(true);
                setIsRegistering(false);
                // Clear form for login
                setName('');
                setNimNip('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
            }
        } else {
            onLogin(details);
        }
    }
  };
  
  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    if (registrationSuccess) {
      setRegistrationSuccess(false);
    }
  };

  const isFormEmpty = !name || !nimNip || !email || !password || (isRegistering && !confirmPassword);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-poppins">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-slate-text">
          {isRegistering ? 'Daftar Akun' : 'Login sebagai'} <span className="text-unsri-yellow">{role}</span>
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {registrationSuccess && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md" role="alert">
            <p className="font-bold">Pendaftaran berhasil!</p>
            <p>Silakan masuk menggunakan akun yang baru Anda daftarkan.</p>
          </div>
        )}
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nama Lengkap
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={handleInputChange(setName)}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm ${errors.name ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-unsri-yellow focus:border-unsri-yellow'}`}
                  aria-invalid={!!errors.name}
                  aria-describedby="name-error"
                />
              </div>
              {errors.name && <p id="name-error" className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="nim_nip" className="block text-sm font-medium text-gray-700">
                NIM / NIP
              </label>
              <div className="mt-1">
                <input
                  id="nim_nip"
                  name="nim_nip"
                  type="text"
                  autoComplete="username"
                  required
                  value={nimNip}
                  onChange={handleInputChange(setNimNip)}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm ${errors.nimNip ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-unsri-yellow focus:border-unsri-yellow'}`}
                  aria-invalid={!!errors.nimNip}
                  aria-describedby="nimNip-error"
                />
              </div>
              {errors.nimNip && <p id="nimNip-error" className="mt-1 text-xs text-red-600">{errors.nimNip}</p>}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={handleInputChange(setEmail)}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm ${errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-unsri-yellow focus:border-unsri-yellow'}`}
                  aria-invalid={!!errors.email}
                  aria-describedby="email-error"
                />
              </div>
              {errors.email && <p id="email-error" className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={handleInputChange(setPassword)}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm ${errors.password ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-unsri-yellow focus:border-unsri-yellow'}`}
                  aria-invalid={!!errors.password}
                  aria-describedby="password-error"
                />
              </div>
              {errors.password && <p id="password-error" className="mt-1 text-xs text-red-600">{errors.password}</p>}
            </div>
            
            {isRegistering && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Konfirmasi Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={handleInputChange(setConfirmPassword)}
                      className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-unsri-yellow focus:border-unsri-yellow'}`}
                      aria-invalid={!!errors.confirmPassword}
                      aria-describedby="confirmPassword-error"
                    />
                  </div>
                  {errors.confirmPassword && <p id="confirmPassword-error" className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
                </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isFormEmpty}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-slate-800 bg-unsri-yellow hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:bg-yellow-200 disabled:cursor-not-allowed"
              >
                {isRegistering ? 'Daftar Sekarang' : 'Masuk ke UNSRI TALK'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                    <button onClick={() => {setIsRegistering(!isRegistering); setErrors({}); setRegistrationSuccess(false);}} className="font-medium text-unsri-yellow hover:text-yellow-600">
                        {isRegistering ? 'Sudah punya akun? Masuk' : 'Belum punya akun? Daftar'}
                    </button>
                </span>
              </div>
            </div>

            <div className="mt-6">
                <button 
                  onClick={onBack}
                  className="w-full text-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Kembali pilih peran
                </button>
            </div>
          </div>
        </div>
        <p className="mt-8 text-center text-sm text-gray-500">
          Dikelola oleh Universitas Sriwijaya
        </p>
      </div>
    </div>
  );
};

export default LoginPage;