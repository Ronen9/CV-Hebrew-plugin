// Minimal Playwright Chromium HTML→PDF renderer for the resume-tailor Copilot skill.
//
// Usage (from PowerShell):
//   node render-pdf.js <input.html> <output.pdf> [--accent #2563EB]
//
// Requires: `npm install playwright` once in the working directory and
//           `npx playwright install chromium` once on the machine.
//
// Notes:
//  - Loads the HTML via file:// URL so relative assets resolve correctly.
//  - Waits for `networkidle` so Google Fonts (Heebo) finish loading before printing.
//  - A4, printBackground:true, default margins are baked into the HTML @page rules.

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: node render-pdf.js <input.html> <output.pdf>');
    process.exit(1);
  }

  const inputHtml = path.resolve(args[0]);
  const outputPdf = path.resolve(args[1]);

  if (!fs.existsSync(inputHtml)) {
    console.error(`Input HTML not found: ${inputHtml}`);
    process.exit(1);
  }

  const fileUrl = 'file:///' + inputHtml.replace(/\\/g, '/');

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Surface font-loading warnings to the console for the caller.
  page.on('console', (msg) => {
    if (msg.type() === 'warning' || msg.type() === 'error') {
      console.error(`[page ${msg.type()}]`, msg.text());
    }
  });

  await page.goto(fileUrl, { waitUntil: 'networkidle', timeout: 30000 });

  // Best-effort: wait for document.fonts to be ready (Heebo etc.)
  await page.evaluate(async () => {
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
  });

  await page.pdf({
    path: outputPdf,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
  });

  await browser.close();
  console.log(`Rendered: ${outputPdf}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
