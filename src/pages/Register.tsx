import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    passwordConfirm: "",
    displayName: "",
  });
  const [error, setError] = useState("");
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.passwordConfirm) {
      setError("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      await register({
        email: form.email,
        username: form.username,
        password: form.password,
        passwordConfirm: form.passwordConfirm,
        displayName: form.displayName || undefined,
      });
      navigate("/dashboard");
    } catch {
      setError("Registration failed. Email or username may already be taken.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <form onSubmit={handleSubmit} className="w-full max-w-sm mx-4">
        <h1 className="text-2xl font-bold text-white mb-2">Create account</h1>
        <p className="text-zinc-400 mb-8">Start streaming in minutes</p>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-zinc-300 mb-1">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={form.username}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="streamer123"
            />
          </div>

          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-zinc-300 mb-1">
              Display name <span className="text-zinc-500">(optional)</span>
            </label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              value={form.displayName}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your stream name"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-300 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="At least 6 characters"
            />
          </div>

          <div>
            <label htmlFor="passwordConfirm" className="block text-sm font-medium text-zinc-300 mb-1">
              Confirm password
            </label>
            <input
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              required
              value={form.passwordConfirm}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Repeat your password"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 py-2 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="mt-4 text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:text-blue-300">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
