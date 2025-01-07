'use client'

import { forwardRef, useState } from "react";
import { Input, InputProps } from "../input";
import { Search as SearchIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchProps extends InputProps {
    onInputChange?: (value: string) => void;
    defaultValue?: string;
}

const Search = forwardRef<HTMLInputElement, SearchProps>(
    (
        { onInputChange, defaultValue, className, ...props },
        ref
    ) => {

        const [searchValue, setSearchValue] = useState<string | undefined>(defaultValue);

        const clearInput = () => {
            setSearchValue("");
            onInputChange?.("");
        }

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;
            setSearchValue(newValue);
            onInputChange?.(newValue);
        }

        return (
            <div className={cn("relative w-full bg-card rounded-lg border border-border", className)}>
                <Input
                    type="text"
                    placeholder="Search..."
                    className="border-none bg-transparent w-full pl-4 pr-5"
                    aria-label="Search input"
                    onChange={handleInputChange}
                    value={searchValue}
                    {...props}
                    ref={ref}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    {searchValue && (
                        <button
                            type="button"
                            onClick={clearInput}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    clearInput();
                                }
                            }}
                            className="p-1 focus:outline-none focus-visible:border focus-visible:border-foreground/30 rounded-sm focus-visible:bg-card"
                            aria-label="Clear search"
                        >
                            <X className="h-4 w-4 text-foreground hover:text-muted" />
                        </button>
                    )}
                    {!searchValue && (
                        <SearchIcon className="h-4 w-4 text-muted" aria-hidden="true" />
                    )}
                </div>
            </div>
        )
    }
)

export { Search }
export type { SearchProps }