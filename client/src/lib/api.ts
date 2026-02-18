
export interface ExtractResult {
  thumbnail: string;
  title: string;
  duration: string;
  qualities: string[];
  downloadUrl: string;
}

const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

export const extractVideo = async (url: string): Promise<ExtractResult> => {
  const response = await fetch(`${API_BASE}/extract`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to extract video');
  }

  const { data } = await response.json();
  return data;
};

/**
 * Sanitizes a string for use as a filename.
 * Format: SnapSave_{FirstWord}_downloaded.mp4
 */
function sanitizeFilename(name: string): string {
  let cleaned = name
    // Remove common IG caption prefixes like "75K likes, 1,231 comments - username on Month Day, Year: "
    .replace(/^[\d,.]+[KkMm]?\s*likes?,?\s*[\d,.]+\s*comments?\s*-\s*/i, '')
    // Remove "username on Month Day, Year: " or similar date prefix
    .replace(/^[^\s]+\s+on\s+\w+\s+\d{1,2},?\s*\d{4}[_:\s]*/i, '')
    // Strip non-alphanumeric (keep spaces for word splitting)
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .trim();

  // Extract the first meaningful word
  const firstWord = cleaned.split(/\s+/).filter(w => w.length > 0)[0] || 'Video';

  return `SnapSave_${firstWord}_downloaded.mp4`;
}

export const downloadVideo = (url: string, filename?: string) => {
  const safeFilename = sanitizeFilename(filename || 'instagram_video');

  // Use the download proxy endpoint
  const downloadUrl = `${API_BASE}/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(safeFilename)}`;
  
  // Create a hidden anchor tag to trigger download
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.setAttribute('download', safeFilename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
