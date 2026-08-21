# Upload Your Project Folder to the AICA Level 2 Projects Repository

## AICA Level-2 Capstone Project

**Project:** Secure Document Retrieval from Office Email  
**Organisation:** GAV & Associates, Chartered Accountants  
**Technology:** n8n + Gmail + OpenAI GPT + Google Sheets + Google Drive

---

## Fork + Pull Request Workflow

## 2. Business Problem

In a Chartered Accountant's office, clients frequently request copies of:

- Income Tax Returns (ITR)
- Financial Statements
- Tax Audit Reports
- GST Returns
- Other previously prepared documents

Manual retrieval requires office staff to:

1. Read the client email.
2. Identify the client.
3. Verify the sender.
4. Identify the financial year.
5. Locate the client folder.
6. Locate the financial-year folder.
7. Find the requested document.
8. Download and attach the document.
9. Reply to the client.
10. Maintain a record of the transaction.

This project automates the repetitive part of this process while retaining authentication and audit controls.

---

## 3. Workflow Architecture

### High-Level Flow

Gmail → AI Request Analysis → Required Field Validation → Client Authentication → Google Drive Search → Document Retrieval → Email Response → Audit Log

Detailed architecture is provided in `architecture.png`.

---

## 4. How the AI Agent Works

The AI component analyses the incoming email and determines whether it is a genuine document request.

It extracts:

- PAN
- Financial Year
- Requested Documents
- Whether the email is a genuine document request

The workflow uses a structured output schema so that the AI response is converted into predictable fields.

The AI model configured in the workflow is GPT-5 Mini.

---

## 5. Document Recognition

The workflow normalises commonly used document names:

| Client wording | Standard document type |
|---|---|
| ITR / ITR Copy / Income Tax Return / Return Copy | ITR |
| Financial Statement / Balance Sheet / P&L | Financials |
| Tax Audit / Tax Audit Report | Tax Audit Report |
| GST Return / GST Returns | GST Returns |

Only recognised document types are searched.

---

## 6. Security and Authentication

The workflow does not send documents merely because an email contains a PAN.

Authentication is performed using two matching conditions:

**PAN + Registered Email ID**

The PAN is first searched in the Client Masterdata Google Sheet.

The sender email is then compared with the email registered against that PAN.

Only when both conditions match is the sender treated as authenticated.

Unauthorised requests are rejected and recorded in the Audit Log.

---

## 7. Document Retrieval Logic

After authentication:

1. Search Google Drive for the client's PAN folder.
2. Search within that folder for the requested financial year.
3. Convert each requested document into a standard search name.
4. Search the financial-year folder.
5. Download documents that are found.
6. Combine the results.
7. If all requested documents are found, send them as email attachments.
8. If one or more requested documents are missing, send a failure response instead of sending an incomplete document set.

---

## 8. Exception Handling

The workflow handles the following situations:

### A. Non-document email
The workflow ignores promotional, marketing, newsletter, spam and similar emails.

### B. Missing PAN
The client is asked to provide the PAN reference.

### C. Missing Financial Year
The client is asked to specify the financial year.

### D. Missing Document Type
The client is asked to specify the required document.

### E. PAN / Email Authentication Failure
The request is rejected and the client is asked to contact the office.

### F. Document Not Found
The client receives a response that the requested document could not be located.

---

## 9. Audit Trail

The workflow maintains an Audit Log in Google Sheets.

The log records:

- Timestamp
- Client Name
- PAN
- Sender Email
- Financial Year
- Documents Requested
- Files Sent
- Status
- Failure Reason

This provides an operational record of document retrieval attempts.

---

## 10. Technology Stack

| Component | Purpose |
|---|---|
| n8n | Workflow automation/orchestration |
| Gmail | Incoming requests and outgoing responses |
| OpenAI GPT-5 Mini | Email understanding and document request extraction |
| Google Sheets | Client authentication and audit logging |
| Google Drive | Client document repository |

---

## 11. Sample Request

Example:

From: authorised.client@example.com

Subject: Request for ITR FY 2024-25

Message:

Please send me my ITR copy for FY 2024-25.

The AI extracts:

PAN: ABCDE1234F  
Financial Year: FY 2024-25  
Document: ITR  
Document Request: TRUE

The workflow then authenticates the sender and searches the relevant Drive folder.

---

## 12. Sample Successful Response

Dear Client,

Please find the requested document attached.

Documents attached:

- ITR

This is an automatically generated email.

Regards,

GAV & Associates
Chartered Accountants

---

## 13. Important Deployment Note

The exported n8n workflow contains references to connected credentials and cloud resources. Before deploying the workflow in another n8n environment, the required Gmail, OpenAI, Google Sheets and Google Drive credentials must be connected again.

Do not publish API keys, OAuth tokens, passwords, client documents or confidential client information in the GitHub repository.

For the capstone repository, use only dummy/test data in sample files.

---

## 14. Capstone Demonstration

The demonstration should show:

1. A client email requesting a document.
2. AI extraction of PAN, financial year and document type.
3. Client authentication.
4. Google Drive folder search.
5. Document retrieval.
6. Email response with attachment.
7. Audit Log entry.
8. At least one failure/exception scenario.

---

## 15. Project Files

- `CA Secure Document Retrieval.json` – exported n8n workflow
- `README.md` – project documentation
- `architecture.png` – workflow architecture
- `prompts.txt` – AI instructions/prompts
- `sample-output.pdf` – dummy sample output
- `demo-video-link.txt` – demonstration video link

---

## 16. Disclaimer

This capstone project is a demonstration of an AI-enabled workflow. Production deployment should be subject to the firm's information-security policies, access controls, data protection requirements and professional judgment.

No real client confidential information should be included in the public GitHub repository.
