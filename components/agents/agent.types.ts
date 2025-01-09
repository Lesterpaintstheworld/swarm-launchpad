type AgentModel = 'GPT-4o Mini' | 'Claude Haiku' | 'KinOS';

interface AgentPreviewData {
    image: string;
    name: string;
    description: string; // Max length of 125 characters
    models: AgentModel[];
    id: string; // UUID
}

interface AgentInfo extends AgentPreviewData {
    gallery: React.ReactNode[] | string[];
    programAddress: string;
}