"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Search,
  ClipboardList,
  Calendar,
  BarChart3,
  Trophy,
  Settings,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { getCurrentUser, type UserRole } from "@/lib/mock-auth";

interface MenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const MENU_ITEMS: Record<UserRole, MenuItem[]> = {
  PLAYER: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Teams", href: "/teams", icon: Users },
    { label: "Search Players", href: "/players/search", icon: Search },
    { label: "Schedule", href: "/schedule", icon: Calendar },
    { label: "Settings", href: "/settings", icon: Settings },
  ],
  CAPTAIN: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Team", href: "/team", icon: Users },
    { label: "Requests", href: "/requests", icon: ClipboardList },
    { label: "Schedule", href: "/schedule", icon: Calendar },
    { label: "Search Players", href: "/players/search", icon: Search },
    { label: "Settings", href: "/settings", icon: Settings },
  ],
  ADMINISTRATOR: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Leagues", href: "/leagues", icon: Trophy },
    { label: "Teams", href: "/teams", icon: Users },
    { label: "Schedule", href: "/schedule", icon: Calendar },
    { label: "Reports", href: "/reports", icon: BarChart3 },
    { label: "Settings", href: "/settings", icon: Settings },
  ],
  GAME_OFFICIAL: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Schedule", href: "/schedule", icon: Calendar },
    { label: "Settings", href: "/settings", icon: Settings },
  ],
  FACILITY_MANAGER: [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Schedule", href: "/schedule", icon: Calendar },
    { label: "Settings", href: "/settings", icon: Settings },
  ],
};

export function Sidebar() {
  const [collapsed, setCollapsed] = React.useState(false);
  const [role, setRole] = React.useState<UserRole>("PLAYER");
  const pathname = usePathname();

  React.useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setRole(user.role);
    }
  }, []);

  const items = MENU_ITEMS[role] || MENU_ITEMS.PLAYER;

  return (
    <aside
      className={cn(
        "relative flex h-full flex-col border-r bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full border bg-background shadow-sm hover:bg-accent transition-colors"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </button>

      {/* Menu Items */}
      <nav className="flex-1 space-y-1 p-3 pt-8">
        {items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

Sidebar.displayName = "Sidebar";
