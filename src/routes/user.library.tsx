import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { AccentButton, PrimaryButton, Tabbed } from "@/components/Tabbed";
import { currentStudent, fines, loans } from "@/lib/mock-data";

export const Route = createFileRoute("/user/library")({
  head: () => ({
    meta: [
      { title: "My Library · Loans, History & Fines · BAI Archives" },
      {
        name: "description",
        content:
          "Review your active BAI Archives loans and due dates, past returns, and the status of any library fines.",
      },
      { property: "og:title", content: "My Library · Loans, History & Fines" },
      {
        property: "og:description",
        content: "Active loans, renewals, borrowing history and fine payments.",
      },
    ],
  }),
  component: StudentLibrary,
});

const TODAY = new Date("2026-08-31");

function StudentLibrary() {
  const mine = loans.filter((l) => l.studentId === currentStudent.studentId);
  const active = mine.filter((l) => l.status !== "Returned");
  const history = mine.filter((l) => l.status === "Returned");
  const myFines = fines.filter((f) => f.studentId === currentStudent.studentId);

  return (
    <AppShell role="student" title="My Library" subtitle="Everything you have borrowed">
      <Tabbed
        tabs={[
          {
            id: "active",
            label: "Active Loans",
            content: (
              <div className="card-surface overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary text-left text-xs font-semibold uppercase">
                    <tr>
                      <th className="px-4 py-2.5">Title</th>
                      <th className="px-4 py-2.5">Type</th>
                      <th className="px-4 py-2.5">Issued</th>
                      <th className="px-4 py-2.5">Due</th>
                      <th className="px-4 py-2.5">Days left</th>
                      <th className="px-4 py-2.5">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {active.map((l) => {
                      const days = Math.round(
                        (new Date(l.dueDate).getTime() - TODAY.getTime()) / 86400000,
                      );
                      return (
                        <tr key={l.issueId}>
                          <td className="px-4 py-3 font-semibold">{l.bookTitle}</td>
                          <td className="px-4 py-3">
                            <StatusBadge>{l.assetType}</StatusBadge>
                          </td>
                          <td className="px-4 py-3">{l.issueDate}</td>
                          <td className="px-4 py-3">{l.dueDate}</td>
                          <td className="px-4 py-3">
                            <StatusBadge tone={days < 0 ? "danger" : days <= 3 ? "warning" : "success"}>
                              {days < 0 ? `${Math.abs(days)} days overdue` : `${days} days left`}
                            </StatusBadge>
                          </td>
                          <td className="px-4 py-3">
                            <PrimaryButton
                              className="h-8 px-3 text-xs"
                              onClick={() => toast.success(`Renewal requested for “${l.bookTitle}”`)}
                            >
                              Renew
                            </PrimaryButton>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ),
          },
          {
            id: "history",
            label: "History",
            content: (
              <div className="card-surface overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary text-left text-xs font-semibold uppercase">
                    <tr>
                      <th className="px-4 py-2.5">Title</th>
                      <th className="px-4 py-2.5">Issued</th>
                      <th className="px-4 py-2.5">Due</th>
                      <th className="px-4 py-2.5">Returned</th>
                      <th className="px-4 py-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {history.map((l) => (
                      <tr key={l.issueId}>
                        <td className="px-4 py-3 font-semibold">{l.bookTitle}</td>
                        <td className="px-4 py-3">{l.issueDate}</td>
                        <td className="px-4 py-3">{l.dueDate}</td>
                        <td className="px-4 py-3">{l.returnDate}</td>
                        <td className="px-4 py-3">
                          <StatusBadge>{l.status}</StatusBadge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ),
          },
          {
            id: "fines",
            label: "Fines",
            content: (
              <div className="card-surface overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary text-left text-xs font-semibold uppercase">
                    <tr>
                      <th className="px-4 py-2.5">Fine ID</th>
                      <th className="px-4 py-2.5">Title</th>
                      <th className="px-4 py-2.5">Days late</th>
                      <th className="px-4 py-2.5">Amount</th>
                      <th className="px-4 py-2.5">Status</th>
                      <th className="px-4 py-2.5">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {myFines.map((f) => (
                      <tr key={f.fineId}>
                        <td className="px-4 py-3 font-medium">{f.fineId}</td>
                        <td className="px-4 py-3">{f.bookTitle}</td>
                        <td className="px-4 py-3">
                          {f.daysLate} × ${f.ratePerDay.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 font-semibold">${f.amount.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <StatusBadge>{f.paymentStatus}</StatusBadge>
                        </td>
                        <td className="px-4 py-3">
                          {f.paymentStatus === "Unpaid" ? (
                            <AccentButton
                              className="h-8 px-3 text-xs"
                              onClick={() => toast.success(`Payment of $${f.amount.toFixed(2)} submitted`)}
                            >
                              Pay Now
                            </AccentButton>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              Paid {f.paidDate}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ),
          },
        ]}
      />
    </AppShell>
  );
}
