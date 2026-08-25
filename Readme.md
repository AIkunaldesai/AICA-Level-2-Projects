# Invoice QR → Excel (Offline)

## Overview

A browser-based, offline invoice QR scanner that finds QR codes in invoice PDFs and scanned images, decodes the QR content, parses common QR formats—including GST e-invoice signed QRs—and exports the extracted data to an Excel workbook.

The application is designed so that scanning happens locally in the browser and files are not uploaded.

## Supported Input

- PDF
- PNG
- JPG
- WEBP
- Multiple files
- Multi-page PDFs

Users can either drag files into the drop area or click to browse.

## Core Workflow

1. Select or drop invoice files.
2. For PDFs, render each page at multiple scales and scan for a QR code.
3. For images, resize large images to a maximum side length of 4200 pixels and scan them.
4. Prefer the browser's native `BarcodeDetector` when available.
5. Fall back to `jsQR` when native detection is unavailable or unsuccessful.
6. Try image enhancement using Otsu thresholding when needed.
7. Scan cropped regions at reduced scales to improve QR detection.
8. Parse the decoded QR text.
9. Display one result row per scanned page/file.
10. Export all found QR data to `qr-invoice-data.xlsx`.

## QR Parsing

The parser recognizes the following formats:

### GST e-Invoice Signed QR

A three-part token whose first part matches the expected base64url-safe pattern is treated as a signed e-invoice QR.

The payload is base64url-decoded, parsed as JSON, and—when a `data` property contains a string—parsed again.

Common fields are given friendly labels:

| Source key | Display label |
|---|---|
| `Irn` | IRN |
| `IrnDt` | IRN Date |
| `SellerGstin` | Seller GSTIN |
| `BuyerGstin` | Buyer GSTIN |
| `DocNo` | Invoice No |
| `DocTyp` | Doc Type |
| `DocDt` | Invoice Date |
| `TotInvVal` | Total Invoice Value |
| `ItemCnt` | Item Count |
| `MainHsnCode` | Main HSN |

Nested JSON objects are flattened into spreadsheet-friendly field names.

### JSON

QR content beginning with `{` or `[` is parsed as JSON and flattened.

### UPI Payment QR

QR content beginning with `upi://` is parsed using these labels:

| Parameter | Display label |
|---|---|
| `pa` | Payee VPA |
| `pn` | Payee Name |
| `am` | Amount |
| `tn` | Note |
| `tr` | Ref |

### URL

QR content beginning with `http://` or `https://` is classified as a URL.

### Key-Value Text

Text split by newlines or `|` characters is treated as key-value data when at least half of the lines match a `key: value` or `key=value` pattern.

### Plain Text

Anything else is returned as text under the `Text` field.

## QR Detection

The scanner uses:

- `BarcodeDetector` with `qr_code` format when supported.
- `jsQR` with inversion attempts enabled.
- Otsu thresholding for an enhanced scan.
- Full-image scanning followed by reduced-size regional scans.
- Two reduction factors: 2 and 4.
- Overlapping crop regions to locate QR codes anywhere on a page.

## PDF Processing

PDFs are loaded with PDF.js.

Each page is:

1. Retrieved from the PDF.
2. Rendered at scale 3.
3. Scanned for a QR.
4. If necessary, rendered again at scale 5.
5. Recorded as either `Found` or `No QR found`.

The UI reports progress in the form `page X/Y`.

## Image Processing

Images are loaded through an object URL.

Large images are scaled down while preserving aspect ratio, with the largest dimension capped at 4200 pixels.

The resulting image is drawn to a canvas and scanned for a QR code.

## Excel Export

Found results are exported to an Excel workbook named:

`qr-invoice-data.xlsx`

The workbook contains a single sheet:

`QR Data`

Each row includes:

- File
- Page
- Status
- QR Type
- Every discovered parsed field
- Raw QR Data

Columns are automatically sized within reasonable minimum and maximum widths.

## User Interface

The interface includes:

- Offline/privacy indicator.
- Invoice QR → Excel heading.
- Drag-and-drop upload area.
- File browser.
- Download Excel button.
- Clear button.
- Scan status.
- Results table.
- Expand/collapse control for rows containing more than four fields.

Rows visually distinguish successful scans, errors, and unsuccessful scans.

## Privacy

The page states that all scanning happens locally in the browser and that files are never uploaded.

## External Dependencies

The HTML references these browser-side libraries from jsDelivr:

- `jsQR` 1.4.0
- `pdfjs-dist` 4.8.69
- `xlsx` 0.18.5

Although the application performs file processing locally, the current HTML imports these dependencies from external CDN URLs.

## Key Functions

- `flatten()` — recursively converts parsed objects into flat fields.
- `parseQr()` — detects the QR content format and parses it.
- `otsu()` — applies grayscale Otsu thresholding.
- `scanData()` — runs `jsQR`, optionally with enhancement.
- `native()` — attempts native browser QR detection.
- `scanCanvas()` — combines native, jsQR, enhancement, and regional scanning.
- `imageCanvas()` — loads and scales image files into a canvas.
- `scanPdf()` — renders and scans every PDF page.
- `scanFile()` — dispatches PDF or image processing.
- `exportExcel()` — creates the Excel workbook.
- `render()` — updates the results table and controls.
- `handle()` — processes selected files and updates progress.

## Generated Output

Successful scans are displayed in the table with:

- Source file
- Page number
- QR type
- Parsed fields

The complete decoded QR payload is retained as `Raw QR Data` for Excel export.
