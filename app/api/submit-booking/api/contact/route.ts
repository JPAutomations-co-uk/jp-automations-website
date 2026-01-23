// app/api/contact/route.ts

import { NextRequest, NextResponse } from 'next/server';

// IMPORTANT: Replace this with your actual Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx124wjK0-dZqSfC3R3I5NJ-RAchQueQJBkOWjmhCdOfoTaHMRZS1AxOxbX74hvdn68dg/exec'
export async function POST(request: NextRequest) {
  try {
    // Get the form data from the request
    const { name, email, message, timestamp } = await request.json();
    
    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send to Google Apps Script
    // The ?type=contact tells the script this is a contact form submission
    const response = await fetch(GOOGLE_SCRIPT_URL + '?type=contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        message,
        timestamp: timestamp || new Date().toISOString()
      }),
    });

    // Check if Google Apps Script processed it successfully
    if (!response.ok) {
      throw new Error('Failed to send to Google Apps Script');
    }

    // Return success to the frontend
    return NextResponse.json({ 
      success: true,
      message: 'Contact form submitted successfully' 
    });

  } catch (error) {
    console.error('Error processing contact form:', error);
    
    return NextResponse.json(
      { error: 'Failed to process submission' },
      { status: 500 }
    );
  }
}