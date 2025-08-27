import puppeteer from 'puppeteer';

export interface TrendItem {
  imageUrl: string;
  title: string;
  source: 'pinterest';
}

export async function scrapeTrends(brand: string, model: string): Promise<TrendItem[]> {
  let browser;
  
  try {
    browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
    
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
