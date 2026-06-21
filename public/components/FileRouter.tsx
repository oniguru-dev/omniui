/**
 * omniui — Lightweight UI Framework
 * Built with Preact & UnoCSS | @omnidev
 */

import { lazy } from "preact/compat";
import { Route } from "wouter-preact";

function getRoute(file: string) {
  let route = file.replace(/^\.?\/?app/, "")
    .replace(/\/page\.(tsx|jsx|ts|js)$/, "");

  route = route
    .replace(/\[\.\.\.(.+?)\]/g, "*")
    .replace(/\[(.+?)\]/g, ":$1");
  if (!route) route = "/";

  return route;
}

const pages = (import.meta as any)
  .glob("/app/**/page.{tsx,jsx,ts,js}");

export function FileRouter() {
  return Object.entries(pages).map(([file, loader]) => {
    const Component = lazy(loader as any); const path = getRoute(file);
    return <Route key={file} path={path} component={Component as any} />;
  });
}