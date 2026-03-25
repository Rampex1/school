"use client";

import { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/mock-auth";
import type { MockUser } from "@/lib/mock-auth";
import {
  getMockGamesByTeam,
  getMockTeams,
  type MockGame,
  type MockTeam,
  MOCK_AVAILABILITY,
} from "@/lib/mock-data";
import {
  updateAvailabilityAction,
  getPlayerAvailabilityAction,
} from "@/app/actions/players";

export default function PlayerAvailability() {
  const [user, setUser] = useState<MockUser | null>(null);
  const [myTeams, setMyTeams] = useState<MockTeam[]>([]);
  const [upcomingGames, setUpcomingGames] = useState<MockGame[]>([]);
  const [availability, setAvailability] = useState<
    Record<string, "Available" | "Unavailable" | "Maybe">
  >({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

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
      setUpcomingGames(allUpcomingGames);

      // Load existing availability
      const availMap: Record<
        string,
        "Available" | "Unavailable" | "Maybe"
      > = {};
      MOCK_AVAILABILITY.filter((a) => a.playerId === currentUser.id).forEach(
        (a) => {
          if (a.status !== "No Response") {
            availMap[a.gameId] = a.status;
          }
        }
      );
      setAvailability(availMap);
    }
  }, []);

  const handleAvailabilityChange = async (
    gameId: string,
    status: "Available" | "Unavailable" | "Maybe"
  ) => {
    if (!user) return;

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("playerId", user.id);
    formData.append("gameId", gameId);
    formData.append("status", status);

    const result = await updateAvailabilityAction(formData);

    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else if (result.message) {
      setMessage({ type: "success", text: result.message });
      setAvailability((prev) => ({ ...prev, [gameId]: status }));
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manage Availability</h1>
        <p className="text-muted-foreground mt-1">
          Let your teams know when you can play
        </p>
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

      {/* No Teams Message */}
      {myTeams.length === 0 && (
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <p className="text-muted-foreground">
            You are not on any teams yet.{" "}
            <a href="/player/teams" className="text-primary hover:underline">
              Browse teams
            </a>{" "}
            to get started.
          </p>
        </div>
      )}

      {/* Upcoming Games */}
      {upcomingGames.length === 0 && myTeams.length > 0 && (
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <p className="text-muted-foreground">
            No upcoming games scheduled yet.
          </p>
        </div>
      )}

      {upcomingGames.length > 0 && (
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">
            Upcoming Games ({upcomingGames.length})
          </h2>
          <div className="space-y-4">
            {upcomingGames.map((game) => {
              const gameAvailability = availability[game.id];
              return (
                <div
                  key={game.id}
                  className="p-4 rounded-lg border border-border/50 bg-background"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold">
                        {game.homeTeamName} vs {game.awayTeamName}
                      </h3>
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
                        <p>{game.venueName}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-sm font-medium mb-1">
                        Your availability:
                      </p>
                      <button
                        onClick={() =>
                          handleAvailabilityChange(game.id, "Available")
                        }
                        disabled={loading}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                          gameAvailability === "Available"
                            ? "bg-green-500 text-white"
                            : "border border-border/50 hover:bg-accent"
                        }`}
                      >
                        Available
                      </button>
                      <button
                        onClick={() =>
                          handleAvailabilityChange(game.id, "Maybe")
                        }
                        disabled={loading}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                          gameAvailability === "Maybe"
                            ? "bg-yellow-500 text-white"
                            : "border border-border/50 hover:bg-accent"
                        }`}
                      >
                        Maybe
                      </button>
                      <button
                        onClick={() =>
                          handleAvailabilityChange(game.id, "Unavailable")
                        }
                        disabled={loading}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                          gameAvailability === "Unavailable"
                            ? "bg-red-500 text-white"
                            : "border border-border/50 hover:bg-accent"
                        }`}
                      >
                        Unavailable
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="rounded-xl border border-border/50 bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">
          About Availability Tracking
        </h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>
            • Update your availability as early as possible to help your captain
            plan
          </li>
          <li>
            • Your reliability score is based on your attendance and
            availability updates
          </li>
          <li>
            • Captains can see all player availability for better team
            management
          </li>
          <li>
            • You'll receive notifications for upcoming games that need your
            response
          </li>
        </ul>
      </div>
    </div>
  );
}
