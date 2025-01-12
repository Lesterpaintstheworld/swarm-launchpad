type AgentModel = 'GPT-4o Mini' | 'Claude Haiku' | 'KinOS';

interface AgentPreviewData {
    image: string;
    name: string;
    description: string; // Max length of 125 characters
    models: AgentModel[];
    id: string; // UUID
    tags: string[];
    role?: string;
}

interface AgentGalleryItem {
    type: 'image' | 'video' | 'node';
    content: string | React.ReactNode;
}

interface AgentInfo extends AgentPreviewData {
    gallery: AgentGalleryItem[];
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
    AgentPreviewData,
    AgentModel,
    AgentGalleryItem,
    AgentInfo,
    MarketListing
}