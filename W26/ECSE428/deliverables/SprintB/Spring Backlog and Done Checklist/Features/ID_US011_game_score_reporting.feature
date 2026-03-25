Feature: Game Score Reporting

  As a Game Official,
  I want to submit match scores
  so that league standings are updated

  Background:
    Given the system has an active season
    And the following leagues exist:
      | league_id | sport      | status |
      | 3001      | Basketball | Active |
    And the following teams exist:
      | team_id | team_name  | league_id |
      | 4001    | Redbirds   | 3001      |
      | 4002    | Stingers   | 3001      |
    And the following games exist:
      | game_id | home_team_id | away_team_id | scheduled_time      | status    |
      | 5001    | 4001         | 4002         | 2026-03-15 18:00:00 | Completed |
      | 5002    | 4001         | 4002         | 2026-03-22 18:00:00 | Scheduled |
    And a user account exists with Game Official role
    And I am logged in as a Game Official

  # Normal Flow: Official submits valid game score
  Scenario Outline: Official successfully submits game score
    Given game "<game_id>" has status "Completed"
    When I submit the score for game "<game_id>" with home score "<home_score>" and away score "<away_score>"
    Then the score for game "<game_id>" should be recorded as "<home_score>" to "<away_score>"
    And the league standings for league "3001" should be updated
    And both teams should receive a notification of the final score
    And I should see a confirmation message "Score submitted successfully."

    Examples:
      | game_id | home_score | away_score |
      | 5001    | 78         | 65         |
      | 5001    | 55         | 55         |

  # Alternate Flow: Score disputed by captain
  Scenario: Captain disputes a submitted game score
    Given game "5001" has a recorded score of "78" to "65"
    And I am logged in as the captain of team "Stingers"
    When I dispute the score for game "5001" with reason "Incorrect final score, game ended 72-65"
    Then a score dispute should be created for game "5001"
    And the game status should be updated to "Score Disputed"
    And the league administrator should receive a dispute notification
    And I should see a confirmation message "Score dispute submitted. An administrator will review."

  # Alternate Flow: Official updates a previously submitted score
  Scenario: Official corrects a previously submitted score
    Given game "5001" has a recorded score of "78" to "65"
    When I update the score for game "5001" with home score "72" and away score "65" and reason "Correction: miscounted third quarter"
    Then the score for game "5001" should be updated to "72" to "65"
    And the league standings should be recalculated
    And I should see a confirmation message "Score updated successfully."

  # Error Flow: Non-official tries to submit a score
  Scenario: Non-official user attempts to submit a game score
    Given I am logged in as a Player
    When I attempt to submit the score for game "5001" with home score "78" and away score "65"
    Then I should see an error message "Only game officials can submit scores."
    And no score should be recorded

  # Error Flow: Game not in correct status for score submission
  Scenario: Official attempts to submit score for a game that has not been completed
    Given game "5002" has status "Scheduled"
    When I attempt to submit the score for game "5002" with home score "50" and away score "45"
    Then I should see an error message "Scores can only be submitted for completed games."
    And no score should be recorded

  # Error Flow: Invalid score values
  Scenario Outline: Official submits invalid score values
    Given game "5001" has status "Completed"
    When I attempt to submit the score for game "5001" with home score "<home_score>" and away score "<away_score>"
    Then I should see an error message "<error_message>"
    And no score should be recorded

    Examples:
      | home_score | away_score | error_message                          |
      | -5         | 65         | Score values must be non-negative.      |
      | 78         | -1         | Score values must be non-negative.      |
      |            | 65         | Both home and away scores are required. |
