'use client'

import { useState, useEffect, useRef } from 'react'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { LucideFilter, LucideX } from 'lucide-react'
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface SharesFilterProps {
  onFilterChange: (value: { amount: number, type: 'more' | 'less' }) => void
  isFiltered: boolean
  onClearFilter: () => void
}

export function SharesFilter({ onFilterChange, isFiltered, onClearFilter }: SharesFilterProps) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState(100)
  const [filterType, setFilterType] = useState<'more' | 'less'>('more')
  const initialRenderRef = useRef(true)

  useEffect(() => {
    // Skip the first render to prevent initial filter application
    if (initialRenderRef.current) {
      initialRenderRef.current = false
      return
    }
    
    // Use a debounce to prevent too many filter changes
    const handler = setTimeout(() => {
      onFilterChange({ amount, type: filterType })
    }, 300)
    
    return () => clearTimeout(handler)
  }, [amount, filterType, onFilterChange])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`h-8 gap-1 ${isFiltered ? 'bg-primary/10 text-primary' : ''}`}
        >
          {isFiltered ? (
            <>
              <LucideFilter className="h-3.5 w-3.5" />
              <span>{filterType === 'more' ? '>' : '<'} {amount}</span>
            </>
          ) : (
            <LucideFilter className="h-3.5 w-3.5" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Filter by shares</h4>
            <p className="text-sm text-muted-foreground">
              Show listings with {filterType === 'more' ? 'more' : 'less'} than {amount} shares
            </p>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="filter-type" className="text-sm">Filter type</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Less than</span>
                <Switch 
                  id="filter-type" 
                  checked={filterType === 'more'}
                  onCheckedChange={(checked: boolean) => setFilterType(checked ? 'more' : 'less')}
                />
                <span className="text-sm text-muted-foreground">More than</span>
              </div>
            </div>
            <div className="space-y-4">
              <Slider
                defaultValue={[100]}
                max={1000}
                min={1}
                step={1}
                value={[amount]}
                onValueChange={(value: number[]) => setAmount(value[0])}
              />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">1</span>
                <span className="text-sm font-medium">{amount}</span>
                <span className="text-sm text-muted-foreground">1000</span>
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                onClearFilter()
                setAmount(100)
                setFilterType('more')
              }}
            >
              Reset
            </Button>
            <Button 
              size="sm" 
              onClick={() => {
                onFilterChange({ amount, type: filterType })
                setOpen(false)
              }}
            >
              Apply Filter
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
