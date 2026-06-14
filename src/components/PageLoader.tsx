import { Component, type ComponentChildren, createContext } from 'preact';
import { useContext, useEffect } from 'preact/hooks';
import { useLocation } from 'wouter-preact';

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

let injected = false; function inject() {
  if (typeof document === 'undefined' || injected) return; injected = true;

  const styles = document.createElement('style');
  styles.id = 'page-loader'; styles.textContent = `
@keyframes loader-out {
  from { opacity: 1; } to { opacity: 0; }
}
@keyframes loader-in {
  from { opacity: 0; } to { opacity: 1; }
}
@keyframes page-fade-in {
  from { opacity: 0; } to { opacity: 1; }
}
@keyframes page-fade-out {
  from { opacity: 1; } to { opacity: 0; }
}
.overlay--in {
  animation: loader-out 250ms ease-out forwards;
}
.overlay--out {
  animation: loader-in 125ms ease-out forwards;
}
.page--enter {
  animation: page-fade-in 300ms ease-out forwards;
}
.page--exit {
  animation: page-fade-out 300ms ease-out forwards;
  position: absolute; inset: 0; pointer-events: none;
}
  `.trim();

  document.head.appendChild(styles);
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
  private started = Date.now();

  override componentDidMount() { inject(); }
  override componentWillUnmount() {
    if (this.timer) clearTimeout(this.timer);
  }

  onReady = () => {
    if (!this.state.state) return;
    const elapsed = Date.now() - this.started;
    const remaining = Math.max(0, this.props.duration - elapsed);

    this.timer = setTimeout(() => {
      this.setState({ animate: true });
      this.timer = setTimeout(() => this.setState({ state: false }), 200);
    }, remaining);
  };

  render() {
    const { children, fallback } = this.props;
    const { state, animate } = this.state;

    return (<ctx.Provider value={{ ready: this.onReady }}>
      {state && ( <div class={animate ? 'overlay--in' : ''} style={{
        position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none'
      }}> {fallback} </div> )}

      {children}
    </ctx.Provider>);
  }
}

interface TransitionState {
  prev: ComponentChildren;
  current: ComponentChildren;
  transitioning: boolean;
}

class Transition extends Component<
  { children: ComponentChildren },
  TransitionState
> {
  override state: TransitionState = {
    prev: null,
    current: this.props.children,
    transitioning: false,
  };

  private timer: ReturnType<typeof setTimeout> | null = null;

  override componentDidUpdate(previous: { children: ComponentChildren }) {
    if (previous.children === this.props.children) return;

    if (this.timer) clearTimeout(this.timer);

    this.setState({
      prev: this.state.current,
      current: this.props.children,
      transitioning: true,
    });

    this.timer = setTimeout(() => {
      this.setState({ prev: null, transitioning: false });
    }, 350);
  }

  override componentWillUnmount() {
    if (this.timer) clearTimeout(this.timer);
  }

  render() {
    const { prev, current, transitioning } = this.state;

    return (
      <div style={{ position: 'relative' }}>
        {prev && transitioning && (
          <div class="page--exit">{prev}</div>
        )}
        <div class={transitioning ? 'page--enter' : ''}>{current}</div>
      </div>
    );
  }
}

function Wrap({ children }: { children: ComponentChildren }) {
  const [location] = useLocation();
  return <Transition key={location}>{children}</Transition>;
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
      <Wrap>{children}</Wrap>
    </Overlay>
  );
}
