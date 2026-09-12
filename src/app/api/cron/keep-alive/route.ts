import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

/**
 * Keep-Alive Health Check for Supabase Database
 * 
 * This endpoint prevents Supabase free tier from pausing after 7 days of inactivity.
 * Configured to run every 6 hours via Vercel Cron (see vercel.json).
 * 
 * Security: Requires CRON_SECRET header to prevent unauthorized access.
 */

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const startTime = Date.now();
  
  try {
    // Security check: Verify cron secret
    const authHeader = request.headers.get('authorization');
    const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;
    
    if (authHeader !== expectedAuth) {
      console.error('❌ Unauthorized keep-alive attempt');
      return new Response('Unauthorized', { 
        status: 401,
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    // Perform lightweight database query to keep connection active
    const { data, error, count } = await supabase
      .from('suppliers')
      .select('id', { count: 'exact', head: false })
      .limit(1);

    if (error) {
      console.error('❌ Keep-alive database query failed:', error);
      throw error;
    }

    const duration = Date.now() - startTime;
    const environment = process.env.NEXT_PUBLIC_ENVIRONMENT || 'unknown';

    // Log success
    console.log('✅ Keep-alive successful', {
      environment,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
      recordsFound: count || 0
    });

    return NextResponse.json({ 
      success: true,
      environment,
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
      message: 'Database keep-alive successful',
      recordsChecked: count || 0
    }, {
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
        'X-Environment': environment
      }
    });

  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    console.error('❌ Keep-alive failed:', {
      error: errorMessage,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({ 
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`
    }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-store, must-revalidate'
      }
    });
  }
}

// Optional: Allow manual trigger via POST (for testing)
export async function POST(request: Request) {
  // Same logic as GET
  return GET(request);
}
