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


  const setupGraph = useCallback((
    g: d3.Selection<SVGGElement, unknown, null, undefined> | null,
    defs: d3.Selection<SVGDefsElement, unknown, null, undefined> | null,
    nodes: SimulationNode[],
    links: SimulationLink[],
    simulation: d3.Simulation<SimulationNode, SimulationLink>
  ) => {
    if (!g || !defs || !svgRef.current) {
      console.warn('Graph container, defs, or SVG ref not available');
      return;
    }

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Create layers in specific order (bottom to top)
    const linksLayer = g.append("g").attr("class", "links-layer");
    const animationsLayer = g.append("g").attr("class", "animations-layer");
    const nodesLayer = g.append("g").attr("class", "nodes-layer");

    // Set up simulation tick handler
    simulation.on("tick", () => {
        // Update link positions
        g.selectAll(".link-path")
            .attr("d", (d: any) => {
                if (!d.source?.x || !d.source?.y || !d.target?.x || !d.target?.y) {
                    return null;
                }
                const dx = d.target.x - d.source.x;
                const dy = d.target.y - d.source.y;
                const dr = Math.sqrt(dx * dx + dy * dy);
                return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
            });

        // Update node positions
        g.selectAll(".nodes g")
            .attr("transform", (d: any) => {
                if (!d.x || !d.y) return null;
                return `translate(${d.x},${d.y})`;
            });
    });

    // Add gradient definitions
    defs.append("linearGradient")
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

    // Create links with proper visibility
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

    // Create nodes in the nodes layer
    const nodeElements = nodesLayer
        .selectAll("g")
        .data(nodes)
        .join("g")
        .call(d3.drag<any, SimulationNode>()
            .on("start", memoizedHandlers.dragstarted)
            .on("drag", memoizedHandlers.dragged)
            .on("end", memoizedHandlers.dragended) as any);

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

    // Set up simulation tick handler
    simulation.on("tick", () => {
        // Update link positions
        linkElements.attr("d", (d: any) => {
            if (!d.source?.x || !d.source?.y || !d.target?.x || !d.target?.y) {
                console.warn('Missing coordinates for link:', d);
                return null;
            }
            const dx = d.target.x - d.source.x;
            const dy = d.target.y - d.source.y;
            const dr = Math.sqrt(dx * dx + dy * dy);
            return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
        });

        // Update node positions
        nodeElements.attr("transform", (d: any) => {
            if (!d.x || !d.y) return null;
            return `translate(${d.x},${d.y})`;
        });
    });

    // Start the simulation
    simulation.alpha(1).restart();
  }, [calculateWidth, getNodeSize, memoizedHandlers]);

  useEffect(() => {
    if (!svgRef.current || isLoading || !collaborationsProp?.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // Create container group
    const gElement = svg.append("g")
        .attr("class", "graph-container");
    
    setG(gElement);
    
    const defsElement = svg.append("defs");
    setDefs(defsElement);

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
    
    // Initialize nodes positions with some randomness
    nodes.forEach(node => {
        node.x = width / 2 + (Math.random() - 0.5) * 100;
        node.y = height / 2 + (Math.random() - 0.5) * 100;
    });

    // Initialize simulation with nodes and links
    initializeSimulation(newSimulation, nodes, links);

    // Set up the graph components
    setupGraph(gElement, defsElement, nodes, links, newSimulation);

    // Center the view
    const initialTransform = d3.zoomIdentity
        .translate(width/4, height/4)
        .scale(0.6);  // More zoomed out view
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
      >
        {g && defs && (
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
        )}
      </svg>
    </div>
  );
}
