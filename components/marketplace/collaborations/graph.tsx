'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface SwarmData {
  id: string;
  name: string;
  swarmType: string;
  description: string;
  multiple: number;
  revenueShare: number;
}

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

interface SwarmData {
  id: string;
  name: string;
  swarmType: string;
  description: string;
  multiple: number;
  revenueShare: number;
  image: string;
}

interface Collaboration {
  id: string;
  providerSwarm: {
    id: string;
    name: string;
    image: string;
  };
  clientSwarm: {
    id: string;
    name: string;
    image: string;
  };
  serviceName: string;
  price: number;
  status: string;
}

export function CollaborationGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [zoom, setZoom] = useState(1);
  const [swarms, setSwarms] = useState<SwarmData[]>([]);
  const [collaborations, setCollaborations] = useState<Collaboration[]>([]);
  const [swarmMap, setSwarmMap] = useState<Map<string, SwarmData>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  const getNodeSize = (swarmId: string): number => {
    const swarm = swarmMap.get(swarmId);
    if (!swarm?.multiple) return 30; // Default size
    return Math.max(25, Math.min(40, 25 + (swarm.multiple * 0.2)));
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const [swarmsResponse, collaborationsResponse] = await Promise.all([
          fetch('/api/swarms'),
          fetch('/api/collaborations')
        ]);

        if (swarmsResponse.ok && collaborationsResponse.ok) {
          const [swarmsData, collaborationsData] = await Promise.all([
            swarmsResponse.json(),
            collaborationsResponse.json()
          ]);

          setSwarms(swarmsData);
          setCollaborations(collaborationsData);
          
          // Create a map for easier lookup
          const map = new Map();
          swarmsData.forEach((swarm: SwarmData) => {
            map.set(swarm.id, swarm);
          });
          setSwarmMap(map);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (!svgRef.current || isLoading || collaborations.length === 0) return;

    // Clear previous graph
    d3.select(svgRef.current).selectAll("*").remove();

    // Filter out ecosystem nodes and create set of ecosystem targets
    const filteredCollaborations = collaborations.filter(
      collab => collab.providerSwarm.id !== 'ecosystem'
    );
    const ecosystemTargets = new Set(
      collaborations
        .filter(collab => collab.providerSwarm.id === 'ecosystem')
        .map(collab => collab.clientSwarm.id)
    );

    // Create nodes array (unique swarms)
    const swarms = new Set();
    filteredCollaborations.forEach(collab => {
      swarms.add(JSON.stringify(collab.providerSwarm));
      swarms.add(JSON.stringify(collab.clientSwarm));
    });
    const nodes = Array.from(swarms).map(s => JSON.parse(s as string));

    // Create links array with normalized strengths based on price
    const maxPrice = Math.max(...filteredCollaborations.map(c => c.price));
    const minPrice = Math.min(...filteredCollaborations.map(c => c.price));

    // Helper function to calculate width based on value
    const calculateWidth = (value: number) => {
      const minWidth = 1;  // Minimum width for smallest values
      const maxWidth = 8;  // Maximum width for largest values
      const scale = (Math.log(value) - Math.log(minPrice)) / (Math.log(maxPrice) - Math.log(minPrice));
      return minWidth + (scale * (maxWidth - minWidth));
    };

    const links = filteredCollaborations.map(collab => ({
      source: collab.providerSwarm.id,
      target: collab.clientSwarm.id,
      value: collab.price,
      strength: (collab.price / maxPrice) * 0.3 + 0.2,
      serviceName: collab.serviceName
    }));

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
      .force("collision", d3.forceCollide().radius((d: d3.SimulationNodeDatum) => {
        // Assert the node to our custom type
        const node = d as SimulationNode;
        return getNodeSize(node.id) + 10;
      }));

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
        .on("end", dragended))
      .on("mouseover", (event, d) => {
        const swarm = swarmMap.get(d.id);
        const previewData = swarms.find(p => p.id === d.id);
        if (!swarm || !previewData) return;

        const multiple = swarm.multiple || 1;
        const revenueShare = swarm.revenueShare || 60;
        
        tooltip.html(`
            <div class="space-y-1.5">
                <div class="flex items-center gap-2">
                    <h3 class="text-sm font-medium text-white/90">${swarm.name}</h3>
                    <span class="px-1.5 py-0.5 rounded-full bg-white/5 text-[10px] text-white/40">
                        ${swarm.swarmType}
                    </span>
                </div>
                <p class="text-xs text-white/50 line-clamp-2">${previewData.description}</p>
                <div class="grid grid-cols-2 gap-1.5 pt-1">
                    <div>
                        <div class="text-[10px] text-white/30">Multiple</div>
                        <div class="text-xs font-medium text-white/80">${multiple}x</div>
                    </div>
                    <div>
                        <div class="text-[10px] text-white/30">Revenue Share</div>
                        <div class="text-xs font-medium text-white/80">${revenueShare}%</div>
                    </div>
                </div>
            </div>
        `)
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

    // Add style for ecosystem glow animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% {
          stroke-opacity: 0.4;
          stroke-width: 4;
        }
        50% {
          stroke-opacity: 0.8;
          stroke-width: 6;
        }
        100% {
          stroke-opacity: 0.4;
          stroke-width: 4;
        }
      }
    `;
    document.head.appendChild(style);

    // Add circles to nodes with glowing effect
    node.append("circle")
      .attr("r", (d: SimulationNode) => getNodeSize(d.id))
      .attr("fill", "rgba(236, 72, 153, 0.2)")
      .attr("stroke", "rgba(236, 72, 153, 0.5)")
      .attr("stroke-width", 3)
      .style("filter", "drop-shadow(0 0 10px rgba(236, 72, 153, 0.3))");

    // Add pulsing yellow glow for ecosystem targets
    node.filter((d: SimulationNode) => ecosystemTargets.has(d.id))
      .append("circle")
      .attr("r", (d: SimulationNode) => getNodeSize(d.id) + 5)
      .attr("fill", "none")
      .attr("stroke", "rgba(250, 204, 21, 0.4)")
      .attr("stroke-width", 4)
      .attr("class", "ecosystem-glow")
      .style("filter", "drop-shadow(0 0 8px rgba(250, 204, 21, 0.6)) blur(3px)")
      .style("animation", "pulse 4s ease-in-out infinite");

    // Add images to nodes
    node.append("image")
      .attr("xlink:href", (d: SimulationNode) => d.image)
      .attr("x", (d: SimulationNode) => -getNodeSize(d.id) * 1.1)
      .attr("y", (d: SimulationNode) => -getNodeSize(d.id) * 1.1)
      .attr("width", (d: SimulationNode) => getNodeSize(d.id) * 2.2)
      .attr("height", (d: SimulationNode) => getNodeSize(d.id) * 2.2)
      .attr("clip-path", (d: SimulationNode) => `circle(${getNodeSize(d.id)}px)`);

    // Add labels to nodes
    node.append("text")
      .text((d: SimulationNode) => d.name)
      .attr("x", 0)
      .attr("y", (d: SimulationNode) => getNodeSize(d.id) + 15)
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
      tooltip.remove(); // Remove tooltip when component unmounts
    };
  }, [collaborations, zoom]);

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
