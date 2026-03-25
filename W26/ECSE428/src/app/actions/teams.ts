"use server";

import {
  MOCK_TEAMS,
  MOCK_JOIN_REQUESTS,
  type MockTeam,
  type MockJoinRequest,
} from "@/lib/mock-data";

const teams = [...MOCK_TEAMS];
const joinRequests = [...MOCK_JOIN_REQUESTS];

export async function createTeamAction(formData: FormData): Promise<{
  error?: string;
  message?: string;
  team?: MockTeam;
}> {
  const name = (formData.get("name") as string)?.trim();
  const leagueId = formData.get("leagueId") as string;
  const userRole = formData.get("userRole") as string;
  const userId = formData.get("userId") as string;
  const userEmail = formData.get("userEmail") as string;

  if (userRole !== "CAPTAIN") {
    return { error: "Only captains can create teams." };
  }

  if (!name) {
    return { error: "Team name is required." };
  }

  if (!leagueId) {
    return { error: "League selection is required." };
  }

  const duplicate = teams.find(
    (t) => t.name.toLowerCase() === name.toLowerCase() && t.leagueId === leagueId
  );
  if (duplicate) {
    return { error: "A team with this name already exists in this league." };
  }

  const newTeam: MockTeam = {
    id: `team-${Date.now()}`,
    name,
    sport: "SOCCER",
    leagueId,
    captainId: userId,
    captainEmail: userEmail,
    divisionLevel: "RECREATIONAL",
    maxRosterSize: 15,
    currentRosterSize: 1,
    wins: 0,
    losses: 0,
    ties: 0,
    points: 0,
    isActive: true,
    acceptingMembers: true,
    description: "",
    genderRequirement: "CO_ED",
    minimumSkillLevel: "BEGINNER",
  };

  teams.push(newTeam);
  return { message: `Team ${name} has been created successfully.`, team: newTeam };
}

export async function requestJoinTeamAction(formData: FormData): Promise<{
  error?: string;
  message?: string;
}> {
  const teamId = formData.get("teamId") as string;
  const playerId = formData.get("playerId") as string;
  const playerName = formData.get("playerName") as string;
  const playerEmail = formData.get("playerEmail") as string;
  const message = formData.get("message") as string;

  const team = teams.find((t) => t.id === teamId);
  if (!team) {
    return { error: "Team not found." };
  }

  if (team.currentRosterSize >= team.maxRosterSize) {
    return { error: "This team's roster is full." };
  }

  const existingRequest = joinRequests.find(
    (r) => r.teamId === teamId && r.playerId === playerId && r.status === "Pending"
  );
  if (existingRequest) {
    return { error: "You already have a pending request for this team." };
  }

  // Check if already on a team in the same league
  const playerTeam = teams.find(
    (t) => t.leagueId === team.leagueId && t.id !== teamId
  );
  // For MVP, skip the detailed roster check

  const newRequest: MockJoinRequest = {
    id: `jr-${Date.now()}`,
    teamId,
    teamName: team.name,
    playerId,
    playerName,
    playerEmail,
    status: "Pending",
    requestDate: new Date().toISOString().split("T")[0],
    message,
  };

  joinRequests.push(newRequest);
  return { message: `Your request to join ${team.name} has been sent.` };
}

export async function reviewJoinRequestAction(formData: FormData): Promise<{
  error?: string;
  message?: string;
}> {
  const requestId = formData.get("requestId") as string;
  const action = formData.get("action") as "approve" | "reject";
  const captainId = formData.get("captainId") as string;
  const userRole = formData.get("userRole") as string;

  if (userRole !== "CAPTAIN") {
    return { error: "Only captains can review join requests." };
  }

  const request = joinRequests.find((r) => r.id === requestId);
  if (!request) {
    return { error: "Join request not found." };
  }

  if (request.status !== "Pending") {
    return { error: "This request has already been reviewed." };
  }

  const team = teams.find((t) => t.id === request.teamId);
  if (!team) {
    return { error: "Team not found." };
  }

  if (team.captainId !== captainId) {
    return { error: "You are not authorized to review requests for this team." };
  }

  if (action === "approve") {
    request.status = "Approved";
    team.currentRosterSize += 1;
    return { message: "Player request approved." };
  } else {
    request.status = "Rejected";
    return { message: "Player request rejected." };
  }
}

export async function leaveTeamAction(formData: FormData): Promise<{
  error?: string;
  message?: string;
}> {
  const teamId = formData.get("teamId") as string;
  const playerId = formData.get("playerId") as string;

  const team = teams.find((t) => t.id === teamId);
  if (!team) {
    return { error: "Team not found." };
  }

  // For MVP, just decrement roster size
  if (team.currentRosterSize <= 0) {
    return { error: "You are not a member of this team." };
  }

  team.currentRosterSize -= 1;
  return { message: "You have left the team." };
}

export async function getTeamsAction(): Promise<MockTeam[]> {
  return teams;
}

export async function getJoinRequestsAction(
  teamId?: string
): Promise<MockJoinRequest[]> {
  if (teamId) {
    return joinRequests.filter((r) => r.teamId === teamId);
  }
  return joinRequests;
}
