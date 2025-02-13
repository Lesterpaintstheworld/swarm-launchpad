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

        const tokenGroup = g.append("g")
            .attr("class", "token-transfer")
            .style("opacity", 0);

        // Add token visualization
        tokenGroup.append("circle")
            .attr("r", 12)
            .attr("fill", "#2563eb")
            .attr("stroke", "#60a5fa")
            .attr("stroke-width", 2);

        tokenGroup.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "0.3em")
            .attr("fill", "white")
            .attr("font-size", "12px")
            .text("$");

        // Calculate the path data for the curve
        const dx = targetNode.x - sourceNode.x;
        const dy = targetNode.y - sourceNode.y;
        const dr = Math.sqrt(dx * dx + dy * dy);
        const path = `M${sourceNode.x},${sourceNode.y}A${dr},${dr} 0 0,0 ${targetNode.x},${targetNode.y}`;
        
        // Create a path element for the token to follow (invisible)
        const pathElement = g.append("path")
            .attr("d", path)
            .style("display", "none");

        // Get the total length of the path
        const pathLength = pathElement.node()?.getTotalLength() || 0;

        // Animate the token
        const duration = ANIMATION_DURATION;
        const startTime = Date.now();

        function animate() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Get the point at the current position along the path
            const point = pathElement.node()?.getPointAtLength(progress * pathLength);
            if (!point) return;

            const opacity = progress < 0.1 ? progress * 10 : 
                          progress > 0.9 ? (1 - progress) * 10 : 1;

            tokenGroup
                .attr("transform", `translate(${point.x},${point.y})`)
                .style("opacity", opacity);

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

        animate();
    };

    return null;
}
