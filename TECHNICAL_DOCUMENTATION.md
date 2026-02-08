# Technical Documentation: CRM Integrations

This document provides an overview of the CRM Form and Google Sheets integration implementation.

## 1. Architecture Overview

The integration system is built using a service-oriented architecture:
- **Models**: `crmFormModel`, `googleSheetsModel`, and `leadSyncLogModel` handle data persistence in MySQL.
- **Service**: `leadService` contains core logic for lead processing, including duplicate detection (via Email/Mobile) and source tagging.
- **Controller**: `integrationController` manages CRUD operations for configurations and triggers the sync processes.
- **Routes**: Protected routes for admin management and public routes for form submissions.

## 2. Database Schema

### `crm_forms`
- `id`: Primary Key
- `user_id`: Link to enterprise admin
- `form_name`: Display name
- `form_slug`: Unique slug for public URL
- `fields`: JSON (labels, types, validation)
- `settings`: JSON (success messages, redirects)
- `status`: Active/Inactive

### `google_sheets_configs`
- `id`: Primary Key
- `sheet_name`: Connection name
- `spreadsheet_id`: Google Spreadsheet ID
- `sheet_id`: Specific tab name (default 'Sheet1')
- `credentials_json`: Service account credentials (stored as string)
- `field_mapping`: JSON mapping CRM fields to sheet columns
- `sync_frequency`: manual/automated

### `lead_sync_logs`
- `id`: Primary Key
- `channel_type`: 'crm_form' or 'google_sheets'
- `status`: success/error
- `message`: Detailed status message
- `raw_data`: JSON of the processed payload

## 3. CRM Form Integration

### Embedding the Form
Forms can be embedded using an `iframe`:
```html
<iframe src="https://your-domain.com/public/form/your-slug" style="width:100%; height:800px; border:none;"></iframe>
```

### Lead Processing
On submission:
1. Validates form slug.
2. Checks for existing leads with same email/mobile.
3. If duplicate found, updates existing lead.
4. If new, creates a lead with `lead_source` = "crm_form".
5. Logs activity in `lead_sync_logs`.

## 4. Google Sheets Integration

### Setup Steps
1. Create a Service Account in Google Cloud Console.
2. Enable Google Sheets API.
3. Download JSON credentials.
4. Share your Google Sheet with the Service Account email.
5. In CRM, connect the sheet by providing the JSON and Spreadsheet ID.
6. Map columns (e.g., "Full Name" in sheet -> "name" in CRM).

### Sync Logic
- Fetches all rows from the specified sheet.
- Skips header row.
- Maps row data to CRM fields based on config.
- Processes each row via `leadService`.

## 5. Security & Performance
- **Authentication**: JWT-based protection for all management routes.
- **Data Validation**: Sanitization and field validation during lead creation.
- **Rate Limiting**: Integrated with existing subscription limits (`leads` count).
- **Optimization**: Uses `mysql2/promise` with connection pooling for efficient DB interactions.

## 6. Setup & Deployment Guide

### Backend Requirements
- Node.js >= 16
- MySQL
- `googleapis` npm package

### Installation
```bash
cd Backend
npm install
node scripts/create_integration_tables.js
```

### Environment Variables
Ensure `VITE_API_BASE_URL` is correctly set in the frontend `.env`.
