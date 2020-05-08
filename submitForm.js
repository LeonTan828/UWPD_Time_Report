const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(
    'https://app.smartsheet.com/b/form/5784f92c46a14794abc5eb68c420ba7e'
  );
  // actions
  console.log('start');

  await page.click('div[id=yD9p2E1]');
  await page.click('div[id=react-select-2-option-10]');

  await page.click('div[id=E5EX6Xe]');
  await page.click('div[id=react-select-3-option-2]');

  await page.click('input[name=EMAIL_RECEIPT_CHECKBOX]');
  await page.$eval(
    'input[name=EMAIL_RECEIPT]',
    (el) => (el.value = 'test@email.com')
  );

  await page.$eval('input[name=Kka8Wbd]', (el) => (el.value = 'Alpha Test'));

  console.log('got here');
  await browser.waitForTarget(() => false);
  await browser.close();
})();
