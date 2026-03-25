Feature: Captain Team Creation

  As a Captain,
  I want to create a new team within a specific league
  so that I can begin building a roster for the upcoming season

  Background:
    Given the system has an active season
    And the following leagues exist:
      | league_id | sport   | skill_level |
      | 2001      | Soccer  | Intermediate |
      | 2002      | Hockey  | Beginner     |
    And a user account exists with Captain role
    And I am logged in as a Captain

  Scenario Outline: Captain successfully creates a new team in a league
    When I create a team named "<team_name>" in league "<league_id>"
    Then the team "<team_name>" should be created in league "<league_id>"
    And I should be assigned as the team captain
    And I should see a confirmation message "Team <team_name> has been created successfully."

    Examples:
      | league_id | team_name        |
      | 2001      | Redbirds        |
      | 2002      | Stingers     |

  # Error Flow: Duplicate Team Name in Same League
  Scenario: Captain attempts to create a team with a duplicate name in the same league
    Given a team named "Redbirds" already exists in league "2001"
    When I attempt to create a team named "Redbirds" in league "2001"
    Then I should see an error message "A team with this name already exists in this league."

  # Error Flow: Empty Team Name
  Scenario: Captain attempts to create a team without entering a name
    When I attempt to create a team without a name in league "2001"
    Then I should see an error message "Team name is required."

  # Error Flow: Unauthorized User Attempts Team Creation
  Scenario: Non-captain user attempts to create a team
    Given I am logged in as a Player
    When I attempt to create a team in league "2001"
    Then I should see an error message "Only captains can create teams."
    And the team should not be created
