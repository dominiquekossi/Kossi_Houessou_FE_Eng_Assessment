import { useEffect, type RefObject } from "react";

/**
 * Loads the self-hosted UnicornStudio runtime (v1.4.33, at /unicorn/) once
 * and initialises the "Superintelligence II" scene (export JSON from
 * lambda.ai captured via DevTools) inside the provided element.
 *
 * Reproduces the real animated WebGL background (gradient > wisps > vignette >
 * chromab > voronoi > bloom > projection) instead of a static image.
 *
 * Respects prefers-reduced-motion: reduce — in that case the scene is not mounted.
 */

const RUNTIME_SRC = "/unicorn/unicornStudio.umd.js";
const SCENE_FILE = "/unicorn/superintelligence-II-1.json";

type UnicornScene = { destroy?: () => void };

type UnicornStudioApi = {
  addScene: (config: {
    element: HTMLElement;
    filePath: string;
    fps?: number;
    dpi?: number;
    scale?: number;
    lazyLoad?: boolean;
    fixed?: boolean;
    production?: boolean;
    altText?: string;
    ariaLabel?: string;
  }) => Promise<UnicornScene | UnicornScene[]>;
  destroy?: () => void;
};

declare global {
  interface Window {
    UnicornStudio?: UnicornStudioApi;
  }
}

// Promise singleton to ensure the UMD is injected only once.
let runtimePromise: Promise<UnicornStudioApi> | null = null;

function loadRuntime(): Promise<UnicornStudioApi> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("UnicornStudio requires a browser environment"));
  }
  if (window.UnicornStudio) {
    return Promise.resolve(window.UnicornStudio);
  }
  if (runtimePromise) {
    return runtimePromise;
  }

  runtimePromise = new Promise<UnicornStudioApi>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${RUNTIME_SRC}"]`,
    );
    const onReady = () => {
      if (window.UnicornStudio) resolve(window.UnicornStudio);
      else reject(new Error("UnicornStudio runtime loaded but global is missing"));
    };

    if (existing) {
      existing.addEventListener("load", onReady, { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load UnicornStudio runtime")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = RUNTIME_SRC;
    script.async = true;
    script.addEventListener("load", onReady, { once: true });
    script.addEventListener("error", () => reject(new Error("Failed to load UnicornStudio runtime")), { once: true });
    document.head.appendChild(script);
  });

  return runtimePromise;
}

export function useUnicornStudio(targetRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const element = targetRef.current;
    if (!element) return;

    // Do not mount the WebGL scene when the user requests reduced motion.
    const prefersReducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    let cancelled = false;
    let scenes: UnicornScene[] = [];

    loadRuntime()
      .then((studio) =>
        studio.addScene({
          element,
          filePath: SCENE_FILE,
          fps: 60,
          dpi: 1.5,
          scale: 1,
          lazyLoad: false,
        }),
      )
      .then((result) => {
        if (cancelled) {
          // Component unmounted before the scene resolved — destroy immediately.
          const list = Array.isArray(result) ? result : [result];
          list.forEach((s) => s?.destroy?.());
          return;
        }
        scenes = Array.isArray(result) ? result : [result];
      })
      .catch((error) => {
        // Silent fallback: if the runtime/scene fails (e.g.: offline, no WebGL2),
        // the Hero keeps the section's black background. Does not break the page.
        console.warn("UnicornStudio background not initialised:", error);
      });

    return () => {
      cancelled = true;
      scenes.forEach((s) => s?.destroy?.());
      scenes = [];
    };
  }, [targetRef]);
}
