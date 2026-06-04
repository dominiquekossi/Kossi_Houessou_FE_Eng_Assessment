import { useState, useRef } from "react";
import "./Features.css";

/**
 * FEATURES — Numbered accordion + isometric datacenter illustration (Lambda.ai).
 * Structure mirrored from artifacts/source_html.html (lines 68–197).
 * Styling in Tailwind utilities; only the Foundation grid, all:unset
 * (title/toggle), the ::after "/", clamp gaps and the open/close +
 * illustration transitions live in Features.css.
 */

type FeatureItem = {
  number: string;
  title: string;
  body: string;
  locked?: boolean;
};

// Content extracted from guidelines.json / source_html.html (order preserved).
const ITEMS: FeatureItem[] = [
  {
    number: "01",
    title: "You bring models. We bring the compute.",
    body: "Get complete AI factories integrating high-density power, liquid cooling, and NVIDIA GPUs into one system designed for peak AI performance.",
    locked: true,
  },
  {
    number: "02",
    title: "Your supercomputer. Your rules.",
    body: "Accelerate every stage of your AI lifecycle. Train foundation models and serve billions of tokens.",
  },
  {
    number: "03",
    title: "Orchestration, handled.",
    body: "Run large-scale AI workloads without the operational burden. We manage your clusters so you can focus on innovation.",
  },
  {
    number: "04",
    title: "Experts included.",
    body: "Co-engineer your workloads with the very people building the infrastructure behind the world's most advanced models.",
  },
];

const cx = (...classes: Array<string | false | undefined>) =>
  classes.filter(Boolean).join(" ");

const IMAGES = [
  "/images/features-illustration.png",
  "/images/illustration-02.png",
  "/images/illustration-03.png",
  "/images/illustration-04.png",
];

function Features() {
  // Single-open accordion: exactly one item open at a time. Item 01 open by default.
  const [openIndex, setOpenIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const rafRef = useRef<number>(0);

  // Clicking another item switches the active one; clicking the already-open item does nothing
  // (ensures only one item is open and item 01 can never be closed).
  const handleToggle = (index: number) => {
    if (index === openIndex) return;
    setOpenIndex(index);
    setIsFading(true);
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => setIsFading(false));
  };

  return (
    <section className="pt-xl pb-xl module-comp">
      <div className="container">
        <div className="stack--md">
          {/* Section heading */}
          <div className="grid-x grid-margin-x">
            <div className="cell small-12 medium-7">
              <h2 className="font-sans text-h2 font-semibold tracking-tighter text-shell relative">
                Built for AI. Ready for superintelligence.
              </h2>
            </div>
          </div>

          {/* Accordion + illustration grid */}
          <div className="grid-x grid-margin-x">
            {/* Left: accordion */}
            <div className="cell small-12 medium-7">
              <div className="w-full">
                {ITEMS.map((item, index) => {
                  const isOpen = index === openIndex;

                  return (
                    <div
                      className="accItem flex flex-row border-b border-neutral-800 first:border-t"
                      key={item.number}
                    >
                      <div className="shrink-0">
                        <span
                          className="accNum font-mono font-normal text-h5 text-shell"
                          aria-hidden="true"
                        >
                          {item.number}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col">
                        <h3 className="m-0">
                          <button
                            type="button"
                            className="flex w-full appearance-none cursor-pointer items-start justify-between border-0 bg-transparent p-0 text-left"
                            aria-expanded={isOpen}
                            data-locked={item.locked ? "true" : undefined}
                            onClick={() => handleToggle(index)}
                          >
                            <span className="accTitle">{item.title}</span>
                            <span className="accToggle" aria-hidden="true">
                              {isOpen ? "−" : "+"}
                            </span>
                          </button>
                        </h3>
                        <div
                          className={cx("accContent", isOpen && "accContentOpen")}
                          role="region"
                          inert={!isOpen}
                        >
                          <div>
                            <div>{item.body}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: isometric datacenter illustration */}
            <div className="cell small-12 medium-5">
              <div className="illoBox relative mt-5 w-auto max-w-full lg:-mt-10 lg:pl-10">
                <img
                  ref={imgRef}
                  className={cx("illoImg block w-full h-auto", isFading && "opacity-0")}
                  src={IMAGES[openIndex]}
                  alt="Isometric datacenter stack: purpose-built datacenters, AI infrastructure, managed services, co-engineering"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="sectionBorder" />
    </section>
  );
}

export default Features;
