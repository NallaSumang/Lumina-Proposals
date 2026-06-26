"use client";

import { Bell, Search, Command, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { currentUser } from "@/lib/mock";
import { initials } from "@/lib/utils";

const labels: Record<string, string> = {
  dashboard: "Dashboard",
  rfps: "RFPs",
  "knowledge-base": "Knowledge Base",
  documents: "Documents",
  search: "Search",
  analytics: "Analytics",
  notifications: "Notifications",
  settings: "Settings",
  profile: "Profile",
};

export function Topbar() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-xl md:px-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-sm">
        <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">TenderDox</Link>
        {parts.map((p, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            <span className={i === parts.length - 1 ? "font-medium text-foreground" : "text-muted-foreground"}>
              {labels[p] ?? p}
            </span>
          </span>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <button className="hidden h-9 w-72 items-center gap-2 rounded-lg border bg-card px-3 text-sm text-muted-foreground shadow-soft transition hover:border-primary/50 lg:flex">
          <Search className="h-4 w-4" />
          <span className="flex-1 text-left">Search RFPs, answers, docs…</span>
          <kbd className="inline-flex items-center gap-0.5 rounded border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"><Command className="h-2.5 w-2.5" />K</kbd>
        </button>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full p-0.5 transition hover:bg-muted">
              <Avatar className="h-8 w-8"><AvatarFallback>{initials(currentUser.name)}</AvatarFallback></Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="text-sm font-semibold">{currentUser.name}</div>
              <div className="text-xs text-muted-foreground">{currentUser.email}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link href="/profile">Profile</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/settings">Settings</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link href="/notifications">Notifications</Link></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link href="/">Sign out</Link></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
