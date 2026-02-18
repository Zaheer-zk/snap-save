import { Request, Response } from 'express';
import { z } from 'zod';
import { instagramService } from '../services/instagram.service';

const extractSchema = z.object({
  url: z.string().url(),
});

class ExtractController {
  public handleExtract = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = extractSchema.safeParse(req.body);

      if (!result.success) {
        res.status(400).json({ error: "Invalid URL provided" });
        return;
      }

      const { url } = result.data;
      
      // Fix for possible double URL issue
      let cleanUrl = url;
      const secondHttpIndex = url.indexOf('https://', 8);
      if (secondHttpIndex !== -1) {
          cleanUrl = url.substring(0, secondHttpIndex);
      }
      
      console.log(`Processing extraction for URL: ${cleanUrl}`);

      const metadata = await instagramService.fetchMetadata(cleanUrl);

      // Map to frontend expected format
      const responseData = {
        thumbnail: metadata.thumbnail,
        title: metadata.title || 'Instagram Video',
        duration: metadata.duration || '0:00',
        qualities: metadata.downloads.map(d => d.quality),
        downloadUrl: metadata.downloads[0]?.url || ''
      };

      res.status(200).json({ success: true, data: responseData });
    } catch (error: any) {
      console.error('Controller Error:', error.message);
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Failed to process video.' 
      });
    }
  };
}

export const extractController = new ExtractController();
