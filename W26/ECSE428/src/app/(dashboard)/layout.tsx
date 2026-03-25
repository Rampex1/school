"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getCurrentUser, mockLogout, setCurrentUser, MOCK_USERS, type MockUser } from "@/lib/mock-auth";

const roleNavItems: Record<string, { label: string; href: string }[]> = {
  PLAYER: [
    { label: "Dashboard", href: "/player/dashboard" },
    { label: "Teams", href: "/player/teams" },
    { label: "Search Players", href: "/player/search" },
    { label: "My Profile", href: "/player/profile" },
    { label: "Availability", href: "/player/availability" },
  ],
  CAPTAIN: [
    { label: "Dashboard", href: "/captain/dashboard" },
    { label: "My Teams", href: "/captain/teams" },
    { label: "Join Requests", href: "/captain/requests" },
    { label: "Create Team", href: "/captain/create-team" },
  ],
  ADMINISTRATOR: [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Leagues", href: "/admin/leagues" },
    { label: "Schedule", href: "/admin/schedule" },
    { label: "Seasons", href: "/admin/seasons" },
  ],
  GAME_OFFICIAL: [
    { label: "Dashboard", href: "/player/dashboard" },
    { label: "Assignments", href: "/player/dashboard" },
  ],
  FACILITY_MANAGER: [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Facilities", href: "/admin/dashboard" },
  ],
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<MockUser | null>(null);
  const [showUserSwitcher, setShowUserSwitcher] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      // Auto-login as player for MVP
      setCurrentUser(MOCK_USERS[0]);
      setUser(MOCK_USERS[0]);
    } else {
      setUser(currentUser);
    }
  }, []);

  const navItems = user ? roleNavItems[user.role] || roleNavItems.PLAYER : [];

  const handleLogout = () => {
    mockLogout();
    router.push("/login");
  };

  const switchUser = (mockUser: MockUser) => {
    setCurrentUser(mockUser);
    setUser(mockUser);
    setShowUserSwitcher(false);
    // Redirect to appropriate dashboard
    const dashboardMap: Record<string, string> = {
      PLAYER: "/player/dashboard",
      CAPTAIN: "/captain/dashboard",
      ADMINISTRATOR: "/admin/dashboard",
      GAME_OFFICIAL: "/player/dashboard",
      FACILITY_MANAGER: "/admin/dashboard",
    };
    router.push(dashboardMap[mockUser.role] || "/player/dashboard");
  };

  const roleBadgeColor: Record<string, string> = {
    PLAYER: "bg-blue-500/20 text-blue-400",
    CAPTAIN: "bg-amber-500/20 text-amber-400",
    ADMINISTRATOR: "bg-purple-500/20 text-purple-400",
    GAME_OFFICIAL: "bg-green-500/20 text-green-400",
    FACILITY_MANAGER: "bg-cyan-500/20 text-cyan-400",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">
                    IT
                  </span>
                </div>
                <span className="text-lg font-bold">ITMS</span>
              </Link>

              <div className="hidden md:flex items-center gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 relative">
              {user && (
                <>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      roleBadgeColor[user.role] || ""
                    }`}
                  >
                    {user.role.replace("_", " ")}
                  </span>
                  <button
                    onClick={() => setShowUserSwitcher(!showUserSwitcher)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-accent transition-colors text-sm"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <span className="hidden sm:inline">{user.name}</span>
                  </button>

                  {showUserSwitcher && (
                    <div className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-border bg-card shadow-lg p-2 z-50">
                      <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
                        Switch User (MVP)
                      </div>
                      {MOCK_USERS.slice(0, 6).map((mockUser) => (
                        <button
                          key={mockUser.id}
                          onClick={() => switchUser(mockUser)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-accent transition-colors flex items-center justify-between ${
                            user.id === mockUser.id ? "bg-accent" : ""
                          }`}
                        >
                          <div>
                            <div className="font-medium">{mockUser.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {mockUser.email}
                            </div>
                          </div>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              roleBadgeColor[mockUser.role] || ""
                            }`}
                          >
                            {mockUser.role.replace("_", " ")}
                          </span>
                        </button>
                      ))}
                      <div className="border-t border-border mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
