"use client";

import { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/mock-auth";
import type { MockUser } from "@/lib/mock-auth";
import { getMockTeams, type MockTeam } from "@/lib/mock-data";
import { requestJoinTeamAction } from "@/app/actions/teams";

export default function PlayerTeams() {
  const [user, setUser] = useState<MockUser | null>(null);
  const [teams, setTeams] = useState<MockTeam[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<MockTeam[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [sportFilter, setSportFilter] = useState<string>("ALL");
  const [divisionFilter, setDivisionFilter] = useState<string>("ALL");
  const [showOnlyAccepting, setShowOnlyAccepting] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<MockTeam | null>(null);
  const [joinMessage, setJoinMessage] = useState("");

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    const allTeams = getMockTeams();
    setTeams(allTeams);
    setFilteredTeams(allTeams.filter((t) => t.acceptingMembers));
  }, []);

  useEffect(() => {
    let filtered = teams;

    if (sportFilter !== "ALL") {
      filtered = filtered.filter((t) => t.sport === sportFilter);
    }

    if (divisionFilter !== "ALL") {
      filtered = filtered.filter((t) => t.divisionLevel === divisionFilter);
    }

    if (showOnlyAccepting) {
      filtered = filtered.filter((t) => t.acceptingMembers);
    }

    setFilteredTeams(filtered);
  }, [sportFilter, divisionFilter, showOnlyAccepting, teams]);

  const handleJoinRequest = async (team: MockTeam) => {
    if (!user) return;

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("teamId", team.id);
    formData.append("playerId", user.id);
    formData.append("playerName", user.name);
    formData.append("playerEmail", user.email);
    formData.append("message", joinMessage);

    const result = await requestJoinTeamAction(formData);

    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else if (result.message) {
      setMessage({ type: "success", text: result.message });
      setSelectedTeam(null);
      setJoinMessage("");
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
        <h1 className="text-3xl font-bold">Browse Teams</h1>
        <p className="text-muted-foreground mt-1">
          Find and join teams for the season
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

      {/* Filters */}
      <div className="rounded-xl border border-border/50 bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium mb-2">Sport</label>
            <select
              value={sportFilter}
              onChange={(e) => setSportFilter(e.target.value)}
              className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2"
            >
              <option value="ALL">All Sports</option>
              <option value="SOCCER">Soccer</option>
              <option value="BASKETBALL">Basketball</option>
              <option value="VOLLEYBALL">Volleyball</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Division</label>
            <select
              value={divisionFilter}
              onChange={(e) => setDivisionFilter(e.target.value)}
              className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2"
            >
              <option value="ALL">All Divisions</option>
              <option value="RECREATIONAL">Recreational</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="COMPETITIVE">Competitive</option>
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlyAccepting}
                onChange={(e) => setShowOnlyAccepting(e.target.checked)}
                className="w-4 h-4 rounded border-input"
              />
              <span className="text-sm font-medium">
                Only show teams accepting members
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Teams List */}
      <div className="rounded-xl border border-border/50 bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">
          Available Teams ({filteredTeams.length})
        </h2>
        {filteredTeams.length === 0 ? (
          <p className="text-muted-foreground">
            No teams match your current filters.
          </p>
        ) : (
          <div className="space-y-3">
            {filteredTeams.map((team) => (
              <div
                key={team.id}
                className="p-4 rounded-lg border border-border/50 bg-background"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{team.name}</h3>
                      {team.acceptingMembers ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-500/10 text-green-500 border border-green-500/50">
                          Accepting Members
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-500/10 text-gray-500 border border-gray-500/50">
                          Roster Full
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {team.sport} - {team.divisionLevel}
                    </p>
                    {team.description && (
                      <p className="text-sm mt-2">{team.description}</p>
                    )}
                    <div className="flex gap-4 mt-3 text-sm text-muted-foreground">
                      <span>
                        Roster: {team.currentRosterSize}/{team.maxRosterSize}
                      </span>
                      <span>
                        Record: {team.wins}W-{team.losses}L-{team.ties}T
                      </span>
                      <span>Min. Skill: {team.minimumSkillLevel}</span>
                    </div>
                  </div>
                  {team.acceptingMembers && (
                    <button
                      onClick={() => setSelectedTeam(team)}
                      className="ml-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                      Request to Join
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Join Request Modal */}
      {selectedTeam && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl border border-border/50 p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">
              Request to Join {selectedTeam.name}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Message to Captain (Optional)
                </label>
                <textarea
                  value={joinMessage}
                  onChange={(e) => setJoinMessage(e.target.value)}
                  placeholder="Tell the captain why you want to join..."
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 min-h-[100px]"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleJoinRequest(selectedTeam)}
                  disabled={loading}
                  className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Request"}
                </button>
                <button
                  onClick={() => {
                    setSelectedTeam(null);
                    setJoinMessage("");
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
