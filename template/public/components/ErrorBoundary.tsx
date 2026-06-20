import { Component, type ComponentChildren, type VNode } from 'preact';

export interface ErrorBoundaryProps {
  children: ComponentChildren;
  fallback?: ComponentChildren | ((error: Error, dismiss: () => void) => ComponentChildren);
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  override state: State = { error: null };

  static override getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error, errorInfo: any) {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  dismiss = () => {
    this.setState({ error: null });
  };

  override render() {
    if (this.state.error) {
      if (this.props.fallback) {
        if (typeof this.props.fallback === 'function') {
          return this.props.fallback(this.state.error, this.dismiss);
        }
        return this.props.fallback;
      }
      return null;
    }
    return this.props.children;
  }
}
