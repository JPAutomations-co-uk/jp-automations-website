// app/api/submit-booking/route.ts

import { NextRequest, NextResponse } from 'next/server';

// CONFIGURATION - Update these with your actual details
const CONFIG = {
  yourEmail: 'jp@jpautomations.co.uk',
  yourName: 'JP Automations Team',
  calendarBookingLink: 'https://calendar.app.google/2NWF3zHLBq8c24Rr8', // Google Calendar booking link
  companyName: 'JP Automations',
  googleScriptWebhookUrl: 'https://script.google.com/macros/s/AKfycbx124wjK0-dZqSfC3R3I5NJ-RAchQueQJBkOWjmhCdOfoTaHMRZS1AxOxbX74hvdn68dg/exec', // We'll create this
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    
    // Validate required fields
    const { name, email, phone, businessName, businessType, revenue, bottleneck, teamSize } = formData;
    
    if (!name || !email || !businessName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send data to Google Apps Script for processing
    // This will handle: emails, follow-ups, tracking
    await fetch(CONFIG.googleScriptWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        phone: phone || 'Not provided',
        businessName,
        businessType,
        revenue,
        bottleneck,
        teamSize,
        timestamp: new Date().toISOString(),
      }),
    });

    return NextResponse.json({ 
      success: true,
      message: 'Form submitted successfully' 
    });

  } catch (error) {
    console.error('Error processing form submission:', error);
    
    return NextResponse.json(
      { error: 'Failed to process submission' },
      { status: 500 }
    );
  }
}