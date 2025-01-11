import { LinkType } from "@/components/navigation/navigation.types";

export const Links: LinkType[] = [
    {
        label: 'invest',
        url: '/invest',
    },
    {
        label: 'stake',
        url: 'https://stake.smithii.io/ubc',
        target: '_blank'
    },
    {
        label: 'swap',
        url: '/swap',
        disabled: true,
    },
]