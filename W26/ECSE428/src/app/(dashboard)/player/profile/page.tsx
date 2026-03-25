"use client";

import { useState, useEffect } from "react";
import { getCurrentUser, setCurrentUser } from "@/lib/mock-auth";
import type { MockUser } from "@/lib/mock-auth";
import { updateSkillLevelAction } from "@/app/actions/players";

export default function PlayerProfile() {
  const [user, setUser] = useState<MockUser | null>(null);
  const [skillLevel, setSkillLevel] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    if (currentUser?.skillLevel) {
      setSkillLevel(currentUser.skillLevel);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("userId", user.id);
    formData.append("skillLevel", skillLevel);

    const result = await updateSkillLevelAction(formData);

    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else if (result.message) {
      setMessage({ type: "success", text: result.message });
      // Update local user state
      const updatedUser = { ...user, skillLevel };
      setUser(updatedUser);
      setCurrentUser(updatedUser);
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
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground mt-1">
          Update your player information
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

      {/* Basic Info (Read Only) */}
      <div className="rounded-xl border border-border/50 bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <div className="h-10 rounded-lg border border-input bg-background/50 px-3 py-2 text-muted-foreground">
              {user.name}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <div className="h-10 rounded-lg border border-input bg-background/50 px-3 py-2 text-muted-foreground">
              {user.email}
            </div>
          </div>
          {user.studentId && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Student ID
              </label>
              <div className="h-10 rounded-lg border border-input bg-background/50 px-3 py-2 text-muted-foreground">
                {user.studentId}
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <div className="h-10 rounded-lg border border-input bg-background/50 px-3 py-2 text-muted-foreground">
              {user.role}
            </div>
          </div>
        </div>
      </div>

      {/* Skill Level Update */}
      <div className="rounded-xl border border-border/50 bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Update Skill Level</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Skill Level
            </label>
            <select
              value={skillLevel}
              onChange={(e) => setSkillLevel(e.target.value)}
              className="w-full h-10 rounded-lg border border-input bg-background px-3 py-2"
              required
            >
              <option value="">Select your skill level</option>
              <option value="BEGINNER">Beginner</option>
              <option value="RECREATIONAL">Recreational</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
              <option value="COMPETITIVE">Competitive</option>
            </select>
            <p className="text-xs text-muted-foreground mt-2">
              Choose the skill level that best matches your abilities. This
              helps teams find players at appropriate levels.
            </p>
          </div>

          <div className="pt-4 border-t border-border/50">
            <h3 className="font-medium mb-3">Skill Level Guide</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div>
                <span className="font-medium text-foreground">Beginner:</span>{" "}
                New to the sport, learning basics
              </div>
              <div>
                <span className="font-medium text-foreground">
                  Recreational:
                </span>{" "}
                Play for fun, basic skills
              </div>
              <div>
                <span className="font-medium text-foreground">
                  Intermediate:
                </span>{" "}
                Solid fundamentals, regular player
              </div>
              <div>
                <span className="font-medium text-foreground">Advanced:</span>{" "}
                Strong skills, experienced player
              </div>
              <div>
                <span className="font-medium text-foreground">
                  Competitive:
                </span>{" "}
                High-level play, tournament experience
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !skillLevel}
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Skill Level"}
          </button>
        </form>
      </div>

      {/* Stats */}
      <div className="rounded-xl border border-border/50 bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Player Stats</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Reliability Score</p>
            <p className="text-2xl font-bold mt-1">
              {user.reliabilityScore || 0}%
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Teams</p>
            <p className="text-2xl font-bold mt-1">
              {user.teamIds?.length || 0}
            </p>
          </div>
          {user.preferredPosition && (
            <div>
              <p className="text-sm text-muted-foreground">
                Preferred Position
              </p>
              <p className="text-2xl font-bold mt-1">{user.preferredPosition}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-muted-foreground">Account Status</p>
            <p className="text-2xl font-bold mt-1">
              {user.isActive ? "Active" : "Inactive"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
