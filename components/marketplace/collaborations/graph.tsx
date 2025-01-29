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

    // Create definitions section for gradients and animations
    const defs = g.append("defs");

    // Create gradient for base links
    const gradient = defs.append("linearGradient")
      .attr("id", "link-gradient")
      .attr("gradientUnits", "userSpaceOnUse");

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "rgba(147, 51, 234, 0.7)");

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "rgba(59, 130, 246, 0.7)");

    // Create animated light gradient
    const lightGradient = defs.append("linearGradient")
      .attr("id", "light-gradient")
      .attr("gradientUnits", "userSpaceOnUse");

    lightGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "rgba(255, 255, 255, 0)");

    lightGradient.append("stop")
      .attr("offset", "50%")
      .attr("stop-color", "rgba(255, 255, 255, 0.5)");

    lightGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "rgba(255, 255, 255, 0)");

    // Create animation for the light
    const animate = defs.append("animate")
      .attr("id", "light-animation")
      .attr("attributeName", "offset")
      .attr("values", "-1;1")
      .attr("dur", "3s")
      .attr("repeatCount", "indefinite");

    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links)
        .id((d: any) => d.id)
        .strength((d: any) => d.strength * 0.1))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(60));

    // Draw links with animated lights
    const linkGroup = g.append("g")
      .attr("class", "links");

    // Base links
    const link = linkGroup.selectAll("path")
      .data(links)
      .join("path")
      .attr("class", "link-path")
      .attr("stroke", "url(#link-gradient)")
      .attr("stroke-width", d => Math.sqrt(d.value) / 200 + 1)
      .attr("stroke-opacity", 0.8)
      .attr("fill", "none");

    // Animated lights
    const lights = linkGroup.selectAll("path")
      .data(links)
      .join("path")
      .attr("class", "link-light")
      .attr("stroke", "url(#light-gradient)")
      .attr("stroke-width", d => (Math.sqrt(d.value) / 200 + 1) * 2)
      .attr("stroke-opacity", 0.6)
      .attr("fill", "none")
      .style("filter", "blur(2px)");

    // Animation function for the lights
    function animateLights() {
      lights.each(function(d: any) {
        const length = (this as SVGPathElement).getTotalLength();
        d3.select(this)
          .attr("stroke-dasharray", `${length * 0.1} ${length * 0.9}`)
          .attr("stroke-dashoffset", length)
          .transition()
          .duration(3000)
          .ease(d3.easeLinear)
          .attr("stroke-dashoffset", 0)
          .on("end", function() {
            d3.select(this)
              .attr("stroke-dashoffset", length)
              .transition()
              .duration(0)
              .on("end", animateLights);
          });
      });
    }

    // Start the animation
    animateLights();

    // Create node groups (after links)
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
      // Update both base links and lights
      link.attr("d", (d: any) => {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const dr = Math.sqrt(dx * dx + dy * dy);
        return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
      });

      lights.attr("d", (d: any) => {
        const dx = d.target.x - d.source.x;
        const dy = d.target.y - d.source.y;
        const dr = Math.sqrt(dx * dx + dy * dy);
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
      // Clean up animations
      linkGroup.selectAll(".link-light").interrupt();
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
