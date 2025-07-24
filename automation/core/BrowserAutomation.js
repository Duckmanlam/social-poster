export class BrowserAutomation {
  constructor(page, credentials) {
    this.page = page;
    this.credentials = credentials;
  }

  async login() {
    throw new Error('login() not implemented');
  }

  async postContent(content) {
    throw new Error('postContent() not implemented');
  }
}
