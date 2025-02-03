"use client"

import { Check, ChevronDown, ChevronsUpDown } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { Button } from "@/components/shadcn/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/shadcn/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/shadcn/popover";
import { useEffect, useRef, useState } from "react";
import { SwarmModel, SwarmPreviewData } from "../swarm.types";
import { useState, useEffect } from "react";
import { getSwarm } from "@/data/swarms/info";
import { getSwarmInfo } from "@/data/swarms/info";

interface SwarmComboBoxProps {
    defaultValue?: string;
    className?: string;
    onChange: (value: string) => void;
}

const SwarmComboBox = ({ className, defaultValue, onChange }: SwarmComboBoxProps) => {
    const [swarms, setSwarms] = useState([]);

    useEffect(() => {
        async function fetchSwarms() {
            try {
                const response = await fetch('/api/swarms');
                const data = await response.json();
                setSwarms(data);
            } catch (error) {
                console.error('Error fetching swarms:', error);
            }
        }
        fetchSwarms();
    }, []);

    const btnRef = useRef<HTMLButtonElement>(null);

    const [open, setOpen] = useState<boolean>(false)
    const [value, setValue] = useState<string>(defaultValue || "");
    const [swarm, setSwarm] = useState<SwarmPreviewData | undefined>(undefined);

    useEffect(() => {
        setSwarm(getSwarm(value));
        onChange(value);
    }, [value, defaultValue, onChange])

    const handleFilter = (value: string, search: string): number => {
        const swarm = getSwarm(value);
        if (
            swarm.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
            swarm.models.toString().toLocaleLowerCase().includes(search.toLocaleLowerCase() as SwarmModel) ||
            swarm.tags.toString().toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
            swarm.role?.toString().toLocaleLowerCase().includes(search.toLocaleLowerCase())
        ) {
            return 1;
        }

        return 0;
    }

    const handleClick = (value: string) => {
        if(!value) return;
        setValue(value)
        setOpen(false)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full justify-between min-h-none h-fit duration-500 bg-card", className)}
                    ref={btnRef}
                >
                    {value ?
                        <div className="flex items-center min-w-[200px] gap-4 pl-1 py-1">
                            <Image
                                src={swarm?.image as string || "/swarms/placeholder.jpg"}
                                alt={`${swarm?.name} avatar`}
                                width={32}
                                height={32}
                                className="rounded-full"
                            />
                            <div className="flex flex-col text-left">
                                <p className="text-lg mb-0 leading-1 truncate">{swarm?.name}</p>
                                {swarm?.role && <p className="text-sm text-muted truncate">{swarm?.role}</p>}
                            </div>
                        </div>
                        :
                        'Select a swarm'
                    }
                    {value === "" ? <ChevronsUpDown className="text-muted" /> : <ChevronDown className="text-muted" />}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" style={{ width: btnRef.current?.clientWidth as number + 2 }}>
                <Command filter={handleFilter}>
                    <CommandInput accessKey="namek" placeholder="Search for a swarm..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>No swarms found.</CommandEmpty>
                        <CommandGroup>
                            {swarms.map((swarm: SwarmPreviewData, index: number) => {
                                const swarmInfo = getSwarmInfo(swarm.id);
                                // Early return if no swarm info or no pool
                                if (!swarmInfo?.pool) return null;
                                
                                return (
                                    <CommandItem
                                        key={index}
                                        value={swarm.id}
                                        onSelect={(currentValue) => handleClick(currentValue)}
                                    >
                                        {swarm.name}
                                        <Check
                                            className={cn(
                                                "ml-auto",
                                                value === swarm.id ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export { SwarmComboBox };
export type { SwarmComboBoxProps };
