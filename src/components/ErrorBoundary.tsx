import React from "react";

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  message?: string;
};

/**
 * Prevents a blank screen if something throws during initial render.
 * Shows a simple message in production instead.
 */
export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: unknown): State {
    const message = error instanceof Error ? error.message : String(error);
    return { hasError: true, message };
  }

  componentDidCatch(error: unknown, info: unknown) {
    // Keep the console log so it can be copied from DevTools if needed.
    // eslint-disable-next-line no-console
    console.error("App crashed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif" }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Faith Finder couldn’t load</h1>
          <p style={{ marginBottom: 12, maxWidth: 720 }}>
            Something went wrong while the app was starting. This is usually caused by a missing
            environment variable or a browser storage/privacy setting.
          </p>
          <div style={{ background: "#f4f4f5", borderRadius: 12, padding: 12, maxWidth: 920, overflow: "auto" }}>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Error</div>
            <pre style={{ fontSize: 12, whiteSpace: "pre-wrap" }}>{this.state.message}</pre>
          </div>
          <p style={{ marginTop: 12, fontSize: 12, opacity: 0.8 }}>
            Tip: Check Vercel Environment Variables for <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_PUBLISHABLE_KEY</code>.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
