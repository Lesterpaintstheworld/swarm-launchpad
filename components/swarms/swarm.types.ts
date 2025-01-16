export interface SwarmPreviewData {
    id: string;
    image: string;
    models: string[];
    name: string;
    description: string;
    tags: string[];
    role: string;
    isInception?: boolean;
}

export type SwarmModel = 'KinOS' | 'Claude Haiku' | 'GPT-4o Mini';

export interface SwarmGalleryItem {
    type: 'image' | 'video' | 'text';
    content: string;
}

export interface SwarmInfo {
    id: string;
    name: string;
    description: string;
    gallery: SwarmGalleryItem[];
    image: string;
    models: string[];
    tags: string[];
    role: string;
    programAddress: string;
}
