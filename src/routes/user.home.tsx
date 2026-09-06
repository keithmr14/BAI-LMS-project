import { createFileRoute, Link } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { currentStudent, fines, loans } from "@/lib/mock-data";

export const Route = createFileRoute("/user/home")({
  head: () => ({
    meta: [
      { title: "My Library Home · BAI Archives" },
      {
        name: "description",
        content:
          "Your BAI Archives dashboard: books currently out, items due soon, and fines owed at a glance.",
      },
      { property: "og:title", content: "My Library Home · BAI Archives" },
      {
        property: "og:description",
        content: "Track your loans, due dates and fines at The BAI Archives.",
      },
    ],
  }),
  component: StudentHome,
});

function StudentHome() {
  const mine = loans.filter(
    (l) => l.userId === currentStudent.userId && l.status !== "Returned",
  );
  const dueSoon = mine.filter((l) => l.dueDate <= "2026-09-07").length;
  const owed = fines
    .filter((f) => f.userId === currentStudent.userId && f.paymentStatus === "Unpaid")
    .reduce((s, f) => s + f.amount, 0);

  return (
    <AppShell role="student" title={`How are you, ${currentStudent.firstName}`} subtitle="Here's where your borrowing stands today">
      <section className="leaf-pattern card-surface overflow-hidden p-6">
        <p className="text-xs font-semibold tracking-widest text-[var(--leaf-green)] uppercase">
          The BAI Archives
        </p>
        <h2 className="mt-2 max-w-lg text-2xl font-bold">
          Books of Art and Intelligence — open for study until 7:00 PM
        </h2>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          {currentStudent.department} · Member since {currentStudent.joinDate} · Limit{" "}
          {currentStudent.maxBooks} books
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/student/catalog"
            className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-[var(--leaf-green)]"
          >
            Browse catalog
          </Link>
          <Link
            to="/student/library"
            className="inline-flex h-10 items-center rounded-md bg-[var(--banana-gold)] px-4 text-sm font-semibold text-[var(--charcoal-text)] hover:brightness-95"
          >
            My loans
          </Link>
        </div>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {[
          ["Books currently out", `${mine.length}`, "var(--primary-green)"],
          ["Due soon (7 days)", `${dueSoon}`, "#7a5c00"],
          ["Fines owed", `$${owed.toFixed(2)}`, owed > 0 ? "var(--maroon)" : "var(--success)"],
        ].map(([label, value, color]) => (
          <div key={label} className="card-surface p-4">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              {label}
            </p>
            <p className="mt-2 text-2xl font-bold" style={{ color }}>
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 card-surface overflow-hidden">
        <h2 className="border-b border-border px-4 py-3 text-sm font-bold">
          Your active loans
        </h2>
        <ul className="divide-y divide-border">
          {mine.map((l) => (
            <li key={l.issueId} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
              <span>
                <span className="font-semibold">{l.bookTitle}</span>
                <span className="block text-xs text-muted-foreground">
                  {l.assetType} · due {l.dueDate}
                </span>
              </span>
              <StatusBadge>{l.status}</StatusBadge>
            </li>
          ))}
        </ul>
      </div>
    </AppShell>
  );
}
