import { Router } from 'express';
import { downloadController } from '../controllers/download.controller';

const router = Router();

router.get('/download', (req: any, res: any) => downloadController.handleDownload(req, res)); // Using arrow function to capture 'this' or just binding if needed, but wrapper is safer.

export { router as downloadRouter };
