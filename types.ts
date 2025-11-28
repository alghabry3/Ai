// Domain Types
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

// Live API Types
export type LiveStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface AudioVisualizerProps {
    status: LiveStatus;
    isUserSpeaking: boolean;
    isAiSpeaking: boolean;
    volume: number;
}