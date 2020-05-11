# UWPD_Time_Report

UWPD has requested UW employees to enter their Covid-19 time report through this [form](https://app.smartsheet.com/b/form/5784f92c46a14794abc5eb68c420ba7e). This script is to automate the form entry through a csv file, as many people has multiple entries to enter. This script can be run through the command-line

## Getting Started

The instructions below are only for MacOS and Linux. Instructions for Windows coming soon

### Prerequisites

This script is written in NodeJS. You will need to have NodeJS installed to run this script

You will need Puppeteer. To install, run:

```
npm i puppeteer
```

You will also need csv-parse. To install, run:

```
npm i csv-parser
```

### Preparing the CSV file

Fill in the Time Reporting Template.xlsx with the entries you want to submit. Please make sure to follow the instructions given on the excel sheet as to ensure that the script will run properly

Once you have filled up the excel sheet. Save the file as .csv. We also recommend checking the csv file to make sure that the csv file is properly made. Please refer to CSV_sample.csv to see how the csv file should look like

## Running the script

To run the script, go to terminal and run:

```
node submitForm.js [filename] 'name' 'job title' email
```

An example would be

```
node submitForm.js sample_John_doe.csv 'John Doe' 'Developer' jdoe@email.com
```

## Notes

- This form is built for DoIT employees, so it will always select DoIT for the Organization field. If you wish to use this script for employees outside of DoIT, please let me know.
- The form will block submissions if it detects automated entries. To counter that, a 3 second timer is added between each input. Hence, it is normal for the script to appear to be working slowly.
- If you choose to have a copy of your response sent to your email, it will ask for a CAPTCHA response.
  The headless option is turned off so that user can repond to the CAPTCHA. You will have 2 minutes to respond to the CAPTCHA before the script times out and move on to the next submission

  However, if you have a lot of submissions to enter, we recommend choosing not to request a copy of your responses (ie. not entering your email on the command line) as it can take a long time to go answer the CAPTCHA
