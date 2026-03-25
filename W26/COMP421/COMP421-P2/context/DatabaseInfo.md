Context: You are claude code running in Antigravity IDE. For the project, you will use antigravity IDE to output instructions and code only, but never run anything.
I will execute your instructions within Intellij SSH remove university server exactly how you will specify.
Step by step instructions on how to complete everything. 

The database server for this semester is winter2026-comp421.cs.mcgill.ca .You should be able to ssh to that server using Putty, iterm2, etc.

The only database clients that are allowed to interact with the database would be either psql (for PostgreSQL) or db2 (for DB2) if you are using the Unix command line from the database server (after ssh as above). The only IDE that is allowed for use with either database engines is the IntelliJ IDEA Ultimate edition. Connecting to the database engines using any other software (E.g vscode) than this will result in your id being disabled (see course outline) and you might not be able to finish your assignment, projects, etc. Further, winter2026comp421.cs.mcgill.ca is strictly meant to be used for COMP 421 course work and NOTHING else. Violators will have their id disabled. You are also responsible to close your softwares/programs and disconnect them once you are done using the databases. Remember, database engines maintain their connection throughout unless you explicitly close your software, they are not like webservers where you can just leave the webpage open. You are sharing this resource with your classmates, so remember to be mindful about the rules.

You are also expected to be reachable by your McGill email, while you are using the database servers. If the staff notices an issue with something that you are doing which is impacting others, they may try to reach you. Ignoring / not responding to their emails will also result in your id being disabled.

If you are using IntelliJ IDEA, make sure it is the Ultimate edition. Community edition does not have support for some JDBC drivers like DB2.


JDBC URL for DB2 (You might need it if your are going to use Java for your project's application)
jdbc:db2://winter2026-comp421.cs.mcgill.ca:50000/COMP421

You may need McGill VPN to connect using IDE, if you are not on McGill campus. SSH tunnels could possibly work if you know how to setup them (not officially advised).

If you receive a message of the form "FATAL:  too many connections for role...", it means you have too many connections open. Close your IDE, review the database-clients tutorial video to see how when using Intellij IDE, you should use the console option when attaching a SQL file to a database connection prior to executing queries from that SQL file.

Please remember that there is only a small number of system staff that has the skillset to address issues in the database servers. So please do not expect the helpdesk to fix your problems immediately during off-hours, weekends, etc. They may not be available at that time. Please plan to include some buffer when you start working on projects/assignments that requires the use of the database servers.
How to use DB2 via Command Line Processor (CLP)
If you experience trouble accessing DB2, please email to help@cs.mcgill.ca. 
DO NOT SEND MESSAGES TO help.cs.mcgill.ca FOR ADVICE ON SQL. Instead,look at the DB2 Online Documentation.

You are going to use DB2 for your database project. DB2 is installed on a Linux machine that will be exclusively used for COMP421.

The machine is called winter2026-comp421.cs.mcgill.ca. In order to log into this machne, you must be either on the VPN or log in from a machine that is on the McGill network (e.g., mimi).

Each student that has registered for the course has an account on DB2 if you had set up a SOCS Unix account. 

GROUP WORK: Furthermore, for the group work, every group has a special SOCS Unix account. For more information about the names of the group accounts and their passwords, you can find a extra link in the DB2 content folder. 

The groups are named cs421g01 - cs421g99 and cs421g100 to cs421g120. 

groups 01-99: C0mp26-#YZ -XX
groups 100-120: C0mp26-#YZ -XXX
Where XX(X) is the last 2(3) digits of the group number.
You MUST change the password as soon as you log in. If you do not change the password, we will reduce 10 points from your project 2 deliverable. 

To login into you personal user account on winter2026-comp421.cs.mcgill.ca type
    ssh winter2026-comp421.cs.mcgill.ca

To login into the group acccount on winter2026-comp421.cs.mcgill.ca type
    ssh -l cs421gXX winter2026-comp421.cs.mcgill.ca

The data stored in DB2 is partitioned into different database instances. In this course, you will all work with the database instance COMP421. Before you can work with your data, you always have to connect to COMP421

DB2 provides a command line processor that allows you to submit SQL commands to the database system. There are three ways to issue SQL commands using the DB2 command line processor: interactive mode, command line mode, and batch mode.

In interactive mode, the DB2 command line processor is started, and SQL commands are issued at the DB2 command line processor's prompt (db2 =>). Here is an example:
melsaa2@winter2026-comp421:~$ db2 -t

You should receive the prompt

db2 => 

type
                    connect to COMP421;

create a table: 
db2 => create table test1 (a int, b varchar(20));
insert a tuple into the table: 
insert into test1 values (1, 'a');
select the tuples from the table: 
select * from test1;
If the Backspace key does not work, use Ctrl-Backspace instead.
Using the -t when you invoke db2 helps you type multiple lines without having to type \ at the end of each line. you can terminate your SQL command with a semicolon ( ; ) as in the above examples and db2 CLP will then submit this command to the database;
To use operating system command, use ! <command> ;  (ex: db2=>! ls ;)
quit by typing: 
quit;
In command line mode, SQL commands are issued directly on your UNIX shell command line, prefixed by "db2". This has the disadvantage that you have to type "db2" at the start of every line, but it does allow you to take advantage of any command line editing and history mechanisms that are provided by your shell. Here is an example:
melsaa2@winter2026-comp421:~$ db2 connect to COMP421
melsaa2@winter2026-comp421:~$ db2 "select * from test1" 

In batch mode, SQL commands are read by the command line processor from a file. You can create the file using your favorite text editor. To issue SQL commands, use the command line processor's -f option. For example, if mysqlcommands.sql is a text file containing SQL commands, you can execute the commands using:
db2 -t -f mysqlcommands.sql
The DB2 command line processor accepts many command line parameters, which can be used to control its behaviour. You can read about these in the DB2 manual (search for Command line processor options) You may find
db2 -t -vz filename
useful. The -v option causes SQL commands you type to be echoed to the output, and the -z filenameoption causes all of the command line processor's output to be copied into the specified file. It is also possible to set options (such as command echoing) while the command line processor is running. You can do this using the UPDATE COMMAND OPTIONS command.

In general, you may want to know what tables exist in your schema; There are several ways to do this.  Probably the simplest way is to use DB2's list command, like this:
db2 => connect to COMP421;
db2 => list tables;
Another handy DB2 command is describe, which will tell you the types of all of the columns of any table. For example:
db2 => describe table test1;
describe
can be used to find out about any table, including tables that result from the execution of SQL queries. For example:
db2 => describe select * from test1;
The most comprehensive sources of documentation of DB2 are the DB2 Online Documentation .   However, the DB2 command line interpreter can also provide some help directly, via the "?" command.  For example:
db2 => ? list tables ;
LIST TABLES [FOR {USER | ALL | SYSTEM | SCHEMA schema-name}] [SHOW DETAIL] 
  describes the allowed syntax for the list tables command.  
The "?;" command with no arguments will give you a list of known commands. 
The "?;" command can also provide you with detailed explanations of command execution errors: 
db2 => select a + b from test1 ;
SQL0402N The data type of an operand of an arithmetic function or operation "+" is not numeric. SQLSTATE=42819 
In this example, an SQL query has failed because of a type mismatch.  The brief error message will usually identify the problem.  However, you can get more information about specific errors using "?" : 
 db2 => ? SQL0402N;
 SQL0402N The data type of an operand of an arithmetic function 
          or operation "" is not numeric.

Explanation:  A nonnumeric operand is specified for the 
arithmetic function or operator "".

The statement cannot be processed.

User Response:  Correct the SQL statement syntax so all specified 
function or operator operands are numeric.

Federated system users: if the reason is unknown, isolate the 
problem to the data source failing the request (see the problem 
determination guide for procedures to follow to identify the 
failing data source) and examine the operators applied to that 
data source.

sqlcode:  -402

sqlstate:  42819 
 

You can create tables, insert data into the tables, query the tables you created, create indices, triggers, etc. However, each user  can only access the data created by the user him/herself . A user does not have access to the tables created by other users. In order to achieve such separation, DB2 distinguishes between different schemas . Each user has their own schema and when you connect to COMP421 using your account, you will only have access to the tables created within your schema. Whenever you create a table, e.g., with the command create table test1 (a int, b varchar(2)), DB2 creates a table uname.test1 (depending on the user name "uname" you have logged into db2). When you query this table, the query select * from test1 will give you the same result as select * from uname.test1 . As a result of such schema separation, two users (e.g., user1 and user2) can have tables with the same name test1 , because internally, the table names will be user1.test1 and user2.test1.