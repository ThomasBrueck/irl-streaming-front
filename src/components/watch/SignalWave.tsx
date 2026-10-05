const WAVE = (() => {
  let d = "";
  for (let x = 0; x <= 1000; x += 8) {
    const y = 281 + 70 * Math.sin(x / 55) + 38 * Math.sin(x / 21 + 1.2) + 14 * Math.sin(x / 9);
    d += `${x ? " L " : "M "}${x} ${y.toFixed(1)}`;
  }
  return d;
})();

/** The oscilloscope line behind the video. A bright pulse travels along it while the channel is live. */
export default function SignalWave({ live }: { live: boolean }) {
  return (
    <svg className="absolute inset-0 size-full" viewBox="0 0 1000 562" preserveAspectRatio="none" aria-hidden="true">
      <path d={WAVE} fill="none" stroke="#2f2850" strokeWidth={3} />
      {live && (
        <path
          d={WAVE}
          pathLength={1000}
          fill="none"
          stroke="#b9a4ff"
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray="170 830"
          className="[animation:watch-scan_3.4s_linear_infinite]"
        />
      )}
    </svg>
  );
}
