import Icon from "../ui/Icon";

interface FormErrorsProps {
  /** One line per invalid field: its input id and message. */
  fields: { id: string; message: string }[];
  /** A problem reported by the server, shown below the field errors. */
  serverError?: string;
}

/** Plain-language list of what to fix, announced politely to screen readers. */
export default function FormErrors({ fields, serverError }: FormErrorsProps) {
  return (
    <>
      {fields.length > 0 && (
        <ul aria-live="polite" className="m-0 mt-[26px] flex list-none flex-col gap-2 p-0">
          {fields.map((f) => (
            <li key={f.id} id={`${f.id}-error`} className="flex items-center gap-2 text-[17px] font-medium text-tally-text">
              <Icon name="warning" size={16} strokeWidth={2} />
              <span>{f.message}</span>
            </li>
          ))}
        </ul>
      )}
      {serverError && (
        <div role="alert" className="mt-[22px] flex items-center gap-2 text-lg font-bold text-tally-text">
          <Icon name="warning" size={16} strokeWidth={2} />
          <span>{serverError}</span>
        </div>
      )}
    </>
  );
}
