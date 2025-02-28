export type SwarmType = 'inception' | 'early' | 'partner';

export interface TeamMember {
    name: string;
    picture: string;
    telegram?: string;
    X?: string;
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    completed: boolean;
}

export interface SwarmPreviewData {
    id: string;
    image: string;
    models: string[];
    name: string;
    description: string;
    shortDescription?: string;
    tags: string[];
    role: string;
    swarmType: SwarmType;
    revenueShare: number;
    multiple?: number;
    pool?: string;
    program?: {
        pool?: string;
    }
    launchDate?: Date;
    weeklyRevenue?: number;
    totalRevenue?: number;
    twitterAccount?: string;  // Added this line
}

export type SwarmModel = 'KinOS' | 'Claude Haiku' | 'GPT-4o Mini';

export interface SwarmGalleryItem {
    type: 'image' | 'video' | 'text';
    content: string;
}

export interface SwarmInfo {
    id: string;
    pool?: string;
    name: string;
    description: string;
    logo?: string;
    gallery: SwarmGalleryItem[];
    image: string;
    models: string[];
    tags: string[];
    role: string;
    programAddress?: string;
    swarmType: SwarmType;
    multiple: number;
    achievements?: Achievement[];
    socials?: {
        website?: string;
        twitter?: string;
        telegram?: string;
        telegramChannel?: string;
        discord?: string;
        dexscreener?: string;
    };
    program?: {
        pool?: string;
    };
    wallet?: string;
    revenueShare?: number;
    launchDate?: Date;
    links?: {
        name: string;
        url: string;
    }[];
    team?: TeamMember[];
    weeklyRevenue?: number;
    totalRevenue?: number;
    twitterAccount?: string;
}
