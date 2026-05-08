"use client";

import { LANGUAGE_LABELS } from "@/lib/language";

interface Article {
  id: string;
  title: string;
  url?: string | null;
  language: string;
  tags: string[];
  createdAt: string;
}

interface Props {
  article: Article;
  selected?: boolean;
  onSelect?: (id: string, checked: boolean) => void;
  onDelete?: (id: string) => void;
  onTagsChange?: (id: string, tags: string[]) => void;
}

export function ArticleCard({ article, selected, onSelect, onDelete, onTagsChange }: Props) {
  const date = new Date(article.createdAt).toLocaleDateString("es-ES", {
    day: "numeric", month: "short", year: "numeric",
  });

  return (
    <div
      className="rounded-lg p-4 border transition-all duration-200"
      style={{
        background: "var(--card)",
        borderColor: selected ? "var(--accent)" : "var(--border)",
        boxShadow: selected ? "0 0 0 1px var(--accent)" : "none",
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
          </div>

          <h3 className="text-sm font-medium leading-snug mb-2" style={{ color: "var(--foreground)" }}>
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

        {onDelete && (
          <button
            onClick={() => onDelete(article.id)}
            className="text-xs shrink-0 transition-colors hover:text-red-400"
            style={{ color: "var(--muted)" }}
            title="Eliminar"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

function TagEditor({ tags, onChange }: { tags: string[]; onChange: (tags: string[]) => void }) {
  return (
    <input
      type="text"
      placeholder="+ etiqueta"
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
