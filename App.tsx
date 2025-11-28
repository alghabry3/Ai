import React, { useState } from 'react';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { ProductPage } from './components/ProductPage';
import { 
  ShoppingBag, 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  User, 
  Home, 
  Heart, 
  Mic
} from 'lucide-react';
import { Product, Category, Seller } from './types';

// Mock Data
const CATEGORIES: Category[] = [
  { id: '1', nameAr: 'برجر', icon: '🍔' },
  { id: '2', nameAr: 'بيتزا', icon: '🍕' },
  { id: '3', nameAr: 'شاورما', icon: '🥙' },
  { id: '4', nameAr: 'آسيوي', icon: '🍣' },
  { id: '5', nameAr: 'حلويات', icon: '🍩' },
];

const SELLERS: Seller[] = [
  { id: '1', nameAr: 'برجر كنج', cuisine: 'وجبات سريعة', deliveryTime: '25-35 دقيقة', rating: 4.5, image: 'https://picsum.photos/seed/burger/400/250' },
  { id: '2', nameAr: 'بيتزا هت', cuisine: 'إيطالي', deliveryTime: '30-45 دقيقة', rating: 4.2, image: 'https://picsum.photos/seed/pizza/400/250' },
  { id: '3', nameAr: 'شاورما كلاسيك', cuisine: 'عربي', deliveryTime: '15-25 دقيقة', rating: 4.8, image: 'https://picsum.photos/seed/shawarma/400/250' },
];

const POPULAR_PRODUCTS: Product[] = [
  { 
    id: '1', 
    nameAr: 'وجبة دجاج عائلي', 
    descriptionAr: '١٢ قطعة دجاج + بطاطس + كولا', 
    price: 85, 
    image: 'https://picsum.photos/seed/chicken/200/200', 
    rating: 4.7,
    longDescriptionAr: 'استمتع بوجبة عائلية متكاملة تكفي الجميع! ١٢ قطعة من الدجاج المقرمش المتبل بخلطتنا السرية، يقدم مع بطاطس ذهبية مقلية ومشروب كولا عائلي بارد. الخيار الأمثل للتجمعات.',
    ingredientsAr: ['دجاج طازج', 'دقيق القمح', 'توابل خاصة', 'زيت نباتي', 'بطاطس', 'ملح'],
    nutrition: { calories: 1200, protein: '45g', carbs: '110g', fats: '55g' }
  },
  { 
    id: '2', 
    nameAr: 'بيتزا سوبر سوبريم', 
    descriptionAr: 'حجم كبير مع أطراف جبنة', 
    price: 65, 
    image: 'https://picsum.photos/seed/pizza2/200/200', 
    rating: 4.5,
    longDescriptionAr: 'بيتزا سوبر سوبريم الغنية بالمكونات! طبقة غنية من صلصة الطماطم وجبنة الموزاريلا، مغطاة بقطع البيبروني، اللحم المفروم، الفطر، الفلفل الأخضر، والزيتون الأسود. تأتيكم بأطراف محشوة بالجبنة اللذيذة.',
    ingredientsAr: ['عجينة البيتزا', 'صلصة طماطم', 'جبنة موزاريلا', 'بيبروني', 'لحم بقري', 'فطر', 'فلفل أخضر', 'زيتون'],
    nutrition: { calories: 280, protein: '12g', carbs: '35g', fats: '10g' } 
  },
];

const App: React.FC = () => {
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* Voice Assistant Modal - Always available */}
      <VoiceAssistantModal 
        isOpen={isVoiceModalOpen} 
        onClose={() => setIsVoiceModalOpen(false)} 
      />

      {selectedProduct ? (
        // Product Page View
        <ProductPage 
          product={selectedProduct} 
          onBack={() => setSelectedProduct(null)} 
        />
      ) : (
        // Home Screen View
        <div className="pb-20">
          {/* Top Header */}
          <header className="bg-white sticky top-0 z-30 shadow-sm px-4 py-3">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-amber-200">
                   س
                 </div>
                 <div>
                   <p className="text-xs text-slate-500 font-medium">التوصيل إلى</p>
                   <div className="flex items-center gap-1 text-slate-800 font-bold text-sm cursor-pointer">
                     <span>المنزل، الرياض</span>
                     <MapPin className="w-3 h-3 text-amber-500" />
                   </div>
                 </div>
              </div>
              <button className="p-2 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200 transition-colors relative">
                 <ShoppingBag className="w-6 h-6" />
                 <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
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
            
            {/* Categories */}
            <section>
              <h2 className="text-lg font-bold text-slate-800 mb-4">التصنيفات</h2>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {CATEGORIES.map(cat => (
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
                {SELLERS.map(seller => (
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
                {POPULAR_PRODUCTS.map(product => (
                  <div 
                    key={product.id} 
                    onClick={() => setSelectedProduct(product)}
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
          </main>

          {/* Floating Action Button - Voice Assistant */}
          <button 
            onClick={() => setIsVoiceModalOpen(true)}
            className="fixed bottom-24 left-4 z-40 bg-gradient-to-tr from-amber-500 to-amber-400 text-white w-14 h-14 rounded-full shadow-xl shadow-amber-200 flex items-center justify-center hover:scale-110 transition-transform duration-200 group"
          >
            <div className="absolute inset-0 bg-white opacity-20 rounded-full animate-ping group-hover:animate-none"></div>
            <Mic className="w-6 h-6 relative z-10" />
          </button>

          {/* Bottom Navigation */}
          <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-3 flex justify-between items-center z-30">
            <button className="flex flex-col items-center gap-1 text-amber-500">
              <Home className="w-6 h-6" />
              <span className="text-[10px] font-medium">الرئيسية</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors">
              <Search className="w-6 h-6" />
              <span className="text-[10px] font-medium">البحث</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors">
              <ShoppingBag className="w-6 h-6" />
              <span className="text-[10px] font-medium">طلباتي</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors">
              <User className="w-6 h-6" />
              <span className="text-[10px] font-medium">حسابي</span>
            </button>
          </nav>
        </div>
      )}

    </div>
  );
};

export default App;