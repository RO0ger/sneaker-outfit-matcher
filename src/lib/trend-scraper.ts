import { createBrowser } from './puppeteer-config';
import puppeteer from 'puppeteer';

export interface TrendItem {
  imageUrl: string;
  title: string;
  source: 'pinterest';
}

const trendCache = new Map<string, { data: TrendItem[], timestamp: number }>();

async function performScraping(brand: string, model: string): Promise<TrendItem[]> {
  let browser;
  
  try {
    browser = await createBrowser();
    
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    const searchQuery = `${brand} ${model} outfit style`;
    const url = `https://pinterest.com/search/pins/?q=${encodeURIComponent(searchQuery)}`;
    
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
    await page.waitForSelector('img[src*="pinimg"]', { timeout: 10000 });
    
    const trends = await page.evaluate(() => {
      const images = document.querySelectorAll('img[src*="pinimg"]');
      const results: TrendItem[] = [];
      
      images.forEach((img, index) => {
        if (index >= 8) return;
        const htmlImg = img as HTMLImageElement;
        if (htmlImg.src && htmlImg.src.includes('pinimg')) {
          results.push({
            imageUrl: htmlImg.src,
            title: htmlImg.alt || 'Sneaker outfit inspiration',
            source: 'pinterest' as const
          });
        }
      });
      
      return results;
    });
    
    return trends;
    
  } catch (error) {
    console.error('Trend scraping failed:', error);
    return [];
  } finally {
    if (browser) await browser.close();
  }
}

export async function scrapeTrends(brand: string, model: string): Promise<TrendItem[]> {
  const cacheKey = `${brand}-${model}`.toLowerCase();
  const cached = trendCache.get(cacheKey);

  // Return cached if less than 1 hour old
  if (cached && Date.now() - cached.timestamp < 3600000) {
    return cached.data;
  }

  const scrapingPromise = performScraping(brand, model);

  if (cached) {
    // Return stale cache, update in background
    scrapingPromise.then(fresh => {
      if (fresh.length > 0) { // Only update cache if new data was found
        trendCache.set(cacheKey, { data: fresh, timestamp: Date.now() });
      }
    });
    return cached.data;
  }

  // No cache, wait for fresh data
  const fresh = await scrapingPromise;
  if (fresh.length > 0) {
    trendCache.set(cacheKey, { data: fresh, timestamp: Date.now() });
  }
  return fresh;
}
