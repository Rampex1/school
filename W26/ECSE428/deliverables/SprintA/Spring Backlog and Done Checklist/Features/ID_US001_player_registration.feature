Feature: Player Registration

  As a Player,
  I want to register an account with my McGill email
  so that I can join intramural sports teams

  Background:
    Given the registration system is available

  Scenario Outline: Player successfully registers a new account
    When I submit registration details with email "<email>", password "<password>", and name "<name>"
    Then an account should be created with email "<email>"
    And I should see a confirmation message "Registration successful. Welcome, <name>!"
    And I should be assigned the Player role by default

    Examples:
      | email                    | password     | name          |
      | john.doe@mail.mcgill.ca  | SecurePass1! | John Doe      |
      | jane.smith@mail.mcgill.ca| MyPass99$    | Jane Smith    |

  # Alternate Flow: Registration with existing email
  Scenario: Player attempts to register with an already registered email
    Given a user with email "john.doe@mail.mcgill.ca" already exists
    When I submit registration details with email "john.doe@mail.mcgill.ca", password "AnotherPass1!", and name "John Doe"
    Then I should see an error message "An account with this email already exists."
    And no new account should be created

  # Error Flow: Invalid email format
  Scenario: Player attempts to register with a non-McGill email
    When I submit registration details with email "john.doe@gmail.com", password "SecurePass1!", and name "John Doe"
    Then I should see an error message "A valid McGill email address is required."

  # Error Flow: Weak password
  Scenario: Player attempts to register with a weak password
    When I submit registration details with email "john.doe@mail.mcgill.ca", password "123", and name "John Doe"
    Then I should see an error message "Password must be at least 8 characters and include a number and a special character."

  # Error Flow: Missing required fields
  Scenario: Player attempts to register with empty name
    When I submit registration details with email "john.doe@mail.mcgill.ca", password "SecurePass1!", and empty name
    Then I should see an error message "Full name is required."
