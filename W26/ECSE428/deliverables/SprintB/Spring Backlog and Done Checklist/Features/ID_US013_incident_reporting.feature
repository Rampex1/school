Feature: Incident Reporting

  As a Game Official,
  I want to report game incidents
  so that administrators can take action

  Background:
    Given the system has an active season
    And the following games exist:
      | game_id | home_team | away_team | scheduled_time      | status      |
      | 5001    | Redbirds  | Stingers  | 2026-03-15 18:00:00 | In Progress |
      | 5002    | Carabins  | Martlets  | 2026-03-16 18:00:00 | Completed   |
      | 5003    | Warriors  | Redbirds  | 2026-03-22 18:00:00 | Scheduled   |
    And a user account exists with Game Official role
    And I am logged in as a Game Official

  # Normal Flow: Official files incident report during game
  Scenario Outline: Official successfully files an incident report
    Given game "<game_id>" has status "<game_status>"
    When I file an incident report for game "<game_id>" with type "<incident_type>" and description "<description>" involving player "<player_name>"
    Then an incident report should be created for game "<game_id>"
    And the incident should be recorded with type "<incident_type>"
    And the league administrator should receive an incident notification
    And I should see a confirmation message "Incident report filed successfully."

    Examples:
      | game_id | game_status | incident_type      | description                         | player_name  |
      | 5001    | In Progress | Unsportsmanlike    | Verbal abuse towards opposing player | John Smith   |
      | 5002    | Completed   | Injury             | Player injured during second half    | Maria Garcia |
      | 5001    | In Progress | Equipment Damage   | Damaged basketball hoop             | N/A          |

  # Alternate Flow: Multiple incidents reported in the same game
  Scenario: Official reports multiple incidents in the same game
    Given game "5001" has status "In Progress"
    And an incident report already exists for game "5001" with type "Unsportsmanlike"
    When I file an incident report for game "5001" with type "Injury" and description "Player twisted ankle during play" involving player "Alex Wong"
    Then a second incident report should be created for game "5001"
    And game "5001" should have "2" incident reports on record
    And I should see a confirmation message "Incident report filed successfully."

  # Alternate Flow: Official adds follow-up notes to existing incident
  Scenario: Official adds follow-up information to an existing incident report
    Given an incident report "INC001" exists for game "5001"
    When I add a follow-up note to incident "INC001" with content "Player was given a warning and allowed to continue"
    Then the follow-up note should be appended to incident "INC001"
    And the incident should show "2" entries in its history
    And I should see a confirmation message "Follow-up note added successfully."

  # Error Flow: Missing required fields
  Scenario: Official attempts to file an incident report with missing required fields
    Given game "5001" has status "In Progress"
    When I attempt to file an incident report for game "5001" with type "" and description "" involving player ""
    Then I should see an error message "Incident type and description are required."
    And no incident report should be created

  # Error Flow: Unauthorized user attempts to file incident
  Scenario: Non-official user attempts to file an incident report
    Given I am logged in as a Player
    When I attempt to file an incident report for game "5001" with type "Unsportsmanlike" and description "Bad behavior observed"
    Then I should see an error message "Only game officials can file incident reports."
    And no incident report should be created

  # Error Flow: Incident report for a game that has not started
  Scenario: Official attempts to file an incident for a game not yet started
    Given game "5003" has status "Scheduled"
    When I attempt to file an incident report for game "5003" with type "Unsportsmanlike" and description "Pre-game altercation"
    Then I should see an error message "Incident reports can only be filed for games that are in progress or completed."
    And no incident report should be created

  # Error Flow: Description exceeds maximum length
  Scenario: Official attempts to file an incident with an excessively long description
    Given game "5001" has status "In Progress"
    When I attempt to file an incident report for game "5001" with a description exceeding 2000 characters
    Then I should see an error message "Description must not exceed 2000 characters."
    And no incident report should be created
