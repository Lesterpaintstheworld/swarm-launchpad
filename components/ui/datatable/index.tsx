'use client'

import { useState } from "react";
import { DataTableViewOptions } from "./columnToggle";
import { motion, AnimatePresence } from "framer-motion";

import {
    ColumnDef,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
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
    searchable?: boolean;
    pagination?: boolean;
    rowClassName?: string;
    initialFilter?: string;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    rowAnimationDuration = 0.25,
    searchable = false,
    pagination = false,
    rowClassName,
    initialFilter
}: DataTableProps<TData, TValue>) {

    const [sorting, setSorting] = useState<SortingState>([]);

    const [globalFilter, setGlobalFilter] = useState<string>(initialFilter || '');

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: pagination === true ? getPaginationRowModel() : undefined,
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: 'includesString',
        state: {
            sorting,
            globalFilter,
        }
    })

    return (
        <div>
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
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} style={{ width: header.getSize() }}>
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
                            <AnimatePresence>
                                {table.getRowModel().rows.map((row) => (
                                    <motion.tr
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ ease: "ease", duration: rowAnimationDuration }}
                                        className={cn("border-b border-border transition-colors hover:bg-foreground/[3%] data-[state=selected]:bg-muted", rowClassName)}
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="pl-4">
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
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