export type UserRole =
  | "PLAYER"
  | "CAPTAIN"
  | "ADMINISTRATOR"
  | "GAME_OFFICIAL"
  | "FACILITY_MANAGER";

export interface MockUser {
  id: string;
  email: string;
  password: string;
  name: string;
  studentId?: string;
  role: UserRole;
  skillLevel?: string;
  preferredPosition?: string;
  reliabilityScore?: number;
  isActive: boolean;
  teamIds?: string[];
}

export const MOCK_USERS: MockUser[] = [
  {
    id: "user-001",
    email: "john.doe@mail.mcgill.ca",
    password: "Password1!",
    name: "John Doe",
    studentId: "260948371",
    role: "PLAYER",
    skillLevel: "INTERMEDIATE",
    preferredPosition: "Forward",
    reliabilityScore: 92,
    isActive: true,
    teamIds: ["team-001"],
  },
  {
    id: "user-002",
    email: "jane.smith@mail.mcgill.ca",
    password: "Password1!",
    name: "Jane Smith",
    studentId: "260952184",
    role: "PLAYER",
    skillLevel: "ADVANCED",
    preferredPosition: "Midfielder",
    reliabilityScore: 98,
    isActive: true,
    teamIds: ["team-001"],
  },
  {
    id: "user-003",
    email: "captain.kirk@mail.mcgill.ca",
    password: "Password1!",
    name: "Kirk Douglas",
    studentId: "260937256",
    role: "CAPTAIN",
    skillLevel: "ADVANCED",
    preferredPosition: "Center",
    reliabilityScore: 95,
    isActive: true,
    teamIds: ["team-001"],
  },
  {
    id: "user-004",
    email: "sarah.captain@mail.mcgill.ca",
    password: "Password1!",
    name: "Sarah Connor",
    studentId: "260941893",
    role: "CAPTAIN",
    skillLevel: "COMPETITIVE",
    preferredPosition: "Point Guard",
    reliabilityScore: 97,
    isActive: true,
    teamIds: ["team-002"],
  },
  {
    id: "user-005",
    email: "admin@mcgill.ca",
    password: "Password1!",
    name: "Admin McGill",
    role: "ADMINISTRATOR",
    isActive: true,
  },
  {
    id: "user-006",
    email: "ref.jones@mail.mcgill.ca",
    password: "Password1!",
    name: "Mike Jones",
    role: "GAME_OFFICIAL",
    isActive: true,
  },
  {
    id: "user-007",
    email: "alex.chen@mail.mcgill.ca",
    password: "Password1!",
    name: "Alex Chen",
    studentId: "260955472",
    role: "PLAYER",
    skillLevel: "BEGINNER",
    preferredPosition: "Defense",
    reliabilityScore: 85,
    isActive: true,
    teamIds: [],
  },
  {
    id: "user-008",
    email: "priya.sharma@mail.mcgill.ca",
    password: "Password1!",
    name: "Priya Sharma",
    studentId: "260943617",
    role: "PLAYER",
    skillLevel: "RECREATIONAL",
    preferredPosition: "Goalie",
    reliabilityScore: 90,
    isActive: true,
    teamIds: ["team-003"],
  },
  {
    id: "user-009",
    email: "marcus.j@mail.mcgill.ca",
    password: "Password1!",
    name: "Marcus Johnson",
    studentId: "260958234",
    role: "PLAYER",
    skillLevel: "INTERMEDIATE",
    reliabilityScore: 88,
    isActive: true,
    teamIds: [],
  },
  {
    id: "user-010",
    email: "facility.mgr@mcgill.ca",
    password: "Password1!",
    name: "Facility Manager",
    role: "FACILITY_MANAGER",
    isActive: true,
  },
];

// Client-side mock auth state
let currentUserId: string | null = null;

export function getCurrentUser(): MockUser | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("itms_current_user");
  if (stored) {
    try {
      return JSON.parse(stored) as MockUser;
    } catch {
      return null;
    }
  }
  return null;
}

export function setCurrentUser(user: MockUser | null): void {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem("itms_current_user", JSON.stringify(user));
  } else {
    localStorage.removeItem("itms_current_user");
  }
  currentUserId = user?.id || null;
}

export function mockLogin(email: string, password: string): MockUser | null {
  const user = MOCK_USERS.find(
    (u) => u.email === email && u.password === password
  );
  if (user) {
    setCurrentUser(user);
  }
  return user || null;
}

export function mockLogout(): void {
  setCurrentUser(null);
}

export function getUserRole(): UserRole | null {
  const user = getCurrentUser();
  return user?.role || null;
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}
