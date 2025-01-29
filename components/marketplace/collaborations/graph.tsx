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

    // Create links array
    const links = collaborations.map(collab => ({
      source: collab.sourceSwarm.id,
      target: collab.targetSwarm.id,
      value: collab.price,
      serviceName: collab.serviceName
    }));

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id))
      .force("charge", d3.forceManyBody().strength(-1000))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const svg = d3.select(svgRef.current);

    // Create gradient definitions for links
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "link-gradient")
      .attr("gradientUnits", "userSpaceOnUse");

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "rgba(147, 51, 234, 0.5)"); // Purple

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "rgba(59, 130, 246, 0.5)"); // Blue

    // Draw links
    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "url(#link-gradient)")
      .attr("stroke-width", d => Math.sqrt(d.value) / 1000)
      .attr("stroke-opacity", 0.6);

    // Create node groups
    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    // Add circles to nodes
    node.append("circle")
      .attr("r", 20)
      .attr("fill", "rgba(255, 255, 255, 0.1)")
      .attr("stroke", "rgba(255, 255, 255, 0.2)")
      .attr("stroke-width", 2);

    // Add images to nodes
    node.append("image")
      .attr("xlink:href", (d: any) => d.image)
      .attr("x", -15)
      .attr("y", -15)
      .attr("width", 30)
      .attr("height", 30)
      .attr("clip-path", "circle(15px)");

    // Add labels to nodes
    node.append("text")
      .text((d: any) => d.name)
      .attr("x", 0)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-size", "12px");

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
      className="w-full h-[600px] bg-black/20 rounded-xl"
      style={{ minHeight: '600px' }}
    />
  );
}
