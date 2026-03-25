/**
 * Supabase Database Type Definitions for the Intramural Team Management System (ITMS).
 *
 * These types mirror the PostgreSQL schema and are consumed by the Supabase client
 * (`createClient<Database>(...)`) to provide end-to-end type safety for all queries.
 */

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export type SkillLevel = "Beginner" | "Intermediate" | "Advanced";

export type Sport =
  | "Soccer"
  | "Basketball"
  | "Hockey"
  | "Volleyball"
  | "Baseball"
  | "Football"
  | "Badminton"
  | "Tennis";

export type DivisionLevel = "Recreational" | "Competitive" | "Elite";

export type AdminAccessLevel = "Standard" | "Super";

export type UserRole = "Player" | "Captain" | "Admin" | "Official";

export type GameStatus =
  | "Scheduled"
  | "InProgress"
  | "Completed"
  | "Cancelled"
  | "Postponed";

export type IncidentSeverity = "Low" | "Medium" | "High" | "Critical";

export type NotificationType =
  | "JoinRequest"
  | "JoinRequestApproved"
  | "JoinRequestRejected"
  | "GameScheduled"
  | "GameCancelled"
  | "GameResult"
  | "SeasonCreated"
  | "Announcement"
  | "IncidentReport"
  | "RosterChange";

export type AvailabilityStatus =
  | "Available"
  | "Unavailable"
  | "Maybe"
  | "NoResponse";

export type MembershipStatus = "Active" | "Inactive" | "Suspended" | "Left";

export type BookingStatus =
  | "Pending"
  | "Confirmed"
  | "Cancelled"
  | "Completed";

export type Gender = "Male" | "Female" | "NonBinary" | "PreferNotToSay";

export type SeasonStatus = "Active" | "Completed" | "Upcoming";

export type JoinRequestStatus = "Pending" | "Approved" | "Rejected";

export type SubstituteRequestStatus =
  | "Open"
  | "Filled"
  | "Cancelled"
  | "Expired";

export type RecruitmentApplicationStatus =
  | "Pending"
  | "Accepted"
  | "Rejected";

// ---------------------------------------------------------------------------
// Database Interface
// ---------------------------------------------------------------------------

export interface Database {
  public: {
    Tables: {
      // -------------------------------------------------------------------
      // users
      // -------------------------------------------------------------------
      users: {
        Row: {
          id: string;
          email: string;
          password_hash: string;
          first_name: string;
          last_name: string;
          role: UserRole;
          student_id: string | null;
          phone: string | null;
          gender: Gender | null;
          profile_image_url: string | null;
          reliability_score: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          password_hash: string;
          first_name: string;
          last_name: string;
          role?: UserRole;
          student_id?: string | null;
          phone?: string | null;
          gender?: Gender | null;
          profile_image_url?: string | null;
          reliability_score?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          password_hash?: string;
          first_name?: string;
          last_name?: string;
          role?: UserRole;
          student_id?: string | null;
          phone?: string | null;
          gender?: Gender | null;
          profile_image_url?: string | null;
          reliability_score?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };

      // -------------------------------------------------------------------
      // players
      // -------------------------------------------------------------------
      players: {
        Row: {
          id: string;
          user_id: string;
          skill_level: SkillLevel;
          preferred_sport: Sport | null;
          preferred_position: string | null;
          bio: string | null;
          is_free_agent: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          skill_level?: SkillLevel;
          preferred_sport?: Sport | null;
          preferred_position?: string | null;
          bio?: string | null;
          is_free_agent?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          skill_level?: SkillLevel;
          preferred_sport?: Sport | null;
          preferred_position?: string | null;
          bio?: string | null;
          is_free_agent?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };

      // -------------------------------------------------------------------
      // captains
      // -------------------------------------------------------------------
      captains: {
        Row: {
          id: string;
          user_id: string;
          team_id: string;
          appointed_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          team_id: string;
          appointed_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          team_id?: string;
          appointed_at?: string;
          created_at?: string;
        };
      };

      // -------------------------------------------------------------------
      // teams
      // -------------------------------------------------------------------
      teams: {
        Row: {
          id: string;
          name: string;
          sport: Sport;
          league_id: string | null;
          season_id: string | null;
          captain_id: string;
          division: DivisionLevel;
          max_roster_size: number;
          min_roster_size: number;
          registration_open: boolean;
          logo_url: string | null;
          wins: number;
          losses: number;
          ties: number;
          points: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          sport: Sport;
          league_id?: string | null;
          season_id?: string | null;
          captain_id: string;
          division?: DivisionLevel;
          max_roster_size?: number;
          min_roster_size?: number;
          registration_open?: boolean;
          logo_url?: string | null;
          wins?: number;
          losses?: number;
          ties?: number;
          points?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          sport?: Sport;
          league_id?: string | null;
          season_id?: string | null;
          captain_id?: string;
          division?: DivisionLevel;
          max_roster_size?: number;
          min_roster_size?: number;
          registration_open?: boolean;
          logo_url?: string | null;
          wins?: number;
          losses?: number;
          ties?: number;
          points?: number;
          created_at?: string;
          updated_at?: string;
        };
      };

      // -------------------------------------------------------------------
      // team_rosters
      // -------------------------------------------------------------------
      team_rosters: {
        Row: {
          id: string;
          team_id: string;
          season_id: string;
          is_locked: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          team_id: string;
          season_id: string;
          is_locked?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          team_id?: string;
          season_id?: string;
          is_locked?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };

      // -------------------------------------------------------------------
      // roster_memberships
      // -------------------------------------------------------------------
      roster_memberships: {
        Row: {
          id: string;
          roster_id: string;
          player_id: string;
          jersey_number: number | null;
          position: string | null;
          status: MembershipStatus;
          joined_at: string;
          left_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          roster_id: string;
          player_id: string;
          jersey_number?: number | null;
          position?: string | null;
          status?: MembershipStatus;
          joined_at?: string;
          left_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          roster_id?: string;
          player_id?: string;
          jersey_number?: number | null;
          position?: string | null;
          status?: MembershipStatus;
          joined_at?: string;
          left_at?: string | null;
          created_at?: string;
        };
      };

      // -------------------------------------------------------------------
      // recruitment_posts
      // -------------------------------------------------------------------
      recruitment_posts: {
        Row: {
          id: string;
          team_id: string;
          title: string;
          description: string;
          positions_needed: string[];
          skill_level_required: SkillLevel | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          team_id: string;
          title: string;
          description: string;
          positions_needed?: string[];
          skill_level_required?: SkillLevel | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          team_id?: string;
          title?: string;
          description?: string;
          positions_needed?: string[];
          skill_level_required?: SkillLevel | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };

      // -------------------------------------------------------------------
      // recruitment_applications
      // -------------------------------------------------------------------
      recruitment_applications: {
        Row: {
          id: string;
          post_id: string;
          player_id: string;
          message: string | null;
          status: RecruitmentApplicationStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          player_id: string;
          message?: string | null;
          status?: RecruitmentApplicationStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          player_id?: string;
          message?: string | null;
          status?: RecruitmentApplicationStatus;
          created_at?: string;
          updated_at?: string;
        };
      };

      // -------------------------------------------------------------------
      // leagues
      // -------------------------------------------------------------------
      leagues: {
        Row: {
          id: string;
          name: string;
          sport: Sport;
          division: DivisionLevel;
          skill_level: SkillLevel;
          season_id: string;
          max_teams: number;
          min_players_per_team: number;
          max_players_per_team: number;
          description: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          sport: Sport;
          division?: DivisionLevel;
          skill_level?: SkillLevel;
          season_id: string;
          max_teams?: number;
          min_players_per_team?: number;
          max_players_per_team?: number;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          sport?: Sport;
          division?: DivisionLevel;
          skill_level?: SkillLevel;
          season_id?: string;
          max_teams?: number;
          min_players_per_team?: number;
          max_players_per_team?: number;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };

      // -------------------------------------------------------------------
      // seasons
      // -------------------------------------------------------------------
      seasons: {
        Row: {
          id: string;
          name: string;
          start_date: string;
          end_date: string;
          status: SeasonStatus;
          description: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          start_date: string;
          end_date: string;
          status?: SeasonStatus;
          description?: string | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          start_date?: string;
          end_date?: string;
          status?: SeasonStatus;
          description?: string | null;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };

      // -------------------------------------------------------------------
      // games
      // -------------------------------------------------------------------
      games: {
        Row: {
          id: string;
          league_id: string;
          season_id: string;
          home_team_id: string;
          away_team_id: string;
          facility_id: string | null;
          scheduled_date: string;
          scheduled_time: string;
          status: GameStatus;
          home_score: number | null;
          away_score: number | null;
          official_id: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          league_id: string;
          season_id: string;
          home_team_id: string;
          away_team_id: string;
          facility_id?: string | null;
          scheduled_date: string;
          scheduled_time: string;
          status?: GameStatus;
          home_score?: number | null;
          away_score?: number | null;
          official_id?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          league_id?: string;
          season_id?: string;
          home_team_id?: string;
          away_team_id?: string;
          facility_id?: string | null;
          scheduled_date?: string;
          scheduled_time?: string;
          status?: GameStatus;
          home_score?: number | null;
          away_score?: number | null;
          official_id?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      // -------------------------------------------------------------------
      // match_results
      // -------------------------------------------------------------------
      match_results: {
        Row: {
          id: string;
          game_id: string;
          home_score: number;
          away_score: number;
          winner_team_id: string | null;
          is_draw: boolean;
          reported_by: string;
          verified: boolean;
          verified_by: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          game_id: string;
          home_score: number;
          away_score: number;
          winner_team_id?: string | null;
          is_draw?: boolean;
          reported_by: string;
          verified?: boolean;
          verified_by?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          game_id?: string;
          home_score?: number;
          away_score?: number;
          winner_team_id?: string | null;
          is_draw?: boolean;
          reported_by?: string;
          verified?: boolean;
          verified_by?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      // -------------------------------------------------------------------
      // league_standings
      // -------------------------------------------------------------------
      league_standings: {
        Row: {
          id: string;
          league_id: string;
          team_id: string;
          season_id: string;
          games_played: number;
          wins: number;
          losses: number;
          ties: number;
          points: number;
          goals_for: number;
          goals_against: number;
          goal_difference: number;
          rank: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          league_id: string;
          team_id: string;
          season_id: string;
          games_played?: number;
          wins?: number;
          losses?: number;
          ties?: number;
          points?: number;
          goals_for?: number;
          goals_against?: number;
          goal_difference?: number;
          rank?: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          league_id?: string;
          team_id?: string;
          season_id?: string;
          games_played?: number;
          wins?: number;
          losses?: number;
          ties?: number;
          points?: number;
          goals_for?: number;
          goals_against?: number;
          goal_difference?: number;
          rank?: number;
          updated_at?: string;
        };
      };

      // -------------------------------------------------------------------
      // incident_reports
      // -------------------------------------------------------------------
      incident_reports: {
        Row: {
          id: string;
          game_id: string;
          reported_by: string;
          player_id: string;
          team_id: string;
          severity: IncidentSeverity;
          incident_type: string;
          description: string;
          action_taken: string | null;
          is_resolved: boolean;
          resolved_by: string | null;
          resolved_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          game_id: string;
          reported_by: string;
          player_id: string;
          team_id: string;
          severity: IncidentSeverity;
          incident_type: string;
          description: string;
          action_taken?: string | null;
          is_resolved?: boolean;
          resolved_by?: string | null;
          resolved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          game_id?: string;
          reported_by?: string;
          player_id?: string;
          team_id?: string;
          severity?: IncidentSeverity;
          incident_type?: string;
          description?: string;
          action_taken?: string | null;
          is_resolved?: boolean;
          resolved_by?: string | null;
          resolved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      // -------------------------------------------------------------------
      // facilities
      // -------------------------------------------------------------------
      facilities: {
        Row: {
          id: string;
          name: string;
          address: string;
          sport: Sport;
          capacity: number;
          indoor: boolean;
          description: string | null;
          image_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          address: string;
          sport: Sport;
          capacity?: number;
          indoor?: boolean;
          description?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          address?: string;
          sport?: Sport;
          capacity?: number;
          indoor?: boolean;
          description?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };

      // -------------------------------------------------------------------
      // facility_bookings
      // -------------------------------------------------------------------
      facility_bookings: {
        Row: {
          id: string;
          facility_id: string;
          game_id: string | null;
          booked_by: string;
          booking_date: string;
          start_time: string;
          end_time: string;
          status: BookingStatus;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          facility_id: string;
          game_id?: string | null;
          booked_by: string;
          booking_date: string;
          start_time: string;
          end_time: string;
          status?: BookingStatus;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          facility_id?: string;
          game_id?: string | null;
          booked_by?: string;
          booking_date?: string;
          start_time?: string;
          end_time?: string;
          status?: BookingStatus;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      // -------------------------------------------------------------------
      // schedules
      // -------------------------------------------------------------------
      schedules: {
        Row: {
          id: string;
          league_id: string;
          season_id: string;
          name: string;
          is_published: boolean;
          generated_at: string | null;
          published_at: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          league_id: string;
          season_id: string;
          name: string;
          is_published?: boolean;
          generated_at?: string | null;
          published_at?: string | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          league_id?: string;
          season_id?: string;
          name?: string;
          is_published?: boolean;
          generated_at?: string | null;
          published_at?: string | null;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };

      // -------------------------------------------------------------------
      // player_availability
      // -------------------------------------------------------------------
      player_availability: {
        Row: {
          id: string;
          player_id: string;
          game_id: string;
          status: AvailabilityStatus;
          note: string | null;
          updated_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          player_id: string;
          game_id: string;
          status?: AvailabilityStatus;
          note?: string | null;
          updated_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          player_id?: string;
          game_id?: string;
          status?: AvailabilityStatus;
          note?: string | null;
          updated_at?: string;
          created_at?: string;
        };
      };

      // -------------------------------------------------------------------
      // notifications
      // -------------------------------------------------------------------
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: NotificationType;
          title: string;
          message: string;
          is_read: boolean;
          reference_id: string | null;
          reference_type: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: NotificationType;
          title: string;
          message: string;
          is_read?: boolean;
          reference_id?: string | null;
          reference_type?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: NotificationType;
          title?: string;
          message?: string;
          is_read?: boolean;
          reference_id?: string | null;
          reference_type?: string | null;
          created_at?: string;
        };
      };

      // -------------------------------------------------------------------
      // join_requests
      // -------------------------------------------------------------------
      join_requests: {
        Row: {
          id: string;
          player_id: string;
          team_id: string;
          message: string | null;
          status: JoinRequestStatus;
          reviewed_by: string | null;
          reviewed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          player_id: string;
          team_id: string;
          message?: string | null;
          status?: JoinRequestStatus;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          player_id?: string;
          team_id?: string;
          message?: string | null;
          status?: JoinRequestStatus;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };

      // -------------------------------------------------------------------
      // substitute_requests
      // -------------------------------------------------------------------
      substitute_requests: {
        Row: {
          id: string;
          team_id: string;
          game_id: string;
          requested_by: string;
          filled_by: string | null;
          position_needed: string | null;
          skill_level_preferred: SkillLevel | null;
          status: SubstituteRequestStatus;
          message: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          team_id: string;
          game_id: string;
          requested_by: string;
          filled_by?: string | null;
          position_needed?: string | null;
          skill_level_preferred?: SkillLevel | null;
          status?: SubstituteRequestStatus;
          message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          team_id?: string;
          game_id?: string;
          requested_by?: string;
          filled_by?: string | null;
          position_needed?: string | null;
          skill_level_preferred?: SkillLevel | null;
          status?: SubstituteRequestStatus;
          message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };

    Views: Record<string, never>;

    Functions: Record<string, never>;

    Enums: {
      skill_level: SkillLevel;
      sport: Sport;
      division_level: DivisionLevel;
      admin_access_level: AdminAccessLevel;
      user_role: UserRole;
      game_status: GameStatus;
      incident_severity: IncidentSeverity;
      notification_type: NotificationType;
      availability_status: AvailabilityStatus;
      membership_status: MembershipStatus;
      booking_status: BookingStatus;
      gender: Gender;
      season_status: SeasonStatus;
      join_request_status: JoinRequestStatus;
      substitute_request_status: SubstituteRequestStatus;
      recruitment_application_status: RecruitmentApplicationStatus;
    };

    CompositeTypes: Record<string, never>;
  };
}

// ---------------------------------------------------------------------------
// Convenience Row / Insert / Update type aliases
// ---------------------------------------------------------------------------

type Tables = Database["public"]["Tables"];

export type UserRow = Tables["users"]["Row"];
export type UserInsert = Tables["users"]["Insert"];
export type UserUpdate = Tables["users"]["Update"];

export type PlayerRow = Tables["players"]["Row"];
export type PlayerInsert = Tables["players"]["Insert"];
export type PlayerUpdate = Tables["players"]["Update"];

export type CaptainRow = Tables["captains"]["Row"];
export type CaptainInsert = Tables["captains"]["Insert"];
export type CaptainUpdate = Tables["captains"]["Update"];

export type TeamRow = Tables["teams"]["Row"];
export type TeamInsert = Tables["teams"]["Insert"];
export type TeamUpdate = Tables["teams"]["Update"];

export type TeamRosterRow = Tables["team_rosters"]["Row"];
export type TeamRosterInsert = Tables["team_rosters"]["Insert"];
export type TeamRosterUpdate = Tables["team_rosters"]["Update"];

export type RosterMembershipRow = Tables["roster_memberships"]["Row"];
export type RosterMembershipInsert = Tables["roster_memberships"]["Insert"];
export type RosterMembershipUpdate = Tables["roster_memberships"]["Update"];

export type RecruitmentPostRow = Tables["recruitment_posts"]["Row"];
export type RecruitmentPostInsert = Tables["recruitment_posts"]["Insert"];
export type RecruitmentPostUpdate = Tables["recruitment_posts"]["Update"];

export type RecruitmentApplicationRow = Tables["recruitment_applications"]["Row"];
export type RecruitmentApplicationInsert = Tables["recruitment_applications"]["Insert"];
export type RecruitmentApplicationUpdate = Tables["recruitment_applications"]["Update"];

export type LeagueRow = Tables["leagues"]["Row"];
export type LeagueInsert = Tables["leagues"]["Insert"];
export type LeagueUpdate = Tables["leagues"]["Update"];

export type SeasonRow = Tables["seasons"]["Row"];
export type SeasonInsert = Tables["seasons"]["Insert"];
export type SeasonUpdate = Tables["seasons"]["Update"];

export type GameRow = Tables["games"]["Row"];
export type GameInsert = Tables["games"]["Insert"];
export type GameUpdate = Tables["games"]["Update"];

export type MatchResultRow = Tables["match_results"]["Row"];
export type MatchResultInsert = Tables["match_results"]["Insert"];
export type MatchResultUpdate = Tables["match_results"]["Update"];

export type LeagueStandingRow = Tables["league_standings"]["Row"];
export type LeagueStandingInsert = Tables["league_standings"]["Insert"];
export type LeagueStandingUpdate = Tables["league_standings"]["Update"];

export type IncidentReportRow = Tables["incident_reports"]["Row"];
export type IncidentReportInsert = Tables["incident_reports"]["Insert"];
export type IncidentReportUpdate = Tables["incident_reports"]["Update"];

export type FacilityRow = Tables["facilities"]["Row"];
export type FacilityInsert = Tables["facilities"]["Insert"];
export type FacilityUpdate = Tables["facilities"]["Update"];

export type FacilityBookingRow = Tables["facility_bookings"]["Row"];
export type FacilityBookingInsert = Tables["facility_bookings"]["Insert"];
export type FacilityBookingUpdate = Tables["facility_bookings"]["Update"];

export type ScheduleRow = Tables["schedules"]["Row"];
export type ScheduleInsert = Tables["schedules"]["Insert"];
export type ScheduleUpdate = Tables["schedules"]["Update"];

export type PlayerAvailabilityRow = Tables["player_availability"]["Row"];
export type PlayerAvailabilityInsert = Tables["player_availability"]["Insert"];
export type PlayerAvailabilityUpdate = Tables["player_availability"]["Update"];

export type NotificationRow = Tables["notifications"]["Row"];
export type NotificationInsert = Tables["notifications"]["Insert"];
export type NotificationUpdate = Tables["notifications"]["Update"];

export type JoinRequestRow = Tables["join_requests"]["Row"];
export type JoinRequestInsert = Tables["join_requests"]["Insert"];
export type JoinRequestUpdate = Tables["join_requests"]["Update"];

export type SubstituteRequestRow = Tables["substitute_requests"]["Row"];
export type SubstituteRequestInsert = Tables["substitute_requests"]["Insert"];
export type SubstituteRequestUpdate = Tables["substitute_requests"]["Update"];
