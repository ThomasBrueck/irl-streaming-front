import { useEffect, useState } from "react";
import type { StreamResponse } from "../../types/stream";
import { CATEGORIES, type StreamCategory } from "../../lib/categories";
import Icon from "../ui/Icon";

export interface EditValues {
  title: string;
  description: string;
  category: StreamCategory;
}

interface EditChannelDialogProps {
  stream: StreamResponse;
  saving: boolean;
  onSave: (values: EditValues) => void;
  onClose: () => void;
}

const field =
  "block w-full min-h-[52px] rounded-[14px] bg-white px-4 text-base shadow-[inset_0_0_0_2px_#0c0a14] transition-shadow duration-200 placeholder:text-ink-faint focus:outline-none focus:shadow-[inset_0_0_0_3px_#5b2fe0]";

/** Change the title, description and category of your channel. */
export default function EditChannelDialog({ stream, saving, onSave, onClose }: EditChannelDialogProps) {
  const [title, setTitle] = useState(stream.title);
  const [description, setDescription] = useState(stream.description ?? "");
  const [category, setCategory] = useState<StreamCategory>(stream.category ?? "JUST_CHATTING");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || saving) return;
    onSave({ title: title.trim(), description: description.trim(), category });
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/60 px-5" onClick={onClose}>
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-title-heading"
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-[460px] overflow-y-auto rounded-[28px] bg-white p-2 shadow-[0_0_0_2px_#0c0a14,0_28px_50px_-30px_rgba(12,10,20,.6)] [animation:auth-rise_.4s_cubic-bezier(.16,1,.3,1)_both]"
      >
        <div className="rounded-[20px] bg-paper p-6">
          <div className="mb-[18px] flex items-start justify-between gap-4">
            <h2 id="edit-title-heading" className="axis text-[30px] uppercase">
              Edit channel
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="grid size-11 shrink-0 place-items-center rounded-full border-2 border-ink transition-[scale,background-color] duration-200 hover:bg-white active:scale-[.94]"
            >
              <Icon name="close" size={18} strokeWidth={2.2} />
            </button>
          </div>

          <label htmlFor="edit-title" className="mb-2 block text-[15px] font-bold">
            Title
          </label>
          <input id="edit-title" className={field} type="text" required maxLength={150} autoFocus value={title} onChange={(e) => setTitle(e.target.value)} />

          <label htmlFor="edit-description" className="mb-2 mt-4 block text-[15px] font-bold">
            Description (optional)
          </label>
          <textarea
            id="edit-description"
            className={`${field} min-h-[96px] resize-none py-3`}
            rows={3}
            maxLength={500}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="mb-2 mt-4 text-[15px] font-bold">Category</div>
          <div role="group" aria-label="Category" className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                type="button"
                aria-pressed={category === c.value}
                onClick={() => setCategory(c.value)}
                className={`inline-flex min-h-10 items-center gap-2 rounded-full px-3.5 text-[15px] font-bold shadow-[inset_0_0_0_2px_#0c0a14] transition-[scale,background-color,color] duration-200 active:scale-[.96] ${
                  category === c.value ? "bg-ink text-paper" : "hover:bg-white"
                }`}
              >
                <i className="size-2.5 rounded-full shadow-[inset_0_0_0_2px_#0c0a14]" style={{ background: c.color }} />
                {c.label}
              </button>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-12 items-center rounded-full border-2 border-ink px-6 text-base font-bold transition-[scale,background-color,color] duration-200 hover:bg-ink hover:text-paper active:scale-[.96]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !title.trim()}
              className="inline-flex min-h-12 items-center gap-2.5 rounded-full border-2 border-ink bg-ink px-6 text-base font-bold text-paper transition-[scale,background-color] duration-200 hover:bg-[#2a2540] active:scale-[.96] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving && <span className="size-[18px] rounded-full border-[3px] border-white/30 border-t-white [animation:auth-spin_.7s_linear_infinite]" />}
              Save changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
