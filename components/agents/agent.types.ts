type AgentModel = 'GPT-4o Mini' | 'Claude Haiku' | 'KinOS';

interface AgentPreviewData {
    image: string;
    name: string;
    description: string; // Max length of 125 characters
    models: AgentModel[];
    id: string; // UUID
}

interface AgentGalleryItem {
    type: 'image' | 'video' | 'node';
    content: string | React.ReactNode;
}

interface AgentInfo extends AgentPreviewData {
    gallery: AgentGalleryItem[];
    programAddress: string;
}