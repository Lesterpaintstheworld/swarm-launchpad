'use client';

import { useCallback } from 'react';
import * as d3 from 'd3';
import { SimulationNode, SimulationLink } from '../types';

export function useGraphSimulation() {
    const createSimulation = useCallback((width: number, height: number, getNodeSize: (id: string) => number) => {
        const simulation = d3.forceSimulation<SimulationNode>()
            .force("link", d3.forceLink<SimulationNode, SimulationLink>()
                .id((d: SimulationNode) => d.id)
                .strength(0.35))
            .force("charge", d3.forceManyBody()
                .strength(-800))
            .force("x", d3.forceX(width / 2).strength(0.08))
            .force("y", d3.forceY(height / 2).strength(0.08))
            .force("collision", d3.forceCollide()
                .radius((d: any) => getNodeSize((d as SimulationNode).id) + 35)
                .strength(0.8))
            .velocityDecay(0.4)
            .alphaDecay(0.01)
            .alpha(0.3);

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
