"use client";

import { LANGUAGE_LABELS } from "@/lib/language";

interface Article {
  id: string;
  title: string;
  url?: string | null;
  language: string;
  tags: string[];
  status?: string;
  createdAt: string;
}

interface Props {
  article: Article;
  selected?: boolean;
  onSelect?: (id: string, checked: boolean) => void;
  onDelete?: (id: string) => void;
  onTagsChange?: (id: string, tags: string[]) => void;
  onStatusChange?: (id: string, status: string) => void;
  dimmed?: boolean;
}

const STATUS_ACTIONS: Record<string, { label: string; next: string }[]> = {
  new:      [{ label: "Archive", next: "archived" }],
  used:     [{ label: "Mark as new", next: "new" }, { label: "Archive", next: "archived" }],
  archived: [{ label: "Restore", next: "new" }],
};

export function ArticleCard({ article, selected, onSelect, onDelete, onTagsChange, onStatusChange, dimmed }: Props) {
  const date = new Date(article.createdAt).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });

  const actions = article.status ? STATUS_ACTIONS[article.status] ?? [] : [];

  return (
    <div
      className="rounded-lg p-4 border transition-all duration-200"
      style={{
        background: "var(--card)",
        borderColor: selected ? "var(--accent)" : "var(--border)",
        boxShadow: selected ? "0 0 0 1px var(--accent)" : "none",
        opacity: dimmed ? 0.55 : 1,
      }}
    >
      <div className="flex items-start gap-3">
        {onSelect && (
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => onSelect(article.id, e.target.checked)}
            className="mt-1 cursor-pointer accent-indigo-500"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className="text-xs font-mono px-1.5 py-0.5 rounded"
              style={{ background: "rgba(99,102,241,0.15)", color: "var(--accent)" }}
            >
              {LANGUAGE_LABELS[article.language] ?? article.language.toUpperCase()}
            </span>
            <span className="text-xs" style={{ color: "var(--muted)" }}>{date}</span>
            {article.status === "used" && (
              <span
                className="text-xs px-1.5 py-0.5 rounded"
                style={{ background: "rgba(34,197,94,0.12)", color: "#16a34a" }}
              >
                used
              </span>
            )}
            {article.status === "archived" && (
              <span
                className="text-xs px-1.5 py-0.5 rounded"
                style={{ background: "var(--subtle)", color: "var(--muted)" }}
              >
                archived
              </span>
            )}
          </div>

          <h3
            className="text-sm font-medium leading-snug mb-2 line-clamp-2"
            style={{ color: "var(--foreground)" }}
            title={article.title}
          >
            {article.url ? (
              <a href={article.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {article.title}
              </a>
            ) : (
              article.title
            )}
          </h3>

          <div className="flex items-center gap-2 flex-wrap">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: "var(--tag-bg)", color: "var(--muted)" }}
              >
                {tag}
              </span>
            ))}
            {onTagsChange && (
              <TagEditor tags={article.tags} onChange={(tags) => onTagsChange(article.id, tags)} />
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onStatusChange && actions.map((action) => (
            <button
              key={action.next}
              onClick={() => onStatusChange(article.id, action.next)}
              className="text-xs transition-colors hover:underline"
              style={{ color: "var(--muted)" }}
            >
              {action.label}
            </button>
          ))}
          {onDelete && (
            <button
              onClick={() => onDelete(article.id)}
              className="text-xs transition-colors hover:text-red-400"
              style={{ color: "var(--muted)" }}
              title="Eliminar"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function TagEditor({ tags, onChange }: { tags: string[]; onChange: (tags: string[]) => void }) {
  return (
    <input
      type="text"
      placeholder="+ tag"
      className="text-xs bg-transparent outline-none"
      style={{ color: "var(--muted)", width: "80px" }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === ",") {
          e.preventDefault();
          const val = (e.target as HTMLInputElement).value.trim();
          if (val && !tags.includes(val)) {
            onChange([...tags, val]);
            (e.target as HTMLInputElement).value = "";
          }
        }
        if (e.key === "Backspace" && !(e.target as HTMLInputElement).value && tags.length) {
          onChange(tags.slice(0, -1));
        }
      }}
    />
  );
}
