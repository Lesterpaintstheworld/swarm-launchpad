'use client';

import { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { SimulationNode } from '../types';

interface TransferAnimationsProps {
    g: d3.Selection<SVGGElement, unknown, null, undefined>;
    defs: d3.Selection<SVGDefsElement, unknown, null, undefined>;
    nodes: SimulationNode[];
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

        const timer = setInterval(() => {
            if (activeTransfers.size >= MAX_CONCURRENT_TRANSFERS) return;
            
            const availableCollaborations = collaborations.filter(
                collab => !activeTransfers.has(collab.id)
            );
            
            if (availableCollaborations.length > 0) {
                const collaboration = availableCollaborations[
                    Math.floor(Math.random() * availableCollaborations.length)
                ];
                
                setActiveTransfers(prev => {
                    const next = new Set(prev);
                    next.add(collaboration.id);
                    return next;
                });
                
                animateTransfer(
                    collaboration.clientSwarm.id,
                    collaboration.providerSwarm.id,
                    collaboration.price,
                    collaboration.id
                );
            }
        }, NEW_TRANSFER_INTERVAL);

        return () => clearInterval(timer);
    }, [activeTransfers, collaborations, nodes, g, defs, getNodeSize]);

    const animateTransfer = (sourceId: string, targetId: string, amount: number, transferId: string) => {
        const sourceNode = nodes.find(n => n.id === sourceId);
        const targetNode = nodes.find(n => n.id === targetId);

        if (!sourceNode || !targetNode) return;

        const animationsLayer = g.select('.animations-layer');
        const numberOfDollars = Math.max(1, Math.floor(amount / 10000));
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

            // Create metallic violet circle
            dollarGroup.append("circle")
                .attr("r", 3)  // 4 times smaller
                .attr("fill", "url(#violet-metallic-gradient)")  // Use gradient fill
                .attr("stroke", "#a855f7")  // Violet stroke
                .attr("stroke-width", 1);  // Thinner stroke for smaller circle

            // Add the gradient definition if it doesn't exist
            if (!defs.select("#violet-metallic-gradient").size()) {
                const gradient = defs.append("radialGradient")
                    .attr("id", "violet-metallic-gradient")
                    .attr("gradientUnits", "objectBoundingBox")
                    .attr("cx", "0.5")
                    .attr("cy", "0.5")
                    .attr("r", "0.5");

                // Metallic effect with violet colors
                gradient.append("stop")
                    .attr("offset", "0%")
                    .attr("stop-color", "#c4b5fd");  // Light violet

                gradient.append("stop")
                    .attr("offset", "50%")
                    .attr("stop-color", "#8b5cf6");  // Medium violet

                gradient.append("stop")
                    .attr("offset", "100%")
                    .attr("stop-color", "#6d28d9");  // Dark violet
            }

            activeDollars++;

            function animateSingleDollar() {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Calculate opacity for fade in/out
                const opacity = progress < 0.1 ? progress * 10 : 
                              progress > 0.9 ? (1 - progress) * 10 : 1;

                // Calculate position along the path
                const point = pathElement.node()?.getPointAtLength(progress * pathLength);
                
                if (point) {
                    dollarGroup
                        .attr("transform", `translate(${point.x},${point.y})`)
                        .style("opacity", opacity);
                }

                if (progress < 1) {
                    requestAnimationFrame(animateSingleDollar);
                } else {
                    dollarGroup.remove();
                    activeDollars--;
                    
                    // If this was the last dollar, clean up
                    if (activeDollars === 0) {
                        pathElement.remove();
                        setActiveTransfers(prev => {
                            const next = new Set(prev);
                            next.delete(transferId);
                            return next;
                        });
                    }
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
