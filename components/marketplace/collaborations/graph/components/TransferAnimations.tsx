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
        const dollarSpacing = 0.05; // Spacing between dollars along the path (as a fraction of path length)
        const dollarAppearInterval = 100; // Time between each dollar appearing (milliseconds)

        // Create a group for all dollar signs
        const tokenGroup = animationsLayer.append("g")
            .attr("class", "token-transfer")
            .style("opacity", 0);

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
        const startTime = Date.now();
        let dollarSigns: d3.Selection<SVGGElement, unknown, null, undefined>[] = [];

        // Create and animate dollar signs one by one
        function addNextDollar(index: number) {
            if (index >= numberOfDollars) return;

            const dollarGroup = tokenGroup.append("g");

            dollarGroup.append("circle")
                .attr("r", 12)
                .attr("fill", "#2563eb")
                .attr("stroke", "#60a5fa")
                .attr("stroke-width", 2);

            dollarGroup.append("text")
                .attr("text-anchor", "middle")
                .attr("dy", "0.3em")
                .attr("fill", "white")
                .attr("font-size", "12px")
                .text("$");

            dollarSigns.push(dollarGroup);

            if (index < numberOfDollars - 1) {
                setTimeout(() => addNextDollar(index + 1), dollarAppearInterval);
            }
        }

        function animate() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Calculate base opacity for the whole group
            const groupOpacity = progress < 0.1 ? progress * 10 : 
                               progress > 0.9 ? (1 - progress) * 10 : 1;

            tokenGroup.style("opacity", groupOpacity);

            // Update position for each dollar sign
            dollarSigns.forEach((dollarSign, index) => {
                // Calculate offset position for each dollar
                const dollarProgress = Math.max(0, Math.min(1, progress - (index * dollarSpacing)));
                const point = pathElement.node()?.getPointAtLength(dollarProgress * pathLength);
                
                if (point) {
                    dollarSign.attr("transform", `translate(${point.x},${point.y})`);
                }
            });

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                tokenGroup.remove();
                pathElement.remove();
                setActiveTransfers(prev => {
                    const next = new Set(prev);
                    next.delete(transferId);
                    return next;
                });
            }
        }

        // Start the animation and begin adding dollar signs
        animate();
        addNextDollar(0);
    };

    return null;
}
