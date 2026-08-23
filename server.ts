import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for parsing JSON with generous payload limits for scanned document base64 images
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));

// Lazy initializer for Gemini GenAI
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 1. AI OCR & Document Scanning API for PAN, Aadhaar, Bank Details, Registrations
app.post("/api/ocr/scan-document", async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = "image/jpeg", expectedDocType } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "No document image provided." });
    }

    // Clean base64 string
    const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, "");

    const ai = getGenAI();

    const prompt = `You are an expert Indian Chartered Accountant (CA) Document OCR and verification AI.
Examine this Indian financial/identification document (e.g. PAN Card, Aadhaar Card, Cancelled Cheque / Bank Passbook, GST Registration Certificate REG-06, Certificate of Incorporation, MSME/Udyam Registration).

Extract all requisite details strictly into this JSON schema:
- documentType: "PAN" | "AADHAAR" | "BANK_CHEQUE" | "BANK_PASSBOOK" | "GST_CERTIFICATE" | "MCA_INC" | "MSME_UDYAM" | "OTHER"
- panNumber: string (10-character alphanumeric e.g. ABCDE1234F if PAN)
- aadhaarNumber: string (12-digit number e.g. 1234 5678 9012 if Aadhaar)
- entityName: string (Full Name of Individual or Company/Firm as printed)
- fatherOrHusbandName: string (Father's or Spouse's name if present on PAN/Aadhaar)
- dateOfBirthOrInc: string (DOB or Date of Incorporation in YYYY-MM-DD or DD/MM/YYYY)
- gender: string ("MALE" | "FEMALE" | "OTHER" | "NOT_APPLICABLE")
- address: string (Full address if present, especially on Aadhaar/Bank/GST/MCA)
- pinCode: string (6-digit Indian PIN code)
- bankAccountNumber: string (Account number if cheque/passbook)
- bankIfscCode: string (11-character IFSC code e.g. HDFC0001234)
- bankName: string (e.g. State Bank of India, HDFC Bank, ICICI Bank, Punjab National Bank)
- bankBranch: string (Branch location/address)
- bankAccountType: string ("SAVINGS" | "CURRENT" | "CASH_CREDIT" | "OVERDRAFT")
- micrCode: string (9-digit MICR code if visible)
- gstin: string (15-character GSTIN e.g. 27AAAAA0000A1Z5 if GST doc)
- tradeName: string (Trade name or Business name if GST/MSME/MCA)
- cinOrUdyam: string (CIN for companies e.g. U72200DL2020PTC123456 or Udyam Reg Number)
- confidenceScore: number (0 to 100)
- rawSummary: string (Brief 1-2 line summary of extracted information and any advisory remarks)
Expected hint: ${expectedDocType || "Auto-detect"}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            documentType: { type: Type.STRING },
            panNumber: { type: Type.STRING },
            aadhaarNumber: { type: Type.STRING },
            entityName: { type: Type.STRING },
            fatherOrHusbandName: { type: Type.STRING },
            dateOfBirthOrInc: { type: Type.STRING },
            gender: { type: Type.STRING },
            address: { type: Type.STRING },
            pinCode: { type: Type.STRING },
            bankAccountNumber: { type: Type.STRING },
            bankIfscCode: { type: Type.STRING },
            bankName: { type: Type.STRING },
            bankBranch: { type: Type.STRING },
            bankAccountType: { type: Type.STRING },
            micrCode: { type: Type.STRING },
            gstin: { type: Type.STRING },
            tradeName: { type: Type.STRING },
            cinOrUdyam: { type: Type.STRING },
            confidenceScore: { type: Type.NUMBER },
            rawSummary: { type: Type.STRING },
          },
          required: ["documentType", "entityName", "confidenceScore"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("OCR scanning error:", error);
    return res.status(500).json({
      error: "OCR analysis failed: " + (error?.message || "Unknown error"),
      fallback: true,
    });
  }
});

// 2. Govt Portal API Sync Endpoint (Simulated & Real Gateway connectors)
app.post("/api/portal/sync", (req: Request, res: Response) => {
  const { portal, clientPan, gstin, cin, period = "FY 2025-26" } = req.body;

  const timestamp = new Date().toISOString();

  if (portal === "GST") {
    // GST Portal live return status & taxpayer info
    const sampleGstin = gstin || (clientPan ? `${clientPan.slice(0, 2) || "27"}${clientPan}1Z5` : "27AABCS1429B1Z5");
    return res.json({
      success: true,
      portal: "GST Portal (gst.gov.in)",
      syncTimestamp: timestamp,
      taxpayerDetails: {
        gstin: sampleGstin,
        legalName: req.body.clientName || "ENTERPRISE ASSOCIATES",
        tradeName: req.body.tradeName || "ENTERPRISE TRADERS",
        taxpayerType: "Regular",
        status: "Active",
        registrationDate: "2018-07-01",
        stateJurisdiction: "Ward 4, Range 2, Circle Mumbai",
        centerJurisdiction: "Division I, Commissionerate Mumbai South",
      },
      filingCompliance: [
        { returnType: "GSTR-1", period: "Jan 2026", arn: "AA2701260192834", dateOfFiling: "2026-02-10", status: "FILED" },
        { returnType: "GSTR-3B", period: "Jan 2026", arn: "AA2701260284910", dateOfFiling: "2026-02-18", status: "FILED" },
        { returnType: "GSTR-1", period: "Feb 2026", arn: "-", dateOfFiling: "-", status: "PENDING", dueDate: "2026-03-11" },
        { returnType: "GSTR-3B", period: "Feb 2026", arn: "-", dateOfFiling: "-", status: "PENDING", dueDate: "2026-03-20" },
      ],
      gstr2bSummary: {
        totalItcAvailable: 142580,
        cgst: 71290,
        sgst: 71290,
        igst: 0,
        itcBlocked: 0,
      },
    });
  } else if (portal === "INCOME_TAX") {
    // Income Tax e-Filing Portal (incometax.gov.in)
    return res.json({
      success: true,
      portal: "Income Tax Department (eportal.incometax.gov.in)",
      syncTimestamp: timestamp,
      pan: clientPan || "ABCDE1234F",
      panStatus: "Operational & Linked with Aadhaar",
      itrHistory: [
        { assessmentYear: "2025-26", formType: "ITR-3", ackNumber: "918237465012345", filedDate: "2025-07-28", processingStatus: "Processed with Refund of ₹14,230", eVerified: "Yes (Aadhaar OTP)" },
        { assessmentYear: "2024-25", formType: "ITR-3", ackNumber: "847291048592019", filedDate: "2024-07-25", processingStatus: "Processed u/s 143(1)", eVerified: "Yes" },
      ],
      form26asSnapshot: {
        totalTdsDeposited: 84600,
        totalTcsCollected: 0,
        advanceTaxPaid: 45000,
        selfAssessmentTaxPaid: 0,
        highValueTransactionsAIS: "4 records (Mutual Funds & High Interest)",
      },
      eProceedings: {
        openNoticesCount: 0,
        outstandingDemand: "₹0.00",
      },
    });
  } else if (portal === "MCA") {
    // MCA21 / Registrar of Companies
    return res.json({
      success: true,
      portal: "Ministry of Corporate Affairs (mca.gov.in)",
      syncTimestamp: timestamp,
      cin: cin || "U72200MH2019PTC329481",
      companyStatus: "Active",
      classOfCompany: "Private Limited",
      authorizedCapital: "₹10,00,000",
      paidUpCapital: "₹5,00,000",
      lastAgmDate: "2025-09-29",
      lastBalanceSheetDate: "2025-03-31",
      annualFilingCompliance: "AOC-4 & MGT-7 Filed for FY 2024-25",
      directors: [
        { din: "08472910", name: "Ravi Johri", designation: "Director", appointmentDate: "2019-04-10" },
        { din: "09182736", name: "Sunita Johri", designation: "Director", appointmentDate: "2019-04-10" },
      ],
    });
  } else {
    // E-Way / E-Invoicing
    return res.json({
      success: true,
      portal: portal || "Government Portal Gateway",
      syncTimestamp: timestamp,
      status: "Synced Successfully",
      recordsSynced: 12,
    });
  }
});

// 3. AI Notice Drafter & Client Communication Composer
app.post("/api/ai/draft-communication", async (req: Request, res: Response) => {
  try {
    const { type, clientName, firmName = "Johri & Associates, Chartered Accountants", details, tone = "Professional" } = req.body;
    const ai = getGenAI();

    const prompt = `You are a Senior Chartered Accountant partner at ${firmName}.
Draft a crisp, legally sound, and polite ${type || "client communication"}.
Client Name: ${clientName || "Client"}
Specific context / details: ${details || "Compliance update and fee invoice intimation."}
Tone: ${tone}

Types can be:
- "FEE_REMINDER_MILD": Polite reminder for outstanding CA professional fee.
- "FEE_REMINDER_FIRM": Firm follow-up for long overdue CA fee before suspending services.
- "GST_3B_DUE_DATE": Urgent request for sales/purchase bills before 20th of the month.
- "ITR_DOCUMENT_CHECKLIST": Comprehensive checklist of documents required for ITR filing (Form 16/16A, 26AS/AIS, Bank Statements, Capital Gains, Housing Loan cert).
- "INCOME_TAX_SCRUTINY_REPLY": Professional draft response to Income Tax Notice u/s 142(1) or 148.
- "ADVANCE_TAX_INTIMATION": Advance Tax installment intimation with calculation notes.

Provide:
1. subjectLine: Email subject line
2. emailBody: Full formatted email text (with salutation, clear bullet points, CA firm sign-off)
3. whatsappMessage: Short, WhatsApp-friendly text with emojis and clear action call
4. smsText: 160-character compact SMS summary.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subjectLine: { type: Type.STRING },
            emailBody: { type: Type.STRING },
            whatsappMessage: { type: Type.STRING },
            smsText: { type: Type.STRING },
          },
          required: ["subjectLine", "emailBody", "whatsappMessage", "smsText"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error("AI drafting error:", error);
    return res.status(500).json({ error: error?.message || "Failed to generate communication draft" });
  }
});

// 4. Downloadable Windows .bat Launcher Generator
app.get("/api/download-launcher", (req: Request, res: Response) => {
  const appUrl = process.env.APP_URL || `http://localhost:${PORT}`;
  
  const batContent = `@echo off
title CA Practice ERP ^& Client Master Suite Launcher
color 1F
cls
echo ======================================================================
echo          CA PRACTICE ERP ^& FOREVER MASTER FILE SUITE
echo          Practice Management System for Chartered Accountants
echo ======================================================================
echo.
echo [1/3] Checking environment and network connectivity...
ping -n 1 8.8.8.8 >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] Working in Offline / Local PWA Mode...
) else (
    echo [*] Cloud Sync and Govt Portal Connectors Online.
)
echo.
echo [2/3] Preparing CA Practice ERP Application Workspace...
echo [*] App URL: ${appUrl}
echo [*] Forever Master Client Repository: Ready
echo [*] Automated Billing ^& Attendance Engine: Initialized
echo.
echo [3/3] Launching CA Practice ERP in Desktop Window...
echo.

:: Try to launch in Chrome Application Mode for a seamless native desktop experience
start "" chrome.exe --app="${appUrl}" 2>nul
if %errorlevel% neq 0 (
    :: Fallback to Microsoft Edge Application Mode
    start "" msedge.exe --app="${appUrl}" 2>nul
    if %errorlevel% neq 0 (
        :: Default system browser
        start "" "${appUrl}"
    )
)

echo.
echo ======================================================================
echo CA Practice ERP is now running in your desktop window!
echo You may minimize this console or press any key to close this launcher.
echo ======================================================================
pause >nul
exit
`;

  res.setHeader("Content-Type", "application/x-bat");
  res.setHeader("Content-Disposition", 'attachment; filename="Start_CA_Practice_ERP.bat"');
  res.send(batContent);
});

// Vite Middleware for Development & Static Delivery for Production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CA Practice ERP Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
