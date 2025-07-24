import { BrowserAutomation } from '../core/BrowserAutomation.js';
import path from 'path';
import fs from 'fs';

export class XPlatform extends BrowserAutomation {
  async login() {
    console.log(`🔐 Mở trang đăng nhập X cho: ${this.credentials.username}`);
    await this.page.goto('https://x.com/i/flow/login', { waitUntil: 'domcontentloaded' });

    await this.page.waitForSelector('input[name="text"]', { timeout: 10000 });
    await this.page.type('input[name="text"]', this.credentials.username, { delay: 30 });
    await this.page.keyboard.press('Enter');

    await this.page.waitForTimeout(1500);
    await this.page.waitForSelector('input[name="password"]');
    await this.page.type('input[name="password"]', this.credentials.password, { delay: 30 });
    await this.page.keyboard.press('Enter');

    await this.page.waitForNavigation({ waitUntil: 'networkidle2' });
    console.log('✅ Đăng nhập thành công');
  }

  async postContent(content) {
    console.log(`📝 Đang đăng: ${content.body.slice(0, 40)}...`);
    await this.page.goto('https://x.com/compose/post', { waitUntil: 'networkidle2' });

    const tweetBoxSelector = 'div[aria-label="Tweet text"]';
    await this.page.waitForSelector(tweetBoxSelector);
    await this.page.type(tweetBoxSelector, content.body, { delay: 30 });

    if (content.image) {
      const imagePath = path.resolve('./config/content', content.image);
      if (fs.existsSync(imagePath)) {
        const input = await this.page.$('input[data-testid="fileInput"]');
        await input.uploadFile(imagePath);
        console.log('📷 Ảnh đã được tải lên');
        await this.page.waitForTimeout(3000);
      }
    }

    const tweetBtn = 'div[data-testid="tweetButtonInline"]';
    await this.page.click(tweetBtn);
    await this.page.waitForTimeout(3000);
    console.log('✅ Đã đăng bài');
  }
}