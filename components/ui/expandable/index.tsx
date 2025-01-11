'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from "@/components/shadcn/button"
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import css from "./expandable.module.css";

interface ExpandableProps {
    children: React.ReactNode;
    className?: string;
    openLabel?: string;
    closedLabel?: string;
    showChevron?: boolean;
    overflowThreshold?: number;
}

export default function Expandable({
    children,
    className,
    openLabel = 'Read less',
    closedLabel = 'Read more',
    showChevron = true,
    overflowThreshold = 500
}: ExpandableProps) {

    const [isExpanded, setIsExpanded] = useState(false);
    const [showButton, setShowButton] = useState(false);

    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (contentRef.current) {
            setShowButton(contentRef.current.scrollHeight > overflowThreshold);
        };
    }, [children]);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    // Function to recursively set tabIndex on all focusable elements
    const setTabIndex = (elements: HTMLCollection, tabIndex: number) => {
        Array.from(elements).forEach((element) => {
            if (
                element instanceof HTMLButtonElement ||
                element instanceof HTMLAnchorElement ||
                element instanceof HTMLInputElement ||
                element instanceof HTMLSelectElement ||
                element instanceof HTMLTextAreaElement ||
                element.getAttribute('tabindex') !== null
            ) {
                element.setAttribute('tabindex', tabIndex.toString());
            }
            if (element.children) {
                setTabIndex(element.children, tabIndex);
            }
        })
    }

    useEffect(() => {
        if (contentRef.current) {
            setTabIndex(contentRef.current.children, isExpanded ? 0 : -1);
        }
    }, [isExpanded]);

    return (
        <div className={cn("relative flex flex-col gap-4", className)}>
            <div
                ref={contentRef}
                className={`overflow-hidden transition-all duration-700 ease-in-out${isExpanded ? '' : ` max-h-[${overflowThreshold}px] ${css['mask-fade']}`}`}
                style={{ maxHeight: isExpanded ? `${contentRef.current?.scrollHeight}px` : `${overflowThreshold}px` }}
            >
                {children}
            </div>
            {showButton && (
                <Button
                    onClick={toggleExpand}
                    aria-expanded={isExpanded}
                    aria-controls="expandable-content"
                    className='w-fit mb-4'
                >
                    {isExpanded ? openLabel : closedLabel}
                    {showChevron && <ChevronDown className={`ml-2 h-4 w-4 duration-100 ${isExpanded ? 'rotate-180' : 'rotate-0'}`} />}
                </Button>
            )}
        </div>
    );
}

export { Expandable }