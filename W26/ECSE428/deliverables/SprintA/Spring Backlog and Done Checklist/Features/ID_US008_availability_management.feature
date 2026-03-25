Feature: Player Availability Management
  As a Player,
  I want to mark my availability for upcoming games
  so that my captain knows when I can participate and can plan the roster accordingly

  Background:
    Given the following users exist:
      | email                  | role    | name  |
      | brian.player@mcgill.ca | Player  | Brian |
      | kirk.captain@mcgill.ca | Captain | Kirk  |
      | lisa.admin@mcgill.ca   | Admin   | Lisa  |
    And the following teams exist:
      | team_name   | sport  | captain                |
      | Red Dragons | Soccer | kirk.captain@mcgill.ca |
    And "brian.player@mcgill.ca" is a rostered player on team "Red Dragons"
    And the following games are scheduled:
      | game_id | team_name   | date       | time  | venue   |
      | G001    | Red Dragons | 2026-02-10 | 18:00 | Field 1 |
      | G002    | Red Dragons | 2026-02-15 | 19:00 | Field 2 |
      | G003    | Red Dragons | 2026-03-01 | 18:30 | Field 1 |

  @normal
  Scenario: Player marks themselves as available for an upcoming game
    Given I am logged in as "brian.player@mcgill.ca"
    When I set my availability for game "G001" on "2026-02-10" to "Available"
    Then my availability status for game "G001" should be "Available"
    And the captain "kirk.captain@mcgill.ca" should see my status as "Available" for game "G001"

  @normal
  Scenario: Player marks themselves as unavailable for an upcoming game
    Given I am logged in as "brian.player@mcgill.ca"
    When I set my availability for game "G002" on "2026-02-15" to "Unavailable"
    Then my availability status for game "G002" should be "Unavailable"
    And the system should display a confirmation message "Availability updated successfully"

  @normal
  Scenario: Player marks availability as "Maybe" for an upcoming game
    Given I am logged in as "brian.player@mcgill.ca"
    When I set my availability for game "G003" on "2026-03-01" to "Maybe"
    Then my availability status for game "G003" should be "Maybe"
    And the captain "kirk.captain@mcgill.ca" should see my status as "Maybe" for game "G003"

  @alternate
  Scenario: Player views their availability across multiple upcoming games
    Given I am logged in as "brian.player@mcgill.ca"
    And I have set the following availability:
      | game_id | status      |
      | G001    | Available   |
      | G002    | Unavailable |
      | G003    | Maybe       |
    When I view my availability for upcoming games
    Then I should see my availability for game "G001" as "Available"
    And I should see my availability for game "G002" as "Unavailable"
    And I should see my availability for game "G003" as "Maybe"

  @alternate
  Scenario: System displays default "No Response" status for games without availability set
    Given I am logged in as "brian.player@mcgill.ca"
    And I have NOT set availability for game "G003"
    When I view my availability for upcoming games
    Then my availability for game "G003" should display as "No Response"
    And the captain should see my status as "No Response" for game "G003"

  @alternate
  Scenario: Calendar interface displays upcoming games with availability options
    Given I am logged in as "brian.player@mcgill.ca"
    When I view the calendar of upcoming games
    Then I should see available options:
      | Available   |
      | Unavailable |
      | Maybe       |
    And each game entry should show the current date, time, and venue

  @error
  Scenario: Player cannot mark availability for a team they are not rostered on
    Given I am logged in as "brian.player@mcgill.ca"
    And the following team exists:
      | team_name   | sport      | captain                |
      | Blue Wolves | Basketball | kirk.captain@mcgill.ca |
    And "brian.player@mcgill.ca" is NOT a rostered player on team "Blue Wolves"
    And the following game is scheduled:
      | game_id | team_name   | date       | time  |
      | G100    | Blue Wolves | 2026-02-20 | 17:00 |
    When I attempt to set availability for game "G100"
    Then I should see an error message "You are not authorized to update availability for this team"
    And I should NOT be able to mark my availability for game "G100"

  @error
  Scenario: Player cannot mark availability for past games
    Given I am logged in as "brian.player@mcgill.ca"
    And the following game exists:
      | game_id | team_name   | date       | time  |
      | G999    | Red Dragons | 2026-01-15 | 18:00 |
    And the current date is "2026-02-03"
    When I view the schedule for past game "G999"
    Then game "G999" should NOT be editable
    And I should NOT see availability options for game "G999"
