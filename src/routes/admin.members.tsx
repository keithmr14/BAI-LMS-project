import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import {
  AccentButton,
  DangerButton,
  Field,
  GhostButton,
  PrimaryButton,
  SelectInput,
  Stepper,
  Tabbed,
  TextInput,
} from "@/components/Tabbed";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { fines, loans, members, type Member } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/members")({
  head: () => ({
    meta: [
      { title: "Members · Directory & User Entry · BAI Archives LMS" },
      {
        name: "description",
        content:
          "Member directory with membership status, books out and fines owed, plus the three-step User Entry flow for new borrowers.",
      },
      { property: "og:title", content: "Members · Directory & User Entry" },
      {
        property: "og:description",
        content: "Register students and manage library memberships at The BAI Archives.",
      },
    ],
  }),
  component: MembersPage,
});

function MembersPage() {
  return (
    <AppShell
      role="admin"
      title="Members"
      subtitle="Student, faculty and guest borrower records"
    >
      <Tabbed
        tabs={[
          { id: "dir", label: "Users Masterlist", content: <UserList /> },
          // { id: "entry", label: "Add/Edit Member (Entry Flow)", content: <MemberWizard /> },
        ]}
      />
    </AppShell>
  );
}

function initials(m: Member) {
  return `${m.firstName.charAt(0)}${m.lastName.charAt(0)}`;
}

function UserList() {
  const [selected, setSelected] = useState<Member | null>(null);
  const [type, setType] = useState("All");
  const [status, setStatus] = useState("All");

  const rows = members.filter(
    (m) =>
      (type === "All" || m.membershipType === type) &&
      (status === "All" || m.status === status),
  );

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="User type">
          <SelectInput value={type} onChange={(e) => setType(e.target.value)}>
            {["All", "User", "Admin", "Guest"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Status">
          <SelectInput value={status} onChange={(e) => setStatus(e.target.value)}>
            {["All", "Active", "Suspended", "Expired"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </SelectInput>
        </Field>
      </div>

      <div className="mt-5 card-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left text-xs font-semibold text-secondary-foreground uppercase">
              <tr>
                <th className="px-4 py-2.5">Member</th>
                <th className="px-4 py-2.5">User ID</th>
                <th className="px-4 py-2.5">Department</th>
                <th className="px-4 py-2.5">Type</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5">Books Out</th>
                <th className="px-4 py-2.5">Fines Owed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((m) => (
                <tr
                  key={m.userId}
                  onClick={() => setSelected(m)}
                  className="cursor-pointer hover:bg-secondary/60"
                >
                  <td className="flex items-center gap-3 px-4 py-3 font-semibold">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {initials(m)}
                    </span>
                    {m.firstName} {m.lastName}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{m.userId}</td>
                  <td className="px-4 py-3">{m.department}</td>
                  <td className="px-4 py-3">{m.membershipType}</td>
                  <td className="px-4 py-3">
                    <StatusBadge>{m.status}</StatusBadge>
                  </td>
                  <td className="px-4 py-3">
                    {m.booksOut}/{m.maxBooks}
                  </td>
                  <td className="px-4 py-3">
                    {m.finesOwed > 0 ? (
                      <StatusBadge tone="danger">{`$${m.finesOwed.toFixed(2)}`}</StatusBadge>
                    ) : (
                      <span className="text-muted-foreground">$0.00</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {selected ? (
            <>
              <SheetHeader>
                <SheetTitle>
                  {selected.firstName} {selected.lastName}
                </SheetTitle>
                <SheetDescription>
                  {selected.userId} · {selected.department}
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-5 px-4 pb-8 text-sm">
                <div className="flex flex-wrap gap-2">
                  <StatusBadge>{selected.status}</StatusBadge>
                  <StatusBadge tone="info">{selected.membershipType}</StatusBadge>
                </div>
                <dl className="grid grid-cols-2 gap-3">
                  {[
                    ["Email", selected.email],
                    ["Phone", selected.phone],
                    ["Year level", selected.yearLevel],
                    ["Max books", String(selected.maxBooks)],
                    ["Joined", selected.joinDate],
                    ["Expires", selected.expiryDate],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-xs text-muted-foreground uppercase">{k}</dt>
                      <dd className="font-medium break-words">{v}</dd>
                    </div>
                  ))}
                </dl>

                <div>
                  <h3 className="font-bold">Loan history</h3>
                  <ul className="mt-2 divide-y divide-border rounded-md border border-border">
                    {loans
                      .filter((l) => l.userId === selected.userId)
                      .map((l) => (
                        <li
                          key={l.issueId}
                          className="flex items-center justify-between gap-2 px-3 py-2"
                        >
                          <span>
                            {l.bookTitle}
                            <span className="block text-xs text-muted-foreground">
                              due {l.dueDate}
                            </span>
                          </span>
                          <StatusBadge>{l.status}</StatusBadge>
                        </li>
                      ))}
                    {loans.filter((l) => l.userId === selected.userId).length ===
                    0 ? (
                      <li className="px-3 py-2 text-muted-foreground">
                        No loans on record.
                      </li>
                    ) : null}
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold">Fine history</h3>
                  <ul className="mt-2 divide-y divide-border rounded-md border border-border">
                    {fines
                      .filter((f) => f.userId === selected.userId)
                      .map((f) => (
                        <li
                          key={f.fineId}
                          className="flex items-center justify-between gap-2 px-3 py-2"
                        >
                          <span>
                            ${f.amount.toFixed(2)}
                            <span className="block text-xs text-muted-foreground">
                              {f.daysLate} days late · {f.bookTitle}
                            </span>
                          </span>
                          <StatusBadge>{f.paymentStatus}</StatusBadge>
                        </li>
                      ))}
                    {fines.filter((f) => f.userId === selected.userId).length ===
                    0 ? (
                      <li className="px-3 py-2 text-muted-foreground">No fines issued.</li>
                    ) : null}
                  </ul>
                </div>

                <div className="flex gap-3">
                  <PrimaryButton>Edit member</PrimaryButton>
                  <DangerButton>Suspend</DangerButton>
                </div>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function MemberWizard() {
  const [step, setStep] = useState(0);
  const [query, setQuery] = useState("");
  const [done, setDone] = useState(false);
  const match = members.find(
    (m) => m.userId === query.trim() || m.email === query.trim(),
  );

  if (done) {
    return (
      <div className="card-surface mx-auto max-w-lg p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--success)_16%,white)] text-2xl text-[var(--success)]">
          ✓
        </div>
        <h2 className="mt-4 text-lg font-bold">Member committed successfully</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          STUDENT + MEMBERSHIP records inserted · ID 2026-01432 · status Active.
        </p>
        <div className="mt-6 flex justify-center">
          <PrimaryButton
            onClick={() => {
              setDone(false);
              setStep(0);
              setQuery("");
            }}
          >
            Enter another member
          </PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <Stepper steps={["ID / Email Check", "Student Info", "Membership & Review"]} current={step} />

      {step === 0 ? (
        <div className="card-surface space-y-4 p-5">
          <h2 className="font-bold">Step 1 — User ID or email check</h2>
          <Field label="User ID / Email">
            <TextInput
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. 2023-00145 or name@bai.edu"
            />
          </Field>
          {query.trim() ? (
            <p className="rounded-md bg-secondary p-3 text-sm text-secondary-foreground">
              {match
                ? `Exists in DB — student_id ${match.userId} fetched (${match.firstName} ${match.lastName}). Jumping to membership view.`
                : "Not found — a new STUDENT record will be created."}
            </p>
          ) : null}
          <PrimaryButton disabled={!query.trim()} onClick={() => setStep(match ? 2 : 1)}>
            Submit
          </PrimaryButton>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="card-surface space-y-4 p-5">
          <h2 className="font-bold">Step 2 — Student general info</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First name">
              <TextInput defaultValue="Jonas" />
            </Field>
            <Field label="Last name">
              <TextInput defaultValue="Mabini" />
            </Field>
            <Field label="Email">
              <TextInput defaultValue="jonas.m@bai.edu" />
            </Field>
            <Field label="Phone">
              <TextInput defaultValue="+63 917 555 1432" />
            </Field>
            <Field label="Department / Program">
              <TextInput defaultValue="BS Information Systems" />
            </Field>
            <Field label="Year level">
              <SelectInput defaultValue="2nd Year">
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year</option>
                <option>Faculty</option>
              </SelectInput>
            </Field>
          </div>
          <Field label="Photo">
            <div className="flex items-center gap-3 rounded-md border border-dashed border-input p-4">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                JM
              </span>
              <span className="text-sm text-muted-foreground">jonas-mabini.jpg · 180 KB</span>
              <GhostButton className="ml-auto">Replace</GhostButton>
            </div>
          </Field>
          <div className="flex gap-3">
            <GhostButton onClick={() => setStep(0)}>Back</GhostButton>
            <PrimaryButton onClick={() => setStep(2)}>Continue</PrimaryButton>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="card-surface space-y-5 p-5">
          <h2 className="font-bold">Step 3 — Membership info & review</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Membership type">
              <SelectInput defaultValue={match?.membershipType ?? "Standard"}>
                <option>Standard</option>
                <option>Faculty</option>
                <option>Guest</option>
              </SelectInput>
            </Field>
            <Field label="Max books allowed">
              <TextInput defaultValue={String(match?.maxBooks ?? 5)} />
            </Field>
            <Field label="Join date">
              <TextInput type="date" defaultValue={match?.joinDate ?? "2026-08-31"} />
            </Field>
            <Field label="Expiry date">
              <TextInput type="date" defaultValue={match?.expiryDate ?? "2030-06-30"} />
            </Field>
            <Field label="Status">
              <SelectInput defaultValue="Active">
                <option>Active</option>
                <option>Suspended</option>
                <option>Expired</option>
              </SelectInput>
            </Field>
          </div>

          <div className="rounded-lg border border-border bg-[var(--primary-green)] p-4 text-white">
            <p className="text-xs tracking-widest uppercase opacity-80">
              The BAI Archives · Library Card
            </p>
            <div className="mt-3 flex items-center gap-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--banana-gold)] text-lg font-bold text-[var(--charcoal-text)]">
                {match ? initials(match) : "JM"}
              </span>
              <div>
                <p className="text-lg font-bold">
                  {match ? `${match.firstName} ${match.lastName}` : "Jonas Mabini"}
                </p>
                <p className="text-sm opacity-85">
                  {match?.userId ?? "2026-01432"} ·{" "}
                  {match?.department ?? "BS Information Systems"}
                </p>
                <p className="mt-2 font-mono text-xs tracking-[0.3em] opacity-90">
                  ||I|||I|I||II|I|||I||
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <GhostButton onClick={() => setStep(match ? 0 : 1)}>Back</GhostButton>
            <AccentButton onClick={() => setDone(true)}>Submit</AccentButton>
          </div>
        </div>
      ) : null}
    </div>
  );
}
