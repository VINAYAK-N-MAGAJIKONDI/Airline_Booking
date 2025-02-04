CREATE TABLE `Customer` (
  `customerId` int PRIMARY KEY AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `Email` varchar(255) UNIQUE NOT NULL,
  `Password` varchar(255) NOT NULL
);

CREATE TABLE `Airport` (
  `airportCode` varchar(3) PRIMARY KEY,
  `airportName` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL
);

CREATE TABLE `Flight` (
  `flightId` int PRIMARY KEY AUTO_INCREMENT,
  `flightNumber` varchar(10) UNIQUE NOT NULL,
  `departureTime` datetime NOT NULL,
  `arrivalTime` datetime NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `departureAirport` varchar(3) NOT NULL,
  `arrivalAirport` varchar(3) NOT NULL,
  FOREIGN KEY (`departureAirport`) REFERENCES `Airport` (`airportCode`),
  FOREIGN KEY (`arrivalAirport`) REFERENCES `Airport` (`airportCode`)
);

CREATE TABLE `Booking` (
  `bookingId` int PRIMARY KEY AUTO_INCREMENT,
  `bookingDate` date NOT NULL,
  `customerId` int NOT NULL,
  `flightId` int NOT NULL,
  FOREIGN KEY (`customerId`) REFERENCES `Customer` (`customerId`),
  FOREIGN KEY (`flightId`) REFERENCES `Flight` (`flightId`)
);

CREATE TABLE `Seat` (
  `seatId` int PRIMARY KEY AUTO_INCREMENT,
  `seatNumber` varchar(5) NOT NULL,
  `flightId` int NOT NULL,
  `bookingId` int NULL,
  `isAvailable` boolean NOT NULL DEFAULT true,
  FOREIGN KEY (`flightId`) REFERENCES `Flight` (`flightId`),
  FOREIGN KEY (`bookingId`) REFERENCES `Booking` (`bookingId`)
);
