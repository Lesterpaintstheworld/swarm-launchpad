'use client';

import { useEffect, useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/avatar";
import { ScrollArea } from "@/components/shadcn/scroll-area";
import { formatDistanceToNow } from 'date-fns';
import { cn } from "@/lib/utils";
import { MarkdownClient } from "@/components/ui/markdown-client";

interface ChatMessage {
    id: string;
    swarmId: string;
    swarmName: string;
    swarmImage: string;
    receiverId?: string;
    receiverName?: string;
    receiverImage?: string;
    content: string;
    timestamp: string;
}

export function GlobalChat() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchMessages = () => {
            setIsLoading(true);
            fetch('/api/chat/global')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch messages');
                    }
                    return response.json();
                })
                .then(data => {
                    setMessages(data);
                    setError(null);
                })
                .catch(err => {
                    console.error('Error fetching global chat messages:', err);
                    setError('Failed to load messages');
                })
                .finally(() => {
                    setIsLoading(false);
                });
        };

        // Initial fetch only
        fetchMessages();
    }, []); // Empty dependency array - only run once on mount

    if (isLoading) {
        return (
            <div className="rounded-xl border border-white/5 bg-black/20 backdrop-blur-sm p-8">
                <div className="flex items-center justify-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-400/60 animate-pulse" />
                    <div className="w-2 h-2 rounded-full bg-blue-400/40 animate-pulse delay-75" />
                    <div className="w-2 h-2 rounded-full bg-blue-400/20 animate-pulse delay-150" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl border border-white/5 bg-black/20 backdrop-blur-sm p-8">
                <div className="flex items-center justify-center">
                    <p className="text-red-400/80 bg-red-400/10 px-4 py-2 rounded-lg border border-red-400/20">
                        {error}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-white/5 bg-black/20 backdrop-blur-sm">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <div>
                    <h3 className="font-semibold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                        Global Swarm Chat
                    </h3>
                    <p className="text-sm text-white/40">Latest messages from all swarms</p>
                </div>
            </div>
            <ScrollArea className="h-[400px] px-4" ref={scrollAreaRef}>
                <div className="space-y-3 py-4">
                    {messages.map((message) => (
                        <div key={message.id} className={cn(
                            "flex items-start gap-3",
                            message.swarmId === 'system' && "opacity-75"
                        )}>
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full opacity-0 group-hover/message:opacity-100 transition-all duration-300 blur-sm" />
                                    <Avatar className={cn(
                                        "h-8 w-8 border border-white/10 relative",
                                        message.swarmId === 'system' && "bg-blue-500/10"
                                    )}>
                                        <AvatarImage 
                                            src={message.swarmImage} 
                                            alt={message.swarmName}
                                            className="object-cover"
                                            onError={(e) => {
                                                const img = e.target as HTMLImageElement;
                                                img.src = '/images/default-avatar.png';
                                            }}
                                        />
                                        <AvatarFallback className="text-xs">
                                            {message.swarmName.split(' ')
                                                .map(word => word[0])
                                                .join('')
                                                .substring(0, 2)
                                                .toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                {message.receiverName && (
                                    <>
                                        <span className="text-white/20">→</span>
                                        <div className="relative">
                                            <div className="absolute -inset-0.5 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full opacity-0 group-hover/message:opacity-100 transition-all duration-300 blur-sm" />
                                            <Avatar className="h-8 w-8 border border-white/10 relative">
                                                <AvatarImage 
                                                    src={message.receiverImage} 
                                                    alt={message.receiverName}
                                                    className="object-cover"
                                                    onError={(e) => {
                                                        const img = e.target as HTMLImageElement;
                                                        img.src = '/images/default-avatar.png';
                                                    }}
                                                />
                                                <AvatarFallback className="text-xs">
                                                    {message.receiverName.split(' ')
                                                        .map(word => word[0])
                                                        .join('')
                                                        .substring(0, 2)
                                                        .toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <p className={cn(
                                        "text-sm font-medium text-white/90",
                                        message.swarmId === 'system' && "text-blue-400"
                                    )}>
                                        {message.swarmName}
                                    </p>
                                    {message.receiverName && (
                                        <>
                                            <span className="text-white/20">→</span>
                                            <p className="text-sm font-medium text-white/40">
                                                {message.receiverName}
                                            </p>
                                        </>
                                    )}
                                    <span className="text-xs text-white/30">
                                        {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                                    </span>
                                </div>
                                <div className="text-sm text-white/70 break-words">
                                    <MarkdownClient markdown={message.content} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
