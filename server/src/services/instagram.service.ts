const { instagramGetUrl } = require('instagram-url-direct');

export interface DownloadLink {
  quality: string;
  url: string;
}

export interface Metadata {
  id?: string;
  title?: string;
  thumbnail: string;
  duration?: string;
  author?: string;
  downloads: DownloadLink[];
}

export class InstagramService {
  async fetchMetadata(url: string): Promise<Metadata> {
    try {
      const response = await instagramGetUrl(url);

      if (!response.url_list || response.url_list.length === 0) {
        throw new Error('No video found in the response.');
      }

      // The library returns raw URLs. We try to map them.
      // Assuming the first one is the main one.
      const mainVideo = response.url_list[0];
      
      const downloads: DownloadLink[] = response.url_list.map((u: string, index: number) => ({
        quality: index === 0 ? 'Original' : `Quality ${index + 1}`,
        url: u
      }));

      // Metadata like title/author might be missing in this library response,
      // but it sometimes provides 'results_number' or similar. 
      // For now, we use a placeholder or extraction from URL if possible.
      
      // Attempt to get thumbnail from media_details if available
      let thumbnail = 'https://placehold.co/600x400?text=Instagram+Video';
      if (response.media_details && response.media_details.length > 0 && response.media_details[0].thumbnail) {
          thumbnail = response.media_details[0].thumbnail;
      }
      
      return {
        id: url.split('/').filter(Boolean).pop(),
        title: 'Instagram Video',
        thumbnail: thumbnail,
        downloads: downloads
      };
      
    } catch (error: any) {
      console.error('Extraction Error:', error.message);
      throw new Error(error.message || 'Failed to extract video metadata');
    }
  }
}

export const instagramService = new InstagramService();
