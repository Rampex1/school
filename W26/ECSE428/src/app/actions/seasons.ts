"use server";

import { MOCK_SEASONS, type MockSeason } from "@/lib/mock-data";

const seasons = [...MOCK_SEASONS];

export async function createSeasonAction(formData: FormData): Promise<{
  error?: string;
  message?: string;
}> {
  const name = (formData.get("name") as string)?.trim();
  const startDate = formData.get("startDate") as string;
  const endDate = formData.get("endDate") as string;
  const userRole = formData.get("userRole") as string;

  if (userRole !== "ADMINISTRATOR") {
    return { error: "Only organizers can manage seasons." };
  }

  if (!name) {
    return { error: "Season name is required." };
  }

  if (!startDate || !endDate) {
    return { error: "Start and end dates are required." };
  }

  if (new Date(endDate) <= new Date(startDate)) {
    return { error: "End date must be after the start date." };
  }

  const activeSeason = seasons.find((s) => s.isActive);
  if (activeSeason) {
    return {
      error:
        "An active season already exists. Please close it before creating a new one.",
    };
  }

  const newSeason: MockSeason = {
    id: `season-${Date.now()}`,
    name,
    year: new Date(startDate).getFullYear(),
    registrationStart: startDate,
    registrationEnd: startDate,
    seasonStart: startDate,
    seasonEnd: endDate,
    isActive: true,
  };

  seasons.push(newSeason);
  return { message: `Season ${name} created successfully.` };
}

export async function getSeasonsAction(): Promise<MockSeason[]> {
  return seasons;
}
