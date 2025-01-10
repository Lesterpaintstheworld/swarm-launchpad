import { Column } from "@tanstack/react-table"
import { Button } from "@/components/shadcn/button";
import { useState } from "react";
import { cn } from "@/lib/utils"
import { LucideChevronsDown, LucideChevronsUp, LucideChevronsUpDown } from "lucide-react";

export interface DataTableColumnHeaderProps<TData, TValue>
    extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<TData, TValue>
    title: string
}

export function DataTableColumnHeader<TData, TValue>({
    column,
    title,
    className,
}: DataTableColumnHeaderProps<TData, TValue>) {

    const [sortingState, setSortingState] = useState<boolean>(true);

    if (!column.getCanSort()) {
        return <div className={cn(className)}>{title}</div>
    }

    const handleToggle = () => {
        column.toggleSorting(sortingState);
        setSortingState((state: boolean) => !state);
    }

    return (
        <div className={cn("flex items-center", className)}>
            <Button
                variant="ghost"
                className="px-2 h-8 data-[state=open]:bg-accent"
                onClick={handleToggle}
            >
                <span className="font-normal text-muted">{title}</span>
                {column.getIsSorted() === "desc" ? (
                    <LucideChevronsDown width={14} />
                ) : column.getIsSorted() === "asc" ? (
                    <LucideChevronsUp width={14} />
                ) : (
                    <></>
                )}
            </Button>
        </div>
    )
}
