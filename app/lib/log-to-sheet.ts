// app/lib/log-to-sheet.ts
// Appends a row to the correct tab in the JP Automations Leads sheet
// using the Google Sheets API with OAuth2 credentials.

import { google } from 'googleapis';

const SHEET_ID = process.env.LEADS_SHEET_ID || '';

function getAuth() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'urn:ietf:wg:oauth:2.0:oob'
  );
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });
  return oauth2Client;
}

type SheetTab = 'Lead Magnets' | 'Discovery Calls' | 'Contact Form' | 'Newsletter';

// Column order must match the sheet headers exactly
const COLUMN_ORDER: Record<SheetTab, string[]> = {
  'Lead Magnets':    ['Timestamp', 'Name', 'Email'],
  'Discovery Calls': ['Timestamp', 'Name', 'Email', 'Phone', 'Business Name', 'Business Type', 'Revenue', 'Team Size', 'Main Challenge'],
  'Contact Form':    ['Timestamp', 'Name', 'Email', 'Message'],
  'Newsletter':      ['Timestamp', 'Email'],
};

export async function logToSheet(tab: SheetTab, row: Record<string, string>): Promise<void> {
  if (!SHEET_ID) return;

  try {
    const auth = getAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    const columns = COLUMN_ORDER[tab];
    const values = [columns.map(col => row[col] ?? '')];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `'${tab}'!A:A`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values },
    });
  } catch (err) {
    // Non-blocking — never fail a form submission because of sheet logging
    console.error('Sheet logging error:', err);
  }
}
