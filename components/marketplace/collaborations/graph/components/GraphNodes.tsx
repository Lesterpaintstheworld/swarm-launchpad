'use client';

import { useEffect } from 'react';
import * as d3 from 'd3';
import ReactDOMServer from 'react-dom/server';
import ReactDOMServer from 'react-dom/server';
import { SimulationNode, SwarmData } from '../types';
import { GraphTooltip } from './GraphTooltip';

interface GraphNodesProps {
    g: d3.Selection<SVGGElement, unknown, null, undefined>;
    nodes: SimulationNode[];
    ecosystemTargets: Set<string>;
    getNodeSize: (id: string) => number;
    simulation: d3.Simulation<SimulationNode, any>;
    swarmMap: Map<string, SwarmData>;
    swarms: SwarmData[];
    onDragStart: (event: d3.D3DragEvent<SVGGElement, SimulationNode, unknown>) => void;
    onDrag: (event: d3.D3DragEvent<SVGGElement, SimulationNode, unknown>) => void;
    onDragEnd: (event: d3.D3DragEvent<SVGGElement, SimulationNode, unknown>) => void;
}

export function GraphNodes({ 
    g, 
    nodes, 
    ecosystemTargets, 
    getNodeSize, 
    simulation,
    swarmMap,
    swarms,
    onDragStart,
    onDrag,
    onDragEnd
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
                .on("start", onDragStart)
                .on("drag", onDrag)
                .on("end", onDragEnd))
            .on("mouseover", (event, d) => {
                const swarm = swarmMap.get(d.id);
                const previewData = swarms.find(p => p.id === d.id);
                if (!swarm || !previewData) return;

                const multiple = swarm.multiple || 1;
                const revenueShare = swarm.revenueShare || 60;
                
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


        return () => {
            tooltip.remove();
            document.head.removeChild(style);
        };
    }, [g, nodes, ecosystemTargets, getNodeSize, simulation, swarmMap, swarms]);

    return null;
}
