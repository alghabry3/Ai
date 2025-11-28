
import React from 'react';
import { Seller, Product } from '../types';
import { ArrowRight, Star, Clock, MapPin, Heart, Store } from 'lucide-react';

interface SellerPageProps {
  seller: Seller;
  products: Product[];
  onBack: () => void;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const SellerPage: React.FC<SellerPageProps> = ({ 
  seller, 
  products, 
  onBack, 
  onProductClick,
  onAddToCart 
}) => {
  return (
    <div className="min-h-screen bg-slate-50 pb-24 animate-in slide-in-from-left-4 duration-300">
      {/* Hero Section */}
      <div className="relative h-64 bg-slate-900">
        <img 
          src={seller.image} 
          alt={seller.nameAr} 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
        
        {/* Navbar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
          <button 
            onClick={onBack} 
            className="p-2.5 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
          <button className="p-2.5 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors">
            <Heart className="w-5 h-5" />
          </button>
        </div>

        {/* Seller Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
           <div className="flex justify-between items-end">
              <div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg shadow-sm">
                        أسرة منتجة
                    </span>
                    <span className="flex items-center gap-1 text-xs font-medium text-slate-300">
                        <MapPin className="w-3 h-3" /> الرياض
                    </span>
                </div>
                <h1 className="text-3xl font-bold mb-1 shadow-black drop-shadow-md">{seller.nameAr}</h1>
                <p className="text-slate-300 text-sm">{seller.cuisine}</p>
              </div>
              <div className="bg-white text-slate-900 px-3 py-1 rounded-xl flex flex-col items-center shadow-lg">
                  <span className="text-xs font-bold text-slate-400">التقييم</span>
                  <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="font-bold text-lg">{seller.rating}</span>
                  </div>
              </div>
           </div>
        </div>
      </div>

      {/* Info Stats */}
      <div className="bg-white p-4 shadow-sm border-b border-slate-100 flex justify-around">
          <div className="flex flex-col items-center gap-1">
              <Clock className="w-5 h-5 text-slate-400" />
              <span className="text-xs text-slate-500">وقت التوصيل</span>
              <span className="font-bold text-slate-800 text-sm">{seller.deliveryTime}</span>
          </div>
          <div className="w-px bg-slate-100"></div>
          <div className="flex flex-col items-center gap-1">
              <Store className="w-5 h-5 text-slate-400" />
              <span className="text-xs text-slate-500">الحد الأدنى</span>
              <span className="font-bold text-slate-800 text-sm">50 ر.س</span>
          </div>
      </div>

      {/* Menu / Products */}
      <div className="p-4">
        <h2 className="text-lg font-bold text-slate-800 mb-4">قائمة الطعام ({products.length})</h2>
        
        {products.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-500">لا توجد منتجات متاحة حالياً</p>
            </div>
        ) : (
            <div className="space-y-4">
                {products.map(product => (
                    <div 
                        key={product.id}
                        onClick={() => onProductClick(product)}
                        className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex gap-3 cursor-pointer active:scale-98 transition-transform"
                    >
                        <img 
                           src={product.image} 
                           alt={product.nameAr} 
                           className="w-24 h-24 rounded-xl object-cover bg-slate-100"
                        />
                        <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="font-bold text-slate-800 text-base">{product.nameAr}</h3>
                                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{product.descriptionAr}</p>
                            </div>
                            <div className="flex justify-between items-end mt-2">
                                <span className="font-bold text-amber-600">{product.price} ر.س</span>
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onAddToCart(product);
                                    }}
                                    className="bg-slate-900 text-white w-8 h-8 rounded-lg flex items-center justify-center hover:bg-amber-500 transition-colors"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};
