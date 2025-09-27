import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('file://' + __dirname + '/dist/index.html');
  await page.pdf({ path: 'output.pdf', format: 'A4' });
  await browser.close();
})();
