"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard, FileText, BookOpen, FolderOpen, Search, BarChart3,
  Bell, Settings, User, ChevronsLeft, ChevronsRight, Sparkles, ChevronDown, Plus,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/rfps", label: "RFPs", icon: FileText, badge: "7" },
  { href: "/knowledge-base", label: "Knowledge Base", icon: BookOpen },
  { href: "/documents", label: "Documents", icon: FolderOpen },
  { href: "/search", label: "Search", icon: Search },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];
const footerNav = [
  { href: "/notifications", label: "Notifications", icon: Bell, badge: "3" },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/profile", label: "Profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 248 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="sticky top-0 hidden h-screen shrink-0 border-r bg-card md:flex md:flex-col"
    >
      {/* Brand + Workspace */}
      <div className="flex h-16 items-center gap-2 border-b px-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent text-white shadow-soft">
          <Sparkles className="h-4 w-4" />
        </div>
        {!collapsed && (
          <button className="flex flex-1 items-center justify-between rounded-lg px-2 py-1 hover:bg-muted">
            <div className="text-left">
              <p className="text-sm font-semibold leading-tight">Acme Inc.</p>
              <p className="text-[10px] text-muted-foreground">Enterprise · 24 seats</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* New RFP */}
      <div className="p-3">
        <Button className={cn("w-full", collapsed && "px-0")} size={collapsed ? "icon" : "default"}>
          <Plus className="h-4 w-4" />{!collapsed && <span>New RFP</span>}
        </Button>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2">
        {nav.map((item) => (
          <NavLink key={item.href} item={item} active={pathname.startsWith(item.href)} collapsed={collapsed} />
        ))}
      </nav>

      {/* Footer nav */}
      <div className="border-t p-2 space-y-0.5">
        {footerNav.map((item) => (
          <NavLink key={item.href} item={item} active={pathname.startsWith(item.href)} collapsed={collapsed} />
        ))}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
        >
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : <><ChevronsLeft className="h-4 w-4" /> Collapse</>}
        </button>
      </div>
    </motion.aside>
  );
}

function NavLink({ item, active, collapsed }: {
  item: { href: string; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string };
  active: boolean; collapsed: boolean;
}) {
  const link = (
    <Link
      href={item.href}
      className={cn(
        "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
        active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <item.icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
      {!collapsed && item.badge && (
        <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary">{item.badge}</span>
      )}
      {active && <motion.span layoutId="active-pill" className="absolute inset-y-1 left-0 w-0.5 rounded-r-full bg-primary" />}
    </Link>
  );
  if (!collapsed) return link;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  );
}
