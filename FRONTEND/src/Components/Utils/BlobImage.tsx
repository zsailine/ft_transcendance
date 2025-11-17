import React, { useState, useEffect } from 'react';

interface BufferData {
  type: string;
  data: number[];
}

interface BlobImageProps {
  blobData: BufferData | null;
  contentType?: string;
  alt?: string;
  className?: string;
}

const BlobImage: React.FC<BlobImageProps> = ({ 
  blobData, 
  contentType = 'image/png', 
  alt = "Image", 
  className = "" 
}) => {
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    if (!blobData || !blobData.data || !Array.isArray(blobData.data)) {
      setImageUrl('');
      return;
    }

    try {
      const uint8Array = new Uint8Array(blobData.data);
      const blob = new Blob([uint8Array], { type: contentType });
      const url = URL.createObjectURL(blob);
      setImageUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    } catch (error) {
      console.error('Error creating image URL:', error);
      setImageUrl('');
    }
  }, [blobData, contentType]);

  if (!imageUrl) {
    return (
      <div className={className} style={{ background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Image non disponible
      </div>
    );
  }

  return (
    <img 
      src={imageUrl} 
      alt={alt} 
      className={className}
      onError={() => setImageUrl('')}
    />
  );
};

export default BlobImage;