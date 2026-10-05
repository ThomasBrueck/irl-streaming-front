import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="landing grid min-h-screen place-items-center px-5">
      <main className="max-w-[900px]">
        <h1 className="axis auth-rise text-[clamp(56px,10vw,144px)] uppercase">Page not found.</h1>
        <p className="mb-7 mt-4 max-w-[480px] text-xl text-ink-soft">The stream or page you're looking for isn't here, or it already ended.</p>
        <Link
          to="/"
          className="inline-flex min-h-[52px] items-center rounded-full border-2 border-ink bg-ink px-[26px] text-[17px] font-bold text-paper transition-[scale,background-color] duration-200 hover:bg-[#2a2540] active:scale-[.96]"
        >
          Back to irl
        </Link>
      </main>
    </div>
  );
}
