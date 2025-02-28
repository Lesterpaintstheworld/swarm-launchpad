declare module '@radix-ui/react-label';
declare module '@radix-ui/react-separator';
declare module '@radix-ui/react-dialog';
declare module '@radix-ui/react-popover';
declare module '@radix-ui/react-switch';
declare module '@radix-ui/react-slider';
declare module '@radix-ui/react-slot';
declare module '@radix-ui/react-tooltip';
declare module '@radix-ui/react-dropdown-menu';
declare module '@radix-ui/react-navigation-menu';
declare module '@radix-ui/react-scroll-area';
declare module '@radix-ui/react-select';
declare module '@radix-ui/react-accordion';
declare module '@radix-ui/react-avatar';
declare module '@radix-ui/react-toggle';

// Global window property for pool-to-swarm cache
interface Window {
  __poolToSwarmCache?: Record<string, string>;
}

// Add type for cmdk
declare module 'cmdk';
