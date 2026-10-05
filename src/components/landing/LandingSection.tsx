import type { ReactNode } from "react";

interface LandingSectionProps {
  id?: string;
  className?: string;
  innerClassName?: string;
  children: ReactNode;
}

/** A full-width band with the landing page's centered 1440px column inside. */
export default function LandingSection({ id, className = "", innerClassName = "", children }: LandingSectionProps) {
  return (
    <section id={id} className={`scroll-mt-24 ${className}`}>
      <div className={`mx-auto w-full max-w-[1440px] px-[clamp(20px,4vw,56px)] ${innerClassName}`}>{children}</div>
    </section>
  );
}
