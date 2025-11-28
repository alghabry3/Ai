
import React, { useState, useEffect } from 'react';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { ProductPage } from './components/ProductPage';
import { Auth } from './components/Auth';
import { Cart } from './components/Cart';
import { Profile } from './components/Profile';
import { AdminDashboard } from './components/AdminDashboard';
import { SellerPage } from './components/SellerPage';
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
  Store,
  FilterX,
  SlidersHorizontal
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
  {
    id: 's5',
    nameAr: 'مطبخ الشام',
    cuisine: 'ورق عنب ومحاشي',
    deliveryTime: '60 دقيقة',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1559381552-01994354c0e6?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 's6',
    nameAr: 'قهوة وحلا',
    cuisine: 'قهوة مختصة وحلى منزلي',
    deliveryTime: '20-30 دقيقة',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1599785209796-786432b228bc?auto=format&fit=crop&q=80&w=800'
  }
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
    longDescriptionAr: 'ورق عنب طازج ومحشي يدوياً بخلطة الأرز المصري والخضروات الورقية الطازجة، مطبوخ بدبس الرمان وزيت الزيتون البكر. طعم حامض وحلو موزون بعناية.',
    ingredientsAr: ['ورق عنب', 'أرز مصري', 'بقدونس', 'طماطم', 'دبس رمان', 'زيت زيتون', 'ليمون'],
    nutrition: { calories: 180, protein: '4g', carbs: '32g', fats: '6g' },
    sellerId: 's5',
    categoryId: 'cat1'
  },
  { 
    id: 'p3', 
    nameAr: 'تشيز كيك اللوتس', 
    descriptionAr: 'قطعة تشيز كيك غنية بطبقة لوتس مقرمشة', 
    price: 22, 
    image: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&q=80&w=800', 
    images: [
      'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1521305916504-4a1121188589?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.7,
    longDescriptionAr: 'تشيز كيك كريمي مخبوز على الطريقة الكلاسيكية مع قاعدة بسكويت، مغطى بطبقة سخية من زبدة اللوتس وبسكويت اللوتس المطحون. قوام ناعم وطعم لا يقاوم.',
    ingredientsAr: ['جبن كريمي', 'بسكويت', 'زبدة', 'كريمة خفق', 'زبدة لوتس', 'سكر', 'فانيليا'],
    nutrition: { calories: 420, protein: '6g', carbs: '45g', fats: '28g' },
    sellerId: 's2',
    categoryId: 'cat2'
  },
  // New Items for Productive Families
  {
    id: 'p4',
    nameAr: 'سمبوسة لحم (مفرزنة)',
    descriptionAr: 'علبة ٥٠ حبة، عجينة منزلية وحشوة لحم غنم',
    price: 85,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    longDescriptionAr: 'سمبوسة مجهزة للتفريز، مصنوعة من عجينة منزلية رقيقة ومقرمشة. الحشوة غنية بلحم الغنم الطازج مع البصل والبهارات الخاصة. جاهزة للقلي المباشر.',
    ingredientsAr: ['دقيق', 'لحم غنم مفروم', 'بصل', 'بقدونس', 'بهارات خاصة', 'ملح'],
    nutrition: { calories: 110, protein: '8g', carbs: '12g', fats: '5g' },
    sellerId: 's3',
    categoryId: 'cat3'
  },
  {
    id: 'p5',
    nameAr: 'كبسة دجاج (صحي)',
    descriptionAr: 'كبسة بصدر دجاج مشوي وأرز بني، قليلة الدهون',
    price: 38,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
    rating: 4.5,
    longDescriptionAr: 'نسخة صحية من الكبسة السعودية التقليدية. نستخدم الأرز البني الكامل وصدور الدجاج المشوية بدون جلد، مع تقليل كمية الدهون والملح. خيار مثالي للرياضيين ومتبعي الحميات.',
    ingredientsAr: ['أرز بني', 'صدر دجاج', 'جزر', 'فلفل رومي', 'بهارات كبسة', 'زيت زيتون (قليل)'],
    nutrition: { calories: 350, protein: '40g', carbs: '35g', fats: '8g' },
    sellerId: 's4',
    categoryId: 'cat5'
  },
  {
    id: 'p6',
    nameAr: 'كوكيز كلاسيك',
    descriptionAr: 'بوكس ١٢ حبة، محشو بقطع الشوكولاتة البلجيكية',
    price: 65,
    image: 'https://images.unsplash.com/photo-1599785209796-786432b228bc?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    longDescriptionAr: 'كوكيز طري وهش، مخبوز يومياً باستخدام الزبدة الفاخرة وقطع الشوكولاتة البلجيكية الحقيقية. يذوب في الفم مع كل قضمة.',
    ingredientsAr: ['دقيق', 'زبدة', 'شوكولاتة بلجيكية', 'سكر بني', 'بيض', 'فانيليا'],
    nutrition: { calories: 220, protein: '3g', carbs: '28g', fats: '12g' },
    sellerId: 's6',
    categoryId: 'cat2'
  }
];

export const App: React.FC = () => {
  // State for Navigation and Data
  const [activeView, setActiveView] = useState<'home' | 'product' | 'cart' | 'auth' | 'profile' | 'admin' | 'seller'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Filtering State
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(500);

  // App Data State (Lifted for Admin Control)
  const [users, setUsers] = useState<User[]>([]);
  const [sellers, setSellers] = useState<Seller[]>(INITIAL_SELLERS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);

  const triggerHaptic = (ms: number = 10) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(ms);
    }
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    // Optional: Show toast
    triggerHaptic(20);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleCheckout = () => {
    if (!user) {
      setActiveView('auth');
      return;
    }
    
    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      items: cart,
      total: cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) + 15, // +15 delivery
      status: 'pending',
      date: new Date().toISOString(),
      customerId: user.id
    };

    setOrders([newOrder, ...orders]);
    setCart([]);
    setActiveView('profile');
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    
    // Check if user exists in our "DB", if not add them
    if (!users.find(u => u.id === userData.id) && userData.id !== 'admin-master') {
        setUsers([...users, userData]);
    }

    if (userData.role === 'admin') {
        setActiveView('admin');
    } else {
        setActiveView('home');
    }
  };

  const navigateToProduct = (product: Product) => {
    triggerHaptic();
    setSelectedProduct(product);
    setActiveView('product');
  };

  const navigateToSeller = (seller: Seller) => {
    triggerHaptic();
    setSelectedSeller(seller);
    setActiveView('seller');
  };

  // Filter Logic
  const displayedProducts = products.filter(p => {
    const matchesCategory = selectedCategoryId ? p.categoryId === selectedCategoryId : true;
    const matchesSearch = p.nameAr.includes(searchTerm) || p.descriptionAr.includes(searchTerm);
    const matchesPrice = p.price >= minPrice && p.price <= maxPrice;
    return matchesCategory && matchesSearch && matchesPrice;
  });

  const featuredSellers = sellers.slice(0, 5);

  return (
    <>
      <div className="max-w-md mx-auto min-h-screen bg-slate-50 shadow-2xl overflow-hidden relative">
        
        {/* Render View based on activeView State */}
        
        {activeView === 'auth' && (
          <Auth 
             onLogin={handleLogin} 
             onRegister={(u) => { handleLogin(u); }} 
             onBack={() => setActiveView('home')} 
          />
        )}

        {activeView === 'admin' && user?.role === 'admin' && (
            <AdminDashboard 
                users={users} setUsers={setUsers}
                sellers={sellers} setSellers={setSellers}
                products={products} setProducts={setProducts}
                orders={orders}
                adminUser={user}
                onLogout={() => { setUser(null); setActiveView('auth'); }}
                onUpdateAdminPassword={(pass) => console.log('Update pass', pass)}
            />
        )}

        {activeView === 'cart' && (
          <Cart 
            items={cart} 
            onRemove={removeFromCart} 
            onCheckout={handleCheckout} 
            onBack={() => setActiveView('home')} 
            user={user}
            onLoginReq={() => setActiveView('auth')}
          />
        )}

        {activeView === 'profile' && user && (
          <Profile 
            user={user} 
            orders={orders} 
            onLogout={() => { setUser(null); setActiveView('home'); }} 
            onStatusUpdate={(orderId, status) => {
                setOrders(orders.map(o => o.id === orderId ? { ...o, status } : o));
            }}
          />
        )}

        {activeView === 'seller' && selectedSeller && (
            <SellerPage 
                seller={selectedSeller}
                products={products.filter(p => p.sellerId === selectedSeller.id)}
                onBack={() => setActiveView('home')}
                onProductClick={navigateToProduct}
                onAddToCart={(p) => addToCart(p, 1)}
            />
        )}

        {activeView === 'product' && selectedProduct && (
            <ProductPage 
              product={selectedProduct} 
              seller={sellers.find(s => s.id === selectedProduct.sellerId)}
              onBack={() => setActiveView('home')}
              onAddToCart={addToCart}
            />
        )}

        {activeView === 'home' && (
          <div className="pb-24 animate-in fade-in">
            {/* Header */}
            <header className="bg-white p-6 sticky top-0 z-10 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <span className="bg-amber-500 text-white p-1 rounded-lg">س</span>
                    سفرة
                  </h1>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3 h-3" />
                    <span>الرياض، السعودية</span>
                  </div>
                </div>
                <div className="flex gap-2">
                    {user ? (
                        <button onClick={() => setActiveView('profile')} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200">
                            <UserIcon className="w-5 h-5 text-slate-600" />
                        </button>
                    ) : (
                        <button onClick={() => setActiveView('auth')} className="px-4 py-2 bg-slate-900 text-white rounded-full text-xs font-bold hover:bg-slate-800">
                            دخول
                        </button>
                    )}
                    <button onClick={() => setActiveView('cart')} className="p-2 bg-slate-100 rounded-full relative hover:bg-slate-200">
                        <ShoppingBag className="w-5 h-5 text-slate-600" />
                        {cart.length > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                            {cart.length}
                        </span>
                        )}
                    </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute right-3 top-3 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="ابحث عن وجبتك المفضلة..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-10 text-right focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                  />
                </div>
                <button 
                  onClick={() => { setShowFilters(!showFilters); triggerHaptic(); }}
                  className={`p-3 rounded-xl border transition-colors ${showFilters ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-white border-slate-200 text-slate-500'}`}
                >
                  <SlidersHorizontal className="w-5 h-5" />
                </button>
              </div>

              {/* Advanced Filters Panel */}
              {showFilters && (
                <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100 animate-in slide-in-from-top-2">
                   <div className="flex justify-between items-center mb-3">
                      <h3 className="font-bold text-slate-700 text-sm">تصفية حسب السعر</h3>
                      <button onClick={() => { setMinPrice(0); setMaxPrice(500); setSelectedCategoryId(null); }} className="text-xs text-red-500 flex items-center gap-1">
                        <FilterX className="w-3 h-3" /> مسح الكل
                      </button>
                   </div>
                   <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span>{minPrice} ر.س</span>
                      <input 
                        type="range" 
                        min="0" 
                        max="500" 
                        value={maxPrice} 
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500" 
                      />
                      <span>{maxPrice} ر.س</span>
                   </div>
                </div>
              )}
            </header>

            {/* Hero Section */}
            {!searchTerm && !selectedCategoryId && (
                <div className="mt-4 px-6 mb-8">
                    <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl">
                        <div className="relative z-10">
                            <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-1 rounded mb-2 inline-block">عروض اليوم</span>
                            <h2 className="text-2xl font-bold mb-1">أطباق الأسر المنتجة</h2>
                            <p className="text-slate-300 text-sm mb-4">طعم البيت الأصيل يوصلك لباب بيتك</p>
                            <button className="bg-white text-slate-900 px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-100">تصفح العروض</button>
                        </div>
                        <img src="https://images.unsplash.com/photo-1547924475-f9e25c02c05e?auto=format&fit=crop&q=80&w=400" className="absolute top-0 left-0 w-48 h-full object-cover opacity-50 mask-image-gradient" />
                    </div>
                </div>
            )}

            {/* Categories */}
            <div className="px-6 mb-8">
              <h2 className="text-lg font-bold text-slate-800 mb-4">التصنيفات</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {categories.map(cat => (
                  <button 
                    key={cat.id} 
                    onClick={() => {
                        setSelectedCategoryId(selectedCategoryId === cat.id ? null : cat.id);
                        triggerHaptic();
                    }}
                    className={`flex flex-col items-center gap-2 min-w-[80px] p-2 rounded-2xl transition-all ${
                        selectedCategoryId === cat.id 
                        ? 'bg-amber-100 scale-105 border-2 border-amber-200' 
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl border border-slate-100">
                      {cat.icon}
                    </div>
                    <span className={`text-xs font-medium ${selectedCategoryId === cat.id ? 'text-amber-700 font-bold' : 'text-slate-600'}`}>{cat.nameAr}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Sellers (Horizontal Carousel) */}
            {!selectedCategoryId && !searchTerm && (
                <div className="mb-8">
                    <div className="px-6 mb-4 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-800">أسر منتجة مميزة</h2>
                        <button className="text-amber-600 text-sm font-bold">عرض الكل</button>
                    </div>
                    <div className="flex overflow-x-auto gap-4 px-6 pb-4 snap-x snap-mandatory scrollbar-hide">
                        {featuredSellers.map(seller => (
                            <div 
                                key={seller.id} 
                                onClick={() => navigateToSeller(seller)}
                                className="min-w-[280px] snap-center bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden cursor-pointer active:scale-95 transition-transform group"
                            >
                                <div className="h-32 relative overflow-hidden">
                                    <img 
                                        src={seller.image} 
                                        alt={seller.nameAr} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                        loading="lazy"
                                    />
                                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-sm">
                                        <Clock className="w-3 h-3 text-amber-500" />
                                        {seller.deliveryTime}
                                    </div>
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-slate-800 text-lg">{seller.nameAr}</h3>
                                        <div className="flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded text-amber-700 font-bold text-xs">
                                            <span>{seller.rating}</span>
                                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 mb-3">{seller.cuisine}</p>
                                    <div className="flex gap-2">
                                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded-full">توصيل مجاني</span>
                                        <span className="text-[10px] bg-red-50 text-red-600 px-2 py-1 rounded-full">خصم 20%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Popular Items */}
            <div className="px-6">
              <h2 className="text-lg font-bold text-slate-800 mb-4">
                  {selectedCategoryId 
                    ? `نتائج التصنيف (${displayedProducts.length})` 
                    : (searchTerm ? `نتائج البحث (${displayedProducts.length})` : 'الأكثر طلباً')
                  }
              </h2>
              
              {displayedProducts.length === 0 ? (
                  <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-200">
                      <p className="text-slate-500">لا توجد منتجات مطابقة للبحث</p>
                      <button onClick={() => {setSearchTerm(''); setMinPrice(0); setMaxPrice(500); setSelectedCategoryId(null);}} className="text-amber-600 text-sm font-bold mt-2 hover:underline">إزالة الفلاتر</button>
                  </div>
              ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {displayedProducts.map(product => {
                      const seller = sellers.find(s => s.id === product.sellerId);
                      return (
                        <div 
                          key={product.id} 
                          onClick={() => navigateToProduct(product)}
                          className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 cursor-pointer active:scale-95 transition-transform"
                        >
                          <div className="relative mb-3">
                            <img src={product.image} alt={product.nameAr} className="w-full h-32 rounded-xl object-cover bg-slate-200" />
                            <button className="absolute top-2 left-2 p-1.5 bg-white/80 backdrop-blur rounded-full text-slate-400 hover:text-red-500 transition-colors">
                              <Heart className="w-4 h-4" />
                            </button>
                            {seller && (
                                <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur px-2 py-0.5 rounded text-[10px] text-white flex items-center gap-1">
                                    <span className="font-bold">{seller.nameAr}</span>
                                </div>
                            )}
                          </div>
                          <h3 className="font-bold text-slate-800 text-sm mb-1 truncate">{product.nameAr}</h3>
                          <div className="flex justify-between items-center">
                            <span className="text-amber-600 font-bold text-sm">{product.price} ر.س</span>
                            <div className="flex items-center gap-1 text-[10px] text-slate-400">
                              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                              <span>{product.rating}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
              )}
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        {activeView === 'home' && (
            <>
                <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 flex justify-between items-center z-20 max-w-md mx-auto">
                <button onClick={() => { setActiveView('home'); triggerHaptic(); }} className="flex flex-col items-center gap-1 text-slate-800">
                    <Home className="w-6 h-6" />
                    <span className="text-[10px] font-bold">الرئيسية</span>
                </button>
                <button onClick={() => triggerHaptic()} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600">
                    <Heart className="w-6 h-6" />
                    <span className="text-[10px] font-medium">المفضلة</span>
                </button>
                
                {/* Voice Assistant FAB */}
                <div className="relative -top-6">
                    <button 
                    onClick={() => { setIsVoiceModalOpen(true); triggerHaptic(20); }}
                    className="w-14 h-14 bg-gradient-to-tr from-amber-500 to-amber-400 rounded-full flex items-center justify-center text-white shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-transform"
                    >
                    <Mic className="w-7 h-7" />
                    </button>
                </div>

                <button onClick={() => triggerHaptic()} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600">
                    <Clock className="w-6 h-6" />
                    <span className="text-[10px] font-medium">طلباتي</span>
                </button>
                <button onClick={() => { setActiveView('profile'); triggerHaptic(); }} className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600">
                    <UserIcon className="w-6 h-6" />
                    <span className="text-[10px] font-medium">حسابي</span>
                </button>
                </nav>

                <VoiceAssistantModal 
                isOpen={isVoiceModalOpen} 
                onClose={() => setIsVoiceModalOpen(false)} 
                />
            </>
        )}
      </div>
    </>
  );
};
