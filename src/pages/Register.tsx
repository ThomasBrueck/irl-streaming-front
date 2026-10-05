import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { validateRegister, type RegisterValues } from "../lib/authValidation";
import AuthLayout from "../components/auth/AuthLayout";
import Blank from "../components/auth/Blank";
import FormErrors from "../components/auth/FormErrors";
import SubmitButton from "../components/auth/SubmitButton";
import LandingButton from "../components/landing/LandingButton";

const REQUIRED = ["email", "username", "password", "passwordConfirm"] as const;

export default function Register() {
  const [values, setValues] = useState<RegisterValues>({ email: "", username: "", displayName: "", password: "", passwordConfirm: "" });
  const [touched, setTouched] = useState<Partial<Record<keyof RegisterValues, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const [done, setDone] = useState(false);
  const redirectTimer = useRef<number | undefined>(undefined);
  const { register, loading } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isBroadcastIntent = searchParams.get("intent") === "broadcast";

  useEffect(() => {
    return () => window.clearTimeout(redirectTimer.current);
  }, []);

  const errors = validateRegister(values);
  const shown = (key: keyof RegisterValues) => (submitted || touched[key] ? errors[key] : undefined);
  const touch = (key: keyof RegisterValues) => setTouched((t) => ({ ...t, [key]: true }));
  const set = (key: keyof RegisterValues) => (value: string) => setValues((v) => ({ ...v, [key]: value }));

  const isOk = (key: (typeof REQUIRED)[number]) => Boolean(values[key]) && !errors[key];
  const progress = REQUIRED.filter(isOk).length + (done ? 10 : 0);
  const pct = done ? 100 : Math.round((REQUIRED.filter(isOk).length / REQUIRED.length) * 100);
  const name = values.displayName.trim() || values.username.trim() || "Your name";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSubmitted(true);
    if (Object.keys(errors).length > 0) return;

    try {
      await register({
        email: values.email,
        username: values.username,
        password: values.password,
        passwordConfirm: values.passwordConfirm,
        displayName: values.displayName || undefined,
      });
      toast.show("Account created! Log in to continue.", "success");
      setDone(true);
      // Let the pass celebrate for a moment before sending them to log in.
      redirectTimer.current = window.setTimeout(() => navigate("/login"), 1400);
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "That email or username is already taken.";
      setFormError(message);
    }
  };

  const fieldErrors = (["username", "email", "password", "passwordConfirm"] as const)
    .filter((k) => shown(k))
    .map((k) => ({ id: k, message: shown(k) as string }));

  return (
    <AuthLayout
      headline="Join in."
      pct={pct}
      alt={{ to: "/login", label: "Log in" }}
      pass={{
        name,
        handle: `@${values.username.trim().toLowerCase() || "yourname"}`,
        stamp: done ? "WELCOME" : REQUIRED.every(isOk) ? "READY" : "",
        checks: [
          { label: "Email", ok: isOk("email") },
          { label: "Username", ok: isOk("username") },
          { label: "Display name (optional)", ok: Boolean(values.displayName.trim()) },
          { label: "Password", ok: isOk("password") },
          { label: "Confirm password", ok: isOk("passwordConfirm") },
        ],
        progress,
      }}
    >
      {isBroadcastIntent && !done && (
        <p className="auth-rise -mt-4 mb-6 text-lg text-ink-soft">One account, ready to go live right after this.</p>
      )}

      {done ? (
        <div className="auth-rise">
          <p className="auth-sentence m-0 mb-9">Account created. Now log in and say it live.</p>
          <LandingButton to="/login" size="lg">
            Log in
          </LandingButton>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="auth-rise [animation-delay:.12s]">
          <p className="auth-sentence m-0">
            Hi, I&apos;m{" "}
            <Blank
              id="username"
              label="Username"
              value={values.username}
              onChange={set("username")}
              onBlur={() => touch("username")}
              placeholder="yourname"
              autoComplete="username"
              error={shown("username")}
            />
            , but friends call me{" "}
            <Blank
              id="displayName"
              label="Display name (optional)"
              value={values.displayName}
              onChange={set("displayName")}
              onBlur={() => touch("displayName")}
              placeholder="Shown to your viewers"
              autoComplete="nickname"
            />
            . You can reach me at{" "}
            <Blank
              id="email"
              label="Email"
              type="email"
              value={values.email}
              onChange={set("email")}
              onBlur={() => touch("email")}
              placeholder="you@example.com"
              autoComplete="email"
              error={shown("email")}
            />
            . My password is{" "}
            <Blank
              id="password"
              label="Password"
              secret
              value={values.password}
              onChange={set("password")}
              onBlur={() => touch("password")}
              autoComplete="new-password"
              error={shown("password")}
            />
            , and to be sure:{" "}
            <Blank
              id="passwordConfirm"
              label="Confirm password"
              secret
              value={values.passwordConfirm}
              onChange={set("passwordConfirm")}
              onBlur={() => touch("passwordConfirm")}
              autoComplete="new-password"
              error={shown("passwordConfirm")}
            />
            .
          </p>
          <FormErrors fields={fieldErrors} serverError={formError} />
          <div className="mt-10 flex flex-wrap items-center gap-[22px]">
            <SubmitButton loading={loading}>Create account</SubmitButton>
            <Link to="/login" className="font-medium text-ink-soft underline decoration-2 underline-offset-4 transition-colors duration-200 hover:text-ink">
              Already have an account? Log in
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}
