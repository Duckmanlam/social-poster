// scripts/runner.js
import fs from 'fs';
import { launchBrowser } from '../utils/puppeteerSetup.js';
import { QuoraPlatform } from '../automation/platforms/quora-platform.js';

const platforms = {
  quora: QuoraPlatform,
};

export const quora = async (entityPath, contentPath) => {
  const browser = await launchBrowser();
  const content = JSON.parse(fs.readFileSync(contentPath));
  const entity = JSON.parse(fs.readFileSync(entityPath));

  for (const quora of entity.quora) {
    const page = await browser.newPage();
    const PlatformClass = platforms[quora.platform];
    if (!PlatformClass) continue;

    const handler = new PlatformClass(page, quora);
    try {
      await handler.handleLoginAndPost();
      await handler.postContent(content);
    } catch (err) {
      console.error(`❌ ${quora.platform} | ${quora.username}:`, err.message);
    } finally {
      await page.close();
    }
  }
  await browser.close();
};
