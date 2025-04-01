'use client'

import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/shadcn/switch";
import { cn } from "@/lib/utils";
import { useWallet } from "@solana/wallet-adapter-react";
import { LucideLoaderCircle, LucideSave, LucideUndo2 } from "lucide-react";
import { useState } from "react";

interface UpdatePoolProps {
    defaultValue: any;
    updateFn: (value: any) => Promise<any>;
    formatFn?: (value: any) => any;
    type?: 'input' | 'toggle';
    className?: string;
    disabled?: boolean;
    authority: string;
}

const UpdatePool = ({ defaultValue, type = 'input', updateFn, formatFn, authority, className, disabled }: UpdatePoolProps) => {

    const { publicKey } = useWallet();

    const [mode, setMode] = useState<'view' | 'edit'>('view');
    const [value, setValue] = useState<any>(defaultValue);
    const [loading, setLoading] = useState<boolean>(false);

    const handleUpdate = async () => {
        setLoading(true);
        try {
            await updateFn(value);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
        setMode('view');
    }

    const handleCancel = () => {
        setValue(defaultValue);
        setMode('view');
    }

    const enableEdit = () => {
        if (authority === publicKey?.toBase58()) {
            setMode('edit');
        }
    }

    const handleToggle = () => {
        setValue(!value);
        setLoading(true);
        try {
            handleUpdate();
        } catch (error) {
            console.error(error);
            setValue(defaultValue);
        }
        setLoading(false);
    }

    if (mode === 'edit' && type === 'input') {
        return (
            <div className={cn("flex flex-row items-center gap-2", className)}>
                <Input
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="py-1 px-2 border rounded-sm h-7"
                    disabled={loading || disabled}
                />
                <Button variant="success" className="w-7 h-7 aspect-square bg-green-500 border-none text-background hover:bg-green-500/80" onClick={handleUpdate} disabled={loading || disabled}>
                    {loading ?
                        <LucideLoaderCircle className="animate-spin" />
                        :
                        <LucideSave />
                    }
                </Button>
                <Button variant="destructive" className="w-7 h-7 border-none text-background" onClick={handleCancel} disabled={loading || disabled}>
                    <LucideUndo2 />
                </Button>
            </div>
        )
    }

    if (type === 'toggle') {
        return (
            <Switch
                checked={value}
                onCheckedChange={handleToggle}
                className={className}
                disabled={loading || disabled || authority !== publicKey?.toBase58()}
            />
        )
    }

    return (
        <p className="text-muted ml-auto" onClick={enableEdit}>{formatFn ? formatFn(defaultValue) : defaultValue}</p>
    );
};

export { UpdatePool };
export type { UpdatePoolProps };