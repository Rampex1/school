"use client";

import * as React from "react";
import Link from "next/link";
import {
  Trophy,
  LayoutDashboard,
  Users,
  Search,
  ClipboardList,
  Calendar,
  BarChart3,
  ChevronDown,
  LogOut,
  User,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  getCurrentUser,
  setCurrentUser,
  MOCK_USERS,
  type MockUser,
  type UserRole,
} from "@/lib/mock-auth";

interface NavLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const NAV_LINKS: Record<UserRole, NavLink[]> = {
  PLAYER: [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      label: "Teams",
      href: "/teams",
      icon: <Users className="h-4 w-4" />,
    },
    {
      label: "Search Players",
      href: "/players/search",
      icon: <Search className="h-4 w-4" />,
    },
  ],
  CAPTAIN: [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      label: "My Team",
      href: "/team",
      icon: <Users className="h-4 w-4" />,
    },
    {
      label: "Requests",
      href: "/requests",
      icon: <ClipboardList className="h-4 w-4" />,
    },
  ],
  ADMINISTRATOR: [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      label: "Leagues",
      href: "/leagues",
      icon: <Trophy className="h-4 w-4" />,
    },
    {
      label: "Schedule",
      href: "/schedule",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      label: "Reports",
      href: "/reports",
      icon: <BarChart3 className="h-4 w-4" />,
    },
  ],
  GAME_OFFICIAL: [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      label: "Schedule",
      href: "/schedule",
      icon: <Calendar className="h-4 w-4" />,
    },
  ],
  FACILITY_MANAGER: [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
    },
    {
      label: "Schedule",
      href: "/schedule",
      icon: <Calendar className="h-4 w-4" />,
    },
  ],
};

function getRoleBadgeVariant(
  role: UserRole
): "default" | "secondary" | "destructive" | "outline" {
  switch (role) {
    case "ADMINISTRATOR":
      return "destructive";
    case "CAPTAIN":
      return "default";
    case "PLAYER":
      return "secondary";
    default:
      return "outline";
  }
}

function formatRoleLabel(role: UserRole): string {
  return role
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function Navbar() {
  const [user, setUser] = React.useState<MockUser | null>(null);
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSwitchUser = (mockUser: MockUser) => {
    setCurrentUser(mockUser);
    setUser(mockUser);
    setShowUserMenu(false);
    window.location.reload();
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUser(null);
    setShowUserMenu(false);
  };

  const links = user ? NAV_LINKS[user.role] || [] : [];

  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-white/10">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold tracking-tight">ITMS</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>

        {/* User Section */}
        <div className="flex items-center gap-3" ref={menuRef}>
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent transition-colors"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-sm font-medium">{user.name}</span>
                  <Badge
                    variant={getRoleBadgeVariant(user.role)}
                    className="text-[10px] px-1.5 py-0"
                  >
                    {formatRoleLabel(user.role)}
                  </Badge>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 rounded-md border bg-popover p-1 shadow-lg">
                  <div className="px-3 py-2 border-b border-border mb-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Switch User (MVP Testing)
                    </p>
                  </div>
                  {MOCK_USERS.map((mockUser) => (
                    <button
                      key={mockUser.id}
                      onClick={() => handleSwitchUser(mockUser)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-sm px-3 py-2 text-sm transition-colors hover:bg-accent",
                        user.id === mockUser.id && "bg-accent"
                      )}
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold shrink-0">
                        {mockUser.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="flex flex-col items-start overflow-hidden">
                        <span className="text-sm font-medium truncate w-full">
                          {mockUser.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatRoleLabel(mockUser.role)}
                        </span>
                      </div>
                      {user.id === mockUser.id && (
                        <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
                      )}
                    </button>
                  ))}
                  <div className="border-t border-border mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <User className="h-4 w-4" />
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

Navbar.displayName = "Navbar";
