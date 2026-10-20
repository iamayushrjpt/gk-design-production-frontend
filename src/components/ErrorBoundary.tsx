import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Without this, any uncaught error during render — anywhere in the app —
 * unmounts the ENTIRE React tree, including the navbar and footer, leaving
 * a totally blank page with no visible clue what happened. This happened
 * for real with a useSyncExternalStore bug on the Wishlist page. This
 * boundary contains that failure to a visible, recoverable error screen
 * instead, and logs the actual error to the console for debugging.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary] Uncaught render error:", error, info.componentStack);
  }

  handleReload = () => {
    this.setState({ error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-ivory px-4">
          <div className="max-w-md text-center flex flex-col items-center gap-4">
            <span className="font-display text-2xl text-ink">Something went wrong on this page</span>
            <p className="text-sm text-stone">
              This is a bug, not something you did. The error's been logged to the browser console
              for debugging — reloading usually gets you back to a working page.
            </p>
            <button
              onClick={this.handleReload}
              className="px-6 py-3 bg-ink text-ivory text-sm font-medium uppercase tracking-wide rounded-gk-sm hover:bg-gold-deep hover:text-ink transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
