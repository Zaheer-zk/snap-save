import { Request, Response } from 'express';
import axios from 'axios';
import { z } from 'zod';

const downloadSchema = z.object({
  url: z.string().url(),
  filename: z.string().optional()
});

class DownloadController {
  public handleDownload = async (req: Request, res: Response): Promise<void> => {
    try {
      const { url, filename } = req.query;

      if (!url || typeof url !== 'string') {
        res.status(400).json({ error: 'Missing or invalid "url" query parameter.' });
        return;
      }

      // Validate URL
       const parsedView = downloadSchema.safeParse({ url: url, filename: filename });
       if (!parsedView.success) {
           res.status(400).json({ error: 'Invalid URL provided.' });
           return;
       }


      console.log(`Proxying download for: ${url}`);

      const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'stream',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      // Forward headers
      const contentType = response.headers['content-type'] || 'video/mp4';
      const contentLength = response.headers['content-length'];

      res.setHeader('Content-Type', contentType);
      if (contentLength) {
        res.setHeader('Content-Length', contentLength);
      }

      const safeFilename = (typeof filename === 'string' ? filename : 'video') + '.mp4';
      res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);

      // Pipe the stream
      response.data.pipe(res);

      response.data.on('error', (err: any) => {
          console.error('Stream Error:', err);
          if (!res.headersSent) {
             res.status(500).json({ error: 'Failed to stream video' });
          } else {
             res.end();
          }
      });

    } catch (error: any) {
      console.error('Download Proxy Error:', error.message);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to download video.' });
      }
    }
  };
}

export const downloadController = new DownloadController();
