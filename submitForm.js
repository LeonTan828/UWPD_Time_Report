const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(
    'https://app.smartsheet.com/b/form/5784f92c46a14794abc5eb68c420ba7e'
  );
  // actions
  console.log('start');
  await page.$eval('input[name=Kka8Wbd]', (el) => (el.value = 'Alpha Test'));
  console.log('got here');
  await browser.waitForTarget(() => false);
  await browser.close();
})();
