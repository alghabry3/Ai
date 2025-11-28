import React, { useState } from 'react';
import { ArrowRight, Heart, Share2, Star, Clock, Flame, Minus, Plus } from 'lucide-react';
import { Product } from '../types';

interface ProductPageProps {
  product: Product;
  onBack: () => void;
}

export const ProductPage: React.FC<ProductPageProps> = ({ product, onBack }) => {
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const increment = () => setQuantity(q => q + 1);
  const decrement = () => setQuantity(q => Math.max(1, q - 1));

  // Determine images to display
  const images = product.images && product.images.length > 0 
    ? product.images 
    : [product.image];

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const width = e.currentTarget.offsetWidth;
    const scrollLeft = e.currentTarget.scrollLeft;
    const index = Math.round(Math.abs(scrollLeft) / width);
    setActiveImageIndex(index);
  };

  return (
    <div className="min-h-screen bg-white pb-24 animate-in slide-in-from-left-4 duration-300">
      {/* Header Image Carousel & Nav */}
      <div className="relative h-72 bg-slate-200">
        <div 
           className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide [&::-webkit-scrollbar]:hidden" 
           dir="ltr" // Force LTR for consistent horizontal scrolling physics
           onScroll={handleScroll}
           style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {images.map((img, index) => (
             <div key={index} className="flex-shrink-0 w-full h-full snap-center relative">
               <img src={img} alt={`${product.nameAr} ${index + 1}`} className="w-full h-full object-cover" />
             </div>
          ))}
        </div>

        {/* Overlay Gradients */}
        <div className="absolute top-0 left-0 right-0 p-4 h-24 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />

        {/* Navigation Buttons */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-10">
          <button onClick={onBack} className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors">
            <ArrowRight className="w-6 h-6" />
          </button>
          <div className="flex gap-2">
            <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dots Indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
            {images.map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === activeImageIndex ? 'bg-white w-4' : 'bg-white/50'}`} 
              />
            ))}
          </div>
        )}
      </div>

      <div className="px-5 -mt-6 relative z-10">
        <div className="bg-white rounded-t-3xl p-6 shadow-sm border-b border-slate-100">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-2xl font-bold text-slate-800 leading-tight flex-1 ml-4">{product.nameAr}</h1>
            <div className="text-xl font-bold text-amber-600 whitespace-nowrap">{product.price} ر.س</div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
             <div className="flex items-center gap-1">
               <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
               <span className="font-bold text-slate-700">{product.rating}</span>
               <span className="text-slate-400">(٥٠+ تقييم)</span>
             </div>
             <div className="flex items-center gap-1">
               <Clock className="w-4 h-4" />
               <span>٢٠-٣٠ دقيقة</span>
             </div>
          </div>
        </div>

        {/* Description */}
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-3">الوصف</h2>
          <p className="text-slate-600 leading-relaxed text-sm">
            {product.longDescriptionAr || product.descriptionAr}
          </p>
        </div>

        {/* Ingredients */}
        {product.ingredientsAr && product.ingredientsAr.length > 0 && (
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 mb-3">المكونات</h2>
            <div className="flex flex-wrap gap-2">
              {product.ingredientsAr.map((ing, i) => (
                <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">
                  {ing}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Nutrition */}
        {product.nutrition && (
          <div className="p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-3">القيمة الغذائية</h2>
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-orange-50 rounded-2xl p-3 text-center border border-orange-100">
                <div className="flex justify-center mb-1 text-orange-500"><Flame className="w-5 h-5" /></div>
                <div className="font-bold text-slate-800">{product.nutrition.calories}</div>
                <div className="text-[10px] text-slate-500">سعرة</div>
              </div>
              <div className="bg-blue-50 rounded-2xl p-3 text-center border border-blue-100">
                <div className="text-xs text-blue-500 mb-1 font-medium">بروتين</div>
                <div className="font-bold text-slate-800">{product.nutrition.protein}</div>
              </div>
              <div className="bg-green-50 rounded-2xl p-3 text-center border border-green-100">
                <div className="text-xs text-green-500 mb-1 font-medium">كاربوهيدرات</div>
                <div className="font-bold text-slate-800">{product.nutrition.carbs}</div>
              </div>
               <div className="bg-yellow-50 rounded-2xl p-3 text-center border border-yellow-100">
                <div className="text-xs text-yellow-600 mb-1 font-medium">دهون</div>
                <div className="font-bold text-slate-800">{product.nutrition.fats}</div>
              </div>
            </div>
             <p className="text-[10px] text-slate-400 mt-3 text-center">* القيم الغذائية تقريبية للحصة الواحدة</p>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 pb-8 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
        <div className="flex gap-4">
           <div className="flex items-center gap-3 bg-slate-100 rounded-xl px-4 py-2">
             <button 
               onClick={decrement}
               disabled={quantity <= 1}
               className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm text-slate-700 hover:bg-slate-50 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
             >
               <Minus className="w-4 h-4" />
             </button>
             <span className="font-bold text-slate-900 w-6 text-center text-lg">{quantity}</span>
             <button 
               onClick={increment}
               className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
             >
               <Plus className="w-4 h-4" />
             </button>
           </div>
           <button className="flex-1 bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">
             إضافة للسلة - {product.price * quantity} ر.س
           </button>
        </div>
      </div>
    </div>
  );
};