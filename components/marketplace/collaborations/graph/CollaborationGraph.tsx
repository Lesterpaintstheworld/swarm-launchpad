'use client';

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
  const [zoom, setZoom] = useState(1);
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
    // Add style for ecosystem glow animation
    const style = document.createElement('style');
    style.setAttribute('data-graph-animation', 'true');
    style.textContent = `
      @keyframes pulse {
          0% { stroke-opacity: 0.4; stroke-width: 4; }
          50% { stroke-opacity: 0.8; stroke-width: 6; }
          100% { stroke-opacity: 0.4; stroke-width: 4; }
      }
    `;
    document.head.appendChild(style);

    // Create gradients and other static elements
    const gradient = defs.append("linearGradient")
        .attr("id", "link-gradient")
        .attr("gradientUnits", "userSpaceOnUse");

    gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "rgba(147, 51, 234, 0.3)");

    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "rgba(147, 51, 234, 0.3)");

    // Set up nodes and links here...
    // (Moving the existing node and link setup code here)
  };

  useEffect(() => {
    if (!svgRef.current || isLoading || !collaborationsProp?.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Create new simulation
    const newSimulation = createSimulation(width, height, getNodeSize);
    
    // Initialize nodes in a circle layout
    const radius = Math.min(width, height) / 3;
    const angleStep = (2 * Math.PI) / nodes.length;
    
    nodes.forEach((node, i) => {
      const angle = i * angleStep;
      // Set initial positions
      node.x = width/2 + radius * Math.cos(angle);
      node.y = height/2 + radius * Math.sin(angle);
      // Add some random offset to prevent perfect circle
      node.x += (Math.random() - 0.5) * 50;
      node.y += (Math.random() - 0.5) * 50;
    });

    // Initialize simulation with nodes and links
    initializeSimulation(newSimulation, nodes as SimulationNode[], links as SimulationLink[]);
    
    // Set up the visualization
    const g = svg.append("g")
      .attr("transform", `scale(${zoom})`);
    
    const defs = svg.append("defs");

    // Set up the graph components
    setupGraph(g, defs, nodes, links, newSimulation);

    // Set up the simulation tick handler
    newSimulation.on("tick", () => {
      // Update link positions
      g.selectAll<SVGPathElement, SimulationLink>(".link-path, .link-light")
        .attr("d", function(d) {
          const source = d.source as SimulationNode;
          const target = d.target as SimulationNode;
          const dx = target.x - source.x;
          const dy = target.y - source.y;
          const dr = Math.sqrt(dx * dx + dy * dy);
          return `M${source.x},${source.y}A${dr},${dr} 0 0,1 ${target.x},${target.y}`;
        });

      // Update node positions
      g.selectAll<SVGGElement, SimulationNode>(".nodes g")
        .attr("transform", function(d) {
          return `translate(${d.x || 0},${d.y || 0})`;
        });
    });

    // Update simulation reference
    setSimulation(newSimulation);

    return () => {
      newSimulation.stop();
      svg.selectAll("*").remove();
      d3.select("body").selectAll(".graph-tooltip").remove();
      const pulseStyle = document.querySelector('style[data-graph-animation]');
      if (pulseStyle) {
        pulseStyle.remove();
      }
    };
  }, [collaborationsProp, isLoading, zoom, nodes, links, getNodeSize]);

  // Cleanup effect for simulation
  useEffect(() => {
    return () => {
      if (simulation) {
        simulation.stop();
        setSimulation(null);
      }
    };
  }, [simulation]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

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
        style={{ minHeight: '600px' }}
      />
      <GraphControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
    </div>
  );
}
