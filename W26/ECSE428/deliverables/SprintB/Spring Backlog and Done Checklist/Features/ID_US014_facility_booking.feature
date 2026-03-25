Feature: Facility Booking

  As an Administrator,
  I want to manage facility bookings
  so games have venues

  Background:
    Given the system has an active season
    And the following facilities exist:
      | facility_id | facility_name       | capacity | available |
      | 6001        | McGill Gymnasium A  | 200      | true      |
      | 6002        | McGill Gymnasium B  | 150      | true      |
      | 6003        | Outdoor Field 1     | 500      | true      |
    And the following games exist:
      | game_id | home_team | away_team | scheduled_time      | status    |
      | 5001    | Redbirds  | Stingers  | 2026-03-20 18:00:00 | Scheduled |
      | 5002    | Carabins  | Martlets  | 2026-03-20 18:00:00 | Scheduled |
      | 5003    | Warriors  | Redbirds  | 2026-03-21 18:00:00 | Scheduled |
    And a user account exists with Administrator role
    And I am logged in as an Administrator

  # Normal Flow: Admin books facility for a game
  Scenario Outline: Administrator successfully books a facility for a game
    When I book facility "<facility_id>" for game "<game_id>" on "<date>" from "<start_time>" to "<end_time>"
    Then facility "<facility_name>" should be booked for game "<game_id>"
    And the booking should be confirmed for "<date>" from "<start_time>" to "<end_time>"
    And the teams involved in game "<game_id>" should receive a venue notification
    And I should see a confirmation message "Facility booked successfully."

    Examples:
      | facility_id | facility_name      | game_id | date       | start_time | end_time |
      | 6001        | McGill Gymnasium A | 5001    | 2026-03-20 | 18:00      | 20:00    |
      | 6003        | Outdoor Field 1    | 5003    | 2026-03-21 | 18:00      | 20:00    |

  # Alternate Flow: Reschedule existing booking
  Scenario: Administrator reschedules an existing facility booking
    Given facility "6001" is booked for game "5001" on "2026-03-20" from "18:00" to "20:00"
    When I reschedule the booking for game "5001" to facility "6002" on "2026-03-22" from "17:00" to "19:00"
    Then the original booking for facility "6001" on "2026-03-20" should be released
    And facility "6002" should be booked for game "5001" on "2026-03-22" from "17:00" to "19:00"
    And the teams involved should receive an updated venue notification
    And I should see a confirmation message "Booking rescheduled successfully."

  # Alternate Flow: Admin views all bookings for a date
  Scenario: Administrator views all facility bookings for a specific date
    Given the following bookings exist:
      | facility_name      | game_id | date       | start_time | end_time |
      | McGill Gymnasium A | 5001    | 2026-03-20 | 18:00      | 20:00    |
      | McGill Gymnasium B | 5002    | 2026-03-20 | 18:00      | 20:00    |
    When I request all bookings for date "2026-03-20"
    Then I should see "2" bookings for that date
    And each booking should show the facility name, game details, and time slot

  # Error Flow: Double booking conflict
  Scenario: Administrator attempts to double-book a facility
    Given facility "6001" is booked for game "5001" on "2026-03-20" from "18:00" to "20:00"
    When I attempt to book facility "6001" for game "5002" on "2026-03-20" from "19:00" to "21:00"
    Then I should see an error message "Facility McGill Gymnasium A is already booked during the requested time slot."
    And no new booking should be created

  # Error Flow: Booking for a past date
  Scenario: Administrator attempts to book a facility for a past date
    When I attempt to book facility "6001" for game "5001" on "2025-01-15" from "18:00" to "20:00"
    Then I should see an error message "Cannot create bookings for past dates."
    And no booking should be created

  # Error Flow: Non-administrator attempts to book facility
  Scenario: Non-administrator attempts to create a facility booking
    Given I am logged in as a Captain
    When I attempt to book facility "6001" for game "5001" on "2026-03-20" from "18:00" to "20:00"
    Then I should see an error message "Only administrators can manage facility bookings."
    And no booking should be created

  # Error Flow: Invalid time range
  Scenario: Administrator attempts to book with end time before start time
    When I attempt to book facility "6001" for game "5001" on "2026-03-20" from "20:00" to "18:00"
    Then I should see an error message "End time must be after start time."
    And no booking should be created
