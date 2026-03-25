/**
 * Application-level TypeScript interfaces for the ITMS.
 *
 * Re-exports every database type and adds higher-level convenience interfaces
 * that combine related rows, carry display-friendly fields, or serve as form
 * input shapes.
 */

// ---------------------------------------------------------------------------
// Re-export everything from the database types
// ---------------------------------------------------------------------------

export type {
  Database,
  // Enums
  SkillLevel,
  Sport,
  DivisionLevel,
  AdminAccessLevel,
  UserRole,
  GameStatus,
  IncidentSeverity,
  NotificationType,
  AvailabilityStatus,
  MembershipStatus,
  BookingStatus,
  Gender,
  SeasonStatus,
  JoinRequestStatus,
  SubstituteRequestStatus,
  RecruitmentApplicationStatus,
  // Row aliases
  UserRow,
  UserInsert,
  UserUpdate,
  PlayerRow,
  PlayerInsert,
  PlayerUpdate,
  CaptainRow,
  CaptainInsert,
  CaptainUpdate,
  TeamRow,
  TeamInsert,
  TeamUpdate,
  TeamRosterRow,
  TeamRosterInsert,
  TeamRosterUpdate,
  RosterMembershipRow,
  RosterMembershipInsert,
  RosterMembershipUpdate,
  RecruitmentPostRow,
  RecruitmentPostInsert,
  RecruitmentPostUpdate,
  RecruitmentApplicationRow,
  RecruitmentApplicationInsert,
  RecruitmentApplicationUpdate,
  LeagueRow,
  LeagueInsert,
  LeagueUpdate,
  SeasonRow,
  SeasonInsert,
  SeasonUpdate,
  GameRow,
  GameInsert,
  GameUpdate,
  MatchResultRow,
  MatchResultInsert,
  MatchResultUpdate,
  LeagueStandingRow,
  LeagueStandingInsert,
  LeagueStandingUpdate,
  IncidentReportRow,
  IncidentReportInsert,
  IncidentReportUpdate,
  FacilityRow,
  FacilityInsert,
  FacilityUpdate,
  FacilityBookingRow,
  FacilityBookingInsert,
  FacilityBookingUpdate,
  ScheduleRow,
  ScheduleInsert,
  ScheduleUpdate,
  PlayerAvailabilityRow,
  PlayerAvailabilityInsert,
  PlayerAvailabilityUpdate,
  NotificationRow,
  NotificationInsert,
  NotificationUpdate,
  JoinRequestRow,
  JoinRequestInsert,
  JoinRequestUpdate,
  SubstituteRequestRow,
  SubstituteRequestInsert,
  SubstituteRequestUpdate,
} from "./database";

import type {
  UserRow,
  PlayerRow,
  CaptainRow,
  TeamRow,
  LeagueRow,
  SeasonRow,
  GameRow,
  LeagueStandingRow,
  JoinRequestRow,
  NotificationRow,
  MatchResultRow,
  IncidentReportRow,
  FacilityRow,
  FacilityBookingRow,
  PlayerAvailabilityRow,
  SubstituteRequestRow,
  RosterMembershipRow,
  SkillLevel,
  Sport,
  AvailabilityStatus,
  UserRole,
  Gender,
  DivisionLevel,
  GameStatus,
} from "./database";

// ---------------------------------------------------------------------------
// Composite / Display Interfaces
// ---------------------------------------------------------------------------

/** A player with the related user profile merged in. */
export interface Player extends PlayerRow {
  user: UserRow;
}

/** A captain with the related user profile and team info. */
export interface Captain extends CaptainRow {
  user: UserRow;
  team: TeamRow;
}

/** A team with its captain user details and roster count. */
export interface Team extends TeamRow {
  captain: UserRow;
  roster_count: number;
  league_name: string | null;
}

/** A league with its associated season name and team count. */
export interface League extends LeagueRow {
  season_name: string;
  team_count: number;
}

/** A season with aggregate league count. */
export interface Season extends SeasonRow {
  league_count: number;
}

/** A game enriched with home/away team names and facility info. */
export interface GameWithTeams extends GameRow {
  home_team_name: string;
  away_team_name: string;
  league_name: string;
  facility_name: string | null;
}

/** Match result with game and team context. */
export interface MatchResultWithContext extends MatchResultRow {
  home_team_name: string;
  away_team_name: string;
  game_date: string;
}

/** A join request enriched with the requesting player and target team info. */
export interface JoinRequest extends JoinRequestRow {
  player_name: string;
  player_email: string;
  player_skill_level: SkillLevel;
  team_name: string;
  team_sport: Sport;
}

/** League standing with the team name for display. */
export interface LeagueStanding extends LeagueStandingRow {
  team_name: string;
  league_name: string;
}

/** A notification ready for rendering in the UI. */
export interface Notification extends NotificationRow {
  /** Computed from created_at for display, e.g. "2 hours ago". */
  time_ago: string;
}

/** Incident report with involved player and team names. */
export interface IncidentReport extends IncidentReportRow {
  player_name: string;
  team_name: string;
  reported_by_name: string;
}

/** Facility with current booking count. */
export interface Facility extends FacilityRow {
  upcoming_bookings: number;
}

/** Facility booking with facility and booker details. */
export interface FacilityBooking extends FacilityBookingRow {
  facility_name: string;
  booked_by_name: string;
}

/** Player availability with player and game context. */
export interface PlayerAvailability extends PlayerAvailabilityRow {
  player_name: string;
  game_date: string;
  game_time: string;
  opponent_name: string;
}

/** Substitute request with context for display. */
export interface SubstituteRequest extends SubstituteRequestRow {
  team_name: string;
  game_date: string;
  requested_by_name: string;
  filled_by_name: string | null;
}

/** Roster membership enriched with player user data. */
export interface RosterMember extends RosterMembershipRow {
  player_name: string;
  player_email: string;
  skill_level: SkillLevel;
}

// ---------------------------------------------------------------------------
// Search Types
// ---------------------------------------------------------------------------

/** Result returned from the player search / directory. */
export interface SearchResult {
  id: string;
  display_name: string;
  team_name: string | null;
  skill_level: SkillLevel;
  sport: Sport | null;
  is_free_agent: boolean;
}

/** Paginated response wrapper. */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// ---------------------------------------------------------------------------
// Form Input Types
// ---------------------------------------------------------------------------

/** Input for the registration form (US001). */
export interface RegistrationInput {
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  student_id?: string;
  phone?: string;
  gender?: Gender;
}

/** Input for the team creation form (US010). */
export interface TeamCreationInput {
  name: string;
  sport: Sport;
  league_id: string;
  division?: DivisionLevel;
  max_roster_size?: number;
  min_roster_size?: number;
}

/** Input for season creation (US003). */
export interface SeasonCreationInput {
  name: string;
  start_date: string;
  end_date: string;
  description?: string;
}

/** Input for updating a player's skill level (US007). */
export interface SkillLevelUpdateInput {
  skill_level: SkillLevel;
}

/** Input for updating a player's availability for a game (US008). */
export interface AvailabilityUpdateInput {
  game_id: string;
  status: AvailabilityStatus;
  note?: string;
}

/** Input for a join request (US002). */
export interface JoinRequestInput {
  team_id: string;
  message?: string;
}

/** Input for searching players (US005). */
export interface SearchPlayerInput {
  query: string;
  page?: number;
  page_size?: number;
}

/** Input for reviewing a join request (US006). */
export interface ReviewJoinRequestInput {
  request_id: string;
  action: "Approved" | "Rejected";
}

/** Input for game scheduling / rescheduling (US004). */
export interface GameScheduleInput {
  league_id: string;
  home_team_id: string;
  away_team_id: string;
  facility_id?: string;
  scheduled_date: string;
  scheduled_time: string;
}

/** Input for submitting a match result. */
export interface MatchResultInput {
  game_id: string;
  home_score: number;
  away_score: number;
  notes?: string;
}

/** Input for filing an incident report. */
export interface IncidentReportInput {
  game_id: string;
  player_id: string;
  team_id: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  incident_type: string;
  description: string;
}

/** Login credentials. */
export interface LoginInput {
  email: string;
  password: string;
}

// ---------------------------------------------------------------------------
// Dashboard / Aggregation Types
// ---------------------------------------------------------------------------

/** Summary statistics shown on the admin dashboard (US004). */
export interface AdminDashboardStats {
  active_leagues: number;
  upcoming_games: number;
  teams_needing_attention: number;
  scheduling_conflicts: number;
  total_players: number;
  total_teams: number;
}

/** Summary shown on a player's personal dashboard. */
export interface PlayerDashboardStats {
  upcoming_games: number;
  teams_joined: number;
  pending_requests: number;
  unread_notifications: number;
}

/** Summary shown on a captain's dashboard. */
export interface CaptainDashboardStats {
  roster_count: number;
  max_roster: number;
  pending_join_requests: number;
  upcoming_games: number;
  team_record: string;
}

// ---------------------------------------------------------------------------
// API Response Types
// ---------------------------------------------------------------------------

/** Standard API success response. */
export interface ApiResponse<T = void> {
  success: boolean;
  message: string;
  data?: T;
}

/** Standard API error response. */
export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}
