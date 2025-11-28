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
    ShoppingBag
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

type Tab = 'overview' | 'users' | 'sellers' | 'products' | 'settings';

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
            setProducts(products.filter(p => p.sellerId !== id)); // Clean up products
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
            // Edit
            setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...editingProduct } as Product : p));
        } else {
            // Add
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

    // --- Sub-components ---

    const Overview = () => (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Users /></div>
                    <span className="text-sm text-slate-400 font-bold">+12%</span>
                </div>
                <h3 className="text-3xl font-bold text-slate-800">{users.length}</h3>
                <p className="text-slate-500 text-sm">إجمالي المستخدمين</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><ShoppingBag /></div>
                    <span className="text-sm text-slate-400 font-bold">+5%</span>
                </div>
                <h3 className="text-3xl font-bold text-slate-800">{orders.length}</h3>
                <p className="text-slate-500 text-sm">إجمالي الطلبات</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><DollarSign /></div>
                </div>
                <h3 className="text-3xl font-bold text-slate-800">
                    {orders.reduce((acc, curr) => acc + curr.total, 0).toLocaleString()} ر.س
                </h3>
                <p className="text-slate-500 text-sm">إجمالي الإيرادات</p>
            </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Store /></div>
                </div>
                <h3 className="text-3xl font-bold text-slate-800">{sellers.length}</h3>
                <p className="text-slate-500 text-sm">عدد المطاعم</p>
            </div>
        </div>
    );

    const UsersList = () => (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-right">
                <thead className="bg-slate-50 text-slate-500 text-sm">
                    <tr>
                        <th className="p-4 font-medium">الاسم</th>
                        <th className="p-4 font-medium">البريد الإلكتروني</th>
                        <th className="p-4 font-medium">نوع الحساب</th>
                        <th className="p-4 font-medium">الإجراءات</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {users.filter(u => u.name.includes(searchTerm)).map(user => (
                        <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-4 font-medium text-slate-800">{user.name}</td>
                            <td className="p-4 text-slate-500">{user.email}</td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                                    user.role === 'admin' ? 'bg-red-100 text-red-700' :
                                    user.role === 'seller' ? 'bg-purple-100 text-purple-700' :
                                    user.role === 'driver' ? 'bg-blue-100 text-blue-700' :
                                    'bg-slate-100 text-slate-700'
                                }`}>
                                    {user.role}
                                </span>
                            </td>
                            <td className="p-4">
                                <button 
                                    onClick={() => handleDeleteUser(user.id)}
                                    disabled={user.role === 'admin'}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-30"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const SellersManager = () => (
        <div>
            <div className="flex justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-800">إدارة المطاعم</h2>
                <button 
                    onClick={() => setEditingSeller({ nameAr: '', cuisine: '', deliveryTime: '30 دقيقة' })}
                    className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold"
                >
                    <Plus className="w-4 h-4" /> إضافة مطعم
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sellers.map(seller => (
                    <div key={seller.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group">
                        <div className="relative h-40">
                            <img src={seller.image} alt={seller.nameAr} className="w-full h-full object-cover" />
                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => setEditingSeller(seller)} className="p-2 bg-white rounded-lg shadow-sm text-blue-600 hover:text-blue-700">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDeleteSeller(seller.id)} className="p-2 bg-white rounded-lg shadow-sm text-red-600 hover:text-red-700">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-lg text-slate-800">{seller.nameAr}</h3>
                            <p className="text-sm text-slate-500">{seller.cuisine}</p>
                            <div className="mt-4 flex gap-2 text-xs font-medium text-slate-400">
                                <span className="bg-slate-100 px-2 py-1 rounded-md">{seller.deliveryTime}</span>
                                <span className="bg-amber-50 text-amber-600 px-2 py-1 rounded-md">★ {seller.rating}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const ProductsManager = () => (
         <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                 <h2 className="text-lg font-bold text-slate-800">المنتجات</h2>
                 <button 
                    onClick={() => setEditingProduct({ nameAr: '', price: 0, descriptionAr: '' })}
                    className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-amber-600"
                >
                    <Plus className="w-4 h-4" /> إضافة منتج
                </button>
            </div>
            <table className="w-full text-right">
                <thead className="bg-slate-50 text-slate-500 text-sm">
                    <tr>
                        <th className="p-4 font-medium">الصورة</th>
                        <th className="p-4 font-medium">اسم المنتج</th>
                        <th className="p-4 font-medium">السعر</th>
                        <th className="p-4 font-medium">الوصف</th>
                        <th className="p-4 font-medium">الإجراءات</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {products.map(product => (
                        <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-4">
                                <img src={product.image} className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
                            </td>
                            <td className="p-4 font-medium text-slate-800">{product.nameAr}</td>
                            <td className="p-4 text-amber-600 font-bold">{product.price} ر.س</td>
                            <td className="p-4 text-slate-500 text-sm max-w-xs truncate">{product.descriptionAr}</td>
                            <td className="p-4 flex gap-2">
                                <button onClick={() => setEditingProduct(product)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const SettingsTab = () => {
        const [newPass, setNewPass] = useState('');
        const [msg, setMsg] = useState('');

        return (
            <div className="max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-800 mb-6">إعدادات الحساب</h2>
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-1">تغيير كلمة مرور المدير</label>
                    <input 
                        type="text" 
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-amber-500 outline-none"
                        placeholder="كلمة المرور الجديدة"
                    />
                </div>
                {msg && <p className="text-emerald-600 text-sm mb-4">{msg}</p>}
                <button 
                    onClick={() => {
                        if(newPass) {
                            onUpdateAdminPassword(newPass);
                            setMsg('تم تحديث كلمة المرور بنجاح');
                            setNewPass('');
                        }
                    }}
                    className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800"
                >
                    حفظ التغييرات
                </button>
            </div>
        );
    };

    // --- Modal for Editing ---
    const EditModal = () => {
        if (!editingProduct && !editingSeller) return null;
        
        const isProduct = !!editingProduct;
        const title = isProduct ? (editingProduct.id ? 'تعديل منتج' : 'إضافة منتج') : (editingSeller?.id ? 'تعديل مطعم' : 'إضافة مطعم');

        return (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-slate-800">{title}</h3>
                        <button onClick={() => { setEditingProduct(null); setEditingSeller(null); }} className="p-2 hover:bg-slate-100 rounded-full">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1">
                        {isProduct ? (
                            <>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">اسم المنتج</label>
                                    <input 
                                        type="text" 
                                        value={editingProduct?.nameAr || ''} 
                                        onChange={e => setEditingProduct({...editingProduct, nameAr: e.target.value})}
                                        className="w-full border p-2 rounded-lg mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">السعر</label>
                                    <input 
                                        type="number" 
                                        value={editingProduct?.price || 0} 
                                        onChange={e => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                                        className="w-full border p-2 rounded-lg mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">الوصف</label>
                                    <textarea 
                                        value={editingProduct?.descriptionAr || ''} 
                                        onChange={e => setEditingProduct({...editingProduct, descriptionAr: e.target.value})}
                                        className="w-full border p-2 rounded-lg mt-1 h-20"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">رابط الصورة</label>
                                    <input 
                                        type="text" 
                                        value={editingProduct?.image || ''} 
                                        onChange={e => setEditingProduct({...editingProduct, image: e.target.value})}
                                        className="w-full border p-2 rounded-lg mt-1"
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">اسم المطعم</label>
                                    <input 
                                        type="text" 
                                        value={editingSeller?.nameAr || ''} 
                                        onChange={e => setEditingSeller({...editingSeller, nameAr: e.target.value})}
                                        className="w-full border p-2 rounded-lg mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">نوع المطبخ</label>
                                    <input 
                                        type="text" 
                                        value={editingSeller?.cuisine || ''} 
                                        onChange={e => setEditingSeller({...editingSeller, cuisine: e.target.value})}
                                        className="w-full border p-2 rounded-lg mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">وقت التوصيل</label>
                                    <input 
                                        type="text" 
                                        value={editingSeller?.deliveryTime || ''} 
                                        onChange={e => setEditingSeller({...editingSeller, deliveryTime: e.target.value})}
                                        className="w-full border p-2 rounded-lg mt-1"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">رابط الصورة</label>
                                    <input 
                                        type="text" 
                                        value={editingSeller?.image || ''} 
                                        onChange={e => setEditingSeller({...editingSeller, image: e.target.value})}
                                        className="w-full border p-2 rounded-lg mt-1"
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="mt-6 flex gap-3">
                        <button 
                            onClick={isProduct ? handleSaveProduct : handleSaveSeller}
                            className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800"
                        >
                            حفظ
                        </button>
                        <button 
                            onClick={() => { setEditingProduct(null); setEditingSeller(null); }}
                            className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-200"
                        >
                            إلغاء
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // --- Components for DollarSign icon fix ---
    const DollarSign = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans" dir="rtl">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-slate-900 text-white flex-shrink-0">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-2xl font-bold text-amber-500">لوحة التحكم</h1>
                    <p className="text-xs text-slate-400 mt-1">نظام إدارة سفرة</p>
                </div>
                <nav className="p-4 space-y-2">
                    <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'overview' ? 'bg-amber-500 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
                        <LayoutDashboard className="w-5 h-5" />
                        <span>نظرة عامة</span>
                    </button>
                    <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'users' ? 'bg-amber-500 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
                        <Users className="w-5 h-5" />
                        <span>المستخدمين</span>
                    </button>
                    <button onClick={() => setActiveTab('sellers')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'sellers' ? 'bg-amber-500 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
                        <Store className="w-5 h-5" />
                        <span>المطاعم</span>
                    </button>
                    <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'products' ? 'bg-amber-500 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
                        <UtensilsCrossed className="w-5 h-5" />
                        <span>المنتجات</span>
                    </button>
                    <div className="pt-4 mt-4 border-t border-slate-800">
                        <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'settings' ? 'bg-amber-500 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
                            <Settings className="w-5 h-5" />
                            <span>الإعدادات</span>
                        </button>
                        <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 mt-2 transition-colors">
                            <LogOut className="w-5 h-5" />
                            <span>تسجيل الخروج</span>
                        </button>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto h-screen">
                <header className="bg-white border-b border-slate-200 p-4 sticky top-0 z-20 flex justify-between items-center">
                    <div className="flex items-center gap-4 bg-slate-100 rounded-xl px-4 py-2 w-full max-w-md">
                        <Search className="w-5 h-5 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="بحث..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent border-none outline-none w-full text-slate-700"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-left hidden sm:block">
                            <p className="font-bold text-slate-800">{adminUser.name}</p>
                            <p className="text-xs text-slate-500">Admin</p>
                        </div>
                        <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold">
                            A
                        </div>
                    </div>
                </header>

                <div className="p-6 md:p-10">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-slate-800">
                            {activeTab === 'overview' && 'لوحة المعلومات'}
                            {activeTab === 'users' && 'إدارة المستخدمين'}
                            {activeTab === 'sellers' && 'قائمة المطاعم'}
                            {activeTab === 'products' && 'قائمة المنتجات'}
                            {activeTab === 'settings' && 'الإعدادات'}
                        </h2>
                    </div>

                    {activeTab === 'overview' && <Overview />}
                    {activeTab === 'users' && <UsersList />}
                    {activeTab === 'sellers' && <SellersManager />}
                    {activeTab === 'products' && <ProductsManager />}
                    {activeTab === 'settings' && <SettingsTab />}
                </div>
            </main>

            <EditModal />
        </div>
    );
};