import { Router, Request, Response } from 'express';
import { extractController } from '../controllers/extract.controller';

const router = Router();

router.post('/extract', extractController.handleExtract);

export { router as extractRouter };
