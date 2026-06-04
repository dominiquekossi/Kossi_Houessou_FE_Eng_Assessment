import { useRef } from "react";
import "./Hero.css";
import { useUnicornStudio } from "./useUnicornStudio";
import FontSwapTitle from "./FontSwapTitle";

/**
 * HERO — Full-viewport animated hero (Lambda.ai).
 * Structure mirrored from artifacts/source_html.html (lines 16–52).
 * Styling in Tailwind utilities; only min-height calc/dvh, z-index,
 * eyebrow (max-width %/text-wrap), RGB shadow + button hover, the canvas
 * mask and FontSwap pixel states live in Hero.css.
 *
 * Background = UnicornStudio WebGL scene "Superintelligence II" (self-hosted).
 * FontSwap on letters u/e/o — see FontSwapTitle.tsx.
 */

// Title typography (.h1 + .h1-large): 5 breakpoints, line-height 100%.
const HERO_TITLE =
  "font-sans font-semibold tracking-tighter text-shell relative leading-none " +
  "text-hero-0 xs:text-hero-1 md:text-hero-2 lg:text-hero-3 xl:text-hero-4";

// Shared base for CTA buttons (primary and secondary).
const BTN_BASE =
  "heroBtn inline-flex appearance-none cursor-pointer items-center justify-center " +
  "text-center gap-2.5 font-mono text-btn font-normal uppercase no-underline " +
  "tracking-widest rounded-none";

function Hero() {
  const bgRef = useRef<HTMLDivElement>(null);
  useUnicornStudio(bgRef);

  return (
    <section className="pt-xl pb-xl module-comp heroSection w-full flex flex-col items-center justify-center text-center">
      {/* Background — UnicornStudio WebGL scene (mounted via ref by the hook) */}
      <div aria-hidden="true">
        <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden pointer-events-none motion-reduce:hidden">
          <div
            ref={bgRef}
            className="heroAnimContainer absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full object-cover opacity-100 transition-opacity duration-1000 ease-in-out"
          />
        </div>
      </div>

      {/* Eyebrow */}
      <p className="heroEyebrow inline-block relative text-shell text-center text-ellipsis font-sans text-eyebrow font-semibold mb-5 md:text-eyebrow-md">
        Supercomputers for training and inference
      </p>

      {/* Reduced-motion fallback heading */}
      <h1 className={`${HERO_TITLE} hidden motion-reduce:block`}>
        <span>
          The Superintelligence <br /> Cloud
        </span>
      </h1>

      {/* Main heading (sr-only + visible) — letters u/e/o animate via FontSwap */}
      <h1 className={`${HERO_TITLE} block motion-reduce:hidden`}>
        <FontSwapTitle />
      </h1>

      {/* CTA buttons */}
      <div className="container heroTitleContainer">
        <div className="flex flex-row flex-wrap items-start justify-center gap-5 mt-12.5">
          <a
            href="/sign-up"
            className={`${BTN_BASE} heroBtnPrimary bg-shell text-terminal`}
            aria-label="Launch GPU instance"
          >
            Launch GPU instance
          </a>
          <a
            href="/talk-to-our-team"
            className={`${BTN_BASE} bg-ultraviolet text-shell hover:bg-ultraviolet-400`}
            aria-label="Talk to our team"
          >
            Talk to our team
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
