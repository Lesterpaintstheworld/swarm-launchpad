'use client';

import { useEffect, useCallback } from 'react';
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
    const createMessageMap = useCallback(() => {
        const messageMap = new Map<string, string[]>();
        collaborations.forEach(collab => {
            // For provider swarm
            if (!messageMap.has(collab.providerSwarm.id)) {
                messageMap.set(collab.providerSwarm.id, []);
            }
            messageMap.get(collab.providerSwarm.id)?.push(collab.clientSwarm.id);

            // For client swarm
            if (!messageMap.has(collab.clientSwarm.id)) {
                messageMap.set(collab.clientSwarm.id, []);
            }
            messageMap.get(collab.clientSwarm.id)?.push(collab.providerSwarm.id);
        });
        return messageMap;
    }, [collaborations]);

    const setupGlowFilter = useCallback(() => {
        return defs.append("filter")
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
    }, [defs]);

    const createNodePositionsMap = useCallback(() => {
        return new Map(nodes.map(node => [
            node.id, {
                x: node.x,
                y: node.y,
                size: getNodeSize(node.id)
            }
        ]));
    }, [nodes, getNodeSize]);

    useEffect(() => {
        // Add envelope path to defs if not already present
        if (!defs.select("#envelope-icon").size()) {
            defs.append("path")
                .attr("id", "envelope-icon")
                .attr("d", "M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383-4.708 2.825L15 11.105V5.383zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741zM1 11.105l4.708-2.897L1 5.383v5.722z")
                .attr("fill", "currentColor");
        }

        const messageMap = createMessageMap();
        const glowFilter = setupGlowFilter();
        const nodePositions = createNodePositionsMap();

        function fetchAndAnimateMessages() {
            Promise.all(collaborations.map(collab => 
                fetch(`/api/collaborations/${collab.id}/messages`)
                    .then(res => res.json())
                    .then(data => data.messages)
            ))
            .then(messagesArrays => {
                const allMessages = messagesArrays.flat()
                    .filter(msg => msg && msg.senderId)
                    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                    .slice(-100);

                if (allMessages.length > 0) {
                    animateMessageBatches(allMessages, messageMap, nodePositions, g);
                }
            })
            .catch(error => {
                console.error('Error fetching messages:', error);
            });
        }

        fetchAndAnimateMessages();

        return () => {
            g.selectAll(".message-envelope").remove();
            g.selectAll("filter[id^='envelope-glow']").remove();
            const highestId = window.requestAnimationFrame(() => {});
            for (let i = 0; i < highestId; i++) {
                window.cancelAnimationFrame(i);
            }
        };
    }, [g, defs, collaborations, createMessageMap, setupGlowFilter, createNodePositionsMap]);

    return null;
}

function animateMessageBatches(
    messages: Array<{senderId: string, timestamp: string}>,
    messageMap: Map<string, string[]>,
    nodePositions: Map<string, {x: number, y: number, size: number}>,
    g: d3.Selection<SVGGElement, unknown, null, undefined>
) {
    if (!messages || !messages.length) return;  // Add safety check

    const batchSize = 10;
    let activeAnimations = 0;

    for(let i = 0; i < messages.length; i += batchSize) {
        const batch = messages.slice(i, i + batchSize);
        
        batch.forEach((message, index) => {
            const possibleTargets = messageMap.get(message.senderId);
            if (!possibleTargets || possibleTargets.length === 0) return;
            
            const targetId = possibleTargets[Math.floor(Math.random() * possibleTargets.length)];
            if (!targetId) return;

            const sourcePos = nodePositions.get(message.senderId);
            const targetPos = nodePositions.get(targetId);
            
            if (!sourcePos || !targetPos) return;

            setTimeout(() => {
                activeAnimations++;
                
                const dx = targetPos.x - sourcePos.x;
                const dy = targetPos.y - sourcePos.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                const startX = sourcePos.x + (dx / distance * sourcePos.size);
                const startY = sourcePos.y + (dy / distance * sourcePos.size);
                const endX = targetPos.x - (dx / distance * targetPos.size);
                const endY = targetPos.y - (dy / distance * targetPos.size);
                
                const pathData = `
                    M ${startX} ${startY}
                    Q ${(startX + endX) / 2} ${(startY + endY) / 2 - distance * 0.2},
                      ${endX} ${endY}
                `;

                const tempPath = g.append("path")
                    .attr("d", pathData)
                    .style("display", "none");

                const pathLength = tempPath.node()?.getTotalLength() || 0;
                
                const envelopeGroup = g.append("g")
                    .attr("class", "message-envelope")
                    .style("opacity", 0);

                envelopeGroup.html(`
                    <use href="#envelope-icon" width="32" height="32" fill="white" style="filter:url(#envelope-glow)"/>
                    <use href="#envelope-icon" width="32" height="32" fill="white"/>
                `);

                const animationDuration = 2500;
                const staggerDelay = (index % batchSize) * 200;
                
                let startTime: number | null = null;
                let animationFrame: number;
                
                function animate(timestamp: number) {
                    if (!startTime) startTime = timestamp + staggerDelay;
                    const progress = Math.max(0, (timestamp - startTime) / animationDuration);

                    if (progress < 1) {
                        const t = progress;
                        const point = tempPath.node()?.getPointAtLength(t * pathLength);
                        
                        if (point) {
                            const nextPoint = tempPath.node()?.getPointAtLength(Math.min(pathLength, (t + 0.01) * pathLength));
                            const angle = nextPoint ? Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * 180 / Math.PI : 0;
                            
                            const jitter = Math.sin(progress * Math.PI * 4) * 2;
                            
                            envelopeGroup
                                .attr("transform", `translate(${point.x - 16 + jitter},${point.y - 16}) rotate(${angle}, 16, 16)`)
                                .style("opacity", t < 0.1 ? t * 10 : t > 0.9 ? (1 - t) * 10 : 1);
                            
                            animationFrame = requestAnimationFrame(animate);
                        }
                    } else {
                        tempPath.remove();
                        envelopeGroup.remove();
                        activeAnimations--;

                        if (activeAnimations === 0) {
                            setTimeout(() => {
                                animateMessageBatches(messages, messageMap, nodePositions, g);
                            }, 500);
                        }
                    }
                }

                animationFrame = requestAnimationFrame(animate);
            }, Math.floor(i / batchSize) * 1000);
        });
    }
}
