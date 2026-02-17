
export interface ExtractResult {
  thumbnail: string;
  title: string;
  duration: string;
  qualities: string[];
  downloadUrl: string;
}

export const extractVideo = async (url: string): Promise<ExtractResult> => {
  const response = await fetch('/api/v1/extract', {
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

export const downloadVideo = (url: string, filename?: string) => {
  // Use the download proxy endpoint
  const downloadUrl = `/api/v1/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename || 'video')}`;
  
  // Create a hidden anchor tag to trigger download
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.setAttribute('download', filename || 'video.mp4'); // Though the server sets Content-Disposition, this is a fallback hint
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
