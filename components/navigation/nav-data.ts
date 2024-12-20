export interface Link {
    label: string;
    url: string;
    disabled?: boolean;
    target?: string;
}

export const Links: Link[] = [
    {
        label: 'invest',
        url: '/invest',
    },
    {
        label: 'stake',
        url: 'https://stake.smithii.io/ubc'
    },
    {
        label: 'swap',
        url: '/swap',
        disabled: true,
    },
]