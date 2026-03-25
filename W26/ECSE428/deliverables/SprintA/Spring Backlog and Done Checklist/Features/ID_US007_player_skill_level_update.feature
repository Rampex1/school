Feature: Player updates skill level in profile

  As a Player,
  I want to update my skill level in my player profile
  so that I can be matched to appropriate leagues and teams.

  Background:
    Given I am logged in as a Player
    And my player profile already exists
    And the following skill levels are supported:
      | Beginner |
      | Intermediate |
      | Advanced |

  # -------------------------
  # Normal flow scenarios
  # -------------------------

  @normal
  Scenario: Player successfully updates skill level
    Given I have navigated to my profile settings
    When I update my skill level to "Intermediate"
    Then I should see a confirmation message "Profile updated successfully."
    And my skill level should be saved as "Intermediate"

  # -------------------------
  # Alternate flow scenarios
  # -------------------------

  @alternate
  Scenario: Player updates skill level multiple times
    Given I have navigated to my profile settings
    And my current skill level is "Beginner"
    When I update my skill level to "Advanced"
    Then my skill level should be updated to "Advanced"
    And I should see a confirmation message "Profile updated successfully."

  # -------------------------
  # Error flow scenarios
  # -------------------------

  @error
  Scenario: Player submits profile update without selecting a skill level
    Given I have navigated to my profile settings
    When I attempt to save my profile with an empty skill level
    Then I should see an error message "Please select a valid skill level."
    And my profile should not be updated

  @error
  Scenario: Player selects an unsupported skill level
    Given I have navigated to my profile settings
    When I attempt to set my skill level to "Expert"
    Then I should see an error message "Selected skill level is not supported."
    And my skill level should remain unchanged

  @error
  Scenario: Player attempts to update skill level while not logged in
    Given I am not logged in
    When I attempt to update my profile skill level
    Then I should be redirected to the login page
    And I should see a message "Please log in to edit your profile."
