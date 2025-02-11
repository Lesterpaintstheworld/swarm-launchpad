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

        // Draw links with animated lights
        const linkGroup = g.append("g")
            .attr("class", "links");

        // Base links
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

        // Animated lights
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

        function animateLights() {
            lights.each(function(d: SimulationLink) {
                const length = (this as SVGPathElement).getTotalLength();
                const width = calculateWidth(d.value);
                const dashLength = Math.max(width * 5, length * 0.1);
                
                d3.select(this)
                    .attr("stroke-dasharray", `${dashLength} ${length - dashLength}`)
                    .attr("stroke-dashoffset", -length)
                    .transition()
                    .duration(4000)
                    .ease(d3.easeLinear)
                    .attr("stroke-dashoffset", 0)
                    .on("end", function() {
                        d3.select(this)
                            .attr("stroke-dashoffset", -length)
                            .transition()
                            .duration(0)
                            .on("end", animateLights);
                    });
            });
        }

        // Start the animation
        animateLights();

        return () => {
            lightsGroup.selectAll(".link-light").interrupt();
        };
    }, [g, defs, links, calculateWidth]);

    return null;
}
