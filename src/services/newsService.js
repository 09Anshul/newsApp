import prisma from "../config/prismaClient.js";
import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function fetchWithRetry(url, params, retries = 3, delay = 1000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await axios.get(url, { 
        params,
        headers: {
          'User-Agent': 'NewsApp/1.0',
        },
      });
      return res.data;
    } catch (error) {
      if (error.response && error.response.status === 429) {
        console.warn(`Rate limit hit. Retry attempt ${attempt} after ${delay}ms.`);
        await sleep(delay);
        delay *= 2; // exponential backoff
      } else if (error.response && error.response.status === 403) {
        console.error('403 Forbidden: Check your API key and permissions.');
        throw error;
      } else {
        throw error; // other errors, no retry
      }
    }
  }
  throw new Error('Max retries reached for ' + url);
}

export const fetchAndSaveAll = async (category) => {

  const languages = ['en', 'hi'];
  let combinedArticles = [];

  for (const lang of languages) {
    const newsData = await fetchWithRetry(
      'https://gnews.io/api/v4/top-headlines',
      {
        q: category,
        token: process.env.GNEWS_API_KEY,
        lang,
        max: 50
      }
    );

    combinedArticles = combinedArticles.concat(newsData.articles);
  }

  // De-duplicate by URL or Title
  const uniqueArticles = [];
  const seen = new Set();

  for (const article of combinedArticles) {
    const identifier = article.url || article.title;
    if (!seen.has(identifier)) {
      seen.add(identifier);
      uniqueArticles.push(article);
    }
  }

  await prisma.news.createMany({
    data: uniqueArticles.map(item => ({
      title: item.title,
      description: item.description,
      url: item.url,
      imageUrl: item.image,
      source: item.source.name,
      publishedAt: new Date(item.publishedAt),
      category,
      type: 'news',
    })),
    skipDuplicates: true,
  });

  console.log(`✅ Saved ${uniqueArticles.length} unique articles for category ${category}`);
  return { articlesSaved: uniqueArticles.length };
};