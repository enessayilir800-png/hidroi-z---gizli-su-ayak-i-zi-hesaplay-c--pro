/**
 * Efficient client-side image compression and resizing for high-res mobile and web photos.
 * Downscales 12-48MP smartphone/webcam photos to max 1024x1024 JPEG (~120KB),
 * preventing network timeouts and payload limits while preserving vision clarity.
 */
export async function processImageForAi(
  file: File,
  maxDimension = 1024,
  quality = 0.85
): Promise<{ dataUrl: string; base64Data: string; mimeType: string; name: string }> {
  return new Promise((resolve, reject) => {
    // If not a recognized image or svg, reject gracefully
    if (!file.type.startsWith('image/')) {
      reject(new Error('Lütfen geçerli bir görsel formatı (JPG, PNG, WEBP) seçin.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Görsel dosyası okunamadı.'));

    reader.onload = (event) => {
      const srcUrl = event.target?.result as string;
      const img = new Image();

      img.onerror = () => reject(new Error('Görsel işlenemedi.'));

      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        // Calculate proportional scale
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(width, 32);
        canvas.height = Math.max(height, 32);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback to raw base64 if canvas is unavailable
          const base64Data = srcUrl.split(',')[1] || '';
          resolve({
            dataUrl: srcUrl,
            base64Data,
            mimeType: file.type || 'image/jpeg',
            name: file.name
          });
          return;
        }

        // Draw image smoothly
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Convert to high-quality compressed JPEG
        const outputMime = 'image/jpeg';
        const dataUrl = canvas.toDataURL(outputMime, quality);
        const base64Data = dataUrl.split(',')[1] || '';

        resolve({
          dataUrl,
          base64Data,
          mimeType: outputMime,
          name: file.name
        });
      };

      img.src = srcUrl;
    };

    reader.readAsDataURL(file);
  });
}
