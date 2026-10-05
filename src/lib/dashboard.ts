import type { StreamResponse } from "../types/stream";
import { categoryMeta } from "./categories";

/** Matches a stream against what someone typed: title, description or category name. */
export function matchesSearch(stream: StreamResponse, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    stream.title.toLowerCase().includes(q) ||
    (stream.description ?? "").toLowerCase().includes(q) ||
    categoryMeta(stream.category).label.toLowerCase().includes(q)
  );
}
