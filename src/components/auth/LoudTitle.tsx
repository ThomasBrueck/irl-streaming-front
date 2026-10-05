interface LoudTitleProps {
  text: string;
  /** 0 to 100: how much of the form is filled in. */
  pct: number;
}

/** The big headline. As the form fills up, its letters get wider and heavier
 * from left to right, like a voice getting louder. */
export default function LoudTitle({ text, pct }: LoudTitleProps) {
  const wordList = text.split(" ");
  const total = text.replace(/ /g, "").length;
  // Position of each word's first letter among all letters (spaces excluded).
  const starts = wordList.map((_, i) => wordList.slice(0, i).reduce((n, w) => n + w.length, 0));
  const words = wordList.map((word, wi) =>
    word.split("").map((ch, ci) => {
      const k = Math.min(1, Math.max(0, (pct / 100) * (total + 1) - (starts[wi] + ci)));
      return { ch, wdth: 60 + 90 * k, wght: 250 + 650 * k };
    })
  );

  return (
    <h1
      aria-label={text}
      className="axis auth-rise m-0 mb-[34px] mt-[26px] text-[clamp(52px,9vw,140px)] uppercase"
    >
      {words.map((letters, wi) => (
        <span key={wi} aria-hidden="true" className="mr-[.2em] inline-block whitespace-nowrap">
          {letters.map((l, li) => (
            <span
              key={li}
              className={`loud-letter ${l.ch === "." ? "text-tally" : ""}`}
              style={{ fontVariationSettings: `"wdth" ${l.wdth.toFixed(0)}, "wght" ${l.wght.toFixed(0)}` }}
            >
              {l.ch}
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}
