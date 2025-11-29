
import React, { useState, useEffect } from 'react';
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
  Store,
  FilterX,
  SlidersHorizontal,
  ArrowRight,
  Bell,
  ChevronDown,
  Bike,
  Percent,
  Flame,
  Plus
} from 'lucide-react';
import { Product, Category, Seller, User, CartItem, Order, UserRole, Transaction } from './types';

// --- MOCK INITIAL DATA (PRODUCTIVE FAMILIES THEME) ---

const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat1', nameAr: 'شعبيات', icon: '🥘' },
  { id: 'cat2', nameAr: 'حلى وقهوة', icon: '🧁' },
  { id: 'cat3', nameAr: 'مفرزنات', icon: '❄️' },
  { id: 'cat4', nameAr: 'محاشي', icon: '🍇' },
  { id: 'cat5', nameAr: 'صحي', icon: '🥗' },
  { id: 'cat6', nameAr: 'مخبوزات', icon: '🥐' },
];

const PROMO_BANNERS = [
    {
        id: 1,
        title: 'عروض الغداء!',
        subtitle: 'خصم ٥٠٪ على أول طلب لك',
        color: 'from-orange-500 to-amber-600',
        image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&q=80&w=800' // Arabic Feast
    },
    {
        id: 2,
        title: 'توصيل مجاني',
        subtitle: 'على جميع طلبات الأسر المنتجة',
        color: 'from-emerald-600 to-teal-500',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800' // Shopping/Food
    }
];

const INITIAL_SELLERS: Seller[] = [
  { 
    id: 's1', 
    nameAr: 'مطبخ أم عبد الله', 
    cuisine: 'أكلات سعودية • جريش • قرصان', 
    deliveryTime: '45 - 55 دقيقة', 
    rating: 4.9, 
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800', // Saudi Rice/Jareesh style
    phone: '0501234567',
    email: 'um.abdullah@example.com',
    address: 'الرياض، حي الملقا، شارع الأبراج'
  },
  { 
    id: 's2', 
    nameAr: 'حلويات شهد المنزلية', 
    cuisine: 'كيك • تشيز كيك • حلى قهوة', 
    deliveryTime: '30 - 45 دقيقة', 
    rating: 4.7, 
    image: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?auto=format&fit=crop&q=80&w=800', // Cake
    phone: '0559876543',
    address: 'الرياض، حي الصحافة' 
  },
  { 
    id: 's3', 
    nameAr: 'تجهيزات أم ريان', 
    cuisine: 'مفرزنات رمضان • سمبوسة', 
    deliveryTime: 'يوم عمل', 
    rating: 4.8, 
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=800', // Samosa/Fried
    phone: '0543210987'
  },
  { 
    id: 's4', 
    nameAr: 'نكهات صحية (دايت)', 
    cuisine: 'كيتو • لو كارب • سلطات', 
    deliveryTime: '30 - 40 دقيقة', 
    rating: 4.6, 
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800', // Healthy Salad
    email: 'info@healthyflavors.sa',
    address: 'الرياض، حي الياسمين'
  },
  {
    id: 's5',
    nameAr: 'مطبخ الشام',
    cuisine: 'ورق عنب • ملفوف • كبة',
    deliveryTime: '60 دقيقة',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1544681280-d3dc351a94ce?auto=format&fit=crop&q=80&w=800', // Middle Eastern Table
    phone: '0567890123'
  },
  {
    id: 's6',
    nameAr: 'قهوة وحلا',
    cuisine: 'قهوة مختصة • كوكيز • تارت',
    deliveryTime: '20 - 30 دقيقة',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800', // Coffee & Cookies
    address: 'الرياض، البوليڤارد'
  }
];

const INITIAL_PRODUCTS: Product[] = [
  // Seller 1: Um Abdullah (Saudi/Jareesh)
  { 
    id: 'p1', 
    nameAr: 'جريش أحمر باللحم', 
    descriptionAr: 'جريش نجد الأصلي باللحم البلدي والمسمنة', 
    price: 45, 
    image: 'https://images.unsplash.com/photo-1542528180-a1208c5169a5?auto=format&fit=crop&q=80&w=800', // Porridge/Jareesh style
    images: [
      'https://images.unsplash.com/photo-1542528180-a1208c5169a5?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1626804475297-411d8c669143?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.9,
    longDescriptionAr: 'وجبة الجريش النجدي الأحمر الفاخر، مطبوخ بعناية فائقة لمدة ٦ ساعات مع اللحم النعيمي الطازج. يقدم مع "المسمنة" الخاصة المكونة من البصل والليمون الأسود والبهارات النجدية. وجبة تكفي شخصين.',
    ingredientsAr: ['قمح مجروش فاخر', 'لحم نعيمي طازج', 'لبن طازج', 'بصل', 'طماطم', 'بهارات مشكلة', 'سمن بري', 'ليمون أسود'],
    nutrition: { calories: 650, protein: '35g', carbs: '80g', fats: '25g' },
    sellerId: 's1',
    categoryId: 'cat1'
  },
  // Seller 5: Sham (Vine Leaves)
  { 
    id: 'p2', 
    nameAr: 'ورق عنب بدبس الرمان', 
    descriptionAr: 'بوكس ٢٠ حبة، حشوة الرز المصري والخضار', 
    price: 35, 
    image: 'https://images.unsplash.com/photo-1606419266184-722122d64098?auto=format&fit=crop&q=80&w=800', // Dolma/Vine Leaves
    images: [
      'https://images.unsplash.com/photo-1606419266184-722122d64098?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1559381552-01994354c0e6?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.8,
    longDescriptionAr: 'ورق عنب طازج ومحشي يدوياً بخلطة الأرز المصري والخضروات الورقية الطازجة، مطبوخ بدبس الرمان وزيت الزيتون البكر. طعم حامض وحلو موزون بعناية.',
    ingredientsAr: ['ورق عنب', 'أرز مصري', 'بقدونس', 'طماطم', 'دبس رمان', 'زيت زيتون', 'ليمون'],
    nutrition: { calories: 180, protein: '4g', carbs: '32g', fats: '6g' },
    sellerId: 's5',
    categoryId: 'cat4'
  },
  // Seller 2: Shahd (Cheesecake)
  { 
    id: 'p3', 
    nameAr: 'تشيز كيك اللوتس', 
    descriptionAr: 'قطعة تشيز كيك غنية بطبقة لوتس مقرمشة', 
    price: 22, 
    image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=80&w=800', // Cheesecake
    images: [
      'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1521305916504-4a1121188589?auto=format&fit=crop&q=80&w=800'
    ],
    rating: 4.7,
    longDescriptionAr: 'تشيز كيك كريمي مخبوز على الطريقة الكلاسيكية مع قاعدة بسكويت، مغطى بطبقة سخية من زبدة اللوتس وبسكويت اللوتس المطحون. قوام ناعم وطعم لا يقاوم.',
    ingredientsAr: ['جبن كريمي', 'بسكويت', 'زبدة', 'كريمة خفق', 'زبدة لوتس', 'سكر', 'فانيليا'],
    nutrition: { calories: 420, protein: '6g', carbs: '45g', fats: '28g' },
    sellerId: 's2',
    categoryId: 'cat2'
  },
  // Seller 3: Umm Rayan (Samosa)
  {
    id: 'p4',
    nameAr: 'سمبوسة لحم (مفرزنة)', 
    descriptionAr: 'علبة ٥٠ حبة، عجينة منزلية وحشوة لحم غنم',
    price: 85,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800', // Samosa
    rating: 4.9,
    longDescriptionAr: 'سمبوسة مجهزة للتفريز، مصنوعة من عجينة منزلية رقيقة ومقرمشة. الحشوة غنية بلحم الغنم الطازج مع البصل والبهارات الخاصة. جاهزة للقلي المباشر.',
    ingredientsAr: ['دقيق', 'لحم غنم مفروم', 'بصل', 'بقدونس', 'بهارات خاصة', 'ملح'],
    nutrition: { calories: 110, protein: '8g', carbs: '12g', fats: '5g' },
    sellerId: 's3',
    categoryId: 'cat3'
  },
  // Seller 4: Healthy (Kabsa)
  {
    id: 'p5',
    nameAr: 'كبسة دجاج (صحي)',
    descriptionAr: 'كبسة بصدر دجاج مشوي وأرز بني، قليلة الدهون',
    price: 38,
    image: 'https://images.unsplash.com/photo-1505253758473-96b701d36dec?auto=format&fit=crop&q=80&w=800', // Chicken Rice Bowl
    rating: 4.5,
    longDescriptionAr: 'نسخة صحية من الكبسة السعودية التقليدية. نستخدم الأرز البني الكامل وصدور الدجاج المشوية بدون جلد، مع تقليل كمية الدهون والملح. خيار مثالي للرياضيين ومتبعي الحميات.',
    ingredientsAr: ['أرز بني', 'صدر دجاج', 'جزر', 'فلفل رومي', 'بهارات كبسة', 'زيت زيتون (قليل)'],
    nutrition: { calories: 350, protein: '40g', carbs: '35g', fats: '8g' },
    sellerId: 's4',
    categoryId: 'cat5'
  },
  // Seller 6: Cookies
  {
    id: 'p6',
    nameAr: 'كوكيز كلاسيك',
    descriptionAr: 'بوكس ١٢ حبة، محشو بقطع الشوكولاتة البلجيكية',
    price: 65,
    image: 'https://images.unsplash.com/photo-1499636138143-bd63e731880e?auto=format&fit=crop&q=80&w=800', // Chocolate Chip Cookies
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
  const [activeView, setActiveView] = useState<'home' | 'product' | 'cart' | 'auth' | 'profile' | 'admin' | 'seller' | 'favorites'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Financial State (Admin)
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [commissionRate, setCommissionRate] = useState<number>(15); // 15% default
  const [deliveryFee, setDeliveryFee] = useState<number>(15); // 15 SAR default

  // Favorites State
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [favoriteSellers, setFavoriteSellers] = useState<Set<string>>(new Set());

  // Filtering State
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'fast' | 'offers' | 'rated'>('all');
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

  const toggleFavorite = (productId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    triggerHaptic();
    setFavorites(prev => {
        const next = new Set(prev);
        if (next.has(productId)) next.delete(productId);
        else next.add(productId);
        return next;
    });
  };

  const toggleFavoriteSeller = (sellerId: string) => {
    triggerHaptic();
    setFavoriteSellers(prev => {
        const next = new Set(prev);
        if (next.has(sellerId)) next.delete(sellerId);
        else next.add(sellerId);
        return next;
    });
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
    
    const orderTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) + deliveryFee;

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      items: cart,
      total: orderTotal,
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

  // Safe Navigation with Auth Check
  const navigateToProfile = () => {
      triggerHaptic();
      if (user) {
          setActiveView('profile');
      } else {
          setActiveView('auth');
      }
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  // Image Fallback Handler
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800"; // Generic food fallback
  };

  // Filter Logic
  const displayedProducts = products.filter(p => {
    const matchesCategory = selectedCategoryId ? p.categoryId === selectedCategoryId : true;
    const matchesSearch = p.nameAr.includes(searchTerm) || p.descriptionAr.includes(searchTerm);
    const matchesPrice = p.price >= minPrice && p.price <= maxPrice;
    
    // Quick Filters
    let matchesQuickFilter = true;
    if (activeFilter === 'rated') matchesQuickFilter = p.rating >= 4.8;
    // Assuming 'offers' and 'fast' would need real data, using placeholders
    
    return matchesCategory && matchesSearch && matchesPrice && matchesQuickFilter;
  });

  const featuredSellers = sellers.slice(0, 5);

  return (
    <>
      <div className="min-h-screen bg-slate-50 shadow-sm overflow-x-hidden relative font-sans text-slate-900">
        
        {activeView === 'auth' && (
          <div className="max-w-md mx-auto min-h-screen bg-white shadow-2xl md:my-8 md:min-h-0 md:rounded-3xl md:overflow-hidden">
             <Auth 
               onLogin={handleLogin} 
               onRegister={(u) => { handleLogin(u); }} 
               onBack={() => setActiveView('home')} 
             />
          </div>
        )}

        {activeView === 'admin' && user?.role === 'admin' && (
            <AdminDashboard 
                users={users} setUsers={setUsers}
                sellers={sellers} setSellers={setSellers}
                products={products} setProducts={setProducts}
                orders={orders}
                transactions={transactions}
                onAddTransaction={(t) => setTransactions([t, ...transactions])}
                commissionRate={commissionRate} setCommissionRate={setCommissionRate}
                deliveryFee={deliveryFee} setDeliveryFee={setDeliveryFee}
                adminUser={user}
                onLogout={() => { setUser(null); setActiveView('auth'); }}
                onUpdateAdminPassword={(pass) => console.log('Update pass', pass)}
                onUpdateOrderStatus={handleUpdateOrderStatus}
            />
        )}

        {activeView === 'cart' && (
          <div className="max-w-2xl mx-auto bg-white min-h-screen md:min-h-0 md:my-8 md:rounded-3xl shadow-xl overflow-hidden">
             <Cart 
               items={cart} 
               onRemove={removeFromCart} 
               onCheckout={handleCheckout} 
               onBack={() => setActiveView('home')} 
               user={user}
               onLoginReq={() => setActiveView('auth')}
             />
          </div>
        )}

        {activeView === 'profile' && user && (
          <div className="max-w-3xl mx-auto bg-white min-h-screen md:min-h-0 md:my-8 md:rounded-3xl shadow-xl overflow-hidden">
             <Profile 
               user={user} 
               orders={orders} 
               onLogout={() => { setUser(null); setActiveView('home'); }} 
               onStatusUpdate={handleUpdateOrderStatus}
             />
          </div>
        )}

        {activeView === 'seller' && selectedSeller && (
            <SellerPage 
                seller={selectedSeller}
                products={products.filter(p => p.sellerId === selectedSeller.id)}
                onBack={() => setActiveView('home')}
                onProductClick={navigateToProduct}
                onAddToCart={(p) => addToCart(p, 1)}
                isFavorite={favoriteSellers.has(selectedSeller.id)}
                onToggleFavorite={() => toggleFavoriteSeller(selectedSeller.id)}
            />
        )}

        {activeView === 'product' && selectedProduct && (
            <ProductPage 
              product={selectedProduct} 
              seller={sellers.find(s => s.id === selectedProduct.sellerId)}
              onBack={() => setActiveView('home')}
              onAddToCart={addToCart}
              isFavorite={favorites.has(selectedProduct.id)}
              onToggleFavorite={() => toggleFavorite(selectedProduct.id)}
            />
        )}

        {/* Favorites View */}
        {activeView === 'favorites' && (
            <div className="min-h-screen bg-slate-50 pb-24">
                <header className="bg-white p-4 shadow-sm sticky top-0 z-10 flex items-center gap-4">
                    <button onClick={() => setActiveView('home')} className="p-2 bg-slate-100 rounded-full">
                        <ArrowRight className="w-5 h-5 text-slate-600" />
                    </button>
                    <h1 className="text-xl font-bold text-slate-800">المفضلة</h1>
                </header>
                <div className="p-4 max-w-7xl mx-auto">
                    {favorites.size === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Heart className="w-8 h-8 text-red-200" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-700">لا توجد منتجات مفضلة</h2>
                            <p className="text-slate-500 mt-1">اضغط على رمز القلب لإضافة منتجات هنا</p>
                            <button onClick={() => setActiveView('home')} className="mt-4 text-amber-600 font-bold hover:underline">تصفح المنتجات</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {products.filter(p => favorites.has(p.id)).map(product => {
                                const seller = sellers.find(s => s.id === product.sellerId);
                                return (
                                    <div 
                                        key={product.id} 
                                        onClick={() => navigateToProduct(product)}
                                        className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 cursor-pointer active:scale-95 transition-all"
                                    >
                                        <div className="relative mb-3">
                                            <img 
                                              src={product.image} 
                                              alt={product.nameAr} 
                                              className="w-full h-32 md:h-48 rounded-xl object-cover bg-slate-200"
                                              onError={handleImageError} 
                                            />
                                            <button 
                                                onClick={(e) => toggleFavorite(product.id, e)}
                                                className="absolute top-2 left-2 p-1.5 bg-white/80 backdrop-blur rounded-full text-red-500 hover:bg-white"
                                            >
                                                <Heart className="w-4 h-4 fill-red-500" />
                                            </button>
                                        </div>
                                        <h3 className="font-bold text-slate-800 text-sm mb-1 truncate">{product.nameAr}</h3>
                                        <div className="flex justify-between items-center">
                                            <span className="text-amber-600 font-bold text-sm">{product.price} ر.س</span>
                                            {seller && <span className="text-[10px] text-slate-500">{seller.nameAr}</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        )}

        {activeView === 'home' && (
          <div className="pb-24 animate-in fade-in">
            {/* --- Professional Header (Top Sticky) --- */}
            <header className="bg-white pt-4 pb-2 sticky top-0 z-30 shadow-sm border-b border-slate-50">
              <div className="max-w-7xl mx-auto px-4 md:px-6">
                
                {/* Location & User Actions */}
                <div className="flex justify-between items-center mb-4">
                  
                  {/* Location Selector (Center/Left Styled) */}
                  <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                        <MapPin className="w-5 h-5 fill-amber-500/20" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-bold">التوصيل إلى</span>
                        <div className="flex items-center gap-1 text-slate-800 font-bold text-sm">
                            <span>المنزل، الرياض</span>
                            <ChevronDown className="w-4 h-4 text-amber-500" />
                        </div>
                    </div>
                  </div>

                  {/* Desktop Nav Links */}
                  <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
                      <button onClick={() => { setActiveView('home'); triggerHaptic(); }} className={`transition-colors ${activeView === 'home' ? 'text-amber-600 font-bold' : 'hover:text-amber-600'}`}>الرئيسية</button>
                      <button onClick={navigateToProfile} className="hover:text-amber-600 transition-colors">طلباتي</button>
                      <button onClick={() => { setActiveView('favorites'); triggerHaptic(); }} className="hover:text-amber-600 transition-colors">المفضلة</button>
                  </nav>

                  {/* Actions (Notif, Cart, Profile) */}
                  <div className="flex items-center gap-3">
                      <button className="p-2.5 rounded-full hover:bg-slate-100 text-slate-600 relative transition-colors">
                          <Bell className="w-6 h-6" />
                          <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                      </button>
                      <button onClick={() => setActiveView('cart')} className="p-2.5 rounded-full hover:bg-slate-100 text-slate-600 relative transition-colors">
                          <ShoppingBag className="w-6 h-6" />
                          {cart.length > 0 && (
                          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-amber-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold shadow-sm">
                              {cart.length}
                          </span>
                          )}
                      </button>
                  </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="flex gap-3 pb-2">
                  <div className="relative flex-1 group">
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="ابحث عن مطعم أو وجبة..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-slate-100/80 border-none rounded-2xl py-3.5 px-12 text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-amber-500/20 focus:shadow-md transition-all shadow-inner"
                    />
                  </div>
                  <button 
                    onClick={() => { setShowFilters(!showFilters); triggerHaptic(); }}
                    className={`p-3.5 rounded-2xl border transition-all shadow-sm ${showFilters ? 'bg-amber-500 text-white border-amber-600 shadow-amber-500/30' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                  >
                    <SlidersHorizontal className="w-5 h-5" />
                  </button>
                </div>

                {/* Filter Chips (Scrollable) */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide pt-2">
                    {[
                        { id: 'all', label: 'الكل', icon: null },
                        { id: 'fast', label: 'توصيل سريع', icon: <Bike className="w-3 h-3"/> },
                        { id: 'offers', label: 'عروض حصرية', icon: <Percent className="w-3 h-3"/> },
                        { id: 'rated', label: 'الأعلى تقييماً', icon: <Star className="w-3 h-3"/> },
                    ].map(f => (
                        <button
                            key={f.id}
                            onClick={() => setActiveFilter(f.id as any)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                                activeFilter === f.id 
                                ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20' 
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            {f.icon}
                            {f.label}
                        </button>
                    ))}
                </div>

              </div>
            </header>

            <main className="max-w-7xl mx-auto pt-6 px-4 md:px-6 space-y-8">
              
              {/* Promo Carousel (Hero) */}
              {!searchTerm && !selectedCategoryId && (
                  <div className="relative overflow-hidden rounded-3xl h-48 md:h-[350px] shadow-lg group">
                      <div className="flex h-full transition-transform duration-500 ease-out" style={{ transform: `translateX(0%)` }}> 
                         {/* Simplified single slide for demo, ideally map PROMO_BANNERS */}
                         <div className="min-w-full h-full relative">
                             <img 
                               src={PROMO_BANNERS[0].image} 
                               className="absolute inset-0 w-full h-full object-cover" 
                               alt="promo" 
                               onError={handleImageError}
                             />
                             <div className={`absolute inset-0 bg-gradient-to-r ${PROMO_BANNERS[0].color} opacity-80 mix-blend-multiply`}></div>
                             <div className="absolute inset-0 p-8 flex flex-col justify-center items-start text-white">
                                 <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-bold mb-3 border border-white/10">عرض خاص</span>
                                 <h2 className="text-3xl md:text-5xl font-bold mb-2">{PROMO_BANNERS[0].title}</h2>
                                 <p className="text-lg opacity-90 mb-6">{PROMO_BANNERS[0].subtitle}</p>
                                 <button className="bg-white text-amber-600 px-6 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-transform shadow-xl">
                                     اطلب الآن
                                 </button>
                             </div>
                         </div>
                      </div>
                  </div>
              )}

              {/* Categories Circles */}
              <div>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-slate-800">ماذا تشتهي اليوم؟</h2>
                </div>
                <div className="flex gap-4 md:gap-8 overflow-x-auto pb-4 scrollbar-hide snap-x">
                  {categories.map(cat => (
                    <button 
                      key={cat.id} 
                      onClick={() => {
                          setSelectedCategoryId(selectedCategoryId === cat.id ? null : cat.id);
                          triggerHaptic();
                      }}
                      className="flex flex-col items-center gap-2 min-w-[72px] snap-start group"
                    >
                      <div className={`w-18 h-18 md:w-20 md:h-20 rounded-2xl md:rounded-full flex items-center justify-center text-3xl transition-all duration-300 shadow-sm ${
                        selectedCategoryId === cat.id 
                        ? 'bg-amber-500 text-white shadow-amber-500/40 scale-110' 
                        : 'bg-white text-slate-700 hover:bg-amber-50'
                      }`}>
                        {cat.icon}
                      </div>
                      <span className={`text-xs font-bold transition-colors ${selectedCategoryId === cat.id ? 'text-amber-600' : 'text-slate-600 group-hover:text-slate-800'}`}>
                          {cat.nameAr}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Featured Sellers (Pro Cards) */}
              {!selectedCategoryId && !searchTerm && (
                  <div>
                      <div className="flex justify-between items-center mb-4">
                          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                              أسر منتجة مميزة
                          </h2>
                          <button className="text-amber-600 text-sm font-bold hover:underline">عرض الكل</button>
                      </div>
                      
                      <div className="flex overflow-x-auto gap-4 pb-8 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                          {featuredSellers.map(seller => (
                              <div 
                                  key={seller.id} 
                                  onClick={() => navigateToSeller(seller)}
                                  className="min-w-[280px] md:min-w-[340px] snap-center bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                              >
                                  {/* Card Header Image */}
                                  <div className="h-40 relative">
                                      <img 
                                          src={seller.image} 
                                          alt={seller.nameAr} 
                                          className="w-full h-full object-cover" 
                                          loading="lazy"
                                          onError={handleImageError}
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                                      
                                      {/* Floating Delivery Badge */}
                                      <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-sm text-slate-800">
                                          <Clock className="w-3 h-3 text-emerald-500" />
                                          {seller.deliveryTime}
                                      </div>
                                      
                                      {/* Favorite Button */}
                                      <button className="absolute top-3 left-3 p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-red-500 transition-colors">
                                          <Heart className="w-4 h-4" />
                                      </button>
                                  </div>

                                  {/* Card Body */}
                                  <div className="p-4 relative">
                                      {/* Seller Logo Floating */}
                                      <div className="absolute -top-8 right-4 w-14 h-14 bg-white rounded-xl shadow-lg flex items-center justify-center p-1 border-2 border-white">
                                          <img 
                                            src={seller.image} 
                                            className="w-full h-full object-cover rounded-lg" 
                                            alt="logo" 
                                            onError={handleImageError}
                                          />
                                      </div>

                                      <div className="mt-4">
                                          <h3 className="font-bold text-slate-900 text-lg mb-0.5">{seller.nameAr}</h3>
                                          <p className="text-xs text-slate-500 mb-3">{seller.cuisine}</p>
                                          
                                          <div className="flex items-center gap-3 text-xs border-t border-slate-50 pt-3">
                                              <div className="flex items-center gap-1 text-slate-700 font-bold">
                                                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                                  {seller.rating}
                                              </div>
                                              <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                                              <div className="flex items-center gap-1 text-slate-500">
                                                  <Bike className="w-3.5 h-3.5" />
                                                  <span>١٥ ر.س</span>
                                              </div>
                                              <div className="ml-auto bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md font-bold text-[10px]">
                                                  أسر منتجة
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              )}

              {/* Recommended Products (Grid) */}
              <div className="pb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-slate-800">
                        {selectedCategoryId 
                        ? `نتائج التصنيف (${displayedProducts.length})` 
                        : (searchTerm ? `نتائج البحث (${displayedProducts.length})` : 'مقترحة لك')
                        }
                    </h2>
                </div>
                
                {displayedProducts.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
                        <ShoppingBag className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                        <p className="text-slate-500">لا توجد منتجات مطابقة للبحث</p>
                        <button onClick={() => {setSearchTerm(''); setMinPrice(0); setMaxPrice(500); setSelectedCategoryId(null);}} className="text-amber-600 text-sm font-bold mt-2 hover:underline">إزالة الفلاتر</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                      {displayedProducts.map(product => {
                        const seller = sellers.find(s => s.id === product.sellerId);
                        const isFav = favorites.has(product.id);
                        return (
                          <div 
                            key={product.id} 
                            onClick={() => navigateToProduct(product)}
                            className="bg-white p-3 rounded-[1.5rem] shadow-sm border border-slate-100 cursor-pointer active:scale-[0.98] hover:shadow-lg transition-all duration-300 group flex sm:block gap-4 items-center sm:items-stretch h-32 sm:h-auto"
                          >
                            {/* Product Image */}
                            <div className="relative w-28 h-28 sm:w-full sm:h-44 flex-shrink-0">
                              <img 
                                src={product.image} 
                                alt={product.nameAr} 
                                className="w-full h-full rounded-2xl object-cover bg-slate-200" 
                                loading="lazy"
                                onError={handleImageError} 
                              />
                              <button 
                                onClick={(e) => toggleFavorite(product.id, e)}
                                className={`absolute top-2 left-2 p-1.5 backdrop-blur rounded-full transition-colors hidden sm:block ${isFav ? 'bg-red-50 text-red-500' : 'bg-white/60 text-slate-600 hover:text-red-500 hover:text-red-500 hover:bg-white'}`}
                              >
                                <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500' : ''}`} />
                              </button>
                              {seller && (
                                  <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded-lg text-[10px] text-slate-800 shadow-sm hidden sm:flex items-center gap-1 font-bold">
                                      {seller.nameAr}
                                  </div>
                              )}
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 sm:mt-3 flex flex-col justify-between h-full sm:h-auto py-1 sm:py-0">
                                <div>
                                    <h3 className="font-bold text-slate-800 text-sm md:text-base mb-1 line-clamp-1 group-hover:text-amber-600 transition-colors">{product.nameAr}</h3>
                                    <p className="text-xs text-slate-500 line-clamp-2 mb-2 hidden sm:block">{product.descriptionAr}</p>
                                    {/* Mobile View Desc */}
                                    <p className="text-[10px] text-slate-400 line-clamp-1 mb-1 sm:hidden">{product.descriptionAr}</p>
                                </div>
                                
                                <div className="flex justify-between items-center mt-auto">
                                    <span className="text-slate-900 font-bold text-sm md:text-base">{product.price} <span className="text-[10px] text-slate-500 font-normal">ر.س</span></span>
                                    
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                                        className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-amber-500 hover:text-white transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                )}
              </div>
            </main>
          </div>
        )}

        {/* Bottom Navigation (Mobile Only) */}
        {activeView === 'home' || activeView === 'favorites' || activeView === 'profile' ? (
             <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 flex justify-between items-center z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-5">
             <button onClick={() => { setActiveView('home'); triggerHaptic(); }} className={`flex flex-col items-center gap-1 transition-all ${activeView === 'home' ? 'text-amber-600 -translate-y-1' : 'text-slate-400'}`}>
                 <Home className={`w-6 h-6 ${activeView === 'home' ? 'fill-amber-100' : ''}`} />
                 <span className={`text-[10px] font-bold ${activeView === 'home' ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>الرئيسية</span>
             </button>
             <button onClick={() => { setActiveView('favorites'); triggerHaptic(); }} className={`flex flex-col items-center gap-1 transition-all ${activeView === 'favorites' ? 'text-amber-600 -translate-y-1' : 'text-slate-400 hover:text-slate-600'}`}>
                 <Heart className={`w-6 h-6 ${activeView === 'favorites' ? 'fill-amber-100' : ''}`} />
                 <span className={`text-[10px] font-bold ${activeView === 'favorites' ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>المفضلة</span>
             </button>
             
             <button onClick={navigateToProfile} className={`flex flex-col items-center gap-1 transition-all ${activeView === 'profile' ? 'text-amber-600 -translate-y-1' : 'text-slate-400 hover:text-slate-600'}`}>
                 <Clock className={`w-6 h-6 ${activeView === 'profile' ? 'fill-amber-100' : ''}`} />
                 <span className={`text-[10px] font-bold ${activeView === 'profile' ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>طلباتي</span>
             </button>
             <button onClick={navigateToProfile} className={`flex flex-col items-center gap-1 transition-all ${activeView === 'profile' ? 'text-amber-600 -translate-y-1' : 'text-slate-400 hover:text-slate-600'}`}>
                 <UserIcon className={`w-6 h-6 ${activeView === 'profile' ? 'fill-amber-100' : ''}`} />
                 <span className={`text-[10px] font-bold ${activeView === 'profile' ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>حسابي</span>
             </button>
           </nav>
        ) : null}

      </div>
    </>
  );
};
