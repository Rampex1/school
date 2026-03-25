# Sprint A - Product Backlog

**Sprint:** A | **Duration:** Feb 3 - Feb 24, 2026 | **Scrum Master:** David Zhou (261135446)

---

## Sprint Backlog Items

| ID | Backlog Item Name | Priority | Refinement Step | Feature File Name |
|----|-------------------|----------|-----------------|-------------------|
| US001 | Player Registration | High | Done | `ID_US001_player_registration.feature` |
| US002 | Join Team | High | Done | `ID_US002_join_team.feature` |
| US003 | Season Creation | High | Done | `ID_US003_season_creation.feature` |
| US004 | Schedule Management | High | Done | `ID_US004_schedule_management.feature` |
| US005 | Find Player | Medium | Done | `ID_US005_find_player.feature` |
| US006 | Review Player Request | High | Done | `ID_US006_review_player_request.feature` |
| US007 | Player Skill Level Update | Medium | Done | `ID_US007_player_skill_level_update.feature` |
| US008 | Availability Management | Medium | Done | `ID_US008_availability_management.feature` |
| US009 | Leave Team | Low | Done | `ID_US009_leave_team.feature` |
| US010 | Team Creation | High | Done | `ID_US010_team_creation.feature` |

---

## Priority Justification

- **High Priority (US001, US002, US003, US004, US006, US010):** These stories form the core registration and team management workflow. Player Registration (US001) and Team Creation (US010) are prerequisites for all other features. Join Team (US002) and Review Player Request (US006) enable roster building. Season Creation (US003) and Schedule Management (US004) are essential for organizing league operations.

- **Medium Priority (US005, US007, US008):** Find Player (US005) enhances the user experience by enabling player discovery. Skill Level Update (US007) and Availability Management (US008) support better team and game planning but are not blocking for the core workflow.

- **Low Priority (US009):** Leave Team (US009) is a complementary feature that allows players to exit teams. It is important for completeness but depends on the join team flow being functional first.

---

## Refinement Status Key

| Status | Definition |
|--------|------------|
| Done | User story is fully refined. Feature file contains normal, alternate, and error flow scenarios. Acceptance criteria are clear and unambiguous. Story is ready for development. |
| In Progress | User story has been partially refined. Some scenarios may be incomplete or require further discussion with the Proxy Product Owner. |
| Ready | User story has been identified and described at a high level but has not yet been broken down into Gherkin scenarios. |

---

## Feature File Location

All feature files for Sprint A are located at:

```
context/deliverables/SprintA/Spring Backlog and Done Checklist/Features/
```

Each feature file follows the naming convention: `ID_<StoryID>_<story_name>.feature`
