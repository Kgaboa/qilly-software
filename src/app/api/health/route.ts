import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

/**
 * Public Health Check Endpoint
 * 
 * Used for:
 * - External monitoring services (UptimeRobot, Pingdom, etc.)
 * - Load balancer health checks
 * - Status page integrations
 * - General system health validation
 */

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  const checks: any = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NEXT_PUBLIC_ENVIRONMENT || 'development',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    checks: {}
  };

  try {
    // 1. Database connectivity check
    const dbStartTime = Date.now();
    const { error: dbError, count } = await supabase
      .from('suppliers')
      .select('id', { count: 'exact', head: true });

    const dbDuration = Date.now() - dbStartTime;

    if (dbError) {
      checks.checks.database = {
        status: 'unhealthy',
        error: dbError.message,
        duration: `${dbDuration}ms`
      };
      checks.status = 'degraded';
    } else {
      checks.checks.database = {
        status: 'healthy',
        duration: `${dbDuration}ms`,
        recordCount: count || 0
      };
    }

    // 2. Supabase Auth check
    const authStartTime = Date.now();
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    const authDuration = Date.now() - authStartTime;

    checks.checks.auth = {
      status: authError ? 'degraded' : 'healthy',
      duration: `${authDuration}ms`,
      sessionActive: !!session
    };

    // 3. Environment configuration check
    const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasSupabaseKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    checks.checks.configuration = {
      status: (hasSupabaseUrl && hasSupabaseKey) ? 'healthy' : 'unhealthy',
      supabaseConfigured: hasSupabaseUrl && hasSupabaseKey
    };

    if (!hasSupabaseUrl || !hasSupabaseKey) {
      checks.status = 'unhealthy';
    }

    // Total response time
    const totalDuration = Date.now() - startTime;
    checks.responseTime = `${totalDuration}ms`;

    // Determine HTTP status code
    const statusCode = checks.status === 'healthy' ? 200 : 
                       checks.status === 'degraded' ? 200 : 503;

    return NextResponse.json(checks, { 
      status: statusCode,
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
        'X-Health-Status': checks.status,
        'X-Response-Time': `${totalDuration}ms`
      }
    });

  } catch (error) {
    const totalDuration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NEXT_PUBLIC_ENVIRONMENT || 'development',
      error: errorMessage,
      responseTime: `${totalDuration}ms`
    }, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
        'X-Health-Status': 'unhealthy'
      }
    });
  }
}
