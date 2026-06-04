import { useEffect, type RefObject } from "react";

/**
 * Carrega o runtime self-hosted do UnicornStudio (v1.4.33, em /unicorn/) uma
 * única vez e inicializa a cena "Superintelligence II" (export JSON do
 * lambda.ai capturado via DevTools) dentro do elemento fornecido.
 *
 * Reproduz o background animado WebGL real (gradient > wisps > vignette >
 * chromab > voronoi > bloom > projection) em vez de uma imagem estática.
 *
 * Respeita prefers-reduced-motion: reduce — nesse caso a cena não é montada.
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

// Promise singleton para garantir que o UMD seja injetado uma só vez.
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

    // Não montar a cena WebGL quando o usuário pede movimento reduzido.
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
          // Componente desmontou antes da cena resolver — destruir imediatamente.
          const list = Array.isArray(result) ? result : [result];
          list.forEach((s) => s?.destroy?.());
          return;
        }
        scenes = Array.isArray(result) ? result : [result];
      })
      .catch((error) => {
        // Fallback silencioso: se o runtime/cena falhar (ex.: offline, sem WebGL2),
        // o Hero permanece com o fundo preto da seção. Não quebra a página.
        console.warn("UnicornStudio background not initialised:", error);
      });

    return () => {
      cancelled = true;
      scenes.forEach((s) => s?.destroy?.());
      scenes = [];
    };
  }, [targetRef]);
}
