interface LinkType {
    label: string;
    url: string;
    disabled?: boolean;
    target?: string;
    hasDropdown?: boolean;
    highlight?: boolean;
}

interface MenuItem {
    label: string;
    url: string;
    target?: string;
}

export type { LinkType, MenuItem }
