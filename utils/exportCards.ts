import html2canvas from 'html2canvas';

export const exportCards = async (selector: string, folderName: string = 'exported-cards') => {
    const cards = document.querySelectorAll(selector);
    
    cards.forEach(async (card, index) => {
        try {
            const canvas = await html2canvas(card as HTMLElement, {
                backgroundColor: '#000000',
                scale: 2, // Higher quality
                logging: false,
                useCORS: true, // For images from different domains
                allowTaint: true,
            });

            // Convert to blob
            canvas.toBlob((blob) => {
                if (!blob) return;

                // Create download link
                const link = document.createElement('a');
                link.download = `swarm-card-${index + 1}.png`;
                link.href = URL.createObjectURL(blob);
                link.click();
                URL.revokeObjectURL(link.href);
            }, 'image/png');
        } catch (error) {
            console.error(`Error exporting card ${index + 1}:`, error);
        }
    });
};
