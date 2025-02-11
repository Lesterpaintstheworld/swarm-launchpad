'use client';

import { useEffect, useRef, useState } from 'react';
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

    const simulation = d3.forceSimulation<SimulationNode>();
    const { dragstarted, dragged, dragended } = setupDragHandlers(simulation);

    simulation
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
          .attr("stroke-dashoffset", -length)  // Start from negative length
          .transition()
          .duration(4000)
          .ease(d3.easeLinear)
          .attr("stroke-dashoffset", 0)  // Animate to zero
          .on("end", function() {
            d3.select(this)
              .attr("stroke-dashoffset", -length)  // Reset to negative length
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

    function createMessageAnimations(messages: Array<{senderId: string, timestamp: string}>) {
      g.selectAll(".message-envelope").remove();
      g.selectAll("filter[id^='glow-']").remove();

      // Create message map to link senders with multiple possible recipients
      const messageMap = new Map<string, string[]>();
      collaborationsProp.forEach(collab => {
        // For provider swarm
        if (!messageMap.has(collab.providerSwarm.id)) {
          messageMap.set(collab.providerSwarm.id, []);
        }
        messageMap.get(collab.providerSwarm.id)?.push(collab.clientSwarm.id);

        // For client swarm
        if (!messageMap.has(collab.clientSwarm.id)) {
          messageMap.set(collab.clientSwarm.id, []);
        }
        messageMap.get(collab.clientSwarm.id)?.push(collab.providerSwarm.id);
      });

      // Create a single reusable glow filter
      const glowFilter = defs.append("filter")
        .attr("id", "envelope-glow")
        .attr("width", "300%")
        .attr("height", "300%")
        .attr("x", "-100%")
        .attr("y", "-100%")
        .html(`
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feFlood flood-color="#fff" flood-opacity="0.3"/>
          <feComposite in2="blur" operator="in"/>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        `);

      // Pre-calculate node positions and sizes
      const nodePositions = new Map(nodes.map(node => [
        node.id, {
          x: node.x,
          y: node.y,
          size: getNodeSize(node.id)
        }
      ]));

      const sortedMessages = [...messages].sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      function animateMessages() {
        let activeAnimations = 0;
        const totalDuration = 0;

        // Process messages in batches
        const recentMessages = sortedMessages.slice(-100);
        const batchSize = 10; // Number of envelopes to animate simultaneously
        
        // Process messages in batches
        for(let i = 0; i < recentMessages.length; i += batchSize) {
          const batch = recentMessages.slice(i, i + batchSize);
          
          batch.forEach((message, index) => {
            const possibleTargets = messageMap.get(message.senderId);
            if (!possibleTargets || possibleTargets.length === 0) return;
            
            // Randomly select one of the possible targets
            const targetId = possibleTargets[Math.floor(Math.random() * possibleTargets.length)];
            if (!targetId) return;

            const sourcePos = nodePositions.get(message.senderId);
            const targetPos = nodePositions.get(targetId);
            
            if (!sourcePos || !targetPos) return;

            setTimeout(() => {
              activeAnimations++;
              
              // Calculate path once
              const dx = targetPos.x - sourcePos.x;
              const dy = targetPos.y - sourcePos.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              
              const startX = sourcePos.x + (dx / distance * sourcePos.size);
              const startY = sourcePos.y + (dy / distance * sourcePos.size);
              const endX = targetPos.x - (dx / distance * targetPos.size);
              const endY = targetPos.y - (dy / distance * targetPos.size);
              
              const pathData = `
                M ${startX} ${startY}
                Q ${(startX + endX) / 2} ${(startY + endY) / 2 - distance * 0.2},
                  ${endX} ${endY}
              `;

              const tempPath = g.append("path")
                .attr("d", pathData)
                .style("display", "none");

              const pathLength = tempPath.node()?.getTotalLength() || 0;
              
              const envelopeGroup = g.append("g")
                .attr("class", "message-envelope")
                .style("opacity", 0);

              envelopeGroup.html(`
                <use href="#envelope-icon" width="32" height="32" fill="white" style="filter:url(#envelope-glow)"/>
                <use href="#envelope-icon" width="32" height="32" fill="white"/>
              `);

              const animationDuration = 2500;
              // Stagger the animations within each batch
              const staggerDelay = (index % batchSize) * 200; // 200ms stagger within batch
              
              let startTime: number | null = null;
              let animationFrame: number;
              
              function animate(timestamp: number) {
                if (!startTime) startTime = timestamp + staggerDelay;
                const progress = Math.max(0, (timestamp - startTime) / animationDuration);

                if (progress < 1) {
                  const t = progress;
                  const point = tempPath.node()?.getPointAtLength(t * pathLength);
                  
                  if (point) {
                    const nextPoint = tempPath.node()?.getPointAtLength(Math.min(pathLength, (t + 0.01) * pathLength));
                    const angle = nextPoint ? Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * 180 / Math.PI : 0;
                    
                    // Add slight randomization to envelope paths
                    const jitter = Math.sin(progress * Math.PI * 4) * 2;
                    
                    envelopeGroup
                      .attr("transform", `translate(${point.x - 16 + jitter},${point.y - 16}) rotate(${angle}, 16, 16)`)
                      .style("opacity", t < 0.1 ? t * 10 : t > 0.9 ? (1 - t) * 10 : 1);
                    
                    animationFrame = requestAnimationFrame(animate);
                  }
                } else {
                  tempPath.remove();
                  envelopeGroup.remove();
                  activeAnimations--;

                  if (activeAnimations === 0) {
                    setTimeout(animateMessages, 500); // Reduced delay between cycles
                  }
                }
              }

              animationFrame = requestAnimationFrame(animate);
            }, Math.floor(i / batchSize) * 1000); // 1 second between batches
          });
        }
      }

      // Start initial animation
      animateMessages();

      // Cleanup function
      return () => {
        g.selectAll(".message-envelope").remove();
        g.selectAll("filter[id^='envelope-glow']").remove();
        // Cancel any pending animations
        const highestId = window.requestAnimationFrame(() => {});
        for (let i = 0; i < highestId; i++) {
          window.cancelAnimationFrame(i);
        }
      };
    }

    // Fetch messages for all collaborations
    const fetchMessages = () => {
      Promise.all(collaborationsProp.map(collab => 
        fetch(`/api/collaborations/${collab.id}/messages`)
          .then(res => res.json())
          .then(data => data.messages)
      ))
      .then(messagesArrays => {
        const allMessages = messagesArrays.flat();
        createMessageAnimations(allMessages);
      })
      .catch(error => {
        console.error('Error fetching messages:', error);
      });
    };

    fetchMessages();

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
        // Stop simulation
        simulation.stop();
        
        // Remove all elements
        svg.selectAll("*").remove();
        
        // Clear any running intervals and animations
        const highestId = window.requestAnimationFrame(() => {});
        for (let i = 0; i < highestId; i++) {
            window.cancelAnimationFrame(i);
        }
        
        // Clear intervals
        const highestIntervalId = window.setInterval(() => {}, 0);
        for (let i = 0; i < highestIntervalId; i++) {
            window.clearInterval(i);
        }
        
        // Remove any tooltips
        d3.select("body").selectAll(".graph-tooltip").remove();
        
        // Remove any added styles
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
