Nathan Audegond SWE intern at intact
Internship Summary
Company: Intact Financial Corporation
 Role: Test Automation Developer Intern
 Industry: Property & Casualty Insurance (P&C), InsurTech
 Duration: Summer 2025

Technical Scope
Languages & Frameworks: Angular, TypeScript, Angular Material, HTML/CSS, Node.js, JavaScript, Java (Spring Boot), TestNG, Maven
 APIs & Data: REST APIs, XML, JSON, SOAP, Postman/Newman, OracleDB (RDBMS)
 Tools & Platforms: Docker, Jenkins (CI/CD), GitHub, Jira, Confluence, MS Teams, Swagger UI, Selenium, Appium, Katalon, SonarQube
 Architectures & Methodologies: Microservices, Service-Oriented Architecture, CLEAN architecture, Component-based frontend, CI/CD pipelines, Agile/Scrum

Key Contributions & Achievements
Built UBI Tools, a full-stack Angular + Node.js web application for automating REST API integration testing of Intact’s ContactPL (policy administration system).


Automated regression testing by enabling XML/JSON payload modification, execution across multiple dev/test environments, and comparison of test results for policy changes.


Developed test execution and results dashboards with dynamic filtering, result comparison, and debugging features to streamline QA workflows.


Integrated UBI Tools into UTA framework, connecting with Jenkins CI/CD pipelines and leveraging TestNG-based test suites for regression, API, and end-to-end testing.


Contributed to modernization of UBI services, supporting migration from legacy XML-based monolithic services (DOM6) to modular JSON-based architecture (DOM7).


Reduced manual QA effort by automating workflows, improving scalability, accuracy, and speed of testing during migration of the UBI module into ContactPL.



Soft Skills & Collaboration
Collaborated daily with cross-functional teams (developers, QAs, architects, business analysts, product owners, and scrum masters) in an Agile environment.


Presented demos and progress updates to senior leadership (managers, VPs), aligning technical work with business needs.


Coordinated with stakeholders on compliance, actuarial pricing (PEGA), and policy impact for real insurance clients.


Produced architectural diagrams, documentation, and communicated deployment/release processes clearly across teams.



Resume Bullet Points


Architected a full-stack automated testing tool (Angular, Node.js, Oracle, Docker) for Java Spring Boot
microservices, reducing system downtime by 15% with estimated cost savings of ∼$2M annually.
• Integrated cloud-native observability stack with OpenShift, Dynatrace and Kafka distributed monitoring pipelines.
• Automated regression tests with Java and Selenium in Jenkins CI/CD, cutting manual QA testing by 99%.
• Launched and scaled platform to 30+ engineers across dev and prod, accelerating Agile DevOps adoption

UBI Tools is a full stack web application that uses Angular, Typescript, and angular material, with HTML, CSS, with the backend using Node.js, javascript. With REST APIs connecting the two, using service oriented architecture, with XML parsing functionalities, and soap, and json, for modular scalable architecture, and uses postman newman’s library to run API collections, with OracleDB integration RDBMS. With docker containerization and deployment to the org
The frontend uses modern front-end development practices, using component based design, custom services, and state management within angular NG, and API proxies to connect the backend with frontend
The frontend has 4 pages, a home page, a test execution page, a test results page, an api documentation page
The test execution page allows users to select different developer environments within the organization devops, such as DEV environment, integration, or user acceptance testing environments. These environment are essentially Intact’s ContactPL (proprietary policy administration system) microservices, built on Java Spring. Then the user can select specific services and endpoints, specifically for the UBI module of ContactPL (usage-based insurance), which I was part of the project ContractUBI which aimed to modernize the legacy code of UBI which was in XML DOM6 towards JSON DOM7 using CLEAN architecture and java springboot. ContractUBI essentially connects the mobile application telematics, and integrates it with COntactPL so that brokers can have direct access to manage a client’s UBI enrollment or status, or discounts, and integrating it also intact’s internal database, and PEGA (rating/ underwriting actuarial prices) (business rules engine, used to rate policies , rating rules).
The user can also select specific custom URLs, and choose the XML policy that they want to send as a API payload to the endpoint, and retrieve the response in the test results page, the screen also allows users to dynamically change XML payloads before they are sent to modify certain attributes and values within the policy.
The test results page is a test dashboard containing test result successes and failures, and offers a search/filter dynamic mode, with download response to file system feature, and test deletion, also allows view specific test result details which displays the extract UBI business logic from the large policy and displays it in an interactive and visually appealing way to help devs and QAs debug. The comparison feature is the main one, meaning that it allows users to compare two test results and see the difference in their attributes, if any, in order to ensure successful regression when modernizing or applying new changes to the UBI services in contactPL.
The tool also provides a list of apis, ready to use on the fly which allows other tools or frameworks to connect with it easily
The second phase of the project is the integration of UBI tools into something called UTA (unified test automation) functional testing framework, which is Jenkins, Jira Zephyr, Katalon, Appium, Selenium, Maven CI/CD, Jenkins, SonarQube, Swagger UI.
UTA is essentially a all in one in house testing framework which allows users to execute Java tests defined as TestNG (inspired from Junit), for selenium automation in the frontend for webdrivers, and browser.
Developed and maintained automated test suites using java, structured as Maven project for dependency, for core libraries enterprise, proprietary, build lifecycle, and integration with CICD jenkins github pipelines for devops observability, groovy-based jennkins files, for automation build, test execution, artifact deployment, release processes, parameterized and schedules cron test runs. 
E2e tests, API, regression tests, unit testing, integration testing, frontend component testing. 
The backend of the tool is a REST API service oriented architecture with server.js as entrypoint and API layer, which then calls services and utility functions, and connects with newman postman integration for executing api collections, all with OracleDB integration.
For the intangible and soft skills aspect of the internship, communicate on a daily basis with team members, in a cross function teams comprised of architects, QAs, developers, business analyst, product owners, and scrum masters, as well as giving demos and presentation to senior leadership like managers and VPs across the organization to leverage and highlight impact, all while communicating with stake holders and understand business needs and juggling compliance and legal, and real world impact on insurance clients, using Jira and Confluence, and MS Teams on a regular basis, as well as designing architectural software diagrams. And communication deployment, delivery , and release management, and prod support and operations. 
I enjoyed my experience at Intact! This was the second company I interned at, and I felt that my previous experience at Ericsson provided me the necessary skills to succeed at this new company. From day 1, I understood that the purpose of this internship would be to learn as much as possible, not only from the technical side of the project, but also a deep understanding of the business context of the company. My success partner Vicky who was assigned to me really enabled me to ask questions and give a high-level overview and scope of my work, which came in really handy. While the development of my project was very smooth, as I had a lot of autonomy within my own codebase, some challenges I faced included understanding and integrating the business logic within the project. For example, while my project was developing a regression testing automation tool, I also had to integrate the tool with Intact’s own microservices on their policy administration platform,  which meant trying to understand business logic that I did not have the full context of. There were a lot of specific insurance terms that could only make sense if I asked an expert or read extensive documentation on. However, over time, I was able to overcome this challenge and deliver a great and useful tool that multiple developers of QAs will or are currently using throughout the organization to improve their efficiency. Indeed, during the last 2 weeks of my internship, I had the chance to organize several demos and presentations of my project to leadership, including VPs and managers throughout the organization, to showcase my work and its potential utilities and provide business value. The support that I received was very encouraging.
How does your internship experience inform you about the what, how, and where you want to achieve during your next internship? What this tells you about what you want do or don't want to do 
WHERE: 
Having previously worked at a telecom company (Ericsson) and now an insurance company (Intact), I now want to work at a company that is purely tech or software driven. My previous two experiences have given me the perspective on how software teams are managed within large organizations, and now to improve my skillset and grow my career, I would like to experience working at a software focused company, which more aligns with my experience and education. That being said, I would also like to work in a large company, as I believe that the large number of people allows me to connect and interact with multiple new people with different perspectives across the organization.
HOW:
During my next internship, I would like to expand my soft skills rather than in my technical areas. I believe that I am somewhat lacking in the networking department. As such, I would like to communicate better with people that I share little in common with. While it might be easy to relate to people within your team or project, as they are all in the same field, I would like new perspectives across the organization, from the fields of business, finance, data science and more, which will grow not only my career, but myself as a person. 
WHAT: 
During my next internship, I will be confident in my technical skillset and work towards building strong and lasting relationships with the people at work with, not only people at my level like other interns or developers, but also with managers, seniors, VPs, or directors. I believe that by connecting with new people on a daily basis, you can make yourself better known throughout the organization, providing you with significant visibility. I believe that everyone’s unique experience and knowledge is of great value to me, and I can’t wait to see who I will meet at my next internship. 
Then, tell us how you think this job could help you get to the where, how and what you want (150 words).  
Roblox is a tech focused company, developing software platforms for games, where millions of players use each and every day. I believe that I have grown a lot as a software engineer student and that it is now time to tackle on greater challenges, which will enable me to grow my career. The work at Roblox is very demanding, as every employee has complete ownership over the product that millions of users interact every single day. I also believe that Roblox is where some of the best people in the industry meet, as the skill ceiling is very high, which will allow me to expand my network and meet new people that I can form lasting relationships with.
Interview Material  - Example 1  
During my Summer 2025 internship at Intact, our team was migrating the Usage-Based Insurance (UBI) module to a modernized system, which required extensive regression testing across multiple APIs.
Task: I was responsible for streamlining integration testing to ensure data consistency while collaborating with QA, backend, and DevOps teams.
Action: I developed an Angular-based automation framework integrating Postman APIs and Newman CLI, enabling automated execution and validation of REST/SOAP requests. I coordinated with cross-functional teams to align test coverage and deployment timelines.
Result: This automation reduced regression testing time by 99%, improved defect detection accuracy by 80%, and strengthened inter-team collaboration.
.Interview Material - Example 2
While working on Intact’s UBI module migration, manual API testing was slowing deployments and causing inconsistencies in defect detection.
My goal was to improve test reliability and speed by integrating automated validation directly into our CI/CD process.
Action: I implemented automated backend and frontend tests using the TestNG-based UTA framework, creating reusable test suites for multiple microservices. I troubleshot XML/JSON mismatches by analyzing API payloads and worked with developers to fix serialization issues.
Result: The automation increased test coverage by 60%, reduced deployment delays, and resolved recurring API data errors before they reached production.
Interview Material - Example 3
During the UBI migration project at Intact, our existing API test execution pipeline was slow and prone to failures, delaying feedback to developers.
Task: I needed to enhance the pipeline’s speed and stability to support faster iteration cycles.
Action: I optimized the CI/CD pipeline by restructuring Postman/Newman test execution into parallel jobs, refactoring scripts for better error handling, and integrating automated XML comparison into the build process. I proposed these improvements proactively after analyzing bottlenecks in previous runs.
Result: Pipeline execution time dropped by 70%, feedback loops were shortened from hours to minutes, and deployment readiness improved significantly.
Reflective Questions - Provide a brief summary in 2-3 paragraphs of the software project management best practices that you experienced during your co-op internship.Reflective Questions - Provide a brief summary in 2-3 paragraphs of the software project management best practices that you experienced during your co-op internship.
During my internship at Intact, I saw firsthand how Agile practices kept our team organized and adaptable. So we worked in two-week sprints with daily stand-ups, which made it easy to track progress, adjust priorities, and quickly address roadblocks. Also, sprint retrospectives each Thursday helped us reflect on what worked well and where we could improve, creating a culture of continuous learning.
Collaboration was also a big part of our success. QA, backend, and DevOps worked side-by-side from planning to deployment, which reduced last-minute issues and improved quality. Using CI/CD pipelines and clear Git branching kept development smooth and efficient, while thorough documentation made sure our work could be picked up and improved by others. 
Reflective Questions - What kind of supervisor did you have (highly communicative, structured, creative, distant, etc.), and did their supervisory style fit your needs? What kind of supervisors would like to have in the future? (~100-150 words)
My supervisor. Javier, was very supportive from the very start, and laid out a clear picture of his vision of the project. Therefore, from day 1 I already knew what I was going to be working on and how that tied with the larger project. He was highly communicative and creative, and assigned clear and well defined Jira tasks for me to complete. When I would complete a task and show a new feature, he was excited to see it. I believe his supervisory style allowed me to succeed in this role because of the level of confidence and autonomy he gave me. In the future, I would like to have someone similar. 
Reflective Questions - What industry sector were you working in (cyber security, gaming, healthcare, research and development, consulting, etc.) and what did you learn about this area? Would you like to continue working in this industry sector? Why? (~100-150 words)
As a client of Intact myself, and having unfortunately been in a car crash, I appreciate the opportunity to get a behind-the-scenes look at what happens in an insurance company, and all the business processes, from claims, billing, policy creation, actuarial, software etc. Intact is a special company because it differentiates itself from competitors through investing in cutting-edge software and research and development. I learned how technology is transforming insurance by improving efficiency, reducing manual work, and enabling data-driven decision-making. It also gave me insight into the complexity of integrating legacy systems with modern architectures, and the importance of reliability in a high-stakes, customer-facing industry. While insurance is a very stable industry, I would like something new and exciting by going into large tech sectors like cloud, AI, SaaS etc.

Meeting Minutes: Discuss Performance with Employer

Showed everyone the internal regression test automation tool that I built throughout the internship. They were impressed by the front-end look and interested by the potential uses of its functionalities.
Mentioned that last week I had practiced with my manager Olivier for the upcoming intern presentations on July 31st, in which interns will present their projects to VPs in the company. This practice session went well, and Olivier particularly liked how I gave a lot of context and background about the scope of the project and the team that I was working on, as this is a large organization with a lot of different people. He also liked how I put a screenshot of the UI of my project on the slides, which will give listeners interest in the project that I am working on. 
On July 29th I also did a presentation of the tool with my supervisor Javier, and I to the Software Engineering managers and VPs at intact. I did a complete demo and workflow of the tool, in which I executed various tests across different deployment environments with different microservices and API endpoints. The managers were very interested and gave good feedback on my project.
We then talked about the next stages of my internship which will focus on refactoring the code of the internal tool to make it deployable to other people across the organization through Docker containers, as well as implementing a strategy plan for the maintenance and improvement of the tool after the internship ends, as in who will take responsibility. My next task will also make the tool generalized to other software services within Intact, as the current version is only tailored for the scope of my team’s project.
We also talked about the automation of tests with my success partner Vicky, and I showed her my progress in integrating the tool with Intact’s internal automation testing framework. I was able to execute mock tests which successfully connected to the tool, and the test results were displayed on Intact’s test dashboard. 
My manager told me that the expectations given during the Discuss Expectations meeting were met, and was very satisfied with my work, especially as it could bring a lot of business value to the software development lifecycle at Intact.
Meeting Minutes: Discuss Employer Expectations

Frequency of feedback meetings (on what basis you will meet to discuss progress and tasks) 
15m daily scrums with the team (including the team lead) to discuss project development progress. What I did yesterday, what I will do today, what blockers I have. 
Weekly touchpoints with my Success Partner to understand my progress and if I am on pace. Ask general or specific questions about my work. Learn more about QA processes.
Weekly 1:1 with the manager to understand my progress. Clarify important dates and deadlines for my internship. Ask general questions about the company or culture. 
The intern responsibilities for the work term, and the expected skills required
Automate testing for the integration of Usage-Based Insurance (UBI) features into Intact’s internal insurance platform (Contact Personal Lines)
Develop a tool (UBI tools) to test system responses and ensure new changes don’t break existing features.
Write and run automated tests to check both backend and frontend systems.
Use tools like Postman (for API testing), Java (for programming), and Angular (for interface automation).
Work with a team modernizing how UBI data is handled in the system.
Contribute to transitioning ContactPL from monolithic to modular architecture (GET + JSON path variables).
Strong grasp of Agile, CI/CD, version control, and QA testing best practices expected.
Apply object-oriented programming and knowledge of software development cycles.
Understand the business process of insurance policy management and UBI enrollment.
Focus on improving testing speed, accuracy, and reducing manual work.
Important dates (project deadlines, report submissions, etc.)
Co-op:
Student placement report (May 30) ✅
Meet with co-op advisors for check ints (June 9-20)
Performance evaluation meeting (August 1)
Student self evaluation (August 15)
Student career development report (August 15)
GitHub portfolio and portfolio assessment form (August 15)
Employer evaluation report (August 15)
Work:
Understand QA testing work flows for manual UI testing.
Complete the development of UBI tools by end of June
Add performance tests to the tool by end of July
 
