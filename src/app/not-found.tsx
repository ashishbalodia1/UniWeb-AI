/**
 * 404 Not Found Page
 */

import Link from 'next/link';
import { Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-200">
            <Search className="h-8 w-8 text-neutral-600" />
          </div>
        </div>

        <h1 className="mb-2 text-6xl font-bold text-neutral-900">404</h1>
        <h2 className="mb-4 text-2xl font-semibold text-neutral-900">
          Page Not Found
        </h2>
        <p className="mb-8 text-neutral-600">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <Link
          href="/"
          className="inline-block rounded-lg bg-primary-600 px-6 py-3 font-medium text-white transition-colors hover:bg-primary-700"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
