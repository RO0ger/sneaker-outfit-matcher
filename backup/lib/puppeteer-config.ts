// lib/puppeteer-config.ts - Production Puppeteer
import puppeteer from 'puppeteer';

export async function createBrowser() {
  if (process.env.NODE_ENV === 'production') {
    // Vercel/production config
    return puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
        '--single-process'
      ],
      headless: true
    });
  } else {
    // Local development
    return puppeteer.launch({
      headless: true,
      args: ['--no-sandbox']
    });
  }
}
