import html2canvas from 'html2canvas';

export const exportCards = async (selector: string, folderName: string = 'exported-cards') => {
    console.log('Starting export...');
    const cards = document.querySelectorAll(selector);
    console.log(`Found ${cards.length} cards`);
    
    cards.forEach(async (card, index) => {
        console.log(`Processing card ${index + 1}`);
        try {
            const canvas = await html2canvas(card as HTMLElement, {
                backgroundColor: '#000000',
                scale: 2,
                logging: true,
                useCORS: true,
                allowTaint: true,
            });
            
            console.log(`Card ${index + 1} rendered to canvas`);

            canvas.toBlob((blob) => {
                if (!blob) {
                    console.error(`No blob created for card ${index + 1}`);
                    return;
                }

                console.log(`Created blob for card ${index + 1}`);
                const link = document.createElement('a');
                link.download = `swarm-card-${index + 1}.png`;
                link.href = URL.createObjectURL(blob);
                link.click();
                URL.revokeObjectURL(link.href);
                console.log(`Downloaded card ${index + 1}`);
            }, 'image/png');
        } catch (error) {
            console.error(`Error exporting card ${index + 1}:`, error);
        }
    });
};
