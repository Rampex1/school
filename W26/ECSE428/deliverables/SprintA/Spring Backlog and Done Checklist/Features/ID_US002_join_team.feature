Feature: Join Team

  As a Player,
  I want to request to join an existing team
  so that I can participate in intramural games

  Background:
    Given the system has an active season
    And the following teams exist:
      | team_id | team_name | league_id | roster_size | max_roster |
      | 3001    | Redbirds  | 2001      | 10          | 15         |
      | 3002    | Stingers  | 2002      | 15          | 15         |
    And a user account exists with Player role
    And I am logged in as a Player

  Scenario Outline: Player successfully sends a join request to a team
    Given the team "<team_name>" has open roster spots
    When I request to join the team "<team_name>"
    Then a join request should be created for team "<team_name>"
    And I should see a confirmation message "Your request to join <team_name> has been sent."
    And the team captain should receive a notification

    Examples:
      | team_name |
      | Redbirds  |

  # Alternate Flow: Player is already on another team in the same league
  Scenario: Player who is already on a team in the league requests to join another
    Given I am already a member of team "Redbirds" in league "2001"
    And another team "Carabins" exists in league "2001"
    When I request to join the team "Carabins"
    Then I should see an error message "You are already on a team in this league."

  # Error Flow: Team roster is full
  Scenario: Player attempts to join a team with a full roster
    Given the team "Stingers" has a full roster
    When I request to join the team "Stingers"
    Then I should see an error message "This team's roster is full."
    And no join request should be created

  # Error Flow: Duplicate join request
  Scenario: Player sends a duplicate join request
    Given I have already sent a pending join request to team "Redbirds"
    When I request to join the team "Redbirds"
    Then I should see an error message "You already have a pending request for this team."
