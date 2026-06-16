import { Component, type ComponentChildren, createContext } from 'preact';
import { useContext, useEffect } from 'preact/hooks';

interface Context { ready: () => void }
const ctx = createContext<Context>({ ready: () => {} });

export function usePageLoader() {
  return useContext(ctx).ready;
}

export function PageLoaderSignal() {
  const ready = useContext(ctx).ready;
  useEffect(() => { ready(); }, []);
  return null;
}

interface OverlayProps {
  children: ComponentChildren;
  fallback: ComponentChildren;
  duration: number;
}

interface OverlayState {
  state: boolean;
  animate: boolean;
}

class Overlay extends Component<OverlayProps, OverlayState> {
  override state: OverlayState = { state: true, animate: false };
  private timer: ReturnType<typeof setTimeout> | null = null;
  private monitor = Date.now();

  override componentWillUnmount() {
    if (this.timer) clearTimeout(this.timer);
  }

  onReady = () => {
    if (!this.state.state) return;
    const elapsed = Date.now() - this.monitor;
    const remaining = Math.max(0, this.props.duration - elapsed);

    this.timer = setTimeout(() => {
      this.setState({ animate: true });
      this.timer = setTimeout(() => this.setState({ state: false }), 500);
    }, remaining);
  };

  render() {
    const { children, fallback } = this.props;
    const { state, animate } = this.state;

    return (
      <ctx.Provider value={{ ready: this.onReady }}>
        {state && ( <div class={
          "fixed inset-0 z-[9999] pointer-events-none transition-opacity duration-500 ease-in-out "
          + (animate ? 'opacity-0' : 'opacity-100')
        }>{fallback}</div> )}

        {children}
      </ctx.Provider>
    );
  }
}


export function PageLoader({
  children, fallback,
  duration = 1000,
}: {
  children: ComponentChildren;
  fallback?: ComponentChildren;
  duration?: number;
}) {
  return (
    <Overlay fallback={fallback} duration={duration}>
      {children}
    </Overlay>
  );
}
