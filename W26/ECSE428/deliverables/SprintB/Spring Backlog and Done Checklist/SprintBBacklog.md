# Sprint B - Sprint Backlog

## ECSE 428 - Group 3 - Intramural Team Management System (ITMS)

### Sprint B Backlog Items

| ID     | Backlog Item Name          | Priority | Refinement Step       | Feature File Name                          |
|--------|----------------------------|----------|-----------------------|--------------------------------------------|
| US011  | Game Score Reporting       | High     | Ready for Development | ID_US011_game_score_reporting.feature      |
| US012  | League Standings View      | High     | Ready for Development | ID_US012_league_standings_view.feature     |
| US013  | Incident Reporting         | Medium   | Ready for Development | ID_US013_incident_reporting.feature        |
| US014  | Facility Booking           | Medium   | Ready for Development | ID_US014_facility_booking.feature          |
| US015  | Team Roster Management     | High     | Ready for Development | ID_US015_team_roster_management.feature    |

### Priority Justification

- **US011 - Game Score Reporting (High):** Core functionality required for league operations. Without score reporting, standings and season progression cannot function. This is a dependency for US012.
- **US012 - League Standings View (High):** Directly depends on US011 score data. High player engagement feature that drives ongoing usage of the platform.
- **US013 - Incident Reporting (Medium):** Important for league governance and safety but not a blocker for core game flow. Can operate independently of other features.
- **US014 - Facility Booking (Medium):** Supports scheduling operations established in Sprint A (US004). Enhances administrative workflow but games can be scheduled without automated facility management.
- **US015 - Team Roster Management (High):** Extends team management capabilities from Sprint A (US002, US009, US010). Essential for captains to actively manage their teams during the season.

### Dependencies

- US012 (League Standings View) depends on US011 (Game Score Reporting) for score data
- US014 (Facility Booking) relates to US004 (Schedule Management) from Sprint A
- US015 (Team Roster Management) extends US002 (Join Team), US009 (Leave Team), and US010 (Team Creation) from Sprint A

### Sprint B Velocity Target

- **Planned Story Points:** 34
- **Sprint Duration:** 3 weeks (March 10 - March 30, 2026)
- **Team Capacity:** 6 developers (Scrum Master excluded from development tasks)
