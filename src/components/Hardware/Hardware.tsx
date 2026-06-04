import { useState } from "react";
import "./Hardware.css";

/**
 * HARDWARE — Horizontal product accordion (Lambda.ai).
 * Structure mirrored from artifacts/source_html.html (lines 215–289).
 * Styling in Tailwind utilities (mobile-first); only all:unset,
 * exact transitions, width:calc() and the title adjustment live in Hardware.css.
 */

type HardwareProduct = {
  title: string;
  description: string;
  image: string;
};

// Content extracted from guidelines.json / source_html.html (order preserved).
const PRODUCTS: HardwareProduct[] = [
  {
    title: "NVIDIA VR200 NVL72",
    description: "Rack-scale systems optimized for agentic AI.",
    image: "/images/vr200.jpg",
  },
  {
    title: "NVIDIA GB300 NVL72",
    description: "Rack-scale systems optimized for AI reasoning",
    image: "/images/gb300.png",
  },
  {
    title: "NVIDIA HGX B300",
    description: "Peak performance per watt for the largest training runs",
    image: "/images/hgx-b300.png",
  },
  {
    title: "NVIDIA HGX B200",
    description: "Versatile fine-tuning and inference",
    image: "/images/hgx-b200.png",
  },
];

const cx = (...classes: Array<string | false | undefined>) =>
  classes.filter(Boolean).join(" ");

function Hardware() {
  // First card active by default.
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="bg-terminal-deep">
      <div className="container pt-xl pb-xl">
        {/* Title block — two-column heading + body */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-0">
          <div className="md:w-7/12">
            <h2 className="font-sans text-display font-semibold tracking-tight text-shell m-0">
              The engines of
              <br />
              superintelligence
            </h2>
          </div>
          <div className="md:w-5/12">
            <p className="font-mono text-base font-normal leading-normal text-shell m-0 md:pt-10">
              Give your team the computational precision to train foundation
              models and serve inference at global scale.
            </p>
          </div>
        </div>

        {/* Horizontal accordion */}
        <div className="flex flex-col md:flex-row justify-start gap-2 mt-20 h-auto md:h-card">
          {PRODUCTS.map((product, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={product.title}
                type="button"
                className={cx("hwCard group", isActive && "hwActive")}
                aria-expanded={isActive}
                onClick={() => setActiveIndex(index)}
              >
                <div
                  className={cx(
                    "relative h-75 flex overflow-hidden items-start justify-center md:absolute md:inset-0 md:h-auto",
                    isActive ? "mix-blend-normal" : "mix-blend-luminosity",
                  )}
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    width={410}
                    height={410}
                    className="block w-card-img h-card-img max-w-card shrink-0 object-cover"
                  />
                </div>
                <div className="flex static w-full h-full flex-col items-start justify-end overflow-hidden">
                  <div
                    className={cx(
                      "hwText relative w-full p-10 opacity-90 bg-terminal-deep box-border h-auto",
                      isActive ? "md:h-75" : "md:h-33",
                    )}
                  >
                    <h3 className="hwCardTitle font-sans text-card font-semibold text-shell p-0">
                      {product.title}
                    </h3>
                    <div
                      className={cx(
                        "hwRichText font-mono text-base font-normal leading-6 text-neutral-400 relative h-auto p-0 mt-5 opacity-100 visible",
                        "md:absolute md:left-0 md:top-card-rt-top md:h-card-rt md:px-10",
                        isActive
                          ? "md:opacity-100 md:visible md:translate-y-0"
                          : "md:opacity-0 md:invisible md:-translate-y-5",
                      )}
                    >
                      {product.description}
                    </div>
                  </div>
                </div>
                <div
                  className={cx(
                    "hwIndicator hidden md:block h-2.5 -ml-px mt-2 group-hover:bg-purple",
                    isActive ? "bg-purple" : "bg-shell",
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Hardware;
