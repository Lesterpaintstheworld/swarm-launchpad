import html2canvas from 'html2canvas';

export const captureElement = async (element: HTMLElement): Promise<string> => {
    console.log('Starting element capture...');
    
    try {
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const canvas = await html2canvas(element, {
            backgroundColor: '#1a1500',
            scale: 2,
            logging: true,
            useCORS: true,
            allowTaint: true,
            width: 500,
            height: 500,
            onclone: (doc, ele) => {
                const elements = ele.getElementsByTagName('*');
                for (let el of elements) {
                    if (el instanceof HTMLElement) {
                        el.style.opacity = '1';
                        el.style.transform = 'none';
                    }
                }
            }
        });

        const dataUrl = canvas.toDataURL('image/png', 1.0);
        console.log('Element captured successfully');
        return dataUrl;

    } catch (error) {
        console.error('Capture failed:', error);
        return '';
    }
};
