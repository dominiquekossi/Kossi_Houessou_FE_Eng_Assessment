import { useEffect, useState } from "react";
import "./Hero.css";

/**
 * FontSwapTitle — animated title "The Superintelligence Cloud".
 *
 * Reproduces the font-swap animation from lambda.ai. Only 3 letters
 * participate: "u" in S[u]per · "e" at the end of intelligenc[e] · "o" in Cl[o]ud.
 * All other letters always remain in the main font.
 *
 * Naming (mapped to CSS variants):
 *   "pixel"              -> highlight (pixel font + highlight box)
 *   "pixel-no-highlight" -> pixel     (pixel font, no box)
 *   "normal"             -> null      (main font)
 *
 * PHASE 1 — INTRO (runs only once on load):
 *   All three letters start together in "pixel" (~2s). Then U runs its cycle
 *   (pixel → pixel-no-highlight → normal) while E and O remain in pixel;
 *   then E runs its cycle (U already normal, O still pixel); finally O runs
 *   its cycle (U and E normal). At the end, all three are normal.
 *
 * PHASE 2 — CONTINUOUS LOOP (infinite):
 *   Order U → E → O. Each letter: pixel (1s) → pixel-no-highlight (1s) →
 *   normal (1s), with the other two in normal. All three NEVER again appear
 *   simultaneously in pixel (that only happens in the intro).
 *
 * No layout shift: see the overlay technique in Hero.css.
 * Respects prefers-reduced-motion (no animation — stays in the main font; and
 * the animated title is already hidden by CSS in favour of .reducedMotionTitle).
 */

type Variant = "highlight" | "pixel" | null;
type LetterKey = "u" | "e" | "o";

const STEP_MS = 1000;

// Variants per second, in order [u, e, o].
// H = "pixel" (highlight/box) · P = "pixel-no-highlight" · N = "normal".
const H: Variant = "highlight";
const P: Variant = "pixel";
const N: Variant = null;

// PHASE 1 — intro (runs only once). ~2s all in pixel, then U, E and O
// cycles in sequence, with the others "held" in pixel.
const INTRO: ReadonlyArray<readonly [Variant, Variant, Variant]> = [
  [H, H, H], //  0 — hold: all in pixel
  // [H, H, H], //  1 — hold (~2s)
  [H, H, H], //  2 — U: pixel              | E,O held in pixel
  [P, H, H], //  3 — U: pixel-no-highlight
  [N, H, H], //  4 — U: normal
  [N, H, H], //  5 — E: pixel              | U normal, O held in pixel
  [N, P, H], //  6 — E: pixel-no-highlight
  [N, N, H], //  7 — E: normal
  [N, N, H], //  8 — O: pixel              | U,E normal
  [N, N, P], //  9 — O: pixel-no-highlight
  [N, N, N], // 10 — O: normal (end of intro)
];

// PHASE 2 — infinite loop. U → E → O; each pixel/pnh/normal, with the
// other two in normal. Never all three in pixel at the same time.
const LOOP: ReadonlyArray<readonly [Variant, Variant, Variant]> = [
  [N, N, N], //  0 — hold: all normal
  [N, N, N], //  1 — hold: all normal
  [H, N, N], // U: pixel
  [P, N, N], // U: pixel-no-highlight
  [N, N, N], // U: normal
  [N, H, N], // E: pixel
  [N, P, N], // E: pixel-no-highlight
  [N, N, N], // E: normal
  [N, N, H], // O: pixel
  [N, N, P], // O: pixel-no-highlight
  [N, N, N], // O: normal
];

/** Letter state at the given `frame` (intro once, then loop). */
function variantsForFrame(frame: number): Record<LetterKey, Variant> {
  const [u, e, o] =
    frame < INTRO.length
      ? INTRO[frame]!
      : LOOP[(frame - INTRO.length) % LOOP.length]!;
  return { u, e, o };
}

function useFontSwapCycle(): Record<LetterKey, Variant> {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) return;

    const id = setInterval(() => setFrame((f) => f + 1), STEP_MS);
    return () => clearInterval(id);
  }, []);

  return variantsForFrame(frame);
}

/** A letter that swaps font without reflow (in-flow base + pixel overlay). */
function SwapLetter({ char, variant }: { char: string; variant: Variant }) {
  return (
    <span className="relative inline-block">
      <span
        className="transition-opacity duration-100 ease-snappy data-[hidden=true]:opacity-0 motion-reduce:transition-none"
        data-hidden={variant ? "true" : undefined}
      >
        {char}
      </span>
      <span
        className="heroSwapGlyph absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none font-pixel font-light motion-reduce:transition-none"
        data-variant={variant ?? undefined}
        aria-hidden="true"
      >
        {char}
      </span>
    </span>
  );
}

function FontSwapTitle() {
  const v = useFontSwapCycle();

  return (
    <>
      {/* Full accessible text for screen readers */}
      <span className="sr-only">The Superintelligence Cloud</span>

      {/* Visible animated version */}
      <span aria-hidden="true">
        The{" "}
        <span className="whitespace-nowrap">
          S<SwapLetter char="u" variant={v.u} />perintelligenc
          <SwapLetter char="e" variant={v.e} />
        </span>
        <br />
        Cl<SwapLetter char="o" variant={v.o} />ud
      </span>
    </>
  );
}

export default FontSwapTitle;
