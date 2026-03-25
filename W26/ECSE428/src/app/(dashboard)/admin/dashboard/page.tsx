"use client";

import { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/mock-auth";
import type { MockUser } from "@/lib/mock-auth";
import {
  getMockLeagues,
  getMockTeams,
  getMockSeasons,
  getMockGames,
  type MockLeague,
  type MockTeam,
  type MockSeason,
  type MockGame,
} from "@/lib/mock-data";

export default function AdminDashboard() {
  const [user, setUser] = useState<MockUser | null>(null);
  const [leagues, setLeagues] = useState<MockLeague[]>([]);
  const [teams, setTeams] = useState<MockTeam[]>([]);
  const [seasons, setSeasons] = useState<MockSeason[]>([]);
  const [games, setGames] = useState<MockGame[]>([]);
  const [stats, setStats] = useState({
    activeLeagues: 0,
    totalTeams: 0,
    upcomingGames: 0,
    activeSeasons: 0,
  });

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);

    const allLeagues = getMockLeagues();
    const allTeams = getMockTeams();
    const allSeasons = getMockSeasons();
    const allGames = getMockGames();

    setLeagues(allLeagues);
    setTeams(allTeams);
    setSeasons(allSeasons);
    setGames(allGames);

    const activeLeagues = allLeagues.filter((l) => l.isActive).length;
    const upcomingGames = allGames.filter(
      (g) =>
        g.status === "SCHEDULED" && new Date(g.scheduledDateTime) > new Date()
    ).length;
    const activeSeasons = allSeasons.filter((s) => s.isActive).length;

    setStats({
      activeLeagues,
      totalTeams: allTeams.length,
      upcomingGames,
      activeSeasons,
    });
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (user.role !== "ADMINISTRATOR") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl font-semibold">Access Denied</p>
          <p className="text-muted-foreground mt-2">
            This page is only accessible to administrators.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage the intramural sports system
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Active Leagues
          </h3>
          <p className="mt-2 text-3xl font-bold">{stats.activeLeagues}</p>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Total Teams
          </h3>
          <p className="mt-2 text-3xl font-bold">{stats.totalTeams}</p>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Upcoming Games
          </h3>
          <p className="mt-2 text-3xl font-bold">{stats.upcomingGames}</p>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Active Seasons
          </h3>
          <p className="mt-2 text-3xl font-bold">{stats.activeSeasons}</p>
        </div>
      </div>

      {/* Active Leagues */}
      <div className="rounded-xl border border-border/50 bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Active Leagues</h2>
          <a
            href="/admin/leagues"
            className="text-sm text-primary hover:underline"
          >
            View All
          </a>
        </div>
        <div className="space-y-3">
          {leagues
            .filter((l) => l.isActive)
            .slice(0, 5)
            .map((league) => (
              <div
                key={league.id}
                className="p-4 rounded-lg border border-border/50 bg-background"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{league.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {league.sport} - {league.division}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {league.currentTeams}/{league.maxTeams} teams
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {league.season}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Recent Games */}
      <div className="rounded-xl border border-border/50 bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Upcoming Games</h2>
          <a
            href="/admin/schedule"
            className="text-sm text-primary hover:underline"
          >
            View Schedule
          </a>
        </div>
        <div className="space-y-3">
          {games
            .filter(
              (g) =>
                g.status === "SCHEDULED" &&
                new Date(g.scheduledDateTime) > new Date()
            )
            .sort(
              (a, b) =>
                new Date(a.scheduledDateTime).getTime() -
                new Date(b.scheduledDateTime).getTime()
            )
            .slice(0, 5)
            .map((game) => (
              <div
                key={game.id}
                className="p-4 rounded-lg border border-border/50 bg-background"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">
                      {game.homeTeamName} vs {game.awayTeamName}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(game.scheduledDateTime).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{game.venueName}</p>
                    <p className="text-xs text-muted-foreground">
                      {game.durationMinutes} min
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-border/50 bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <a
            href="/admin/seasons"
            className="p-4 rounded-lg border border-border/50 bg-background hover:bg-accent transition-colors"
          >
            <h3 className="font-semibold">Create Season</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Set up a new season
            </p>
          </a>
          <a
            href="/admin/leagues"
            className="p-4 rounded-lg border border-border/50 bg-background hover:bg-accent transition-colors"
          >
            <h3 className="font-semibold">Manage Leagues</h3>
            <p className="text-sm text-muted-foreground mt-1">
              View and edit leagues
            </p>
          </a>
          <a
            href="/admin/schedule"
            className="p-4 rounded-lg border border-border/50 bg-background hover:bg-accent transition-colors"
          >
            <h3 className="font-semibold">Manage Schedule</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Schedule and reschedule games
            </p>
          </a>
        </div>
      </div>

      {/* System Overview */}
      <div className="rounded-xl border border-border/50 bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">System Overview</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Leagues by Sport
            </h3>
            <div className="space-y-2">
              {["SOCCER", "BASKETBALL", "VOLLEYBALL"].map((sport) => {
                const count = leagues.filter((l) => l.sport === sport).length;
                return (
                  <div
                    key={sport}
                    className="flex justify-between text-sm p-2 rounded bg-background"
                  >
                    <span>{sport}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Teams by Division
            </h3>
            <div className="space-y-2">
              {["RECREATIONAL", "INTERMEDIATE", "COMPETITIVE"].map(
                (division) => {
                  const count = teams.filter(
                    (t) => t.divisionLevel === division
                  ).length;
                  return (
                    <div
                      key={division}
                      className="flex justify-between text-sm p-2 rounded bg-background"
                    >
                      <span>{division}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
