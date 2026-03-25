# COMP-421 Project 2 — Server Execution Instructions
## Group 19: David Vo, David Zhou, David Namgung, Jessie Maeda-Yang

> **Goal:** Run all required DB2 commands on `winter2026-comp421.cs.mcgill.ca`, take
> screenshots at every marked step, then paste them into `project2.tex`.
>
> **Rule:** Use the DB2 CLI only. Do NOT use the IntelliJ database widget / data-source panel.
> IntelliJ is only used here to open its built-in terminal.

---

## PART 0 — Open a Terminal in IntelliJ and SSH In

1. Open IntelliJ IDEA Ultimate.
2. In the menu bar click **View → Tool Windows → Terminal**
   (or press `` Alt+F12 `` on Windows/Linux, `` ⌥F12 `` on macOS).
   A shell prompt appears at the bottom of the IDE.
3. SSH into the group account. Replace `XX` with your actual group number (e.g. `19`):
   ```
   ssh -l cs421g19 winter2026-comp421.cs.mcgill.ca
   ```
4. When prompted `Are you sure you want to continue connecting?` type:
   ```
   yes
   ```
5. Enter the default password when prompted (format: `C0mp26-#YZ-XX`, e.g. `C0mp26-#YZ-19`).

---

## PART 1 — Change the Group Password (MANDATORY — -10 pts if skipped)

6. Once logged in, change the password immediately:
   ```
   passwd
   ```
7. Enter the current default password when prompted.
8. Enter your new password (pick something your whole group knows).
9. Re-enter the new password to confirm.
   You should see: `passwd: password updated successfully`

   > **Tell all group members the new password right now.**

---

## PART 2 — Upload the Project Files to the Server

Do this from your **local machine** (open a second IntelliJ terminal tab with `+`).

10. In the new local terminal tab, navigate to the submission directory:
    ```
    cd /Users/kasamix/VSCode/Winter-2026/COMP421/P2/submission
    ```
11. Copy all project files to your home directory on the server (replace `cs421g19`):
    ```
    scp createtbl.sql droptbl.sql loaddata.sql createtbl.sh droptbl.sh loaddata.sh runall.sh cs421g19@winter2026-comp421.cs.mcgill.ca:~/project2/
    ```
    > If the `project2/` directory does not exist yet the scp will fail.
    > Go back to the SSH tab and run `mkdir -p ~/project2` first, then retry.

12. Switch back to the SSH terminal tab (the one logged into the server).

---

## PART 3 — Prepare the Scripts

13. Go into the project directory on the server:
    ```
    cd ~/project2
    ```
14. Make all shell scripts executable:
    ```
    chmod +x createtbl.sh droptbl.sh loaddata.sh runall.sh
    ```
15. Confirm the files are there:
    ```
    ls -l
    ```
    You should see: `createtbl.sh  createtbl.sql  droptbl.sh  droptbl.sql  loaddata.sh  loaddata.sql  runall.sh`

---

## PART 4 — Drop Any Pre-existing Tables (Clean Slate)

16. Run the drop script. Errors like `"table does not exist"` on first run are harmless — ignore them:
    ```
    ./droptbl.sh
    ```
17. Scroll through the output and confirm no unexpected errors.
    The log is saved automatically to `droptbl.log`.

    > **SCREENSHOT 1** — Capture the terminal output of `./droptbl.sh`.
    > Label it `droptbl_run` when you add it to the report.

---

## PART 5 — Create All Tables

18. Run the create script:
    ```
    ./createtbl.sh
    ```
19. Watch for any `SQL` error codes. All 13 `CREATE TABLE` statements should say
    `DB20000I  The SQL command completed successfully.`
    The log is saved to `createtbl.log`.

    > **SCREENSHOT 2** — Capture the full terminal output of `./createtbl.sh`.
    > Make sure all 13 CREATE TABLE statements and their success messages are visible.
    > Scroll and take multiple screenshots if needed. Label them `createtbl_run`.

20. Verify the tables exist by starting DB2 interactive mode:
    ```
    db2 -t
    ```
21. Connect to the database:
    ```
    connect to COMP421;
    ```
22. List your tables:
    ```
    list tables;
    ```
    You should see all 13 tables: `LOYALTYTIER`, `CUSTOMER`, `HOTEL`, `ROOMTYPE`, `ROOM`,
    `RESERVATION`, `RESERVATIONROOM`, `PAYMENT`, `REVIEW`, `STAFF`, `SERVICE`,
    `AMENITY`, `HOTELAMENITY`.
23. Exit DB2 interactive mode:
    ```
    quit;
    ```

---

## PART 6 — Load the Data

24. Run the load script:
    ```
    ./loaddata.sh
    ```
25. All INSERT statements should succeed. The log is saved to `loaddata.log`.

    > **SCREENSHOT 3** — Capture the terminal output of `./loaddata.sh`.
    > Scroll to show inserts completing. Label it `loaddata_run`.

26. Spot-check the data. Enter DB2 interactive mode again:
    ```
    db2 -t
    ```
27. Connect:
    ```
    connect to COMP421;
    ```
28. Quick row-count check across tables:
    ```
    SELECT 'LoyaltyTier' AS tbl, COUNT(*) AS cnt FROM LoyaltyTier;
    SELECT 'Customer'    AS tbl, COUNT(*) AS cnt FROM Customer;
    SELECT 'Hotel'       AS tbl, COUNT(*) AS cnt FROM Hotel;
    SELECT 'Room'        AS tbl, COUNT(*) AS cnt FROM Room;
    SELECT 'Reservation' AS tbl, COUNT(*) AS cnt FROM Reservation;
    SELECT 'Payment'     AS tbl, COUNT(*) AS cnt FROM Payment;
    SELECT 'Review'      AS tbl, COUNT(*) AS cnt FROM Review;
    SELECT 'Staff'       AS tbl, COUNT(*) AS cnt FROM Staff;
    ```
    Expected: 4, 20, 5, 50, 20, 20, 15, 10 rows respectively.
29. Stay in DB2 interactive mode for the next sections.

---

## PART 7 — Run SQL Queries (Q5) and Take Screenshots

> For every query below:
> - Paste the full SQL at the `db2 =>` prompt.
> - Make sure the **entire SQL statement** is visible above the results in your screenshot.
> - If output is long, scroll so at least the first several result rows are visible.
> - Label each screenshot as indicated.

### Query 1 — High-value customers at 5-star hotels

30. At the `db2 =>` prompt paste:
    ```sql
    SELECT c.customerID,
           c.fName || ' ' || c.lName AS customerName,
           c.email,
           c.tierName,
           COUNT(DISTINCT res.reservationID) AS totalReservations,
           SUM(p.amount) AS totalAmountSpent
    FROM Customer c
    JOIN Reservation res ON c.customerID = res.customerID
    JOIN ReservationRoom rr ON res.reservationID = rr.reservationID
    JOIN Room r ON rr.roomID = r.roomID
    JOIN Hotel h ON r.hotelID = h.hotelID
    JOIN Payment p ON res.reservationID = p.reservationID
    WHERE h.starRating = 5
      AND p.paymentStatus = 'completed'
    GROUP BY c.customerID, c.fName, c.lName, c.email, c.tierName
    HAVING SUM(p.amount) > 1000
    ORDER BY totalAmountSpent DESC;
    ```

    > **SCREENSHOT Q1** — Capture input + output. Label `query1`.

### Query 2 — Hotel review averages with amenity info

31. Paste:
    ```sql
    WITH HotelRatings AS (
        SELECT rv.hotelID,
               AVG(CAST(rv.rating AS DECIMAL(5,2)))            AS avgOverall,
               AVG(CAST(rv.cleanlinessRating AS DECIMAL(5,2))) AS avgCleanliness,
               AVG(CAST(rv.locationRating AS DECIMAL(5,2)))    AS avgLocation,
               AVG(CAST(rv.serviceRating AS DECIMAL(5,2)))     AS avgService,
               AVG(CAST(rv.valueRating AS DECIMAL(5,2)))       AS avgValue,
               COUNT(rv.reviewID)                              AS reviewCount
        FROM Review rv
        GROUP BY rv.hotelID
    ),
    SpaHotels AS (
        SELECT ha.hotelID
        FROM HotelAmenity ha
        JOIN Amenity a ON ha.amenityID = a.amenityID
        WHERE a.amenityName = 'Spa'
    )
    SELECT h.hotelName,
           h.city,
           h.starRating,
           DECIMAL(hr.avgOverall, 5, 2)     AS avgOverallRating,
           DECIMAL(hr.avgCleanliness, 5, 2) AS avgCleanliness,
           DECIMAL(hr.avgService, 5, 2)     AS avgService,
           hr.reviewCount,
           CASE WHEN sh.hotelID IS NOT NULL THEN 'Yes' ELSE 'No' END AS hasSpa
    FROM Hotel h
    JOIN HotelRatings hr ON h.hotelID = hr.hotelID
    LEFT JOIN SpaHotels sh ON h.hotelID = sh.hotelID
    ORDER BY hr.avgOverall DESC;
    ```

    > **SCREENSHOT Q2** — Capture input + output. Label `query2`.

### Query 3 — Revenue analysis by room type

32. Paste:
    ```sql
    SELECT rt.typeName,
           COUNT(DISTINCT rr.reservationID) AS numberOfBookings,
           SUM(rr.pricePerNight)            AS totalRevenue,
           AVG(rr.pricePerNight)            AS avgPriceCharged,
           rt.basePricePerNight,
           AVG(rr.pricePerNight) - AVG(rt.basePricePerNight) AS avgPriceDifference,
           MAX(rr.pricePerNight)            AS maxPriceCharged
    FROM RoomType rt
    JOIN Room r ON rt.hotelID = r.hotelID AND rt.typeName = r.typeName
    JOIN ReservationRoom rr ON r.roomID = rr.roomID
    GROUP BY rt.typeName, rt.basePricePerNight
    ORDER BY totalRevenue DESC;
    ```

    > **SCREENSHOT Q3** — Capture input + output. Label `query3`.

### Query 4 — Loyalty tier mismatch detection

33. Paste:
    ```sql
    WITH CustomerSpend AS (
        SELECT c.customerID,
               c.fName || ' ' || c.lName AS customerName,
               c.tierName,
               c.loyaltyPoints,
               COALESCE(SUM(p.amount), 0) AS totalSpent
        FROM Customer c
        LEFT JOIN Reservation res ON c.customerID = res.customerID
        LEFT JOIN Payment p ON res.reservationID = p.reservationID
                           AND p.paymentStatus = 'completed'
        GROUP BY c.customerID, c.fName, c.lName, c.tierName, c.loyaltyPoints
    ),
    PlatinumAvg AS (
        SELECT AVG(totalSpent) AS platAvg
        FROM CustomerSpend
        WHERE tierName = 'Platinum'
    )
    SELECT cs.customerID,
           cs.customerName,
           cs.tierName,
           cs.loyaltyPoints,
           DECIMAL(cs.totalSpent, 12, 2) AS totalSpent,
           DECIMAL(pa.platAvg, 12, 2)    AS platinumAvgSpend
    FROM CustomerSpend cs, PlatinumAvg pa
    WHERE cs.tierName IN ('Bronze', 'Silver')
      AND cs.totalSpent > pa.platAvg
    ORDER BY cs.totalSpent DESC;
    ```

    > **SCREENSHOT Q4** — Capture input + output. Label `query4`.

### Query 5 — Seasonal revenue analysis by city

34. Paste:
    ```sql
    WITH MonthlyRevenue AS (
        SELECT h.city,
               YEAR(res.checkInDate)  AS bookingYear,
               MONTH(res.checkInDate) AS bookingMonth,
               SUM(p.amount)          AS monthlyRevenue,
               COUNT(res.reservationID) AS numBookings
        FROM Hotel h
        JOIN Room r ON h.hotelID = r.hotelID
        JOIN ReservationRoom rr ON r.roomID = rr.roomID
        JOIN Reservation res ON rr.reservationID = res.reservationID
        JOIN Payment p ON res.reservationID = p.reservationID
        WHERE p.paymentStatus = 'completed'
        GROUP BY h.city, YEAR(res.checkInDate), MONTH(res.checkInDate)
    ),
    CityAnnualAvg AS (
        SELECT city,
               bookingYear,
               AVG(monthlyRevenue) AS avgMonthlyRevenue
        FROM MonthlyRevenue
        GROUP BY city, bookingYear
    ),
    RankedMonths AS (
        SELECT mr.city,
               mr.bookingYear,
               mr.bookingMonth,
               mr.monthlyRevenue,
               mr.numBookings,
               ca.avgMonthlyRevenue,
               RANK() OVER (PARTITION BY mr.city, mr.bookingYear
                            ORDER BY mr.monthlyRevenue DESC) AS revenueRank
        FROM MonthlyRevenue mr
        JOIN CityAnnualAvg ca ON mr.city = ca.city
                              AND mr.bookingYear = ca.bookingYear
    )
    SELECT city,
           bookingYear,
           bookingMonth AS peakMonth,
           DECIMAL(monthlyRevenue, 12, 2)    AS peakRevenue,
           DECIMAL(avgMonthlyRevenue, 12, 2) AS annualAvgMonthlyRevenue,
           DECIMAL(monthlyRevenue - avgMonthlyRevenue, 12, 2) AS aboveAverage,
           numBookings AS bookingsInPeakMonth
    FROM RankedMonths
    WHERE revenueRank = 1
    ORDER BY city, bookingYear;
    ```

    > **SCREENSHOT Q5** — Capture input + output. Label `query5`.

---

## PART 8 — Run SQL Modifications (Q6) and Take Screenshots

### Mod 1 — Batch loyalty tier update

35. Paste:
    ```sql
    UPDATE Customer
    SET tierName = CASE
            WHEN (SELECT COALESCE(SUM(p.amount), 0)
                  FROM Reservation res
                  JOIN Payment p ON res.reservationID = p.reservationID
                  WHERE res.customerID = Customer.customerID
                    AND p.paymentStatus = 'completed') >= 10000 THEN 'Platinum'
            WHEN (SELECT COALESCE(SUM(p.amount), 0)
                  FROM Reservation res
                  JOIN Payment p ON res.reservationID = p.reservationID
                  WHERE res.customerID = Customer.customerID
                    AND p.paymentStatus = 'completed') >= 5000 THEN 'Gold'
            WHEN (SELECT COALESCE(SUM(p.amount), 0)
                  FROM Reservation res
                  JOIN Payment p ON res.reservationID = p.reservationID
                  WHERE res.customerID = Customer.customerID
                    AND p.paymentStatus = 'completed') >= 1000 THEN 'Silver'
            ELSE 'Bronze'
        END
    WHERE customerID IN (
        SELECT DISTINCT res.customerID
        FROM Reservation res
        JOIN Payment p ON res.reservationID = p.reservationID
        WHERE p.paymentStatus = 'completed'
    );
    ```
    DB2 will respond with something like `DB20000I  The SQL command completed successfully.`
    and a row count.

    > **SCREENSHOT MOD1** — Capture the full UPDATE statement and the success/row-count output.
    > Label `mod1`.

36. Verify the update took effect:
    ```sql
    SELECT customerID, fName, lName, tierName FROM Customer ORDER BY customerID;
    ```

    > **SCREENSHOT MOD1-VERIFY** — Optional but recommended. Label `mod1_verify`.

### Mod 2 — Delete stale pending reservations

37. First, check what will be deleted (dry-run SELECT):
    ```sql
    SELECT res.reservationID, res.reservationStatus, res.bookingDate
    FROM Reservation res
    WHERE res.reservationStatus = 'pending'
      AND res.bookingDate < CURRENT DATE - 30 DAYS
      AND NOT EXISTS (
          SELECT 1 FROM Payment p
          WHERE p.reservationID = res.reservationID
            AND p.paymentStatus = 'completed'
      );
    ```
    (May return 0 rows since our data is recent — that is fine, the DELETE still runs.)

38. Delete the child rows from ReservationRoom first:
    ```sql
    DELETE FROM ReservationRoom
    WHERE reservationID IN (
        SELECT res.reservationID
        FROM Reservation res
        WHERE res.reservationStatus = 'pending'
          AND res.bookingDate < CURRENT DATE - 30 DAYS
          AND NOT EXISTS (
              SELECT 1
              FROM Payment p
              WHERE p.reservationID = res.reservationID
                AND p.paymentStatus = 'completed'
          )
    );
    ```

39. Then delete from Reservation:
    ```sql
    DELETE FROM Reservation
    WHERE reservationStatus = 'pending'
      AND bookingDate < CURRENT DATE - 30 DAYS
      AND NOT EXISTS (
          SELECT 1
          FROM Payment p
          WHERE p.reservationID = Reservation.reservationID
            AND p.paymentStatus = 'completed'
      );
    ```

    > **SCREENSHOT MOD2** — Capture both DELETE statements and their output together.
    > Scroll to show both. Label `mod2`.

---

## PART 9 — Create Views (Q7) and Take Screenshots

### View 1 — HotelSummary (simple, single-table)

40. Create the view:
    ```sql
    CREATE VIEW HotelSummary AS
    SELECT h.hotelID,
           h.hotelName,
           h.city,
           h.starRating,
           h.totalRooms,
           h.propertyType
    FROM Hotel h;
    ```

    > **SCREENSHOT VIEW1-CREATE** — Capture the CREATE VIEW statement and success message. Label `view1_create`.

41. Select 5 rows from the view:
    ```sql
    SELECT * FROM HotelSummary FETCH FIRST 5 ROWS ONLY;
    ```

    > **SCREENSHOT VIEW1-SELECT** — Capture the SELECT and its 5 rows of output. Label `view1_select`.

42. Attempt an insert into the view:
    ```sql
    INSERT INTO HotelSummary (hotelID, hotelName, city, starRating, totalRooms, propertyType)
    VALUES (6, 'Vancouver Waterfront Hotel', 'Vancouver', 4, 180, 'Resort');
    ```
    Expected: DB2 returns **SQL0407N** because `street`, `country`, `checkInTime`, `checkOutTime`
    are NOT NULL in the base `Hotel` table but are not present in the view — DB2 cannot set them.

    > **SCREENSHOT VIEW1-INSERT** — Capture the INSERT statement and the error message. Label `view1_insert`.

### View 2 — ActiveReservationDetails (complex, multi-table join)

43. Create the view:
    ```sql
    CREATE VIEW ActiveReservationDetails AS
    SELECT res.reservationID,
           c.customerID,
           c.fName || ' ' || c.lName AS customerName,
           c.email,
           c.tierName,
           h.hotelName,
           h.city,
           res.checkInDate,
           res.checkOutDate,
           res.numberOfGuests,
           res.totalPrice,
           res.reservationStatus,
           p.paymentStatus,
           p.paymentMethod
    FROM Reservation res
    JOIN Customer c ON res.customerID = c.customerID
    JOIN ReservationRoom rr ON res.reservationID = rr.reservationID
    JOIN Room r ON rr.roomID = r.roomID
    JOIN Hotel h ON r.hotelID = h.hotelID
    LEFT JOIN Payment p ON res.reservationID = p.reservationID
    WHERE res.reservationStatus IN ('confirmed', 'checked_in');
    ```

    > **SCREENSHOT VIEW2-CREATE** — Capture the CREATE VIEW statement and success message. Label `view2_create`.

44. Select 5 rows from the view:
    ```sql
    SELECT * FROM ActiveReservationDetails FETCH FIRST 5 ROWS ONLY;
    ```

    > **SCREENSHOT VIEW2-SELECT** — Capture the SELECT and output. Label `view2_select`.

45. Attempt an insert into the view:
    ```sql
    INSERT INTO ActiveReservationDetails
        (reservationID, customerID, customerName, email, tierName,
         hotelName, city, checkInDate, checkOutDate, numberOfGuests,
         totalPrice, reservationStatus, paymentStatus, paymentMethod)
    VALUES
        (9999, 1, 'Emma Thompson', 'emma.thompson@email.com', 'Gold',
         'Grand Palais Montreal', 'Montreal', '2026-06-01', '2026-06-05', 2,
         1156.00, 'confirmed', 'pending', 'credit_card');
    ```
    Expected: DB2 returns **SQL0150N** — view is not insertable because it contains a JOIN.

    > **SCREENSHOT VIEW2-INSERT** — Capture the INSERT statement and the error message. Label `view2_insert`.

---

## PART 10 — Test Check Constraints (Q8) and Take Screenshots

> The constraints were already created when you ran `createtbl.sh`.
> You only need to screenshot the violation attempts.

### Check Constraint 1 — Star rating must be 1–5

46. Show the constraint exists (description screenshot):
    ```sql
    SELECT CONSTNAME, TYPE, TEXT
    FROM SYSCAT.CHECKS
    WHERE TABNAME = 'HOTEL';
    ```

    > **SCREENSHOT CHECK1-DEF** — Capture the constraint definition output. Label `check1_def`.

47. Attempt a violating insert (star rating = 7):
    ```sql
    INSERT INTO Hotel (hotelID, hotelName, street, city, country,
                       starRating, totalRooms, checkInTime, checkOutTime)
    VALUES (99, 'Fake Hotel', '1 Main St', 'Montreal', 'Canada',
            7, 50, '15:00:00', '11:00:00');
    ```
    Expected: **SQL0545N** — The requested operation is not allowed due to check constraint `CHK_STAR_RATING`.

    > **SCREENSHOT CHECK1-VIOLATION** — Capture the INSERT and the SQL0545N error. Label `check1_violation`.

### Check Constraint 2 — Checkout must be after check-in

48. Show the constraint exists:
    ```sql
    SELECT CONSTNAME, TYPE, TEXT
    FROM SYSCAT.CHECKS
    WHERE TABNAME = 'RESERVATION';
    ```

    > **SCREENSHOT CHECK2-DEF** — Capture the constraint definition output. Label `check2_def`.

49. Attempt a violating insert (checkOutDate before checkInDate):
    ```sql
    INSERT INTO Reservation
        (reservationID, checkInDate, checkOutDate, numberOfGuests,
         totalPrice, bookingDate, reservationStatus, customerID)
    VALUES (9001, '2026-05-10', '2026-05-08', 2, 500.00,
            '2026-04-01', 'pending', 1);
    ```
    Expected: **SQL0545N** — check constraint `CHK_DATES`.

    > **SCREENSHOT CHECK2-VIOLATION** — Capture the INSERT and the SQL0545N error. Label `check2_violation`.

---

## PART 11 — Creativity: Window Function Query (Q9)

50. Run the advanced SQL window function query:
    ```sql
    SELECT h.hotelName,
           r.roomNumber,
           r.typeName,
           COUNT(rr.reservationID) AS bookingCount,
           RANK() OVER (
               PARTITION BY r.hotelID
               ORDER BY COUNT(rr.reservationID) DESC
           ) AS demandRank,
           AVG(rr.pricePerNight) AS avgNightlyRate
    FROM Hotel h
    JOIN Room r ON h.hotelID = r.hotelID
    LEFT JOIN ReservationRoom rr ON r.roomID = rr.roomID
    LEFT JOIN Reservation res ON rr.reservationID = res.reservationID
        AND res.checkInDate >= CURRENT DATE - 365 DAYS
    GROUP BY h.hotelName, r.roomNumber, r.typeName, r.hotelID, r.roomID
    ORDER BY h.hotelName, demandRank;
    ```

    > **SCREENSHOT CREATIVITY-WINDOW** — Capture the query and output (truncate if it doesn't fit,
    > but show at least 10 rows). Label `creativity_window`.

---

## PART 12 — Retrieve the Log Files

51. Exit DB2 interactive mode:
    ```
    quit;
    ```
52. Confirm the log files were created:
    ```
    ls -lh ~/project2/*.log
    ```
    You should see `createtbl.log`, `droptbl.log`, `loaddata.log`.

53. View the createtbl log to confirm it looks clean:
    ```
    cat ~/project2/createtbl.log
    ```

    > **SCREENSHOT LOGS** — Capture `ls -lh *.log` and the top portion of `createtbl.log`.
    > Label `logs`.

54. From the **local** IntelliJ terminal tab, download the logs:
    ```
    scp cs421g19@winter2026-comp421.cs.mcgill.ca:~/project2/createtbl.log /Users/kasamix/VSCode/Winter-2026/COMP421/P2/submission/createtbl.log
    scp cs421g19@winter2026-comp421.cs.mcgill.ca:~/project2/droptbl.log   /Users/kasamix/VSCode/Winter-2026/COMP421/P2/submission/droptbl.log
    scp cs421g19@winter2026-comp421.cs.mcgill.ca:~/project2/loaddata.log  /Users/kasamix/VSCode/Winter-2026/COMP421/P2/submission/loaddata.log
    ```

---

## PART 13 — Disconnect and Log Out

55. Back in the SSH terminal, disconnect DB2 (if still connected):
    ```
    db2 -t
    ```
    ```
    connect reset;
    ```
    ```
    quit;
    ```
56. Log out of the server:
    ```
    exit
    ```

---

## PART 14 — Add Screenshots to the Report and Recompile

57. On your local machine, place all screenshots (PNG/JPG) in the submission folder:
    ```
    /Users/kasamix/VSCode/Winter-2026/COMP421/P2/submission/screenshots/
    ```
58. Open `project2.tex` and replace every line that says:
    ```
    \textit{Screenshot placeholder: ...}
    ```
    with an actual `\includegraphics` command, for example:
    ```latex
    \begin{figure}[h]
      \centering
      \includegraphics[width=\linewidth]{screenshots/query1.png}
      \caption{Query 1 output — high-value customers at 5-star hotels}
    \end{figure}
    ```
59. Add `\usepackage{graphicx}` at the top of the `.tex` file if not already present (it is).
60. Recompile the PDF. If `pdflatex` is now available on the server you can compile there:
    ```
    pdflatex project2.tex
    pdflatex project2.tex
    ```
    (Run twice so the table of contents updates.)
    Otherwise use the same local Python approach that was used originally:
    ```
    cd /Users/kasamix/VSCode/Winter-2026/COMP421/P2/submission
    pandoc project2.tex -f latex -t html -o project2.html
    python3 generate_pdf.py
    ```

---

## PART 15 — Final Submission Checklist

Confirm every file below exists in `submission/`:

| File | Required? | Notes |
|------|-----------|-------|
| `createtbl.sql` | YES | All 13 CREATE TABLE statements |
| `createtbl.log` | YES | Downloaded from server in step 54 |
| `droptbl.sql`   | YES | Drops in reverse FK order |
| `droptbl.log`   | YES | Downloaded from server in step 54 |
| `loaddata.sql`  | YES | All INSERT statements |
| `loaddata.log`  | YES | Downloaded from server in step 54 |
| `project2.tex`  | YES | With screenshots filled in |
| `project2.pdf`  | YES | Compiled from the .tex |

Screenshots required in the report (13 total):

| Label | Step | Content |
|-------|------|---------|
| `droptbl_run`       | 16 | ./droptbl.sh output |
| `createtbl_run`     | 18 | ./createtbl.sh output |
| `loaddata_run`      | 24 | ./loaddata.sh output |
| `query1`            | 30 | Q1 SQL + output |
| `query2`            | 31 | Q2 SQL + output |
| `query3`            | 32 | Q3 SQL + output |
| `query4`            | 33 | Q4 SQL + output |
| `query5`            | 34 | Q5 SQL + output |
| `mod1`              | 35 | UPDATE + row count |
| `mod2`              | 38–39 | Both DELETEs + output |
| `view1_create`      | 40 | CREATE VIEW + success |
| `view1_select`      | 41 | SELECT 5 rows |
| `view1_insert`      | 42 | INSERT + SQL0407N error |
| `view2_create`      | 43 | CREATE VIEW + success |
| `view2_select`      | 44 | SELECT 5 rows |
| `view2_insert`      | 45 | INSERT + SQL0150N error |
| `check1_def`        | 46 | SYSCAT.CHECKS for HOTEL |
| `check1_violation`  | 47 | INSERT + SQL0545N error |
| `check2_def`        | 48 | SYSCAT.CHECKS for RESERVATION |
| `check2_violation`  | 49 | INSERT + SQL0545N error |
| `creativity_window` | 50 | RANK() query + output |
| `logs`              | 53 | ls + createtbl.log head |

---

## Troubleshooting

**"FATAL: too many connections for role"**
Close the IntelliJ DB data-source panel completely. Only use the terminal.

**"SQL0204N ... is an undefined name"**
You are not connected. Run `connect to COMP421;` first.

**"SQL0601N ... already exists"**
Tables from a previous run exist. Run `./droptbl.sh` then `./createtbl.sh` again.

**Backspace not working in DB2 interactive mode**
Use `Ctrl+Backspace` instead.

**Long query doesn't fit on one screen**
Resize the IntelliJ terminal to be wider (drag the edge). Use `db2 -t -vz output.txt` to
save output to a file, then `cat output.txt` in sections.

**Need to save a query to a file instead of typing it interactively**
Exit with `quit;`, then run in batch mode:
```
db2 -t -vz query1.log -f query1.sql
```
Then screenshot `cat query1.log`.
