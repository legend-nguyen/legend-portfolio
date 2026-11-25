import type { ReactNode } from "react";

import { ShaderFlow } from "../shaders/shader-flow";

const TEXTURE_MASK =
  "radial-gradient(ellipse 75% 60% at 50% 0%, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.55) 45%, rgba(0, 0, 0, 0) 100%)";

export function PageBackdrop(): ReactNode {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-225 overflow-hidden"
    >
      {/* Signature soft monochrome silver/white top light falloff */}
      <div className="absolute inset-0 opacity-50 md:opacity-100">
        <ShaderFlow brightness={3} iterations={10} flowSpeed={[0, 0.1]} />
      </div>

      {/* Ultra-faint monochrome dot grid texture masked near the top */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.035]"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          WebkitMaskImage: TEXTURE_MASK,
          maskImage: TEXTURE_MASK,
        }}
      />
    </div>
  );
}
