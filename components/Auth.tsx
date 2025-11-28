import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { User as UserIcon, Lock, Phone, Mail, ChevronRight } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
  onRegister: (user: User) => void;
  onBack: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin, onRegister, onBack }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [role, setRole] = useState<UserRole>('customer');
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulating API Call
    const userData: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      phone,
      role,
      password // storing for demo only
    };

    if (isRegistering) {
      onRegister(userData);
    } else {
      // For demo, we just log them in with the entered data if not verifying against a DB
      onLogin(userData); 
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col animate-in fade-in slide-in-from-bottom-4">
      <button onClick={onBack} className="self-start mb-6 p-2 bg-slate-100 rounded-full">
        <ChevronRight className="w-6 h-6 text-slate-600 transform rotate-180" />
      </button>

      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          {isRegistering ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
        </h1>
        <p className="text-slate-500 mb-8">
          {isRegistering ? 'أدخل بياناتك للبدء في استخدام سفرة' : 'مرحباً بعودتك!'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">الاسم الكامل</label>
              <div className="relative">
                <input 
                  type="text" 
                  required 
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-10 focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="مثال: أحمد محمد"
                />
                <UserIcon className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">البريد الإلكتروني</label>
            <div className="relative">
              <input 
                type="email" 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-10 focus:ring-2 focus:ring-amber-500 outline-none"
                placeholder="name@example.com"
              />
              <Mail className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {isRegistering && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">رقم الجوال</label>
              <div className="relative">
                <input 
                  type="tel" 
                  required 
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-10 focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="05xxxxxxxx"
                />
                <Phone className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">كلمة المرور</label>
            <div className="relative">
              <input 
                type="password" 
                required 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-10 focus:ring-2 focus:ring-amber-500 outline-none"
                placeholder="••••••••"
              />
              <Lock className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {isRegistering && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">نوع الحساب</label>
              <div className="grid grid-cols-3 gap-2">
                {(['customer', 'seller', 'driver'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-2 px-1 rounded-lg text-sm font-medium border-2 transition-all ${
                      role === r 
                      ? 'border-amber-500 bg-amber-50 text-amber-700' 
                      : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                    }`}
                  >
                    {r === 'customer' && 'عميل'}
                    {r === 'seller' && 'بائع'}
                    {r === 'driver' && 'سائق'}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors shadow-lg mt-4"
          >
            {isRegistering ? 'إنشاء حساب' : 'دخول'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-slate-500 text-sm">
            {isRegistering ? 'لديك حساب بالفعل؟' : 'ليس لديك حساب؟'}
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="mr-1 text-amber-600 font-bold hover:underline"
            >
              {isRegistering ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
