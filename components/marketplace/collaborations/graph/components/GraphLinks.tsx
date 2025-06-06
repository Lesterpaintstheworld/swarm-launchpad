'use client';

import { useEffect } from 'react';
import * as d3 from 'd3';
import { SimulationLink, SimulationNode } from '../types';

interface GraphLinksProps {
    g: d3.Selection<SVGGElement, unknown, null, undefined>;
    defs: d3.Selection<SVGDefsElement, unknown, null, undefined>;
    links: SimulationLink[];
    calculateWidth: (value: number) => number;
    simulation: d3.Simulation<SimulationNode, SimulationLink>;
}

export function GraphLinks({ g, defs, links, calculateWidth, simulation }: GraphLinksProps) {
    useEffect(() => {
        if (!simulation || !g || !defs) return;

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

        // Get or create links layer
        let linksLayer = g.select<SVGGElement>('.links-layer');
        if (linksLayer.empty()) {
            linksLayer = g.append<SVGGElement>("g")
                .attr("class", "links-layer");
        }

        // Draw links
        const linkPaths = linksLayer
            .selectAll<SVGPathElement, SimulationLink>("path")
            .data(links)
            .join("path")
            .attr("class", "link-path")
            .attr("stroke", d => {
                if ((d as any).isRevenueFlow) {
                    return "rgba(234, 179, 8, 0.3)";
                }
                if ((d as any).isShareholderLink) {
                    return "rgba(234, 179, 8, 0.15)";
                }
                return "url(#link-gradient)";
            })
            .attr("stroke-width", d => calculateWidth(d.value))
            .attr("fill", "none")
            .style("pointer-events", "none");

        // Update link positions on simulation tick
        const updateLinks = () => {
            linkPaths.attr("d", (d: any) => {
                if (!d.source || !d.target || 
                    typeof d.source.x !== 'number' || 
                    typeof d.source.y !== 'number' || 
                    typeof d.target.x !== 'number' || 
                    typeof d.target.y !== 'number') {
                    return null;
                }
                const dx = d.target.x - d.source.x;
                const dy = d.target.y - d.source.y;
                const dr = Math.sqrt(dx * dx + dy * dy);
                return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
            });
        };

        if (simulation) {
            simulation.on("tick.links", updateLinks);
        }

        return () => {
            if (simulation) {
                simulation.on("tick.links", null);
            }
            linksLayer.selectAll("*").remove();
            gradient.remove();
        };
    }, [g, defs, links, calculateWidth, simulation]);

    return null;
}
