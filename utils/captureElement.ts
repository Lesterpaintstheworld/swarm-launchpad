import html2canvas from 'html2canvas';

export const captureElement = async (element: HTMLElement): Promise<string> => {
    console.log('Starting element capture...');
    
    try {
        // Pre-load images before capture
        const images = element.getElementsByTagName('img');
        await Promise.all(Array.from(images).map(img => {
            return new Promise((resolve, reject) => {
                const newImg = new Image();
                newImg.crossOrigin = 'anonymous';
                newImg.onload = () => resolve(newImg);
                newImg.onerror = reject;
                // Convert Next.js image URL to direct public path
                const src = img.src.includes('/_next/image') 
                    ? img.src.split('url=')[1]?.split('&')[0] 
                    : img.src;
                newImg.src = decodeURIComponent(src || '');
            });
        }));

        const canvas = await html2canvas(element, {
            backgroundColor: '#1a1500',
            scale: 2,
            logging: false,
            useCORS: true,
            allowTaint: true,
            width: 500,
            height: 500,
            onclone: (doc, ele) => {
                // Fix image sources in the clone
                const clonedImages = ele.getElementsByTagName('img');
                Array.from(clonedImages).forEach(img => {
                    const src = img.src.includes('/_next/image') 
                        ? img.src.split('url=')[1]?.split('&')[0] 
                        : img.src;
                    img.src = decodeURIComponent(src || '');
                });
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
