type SwarmModel = 'GPT-4o Mini' | 'Claude Haiku' | 'KinOS';

interface SwarmPreviewData {
    image: string;
    name: string;
    description: string; // Max length of 125 characters
    models: SwarmModel[];
    id: string; // UUID
    tags: string[];
    role?: string;
}

interface SwarmGalleryItem {
    type: 'image' | 'video' | 'node';
    content: string | React.ReactNode;
}

interface SwarmInfo extends SwarmPreviewData {
    gallery: SwarmGalleryItem[];
    programAddress: string;
}

interface MarketListing {
    id: string;
    number_of_shares: number;
    seller: string;
    price_per_share: number;
    token: string;
}

export type {
    SwarmPreviewData,
    SwarmModel,
    SwarmGalleryItem,
    SwarmInfo,
    MarketListing
}