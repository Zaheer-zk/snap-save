import { Request, Response } from 'express';
import { z } from 'zod';
import { instagramService, InstagramExtractionError } from '../services/instagram.service';

const extractSchema = z.object({
  url: z.string().url().refine(
    (url) => url.includes('instagram.com'),
    { message: 'URL must be from instagram.com' }
  ),
});

class ExtractController {
  public handleExtract = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = extractSchema.safeParse(req.body);

      if (!result.success) {
        res.status(400).json({ 
          success: false,
          error: 'Invalid URL provided. Please provide a valid Instagram link.',
          details: result.error.flatten().fieldErrors,
        });
        return;
      }

      const { url } = result.data;
      
      // Fix for possible double URL issue
      let cleanUrl = url;
      const secondHttpIndex = url.indexOf('https://', 8);
      if (secondHttpIndex !== -1) {
          cleanUrl = url.substring(0, secondHttpIndex);
      }
      
      console.log(`[Extract] Processing URL: ${cleanUrl}`);

      const metadata = await instagramService.fetchMetadata(cleanUrl);

      // Map to frontend expected format
      const responseData = {
        thumbnail: metadata.thumbnail,
        title: metadata.title || 'Instagram Video',
        duration: metadata.duration || '0:00',
        author: metadata.author || undefined,
        qualities: metadata.downloads.map(d => d.quality),
        downloadUrl: metadata.downloads[0]?.url || ''
      };

      res.status(200).json({ success: true, data: responseData });
    } catch (error: any) {
      console.error('[Extract] Error:', error.message);

      // Return appropriate HTTP status based on error type
      if (error instanceof InstagramExtractionError) {
        const statusMap: Record<string, number> = {
          'INVALID_URL': 400,
          'NOT_FOUND': 404,
          'RATE_LIMITED': 429,
          'EXTRACTION_FAILED': 502,
        };
        const statusCode = statusMap[error.code] || 500;

        res.status(statusCode).json({ 
          success: false, 
          error: error.message,
          code: error.code,
        });
        return;
      }

      res.status(500).json({ 
        success: false, 
        error: 'An unexpected error occurred. Please try again later.',
      });
    }
  };
}

export const extractController = new ExtractController();
