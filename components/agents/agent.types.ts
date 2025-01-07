type AgentModel = 'GPT-4o Mini' | 'Claude Haiku';

interface AgentPreviewData {
    image: string;
    name: string;
    description: string; // Max length of 125 characters
    models: AgentModel[];
    id: string; // UUID
}