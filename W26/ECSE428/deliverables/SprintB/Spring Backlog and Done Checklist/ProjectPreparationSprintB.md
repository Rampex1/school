# Sprint B - Project Preparation and Done Checklist

## ECSE 428 - Group 3 - Intramural Team Management System (ITMS)

---

## 1. Team Members

| Name             | Student ID | Role                          |
|------------------|------------|-------------------------------|
| Nathan Audegond | 261171252 | Developer                     |
| Fahim Bashar    | 261104343 | Developer                     |
| Thibaut Chan Teck Su | 261120277 | Developer                     |
| Eric Deng       | 261138815 | Developer / Proxy Product Owner |
| Farhad Guliyev  | 260961366 | Developer                     |
| Toufic Jrab     | 261017709 | Scrum Master (Sprint B)       |
| Haoyuan Sun     | 261120493 | Developer                     |
| David Vo        | 261170038 | Developer                     |
| Zhenxuan Zhao   | 261063859 | Developer                     |
| Shengyi Zhong   | 261147355 | Developer                     |
| David Zhou      | 261135446 | Developer                     |

---

## 2. Release Pipeline Notes

### Current Pipeline

The release pipeline established in Sprint A remains in place with the following components:

- **Source Control:** GitHub repository with branch protection on `main`. Feature branches follow the naming convention `feature/US0XX-description`.
- **CI/CD:** GitHub Actions pipeline triggered on pull requests and merges to `main`.
  - Automated linting (ESLint)
  - Unit test execution (Jest)
  - Integration test execution (Cucumber/Gherkin step definitions)
  - Build verification
  - Deployment to staging environment on merge to `main`

### Lessons Learned from Sprint A

1. **Pipeline Reliability:** During Sprint A, the CI pipeline occasionally timed out on integration tests. We increased the timeout threshold from 5 minutes to 10 minutes and added retry logic for flaky database connection tests.
2. **Test Data Management:** Sprint A revealed that shared test data caused intermittent test failures. For Sprint B, each test suite now uses isolated test fixtures with proper setup and teardown.
3. **Code Review Bottleneck:** Sprint A had delays due to code reviews piling up at the end of the sprint. For Sprint B, we adopted a policy that pull requests must be reviewed within 24 hours of submission.
4. **Branch Strategy:** We refined our branching strategy to include `dev` as an integration branch before merging to `main`, reducing the number of broken builds on the main branch.

---

## 3. Team Coordination

### Communication

- **Daily Standups:** 15-minute standup meetings held every weekday at 10:00 AM via Discord voice channel.
- **Sprint Planning:** Conducted at the start of Sprint B (March 10, 2026). All user stories estimated and assigned.
- **Sprint Retrospective:** Scheduled for March 31, 2026.
- **Async Communication:** Slack workspace with channels organized per user story (#us011-score-reporting, #us012-standings, etc.).

### Improvements from Sprint A

1. **Pair Programming:** Introduced pair programming sessions for complex features (US011, US014) to improve code quality and knowledge sharing.
2. **Backlog Refinement:** Added a mid-sprint backlog refinement session (March 19, 2026) to reassess priorities and address blockers early.
3. **Definition of Ready:** Formalized a Definition of Ready checklist that must be satisfied before any story enters development, reducing mid-sprint scope clarification delays.
4. **Task Granularity:** Sprint A retrospective revealed that some tasks were too coarsely defined. For Sprint B, all tasks are broken down to a maximum of 4 hours of estimated effort.

### Scrum Masters

| Sprint   | Scrum Master   | Student ID |
|----------|----------------|------------|
| Sprint A | Nathan Audegond | 261171252  |
| Sprint B | Toufic Jrab     | 261017709  |

---

## 4. Done Checklist

A backlog item is considered **Done** when ALL of the following criteria are satisfied:

### Code Quality
- [ ] All acceptance criteria defined in the user story are implemented
- [ ] Code compiles and builds without errors or warnings
- [ ] Code follows the project coding standards and naming conventions
- [ ] No hardcoded values; configuration is externalized where appropriate
- [ ] No TODO or FIXME comments remain in the committed code

### Testing
- [ ] All Gherkin scenarios (normal, alternate, and error flows) have passing step definitions
- [ ] Unit tests are written and achieve at least 80% code coverage for new code
- [ ] Integration tests pass against the staging database
- [ ] No regressions introduced in existing test suites (all prior tests still pass)
- [ ] Edge cases identified during development are covered by tests

### Code Review
- [ ] Pull request has been reviewed and approved by at least one other team member
- [ ] All review comments have been addressed or resolved
- [ ] The reviewer has verified that the acceptance criteria are met

### Documentation
- [ ] API endpoints are documented (request/response format, status codes)
- [ ] Any new environment variables or configuration changes are documented
- [ ] Feature file is up to date and matches the implemented behavior

### Deployment
- [ ] CI/CD pipeline passes all stages (lint, test, build)
- [ ] Feature has been deployed to the staging environment
- [ ] Feature has been verified in the staging environment by the developer

### Acceptance
- [ ] Proxy Product Owner (Sarah Kim) has reviewed the feature in the staging environment
- [ ] Feature behavior matches the scenarios described in the Gherkin feature file
- [ ] No critical or high-severity bugs remain open for this backlog item
