# COMP-421 Project 2 — Presentation Script
**Group 19 | Hotel Booking Platform | ~10 minutes**

Speaker order: **David Vo → David Zhou → David Namgung → Jessie Maeda-Yang**
Report section order: Schema → Queries → Modifications → Views → Constraints → Creativity

---

## Slide 1 — Title & Overview
**Speaker: David Vo | ~0:45**

> "Hi everyone, we're Group 19. Our project is a **Hotel Booking Platform** database built and queried in DB2 on the McGill server. The system models the full lifecycle of hotel operations — customers, rooms, reservations, payments, reviews, staff, and amenities."

> "I'll cover the schema and design decisions, then David Zhou walks through our SQL queries, David Namgung covers views and check constraints, and Jessie wraps up with data loading and our creativity section."

**Slide content:**
- Project 2: Hotel Booking Platform
- Group 19 — David Vo · David Zhou · David Namgung · Jessie Maeda-Yang
- DB2 on `winter2026-comp421.cs.mcgill.ca`
- 13 tables · 5 Canadian hotels · 100 customers

---

## Slide 2 — Relational Schema
**Speaker: David Vo | ~1:30**

> "Our schema has **13 tables**. The core flow is: a Customer makes a Reservation, which links to Rooms through a junction table ReservationRoom, and is settled by Payment."

> "Two key design decisions worth highlighting. First — `RoomType` has a **composite PK** `(hotelID, typeName)`, and `Room` holds that same composite as a foreign key. This structurally guarantees a room's hotel always matches its room type's hotel — no extra constraint needed."

> "Second — `LoyaltyTier` is a **strong entity** with its own PK `tierName`. Tiers like Bronze, Gold, and Platinum exist independently. `Customer.tierName` is a FK into `LoyaltyTier` — this was a correction from P1 feedback."

> "We also listed **4 pending constraints** that DB2 cannot express as single-tuple CHECKs — for example, preventing double-booking requires comparing date ranges across multiple rows in Reservation joined with ReservationRoom."

**Slide content:**
```
LoyaltyTier ←── Customer ──→ Reservation ──→ ReservationRoom ──→ Room ──→ RoomType
                                    │                                         │
                                 Payment                                    Hotel
                                 Review                                     Staff · Service
                                                                            Amenity · HotelAmenity
```
- Composite FK on `Room(hotelID, typeName)` enforces hotel consistency structurally
- P1 fix: LoyaltyTier → strong entity; Customer.tierName FK corrected
- 4 pending constraints: no double-booking, loyalty points consistency, cross-hotel room, service-hotel match

---

## Slide 3 — SQL Queries
**Speaker: David Zhou | ~2:00**

> "I'll highlight two of our five select queries that best show the complexity we aimed for."

---

### Query 4 — Loyalty Tier Mismatch Detection

> "This query finds **Bronze or Silver customers who out-spend the average Platinum customer** — identifying candidates for tier upgrades."

> "It uses two CTEs. `CustomerSpend` computes each customer's total completed payments using `LEFT JOIN` and `COALESCE` to safely handle customers with zero payments. `PlatinumAvg` computes the benchmark. The outer query filters with a scalar subquery comparing each low-tier customer's spend against that benchmark."

**Slide content:**
```sql
WITH CustomerSpend AS (
    SELECT c.customerID, c.tierName,
           COALESCE(SUM(p.amount), 0) AS totalSpent
    FROM Customer c
    LEFT JOIN Reservation res ON c.customerID = res.customerID
    LEFT JOIN Payment p ON res.reservationID = p.reservationID
               AND p.paymentStatus = 'completed'
    GROUP BY c.customerID, c.fName, c.lName, c.tierName, c.loyaltyPoints
),
PlatinumAvg AS (SELECT AVG(totalSpent) AS platAvg FROM CustomerSpend WHERE tierName = 'Platinum')
SELECT ... FROM CustomerSpend cs
WHERE cs.tierName IN ('Bronze', 'Silver')
  AND cs.totalSpent > (SELECT platAvg FROM PlatinumAvg);
```
- 2 CTEs · LEFT JOIN · scalar subquery · COALESCE null-safe aggregation · 4 tables

---

### Query 5 — Peak Revenue Month per City

> "This query finds, for each city, the **month with highest booking revenue** and compares it against the city's annual average — useful for staffing and pricing adjustments."

> "Four CTEs chain together: deduplicate reservations by city, aggregate monthly revenue, compute city-year averages, then apply `RANK() OVER (PARTITION BY city, year ORDER BY revenue DESC)`. The final WHERE keeps only rank-1 rows — the peak month per city."

**Slide content:**
```sql
RankedMonths AS (
    SELECT mr.city, mr.bookingYear, mr.bookingMonth, mr.monthlyRevenue,
           ca.avgMonthlyRevenue,
           RANK() OVER (
               PARTITION BY mr.city, mr.bookingYear
               ORDER BY mr.monthlyRevenue DESC
           ) AS revenueRank
    FROM MonthlyRevenue mr JOIN CityAnnualAvg ca ON mr.city = ca.city ...
)
SELECT ... FROM RankedMonths WHERE revenueRank = 1;
```
- 4 CTEs · RANK() window function · 4-table join chain · seasonal peak detection

---

## Slide 4 — SQL Modifications
**Speaker: David Zhou | ~1:00**

> "We also wrote two non-trivial modification queries."

> "**Modification 1** does a batch tier reassignment — a single `UPDATE` with a correlated `CASE` expression that re-evaluates every customer's spend against the \$1k/\$5k/\$10k thresholds. All tiers are updated in one statement."

> "**Modification 2** is a two-step cascading delete. We first delete from `ReservationRoom` (child), then from `Reservation` (parent), targeting only stale pending bookings older than 30 days with no completed payment. The `NOT EXISTS` subquery is what makes it non-trivial — it safely avoids deleting reservations that have any payment activity."

**Slide content:**
```sql
-- Mod 1: correlated CASE subquery batch update
UPDATE Customer SET tierName = CASE
    WHEN (SELECT COALESCE(SUM(p.amount),0) FROM ...) >= 10000 THEN 'Platinum'
    WHEN ... >= 5000 THEN 'Gold'
    WHEN ... >= 1000 THEN 'Silver'
    ELSE 'Bronze' END
WHERE customerID IN (SELECT DISTINCT res.customerID FROM ...);

-- Mod 2: cascading delete with NOT EXISTS guard
DELETE FROM ReservationRoom WHERE reservationID IN (
    SELECT res.reservationID FROM Reservation res
    WHERE res.reservationStatus = 'pending'
      AND res.bookingDate < CURRENT DATE - 30 DAYS
      AND NOT EXISTS (SELECT 1 FROM Payment p WHERE ... AND p.paymentStatus = 'completed')
);
```
- Mod 1: correlated subquery `CASE` — upgrades/downgrades all customer tiers at once
- Mod 2: `NOT EXISTS` + date arithmetic — safe cascading delete of stale bookings

---

## Slide 5 — Views
**Speaker: David Namgung | ~1:30**

> "I implemented the two views. We intentionally chose one simple and one complex to contrast DB2's insertability rules."

---

### View 1 — HotelSummary (Simple, Single-Table)

> "`HotelSummary` selects 6 columns from the single `Hotel` base table — DB2 classifies it as theoretically insertable."

> "But when we actually tried to insert, DB2 returned **SQL0407N** — columns like `street`, `country`, and `checkInTime` are `NOT NULL` in the base table but absent from the view. DB2 has no default to fill them, so the insert is rejected at the base table level — not a view-level restriction."

**Slide content:**
- `CREATE VIEW HotelSummary AS SELECT hotelID, hotelName, city, starRating, totalRooms, propertyType FROM Hotel`
- Theoretically insertable (single base table) → INSERT fails SQL0407N: NOT NULL base columns missing from view

---

### View 2 — ActiveReservationDetails (Complex, 6-Table Join)

> "`ActiveReservationDetails` joins Reservation, Customer, ReservationRoom, Room, Hotel, and Payment — filtered to confirmed or checked-in status."

> "Inserting returns **SQL0150N: view is not insertable** — when a view definition contains a JOIN, DB2 cannot determine which underlying table should receive each column. This is a hard DB2 rule for multi-table join views."

**Slide content:**
- 6-table JOIN view filtered to `reservationStatus IN ('confirmed', 'checked_in')`
- INSERT fails SQL0150N: join views are never insertable in DB2 — DB2 cannot resolve target table per column

---

## Slide 6 — Check Constraints
**Speaker: David Namgung | ~1:00**

> "We defined two check constraints directly in `CREATE TABLE`."

> "`chk_star_rating` on Hotel enforces `starRating` between 1 and 5 — inserting `starRating = 7` triggers **SQL0545N**. We confirmed the constraint exists in `SYSCAT.CHECKS`."

> "`chk_dates` on Reservation enforces `checkOutDate > checkInDate`. A checkout before check-in is logically impossible — it would corrupt pricing and availability calculations. Inserting a reversed date pair also triggers **SQL0545N**."

**Slide content:**
| Constraint | Table | Rule | Test Insert | Error |
|---|---|---|---|---|
| `chk_star_rating` | Hotel | `starRating >= 1 AND <= 5` | `starRating = 7` | SQL0545N |
| `chk_dates` | Reservation | `checkOutDate > checkInDate` | checkOut before checkIn | SQL0545N |

- Both confirmed in `SYSCAT.CHECKS` before violation testing

---

## Slide 7 — Data Loading & Creativity
**Speaker: Jessie Maeda-Yang | ~1:45**

> "I wrote the data loading and the creativity section."

> "The `Customer` table has **100 records** with realistic French-Canadian and English-Canadian names, authentic phone area codes — 514/438 for Montreal, 418 for Quebec City, 416 for Toronto — and loyalty points verified against tier thresholds. No placeholder values like 'customer001'."

> "The 5 hotels are Canadian properties — Grand Palais Montreal, Chateau Frontenac Quebec, Toronto Harbor Inn — with real addresses and pricing that reflects the actual Montreal luxury hotel market: Presidential Suite at \$989/night, Budget Single at \$79/night."

> "For the advanced SQL feature, we used **RANK() window function** to rank rooms within each hotel by booking demand over the past year. `RANK() OVER (PARTITION BY hotelID ORDER BY booking count DESC)` resets the ranking per hotel — so rank 1 is the most-booked room in each property independently. This is an OLAP-style query not expressible with GROUP BY alone, and it has a real use case: if a room consistently ranks #1, it can sustain a price increase."

**Slide content:**
- 100 customers: authentic bilingual names, real Canadian area codes, tier-consistent loyalty points
- 5 Canadian hotels: real addresses, market-accurate pricing (\$79–\$989/night)
- Creativity: `RANK() OVER (PARTITION BY hotelID ORDER BY COUNT(reservations) DESC)` — per-hotel room demand ranking
- Use case: pricing optimisation + maintenance scheduling

---

## Slide 8 — Summary & Q&A
**Speaker: Jessie Maeda-Yang | ~0:30**

> "To wrap up: 13 tables with proper FK chains and 4 documented pending constraints, 100 realistic records, 5 complex select queries using CTEs and window functions, 2 modification queries, 2 views demonstrating DB2 insertability rules, and 2 enforced check constraints."

> "Each of us can take questions on our section — thank you."

**Slide content:**
| Section | Highlight |
|---|---|
| Schema | 13 tables · composite FK trick · P1 fixes applied |
| SQL Queries | CTEs · scalar subqueries · RANK() window function |
| Modifications | Correlated CASE UPDATE · NOT EXISTS cascading DELETE |
| Views | SQL0407N (simple) vs SQL0150N (complex join) |
| Check Constraints | `chk_star_rating` · `chk_dates` · SQL0545N confirmed |
| Creativity | 100 real-world records · OLAP RANK() analysis |

**Thank you — Questions?**

---

## Timing Guide

| Slide | Speaker | Time |
|---|---|---|
| 1. Title & Overview | **David Vo** | 0:45 |
| 2. Relational Schema | **David Vo** | 1:30 |
| 3. SQL Queries | **David Zhou** | 2:00 |
| 4. SQL Modifications | **David Zhou** | 1:00 |
| 5. Views | **David Namgung** | 1:30 |
| 6. Check Constraints | **David Namgung** | 1:00 |
| 7. Data Loading & Creativity | **Jessie Maeda-Yang** | 1:45 |
| 8. Summary & Q&A | **Jessie Maeda-Yang** | 0:30 |
| **Total** | | **~10:00** |
