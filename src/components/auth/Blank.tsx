import { useState } from "react";

interface BlankProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  type?: "text" | "email";
  /** Password field: masks the text and adds a Show / Hide button. */
  secret?: boolean;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
}

/** A blank inside a sentence. The sentence around it is the visual label; a
 * screen-reader-only label names the field. */
export default function Blank({
  id,
  label,
  value,
  onChange,
  onBlur,
  type = "text",
  secret = false,
  placeholder,
  autoComplete,
  error,
}: BlankProps) {
  const [shown, setShown] = useState(false);
  const resolvedType = secret ? (shown ? "text" : "password") : type;

  return (
    <>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={resolvedType}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={`auth-blank ${error ? "auth-blank-bad" : ""}`}
      />
      {secret && (
        <button type="button" aria-pressed={shown} onClick={() => setShown((s) => !s)} className="auth-tog">
          {shown ? "Hide" : "Show"}
        </button>
      )}
    </>
  );
}
