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
    const [currentTransferIndex, setCurrentTransferIndex] = useState(0);

    useEffect(() => {
        if (currentTransferIndex >= collaborations.length) {
            setCurrentTransferIndex(0);
            return;
        }

        const timer = setTimeout(() => {
            const collaboration = collaborations[currentTransferIndex];
            animateTransfer(
                collaboration.clientSwarm.id,
                collaboration.providerSwarm.id,
                collaboration.price
            );
        }, 2000);

        return () => clearTimeout(timer);
    }, [currentTransferIndex, collaborations, nodes, g, defs, getNodeSize]);

    const animateTransfer = (sourceId: string, targetId: string, amount: number) => {
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

        // Animate the token
        const duration = 1500;
        const startTime = Date.now();

        function animate() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const x = sourceNode.x + (targetNode.x - sourceNode.x) * progress;
            const y = sourceNode.y + (targetNode.y - sourceNode.y) * progress;
            const opacity = progress < 0.1 ? progress * 10 : 
                           progress > 0.9 ? (1 - progress) * 10 : 1;

            tokenGroup
                .attr("transform", `translate(${x},${y})`)
                .style("opacity", opacity);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                tokenGroup.remove();
                setCurrentTransferIndex(i => i + 1);
            }
        }

        animate();
    };

    return null;
}
