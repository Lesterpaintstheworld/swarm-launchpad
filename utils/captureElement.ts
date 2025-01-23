import html2canvas from 'html2canvas';

export const captureElement = async (element: HTMLElement): Promise<string> => {
    console.log('Starting element capture...');
    
    try {
        // Create canvas with better settings
        const canvas = await html2canvas(element, {
            backgroundColor: '#000000',
            scale: 2, // Higher resolution
            logging: false,
            useCORS: true,
            allowTaint: true,
            width: element.offsetWidth,
            height: element.offsetHeight,
        });

        // Convert to data URL
        const dataUrl = canvas.toDataURL('image/png', 1.0);
        console.log('Element captured successfully');
        return dataUrl;

    } catch (error) {
        console.error('Capture failed:', error);
        return '';
    }
};
