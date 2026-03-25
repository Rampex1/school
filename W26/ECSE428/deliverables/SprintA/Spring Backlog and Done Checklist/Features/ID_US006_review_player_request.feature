Feature: Review Player Request

  As a Captain,
  I want to approve or reject player requests to join my team,
  So that I can control my team roster.

  Background:
    Given the system has an active season
    And the following teams exist:
      | team_id | team_name    | league_id | registration_open | captain_email           |
      | 4001    | Red Hawks    | 2001      | true              | captain@mcgill.ca       |
      | 4002    | Ice Breakers | 2002      | false             | icecaptain@mcgill.ca    |
      | 4003    | Blue Bears   | 2001      | true              | bluecaptain@mcgill.ca   |
    And the following players exist:
      | player_id | player_email          |
      | 3001      | player1@mcgill.ca     |
      | 3002      | player2@mcgill.ca     |
    And the following join requests exist:
      | request_id | team_id | player_id | status   |
      | 5001       | 4001    | 3001      | Pending  |
      | 5002       | 4001    | 3002      | Pending  |
      | 5003       | 4001    | 3001      | Approved |
      | 5004       | 4002    | 3002      | Pending  |
      | 5005       | 4003    | 3001      | Pending  |
    And I am the captain of team "4001"
    And my email is "captain@mcgill.ca"

  # Normal Flow
  Scenario: Captain approves a pending join request
    Given a join request with ID "5001" exists for team "4001" with status "Pending"
    When I approve the join request "5001"
    Then the join request "5001" status should become "Approved"
    And player "3001" should be added to the roster for team "4001"
    And I should see a confirmation message "Player request approved."
  
  Scenario: Pending join requests are rejected when registration closes
    Given a join request with ID "5004" exists for team "4002" with status "Pending"
    And team "4002" registration is closed
    When the system processes join requests for closed registrations
    Then the join request "5004" status should become "Rejected"
    And the player should be informed that registration is closed

  # Alternate Flow 
  Scenario: Captain rejects a pending join request
    Given a join request with ID "5002" exists for team "4001" with status "Pending"
    When I reject the join request "5002"
    Then the join request "5002" status should become "Rejected"
    And player "3002" should not be added to the roster for team "4001"
    And I should see a confirmation message "Player request rejected." 

  # Error Flow
  Scenario: Player attempts to approve a join request (unauthorized)
    Given I am logged in as a Player
    When I attempt to approve the join request "5001"
    Then I should see an error message "Only captains can review join requests."
    And the join request "5001" status should remain "Pending"
    And the roster for team "4001" should remain unchanged 

  Scenario: Captain attempts to review a join request that is already processed
    Given a join request with ID "5003" exists for team "4001" with status "Approved"
    When I attempt to reject the join request "5003"
    Then I should see an error message "This request has already been reviewed."
    And the join request "5003" status should remain "Approved"
    And the roster for team "4001" should remain unchanged

  Scenario: Captain attempts to review a request for a team they do not captain
    Given a join request with ID "5005" exists for team "4003" with status "Pending"
    When I attempt to approve the join request "5005"
    Then I should see an error message "You are not authorized to review requests for this team."
    And the join request "5005" status should remain "Pending"
    And the roster for team "4003" should remain unchanged
