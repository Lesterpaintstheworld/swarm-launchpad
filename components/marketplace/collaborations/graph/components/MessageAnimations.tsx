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

interface Message {
    id: string;
    senderId: string;
    timestamp: string;
}

export function MessageAnimations({ g, defs, nodes, collaborations, getNodeSize }: MessageAnimationsProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    // Fetch messages
    useEffect(() => {
        const fetchMessages = async () => {
            console.log('🚀 Starting message fetch');
            console.log('Collaborations:', collaborations);

            try {
                // Test with one collaboration first
                const testCollab = collaborations[0];
                console.log('Testing first collab:', testCollab);
                
                const testResponse = await fetch(`/api/collaborations/${testCollab.id}/messages`);
                const testData = await testResponse.json();
                console.log('Test response data:', testData);

                // Now fetch all messages
                const allMessages = await Promise.all(
                    collaborations.map(async collab => {
                        try {
                            const response = await fetch(`/api/collaborations/${collab.id}/messages`);
                            const data = await response.json();
                            console.log(`Messages for collab ${collab.id}:`, data);
                            return data.messages || [];
                        } catch (err) {
                            console.error(`Error fetching messages for collab ${collab.id}:`, err);
                            return [];
                        }
                    })
                );

                // Log the results
                console.log('All messages fetched:', {
                    totalArrays: allMessages.length,
                    totalMessages: allMessages.reduce((acc, arr) => acc + arr.length, 0)
                });

                // Process messages
                const sortedMessages = allMessages
                    .flat()
                    .filter(msg => msg && msg.senderId);

                console.log('Messages after filtering:', sortedMessages);

                if (sortedMessages.length > 0) {
                    setMessages(sortedMessages);
                    setCurrentMessageIndex(0);
                    console.log('Set initial messages:', {
                        count: sortedMessages.length,
                        first: sortedMessages[0],
                        last: sortedMessages[sortedMessages.length - 1]
                    });
                } else {
                    console.log('No messages to display');
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();
    }, [collaborations]);

    // Animate messages
    useEffect(() => {
        console.log('Animation effect running:', {
            messagesCount: messages.length,
            currentIndex: currentMessageIndex,
            hasNodes: nodes.length,
            hasG: !!g,
            hasDefs: !!defs
        });

        if (!messages.length || currentMessageIndex >= messages.length) {
            console.log('No messages to animate or reached end');
            return;
        }

        // Create message map for finding valid receivers
        const messageMap = new Map<string, string[]>();
        collaborations.forEach(collab => {
            if (!messageMap.has(collab.providerSwarm.id)) {
                messageMap.set(collab.providerSwarm.id, []);
            }
            messageMap.get(collab.providerSwarm.id)?.push(collab.clientSwarm.id);

            if (!messageMap.has(collab.clientSwarm.id)) {
                messageMap.set(collab.clientSwarm.id, []);
            }
            messageMap.get(collab.clientSwarm.id)?.push(collab.providerSwarm.id);
        });

        // Add envelope icon if not already present
        if (!defs.select("#envelope-icon").size()) {
            defs.append("path")
                .attr("id", "envelope-icon")
                .attr("d", "M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383-4.708 2.825L15 11.105V5.383zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741zM1 11.105l4.708-2.897L1 5.383v5.722z")
                .attr("fill", "currentColor");
        }

        // Add glow filter
        const glowFilter = defs.append("filter")
            .attr("id", "envelope-glow")
            .attr("width", "300%")
            .attr("height", "300%")
            .attr("x", "-100%")
            .attr("y", "-100%")
            .html(`
                <feGaussianBlur stdDeviation="2" result="blur"/>
                <feFlood flood-color="#fff" flood-opacity="0.3"/>
                <feComposite in2="blur" operator="in"/>
                <feMerge>
                    <feMergeNode/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            `);

        const animateMessage = () => {
            const message = messages[currentMessageIndex];
            const possibleTargets = messageMap.get(message.senderId);
            
            if (possibleTargets?.length) {
                const targetId = possibleTargets[Math.floor(Math.random() * possibleTargets.length)];
                
                const sourceNode = nodes.find(n => n.id === message.senderId);
                const targetNode = nodes.find(n => n.id === targetId);

                if (sourceNode && targetNode) {
                    const envelopeGroup = g.append("g")
                        .attr("class", "message-envelope")
                        .style("opacity", 0);

                    envelopeGroup.html(`
                        <use href="#envelope-icon" width="32" height="32" fill="white" style="filter:url(#envelope-glow)"/>
                        <use href="#envelope-icon" width="32" height="32" fill="white"/>
                    `);

                    const dx = targetNode.x - sourceNode.x;
                    const dy = targetNode.y - sourceNode.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    const duration = 1000; // 1 second animation
                    const startTime = Date.now();

                    function animate() {
                        const now = Date.now();
                        const elapsed = now - startTime;
                        const progress = Math.min(elapsed / duration, 1);

                        const x = sourceNode.x + dx * progress;
                        const y = sourceNode.y + dy * progress;
                        const angle = Math.atan2(dy, dx) * 180 / Math.PI;

                        envelopeGroup
                            .attr("transform", `translate(${x - 16},${y - 16}) rotate(${angle}, 16, 16)`)
                            .style("opacity", progress < 0.1 ? progress * 10 : progress > 0.9 ? (1 - progress) * 10 : 1);

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        } else {
                            envelopeGroup.remove();
                            setCurrentMessageIndex(i => i + 1);
                        }
                    }

                    animate();
                }
            }
        };

        // Animate current message and schedule next one
        const timer = setTimeout(() => {
            animateMessage();
        }, 333); // ~3 messages per second

        return () => {
            clearTimeout(timer);
            g.selectAll(".message-envelope").remove();
        };
    }, [messages, currentMessageIndex, g, defs, nodes, collaborations, getNodeSize]);

    return null;
}
