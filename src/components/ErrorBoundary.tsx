/**
 * Error Boundary Component
 * Catches React errors and provides fallback UI
 * Essential for production stability
 */

'use client';

import React, { Component, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Log to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to Sentry or similar
      console.error('Production error:', {
        error: error.toString(),
        componentStack: errorInfo.componentStack,
      });
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

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
                Something went wrong
              </h2>
              <p className="mb-6 text-center text-neutral-600">
                We encountered an unexpected error. Don&apos;t worry, your data is safe.
              </p>

              {/* Error Details (Development only) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mb-6 rounded-lg bg-neutral-100 p-4">
                  <p className="mb-2 text-xs font-semibold text-neutral-700">
                    Error Details:
                  </p>
                  <p className="text-xs text-neutral-600">
                    {this.state.error.toString()}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={this.handleReset}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 py-3 font-medium text-white transition-colors hover:bg-primary-700"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-neutral-300 px-4 py-3 font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
                >
                  Reload Page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
