Feature: Schedule Management

  As an intramural sports Organizer,
  I want to view and manage all league schedules, team rosters, and game results in one centralized dashboard
  So that I can oversee multiple leagues and resolve conflicts.

Background:
    Given the system has an active season
    And the following leagues exist:
      | league_id | sport      | status |
      | 3001      | Basketball | Active |
      | 3002      | Soccer     | Active |
    And the following teams exist:
      | team_id | team_name     | league_id | roster_count | min_players |
      | 4001    | Red           | 3001      | 8            | 5           |
      | 4002    | Blue          | 3001      | 4            | 5           |
    And the following games exist:
      | game_id | home_team_id | away_team_id | venue_id | scheduled_time       | status    |
      | 5001    | 4001         | 4002         | 6001     | 2026-02-03 18:00:00  | Scheduled |
      | 5002    | 4001         | 4002         | 6001     | 2026-02-03 18:00:00  | Scheduled |
    And a user account exists with Organizer role
    And I am logged in as an Organizer

Scenario: Organizer views dashboard with leagues and alerts
    When I view the admin dashboard
    Then I should see a summary showing "2" active leagues
    And I should see "2" upcoming games
    And I should see "1" team requiring attention
    And I should see "1" unresolved scheduling conflict

Scenario: Organizer reschedules a game to resolve conflict
    Given games "5001" and "5002" conflict at venue "6001"
    When I reschedule game "5002" to "2026-02-04 18:00:00" to resolve the conflict
    Then the conflict should be marked as resolved
    And the affected teams should receive notifications

# Error: Unauthorized Access
Scenario: Non-organizer attempts to access admin dashboard
    Given I am logged in as a Captain
    When I attempt to view the organizer dashboard
    Then I should see an error message "Access Denied"

# Error: Invalid Reschedule Time
Scenario: Organizer attempts to reschedule game to past date
    When I reschedule game "5001" to "2026-01-15 18:00:00"
    Then I should see an error message "Cannot schedule games in the past."
    And the game schedule should remain unchanged

# Error Flow: Empty Announcement
Scenario: Organizer attempts to send empty announcement
    When I attempt to send an announcement with subject "Update" and empty content
    Then I should see an error message "Message content is required."
    And the announcement should not be sent