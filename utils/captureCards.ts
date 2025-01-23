import html2canvas from 'html2canvas';

export const captureCards = async (selector: string): Promise<string[]> => {
    console.log('Starting capture...');
    
    try {
        // Get all cards
        const cards = document.querySelectorAll(selector);
        console.log(`Found ${cards.length} cards`);

        const captures: string[] = [];

        // Process each card
        for (let i = 0; i < cards.length; i++) {
            const card = cards[i] as HTMLElement;
            
            // Create canvas with better settings
            const canvas = await html2canvas(card, {
                backgroundColor: '#000000',
                scale: 2, // Higher resolution
                logging: false,
                useCORS: true,
                allowTaint: true,
                width: 500,
                height: 500,
            });

            // Convert canvas to data URL
            const dataUrl = canvas.toDataURL('image/png', 1.0);
            captures.push(dataUrl);
            console.log(`Captured card ${i + 1}`);
        }

        console.log('Capture completed successfully');
        return captures;

    } catch (error) {
        console.error('Capture failed:', error);
        return [];
    }
};
