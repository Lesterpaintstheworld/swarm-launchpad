import { cn } from "@/lib/utils";

interface StatusProps {
    status: boolean;
    labels?: {
        positive?: string;
        negative?: string;
    }
}

const Status = ({ status, labels }: StatusProps) => {

    if (status) {
        return (
            <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                <span className="w-2 h-2 me-2 bg-green-500 rounded-full"></span>
                {labels?.positive || "Available"}
            </span>
        )
    };

    return (
        <span
            className={cn(
                "inline-flex items-center bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-red-900/50 dark:text-red-300"
            )}
        >
            <span className="w-2 h-2 me-2 bg-red-500 rounded-full"></span>
            {labels?.negative || "Unavailable"}
        </span>
    );

};

export { Status };
export type { StatusProps };