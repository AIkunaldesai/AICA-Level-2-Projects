# H P M S & Associates — CA Firm Practice Management System

A simple, practical practice-management application for a small Chartered
Accountant firm (5–10 team members), built with **Python + Streamlit + SQLite**.

It connects the complete office cycle in one place:

> **Client → Task → Delegation → Due Date → Work Status → Remarks → Completion → Billing → Payment → Outstanding Collection**

---

## 1. Problem Statement

Small and medium CA firms handle a large number of clients, employees,
assignments and statutory deadlines. In practice, work is often delegated
verbally, through spreadsheets or through messaging applications. As a result:

* The Partner cannot say, at any given moment, what the status of an
  assignment is, who is handling it, or what the client was last told.
* Statutory due dates are tracked in individual diaries rather than centrally.
* After the work is completed, billing is remembered separately — and
  completed assignments frequently remain unbilled.
* Collection of professional fees is followed up from memory, and part
  payments make the outstanding balance harder to track.

## 2. Proposed Solution

A single, centralised, locally-run application in which every assignment is
recorded against a client, delegated to a team member with a due date, updated
by that team member with a status and a dated remark, and then billed and
collected — with the outstanding balance calculated automatically.

---

## 3. Objectives

1. Maintain a Client Master, Employee Master and Task Master for the firm.
2. Delegate work with a due date, a priority and written instructions.
3. Let each employee update only their own work, with a permanent remark history.
4. Give the Partner a single Task Tracker and a Client 360° view.
5. Highlight the four exceptions that actually cost a firm money:
   **overdue work**, **completed but not billed**, **payment overdue**, and
   **work stuck waiting for the client**.
6. Track bills, part payments, outstanding amounts and collection follow-ups.

---

## 4. Features

### Work management
* Client Master — add, edit, search and view clients (PAN, GSTIN, type, contact).
* Employee Master — the Admin adds an employee before that person can register.
* Task Master — preloaded with the standard CA-firm assignments across
  GST, Income Tax, Audit, ROC, Accounts and Other, plus **+ Add New Task Type**.
* Task delegation with client, task, assignee, priority, dates, financial year
  and instructions.
* Eight work statuses and 0/25/50/75/100 % progress. Marking a task
  **Completed** automatically sets progress to 100 %.
* **Task history** — remarks are never overwritten. Every change is stored with
  the old status, the new status, the user and the date/time.
* **Task Tracker** — one screen with filters for client, employee, task, status,
  priority and due-date range, plus quick views for Pending / Overdue /
  Due Today / Upcoming / Completed.
* **Due-date tracking** with colour coding:
  🔴 Overdue 🟠 Urgent or due today 🟡 Waiting 🔵 In progress 🟢 Completed.

### Billing and collection
* Simple bill entry — professional fees + GST + other charges, with the
  **total calculated automatically**.
* **Completed but Not Billed** — any completed task with no bill against it is
  flagged on the Admin dashboard.
* **Part payments** — a bill may receive many payments; each is stored
  separately with date, mode and reference.
* **Automatic payment status** — Unpaid / Partially Paid / Paid, with the
  outstanding balance derived, never typed in by hand.
* **Collection follow-up** — dated follow-up remarks are appended, never deleted.

### Management views
* Admin Dashboard with work KPIs and financial KPIs.
* Client 360° — one screen showing a client's full work position and full
  billing position.
* Team-wise workload and client-wise summary.
* Simple Plotly charts: task status, employee workload, collection status and
  client-wise outstanding.

---

## 5. Technology

| Layer | Technology |
|---|---|
| Language | Python 3.9+ |
| User interface | Streamlit |
| Database | SQLite (single local file `hpms.db`) |
| Data handling | Pandas |
| Charts | Plotly Express |
| Security | `hashlib` PBKDF2-HMAC-SHA256 password hashing |

No paid APIs, no AI keys, no machine learning, no internet connection required.

---

## 6. Installation

```bash
# 1. Clone the repository
git clone <your-repository-url>
cd hpms-practice-management

# 2. (Optional but recommended) create a virtual environment
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS / Linux:
source .venv/bin/activate

# 3. Install the requirements
pip install -r requirements.txt

# 4. Run the application
streamlit run app.py
```

The application opens in the browser at `http://localhost:8501`.
The database file `hpms.db` is created automatically on first run.

---

## 7. How to Run — first-time steps

1. Open the application. Because no account exists, the **Sign Up** tab is open
   to everyone **once**.
2. Register yourself. **The first account automatically becomes the Admin**,
   and open public signup then stops.
3. Go to **Team → Add Employee** and enter each staff member's name, email,
   role, mobile and status.
4. Go to **Clients → Add Client** and enter your clients.
5. Go to **Delegate Task**, choose the client, the task, the employee, the
   priority and the due date, and click **Delegate Task**.
6. Ask the employee to sign up using the **same email address** you entered in
   the Team screen. Any other address is refused with
   *"This email address has not been authorised by Admin."*
7. The employee logs in and sees only their own tasks under **My Tasks**.

### Demo data (for the project video)

On the very first screen (before any account is created) there is a
**Load Demo Data** button. The Admin can also load it later from
**Settings → Demo Data**. Or from the command line:

```bash
python database.py --demo
```

This creates fictional data: 8 employees, 10 clients, 30 tasks, 10 bills and
several full and part payments — including an overdue task, a task due today,
work in progress, work waiting for the client, completed work, a completed but
unbilled task, an unpaid bill, a partially paid bill, a fully paid bill and an
overdue outstanding amount.

Demo logins:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@hpms.in` | `admin123` |
| Employee (any of the 8) | e.g. `rahul@hpms.in` | `demo123` |

> Change these passwords before using the application for real work.

---

## 8. User Roles

### Admin
Dashboard · Task Tracker · Delegate Task · Client 360° · Clients · Team ·
Task Master · Billing & Collection · Analytics · Settings

Can view all tasks of all employees, reassign work, maintain all masters,
raise bills, record payments, add collection follow-ups and view analytics.

### Employee
My Tasks · My Completed Tasks · Settings

Can see **only** the tasks assigned to them, and can update the status,
progress and remarks of those tasks. Employees cannot see other employees'
tasks and cannot see any billing, payment or outstanding information.

---

## 9. Database

SQLite, nine tables:

| Table | Purpose |
|---|---|
| `users` | Login accounts (name, email, hashed password, role, is_admin, active) |
| `authorised_employees` | Employee Master — the list of emails allowed to sign up |
| `clients` | Client Master |
| `task_types` | Task Master (category + task name) |
| `tasks` | Delegated assignments with due date, priority, status and progress |
| `task_updates` | Full activity history of every task (never overwritten) |
| `bills` | Bills raised, with the auto-calculated total |
| `payments` | Every payment / part payment against a bill |
| `collection_followups` | Dated collection follow-up remarks |

Relationships:

```
clients ──< tasks >── task_types
              │
              ├──< task_updates >── users
              │
              └──< bills ──< payments
                     │
                     └──< collection_followups

authorised_employees ──< tasks   (assigned_to)
authorised_employees ──  users   (linked by email address)
```

Derived values are **never stored** — they are always calculated:

* `Total Bill = Professional Fees + GST + Other Charges`
* `Total Received = SUM(payments for that bill)`
* `Outstanding = Total Bill − Total Received`
* `Payment Status = Unpaid / Partially Paid / Paid`

---

## 10. Security

* Passwords are hashed with **PBKDF2-HMAC-SHA256** (100,000 iterations) using a
  fresh random 16-byte salt per password. Plain-text passwords are never stored.
* Password comparison uses `hmac.compare_digest` to avoid timing attacks.
* Session-based login through `st.session_state`.
* Role-based access: the sidebar shows only the screens a role is allowed to
  open, and `main()` blocks an admin screen even if the page name is forced.
* **Access control is enforced in the database queries.** `get_tasks_df()` adds
  `WHERE t.assigned_to = ?` for a non-admin user, so an employee physically
  cannot fetch another employee's row — it is not merely a hidden button.
* Signup is restricted to email addresses already present in the Employee Master.
* Basic input validation on emails, passwords, dates, amounts and duplicate
  codes / bill numbers.
* `.gitignore` excludes `*.db`, so firm data is never pushed to GitHub.

---

## 11. Project Files

```
app.py              All Streamlit screens and the sidebar router
database.py         Schema, task master seed, all queries, demo data
auth.py             Password hashing, signup rules, login
test_scenarios.py   Automated run of the four acceptance scenarios
requirements.txt    Dependencies
README.md           This file
.gitignore          Keeps the database and caches out of the repository
```

---

## 12. Testing

The four acceptance scenarios (Admin setup → Employee update → Admin review →
Billing and part payment) run automatically against a temporary database:

```bash
python test_scenarios.py
```

Expected output ends with `36 checks passed, 0 failed`. The script verifies,
among other things, that the first user becomes Admin, that an unauthorised
email is refused, that an employee cannot fetch another employee's task, that
completing a task forces progress to 100 %, that a ₹50,000 bill moves
Unpaid → Partially Paid (₹20,000 received, ₹30,000 outstanding) → Paid, and
that all of it survives a restart.

---

## 13. Screenshots

Add your own screenshots here when preparing the report:

| Screen | File |
|---|---|
| Login | `screenshots/01-login.png` |
| Admin Dashboard | `screenshots/02-dashboard.png` |
| Task Tracker | `screenshots/03-task-tracker.png` |
| Delegate Task | `screenshots/04-delegate.png` |
| Employee — My Tasks | `screenshots/05-my-tasks.png` |
| Client 360° | `screenshots/06-client-360.png` |
| Billing & Collection | `screenshots/07-billing.png` |
| Analytics | `screenshots/08-analytics.png` |

---

## 14. Limitations

* Designed for a single office / single machine. SQLite is not intended for
  many simultaneous writers.
* This is a **billing and collection tracker**, not an accounting or invoicing
  package — it does not produce a printable tax invoice or maintain ledgers.
* No document storage, no e-mail or WhatsApp reminders, no portal integration.
* No audit trail for master-data edits (only task and collection history).
* Password reset must be done by the Admin; there is no "forgot password" email.
* Amounts are stored as floating-point rupees, which is adequate for tracking
  but not for statutory books of account.

---

## 15. Future Scope

* WhatsApp / e-mail reminders for due dates and outstanding payments
* Automated deadline calendar for statutory due dates
* Document management with client-wise folders
* OCR reading of Form 26AS, GST returns and bank statements
* GST portal and Income Tax portal integration
* Payment gateway and online fee collection
* Printable GST-compliant invoices and a full accounting module
* Multi-branch support with a server database (PostgreSQL / MySQL)
* Mobile application for staff task updates
* AI assistant for workload allocation and collection prioritisation

---

*Built as an academic / office-utility project. All demo data is fictional.*
