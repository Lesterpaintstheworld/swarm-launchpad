import { SwarmLogoGrid } from '@/components/swarms/logoGrid';
import { previews } from '@/data/swarms/previews';

export default function SwarmStatsPage() {
    return (
        <div className="flex justify-center items-center min-h-screen bg-black p-8">
            <SwarmLogoGrid swarms={previews} />
        </div>
    );
}
