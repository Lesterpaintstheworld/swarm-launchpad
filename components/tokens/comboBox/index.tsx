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
import { supportedTokens } from "@/data/tokens/supported";

interface SwarmComboBoxProps {
    defaultValue?: string;
    className?: string;
    onChange: (token?: Token) => void;
    disabled?: boolean;
}

const TokenComboBox = ({ className, defaultValue, onChange, disabled }: SwarmComboBoxProps) => {

    const btnRef = useRef<HTMLButtonElement>(null);

    const [open, setOpen] = useState<boolean>(false)
    const [value, setValue] = useState<string>(defaultValue || "");
    const [token, setToken] = useState<string | undefined>(undefined);

    const getToken = (token: string): Token | undefined => {
        return supportedTokens.filter((t: Token) => t.label === token)[0];
    }

    useEffect(() => {
        if (getToken(value)) setToken(value);
        onChange(getToken(value));
    }, [value, defaultValue])

    const handleFilter = (value: string, search: string, keywords?: string[]): number => {
        supportedTokens.forEach((token: Token) => {
            if (token.label.includes(search)) return 1;
        });
        return 0;
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-fit justify-between min-h-none h-fit duration-500 bg-card", className, getToken(value)?.icon ? "pr-6" : "")}
                    ref={btnRef}
                    disabled={disabled}
                >
                    {getToken(value)?.icon &&
                        <Image
                            src={getToken(value)?.icon as string}
                            alt={getToken(value)?.label as string}
                            width={12}
                            height={12}
                        />
                    }
                    {value ?
                        value
                        :
                        'Token'
                    }
                    {value === "" ? <ChevronsUpDown className="text-muted ml-auto" /> : <ChevronDown className="text-muted ml-auto" />}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 max-w-[200px]">
                <Command filter={handleFilter}>
                    <CommandInput placeholder="Search for a token..." className="h-9 placeholder:text-muted" />
                    <CommandList>
                        <CommandEmpty>No tokens found.</CommandEmpty>
                        <CommandGroup>
                            {supportedTokens.map((token: Token, index: number) => (
                                <CommandItem
                                    key={index}
                                    value={token.label}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    {token.icon &&
                                        <Image
                                            src={token.icon}
                                            alt={token.label}
                                            width={12}
                                            height={12}
                                        />
                                    }
                                    <p className={token.icon ? '' : 'font-semibold'}>{token.label}</p>
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            value === token.label ? "opacity-100" : "opacity-0"
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

export { TokenComboBox };