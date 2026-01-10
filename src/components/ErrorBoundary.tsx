import React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  errorMessage?: string;
  errorStack?: string;
  componentStack?: string;
};

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
    this.handleReload = this.handleReload.bind(this);
  }

  static getDerivedStateFromError(error: any): State {
    return {
      hasError: true,
      errorMessage: error?.message ? String(error.message) : String(error),
      errorStack: error?.stack ? String(error.stack) : undefined,
      componentStack: undefined,
    };
  }

  componentDidCatch(error: any, info: any) {
    const componentStack = info?.componentStack ? String(info.componentStack) : undefined;

    // Log the full details to console too
    // (helps if you copy/paste from DevTools)
    // eslint-disable-next-line no-console
    console.error("App crashed:", error);
    // eslint-disable-next-line no-console
    console.error("Component stack:", componentStack);

    this.setState({
      componentStack,
      errorStack: error?.stack ? String(error.stack) : this.state.errorStack,
    });
  }

  handleReload() {
    window.location.reload();
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
        <div className="w-full max-w-3xl rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div className="flex-1">
              <div className="text-xl font-semibold">Faith Finder couldn’t load</div>
              <div className="mt-2 text-sm text-muted-foreground">
                Something went wrong while the app was starting. Below are the technical details
                that will tell us exactly what needs fixed.
              </div>

              <div className="mt-4 rounded-xl border bg-muted/30 p-4">
                <div className="text-sm font-semibold">Error</div>
                <div className="mt-1 text-sm break-words">
                  {this.state.errorMessage || "Unknown error"}
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {this.state.errorStack ? (
                  <details className="rounded-xl border bg-muted/20 p-4">
                    <summary className="cursor-pointer text-sm font-semibold">
                      Show error stack
                    </summary>
                    <pre className="mt-3 whitespace-pre-wrap text-xs leading-relaxed">
                      {this.state.errorStack}
                    </pre>
                  </details>
                ) : null}

                {this.state.componentStack ? (
                  <details className="rounded-xl border bg-muted/20 p-4">
                    <summary className="cursor-pointer text-sm font-semibold">
                      Show component stack
                    </summary>
                    <pre className="mt-3 whitespace-pre-wrap text-xs leading-relaxed">
                      {this.state.componentStack}
                    </pre>
                  </details>
                ) : null}
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  onClick={this.handleReload}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reload
                </button>

                <div className="text-xs text-muted-foreground">
                  Tip: If you share the stack above, we can fix this in one shot.
                </div>
              </div>

              <div className="mt-6 text-xs text-muted-foreground">
                (The environment variable hint you saw earlier can be misleading — this page is now
                showing the real cause.)
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
