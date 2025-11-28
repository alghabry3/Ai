import React from 'react';
import { User, Order } from '../types';
import { User as UserIcon, LogOut, Package, Clock, MapPin, DollarSign, CheckCircle } from 'lucide-react';

interface ProfileProps {
  user: User;
  orders: Order[];
  onLogout: () => void;
  onStatusUpdate: (orderId: string, status: Order['status']) => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, orders, onLogout, onStatusUpdate }) => {
  
  // Filter orders based on role
  const myOrders = orders.filter(o => {
      if (user.role === 'customer') return o.customerId === user.id;
      // In a real app, sellers would only see orders for their products. 
      // Simplified: sellers see all orders for demo
      if (user.role === 'seller') return true; 
      if (user.role === 'driver') return true; // Drivers see all to accept
      return false;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
        case 'pending': return 'bg-yellow-100 text-yellow-700';
        case 'accepted': return 'bg-blue-100 text-blue-700';
        case 'delivering': return 'bg-purple-100 text-purple-700';
        case 'delivered': return 'bg-green-100 text-green-700';
        default: return 'bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
      switch(status) {
          case 'pending': return 'قيد الانتظار';
          case 'accepted': return 'جاري التجهيز';
          case 'delivering': return 'جاري التوصيل';
          case 'delivered': return 'تم التسليم';
          default: return status;
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 animate-in slide-in-from-right-4">
      <div className="bg-slate-900 text-white p-6 pt-12 rounded-b-3xl mb-6 shadow-lg">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
             <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-3xl font-bold">
               {user.name.charAt(0)}
             </div>
             <div>
               <h1 className="text-xl font-bold">{user.name}</h1>
               <div className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="capitalize px-2 py-0.5 bg-white/20 rounded text-xs">
                    {user.role === 'customer' && 'عميل'}
                    {user.role === 'seller' && 'شريك (مطعم)'}
                    {user.role === 'driver' && 'كابتن توصيل'}
                  </span>
                  <span>{user.phone}</span>
               </div>
             </div>
          </div>
          <button onClick={onLogout} className="p-2 bg-white/10 rounded-full hover:bg-red-500/20 hover:text-red-200 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-8 flex gap-4">
           <div className="flex-1 bg-white/10 rounded-xl p-3 text-center">
             <div className="text-2xl font-bold">{myOrders.length}</div>
             <div className="text-xs text-slate-400">الطلبات</div>
           </div>
           {user.role === 'driver' && (
              <div className="flex-1 bg-white/10 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-emerald-400">120</div>
                <div className="text-xs text-slate-400">رصيد (ر.س)</div>
              </div>
           )}
        </div>
      </div>

      <div className="px-4">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-500" />
            {user.role === 'customer' ? 'طلباتي السابقة' : (user.role === 'driver' ? 'الطلبات المتاحة' : 'الطلبات الواردة')}
        </h2>

        <div className="space-y-4">
            {myOrders.length === 0 ? (
                <div className="text-center py-10 text-slate-400">لا توجد طلبات حالياً</div>
            ) : (
                myOrders.map(order => (
                    <div key={order.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <div className="text-xs text-slate-400">#{order.id.toUpperCase()}</div>
                                <div className="font-bold text-slate-800 mt-1">{order.total} ر.س</div>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded-full font-bold ${getStatusColor(order.status)}`}>
                                {getStatusText(order.status)}
                            </span>
                        </div>
                        
                        <div className="space-y-1 mb-4">
                            {order.items.map((item, i) => (
                                <div key={i} className="text-sm text-slate-600 flex justify-between">
                                    <span>{item.quantity}x {item.product.nameAr}</span>
                                </div>
                            ))}
                        </div>

                        {/* Action Buttons based on Role */}
                        {user.role === 'seller' && order.status === 'pending' && (
                            <button 
                                onClick={() => onStatusUpdate(order.id, 'accepted')}
                                className="w-full py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800"
                            >
                                قبول وتحضير الطلب
                            </button>
                        )}
                        
                        {user.role === 'seller' && order.status === 'accepted' && (
                            <div className="text-center text-sm text-slate-500 py-2 bg-slate-50 rounded-lg">
                                بانتظار السائق...
                            </div>
                        )}

                        {user.role === 'driver' && order.status === 'accepted' && (
                            <button 
                                onClick={() => onStatusUpdate(order.id, 'delivering')}
                                className="w-full py-2 bg-amber-500 text-white rounded-lg text-sm font-bold hover:bg-amber-600"
                            >
                                قبول وتوصيل الطلب
                            </button>
                        )}

                        {user.role === 'driver' && order.status === 'delivering' && (
                            <button 
                                onClick={() => onStatusUpdate(order.id, 'delivered')}
                                className="w-full py-2 bg-emerald-500 text-white rounded-lg text-sm font-bold hover:bg-emerald-600"
                            >
                                تأكيد التسليم
                            </button>
                        )}
                    </div>
                ))
            )}
        </div>
      </div>
    </div>
  );
};
