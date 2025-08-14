const puppeteer = require("puppeteer");
const fs = require("fs");

async function scrapeVisibleForm() {
  console.log("🚀 Starting the simplified scraper for visible fields...");

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  try {
    await page.goto("https://udyamregistration.gov.in/UdyamRegistration.aspx", {
      waitUntil: "networkidle2",
    });
    console.log("✅ Page loaded.");

    const formSchema = {
      steps: [
        {
          step: 1,
          title: "Aadhaar Validation",
          fields: [],
        },
      ],
    };

    console.log("🔍 Scraping Step 1 fields...");
    const aadhaarSelector = "#ctl00_ContentPlaceHolder1_txtadharno";
    await page.waitForSelector(aadhaarSelector);

    const aadhaarField = await page.$eval(aadhaarSelector, (input) => ({
      id: input.id,
      name: input.name,
      label: "Aadhaar Number",
      type: "text",
      placeholder: input.placeholder,
      validation: {
        required: true,
        regex: "^\\d{12}$",
        errorMessage: "Please enter a valid 12-digit Aadhaar number.",
      },
    }));
    formSchema.steps[0].fields.push(aadhaarField);

    const nameSelector = "#ctl00_ContentPlaceHolder1_txtownername";
    const nameField = await page.$eval(nameSelector, (input) => ({
      id: input.id,
      name: input.name,
      label: "Name as per Aadhaar",
      type: "text",
      placeholder: input.placeholder,
      validation: { required: true, errorMessage: "Name is required." },
    }));
    formSchema.steps[0].fields.push(nameField);

    console.log("✅ Step 1 fields scraped.");

    const jsonData = JSON.stringify(formSchema, null, 2);
    fs.writeFileSync("form-schema.json", jsonData);
    console.log("🎉 Successfully created form-schema.json with Step 1 data!");
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    await browser.close();
    console.log("🚪 Browser closed.");
  }
}

scrapeVisibleForm();
