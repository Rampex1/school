"use client";

import { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/mock-auth";
import type { MockUser } from "@/lib/mock-auth";
import { getMockSeasons, type MockSeason } from "@/lib/mock-data";
import { createSeasonAction } from "@/app/actions/seasons";

export default function AdminSeasons() {
  const [user, setUser] = useState<MockUser | null>(null);
  const [seasons, setSeasons] = useState<MockSeason[]>([]);
  const [seasonName, setSeasonName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    const allSeasons = getMockSeasons();
    setSeasons(allSeasons);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("name", seasonName);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("userRole", user.role);

    const result = await createSeasonAction(formData);

    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else if (result.message) {
      setMessage({ type: "success", text: result.message });
      setSeasonName("");
      setStartDate("");
      setEndDate("");
      // Refresh seasons
      const updatedSeasons = getMockSeasons();
      setSeasons(updatedSeasons);
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

  const activeSeasons = seasons.filter((s) => s.isActive);
  const inactiveSeasons = seasons.filter((s) => !s.isActive);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Season Management</h1>
        <p className="text-muted-foreground mt-1">
          Create and manage intramural seasons
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

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Total Seasons
          </h3>
          <p className="mt-2 text-3xl font-bold">{seasons.length}</p>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Active Seasons
          </h3>
          <p className="mt-2 text-3xl font-bold">{activeSeasons.length}</p>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Past Seasons
          </h3>
          <p className="mt-2 text-3xl font-bold">{inactiveSeasons.length}</p>
        </div>
      </div>

      {/* Create Season Form */}
      <div className="rounded-xl border border-border/50 bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Create New Season</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Season Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={seasonName}
              onChange={(e) => setSeasonName(e.target.value)}
              placeholder="e.g., Winter 2026, Fall 2026"
              className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enter a descriptive name for the season
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-2">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !seasonName || !startDate || !endDate}
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "Creating Season..." : "Create Season"}
          </button>
        </form>
      </div>

      {/* Active Seasons */}
      {activeSeasons.length > 0 && (
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">
            Active Seasons ({activeSeasons.length})
          </h2>
          <div className="space-y-3">
            {activeSeasons.map((season) => {
              const now = new Date();
              const start = new Date(season.seasonStart);
              const end = new Date(season.seasonEnd);
              const isOngoing = now >= start && now <= end;
              const isUpcoming = now < start;

              return (
                <div
                  key={season.id}
                  className="p-4 rounded-lg border border-border/50 bg-background"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{season.name}</h3>
                        <span className="px-2 py-1 text-xs rounded-full bg-green-500/10 text-green-500 border border-green-500/50">
                          Active
                        </span>
                        {isOngoing && (
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/50">
                            Ongoing
                          </span>
                        )}
                        {isUpcoming && (
                          <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/50">
                            Upcoming
                          </span>
                        )}
                      </div>
                      <div className="mt-3 grid gap-2 md:grid-cols-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">
                            Registration Period
                          </p>
                          <p className="font-medium">
                            {new Date(
                              season.registrationStart
                            ).toLocaleDateString()}{" "}
                            -{" "}
                            {new Date(
                              season.registrationEnd
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Season Period</p>
                          <p className="font-medium">
                            {new Date(season.seasonStart).toLocaleDateString()}{" "}
                            - {new Date(season.seasonEnd).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Past Seasons */}
      {inactiveSeasons.length > 0 && (
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">
            Past Seasons ({inactiveSeasons.length})
          </h2>
          <div className="space-y-3">
            {inactiveSeasons.map((season) => (
              <div
                key={season.id}
                className="p-4 rounded-lg border border-border/50 bg-background"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{season.name}</h3>
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-500/10 text-gray-500 border border-gray-500/50">
                        Inactive
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      <p>
                        {new Date(season.seasonStart).toLocaleDateString()} -{" "}
                        {new Date(season.seasonEnd).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Guidelines */}
      <div className="rounded-xl border border-border/50 bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Season Creation Guidelines</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>
            • Only one season can be active at a time - close the current season
            before creating a new one
          </li>
          <li>
            • Season start date must be before the end date
          </li>
          <li>
            • Registration periods are automatically set based on season dates
          </li>
          <li>
            • Teams and leagues will be associated with the active season
          </li>
          <li>
            • Consider allowing 2-3 weeks for team registration before season
            start
          </li>
          <li>
            • Typical season lengths: Fall (Sep-Dec), Winter (Jan-Apr), Summer
            (May-Aug)
          </li>
        </ul>
      </div>

      {/* Season Timeline */}
      {activeSeasons.length > 0 && (
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Current Season Timeline</h2>
          {activeSeasons.map((season) => {
            const now = new Date();
            const regStart = new Date(season.registrationStart);
            const regEnd = new Date(season.registrationEnd);
            const seasonStart = new Date(season.seasonStart);
            const seasonEnd = new Date(season.seasonEnd);

            const isRegistrationOpen = now >= regStart && now <= regEnd;
            const isSeasonOngoing = now >= seasonStart && now <= seasonEnd;

            return (
              <div key={season.id} className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border/50">
                  <div>
                    <p className="font-medium">Registration Opens</p>
                    <p className="text-sm text-muted-foreground">
                      {regStart.toLocaleDateString()}
                    </p>
                  </div>
                  {isRegistrationOpen && (
                    <span className="px-2 py-1 text-xs rounded-full bg-green-500/10 text-green-500 border border-green-500/50">
                      Now
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border/50">
                  <div>
                    <p className="font-medium">Registration Closes</p>
                    <p className="text-sm text-muted-foreground">
                      {regEnd.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border/50">
                  <div>
                    <p className="font-medium">Season Starts</p>
                    <p className="text-sm text-muted-foreground">
                      {seasonStart.toLocaleDateString()}
                    </p>
                  </div>
                  {isSeasonOngoing && (
                    <span className="px-2 py-1 text-xs rounded-full bg-green-500/10 text-green-500 border border-green-500/50">
                      In Progress
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-background border border-border/50">
                  <div>
                    <p className="font-medium">Season Ends</p>
                    <p className="text-sm text-muted-foreground">
                      {seasonEnd.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
