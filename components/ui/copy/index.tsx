'use client'

import { sleep } from "@/lib/utils";
import { LucideCheck, LucideCopy } from "lucide-react"
import { useEffect, useState } from "react"

interface CopyProps {
    label: string;
    value: string;
}

const Copy = ({ label, value }: CopyProps) => {

    const [copied, setCopied] = useState<boolean>(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
    }

    useEffect(() => {
        if (copied) {
            sleep(5000).then(() => setCopied(false));
        }
    }, [copied])

    return (
        <p
            className={`
                flex flex-row gap-2 text-foreground/40 duration-100 w-fit  items-center
                ${!copied && 'hover:text-foreground hover:cursor-pointer'}
                ${copied && 'hover:text-emerald-500 !text-emerald-500 hover:cursor-pointer'}
            `}
            onClick={handleCopy}
        >
            {copied ?
                <>
                    Copied to clipboard
                    <LucideCheck width={14} />
                </> :
                <>
                    {label}
                    <LucideCopy width={14} />
                </>
            }
        </p>
    )
}

export { Copy }