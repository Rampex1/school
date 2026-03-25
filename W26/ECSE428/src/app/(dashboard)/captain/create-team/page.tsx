"use client";

import { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/mock-auth";
import type { MockUser } from "@/lib/mock-auth";
import { getMockLeagues, type MockLeague } from "@/lib/mock-data";
import { createTeamAction } from "@/app/actions/teams";

export default function CreateTeam() {
  const [user, setUser] = useState<MockUser | null>(null);
  const [leagues, setLeagues] = useState<MockLeague[]>([]);
  const [teamName, setTeamName] = useState("");
  const [selectedLeague, setSelectedLeague] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    const allLeagues = getMockLeagues();
    setLeagues(allLeagues.filter((l) => l.isActive));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("name", teamName);
    formData.append("leagueId", selectedLeague);
    formData.append("userRole", user.role);
    formData.append("userId", user.id);
    formData.append("userEmail", user.email);

    const result = await createTeamAction(formData);

    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else if (result.message) {
      setMessage({ type: "success", text: result.message });
      setTeamName("");
      setSelectedLeague("");
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

  const selectedLeagueData = leagues.find((l) => l.id === selectedLeague);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Create New Team</h1>
        <p className="text-muted-foreground mt-1">
          Register a new team for the current season
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
          {message.type === "success" && (
            <div className="mt-2">
              <a
                href="/captain/teams"
                className="text-sm underline hover:no-underline"
              >
                View your teams
              </a>
            </div>
          )}
        </div>
      )}

      {/* Create Team Form */}
      <div className="rounded-xl border border-border/50 bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Team Information</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Team Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter your team name..."
              className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Choose a unique name for your team
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Select League <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedLeague}
              onChange={(e) => setSelectedLeague(e.target.value)}
              className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2"
              required
            >
              <option value="">Choose a league...</option>
              {leagues.map((league) => (
                <option key={league.id} value={league.id}>
                  {league.name} ({league.currentTeams}/{league.maxTeams} teams)
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground mt-1">
              Select the league you want to join
            </p>
          </div>

          {selectedLeagueData && (
            <div className="p-4 rounded-lg bg-background border border-border/50">
              <h3 className="font-medium mb-2">League Details</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground">Sport:</span>{" "}
                  {selectedLeagueData.sport}
                </p>
                <p>
                  <span className="font-medium text-foreground">Division:</span>{" "}
                  {selectedLeagueData.division}
                </p>
                <p>
                  <span className="font-medium text-foreground">Season:</span>{" "}
                  {selectedLeagueData.season}
                </p>
                <p>
                  <span className="font-medium text-foreground">Duration:</span>{" "}
                  {new Date(selectedLeagueData.startDate).toLocaleDateString()}{" "}
                  - {new Date(selectedLeagueData.endDate).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium text-foreground">
                    Teams Available:
                  </span>{" "}
                  {selectedLeagueData.maxTeams -
                    selectedLeagueData.currentTeams}{" "}
                  spots remaining
                </p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !teamName || !selectedLeague}
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "Creating Team..." : "Create Team"}
          </button>
        </form>
      </div>

      {/* Guidelines */}
      <div className="rounded-xl border border-border/50 bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Team Creation Guidelines</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Team names must be unique within each league</li>
          <li>
            • You will be automatically added as the team captain and first
            roster member
          </li>
          <li>• Teams must have a minimum roster size to participate in games</li>
          <li>
            • You can recruit players by having them request to join your team
          </li>
          <li>• Default roster size is 15 players per team</li>
          <li>
            • After creation, you can manage your team from the Teams page
          </li>
        </ul>
      </div>

      {/* Available Leagues */}
      <div className="rounded-xl border border-border/50 bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">
          Available Leagues ({leagues.length})
        </h2>
        <div className="space-y-3">
          {leagues.map((league) => (
            <div
              key={league.id}
              className="p-4 rounded-lg border border-border/50 bg-background"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{league.name}</h3>
                  <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <p>
                      {league.sport} - {league.division}
                    </p>
                    <p>
                      Teams: {league.currentTeams}/{league.maxTeams}
                    </p>
                    <p>
                      Season:{" "}
                      {new Date(league.startDate).toLocaleDateString()} -{" "}
                      {new Date(league.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {league.currentTeams >= league.maxTeams ? (
                  <span className="px-3 py-1 text-xs rounded-full bg-red-500/10 text-red-500 border border-red-500/50">
                    Full
                  </span>
                ) : (
                  <span className="px-3 py-1 text-xs rounded-full bg-green-500/10 text-green-500 border border-green-500/50">
                    {league.maxTeams - league.currentTeams} spots left
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
