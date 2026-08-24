# BioLock Web

A Chrome extension that locks specific websites behind native device biometrics (Windows Hello, Touch ID, Face ID) using the Web Authentication API (WebAuthn). 

Built using Chrome Extension Manifest V3.

## Why this exists

Sometimes you want to leave your browser open but protect specific tabs (like WhatsApp Web, banking sites, or social media) from prying eyes. This tool:
* Blocks access to user-defined URLs instantly via a background service worker.
* Uses native OS biometrics instead of a master password.
* Auto-triggers the Windows Hello/Touch ID prompt without extra clicks.

## Architecture

```text
Browser (Chrome)
    |  Monitors tabs via Manifest V3 background.js
    ▼
Content Match
    |  Redirects to auth.html if URL is in the locked list
    ▼
WebAuthn API
    |  navigator.credentials.get() calls local OS security
    ▼
Windows Hello / Apple Touch ID
