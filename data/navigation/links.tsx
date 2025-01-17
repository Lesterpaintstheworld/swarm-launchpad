import { LinkType } from "@/components/navigation/navigation.types";

export const Links: LinkType[] = [
    {
        label: 'invest',
        url: '/invest',
    },
    {
        label: 'stake',
        url: '#',
        hasDropdown: true
    },
    {
        label: 'swap',
        url: '/swap',
        disabled: true,
    },
    {
        label: 'how it works',
        url: '/how-it-works',
        highlight: true
    },
]
