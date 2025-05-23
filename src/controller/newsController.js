import prisma from '../config/prismaClient.js';
import { fetchAndSaveAll } from '../services/newsService.js';

export const getAllData = async (req, res) => {
  const { category = 'general', lang = 'en', country = 'us' } = req.query;
  const data = await fetchAndSaveAll(category, lang, country);
  res.json(data);
};

export const getDataByCategory = async (req, res) => {
  const { category } = req.params;
  const limit = parseInt(req.query.limit) || 50;

  const data = await prisma.news_9kwf.findMany({
    where: { category },
    orderBy: { publishedAt: 'desc' },
    take: limit,
  });

  res.json(data);
};
