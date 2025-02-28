'use client';

import { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { SimulationNode } from '../types';

interface MessageAnimationsProps {
    g: d3.Selection<SVGGElement, unknown, null, undefined>;
    defs: d3.Selection<SVGDefsElement, unknown, null, undefined>;
    nodes: SimulationNode[];
    collaborations: Array<{
        id: string;
        providerSwarm: { id: string };
        clientSwarm: { id: string };
    }>;
    getNodeSize: (id: string) => number;
}

export function MessageAnimations({ g, defs, nodes, collaborations, getNodeSize }: MessageAnimationsProps) {
    const [messages, setMessages] = useState<Array<{ id: string; senderId: string; timestamp: string }>>([]);
    const [activeMessages, setActiveMessages] = useState<Set<string>>(new Set());
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const MAX_CONCURRENT_MESSAGES = 25;
    const ANIMATION_DURATION = 2500;
    const NEW_MESSAGE_INTERVAL = 300;

    // Add envelope icon definition
    useEffect(() => {
        if (!defs.select("#envelope-icon").size()) {
            defs.append("path")
                .attr("id", "envelope-icon")
                .attr("d", "M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383-4.708 2.825L15 11.105V5.383zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741zM1 11.105l4.708-2.897L1 5.383v5.722z")
                .attr("fill", "currentColor");
        }
    }, [defs]);

    // Fetch messages
    useEffect(() => {
        async function fetchMessages() {
            try {
                const allMessages = await Promise.all(
                    collaborations.map(async collab => {
                        const response = await fetch(`/api/collaborations/${collab.id}/messages`);
                        const data = await response.json();
                        return data.messages || [];
                    })
                );

                const sortedMessages = allMessages
                    .flat()
                    .filter(msg => msg && msg.senderId)
                    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

                setMessages(sortedMessages);
                setCurrentMessageIndex(0);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        }

        fetchMessages();
    }, [collaborations]);

    // Define animateMessage before using it in useEffect
    const animateMessage = useCallback((sourceId: string, targetId: string, messageId: string) => {
        const sourceNode = nodes.find(n => n.id === sourceId);
        const targetNode = nodes.find(n => n.id === targetId);

        if (!sourceNode || !targetNode) return;

        const animationsLayer = g.select('.animations-layer');
        const envelopeGroup = animationsLayer.append("g")
            .attr("class", "message-envelope")
            .style("opacity", 0);

        // Add envelope visualization
        envelopeGroup.append("use")
            .attr("href", "#envelope-icon")
            .attr("width", 16)
            .attr("height", 16)
            .attr("x", -8)
            .attr("y", -8)
            .attr("fill", "white")
            .style("opacity", 0.6)
            .style("filter", "url(#envelope-glow)");

        function createArcPath(source: { x: number, y: number }, target: { x: number, y: number }) {
            const dx = target.x - source.x;
            const dy = target.y - source.y;
            const dr = Math.sqrt(dx * dx + dy * dy);
        
            // Determine if this is a reverse direction message
            const collaboration = collaborations.find(c => 
                (c.providerSwarm.id === sourceId && c.clientSwarm.id === targetId) ||
                (c.clientSwarm.id === sourceId && c.providerSwarm.id === targetId)
            );
        
            // Use sweep flag 1 if source is provider, 0 if source is client
            const isSourceProvider = collaboration?.providerSwarm.id === sourceId;
            const sweepFlag = isSourceProvider ? "1" : "0";
        
            return `M${source.x},${source.y}A${dr},${dr} 0 0,${sweepFlag} ${target.x},${target.y}`;
        }

        const path = createArcPath(sourceNode, targetNode);
        
        // Create invisible path for animation
        const pathElement = animationsLayer.append("path")
            .attr("d", path)
            .style("display", "none");

        const pathLength = pathElement.node()?.getTotalLength() || 0;
        const duration = ANIMATION_DURATION;
        const startTime = Date.now();

        function animate() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const point = pathElement.node()?.getPointAtLength(progress * pathLength);
            if (!point) return;

            const opacity = progress < 0.1 ? progress * 10 : 
                          progress > 0.9 ? (1 - progress) * 10 : 1;

            envelopeGroup
                .attr("transform", `translate(${point.x},${point.y})`)
                .style("opacity", opacity);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                envelopeGroup.remove();
                pathElement.remove();
                setActiveMessages(prev => {
                    const next = new Set(prev);
                    next.delete(messageId);
                    return next;
                });
            }
        }

        animate();
    }, [nodes, g, collaborations]);

    // Animate messages
    useEffect(() => {
        if (!messages.length) return;
        
        const animationsLayer = g.select('.animations-layer');
        if (animationsLayer.empty()) return;

        const timer = setInterval(() => {
            if (activeMessages.size >= MAX_CONCURRENT_MESSAGES) return;

            const availableMessages = messages.filter(msg => !activeMessages.has(msg.id));
            if (availableMessages.length === 0) return;

            const message = availableMessages[Math.floor(Math.random() * availableMessages.length)];
            const possibleTargets = collaborations
                .filter(c => c.providerSwarm.id === message.senderId || c.clientSwarm.id === message.senderId)
                .map(c => c.providerSwarm.id === message.senderId ? c.clientSwarm.id : c.providerSwarm.id);

            if (possibleTargets.length) {
                const targetId = possibleTargets[Math.floor(Math.random() * possibleTargets.length)];
                setActiveMessages(prev => {
                    const next = new Set(prev);
                    next.add(message.id);
                    return next;
                });
                animateMessage(message.senderId, targetId, message.id);
            }
        }, NEW_MESSAGE_INTERVAL);

        return () => clearTimeout(timer);
    }, [messages, collaborations, nodes, g, defs, getNodeSize, activeMessages, animateMessage]);

    return null;
}
