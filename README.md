<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/2a6fcd18-b3df-40ab-8cac-1444ce6f4062

## Run Locally

**Prerequisites:**  Node.js

## Fork + Pull Request Workflow

1. **Fork:** Create a personal copy of `aiinicai/AICA-Level-2-Projects` under your GitHub account.
2. **Add your folder:** Upload or copy your project folder into your fork.
3. **Commit:** Save the changes in your fork with a clear commit message.
4. **Open a Pull Request:** Request the `aiinicai` account to merge your changes into the original repository.
5. **Merge:** The repository owner reviews and accepts your Pull Request. After it is merged, your project folder will appear in the official repository.

---

# Method 1: Website Only

Use this method if:

- You do not want to install Git.
- Your project contains relatively few files.
- You do not need to preserve the project’s earlier commit history.

> [!NOTE]
> GitHub’s web uploader generally allows up to 100 files in a single upload. If your project contains more files, upload them in batches or use the Git command-line method.

## Step 1: Fork the Repository

1. Log in to your GitHub account.
2. Open the [AICA-Level-2-Projects repository](https://github.com/aiinicai/AICA-Level-2-Projects).
3. Click **Fork** in the upper-right corner of the page.
4. On the **Create a new fork** page, keep the default settings.
5. Click **Create fork**.

You will be redirected to your personal copy of the repository:

```text
https://github.com/YOUR-USERNAME/AICA-Level-2-Projects
# Tally Converter

Converts Excel, CSV, PDF, and image (JPG/PNG) accounting documents into
TallyPrime-compatible import XML - running entirely offline on your
Windows PC. No data leaves your computer.

```
Excel / CSV / PDF / JPG / PNG
        |
Read accounting data
        |
OCR when necessary (local Tesseract)
        |
Extract transactions
        |
Normalize accounting data
        |
Validate
        |
Map Tally ledgers/items
        |
Human review
        |
Generate TallyPrime-compatible XML
        |
Export XML
        |
Import into TallyPrime
```

## Important: test before relying on this for real books

The generated XML follows TallyPrime's documented voucher-import
structure (ENVELOPE / HEADER / BODY / DATA / TALLYMESSAGE / VOUCHER),
but different TallyPrime versions and company configurations can
require different fields. **Before using this for real accounting
data, test the generated XML against a TallyPrime test/sample
company** (Gateway of Tally &rarr; Import Data) and adjust the ledger
role mappings in Settings/Mappings as needed for your setup.

## What this does NOT do

- It never invents data. If a field (date, party, amount, GSTIN,
  ledger, item, tax, bank reference) can't be confidently determined,
  the transaction is marked `REVIEW_REQUIRED` instead of guessed.
- It never sends anything to TallyPrime or anywhere else without you
  explicitly clicking "Send to Tally" - the default is always
  **Export XML Only**.
- It never uses cloud OCR or any external API. OCR runs locally via
  Tesseract.

## Quick start (for developers/technical users)

See [INSTALLATION.md](INSTALLATION.md) for the full step-by-step guide
covering both "just run it from source" and "build the Windows
installer" paths. In short:

```bash
# Backend
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt --break-system-packages  # or without the flag in a venv
python run.py

# Frontend (separate terminal, for development only)
cd frontend
npm install
npm run dev
```

Then open the URL printed in the backend terminal (defaults to
`http://127.0.0.1:8000`).

## For end users

If you received `TallyConverterSetup.exe` from your developer/IT team,
see [USER_GUIDE.md](USER_GUIDE.md) - you don't need Python, Node.js,
or anything else installed.

## Documentation

- [INSTALLATION.md](INSTALLATION.md) - setting up a dev environment,
  installing Tesseract, and building the Windows installer
- [USER_GUIDE.md](USER_GUIDE.md) - how to import files, review
  transactions, map ledgers, and export/import into Tally
- [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md) - architecture, project
  layout, how to extend voucher types, running tests

## License / ownership

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
This project was generated as a starting point for your own internal
tool. There is no license file included - add one appropriate to your
situation before distributing it outside your organization.
