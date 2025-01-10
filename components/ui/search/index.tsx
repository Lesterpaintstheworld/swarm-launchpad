'use client'

import { forwardRef, useState } from "react";
import { Input, InputProps } from "../input";
import { Search as SearchIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchProps extends InputProps {
    onInputChange?: (value: string) => void;
    onSearch?: (value: string | undefined) => void;
    defaultValue?: string;
    inputClassName?: string;
}

const Search = forwardRef<HTMLInputElement, SearchProps>(
    (
        { onInputChange, defaultValue, className, inputClassName, onSearch, ...props },
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

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter' && onSearch) {
                e.preventDefault()
                onSearch(searchValue);
            }
        }

        return (
            <div className={cn("relative w-full bg-card rounded-lg flex flex-row items-center border border-border overflow-hidden", className)}>
                <Input
                    type="text"
                    placeholder="Search..."
                    className={cn("border-none bg-transparent w-full pl-4 pr-5 rounded-none", inputClassName)}
                    aria-label="Search input"
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    value={searchValue}
                    {...props}
                    ref={ref}
                />
                <div className="flex items-center pr-4">
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
                        <SearchIcon className="h-4 w-4 text-foreground" aria-hidden="true" />
                    )}
                </div>
            </div>
        )
    }
)

export { Search }
export type { SearchProps }