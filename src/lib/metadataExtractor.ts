export interface FileMetadataResult {
  fileName: string;
  fileSize: number;
  fileType: string;
  lastModifiedDate: string;
  imageDimensions?: { width: number; height: number };
  detectedAttributes: Record<string, string | number | boolean>;
  summaryText?: string;
}

export async function extractFileMetadata(file: File): Promise<FileMetadataResult> {
  const result: FileMetadataResult = {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type || 'unknown/binary',
    lastModifiedDate: new Date(file.lastModified).toISOString(),
    detectedAttributes: {
      'File Extension': file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
      'MIME Type': file.type || 'Application/Octet-Stream',
      'Size (Bytes)': file.size,
      'Last Modified': new Date(file.lastModified).toLocaleString(),
    },
  };

  // If image, load dimensions
  if (file.type.startsWith('image/')) {
    try {
      const dimensions = await getImageDimensions(file);
      result.imageDimensions = dimensions;
      result.detectedAttributes['Image Width'] = `${dimensions.width} px`;
      result.detectedAttributes['Image Height'] = `${dimensions.height} px`;
      result.detectedAttributes['Aspect Ratio'] = (dimensions.width / dimensions.height).toFixed(2);
    } catch {
      // ignore
    }
  }

  // If text or json, read header
  if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.csv') || file.name.endsWith('.json')) {
    try {
      const textSnippet = await file.slice(0, 500).text();
      result.summaryText = textSnippet;
      result.detectedAttributes['Character Count (Snippet)'] = textSnippet.length;
      result.detectedAttributes['Line Count (Snippet)'] = textSnippet.split('\n').length;
    } catch {
      // ignore
    }
  }

  return result;
}

function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      reject(new Error('Failed to load image for dimension extraction'));
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}
