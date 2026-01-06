/**
 * Global Loading State
 * Shown during page transitions and initial load
 */

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50">
      <div className="text-center">
        {/* Loading Spinner */}
        <div className="mb-6 flex justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-neutral-200 border-t-primary-600" />
        </div>

        {/* Loading Text */}
        <h2 className="mb-2 text-xl font-semibold text-neutral-900">
          Loading UniWeb AI
        </h2>
        <p className="text-neutral-600">Preparing your AI workspace...</p>
      </div>
    </div>
  );
}
