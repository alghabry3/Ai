// Domain Types
export type UserRole = 'customer' | 'seller' | 'driver' | 'admin';

export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    password?: string; // In a real app, never store plain text
}

export interface Product {
    id: string;
    nameAr: string;
    descriptionAr: string;
    price: number;
    image: string;
    rating: number;
    // Extended Product Details
    longDescriptionAr?: string;
    ingredientsAr?: string[];
    nutrition?: {
        calories: number;
        protein: string;
        carbs: string;
        fats: string;
    };
    images?: string[];
    sellerId?: string; // Link product to a seller
    categoryId?: string;
}

export interface Category {
    id: string;
    nameAr: string;
    icon: string;
}

export interface Seller {
    id: string;
    nameAr: string;
    cuisine: string;
    deliveryTime: string;
    rating: number;
    image: string;
    // Contact Info
    phone?: string;
    email?: string;
    address?: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export type OrderStatus = 'pending' | 'accepted' | 'delivering' | 'delivered';

export interface Order {
    id: string;
    items: CartItem[];
    total: number;
    status: OrderStatus;
    date: string;
    customerId: string;
    driverId?: string; // Assigned driver
}

// Financial Types
export type TransactionType = 'payout_seller' | 'payout_driver' | 'commission_collected' | 'refund';

export interface Transaction {
    id: string;
    amount: number;
    type: TransactionType;
    date: string;
    referenceId: string; // SellerID or DriverID
    description: string;
    status: 'completed' | 'pending';
}

// Live API Types
export type LiveStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface AudioVisualizerProps {
    status: LiveStatus;
    isUserSpeaking: boolean;
    isAiSpeaking: boolean;
    volume: number;
}