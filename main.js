import fs from 'fs';
import path from 'path';
import { launchBrowser } from './utils/puppeteerSetup.js';
import { XPlatform } from './automation/platforms/x-platform.js';

const platforms = {
  x: XPlatform
};

const run = async (entityPath, contentPath) => {
  const browser = await launchBrowser();
  const content = JSON.parse(fs.readFileSync(contentPath));
  const entity = JSON.parse(fs.readFileSync(entityPath));

  for (const account of entity.accounts) {
    const page = await browser.newPage();
    const PlatformClass = platforms[account.platform];
    if (!PlatformClass) continue;

    const handler = new PlatformClass(page, account);
    try {
      await handler.login();
      await handler.postContent(content);
    } catch (err) {
      console.error(`❌ ${account.platform} | ${account.username}:`, err.message);
    } finally {
      await page.close();
    }
  }
  await browser.close();
};

run('./config/entities/entityTest.json', './config/content/contentTest.json');