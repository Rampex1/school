"use client";

import { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/mock-auth";
import type { MockUser } from "@/lib/mock-auth";
import { getMockLeagues, getMockTeams, type MockLeague } from "@/lib/mock-data";

export default function AdminLeagues() {
  const [user, setUser] = useState<MockUser | null>(null);
  const [leagues, setLeagues] = useState<MockLeague[]>([]);
  const [filteredLeagues, setFilteredLeagues] = useState<MockLeague[]>([]);
  const [sportFilter, setSportFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedLeague, setSelectedLeague] = useState<MockLeague | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    const allLeagues = getMockLeagues();
    setLeagues(allLeagues);
    setFilteredLeagues(allLeagues);
  }, []);

  useEffect(() => {
    let filtered = leagues;

    if (sportFilter !== "ALL") {
      filtered = filtered.filter((l) => l.sport === sportFilter);
    }

    if (statusFilter === "ACTIVE") {
      filtered = filtered.filter((l) => l.isActive);
    } else if (statusFilter === "INACTIVE") {
      filtered = filtered.filter((l) => !l.isActive);
    }

    setFilteredLeagues(filtered);
  }, [sportFilter, statusFilter, leagues]);

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">League Management</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all leagues
          </p>
        </div>
        <button
          onClick={() =>
            alert(
              "Create League feature coming soon! This will allow you to create new leagues for different sports and divisions."
            )
          }
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Create League
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Total Leagues
          </h3>
          <p className="mt-2 text-3xl font-bold">{leagues.length}</p>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Active Leagues
          </h3>
          <p className="mt-2 text-3xl font-bold">
            {leagues.filter((l) => l.isActive).length}
          </p>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Total Teams
          </h3>
          <p className="mt-2 text-3xl font-bold">
            {leagues.reduce((sum, l) => sum + l.currentTeams, 0)}
          </p>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Available Spots
          </h3>
          <p className="mt-2 text-3xl font-bold">
            {leagues.reduce((sum, l) => sum + (l.maxTeams - l.currentTeams), 0)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-border/50 bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid gap-4 md:grid-cols-2">
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
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active Only</option>
              <option value="INACTIVE">Inactive Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leagues List */}
      <div className="rounded-xl border border-border/50 bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">
          Leagues ({filteredLeagues.length})
        </h2>
        {filteredLeagues.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No leagues match your filters.
          </p>
        ) : (
          <div className="space-y-3">
            {filteredLeagues.map((league) => (
              <div
                key={league.id}
                className="p-4 rounded-lg border border-border/50 bg-background"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">{league.name}</h3>
                      {league.isActive ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-500/10 text-green-500 border border-green-500/50">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-500/10 text-gray-500 border border-gray-500/50">
                          Inactive
                        </span>
                      )}
                      {league.currentTeams >= league.maxTeams && (
                        <span className="px-2 py-1 text-xs rounded-full bg-red-500/10 text-red-500 border border-red-500/50">
                          Full
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {league.sport} - {league.division}
                    </p>
                    <div className="flex gap-4 mt-3 text-sm">
                      <span>
                        Teams: {league.currentTeams}/{league.maxTeams}
                      </span>
                      <span>Season: {league.season}</span>
                      <span>
                        {new Date(league.startDate).toLocaleDateString()} -{" "}
                        {new Date(league.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedLeague(league)}
                    className="ml-4 rounded-lg border border-border/50 px-4 py-2 text-sm font-medium hover:bg-accent"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* League Details Modal */}
      {selectedLeague && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl border border-border/50 p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">
                  {selectedLeague.name}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  League Details
                </p>
              </div>
              <button
                onClick={() => setSelectedLeague(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 rounded-lg bg-background border border-border/50">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    League Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sport:</span>
                      <span className="font-medium">{selectedLeague.sport}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Division:</span>
                      <span className="font-medium">
                        {selectedLeague.division}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Season:</span>
                      <span className="font-medium">
                        {selectedLeague.season}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span
                        className={
                          selectedLeague.isActive
                            ? "text-green-500 font-medium"
                            : "text-gray-500 font-medium"
                        }
                      >
                        {selectedLeague.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-background border border-border/50">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Team Capacity
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Current Teams:
                      </span>
                      <span className="font-medium">
                        {selectedLeague.currentTeams}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Max Teams:</span>
                      <span className="font-medium">
                        {selectedLeague.maxTeams}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Available:</span>
                      <span className="font-medium">
                        {selectedLeague.maxTeams - selectedLeague.currentTeams}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Capacity:</span>
                      <span className="font-medium">
                        {Math.round(
                          (selectedLeague.currentTeams /
                            selectedLeague.maxTeams) *
                            100
                        )}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-background border border-border/50">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Schedule
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start Date:</span>
                    <span className="font-medium">
                      {new Date(selectedLeague.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">End Date:</span>
                    <span className="font-medium">
                      {new Date(selectedLeague.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() =>
                    alert("Edit league functionality coming soon!")
                  }
                  className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Edit League
                </button>
                <button
                  onClick={() => setSelectedLeague(null)}
                  className="flex-1 rounded-lg border border-border/50 px-4 py-2 text-sm font-medium hover:bg-accent"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
