'use client';

import { useCallback } from 'react';
import * as d3 from 'd3';
import { SimulationNode, SimulationLink } from '../types';

const getNodeId = (node: string | number | SimulationNode): string => {
    if (typeof node === 'string') return node;
    if (typeof node === 'number') return node.toString();
    return node.id;
};

export function useGraphSimulation() {
    const createSimulation = useCallback((width: number, height: number, getNodeSize: (id: string) => number) => {
        const simulation = d3.forceSimulation<SimulationNode>()
            .force("link", d3.forceLink<SimulationNode, SimulationLink>()
                .id((d: SimulationNode) => d.id)
                .strength(0.15))  // Reduce from 0.25 to 0.15
            .force("charge", d3.forceManyBody()
                .strength((d) => ((d as SimulationNode).id === 'shareholders' ? -2000 : -500)))  // Reduce from -5000/-1500 to -2000/-500
            .force("x", d3.forceX(width / 2)
                .strength(0.1))  // Increase from 0.06 to 0.1
            .force("y", d3.forceY(height / 2)
                .strength(0.1))  // Increase from 0.06 to 0.1
            .force("collision", d3.forceCollide()
                .radius((d) => {
                    const baseRadius = getNodeSize((d as SimulationNode).id);
                    return (d as SimulationNode).id === 'shareholders' ? 
                        baseRadius * 6 :  // Larger collision radius for shareholders
                        baseRadius + 35;
                })
                .strength(1.0))  // Increase from 0.8 to 1.0 for more damping
            .velocityDecay(0.7)  // Increase from 0.45 to 0.7 for more damping
            .alphaDecay(0.02)    // Increase from 0.01 to 0.02 for faster stabilization
            .alpha(0.2);         // Reduce from 0.3 to 0.2 for less initial energy

        // Fix shareholders node to center
        simulation.on("tick", () => {
            simulation.nodes().forEach(node => {
                if (node.id === 'shareholders') {
                    node.x = width / 2;
                    node.y = height / 2;
                    node.fx = width / 2; // Fix x position
                    node.fy = height / 2; // Fix y position
                }
            });
        });

        return simulation;
    }, []);

    const initializeSimulation = useCallback((
        simulation: d3.Simulation<SimulationNode, SimulationLink>,
        nodes: SimulationNode[],
        links: SimulationLink[]
    ) => {
        // Make sure all nodes have valid initial positions
        nodes.forEach(node => {
            if (!node.x || !node.y) {
                node.x = 0;
                node.y = 0;
            }
        });

        // First set the nodes
        simulation.nodes(nodes);

        // Create a Set of valid node IDs for quick lookup
        const nodeIds = new Set(nodes.map(node => node.id));

        // Filter out invalid links and convert string IDs to node references
        const validLinks = links
            .filter(link => {
                const sourceId = getNodeId(link.source);
                const targetId = getNodeId(link.target);
                
                const sourceExists = nodeIds.has(sourceId);
                const targetExists = nodeIds.has(targetId);
                
                if (!sourceExists) {
                    console.warn(`Source node not found: ${sourceId}`);
                }
                if (!targetExists) {
                    console.warn(`Target node not found: ${targetId}`);
                }
                
                return sourceExists && targetExists;
            })
            .map(link => ({
                ...link,
                source: typeof link.source === 'string' || typeof link.source === 'number' ? 
                    nodes.find(n => n.id === getNodeId(link.source))! : 
                    link.source,
                target: typeof link.target === 'string' || typeof link.target === 'number' ? 
                    nodes.find(n => n.id === getNodeId(link.target))! : 
                    link.target
            }));

        // Set the valid links
        const linkForce = simulation.force<d3.ForceLink<SimulationNode, SimulationLink>>("link");
        if (linkForce) {
            linkForce.links(validLinks);
        }
    }, []);

    const setupDragHandlers = useCallback((simulation: d3.Simulation<SimulationNode, SimulationLink>) => {
        function dragstarted(event: d3.D3DragEvent<SVGGElement, SimulationNode, unknown>) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            const transform = d3.zoomTransform(d3.select('svg').node() as Element);
            const subject = event.subject as SimulationNode;
            subject.fx = (event.x - transform.x) / transform.k;
            subject.fy = (event.y - transform.y) / transform.k;
        }

        function dragged(event: d3.D3DragEvent<SVGGElement, SimulationNode, unknown>) {
            const transform = d3.zoomTransform(d3.select('svg').node() as Element);
            const subject = event.subject as SimulationNode;
            subject.fx = (event.x - transform.x) / transform.k;
            subject.fy = (event.y - transform.y) / transform.k;
        }

        function dragended(event: d3.D3DragEvent<SVGGElement, SimulationNode, unknown>) {
            if (!event.active) simulation.alphaTarget(0);
            const subject = event.subject as SimulationNode;
            subject.fx = null;
            subject.fy = null;
        }

        return { dragstarted, dragged, dragended };
    }, []);

    return {
        createSimulation,
        initializeSimulation,
        setupDragHandlers
    };
}
