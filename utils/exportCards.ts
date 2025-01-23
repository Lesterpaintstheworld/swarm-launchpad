import html2canvas from 'html2canvas';

export const exportCards = async (selector: string) => {
    console.log('Starting export...');
    
    try {
        // Get all cards
        const cards = document.querySelectorAll(selector);
        console.log(`Found ${cards.length} cards`);

        // Create a temporary container
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.top = '0';
        document.body.appendChild(container);

        // Process each card
        for (let i = 0; i < cards.length; i++) {
            const card = cards[i] as HTMLElement;
            
            // Clone the card
            const clone = card.cloneNode(true) as HTMLElement;
            
            // Force dimensions and visibility
            clone.style.width = '500px';
            clone.style.height = '500px';
            clone.style.position = 'relative';
            clone.style.opacity = '1';
            clone.style.transform = 'none';
            
            // Add to temporary container
            container.innerHTML = '';
            container.appendChild(clone);
            
            // Wait for images to load
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Create canvas with better settings
            const canvas = await html2canvas(clone, {
                backgroundColor: '#000000',
                scale: 2, // Higher resolution
                logging: false,
                useCORS: true,
                allowTaint: true,
                width: 500,
                height: 500,
                onclone: (_, element) => {
                    // Ensure all elements are visible
                    const elements = element.getElementsByTagName('*');
                    for (let el of elements) {
                        if (el instanceof HTMLElement) {
                            el.style.opacity = '1';
                            el.style.transform = 'none';
                        }
                    }
                }
            });

            // Convert to blob with better quality
            const blob = await new Promise<Blob | null>(resolve => {
                canvas.toBlob(resolve, 'image/png', 1.0);
            });

            if (blob) {
                // Download with proper name
                const link = document.createElement('a');
                link.download = `${card.querySelector('.text-yellow-400')?.textContent || `swarm-${i + 1}`}.png`;
                link.href = URL.createObjectURL(blob);
                link.click();
                URL.revokeObjectURL(link.href);
                console.log(`Exported card ${i + 1}`);
            }

            // Small delay between exports
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        // Cleanup
        document.body.removeChild(container);
        console.log('Export completed successfully');

    } catch (error) {
        console.error('Export failed:', error);
    }
};
import html2canvas from 'html2canvas';

export const exportCards = async (selector: string) => {
    console.log('Starting export...');
    
    try {
        // Get all cards
        const cards = document.querySelectorAll(selector);
        console.log(`Found ${cards.length} cards`);

        // Create a temporary container
        const container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.top = '0';
        document.body.appendChild(container);

        // Process each card
        for (let i = 0; i < cards.length; i++) {
            const card = cards[i] as HTMLElement;
            
            // Clone the card
            const clone = card.cloneNode(true) as HTMLElement;
            
            // Force dimensions and visibility
            clone.style.width = '500px';
            clone.style.height = '500px';
            clone.style.position = 'relative';
            clone.style.opacity = '1';
            clone.style.transform = 'none';
            
            // Add to temporary container
            container.innerHTML = '';
            container.appendChild(clone);
            
            // Wait for images to load
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Create canvas with better settings
            const canvas = await html2canvas(clone, {
                backgroundColor: '#000000',
                scale: 2, // Higher resolution
                logging: false,
                useCORS: true,
                allowTaint: true,
                width: 500,
                height: 500,
                onclone: (_, element) => {
                    // Ensure all elements are visible
                    const elements = element.getElementsByTagName('*');
                    for (let el of elements) {
                        if (el instanceof HTMLElement) {
                            el.style.opacity = '1';
                            el.style.transform = 'none';
                        }
                    }
                }
            });

            // Convert to blob with better quality
            const blob = await new Promise<Blob | null>(resolve => {
                canvas.toBlob(resolve, 'image/png', 1.0);
            });

            if (blob) {
                // Download with proper name
                const link = document.createElement('a');
                link.download = `${card.querySelector('.text-yellow-400')?.textContent || `swarm-${i + 1}`}.png`;
                link.href = URL.createObjectURL(blob);
                link.click();
                URL.revokeObjectURL(link.href);
                console.log(`Exported card ${i + 1}`);
            }

            // Small delay between exports
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        // Cleanup
        document.body.removeChild(container);
        console.log('Export completed successfully');

    } catch (error) {
        console.error('Export failed:', error);
    }
};
