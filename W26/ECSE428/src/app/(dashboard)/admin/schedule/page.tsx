"use client";

import { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/mock-auth";
import type { MockUser } from "@/lib/mock-auth";
import {
  getMockGames,
  getMockLeagues,
  getMockTeams,
  type MockGame,
  type MockLeague,
} from "@/lib/mock-data";
import { rescheduleGameAction } from "@/app/actions/schedule";

export default function AdminSchedule() {
  const [user, setUser] = useState<MockUser | null>(null);
  const [games, setGames] = useState<MockGame[]>([]);
  const [leagues, setLeagues] = useState<MockLeague[]>([]);
  const [filteredGames, setFilteredGames] = useState<MockGame[]>([]);
  const [leagueFilter, setLeagueFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedGame, setSelectedGame] = useState<MockGame | null>(null);
  const [newDateTime, setNewDateTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    const allGames = getMockGames();
    const allLeagues = getMockLeagues();
    setGames(allGames);
    setLeagues(allLeagues);
    setFilteredGames(allGames);
  }, []);

  useEffect(() => {
    let filtered = games;

    if (leagueFilter !== "ALL") {
      filtered = filtered.filter((g) => g.leagueId === leagueFilter);
    }

    if (statusFilter !== "ALL") {
      filtered = filtered.filter((g) => g.status === statusFilter);
    }

    // Sort by date
    filtered.sort(
      (a, b) =>
        new Date(a.scheduledDateTime).getTime() -
        new Date(b.scheduledDateTime).getTime()
    );

    setFilteredGames(filtered);
  }, [leagueFilter, statusFilter, games]);

  const handleReschedule = async () => {
    if (!selectedGame || !user) return;

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("gameId", selectedGame.id);
    formData.append("newDateTime", newDateTime);
    formData.append("userRole", user.role);

    const result = await rescheduleGameAction(formData);

    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else if (result.message) {
      setMessage({ type: "success", text: result.message });
      // Update local state
      const updatedGames = games.map((g) =>
        g.id === selectedGame.id ? { ...g, scheduledDateTime: newDateTime } : g
      );
      setGames(updatedGames);
      setSelectedGame(null);
      setNewDateTime("");
    }

    setLoading(false);
  };

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

  const upcomingGames = games.filter(
    (g) => g.status === "SCHEDULED" && new Date(g.scheduledDateTime) > new Date()
  );
  const completedGames = games.filter((g) => g.status === "COMPLETED");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Schedule Management</h1>
          <p className="text-muted-foreground mt-1">
            View and manage game schedules
          </p>
        </div>
        <button
          onClick={() =>
            alert(
              "Schedule New Game feature coming soon! This will allow you to create new games for leagues."
            )
          }
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Schedule New Game
        </button>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`p-4 rounded-lg border ${
            message.type === "success"
              ? "bg-green-500/10 border-green-500/50 text-green-500"
              : "bg-red-500/10 border-red-500/50 text-red-500"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Total Games
          </h3>
          <p className="mt-2 text-3xl font-bold">{games.length}</p>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Upcoming Games
          </h3>
          <p className="mt-2 text-3xl font-bold">{upcomingGames.length}</p>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Completed Games
          </h3>
          <p className="mt-2 text-3xl font-bold">{completedGames.length}</p>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Active Leagues
          </h3>
          <p className="mt-2 text-3xl font-bold">
            {leagues.filter((l) => l.isActive).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-border/50 bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2">League</label>
            <select
              value={leagueFilter}
              onChange={(e) => setLeagueFilter(e.target.value)}
              className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2"
            >
              <option value="ALL">All Leagues</option>
              {leagues.map((league) => (
                <option key={league.id} value={league.id}>
                  {league.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2"
            >
              <option value="ALL">All Status</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Games List */}
      <div className="rounded-xl border border-border/50 bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">
          Games ({filteredGames.length})
        </h2>
        {filteredGames.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No games match your filters.
          </p>
        ) : (
          <div className="space-y-3">
            {filteredGames.map((game) => {
              const isPast = new Date(game.scheduledDateTime) < new Date();
              return (
                <div
                  key={game.id}
                  className="p-4 rounded-lg border border-border/50 bg-background"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">
                          {game.homeTeamName} vs {game.awayTeamName}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs rounded-full border ${
                            game.status === "SCHEDULED"
                              ? "bg-blue-500/10 text-blue-500 border-blue-500/50"
                              : game.status === "COMPLETED"
                              ? "bg-green-500/10 text-green-500 border-green-500/50"
                              : "bg-red-500/10 text-red-500 border-red-500/50"
                          }`}
                        >
                          {game.status}
                        </span>
                        {isPast && game.status === "SCHEDULED" && (
                          <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/50">
                            Needs Update
                          </span>
                        )}
                      </div>
                      <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                        <p>
                          {new Date(game.scheduledDateTime).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </p>
                        <p>
                          {new Date(game.scheduledDateTime).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "numeric",
                              minute: "2-digit",
                            }
                          )}{" "}
                          - {game.durationMinutes} minutes
                        </p>
                        <p>Venue: {game.venueName}</p>
                        {game.status === "COMPLETED" &&
                          game.homeTeamScore !== null &&
                          game.awayTeamScore !== null && (
                            <p className="font-medium">
                              Score: {game.homeTeamScore} - {game.awayTeamScore}
                            </p>
                          )}
                      </div>
                    </div>
                    {game.status === "SCHEDULED" && (
                      <button
                        onClick={() => {
                          setSelectedGame(game);
                          setNewDateTime(
                            game.scheduledDateTime.slice(0, 16)
                          );
                        }}
                        className="ml-4 rounded-lg border border-border/50 px-4 py-2 text-sm font-medium hover:bg-accent"
                      >
                        Reschedule
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      {selectedGame && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl border border-border/50 p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Reschedule Game</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-background border border-border/50">
                <p className="font-semibold">
                  {selectedGame.homeTeamName} vs {selectedGame.awayTeamName}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Current:{" "}
                  {new Date(selectedGame.scheduledDateTime).toLocaleString()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  New Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={newDateTime}
                  onChange={(e) => setNewDateTime(e.target.value)}
                  className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleReschedule}
                  disabled={loading || !newDateTime}
                  className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {loading ? "Rescheduling..." : "Reschedule"}
                </button>
                <button
                  onClick={() => {
                    setSelectedGame(null);
                    setNewDateTime("");
                  }}
                  disabled={loading}
                  className="flex-1 rounded-lg border border-border/50 px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
