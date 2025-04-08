import { NextRequest, NextResponse } from 'next/server';

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:50052';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, data } = body;
    
    console.log(`Auth API: Processing ${action} request with data:`, data);

    const url = `${AUTH_SERVICE_URL}/v1/auth/${action}`;
    console.log(`Auth API: Sending request to ${url}`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    // Get the response text first
    const responseText = await response.text();
    console.log(`Auth API: Received response with status ${response.status}:`, responseText);
    
    // Try to parse it as JSON
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', responseText);
      throw new Error(`Invalid response from auth service: ${responseText.substring(0, 100)}...`);
    }

    // Check if the response indicates an error
    if (!response.ok || result.error) {
      console.error('Auth API: Error response:', result);
      // Pass through the specific error details from the backend
      return NextResponse.json(
        { 
          error: result.error || 'Authentication failed',
          details: result.details || result.error || 'Authentication failed'
        },
        { status: response.status }
      );
    }

    console.log('Auth API: Success response:', result);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Auth service error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Authentication failed' },
      { status: 500 }
    );
  }
} 