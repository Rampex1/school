"use server";

import {
  MOCK_GAMES,
  MOCK_LEAGUES,
  MOCK_TEAMS,
  type MockGame,
} from "@/lib/mock-data";

const games = [...MOCK_GAMES];

export async function getScheduleDataAction(): Promise<{
  games: MockGame[];
  leagues: typeof MOCK_LEAGUES;
  teams: typeof MOCK_TEAMS;
  activeLeagueCount: number;
  upcomingGamesCount: number;
  teamsRequiringAttention: number;
  schedulingConflicts: number;
}> {
  const now = new Date();
  const upcomingGames = games.filter(
    (g) => g.status === "SCHEDULED" && new Date(g.scheduledDateTime) > now
  );

  // Check for scheduling conflicts (same venue, same time)
  const conflicts = new Set<string>();
  for (let i = 0; i < games.length; i++) {
    for (let j = i + 1; j < games.length; j++) {
      if (
        games[i].venueId === games[j].venueId &&
        games[i].scheduledDateTime === games[j].scheduledDateTime &&
        games[i].status === "SCHEDULED" &&
        games[j].status === "SCHEDULED"
      ) {
        conflicts.add(games[i].id);
        conflicts.add(games[j].id);
      }
    }
  }

  // Teams with roster below minimum
  const teamsNeedingAttention = MOCK_TEAMS.filter(
    (t) => t.currentRosterSize < 5
  );

  return {
    games,
    leagues: MOCK_LEAGUES,
    teams: MOCK_TEAMS,
    activeLeagueCount: MOCK_LEAGUES.filter((l) => l.isActive).length,
    upcomingGamesCount: upcomingGames.length,
    teamsRequiringAttention: teamsNeedingAttention.length,
    schedulingConflicts: conflicts.size > 0 ? conflicts.size / 2 : 0,
  };
}

export async function rescheduleGameAction(formData: FormData): Promise<{
  error?: string;
  message?: string;
}> {
  const gameId = formData.get("gameId") as string;
  const newDateTime = formData.get("newDateTime") as string;
  const userRole = formData.get("userRole") as string;

  if (userRole !== "ADMINISTRATOR") {
    return { error: "Access Denied" };
  }

  if (!gameId || !newDateTime) {
    return { error: "Game and new date/time are required." };
  }

  const game = games.find((g) => g.id === gameId);
  if (!game) {
    return { error: "Game not found." };
  }

  if (new Date(newDateTime) < new Date()) {
    return { error: "Cannot schedule games in the past." };
  }

  game.scheduledDateTime = newDateTime;
  return { message: "Game rescheduled successfully." };
}
