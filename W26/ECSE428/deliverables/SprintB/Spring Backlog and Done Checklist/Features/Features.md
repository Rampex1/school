What to include:
✓ Around 4-5 features files (Gherkin) per team for each sprints
✓ Should be named accordingly (ID_<backlog-item-id>_<backlog-item-name>.feature)
✓ Feature Name (should match the backlog item name in the excel file)
➢ Backlog stories should indicate
✓ Who the user is?
✓ What the user wants to do?
✓ Why do they want to do it?
➢ Stories should:
✓ Be clear, concise, and consistent
✓ Correctly identify scenarios / scenario outlines
✓ Have correct Gherkin Syntax
✓ Not include any navigation steps (ex: clicking a button, navigating to a page etc.)
✓ Use background when initial steps are the same
➢ Story tests in Gherkin
✓ Normal flow (for all)
✓ Alternative flow (where needed)
✓ Error flow (where needed)

Example of feature:
Feature: Add New User

As a Lego(R) Part Warehouse Employee
I would like become a user of the Lego(R) Part Warehouse Manager System
So that I can perform Lego(R) Part Warehouse Manager transactions related to my job function

Scenario Outline: Different types of users (Normal Flow)

Given employee <emp_name> with employee id <emp_id> is a employee type <emp_type> in good standing
When employee <emp_name> requests user access to the Lego(R) Part Warehouse Manager System
Then a new <user_name> and initial <password> are generated

| emp_name       | emp_id | emp_type            | user_name | password |
| Nathan Audegond |AA001   |Operator             |Audegond_N  |aa001     |
| Fahim Bashar    |CB002   |Inventory Manager    |Bashar_F    |cb002     |
| Thibaut Chan Teck Su |JJ003 |System Administrator |Chan_T      |jj003     |
| Eric Deng       |LV004   |Auditor              |Deng_E      |lv004     |
| Farhad Guliyev  |MR005   |Warehouse picker     |Guliyev_F   |mr005     |
| Toufic Jrab     |ME006   |Consumer             |Jrab_T      |me006     |

Scenario Outline: Non Employee Attempts to become user (Error Flow)

Given Fred Smith uses id INVALID_ID to request Operator user access
When employee Fred Smith requests user access to the Lego(R) Part Warehouse Manager System
Then an "Unauthorized request" message is issued
And a record of the attempt is send to the System Administrator

Scenario Outline: Existing user attempts to become a user (Error Flow)

Given Bill Jones is user of the Lego(R) Part Warehouse System
When Bill Jones requests user access to the Lego(R) Part Warehouse System
Then an "Already registered" message is issued
