const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('response', response => {
    if (response.status() === 404) {
      console.log('404:', response.url());
    }
  });
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 500));
  
  // click "新しい試合を記録"
  await page.evaluate(() => {
    const btns = document.querySelectorAll('button');
    for (let btn of btns) {
      if (btn.innerText.includes('新しい試合を記録')) btn.click();
    }
  });
  await new Promise(r => setTimeout(r, 500));
  
  // click "このまま記録を始める"
  await page.evaluate(() => {
    const btns = document.querySelectorAll('button');
    for (let btn of btns) {
      if (btn.innerText.includes('このまま記録を始める')) btn.click();
    }
  });
  await new Promise(r => setTimeout(r, 500));
  
  const textFinal = await page.evaluate(() => document.body.innerText);
  console.log('FINAL PAGE:', textFinal.substring(0, 200));

  await browser.close();
})();
