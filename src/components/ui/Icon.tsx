import type { SVGProps } from "react";

export type IconName =
  | "camera"
  | "mic"
  | "mic-off"
  | "search"
  | "close"
  | "dot"
  | "warning"
  | "check"
  | "edit"
  | "plus"
  | "arrow-right"
  | "arrow-left"
  | "volume"
  | "volume-off"
  | "fullscreen"
  | "link"
  | "send"
  | "star";

const PATHS: Record<IconName, React.ReactNode> = {
  camera: (
    <>
      <path d="M3 7.5h11.5a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z" />
      <path d="M15.5 10.2 21 8v8l-5.5-2.2" strokeLinejoin="round" />
      <circle cx="6.2" cy="11" r=".4" fill="currentColor" stroke="none" />
    </>
  ),
  mic: (
    <>
      <path d="M9 3.5h0a3 3 0 0 1 3 3V11a3 3 0 0 1-6 0V6.5a3 3 0 0 1 3-3Z" />
      <path d="M4.5 11a7.5 7.5 0 0 0 15 0" />
      <path d="M12 18.5V21" />
      <path d="M8.5 21h7" />
    </>
  ),
  "mic-off": (
    <>
      <path d="M9 3.5h0a3 3 0 0 1 3 3V11c0 .5-.08.98-.24 1.42" />
      <path d="M7.02 7.9V6.5a3 3 0 0 1 4.5-2.6" />
      <path d="M4.5 11a7.5 7.5 0 0 0 12.1 5.9" />
      <path d="M19.5 11a7.5 7.5 0 0 1-.34 2.24" />
      <path d="M12 18.5V21" />
      <path d="M8.5 21h7" />
      <path d="M3 3l18 18" />
    </>
  ),
  search: (
    <>
      <circle cx="10.2" cy="10.2" r="6.2" />
      <path d="M15 15l5.5 5.5" />
    </>
  ),
  close: (
    <>
      <path d="M5 5l14 14M19 5L5 19" />
    </>
  ),
  dot: <circle cx="12" cy="12" r="5" fill="currentColor" stroke="none" />,
  warning: (
    <>
      <path d="M12 3.5 21.5 20h-19L12 3.5Z" strokeLinejoin="round" />
      <path d="M12 10v4" />
      <circle cx="12" cy="17" r=".4" fill="currentColor" stroke="none" />
    </>
  ),
  check: <path d="M4.5 12.5l5 5 10-11" />,
  edit: (
    <>
      <path d="M4 20l1-4L16 5l3 3L8 19l-4 1Z" strokeLinejoin="round" />
      <path d="M13 7l3 3" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  "arrow-right": <path d="M5 12h14M13 6l6 6-6 6" />,
  "arrow-left": <path d="M19 12H5M11 6l-6 6 6 6" />,
  volume: (
    <>
      <path d="M4 9v6h4l5 4V5L8 9H4z" strokeLinejoin="round" />
      <path d="M16.5 8.5a5 5 0 010 7" />
    </>
  ),
  "volume-off": (
    <>
      <path d="M4 9v6h4l5 4V5L8 9H4z" strokeLinejoin="round" />
      <path d="M17 9.5l4 5M21 9.5l-4 5" />
    </>
  ),
  fullscreen: <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />,
  link: <path d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1" />,
  send: <path d="M5 12h14M13 6l6 6-6 6" />,
  star: <path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.5 6.7 19.4l1.2-6L3.4 9.3l6-.7L12 3z" strokeLinejoin="round" />,
};

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

/** A small hand-drawn icon set — no emoji, no icon library. */
export default function Icon({ name, size = 18, strokeWidth = 1.6, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      aria-hidden="true"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}
