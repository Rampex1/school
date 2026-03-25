eric deng swe intern at ericsson
December 19, 2024
Internship Report
Intern Name: Eric Deng                                                                       Supervisor: Daniel Dufour
Position: Developer Intern                                                                   Manager: Sreedevi Garigpati
Phone: 514-814-4463                                                                          Mentor: Yash Vadaria   Email: eric.deng@ericsson.com
Company: Ericsson Canada Inc.                                                                                               Office: BNEW GNP Program Office                                                                                             Team: QA Team
Internship Duration: May 2024 – December 2024

Table of Contents
Preface
About Me
Project Overview
Workflow
Contributions
Future Improvements
Conclusion

Preface
This report details my internship experience at Ericsson from May to December 2024, focusing on the projects and tasks I worked on. I hope new interns will find this report insightful and use it as a guide for their own internship experience.

About Me
I am a second-year Software Engineering Co-op student at McGill University. As part of my internship, I had the privilege of joining Ericsson’s Global Network Platform (GNP) organization. GNP is a scalable network API platform that provides developers and users access to advanced 5G network capabilities from communication service providers (CSP).
I was part of the QA team (Team Dragon), working under the guidance of my supervisor, Daniel Dufour (QA Architect Team Lead), and mentor, Yash Vadaria (Developer), who was previously an intern now full-time. The QA team is responsible for testing GNP microservices using an in-house testing framework called TESU (Test Environment Set-Up), designed and developed by Daniel.
My primary project was developing a QA AI Assistant Chatbot, designed to help QA testers work more efficiently by automating repetitive tasks and simplifying interactions with TESU. The chatbot also has the purpose of reducing the learning curve and complexity when understanding TESU. Through natural conversation, the user is able to ask questions about TESU, and understand its various aspects better. Overall, we want the TESU conversational AI assistant to converse naturally with our QA Testers while completing their QA activities on their behalf using the newest TESU features.

Project Overview
3.1 TESU Framework
TESU is an Ansible/Bash-based testing framework that deploys and manages Docker containers, acting as a wrapper for handling load tools and GNP backend microservices. It is associated with the TESU GitLab Repository in a CI/CD workflow, where TESU developers continuously update with new features that meet GNP project requirements, and QA testers pull to their local machines to perform QA activities.

3.2 TESU Containers:
Some of the Docker containers that TESU manages include:
AI Container: Hosts the chatbot backend and frontend.
Test Manager Container: Manages test case execution.
JMeter & Grafana: Provide visualization tools for QA metrics.
The QA testers interact with TESU via the WSL terminal and perform commands on TESU scripts. The framework facilitates deploying containers, managing microservices, and running QA tests.
3.3 TESU Deployment and Non-functional Testing:
TESU is considered as a System Not Under Testing (SNUT), and deploys Docker containers through the QA tester's WSL environment. This SNUT communicates with the System Under Testing (SUT), GNP (the product), by sending API requests. Each team member is assigned to a specific network region, currently numbered 1 to 8, which provides a dedicated environment for running tests independently and simulates the environment that CSPs might operate when interacting with GNP. For example, these regions might include NA-1, EMEA-1, and APAC-1 which are geographically defined areas where network infrastructure, data centers, and services are deployed to server users in that area. As such, the primary goal for QA testers is to evaluate the regions' capabilities in supporting CSPs effectively.

3.4 Chatbot Architecture
In my experience, working on the chatbot primarily required expertise in TESU, especially the AI and Test Manager containers, rather than an in-depth understanding of GNP. 
Below is the architecture documentation for the chatbot development view.

The chatbot consists of two main layers:

3.4.1 Backend
The backend is built using RASA, an open-source framework for developing conversational AI assistants. RASA provides powerful plug-and-play features such as Natural Language Understanding (NLU) and seamless integration with third-party systems via APIs. This makes it an ideal choice for our use case because:
TESU Integration: RASA can connect and interact with TESU through its APIs.
Configuration Flexibility: It uses YAML files for configuration, which aligns with TESU data and parameter storage format.
Python Compatibility: RASA supports Python-based APIs, which are also used in Ansible.
Deployment: It includes a built-in bot frontend, enabling easy deployment on a webpage.

3.4.2 Frontend
The frontend of the chatbot is built using React, HTML, CSS, and JavaScript. It leverages the MUI (Material-UI) React component library to create a visually appealing, intuitive user interface. The webpage is rendered and hosted using Flask, a lightweight Python web framework.
The choice of these technologies is driven by:
React’s Component-Based Architecture: This allows for the reuse and modification of predefined components to suit our specific use case.
Dynamic Rendering: React’s reactive rendering ensures dynamic updates, enabling interaction with data-driven elements like chatbot responses and test results.
MUI Template: The MUI dashboard template provides customizable components, perfect for QA testing purposes, such as monitoring graphs and timelines.
Flask Integration: Flask enables hosting the webpage using Python, which aligns with our existing backend code, and allows us to utilize REST APIs to connect to various TESU features.

3.5 Backend Features
When preparing the Test Manager, the AI container is deployed, and three key servers are started:
RASA Server
RASA Action Server
Webchat Flask Server

3.5.1 RASA Server
The RASA server powers the AI’s core functionalities, including performing statistical predictions to match user intents to predefined events. The AI operates based on a trained model, developed by the team and stored in Artifactory, a cloud-based registry. The trained model is packaged into a file (e.g., ai_assistant_trained_model.tar.gz), which encapsulates all the chatbot’s logic. 
The RASA AI is composed of three main components:
Natural Language Understanding (NLU): Processes and interprets user input, mapping it to specific intents.
Rules: A predefined set of deterministic instructions that the chatbot follows based on specific conditions.
Domain: Defines how the chatbot responds to user inputs, triggers actions, and manages dialogue.
Key Files in RASA Server:
nlu.yml: Matches user input to specific intents. For example, if a user says “Hi,” the chatbot identifies the intent as a greeting. While the range of possible inputs is vast, the chatbot is tailored to handle TESU-related scenarios and commands. We also define entity extraction in NLU. We give examples of entities. For example, if we have the intent user_chooses_toppings, we can add i want a [pepperoni](topping) pizza, or i’ll choose a [cheese](topping) pizza. 
rules.yml: Maps recognized intents to actions for appropriate responses or actions. For instance, if the intent “greet” is detected, a rule triggers the response utter_greet, where the chatbot replies, “Hello, how can I help you?”
The applications for this are also endless. The most notable use case of rules is the way when the chatbot understands that a user has the intent to run a test, it will enter an unbreakable state where it will collect user information about the test case that the user wants to run until all of the fields are completed. Essentially, rules in RASA are deterministic sequences or patterns that the chatbot must follow, which is useful if we don't want the chatbot to diverge or hallucinate. However, using rules exclusively might create complexity by using too many if/else/switch statements, where using stories might be more appropriate.
domain.yml: Defines all possible responses the chatbot can provide. For example, if the user says “Hi”, which is mapped to the intent greet, the chatbot will call the action utter_greet which is defined as “Hello, how can I help you?” This file also specifies forms, a conversational mechanism for collecting user input and triggering specific actions. For example, when a test is being run, the chatbot collects details like the test case number.
Limitations: Unlike generative models (LLM) such as ChatGPT, RASA does not dynamically generate new text. However, it remains a cost-effective, open-source solution ideal for scalable applications.

3.5.2 RASA Action Server
The RASA Action Server works alongside the main RASA server to execute custom actions based on user input, rules, and forms. It handles calls to actions.py, a Python script containing custom-defined actions.
How It Works:
When the RASA server triggers an action, such as ActionRunTest, the Action Server executes the corresponding Python function. For example:
The chatbot collects a test case key from the user.
The RASA Action Server retrieves the key and sends a remote command to the Test Manager.
The Test Manager executes the test case based on the provided key.
Key Characteristics:
Actions are independent of the trained AI model and act as a separate module.
This modularity allows developers to define and extend functionality without retraining the AI model.

3.5.3 Webchat Server
The Webchat server is rendered using the Flask server, which serves the index.html and index.js files. It facilitates interaction between the user and the chatbot through a browser interface. The Webchat Server integrates seamlessly with the backend, enabling users to:
Send queries
View responses
Execute commands in real-time
In addition, the Webchat server manages webhooks to store cached data for fast retrieval by React components. It also continuously monitors and parses test case events, displaying them dynamically through the React components.

3.6 Frontend Features
3.6.1 Botfront
Botfront is a fork of the open-source RASA chat widget. It serves as the frontend view for the RASA chatbot, allowing users to interact with the AI via conversational messages.
3.6.2 React Components
The implemented React components include:
Test Case Execution Timeline: This component displays real-time events from test case execution, retrieving data from the /test-events endpoint.
Test Case List: This component displays the available test cases, retrieving data from the /test-list endpoint.

4. Workflow
Startup TESU: Initialize TESU using the tesu boot command in tesu.sh
Deploy Containers: Start and prepare the Test Manager and AI containers using test_manager.sh
Enter containers: Use docker_manager.sh to start a shell session within the containers
Develop: Use ai_assistant_start-services.sh commands for:
Training the AI model.
Restarting servers (RASA, action, or webchat).
Building the webpage index file

5. Contributions
5.1 Backend Development
RASA Actions:
Developed ActionResetAllSlots to clear filled chatbot fields.
Created ValidateTestForm for validating test case inputs.
Implemented ActionRunTest and ActionRunTestMultiple for executing single or multiple test cases.
Designed ActionReviewPastHistory to fetch and review past test runs.
AI Assistant Enhancements:
Designed new dialogue flows, including FAQs related to GNP and TESU.
Streamlined test execution dialogue for single or multiple test cases
Streamlined past history review dialogues.
5.2 Webchat Server
Developed a Flask-based server to render the chatbot’s webpage.
Implemented continuous monitoring and parsing of test manager files:
Parsed TC_running_state.txt test case execution data from TXT to JSON for the React timeline component.
Parsed tc_parameters.yml to JSON for displaying test lists.
5.3 Frontend Development
Designed the test case execution timeline using MUI’s React components.
Implemented the test case list to see available test cases.
Improved the webpage’s layout and usability.
5.4 Dockerization
Created a Dockerfile for the AI container, including dependencies like Flask and Flask-CORS.
Enhanced docker_manager.sh to enable remote container interactions.
Modified ai_assistant_start-services to support chatbot training, server restarts, and interactive sessions.
5.5 Documentation
Authored deployment and development design documents:
Deployment View: For QA testers using the chatbot.
Development View: For TESU developers managing and training the AI.

6. Future Improvements
Features and Bug Fixes
Validate test case keys using tc_parameters.yml.
Implement an exception for single test case execution during multiple test dialogues.
Maintain chatbot session memory across page refreshes.
Enhance the test list UI with sorting and filtering options.
Add new functionalities to ai_assistant_start-services, such as visualization tools.
Introduce a test abortion feature to cancel ongoing tests via chatbot commands.
Frontend Enhancements
Refactor the webpage to align with updated MUI templates.
Integrate additional charts and graphs for monitoring metrics.

7. Conclusion
My internship at Ericsson provided invaluable hands-on experience with cutting-edge technologies in software engineering and AI. Developing the QA AI Assistant Chatbot allowed me to hone my skills in RASA, React, and Docker while contributing to a meaningful project. I am grateful for the mentorship and collaboration with my team and look forward to seeing how my contributions will enhance the QA process for future testers.
For new interns that are just joining the team, the complexity of TESU might be intimidating, but by interacting with it on a daily basis, you will eventually get used to it. If you have any questions, don’t be afraid to ask other team members! :)
Thank you to Daniel and Yash for guiding me through this internship. Thank you to Sree for giving me this opportunity!

eric deng





Pictures:

Internship Meeting Minutes

I presented the new trained AI model that is able to execute test cases based on user natural language prompts. I then demonstrated that the test case events are being displayed on a front-end timeline inside the testing framework’s web page. I explained the framework that I created to send data from the AI action server towards the front-end web chat server using Rest APIs, such as POST and GET requests. 
I also explained the necessary libraries and dependencies I used in my project, and suggested that these tools should be put in a requirements file for building future Docker containers.
I then explained what the future of this AI chatbot looks like, such as functionalities, features, and concerns I had. For example, we could have a GUI for reviewing past test runs being displayed on the webpage. I also explained the limitations of the chatbot and edge cases, such as its inability to understand when the user inputs URLs, the chatbot not being able to cancel a test case in progress, and unable to run a different test case after it has finished.
I expressed my optimism towards this greater idea of integrating AI into QA work to help QA testers do their jobs more efficiently.
He told me that I had shown great growth ever since the start of my internship at Ericsson back in May, and that I have successfully understood the ins and outs of the testing framework to be able to create a product using the testing framwork’s full functionality. 
He asked me about his approach towards me (and towards interns in general), that being a more laid-back hands-off approach was something I enjoyed. I responded with yes since this is how I have always learned new things, by experimenting, breaking, and trying again. Although I expressed my opinion that more frequent and detailed feedback during the daily stand-up meetings could have been more beneficial to my progress if I were to encounter any blockers in my task. 
He tells me that the expectations set during the “Employer Expectations Meetings” were met and that he is very satisfied with my work. 
I expressed my desire to help out future interns in this project and team as I have seen first hand the complexity with dealing with a complex product and framework. I told him I would write helpful documentation and onboarding guides sharing my experience at Ericsson for future interns. 

How does your internship experience inform you about the what, how, and where you want to achieve during your next internship? What this tells you about what you want do or don't want to do (300 w…
WHERE: A stable and large organization with many established processes that ensure work efficiency. Organized time tables, code bases, meetings, hierarchal structures, project management, dedicated tasks for members, internal software. Ericsson has been a player in the telecommunications industry for 70 years, and the experience and knowledge really shbows in how they manage their organization. Things are well structured and maintained, and there are ressources  and benefits (mental health, courses etc) for employees. I enjoy this type of work place more than a "start-up" is because I do not need to worry about external things (talking to customers, talking to buyers, dealing with organizational inefficiencies) since those things are taken care of by another person. I can just do the task I am assigned as best as possible.
HOW: I enjoyed the structure of my internship where I had daily scrum meetings where I received feedback on my work. For example, if I ran into some blockers in my task, then I would make it known and if it was a serious problem, then an experienced team member could come to my help. I also enjoyed working and learning on my own, as this type of experience has been transferred from how I usually study in high school and CEGEP, which led to good results. At the end of the day, I am aware that I am a part of a large organization, and that being organized and doing your task well is to ensure the well-functionning of the whole.
WHAT: I enjoyed playing around with the testing framework using bash/linux commands that I learnt in COMP 206, and I was very impressed on how those skills could be stretched to the maximum when built by an experienced team of engineers. When I learnt those skills in COMP 206, they were very rudimentary and surface level. However, when I dwelved into the source code, I realized the potential of software engineering and how many possibilities are open to me if I just work harder. It made me excited for the future because my understanding and experience right now is still small, and I had a small peak into the vast open world of possibilities. What I disliked about my tasks was also ironically the complexity of everything. Since everything in the code base in interconnected, when I ran into some kind of issue, I had to traceback the issue through so many layers that it went beyond the scope of my understanding. 
Then, tell us how you think this job could help you get to the where, how and what you want (150 words).  
Roblox is a large and successful company that has produced a game platform that millions of users use every day. I have been playing Roblox ever since I was 8, and it is only now that I realize that it is through people like me (software engineers) that enable an idea like this to come to fruition. Although I enjoy the organizational structure of Ericsson, I much prefer the product and projects of Roblox, since I am accustomed to how the game works as an end-user. Indeed, Ericsson mostly sells its products to other telecommunications companies, which are mostly detached from the everyday person, which makes it difficult for normal people to see the impact of the work that we are doing. Overall, I want my work to have a bigger and observable positive impact on people. 
Interview 1
As part of my internship at Ericsson, I was tasked with developping a AI Chatbot Assistant that would help QA testers prepare, execute, and report test cases, without spending much time reading up on documentation for the testing framework using the conversational AI features. By communicating frequently with each of the QA Team members, who each had a specific role in QA testing, I was able to understand broadly the main components of QA testing, and then program specific custom actions that the Chatbot could take when faced with a specific chat prompt. For example, by talking with Guy, the load performance tester, I was able to make the Chatbot react to the specific words "Run a load performance test" which would then execute the specific test case in the testing framework. As a result, I was able to make test case execution much simpler for all users by leveraging the AI's conversational framework that would recognize specific patterns in a user's prompt.
Interview 2
I was tasked with developping a dashboard that would display the different metrics and test case results after test case execution from the chatbot. I needed to be creative with the design in order to effectively display the most important information that a QA tester would need while minimizing visual clutter. Indeed one of main objectives of the dashboard design was to be accessible to anyone, not just in the QA Team, to use it and understand the results. Therefore, I used my creativity to balance displaying advanced informations with keeping it as simple to understand as possible, while also using the correct React libraries for a better UI user experience. As a result, the dashboard is simple and easy to navigate, while enable users a smooth experience for using a complicated testing framework without showing all the details.
Reflective Questions - Provide a brief summary in 2-3 paragraphs of the software project management best practices that you experienced during your co-op internship.
In order to deploy the AI Chatbot in a Docker container, I had to develop a bash framework that would perform Docker containerization on my behalf, which simplifies the docker build/exec/run process. Previous to the internship, I only had a brief understanding of Docker, without much significant experience using it in a real-life setting. However, by spending a lot of time understanding the existing testing framework, and the many tools in use by the team at my disposal, I was able to aggregate my knowledge to develop the Docker manager. This taught me independent learning as I did this task without much external help, and testing out the Docker manager through extensive unit/intergration tests gave me an appreciation for problem-solving. 
The Agile methodology also played a crucial role in managing our projects. By using tools like Jira, we were able to prioritize tasks, track progress, and adapt to any changes quickly. Collaboration was key, as I worked closely with cross-functional teams to integrate various components, such as integrating the testing framework with the Chatbot. 
Reflective Questions - What kind of supervisor did you have (highly communicative, structured, creative, distant, etc.), and did their supervisory style fit your needs? What kind of supervisors wo…
My supervisor Daniel, was eccentric and enthusiastic, in that his perspective on management was very different from what I believed to be the norm. Indeed, he took a laid-back, hands-off approach and believed that learning is best done when I don't have pressure to complete deliverables and self-paced. I believed this fit my needs, since it reflected my style of learning at school. Indeed, I found that I was much more productive when I did not have a deadline that would pressure me to deliver quickly but with less quality. Instead, I prefer taking my time and producing the best work that I can, while also enjoying the time spent learning and developping. In the future, I would also have someone like this, that can foster my independent learning.
Reflective Questions - What industry sector were you working in (cyber security, gaming, healthcare, research and development, consulting, etc.) and what did you learn about this area? Would you l…
 Ericsson is a telecommunications company that develops infrastructure and software for telecommunication service providers. Previously to the internship, I had only a brief understanding of networking (HTPPS, internet, IP/TPS, 5G), as these are some of the aspects that we encounter on a daily basis when using a device. However, during the onboarding process where I was learning about the product (Global Network Platform), I realized how vast the subject matter was, and how little I thought I knew about networking. I learnt how Ericsson leveraged their expertise to create new technologies that could revolutionize the way we communicate, (they invented Bluetooth, and are the leaders in 5G developement). In the future, I would like to continue working in this industry, and apply the knowledge that I gathered during this internship.
Frequency of feedback meetings (on what basis you will meet to discuss progress and tasks)
30 minute daily scrum meetings with the team to discuss project development progress and individual issues and fixes. I will say during the meeting what I did yesterday, and what I will do today.
Intern responsibilities for the work term, and the expected skills required
Design and develop testing frameworks to be used by QA testers
Ensure quality, testability, scalability, resiliency, maintainability, and security of the developed implementation and services
Participate in all development phases: software design, implementation, test, integration/release, deployment, bug fixing, maintenance and support.
Automated Unit Test and Feature Test
Understand project management and Agile methodologies (story, epics, sprint)
Participate in daily scrum meetings and communicate effectively and concisely
Experience using Jira and Agile software development
Excellent written and oral English communication skills
Experience using Linux environment
Working knowledge on containerization, virtualization, and service orchestration (Container, Docker, Kubernetes and Service Mesh)
Experience in developing and deploying applications in Kubernetes or any other Kubernetes-compatible container orchestrator
Hands-on experience with Microsoft Azure
Knowledge & experience with VPN, IPSec, SCTP, TLS, IPv4, and IPv6, and Routing Protocols/technologies.
Knowledge of Test-Driven development
Internet protocol and security (SSL, HTTP, HTTPS, Certificates, REST API)

Showed my supervisor the powerpoint that I would present tomorrow to the company. He was impressed with my ideas and the webchat AI assistant QA dashboard that I was working on.
He asked me what the biggest challenges that I faced during the internship were. I said that it was jumping in an existing complex project in an already large organization. There were many knowledge layers that I had to overcome to even get started on my simple first task. I needed the whole context to start developing.
He told me that he knows I am a brilliant student and that's why he wanted me on the team in the first place, but also in the future to not let ambition and overconfidence get to my head. A lot of problems can happen in software development (errors, unexpected problems) and not everything is perfect so do not be discouraged
He told me that I shouldn’t be pressured by deadlines since a lot of things can happen, and that I should find my own deadline based on what I think is reasonable. 
He told me that my project was currently not on the critical path of production, but one day when I will be working full-time, to be aware and conscious of my importance. 
He tells me that the expectations set during the “Employer Expectations Meetings” were met. Now that I have completed the first half of the internship, new expectations will be imposed upon me, and that it is a part of the learning process.
Overall he was very satisfied with me in this internship and he tells me that I will continue becoming more comfortable with understanding the product, the code base, and the organization as I move forward with staying at Ericsson for another 4 months. He is glad that I extended the internship.
Internship Meeting Minutes

Frequency of feedback meetings (on what basis you will meet to discuss progress and tasks) 
Like my first internship term, 30m to 1h long daily scrum meetings with everyone on the team (9 people) to discuss project development progress. Bring up blockers, updates, and individual issues and fixes. What I did yesterday, what I will do today.
Intern responsibilities for the work term, and the expected skills required
Complete understanding of TESU (internal testing framework used at Ericsson) and all the test areas (Capacity, Stability, Robustness, O&M)
Why? Because developing a QA Chatbot to help QA testers and project members run/execute tests on the Global Network Platform implies many different scenarios and parameters. The developer needs to account for all possibilities that users may input.
Basic/Moderate level understanding of Global Network Platform.
Why? While understanding the complete framework of GNP is a daunting task, understanding the basic parts (networking, Network APIs, communication service providers, internet), will help me develop the QA Chatbot to be more aligned with the needs of the users that will use it to test on GNP
Complete understanding of RASA (open-source AI framework to build interactive chatbot with custom actions). Since the chatbot is using RASA, I am expected to completely understand the framework, and use all of its features to their fullest extent.
Other: docker, prometheus, grafana, gauge, python, bash scripting, react, node.js, npm, REST APIs
Responsibilities include: covering most/all test areas for test case execution through the chatbot’s dialogue manager
Handling unexpected user input when filling parameters for the test case
Front end design and connection with backend testing framework using CI/CD pipeline
Other: Knowledge & experience with VPN, IPSec, SCTP, TLS, IPv4, and IPv6, and Routing Protocols/technologies. 
Use Jira and Agile for daily task organization.



