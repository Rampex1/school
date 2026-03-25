Feature: Season Creation

  As an Organizer,
  I want to create a new season
  so that leagues and games can be organized for the upcoming term

  Background:
    Given a user account exists with Organizer role
    And I am logged in as an Organizer

  Scenario Outline: Organizer successfully creates a new season
    When I create a new season with name "<season_name>", start date "<start_date>", and end date "<end_date>"
    Then the season "<season_name>" should be created
    And the season status should be "Active"
    And I should see a confirmation message "Season <season_name> created successfully."

    Examples:
      | season_name  | start_date | end_date   |
      | Winter 2026  | 2026-01-12 | 2026-04-15 |
      | Fall 2026    | 2026-09-01 | 2026-12-10 |

  # Alternate Flow: Creating a season when an active season already exists
  Scenario: Organizer creates a season while another is still active
    Given a season "Winter 2026" already exists with status "Active"
    When I attempt to create a new season with name "Fall 2026", start date "2026-09-01", and end date "2026-12-10"
    Then I should see an error message "An active season already exists. Please close it before creating a new one."

  # Error Flow: End date before start date
  Scenario: Organizer enters an end date earlier than the start date
    When I attempt to create a new season with name "Winter 2026", start date "2026-04-15", and end date "2026-01-12"
    Then I should see an error message "End date must be after the start date."

  # Error Flow: Missing season name
  Scenario: Organizer attempts to create a season without a name
    When I attempt to create a new season without a name, start date "2026-01-12", and end date "2026-04-15"
    Then I should see an error message "Season name is required."

  # Error Flow: Non-organizer attempts to create a season
  Scenario: Player attempts to create a season
    Given I am logged in as a Player
    When I attempt to create a new season
    Then I should see an error message "Only organizers can manage seasons."
