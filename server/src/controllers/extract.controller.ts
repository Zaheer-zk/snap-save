import { Request, Response } from 'express';
import { z } from 'zod';
import { InstagramService } from '../services/instagram.service';

const extractSchema = z.object({
  url: z.string().url(),
});

class ExtractController {
  public handleExtract = async (req: Request, res: Response): Promise<void> => {
    try {
      const parsedBody = extractSchema.safeParse(req.body);

      if (!parsedBody.success) {
        res.status(400).json({ error: parsedBody.error.errors[0].message });
        return;
      }

      const { url } = parsedBody.data;
      console.log(`Processing extraction for URL: ${url}`);

      const metadata = await new InstagramService().fetchMetadata(url);

      const responseData = {
        thumbnail: metadata.thumbnail,
        title: metadata.title || 'Instagram Video',
        duration: metadata.duration || '0:00', // Duration not available in OG tags usually
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
