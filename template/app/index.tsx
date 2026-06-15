/**
 * omniui — Lightweight UI Framework
 * Built with Preact & UnoCSS | @omnidev
 */

import 'virtual:uno.css';
import { pages, layouts } from 'virtual:routes';

import { render } from "preact";
import { Suspense, lazy, useLayoutEffect } from "preact/compat";
import { Router, Route, Switch, useLocation } from 'wouter-preact';

import FallbackPage from "./_static/Fallback";
import Fault from './_static/Fault';

import { ErrorBoundary, PageLoader, PageLoaderSignal } from "@omnixui/omniui";
import { AlertProvider } from "@/components/AlertContext";

function AlwaysOnTop() {
  const [pathName] = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathName]);

  return null;
}

// Layouts

function getLayoutChain(pathname: string): string[] {
  const chains: string[] = [];
  const parts = pathname.split('/').filter(Boolean);

  let current = '';
  for (const part of parts) {
    current += '/' + part;
    if (layouts[current]) {
      chains.push(current);
    }
  }

  return chains;
}

const layoutCache = new Map<string, any>();

function getLayoutComponent(path: string) {
  if (!layoutCache.has(path))
    layoutCache.set(path, lazy(layouts[path]!));
  return layoutCache.get(path);
}

function LayoutRenderer({ children }: { children: any }) {
  const [location] = useLocation();
  const layoutChain = getLayoutChain(location);

  let content = children;

  for (let i = layoutChain.length - 1; i >= 0; i--) {
    const LayoutComponent = getLayoutComponent(layoutChain[i]!);
    content = <LayoutComponent>{content}</LayoutComponent>;
  }

  return content;
}

// Router

render(
  <ErrorBoundary fallback={(error, dismiss) =>
    <Fault error={error} dismiss={dismiss} />
  }><Router><AlwaysOnTop />
    <PageLoader fallback={<FallbackPage />}>
      <Suspense fallback={null}><PageLoaderSignal />
        <AlertProvider>
          <LayoutRenderer><Switch>
            {Object.entries(pages).map(([path, loader]) => {
              return <Route key={path} path={path} component={
                lazy(loader)
              } />;
            })}
            <Route component={lazy(
              () => import("./_static/404")
            )} />
          </Switch></LayoutRenderer>
        </AlertProvider>
      </Suspense>
    </PageLoader>
  </Router></ErrorBoundary>,
  document.getElementById("root")!
);

if (import.meta.hot)
  import.meta.hot.accept();