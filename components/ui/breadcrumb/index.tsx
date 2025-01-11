import { BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator, Breadcrumb as BreadcrumbShadCN } from "@/components/shadcn/breadcrumb";
import { Fragment } from "react";

interface Crumb {
    label: string;
    href?: string;
    target?: string;
}

interface BreadcrumbProps {
    crumbs: Crumb[];
    className?: string;
}

const Breadcrumb = ({ crumbs, className }: BreadcrumbProps) => {
    return (
        <BreadcrumbShadCN className={className}>
            <BreadcrumbList>
                {crumbs.map(({ label, href, target }: Crumb, index: number) => {
                    return (
                        <Fragment key={index}>
                            {index !== 0 && <BreadcrumbSeparator className="text-muted" />}
                            <BreadcrumbItem>
                                <BreadcrumbLink
                                    href={href}
                                    target={target}
                                    className="text-muted captialise cursor-pointer text-base"
                                >
                                    {label}
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        </Fragment>
                    )
                })}
            </BreadcrumbList>
        </BreadcrumbShadCN>
    )
}

export { Breadcrumb }
export type { BreadcrumbProps, Crumb }