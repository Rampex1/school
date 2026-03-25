Overall Feedback
report grading (83/90)

Requirement Analysis: 
(-2) Service booking is not clearly described in requirements, In the ER diagram, Reservation “books” Service is modeled, but the written requirements don’t clearly explain that workflow (what it means to “book” a service: date/time, quantity, whether it is optional, etc.).
ER model:
(-1) Incorrect modelling : LoyaltyTier modeled as a weak entity tied to Customer, tiers (Silver/Gold/Platinum etc..) can exist independently and many customers share them -> should be a strong entity, with Customer referencing it.
(-1) incorrect modelling for weak entity, RoomType definesType to a Hotel + Room belongs to a Hotel + Room isOfType RoomType here, With these three, you need an additional constraint: the Room’s hotel must match the RoomType’s hotel. This is not shown in ER constraints and can cause inconsistent data if not enforced.
(-2) belongsTo is drawn for identifying relationship between weak entity and strong entity with double lined diamond, but both ends are having strong entities. 
Relational Schema: 
(-1) This is wrong - tierName foreign key referencing Customer, it should reference LoyaltyTier(tierName) as tierName is a partial key of the weak entity LoyaltyTier for the owner entity Customer. A foreign key must be a primary key of owner table.


(-1) Overall, Presentation lacked explanation of modelling decisions for weak entity 