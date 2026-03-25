"use client";

import { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/mock-auth";
import type { MockUser } from "@/lib/mock-auth";
import { searchPlayersAction, type PlayerSearchResult } from "@/app/actions/players";

export default function PlayerSearch() {
  const [user, setUser] = useState<MockUser | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PlayerSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setHasSearched(true);

    const result = await searchPlayersAction(searchQuery);

    if (result.error) {
      setMessage({ type: "error", text: result.error });
      setSearchResults([]);
    } else if (result.results) {
      setSearchResults(result.results);
      if (result.results.length === 0) {
        setMessage({
          type: "error",
          text: "No players found matching your search.",
        });
      }
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
        <h1 className="text-3xl font-bold">Search Players</h1>
        <p className="text-muted-foreground mt-1">
          Find other players by name or email
        </p>
      </div>

      {/* Search Form */}
      <div className="rounded-xl border border-border/50 bg-card p-6">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Search by Name or Email
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter player name or email address..."
              className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !searchQuery.trim()}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
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

      {/* Search Results */}
      {hasSearched && searchResults.length > 0 && (
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">
            Search Results ({searchResults.length})
          </h2>
          <div className="space-y-3">
            {searchResults.map((player) => (
              <div
                key={player.id}
                className="p-4 rounded-lg border border-border/50 bg-background"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{player.displayName}</h3>
                    <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                      <span>Skill: {player.skillLevel}</span>
                      {player.teamName && (
                        <span>Team: {player.teamName}</span>
                      )}
                      <span
                        className={
                          player.status === "Active"
                            ? "text-green-500"
                            : "text-gray-500"
                        }
                      >
                        {player.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Tips */}
      {!hasSearched && (
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Search Tips</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Search by full name or partial name</li>
            <li>• Search by McGill email address</li>
            <li>• Results show active players only</li>
            <li>• View player skill level and current team</li>
          </ul>
        </div>
      )}
    </div>
  );
}
