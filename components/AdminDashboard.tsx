
import React, { useState } from 'react';
import { User, Seller, Product, Category, Order } from '../types';
import { 
    LayoutDashboard, 
    Users, 
    Store, 
    UtensilsCrossed, 
    Settings, 
    LogOut, 
    Plus, 
    Trash2, 
    Edit2,
    Save,
    X,
    Search,
    ShoppingBag,
    Clock,
    Bell,
    TrendingUp,
    TrendingDown,
    MoreVertical,
    Filter,
    ChevronDown,
    MapPin,
    Star,
    CheckCircle,
    AlertCircle
} from 'lucide-react';

interface AdminDashboardProps {
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    sellers: Seller[];
    setSellers: React.Dispatch<React.SetStateAction<Seller[]>>;
    products: Product[];
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
    orders: Order[];
    adminUser: User;
    onLogout: () => void;
    onUpdateAdminPassword: (pass: string) => void;
}

type Tab = 'overview' | 'users' | 'sellers' | 'products' | 'settings' | 'orders';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
    users, setUsers,
    sellers, setSellers,
    products, setProducts,
    orders,
    adminUser,
    onLogout,
    onUpdateAdminPassword
}) => {
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [searchTerm, setSearchTerm] = useState('');

    // --- Actions ---

    const handleDeleteUser = (id: string) => {
        if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
            setUsers(users.filter(u => u.id !== id));
        }
    };

    const handleDeleteSeller = (id: string) => {
        if (confirm('هل أنت متأكد من حذف هذا المطعم؟ سيتم حذف جميع المنتجات المرتبطة.')) {
            setSellers(sellers.filter(s => s.id !== id));
            setProducts(products.filter(p => p.sellerId !== id)); 
        }
    };

    const handleDeleteProduct = (id: string) => {
        if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
            setProducts(products.filter(p => p.id !== id));
        }
    };

    const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
    const [editingSeller, setEditingSeller] = useState<Partial<Seller> | null>(null);

    const handleSaveProduct = () => {
        if (!editingProduct?.nameAr || !editingProduct.price) return;
        
        if (editingProduct.id) {
            setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...editingProduct } as Product : p));
        } else {
            const newProduct = {
                ...editingProduct,
                id: Math.random().toString(36).substr(2, 9),
                rating: 0,
                image: editingProduct.image || 'https://picsum.photos/200'
            } as Product;
            setProducts([...products, newProduct]);
        }
        setEditingProduct(null);
    };

    const handleSaveSeller = () => {
        if (!editingSeller?.nameAr) return;

        if (editingSeller.id) {
            setSellers(sellers.map(s => s.id === editingSeller.id ? { ...s, ...editingSeller } as Seller : s));
        } else {
            const newSeller = {
                ...editingSeller,
                id: Math.random().toString(36).substr(2, 9),
                rating: 5.0,
                image: editingSeller.image || 'https://picsum.photos/200'
            } as Seller;
            setSellers([...sellers, newSeller]);
        }
        setEditingSeller(null);
    };

    // --- UI Components ---

    const StatCard = ({ title, value, subValue, icon: Icon, color, trend }: any) => (
        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 hover:border-amber-200 transition-colors">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${color}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
                <span className={`flex items-center gap-1 font-bold ${trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
                    {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {subValue}
                </span>
                <span className="text-slate-400">مقارنة بالشهر الماضي</span>
            </div>
        </div>
    );

    const Overview = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="إجمالي الإيرادات" 
                    value={`${orders.reduce((acc, curr) => acc + curr.total, 0).toLocaleString()} ر.س`} 
                    subValue="12.5%" 
                    trend="up"
                    icon={DollarSign} 
                    color="bg-emerald-50 text-emerald-600" 
                />
                <StatCard 
                    title="الطلبات النشطة" 
                    value={orders.length.toString()} 
                    subValue="8.2%" 
                    trend="up"
                    icon={ShoppingBag} 
                    color="bg-blue-50 text-blue-600" 
                />
                <StatCard 
                    title="المستخدمين الجدد" 
                    value={users.length.toString()} 
                    subValue="2.1%" 
                    trend="down"
                    icon={Users} 
                    color="bg-purple-50 text-purple-600" 
                />
                <StatCard 
                    title="شركاء النجاح" 
                    value={sellers.length.toString()} 
                    subValue="4.5%" 
                    trend="up"
                    icon={Store} 
                    color="bg-amber-50 text-amber-600" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders Table */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800 text-lg">أحدث الطلبات</h3>
                        <button className="text-amber-600 text-sm font-bold hover:underline">عرض الكل</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-right text-xs font-semibold text-slate-400 border-b border-slate-50">
                                    <th className="pb-3 pr-2">رقم الطلب</th>
                                    <th className="pb-3">العميل</th>
                                    <th className="pb-3">القيمة</th>
                                    <th className="pb-3">الحالة</th>
                                    <th className="pb-3 pl-2">الوقت</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {orders.slice(0, 5).map(order => (
                                    <tr key={order.id} className="group hover:bg-slate-50/50">
                                        <td className="py-3 pr-2 font-mono text-slate-600">#{order.id.toUpperCase()}</td>
                                        <td className="py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                                    {users.find(u => u.id === order.customerId)?.name.charAt(0) || 'U'}
                                                </div>
                                                <span className="text-sm font-medium text-slate-700">
                                                    {users.find(u => u.id === order.customerId)?.name || 'مستخدم'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 font-bold text-slate-800 text-sm">{order.total} ر.س</td>
                                        <td className="py-3">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                                order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                order.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                'bg-blue-50 text-blue-600 border-blue-100'
                                            }`}>
                                                {order.status === 'delivered' ? 'مكتمل' : order.status === 'pending' ? 'انتظار' : 'جاري'}
                                            </span>
                                        </td>
                                        <td className="py-3 pl-2 text-xs text-slate-400">منذ ساعتين</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Sellers */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-slate-800 text-lg mb-6">الأكثر مبيعاً</h3>
                    <div className="space-y-4">
                        {sellers.slice(0, 4).map((seller, idx) => (
                            <div key={seller.id} className="flex items-center gap-3">
                                <div className="font-bold text-slate-300 w-4">{idx + 1}</div>
                                <img src={seller.image} className="w-10 h-10 rounded-lg object-cover" />
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm text-slate-800">{seller.nameAr}</h4>
                                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                        <span>{seller.rating}</span>
                                        <span className="mx-1">•</span>
                                        <span>{seller.cuisine}</span>
                                    </div>
                                </div>
                                <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                                    +12%
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const UsersList = () => (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                 <h2 className="text-xl font-bold text-slate-800">قائمة المستخدمين</h2>
                 <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-50">
                     <Filter className="w-4 h-4" /> تصفية النتائج
                 </button>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-right">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="p-4 text-xs font-semibold text-slate-500">المستخدم</th>
                            <th className="p-4 text-xs font-semibold text-slate-500">بيانات الاتصال</th>
                            <th className="p-4 text-xs font-semibold text-slate-500">الصلاحية</th>
                            <th className="p-4 text-xs font-semibold text-slate-500">الحالة</th>
                            <th className="p-4 text-xs font-semibold text-slate-500">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase())).map(user => (
                            <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                                            user.role === 'admin' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'
                                        }`}>
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800 text-sm">{user.name}</div>
                                            <div className="text-xs text-slate-400">ID: {user.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="text-sm text-slate-600">{user.email}</div>
                                    <div className="text-xs text-slate-400">{user.phone}</div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                        user.role === 'admin' ? 'bg-slate-100 text-slate-700' :
                                        user.role === 'seller' ? 'bg-purple-100 text-purple-700' :
                                        user.role === 'driver' ? 'bg-blue-100 text-blue-700' :
                                        'bg-amber-100 text-amber-700'
                                    }`}>
                                        {user.role === 'customer' ? 'عميل' : user.role === 'seller' ? 'شريك' : user.role === 'driver' ? 'سائق' : 'مسؤول'}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                        نشط
                                    </div>
                                </td>
                                <td className="p-4">
                                    <button 
                                        onClick={() => handleDeleteUser(user.id)}
                                        disabled={user.role === 'admin'}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-20"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const SellersManager = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">الشركاء والمطاعم</h2>
                <button 
                    onClick={() => setEditingSeller({ nameAr: '', cuisine: '', deliveryTime: '30 دقيقة' })}
                    className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-colors"
                >
                    <Plus className="w-4 h-4" /> إضافة مطعم جديد
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sellers.map(seller => (
                    <div key={seller.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="relative h-48">
                            <img src={seller.image} alt={seller.nameAr} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                            
                            <div className="absolute top-3 left-3 flex gap-2">
                                <span className="bg-white/90 backdrop-blur text-slate-800 text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-amber-500" />
                                    {seller.deliveryTime}
                                </span>
                            </div>

                            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => setEditingSeller(seller)} className="p-2 bg-white/90 backdrop-blur rounded-lg text-blue-600 hover:bg-blue-50">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDeleteSeller(seller.id)} className="p-2 bg-white/90 backdrop-blur rounded-lg text-red-600 hover:bg-red-50">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="absolute bottom-3 right-3 text-white">
                                <h3 className="font-bold text-lg">{seller.nameAr}</h3>
                                <p className="text-xs text-slate-200 opacity-90">{seller.cuisine}</p>
                            </div>
                        </div>
                        <div className="p-4 flex justify-between items-center bg-white">
                            <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                <span className="font-bold text-slate-800">{seller.rating}</span>
                                <span className="text-xs text-slate-400">(150+ تقييم)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                <span className="text-xs font-bold text-slate-600">مفتوح الآن</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const ProductsManager = () => (
         <div className="space-y-6">
            <div className="flex justify-between items-center">
                 <h2 className="text-xl font-bold text-slate-800">المنتجات وقائمة الطعام</h2>
                 <button 
                    onClick={() => setEditingProduct({ nameAr: '', price: 0, descriptionAr: '' })}
                    className="flex items-center gap-2 bg-amber-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-amber-200 hover:bg-amber-600 transition-colors"
                >
                    <Plus className="w-4 h-4" /> إضافة منتج
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-right">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="p-4 text-xs font-semibold text-slate-500 w-20">الصورة</th>
                            <th className="p-4 text-xs font-semibold text-slate-500">تفاصيل المنتج</th>
                            <th className="p-4 text-xs font-semibold text-slate-500">السعر</th>
                            <th className="p-4 text-xs font-semibold text-slate-500">الأسرة المنتجة</th>
                            <th className="p-4 text-xs font-semibold text-slate-500">الحالة</th>
                            <th className="p-4 text-xs font-semibold text-slate-500">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {products.map(product => {
                             const seller = sellers.find(s => s.id === product.sellerId);
                             return (
                                <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="p-4">
                                        <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-100">
                                            <img src={product.image} className="w-full h-full object-cover" />
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-slate-800 text-sm">{product.nameAr}</div>
                                        <div className="text-xs text-slate-500 mt-1 line-clamp-1 max-w-[200px]">{product.descriptionAr}</div>
                                    </td>
                                    <td className="p-4 font-bold text-slate-800">{product.price} ر.س</td>
                                    <td className="p-4">
                                         {seller ? (
                                             <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                                                 <img src={seller.image} className="w-5 h-5 rounded-full object-cover" />
                                                 {seller.nameAr}
                                             </div>
                                         ) : (
                                             <span className="text-xs text-slate-400">غير محدد</span>
                                         )}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-1">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                            <span className="text-xs font-medium text-emerald-700">متاح</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => setEditingProduct(product)} className="p-2 text-blue-500 bg-blue-50 rounded-lg hover:bg-blue-100">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-red-500 bg-red-50 rounded-lg hover:bg-red-100">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                             );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const SettingsTab = () => {
        const [newPass, setNewPass] = useState('');
        const [msg, setMsg] = useState('');

        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                     <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-6">
                        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <ShieldCheck />
                            الأمان وصلاحيات الدخول
                        </h2>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 mb-2">تحديث كلمة مرور المسؤول الرئيسي</label>
                            <input 
                                type="text" 
                                value={newPass}
                                onChange={(e) => setNewPass(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                                placeholder="أدخل كلمة المرور الجديدة"
                            />
                        </div>
                        {msg && <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl text-sm mb-4 flex items-center gap-2"><CheckCircle className="w-4 h-4"/> {msg}</div>}
                        <button 
                            onClick={() => {
                                if(newPass) {
                                    onUpdateAdminPassword(newPass);
                                    setMsg('تم تحديث كلمة المرور بنجاح');
                                    setNewPass('');
                                    setTimeout(() => setMsg(''), 3000);
                                }
                            }}
                            className="bg-slate-900 text-white font-bold py-3 px-8 rounded-xl hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all"
                        >
                            حفظ التغييرات
                        </button>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                         <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <Bell />
                            إعدادات التنبيهات
                        </h2>
                        <div className="space-y-4">
                             <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                 <span className="text-slate-700 font-medium text-sm">تنبيه عند طلب جديد</span>
                                 <div className="w-10 h-6 bg-emerald-500 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div></div>
                             </div>
                             <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                 <span className="text-slate-700 font-medium text-sm">تنبيه عند تسجيل مطعم جديد</span>
                                 <div className="w-10 h-6 bg-emerald-500 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div></div>
                             </div>
                             <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                 <span className="text-slate-700 font-medium text-sm">تقارير أسبوعية عبر البريد</span>
                                 <div className="w-10 h-6 bg-slate-300 rounded-full relative cursor-pointer"><div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div></div>
                             </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-amber-500 text-white p-6 rounded-2xl shadow-lg shadow-amber-200">
                        <h3 className="font-bold text-lg mb-2">الدعم الفني</h3>
                        <p className="text-amber-100 text-sm mb-4">هل تواجه مشاكل في لوحة التحكم؟ تواصل مع فريق التطوير.</p>
                        <button className="bg-white text-amber-600 w-full py-2 rounded-xl font-bold text-sm">فتح تذكرة دعم</button>
                    </div>
                </div>
            </div>
        );
    };

    // --- Modal for Editing ---
    const EditModal = () => {
        if (!editingProduct && !editingSeller) return null;
        
        const isProduct = !!editingProduct;
        const title = isProduct ? (editingProduct.id ? 'تعديل منتج' : 'إضافة منتج') : (editingSeller?.id ? 'تعديل مطعم' : 'إضافة مطعم');

        return (
            <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl w-full max-w-lg p-0 shadow-2xl animate-in fade-in zoom-in-95 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
                        <button onClick={() => { setEditingProduct(null); setEditingSeller(null); }} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                        {isProduct ? (
                            <>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">اسم المنتج</label>
                                    <input 
                                        type="text" 
                                        value={editingProduct?.nameAr || ''} 
                                        onChange={e => setEditingProduct({...editingProduct, nameAr: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">السعر (ر.س)</label>
                                    <input 
                                        type="number" 
                                        value={editingProduct?.price || 0} 
                                        onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">الأسرة المنتجة (البائع)</label>
                                    <div className="relative">
                                        <select 
                                            value={editingProduct?.sellerId || ''} 
                                            onChange={e => setEditingProduct({...editingProduct, sellerId: e.target.value})}
                                            className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none appearance-none"
                                        >
                                            <option value="">اختر الأسرة المنتجة...</option>
                                            {sellers.map(s => (
                                                <option key={s.id} value={s.id}>{s.nameAr}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">الوصف</label>
                                    <textarea 
                                        value={editingProduct?.descriptionAr || ''} 
                                        onChange={e => setEditingProduct({...editingProduct, descriptionAr: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl h-24 focus:ring-2 focus:ring-amber-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">رابط الصورة</label>
                                    <input 
                                        type="text" 
                                        value={editingProduct?.image || ''} 
                                        onChange={e => setEditingProduct({...editingProduct, image: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">اسم المطعم</label>
                                    <input 
                                        type="text" 
                                        value={editingSeller?.nameAr || ''} 
                                        onChange={e => setEditingSeller({...editingSeller, nameAr: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">نوع المطبخ</label>
                                    <input 
                                        type="text" 
                                        value={editingSeller?.cuisine || ''} 
                                        onChange={e => setEditingSeller({...editingSeller, cuisine: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">وقت التوصيل</label>
                                    <input 
                                        type="text" 
                                        value={editingSeller?.deliveryTime || ''} 
                                        onChange={e => setEditingSeller({...editingSeller, deliveryTime: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                                        placeholder="مثال: 30-45 دقيقة"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">رابط الصورة</label>
                                    <input 
                                        type="text" 
                                        value={editingSeller?.image || ''} 
                                        onChange={e => setEditingSeller({...editingSeller, image: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
                        <button 
                            onClick={isProduct ? handleSaveProduct : handleSaveSeller}
                            className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all"
                        >
                            حفظ البيانات
                        </button>
                        <button 
                            onClick={() => { setEditingProduct(null); setEditingSeller(null); }}
                            className="flex-1 bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all"
                        >
                            إلغاء
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // --- Components for DollarSign/Shield fix ---
    const DollarSign = ({className}: {className?: string}) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
    );
     const ShieldCheck = ({className}: {className?: string}) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
    );

    const SidebarItem = ({ id, label, icon: Icon }: { id: Tab, label: string, icon: any }) => (
        <button 
            onClick={() => setActiveTab(id)} 
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                activeTab === id 
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20 font-bold' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
        >
            <Icon className={`w-5 h-5 ${activeTab === id ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
            <span>{label}</span>
            {activeTab === id && <div className="mr-auto w-1.5 h-1.5 rounded-full bg-white"></div>}
        </button>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans" dir="rtl">
            {/* Professional Sidebar */}
            <aside className="w-full md:w-72 bg-slate-900 text-white flex-shrink-0 flex flex-col h-screen sticky top-0">
                {/* Brand Area */}
                <div className="p-8 pb-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-amber-500/20">
                        س
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">سفرة</h1>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">إدارة العمليات</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                    <p className="px-4 text-[10px] font-bold text-slate-500 uppercase mb-2">الرئيسية</p>
                    <SidebarItem id="overview" label="لوحة المعلومات" icon={LayoutDashboard} />
                    
                    <p className="px-4 text-[10px] font-bold text-slate-500 uppercase mb-2 mt-6">الإدارة</p>
                    <SidebarItem id="orders" label="الطلبات" icon={ShoppingBag} /> {/* Placeholder tab logic could be added */}
                    <SidebarItem id="users" label="المستخدمين" icon={Users} />
                    <SidebarItem id="sellers" label="الشركاء والمطاعم" icon={Store} />
                    <SidebarItem id="products" label="المنتجات" icon={UtensilsCrossed} />
                    
                    <p className="px-4 text-[10px] font-bold text-slate-500 uppercase mb-2 mt-6">النظام</p>
                    <SidebarItem id="settings" label="الإعدادات" icon={Settings} />
                </nav>

                {/* Footer User Profile */}
                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer group">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center font-bold text-sm shadow-md">
                            AD
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-slate-200 group-hover:text-white">{adminUser.name}</p>
                            <p className="text-xs text-slate-500">مدير النظام</p>
                        </div>
                        <button onClick={onLogout} className="text-slate-500 hover:text-red-400">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto h-screen bg-slate-50 relative">
                
                {/* Top Header */}
                <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 px-8 py-4 flex justify-between items-center border-b border-slate-100">
                    <div className="flex items-center gap-4 flex-1 max-w-xl">
                        <div className="relative w-full group">
                            <Search className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 group-focus-within:text-amber-500 transition-colors" />
                            <input 
                                type="text" 
                                placeholder="بحث سريع عن طلب، عميل، أو مطعم..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-slate-50 border-none outline-none w-full py-2.5 px-10 rounded-xl text-slate-700 focus:bg-white focus:ring-2 focus:ring-amber-100 transition-all placeholder:text-slate-400 text-sm"
                            />
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <button className="relative p-2.5 bg-white border border-slate-100 rounded-full text-slate-500 hover:text-amber-600 hover:border-amber-100 transition-colors shadow-sm">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-8 w-px bg-slate-200 mx-1"></div>
                        <div className="flex items-center gap-2 cursor-pointer">
                           <span className="text-sm font-bold text-slate-700 hidden sm:block">العربية</span>
                           <ChevronDown className="w-4 h-4 text-slate-400" />
                        </div>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto">
                    {/* Header Title Section */}
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                                {activeTab === 'overview' && 'لوحة المعلومات'}
                                {activeTab === 'users' && 'إدارة المستخدمين'}
                                {activeTab === 'sellers' && 'الشركاء والمطاعم'}
                                {activeTab === 'products' && 'المنتجات وقوائم الطعام'}
                                {activeTab === 'settings' && 'إعدادات النظام'}
                            </h2>
                            <p className="text-slate-500 text-sm mt-1">
                                {activeTab === 'overview' && 'نظرة عامة على أداء المنصة والعمليات الجارية'}
                                {activeTab === 'users' && 'عرض وإدارة حسابات العملاء والسائقين'}
                                {activeTab === 'sellers' && 'إدارة المتاجر المسجلة وحالات التشغيل'}
                                {activeTab === 'products' && 'تعديل الأسعار والمخزون والتفاصيل'}
                                {activeTab === 'settings' && 'تخصيص تفضيلات التطبيق والأمان'}
                            </p>
                        </div>
                        {activeTab === 'overview' && (
                             <div className="flex gap-2 text-sm bg-white p-1 rounded-xl border border-slate-100 shadow-sm">
                                 <button className="px-3 py-1 bg-slate-900 text-white rounded-lg font-bold">اليوم</button>
                                 <button className="px-3 py-1 text-slate-500 hover:bg-slate-50 rounded-lg">أسبوع</button>
                                 <button className="px-3 py-1 text-slate-500 hover:bg-slate-50 rounded-lg">شهر</button>
                             </div>
                        )}
                    </div>

                    {activeTab === 'overview' && <Overview />}
                    {activeTab === 'users' && <UsersList />}
                    {activeTab === 'sellers' && <SellersManager />}
                    {activeTab === 'products' && <ProductsManager />}
                    {activeTab === 'settings' && <SettingsTab />}
                    {activeTab === 'orders' && (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100 border-dashed">
                             <div className="bg-slate-50 p-6 rounded-full mb-4"><ShoppingBag className="w-10 h-10 text-slate-400"/></div>
                             <h3 className="text-lg font-bold text-slate-800">قسم الطلبات</h3>
                             <p className="text-slate-500 text-sm">ميزة قادمة قريباً في التحديث القادم</p>
                        </div>
                    )}
                </div>
            </main>

            <EditModal />
        </div>
    );
};
