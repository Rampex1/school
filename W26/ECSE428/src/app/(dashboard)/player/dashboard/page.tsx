"use client";

import { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/mock-auth";
import type { MockUser } from "@/lib/mock-auth";
import {
  getMockTeams,
  getMockGamesByTeam,
  type MockGame,
  type MockTeam,
} from "@/lib/mock-data";

export default function PlayerDashboard() {
  const [user, setUser] = useState<MockUser | null>(null);
  const [myTeams, setMyTeams] = useState<MockTeam[]>([]);
  const [upcomingGames, setUpcomingGames] = useState<MockGame[]>([]);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);

    if (currentUser?.teamIds && currentUser.teamIds.length > 0) {
      const allTeams = getMockTeams();
      const userTeams = allTeams.filter((t) =>
        currentUser.teamIds?.includes(t.id)
      );
      setMyTeams(userTeams);

      // Get upcoming games for user's teams
      const allUpcomingGames: MockGame[] = [];
      userTeams.forEach((team) => {
        const teamGames = getMockGamesByTeam(team.id).filter(
          (g) =>
            g.status === "SCHEDULED" &&
            new Date(g.scheduledDateTime) > new Date()
        );
        allUpcomingGames.push(...teamGames);
      });
      // Sort by date
      allUpcomingGames.sort(
        (a, b) =>
          new Date(a.scheduledDateTime).getTime() -
          new Date(b.scheduledDateTime).getTime()
      );
      setUpcomingGames(allUpcomingGames.slice(0, 5));
    }
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
        <p className="text-muted-foreground mt-1">
          Here's your intramural overview
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            My Teams
          </h3>
          <p className="mt-2 text-3xl font-bold">{myTeams.length}</p>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Skill Level
          </h3>
          <p className="mt-2 text-3xl font-bold">
            {user.skillLevel || "Not Set"}
          </p>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Reliability Score
          </h3>
          <p className="mt-2 text-3xl font-bold">
            {user.reliabilityScore || 0}%
          </p>
        </div>
      </div>

      {/* My Teams */}
      <div className="rounded-xl border border-border/50 bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">My Teams</h2>
        {myTeams.length === 0 ? (
          <p className="text-muted-foreground">
            You are not on any teams yet.{" "}
            <a href="/player/teams" className="text-primary hover:underline">
              Browse teams
            </a>
          </p>
        ) : (
          <div className="space-y-3">
            {myTeams.map((team) => (
              <div
                key={team.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-background"
              >
                <div>
                  <h3 className="font-semibold">{team.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {team.sport} - {team.divisionLevel}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {team.wins}W - {team.losses}L - {team.ties}T
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {team.points} points
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Games */}
      <div className="rounded-xl border border-border/50 bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Upcoming Games</h2>
        {upcomingGames.length === 0 ? (
          <p className="text-muted-foreground">
            No upcoming games scheduled yet.
          </p>
        ) : (
          <div className="space-y-3">
            {upcomingGames.map((game) => (
              <div
                key={game.id}
                className="p-4 rounded-lg border border-border/50 bg-background"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">
                      {game.homeTeamName} vs {game.awayTeamName}
                    </p>
                    <p className="text-sm text-muted-foreground">
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
        )}
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-border/50 bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <a
            href="/player/teams"
            className="p-4 rounded-lg border border-border/50 bg-background hover:bg-accent transition-colors"
          >
            <h3 className="font-semibold">Browse Teams</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Find and join a team
            </p>
          </a>
          <a
            href="/player/availability"
            className="p-4 rounded-lg border border-border/50 bg-background hover:bg-accent transition-colors"
          >
            <h3 className="font-semibold">Update Availability</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Let your team know when you can play
            </p>
          </a>
          <a
            href="/player/search"
            className="p-4 rounded-lg border border-border/50 bg-background hover:bg-accent transition-colors"
          >
            <h3 className="font-semibold">Search Players</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Find other players
            </p>
          </a>
          <a
            href="/player/profile"
            className="p-4 rounded-lg border border-border/50 bg-background hover:bg-accent transition-colors"
          >
            <h3 className="font-semibold">Update Profile</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Edit your skill level and info
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
