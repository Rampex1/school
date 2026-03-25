"use server";

import { MOCK_USERS } from "@/lib/mock-auth";
import { MOCK_AVAILABILITY, type MockAvailability } from "@/lib/mock-data";

const users = [...MOCK_USERS];
const availability = [...MOCK_AVAILABILITY];

export interface PlayerSearchResult {
  id: string;
  displayName: string;
  teamName: string | null;
  status: string;
  skillLevel: string;
}

export async function searchPlayersAction(
  query: string
): Promise<{ error?: string; results?: PlayerSearchResult[] }> {
  const trimmed = query.trim();

  if (!trimmed) {
    return { error: "Enter a name or email to search" };
  }

  // Check if it looks like an email
  if (trimmed.includes("@") && !trimmed.includes("@") === false) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return { error: "Enter a valid email address" };
    }
  }

  const lowerQuery = trimmed.toLowerCase();

  const matchingUsers = users
    .filter(
      (u) =>
        u.role === "PLAYER" &&
        u.isActive &&
        (u.name.toLowerCase().includes(lowerQuery) ||
          u.email.toLowerCase().includes(lowerQuery))
    )
    .slice(0, 20);

  if (matchingUsers.length === 0) {
    return { results: [] };
  }

  const results: PlayerSearchResult[] = matchingUsers.map((u) => ({
    id: u.id,
    displayName: u.name,
    teamName: u.teamIds && u.teamIds.length > 0 ? "Redbirds FC" : null,
    status: u.isActive ? "Active" : "Inactive",
    skillLevel: u.skillLevel || "BEGINNER",
  }));

  return { results };
}

export async function updateSkillLevelAction(formData: FormData): Promise<{
  error?: string;
  message?: string;
}> {
  const userId = formData.get("userId") as string;
  const skillLevel = formData.get("skillLevel") as string;

  const validLevels = [
    "BEGINNER",
    "RECREATIONAL",
    "INTERMEDIATE",
    "ADVANCED",
    "COMPETITIVE",
  ];

  if (!skillLevel) {
    return { error: "Please select a valid skill level." };
  }

  if (!validLevels.includes(skillLevel)) {
    return { error: "Selected skill level is not supported." };
  }

  const user = users.find((u) => u.id === userId);
  if (!user) {
    return { error: "User not found." };
  }

  user.skillLevel = skillLevel;
  return { message: "Profile updated successfully." };
}

export async function updateAvailabilityAction(formData: FormData): Promise<{
  error?: string;
  message?: string;
}> {
  const playerId = formData.get("playerId") as string;
  const gameId = formData.get("gameId") as string;
  const status = formData.get("status") as MockAvailability["status"];

  if (!playerId || !gameId || !status) {
    return { error: "Missing required fields." };
  }

  const validStatuses = ["Available", "Unavailable", "Maybe"];
  if (!validStatuses.includes(status)) {
    return { error: "Invalid availability status." };
  }

  const existing = availability.find(
    (a) => a.playerId === playerId && a.gameId === gameId
  );

  if (existing) {
    existing.status = status;
    existing.responseDate = new Date().toISOString().split("T")[0];
  } else {
    availability.push({
      id: `avail-${Date.now()}`,
      playerId,
      gameId,
      status,
      responseDate: new Date().toISOString().split("T")[0],
    });
  }

  return { message: "Availability updated successfully" };
}

export async function getPlayerAvailabilityAction(
  playerId: string
): Promise<MockAvailability[]> {
  return availability.filter((a) => a.playerId === playerId);
}
