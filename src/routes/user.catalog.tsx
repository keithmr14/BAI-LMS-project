import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { AccentButton, SelectInput } from "@/components/Tabbed";
import { books, categories } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/user/catalog")({
  head: () => ({
    meta: [
      { title: "Catalog · BAI Archives" },
      {
        name: "description",
        content:
          "Search the BAI Archives collection of physical books and e-books, check availability and place a hold request.",
      },
      { property: "og:title", content: "Catalog · BAI Archives" },
      {
        property: "og:description",
        content: "Browse physical and digital titles and reserve your next read.",
      },
    ],
  }),
  component: StudentCatalog,
});

const sortTabs = ["Popular", "Featured", "Latest"] as const;



// TO EDIT
function StudentCatalog() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("All");
  const [type, setType] = useState("All");
  const [sort, setSort] = useState<(typeof sortTabs)[number]>("Popular");
  const [selectedId, setSelectedId] = useState(books[0]!.bookId);

  const rows = books
    .filter(
      (b) =>
        (category === "All" || b.category === category) &&
        (type === "All" || b.type === type) &&
        (b.title + b.authors).toLowerCase().includes(q.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "Latest"
        ? b.year - a.year
        : sort === "Featured"
          ? a.title.localeCompare(b.title)
          : b.copiesTotal - a.copiesTotal,
    );

  const selected = books.find((b) => b.bookId === selectedId) ?? rows[0] ?? books[0]!;
  const available = selected.copiesAvailable > 0;

  return (
    <AppShell
      role="user"
      title="Catalog"
      subtitle="Physical shelves and digital editions"
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px]">
        {/* Collection grid */}
        <section className="card-surface p-4 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-bold">Books Collection</h2>
            <p className="text-xs text-muted-foreground">{rows.length} results</p>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="flex rounded-md bg-secondary p-1">
              {sortTabs.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSort(t)}
                  className={cn(
                    "rounded px-3 py-1.5 text-xs font-semibold transition-colors",
                    sort === t
                      ? "bg-primary text-primary-foreground"
                      : "text-secondary-foreground hover:text-[var(--leaf-green)]",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="relative min-w-[180px] flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search a book"
                className="h-9 w-full rounded-md border border-input bg-card pl-9 pr-3 text-sm focus:border-[var(--leaf-green)] focus:outline-none"
              />
            </div>

            <SelectInput
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-9 w-auto"
            >
              {["All", ...categories].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </SelectInput>
            <SelectInput
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="h-9 w-auto"
            >
              {["All", "Physical", "Digital"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </SelectInput>
          </div>

          <ul className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
            {rows.map((b) => (
              <li key={b.bookId}>
                <button
                  type="button"
                  onClick={() => setSelectedId(b.bookId)}
                  className="group w-full text-left"
                >
                  <span
                    className={cn(
                      "block overflow-hidden rounded-md border-2 transition-colors",
                      selectedId === b.bookId
                        ? "border-[var(--banana-gold)]"
                        : "border-transparent group-hover:border-[var(--leaf-green)]",
                    )}
                  >
                    <img
                      src={b.cover}
                      alt={`Cover art for ${b.title} by ${b.authors}`}
                      width={1024}
                      height={768}
                      loading="lazy"
                      className="aspect-[3/4] w-full object-cover"
                    />
                  </span>
                  <span className="mt-2 block text-sm font-semibold leading-snug">
                    {b.title}
                  </span>
                  <span className="block text-xs text-muted-foreground">{b.authors}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Detail panel */}
        <aside className="card-surface h-fit p-4 md:p-5 lg:sticky lg:top-20">
          <img
            src={selected.cover}
            alt={`Cover art for ${selected.title}`}
            width={1024}
            height={768}
            className="aspect-[3/4] w-full rounded-md border border-border object-cover"
          />

          <div className="mt-4 flex flex-wrap gap-2">
            <StatusBadge tone="info">{selected.category}</StatusBadge>
            <StatusBadge>{selected.type}</StatusBadge>
          </div>

          <h2 className="mt-3 text-xl font-bold">{selected.title}</h2>
          <p className="text-sm text-muted-foreground">by {selected.authors}</p>

          <div className="mt-4 grid grid-cols-3 gap-2 rounded-md bg-secondary p-3 text-center">
            {[
              ["Copies", `${selected.copiesAvailable}/${selected.copiesTotal}`],
              ["Language", selected.language],
              ["Pages", `${selected.pages}`],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="text-[11px] tracking-wide text-muted-foreground uppercase">
                  {k}
                </p>
                <p className="text-sm font-semibold">{v}</p>
              </div>
            ))}
          </div>

          <dl className="mt-4 divide-y divide-border text-sm">
            {[
              ["Book ID", selected.bookId],
              ["Publisher (Year)", `${selected.publisher}, ${selected.year}`],
              ["ISBN-13", selected.isbn13],
              ["Status", available ? "Available" : "Out of Stock"],
              [
                selected.type === "Physical" ? "Location" : "File Format",
                selected.type === "Physical"
                  ? (selected.location ?? selected.callNumber)
                  : `${selected.fileFormat ?? "PDF"} (${selected.maxConcurrent ?? 0} slots)`,
              ],
            ].map(([k, v]) => (
              <div key={k} className="flex items-start justify-between gap-3 py-2">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="text-right font-medium break-words">{v}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-3 text-sm text-muted-foreground">{selected.summary}</p>

          <AccentButton
            className="mt-4 w-full"
            disabled={!available}
            onClick={() => toast.success(`Hold request placed for “${selected.title}”`)}
          >
            Reserve
          </AccentButton>
        </aside>
      </div>
    </AppShell>
  );
}