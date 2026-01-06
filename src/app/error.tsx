/**
 * Global Error Page
 * Catches Next.js errors at the app level
 */

'use client';

import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Global Error]:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          {/* Error Icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>

          {/* Error Message */}
          <h2 className="mb-2 text-center text-2xl font-bold text-neutral-900">
            Application Error
          </h2>
          <p className="mb-6 text-center text-neutral-600">
            We encountered an unexpected error. Please try again.
          </p>

          {/* Error Details (Development only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-6 rounded-lg bg-neutral-100 p-4">
              <p className="mb-2 text-xs font-semibold text-neutral-700">
                Error Details:
              </p>
              <p className="text-xs text-neutral-600">{error.message}</p>
              {error.digest && (
                <p className="mt-2 text-xs text-neutral-500">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={reset}
              className="flex-1 rounded-lg bg-primary-600 px-4 py-3 font-medium text-white transition-colors hover:bg-primary-700"
            >
              Try Again
            </button>
            <button
              onClick={() => (window.location.href = '/')}
              className="flex-1 rounded-lg border border-neutral-300 px-4 py-3 font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
