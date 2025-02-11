'use client';

import { useEffect } from 'react';
import * as d3 from 'd3';
import { SimulationNode, SwarmData } from '../types';

interface GraphNodesProps {
    g: d3.Selection<SVGGElement, unknown, null, undefined>;
    nodes: SimulationNode[];
    ecosystemTargets: Set<string>;
    getNodeSize: (id: string) => number;
    simulation: d3.Simulation<SimulationNode, any>;
    swarmMap: Map<string, SwarmData>;
    swarms: SwarmData[];
}

export function GraphNodes({ 
    g, 
    nodes, 
    ecosystemTargets, 
    getNodeSize, 
    simulation,
    swarmMap,
    swarms
}: GraphNodesProps) {
    useEffect(() => {
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

        // Add tooltip div
        const tooltip = d3.select("body").append("div")
            .attr("class", "absolute hidden p-4 rounded-lg bg-black/90 border border-white/10 backdrop-blur-sm shadow-xl z-50 pointer-events-none")
            .style("max-width", "280px");

        // Create node groups
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

        return () => {
            tooltip.remove();
            document.head.removeChild(style);
        };
    }, [g, nodes, ecosystemTargets, getNodeSize, simulation, swarmMap, swarms]);

    return null;
}
