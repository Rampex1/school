Feature: Team Roster Management

  As a Captain,
  I want to manage my team roster
  so I can add or remove players

  Background:
    Given the system has an active season
    And the following teams exist:
      | team_id | team_name  | league_id | roster_count | max_roster |
      | 4001    | Redbirds   | 3001      | 10           | 15         |
      | 4002    | Stingers   | 3001      | 15           | 15         |
    And the following players exist:
      | player_id | player_name   | team_id |
      | 7001      | John Smith    | 4001    |
      | 7002      | Maria Garcia  | 4001    |
      | 7003      | Alex Wong     | null    |
      | 7004      | Sarah Lee     | null    |
      | 7005      | David Brown   | 4002    |
    And a user account exists with Captain role for team "Redbirds"
    And I am logged in as the captain of team "Redbirds"

  # Normal Flow: Captain adds a player to the roster
  Scenario Outline: Captain successfully adds a player to the team roster
    Given player "<player_name>" is not currently on any team in league "3001"
    And team "Redbirds" has available roster spots
    When I add player "<player_name>" to team "Redbirds"
    Then player "<player_name>" should be a member of team "Redbirds"
    And the roster count for team "Redbirds" should increase by 1
    And player "<player_name>" should receive a notification "You have been added to Redbirds."
    And I should see a confirmation message "<player_name> has been added to the roster."

    Examples:
      | player_name |
      | Alex Wong   |
      | Sarah Lee   |

  # Normal Flow: Captain removes a player from the roster
  Scenario: Captain successfully removes a player from the team roster
    When I remove player "John Smith" from team "Redbirds"
    Then player "John Smith" should no longer be a member of team "Redbirds"
    And the roster count for team "Redbirds" should decrease by 1
    And player "John Smith" should receive a notification "You have been removed from Redbirds."
    And I should see a confirmation message "John Smith has been removed from the roster."

  # Normal Flow: Captain views current roster
  Scenario: Captain views the full team roster
    When I request the roster for team "Redbirds"
    Then I should see a list of all players on team "Redbirds"
    And the roster should show "10" players
    And each player entry should include their name and join date

  # Alternate Flow: Roster at maximum capacity
  Scenario: Captain attempts to add a player when roster is at maximum capacity
    Given team "Stingers" has a roster count of "15" out of a maximum of "15"
    And I am logged in as the captain of team "Stingers"
    When I attempt to add player "Alex Wong" to team "Stingers"
    Then I should see an error message "Team roster is at maximum capacity (15/15). Remove a player before adding a new one."
    And player "Alex Wong" should not be added to team "Stingers"

  # Alternate Flow: Captain adds player from waitlist
  Scenario: Captain adds a player who has a pending join request
    Given player "Alex Wong" has a pending join request for team "Redbirds"
    When I add player "Alex Wong" to team "Redbirds"
    Then player "Alex Wong" should be a member of team "Redbirds"
    And the pending join request should be marked as "Accepted"
    And I should see a confirmation message "Alex Wong has been added to the roster."

  # Error Flow: Non-captain attempts to modify the roster
  Scenario: Non-captain user attempts to add a player to the roster
    Given I am logged in as a Player
    When I attempt to add player "Alex Wong" to team "Redbirds"
    Then I should see an error message "Only team captains can manage the roster."
    And no roster change should be made

  # Error Flow: Captain attempts to modify another team's roster
  Scenario: Captain attempts to modify the roster of a different team
    When I attempt to add player "Alex Wong" to team "Stingers"
    Then I should see an error message "You can only manage the roster for your own team."
    And no roster change should be made

  # Error Flow: Player is already on the roster
  Scenario: Captain attempts to add a player who is already on the team
    When I attempt to add player "John Smith" to team "Redbirds"
    Then I should see an error message "John Smith is already on the Redbirds roster."
    And no roster change should be made

  # Error Flow: Player is on another team in the same league
  Scenario: Captain attempts to add a player who is on another team in the same league
    When I attempt to add player "David Brown" to team "Redbirds"
    Then I should see an error message "David Brown is already on another team in this league."
    And no roster change should be made
