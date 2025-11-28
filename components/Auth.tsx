import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { User as UserIcon, Lock, Phone, Mail, ChevronRight, ShieldCheck, Key, CheckCircle, Store, Car, ShoppingBag, ArrowRight } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
  onRegister: (user: User) => void;
  onBack: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin, onRegister, onBack }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationStep, setRegistrationStep] = useState<1 | 2 | 3>(1); // 1: Role, 2: Confirm, 3: Details
  const [role, setRole] = useState<UserRole>('customer');
  const [error, setError] = useState('');
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const switchToLogin = () => {
    setIsRegistering(false);
    setError('');
  };

  const ROLE_INFO = {
    customer: { 
      label: 'عميل', 
      desc: 'اطلب طعامك المفضل واستمتع بالتوصيل السريع',
      icon: <ShoppingBag className="w-8 h-8" />
    },
    seller: { 
      label: 'بائع (شريك)', 
      desc: 'سجل مطعمك وابدأ في بيع وجباتك للآلاف',
      icon: <Store className="w-8 h-8" />
    },
    driver: { 
      label: 'سائق (كابتن)', 
      desc: 'انضم لأسطول التوصيل وحقق دخلاً إضافياً',
      icon: <Car className="w-8 h-8" />
    },
    admin: { label: 'مسؤول', desc: '', icon: <ShieldCheck /> }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Admin Login Check
    if (!isRegistering && email === 'admin' && password === 'admin') {
        const adminUser: User = {
            id: 'admin-master',
            name: 'مدير النظام',
            email: 'admin',
            phone: '0000000000',
            role: 'admin',
            password: 'admin'
        };
        onLogin(adminUser);
        return;
    }

    // Validation
    if (!email || !password) {
        setError('يرجى تعبئة جميع الحقول المطلوبة');
        return;
    }

    const userData: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: name || 'مستخدم جديد',
      email,
      phone,
      role,
      password 
    };

    if (isRegistering) {
      if (!name) { setError('الاسم مطلوب'); return; }
      onRegister(userData);
    } else {
      onLogin(userData); 
    }
  };

  const handleBackNavigation = () => {
    if (isRegistering) {
        if (registrationStep === 1) {
            setIsRegistering(false);
            setError('');
        } else {
            setRegistrationStep(prev => (prev - 1) as 1 | 2 | 3);
            setError('');
        }
    } else {
        onBack();
    }
  };

  const fillAdminCredentials = () => {
      setIsRegistering(false);
      setEmail('admin');
      setPassword('admin');
  };

  // --- RENDER HELPERS ---

  const renderRoleSelection = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-8">
       <div className="grid gap-4">
          {(['customer', 'seller', 'driver'] as UserRole[]).map((r) => (
             <button
               key={r}
               onClick={() => setRole(r)}
               className={`p-4 rounded-2xl border-2 transition-all text-right relative overflow-hidden group ${
                 role === r 
                 ? 'border-amber-500 bg-amber-50' 
                 : 'border-slate-100 bg-white hover:border-amber-200'
               }`}
             >
               <div className="flex items-center gap-4 relative z-10">
                  <div className={`p-3 rounded-full ${role === r ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-amber-100 group-hover:text-amber-600'}`}>
                      {ROLE_INFO[r].icon}
                  </div>
                  <div>
                      <h3 className={`font-bold text-lg ${role === r ? 'text-amber-900' : 'text-slate-800'}`}>{ROLE_INFO[r].label}</h3>
                      <p className={`text-sm ${role === r ? 'text-amber-700' : 'text-slate-500'}`}>{ROLE_INFO[r].desc}</p>
                  </div>
               </div>
               {role === r && (
                   <div className="absolute top-4 left-4 text-amber-500">
                       <CheckCircle className="w-6 h-6 fill-amber-500 text-white" />
                   </div>
               )}
             </button>
          ))}
       </div>
       <button 
         onClick={() => setRegistrationStep(2)}
         className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors shadow-lg mt-6 flex items-center justify-center gap-2"
       >
         <span>متابعة</span>
         <ArrowRight className="w-5 h-5 transform rotate-180" />
       </button>
    </div>
  );

  const renderConfirmation = () => (
    <div className="text-center animate-in fade-in zoom-in-95">
        <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-600">
            {ROLE_INFO[role].icon}
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">هل أنت متأكد من اختيارك؟</h2>
        <div className="bg-slate-50 p-4 rounded-2xl mb-6 border border-slate-100">
            <p className="text-slate-600 mb-1">لقد اخترت التسجيل كـ <span className="font-bold text-amber-600">{ROLE_INFO[role].label}</span></p>
            <p className="text-xs text-slate-400">{ROLE_INFO[role].desc}</p>
        </div>
        
        <button 
            onClick={() => setRegistrationStep(3)}
            className="w-full bg-amber-500 text-white font-bold py-4 rounded-xl hover:bg-amber-600 transition-colors shadow-lg shadow-amber-200 mb-3"
        >
            تأكيد ومتابعة
        </button>
        <button 
            onClick={() => setRegistrationStep(1)}
            className="w-full bg-white text-slate-500 font-bold py-4 rounded-xl hover:bg-slate-50 transition-colors border border-slate-200"
        >
            تغيير نوع الحساب
        </button>
    </div>
  );

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
      {isRegistering && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">الاسم الكامل</label>
          <div className="relative">
            <input 
              type="text" 
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
        <label className="block text-sm font-medium text-slate-700 mb-1">
            {email === 'admin' ? 'اسم المستخدم' : 'البريد الإلكتروني'}
        </label>
        <div className="relative">
          <input 
            type="text" 
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
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-10 focus:ring-2 focus:ring-amber-500 outline-none"
            placeholder="••••••••"
          />
          <Lock className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <button 
        type="submit" 
        className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors shadow-lg mt-4"
      >
        {isRegistering ? 'إنشاء حساب' : 'دخول'}
      </button>

      {!isRegistering && (
        <button 
            type="button" 
            onClick={fillAdminCredentials}
            className="w-full mt-4 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 text-sm"
        >
            <Key className="w-4 h-4" />
            دخول تجريبي (مسؤول)
        </button>
      )}
    </form>
  );

  // --- MAIN RENDER ---

  const getHeaderTitle = () => {
      if (!isRegistering) return 'تسجيل الدخول';
      if (registrationStep === 1) return 'اختر نوع الحساب';
      if (registrationStep === 2) return 'تأكيد الاختيار';
      return 'أكمل بياناتك';
  };

  const getHeaderSubtitle = () => {
      if (!isRegistering) return 'مرحباً بعودتك!';
      if (registrationStep === 1) return 'كيف تريد استخدام تطبيق سفرة؟';
      if (registrationStep === 2) return 'راجع صلاحيات الحساب قبل المتابعة';
      return 'أدخل بياناتك الشخصية لإنشاء الحساب';
  };

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col animate-in fade-in slide-in-from-bottom-4">
      <button onClick={handleBackNavigation} className="self-start mb-6 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
        <ChevronRight className="w-6 h-6 text-slate-600 transform rotate-180" />
      </button>

      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold text-slate-900">{getHeaderTitle()}</h1>
                {!isRegistering && <ShieldCheck className="w-6 h-6 text-slate-300" />}
            </div>
            <p className="text-slate-500">{getHeaderSubtitle()}</p>
        </div>

        {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-6 border border-red-100 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                {error}
            </div>
        )}

        {/* Dynamic Content based on Step */}
        {isRegistering ? (
            <>
                {registrationStep === 1 && renderRoleSelection()}
                {registrationStep === 2 && renderConfirmation()}
                {registrationStep === 3 && renderForm()}
            </>
        ) : (
            renderForm()
        )}

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            {isRegistering ? 'لديك حساب بالفعل؟' : 'ليس لديك حساب؟'}
            <button 
              onClick={() => { 
                  if(isRegistering) switchToLogin(); 
                  else { setIsRegistering(true); setRegistrationStep(1); setError(''); }
              }}
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