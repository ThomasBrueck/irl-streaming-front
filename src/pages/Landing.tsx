import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="bg-zinc-950 text-white min-h-screen font-sans antialiased selection:bg-blue-500/30">

      {/* nav */}
      <nav className="border-b border-zinc-800/60">
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-lg font-semibold tracking-tight">irl</span>
          </div>
          <div className="flex items-center gap-5">
            <Link to="/login" className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
              Sign in
            </Link>
            <Link
              to="/register"
              className="text-sm bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg font-medium transition-all active:scale-[0.97]"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* hero */}
      <section className="max-w-6xl mx-auto px-5 pt-24 pb-32 md:pt-36 md:pb-44">
        <div className="max-w-3xl">
          <p className="text-sm text-zinc-500 uppercase tracking-widest mb-5">
            Live streaming platform
          </p>
          <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight">
            Stream to the world,
            <br />
            <span className="text-zinc-500">your way.</span>
          </h1>
          <p className="text-zinc-400 text-lg mt-6 max-w-xl leading-relaxed">
            Start broadcasting in seconds. No complicated setup, no hidden fees.
            Just you, your content, and your audience.
          </p>
          <div className="flex items-center gap-4 mt-10">
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-500 px-7 py-3 rounded-xl font-medium text-sm transition-all active:scale-[0.97]"
            >
              Start streaming — it's free
            </Link>
            <a href="#how" className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors underline underline-offset-4 decoration-zinc-800 hover:decoration-zinc-600">
              See how it works
            </a>
          </div>
        </div>
        {/* subtle gradient blob */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      </section>

      {/* features - section one */}
      <section className="border-t border-zinc-800/60">
        <div className="max-w-6xl mx-auto px-5 py-24 md:py-32">
          <div className="max-w-xl">
            <p className="text-zinc-500 text-xs uppercase tracking-[0.2em] mb-4">Built for creators</p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Everything you need to go live
            </h2>
            <p className="text-zinc-400 mt-4 leading-relaxed">
              No bloat, no clutter. Just the tools that actually matter when you're live.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-3 mt-16">
            <div className="border border-zinc-800 rounded-2xl p-7 hover:border-zinc-700 transition-colors">
              <div className="w-9 h-9 rounded-full bg-blue-600/10 flex items-center justify-center mb-5">
                <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-medium mb-2">Stream instantly</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                One click and you're live. No encoding, no redirects, no stress.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-2xl p-7 hover:border-zinc-700 transition-colors">
              <div className="w-9 h-9 rounded-full bg-purple-600/10 flex items-center justify-center mb-5">
                <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="font-medium mb-2">Live chat</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Real-time chat built in. Messages arrive the moment they're sent.
              </p>
            </div>

            <div className="border border-zinc-800 rounded-2xl p-7 hover:border-zinc-700 transition-colors">
              <div className="w-9 h-9 rounded-full bg-emerald-600/10 flex items-center justify-center mb-5">
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-medium mb-2">Your data, safe</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                End-to-end encryption for private streams. We don't sell your data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* how it works */}
      <section id="how" className="border-t border-zinc-800/60">
        <div className="max-w-6xl mx-auto px-5 py-24 md:py-32">
          <p className="text-zinc-500 text-xs uppercase tracking-[0.2em] mb-4">How it works</p>
          <div className="grid md:grid-cols-3 gap-12 md:gap-8 mt-12">
            <div>
              <span className="text-5xl font-bold text-zinc-800">01</span>
              <h3 className="text-lg font-medium mt-3 mb-2">Create your account</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Sign up with your email. Takes about 30 seconds, I promise.
              </p>
            </div>
            <div>
              <span className="text-5xl font-bold text-zinc-800">02</span>
              <h3 className="text-lg font-medium mt-3 mb-2">Set up your stream</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Give it a title, pick your category, and you're ready to roll.
              </p>
            </div>
            <div>
              <span className="text-5xl font-bold text-zinc-800">03</span>
              <h3 className="text-lg font-medium mt-3 mb-2">Go live & connect</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Hit the button and start interacting with your audience in real time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* cta */}
      <section className="border-t border-zinc-800/60">
        <div className="max-w-6xl mx-auto px-5 py-24 md:py-32 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Ready to go live?
          </h2>
          <p className="text-zinc-400 mt-3 max-w-sm mx-auto leading-relaxed">
            Join creators already streaming on irl. No credit card required.
          </p>
          <Link
            to="/register"
            className="inline-block mt-8 bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-xl font-medium text-sm transition-all active:scale-[0.97]"
          >
            Create your account
          </Link>
        </div>
      </section>

      {/* footer */}
      <footer className="border-t border-zinc-800/60">
        <div className="max-w-6xl mx-auto px-5 py-8 flex items-center justify-between text-sm text-zinc-600">
          <span>&copy; 2026 irl streaming</span>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-zinc-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Terms</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
