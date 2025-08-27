'use client';

import { useState } from 'react';

export function ImageUpload() {
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <div>
      <h2>Image Upload</h2>
      <input type="file" accept="image/*" />
      {preview && <img src={preview} alt="Image preview" width={200} />}
    </div>
  );
}
