"use client";

import { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/mock-auth";
import type { MockUser } from "@/lib/mock-auth";
import {
  getMockTeams,
  getMockGamesByTeam,
  getMockJoinRequests,
  type MockTeam,
  type MockGame,
  type MockJoinRequest,
} from "@/lib/mock-data";

export default function CaptainDashboard() {
  const [user, setUser] = useState<MockUser | null>(null);
  const [captainTeams, setCaptainTeams] = useState<MockTeam[]>([]);
  const [upcomingGames, setUpcomingGames] = useState<MockGame[]>([]);
  const [pendingRequests, setPendingRequests] = useState<MockJoinRequest[]>(
    []
  );

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);

    if (currentUser) {
      // Get teams where user is captain
      const allTeams = getMockTeams();
      const myTeams = allTeams.filter((t) => t.captainId === currentUser.id);
      setCaptainTeams(myTeams);

      // Get upcoming games
      const allUpcomingGames: MockGame[] = [];
      myTeams.forEach((team) => {
        const teamGames = getMockGamesByTeam(team.id).filter(
          (g) =>
            g.status === "SCHEDULED" &&
            new Date(g.scheduledDateTime) > new Date()
        );
        allUpcomingGames.push(...teamGames);
      });
      allUpcomingGames.sort(
        (a, b) =>
          new Date(a.scheduledDateTime).getTime() -
          new Date(b.scheduledDateTime).getTime()
      );
      setUpcomingGames(allUpcomingGames.slice(0, 5));

      // Get pending join requests
      const allRequests = getMockJoinRequests();
      const myPendingRequests = allRequests.filter(
        (r) =>
          r.status === "Pending" &&
          myTeams.some((t) => t.id === r.teamId)
      );
      setPendingRequests(myPendingRequests);
    }
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (user.role !== "CAPTAIN") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl font-semibold">Access Denied</p>
          <p className="text-muted-foreground mt-2">
            This page is only accessible to team captains.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Captain Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage your teams and players
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            My Teams
          </h3>
          <p className="mt-2 text-3xl font-bold">{captainTeams.length}</p>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Pending Requests
          </h3>
          <p className="mt-2 text-3xl font-bold">{pendingRequests.length}</p>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Upcoming Games
          </h3>
          <p className="mt-2 text-3xl font-bold">{upcomingGames.length}</p>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Total Wins
          </h3>
          <p className="mt-2 text-3xl font-bold">
            {captainTeams.reduce((sum, t) => sum + t.wins, 0)}
          </p>
        </div>
      </div>

      {/* Pending Join Requests Alert */}
      {pendingRequests.length > 0 && (
        <div className="rounded-xl border border-yellow-500/50 bg-yellow-500/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-yellow-500">
                {pendingRequests.length} Pending Join Request
                {pendingRequests.length !== 1 ? "s" : ""}
              </h3>
              <p className="text-sm text-yellow-500/80 mt-1">
                Review and respond to player requests to join your teams
              </p>
            </div>
            <a
              href="/captain/requests"
              className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-white hover:bg-yellow-600"
            >
              Review Requests
            </a>
          </div>
        </div>
      )}

      {/* My Teams */}
      <div className="rounded-xl border border-border/50 bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">My Teams</h2>
          <a
            href="/captain/create-team"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Create New Team
          </a>
        </div>
        {captainTeams.length === 0 ? (
          <p className="text-muted-foreground">
            You don't have any teams yet.{" "}
            <a
              href="/captain/create-team"
              className="text-primary hover:underline"
            >
              Create your first team
            </a>
          </p>
        ) : (
          <div className="space-y-3">
            {captainTeams.map((team) => (
              <div
                key={team.id}
                className="p-4 rounded-lg border border-border/50 bg-background"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{team.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {team.sport} - {team.divisionLevel}
                    </p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <span>
                        Roster: {team.currentRosterSize}/{team.maxRosterSize}
                      </span>
                      <span>
                        Record: {team.wins}W-{team.losses}L-{team.ties}T
                      </span>
                      <span>{team.points} points</span>
                    </div>
                  </div>
                  <a
                    href="/captain/teams"
                    className="ml-4 rounded-lg border border-border/50 px-4 py-2 text-sm font-medium hover:bg-accent"
                  >
                    Manage
                  </a>
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
          <p className="text-muted-foreground">No upcoming games scheduled.</p>
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
        )}
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-border/50 bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <a
            href="/captain/requests"
            className="p-4 rounded-lg border border-border/50 bg-background hover:bg-accent transition-colors"
          >
            <h3 className="font-semibold">Review Join Requests</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Approve or reject player requests
            </p>
          </a>
          <a
            href="/captain/teams"
            className="p-4 rounded-lg border border-border/50 bg-background hover:bg-accent transition-colors"
          >
            <h3 className="font-semibold">Manage Teams</h3>
            <p className="text-sm text-muted-foreground mt-1">
              View and manage your team rosters
            </p>
          </a>
          <a
            href="/captain/create-team"
            className="p-4 rounded-lg border border-border/50 bg-background hover:bg-accent transition-colors"
          >
            <h3 className="font-semibold">Create Team</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Register a new team for the season
            </p>
          </a>
          <a
            href="/player/availability"
            className="p-4 rounded-lg border border-border/50 bg-background hover:bg-accent transition-colors"
          >
            <h3 className="font-semibold">View Availability</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Check player availability for games
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
