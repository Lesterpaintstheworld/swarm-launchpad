'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Collaboration } from '@/data/collaborations/collaborations';

interface CollaborationGraphProps {
  collaborations: Collaboration[];
}

export function CollaborationGraph({ collaborations }: CollaborationGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);

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
      strength: (collab.price / maxPrice) * 0.8 + 0.2, // Normalize between 0.2 and 1
      serviceName: collab.serviceName
    }));

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links)
        .id((d: any) => d.id)
        .strength((d: any) => d.strength * 0.1)) // Adjust link strength based on price
      .force("charge", d3.forceManyBody().strength(-2000)) // Increased repulsion
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(60)); // Prevent node overlap

    const svg = d3.select(svgRef.current);

    // Create gradient definitions for links
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "link-gradient")
      .attr("gradientUnits", "userSpaceOnUse");

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "rgba(147, 51, 234, 0.7)"); // More opaque purple

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "rgba(59, 130, 246, 0.7)"); // More opaque blue

    // Draw links with increased width
    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "url(#link-gradient)")
      .attr("stroke-width", d => Math.sqrt(d.value) / 500 + 2) // Increased minimum width
      .attr("stroke-opacity", 0.8); // More opaque lines

    // Create node groups
    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    // Add circles to nodes with glowing effect
    node.append("circle")
      .attr("r", 30) // Larger radius
      .attr("fill", "rgba(147, 51, 234, 0.2)") // Purple background
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

    // Add labels to nodes with purple text
    node.append("text")
      .text((d: any) => d.name)
      .attr("x", 0)
      .attr("y", 45)
      .attr("text-anchor", "middle")
      .attr("fill", "rgb(147, 51, 234)") // Purple text
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .style("text-shadow", "0 0 10px rgba(0,0,0,0.5)");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
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

    return () => {
      simulation.stop();
    };
  }, [collaborations]);

  return (
    <svg 
      ref={svgRef} 
      className="w-full h-[800px] bg-black/20 rounded-xl" // Increased height
      style={{ minHeight: '800px' }}
    />
  );
}
