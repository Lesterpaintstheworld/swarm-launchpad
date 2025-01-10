"use client"

import { Button } from "@/components/shadcn/button"
import { Table } from "@tanstack/react-table"
import { LucideChevronDown } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from "@/components/shadcn/dropdown-menu";

export interface DataTableViewOptionsProps<TData> {
    table: Table<TData>
}

export function DataTableViewOptions<TData>({
    table,
}: DataTableViewOptionsProps<TData>) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    className="ml-auto hidden lg:flex"
                >
                    Columns
                    <LucideChevronDown width={14} className="ml-2" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[150px] bg-popover">
                {table
                    .getAllColumns()
                    .filter(
                        (column) =>
                            typeof column.accessorFn !== "undefined" && column.getCanHide()
                    )
                    .map((column) => {
                        return (
                            <DropdownMenuCheckboxItem
                                key={column.id}
                                className="capitalize"
                                checked={column.getIsVisible()}
                                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                            >
                                {
                                    column.id == 'updatedAt' ? 'Last updated' :
                                        column.id == 'createdAt' ? 'Created' :
                                            column.id
                                }
                            </DropdownMenuCheckboxItem>
                        )
                    })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
