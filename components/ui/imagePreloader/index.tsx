interface ImagePreloaderProps {
    imagePaths: string[];
}

export function ImagePreloader({ imagePaths }: ImagePreloaderProps) {
    return (
        <div style={{ display: 'none' }}>
            {imagePaths.map((path, index) => (
                <img 
                    key={index} 
                    src={path} 
                    alt="preload" 
                    onLoad={() => {
                        // Optional: Add loading tracking here if needed
                    }}
                />
            ))}
        </div>
    );
}
