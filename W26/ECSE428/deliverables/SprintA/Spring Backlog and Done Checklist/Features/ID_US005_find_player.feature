Feature: Find other players
  As a Player
  I want to find other players
  So that I can see where my friends or other people are and which teams they are on

  # Notes/Assumptions from story:
  # - Searchable player directory
  # - Players can search by name or email

  Background:
    Given the player directory service is available
    And I am logged in as a Player
    And my account is in good standing

  # -------------------------
  # Normal flow scenarios
  # -------------------------

  @normal
  Scenario: Search by exact player name and view limited profile information
    Given player "Alex Chen" exists
    And "Alex Chen" is discoverable in the player directory
    When I search for player by name "Alex Chen"
    Then I should see search results containing "Alex Chen"
    And each result should show only limited profile information:
      | displayName |
      | teamName    |
      | status      |
    And I should not see sensitive fields in the results:
      | email      |
      | phone      |
      | address    |
      | locationId |

  @normal
  Scenario: Search by exact email and view limited profile information
    Given player with email "alex.chen@example.com" exists
    And that player is discoverable in the player directory
    When I search for player by email "alex.chen@example.com"
    Then I should see search results containing that player
    And each result should show only limited profile information:
      | displayName |
      | teamName    |
      | status      |

  @normal
  Scenario: Use typeahead search with partial name input
    Given player "Alicia Park" exists
    And "Alicia Park" is discoverable in the player directory
    When I search for player by partial name "Ali"
    Then I should see matching results that include "Alicia Park"
    And results should be limited to the top 20 matches
    And each result should show only limited profile information:
      | displayName |
      | teamName    |
      | status      |

  # -------------------------
  # Alternate flow scenarios
  # -------------------------

  @alternate
  Scenario: Multiple players match a query and results are paginated
    Given 35 discoverable players exist with names containing "Jordan"
    When I search for player by name "Jordan"
    Then I should see at most 20 results per page
    And I should be able to view subsequent pages of results
    And results across pages should not contain duplicates

  @alternate
  Scenario: Non-exact match query returns closest matches
    Given player "Christopher Nguyen" exists
    And "Christopher Nguyen" is discoverable in the player directory
    When I search for player by name "Chris Ngu"
    Then I should see results that include "Christopher Nguyen"
    And the results should be sorted by relevance

  @alternate
  Scenario: Search is case-insensitive and ignores leading/trailing spaces
    Given player "Mina Patel" exists
    And "Mina Patel" is discoverable in the player directory
    When I search for player by name "  miNA pATel  "
    Then I should see results containing "Mina Patel"

  # -------------------------
  # Error flow scenarios
  # -------------------------

  @error
  Scenario: Search query is empty
    When I search for player with an empty query
    Then I should see a validation message "Enter a name or email to search"
    And no API request should be sent to the player directory

  @error
  Scenario: Search query contains only whitespace
    When I search for player by name "   "
    Then I should see a validation message "Enter a name or email to search"
    And no API request should be sent to the player directory

  @error
  Scenario: Email format is invalid
    When I search for player by email "alex.chen@"
    Then I should see a validation message "Enter a valid email address"
    And no API request should be sent to the player directory

  @error
  Scenario: No players match the search query
    Given no discoverable players match name "Nonexistent Player"
    When I search for player by name "Nonexistent Player"
    Then I should see a message "No players found"
    And I should see suggestions to refine my search
