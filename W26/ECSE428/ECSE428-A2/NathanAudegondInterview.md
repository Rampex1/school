# Interview Transcript: Nathan Audegond

**Interviewer:** David Vo
**Interviewee:** Nathan Audegond
**Topic:** Defect Resolution During Product Development at Intact Financial Corporation
**Date:** February 2026

---

**David Vo:** Hi Nathan, thanks for sitting down with me. Can you give a quick intro of yourself and your internship?

**Nathan Audegond:** Sure. I'm Nathan Audegond, a Software Engineering Co-op student at McGill. During Summer 2025 I interned at Intact Financial Corporation as a Test Automation Developer. It was actually my second co-op — my first was at Ericsson the year before. At Intact I was on a project called ContractUBI, where the team was migrating their Usage-Based Insurance module from an older XML-based system to a newer one built on Java and Spring Boot. My main job was building a web app called UBI Tools that let QA engineers run automated tests against the insurance services and compare results side by side to spot regressions during the migration. The frontend was Angular, the backend was Node.js.

---

**David Vo:** Today I want to focus on defect resolution during development. Can you start with a typical example of how a bug would come up and get dealt with on your team?

**Nathan Audegond:** Yeah, the most common pattern for me was pretty straightforward. I'd push my code changes to GitHub, and the Jenkins pipeline would run automatically. If any tests broke, the build would fail and I'd get notified right away. Most of the time the issue would be something like a mismatch between what the frontend expected from the backend, or a problem with how I was handling the XML data before sending it to the insurance platform. I'd look at the test output, figure out what went wrong, fix it locally, and push again. If the build passed but the behavior still seemed off, I'd put up a pull request and a teammate would review it. They'd sometimes spot things I missed — like an edge case in the comparison logic, or a situation where the code didn't handle an empty response properly. I'd address their comments, push the fix, and it would get approved and merged. The whole thing from finding the bug to closing it was usually less than a day. Having the automated pipeline meant I got feedback fast, so things didn't pile up.

---

**David Vo:** Can you tell me about a specific case that felt like a real success in how the defect was found and fixed?

**Nathan Audegond:** The one I remember best was when I was connecting UBI Tools to Intact's internal test dashboard called UTA. I wrote an adapter that would take UBI Tools' test results and format them so UTA could display them. When I first ran it, everything showed up on the dashboard — but every single test was marked as passed, even the ones that had clearly failed in UBI Tools. I caught this myself while rehearsing for a demo. I was walking through a workflow with some tests that were supposed to fail, and when I switched over to the UTA dashboard it was all green. Obviously that was wrong.

I went back to the adapter code and traced through how I was translating the result statuses. Turned out I had a typo in a string comparison — I was checking for "FAIL" instead of "FAILED", so the condition never matched and everything defaulted to "PASS". It was a small, kind of embarrassing mistake, but the important thing was I caught it before the actual demo. I fixed it, ran it again with a mix of passing and failing tests to make sure the dashboard showed the right statuses, and then added a unit test for that mapping logic so the same kind of thing couldn't slip through again. The whole process from catching the bug to having it fixed and tested took less than two hours.

---

**David Vo:** And on the other side, can you describe a case that was more of a failure — where a defect wasn't caught the way you would have wanted?

**Nathan Audegond:** Yeah, this one stuck with me. The core feature of UBI Tools was the comparison view — you pick two test runs and the tool shows you exactly what changed between the responses. It worked by parsing the XML responses field by field and flagging differences. I had it working well for most of the endpoints I was testing, but late in the internship a developer on the team told me the comparison was showing false positives for one of the discount calculation endpoints. It was flagging fields as different even when the actual values hadn't changed.

When I looked into it, the problem was floating point precision. The discount endpoint returned decimal numbers in its responses, and JavaScript sometimes stores a value like 0.10 as 0.1000000000000001 internally. So when the tool compared that against 0.10 from another response, it flagged them as different even though they were effectively the same value.

The frustrating part is that floating point precision is something I already knew about — every developer runs into it at some point. I just never thought to account for it in the comparison logic because all the testing I'd been doing used whole numbers. The bug had been sitting in the code for weeks before anyone happened to test an endpoint that exposed it. The fix was simple — I added a rounding step for numeric fields before comparing them — but during those weeks, QA engineers had been using the tool and might have been trusting results that were slightly wrong. I should have tested with a wider variety of data types from the start, not just the ones I happened to be working with.

---

**David Vo:** Was this defect reported through Jira, or did it come up informally?

**Nathan Audegond:** It came up informally — the developer mentioned it during a stand-up. But we had a Jira workflow in place, so I created a bug ticket that same day with a description, the steps to reproduce it, and which endpoint it affected. My supervisor Javier saw it in the backlog and pulled it into the current sprint. Having that ticket meant the fix was tracked properly and anyone looking at the code later could trace the commit back to the Jira ticket and understand why the rounding logic was there. I've come to think that kind of traceability is really important — you want the next person who reads the code to understand why a decision was made, not just what was changed.

---

**David Vo:** If you could change one thing about how defects were handled during your internship, what would it be?

**Nathan Audegond:** I'd push for broader test coverage across different types of data early on, and I'd make that part of the checklist for finishing a feature rather than something that only happens when someone stumbles on a problem. The floating point bug only got caught because one specific developer happened to test one specific endpoint. If nobody had used that endpoint during my internship, the bug would have shipped with the tool. A more deliberate approach — sitting down and asking "what kinds of data does this feature actually need to handle?" and writing tests for each kind before calling it done — would have caught that much earlier.

---

*End of interview.*
