"use client";

import { useState, useEffect } from "react";
import { getCurrentUser } from "@/lib/mock-auth";
import type { MockUser } from "@/lib/mock-auth";
import {
  getMockTeams,
  getMockJoinRequests,
  type MockTeam,
  type MockJoinRequest,
} from "@/lib/mock-data";
import { reviewJoinRequestAction } from "@/app/actions/teams";

export default function CaptainRequests() {
  const [user, setUser] = useState<MockUser | null>(null);
  const [captainTeams, setCaptainTeams] = useState<MockTeam[]>([]);
  const [allRequests, setAllRequests] = useState<MockJoinRequest[]>([]);
  const [pendingRequests, setPendingRequests] = useState<MockJoinRequest[]>([]);
  const [reviewedRequests, setReviewedRequests] = useState<MockJoinRequest[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "reviewed">("pending");

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);

    if (currentUser) {
      const allTeams = getMockTeams();
      const myTeams = allTeams.filter((t) => t.captainId === currentUser.id);
      setCaptainTeams(myTeams);

      const requests = getMockJoinRequests();
      const myRequests = requests.filter((r) =>
        myTeams.some((t) => t.id === r.teamId)
      );
      setAllRequests(myRequests);
      setPendingRequests(myRequests.filter((r) => r.status === "Pending"));
      setReviewedRequests(
        myRequests.filter((r) => r.status !== "Pending")
      );
    }
  }, []);

  const handleReviewRequest = async (
    request: MockJoinRequest,
    action: "approve" | "reject"
  ) => {
    if (!user) return;

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("requestId", request.id);
    formData.append("action", action);
    formData.append("captainId", user.id);
    formData.append("userRole", user.role);

    const result = await reviewJoinRequestAction(formData);

    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else if (result.message) {
      setMessage({ type: "success", text: result.message });
      // Update local state
      setPendingRequests((prev) => prev.filter((r) => r.id !== request.id));
      setReviewedRequests((prev) => [
        ...prev,
        { ...request, status: action === "approve" ? "Approved" : "Rejected" },
      ]);
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Review Join Requests</h1>
        <p className="text-muted-foreground mt-1">
          Approve or reject player requests to join your teams
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
            Pending Requests
          </h3>
          <p className="mt-2 text-3xl font-bold">{pendingRequests.length}</p>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Total Requests
          </h3>
          <p className="mt-2 text-3xl font-bold">{allRequests.length}</p>
        </div>
        <div className="rounded-xl border border-border/50 bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            My Teams
          </h3>
          <p className="mt-2 text-3xl font-bold">{captainTeams.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="rounded-xl border border-border/50 bg-card p-6">
        <div className="flex gap-4 border-b border-border/50 pb-4 mb-4">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === "pending"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            }`}
          >
            Pending ({pendingRequests.length})
          </button>
          <button
            onClick={() => setActiveTab("reviewed")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === "reviewed"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            }`}
          >
            Reviewed ({reviewedRequests.length})
          </button>
        </div>

        {/* Pending Requests */}
        {activeTab === "pending" && (
          <div className="space-y-3">
            {pendingRequests.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No pending join requests at this time.
              </p>
            ) : (
              pendingRequests.map((request) => (
                <div
                  key={request.id}
                  className="p-4 rounded-lg border border-border/50 bg-background"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{request.playerName}</h3>
                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/50">
                          Pending
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {request.playerEmail}
                      </p>
                      <p className="text-sm mt-2">
                        <span className="font-medium">Team:</span>{" "}
                        {request.teamName}
                      </p>
                      {request.message && (
                        <div className="mt-3 p-3 rounded-lg bg-card">
                          <p className="text-sm font-medium mb-1">
                            Player's Message:
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {request.message}
                          </p>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        Requested on{" "}
                        {new Date(request.requestDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleReviewRequest(request, "approve")}
                        disabled={loading}
                        className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 disabled:opacity-50"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReviewRequest(request, "reject")}
                        disabled={loading}
                        className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Reviewed Requests */}
        {activeTab === "reviewed" && (
          <div className="space-y-3">
            {reviewedRequests.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No reviewed requests yet.
              </p>
            ) : (
              reviewedRequests.map((request) => (
                <div
                  key={request.id}
                  className="p-4 rounded-lg border border-border/50 bg-background"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{request.playerName}</h3>
                        <span
                          className={`px-2 py-1 text-xs rounded-full border ${
                            request.status === "Approved"
                              ? "bg-green-500/10 text-green-500 border-green-500/50"
                              : "bg-red-500/10 text-red-500 border-red-500/50"
                          }`}
                        >
                          {request.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {request.playerEmail}
                      </p>
                      <p className="text-sm mt-2">
                        <span className="font-medium">Team:</span>{" "}
                        {request.teamName}
                      </p>
                      {request.message && (
                        <div className="mt-3 p-3 rounded-lg bg-card">
                          <p className="text-sm text-muted-foreground">
                            {request.message}
                          </p>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        Requested on{" "}
                        {new Date(request.requestDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Help Text */}
      <div className="rounded-xl border border-border/50 bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Review Guidelines</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Review player skill level and team fit before approving</li>
          <li>• Check if your team has roster space available</li>
          <li>
            • Consider the player's message to understand their motivation
          </li>
          <li>• Approved players will be added to your team automatically</li>
          <li>• You can manage team roster from the Teams page</li>
        </ul>
      </div>
    </div>
  );
}
