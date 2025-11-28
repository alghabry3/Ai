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
  Mic,
  Store
} from 'lucide-react';
import { Product, Category, Seller, User, CartItem, Order, UserRole } from './types';

// --- MOCK INITIAL DATA (PRODUCTIVE FAMILIES THEME) ---

const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat1', nameAr: 'أطباق شعبية', icon: '🥘' },
  { id: 'cat2', nameAr: 'حلويات ومعجنات', icon: '🧁' },
  { id: 'cat3', nameAr: 'مفرزنات', icon: '❄️' },
  { id: 'cat4', nameAr: 'بهارات وقهوة', icon: '☕' },
  { id: 'cat5', nameAr: 'أكل صحي', icon: '🥗' },
];

const INITIAL_SELLERS: Seller[] = [
  { 
    id: 's1', 
    nameAr: 'مطبخ أم عبد الله', 
    cuisine: 'أكلات سعودية أصيلة', 
    deliveryTime: '60-90 دقيقة', 
    rating: 4.9, 
    image: 'https://images.unsplash.com/photo-1547924475-f9e25c02c05e?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: 's2', 
    nameAr: 'حلويات شهد المنزلية', 
    cuisine: 'كيك وحلويات شرقية', 
    deliveryTime: '45-60 دقيقة', 
    rating: 4.7, 
    image: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: 's3', 
    nameAr: 'تجهيزات أم ريان', 
    cuisine: 'مفرزنات وسمبوسة', 
    deliveryTime: 'يوم عمل', 
    rating: 4.8, 
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800' 
  },
  { 
    id: 's4', 
    nameAr: 'نكهات صحية (دايت)', 
    cuisine: 'وجبات صحية وكيتو', 
    deliveryTime: '30-45 دقيقة', 
    rating: 4.6, 
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800' 
  },
];

const INITIAL_PRODUCTS: Product[] = [
  // Seller 1: Um Abdullah
  { 
    id: 'p1', 
    nameAr: 'جريش أحمر باللحم', 
    descriptionAr: 'جريش نجد الأصلي باللحم البلدي والمسمنة', 
    price: 45, 
    image: 'https://images.unsplash.com/photo-1547924475-f9e25c02c05e?auto=format&fit=crop&q=80&w=800', 
    images: [
      'https://images.unsplash.com/photo-1547924475-f9e25c02c05e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.9,
    longDescriptionAr: 'وجبة الجريش النجدي الأحمر الفاخر، مطبوخ بعناية فائقة لمدة ٦ ساعات مع اللحم النعيمي الطازج. يقدم مع "المسمنة" الخاصة المكونة من البصل والليمون الأسود والبهارات النجدية. وجبة تكفي شخصين.',
    ingredientsAr: ['قمح مجروش فاخر', 'لحم نعيمي طازج', 'لبن طازج', 'بصل', 'طماطم', 'بهارات مشكلة', 'سمن بري', 'ليمون أسود'],
    nutrition: { calories: 650, protein: '35g', carbs: '80g', fats: '25g' },
    sellerId: 's1',
    categoryId: 'cat1'
  },
  { 
    id: 'p2', 
    nameAr: 'ورق عنب بدبس الرمان', 
    descriptionAr: 'بوكس ٢٠ حبة، حشوة الرز المصري والخضار', 
    price: 35, 
    image: 'https://images.unsplash.com/photo-1559381552-01994354c0e6?auto=format&fit=crop&q=80&w=800', 
    images: [
      'https://images.unsplash.com/photo-1559381552-01994354c0e6?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1606509923238-769165d4486b?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.8,
    longDescriptionAr: 'ورق عنب طازج ومحشي يدوياً بخلطة الأرز المصري والخضروات الطازجة، مطبوخ بصلصة الليمون وزيت الزيتون ودبس الرمان الأصلي. طعم يجمع بين الحموضة والحلاوة.',
    ingredientsAr: ['ورق عنب طازج', 'أرز مصري', 'بقدونس', 'طماطم', 'بصل', 'زيت زيتون', 'دبس رمان', 'ليمون'],
    nutrition: { calories: 150, protein: '3g', carbs: '25g', fats: '8g' },
    sellerId: 's1',
    categoryId: 'cat1'
  },
  
  // Seller 2: Shahd Sweets
  { 
    id: 'p3', 
    nameAr: 'تشيز كيك التوت', 
    descriptionAr: 'قطعة غنية بصوص التوت الطبيعي', 
    price: 22, 
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=800', 
    rating: 4.7,
    longDescriptionAr: 'تشيز كيك مخبوز على الطريقة الأمريكية، يتميز بقاعدة بسكويت مقرمشة وطبقة جبن كريمية غنية، مغطى بصوص التوت الأزرق والأحمر المحضر منزلياً.',
    ingredientsAr: ['جبنة كريمية', 'بسكويت دايجستيف', 'زبدة', 'كريمة خفق', 'توت مشكل طازج', 'سكر', 'فانيليا'],
    nutrition: { calories: 450, protein: '8g', carbs: '45g', fats: '28g' },
    sellerId: 's2',
    categoryId: 'cat2'
  },
  { 
    id: 'p4', 
    nameAr: 'بوكس معمول التمر الفاخر', 
    descriptionAr: '١ كيلو، هش ويذوب بالفم', 
    price: 80, 
    image: 'https://images.unsplash.com/photo-1599785209796-786432b228bc?auto=format&fit=crop&q=80&w=800', 
    rating: 4.9,
    longDescriptionAr: 'معمول بيتي فاخر محشو بأجود أنواع تمر الإخلاص. يتميز بقوامه الهش الذي يذوب في الفم، محضر بالسمن البري والهيل.',
    ingredientsAr: ['دقيق فاخر', 'تمر خلاص', 'سمن بري', 'هيل', 'محلب', 'سكر بودرة'],
    nutrition: { calories: 380, protein: '4g', carbs: '60g', fats: '15g' },
    sellerId: 's2',
    categoryId: 'cat2'
  },

  // Seller 3: Um Rayan Frozen
  { 
    id: 'p5', 
    nameAr: 'سمبوسة لحم (مفرزنات)', 
    descriptionAr: 'بوكس ٥٠ حبة، عجينة بيتية مقرمشة', 
    price: 60, 
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800', 
    rating: 4.6,
    longDescriptionAr: 'سمبوسة مفرزنة جاهزة للقلي، محضرة من عجينة بيتية رقيقة ومقرمشة. الحشوة تتكون من لحم غنم طازج مفروم مع البصل والشبت والبهارات الخاصة. الحل الأمثل لرمضان وللضيوف.',
    ingredientsAr: ['دقيق', 'لحم غنم مفروم', 'بصل', 'شبت', 'كزبرة', 'بهارات مشكلة', 'ملح'],
    nutrition: { calories: 90, protein: '6g', carbs: '10g', fats: '4g' },
    sellerId: 's3',
    categoryId: 'cat3'
  },

  // Seller 4: Healthy Flavors
  { 
    id: 'p6', 
    nameAr: 'سلطة الكينوا مع الدجاج', 
    descriptionAr: 'وجبة متكاملة صحية ومشبعة', 
    price: 38, 
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800', 
    rating: 4.5,
    longDescriptionAr: 'سلطة صحية منعشة تحتوي على الكينوا العضوية، صدور دجاج مشوية بالأعشاب، أفوكادو، طماطم كرزية، وخيار. تقدم مع صوص الليمون وزيت الزيتون.',
    ingredientsAr: ['كينوا', 'صدور دجاج', 'أفوكادو', 'خيار', 'طماطم كرزية', 'خس', 'زيت زيتون', 'ليمون'],
    nutrition: { calories: 320, protein: '28g', carbs: '22g', fats: '14g' },
    sellerId: 's4',
    categoryId: 'cat5'
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
        { id: 'd1', name: 'خالد السائق', email: 'driver@demo.com', phone: '0501234567', role: 'driver' },
        { id: 's1_owner', name: 'أم عبد الله', email: 'um_abdullah@demo.com', phone: '0507654321', role: 'seller' }
      ]);
    }
  }, []);

  // --- ACTIONS ---

  const triggerHaptic = (ms: number = 10) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(ms);
    }
  };

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
    triggerHaptic(10);
    setSelectedProduct(product);
  };

  const handleBottomNav = (view: AppView) => {
    triggerHaptic(8);
    setCurrentView(view);
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
         <BottomNav current={currentView} setView={handleBottomNav} cartCount={cart.length} />
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
                onClick={() => { triggerHaptic(8); setCurrentView('cart'); }}
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
                placeholder="ابحث عن أكلة منزلية، حلويات..." 
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
                     triggerHaptic(10);
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
              <h2 className="text-lg font-bold text-slate-800 mb-4">الأقسام</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {categories.map(cat => (
                  <div 
                    key={cat.id} 
                    onClick={() => triggerHaptic(5)}
                    className="flex-shrink-0 flex flex-col items-center gap-2 cursor-pointer group"
                  >
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl border border-slate-100 group-hover:border-amber-500 group-hover:shadow-md transition-all">
                      {cat.icon}
                    </div>
                    <span className="text-xs font-medium text-slate-700">{cat.nameAr}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Featured Sellers - Updated to Carousel */}
            <section>
              <div className="flex justify-between items-center mb-4">
                 <h2 className="text-lg font-bold text-slate-800">أسر منتجة مميزة</h2>
                 <a href="#" className="text-sm text-amber-600 font-medium">عرض الكل</a>
              </div>
              
              <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth scrollbar-hide -mx-4 px-4">
                {sellers.map((seller, index) => (
                  <div 
                    key={seller.id} 
                    onClick={() => triggerHaptic(8)}
                    className="flex-shrink-0 w-[85vw] sm:w-80 bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 snap-center group cursor-pointer"
                  >
                    <div className="relative h-44 w-full overflow-hidden">
                      <img 
                        src={seller.image} 
                        alt={seller.nameAr} 
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold text-slate-800 shadow-sm z-10">
                        <Clock className="w-3 h-3 text-amber-500" />
                        {seller.deliveryTime}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-slate-800 text-lg group-hover:text-amber-600 transition-colors">{seller.nameAr}</h3>
                        <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span className="text-xs font-bold text-amber-700">{seller.rating}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-xs text-slate-500">
                         <p>{seller.cuisine}</p>
                         <span className="text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded">موثوق</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Popular Items */}
            <section>
              <h2 className="text-lg font-bold text-slate-800 mb-4">أحدث الأطباق</h2>
              <div className="grid grid-cols-2 gap-4">
                {products.map(product => {
                  const seller = sellers.find(s => s.id === product.sellerId);
                  return (
                    <div 
                      key={product.id} 
                      onClick={() => navigateToProduct(product)}
                      className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 cursor-pointer active:scale-95 transition-transform"
                    >
                      <div className="relative mb-3">
                        <img src={product.image} alt={product.nameAr} className="w-full h-28 object-cover rounded-xl" />
                        <button className="absolute top-1 right-1 p-1.5 bg-white/80 rounded-full text-slate-400 hover:text-red-500 hover:bg-white transition-all">
                          <Heart className="w-4 h-4" />
                        </button>
                      </div>
                      <h3 className="font-bold text-sm text-slate-800 line-clamp-1">{product.nameAr}</h3>
                      <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                        <Store className="w-3 h-3" />
                        {seller?.nameAr || 'أسرة منتجة'}
                      </p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="font-bold text-amber-600 text-sm">{product.price} ر.س</span>
                        <button className="bg-slate-900 text-white w-6 h-6 rounded-lg flex items-center justify-center hover:bg-amber-500 transition-colors">
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
      </div>

      {/* Floating Action Button - Voice Assistant */}
      <button 
        onClick={() => { setIsVoiceModalOpen(true); triggerHaptic(15); }}
        className="fixed bottom-24 left-4 z-40 bg-gradient-to-tr from-amber-500 to-amber-400 text-white w-14 h-14 rounded-full shadow-xl shadow-amber-200 flex items-center justify-center hover:scale-110 transition-transform duration-200 group"
      >
        <div className="absolute inset-0 bg-white opacity-20 rounded-full animate-ping group-hover:animate-none"></div>
        <Mic className="w-6 h-6 relative z-10" />
      </button>

      {/* Bottom Navigation */}
      <BottomNav current={currentView} setView={handleBottomNav} cartCount={cart.length} />
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