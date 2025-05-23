import cron from 'node-cron';
import { fetchAndSaveAll } from './services/newsService.js';
import prisma from './config/prismaClient.js';

News Fetch Cron - हर 5 घंटे
cron.schedule('0 */5 * * *', async () => {
  console.log('⏰ Cron job started: Fetching news...');

  const categories = ['sports', 'business', 'politics', 'technology', 'entertainment'];

  for (const category of categories) {
    await fetchAndSaveAll(category);
  }

  console.log('✅ All categories updated.');
});

cron.schedule('0 0 * * *', async () => {
  console.log('🗑️ Purging old news...');

  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  await prisma.news.deleteMany({
    where: {
      publishedAt: {
        lt: twoDaysAgo
      }
    }
  });

  console.log('✅ Old news purged successfully.');
});
