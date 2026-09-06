import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, ChevronDown, LogOut, Search, User } from "lucide-react";
import type { ReactNode } from "react";

import { Logo } from "@/components/Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { notifications } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type NavItem = { label: string; to: string };

const adminNav: NavItem[] = [
  { label: "Dashboard", to: "/admin/dashboard" },
  { label: "Books", to: "/admin/books" },
  { label: "Members", to: "/admin/members" },
  { label: "Circulation", to: "/admin/circulation" },
];

const userNav: NavItem[] = [
  { label: "Home", to: "/user/home" },
  { label: "Catalog", to: "/user/catalog" },
  { label: "My Library", to: "/user/library" },
  { label: "Profile", to: "/user/profile" },
];

export function AppShell({
  role,
  title,
  subtitle,
  children,
}: {
  role: "admin" | "user";
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const nav = role === "admin" ? adminNav : userNav;
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const who = role === "admin" ? "M. Fajardo · Admin" : "Andrea Villanueva · User";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-primary text-primary-foreground">
        <div className="flex h-16 items-center gap-4 px-4 md:px-6">
          <Link to={nav[0]!.to} className="flex items-center gap-2.5">
            <Logo size={34} />
            <span className="hidden text-lg font-bold tracking-tight sm:inline">
              BAI
              <span className="ml-2 text-xs font-medium opacity-75">Archives</span>
            </span>
          </Link>

          {/* <div className="relative ml-2 flex-1 max-w-xl">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 opacity-70" />
            <input
              type="search"
              placeholder={
                role === "admin"
                  ? "Search books, members, records…"
                  : "Search the catalog…"
              }
              className="h-10 w-full rounded-md border border-white/20 bg-white/10 pl-9 pr-3 text-sm text-primary-foreground placeholder:text-white/60 focus:border-[var(--banana-gold)] focus:outline-none"
            />
          </div> */}
          <div className="ml-auto flex items-center gap-4">
            <Popover>
              <PopoverTrigger className="relative rounded-md p-2 hover:bg-white/10">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--banana-gold)] px-1 text-[11px] font-bold text-[var(--charcoal-text)]">
                  {notifications.length}
                </span>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0">
                <p className="border-b border-border px-4 py-2.5 text-sm font-semibold">
                  Notifications
                </p>
                <ul className="divide-y divide-border">
                  {notifications.map((n) => (
                    <li key={n.id} className="px-4 py-3 text-sm text-foreground">
                      {n.text}
                    </li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-md p-1.5 hover:bg-white/10">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--banana-gold)] text-sm font-bold text-[var(--charcoal-text)]">
                  {role === "admin" ? "MF" : "NE"}
                </span>
                <ChevronDown className="hidden h-4 w-4 sm:block" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <p className="px-2 py-1.5 text-xs text-muted-foreground">{who}</p>
                <DropdownMenuItem asChild>
                  <Link to={role === "admin" ? "/admin/dashboard" : "/user/profile"}>
                    <User className="mr-2 h-4 w-4" /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/login">
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="hidden w-56 shrink-0 border-r border-border bg-card md:block">
          <nav className="sticky top-16 flex flex-col gap-1 p-3">
            {nav.map((item) => {
              const active = pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "rounded-md px-3 py-2.5 text-sm font-semibold transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-secondary hover:text-[var(--leaf-green)]",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <div className="flex gap-1 overflow-x-auto border-b border-border bg-card p-2 md:hidden">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-semibold whitespace-nowrap",
                  pathname.startsWith(item.to)
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="px-4 py-6 md:px-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">{title}</h1>
              {subtitle ? (
                <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
              ) : null}
            </div>
            {children}
          </div>
        </main>
      </div>

      <footer className="bg-primary text-primary-foreground">
        <div className="flex flex-col gap-2 px-4 py-4 text-xs md:flex-row md:items-center md:justify-between md:px-8">
          <p className="font-semibold">
            BAI Archives · Books of Art and Intelligence
          </p>
          <p className="opacity-85"></p>
          {/* <div className="flex gap-4 opacity-85">
            <Link to={role === "admin" ? "/admin/books" : "/user/catalog"}></Link>
            <span>Help</span>
            <span>Privacy</span>
          </div> */}
        </div>
      </footer>
    </div>
  );
}
