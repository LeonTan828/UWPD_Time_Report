const puppeteer = require('puppeteer');

const name = 'Naomi Speiss';
const title = 'IAM Service Coordinator';
const email = 'asdf@mail';

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
  await page.click('div[id=react-select-3-option-1]');

  await page.click('input[name=EMAIL_RECEIPT_CHECKBOX]');
  await page.$eval(
    'input[name=EMAIL_RECEIPT]',
    (el, email) => (el.value = email),
    email
  );

  await page.$eval('[name="Kka8Wbd"]', (el, name) => (el.value = name), name);
  await page.$eval(
    '[name="8OXLYgM"]',
    (el, title) => (el.value = title),
    title
  );

  const date = '03/04/2020';
  await page.$eval(
    '[name="Date Worked"]',
    (el, date) => (el.value = date),
    date
  );

  console.log('got here');
  await browser.waitForTarget(() => false);
  await browser.close();
})();
