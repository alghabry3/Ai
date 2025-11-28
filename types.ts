// Domain Types
export type UserRole = 'customer' | 'seller' | 'driver';

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

// Live API Types
export type LiveStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface AudioVisualizerProps {
    status: LiveStatus;
    isUserSpeaking: boolean;
    isAiSpeaking: boolean;
    volume: number;
}
