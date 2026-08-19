# 🏦 Bank Statement Analyzer (Portable v1.6.1)

[![Python 3.9+](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![Streamlit App](https://img.shields.io/badge/framework-Streamlit-FF4B4B.svg)](https://streamlit.io/)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)](https://github.com)
[![Privacy First](https://img.shields.io/badge/privacy-100%25%20Offline-success.svg)](https://github.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Bank Statement Analyzer** is a fast, intelligent, and privacy-first financial application designed to transform complex bank statements into actionable cash flow intelligence, audit-ready summaries, and live dynamic Excel workbooks.

Available as a **zero-install portable Windows application** and as a **modular Python/Streamlit web dashboard**.

---

## 🌟 Key Highlights

- 🔒 **100% Offline & Private:** All data processing occurs locally in-memory. No financial data or statements are ever sent to external cloud servers.
- ⚡ **Zero-Install Portable App:** Pre-packaged standalone Windows executable (`.exe`) with built-in runtime and dependencies.
- 🤖 **Intelligent Narration Parsing:** Automatically detects payment channels and extracts clean counterparty names from complex bank narrations.
- 📈 **Interactive Visual Analytics:** Real-time KPI summaries, monthly cash flow breakdowns, running balance tracking, and largest transaction insights.
- 🔄 **Live Formula-Backed Excel Export:** Generates multi-sheet Excel workbooks (`.xlsx`) with live formulas—changing counterparty names directly in Excel automatically recalculates summaries without re-running the app.
- 🛡️ **Mathematical Audit & Reconciliation:** Automatically verifies `Opening Balance + Deposits - Withdrawals == Closing Balance` and flags data anomalies.

---

## ✨ Features

### 1. 📄 Multi-Format Statement Ingestion
- Supports native text-based **PDF** statements (via high-performance PDF extractors).
- Supports modern and legacy **Excel** spreadsheets (`.xlsx`, `.xls`, `.xlsm`).
- Handles large files (up to 200 MB) smoothly with instant SHA-256 caching.

### 2. 🧠 Smart Counterparty & Channel Extraction
- Automatically parses complex transaction narrations to isolate counterparty/merchant names.
- Categorizes transactions into recognized payment channels:
  - **UPI** (Google Pay, PhonePe, Paytm, BHIM, etc.)
  - **NEFT / RTGS / IMPS** (Electronic fund transfers)
  - **Cheques / Clearing**
  - **Card / POS / E-Commerce**
  - **ATM Withdrawals & Cash Deposits**
  - **Bank Interest & Service Charges**
  - **Other / Direct debits**

### 3. 📊 Interactive Dashboard & Financial KPIs
- **Core Financial Metrics:**
  - Opening Balance & Closing Balance
  - Total Deposits & Total Withdrawals
  - Net Movement (Cash Inflow vs. Outflow)
- **Visual Analytics:**
  - Monthly Cash Flow Bar Charts (Deposit vs. Withdrawal comparison)
  - Running Balance Trendline
  - Top 10 Largest Transactions breakdown

### 4. ✏️ Name Consolidation & Bulk Editing
- **Quick Name Merging:** Select one or multiple spelling variations (e.g., `AMZN PAY`, `AMAZON INDIA`, `AMAZON RET`) and consolidate them into a single clean counterparty name (`Amazon`).
- **Advanced Bulk Name Editor:** Edit counterparty names directly in a spreadsheet-like data grid inside the dashboard.
- Real-time synchronization across all tabs and export files.

### 5. 🔍 Transaction-Level Correction
- Line-by-line interactive transaction editor.
- Filter transactions by a specific counterparty or view all.
- Override counterparty names or payment channels for individual transactions without affecting other rows.

### 6. 🛡️ Audit Quality & Balance Reconciliation
- Mathematical verification: `Opening Balance + Total Deposits - Total Withdrawals == Closing Balance`.
- Identifies reconciliation variance down to 2 decimal places.
- Audit statistics: total transactions parsed, rows with running balance, identified vs. unidentified counterparties.

### 7. 📥 Live Dynamic Excel Export (`.xlsx`)
- Multi-sheet structured workbook compatible with **Excel 2010+**.
- **Transactions Sheet:** Complete row-by-row transaction log with editable Counterparty fields.
- **Name Summary Sheet:** Formula-driven summary aggregating deposits, withdrawals, and net movement per entity using native Excel formulas (`SUMIFS`, `COUNTIFS`).
- **Dashboard & Quality Sheets:** Reconciliation status, KPI summaries, and audit logs.

---

## 📁 Project Structure

```text
BankStatementAnalyzerPortable/
│
├── BankStatementAnalyzerPortable.exe   # Standalone portable Windows executable (Zero-install)
├── Launch_App.bat                      # 1-Click launcher / automatic environment fallback
├── README.md                           # Project documentation
├── requirements.txt                    # Python package dependencies
├── .gitignore                          # Git ignored patterns
│
└── _internal/                          # Application core engine & runtime
    ├── streamlit_app.py                # Streamlit UI dashboard and workflow orchestration
    └── ...                             # Python standard library and runtime binaries
```

---

## 🚀 Getting Started

### Option 1: Standalone Portable Mode (Windows - Recommended)

No Python installation or command line required:

1. Double-click **`BankStatementAnalyzerPortable.exe`** (or execute **`Launch_App.bat`**).
2. The application will launch and open in your default browser at `http://localhost:8501`.

---

### Option 2: Run via Python Source Code (Cross-Platform)

#### Prerequisites
- **Python 3.9+** installed ([Download Python](https://www.python.org/downloads/)).

#### 1. Clone or Extract the Repository
```bash
git clone https://github.com/<YOUR_USERNAME>/bank-statement-analyzer.git
cd bank-statement-analyzer
```

#### 2. Create and Activate a Virtual Environment

- **Windows (PowerShell):**
  ```powershell
  python -m venv .venv
  .venv\Scripts\Activate.ps1
  ```
- **macOS / Linux:**
  ```bash
  python3 -m venv .venv
  source .venv/bin/activate
  ```

#### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

#### 4. Launch the Application
```bash
streamlit run _internal/streamlit_app.py
```

---

## 📦 Dependencies

The application relies on the following lightweight Python libraries (defined in [requirements.txt](file:///c:/Users/Sachin%20Goel/Downloads/Capston/BankStatementAnalyzerPortable/requirements.txt)):

| Package | Purpose |
| :--- | :--- |
| `streamlit` | Interactive web dashboard and UI components |
| `pandas` | High-performance tabular data manipulation and aggregation |
| `altair` / `plotly` | Interactive financial charts and cash flow visualizations |
| `pdfminer.six` | Text extraction engine for PDF bank statements |
| `pypdfium2` | PDF page rendering, parsing, and structure extraction |
| `openpyxl` / `xlsxwriter` | Live Excel workbook generation with dynamic formulas and formatting |
| `pyarrow` | Optimized in-memory columnar data processing |
| `cryptography` | Secure hashing and local document validation |

---

## 💡 Step-by-Step Usage Guide

```mermaid
graph LR
    A[Upload Statement] --> B[Automated Parsing & Extraction]
    B --> C[Explore KPIs & Charts]
    C --> D[Consolidate & Edit Names]
    D --> E[Reconcile Balances]
    E --> F[Export Dynamic Excel]
```

1. **Upload Statement:** Drag and drop your bank statement (`.pdf`, `.xlsx`, `.xls`, or `.xlsm`) onto the upload zone.
2. **Apply Sidebar Filters:**
   - Narrow down by **Date Range**.
   - Filter by **Payment Channel** (UPI, NEFT, IMPS, etc.).
   - Select specific **Counterparties** or search text within narrations.
3. **Navigate the Dashboard Tabs:**
   - **Overview Tab:** Check opening/closing balances, net flow, monthly cash flow charts, and largest transactions.
   - **Name Summary Tab:** Review counterparties, consolidated totals, and use the quick rename/merge tool.
   - **Transactions Tab:** Inspect individual transactions, modify channels, or rename counterparties row-by-row.
   - **Quality Checks Tab:** Verify balance reconciliation and check for any data extraction warnings.
4. **Download Live Excel Report:** Click **"Download live editable Excel analysis"** to save your structured audit report.

---

## 🔒 Privacy & Data Security

- **Zero Cloud Leakage:** All parsing, aggregation, and Excel generation take place entirely on your local CPU and in-memory.
- **No Internet Required:** The application can run in a completely air-gapped / offline environment.
- **Scanned Documents:** Password-protected PDFs must be decrypted, and scanned/image-only PDFs must be OCR-processed before importing.

---

## 🛠️ Troubleshooting & FAQ

<details>
<summary><b>Q: The browser does not open automatically on Windows.</b></summary>
Open any web browser and navigate manually to <code>http://localhost:8501</code> once the application terminal window is running.
</details>

<details>
<summary><b>Q: My PDF statement is not parsing correctly.</b></summary>
Ensure that your PDF has selectable text. Scanned copies (flat images inside a PDF) do not contain digital text streams and should be converted using an OCR tool first.
</details>

<details>
<summary><b>Q: Can I edit counterparty names directly in the exported Excel file?</b></summary>
Yes! The exported Excel file includes dynamic formulas. When you change names in the transaction sheet, the summary sheet updates automatically inside Microsoft Excel.
</details>

---

## 📄 License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
