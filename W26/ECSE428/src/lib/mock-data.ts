export interface MockTeam {
  id: string;
  name: string;
  sport: string;
  leagueId: string;
  captainId: string;
  captainEmail: string;
  divisionLevel: string;
  maxRosterSize: number;
  currentRosterSize: number;
  wins: number;
  losses: number;
  ties: number;
  points: number;
  isActive: boolean;
  acceptingMembers: boolean;
  description: string;
  genderRequirement: string;
  minimumSkillLevel: string;
}

export interface MockLeague {
  id: string;
  name: string;
  sport: string;
  season: string;
  division: string;
  maxTeams: number;
  currentTeams: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
}

export interface MockSeason {
  id: string;
  name: string;
  year: number;
  registrationStart: string;
  registrationEnd: string;
  seasonStart: string;
  seasonEnd: string;
  isActive: boolean;
}

export interface MockGame {
  id: string;
  leagueId: string;
  homeTeamId: string;
  homeTeamName: string;
  awayTeamId: string;
  awayTeamName: string;
  scheduledDateTime: string;
  durationMinutes: number;
  status: string;
  homeTeamScore: number | null;
  awayTeamScore: number | null;
  venueId: string;
  venueName: string;
  isPlayoff: boolean;
}

export interface MockJoinRequest {
  id: string;
  teamId: string;
  teamName: string;
  playerId: string;
  playerName: string;
  playerEmail: string;
  status: "Pending" | "Approved" | "Rejected";
  requestDate: string;
  message?: string;
}

export interface MockStanding {
  teamId: string;
  teamName: string;
  leagueId: string;
  rank: number;
  wins: number;
  losses: number;
  ties: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  gamesPlayed: number;
}

export interface MockAvailability {
  id: string;
  playerId: string;
  gameId: string;
  status: "Available" | "Unavailable" | "Maybe" | "No Response";
  responseDate?: string;
}

export const MOCK_SEASONS: MockSeason[] = [
  {
    id: "season-001",
    name: "Winter 2026",
    year: 2026,
    registrationStart: "2026-01-05",
    registrationEnd: "2026-01-19",
    seasonStart: "2026-01-20",
    seasonEnd: "2026-04-15",
    isActive: true,
  },
];

export const MOCK_LEAGUES: MockLeague[] = [
  {
    id: "league-001",
    name: "Indoor Soccer - Competitive",
    sport: "SOCCER",
    season: "Winter 2026",
    division: "COMPETITIVE",
    maxTeams: 8,
    currentTeams: 4,
    isActive: true,
    startDate: "2026-01-20",
    endDate: "2026-04-01",
  },
  {
    id: "league-002",
    name: "Basketball - Recreational",
    sport: "BASKETBALL",
    season: "Winter 2026",
    division: "RECREATIONAL",
    maxTeams: 6,
    currentTeams: 3,
    isActive: true,
    startDate: "2026-01-22",
    endDate: "2026-03-30",
  },
  {
    id: "league-003",
    name: "Volleyball - Intermediate",
    sport: "VOLLEYBALL",
    season: "Winter 2026",
    division: "RECREATIONAL",
    maxTeams: 8,
    currentTeams: 4,
    isActive: true,
    startDate: "2026-01-21",
    endDate: "2026-04-05",
  },
];

export const MOCK_TEAMS: MockTeam[] = [
  {
    id: "team-001",
    name: "Redbirds FC",
    sport: "SOCCER",
    leagueId: "league-001",
    captainId: "user-003",
    captainEmail: "captain.kirk@mail.mcgill.ca",
    divisionLevel: "COMPETITIVE",
    maxRosterSize: 15,
    currentRosterSize: 10,
    wins: 5,
    losses: 1,
    ties: 2,
    points: 17,
    isActive: true,
    acceptingMembers: true,
    description: "Competitive soccer team looking for skilled players.",
    genderRequirement: "CO_ED",
    minimumSkillLevel: "INTERMEDIATE",
  },
  {
    id: "team-002",
    name: "Stingers Basketball",
    sport: "BASKETBALL",
    leagueId: "league-002",
    captainId: "user-004",
    captainEmail: "sarah.captain@mail.mcgill.ca",
    divisionLevel: "RECREATIONAL",
    maxRosterSize: 12,
    currentRosterSize: 8,
    wins: 3,
    losses: 3,
    ties: 0,
    points: 9,
    isActive: true,
    acceptingMembers: true,
    description: "Recreational basketball - all levels welcome!",
    genderRequirement: "CO_ED",
    minimumSkillLevel: "BEGINNER",
  },
  {
    id: "team-003",
    name: "Martlets Volleyball",
    sport: "VOLLEYBALL",
    leagueId: "league-003",
    captainId: "user-003",
    captainEmail: "captain.kirk@mail.mcgill.ca",
    divisionLevel: "RECREATIONAL",
    maxRosterSize: 12,
    currentRosterSize: 12,
    wins: 6,
    losses: 2,
    ties: 0,
    points: 18,
    isActive: true,
    acceptingMembers: false,
    description: "Volleyball team - currently full.",
    genderRequirement: "CO_ED",
    minimumSkillLevel: "INTERMEDIATE",
  },
  {
    id: "team-004",
    name: "Thunder FC",
    sport: "SOCCER",
    leagueId: "league-001",
    captainId: "user-004",
    captainEmail: "sarah.captain@mail.mcgill.ca",
    divisionLevel: "COMPETITIVE",
    maxRosterSize: 15,
    currentRosterSize: 11,
    wins: 4,
    losses: 2,
    ties: 2,
    points: 14,
    isActive: true,
    acceptingMembers: true,
    description: "Competitive soccer - looking for midfielders.",
    genderRequirement: "CO_ED",
    minimumSkillLevel: "INTERMEDIATE",
  },
  {
    id: "team-005",
    name: "Huskies FC",
    sport: "SOCCER",
    leagueId: "league-001",
    captainId: "user-004",
    captainEmail: "sarah.captain@mail.mcgill.ca",
    divisionLevel: "COMPETITIVE",
    maxRosterSize: 15,
    currentRosterSize: 9,
    wins: 2,
    losses: 4,
    ties: 2,
    points: 8,
    isActive: true,
    acceptingMembers: true,
    description: "Building for next season.",
    genderRequirement: "CO_ED",
    minimumSkillLevel: "BEGINNER",
  },
  {
    id: "team-006",
    name: "Eagles FC",
    sport: "SOCCER",
    leagueId: "league-001",
    captainId: "user-003",
    captainEmail: "captain.kirk@mail.mcgill.ca",
    divisionLevel: "COMPETITIVE",
    maxRosterSize: 15,
    currentRosterSize: 13,
    wins: 3,
    losses: 3,
    ties: 2,
    points: 11,
    isActive: true,
    acceptingMembers: true,
    description: "Experienced soccer squad.",
    genderRequirement: "CO_ED",
    minimumSkillLevel: "INTERMEDIATE",
  },
];

export const MOCK_GAMES: MockGame[] = [
  {
    id: "game-001",
    leagueId: "league-001",
    homeTeamId: "team-001",
    homeTeamName: "Redbirds FC",
    awayTeamId: "team-004",
    awayTeamName: "Thunder FC",
    scheduledDateTime: "2026-02-10T18:00:00",
    durationMinutes: 60,
    status: "SCHEDULED",
    homeTeamScore: null,
    awayTeamScore: null,
    venueId: "venue-001",
    venueName: "McGill Gym A",
    isPlayoff: false,
  },
  {
    id: "game-002",
    leagueId: "league-001",
    homeTeamId: "team-005",
    homeTeamName: "Huskies FC",
    awayTeamId: "team-006",
    awayTeamName: "Eagles FC",
    scheduledDateTime: "2026-02-10T20:00:00",
    durationMinutes: 60,
    status: "SCHEDULED",
    homeTeamScore: null,
    awayTeamScore: null,
    venueId: "venue-001",
    venueName: "McGill Gym A",
    isPlayoff: false,
  },
  {
    id: "game-003",
    leagueId: "league-001",
    homeTeamId: "team-001",
    homeTeamName: "Redbirds FC",
    awayTeamId: "team-005",
    awayTeamName: "Huskies FC",
    scheduledDateTime: "2026-02-03T18:00:00",
    durationMinutes: 60,
    status: "COMPLETED",
    homeTeamScore: 3,
    awayTeamScore: 1,
    venueId: "venue-001",
    venueName: "McGill Gym A",
    isPlayoff: false,
  },
  {
    id: "game-004",
    leagueId: "league-002",
    homeTeamId: "team-002",
    homeTeamName: "Stingers Basketball",
    awayTeamId: "team-002",
    awayTeamName: "Stingers Basketball",
    scheduledDateTime: "2026-02-15T19:00:00",
    durationMinutes: 48,
    status: "SCHEDULED",
    homeTeamScore: null,
    awayTeamScore: null,
    venueId: "venue-002",
    venueName: "McGill Sports Complex",
    isPlayoff: false,
  },
  {
    id: "game-005",
    leagueId: "league-001",
    homeTeamId: "team-004",
    homeTeamName: "Thunder FC",
    awayTeamId: "team-006",
    awayTeamName: "Eagles FC",
    scheduledDateTime: "2026-02-17T18:00:00",
    durationMinutes: 60,
    status: "SCHEDULED",
    homeTeamScore: null,
    awayTeamScore: null,
    venueId: "venue-001",
    venueName: "McGill Gym A",
    isPlayoff: false,
  },
  {
    id: "game-006",
    leagueId: "league-001",
    homeTeamId: "team-006",
    homeTeamName: "Eagles FC",
    awayTeamId: "team-001",
    awayTeamName: "Redbirds FC",
    scheduledDateTime: "2026-03-01T18:30:00",
    durationMinutes: 60,
    status: "SCHEDULED",
    homeTeamScore: null,
    awayTeamScore: null,
    venueId: "venue-001",
    venueName: "McGill Gym A",
    isPlayoff: false,
  },
];

export const MOCK_JOIN_REQUESTS: MockJoinRequest[] = [
  {
    id: "jr-001",
    teamId: "team-001",
    teamName: "Redbirds FC",
    playerId: "user-007",
    playerName: "Alex Chen",
    playerEmail: "alex.chen@mail.mcgill.ca",
    status: "Pending",
    requestDate: "2026-01-28",
    message: "I'd love to join! I play defense.",
  },
  {
    id: "jr-002",
    teamId: "team-001",
    teamName: "Redbirds FC",
    playerId: "user-009",
    playerName: "Marcus Johnson",
    playerEmail: "marcus.j@mail.mcgill.ca",
    status: "Pending",
    requestDate: "2026-01-29",
    message: "Looking for a competitive team this season.",
  },
  {
    id: "jr-003",
    teamId: "team-002",
    teamName: "Stingers Basketball",
    playerId: "user-007",
    playerName: "Alex Chen",
    playerEmail: "alex.chen@mail.mcgill.ca",
    status: "Approved",
    requestDate: "2026-01-25",
  },
];

export const MOCK_STANDINGS: MockStanding[] = [
  {
    teamId: "team-001",
    teamName: "Redbirds FC",
    leagueId: "league-001",
    rank: 1,
    wins: 5,
    losses: 1,
    ties: 2,
    points: 17,
    goalsFor: 18,
    goalsAgainst: 8,
    gamesPlayed: 8,
  },
  {
    teamId: "team-004",
    teamName: "Thunder FC",
    leagueId: "league-001",
    rank: 2,
    wins: 4,
    losses: 2,
    ties: 2,
    points: 14,
    goalsFor: 14,
    goalsAgainst: 10,
    gamesPlayed: 8,
  },
  {
    teamId: "team-006",
    teamName: "Eagles FC",
    leagueId: "league-001",
    rank: 3,
    wins: 3,
    losses: 3,
    ties: 2,
    points: 11,
    goalsFor: 12,
    goalsAgainst: 12,
    gamesPlayed: 8,
  },
  {
    teamId: "team-005",
    teamName: "Huskies FC",
    leagueId: "league-001",
    rank: 4,
    wins: 2,
    losses: 4,
    ties: 2,
    points: 8,
    goalsFor: 9,
    goalsAgainst: 15,
    gamesPlayed: 8,
  },
];

export const MOCK_AVAILABILITY: MockAvailability[] = [
  {
    id: "avail-001",
    playerId: "user-001",
    gameId: "game-001",
    status: "Available",
    responseDate: "2026-02-05",
  },
  {
    id: "avail-002",
    playerId: "user-001",
    gameId: "game-006",
    status: "Maybe",
    responseDate: "2026-02-20",
  },
];

// Helper functions
export function getMockTeams(): MockTeam[] {
  return MOCK_TEAMS;
}

export function getMockTeamById(id: string): MockTeam | undefined {
  return MOCK_TEAMS.find((t) => t.id === id);
}

export function getMockLeagues(): MockLeague[] {
  return MOCK_LEAGUES;
}

export function getMockSeasons(): MockSeason[] {
  return MOCK_SEASONS;
}

export function getMockGames(): MockGame[] {
  return MOCK_GAMES;
}

export function getMockGamesByTeam(teamId: string): MockGame[] {
  return MOCK_GAMES.filter(
    (g) => g.homeTeamId === teamId || g.awayTeamId === teamId
  );
}

export function getMockStandings(leagueId?: string): MockStanding[] {
  if (leagueId) {
    return MOCK_STANDINGS.filter((s) => s.leagueId === leagueId);
  }
  return MOCK_STANDINGS;
}

export function getMockJoinRequests(teamId?: string): MockJoinRequest[] {
  if (teamId) {
    return MOCK_JOIN_REQUESTS.filter((r) => r.teamId === teamId);
  }
  return MOCK_JOIN_REQUESTS;
}
