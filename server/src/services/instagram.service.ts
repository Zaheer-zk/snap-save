import axios from 'axios';
import * as cheerio from 'cheerio';
import { z } from 'zod';

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
  private userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

  async fetchMetadata(url: string): Promise<Metadata> {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          'Referer': 'https://www.google.com/'
        }
      });

      const $ = cheerio.load(response.data);

      // Extract OG tags
      const ogTitle = $('meta[property="og:title"]').attr('content') || '';
      const ogImage = $('meta[property="og:image"]').attr('content') || '';
      const ogVideo = $('meta[property="og:video"]').attr('content') || 
                      $('meta[property="og:video:secure_url"]').attr('content');
      
      const author = $('meta[property="og:description"]').attr('content')?.split('(@')[0]?.trim(); // basic parse

      if (!ogVideo) {
        throw new Error('Video not found or content is private/restricted.');
      }

      return {
        id: url.split('/').filter(Boolean).pop(), // simplified ID extraction
        title: ogTitle,
        thumbnail: ogImage,
        author: author,
        downloads: [
          {
            quality: 'Original', // Resolution not easily available in meta tags
            url: ogVideo
          }
        ]
      };
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
             throw new Error("Post not found");
          } else if (error.response?.status === 429) {
             throw new Error("Rate limit exceeded");
          }
      }
      console.error('Extraction Error:', error.message);
      throw new Error('Failed to extract video metadata: ' + error.message);
    }
  }
}

export const instagramService = new InstagramService();
