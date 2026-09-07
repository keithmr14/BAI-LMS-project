import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Clock, Leaf, Library, Sparkles } from "lucide-react";

import { Logo } from "@/components/Logo";
import { books, kpis } from "@/lib/mock-data";

const stats = [
  { label: "Titles held", value: kpis.totalBooks.toLocaleString() },
  { label: "Active loans", value: kpis.activeIssues },
  { label: "Members", value: kpis.totalMembers.toLocaleString() },
  { label: "Overdue", value: kpis.overdueBooks },
];
import heroImage from "@/assets/hero-banana-archive.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The BAI Archives · Books of Art and Intelligence" },
      {
        name: "description",
        content:
          "A banana-grove library of art and intelligence. Browse featured titles, opening hours and collections, then sign in as a member or librarian.",
      },
      { property: "og:title", content: "The BAI Archives · Books of Art and Intelligence" },
      {
        property: "og:description",
        content:
          "Featured shelves, new arrivals and live collection stats from The BAI Archives library.",
      },
    ],
  }),
  component: HeroPage,
});

const hours = [
  { day: "Monday – Friday", time: "8:00 AM – 7:00 PM" },
  { day: "Saturday", time: "9:00 AM – 5:00 PM" },
  { day: "Sunday", time: "Closed · digital shelves open" },
];

function HeroPage() {
  const featured = books.slice(0, 4);
  const arrivals = books.slice(4, 8);

  return (
    <div className="min-h-screen bg-background">
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 md:px-8">
          <div className="flex items-center gap-2.5 text-white">
            <Logo size={38} />
            <span className="text-base font-bold tracking-tight">
              The BAI Archives
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/register"
              className="hidden h-10 items-center rounded-md border border-white/40 px-4 text-sm font-semibold text-white transition-colors hover:bg-white/10 sm:flex"
            >
              Create account
            </Link>
            <Link
              to="/login"
              className="flex h-10 items-center rounded-md bg-[var(--banana-gold)] px-4 text-sm font-bold text-[var(--charcoal-text)] transition-all hover:brightness-95"
            >
              Sign in
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <img
          src={heroImage}
          alt="Banana grove reading sanctuary with an old maroon-bound book on a wooden table"
          width={1920}
          height={1088}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary-green)]/92 via-[var(--primary-green)]/75 to-[var(--maroon)]/55" />
        <div className="leaf-veins absolute inset-0 opacity-40" />

        <div className="relative mx-auto max-w-6xl px-4 pt-32 pb-20 md:px-8 md:pt-40 md:pb-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--banana-gold)]/60 bg-[var(--banana-gold)]/15 px-3 py-1.5 text-xs font-bold tracking-wide text-[var(--banana-gold)] uppercase">
            <Leaf className="h-3.5 w-3.5" /> Books of Art &amp; Intelligence
          </span>
          <h1 className="mt-5 max-w-3xl text-4xl leading-[1.05] font-extrabold text-white md:text-6xl">
            Welcome to,
            <span className="block text-[var(--banana-gold)]">
              the BAI Archives.
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-white/85 md:text-lg">
            Physical and digital collections under the banana canopy. 
            4,000+ titles, member loans, reservations and fines, all in one archive.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/login"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-[var(--banana-gold)] px-6 text-sm font-bold text-[var(--charcoal-text)] transition-all hover:brightness-95"
            >
              Sign in to the archive <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/register"
              className="inline-flex h-12 items-center gap-2 rounded-md border border-white/45 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Become a member
            </Link>
          </div>

          <p className="mt-4 text-xs text-white/70">
            Guests may browse this page freely · borrowing requires a member account
          </p>

          {/* <dl className="mt-12 grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-4">
            {stats.map((k) => (
              <div
                key={k.label}
                className="rounded-lg border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm"
              >
                <dt className="text-[11px] font-semibold tracking-wide text-white/70 uppercase">
                  {k.label}
                </dt>
                <dd className="mt-1 text-2xl font-extrabold text-white">{k.value}</dd>
              </div>
            ))}
          </dl> */}
        </div>

        <div className="banana-frieze h-3 w-full" />
      </section>

      {/* Featured shelves */}
      <section className="leaf-pattern">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="flex items-center gap-2 text-2xl font-bold text-foreground md:text-3xl">
                 Featured books
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Hand-picked by our librarians this week
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((b) => (
              <article key={b.bookId} className="card-surface overflow-hidden">
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
                  <img
                    src={b.cover}
                    alt={b.title}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-bold text-[var(--primary-green)] backdrop-blur-sm">
                    {b.type}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-sm leading-snug font-bold text-foreground">
                    {b.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">{b.authors}</p>
                  <p className="mt-3 text-[11px] font-semibold tracking-wide text-[var(--leaf-green)] uppercase">
                    {b.category}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <h2 className="mt-14 flex items-center gap-2 text-2xl font-bold text-foreground md:text-3xl">
            <BookOpen className="h-5 w-5 text-[var(--leaf-green)]" /> New arrivals
          </h2>
          <ul className="mt-5 grid gap-3 md:grid-cols-2">
            {arrivals.map((b) => (
              <li
                key={b.bookId}
                className="card-surface flex items-center gap-4 p-4"
              >
                <img
                  src={b.cover}
                  alt={b.title}
                  className="h-16 w-12 shrink-0 rounded-sm object-cover shadow-sm"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-foreground">{b.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {b.authors} · {b.year} · {b.publisher}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Hours + collections */}
      <section className="bg-card">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-2 md:px-8">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold text-foreground">
              <Clock className="h-5 w-5 text-[var(--leaf-green)]" /> Opening hours
            </h2>
            <ul className="mt-5 divide-y divide-border">
              {hours.map((h) => (
                <li key={h.day} className="flex justify-between py-3 text-sm">
                  <span className="font-semibold text-foreground">{h.day}</span>
                  <span className="text-muted-foreground">{h.time}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg bg-[var(--primary-green)] p-7 text-white">
            <h2 className="flex items-center gap-2 text-xl font-bold">
              <Library className="h-5 w-5 text-[var(--banana-gold)]" /> Three ways in
            </h2>
            <ul className="mt-5 space-y-4 text-sm">
              <li>
                <p className="font-bold text-[var(--banana-gold)]">Guest</p>
                <p className="text-white/80">
                  Read about the archive on this page. No catalog or loans.
                </p>
              </li>
              <li>
                <p className="font-bold text-[var(--banana-gold)]">User</p>
                <p className="text-white/80">
                  Browse the catalog, borrow, renew, and settle fines.
                </p>
              </li>
              <li>
                <p className="font-bold text-[var(--banana-gold)]">Admin</p>
                <p className="text-white/80">
                  Catalog books, register members, issue and receive returns.
                </p>
              </li>
            </ul>
            <Link
              to="/login"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-md bg-[var(--banana-gold)] px-5 text-sm font-bold text-[var(--charcoal-text)]"
            >
              Continue to sign in <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-[var(--charcoal-text)] text-white/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs md:flex-row md:items-center md:justify-between md:px-8">
          <p className="font-semibold text-white">
            The BAI Archives · Books of Art and Intelligence
          </p>
          <p>© 2026 BAI company. All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}
