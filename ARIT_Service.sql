-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Dec 27, 2024 at 09:11 AM
-- Server version: 9.1.0
-- PHP Version: 8.2.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ARIT_Service`
--

-- --------------------------------------------------------

--
-- Table structure for table `RepairDocs`
--

CREATE TABLE `RepairDocs` (
  `Repair_ID` int NOT NULL,
  `User_ID` int NOT NULL,
  `Book_ID` int NOT NULL,
  `Bookname` varchar(255) NOT NULL,
  `BookType` varchar(255) NOT NULL,
  `Bookaddress` varchar(225) NOT NULL,
  `Service` varchar(255) NOT NULL,
  `ServiceByName` varchar(255) DEFAULT NULL,
  `ServiceNote` varchar(225) NOT NULL,
  `ServiceDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Status`
--

CREATE TABLE `Status` (
  `Repair_ID` int NOT NULL,
  `Status` int NOT NULL,
  `StatusDate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `StatusType`
--

CREATE TABLE `StatusType` (
  `StatusID` int NOT NULL,
  `StatusName` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `StatusType`
--

INSERT INTO `StatusType` (`StatusID`, `StatusName`) VALUES
(1, 'อยู่ละหว่างรับเรื่อง'),
(2, 'อยู่ระหว่างการซ่อม'),
(3, 'อยู่ระหว่างการดำเนินการ'),
(4, 'หนังสือหายซื้อเล่มเดิมทดแทน'),
(5, 'เตรียมจำหน่ายออก'),
(6, 'จำหน่ายออกแล้ว');

-- --------------------------------------------------------

--
-- Table structure for table `USER`
--

CREATE TABLE `USER` (
  `ID_User` int NOT NULL,
  `Username` varchar(225) NOT NULL,
  `pass` varchar(225) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `USER`
--

INSERT INTO `USER` (`ID_User`, `Username`, `pass`) VALUES
(2, '1234', '$2b$10$TButoGXsZyqCha1VOry0LODrF/xa9AP1wXE.cWrCgDTMULMm/e8AO');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `RepairDocs`
--
ALTER TABLE `RepairDocs`
  ADD PRIMARY KEY (`Repair_ID`),
  ADD KEY `ReparUserID` (`User_ID`);

--
-- Indexes for table `Status`
--
ALTER TABLE `Status`
  ADD KEY `RepairStatus` (`Repair_ID`),
  ADD KEY `StatusTpyeID` (`Status`);

--
-- Indexes for table `StatusType`
--
ALTER TABLE `StatusType`
  ADD PRIMARY KEY (`StatusID`);

--
-- Indexes for table `USER`
--
ALTER TABLE `USER`
  ADD PRIMARY KEY (`ID_User`),
  ADD UNIQUE KEY `Username` (`Username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `USER`
--
ALTER TABLE `USER`
  MODIFY `ID_User` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `RepairDocs`
--
ALTER TABLE `RepairDocs`
  ADD CONSTRAINT `ReparUserID` FOREIGN KEY (`User_ID`) REFERENCES `USER` (`ID_User`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `Status`
--
ALTER TABLE `Status`
  ADD CONSTRAINT `RepairStatus` FOREIGN KEY (`Repair_ID`) REFERENCES `RepairDocs` (`Repair_ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `StatusTpyeID` FOREIGN KEY (`Status`) REFERENCES `StatusType` (`StatusID`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
