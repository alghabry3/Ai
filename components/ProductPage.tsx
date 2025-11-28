
import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Heart, Share2, Star, Clock, Flame, Minus, Plus, Zap, MessageSquare, Store } from 'lucide-react';
import { Product, Seller } from '../types';

interface ProductPageProps {
  product: Product;
  seller?: Seller;
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductPage: React.FC<ProductPageProps> = ({ product, seller, onBack, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [animateDelivery, setAnimateDelivery] = useState(false);

  const triggerHaptic = (ms: number = 10) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(ms);
    }
  };

  // Reset scroll position when product changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: 'auto' });
      setActiveImageIndex(0);
    }
    // Trigger animation for delivery bar
    setAnimateDelivery(false);
    setTimeout(() => setAnimateDelivery(true), 100);
  }, [product.id]);

  const increment = () => {
    setQuantity(q => q + 1);
    triggerHaptic(5);
  };
  const decrement = () => {
    setQuantity(q => Math.max(1, q - 1));
    triggerHaptic(5);
  };

  // Determine images to display
  const images = product.images && product.images.length > 0 
    ? product.images 
    : [product.image];

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const width = e.currentTarget.offsetWidth;
    const scrollLeft = e.currentTarget.scrollLeft;
    // Calculate index based on scroll position
    const index = Math.round(Math.abs(scrollLeft) / width);
    setActiveImageIndex(index);
  };

  const scrollToImage = (index: number) => {
    if (scrollContainerRef.current) {
      const width = scrollContainerRef.current.offsetWidth;
      scrollContainerRef.current.scrollTo({
        left: width * index,
        behavior: 'smooth'
      });
      // State update happens in onScroll, but we can optimistically set it here too if needed
    }
  };

  // Calculate delivery metrics
  const getDeliveryMetrics = () => {
    const timeStr = seller?.deliveryTime || '30';
    const matches = timeStr.match(/\d+/g);
    let avgMinutes = 30;
    
    if (matches && matches.length > 0) {
       const nums = matches.map(Number);
       avgMinutes = nums.reduce((a, b) => a + b, 0) / nums.length;
    }

    // Scale: 60 mins = 100% width usually, but let's say max usually 90 mins for UI scaling
    const percent = Math.min(100, (avgMinutes / 60) * 100);
    
    let color = 'bg-emerald-500';
    if (avgMinutes > 45) color = 'bg-red-500';
    else if (avgMinutes > 30) color = 'bg-amber-500';

    return { percent, color, avgMinutes };
  };

  const { percent: deliveryPercent, color: deliveryColor } = getDeliveryMetrics();

  return (
    <div className="min-h-screen bg-white pb-24 animate-in slide-in-from-left-4 duration-300">
      {/* Header Image Carousel & Nav */}
      <div className="relative h-72 bg-slate-200">
        <div 
           ref={scrollContainerRef}
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
          <div 
            className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10"
            dir="ltr" // Ensure dots direction matches carousel (LTR)
          >
            {images.map((_, i) => (
              <button 
                key={i} 
                onClick={(e) => { e.stopPropagation(); scrollToImage(i); }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === activeImageIndex ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/80'}`} 
                aria-label={`Go to image ${i + 1}`}
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
          
          <div className="flex items-center gap-6 text-sm text-slate-500 mb-2">
             <div className="flex items-center gap-1">
               <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
               <span className="font-bold text-slate-700">{product.rating}</span>
               <span className="text-slate-400">(٥٠+ تقييم)</span>
             </div>
             
             {/* Delivery Time & Bar */}
             <div className="flex flex-col gap-1.5 flex-1 max-w-[140px]">
               <div className="flex items-center gap-1">
                 <Clock className="w-4 h-4 text-slate-400" />
                 <span className="font-bold text-slate-700 text-xs">{seller?.deliveryTime || '٣٠ دقيقة'}</span>
               </div>
               {/* Animated Progress Bar */}
               <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                 <div 
                   className={`h-full ${deliveryColor} rounded-full transition-all duration-1000 ease-out`}
                   style={{ width: animateDelivery ? `${deliveryPercent}%` : '0%' }}
                 />
               </div>
             </div>
          </div>
        </div>

        {/* Seller Info Section */}
        {seller && (
          <div className="px-6 py-4 flex items-center gap-3 border-b border-slate-50">
             <div className="relative">
                <img src={seller.image} alt={seller.nameAr} className="w-12 h-12 rounded-full object-cover border border-slate-200" />
                <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-0.5 rounded-full border-2 border-white">
                    <Store className="w-3 h-3" />
                </div>
             </div>
             <div>
                <p className="text-xs text-slate-400 font-medium">إعداد وتقديم</p>
                <h3 className="font-bold text-slate-800">{seller.nameAr}</h3>
             </div>
             <div className="mr-auto flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span className="text-xs font-bold text-slate-700">{seller.rating}</span>
             </div>
          </div>
        )}

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
            <ul className="list-disc list-inside space-y-2 text-slate-600 text-sm marker:text-amber-500">
              {product.ingredientsAr.map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Nutrition */}
        {product.nutrition && (
          <div className="p-6 border-b border-slate-100">
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

        {/* Reviews Section */}
        <div className="p-6 pb-28">
           <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-800">التقييمات</h2>
              <button className="text-amber-600 text-sm font-bold hover:underline flex items-center gap-1">
                 <MessageSquare className="w-4 h-4" />
                 أضف تقييمك
              </button>
           </div>
           
           <div className="bg-slate-50 rounded-2xl p-8 text-center border border-slate-100 border-dashed">
              <div className="inline-block p-3 bg-white rounded-full shadow-sm mb-3">
                 <Star className="w-6 h-6 text-slate-300" />
              </div>
              <p className="text-slate-600 font-bold mb-1">لا توجد تقييمات بعد</p>
              <p className="text-slate-400 text-xs">كن أول من يشاركنا رأيه في هذا المنتج!</p>
           </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 pb-8 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
        <div className="flex gap-3">
           {/* Quick Add Button */}
           <button 
             onClick={() => { onAddToCart(product, 1); triggerHaptic(15); }}
             className="w-14 rounded-xl bg-amber-50 border border-amber-100 text-amber-700 flex flex-col items-center justify-center gap-0.5 hover:bg-amber-100 active:scale-95 transition-all"
             title="إضافة سريعة (١)"
           >
             <Zap className="w-5 h-5 fill-amber-500" />
             <span className="text-[10px] font-bold leading-none">1+</span>
           </button>

           {/* Quantity Selector */}
           <div className="flex items-center gap-3 bg-slate-100 rounded-xl px-3 py-2">
             <button 
               onClick={decrement}
               disabled={quantity <= 1}
               className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm text-slate-700 hover:bg-slate-50 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
             >
               <Minus className="w-4 h-4" />
             </button>
             <span className="font-bold text-slate-900 w-4 text-center text-lg">{quantity}</span>
             <button 
               onClick={increment}
               className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
             >
               <Plus className="w-4 h-4" />
             </button>
           </div>

           {/* Main Add Button */}
           <button 
             onClick={() => { onAddToCart(product, quantity); triggerHaptic(20); }}
             className="flex-1 bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200 flex flex-col items-center justify-center leading-none gap-1"
           >
             <span>إضافة للسلة</span>
             <span className="text-xs font-normal text-slate-300">{product.price * quantity} ر.س</span>
           </button>
        </div>
      </div>
    </div>
  );
};
