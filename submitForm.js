const puppeteer = require('puppeteer');

const name = 'Naomi Speiss';
const title = 'IAM Service Coordinator';
const email = 'asdf@mail';
const date = '03/21/20';

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(
    'https://app.smartsheet.com/b/form/5784f92c46a14794abc5eb68c420ba7e'
  );
  // actions
  console.log('start');

  await page.focus('[name="Kka8Wbd"]');
  await page.keyboard.type(name);

  await page.focus('[name="8OXLYgM"]');
  await page.keyboard.type(title);

  await page.focus('[name="Date Worked"]');
  await page.keyboard.type(date);

  await page.click('div[id=yD9p2E1]');
  await page.click('div[id=react-select-2-option-10]');

  await page.click('div[id=E5EX6Xe]');
  await page.click('div[id=react-select-3-option-1]');

  await page.click('div[id=eG8ve3p]');
  await page.click('div[id=react-select-4-option-1]');

  await page.click('[name="EMAIL_RECEIPT_CHECKBOX"]');
  await page.focus('[name="EMAIL_RECEIPT"]');
  await page.keyboard.type(email);

  // NOTE
  // SUBMIT button

  // await page.click('[data-client-id="form_submit_btn"]');

  // try {
  //   await page.waitFor('[data-client-id="confirmation_msg"]', {
  //     timeout: 3000
  //   });
  //   await page.goto('https://www.google.com/');
  // } catch (err) {
  //   console.log('timed out');
  // }

  console.log('got here');
  await browser.waitForTarget(() => false);
  await browser.close();
})();
