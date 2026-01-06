/**
 * Health Check API Route - System status monitoring
 * 
 * GET /api/health
 */

import { NextResponse } from 'next/server';
import { orchestrator } from '@/lib/ai/orchestrator';

export const dynamic = 'force-dynamic';

/**
 * GET handler for health check
 */
export async function GET() {
  try {
    const healthStatus = await orchestrator.healthCheck();

    const status = {
      status: healthStatus.healthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      services: healthStatus.services,
      environment: process.env.NODE_ENV,
    };

    return NextResponse.json(status, {
      status: healthStatus.healthy ? 200 : 503,
    });
  } catch (error) {
    console.error('[API] Health check error:', error);
    
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
