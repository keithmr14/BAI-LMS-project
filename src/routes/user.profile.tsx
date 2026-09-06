import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import {
  AccentButton,
  Field,
  GhostButton,
  Tabbed,
  TextInput,
} from "@/components/Tabbed";
import { currentStudent } from "@/lib/mock-data";

export const Route = createFileRoute("/user/profile")({
  head: () => ({
    meta: [
      { title: "My Profile · BAI Archives" },
      {
        name: "description",
        content:
          "View and update your BAI Archives membership details, contact information and library card photo.",
      },
      { property: "og:title", content: "My Profile · BAI Archives" },
      {
        property: "og:description",
        content: "Membership details and contact information for your library account.",
      },
    ],
  }),
  component: StudentProfile,
});

function StudentProfile() {
  const s = currentStudent;

  return (
    <AppShell role="student" title="Profile" subtitle="Your membership record">
      <Tabbed
        tabs={[
          {
            id: "details",
            label: "Details",
            content: (
              <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
                <div className="card-surface p-5 text-center">
                  <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                    {s.firstName.charAt(0)}
                    {s.lastName.charAt(0)}
                  </span>
                  <h2 className="mt-3 text-lg font-bold">
                    {s.firstName} {s.lastName}
                  </h2>
                  <p className="text-sm text-muted-foreground">{s.userId}</p>
                  <div className="mt-3 flex justify-center gap-2">
                    <StatusBadge>{s.status}</StatusBadge>
                    <StatusBadge tone="info">{s.membershipType}</StatusBadge>
                  </div>
                </div>

                <div className="card-surface p-5">
                  <dl className="grid gap-4 sm:grid-cols-2">
                    {[
                      ["Email", s.email],
                      ["Phone", s.phone],
                      ["Department / Program", s.department],
                      ["Year level", s.yearLevel],
                      ["Books allowed", String(s.maxBooks)],
                      ["Books currently out", String(s.booksOut)],
                      ["Member since", s.joinDate],
                      ["Membership expires", s.expiryDate],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-xs text-muted-foreground uppercase">{k}</dt>
                        <dd className="font-medium break-words">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            ),
          },
          {
            id: "edit",
            label: "Edit",
            content: (
              <form
                className="card-surface max-w-2xl space-y-4 p-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  toast.success("Profile updated");
                }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="First name">
                    <TextInput defaultValue={s.firstName} />
                  </Field>
                  <Field label="Last name">
                    <TextInput defaultValue={s.lastName} />
                  </Field>
                  <Field label="Email">
                    <TextInput defaultValue={s.email} />
                  </Field>
                  <Field label="Phone">
                    <TextInput defaultValue={s.phone} />
                  </Field>
                </div>
                <Field label="Photo">
                  <div className="flex items-center gap-3 rounded-md border border-dashed border-input p-4">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {s.firstName.charAt(0)}
                      {s.lastName.charAt(0)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      nathaniel-ellacer.jpg · 210 KB
                    </span>
                    <GhostButton type="button" className="ml-auto">
                      Replace
                    </GhostButton>
                  </div>
                </Field>
                <AccentButton type="submit">Save changes</AccentButton>
              </form>
            ),
          },
        ]}
      />
    </AppShell>
  );
}
