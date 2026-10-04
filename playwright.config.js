module.exports = {
  testDir: './tests',
  timeout: 30000,
  retries: 0,
  reporter: 'list',
  use: {
    headless: true,
    ignoreHTTPSErrors: true,
    baseURL: 'http://127.0.0.1:8080',
  },
  webServer: {
    command: 'npx http-server -p 8080',
    port: 8080,
    reuseExistingServer: true,
  }
};
