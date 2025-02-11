'use client';

import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import * as d3 from 'd3';
import { CollaborationGraphProps, SimulationNode, SimulationLink } from './types';
import { useGraphData } from './hooks/useGraphData';
import { useGraphSimulation } from './hooks/useGraphSimulation';
import { processCollaborations, calculateLinkWidth } from './utils/graphCalculations';
import { GraphControls } from './components/GraphControls';
import { GraphLinks } from './components/GraphLinks';
import { GraphNodes } from './components/GraphNodes';
import { MessageAnimations } from './components/MessageAnimations';

export function CollaborationGraph({ collaborations: collaborationsProp }: CollaborationGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoom, setZoom] = useState(1);
  const { swarms, swarmMap, isLoading } = useGraphData();
  const { createSimulation, initializeSimulation, setupDragHandlers } = useGraphSimulation();
  const getNodeSize = (swarmId: string): number => {
    const swarm = swarmMap.get(swarmId);
    if (!swarm?.multiple) return 30;
    return Math.max(25, Math.min(40, 25 + (swarm.multiple * 0.2)));
  };


  useEffect(() => {
    if (!svgRef.current || isLoading || !collaborationsProp?.length) return;

    // Clear previous graph
    d3.select(svgRef.current).selectAll("*").remove();

    const { nodes, links, ecosystemTargets, maxPrice, minPrice } = processCollaborations(collaborationsProp);


    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const svg = d3.select(svgRef.current);
    
    // Add a tooltip div
    const tooltip = d3.select("body").append("div")
        .attr("class", "absolute hidden p-4 rounded-lg bg-black/90 border border-white/10 backdrop-blur-sm shadow-xl z-50 pointer-events-none")
        .style("max-width", "280px");
    
    // Create a group for zoom transformation
    const g = svg.append("g")
      .attr("transform", `scale(${zoom})`);

    // Create definitions section for gradients and animations
    const defs = g.append("defs");

    // Add envelope path to defs
    defs.append("path")
      .attr("id", "envelope-icon")
      .attr("d", "M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383-4.708 2.825L15 11.105V5.383zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741zM1 11.105l4.708-2.897L1 5.383v5.722z")
      .attr("fill", "currentColor");

    const simulation = createSimulation(width, height, getNodeSize);
    const { dragstarted, dragged, dragended } = setupDragHandlers(simulation);

    // Initialize nodes with random positions
    nodes.forEach(node => {
        node.x = Math.random() * width;
        node.y = Math.random() * height;
    });

    initializeSimulation(simulation, nodes as SimulationNode[], links as SimulationLink[]);

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

    // Create gradient for base links
    const gradient = defs.append("linearGradient")
        .attr("id", "link-gradient")
        .attr("gradientUnits", "userSpaceOnUse");

    gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "rgba(147, 51, 234, 0.3)");

    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "rgba(147, 51, 234, 0.3)");

    // Create animated light gradient
    const lightGradient = defs.append("linearGradient")
        .attr("id", "light-gradient")
        .attr("gradientUnits", "userSpaceOnUse");

    lightGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "rgba(255, 255, 255, 0)");

    lightGradient.append("stop")
        .attr("offset", "50%")
        .attr("stop-color", "rgba(147, 51, 234, 0.8)");

    lightGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "rgba(255, 255, 255, 0)");

    // Draw links with animated lights
    const linkGroup = g.append("g")
        .attr("class", "links");

    // Base links
    const baseLinks = linkGroup.append("g")
        .attr("class", "base-links")
        .selectAll("path")
        .data(links)
        .join("path")
        .attr("class", "link-path")
        .attr("stroke", "url(#link-gradient)")
        .attr("stroke-width", d => calculateLinkWidth(d.value, minPrice, maxPrice))
        .attr("stroke-opacity", 1)
        .attr("fill", "none");

    // Animated lights
    const lightsGroup = linkGroup.append("g")
        .attr("class", "animated-lights");

    const lights = lightsGroup.selectAll("path")
        .data(links)
        .join("path")
        .attr("class", "link-light")
        .attr("stroke", "url(#light-gradient)")
        .attr("stroke-width", d => calculateLinkWidth(d.value, minPrice, maxPrice) * 2)
        .attr("stroke-opacity", 0.8)
        .attr("fill", "none")
        .style("filter", "blur(3px)");

    // Create node groups
    const node = g.append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(nodes)
        .join("g")
        .call(d3.drag<SVGGElement, SimulationNode>()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
        .on("mouseover", (event, d) => {
            const swarm = swarmMap.get(d.id);
            const previewData = swarms.find(p => p.id === d.id);
            if (!swarm || !previewData) return;

            tooltip.html(ReactDOMServer.renderToString(
                <GraphTooltip swarm={swarm} previewData={previewData} />
            ))
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 10) + "px")
            .classed("hidden", false);
        })
        .on("mousemove", (event) => {
            tooltip
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 10) + "px");
        })
        .on("mouseout", () => {
            tooltip.classed("hidden", true);
        });

    // Add circles to nodes with glowing effect
    node.append("circle")
        .attr("r", d => getNodeSize(d.id))
        .attr("fill", "rgba(236, 72, 153, 0.2)")
        .attr("stroke", "rgba(236, 72, 153, 0.5)")
        .attr("stroke-width", 3)
        .style("filter", "drop-shadow(0 0 10px rgba(236, 72, 153, 0.3))");

    // Add pulsing yellow glow for ecosystem targets
    node.filter(d => ecosystemTargets.has(d.id))
        .append("circle")
        .attr("r", d => getNodeSize(d.id) + 5)
        .attr("fill", "none")
        .attr("stroke", "rgba(250, 204, 21, 0.4)")
        .attr("stroke-width", 4)
        .attr("class", "ecosystem-glow")
        .style("filter", "drop-shadow(0 0 8px rgba(250, 204, 21, 0.6)) blur(3px)")
        .style("animation", "pulse 4s ease-in-out infinite");

    // Add images to nodes
    node.append("image")
        .attr("xlink:href", d => d.image)
        .attr("x", d => -getNodeSize(d.id) * 1.1)
        .attr("y", d => -getNodeSize(d.id) * 1.1)
        .attr("width", d => getNodeSize(d.id) * 2.2)
        .attr("height", d => getNodeSize(d.id) * 2.2)
        .attr("clip-path", d => `circle(${getNodeSize(d.id)}px)`);

    // Add labels to nodes
    node.append("text")
        .text(d => d.name)
        .attr("x", 0)
        .attr("y", d => getNodeSize(d.id) + 15)
        .attr("text-anchor", "middle")
        .attr("fill", "rgb(236, 72, 153)")
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .style("text-shadow", "0 0 10px rgba(0,0,0,0.5)");

    simulation.on("tick", () => {
      // Update link positions
      g.selectAll(".link-path, .link-light").attr("d", (d: SimulationLink) => {
        const source = d.source as SimulationNode;
        const target = d.target as SimulationNode;
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dr = Math.sqrt(dx * dx + dy * dy);
        return `M${source.x},${source.y}A${dr},${dr} 0 0,1 ${target.x},${target.y}`;
      });

      // Update node positions
      g.selectAll(".nodes g").attr("transform", (d: any) => {
        const node = d as SimulationNode;
        return `translate(${node.x || 0},${node.y || 0})`;
      });
    });


    // Update transform when zoom changes
    g.attr("transform", `scale(${zoom})`);

    return () => {
        simulation.stop();
        g.selectAll("*").remove();
        d3.select("body").selectAll(".graph-tooltip").remove();
        const pulseStyle = document.querySelector('style[data-graph-animation]');
        if (pulseStyle) {
            pulseStyle.remove();
        }
    };
  }, [zoom, getNodeSize, isLoading, swarmMap, collaborationsProp, swarms]);

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
