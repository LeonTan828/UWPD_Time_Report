const puppeteer = require('puppeteer');
const csv = require('csv-parser');
const fs = require('fs');

const filename = process.argv[2];
const name = process.argv[3];
const title = process.argv[4];
let email;
if (process.argv.length < 6) {
  console.log('dun have email');
} else {
  email = process.argv[5];
  console.log(email);
}

let date = [];
let num = 0;

const readFile = () => {
  return new Promise((resolve) => {
    fs.createReadStream(filename)
      .pipe(csv())
      .on('data', async (row) => {
        if (row['Date Worked *']) {
          if (num == 0) {
            num++;
            return;
          }
          date.push(row['Date Worked *']);
        } else {
          return;
        }

        console.log('new line');
      })
      .on('finish', resolve);
  });
};

const entryFunc = (newdate) => {
  return new Promise((resolve) => {
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
      await page.keyboard.type(newdate);

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
      //     timeout: 60000
      //   });
      //   await page.goto('https://www.google.com/');
      // } catch (err) {
      //   console.log('timed out');
      // }

      console.log('got here');
      await browser.waitForTarget(() => false);
      resolve('done here');

      await browser.close();
    })();
  });
};

const mainFunc = async () => {
  await readFile();

  console.log('for loop here');
  let length = date.length;
  console.log(length);
  console.log(date);
  for (let i = 0; i < length; i++) {
    await entryFunc(date[i]);
    console.log('end of loop here');
  }
};

mainFunc();
