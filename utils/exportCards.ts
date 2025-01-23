import html2canvas from 'html2canvas';

export const exportCards = async (selector: string) => {
    console.log('Starting export...');
    
    // Wait for DOM to be fully loaded
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const cards = document.querySelectorAll(selector);
    console.log(`Found ${cards.length} cards`);
    
    // Convert NodeList to Array to use Promise.all
    const cardArray = Array.from(cards);
    
    try {
        // Process cards one by one with delay between each
        for (let i = 0; i < cardArray.length; i++) {
            const card = cardArray[i];
            console.log(`Processing card ${i + 1}`);
            
            // Ensure card is visible
            const originalDisplay = card.style.display;
            card.style.display = 'block';
            
            // Wait for images to load
            const images = card.getElementsByTagName('img');
            await Promise.all(Array.from(images).map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise(resolve => {
                    img.onload = resolve;
                    img.onerror = resolve;
                });
            }));

            const canvas = await html2canvas(card as HTMLElement, {
                backgroundColor: '#000000',
                scale: 2,
                logging: true,
                useCORS: true,
                allowTaint: true,
                onclone: (document, element) => {
                    // Copy computed styles
                    const computedStyle = window.getComputedStyle(card);
                    Object.keys(computedStyle).forEach(key => {
                        try {
                            element.style[key] = computedStyle[key];
                        } catch (e) {
                            // Ignore style errors
                        }
                    });
                }
            });

            // Restore original display
            card.style.display = originalDisplay;
            
            console.log(`Card ${i + 1} rendered to canvas`);

            // Create and download image
            canvas.toBlob((blob) => {
                if (!blob) {
                    console.error(`No blob created for card ${i + 1}`);
                    return;
                }

                const link = document.createElement('a');
                link.download = `swarm-card-${i + 1}.png`;
                link.href = URL.createObjectURL(blob);
                link.click();
                URL.revokeObjectURL(link.href);
                console.log(`Downloaded card ${i + 1}`);
            }, 'image/png', 1.0);

            // Wait between each card
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    } catch (error) {
        console.error('Error during export:', error);
    }
};
