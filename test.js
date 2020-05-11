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

const firstFunc = () => {
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

const loginFunc = (newdate) => {
  return new Promise((resolve) => {
    (async () => {
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      await page.goto('https://app.smartsheet.com/b/home');
      // Login
      console.log('Logging in');
      await page.$eval(
        'input[name=loginEmail]',
        (el) => (el.value = 'tan49@wisc.edu')
      );
      await page.click('input[id=formControl]');
      await page.waitForNavigation();
      await page.$eval(
        'input[id=loginPassword]',
        (el) => (el.value = 'JustWannaUse')
      );
      await page.click('input[name=formControl]');
      console.log('Logged in');

      await page.waitForNavigation();
      await page.goto(
        'https://app.smartsheet.com/b/form/f5ebf838fa4d468b9cdffa146188f041'
      );

      await page.focus('[name="kpkqbgD"]');
      await page.keyboard.type(name);

      await page.focus('[name="Date"]');
      await page.keyboard.type(newdate);

      await page.click('[data-client-id="container_selection"]');
      await page.click('[id="react-select-2-option-3"]');

      await page.click('[data-client-id="container_selection 2"]');
      await page.click('[id="react-select-3-option-1"]');

      await page.focus('[name="zLlX5MD"]');
      await page.keyboard.type(title);

      await page.click('[name="EMAIL_RECEIPT_CHECKBOX"]');
      await page.focus('[name="EMAIL_RECEIPT"]');
      await page.keyboard.type(email);

      await page.click('[data-client-id="form_submit_btn"]');

      try {
        await page.waitFor('[data-client-id="confirmation_msg"]', {
          timeout: 30000
        });
        await page.goto('https://www.google.com/');
      } catch (err) {
        console.log('timed out');
      }

      // await browser.waitForTarget(() => false);
      resolve('done here');
      await browser.close();
    })();

    // setTimeout(() => console.log('do nothing'), 3000);
  });
};

const secondFunc = async () => {
  await firstFunc();

  console.log('for loop here');
  let length = date.length;
  console.log(length);
  console.log(date);
  for (let i = 0; i < length; i++) {
    await loginFunc(date[i]);
    console.log('end of loop here');
  }
};

secondFunc();
