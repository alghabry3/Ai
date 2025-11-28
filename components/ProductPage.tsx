
import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Heart, Share2, Star, Clock, Flame, Minus, Plus, Zap, MessageSquare, Store, FileText, ChefHat, Activity } from 'lucide-react';
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

    // Scale: 60 mins = 100% width usually
    const percent = Math.min(100, (avgMinutes / 60) * 100);
    
    let color = 'bg-emerald-500';
    if (avgMinutes > 45) color = 'bg-red-500';
    else if (avgMinutes > 30) color = 'bg-amber-500';

    return { percent, color, avgMinutes };
  };

  const { percent: deliveryPercent, color: deliveryColor } = getDeliveryMetrics();

  return (
    <div className="min-h-screen bg-slate-50 md:py-8 animate-in slide-in-from-bottom-4 duration-300">
      
      {/* Back Button (Desktop) */}
      <div className="max-w-7xl mx-auto px-4 mb-4 hidden md:block">
         <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors">
            <ArrowRight className="w-5 h-5" />
            <span className="font-bold">العودة</span>
         </button>
      </div>

      <div className="bg-white md:rounded-3xl shadow-sm md:shadow-xl max-w-7xl mx-auto overflow-hidden min-h-screen md:min-h-0 pb-24 md:pb-0 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
            
            {/* Left Column: Images */}
            <div className="relative h-72 md:h-[600px] bg-slate-200 order-1 md:order-2">
                <div 
                ref={scrollContainerRef}
                className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide [&::-webkit-scrollbar]:hidden" 
                dir="ltr" 
                onScroll={handleScroll}
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                {images.map((img, index) => (
                    <div key={index} className="flex-shrink-0 w-full h-full snap-center relative">
                        <img src={img} alt={`${product.nameAr} ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                ))}
                </div>

                {/* Mobile Nav Overlay */}
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-10 md:hidden">
                    <button onClick={onBack} className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors">
                        <ArrowRight className="w-6 h-6" />
                    </button>
                    <div className="flex gap-2">
                        <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-colors">
                            <Heart className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Dots Indicator */}
                {images.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10" dir="ltr">
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

            {/* Right Column: Details */}
            <div className="order-2 md:order-1 flex flex-col h-full relative">
                <div className="p-6 md:p-8 flex-1 overflow-y-auto">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-2">
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight flex-1 ml-4">{product.nameAr}</h1>
                        <div className="text-xl md:text-2xl font-bold text-amber-600 whitespace-nowrap">{product.price} ر.س</div>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-slate-500 mb-6">
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
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                className={`h-full ${deliveryColor} rounded-full transition-all duration-1000 ease-out`}
                                style={{ width: animateDelivery ? `${deliveryPercent}%` : '0%' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Seller Info Section - Prominent Display */}
                    {seller && (
                        <div className="p-4 bg-gradient-to-r from-amber-50/50 to-white rounded-2xl flex items-center gap-4 border border-slate-100 mb-6 shadow-sm">
                            <div className="relative">
                                <img src={seller.image} alt={seller.nameAr} className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md" />
                                <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-1 rounded-full border-2 border-white shadow-sm">
                                    <Store className="w-3.5 h-3.5" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-amber-600 font-bold mb-1 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                    إعداد أسرة منتجة
                                </p>
                                <h3 className="font-bold text-slate-800 text-lg leading-tight">{seller.nameAr}</h3>
                                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{seller.cuisine}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <div className="flex items-center gap-1 bg-white px-2.5 py-1.5 rounded-xl border border-slate-100 shadow-sm">
                                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                    <span className="font-bold text-slate-800">{seller.rating}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    <div className="mb-6">
                        <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-amber-500" />
                            الوصف
                        </h2>
                        <p className="text-slate-600 leading-relaxed text-sm">
                            {product.longDescriptionAr || product.descriptionAr}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                         {/* Ingredients */}
                        {product.ingredientsAr && product.ingredientsAr.length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                                <ChefHat className="w-5 h-5 text-amber-500" />
                                المكونات
                                </h2>
                                <ul className="list-disc list-inside space-y-2 text-slate-600 text-sm marker:text-amber-500">
                                {product.ingredientsAr.map((ing, i) => (
                                    <li key={i}>{ing}</li>
                                ))}
                                </ul>
                            </div>
                        )}

                        {/* Nutrition */}
                        {product.nutrition && (
                            <div className="mb-6">
                                <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-amber-500" />
                                القيمة الغذائية
                                </h2>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-orange-50 rounded-2xl p-3 text-center border border-orange-100">
                                        <div className="flex justify-center mb-1 text-orange-500"><Flame className="w-5 h-5" /></div>
                                        <div className="font-bold text-slate-800">{product.nutrition.calories}</div>
                                        <div className="text-[10px] text-slate-500">سعرة</div>
                                    </div>
                                    <div className="bg-blue-50 rounded-2xl p-3 text-center border border-blue-100">
                                        <div className="text-xs text-blue-500 mb-1 font-medium">بروتين</div>
                                        <div className="font-bold text-slate-800">{product.nutrition.protein}</div>
                                    </div>
                                    <div className="bg-purple-50 rounded-2xl p-3 text-center border border-purple-100">
                                        <div className="text-xs text-purple-500 mb-1 font-medium">كربوهيدرات</div>
                                        <div className="font-bold text-slate-800">{product.nutrition.carbs}</div>
                                    </div>
                                    <div className="bg-rose-50 rounded-2xl p-3 text-center border border-rose-100">
                                        <div className="text-xs text-rose-500 mb-1 font-medium">دهون</div>
                                        <div className="font-bold text-slate-800">{product.nutrition.fats}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Reviews Placeholder */}
                    <div className="mt-8 border-t border-slate-100 pt-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-amber-500" />
                                التقييمات
                            </h2>
                            <button className="text-sm font-bold text-amber-600 hover:text-amber-700">أضف تقييم</button>
                        </div>
                        
                        <div className="bg-slate-50 rounded-2xl p-8 text-center border border-dashed border-slate-200">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-slate-300">
                                <Star className="w-6 h-6" />
                            </div>
                            <p className="text-slate-500 font-medium">لا توجد تقييمات بعد</p>
                            <p className="text-xs text-slate-400 mt-1">كن أول من يقيم هذا المنتج!</p>
                        </div>
                    </div>

                </div>

                {/* Footer Actions - Sticky Bottom relative to this col or absolute */}
                <div className="p-4 md:p-8 bg-white border-t border-slate-100 sticky bottom-0 z-20">
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
        </div>
      </div>
    </div>
  );
};
