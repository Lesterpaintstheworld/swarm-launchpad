'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Collaboration } from '@/data/collaborations/collaborations';

interface SimulationNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  image: string;
  x: number;
  y: number;
}

interface SimulationLink extends d3.SimulationLinkDatum<SimulationNode> {
  value: number;
  strength: number;
  serviceName: string;
}

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
    const minPrice = Math.min(...collaborations.map(c => c.price));

    // Helper function to calculate width based on value
    const calculateWidth = (value: number) => {
      const minWidth = 1;  // Minimum width for smallest values
      const maxWidth = 8;  // Maximum width for largest values
      const scale = (Math.log(value) - Math.log(minPrice)) / (Math.log(maxPrice) - Math.log(minPrice));
      return minWidth + (scale * (maxWidth - minWidth));
    };

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

    const simulation = d3.forceSimulation<SimulationNode>()
      .force("link", d3.forceLink<SimulationNode, SimulationLink>()
        .id((d: SimulationNode) => d.id)
        .strength((d: SimulationLink) => d.strength * 0.1))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(60));

    // Add nodes to simulation with proper typing
    simulation.nodes(nodes as SimulationNode[]);

    // Add links to simulation with proper typing
    const linkForce = simulation.force<d3.ForceLink<SimulationNode, SimulationLink>>("link");
    if (linkForce) {
      linkForce.links(links as SimulationLink[]);
    }

    // Draw links with animated lights
    const linkGroup = g.append("g")
      .attr("class", "links");

    // Base links - create a separate group for the static links
    const baseLinks = linkGroup.append("g")
      .attr("class", "base-links")
      .selectAll("path")
      .data(links)
      .join("path")
      .attr("class", "link-path")
      .attr("stroke", "url(#link-gradient)")
      .attr("stroke-width", d => calculateWidth(d.value))
      .attr("stroke-opacity", 1)
      .attr("fill", "none");

    // Animated lights - create a separate group for the animated lights  
    const lightsGroup = linkGroup.append("g")
      .attr("class", "animated-lights");

    const lights = lightsGroup.selectAll("path")
      .data(links)
      .join("path")
      .attr("class", "link-light")
      .attr("stroke", "url(#light-gradient)")
      .attr("stroke-width", d => calculateWidth(d.value) * 2)
      .attr("stroke-opacity", 0.8)
      .attr("fill", "none")
      .style("filter", "blur(3px)");

    // Animation function for the lights
    function animateLights() {
      lights.each(function(d: SimulationLink) {
        const length = (this as SVGPathElement).getTotalLength();
        const width = calculateWidth(d.value);
        // Make dash length proportional to the link width
        const dashLength = Math.max(width * 5, length * 0.1);
        
        d3.select(this)
          .attr("stroke-dasharray", `${dashLength} ${length - dashLength}`)
          .attr("stroke-dashoffset", length)
          .transition()
          .duration(4000)
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
      .selectAll<SVGGElement, SimulationNode>("g")
      .data(nodes)
      .join("g")
      .call(d3.drag<SVGGElement, SimulationNode>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Add circles to nodes with glowing effect
    node.append("circle")
      .attr("r", 30)
      .attr("fill", "rgba(236, 72, 153, 0.2)")
      .attr("stroke", "rgba(236, 72, 153, 0.5)")
      .attr("stroke-width", 3)
      .style("filter", "drop-shadow(0 0 10px rgba(236, 72, 153, 0.3))");

    // Add images to nodes
    node.append("image")
      .attr("xlink:href", (d: SimulationNode) => d.image)
      .attr("x", -25)
      .attr("y", -25)
      .attr("width", 50)
      .attr("height", 50)
      .attr("clip-path", "circle(25px)");

    // Add labels to nodes
    node.append("text")
      .text((d: SimulationNode) => d.name)
      .attr("x", 0)
      .attr("y", 45)
      .attr("text-anchor", "middle")
      .attr("fill", "rgb(236, 72, 153)")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .style("text-shadow", "0 0 10px rgba(0,0,0,0.5)");

    simulation.on("tick", () => {
      // Update base links
      baseLinks.attr("d", (d: SimulationLink) => {
        const source = d.source as SimulationNode;
        const target = d.target as SimulationNode;
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dr = Math.sqrt(dx * dx + dy * dy);
        return `M${source.x},${source.y}A${dr},${dr} 0 0,1 ${target.x},${target.y}`;
      });

      // Update animated lights
      lights.attr("d", (d: SimulationLink) => {
        const source = d.source as SimulationNode;
        const target = d.target as SimulationNode;
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dr = Math.sqrt(dx * dx + dy * dy);
        return `M${source.x},${source.y}A${dr},${dr} 0 0,1 ${target.x},${target.y}`;
      });

      node.attr("transform", (d: SimulationNode) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: d3.D3DragEvent<SVGGElement, SimulationNode, unknown>) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      const subject = event.subject as SimulationNode;
      subject.fx = subject.x;
      subject.fy = subject.y;
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, SimulationNode, unknown>) {
      const subject = event.subject as SimulationNode;
      subject.fx = event.x;
      subject.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, SimulationNode, unknown>) {
      if (!event.active) simulation.alphaTarget(0);
      const subject = event.subject as SimulationNode;
      subject.fx = null;
      subject.fy = null;
    }

    // Update transform when zoom changes
    g.attr("transform", `scale(${zoom})`);

    return () => {
      simulation.stop();
      // Clean up animations
      lightsGroup.selectAll(".link-light").interrupt();
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
