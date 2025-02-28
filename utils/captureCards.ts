import html2canvas from 'html2canvas';
import { createRoot } from 'react-dom/client';
import React from 'react';
import { CaptureCard } from '@/components/swarms/gainCard/captureCard';

export const captureCards = async (selector: string): Promise<string[]> => {
    console.log('Starting capture...');
    
    try {
        // Get all cards
        const cards = document.querySelectorAll(selector);
        console.log(`Found ${cards.length} cards`);

        const captures: string[] = [];

        // Create a temporary container
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.left = '-9999px';
        container.style.top = '0';
        document.body.appendChild(container);

        // Create React root
        const root = createRoot(container);

        // Process each card
        for (let i = 0; i < cards.length; i++) {
            const card = cards[i] as HTMLElement;
            const name = card.querySelector('.text-yellow-400')?.textContent || '';
            const multiple = parseInt(card.querySelector('.text-7xl')?.textContent || '1');
            const image = card.querySelector('img')?.src || '';
            const isLaunchMode = !card.querySelector('.text-7xl');

            // Render optimized version
            await new Promise<void>(resolve => {
                root.render(
                    React.createElement(CaptureCard, {
                        name,
                        multiple,
                        image,
                        launchMode: isLaunchMode
                    })
                );
                setTimeout(resolve, 100); // Wait for render
            });

            // Capture
            const canvas = await html2canvas(container.firstChild as HTMLElement, {
                backgroundColor: null,
                scale: 2,
                logging: false,
                useCORS: true,
                allowTaint: true,
                width: 500,
                height: 500,
            });

            const dataUrl = canvas.toDataURL('image/png', 1.0);
            captures.push(dataUrl);
            console.log(`Captured card ${i + 1}`);
        }

        // Cleanup
        root.unmount();
        document.body.removeChild(container);

        console.log('Capture completed successfully');
        return captures;

    } catch (error) {
        console.error('Capture failed:', error);
        return [];
    }
};
