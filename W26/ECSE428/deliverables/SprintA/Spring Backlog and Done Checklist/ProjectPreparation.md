# Project Preparation - ITMS (Intramural Team Management System)

**Course:** ECSE 428 - Software Engineering Practice | **Group:** 3 | **Date:** January 20, 2026

---

## 1. Team Members

| Name | McGill Student ID | Role |
|------|-------------------|------|
| Nathan Audegond | 261171252 | Developer |
| Fahim Bashar | 261104343 | Developer |
| Thibaut Chan Teck Su | 261120277 | Developer |
| Eric Deng | 261138815 | Developer |
| Farhad Guliyev | 260961366 | Developer |
| Toufic Jrab | 261017709 | Proxy PO |
| Haoyuan Sun | 261120493 | Developer |
| David Vo | 261170038 | Developer |
| Zhenxuan Zhao | 261063859 | Developer |
| Shengyi Zhong | 261147355 | Developer |
| David Zhou | 261135446 | Developer |

---

## 2. Scrum Masters

| Sprint | Scrum Master | Student ID |
|--------|-------------|------------|
| Sprint A (Feb 3 - Feb 24, 2026) | David Zhou | 261135446 |
| Sprint B (Mar 10 - Mar 31, 2026) | Toufic Jrab | 261017709 |

---

## 3. Release Pipeline

The project follows a continuous integration and deployment pipeline using the following tools:

1. **Source Control:** GitHub (private repository under `Rampex1/ECSE428`)
   - All feature development occurs on dedicated feature branches (e.g., `feat/US001-player-registration`)
   - The `main` branch represents the latest stable, deployable version
   - The `dev` branch is used as an integration branch before merging to `main`

2. **Continuous Integration:** GitHub Actions
   - On every push and pull request to `main` and `dev`:
     - TypeScript type checking (`tsc --noEmit`)
     - Linting (`eslint`)
     - Unit tests (`vitest run`)
     - Acceptance tests (`cucumber-js`)
     - Build verification (`next build`)
   - CI must pass before a pull request can be merged

3. **Deployment:** Vercel
   - Automatic preview deployments for every pull request
   - Production deployment triggered on merge to `main`
   - Staging environment deployed from the `dev` branch
   - All deployments use the free tier (Vercel Hobby plan)

4. **Database:** Supabase (PostgreSQL)
   - Schema migrations managed via SQL migration files
   - Separate Supabase projects for development and production

---

## 4. Team Coordination

### Daily Communication
- **Platform:** Discord (dedicated `#ecse428-team3` channel)
- **Daily Standups:** Asynchronous text standups posted by 10:00 AM each weekday
  - Each member answers: (1) What I did yesterday, (2) What I will do today, (3) Any blockers
- **Ad-hoc Communication:** Discord voice channels for pair programming and quick discussions

### Weekly Sprint Meetings
- **Sprint Planning:** Monday at 6:00 PM (Discord voice, ~45 min)
- **Sprint Review / Retrospective:** Friday at 5:00 PM (Discord voice, ~30 min)
- **Scrum Master** facilitates all meetings and tracks action items

### Code Review Process
- All code changes require a pull request (PR) on GitHub
- Each PR must be reviewed and approved by at least 1 other team member before merge
- PR description must reference the associated User Story ID (e.g., `US001`)
- Greptile (AI code review) is integrated for automated feedback on PRs
- Reviewers check for: correctness, adherence to tech stack guidelines, test coverage, and code style

### Task Tracking
- Weekly task lists maintained as Markdown files in the repository (`context/deliverables/`)
- Task assignments and progress discussed during sprint planning and daily standups
- Each task is associated with a User Story ID for traceability

---

## 5. Done Checklist

A User Story is considered **Done** when ALL of the following criteria are met:

| # | Criterion | Verification Method |
|---|-----------|-------------------|
| 1 | Code is merged to the `main` branch via an approved pull request | GitHub PR merge status |
| 2 | All acceptance tests (Gherkin scenarios) for the story pass successfully | GitHub Actions CI pipeline log |
| 3 | Unit tests pass with greater than 80% code coverage for the story's modules | Vitest coverage report in CI |
| 4 | Code review is approved by at least 1 team member (not the author) | GitHub PR approval status |
| 5 | Feature is deployed to the staging environment and is accessible | Vercel staging deployment URL verified |
| 6 | No critical or blocking bugs exist related to the story | Manual smoke test by developer and reviewer |
| 7 | Documentation is updated if the story introduces new API endpoints, database schema changes, or configuration requirements | PR checklist item confirmed by reviewer |

### Clarifications
- **Criterion 1:** The PR must not be a force-push or direct commit to `main`. Squash-merge or standard merge is acceptable.
- **Criterion 2:** Acceptance tests are defined in `.feature` files under `tests/acceptance/` and executed by `@cucumber/cucumber`. Every scenario in the corresponding feature file must pass.
- **Criterion 3:** Coverage is measured per-module. If a story touches `lib/auth.ts`, then `lib/auth.ts` must have at least 80% line coverage. Coverage below 80% blocks the PR.
- **Criterion 4:** The reviewer must be a different team member than the PR author. The Scrum Master does not count as a reviewer for their own sprint.
- **Criterion 5:** The staging environment is the Vercel preview deployment associated with the `dev` branch. The feature must be manually verified as functional on staging.
- **Criterion 6:** A critical bug is one that prevents the core user flow described in the story from completing. Non-critical UI polish issues do not block "Done" status.
- **Criterion 7:** If no documentation changes are needed, the reviewer explicitly confirms this in the PR review comments.
