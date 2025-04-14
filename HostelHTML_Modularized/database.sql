-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: html
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance` (
  `admission_no` varchar(20) NOT NULL,
  `month` int NOT NULL,
  `year` int NOT NULL,
  `days_present` int DEFAULT '0',
  `status` varchar(20) NOT NULL DEFAULT 'Absent',
  `date` date NOT NULL,
  PRIMARY KEY (`admission_no`,`month`,`year`),
  CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`admission_no`) REFERENCES `hosteller` (`admission_no`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
INSERT INTO `attendance` VALUES ('230654',1,2025,1,'Absent','2025-03-20'),('230654',2,2025,3,'Absent','2025-03-19'),('230654',3,2025,7,'Absent','2025-03-18'),('230654',12,2024,1,'Absent','2025-03-20'),('230665',1,2025,1,'Absent','2025-03-20'),('230665',2,2025,1,'Absent','2025-03-20'),('230665',3,2025,6,'Absent','2025-03-19'),('230665',12,2024,1,'Absent','2025-03-20'),('2801',1,2025,1,'Absent','2025-03-20'),('2801',2,2025,1,'Absent','2025-03-20'),('2801',3,2025,0,'Absent','2025-03-20'),('2801',12,2024,1,'Absent','2025-03-20');
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `before_attendance_insert` BEFORE INSERT ON `attendance` FOR EACH ROW BEGIN
    
    SET NEW.month = IFNULL(NEW.month, MONTH(CURDATE()));  
    SET NEW.year = IFNULL(NEW.year, YEAR(CURDATE()));     
    SET NEW.days_present = 0;  
    SET NEW.status = 'Absent'; 
    SET NEW.date = IFNULL(NEW.date, CURDATE()); 
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_attendance_insert` AFTER INSERT ON `attendance` FOR EACH ROW BEGIN
    
    IF NOT EXISTS (
        SELECT 1 FROM fee 
        WHERE admission_no = NEW.admission_no 
        AND month = NEW.month 
        AND year = NEW.year
    ) THEN
        
        INSERT INTO fee (admission_no, room_no, total_fee, paid_amount, pending_amount, month, year, fee_status) 
        VALUES (NEW.admission_no, 
                (SELECT room_no FROM hosteller WHERE admission_no = NEW.admission_no LIMIT 1), 
                0.00, 
                0.00, 
                0.00, 
                NEW.month, 
                NEW.year, 
                'Unpaid');
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `fee`
--

DROP TABLE IF EXISTS `fee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fee` (
  `fee_id` int NOT NULL AUTO_INCREMENT,
  `admission_no` varchar(50) DEFAULT NULL,
  `room_no` int DEFAULT NULL,
  `total_fee` decimal(10,2) DEFAULT NULL,
  `paid_amount` decimal(10,2) DEFAULT '0.00',
  `pending_amount` decimal(10,2) NOT NULL DEFAULT '0.00',
  `payment_date` date DEFAULT NULL,
  `fee_status` enum('Paid','Unpaid','Partial') DEFAULT 'Unpaid',
  `remarks` varchar(255) DEFAULT NULL,
  `month` int NOT NULL DEFAULT '1',
  `year` int NOT NULL DEFAULT '2000',
  PRIMARY KEY (`fee_id`),
  KEY `fee_ibfk_1` (`admission_no`),
  KEY `idx_month_year` (`month`,`year`),
  CONSTRAINT `fee_ibfk_1` FOREIGN KEY (`admission_no`) REFERENCES `hosteller` (`admission_no`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fee`
--

LOCK TABLES `fee` WRITE;
/*!40000 ALTER TABLE `fee` DISABLE KEYS */;
INSERT INTO `fee` VALUES (53,'230654',NULL,200.00,0.00,200.00,NULL,'Unpaid',NULL,3,2025),(54,'230665',NULL,150.00,150.00,0.00,NULL,'Unpaid',NULL,3,2025),(57,'230654',NULL,250.00,0.00,250.00,NULL,'Unpaid',NULL,3,2025),(58,'230665',NULL,200.00,200.00,0.00,NULL,'Unpaid',NULL,3,2025),(59,'230654',NULL,50.00,0.00,50.00,NULL,'Unpaid',NULL,2,2025),(60,'2801',103,0.00,0.00,0.00,NULL,'Unpaid',NULL,3,2025),(61,'230665',101,0.00,0.00,0.00,NULL,'Unpaid',NULL,2,2025),(62,'2801',103,0.00,0.00,0.00,NULL,'Unpaid',NULL,2,2025),(63,'230654',101,0.00,0.00,0.00,NULL,'Unpaid',NULL,1,2025),(64,'230665',101,0.00,0.00,0.00,NULL,'Unpaid',NULL,1,2025),(65,'2801',103,0.00,0.00,0.00,NULL,'Unpaid',NULL,1,2025),(66,'230654',101,0.00,0.00,0.00,NULL,'Unpaid',NULL,12,2024),(67,'230665',101,0.00,0.00,0.00,NULL,'Unpaid',NULL,12,2024),(68,'2801',103,0.00,0.00,0.00,NULL,'Unpaid',NULL,12,2024),(69,'230654',NULL,350.00,0.00,350.00,NULL,'Unpaid',NULL,3,2025),(70,'230665',NULL,300.00,0.00,300.00,NULL,'Unpaid',NULL,3,2025),(71,'2801',NULL,0.00,0.00,0.00,NULL,'Unpaid',NULL,3,2025),(72,'230654',NULL,150.00,0.00,150.00,NULL,'Unpaid',NULL,2,2025),(73,'230665',NULL,50.00,0.00,50.00,NULL,'Unpaid',NULL,2,2025),(74,'2801',NULL,50.00,50.00,0.00,NULL,'Unpaid',NULL,2,2025);
/*!40000 ALTER TABLE `fee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hosteller`
--

DROP TABLE IF EXISTS `hosteller`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hosteller` (
  `hosteller_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `room_no` int NOT NULL,
  `admission_no` varchar(50) NOT NULL,
  `date_of_admission` date NOT NULL,
  `contact` bigint NOT NULL,
  PRIMARY KEY (`admission_no`),
  UNIQUE KEY `admission_no` (`admission_no`),
  UNIQUE KEY `hosteller_id` (`hosteller_id`),
  KEY `room_no` (`room_no`),
  CONSTRAINT `hosteller_ibfk_1` FOREIGN KEY (`room_no`) REFERENCES `room` (`room_no`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hosteller`
--

LOCK TABLES `hosteller` WRITE;
/*!40000 ALTER TABLE `hosteller` DISABLE KEYS */;
INSERT INTO `hosteller` VALUES (1,'Alan Saji',101,'230654','2025-03-04',5660),(2,'Saji Joseph',101,'230665','2025-03-07',111),(3,'SSS',103,'2801','2025-01-28',2801);
/*!40000 ALTER TABLE `hosteller` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_hosteller_insert` AFTER INSERT ON `hosteller` FOR EACH ROW BEGIN
    DECLARE today DATE;
    DECLARE room_capacity INT;
    DECLARE room_availability INT;

    SET today = CURDATE();

    
    SELECT capacity, availability
    INTO room_capacity, room_availability
    FROM room
    WHERE room_no = NEW.room_no;

    
    IF room_availability > 0 THEN
        
        UPDATE room
        SET availability = availability - 1
        WHERE room_no = NEW.room_no;
        
        
        INSERT INTO attendance (admission_no, status, date)
        VALUES (NEW.admission_no, 'Absent', today);
    ELSE
        
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Room is fully occupied';
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = cp850 */ ;
/*!50003 SET character_set_results = cp850 */ ;
/*!50003 SET collation_connection  = cp850_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_hosteller_delete` AFTER DELETE ON `hosteller` FOR EACH ROW BEGIN
    DECLARE current_availability INT;
    DECLARE room_capacity INT;

    
    SELECT availability INTO current_availability
    FROM Room
    WHERE room_no = OLD.room_no;

    
    SELECT capacity INTO room_capacity
    FROM Room
    WHERE room_no = OLD.room_no;

    
    IF current_availability < room_capacity THEN
        UPDATE Room
        SET availability = availability + 1
        WHERE room_no = OLD.room_no;
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `login`
--

DROP TABLE IF EXISTS `login`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `login` (
  `username` varchar(20) DEFAULT NULL,
  `pwd` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login`
--

LOCK TABLES `login` WRITE;
/*!40000 ALTER TABLE `login` DISABLE KEYS */;
INSERT INTO `login` VALUES ('alan','alan123');
/*!40000 ALTER TABLE `login` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room`
--

DROP TABLE IF EXISTS `room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room` (
  `room_no` int NOT NULL,
  `capacity` int NOT NULL,
  `availability` int NOT NULL,
  PRIMARY KEY (`room_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room`
--

LOCK TABLES `room` WRITE;
/*!40000 ALTER TABLE `room` DISABLE KEYS */;
INSERT INTO `room` VALUES (101,5,3),(102,3,3),(103,5,4),(104,5,5),(105,5,5);
/*!40000 ALTER TABLE `room` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff`
--

DROP TABLE IF EXISTS `staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staff` (
  `staff_id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `role` varchar(50) NOT NULL,
  `salary` decimal(10,2) NOT NULL,
  `date_of_joining` date NOT NULL,
  `contact` bigint NOT NULL,
  PRIMARY KEY (`staff_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff`
--

LOCK TABLES `staff` WRITE;
/*!40000 ALTER TABLE `staff` DISABLE KEYS */;
INSERT INTO `staff` VALUES ('1','q','1',2.00,'2025-03-18',2),('123','Lamine Gavi','Worker',56566.00,'2025-03-05',184569),('5858','XYZ','Worker',22222.00,'2025-03-17',21221);
/*!40000 ALTER TABLE `staff` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-21 17:49:58
