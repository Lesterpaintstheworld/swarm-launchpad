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
    const MAX_CONCURRENT_MESSAGES = 8;
    const ANIMATION_DURATION = 4000;
    const NEW_MESSAGE_INTERVAL = 600;

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

    // Animate messages
    useEffect(() => {
        if (!messages.length) return;

        const activeMessages = new Set<string>();

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
                activeMessages.add(message.id);
                animateMessage(message.senderId, targetId, message.id);
            }
        }, NEW_MESSAGE_INTERVAL);

        return () => clearTimeout(timer);
    }, [messages, collaborations, nodes, g, defs, getNodeSize]);

    const animateMessage = (sourceId: string, targetId: string, messageId: string) => {
        const sourceNode = nodes.find(n => n.id === sourceId);
        const targetNode = nodes.find(n => n.id === targetId);

        if (!sourceNode || !targetNode) return;

        const envelopeGroup = g.append("g")
            .attr("class", "message-envelope")
            .style("opacity", 0);

        // Add envelope visualization
        envelopeGroup.append("circle")
            .attr("r", 16)
            .attr("fill", "#1a1a1a")
            .attr("stroke", "#ffffff20")
            .attr("stroke-width", 2);

        envelopeGroup.append("use")
            .attr("href", "#envelope-icon")
            .attr("width", 20)
            .attr("height", 20)
            .attr("x", -10)
            .attr("y", -10)
            .attr("fill", "white")
            .style("filter", "url(#envelope-glow)");

        // Calculate curved path
        const dx = targetNode.x - sourceNode.x;
        const dy = targetNode.y - sourceNode.y;
        const dr = Math.sqrt(dx * dx + dy * dy);
        const path = `M${sourceNode.x},${sourceNode.y}A${dr},${dr} 0 0,1 ${targetNode.x},${targetNode.y}`;
        
        // Create invisible path for animation
        const pathElement = g.append("path")
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
                activeMessages.delete(messageId);
            }
        }

        animate();
    };

    return null;
}
