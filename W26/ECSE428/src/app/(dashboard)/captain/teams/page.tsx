"use client";

import { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/mock-auth";
import type { MockUser } from "@/lib/mock-auth";
import { getMockTeams, type MockTeam } from "@/lib/mock-data";

export default function CaptainTeams() {
  const [user, setUser] = useState<MockUser | null>(null);
  const [captainTeams, setCaptainTeams] = useState<MockTeam[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<MockTeam | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);

    if (currentUser) {
      const allTeams = getMockTeams();
      const myTeams = allTeams.filter((t) => t.captainId === currentUser.id);
      setCaptainTeams(myTeams);
      if (myTeams.length > 0) {
        setSelectedTeam(myTeams[0]);
      }
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Teams</h1>
          <p className="text-muted-foreground mt-1">
            View and manage your team rosters
          </p>
        </div>
        <a
          href="/captain/create-team"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Create New Team
        </a>
      </div>

      {captainTeams.length === 0 ? (
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <p className="text-muted-foreground">
            You don't have any teams yet.{" "}
            <a
              href="/captain/create-team"
              className="text-primary hover:underline"
            >
              Create your first team
            </a>
          </p>
        </div>
      ) : (
        <>
          {/* Team Selection */}
          <div className="rounded-xl border border-border/50 bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Select Team</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {captainTeams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => setSelectedTeam(team)}
                  className={`p-4 rounded-lg border text-left transition-colors ${
                    selectedTeam?.id === team.id
                      ? "border-primary bg-primary/10"
                      : "border-border/50 bg-background hover:bg-accent"
                  }`}
                >
                  <h3 className="font-semibold">{team.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {team.sport} - {team.divisionLevel}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Team Details */}
          {selectedTeam && (
            <>
              <div className="rounded-xl border border-border/50 bg-card p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {selectedTeam.name}
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      Team Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sport:</span>
                        <span className="font-medium">{selectedTeam.sport}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Division:</span>
                        <span className="font-medium">
                          {selectedTeam.divisionLevel}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Gender Req:
                        </span>
                        <span className="font-medium">
                          {selectedTeam.genderRequirement}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Min. Skill:
                        </span>
                        <span className="font-medium">
                          {selectedTeam.minimumSkillLevel}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      Team Stats
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Record:</span>
                        <span className="font-medium">
                          {selectedTeam.wins}W-{selectedTeam.losses}L-
                          {selectedTeam.ties}T
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Points:</span>
                        <span className="font-medium">{selectedTeam.points}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Roster:</span>
                        <span className="font-medium">
                          {selectedTeam.currentRosterSize}/
                          {selectedTeam.maxRosterSize}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <span
                          className={`font-medium ${
                            selectedTeam.acceptingMembers
                              ? "text-green-500"
                              : "text-gray-500"
                          }`}
                        >
                          {selectedTeam.acceptingMembers
                            ? "Accepting Members"
                            : "Roster Full"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Description */}
              <div className="rounded-xl border border-border/50 bg-card p-6">
                <h3 className="text-lg font-semibold mb-4">Team Description</h3>
                {selectedTeam.description ? (
                  <p className="text-muted-foreground">
                    {selectedTeam.description}
                  </p>
                ) : (
                  <p className="text-muted-foreground italic">
                    No description provided yet.
                  </p>
                )}
              </div>

              {/* Roster Management */}
              <div className="rounded-xl border border-border/50 bg-card p-6">
                <h3 className="text-lg font-semibold mb-4">Roster</h3>
                <div className="space-y-3">
                  <div className="p-4 rounded-lg border border-border/50 bg-background">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{user.name} (You)</p>
                        <p className="text-sm text-muted-foreground">Captain</p>
                      </div>
                      <span className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/50">
                        Captain
                      </span>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border border-dashed border-border/50 bg-background/50">
                    <p className="text-center text-sm text-muted-foreground">
                      Full roster management coming soon. For now,{" "}
                      <a
                        href="/captain/requests"
                        className="text-primary hover:underline"
                      >
                        review join requests
                      </a>{" "}
                      to add players to your team.
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="rounded-xl border border-border/50 bg-card p-6">
                <h3 className="text-lg font-semibold mb-4">Team Actions</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  <button
                    onClick={() =>
                      alert(
                        "Team settings feature coming soon! This will allow you to update team description, skill requirements, and roster settings."
                      )
                    }
                    className="p-4 rounded-lg border border-border/50 bg-background hover:bg-accent transition-colors text-left"
                  >
                    <h4 className="font-semibold">Edit Team Settings</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Update description and requirements
                    </p>
                  </button>
                  <a
                    href="/captain/requests"
                    className="p-4 rounded-lg border border-border/50 bg-background hover:bg-accent transition-colors"
                  >
                    <h4 className="font-semibold">Review Join Requests</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Approve or reject player requests
                    </p>
                  </a>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
