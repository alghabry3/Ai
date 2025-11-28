import React, { useState, useEffect } from 'react';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { ProductPage } from './components/ProductPage';
import { Auth } from './components/Auth';
import { Cart } from './components/Cart';
import { Profile } from './components/Profile';
import { AdminDashboard } from './components/AdminDashboard';
import { 
  ShoppingBag, 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  User as UserIcon, 
  Home, 
  Heart, 
  Mic
} from 'lucide-react';
import { Product, Category, Seller, User, CartItem, Order, UserRole } from './types';

// --- MOCK INITIAL DATA ---
const INITIAL_CATEGORIES: Category[] = [
  { id: '1', nameAr: 'برجر', icon: '🍔' },
  { id: '2', nameAr: 'بيتزا', icon: '🍕' },
  { id: '3', nameAr: 'شاورما', icon: '🥙' },
  { id: '4', nameAr: 'آسيوي', icon: '🍣' },
  { id: '5', nameAr: 'حلويات', icon: '🍩' },
];

const INITIAL_SELLERS: Seller[] = [
  { id: '1', nameAr: 'برجر كنج', cuisine: 'وجبات سريعة', deliveryTime: '25-35 دقيقة', rating: 4.5, image: 'https://picsum.photos/seed/burger/400/250' },
  { id: '2', nameAr: 'بيتزا هت', cuisine: 'إيطالي', deliveryTime: '30-45 دقيقة', rating: 4.2, image: 'https://picsum.photos/seed/pizza/400/250' },
  { id: '3', nameAr: 'شاورما كلاسيك', cuisine: 'عربي', deliveryTime: '15-25 دقيقة', rating: 4.8, image: 'https://picsum.photos/seed/shawarma/400/250' },
];

const INITIAL_PRODUCTS: Product[] = [
  { 
    id: '1', 
    nameAr: 'وجبة دجاج عائلي', 
    descriptionAr: '١٢ قطعة دجاج + بطاطس + كولا', 
    price: 85, 
    image: 'https://picsum.photos/seed/chicken/600/600', 
    images: [
      'https://picsum.photos/seed/chicken/600/600',
      'https://picsum.photos/seed/chicken2/600/600',
      'https://picsum.photos/seed/chicken3/600/600'
    ],
    rating: 4.7,
    longDescriptionAr: 'استمتع بوجبة عائلية متكاملة تكفي الجميع! ١٢ قطعة من الدجاج المقرمش المتبل بخلطتنا السرية، يقدم مع بطاطس ذهبية مقلية ومشروب كولا عائلي بارد. الخيار الأمثل للتجمعات.',
    ingredientsAr: ['دجاج طازج', 'دقيق القمح', 'توابل خاصة', 'زيت نباتي', 'بطاطس', 'ملح'],
    nutrition: { calories: 1200, protein: '45g', carbs: '110g', fats: '55g' },
    sellerId: '1',
    categoryId: '1'
  },
  { 
    id: '2', 
    nameAr: 'بيتزا سوبر سوبريم', 
    descriptionAr: 'حجم كبير مع أطراف جبنة', 
    price: 65, 
    image: 'https://picsum.photos/seed/pizza2/600/600', 
    images: [
      'https://picsum.photos/seed/pizza2/600/600',
      'https://picsum.photos/seed/pizza3/600/600'
    ],
    rating: 4.5,
    longDescriptionAr: 'بيتزا سوبر سوبريم الغنية بالمكونات! طبقة غنية من صلصة الطماطم وجبنة الموزاريلا، مغطاة بقطع البيبروني، اللحم المفروم، الفطر، الفلفل الأخضر، والزيتون الأسود. تأتيكم بأطراف محشوة بالجبنة اللذيذة.',
    ingredientsAr: ['عجينة البيتزا', 'صلصة طماطم', 'جبنة موزاريلا', 'بيبروني', 'لحم بقري', 'فطر', 'فلفل أخضر', 'زيتون'],
    nutrition: { calories: 280, protein: '12g', carbs: '35g', fats: '10g' },
    sellerId: '2',
    categoryId: '2'
  },
];

// View Router Enum
type AppView = 'home' | 'product' | 'cart' | 'profile' | 'auth' | 'admin';

const App: React.FC = () => {
  // --- GLOBAL DATA STATE ---
  // Lifted up so AdminDashboard can edit them
  const [sellers, setSellers] = useState<Seller[]>(INITIAL_SELLERS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [users, setUsers] = useState<User[]>([]);

  // --- APP STATE ---
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Auth & Cart State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [adminPassword, setAdminPassword] = useState('admin');

  // Init Demo Data
  useEffect(() => {
    // Add a demo driver and seller if empty
    if (users.length === 0) {
      setUsers([
        { id: 'd1', name: 'سائق تجريبي', email: 'driver@demo.com', phone: '0500000000', role: 'driver' },
        { id: 's1', name: 'مدير المطعم', email: 'seller@demo.com', phone: '0500000000', role: 'seller' }
      ]);
    }
  }, []);

  // --- ACTIONS ---

  const handleRegister = (user: User) => {
    setUsers([...users, user]);
    setCurrentUser(user);
    setCurrentView(user.role === 'admin' ? 'admin' : 'home');
  };

  const handleLogin = (user: User) => {
    // Special check for master admin override
    if (user.role === 'admin' && user.email === 'admin') {
         // Verify against local dynamic password state
         if (user.password !== adminPassword) {
             alert('كلمة المرور غير صحيحة');
             return;
         }
         setCurrentUser(user);
         setCurrentView('admin');
         return;
    }

    // Standard user flow
    const existing = users.find(u => u.email === user.email);
    if (existing) {
      setCurrentUser(existing);
      if (existing.role === 'admin') {
          setCurrentView('admin');
      } else {
          setCurrentView('home');
      }
    } else {
      // Auto-register for demo simplicity
      setUsers([...users, user]);
      setCurrentUser(user);
      setCurrentView('home');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('auth');
  };

  const addToCart = (product: Product, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(p => p.product.id === product.id);
      if (existing) {
        return prev.map(p => p.product.id === product.id ? { ...p, quantity: p.quantity + quantity } : p);
      }
      return [...prev, { product, quantity }];
    });
    setSelectedProduct(null);
    // Don't change view immediately, maybe show toast? For now go home
    setCurrentView('home');
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.product.id !== id));
  };

  const placeOrder = () => {
    if (!currentUser) {
      setCurrentView('auth');
      return;
    }
    
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 6),
      items: [...cart],
      total: cart.reduce((sum, i) => sum + (i.product.price * i.quantity), 0) + 15, // + delivery
      status: 'pending',
      date: new Date().toISOString(),
      customerId: currentUser.id
    };

    setOrders([newOrder, ...orders]);
    setCart([]); // Clear cart
    setCurrentView('profile'); // Go to orders to track
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const navigateToProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  // --- RENDERERS ---

  // 1. Check Voice Assistant (Global)
  // 2. Check Auth View
  if (currentView === 'auth') {
    return (
      <Auth 
        onLogin={handleLogin} 
        onRegister={handleRegister} 
        onBack={() => setCurrentView('home')} 
      />
    );
  }

  // 3. Admin Dashboard View
  if (currentView === 'admin' && currentUser?.role === 'admin') {
      return (
          <AdminDashboard 
            users={users}
            setUsers={setUsers}
            sellers={sellers}
            setSellers={setSellers}
            products={products}
            setProducts={setProducts}
            orders={orders}
            adminUser={currentUser}
            onLogout={handleLogout}
            onUpdateAdminPassword={setAdminPassword}
          />
      );
  }

  // 4. Check Cart View
  if (currentView === 'cart') {
    return (
      <Cart 
        items={cart} 
        onRemove={removeFromCart} 
        onCheckout={placeOrder} 
        onBack={() => setCurrentView('home')} 
        user={currentUser}
        onLoginReq={() => setCurrentView('auth')}
      />
    );
  }

  // 5. Check Profile View
  if (currentView === 'profile') {
    if (!currentUser) {
      // Redirect to auth if trying to access profile while logged out
      setTimeout(() => setCurrentView('auth'), 0);
      return null; 
    }
    return (
      <div className="relative">
         <Profile 
            user={currentUser} 
            orders={orders} 
            onLogout={handleLogout}
            onStatusUpdate={updateOrderStatus}
         />
         {/* Bottom Nav visible in Profile */}
         <BottomNav current={currentView} setView={setCurrentView} cartCount={cart.length} />
      </div>
    );
  }

  // 6. Check Product View (Overlay logic)
  if (selectedProduct) {
    return (
      <ProductPage 
        product={selectedProduct} 
        onBack={() => setSelectedProduct(null)} 
        onAddToCart={addToCart}
      />
    );
  }

  // 7. Default: Home View
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      <VoiceAssistantModal 
        isOpen={isVoiceModalOpen} 
        onClose={() => setIsVoiceModalOpen(false)} 
      />

      <div className="pb-24">
          {/* Top Header */}
          <header className="bg-white sticky top-0 z-30 shadow-sm px-4 py-3">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-amber-200">
                   س
                 </div>
                 <div>
                   <p className="text-xs text-slate-500 font-medium">مرحباً، {currentUser ? currentUser.name.split(' ')[0] : 'ضيف'}</p>
                   <div className="flex items-center gap-1 text-slate-800 font-bold text-sm cursor-pointer">
                     <span>الرياض، السعودية</span>
                     <MapPin className="w-3 h-3 text-amber-500" />
                   </div>
                 </div>
              </div>
              <button 
                onClick={() => setCurrentView('cart')}
                className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200 transition-colors relative"
              >
                 <ShoppingBag className="w-6 h-6" />
                 {cart.length > 0 && (
                   <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white text-[9px] text-white flex items-center justify-center">
                     {cart.length}
                   </span>
                 )}
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <input 
                type="text" 
                placeholder="ابحث عن مطعم أو وجبة..." 
                className="w-full bg-slate-100 rounded-xl py-3 px-10 text-right text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all placeholder:text-slate-400"
              />
              <Search className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </header>

          <main className="px-4 pt-6 space-y-8">
            
            {/* Seller/Driver/Admin Dashboard Access Hint */}
            {currentUser && currentUser.role !== 'customer' && (
               <div 
                 onClick={() => {
                     if (currentUser.role === 'admin') setCurrentView('admin');
                     else setCurrentView('profile');
                 }}
                 className="bg-slate-900 text-white p-4 rounded-2xl shadow-lg cursor-pointer flex justify-between items-center"
               >
                  <div>
                    <h3 className="font-bold">لوحة التحكم</h3>
                    <p className="text-xs text-slate-400">
                        {currentUser.role === 'admin' ? 'إدارة النظام بالكامل' : 'تابع الطلبات والمهام الخاصة بك'}
                    </p>
                  </div>
                  <UserIcon className="w-6 h-6" />
               </div>
            )}

            {/* Categories */}
            <section>
              <h2 className="text-lg font-bold text-slate-800 mb-4">التصنيفات</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {categories.map(cat => (
                  <div key={cat.id} className="flex-shrink-0 flex flex-col items-center gap-2 cursor-pointer group">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl border border-slate-100 group-hover:border-amber-500 group-hover:shadow-md transition-all">
                      {cat.icon}
                    </div>
                    <span className="text-xs font-medium text-slate-700">{cat.nameAr}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Featured Sellers */}
            <section>
              <div className="flex justify-between items-center mb-4">
                 <h2 className="text-lg font-bold text-slate-800">مطاعم مميزة</h2>
                 <a href="#" className="text-sm text-amber-600 font-medium">عرض الكل</a>
              </div>
              <div className="space-y-4">
                {sellers.map(seller => (
                  <div key={seller.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="relative h-32 w-full">
                      <img src={seller.image} alt={seller.nameAr} className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold text-slate-800 shadow-sm">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {seller.deliveryTime}
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-slate-800 text-lg">{seller.nameAr}</h3>
                        <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span className="text-xs font-bold text-amber-700">{seller.rating}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{seller.cuisine}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Popular Items */}
            <section>
              <h2 className="text-lg font-bold text-slate-800 mb-4">الأكثر طلباً</h2>
              <div className="grid grid-cols-2 gap-4">
                {products.map(product => (
                  <div 
                    key={product.id} 
                    onClick={() => navigateToProduct(product)}
                    className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 cursor-pointer active:scale-95 transition-transform"
                  >
                    <div className="relative mb-3">
                       <img src={product.image} alt={product.nameAr} className="w-full h-24 object-cover rounded-xl" />
                       <button className="absolute top-1 right-1 p-1.5 bg-white/80 rounded-full text-slate-400 hover:text-red-500 hover:bg-white transition-all">
                         <Heart className="w-4 h-4" />
                       </button>
                    </div>
                    <h3 className="font-bold text-sm text-slate-800 line-clamp-1">{product.nameAr}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{product.descriptionAr}</p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="font-bold text-amber-600 text-sm">{product.price} ر.س</span>
                      <button className="bg-slate-900 text-white w-6 h-6 rounded-lg flex items-center justify-center hover:bg-amber-500 transition-colors">
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
      </div>

      {/* Floating Action Button - Voice Assistant */}
      <button 
        onClick={() => setIsVoiceModalOpen(true)}
        className="fixed bottom-24 left-4 z-40 bg-gradient-to-tr from-amber-500 to-amber-400 text-white w-14 h-14 rounded-full shadow-xl shadow-amber-200 flex items-center justify-center hover:scale-110 transition-transform duration-200 group"
      >
        <div className="absolute inset-0 bg-white opacity-20 rounded-full animate-ping group-hover:animate-none"></div>
        <Mic className="w-6 h-6 relative z-10" />
      </button>

      {/* Bottom Navigation */}
      <BottomNav current={currentView} setView={setCurrentView} cartCount={cart.length} />
    </div>
  );
};

// Extracted for re-use in Profile
const BottomNav: React.FC<{current: string, setView: (v: AppView) => void, cartCount: number}> = ({ current, setView, cartCount }) => (
  <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 flex justify-between items-center z-30">
    <button 
      onClick={() => setView('home')}
      className={`flex flex-col items-center gap-1 ${current === 'home' ? 'text-amber-500' : 'text-slate-400'}`}
    >
      <Home className="w-6 h-6" />
      <span className="text-[10px] font-medium">الرئيسية</span>
    </button>
    <button 
      className={`flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600`}
    >
      <Search className="w-6 h-6" />
      <span className="text-[10px] font-medium">البحث</span>
    </button>
    <button 
      onClick={() => setView('cart')}
      className={`flex flex-col items-center gap-1 ${current === 'cart' ? 'text-amber-500' : 'text-slate-400'} relative`}
    >
      <div className="relative">
         <ShoppingBag className="w-6 h-6" />
         {cartCount > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>}
      </div>
      <span className="text-[10px] font-medium">طلباتي</span>
    </button>
    <button 
      onClick={() => setView(current === 'auth' ? 'auth' : 'profile')}
      className={`flex flex-col items-center gap-1 ${current === 'profile' ? 'text-amber-500' : 'text-slate-400'}`}
    >
      <UserIcon className="w-6 h-6" />
      <span className="text-[10px] font-medium">حسابي</span>
    </button>
  </nav>
);

export default App;