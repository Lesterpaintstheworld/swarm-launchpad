'use client';

import { useCallback } from 'react';
import * as d3 from 'd3';
import { SimulationNode, SimulationLink } from '../types';

export function useGraphSimulation() {
    const createSimulation = useCallback((width: number, height: number, getNodeSize: (id: string) => number) => {
        const simulation = d3.forceSimulation<SimulationNode>()
            .force("link", d3.forceLink<SimulationNode, SimulationLink>()
                .id((d: SimulationNode) => d.id)
                .strength((d: SimulationLink) => d.strength * 0.1))
            .force("charge", d3.forceManyBody().strength(-200))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collision", d3.forceCollide().radius((d: d3.SimulationNodeDatum) => {
                const node = d as SimulationNode;
                return getNodeSize(node.id) + 10;
            }));

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
