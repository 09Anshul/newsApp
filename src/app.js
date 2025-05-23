import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import newsRoutes from './routes/newsRoutes.js';
import { PrismaClient } from '@prisma/client';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

export const prisma = new PrismaClient();

app.use('/api/news', newsRoutes);

export default app;