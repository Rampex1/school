Feature: Leave a team
  As a player
  I want to leave a team
  So that I can switch teams or stop participating

  Background:
    Given a team "Wolves" exists
    And a player account "Fahim" exists
    And player "Fahim" is a member of team "Wolves"
    And I am logged in as player "Fahim"

  # Normal flow
  Scenario: Player leaves a team successfully
    When I request to leave team "Wolves"
    Then player "Fahim" should no longer be a member of team "Wolves"
    And I should see a confirmation message "You have left the team"

  # Alternate flow
  Scenario: Player cancels leaving a team
    When I start a leave request for team "Wolves"
    And I cancel the request
    Then player "Fahim" should remain a member of team "Wolves"

  # Error flow
  Scenario: Player cannot leave a team they are not in
    Given player "Fahim" is not a member of team "Wolves"
    When I request to leave team "Wolves"
    Then I should see an error message "You are not a member of this team"
