import React from 'react';
import { CartItem, User } from '../types';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';

interface CartProps {
  items: CartItem[];
  onRemove: (productId: string) => void;
  onCheckout: () => void;
  onBack: () => void;
  user: User | null;
  onLoginReq: () => void;
}

export const Cart: React.FC<CartProps> = ({ items, onRemove, onCheckout, onBack, user, onLoginReq }) => {
  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
           <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">السلة فارغة</h2>
        <p className="text-slate-500 mb-6">لم تقم بإضافة أي وجبات بعد.</p>
        <button onClick={onBack} className="px-6 py-3 bg-amber-500 text-white rounded-xl font-bold">
          تصفح المطاعم
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-32 animate-in slide-in-from-bottom-10">
      <header className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-slate-100 rounded-full">
          <ArrowRight className="w-5 h-5 text-slate-600" />
        </button>
        <h1 className="text-xl font-bold text-slate-800">سلة المشتريات</h1>
      </header>

      <div className="p-4 space-y-4">
        {items.map((item) => (
          <div key={item.product.id} className="bg-white p-4 rounded-2xl shadow-sm flex gap-4">
            <img src={item.product.image} alt={item.product.nameAr} className="w-20 h-20 rounded-xl object-cover bg-slate-100" />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-slate-800">{item.product.nameAr}</h3>
                <button onClick={() => onRemove(item.product.id)} className="text-red-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-slate-500 mt-1">{item.quantity}x {item.product.price} ر.س</p>
              <div className="font-bold text-amber-600 mt-2">
                {item.quantity * item.product.price} ر.س
              </div>
            </div>
          </div>
        ))}

        <div className="bg-white p-4 rounded-2xl shadow-sm space-y-3 mt-6">
          <h3 className="font-bold text-slate-800">ملخص الطلب</h3>
          <div className="flex justify-between text-slate-600">
            <span>المجموع</span>
            <span>{total} ر.س</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>التوصيل</span>
            <span>15 ر.س</span>
          </div>
          <div className="border-t border-slate-100 pt-3 flex justify-between font-bold text-lg text-slate-800">
            <span>الإجمالي</span>
            <span>{total + 15} ر.س</span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 shadow-lg">
        {user ? (
          <button 
            onClick={onCheckout}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors flex justify-between px-6"
          >
            <span>إتمام الطلب</span>
            <span>{total + 15} ر.س</span>
          </button>
        ) : (
          <button 
            onClick={onLoginReq}
            className="w-full bg-amber-500 text-white font-bold py-4 rounded-xl hover:bg-amber-600 transition-colors"
          >
            تسجيل الدخول لإتمام الطلب
          </button>
        )}
      </div>
    </div>
  );
};
