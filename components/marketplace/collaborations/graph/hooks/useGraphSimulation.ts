'use client';

import { useCallback } from 'react';
import * as d3 from 'd3';
import { SimulationNode, SimulationLink } from '../types';

export function useGraphSimulation() {
    const createSimulation = useCallback((width: number, height: number, getNodeSize: (id: string) => number) => {
        const simulation = d3.forceSimulation<SimulationNode>()
            .force("link", d3.forceLink<SimulationNode, SimulationLink>()
                .id((d: SimulationNode) => d.id)
                .strength(0.1))  // Reduced link strength further
            .force("charge", d3.forceManyBody()
                .strength(-600)  // Increased repulsion
                .distanceMax(Math.min(width, height)))  // Increased distance
            .force("x", d3.forceX(width / 2).strength(0.02))  // Reduced x-positioning force
            .force("y", d3.forceY(height / 2).strength(0.02))  // Reduced y-positioning force
            .force("collision", d3.forceCollide()
                .radius(d => getNodeSize(d.id) + 40)  // Increased padding
                .strength(0.8))  // Increased collision strength
            .velocityDecay(0.6)  // Keep same damping
            .alphaDecay(0.02);   // Keep same cooling

        return simulation;
    }, []);

    const initializeSimulation = useCallback((
        simulation: d3.Simulation<SimulationNode, SimulationLink>,
        nodes: SimulationNode[],
        links: SimulationLink[]
    ) => {
        simulation.nodes(nodes);
        const linkForce = simulation.force<d3.ForceLink<SimulationNode, SimulationLink>>("link");
        if (linkForce) {
            linkForce.links(links);
        }
    }, []);

    const setupDragHandlers = useCallback((simulation: d3.Simulation<SimulationNode, SimulationLink>) => {
        function dragstarted(event: d3.D3DragEvent<SVGGElement, SimulationNode, unknown>) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            const subject = event.subject as SimulationNode;
            subject.fx = subject.x;
            subject.fy = subject.y;
        }

        function dragged(event: d3.D3DragEvent<SVGGElement, SimulationNode, unknown>) {
            const subject = event.subject as SimulationNode;
            subject.fx = event.x;
            subject.fy = event.y;
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
