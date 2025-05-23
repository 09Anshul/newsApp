import express from 'express';
import { getAllData,getDataByCategory } from '../controller/newsController.js';

const router = express.Router();

router.get('/category/:category', getDataByCategory);

export default router;