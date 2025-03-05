'use client';

function createArcPath(source: { x: number, y: number }, target: { x: number, y: number }) {
  const dx = target.x - source.x;
  const dy = target.y - source.y;
  const dr = Math.sqrt(dx * dx + dy * dy);
  return `M${source.x},${source.y}A${dr},${dr} 0 0,1 ${target.x},${target.y}`;
}

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
import { GraphLinks } from './components/GraphLinks';
import { CollaborationGraphProps, SimulationNode, SimulationLink } from './types';
import { useGraphData } from './hooks/useGraphData';
import { useGraphSimulation } from './hooks/useGraphSimulation';
import { processCollaborations, calculateLinkWidth } from './utils/graphCalculations';
import { GraphControls } from './components/GraphControls';
import { GraphNodes } from './components/GraphNodes';
import { MessageAnimations } from './components/MessageAnimations';
import { TransferAnimations } from './components/TransferAnimations';

export function CollaborationGraph({ collaborations: collaborationsProp }: CollaborationGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { swarms, swarmMap, isLoading } = useGraphData();
  const [simulation, setSimulation] = useState<d3.Simulation<SimulationNode, SimulationLink> | null>(null);
  const [g, setG] = useState<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null);
  const [defs, setDefs] = useState<d3.Selection<SVGDefsElement, unknown, null, undefined> | null>(null);
  const { createSimulation, initializeSimulation, setupDragHandlers } = useGraphSimulation();

  const { nodes, links, ecosystemTargets, maxPrice, minPrice } = useMemo(() => {
    if (!collaborationsProp?.length) {
      return { nodes: [], links: [], ecosystemTargets: new Set(), maxPrice: 0, minPrice: 0 };
    }
    return processCollaborations(collaborationsProp, swarms);
  }, [collaborationsProp, swarms]);

  const calculateWidth = useCallback((value: number) => {
    return calculateLinkWidth(value, minPrice, maxPrice);
  }, [minPrice, maxPrice]);
  
  const getNodeSize = useCallback((swarmId: string): number => {
    const swarm = swarmMap.get(swarmId);
    if (!swarm?.multiple) return 30;
    return Math.max(25, Math.min(40, 25 + (swarm.multiple * 0.2)));
  }, [swarmMap]);

  // Add debug logging to help identify issues
  useEffect(() => {
    console.log('Collaboration props:', collaborationsProp);
    console.log('Nodes:', nodes);
    console.log('Links:', links);
  }, [collaborationsProp, nodes, links]);

  useEffect(() => {
    if (!svgRef.current || isLoading) return;

    console.log('Setting up graph with nodes:', nodes.length, 'links:', links.length);

    // Store these values to avoid recreating them on each render
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    
    // Clear any existing content
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Create container group and defs
    const gElement = svg.append("g").attr("class", "graph-container");
    const defsElement = svg.append("defs");
    
    // Create layers
    const linksLayer = gElement.append("g").attr("class", "links-layer");
    const animationsLayer = gElement.append("g").attr("class", "animations-layer");
    const nodesLayer = gElement.append("g").attr("class", "nodes-layer");

    // Create zoom behavior
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        gElement.attr('transform', event.transform);
      });

    // Apply zoom to svg
    svg.call(zoomBehavior);

    // Create new simulation
    const newSimulation = createSimulation(width, height, getNodeSize);
    
    // Initialize nodes positions
    nodes.forEach(node => {
      node.x = width / 2 + (Math.random() - 0.5) * 50;
      node.y = height / 2 + (Math.random() - 0.5) * 50;
      
      if (node.id === 'shareholders') {
        node.x = width / 2;
        node.y = height / 2;
        node.fx = width / 2;
        node.fy = height / 2;
      }
    });

    // Initialize simulation with nodes and links
    initializeSimulation(newSimulation, nodes, links);

    // Add gradient definitions
    defsElement.append("linearGradient")
      .attr("id", "link-gradient")
      .attr("gradientUnits", "userSpaceOnUse")
      .selectAll("stop")
      .data([
        { offset: "0%", color: "rgba(147, 51, 234, 0.3)" },
        { offset: "100%", color: "rgba(147, 51, 234, 0.3)" }
      ])
      .join("stop")
      .attr("offset", d => d.offset)
      .attr("stop-color", d => d.color);

    // Create links
    const linkElements = linksLayer
      .selectAll("path")
      .data(links)
      .join("path")
      .attr("class", "link-path")
      .attr("stroke", d => {
        if ((d as any).isRevenueFlow) {
          return "rgba(234, 179, 8, 0.3)";
        }
        if ((d as any).isShareholderLink) {
          return "rgba(234, 179, 8, 0.15)";
        }
        return "url(#link-gradient)";
      })
      .attr("stroke-width", d => {
        if ((d as any).isRevenueFlow) {
          return calculateWidth(d.value) * 1.5;
        }
        return (d as any).invisible ? 0 : calculateWidth(d.value);
      })
      .attr("fill", "none")
      .style("pointer-events", "none")
      .style("opacity", 1);

    // Create nodes
    const nodeElements = nodesLayer
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag<any, SimulationNode>()
        .on("start", (event) => {
          if (!event.active) newSimulation.alphaTarget(0.3).restart();
          const subject = event.subject as SimulationNode;
          subject.fx = subject.x;
          subject.fy = subject.y;
        })
        .on("drag", (event) => {
          const subject = event.subject as SimulationNode;
          subject.fx = event.x;
          subject.fy = event.y;
        })
        .on("end", (event) => {
          if (!event.active) newSimulation.alphaTarget(0);
          const subject = event.subject as SimulationNode;
          subject.fx = null;
          subject.fy = null;
        }) as any);

    // Add node visuals
    nodeElements.append("circle")
      .attr("r", (d: SimulationNode) => d.id === 'shareholders' ? 
        getNodeSize(d.id) * 4 : 
        getNodeSize(d.id))
      .attr("fill", (d: SimulationNode) => d.id === 'shareholders' ? 
        "rgba(234, 179, 8, 0.2)" : 
        "rgba(236, 72, 153, 0.2)")
      .attr("stroke", (d: SimulationNode) => d.id === 'shareholders' ? 
        "rgba(234, 179, 8, 0.5)" : 
        "rgba(236, 72, 153, 0.5)")
      .attr("stroke-width", d => d.id === 'shareholders' ? 6 : 3)
      .style("filter", (d: SimulationNode) => d.id === 'shareholders' ?
        "drop-shadow(0 0 20px rgba(234, 179, 8, 0.4))" : 
        "drop-shadow(0 0 10px rgba(236, 72, 153, 0.3))");

    // Add images to nodes
    nodeElements.append("image")
      .attr("xlink:href", (d: SimulationNode) => d.image)
      .attr("x", (d: SimulationNode) => d.id === 'shareholders' ? 
        -getNodeSize(d.id) * 4 : 
        -getNodeSize(d.id))
      .attr("y", (d: SimulationNode) => d.id === 'shareholders' ? 
        -getNodeSize(d.id) * 4 : 
        -getNodeSize(d.id))
      .attr("width", (d: SimulationNode) => d.id === 'shareholders' ? 
        getNodeSize(d.id) * 8 : 
        getNodeSize(d.id) * 2)
      .attr("height", (d: SimulationNode) => d.id === 'shareholders' ? 
        getNodeSize(d.id) * 8 : 
        getNodeSize(d.id) * 2)
      .attr("clip-path", (d: SimulationNode) => `circle(${d.id === 'shareholders' ? 
        getNodeSize(d.id) * 4 : 
        getNodeSize(d.id)}px)`);

    // Add labels to nodes
    nodeElements.append("text")
      .text((d: SimulationNode) => d.name)
      .attr("x", 0)
      .attr("y", (d: SimulationNode) => d.id === 'shareholders' ? 
        getNodeSize(d.id) * 4 + 20 : 
        getNodeSize(d.id) + 20)
      .attr("text-anchor", "middle")
      .attr("fill", (d: SimulationNode) => d.id === 'shareholders' ? 
        "rgb(234, 179, 8)" : 
        "rgb(236, 72, 153)")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .style("text-shadow", "0 0 10px rgba(0,0,0,0.5)");

    // Set up a SINGLE tick handler
    newSimulation.on("tick", () => {
      // Update link positions
      linkElements.attr("d", (d: any) => {
        if (!d.source || !d.target || 
            typeof d.source.x !== 'number' || 
            typeof d.source.y !== 'number' || 
            typeof d.target.x !== 'number' || 
            typeof d.target.y !== 'number') {
            return null;
        }
        
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const dr = Math.sqrt(dx * dx + dy * dy);
        return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
      });

      // Update node positions
      nodeElements.attr("transform", (d: any) => {
        if (typeof d.x !== 'number' || typeof d.y !== 'number') return null;
        return `translate(${d.x},${d.y})`;
      });
    });

    // Center the view
    const initialTransform = d3.zoomIdentity
      .translate(width/4, height/4)
      .scale(0.6);
    svg.call(zoomBehavior.transform, initialTransform);

    // Store references for other components to use
    setG(gElement);
    setDefs(defsElement);
    setSimulation(newSimulation);

    // Add some initial force to spread nodes
    newSimulation.alpha(0.5).restart();

    return () => {
      newSimulation.stop();
      svg.selectAll("*").remove();
    };
  }, [isLoading, collaborationsProp?.length]); // Only depend on isLoading and if collaborations exist

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

  if (!collaborationsProp?.length || collaborationsProp.length === 0) {
    return (
      <div className="w-full h-[600px] bg-black/20 rounded-xl flex items-center justify-center">
        <div className="text-white/60">No collaboration data available to display</div>
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
      >
        {/* Add a background rect to make the SVG clickable */}
        <rect width="100%" height="100%" fill="transparent" />
        
        {/* Add a visible text element to confirm the SVG is rendering */}
        <text x="50%" y="50%" textAnchor="middle" fill="white" fontSize="16px">
          {nodes.length > 0 ? `Graph with ${nodes.length} nodes and ${links.length} links` : "Initializing graph..."}
        </text>
        
        {g && defs && simulation && nodes.length > 0 && nodes.every(node => 
          typeof node.x === 'number' && 
          typeof node.y === 'number' && 
          !isNaN(node.x) && 
          !isNaN(node.y)
        ) ? (
          <>
            <GraphLinks 
              g={g}
              defs={defs}
              links={links}
              calculateWidth={calculateWidth}
              simulation={simulation}
            />
            <MessageAnimations 
              g={g} 
              defs={defs} 
              nodes={nodes} 
              collaborations={collaborationsProp} 
              getNodeSize={getNodeSize} 
            />
            <TransferAnimations 
              g={g} 
              defs={defs} 
              nodes={nodes} 
              links={links}
              collaborations={collaborationsProp} 
              getNodeSize={getNodeSize} 
            />
          </>
        ) : null}
      </svg>
    </div>
  );
}
