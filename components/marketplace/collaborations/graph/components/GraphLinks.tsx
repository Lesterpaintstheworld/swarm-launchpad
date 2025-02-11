'use client';

import { useEffect } from 'react';
import * as d3 from 'd3';
import { SimulationLink, SimulationNode } from '../types';

interface GraphLinksProps {
    g: d3.Selection<SVGGElement, unknown, null, undefined>;
    defs: d3.Selection<SVGDefsElement, unknown, null, undefined>;
    links: SimulationLink[];
    calculateWidth: (value: number) => number;
}

export function GraphLinks({ g, defs, links, calculateWidth }: GraphLinksProps) {
    useEffect(() => {
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

        // Draw links
        const linkGroup = g.append("g")
            .attr("class", "links");

        // Base links
        linkGroup.append("g")
            .attr("class", "base-links")
            .selectAll("path")
            .data(links)
            .join("path")
            .attr("class", "link-path")
            .attr("stroke", "url(#link-gradient)")
            .attr("stroke-width", d => calculateWidth(d.value))
            .attr("stroke-opacity", 1)
            .attr("fill", "none");

        return () => {
            linkGroup.selectAll("*").remove();
            gradient.remove();
        };
    }, [g, defs, links, calculateWidth]);

    return null;
}
