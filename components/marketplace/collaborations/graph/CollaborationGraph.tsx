'use client';

const graphStyles = {
  cursor: 'grab',
  ':active': {
    cursor: 'grabbing'
  }
};

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import ReactDOMServer from 'react-dom/server';
import { GraphTooltip } from './components/GraphTooltip';
import { CollaborationGraphProps, SimulationNode, SimulationLink } from './types';
import { useGraphData } from './hooks/useGraphData';
import { useGraphSimulation } from './hooks/useGraphSimulation';
import { processCollaborations, calculateLinkWidth } from './utils/graphCalculations';
import { GraphControls } from './components/GraphControls';
import { GraphNodes } from './components/GraphNodes';

export function CollaborationGraph({ collaborations: collaborationsProp }: CollaborationGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { swarms, swarmMap, isLoading } = useGraphData();
  const [simulation, setSimulation] = useState<d3.Simulation<SimulationNode, SimulationLink> | null>(null);
  const { createSimulation, initializeSimulation, setupDragHandlers } = useGraphSimulation();

  const { nodes, links, ecosystemTargets, maxPrice, minPrice } = useMemo(() => {
    if (!collaborationsProp?.length) {
      return { nodes: [], links: [], ecosystemTargets: new Set(), maxPrice: 0, minPrice: 0 };
    }
    return processCollaborations(collaborationsProp);
  }, [collaborationsProp]);

  const calculateWidth = useCallback((value: number) => {
    return calculateLinkWidth(value, minPrice, maxPrice);
  }, [minPrice, maxPrice]);
  
  const memoizedHandlers = useMemo(() => ({
    dragstarted: (event: d3.D3DragEvent<SVGGElement, SimulationNode, unknown>) => {
      if (!event.active && simulation) simulation.alphaTarget(0.3).restart();
      const subject = event.subject as SimulationNode;
      subject.fx = subject.x;
      subject.fy = subject.y;
    },
    dragged: (event: d3.D3DragEvent<SVGGElement, SimulationNode, unknown>) => {
      const subject = event.subject as SimulationNode;
      subject.fx = event.x;
      subject.fy = event.y;
    },
    dragended: (event: d3.D3DragEvent<SVGGElement, SimulationNode, unknown>) => {
      if (!event.active && simulation) simulation.alphaTarget(0);
      const subject = event.subject as SimulationNode;
      subject.fx = null;
      subject.fy = null;
    }
  }), [simulation]);
  const getNodeSize = useCallback((swarmId: string): number => {
    const swarm = swarmMap.get(swarmId);
    if (!swarm?.multiple) return 30;
    return Math.max(25, Math.min(40, 25 + (swarm.multiple * 0.2)));
  }, [swarmMap]);


  const setupGraph = (
    g: d3.Selection<SVGGElement, unknown, null, undefined>,
    defs: d3.Selection<SVGDefsElement, unknown, null, undefined>,
    nodes: SimulationNode[],
    links: SimulationLink[],
    simulation: d3.Simulation<SimulationNode, SimulationLink>
  ) => {
    // Add gradient definitions
    const gradient = defs.append("linearGradient")
      .attr("id", "link-gradient")
      .attr("gradientUnits", "userSpaceOnUse");

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "rgba(147, 51, 234, 0.3)");

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "rgba(147, 51, 234, 0.3)");

    // Create links
    const linkGroup = g.append("g")
      .attr("class", "links");

    linkGroup.selectAll("path")
      .data(links)
      .join("path")
      .attr("class", "link-path")
      .attr("stroke", "url(#link-gradient)")
      .attr("stroke-width", d => calculateWidth(d.value))
      .attr("stroke-opacity", 1)
      .attr("fill", "none");

    // Create nodes
    const nodeGroup = g.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag<any, SimulationNode>()
        .on("start", memoizedHandlers.dragstarted)
        .on("drag", memoizedHandlers.dragged)
        .on("end", memoizedHandlers.dragended) as any);

    // Add node visuals
    nodeGroup.append("circle")
      .attr("r", d => getNodeSize(d.id))
      .attr("fill", "rgba(236, 72, 153, 0.2)")
      .attr("stroke", "rgba(236, 72, 153, 0.5)")
      .attr("stroke-width", 3);

    nodeGroup.append("image")
      .attr("xlink:href", d => d.image)
      .attr("x", d => -getNodeSize(d.id))
      .attr("y", d => -getNodeSize(d.id))
      .attr("width", d => getNodeSize(d.id) * 2)
      .attr("height", d => getNodeSize(d.id) * 2)
      .attr("clip-path", d => `circle(${getNodeSize(d.id)}px)`);

    nodeGroup.append("text")
      .text(d => d.name)
      .attr("text-anchor", "middle")
      .attr("dy", d => getNodeSize(d.id) + 20)
      .attr("fill", "white")
      .attr("font-size", "12px");

    // Set up simulation tick handler
    simulation.on("tick", () => {
      linkGroup.selectAll("path")
        .attr("d", (d: any) => {
          const dx = (d.target.x || 0) - (d.source.x || 0);
          const dy = (d.target.y || 0) - (d.source.y || 0);
          const dr = Math.sqrt(dx * dx + dy * dy);
          return `M${d.source.x || 0},${d.source.y || 0}A${dr},${dr} 0 0,1 ${d.target.x || 0},${d.target.y || 0}`;
        });

      nodeGroup.attr("transform", (d: any) => `translate(${d.x || 0},${d.y || 0})`);
    });
  };

  useEffect(() => {
    if (!svgRef.current || isLoading || !collaborationsProp?.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Create container group for all elements
    const g = svg.append("g")
        .attr("class", "graph-container");
    
    const defs = svg.append("defs");

    // Create zoom behavior
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 4])
        .on('zoom', (event) => {
            g.attr('transform', event.transform);
        });

    // Apply zoom to svg
    svg.call(zoomBehavior);

    // Create new simulation
    const newSimulation = createSimulation(width, height, getNodeSize);
    
    // Initialize nodes positions in the center
    nodes.forEach(node => {
        node.x = width / 2;
        node.y = height / 2;
    });

    // Initialize simulation with nodes and links
    initializeSimulation(newSimulation, nodes, links);

    // Set up the graph components
    setupGraph(g, defs, nodes, links, newSimulation);

    // Center the view
    const initialTransform = d3.zoomIdentity
        .translate(0, 0)
        .scale(0.8);
    svg.call(zoomBehavior.transform, initialTransform);

    // Update simulation reference
    setSimulation(newSimulation);

    // Add some initial force to spread nodes
    newSimulation.alpha(1).restart();

    return () => {
        newSimulation.stop();
        svg.selectAll("*").remove();
    };
  }, [collaborationsProp, isLoading, nodes, links, getNodeSize, initializeSimulation, createSimulation]);

  // Cleanup effect for simulation
  useEffect(() => {
    return () => {
      if (simulation) {
        simulation.stop();
        setSimulation(null);
      }
    };
  }, [simulation]);


  if (isLoading) {
    return (
      <div className="w-full h-[600px] bg-black/20 rounded-xl flex items-center justify-center">
        <div className="text-white/60">Loading collaboration graph...</div>
      </div>
    );
  }

  return (
    <div className="relative">
      <svg 
        ref={svgRef} 
        className="w-full h-[600px] bg-black/20 rounded-xl"
        style={{ 
          minHeight: '600px',
          ...graphStyles
        }}
      />
    </div>
  );
}
