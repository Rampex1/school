-- Include your drop table DDL statements in this file.
-- Make sure to terminate each statement with a semicolon (;)

-- LEAVE this statement on. It is required to connect to your database.
CONNECT TO COMP421;

-- Remember to put the drop table ddls for the tables with foreign key references
--    BEFORE the ddls to drop the parent tables (reverse of the creation order).

-- Drop junction/child tables first
DROP TABLE HotelAmenity;
DROP TABLE Amenity;
DROP TABLE Service;
DROP TABLE Staff;
DROP TABLE Review;
DROP TABLE Payment;
DROP TABLE ReservationRoom;
DROP TABLE Reservation;
DROP TABLE Room;
DROP TABLE RoomType;
DROP TABLE Hotel;
DROP TABLE Customer;
DROP TABLE LoyaltyTier;
