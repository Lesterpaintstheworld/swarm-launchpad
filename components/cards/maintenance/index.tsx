import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils";

interface MaintenanceCardProps {
    title: string;
    message?: string;
    className?: string;
}

const MaintenanceCard = ({ title, message, className }: MaintenanceCardProps) => {
    return (
        <Card className={cn("w-full h-full flex flex-col justify-center items-center text-center p-4 bg-gray-100 dark:bg-gray-800 shadow-md", className)}>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{title}</h2>
            {message && <p className="mt-2 text-gray-600 dark:text-gray-400">{message}</p>}
        </Card>
    )

}

export { MaintenanceCard };
export type { MaintenanceCardProps };