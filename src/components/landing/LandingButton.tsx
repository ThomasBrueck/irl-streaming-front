import { useEffect, useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { gsap } from "../../lib/gsap";
import { useReducedMotion } from "../../hooks/useReducedMotion";

type Variant = "ink" | "outline" | "paper" | "paper-outline";
type Size = "sm" | "md" | "lg";

interface LandingButtonProps {
  /** Route inside the app. */
  to?: string;
  /** In-page anchor, like "#questions". */
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

const VARIANTS: Record<Variant, string> = {
  ink: "bg-ink text-paper border-ink hover:bg-[#2a2540]",
  outline: "border-ink text-ink hover:bg-ink hover:text-paper",
  paper: "bg-paper text-ink border-paper hover:bg-white",
  "paper-outline": "border-paper text-paper hover:bg-paper hover:text-ink",
};

const SIZES: Record<Size, string> = {
  sm: "min-h-[46px] px-6 text-[15px]",
  md: "min-h-[52px] px-7 text-base",
  lg: "min-h-[60px] px-[38px] text-lg",
};

/** A pill link that leans toward the pointer. Only press feedback uses CSS
 * `scale`; the lean uses GSAP translate, so the two never fight. */
export default function LandingButton({ to, href, variant = "ink", size = "md", className = "", children }: LandingButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1,.5)" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1,.5)" });
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.25);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.25);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      gsap.set(el, { clearProps: "x,y" });
    };
  }, [reduced]);

  const classes = `inline-flex items-center justify-center rounded-full border-2 font-bold transition-[scale,background-color,color] duration-200 ease-[cubic-bezier(.2,0,0,1)] active:scale-[.96] ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

  if (to) {
    return (
      <Link ref={ref} to={to} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <a ref={ref} href={href} className={classes}>
      {children}
    </a>
  );
}
