import { BrowserAutomation } from "../core/BrowserAutomation.js";
import fs from "fs";
import path from "path";
import { clickXPath } from "../../shared/xpath.js";
export class QuoraPlatform extends BrowserAutomation {
  async handleLoginAndPost() {
    try {
      await this.page.goto("https://www.quora.com/", { waitUntil: "domcontentloaded" });

      // Nhấn nút login nếu cần
      const loginButton = await this.page.$('a[href*="/login"]');
      if (loginButton) await loginButton.click();

      // Điền tài khoản
      await this.page.waitForSelector('input[name="email"]', { timeout: 10000 });
      await this.page.type('input[name="email"]', this.credentials.username, { delay: 50 });
      await this.page.type('input[name="password"]', this.credentials.password, { delay: 50 });

      // Đợi và nhấn nút Login
      await this.page.waitForFunction(() => {
        const btn = document.querySelector('button[type="button"]');
        return btn && !btn.disabled && btn.innerText.includes("Login");
      });
      await Promise.all([
        this.page.click('button[type="button"]'),
        this.page.waitForNavigation({ waitUntil: "networkidle2" }),
      ]);

      // Mở khung đăng bài
     await clickXPath(this.page, '//*[@id="mainContent"]/div/div/div[1]/div/div/div[2]/div[3]/button');
      await this.delay(2000);

      // Nhập nội dung
      const { title, content, img_path } = this.credentials;
      await this.page.keyboard.type(`${title} \n${content}`);

      // Tải ảnh
      const inputFile = await this.page.$('input[type="file"]');
      if (!inputFile) throw new Error("❌ Không tìm thấy input[type='file']");
      await inputFile.uploadFile(img_path);
      await this.delay(2000);

      // Đăng bài
      await clickXPath(this.page, '//*[@id="mainContent"]/div/div/div[1]/div/div/div[2]/div[3]/button');
      await this.delay(3000);
    } catch (err) {
      console.error("❌ Lỗi khi login/đăng bài:", err.message);
    }
  }


  
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
