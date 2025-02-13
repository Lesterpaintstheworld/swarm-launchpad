'use client';

import { useEffect, useState, useCallback } from 'react';
const frameCallbacks = new Set<() => void>();
const globalAnimationFrame = () => {
    frameCallbacks.forEach(cb => cb());
    if (frameCallbacks.size > 0) {
        requestAnimationFrame(globalAnimationFrame);
    }
};
import * as d3 from 'd3';
import { SimulationNode } from '../types';

interface TransferAnimationsProps {
    g: d3.Selection<SVGGElement, unknown, null, undefined>;
    defs: d3.Selection<SVGDefsElement, unknown, null, undefined>;
    nodes: SimulationNode[];
    links: SimulationLink[];
    collaborations: Array<{
        id: string;
        providerSwarm: { id: string };
        clientSwarm: { id: string };
        price: number;
    }>;
    getNodeSize: (id: string) => number;
}

export function TransferAnimations({ g, defs, nodes, collaborations, getNodeSize }: TransferAnimationsProps) {
    const [activeTransfers, setActiveTransfers] = useState<Set<string>>(new Set());
    const MAX_CONCURRENT_TRANSFERS = 8;
    const ANIMATION_DURATION = 5000;
    const NEW_TRANSFER_INTERVAL = 800;

    useEffect(() => {
        const animationsLayer = g.select('.animations-layer');
        if (animationsLayer.empty()) return;

        // Get all links that are revenue flows
        const revenueFlows = links.filter((link: any) => link.isRevenueFlow);
        
        const timer = setInterval(() => {
            if (activeTransfers.size >= MAX_CONCURRENT_TRANSFERS) return;
            
            // Randomly choose between regular collaborations and revenue flows
            const shouldAnimateRevenue = Math.random() < 0.3; // 30% chance for revenue flows
            
            let availableTransfers;
            if (shouldAnimateRevenue) {
                availableTransfers = revenueFlows.filter(
                    flow => !activeTransfers.has(flow.source + '-revenue')
                );
            } else {
                availableTransfers = collaborations.filter(
                    collab => !activeTransfers.has(collab.id)
                );
            }
            
            if (availableTransfers.length > 0) {
                const transfer = availableTransfers[
                    Math.floor(Math.random() * availableTransfers.length)
                ];
                
                if (shouldAnimateRevenue) {
                    const transferId = transfer.source + '-revenue';
                    setActiveTransfers(prev => {
                        const next = new Set(prev);
                        next.add(transferId);
                        return next;
                    });
                    
                    animateTransfer(
                        transfer.source,
                        'shareholders',
                        transfer.value,
                        transferId
                    );
                } else {
                    setActiveTransfers(prev => {
                        const next = new Set(prev);
                        next.add(transfer.id);
                        return next;
                    });
                    
                    animateTransfer(
                        transfer.clientSwarm.id,
                        transfer.providerSwarm.id,
                        transfer.price,
                        transfer.id
                    );
                }
            }
        }, NEW_TRANSFER_INTERVAL);

        return () => clearInterval(timer);
    }, [activeTransfers, collaborations, nodes, g, defs, getNodeSize, links]);

    const animateTransfer = (sourceId: string, targetId: string, amount: number, transferId: string) => {
        const sourceNode = nodes.find(n => n.id === sourceId);
        const targetNode = nodes.find(n => n.id === targetId);

        if (!sourceNode || !targetNode) return;

        const animationsLayer = g.select('.animations-layer');
        // Check if this is a revenue flow (transfer to shareholders)
        const isRevenueFlow = targetId === 'shareholders';
        
        const numberOfDollars = isRevenueFlow ? 
            Math.max(1, Math.floor(amount / 1000)) : // More frequent tokens for revenue
            Math.max(1, Math.floor(amount / 10000)); // Regular token frequency
        const dollarSpacing = 0.05; // Spacing between dollars along the path
        const dollarAppearInterval = 100; // Time between each dollar appearing

        function createArcPath(source: { x: number, y: number }, target: { x: number, y: number }, isReverse: boolean) {
            const dx = target.x - source.x;
            const dy = target.y - source.y;
            const dr = Math.sqrt(dx * dx + dy * dy);
            const sweepFlag = isReverse ? "0" : "1";
            return `M${source.x},${source.y}A${dr},${dr} 0 0,${sweepFlag} ${target.x},${target.y}`;
        }

        const path = createArcPath(sourceNode, targetNode, true);
        const pathElement = animationsLayer.append("path")
            .attr("d", path)
            .style("display", "none");

        const pathLength = pathElement.node()?.getTotalLength() || 0;
        const duration = ANIMATION_DURATION;
        let activeDollars = 0;

        // Create and animate a single dollar sign
        function animateDollar(index: number) {
            const startTime = Date.now();
            const dollarGroup = animationsLayer.append("g")
                .attr("class", "token-transfer")
                .style("opacity", 0);

            // Create just the token circle, no background circle needed
            dollarGroup.append("circle")
                .attr("r", 3)
                .attr("fill", "#8b5cf6")  // Solid violet color
                .attr("stroke", "#a855f7")
                .attr("stroke-width", 1);

            // Add flame gradient if it doesn't exist
            if (!defs.select("#flame-gradient").size()) {
                const flameGradient = defs.append("radialGradient")
                    .attr("id", "flame-gradient")
                    .attr("gradientUnits", "objectBoundingBox")
                    .attr("cx", "0.5")
                    .attr("cy", "0.5")
                    .attr("r", "0.5");

                flameGradient.append("stop")
                    .attr("offset", "0%")
                    .attr("stop-color", "#fef08a"); // Yellow

                flameGradient.append("stop")
                    .attr("offset", "50%")
                    .attr("stop-color", "#f97316"); // Orange

                flameGradient.append("stop")
                    .attr("offset", "100%")
                    .attr("stop-color", "#dc2626"); // Red
            }


            activeDollars++;

            // Should this token disappear at midpoint? (every other one)
            const shouldDisappear = index % 2 === 0;

            function animateSingleDollar() {
                const animate = () => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const point = pathElement.node()?.getPointAtLength(progress * pathLength);
                    
                    if (point) {
                        const isMidpoint = Math.abs(progress - 0.5) < 0.05;
                        
                        if (shouldDisappear && isMidpoint) {
                            const flameGroup = animationsLayer.append("g")
                                .attr("transform", `translate(${point.x},${point.y})`);

                            for (let i = 0; i < 8; i++) {
                                const angle = (i * Math.PI * 2) / 8;
                                const flameParticle = flameGroup.append("circle")
                                    .attr("r", 3)
                                    .attr("fill", "url(#flame-gradient)")
                                    .attr("opacity", 1);

                                flameParticle.transition()
                                    .duration(500)
                                    .attr("r", 1)
                                    .attr("transform", `translate(${Math.cos(angle) * 15},${Math.sin(angle) * 15})`)
                                    .style("opacity", 0)
                                    .remove();
                            }

                            dollarGroup.remove();
                            activeDollars--;
                            
                            if (activeDollars === 0) {
                                pathElement.remove();
                                setActiveTransfers(prev => {
                                    const next = new Set(prev);
                                    next.delete(transferId);
                                    return next;
                                });
                            }
                            frameCallbacks.delete(animate);
                            return false;
                        }

                        const opacity = progress < 0.1 ? progress * 10 : 
                                      progress > 0.9 ? (1 - progress) * 10 : 1;

                        dollarGroup
                            .attr("transform", `translate(${point.x},${point.y})`)
                            .style("opacity", shouldDisappear ? 
                                (progress < 0.5 ? opacity : 0) : 
                                opacity
                            );
                    }

                    if (progress < 1) {
                        return true;
                    } else {
                        dollarGroup.remove();
                        activeDollars--;
                        
                        if (activeDollars === 0) {
                            pathElement.remove();
                            setActiveTransfers(prev => {
                                const next = new Set(prev);
                                next.delete(transferId);
                                return next;
                            });
                        }
                        frameCallbacks.delete(animate);
                        return false;
                    }
                };

                frameCallbacks.add(animate);
                if (frameCallbacks.size === 1) {
                    requestAnimationFrame(globalAnimationFrame);
                }
            }

            animateSingleDollar();
        }

        // Start creating dollar signs with intervals
        for (let i = 0; i < numberOfDollars; i++) {
            setTimeout(() => animateDollar(i), i * dollarAppearInterval);
        }
    };

    return null;
}
