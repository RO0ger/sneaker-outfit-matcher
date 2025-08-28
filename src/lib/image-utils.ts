export async function compressImage(file: File, maxWidth = 1024, quality = 0.8): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        return reject(new Error('Failed to get canvas context'));
      }

      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            return reject(new Error('Canvas to Blob conversion failed'));
          }
          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          URL.revokeObjectURL(img.src); // Clean up object URL
          resolve(compressedFile);
        },
        'image/jpeg',
        quality
      );
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(img.src); // Clean up object URL
      reject(err);
    };
  });
}
