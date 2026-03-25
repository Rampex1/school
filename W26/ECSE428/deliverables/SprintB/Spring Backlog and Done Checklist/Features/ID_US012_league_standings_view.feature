Feature: League Standings View

  As a Player,
  I want to view league standings
  so I can see my team's ranking

  Background:
    Given the system has an active season
    And the following leagues exist:
      | league_id | sport      | division   | status   |
      | 3001      | Basketball | Division A | Active   |
      | 3002      | Basketball | Division B | Active   |
      | 3003      | Soccer     | Division A | Inactive |
    And the following teams exist with standings:
      | team_id | team_name  | league_id | wins | losses | ties | points |
      | 4001    | Redbirds   | 3001      | 5    | 1      | 0    | 15     |
      | 4002    | Stingers   | 3001      | 4    | 2      | 0    | 12     |
      | 4003    | Carabins   | 3001      | 3    | 3      | 0    | 9      |
      | 4004    | Martlets   | 3002      | 6    | 0      | 0    | 18     |
      | 4005    | Warriors   | 3002      | 2    | 4      | 0    | 6      |
    And a user account exists with Player role
    And I am logged in as a Player

  # Normal Flow: Player views current standings
  Scenario: Player views current league standings
    When I request the standings for league "3001"
    Then I should see the following standings:
      | rank | team_name  | wins | losses | ties | points |
      | 1    | Redbirds   | 5    | 1      | 0    | 15     |
      | 2    | Stingers   | 4    | 2      | 0    | 12     |
      | 3    | Carabins   | 3    | 3      | 0    | 9      |
    And the standings should be ordered by points descending

  # Alternate Flow: Filter standings by division
  Scenario: Player filters standings by division
    When I request the standings for sport "Basketball" filtered by division "Division B"
    Then I should see the following standings:
      | rank | team_name  | wins | losses | ties | points |
      | 1    | Martlets   | 6    | 0      | 0    | 18     |
      | 2    | Warriors   | 2    | 4      | 0    | 6      |
    And only teams from "Division B" should be displayed

  # Alternate Flow: View detailed team stats within standings
  Scenario: Player views detailed statistics for a team in the standings
    When I request the standings for league "3001"
    And I request detailed stats for team "Redbirds"
    Then I should see the following detailed statistics:
      | stat             | value |
      | Games Played     | 6     |
      | Wins             | 5     |
      | Losses           | 1     |
      | Ties             | 0     |
      | Points For       | 420   |
      | Points Against   | 380   |
      | Win Percentage   | 83.3  |

  # Alternate Flow: View standings across all divisions for a sport
  Scenario: Player views combined standings for a sport
    When I request the overall standings for sport "Basketball"
    Then I should see teams from all active divisions
    And the standings should include teams from "Division A" and "Division B"
    And the standings should be ordered by points descending

  # Error Flow: No standings available for inactive league
  Scenario: Player attempts to view standings for an inactive league
    When I request the standings for league "3003"
    Then I should see an error message "Standings are not available for inactive leagues."

  # Error Flow: League does not exist
  Scenario: Player attempts to view standings for a non-existent league
    When I request the standings for league "9999"
    Then I should see an error message "League not found."

  # Error Flow: No games played yet in league
  Scenario: Player views standings for a league with no completed games
    Given a league "3004" exists with sport "Volleyball" and status "Active"
    And league "3004" has no completed games
    When I request the standings for league "3004"
    Then I should see a message "No standings available yet. Games have not started."
