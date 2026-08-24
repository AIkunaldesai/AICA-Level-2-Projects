# Restaurant Sales & Reconciliation Application

Production-ready desktop/web application built in Python for multi-branch restaurant sales tracking, physical cash reconciliation, card/QR bank settlement matching, and online aggregator (Zomato, Swiggy, Dineout) payout reconciliation.

---

## 🌟 Key Features

1. **Executive Accounting Dashboard**:
   - Real-time KPIs: Total Sales, Cash Sales, Card/QR Sales, Zomato, Swiggy, Dineout, Expenses, Unresolved Differences.
   - Status visual indicators: **Reconciled (Green)**, **Difference (Red)**, **Pending (Amber)**, **Not Imported (Grey)**.
   - Dynamic filters by Branch, Date Range, Payment Channel, and Reconciliation Status.
   - Currency display formatted to Indian standard (`₹ 1,42,452.54`).

2. **Branch & Master Management**:
   - Multi-branch support (e.g. Noida Branch, RDC Branch, dynamic admin additions).
   - Configurable Payment Channels (Cash, Card/QR, Zomato, Swiggy, Dineout, Custom).
   - Aggregator Master with configurable settlement rules.
   - Accounting Head Master (e.g., `Zomato Commission Exp`, `TCS Receivable`, `GST Sec 9(5)`).

3. **Consolidated Day Book**:
   - Multi-channel daily sales grid auto-derived from branch imports.
   - Prevents double counting (derived totals for Cash + Card/QR + Online Payments).
   - Daily and Monthly total calculations.

4. **Data Import Wizard**:
   - Upload Excel (`.xlsx`, `.xls`) or CSV files.
   - Flexible column header mapping for varying branch column names (`"Cash Sale"` $\rightarrow$ `Cash`, `"UPI"` $\rightarrow$ `Card/QR`).
   - Duplicate detection, missing date flags, invalid amount checks, row-level error reporting, and downloadable import error logs.

5. **Physical Cash Reconciliation**:
   - Automatic opening balance carry-forward from previous day's closing balance.
   - Linked cash sales automatically populated from Day Book.
   - Date-aware Salary Advance buckets (`1st to 5th`, `6th to 15th`, `16th to 31st`).
   - Accounting Equation:
     $$\text{Expected Closing} = \text{Opening Bal} + \text{Cash Sales} - \text{Expenses (Inv Recv/Not Recv)} - \text{Salary Advances} - \text{Base Kitchen Transfer} + \text{Service Charge}$$
     $$\text{Difference} = \text{Actual Day Book Closing} - \text{Expected Closing}$$

6. **Card / QR Bank Settlement Reconciliation**:
   - Bank statement import (`.xlsx`, `.csv`).
   - Multi-pass automated matching engine:
     1. Exact Reference Match
     2. Exact Amount + Exact Date Match
     3. Exact Amount + Date Tolerance Window (e.g., 0–3 days)
     4. Manual Matching with audit trail reason.

7. **Online Aggregator Settlement & Payout Breakup**:
   - Generic multi-aggregator payout engine.
   - Dynamic multi-batch matrix view (Gross Sales, Bank Payout, Commissions, Promo Discounts, TCS, TDS, GST Section 9(5), Packing Charges, Misc Deductions).
   - Formulas:
     $$\text{Actual Difference} = \text{Gross Sales} - \text{Payout}$$
     $$\text{Calculated Deductions} = \text{Commission} + \text{Promo} + \text{TCS} + \text{TDS} + \text{Misc} + \text{GST 9(5)} - \text{Packing Charges}$$
     $$\text{Difference Adjustment} = \text{Actual Difference} - \text{Calculated Deductions}$$

8. **Audit Log & Soft Deletes**:
   - Complete tracking of logins, imports, manual overrides, and config edits with JSON diff snapshots.

9. **Report Generation**:
   - Downloadable Excel (`.xlsx`) reports for Consolidated Day Book, Cash Reconciliation, Card/QR Reconciliation, Aggregator Payout Matrix, Audit Trail.

---

## 🚀 Quick Start (Windows Setup)

### 1. One-Click Installation
Double-click `install.bat` or run in Command Prompt:
```cmd
install.bat
```
`install.bat` will:
- Check Python 3.12+ installation.
- Create a virtual environment (`venv`).
- Upgrade `pip` and install all dependencies from `requirements.txt`.
- Create required local directories (`data/`, `uploads/`, `exports/`, `logs/`, `sample_data/`).
- Initialize SQLite database (`data/restaurant_reconcile.db`) and seed initial master data.
- Generate sample Excel templates in `sample_data/`.

### 2. Launching Application
Double-click `run.bat` or run:
```cmd
run.bat
```
This will start Uvicorn at `http://127.0.0.1:8001` (port 8000 is reserved for the Bank Statement tool) and automatically open your default browser.

### 🔑 Default Credentials
| Role | Email | Password |
|---|---|---|
| **Administrator** | `admin` | `admin` |
| **Accounts Manager** | `accounts@restaurant.com` | `accounts123` |
| **Branch User** | `noida` | `noida` |
| **Viewer** | `viewer@restaurant.com` | `viewer123` |

---

## 🧪 Running Automated Tests

To run the `pytest` test suite:
```cmd
venv\Scripts\activate
pytest -v
```

---

## 📂 Project Structure

```
restaurant_reconciliation/
├── app/
│   ├── api/             # FastAPI REST endpoints & Web UI View routers
│   ├── core/            # Database engine, config, security, auth dependencies
│   ├── models/          # SQLAlchemy ORM database models
│   ├── schemas/         # Pydantic schemas for data validation
│   ├── services/        # Business logic & reconciliation engines
│   ├── templates/       # Jinja2 HTML web templates
│   ├── static/          # CSS stylesheet and JavaScript client utilities
│   ├── seed.py          # Database seeder script & sample Excel generator
│   └── main.py          # FastAPI Application entry point
├── sample_data/         # Downloadable Excel test templates
├── tests/               # Pytest automated unit & integration test suite
├── requirements.txt     # Dependency list
├── install.bat          # Windows automated setup script
├── run.bat              # Windows launcher script
└── README.md
```
