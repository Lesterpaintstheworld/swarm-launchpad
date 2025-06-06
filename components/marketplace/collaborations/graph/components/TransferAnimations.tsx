'use client';

import { useEffect, useState, useCallback } from 'react';
import { SimulationNode, SimulationLink } from '../types';
const frameCallbacks = new Set<() => void>();
const globalAnimationFrame = () => {
    frameCallbacks.forEach(cb => cb());
    if (frameCallbacks.size > 0) {
        requestAnimationFrame(globalAnimationFrame);
    }
};
import * as d3 from 'd3';

interface TransferAnimationsProps {
    g: d3.Selection<SVGGElement, unknown, null, undefined>;
    defs: d3.Selection<SVGDefsElement, unknown, null, undefined>;
    nodes: SimulationNode[];
    links: SimulationLink[];
    collaborations: Array<{
        id: string;
        providerSwarm: { id: string };
        clientSwarm: { id: string };
        price: number;
        status: string;
    }>;
    getNodeSize: (id: string) => number;
}

export function TransferAnimations({ g, defs, nodes, links, collaborations, getNodeSize }: TransferAnimationsProps) {
    const [activeTransfers, setActiveTransfers] = useState<Set<string>>(new Set());
    const MAX_CONCURRENT_TRANSFERS = 8;
    const ANIMATION_DURATION = 5000;
    const NEW_TRANSFER_INTERVAL = 800;

    const animateTransfer = useCallback((sourceId: string, targetId: string, amount: number, transferId: string) => {
        const sourceNode = nodes.find(n => n.id === sourceId);
        const targetNode = nodes.find(n => n.id === targetId);

        if (!sourceNode || !targetNode) {
            console.warn('Source or target node not found', { sourceId, targetId });
            return;
        }

        // Validate node coordinates
        if (typeof sourceNode.x !== 'number' || typeof sourceNode.y !== 'number' || 
            typeof targetNode.x !== 'number' || typeof targetNode.y !== 'number' ||
            isNaN(sourceNode.x) || isNaN(sourceNode.y) || 
            isNaN(targetNode.x) || isNaN(targetNode.y)) {
            console.warn('Invalid node coordinates', { sourceNode, targetNode });
            return;
        }

        const animationsLayer = g.select('.animations-layer');
        if (!animationsLayer || animationsLayer.empty()) {
            console.warn('Animations layer not found');
            return;
        }
    
        // Check if this is a revenue flow (transfer to shareholders)
        const isRevenueFlow = targetId === 'shareholders';
    
        const numberOfDollars = Math.max(1, Math.floor(amount / 10000));
        const dollarSpacing = 0.1; // Spacing between dollars along the path
        const dollarAppearInterval = 200; // Time between each dollar appearing

        function createArcPath(source: { x: number, y: number }, target: { x: number, y: number }, isReverse: boolean) {
            // Validate coordinates more thoroughly
            if (!source || !target || 
                typeof source.x !== 'number' || typeof source.y !== 'number' || 
                typeof target.x !== 'number' || typeof target.y !== 'number' ||
                isNaN(source.x) || isNaN(source.y) || isNaN(target.x) || isNaN(target.y)) {
                console.warn('Invalid coordinates for animation path', { source, target });
                return null;
            }
    
            const dx = target.x - source.x;
            const dy = target.y - source.y;
            const dr = Math.sqrt(dx * dx + dy * dy);
    
            // Ensure dr is valid
            if (isNaN(dr) || dr === 0) {
                console.warn('Invalid path calculation', { dx, dy, dr });
                return null;
            }
    
            // Change sweep flag for revenue flows (to shareholders)
            const sweepFlag = targetId === 'shareholders' ? "1" : isReverse ? "0" : "1";
            return `M${source.x},${source.y}A${dr},${dr} 0 0,${sweepFlag} ${target.x},${target.y}`;
        }

        const path = createArcPath(sourceNode, targetNode, true);
        if (!path) {
            console.warn('Could not create valid path for animation');
            return; // Exit early if we can't create a valid path
        }
        
        const pathElement = animationsLayer.append("path")
            .attr("d", path)
            .style("display", "none");

        const pathLength = pathElement.node()?.getTotalLength() || 0;
        const duration = ANIMATION_DURATION;
        let activeDollars = 0;

        // Create and animate a single dollar sign
        function animateDollar(index: number) {
            const startTime = Date.now();
            const dollarGroup = animationsLayer.append("g")
                .attr("class", "token-transfer")
                .style("opacity", 0);

            // For revenue flows, make 1/10 of the tokens yellow (representing distributed revenue)
            const isDistributedRevenue = isRevenueFlow && (index % 10 === 0);

            // Check if animationsLayer exists
            if (!animationsLayer || animationsLayer.empty()) {
                console.warn('Animations layer not found');
                return;
            }
        
            // Create just the token circle
            dollarGroup.append("circle")
                .attr("r", isDistributedRevenue ? 6 : 3)  // Changed from 12 to 6 for distributed revenue
                .attr("fill", isDistributedRevenue ? "#fbbf24" : "#8b5cf6")  // Yellow for distributed revenue, violet for others
                .attr("stroke", isDistributedRevenue ? "#fde68a" : "#a855f7")
                .attr("stroke-width", 1);

            // Add flame gradient if it doesn't exist
            if (!defs.select("#flame-gradient").size()) {
                const flameGradient = defs.append("radialGradient")
                    .attr("id", "flame-gradient")
                    .attr("gradientUnits", "objectBoundingBox")
                    .attr("cx", "0.5")
                    .attr("cy", "0.5")
                    .attr("r", "0.5");

                flameGradient.append("stop")
                    .attr("offset", "0%")
                    .attr("stop-color", "#fef08a"); // Yellow

                flameGradient.append("stop")
                    .attr("offset", "50%")
                    .attr("stop-color", "#f97316"); // Orange

                flameGradient.append("stop")
                    .attr("offset", "100%")
                    .attr("stop-color", "#dc2626"); // Red
            }


            activeDollars++;

            // Remove shouldDisappear check for revenue flows
            const shouldDisappear = !isRevenueFlow && index % 2 === 0;

            function animateSingleDollar() {
                const animate = () => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Check if pathElement exists and has a valid node
                    if (!pathElement.node()) {
                        console.warn('Path element node is null');
                        frameCallbacks.delete(animate);
                        return false;
                    }
                    
                    try {
                        // Get the path length again to ensure it's valid
                        const currentPathLength = pathElement.node()?.getTotalLength() || 0;
                        if (currentPathLength <= 0) {
                            console.warn('Path has zero or negative length');
                            frameCallbacks.delete(animate);
                            dollarGroup.remove();
                            activeDollars--;
                            return false;
                        }
                    
                        const point = pathElement.node()?.getPointAtLength(progress * currentPathLength);
                    
                        if (!point || typeof point.x !== 'number' || typeof point.y !== 'number' || 
                            isNaN(point.x) || isNaN(point.y)) {
                            console.warn('Invalid point from getPointAtLength', point);
                            frameCallbacks.delete(animate);
                            dollarGroup.remove();
                            activeDollars--;
                            return false;
                        }
                    
                        const isMidpoint = Math.abs(progress - 0.5) < 0.05;
                    
                        // Only do flame effect for non-revenue flows
                        if (!isRevenueFlow && shouldDisappear && isMidpoint) {
                            const flameGroup = animationsLayer.append("g")
                                .attr("transform", `translate(${point.x},${point.y})`);

                            for (let i = 0; i < 8; i++) {
                                const angle = (i * Math.PI * 2) / 8;
                                const flameParticle = flameGroup.append("circle")
                                    .attr("r", 3)
                                    .attr("fill", "url(#flame-gradient)")
                                    .attr("opacity", 1);

                                flameParticle.transition()
                                    .duration(500)
                                    .attr("r", 1)
                                    .attr("transform", `translate(${Math.cos(angle) * 15},${Math.sin(angle) * 15})`)
                                    .style("opacity", 0)
                                    .remove();
                            }

                            dollarGroup.remove();
                            activeDollars--;
                        
                            if (activeDollars === 0) {
                                pathElement.remove();
                                setActiveTransfers(prev => {
                                    const next = new Set(prev);
                                    next.delete(transferId);
                                    return next;
                                });
                            }
                            frameCallbacks.delete(animate);
                            return false;
                        }

                        const opacity = progress < 0.1 ? progress * 10 : 
                                      progress > 0.9 ? (1 - progress) * 10 : 1;

                        dollarGroup
                            .attr("transform", `translate(${point.x},${point.y})`)
                            .style("opacity", shouldDisappear && !isRevenueFlow ? 
                                (progress < 0.5 ? opacity : 0) : 
                                opacity
                            );
                    } catch (error) {
                        console.error('Error in animation:', error);
                        dollarGroup.remove();
                        activeDollars--;
                        
                        if (activeDollars === 0) {
                            pathElement.remove();
                            setActiveTransfers(prev => {
                                const next = new Set(prev);
                                next.delete(transferId);
                                return next;
                            });
                        }
                        frameCallbacks.delete(animate);
                        return false;
                    }

                    if (progress < 1) {
                        return true;
                    } else {
                        dollarGroup.remove();
                        activeDollars--;
                        
                        if (activeDollars === 0) {
                            pathElement.remove();
                            setActiveTransfers(prev => {
                                const next = new Set(prev);
                                next.delete(transferId);
                                return next;
                            });
                        }
                        frameCallbacks.delete(animate);
                        return false;
                    }
                };

                frameCallbacks.add(animate);
                if (frameCallbacks.size === 1) {
                    requestAnimationFrame(globalAnimationFrame);
                }
            }

            animateSingleDollar();
        }

        // Start creating dollar signs with intervals
        for (let i = 0; i < numberOfDollars; i++) {
            setTimeout(() => animateDollar(i), i * dollarAppearInterval);
        }
    }, [nodes, g, defs]);

    useEffect(() => {
        const animationsLayer = g.select('.animations-layer');
        if (animationsLayer.empty()) return;

        // Get all links that are revenue flows 
        const revenueFlows = links.filter((link: any) => link.isRevenueFlow);
        
        const timer = setInterval(() => {
            if (activeTransfers.size >= MAX_CONCURRENT_TRANSFERS) return;
            
            const getSourceId = (source: string | number | SimulationNode) => {
                if (typeof source === 'object' && source !== null && 'id' in source) {
                    return source.id;
                }
                return String(source);
            };

            // Randomly choose between regular collaborations and revenue flows
            interface CollaborationType {
                id: string;
                providerSwarm: { id: string };
                clientSwarm: { id: string };
                price: number;
                status: string;
            }

            const isCollaboration = (transfer: SimulationLink | CollaborationType): transfer is CollaborationType => {
                return 'id' in transfer && 'providerSwarm' in transfer && 'clientSwarm' in transfer;
            };

            const shouldAnimateRevenue = Math.random() < 0.5; // 50% chance for revenue flows
            
            let availableTransfers;
            if (shouldAnimateRevenue) {
                console.log('Revenue flows available:', revenueFlows);
                availableTransfers = revenueFlows.filter(
                    flow => {
                        const id = `${getSourceId(flow.source)}-revenue`;
                        const isActive = !activeTransfers.has(id);
                        console.log('Checking revenue flow:', {
                            source: flow.source,
                            sourceId: getSourceId(flow.source),
                            id,
                            isActive,
                            activeTransfers: Array.from(activeTransfers)
                        });
                        return isActive;
                    }
                );
            } else {
                // Only use active collaborations
                availableTransfers = collaborations.filter(
                    collab => !activeTransfers.has(collab.id) && collab.status === 'active'
                );
            }
            
            if (availableTransfers.length > 0) {
                const transfer = availableTransfers[
                    Math.floor(Math.random() * availableTransfers.length)
                ];
                
                const isSimulationLink = (transfer: SimulationLink | any): transfer is SimulationLink => {
                    return 'source' in transfer && 'target' in transfer;
                };

                if (shouldAnimateRevenue) {
                    if (!isSimulationLink(transfer)) {
                        console.warn('Expected SimulationLink for revenue transfer');
                        return;
                    }
                    const transferId = `${getSourceId(transfer.source)}-revenue`;
                    setActiveTransfers(prev => {
                        const next = new Set(prev);
                        next.add(transferId);
                        return next;
                    });
                
                    animateTransfer(
                        getSourceId(transfer.source),
                        'shareholders',
                        transfer.value,
                        transferId
                    );
                } else {
                    if (!isCollaboration(transfer)) {
                        console.warn('Expected Collaboration for regular transfer');
                        return;
                    }
                    const transferId = transfer.id;
                    setActiveTransfers(prev => {
                        const next = new Set(prev);
                        next.add(transferId);
                        return next;
                    });
                
                    animateTransfer(
                        transfer.clientSwarm.id,
                        transfer.providerSwarm.id,
                        transfer.price,
                        transferId
                    );
                }
            }
        }, NEW_TRANSFER_INTERVAL);

        return () => clearInterval(timer);
    }, [activeTransfers, collaborations, nodes, g, defs, getNodeSize, links, animateTransfer]);

    return null;
}
