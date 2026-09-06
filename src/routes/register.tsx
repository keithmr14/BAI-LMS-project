import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

import { Logo } from "@/components/Logo";
import {
  Field,
  PrimaryButton,
  SelectInput,
  Stepper,
  TextInput,
} from "@/components/Tabbed";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Become a Member · The BAI Archives" },
      {
        name: "description",
        content:
          "Register for a BAI Archives membership in three steps: your details, membership plan, then confirmation with your new member ID.",
      },
      { property: "og:title", content: "Become a Member · The BAI Archives" },
      {
        property: "og:description",
        content:
          "Guest to member in three steps — get a member ID and start borrowing from The BAI Archives.",
      },
    ],
  }),
  component: RegisterPage,
});

const steps = ["Your details", "Membership", "Confirm"];

const detailsSchema = z.object({
  firstName: z.string().trim().nonempty({ message: "First name required" }).max(60),
  lastName: z.string().trim().nonempty({ message: "Last name required" }).max(60),
  email: z
    .string()
    .trim()
    .email({ message: "Enter a valid email" })
    .max(255),
  phone: z
    .string()
    .trim()
    .min(7, { message: "Enter a valid contact number" })
    .max(20),
});

const membershipSchema = z.object({
  department: z.string().trim().nonempty({ message: "Department required" }).max(80),
  password: z
    .string()
    .min(6, { message: "At least 6 characters" })
    .max(72, { message: "Too long" }),
});

function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    firstName: "Miguel",
    lastName: "Santos",
    email: "miguel.santos@bai.edu.ph",
    phone: "0917 442 8890",
    department: "Information Technology",
    plan: "Standard · 3 books",
    password: "library",
  });
  const memberId = "2026-00311";

  const set = (k: keyof typeof form) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  function validate(schema: z.ZodTypeAny, next: number) {
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const e: Record<string, string> = {};
      for (const issue of parsed.error.issues) e[String(issue.path[0])] = issue.message;
      setErrors(e);
      return;
    }
    setErrors({});
    setStep(next);
  }

  const err = (k: string) =>
    errors[k] ? (
      <p className="mt-1 text-xs font-semibold text-[var(--maroon)]">{errors[k]}</p>
    ) : null;

  return (
    <div className="leaf-pattern flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <Link to="/" className="mb-6 flex items-center gap-2.5">
        <Logo size={40} />
        <span className="text-base font-bold text-foreground">The BAI Archives</span>
      </Link>

      <div className="card-surface w-full max-w-lg p-7">
        <Stepper steps={steps} current={Math.min(step, 2)} />

        {step === 0 ? (
          <div>
            <h1 className="text-xl font-bold text-foreground">Tell us who you are</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Step 1 of 3 · guests become users here.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="First name">
                <TextInput
                  value={form.firstName}
                  maxLength={60}
                  onChange={(e) => set("firstName")(e.target.value)}
                />
                {err("firstName")}
              </Field>
              <Field label="Last name">
                <TextInput
                  value={form.lastName}
                  maxLength={60}
                  onChange={(e) => set("lastName")(e.target.value)}
                />
                {err("lastName")}
              </Field>
              <Field label="Email">
                <TextInput
                  type="email"
                  value={form.email}
                  maxLength={255}
                  onChange={(e) => set("email")(e.target.value)}
                />
                {err("email")}
              </Field>
              <Field label="Contact number">
                <TextInput
                  value={form.phone}
                  maxLength={20}
                  onChange={(e) => set("phone")(e.target.value)}
                />
                {err("phone")}
              </Field>
            </div>
            <PrimaryButton
              className="mt-6 w-full"
              onClick={() => validate(detailsSchema, 1)}
            >
              Continue
            </PrimaryButton>
          </div>
        ) : null}

        {step === 1 ? (
          <div>
            <h1 className="text-xl font-bold text-foreground">Membership setup</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Step 2 of 3 · borrowing limits follow your plan.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Department / Program">
                <TextInput
                  value={form.department}
                  maxLength={80}
                  onChange={(e) => set("department")(e.target.value)}
                />
                {err("department")}
              </Field>
              <Field label="Plan">
                <SelectInput
                  value={form.plan}
                  onChange={(e) => set("plan")(e.target.value)}
                >
                  <option>Standard · 3 books</option>
                  <option>Extended · 5 books</option>
                  <option>Digital only · unlimited reads</option>
                </SelectInput>
              </Field>
              <Field label="Password">
                <TextInput
                  type="password"
                  value={form.password}
                  maxLength={72}
                  onChange={(e) => set("password")(e.target.value)}
                />
                {err("password")}
              </Field>
            </div>
            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => setStep(0)}
                className="inline-flex h-10 items-center gap-1.5 rounded-md border border-input bg-card px-3 text-sm font-semibold hover:bg-secondary"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <PrimaryButton
                className="flex-1"
                onClick={() => validate(membershipSchema, 2)}
              >
                Review
              </PrimaryButton>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div>
            <h1 className="text-xl font-bold text-foreground">Confirm your membership</h1>
            <p className="mt-1 text-sm text-muted-foreground">Step 3 of 3</p>
            <dl className="mt-5 divide-y divide-border rounded-md border border-border">
              {[
                ["Name", `${form.firstName} ${form.lastName}`],
                ["Email", form.email],
                ["Contact", form.phone],
                ["Department", form.department],
                ["Plan", form.plan],
                ["Member ID (reserved)", memberId],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 px-4 py-2.5 text-sm">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="text-right font-semibold text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex h-10 items-center gap-1.5 rounded-md border border-input bg-card px-3 text-sm font-semibold hover:bg-secondary"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <PrimaryButton className="flex-1" onClick={() => setStep(3)}>
                Create my account
              </PrimaryButton>
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="py-4 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-[var(--leaf-green)]" />
            <h1 className="mt-4 text-xl font-bold text-foreground">
              Welcome to the grove, {form.firstName}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Your member ID is{" "}
              <span className="font-bold text-foreground">{memberId}</span> · {form.plan}
            </p>
            <div className="mt-6 grid gap-3">
              <PrimaryButton onClick={() => navigate({ to: "/user/home" })}>
                Go to my library
              </PrimaryButton>
              <Link
                to="/login"
                className="text-xs font-semibold text-muted-foreground"
              >
                Sign in instead
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
