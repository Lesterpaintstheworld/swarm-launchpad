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
        // Add a filter for the compute pulse glow
        const pulseFilter = defs.append("filter")
            .attr("id", "compute-pulse-glow")
            .attr("width", "300%")
            .attr("height", "300%")
            .attr("x", "-100%")
            .attr("y", "-100%")
            .html(`
                <feGaussianBlur stdDeviation="3" result="blur"/>
                <feFlood flood-color="#00ff88" flood-opacity="0.6"/>
                <feComposite in2="blur" operator="in"/>
                <feMerge>
                    <feMergeNode/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            `);

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

        // Create a group for compute pulses
        const computePulsesGroup = g.append("g")
            .attr("class", "compute-pulses");

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

        // Start the animations
        animateLights();
        createComputePulses();

        function createComputePulses() {
            console.log('Creating compute pulses for links:', links.map(l => ({
                source: l.source,
                target: l.target,
                value: l.value
            })));

            links.forEach(link => {
                const computeAmount = link.value;
                const numPulses = Math.floor(computeAmount / 1000);
        
                console.log('Link compute details:', {
                    computeAmount,
                    numPulses,
                    source: (link.source as SimulationNode).id,
                    target: (link.target as SimulationNode).id
                });
        
                if (numPulses > 0) {
                    const source = link.source as SimulationNode;
                    const target = link.target as SimulationNode;
                    
                    for (let i = 0; i < numPulses; i++) {
                        const pulseGroup = computePulsesGroup.append("g")
                            .attr("class", "compute-pulse");

                        const pulse = pulseGroup.append("circle")
                            .attr("r", 3)
                            .attr("fill", "#00ff88")
                            .style("filter", "url(#compute-pulse-glow)")
                            .style("opacity", 0);

                        function animatePulse() {
                            const dx = target.x - source.x;
                            const dy = target.y - source.y;
                            const distance = Math.sqrt(dx * dx + dy * dy);
                    
                            // Calculate path points for curved animation
                            const midX = (source.x + target.x) / 2;
                            const midY = (source.y + target.y) / 2 - distance * 0.2;
                    
                            pulse
                                .attr("cx", source.x)
                                .attr("cy", source.y)
                                .style("opacity", 1)
                                .transition()
                                .duration(2000)
                                .ease(d3.easeLinear)
                                .attrTween("cx", () => {
                                    return (t: number) => {
                                        const x1 = source.x;
                                        const x2 = midX;
                                        const x3 = target.x;
                                        return Math.pow(1-t, 2) * x1 + 2 * (1-t) * t * x2 + Math.pow(t, 2) * x3;
                                    };
                                })
                                .attrTween("cy", () => {
                                    return (t: number) => {
                                        const y1 = source.y;
                                        const y2 = midY;
                                        const y3 = target.y;
                                        return Math.pow(1-t, 2) * y1 + 2 * (1-t) * t * y2 + Math.pow(t, 2) * y3;
                                    };
                                })
                                .transition()
                                .duration(200)
                                .style("opacity", 0)
                                .on("end", () => {
                                    setTimeout(animatePulse, (2000 * numPulses) / numPulses);
                                });
                        }

                        // Stagger the start of each pulse
                        setTimeout(() => animatePulse(), (i * 2000) / numPulses);
                    }
                }
            });
        }

        return () => {
            lightsGroup.selectAll(".link-light").interrupt();
            computePulsesGroup.selectAll(".compute-pulse").remove();
        };
    }, [g, defs, links, calculateWidth]);

    return null;
}
