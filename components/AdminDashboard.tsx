
import React, { useState, useMemo } from 'react';
import { User, Seller, Product, Order, Transaction, UserRole } from '../types';
import { 
    LayoutDashboard, Users, Store, UtensilsCrossed, Settings, LogOut, 
    Plus, Trash2, Edit2, X, Search, ShoppingBag, Clock, Bell, 
    TrendingUp, TrendingDown, Banknote, PieChart, Wallet, 
    ArrowUpRight, ArrowDownLeft, CheckCircle, ChevronDown, ShieldCheck, 
    Calculator, MapPin, Truck, AlertCircle, Calendar, FileText, ChevronLeft, Save, Star,
    MoreHorizontal, Filter, Image as ImageIcon, Eye, Ban, Unlock, ToggleLeft, ToggleRight
} from 'lucide-react';

interface AdminDashboardProps {
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    sellers: Seller[];
    setSellers: React.Dispatch<React.SetStateAction<Seller[]>>;
    products: Product[];
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
    orders: Order[];
    transactions: Transaction[];
    onAddTransaction: (t: Transaction) => void;
    adminUser: User;
    onLogout: () => void;
    onUpdateAdminPassword: (pass: string) => void;
    commissionRate: number; 
    setCommissionRate: (rate: number) => void;
    deliveryFee: number;
    setDeliveryFee: (fee: number) => void;
    onUpdateOrderStatus?: (orderId: string, status: Order['status']) => void;
}

type Tab = 'overview' | 'live_ops' | 'users' | 'sellers' | 'products' | 'finance' | 'reports' | 'settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
    users, setUsers,
    sellers, setSellers,
    products, setProducts,
    orders,
    transactions,
    onAddTransaction,
    adminUser,
    onLogout,
    commissionRate, setCommissionRate,
    deliveryFee, setDeliveryFee,
    onUpdateOrderStatus
}) => {
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    
    // --- Modals & Selection State ---
    const [sellerModal, setSellerModal] = useState<Partial<Seller> | null>(null);
    const [productModal, setProductModal] = useState<Partial<Product> | null>(null);
    const [userActionModal, setUserActionModal] = useState<{user: User, action: 'ban'|'edit'} | null>(null);
    const [settlementModal, setSettlementModal] = useState<{ id: string, name: string, type: 'seller' | 'driver', balance: number } | null>(null);
    const [activeOrderDetail, setActiveOrderDetail] = useState<Order | null>(null);

    // --- Filters State ---
    const [searchTerm, setSearchTerm] = useState('');
    const [productFilterSeller, setProductFilterSeller] = useState<string>('all');
    const [userFilterRole, setUserFilterRole] = useState<string>('all');

    // --- Derived Metrics ---
    const activeOrders = orders.filter(o => ['pending', 'accepted', 'delivering'].includes(o.status));
    const pendingOrders = orders.filter(o => o.status === 'pending');
    
    const financialMetrics = useMemo(() => {
        const totalSales = orders.reduce((acc, o) => acc + o.total, 0); 
        const completedOrders = orders.filter(o => o.status === 'delivered');
        
        const totalDeliveryFees = completedOrders.length * deliveryFee;
        const totalProductSales = completedOrders.reduce((acc, o) => acc + (o.total - deliveryFee), 0);
        const platformRevenue = totalProductSales * (commissionRate / 100);
        const sellersRevenue = totalProductSales - platformRevenue;
        
        return { totalSales, totalDeliveryFees, platformRevenue, sellersRevenue };
    }, [orders, deliveryFee, commissionRate]);

    // --- CRUD Handlers ---

    const handleSaveSeller = () => {
        if (!sellerModal?.nameAr) return;
        if (sellerModal.id) {
            setSellers(prev => prev.map(s => s.id === sellerModal.id ? { ...s, ...sellerModal } as Seller : s));
        } else {
            const newSeller = { ...sellerModal, id: Math.random().toString(36).substr(2, 9), rating: 5.0, image: sellerModal.image || 'https://via.placeholder.com/150' } as Seller;
            setSellers(prev => [...prev, newSeller]);
        }
        setSellerModal(null);
    };

    const handleSaveProduct = () => {
        if (!productModal?.nameAr || !productModal.price || !productModal.sellerId) return;
        
        const productData = {
            ...productModal,
            rating: productModal.rating || 0,
            image: productModal.image || 'https://via.placeholder.com/150',
            // Ensure ingredients are split if string provided (mock logic)
            ingredientsAr: Array.isArray(productModal.ingredientsAr) ? productModal.ingredientsAr : []
        };

        if (productModal.id) {
            setProducts(prev => prev.map(p => p.id === productModal.id ? { ...p, ...productData } as Product : p));
        } else {
            const newProduct = { ...productData, id: Math.random().toString(36).substr(2, 9) } as Product;
            setProducts(prev => [newProduct, ...prev]);
        }
        setProductModal(null);
    };

    const handleDeleteProduct = (id: string) => {
        if(confirm('هل أنت متأكد من حذف هذا المنتج نهائياً؟')) {
            setProducts(prev => prev.filter(p => p.id !== id));
        }
    };

    const handleProcessSettlement = (amount: number) => {
        if (!settlementModal) return;
        const transaction: Transaction = {
            id: Math.random().toString(36).substr(2, 9),
            amount: amount,
            type: settlementModal.type === 'seller' ? 'payout_seller' : 'payout_driver',
            date: new Date().toISOString(),
            referenceId: settlementModal.id,
            description: `تحويل بنكي - تسوية مستحقات (${settlementModal.name})`,
            status: 'completed'
        };
        onAddTransaction(transaction);
        setSettlementModal(null);
    };

    const toggleUserBan = (userId: string) => {
        // Mock Implementation: In real app, toggle an 'isActive' or 'isBanned' field
        alert(`تم تغيير حالة حظر المستخدم ${userId}`);
    };

    // --- Sub-Components ---

    const SidebarItem = ({ id, label, icon: Icon, badge }: { id: Tab, label: string, icon: any, badge?: number }) => (
        <button 
            onClick={() => { setActiveTab(id); setIsSidebarOpen(false); }} 
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative ${
                activeTab === id 
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20 font-bold' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
        >
            <Icon className={`w-5 h-5 ${activeTab === id ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
            <span className={`${!isSidebarOpen && 'hidden md:hidden'} lg:inline`}>{label}</span>
            {badge && badge > 0 && (
                <span className="absolute left-3 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                    {badge}
                </span>
            )}
        </button>
    );

    const StatCard = ({ title, value, icon: Icon, trend, colorClass }: any) => (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between hover:shadow-md transition-shadow">
            <div>
                <p className="text-slate-500 text-xs font-medium mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-bold mt-2 ${trend > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span>{Math.abs(trend)}% مقارنة بالأسبوع الماضي</span>
                    </div>
                )}
            </div>
            <div className={`p-3 rounded-xl ${colorClass}`}>
                <Icon className="w-5 h-5" />
            </div>
        </div>
    );

    // --- Views ---

    const OverviewView = () => (
        <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="إجمالي المبيعات" value={`${financialMetrics.totalSales.toLocaleString()} ر.س`} icon={Banknote} trend={12} colorClass="bg-emerald-50 text-emerald-600" />
                <StatCard title="الطلبات النشطة" value={activeOrders.length} icon={ShoppingBag} colorClass="bg-blue-50 text-blue-600" />
                <StatCard title="إيرادات المنصة" value={`${financialMetrics.platformRevenue.toLocaleString()} ر.س`} icon={PieChart} trend={5} colorClass="bg-amber-50 text-amber-600" />
                <StatCard title="الشركاء النشطين" value={sellers.length} icon={Store} colorClass="bg-purple-50 text-purple-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-slate-800">أحدث الطلبات</h3>
                        <button onClick={() => setActiveTab('live_ops')} className="text-sm text-amber-600 hover:underline">إدارة العمليات</button>
                    </div>
                    <div className="space-y-4">
                        {orders.slice(0, 5).map(order => (
                            <div 
                                key={order.id} 
                                onClick={() => setActiveOrderDetail(order)}
                                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:bg-amber-50 hover:border-amber-100 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                                        order.status === 'delivered' ? 'bg-emerald-100 text-emerald-600' : 
                                        order.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                                    }`}>
                                        {order.status === 'delivered' ? <CheckCircle className="w-5 h-5"/> : <Clock className="w-5 h-5"/>}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800">طلب #{order.id.substr(0, 6)}</p>
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <span>{new Date(order.date).toLocaleTimeString('ar-SA')}</span>
                                            <span>•</span>
                                            <span>{users.find(u => u.id === order.customerId)?.name || 'عميل'}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-slate-800">{order.total} ر.س</p>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                                        order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                        order.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                                        order.status === 'delivering' ? 'bg-purple-100 text-purple-700' :
                                        'bg-emerald-100 text-emerald-700'
                                    }`}>
                                        {order.status === 'pending' ? 'انتظار' : order.status === 'delivered' ? 'مكتمل' : 'جاري'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-lg text-slate-800 mb-6">أداء المبيعات (أسبوعي)</h3>
                    <div className="h-64 flex items-end justify-between gap-2 border-b border-slate-100 pb-2">
                        {[40, 70, 45, 90, 65, 85, 95].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                <div className="w-full bg-slate-100 rounded-t-lg relative group-hover:bg-amber-200 transition-all duration-500" style={{height: `${h}%`}}>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {h * 100}
                                    </div>
                                </div>
                                <span className="text-[10px] text-slate-400 font-bold">
                                    {['سبت', 'أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة'][i]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const LiveOpsView = () => (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <ActivityIcon className="w-6 h-6 text-red-500 animate-pulse" />
                    العمليات المباشرة
                </h2>
                <div className="flex gap-2">
                    <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold border border-amber-100 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {pendingOrders.length} طلبات معلقة
                    </span>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100 flex items-center gap-1">
                        <Truck className="w-3 h-3" /> {activeOrders.length - pendingOrders.length} جاري التوصيل
                    </span>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right min-w-[800px]">
                        <thead className="bg-slate-50 border-b border-slate-100 text-xs text-slate-500 uppercase">
                            <tr>
                                <th className="p-4">رقم الطلب</th>
                                <th className="p-4">المطعم</th>
                                <th className="p-4">العميل</th>
                                <th className="p-4">السائق</th>
                                <th className="p-4">التوقيت</th>
                                <th className="p-4">الحالة</th>
                                <th className="p-4">الإجراء</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {orders.map(order => (
                                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                    <td 
                                        className="p-4 font-mono font-bold text-amber-600 cursor-pointer hover:underline"
                                        onClick={() => setActiveOrderDetail(order)}
                                    >
                                        #{order.id.substr(0,6)}
                                    </td>
                                    <td className="p-4 text-sm font-medium">
                                        {sellers.find(s => s.id === order.items[0]?.product.sellerId)?.nameAr || 'غير محدد'}
                                    </td>
                                    <td className="p-4 text-sm text-slate-600">
                                        {users.find(u => u.id === order.customerId)?.name || 'ضيف'}
                                    </td>
                                    <td className="p-4 text-sm">
                                        {order.driverId ? (
                                            <span className="flex items-center gap-1 text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-1 rounded-full">
                                                <Truck className="w-3 h-3" /> {users.find(u => u.id === order.driverId)?.name}
                                            </span>
                                        ) : (
                                            <span className="text-slate-400 text-xs italic bg-slate-100 px-2 py-1 rounded-full">-- غير معين --</span>
                                        )}
                                    </td>
                                    <td className="p-4 text-xs text-slate-500">{new Date(order.date).toLocaleTimeString('ar-SA')}</td>
                                    <td className="p-4">
                                        <select 
                                            className={`border border-slate-200 text-xs rounded-lg p-1.5 outline-none focus:ring-2 focus:ring-amber-500 font-bold ${
                                                order.status === 'pending' ? 'text-amber-600 bg-amber-50' :
                                                order.status === 'accepted' ? 'text-blue-600 bg-blue-50' :
                                                order.status === 'delivering' ? 'text-purple-600 bg-purple-50' : 'text-emerald-600 bg-emerald-50'
                                            }`}
                                            value={order.status}
                                            onChange={(e) => onUpdateOrderStatus?.(order.id, e.target.value as Order['status'])}
                                        >
                                            <option value="pending">تعليق (Pending)</option>
                                            <option value="accepted">تحضير (Accepted)</option>
                                            <option value="delivering">توصيل (Delivering)</option>
                                            <option value="delivered">مكتمل (Delivered)</option>
                                        </select>
                                    </td>
                                    <td className="p-4">
                                        <button 
                                            onClick={() => setActiveOrderDetail(order)}
                                            className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const ProductsView = () => {
        // Filter Products Logic
        const filteredProducts = products.filter(p => {
            const matchesSearch = p.nameAr.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesSeller = productFilterSeller === 'all' || p.sellerId === productFilterSeller;
            return matchesSearch && matchesSeller;
        });

        return (
            <div className="space-y-6 animate-in fade-in">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <h2 className="text-xl font-bold text-slate-800 whitespace-nowrap">المنتجات والقوائم</h2>
                        <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full font-bold">{filteredProducts.length}</span>
                    </div>
                    
                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="بحث عن منتج..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-xl py-2 px-10 text-sm outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                        <select 
                            className="bg-slate-50 border-none rounded-xl py-2 px-4 text-sm outline-none focus:ring-2 focus:ring-amber-500"
                            value={productFilterSeller}
                            onChange={(e) => setProductFilterSeller(e.target.value)}
                        >
                            <option value="all">جميع المطاعم</option>
                            {sellers.map(s => <option key={s.id} value={s.id}>{s.nameAr}</option>)}
                        </select>
                        <button 
                            onClick={() => setProductModal({})}
                            className="bg-slate-900 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm hover:bg-slate-800 shadow-md whitespace-nowrap"
                        >
                            <Plus className="w-4 h-4" /> إضافة
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredProducts.map(product => {
                         const seller = sellers.find(s => s.id === product.sellerId);
                         return (
                            <div key={product.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all group">
                                <div className="h-40 bg-slate-100 relative">
                                    <img src={product.image} alt={product.nameAr} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute top-2 right-2 bg-black/50 backdrop-blur text-white text-[10px] px-2 py-1 rounded-lg">
                                        {seller?.nameAr}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-slate-800 line-clamp-1">{product.nameAr}</h3>
                                        <span className="font-bold text-amber-600">{product.price} ر.س</span>
                                    </div>
                                    <p className="text-xs text-slate-500 line-clamp-2 mb-4 h-8">{product.descriptionAr}</p>
                                    
                                    <div className="flex gap-2 border-t border-slate-50 pt-3">
                                        <button 
                                            onClick={() => setProductModal(product)}
                                            className="flex-1 bg-slate-50 text-slate-600 py-2 rounded-lg text-xs font-bold hover:bg-amber-50 hover:text-amber-600 transition-colors flex justify-center gap-1 items-center"
                                        >
                                            <Edit2 className="w-3 h-3" /> تعديل
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteProduct(product.id)}
                                            className="w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                         );
                    })}
                </div>
            </div>
        );
    };

    const UsersView = () => {
        const filteredUsers = users.filter(u => 
            (userFilterRole === 'all' || u.role === userFilterRole) &&
            (u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.phone.includes(searchTerm))
        );

        return (
            <div className="space-y-6 animate-in fade-in">
                <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl border border-slate-100 gap-4">
                    <div className="flex items-center gap-2">
                        <Users className="w-6 h-6 text-slate-500" />
                        <h2 className="text-xl font-bold text-slate-800">إدارة المستخدمين</h2>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="بحث بالاسم أو الجوال..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-50 border-none rounded-xl py-2 px-10 text-sm outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>
                        <select 
                            className="bg-slate-50 border-none rounded-xl py-2 px-4 text-sm outline-none focus:ring-2 focus:ring-amber-500"
                            value={userFilterRole}
                            onChange={(e) => setUserFilterRole(e.target.value)}
                        >
                            <option value="all">الكل</option>
                            <option value="customer">العملاء</option>
                            <option value="seller">أصحاب المطاعم</option>
                            <option value="driver">السائقين</option>
                            <option value="admin">المشرفين</option>
                        </select>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <table className="w-full text-right">
                        <thead className="bg-slate-50 border-b border-slate-100 text-xs text-slate-500 uppercase">
                            <tr>
                                <th className="p-4">المستخدم</th>
                                <th className="p-4">الدور</th>
                                <th className="p-4">الجوال</th>
                                <th className="p-4">الحالة</th>
                                <th className="p-4">الإجراء</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-slate-50">
                                    <td className="p-4 flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-600">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-slate-800">{user.name}</p>
                                            <p className="text-[10px] text-slate-400">{user.email}</p>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                            user.role === 'admin' ? 'bg-red-100 text-red-600' :
                                            user.role === 'driver' ? 'bg-blue-100 text-blue-600' :
                                            user.role === 'seller' ? 'bg-amber-100 text-amber-600' :
                                            'bg-slate-100 text-slate-600'
                                        }`}>
                                            {user.role === 'admin' ? 'مشرف' : user.role === 'driver' ? 'سائق' : user.role === 'seller' ? 'مطعم' : 'عميل'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm font-mono text-slate-600">{user.phone}</td>
                                    <td className="p-4">
                                        <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                                            <CheckCircle className="w-3 h-3" /> نشط
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button 
                                            onClick={() => toggleUserBan(user.id)}
                                            className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                                            title="حظر المستخدم"
                                        >
                                            <Ban className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    const ReportsView = () => (
        <div className="space-y-6 animate-in fade-in">
             <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold mb-1">التقارير والتحليلات</h2>
                    <p className="text-slate-400 text-sm">نظرة شاملة على أداء المنصة</p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-bold transition-colors">تصدير PDF</button>
                    <button className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">تصدير Excel</button>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-500" /> المنتجات الأكثر مبيعاً
                    </h3>
                    <div className="space-y-4">
                        {products.slice(0, 4).map((p, i) => (
                            <div key={p.id} className="flex items-center gap-4 border-b border-slate-50 pb-2 last:border-0">
                                <span className="font-bold text-slate-300 text-lg w-6">#{i+1}</span>
                                <img src={p.image} className="w-10 h-10 rounded-lg object-cover bg-slate-100" alt=""/>
                                <div className="flex-1">
                                    <p className="font-bold text-sm text-slate-800">{p.nameAr}</p>
                                    <p className="text-[10px] text-slate-400">تم بيع 150+ مرة</p>
                                </div>
                                <span className="font-bold text-amber-600">{p.price} ر.س</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-500" /> المناطق الأكثر طلباً
                    </h3>
                    <div className="space-y-3">
                         {['الرياض - شمال', 'الرياض - شرق', 'الرياض - وسط', 'الرياض - غرب'].map((area, i) => (
                             <div key={i} className="flex items-center gap-2">
                                 <span className="text-sm font-medium text-slate-600 w-24">{area}</span>
                                 <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                                     <div className="bg-blue-500 h-full rounded-full" style={{width: `${80 - (i*15)}%`}}></div>
                                 </div>
                                 <span className="text-xs font-bold text-slate-500">{80 - (i*15)}%</span>
                             </div>
                         ))}
                    </div>
                </div>
             </div>
        </div>
    );

    const FinanceView = () => (
        <div className="space-y-6 animate-in fade-in">
            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg">
                    <p className="text-slate-400 text-xs mb-1 font-medium">صافي أرباح المنصة (Net Profit)</p>
                    <h3 className="text-3xl font-bold mb-4">{financialMetrics.platformRevenue.toLocaleString()} ر.س</h3>
                    <div className="flex gap-2 text-xs text-slate-300">
                        <span className="bg-white/10 px-2 py-1 rounded">عمولة {commissionRate}%</span>
                        <span className="bg-white/10 px-2 py-1 rounded">+ رسوم تشغيل</span>
                    </div>
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-slate-500 text-xs font-medium">مستحقات الشركاء (Payables)</p>
                        <Store className="w-5 h-5 text-amber-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">{financialMetrics.sellersRevenue.toLocaleString()} ر.س</h3>
                    <p className="text-xs text-slate-400">إجمالي ما يجب تحويله للمطاعم</p>
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-slate-500 text-xs font-medium">مستحقات السائقين (Fleet)</p>
                        <Truck className="w-5 h-5 text-blue-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">{financialMetrics.totalDeliveryFees.toLocaleString()} ر.س</h3>
                    <p className="text-xs text-slate-400">رسوم التوصيل المستحقة للسائقين</p>
                </div>
            </div>

            {/* Settlements Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-slate-500" />
                        التسويات المالية ومحافظ الشركاء
                    </h3>
                    <button className="text-sm font-bold text-amber-600 hover:bg-amber-50 px-3 py-1.5 rounded-lg transition-colors">
                        تصدير كشف حساب (Excel)
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-right min-w-[700px]">
                        <thead className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500">
                            <tr>
                                <th className="p-4">الشريك / المطعم</th>
                                <th className="p-4">إجمالي المبيعات</th>
                                <th className="p-4">عمولة المنصة ({commissionRate}%)</th>
                                <th className="p-4">صافي الربح</th>
                                <th className="p-4">تم صرفه</th>
                                <th className="p-4">الرصيد الحالي</th>
                                <th className="p-4">الإجراء</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {sellers.map(seller => {
                                const sellerSales = orders
                                    .filter(o => o.items[0]?.product.sellerId === seller.id)
                                    .reduce((acc, o) => acc + (o.total - deliveryFee), 0);
                                const commission = sellerSales * (commissionRate / 100);
                                const netEarnings = sellerSales - commission;
                                const paidOut = transactions
                                    .filter(t => t.referenceId === seller.id && t.type === 'payout_seller')
                                    .reduce((acc, t) => acc + t.amount, 0);
                                const balance = netEarnings - paidOut;

                                return (
                                    <tr key={seller.id} className="hover:bg-slate-50">
                                        <td className="p-4 font-bold text-slate-700">{seller.nameAr}</td>
                                        <td className="p-4 text-sm">{sellerSales.toLocaleString()}</td>
                                        <td className="p-4 text-sm text-red-500">-{commission.toLocaleString()}</td>
                                        <td className="p-4 text-sm font-medium text-emerald-600">+{netEarnings.toLocaleString()}</td>
                                        <td className="p-4 text-sm text-slate-400">{paidOut.toLocaleString()}</td>
                                        <td className="p-4 font-bold text-amber-600">{balance > 0 ? balance.toLocaleString() : '0'} ر.س</td>
                                        <td className="p-4">
                                            <button 
                                                disabled={balance <= 0}
                                                onClick={() => setSettlementModal({ id: seller.id, name: seller.nameAr, type: 'seller', balance })}
                                                className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-700 disabled:opacity-20 disabled:cursor-not-allowed shadow-sm whitespace-nowrap"
                                            >
                                                تسوية رصيد
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    const SettingsView = () => (
        <div className="max-w-3xl space-y-6 animate-in fade-in">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-amber-500" />
                    إعدادات الرسوم والعمولات
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <label className="block text-sm font-medium text-slate-700 mb-2">عمولة المنصة الافتراضية</label>
                        <div className="flex items-center gap-2">
                            <input 
                                type="number" 
                                value={commissionRate}
                                onChange={(e) => setCommissionRate(Number(e.target.value))}
                                className="flex-1 bg-white border border-slate-300 rounded-lg px-4 py-2 text-left font-bold focus:ring-2 focus:ring-amber-500 outline-none"
                            />
                            <span className="font-bold text-slate-500">%</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">تطبق هذه النسبة على جميع مبيعات المطاعم ما لم يتم تحديد نسبة خاصة للمطعم.</p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <label className="block text-sm font-medium text-slate-700 mb-2">رسوم التوصيل الثابتة</label>
                        <div className="flex items-center gap-2">
                            <input 
                                type="number" 
                                value={deliveryFee}
                                onChange={(e) => setDeliveryFee(Number(e.target.value))}
                                className="flex-1 bg-white border border-slate-300 rounded-lg px-4 py-2 text-left font-bold focus:ring-2 focus:ring-amber-500 outline-none"
                            />
                            <span className="font-bold text-slate-500">ر.س</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">يتم إضافة هذا المبلغ تلقائياً على فاتورة العميل ويذهب لمحفظة السائق.</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-slate-600" />
                    إعدادات النظام العامة
                </h3>
                <div className="space-y-4">
                     <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                         <div>
                             <p className="font-bold text-slate-800">وضع الصيانة</p>
                             <p className="text-xs text-slate-500">إيقاف استقبال الطلبات في التطبيق مؤقتاً</p>
                         </div>
                         <button className="text-slate-400 hover:text-amber-500"><ToggleLeft className="w-10 h-10" /></button>
                     </div>
                     <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                         <div>
                             <p className="font-bold text-slate-800">السماح بتسجيل السائقين</p>
                             <p className="text-xs text-slate-500">فتح باب التسجيل لسائقين جدد</p>
                         </div>
                         <button className="text-emerald-500"><ToggleRight className="w-10 h-10" /></button>
                     </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-blue-500" />
                    أمان المسؤول
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">تغيير كلمة مرور المسؤول</label>
                        <input type="password" placeholder="كلمة المرور الجديدة" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-amber-500" />
                    </div>
                    <button className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-slate-800">
                        حفظ التغييرات
                    </button>
                </div>
            </div>
        </div>
    );

    const SellersView = () => (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">الشركاء والمطاعم</h2>
                <button 
                    onClick={() => setSellerModal({})}
                    className="bg-slate-900 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm hover:bg-slate-800 shadow-md"
                >
                    <Plus className="w-4 h-4" /> إضافة شريك جديد
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sellers.map(seller => (
                    <div key={seller.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                        <div className="h-32 bg-slate-100 relative">
                            <img src={seller.image} alt={seller.nameAr} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-2 left-2 flex gap-1">
                                <button onClick={() => setSellerModal(seller)} className="p-1.5 bg-white/90 backdrop-blur rounded-lg text-slate-600 hover:text-amber-600 hover:bg-white transition-colors">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={() => {
                                        if(confirm('حذف الشريك؟')) {
                                            setSellers(prev => prev.filter(s => s.id !== seller.id));
                                        }
                                    }}
                                    className="p-1.5 bg-white/90 backdrop-blur rounded-lg text-slate-600 hover:text-red-600 hover:bg-white transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg text-slate-800">{seller.nameAr}</h3>
                                <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded text-amber-700 text-xs font-bold">
                                    <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {seller.rating}
                                </div>
                            </div>
                            <p className="text-sm text-slate-500 mb-3">{seller.cuisine}</p>
                            <div className="flex items-center gap-4 text-xs text-slate-400 border-t border-slate-50 pt-3">
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {seller.deliveryTime}</span>
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> الرياض</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // --- Main Layout ---

    const ActivityIcon = ({className}: {className?: string}) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 12H18L15 21L9 3L6 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900" dir="rtl">
            
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 right-0 z-40 w-72 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-tr from-amber-500 to-amber-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">
                            س
                        </div>
                        <div>
                            <h1 className="font-bold text-lg tracking-tight">سفرة</h1>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Enterprise ERP</p>
                        </div>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400"><X /></button>
                </div>

                <div className="px-4 py-2 overflow-y-auto max-h-[calc(100vh-140px)]">
                    <div className="space-y-1">
                        <p className="px-4 text-[10px] font-bold text-slate-500 uppercase mb-2 mt-4">لوحة القيادة</p>
                        <SidebarItem id="overview" label="نظرة عامة" icon={LayoutDashboard} />
                        <SidebarItem id="live_ops" label="العمليات المباشرة" icon={ActivityIcon} badge={pendingOrders.length} />
                        
                        <p className="px-4 text-[10px] font-bold text-slate-500 uppercase mb-2 mt-6">الإدارة والشركاء</p>
                        <SidebarItem id="sellers" label="الشركاء (المطاعم)" icon={Store} />
                        <SidebarItem id="products" label="المنتجات والقوائم" icon={UtensilsCrossed} />
                        <SidebarItem id="users" label="المستخدمين" icon={Users} />
                        
                        <p className="px-4 text-[10px] font-bold text-slate-500 uppercase mb-2 mt-6">المالية والتقارير</p>
                        <SidebarItem id="finance" label="المحاسبة والعمولات" icon={Banknote} />
                        <SidebarItem id="reports" label="التقارير التحليلية" icon={PieChart} />
                        
                        <p className="px-4 text-[10px] font-bold text-slate-500 uppercase mb-2 mt-6">النظام</p>
                        <SidebarItem id="settings" label="الإعدادات" icon={Settings} />
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-900 border-t border-slate-800">
                    <button onClick={onLogout} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors">
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium text-sm">تسجيل الخروج</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                
                {/* Topbar */}
                <header className="bg-white border-b border-slate-100 h-16 flex items-center justify-between px-6 sticky top-0 z-20 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 bg-slate-100 rounded-lg text-slate-600"><Settings className="w-5 h-5"/></button>
                        <h2 className="font-bold text-lg text-slate-800 hidden md:block">
                            {activeTab === 'overview' && 'لوحة القيادة'}
                            {activeTab === 'live_ops' && 'مركز العمليات المباشرة'}
                            {activeTab === 'finance' && 'الإدارة المالية'}
                            {activeTab === 'sellers' && 'إدارة الشركاء'}
                            {activeTab === 'users' && 'إدارة المستخدمين والصلاحيات'}
                            {activeTab === 'products' && 'إدارة المنتجات والمخزون'}
                            {activeTab === 'reports' && 'مركز التقارير والبيانات'}
                            {activeTab === 'settings' && 'إعدادات النظام'}
                        </h2>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex relative max-w-xs w-full">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="بحث عام..." 
                                className="bg-slate-50 border-none rounded-xl py-2 px-10 text-sm outline-none focus:ring-2 focus:ring-amber-100 w-64"
                            />
                        </div>
                        <div className="h-8 w-px bg-slate-100 mx-2"></div>
                        <div className="flex items-center gap-3">
                            <div className="text-left hidden md:block">
                                <p className="text-sm font-bold text-slate-800">{adminUser.name}</p>
                                <p className="text-[10px] text-slate-500">Super Admin</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                                {adminUser.name.charAt(0)}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Body */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50">
                    <div className="max-w-7xl mx-auto">
                        {activeTab === 'overview' && <OverviewView />}
                        {activeTab === 'live_ops' && <LiveOpsView />}
                        {activeTab === 'finance' && <FinanceView />}
                        {activeTab === 'sellers' && <SellersView />}
                        {activeTab === 'products' && <ProductsView />}
                        {activeTab === 'users' && <UsersView />}
                        {activeTab === 'reports' && <ReportsView />}
                        {activeTab === 'settings' && <SettingsView />}
                    </div>
                </div>

                {/* Overlay for mobile sidebar */}
                {isSidebarOpen && (
                    <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
                )}
            </main>

            {/* --- Modals --- */}

            {/* Seller Edit/Add Modal */}
            {sellerModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in zoom-in-95">
                        <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                            <h3 className="font-bold text-xl text-slate-800">
                                {sellerModal.id ? 'تعديل بيانات شريك' : 'إضافة شريك جديد'}
                            </h3>
                            <button onClick={() => setSellerModal(null)} className="p-1 hover:bg-slate-100 rounded-full"><X className="w-5 h-5"/></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">اسم المطعم / الأسرة</label>
                                <input 
                                    type="text" 
                                    value={sellerModal.nameAr || ''} 
                                    onChange={e => setSellerModal({...sellerModal, nameAr: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-amber-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">نوع المطبخ</label>
                                <input 
                                    type="text" 
                                    value={sellerModal.cuisine || ''} 
                                    onChange={e => setSellerModal({...sellerModal, cuisine: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-amber-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">وقت التوصيل</label>
                                    <input 
                                        type="text" 
                                        value={sellerModal.deliveryTime || ''} 
                                        onChange={e => setSellerModal({...sellerModal, deliveryTime: e.target.value})}
                                        placeholder="مثال: 30-40 دقيقة"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">صورة الغلاف (URL)</label>
                                    <input 
                                        type="text" 
                                        value={sellerModal.image || ''} 
                                        onChange={e => setSellerModal({...sellerModal, image: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                            </div>
                            <button onClick={handleSaveSeller} className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl mt-4 hover:bg-slate-800 flex justify-center gap-2 items-center">
                                <Save className="w-5 h-5" /> حفظ البيانات
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Product Edit/Add Modal */}
            {productModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-2xl animate-in zoom-in-95 my-8">
                        <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                            <h3 className="font-bold text-xl text-slate-800">
                                {productModal.id ? 'تعديل منتج' : 'إضافة منتج جديد'}
                            </h3>
                            <button onClick={() => setProductModal(null)} className="p-1 hover:bg-slate-100 rounded-full"><X className="w-5 h-5"/></button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">اسم المنتج</label>
                                    <input 
                                        type="text" 
                                        value={productModal.nameAr || ''} 
                                        onChange={e => setProductModal({...productModal, nameAr: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">السعر (ر.س)</label>
                                    <input 
                                        type="number" 
                                        value={productModal.price || ''} 
                                        onChange={e => setProductModal({...productModal, price: Number(e.target.value)})}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">المطعم التابع له</label>
                                    <select 
                                        value={productModal.sellerId || ''} 
                                        onChange={e => setProductModal({...productModal, sellerId: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-amber-500"
                                    >
                                        <option value="">اختر المطعم</option>
                                        {sellers.map(s => <option key={s.id} value={s.id}>{s.nameAr}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">صورة المنتج (URL)</label>
                                    <input 
                                        type="text" 
                                        value={productModal.image || ''} 
                                        onChange={e => setProductModal({...productModal, image: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-amber-500"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">الوصف</label>
                                    <textarea 
                                        rows={4}
                                        value={productModal.descriptionAr || ''} 
                                        onChange={e => setProductModal({...productModal, descriptionAr: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">السعرات (Cal)</label>
                                        <input 
                                            type="number" 
                                            value={productModal.nutrition?.calories || ''} 
                                            onChange={e => setProductModal({...productModal, nutrition: {...productModal.nutrition!, calories: Number(e.target.value)}})}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-amber-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">بروتين</label>
                                        <input 
                                            type="text" 
                                            value={productModal.nutrition?.protein || ''} 
                                            onChange={e => setProductModal({...productModal, nutrition: {...productModal.nutrition!, protein: e.target.value, carbs: '', fats: ''}})}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-amber-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button onClick={handleSaveProduct} className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl mt-6 hover:bg-slate-800 flex justify-center gap-2 items-center">
                            <Save className="w-5 h-5" /> حفظ المنتج
                        </button>
                    </div>
                </div>
            )}

            {/* Order Details Modal */}
            {activeOrderDetail && (
                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 max-h-[90vh] flex flex-col">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-xl text-slate-800">تفاصيل الطلب #{activeOrderDetail.id.substr(0, 6)}</h3>
                                <p className="text-sm text-slate-500">{new Date(activeOrderDetail.date).toLocaleString('ar-SA')}</p>
                            </div>
                            <button onClick={() => setActiveOrderDetail(null)} className="p-1 hover:bg-slate-100 rounded-full"><X className="w-5 h-5"/></button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Status Stepper */}
                            <div className="flex items-center justify-between relative px-2">
                                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -z-10"></div>
                                {['pending', 'accepted', 'delivering', 'delivered'].map((s, i) => {
                                    const isCompleted = 
                                        (activeOrderDetail.status === 'delivered') ||
                                        (activeOrderDetail.status === 'delivering' && i <= 2) ||
                                        (activeOrderDetail.status === 'accepted' && i <= 1) ||
                                        (activeOrderDetail.status === 'pending' && i === 0);
                                    
                                    return (
                                        <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${isCompleted ? 'bg-amber-500 border-amber-500 text-white' : 'bg-white border-slate-300 text-slate-300'}`}>
                                            <CheckCircle className="w-4 h-4" />
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="bg-slate-50 p-4 rounded-xl space-y-3">
                                <h4 className="font-bold text-sm text-slate-700">الأصناف المطلوبة</h4>
                                {activeOrderDetail.items.map((item, i) => (
                                    <div key={i} className="flex justify-between items-center text-sm border-b border-slate-200 pb-2 last:border-0 last:pb-0">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-white px-2 py-0.5 rounded border border-slate-200 font-bold text-slate-600">{item.quantity}x</span>
                                            <span>{item.product.nameAr}</span>
                                        </div>
                                        <span className="font-medium">{item.product.price * item.quantity} ر.س</span>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-slate-500">العميل</p>
                                    <p className="font-bold text-sm">{users.find(u => u.id === activeOrderDetail.customerId)?.name || 'غير معروف'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">السائق</p>
                                    <p className="font-bold text-sm">{activeOrderDetail.driverId ? users.find(u => u.id === activeOrderDetail.driverId)?.name : 'لم يعين'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-between items-center">
                            <span className="font-bold text-lg">الإجمالي</span>
                            <span className="font-bold text-xl text-amber-600">{activeOrderDetail.total} ر.س</span>
                        </div>
                    </div>
                 </div>
            )}

            {/* Settlement Modal */}
            {settlementModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-lg text-slate-800">إجراء تسوية مالية</h3>
                            <button onClick={() => setSettlementModal(null)}><X className="w-5 h-5"/></button>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                            <div className="flex justify-between mb-2 text-sm">
                                <span className="text-slate-500">المستفيد:</span>
                                <span className="font-bold text-slate-800">{settlementModal.name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 text-sm">الرصيد المستحق:</span>
                                <span className="font-bold text-xl text-amber-600">{settlementModal.balance.toLocaleString()} ر.س</span>
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            <p className="text-xs text-slate-500 leading-relaxed">
                                تحذير: سيتم تسجيل هذه العملية كـ "دفعة نقدية" أو "تحويل بنكي" تم خارج المنصة، وسيتم خصم المبلغ من الرصيد المعلق للشريك.
                            </p>
                            <button 
                                onClick={() => handleProcessSettlement(settlementModal.balance)}
                                className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 flex justify-center items-center gap-2"
                            >
                                <CheckCircle className="w-5 h-5" /> تأكيد الدفع ({settlementModal.balance} ر.س)
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};
