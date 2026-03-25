-- Include your create table DDL statements in this file.
-- Make sure to terminate each statement with a semicolon (;)

-- LEAVE this statement on. It is required to connect to your database.
CONNECT TO COMP421;

-- Remember to put the create table ddls for the tables with foreign key references
--    ONLY AFTER the parent tables have already been created.

-- LoyaltyTier: no foreign key dependencies
CREATE TABLE LoyaltyTier (
    tierName           VARCHAR(20)   NOT NULL,
    pointsThreshold    INTEGER       NOT NULL,
    discountPercentage DECIMAL(5,2)  NOT NULL,
    specialBenefits    VARCHAR(500),
    CONSTRAINT pk_loyaltytier PRIMARY KEY (tierName),
    CONSTRAINT chk_discount CHECK (discountPercentage >= 0 AND discountPercentage <= 100),
    CONSTRAINT chk_points_threshold CHECK (pointsThreshold >= 0)
);

-- Customer: references LoyaltyTier
CREATE TABLE Customer (
    customerID       INTEGER      NOT NULL,
    fName            VARCHAR(50)  NOT NULL,
    lName            VARCHAR(50)  NOT NULL,
    email            VARCHAR(100) NOT NULL,
    phoneNumber      VARCHAR(20),
    dateOfBirth      DATE,
    registrationDate DATE         NOT NULL,
    loyaltyPoints    INTEGER      DEFAULT 0,
    tierName         VARCHAR(20),
    CONSTRAINT pk_customer PRIMARY KEY (customerID),
    CONSTRAINT uq_customer_email UNIQUE (email),
    CONSTRAINT fk_customer_tier FOREIGN KEY (tierName) REFERENCES LoyaltyTier(tierName),
    CONSTRAINT chk_loyalty_points CHECK (loyaltyPoints >= 0)
);

-- Hotel: no foreign key dependencies
CREATE TABLE Hotel (
    hotelID       INTEGER      NOT NULL,
    hotelName     VARCHAR(100) NOT NULL,
    street        VARCHAR(100) NOT NULL,
    city          VARCHAR(50)  NOT NULL,
    stateProvince VARCHAR(50),
    country       VARCHAR(50)  NOT NULL,
    postalCode    VARCHAR(20),
    starRating    INTEGER      NOT NULL,
    phoneNumber   VARCHAR(20),
    email         VARCHAR(100),
    totalRooms    INTEGER      NOT NULL,
    checkInTime   TIME         NOT NULL,
    checkOutTime  TIME         NOT NULL,
    propertyType  VARCHAR(50),
    CONSTRAINT pk_hotel PRIMARY KEY (hotelID),
    CONSTRAINT chk_star_rating CHECK (starRating >= 1 AND starRating <= 5),
    CONSTRAINT chk_total_rooms CHECK (totalRooms > 0)
);

-- RoomType: weak entity, depends on Hotel
CREATE TABLE RoomType (
    hotelID           INTEGER       NOT NULL,
    typeName          VARCHAR(50)   NOT NULL,
    description       VARCHAR(500),
    maxOccupancy      INTEGER       NOT NULL,
    bedConfiguration  VARCHAR(50),
    sizeInSqMeters    DECIMAL(8,2),
    basePricePerNight DECIMAL(10,2) NOT NULL,
    CONSTRAINT pk_roomtype PRIMARY KEY (hotelID, typeName),
    CONSTRAINT fk_roomtype_hotel FOREIGN KEY (hotelID) REFERENCES Hotel(hotelID),
    CONSTRAINT chk_occupancy CHECK (maxOccupancy > 0),
    CONSTRAINT chk_base_price CHECK (basePricePerNight > 0)
);

-- Room: references Hotel and RoomType
CREATE TABLE Room (
    roomID      INTEGER     NOT NULL,
    roomNumber  VARCHAR(10) NOT NULL,
    floorNumber INTEGER,
    roomStatus  VARCHAR(20) NOT NULL,
    hotelID     INTEGER     NOT NULL,
    typeName    VARCHAR(50) NOT NULL,
    CONSTRAINT pk_room PRIMARY KEY (roomID),
    CONSTRAINT fk_room_hotel FOREIGN KEY (hotelID) REFERENCES Hotel(hotelID),
    CONSTRAINT fk_room_roomtype FOREIGN KEY (hotelID, typeName) REFERENCES RoomType(hotelID, typeName),
    CONSTRAINT chk_room_status CHECK (roomStatus IN ('available', 'occupied', 'maintenance', 'out_of_service'))
);

-- Reservation: references Customer
CREATE TABLE Reservation (
    reservationID          INTEGER       NOT NULL,
    checkInDate            DATE          NOT NULL,
    checkOutDate           DATE          NOT NULL,
    numberOfGuests         INTEGER       NOT NULL,
    totalPrice             DECIMAL(12,2) NOT NULL,
    bookingDate            DATE          NOT NULL,
    reservationStatus      VARCHAR(20)   NOT NULL,
    specialRequests        VARCHAR(500),
    cancellationPolicyType VARCHAR(50),
    customerID             INTEGER       NOT NULL,
    CONSTRAINT pk_reservation PRIMARY KEY (reservationID),
    CONSTRAINT fk_reservation_customer FOREIGN KEY (customerID) REFERENCES Customer(customerID),
    CONSTRAINT chk_dates CHECK (checkOutDate > checkInDate),
    CONSTRAINT chk_guests CHECK (numberOfGuests > 0),
    CONSTRAINT chk_res_status CHECK (reservationStatus IN ('confirmed', 'pending', 'cancelled', 'completed', 'checked_in'))
);

-- ReservationRoom: associates reservations with rooms (many-to-many)
CREATE TABLE ReservationRoom (
    reservationID INTEGER       NOT NULL,
    roomID        INTEGER       NOT NULL,
    pricePerNight DECIMAL(10,2) NOT NULL,
    CONSTRAINT pk_reservationroom PRIMARY KEY (reservationID, roomID),
    CONSTRAINT fk_resroom_reservation FOREIGN KEY (reservationID) REFERENCES Reservation(reservationID),
    CONSTRAINT fk_resroom_room FOREIGN KEY (roomID) REFERENCES Room(roomID),
    CONSTRAINT chk_price_per_night CHECK (pricePerNight > 0)
);

-- Payment: references Reservation
CREATE TABLE Payment (
    paymentID     INTEGER       NOT NULL,
    paymentDate   DATE          NOT NULL,
    amount        DECIMAL(12,2) NOT NULL,
    paymentMethod VARCHAR(30)   NOT NULL,
    transactionID VARCHAR(100),
    paymentStatus VARCHAR(20)   NOT NULL,
    reservationID INTEGER       NOT NULL,
    CONSTRAINT pk_payment PRIMARY KEY (paymentID),
    CONSTRAINT fk_payment_reservation FOREIGN KEY (reservationID) REFERENCES Reservation(reservationID),
    CONSTRAINT chk_payment_amount CHECK (amount > 0),
    CONSTRAINT chk_payment_status CHECK (paymentStatus IN ('pending', 'completed', 'failed', 'refunded'))
);

-- Review: references Customer and Hotel
CREATE TABLE Review (
    reviewID             INTEGER       NOT NULL,
    rating               INTEGER       NOT NULL,
    reviewText           VARCHAR(2000),
    reviewDate           DATE          NOT NULL,
    cleanlinessRating    INTEGER,
    locationRating       INTEGER,
    serviceRating        INTEGER,
    valueRating          INTEGER,
    flaggedForModeration CHAR(1)       DEFAULT 'N',
    customerID           INTEGER       NOT NULL,
    hotelID              INTEGER       NOT NULL,
    CONSTRAINT pk_review PRIMARY KEY (reviewID),
    CONSTRAINT fk_review_customer FOREIGN KEY (customerID) REFERENCES Customer(customerID),
    CONSTRAINT fk_review_hotel FOREIGN KEY (hotelID) REFERENCES Hotel(hotelID),
    CONSTRAINT chk_rating CHECK (rating >= 1 AND rating <= 5),
    CONSTRAINT chk_cleanliness CHECK (cleanlinessRating IS NULL OR (cleanlinessRating >= 1 AND cleanlinessRating <= 5)),
    CONSTRAINT chk_location_r CHECK (locationRating IS NULL OR (locationRating >= 1 AND locationRating <= 5)),
    CONSTRAINT chk_service_r CHECK (serviceRating IS NULL OR (serviceRating >= 1 AND serviceRating <= 5)),
    CONSTRAINT chk_value_r CHECK (valueRating IS NULL OR (valueRating >= 1 AND valueRating <= 5)),
    CONSTRAINT chk_flagged CHECK (flaggedForModeration IN ('Y', 'N'))
);

-- Staff: references Hotel
CREATE TABLE Staff (
    staffID          INTEGER       NOT NULL,
    fName            VARCHAR(50)   NOT NULL,
    lName            VARCHAR(50)   NOT NULL,
    email            VARCHAR(100)  NOT NULL,
    phoneNumber      VARCHAR(20),
    hireDate         DATE          NOT NULL,
    salary           DECIMAL(10,2) NOT NULL,
    employmentStatus VARCHAR(20)   NOT NULL,
    hotelID          INTEGER       NOT NULL,
    CONSTRAINT pk_staff PRIMARY KEY (staffID),
    CONSTRAINT uq_staff_email UNIQUE (email),
    CONSTRAINT fk_staff_hotel FOREIGN KEY (hotelID) REFERENCES Hotel(hotelID),
    CONSTRAINT chk_salary CHECK (salary > 0),
    CONSTRAINT chk_emp_status CHECK (employmentStatus IN ('active', 'on_leave', 'terminated'))
);

-- Service: references Hotel
CREATE TABLE Service (
    serviceID          INTEGER       NOT NULL,
    serviceName        VARCHAR(100)  NOT NULL,
    description        VARCHAR(500),
    price              DECIMAL(10,2) NOT NULL,
    durationMinutes    INTEGER,
    availabilityStatus VARCHAR(20)   NOT NULL,
    hotelID            INTEGER       NOT NULL,
    CONSTRAINT pk_service PRIMARY KEY (serviceID),
    CONSTRAINT fk_service_hotel FOREIGN KEY (hotelID) REFERENCES Hotel(hotelID),
    CONSTRAINT chk_service_price CHECK (price >= 0),
    CONSTRAINT chk_service_status CHECK (availabilityStatus IN ('available', 'unavailable'))
);

-- Amenity: no foreign key dependencies
CREATE TABLE Amenity (
    amenityID   INTEGER     NOT NULL,
    amenityName VARCHAR(50) NOT NULL,
    description VARCHAR(300),
    CONSTRAINT pk_amenity PRIMARY KEY (amenityID)
);

-- HotelAmenity: junction table between Hotel and Amenity
CREATE TABLE HotelAmenity (
    hotelID   INTEGER NOT NULL,
    amenityID INTEGER NOT NULL,
    CONSTRAINT pk_hotelamenity PRIMARY KEY (hotelID, amenityID),
    CONSTRAINT fk_ha_hotel FOREIGN KEY (hotelID) REFERENCES Hotel(hotelID),
    CONSTRAINT fk_ha_amenity FOREIGN KEY (amenityID) REFERENCES Amenity(amenityID)
);
