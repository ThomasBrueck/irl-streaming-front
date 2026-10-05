import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { validateLogin, type LoginValues } from "../lib/authValidation";
import AuthLayout from "../components/auth/AuthLayout";
import Blank from "../components/auth/Blank";
import FormErrors from "../components/auth/FormErrors";
import SubmitButton from "../components/auth/SubmitButton";

export default function Login() {
  const [values, setValues] = useState<LoginValues>({ email: "", password: "" });
  const [touched, setTouched] = useState<Partial<Record<keyof LoginValues, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const { login, loading } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const errors = validateLogin(values);
  const shown = (key: keyof LoginValues) => (submitted || touched[key] ? errors[key] : undefined);
  const touch = (key: keyof LoginValues) => setTouched((t) => ({ ...t, [key]: true }));
  const set = (key: keyof LoginValues) => (value: string) => setValues((v) => ({ ...v, [key]: value }));

  const progress = (values.email && !errors.email ? 1 : 0) + (values.password ? 1 : 0);
  const local = values.email.split("@")[0].trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSubmitted(true);
    if (Object.keys(errors).length > 0) return;

    try {
      await login(values);
      toast.show("Welcome back!", "success");
      navigate("/dashboard");
    } catch {
      setFormError("That email or password doesn't match.");
    }
  };

  const fieldErrors = (["email", "password"] as const)
    .filter((k) => shown(k))
    .map((k) => ({ id: k, message: shown(k) as string }));

  return (
    <AuthLayout
      headline="Welcome back."
      pct={Math.round((progress / 2) * 100)}
      alt={{ to: "/register", label: "Sign up" }}
      pass={{
        name: local || "Welcome back",
        handle: local ? "Member of irl" : "Log in to continue",
        stamp: progress === 2 ? "READY" : "",
        checks: [
          { label: "Email", ok: Boolean(values.email) && !errors.email },
          { label: "Password", ok: Boolean(values.password) },
        ],
        progress,
      }}
    >
      <form onSubmit={handleSubmit} noValidate className="auth-rise [animation-delay:.12s]">
        <p className="auth-sentence m-0">
          Let me in. My email is{" "}
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
          />{" "}
          and my password is{" "}
          <Blank
            id="password"
            label="Password"
            secret
            value={values.password}
            onChange={set("password")}
            onBlur={() => touch("password")}
            autoComplete="current-password"
            error={shown("password")}
          />
          .
        </p>
        <FormErrors fields={fieldErrors} serverError={formError} />
        <div className="mt-10 flex flex-wrap items-center gap-[22px]">
          <SubmitButton loading={loading}>Log in</SubmitButton>
          <Link to="/register" className="font-medium text-ink-soft underline decoration-2 underline-offset-4 transition-colors duration-200 hover:text-ink">
            No account yet? Sign up
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
