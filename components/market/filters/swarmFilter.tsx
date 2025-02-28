'use client'

import { useState, useEffect, useRef } from 'react'
import { Check, ChevronsUpDown, Filter, X } from 'lucide-react'
import { Button } from '@/components/shadcn/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useQuery } from '@tanstack/react-query'
import { cn } from '@/lib/utils'

interface SwarmFilterProps {
  onFilterChange: (selectedSwarms: string[]) => void
  isFiltered: boolean
  onClearFilter: () => void
}

interface SwarmData {
  id: string;
  name: string;
  pool?: string;
  image?: string;
  description?: string;
  role?: string;
}

export function SwarmFilter({ onFilterChange, isFiltered, onClearFilter }: SwarmFilterProps) {
  const [open, setOpen] = useState(false)
  const [selectedSwarms, setSelectedSwarms] = useState<string[]>([])
  const initialRenderRef = useRef(true)
  const prevSelectedSwarmsRef = useRef<string[]>([])

  // Fetch swarms available on secondary market
  const { data: swarms, isLoading } = useQuery({
    queryKey: ['swarms-secondary-market'],
    queryFn: async () => {
      const response = await fetch('/api/swarms/secondary-market-available');
      if (!response.ok) {
        throw new Error('Failed to fetch swarms');
      }
      return response.json() as Promise<SwarmData[]>;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  })

  useEffect(() => {
    // Skip the first render to prevent initial filter application
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      return;
    }
    
    // Check if the selected swarms have actually changed
    const prevSelected = prevSelectedSwarmsRef.current;
    if (
      prevSelected.length === selectedSwarms.length &&
      prevSelected.every(id => selectedSwarms.includes(id))
    ) {
      return; // No change, skip update
    }
    
    // Update the ref with current selection
    prevSelectedSwarmsRef.current = [...selectedSwarms];
    
    // Use a debounce to prevent too many filter changes
    const handler = setTimeout(() => {
      onFilterChange(selectedSwarms);
    }, 300);
    
    return () => clearTimeout(handler);
  }, [selectedSwarms, onFilterChange]);

  const toggleSwarm = (swarmId: string) => {
    setSelectedSwarms(prev => 
      prev.includes(swarmId) 
        ? prev.filter(id => id !== swarmId)
        : [...prev, swarmId]
    )
  }

  const handleClearFilter = () => {
    setSelectedSwarms([]);
    onClearFilter();
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`h-8 gap-1 ${isFiltered ? 'bg-primary/10 text-primary' : ''}`}
        >
          <Filter className="h-3.5 w-3.5" />
          {selectedSwarms.length > 0 && (
            <Badge 
              variant="secondary" 
              className="rounded-sm px-1 font-normal"
            >
              {selectedSwarms.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search swarms..." />
          <CommandList>
            <CommandEmpty>No swarms found.</CommandEmpty>
            <CommandGroup>
              {isLoading ? (
                <div className="p-2 text-sm text-muted-foreground">Loading swarms...</div>
              ) : (
                swarms?.map((swarm: SwarmData) => (
                  <CommandItem
                    key={swarm.id}
                    value={swarm.id}
                    onSelect={(currentValue: string) => {
                      toggleSwarm(swarm.id);
                      // Don't close the popover when selecting items
                      return false;
                    }}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <div 
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        selectedSwarms.includes(swarm.id) ? "bg-primary text-primary-foreground" : "opacity-50"
                      )}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent event propagation
                        toggleSwarm(swarm.id);
                      }}
                    >
                      {selectedSwarms.includes(swarm.id) && (
                        <Check className="h-3 w-3" />
                      )}
                    </div>
                    <span>{swarm.name}</span>
                  </CommandItem>
                ))
              )}
            </CommandGroup>
            {selectedSwarms.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={handleClearFilter}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
