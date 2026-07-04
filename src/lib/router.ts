import { useEffect, useState } from "react";

// A deliberately tiny hash router: "#/match/r16-bra-mar" -> ["match",
// "r16-bra-mar"]. Every screen is deep-linkable, back() is the browser's.

export type Route = string[];

export function parseHash(hash: string): Route {
  return hash.replace(/^#\/?/, "").split("/").filter(Boolean);
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() =>
    parseHash(window.location.hash),
  );
  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}

export function navigate(path: string): void {
  window.location.hash = path.startsWith("/") ? `#${path}` : `#/${path}`;
}

export function back(): void {
  if (window.history.length > 1) window.history.back();
  else navigate("/");
}
