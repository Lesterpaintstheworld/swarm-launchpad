"use client"

import { Check, ChevronDown, ChevronsUpDown, LucideLoader } from "lucide-react";
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
import { useRef, useState } from "react";
import { SwarmPreviewData } from "../swarm.types";
import { useQuery } from "@tanstack/react-query";

interface SwarmComboBoxProps {
    defaultValue?: string;
    className?: string;
    onChange: (value: string) => void;
    secondaryMarketAvailable?: boolean;
}

const SwarmComboBox = ({ className, defaultValue, onChange, secondaryMarketAvailable }: SwarmComboBoxProps) => {

    const btnRef = useRef<HTMLButtonElement>(null);

    const [open, setOpen] = useState<boolean>(false)
    const [value, setValue] = useState<string>(defaultValue || "kinkong");

    const { data: swarms, isFetching } = useQuery({
        queryKey: ['swarms'],
        queryFn: async () => {
            const response = secondaryMarketAvailable ? await fetch('/api/swarms/secondary-market-available') : await fetch('/api/swarms');
            if (!response.ok) throw new Error('Failed to fetch swarms');
            return response.json();
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const { data: swarm, isFetching: isFetchingSwarm } = useQuery({
        queryKey: ['swarm', value],
        queryFn: async () => {
            const response = await fetch(`/api/swarms/${value}`);
            if (!response.ok) throw new Error('Failed to fetch swarms');
            return response.json();
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const handleFilter = (value: string, search: string): number => {
        const swarm = swarms.find((s: typeof swarm) => s.id === value);
        if (!swarm) return 0;

        if (
            swarm.name.toLowerCase().includes(search.toLowerCase()) ||
            swarm.models?.toString().toLowerCase().includes(search.toLowerCase()) ||
            swarm.tags?.toString().toLowerCase().includes(search.toLowerCase()) ||
            swarm.role?.toString().toLowerCase().includes(search.toLowerCase())
        ) {
            return 1;
        }

        return 0;
    }

    const handleClick = (value: string) => {
        if (!value) return;
        onChange(value);
        setValue(value);
        setOpen(false);
    }

    if (isFetching) return (
        <Button
            role="combobox"
            disabled={true}
            className={cn("w-full justify-between min-h-[60px] h-fit duration-500 bg-card", className)}
            ref={btnRef}
        >
            Select a swarm
            {value === "" ? <ChevronsUpDown className="text-muted" /> : <ChevronDown className="text-muted" />}
        </Button>
    )

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full justify-between min-h-none h-fit duration-500 bg-card", className)}
                    ref={btnRef}
                    disabled={isFetching || isFetchingSwarm}
                >
                    {isFetchingSwarm ?
                        <LucideLoader className="animate-spin text-muted" />
                        :
                        value ?
                            <div className="flex items-center min-w-[200px] gap-4 py-1">
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
                            {swarms.map((swarm: SwarmPreviewData, index: number) => (
                                <CommandItem
                                    key={index}
                                    value={swarm.id}
                                    onSelect={(currentValue: string) => handleClick(currentValue)}
                                >
                                    {swarm.name}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            value === swarm.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export { SwarmComboBox };
export type { SwarmComboBoxProps };
