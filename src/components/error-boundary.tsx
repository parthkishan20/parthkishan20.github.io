import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center space-y-4 max-w-md">
            <AlertTriangle className="h-16 w-16 text-destructive mx-auto" />
            <h1 className="text-2xl font-bold">Oops! Something went wrong</h1>
            <p className="text-muted-foreground">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              Refresh Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
