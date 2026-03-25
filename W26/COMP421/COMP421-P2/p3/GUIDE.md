# COMP-421 Project 3 — Step-by-Step Guide
**Due: March 31, NOON**

Your database is a hotel reservation system with tables: `LoyaltyTier`, `Customer`, `Hotel`, `RoomType`, `Room`, `Reservation`, `ReservationRoom`, `Payment`, `Review`, `Staff`, `Service`, `Amenity`, `HotelAmenity`.

---

## Deliverables Overview

| # | Points | Deliverable |
|---|--------|-------------|
| 1 | 0 | Use DB2 on `winter2026-comp421` server |
| 2 | 0 (−5 if missing) | Relational schema in `project3.pdf` |
| 3 | 15 | Stored procedure |
| 4 | 50 | Java JDBC application |
| 5 | 5 | Index |
| 6 | 10 | Data visualization |
| 7 | 10 | Creativity (optional but recommended) |
| 8 | 0 (−10 if missing) | Team contribution paragraph |
| 9 | 10 | Presentation (8 min) |

---

## Step 1 — Project Setup

1. Connect to the `winter2026-comp421` DB2 server (not a local install, or you lose 10 points).
2. Confirm your tables from P2 are still intact:
   ```sql
   CONNECT TO COMP421;
   LIST TABLES;
   ```
3. Create a new folder `p3/` in your project repo for all new files.

---

## Step 2 — Relational Schema (0 pts, −5 if missing)

In `project3.pdf`, add a section titled **Relational Schema** listing all your tables and their attributes. You do not need to include constraints/assumptions — just the schema. Copy from your P2 report if unchanged.

---

## Step 3 — Stored Procedure (15 pts)

### Requirements
- Uses **local variables**, **multiple SQL statements**, **a loop**, and **a cursor**
- Uses **one or more parameters** in a meaningful way
- Must be non-trivial

### Suggested Procedure for This Project
A good fit: **Upgrade customer loyalty tiers based on their total spending**.

The procedure takes a spending threshold as a parameter, uses a cursor to iterate over customers, computes their total spending from `Payment`/`Reservation`, and upgrades their `tierName` in `Customer` accordingly.

```sql
CREATE OR REPLACE PROCEDURE UpgradeCustomerTiers(IN spendingThreshold DECIMAL(12,2))
LANGUAGE SQL
BEGIN
    DECLARE v_customerID INTEGER;
    DECLARE v_totalSpent DECIMAL(12,2);
    DECLARE v_newTier VARCHAR(20);
    DECLARE done INT DEFAULT 0;

    DECLARE cur CURSOR FOR
        SELECT c.customerID,
               COALESCE(SUM(p.amount), 0) AS totalSpent
        FROM Customer c
        LEFT JOIN Reservation r ON c.customerID = r.customerID
        LEFT JOIN Payment p ON r.reservationID = p.reservationID
                            AND p.paymentStatus = 'completed'
        GROUP BY c.customerID;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    OPEN cur;

    fetch_loop: LOOP
        FETCH cur INTO v_customerID, v_totalSpent;
        IF done = 1 THEN LEAVE fetch_loop; END IF;

        -- Determine new tier based on spending
        IF v_totalSpent >= spendingThreshold * 3 THEN
            SET v_newTier = 'Platinum';
        ELSEIF v_totalSpent >= spendingThreshold * 2 THEN
            SET v_newTier = 'Gold';
        ELSEIF v_totalSpent >= spendingThreshold THEN
            SET v_newTier = 'Silver';
        ELSE
            SET v_newTier = 'Bronze';
        END IF;

        UPDATE Customer
        SET tierName = v_newTier
        WHERE customerID = v_customerID;

    END LOOP fetch_loop;

    CLOSE cur;
END@
```

### Steps
1. Open the DB2 command line editor (CLP or `db2` shell).
2. Paste and execute the procedure definition above (adjust tier names to match your `LoyaltyTier` data).
3. Call it: `CALL UpgradeCustomerTiers(1000.00);`
4. Take a screenshot of the execution output.

### What to put in `project3.pdf` — Section: **Stored Procedure**
- **(a)** Informal English description of what the procedure does
- **(b)** Full source code listing
- **(c)** Screenshot of running the procedure in DB2's command line editor
- **(d)** Screenshots of a `SELECT * FROM Customer` **before** and **after** calling the procedure to show the effect

---

## Step 4 — Java JDBC Application (50 pts)

### Requirements
- At least **5 menu options** + Quit
- Loop: prompt → input → query/modify → show result → return to menu
- Must include both **queries** and **modifications**
- Some options must use **multiple SQL statements**
- At least **one option leads to a sub-menu** generated from a DB query
- **Error handling**: catch all exceptions, print messages, close connections gracefully

### Suggested Menu for This Hotel System

```
Hotel Reservation System
  1. Look up reservations for a customer
  2. Make a new reservation
  3. Cancel a reservation (and reassign rooms)
  4. Add a new customer
  5. Show available rooms for a hotel and date range
  6. Quit
```

### Option Design Notes

| Option | Type | SQL statements | Notes |
|--------|------|----------------|-------|
| 1. Look up reservations | Query | 1 | Simple SELECT joining Reservation + Room |
| 2. Make a new reservation | Modification | 3+ | INSERT into Reservation, ReservationRoom, update Room status |
| 3. Cancel a reservation | Modification | 2+ | UPDATE Reservation status, UPDATE Room status back to 'available' |
| 4. Add a new customer | Modification | 1 | INSERT into Customer |
| 5. Show available rooms | Sub-menu query | 2 | First query hotels, user picks one → sub-menu of available rooms |

### Implementation Steps

1. Download the JDBC example from myCourses as a starting point.
2. Set your JDBC connection string to point to the `winter2026-comp421` DB2 server:
   ```java
   String url = "jdbc:db2://winter2026-comp421.cs.mcgill.ca:50000/COMP421";
   Connection conn = DriverManager.getConnection(url, username, password);
   ```
3. Implement the main menu loop in `main()`:
   ```java
   while (true) {
       printMenu();
       int choice = scanner.nextInt();
       switch (choice) {
           case 1: lookUpReservations(conn, scanner); break;
           case 2: makeReservation(conn, scanner); break;
           // ...
           case 6: conn.close(); System.exit(0);
       }
   }
   ```
4. For each option, implement a method that:
   - Prompts for necessary input
   - Uses `PreparedStatement` for all queries (prevents SQL injection)
   - Prints results clearly
   - Catches `SQLException` and prints the error message without crashing
5. For the sub-menu option (e.g., option 5):
   - First query the list of hotels
   - Print them as a numbered list
   - Prompt the user to pick one
   - Then query available rooms for that hotel
6. Wrap the entire `main()` in a try-catch-finally to ensure `conn.close()` always runs.

### File structure
```
p3/
  HotelApp.java       (or split into multiple .java files)
```

### What to put in `project3.pdf` — Section: **Application program**
- Screenshots of **each menu option being exercised at least once**
- Include both successful operations and any meaningful error case

---

## Step 5 — Indexing (5 pts)

### Requirements
- Create at least **one useful index** on a non-PK, non-unique-constraint column
- Do not index primary keys (DB2 does this automatically)

### Suggested Index for This Project

A useful index for the application: index `Reservation.customerID` to speed up reservation lookups by customer, and `Reservation.checkInDate` to speed up availability queries.

```sql
CREATE INDEX idx_res_customer ON Reservation(customerID);
```

Or a composite index for availability range queries:
```sql
CREATE INDEX idx_res_dates ON Reservation(checkInDate, checkOutDate);
```

### Steps
1. Run the `CREATE INDEX` statement in DB2 and capture the output.
2. Drop with `DROP INDEX idx_res_customer;` if needed.

### What to put in `project3.pdf` — Section: **Indexing**
- **(a)** Screenshot of the `CREATE INDEX` statement executing in DB2 and its result
- **(b)** Explanation of which queries in your application will run faster and why (e.g., "Option 1 queries `Reservation` by `customerID`; this index avoids a full table scan")

---

## Step 6 — Data Visualization (10 pts)

### Requirements
- One chart visualizing something meaningful about your hotel data
- Data must be extracted via SQL from DB2
- Chart must be readable (not cluttered)

### Suggested Visualization

**Total revenue per hotel** — a bar chart showing `SUM(amount)` from `Payment` grouped by hotel name. Readable, business-relevant, and easy to produce.

```sql
EXPORT TO revenue.csv OF DEL MODIFIED BY NOCHARDEL
SELECT h.hotelName, SUM(p.amount) AS totalRevenue
FROM Hotel h
JOIN Reservation r ON r.customerID IN (
    SELECT customerID FROM Reservation
)
JOIN ReservationRoom rr ON rr.reservationID = r.reservationID
JOIN Room rm ON rm.roomID = rr.roomID AND rm.hotelID = h.hotelID
JOIN Payment p ON p.reservationID = r.reservationID
WHERE p.paymentStatus = 'completed'
GROUP BY h.hotelName
ORDER BY totalRevenue DESC;
```

Or more simply:
```sql
EXPORT TO revenue.csv OF DEL MODIFIED BY NOCHARDEL
SELECT h.hotelName, SUM(p.amount) AS totalRevenue
FROM Payment p
JOIN Reservation r ON p.reservationID = r.reservationID
JOIN ReservationRoom rr ON rr.reservationID = r.reservationID
JOIN Room rm ON rm.roomID = rr.roomID
JOIN Hotel h ON h.hotelID = rm.hotelID
WHERE p.paymentStatus = 'completed'
GROUP BY h.hotelName
ORDER BY totalRevenue DESC;
```

### Steps
1. Run the EXPORT command in the DB2 CLP to produce `revenue.csv`.
2. Open the CSV in Excel or Google Sheets.
3. Select the data and insert a **bar chart**.
4. Label the axes and add a title.
5. Export the chart as a JPG or PNG (screenshot works).
6. Save the spreadsheet file to submit.

### What to put in `project3.pdf` — Section: **Visualization**
- **(i)** The SQL query used to generate the data
- **(ii)** The JPG/PNG image of the chart (readable resolution)
- **(iii)** A short explanation of what the chart represents and why it is interesting

Also submit the `.xlsx` or Google Sheets file separately.

---

## Step 7 — Creativity (10 pts, optional but recommended)

Pick **one** (or more):

### Option A: Trigger
Create a trigger that does something meaningful, e.g., automatically update `Customer.loyaltyPoints` when a payment is completed:
```sql
CREATE TRIGGER UpdateLoyaltyPoints
AFTER UPDATE ON Payment
REFERENCING NEW AS n OLD AS o
FOR EACH ROW
WHEN (n.paymentStatus = 'completed' AND o.paymentStatus <> 'completed')
BEGIN ATOMIC
    UPDATE Customer c
    SET loyaltyPoints = loyaltyPoints + INTEGER(n.amount / 10)
    WHERE c.customerID = (
        SELECT customerID FROM Reservation WHERE reservationID = n.reservationID
    );
END@
```

### Option B: Two Useful Indexes (one sophisticated)
Add a second, more sophisticated index, e.g., a **clustered index** or **index on multiple columns**:
```sql
CREATE INDEX idx_room_hotel_status ON Room(hotelID, roomStatus);
```

### Option C: Sophisticated GUI
Replace the console UI with a Swing or JavaFX GUI. Describe the tools used and the structure.

### Option D: Extra Stored Procedure
Write a second stored procedure that does something completely different from Step 3.

### What to put in `project3.pdf` — Section: **Creativity**
- Informal English description of what you did
- For triggers/procedures: follow the same format as Q3
- For indexes: same format as Q5
- For GUI: tools used and brief structural description

---

## Step 8 — Team Contribution (0 pts, −10 if missing)

In `project3.pdf`, write **one paragraph** describing:
- How many meetings your team had
- What each team member contributed to this deliverable

---

## Step 9 — Presentation (10 pts)

- **8 minutes total**, split among all group members
- Main focus: **live demo of the Java application** (question 4)
- Questions 2, 3, 5 can be covered via the report or slides
- Set everything up **before** the demo starts — test your DB connection ahead of time
- Keep source code ready in case the TA asks questions
- The presentation **cannot contain new content** not already in the submitted report

---

## Final Submission Checklist

- [ ] `project3.pdf` with sections: Relational Schema, Stored Procedure, Application program, Indexing, Visualization, Creativity (if done), Team Contribution
- [ ] All `.java` source files
- [ ] Excel / Google Sheets file for visualization
- [ ] Everything submitted via myCourses before **March 31, NOON**
- [ ] DB2 connection points to `winter2026-comp421` server (not local)
