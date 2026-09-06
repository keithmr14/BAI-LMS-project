import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, GraduationCap, Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

import { Logo } from "@/components/Logo";
import { Field, PrimaryButton, Stepper, TextInput } from "@/components/Tabbed";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In · The BAI Archives" },
      {
        name: "description",
        content:
          "Sign in to The BAI Archives in two steps: choose your role, then enter your member or staff credentials.",
      },
      { property: "og:title", content: "Sign In · The BAI Archives" },
      {
        property: "og:description",
        content: "Member and librarian sign-in for The BAI Archives library system.",
      },
    ],
  }),
  component: LoginPage,
});

type Role = "user" | "admin";

const credentialsSchema = z.object({
  identifier: z
    .string()
    .trim()
    .nonempty({ message: "Enter your ID or email" })
    .max(64, { message: "ID must be under 64 characters" }),
  password: z
    .string()
    .nonempty({ message: "Enter your password" })
    .min(6, { message: "Password must be at least 6 characters" })
    .max(72, { message: "Password must be under 72 characters" }),
});

const steps = ["Choose role", "Credentials", "Signing in"];

function LoginPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<Role | null>(null);
  const [identifier, setIdentifier] = useState("2023-00145");
  const [password, setPassword] = useState("library");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function pickRole(r: Role) {
    setRole(r);
    setIdentifier(r === "admin" ? "STAFF-0042" : "2023-00145");
    setStep(1);
  }

  function submitCredentials(e: React.FormEvent) {
    e.preventDefault();
    const parsed = credentialsSchema.safeParse({ identifier, password });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        next[String(issue.path[0])] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setStep(2);
    window.setTimeout(() => {
      navigate({ to: role === "admin" ? "/admin/dashboard" : "/user/home" });
    }, 900);
  }

  return (
    <div className="leaf-pattern flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <Link to="/" className="mb-6 flex items-center gap-2.5">
        <Logo size={40} />
        <span className="text-base font-bold text-foreground">The BAI Archives</span>
      </Link>

      <div className="card-surface w-full max-w-md p-7">
        <Stepper steps={steps} current={step} />

        {step === 0 ? (
          <div>
            <h1 className="text-xl font-bold text-foreground">Who is signing in?</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Step 1 of 3 · pick the account type you hold.
            </p>
            <div className="mt-5 grid gap-3">
              <button
                type="button"
                onClick={() => pickRole("user")}
                className="flex items-center gap-3 rounded-md border border-input bg-card p-4 text-left transition-colors hover:border-[var(--leaf-green)] hover:bg-secondary"
              >
                <GraduationCap className="h-6 w-6 text-[var(--leaf-green)]" />
                <span>
                  <span className="block text-sm font-bold text-foreground">User</span>
                  <span className="block text-xs text-muted-foreground">
                    Borrow, renew and manage your own loans
                  </span>
                </span>
                <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
              </button>
              <button
                type="button"
                onClick={() => pickRole("admin")}
                className="flex items-center gap-3 rounded-md border border-input bg-card p-4 text-left transition-colors hover:border-[var(--banana-gold)] hover:bg-secondary"
              >
                <ShieldCheck className="h-6 w-6 text-[var(--banana-gold)]" />
                <span>
                  <span className="block text-sm font-bold text-foreground">
                    Admin (Librarian)
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    Catalog, members, issuing and returns
                  </span>
                </span>
                <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <p className="mt-6 text-center text-xs text-muted-foreground">
              No account yet?{" "}
              <Link to="/register" className="font-semibold text-[var(--leaf-green)]">
                Register as a member
              </Link>
            </p>
          </div>
        ) : null}

        {step === 1 ? (
          <form onSubmit={submitCredentials}>
            <h1 className="text-xl font-bold text-foreground">
              {role === "admin" ? "Librarian credentials" : "Member credentials"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Step 2 of 3 · sample credentials are pre-filled.
            </p>
            <div className="mt-5 space-y-4">
              <Field label={role === "admin" ? "Staff ID" : "Member ID"}>
                <TextInput
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  maxLength={64}
                  autoComplete="username"
                />
                {errors["identifier"] ? (
                  <p className="mt-1 text-xs font-semibold text-[var(--maroon)]">
                    {errors["identifier"]}
                  </p>
                ) : null}
              </Field>
              <Field label="Password">
                <TextInput
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  maxLength={72}
                  autoComplete="current-password"
                />
                {errors["password"] ? (
                  <p className="mt-1 text-xs font-semibold text-[var(--maroon)]">
                    {errors["password"]}
                  </p>
                ) : null}
              </Field>
            </div>
            <div className="mt-6 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStep(0)}
                className="inline-flex h-10 items-center gap-1.5 rounded-md border border-input bg-card px-3 text-sm font-semibold text-foreground hover:bg-secondary"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <PrimaryButton type="submit" className="flex-1">
                Sign in as {role === "admin" ? "Admin" : "User"}
              </PrimaryButton>
            </div>
          </form>
        ) : null}

        {step === 2 ? (
          <div className="py-6 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-[var(--leaf-green)]" />
            <h1 className="mt-4 text-lg font-bold text-foreground">
              Opening your {role === "admin" ? "librarian console" : "library"}…
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Step 3 of 3 · verifying {identifier}
            </p>
            <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--leaf-green)]">
              <CheckCircle2 className="h-4 w-4" /> Credentials accepted
            </p>
          </div>
        ) : null}
      </div>

      <Link to="/" className="mt-6 text-xs font-semibold text-muted-foreground">
        ← Back to the archive home
      </Link>
    </div>
  );
}
