const puppeteer = require('puppeteer');
const csv = require('csv-parser');
const fs = require('fs');

// Variables from command line
const filename = process.argv[2];
const name = process.argv[3];
const title = process.argv[4];
let email;
if (process.argv.length < 6) {
  console.log('No email provided');
  email = '';
} else {
  email = process.argv[5];
}

// Variables
let date = [];
let locations = [];
let regHours = [];
let salariedOrHourly = [];
let otHours = [];
let rateofOT = [];
let notes = [];
let num = 0;
let completed = false;

// Read CSV file
const readFile = () => {
  return new Promise((resolve) => {
    fs.createReadStream(filename)
      .pipe(csv())
      .on('data', async (row) => {
        // Skip instruction row
        if (num == 0) {
          num++;
          return;
        }

        // Building input arrays

        if (row['Date Worked *']) {
          date.push(row['Date Worked *']);
        } else {
          date.push('');
        }

        if (row['Location of work *']) {
          locations.push(row['Location of work *']);
        } else {
          locations.push('');
        }

        if (row['Number of Regular Hours in Support of COVID-19']) {
          regHours.push(row['Number of Regular Hours in Support of COVID-19']);
        } else {
          regHours.push('');
        }

        if (row['Salaried or Hourly *']) {
          salariedOrHourly.push(row['Salaried or Hourly *']);
        } else {
          salariedOrHourly.push('');
        }

        if (row['Number of Overtime Hours in Support of COVID-19']) {
          otHours.push(row['Number of Overtime Hours in Support of COVID-19']);
        } else {
          otHours.push('');
        }

        if (row['Rate of Overtime']) {
          rateofOT.push(row['Rate of Overtime']);
        } else {
          rateofOT.push('');
        }

        if (row['Notes']) {
          notes.push(row['Notes']);
        } else {
          notes.push('');
        }
      })
      .on('finish', resolve);
  });
};

// Data Entry function
const entryFunc = (newdate, loc, reghr, soh, othr, rtot, note) => {
  return new Promise((resolve) => {
    (async () => {
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      await page.goto(
        'https://app.smartsheet.com/b/form/5784f92c46a14794abc5eb68c420ba7e'
      );

      // Name
      await page.focus('[name="Kka8Wbd"]');
      await page.keyboard.type(name);

      // Job Title
      await page.focus('[name="8OXLYgM"]');
      await page.keyboard.type(title);

      // Organization
      // ATTN: Set to DoIT
      await page.click('[data-client-id="container_Organization"]');
      await page.click('[id="react-select-2-option-10"]');

      // Date Worked
      await page.focus('[name="Date Worked"]');
      await page.keyboard.type(newdate);

      // Location of work
      await page.click('[data-client-id="container_Location of Work"]');
      if (loc == 'remote') {
        await page.click('[id="react-select-3-option-1"]');
      } else if (loc == 'on campus') {
        await page.click('[id="react-select-3-option-2"]');
      } else if (loc == 'state EOC on-site') {
        await page.click('[id="react-select-3-option-3"]');
      } else {
        // None of the input match
        console.error('Something went wrong');
        console.error(
          'Input for "location of work" is wrong: ' + loc + ' is not accepted'
        );

        // Skipping this entry
        await browser.close();
        resolve('not done');
        return;
      }

      // Number of regular hours
      await page.focus('[name="jLOv2z0"]');
      await page.keyboard.type(reghr);

      // Salaried or Hourly
      await page.click('[data-client-id="container_Salaried or Hourly"]');
      if (soh == 'salaried') {
        await page.click('[id="react-select-4-option-1"]');
      } else if (soh == 'hourly') {
        await page.click('[id="react-select-4-option-2"]');
      } else {
        // None of the input match
        console.error('Something went wrong');
        console.error(
          'Input for "salaried or hourly" is wrong: ' + soh + ' is not accepted'
        );

        // Skipping this entry
        await browser.close();
        resolve('not done');
        return;
      }

      // Number of Overtime Hours
      await page.focus('[name="lLev2w0"]');
      await page.keyboard.type(othr);

      // Rate of Overtime
      await page.click('[data-client-id="container_Rate of Overtime"]');
      if (rtot == 'x1.0') {
        await page.click('[id="react-select-5-option-1"]');
      } else if (rtot == 'x1.5') {
        await page.click('[id="react-select-5-option-2"]');
      } else if (rtot == 'x2.0') {
        await page.click('[id="react-select-5-option-3"]');
      } else if (rtot == 'salaried') {
        await page.click('[id="react-select-5-option-4"]');
      } else if (rtot == '') {
        await page.click('[id="react-select-5-option-5"]');
      } else {
        // None of the input match
        console.error('Something went wrong');
        console.error(
          'Input for "rate of overtime" is wrong: ' + rtot + ' is not accepted'
        );

        // Skipping this entry
        await browser.close();
        resolve('not done');
        return;
      }

      // Notes
      await page.focus('[name="arXqkjK"]');
      await page.keyboard.type(note);

      // Submit a copy of response
      if (email != '') {
        await page.click('[name="EMAIL_RECEIPT_CHECKBOX"]');
        await page.focus('[name="EMAIL_RECEIPT"]');
        await page.keyboard.type(email);
      }

      // Clicking submit button
      await page.click('[data-client-id="form_submit_btn"]');
      try {
        await page.waitFor('[data-client-id="confirmation_msg"]', {
          timeout: 60000
        });
        completed = true;
      } catch (err) {
        console.error('timed out');
      }

      await browser.close();
      resolve('done here');
    })();
  });
};

const mainFunc = async () => {
  // Reading CSV file
  await readFile();

  // Submitting form
  let length = date.length;
  console.log('Starting entry loop');
  for (let i = 0; i < length; i++) {
    console.log('Entry ' + (i + 1));
    completed = false;

    await entryFunc(
      date[i],
      locations[i],
      regHours[i],
      salariedOrHourly[i],
      otHours[i],
      rateofOT[i],
      notes[i]
    );

    if (completed) {
      console.log('Done!');
    } else {
      console.log('Did not enter');
    }
  }
  console.log('Loop is finished');
};

mainFunc();
