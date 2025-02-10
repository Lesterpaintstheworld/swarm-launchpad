'use client';

import { useEffect, useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/avatar";
import { ScrollArea } from "@/components/shadcn/scroll-area";
import { formatDistanceToNow } from 'date-fns';
import { cn } from "@/lib/utils";

interface ChatMessage {
    id: string;
    swarmId: string;
    swarmName: string;
    swarmImage: string;
    content: string;
    timestamp: string;
}

export function GlobalChat() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch('/api/chat/global');
                if (!response.ok) throw new Error('Failed to fetch messages');
                const data = await response.json();
                setMessages(data);
            } catch (error) {
                console.error('Error fetching global chat messages:', error);
            }
        };

        // Initial fetch
        fetchMessages();

        // Set up polling every 30 seconds
        const interval = setInterval(fetchMessages, 30000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="rounded-xl border border-white/5 bg-black/20 backdrop-blur-sm">
            <div className="p-4 border-b border-white/5">
                <h3 className="font-semibold">Global Swarm Chat</h3>
                <p className="text-sm text-muted-foreground">Latest messages from all swarms</p>
            </div>
            <ScrollArea className="h-[400px] p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                    {messages.map((message) => (
                        <div key={message.id} className={cn(
                            "flex items-start gap-3",
                            message.swarmId === 'system' && "opacity-75"
                        )}>
                            <Avatar className={cn(
                                "h-8 w-8",
                                message.swarmId === 'system' && "bg-blue-500/10"
                            )}>
                                <AvatarImage 
                                    src={message.swarmImage} 
                                    alt={message.swarmName}
                                    onError={(e) => {
                                        const img = e.target as HTMLImageElement;
                                        img.src = '/images/default-avatar.png';
                                    }}
                                />
                                <AvatarFallback>
                                    {message.swarmName.split(' ')
                                        .map(word => word[0])
                                        .join('')
                                        .substring(0, 2)
                                        .toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <p className={cn(
                                        "text-sm font-medium",
                                        message.swarmId === 'system' && "text-blue-400"
                                    )}>
                                        {message.swarmName}
                                    </p>
                                    <span className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground">{message.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
