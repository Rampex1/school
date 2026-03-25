# Interview Transcript: Eric Deng
**Interviewer:** David Zhou
**Interviewee:** Eric Deng
**Topic:** Defect Resolution During Product Development at Ericsson Canada
**Date:** February 2026

---

**David Zhou:** Hi Eric, thanks for agreeing to be interviewed. Can you start by introducing yourself and giving a quick overview of your internship?

**Eric Deng:** Sure! My name is Eric Deng, and I'm a third-year Software Engineering Co-op student at McGill University. From May to December 2024 I did an eight-month internship at Ericsson Canada as a Developer Intern on Team Dragon, the QA team within the Global Network Platform organization. GNP is a 5G network API platform that Ericsson sells to telecom providers. The team tested GNP's microservices using an internal Ansible and Bash-based testing framework called TESU. My main project was building a conversational AI chatbot on top of TESU so that QA testers could trigger test cases through plain language rather than memorizing shell commands.

---

**David Zhou:** For today's interview I'd like to focus specifically on how defects were found and resolved during development on your team. Can you start by describing a typical case of how a bug would be discovered and worked through?

**Eric Deng:** Yeah, absolutely. So the most common scenario went something like this: I'd be working on a new dialogue flow for the chatbot, make a change to one of the RASA YAML configuration files, retrain the model, and then manually run through a test conversation in the browser to check the behavior. A lot of the time something would be off — the chatbot would trigger the wrong action, or it would get stuck in a form loop and not collect all the required parameters before firing the test. Since I was the only developer on the chatbot, I'd catch these myself during that manual testing step. My process was to reproduce the failure consistently first, then narrow it down — was it an intent classification issue in nlu.yml, a missing rule in rules.yml, or a logic error in actions.py? Once I had a hypothesis I'd make the fix, retrain the model, and run through the conversation again. The whole loop from catching a defect to confirming the fix could take anywhere from 30 minutes if it was a simple YAML correction to a few hours if the issue was deeper in the action server logic. I'd then mention what I found and fixed at the next morning's stand-up so the team knew about it, and Daniel or Yash might offer a comment if something seemed off about my approach. That was the typical pattern — discover it myself during manual testing, diagnose it, fix it, verify it, and report it at stand-up.

---

**David Zhou:** Can you walk me through a specific example that felt like a real success — where the defect resolution process worked the way you would have wanted it to?

**Eric Deng:** One that stands out was when I was building the real-time test execution timeline on the React frontend. The chatbot could trigger a test run through the RASA action server, and I wanted the web page to show live updates as the test progressed. The way it worked was that the Test Manager wrote events to a text file called TC_running_state.txt as the test ran, and my Flask server was supposed to pick those up and push them to the React component. When I first implemented it, the timeline would sometimes show events out of order, and occasionally events would be dropped entirely if the file was being written and read at the same time. I caught this during one of my own test sessions — I ran a test case and watched the timeline skip an event and then display the final result before showing a step that should have come earlier. I spent the afternoon digging into the file I/O logic in the Flask server and realized the issue was a race condition: I was reading the file line by line without any locking mechanism, so if the Test Manager wrote a batch of events at once, my parser would only catch some of them. I fixed it by switching to a polling approach with a file lock and parsing the entire file on each poll rather than trying to tail it incrementally. I tested it across several test runs in different network regions and the timeline came back clean every time. When I showed Daniel the working demo the next day he was genuinely excited about it, and it ended up being one of the main features in my end-of-internship presentation to the team. That one felt like a real success because I identified the root cause properly rather than just applying a patch, and the fix held up under repeated testing.

---

**David Zhou:** And can you describe a situation that was more of a failure — a defect that didn't get resolved the way you would have hoped?

**Eric Deng:** The most frustrating one was a feature I was trying to build where the chatbot would validate a test case key before running it. The idea was that when a user typed in a test case identifier, the chatbot would check it against a YAML file called tc_parameters.yml that listed all the valid test cases, and if the key didn't exist it would tell the user and ask them to try again. I thought this would be straightforward since I already knew how to parse YAML in Python. I started implementing it and immediately ran into problems because the YAML file had a very inconsistent structure — some entries had the key as a top-level field, others had it nested two or three levels deep, and there were some malformed entries scattered throughout. I spent almost a full week trying different parsing strategies, writing fallback logic, and handling edge cases, and every time I thought I had it working I'd find another test case entry that broke the parser. At the end of the week I went to Yash and showed him what I was dealing with. He looked at the file and basically told me that tc_parameters.yml had been added to incrementally by many different people over the years and had never been cleaned up, so it was essentially unusable as a data source for validation. I should have asked him about the file structure on day one before writing a single line of parsing code. The feature ended up being listed as a future improvement and was never actually completed during my internship. Looking back, the failure was really about my process: I dove into implementation without first verifying that the data I was relying on was reliable. A quick conversation with someone who knew the codebase would have saved me a week of work.

---

**David Zhou:** In both the failure and success examples, did the defect ever get formally logged somewhere, or was it all just handled informally?

**Eric Deng:** It was mostly informal, which was one of the things I would change looking back. For my own chatbot work, I tracked issues in my head and mentioned them at stand-ups, but there was no formal bug tracking in Jira for the chatbot specifically. Daniel's feeling was that since the chatbot was not on the critical path of GNP's production, we didn't need the overhead of filing tickets for every fix. For the tc_parameters.yml issue, I did eventually create a Jira story to capture it as a future improvement, but it was logged as an enhancement rather than as a bug. In hindsight, having a lightweight defect log would have helped me see patterns in what was going wrong. For instance, I probably had four or five issues that all traced back to assumptions I made about the structure of TESU's configuration files, and if I had been writing them down I might have recognized that pattern sooner and changed my approach earlier.

---

**David Zhou:** If you could change one thing about how defects were resolved during your internship, what would it be?

**Eric Deng:** I'd introduce some form of code review before merging changes, even a lightweight one. Almost every significant bug I dealt with was something that a second set of eyes would have caught quickly. The race condition in the file parsing, the bad assumptions about tc_parameters.yml structure — both of those probably would have surfaced in a ten-minute review with Yash before I committed the code. The team's process was set up for a small team working fast on an internal tool, which I understand, but even one structured review per week would have meaningfully reduced the time I spent chasing bugs I introduced myself.

---

*End of interview.*
