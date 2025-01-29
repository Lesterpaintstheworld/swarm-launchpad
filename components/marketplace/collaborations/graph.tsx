'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Collaboration } from '@/data/collaborations/collaborations';

interface CollaborationGraphProps {
  collaborations: Collaboration[];
}

export function CollaborationGraph({ collaborations }: CollaborationGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous graph
    d3.select(svgRef.current).selectAll("*").remove();

    // Create nodes array (unique swarms)
    const swarms = new Set();
    collaborations.forEach(collab => {
      swarms.add(JSON.stringify(collab.sourceSwarm));
      swarms.add(JSON.stringify(collab.targetSwarm));
    });
    const nodes = Array.from(swarms).map(s => JSON.parse(s as string));

    // Create links array with normalized strengths based on price
    const maxPrice = Math.max(...collaborations.map(c => c.price));
    const links = collaborations.map(collab => ({
      source: collab.sourceSwarm.id,
      target: collab.targetSwarm.id,
      value: collab.price,
      strength: (collab.price / maxPrice) * 0.8 + 0.2,
      serviceName: collab.serviceName
    }));

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const svg = d3.select(svgRef.current);
    
    // Create a group for zoom transformation
    const g = svg.append("g")
      .attr("transform", `scale(${zoom})`);

    // Create gradient definitions for links
    const defs = g.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "link-gradient")
      .attr("gradientUnits", "userSpaceOnUse");

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "rgba(147, 51, 234, 0.7)");

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "rgba(59, 130, 246, 0.7)");

    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links)
        .id((d: any) => d.id)
        .strength((d: any) => d.strength * 0.1))
      .force("charge", d3.forceManyBody().strength(-500)) // Reduced repulsion
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(60));

    // Draw links first (so they appear below nodes)
    const link = g.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "url(#link-gradient)")
      .attr("stroke-width", d => Math.sqrt(d.value) / 300 + 4) // Thicker lines
      .attr("stroke-opacity", 0.8);

    // Create node groups
    const node = g.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    // Add circles to nodes with glowing effect
    node.append("circle")
      .attr("r", 30)
      .attr("fill", "rgba(147, 51, 234, 0.2)")
      .attr("stroke", "rgba(147, 51, 234, 0.5)")
      .attr("stroke-width", 3)
      .style("filter", "drop-shadow(0 0 10px rgba(147, 51, 234, 0.3))");

    // Add images to nodes
    node.append("image")
      .attr("xlink:href", (d: any) => d.image)
      .attr("x", -25)
      .attr("y", -25)
      .attr("width", 50)
      .attr("height", 50)
      .attr("clip-path", "circle(25px)");

    // Add labels to nodes
    node.append("text")
      .text((d: any) => d.name)
      .attr("x", 0)
      .attr("y", 45)
      .attr("text-anchor", "middle")
      .attr("fill", "rgb(147, 51, 234)")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .style("text-shadow", "0 0 10px rgba(0,0,0,0.5)");

    simulation.on("tick", () => {
      link.attr("d", (d: any) => {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const dr = Math.sqrt(dx * dx + dy * dy);
        
        // Create a slight curve in the link
        return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
      });

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    // Update transform when zoom changes
    g.attr("transform", `scale(${zoom})`);

    return () => {
      simulation.stop();
    };
  }, [collaborations, zoom]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  return (
    <div className="relative">
      <svg 
        ref={svgRef} 
        className="w-full h-[800px] bg-black/20 rounded-xl"
        style={{ minHeight: '800px' }}
      />
      
      {/* Zoom controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
        >
          -
        </button>
      </div>
    </div>
  );
}
