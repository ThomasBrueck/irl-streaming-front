// Mirrors the category values the service accepts.
export type StreamCategory = "JUST_CHATTING" | "GAMING" | "SOFTWARE" | "SPORTS" | "OTHER";

export interface CategoryMeta {
  value: StreamCategory;
  label: string;
  /** This category's accent color (a CSS variable). */
  color: string;
}

export const CATEGORIES: CategoryMeta[] = [
  { value: "JUST_CHATTING", label: "Just chatting", color: "var(--color-cat-chat)" },
  { value: "GAMING", label: "Gaming", color: "var(--color-cat-gaming)" },
  { value: "SOFTWARE", label: "Software", color: "var(--color-cat-software)" },
  { value: "SPORTS", label: "Sports", color: "var(--color-cat-sports)" },
  { value: "OTHER", label: "Other", color: "var(--color-cat-other)" },
];
// The colors resolve through the --color-cat-* tokens in src/index.css.

const BY_VALUE = new Map(CATEGORIES.map((c) => [c.value, c]));

export function categoryMeta(cat?: StreamCategory | null): CategoryMeta {
  return (cat && BY_VALUE.get(cat)) || CATEGORIES[0];
}
