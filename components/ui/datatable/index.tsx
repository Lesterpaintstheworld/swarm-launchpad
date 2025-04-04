'use client'

import { useState } from "react";
import { DataTableViewOptions } from "./columnToggle";
import { motion } from "framer-motion";

import {
    ColumnDef,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    Row,
    ColumnFiltersState,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/shadcn/table";

import { DataTablePagination } from "./pagination";
import { Search } from "../search";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    rowAnimationDuration?: number;
    sortable?: boolean;
    searchable?: boolean;
    pagination?: boolean;
    className?: string;
    rowClassName?: string;
    initialFilter?: string;
    // Add this new prop for custom sorting functions
    sortingFns?: Record<string, (rowA: Row<TData>, rowB: Row<TData>, columnId: string) => number>;
    // Add this new prop for custom column filters
    columnFilters?: ColumnFiltersState;
    onColumnFiltersChange?: (filters: ColumnFiltersState) => void;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    rowAnimationDuration = 0.25,
    sortable = true,
    searchable = false,
    pagination = false,
    className,
    rowClassName,
    initialFilter,
    sortingFns,
    columnFilters = [],
    onColumnFiltersChange
}: DataTableProps<TData, TValue>) {

    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState<string>(initialFilter || '');

    // Add state for column filters if not provided externally
    const [internalColumnFilters, setInternalColumnFilters] = useState<ColumnFiltersState>(columnFilters);

    // Use either external or internal column filters
    const activeColumnFilters = onColumnFiltersChange ? columnFilters : internalColumnFilters;
    const setActiveColumnFilters = onColumnFiltersChange ? onColumnFiltersChange : setInternalColumnFilters;

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: pagination ? getPaginationRowModel() : undefined,
        onSortingChange: sortable ? setSorting : undefined,
        getSortedRowModel: sortable ? getSortedRowModel() : undefined,
        getFilteredRowModel: getFilteredRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        onColumnFiltersChange: (updaterOrValue) => {
            // Handle both function updaters and direct values
            if (typeof updaterOrValue === 'function') {
                // Cast the updater function to the correct type
                const updaterFn = updaterOrValue as (state: ColumnFiltersState) => ColumnFiltersState;
                if (onColumnFiltersChange) {
                    // If external handler is provided, compute the new state and pass it directly
                    const newState = updaterFn(activeColumnFilters);
                    onColumnFiltersChange(newState);
                } else {
                    // For internal state, use the React state updater pattern
                    setInternalColumnFilters(prevState => updaterFn(prevState));
                }
            } else {
                setActiveColumnFilters(updaterOrValue);
            }
        },
        globalFilterFn: 'includesString',
        // Properly apply the custom sorting functions
        sortingFns: sortingFns,
        state: {
            sorting,
            globalFilter,
            columnFilters: activeColumnFilters,
        }
    })

    return (
        <div className={className}>
            {searchable &&
                <div className="flex flex-row justify-between w-full mb-4">
                    <Search
                        value={globalFilter}
                        onInputChange={(value: string) => table.setGlobalFilter(value)}
                        className="max-w-96 rounded-sm"
                        inputClassName="py-2"
                    />
                    <DataTableViewOptions table={table} />
                </div>
            }
            <div className="rounded-md">
                <Table className="overflow-hidden">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup, index) => (
                            <TableRow key={index}>
                                {headerGroup.headers.map((header, i) => {
                                    return (
                                        <TableHead key={`${header.id} ${index} ${i}`} style={{ width: header.getSize() }}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())
                                            }
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row, index) => (
                                <TableRow
                                    className={cn("border-b border-border transition-colors hover:bg-foreground/[3%] data-[state=selected]:bg-muted", rowClassName)}
                                    key={`${row.id} ${index}`}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell, i) => (
                                        <TableCell key={`${cell.id} ${index} ${i}`} className="pl-4">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {pagination && <DataTablePagination table={table} />}
        </div>
    )
}
