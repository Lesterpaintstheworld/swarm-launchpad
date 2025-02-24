import { ReactNode } from "react";

interface NavigationMenuItemType {
    trigger: {
        isLink?: boolean;
        href?: string;
        label?: string | ReactNode;
        children: string | ReactNode;
    }
    grid?: {
        columns?: number;
        rows?: number;
    }
    content?: NavigationMenuContentItem[];
}

interface NavigationMenuContentItem {
    title: string;
    href?: string;
    icon?: ReactNode;
    subheading: string;
}

interface MenuItem {
    label: string;
    url: string;
    target?: string;
}

export type { NavigationMenuItemType, MenuItem, NavigationMenuContentItem }
