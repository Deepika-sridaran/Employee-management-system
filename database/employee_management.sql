-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: employee_management
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
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
  `attendance_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `attendance_date` date NOT NULL,
  `check_in` time DEFAULT NULL,
  `check_out` time DEFAULT NULL,
  `total_working_hours` decimal(5,2) DEFAULT NULL,
  `status` enum('Present','Absent','Half Day','Leave') NOT NULL DEFAULT 'Present',
  `late_arrival` tinyint(1) NOT NULL DEFAULT '0',
  `early_logout` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`attendance_id`),
  UNIQUE KEY `unique_employee_date` (`employee_id`,`attendance_date`),
  CONSTRAINT `fk_attendance_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
INSERT INTO `attendance` VALUES (1,9,'2026-08-01','09:00:00','18:00:00',8.00,'Present',0,0),(2,10,'2026-08-01','09:15:00','18:00:00',7.75,'Present',1,0),(3,11,'2026-08-01','09:05:00','18:00:00',7.92,'Present',1,0),(4,12,'2026-08-01','09:00:00','17:30:00',7.50,'Present',0,1),(5,13,'2026-08-01',NULL,NULL,0.00,'Absent',0,0),(6,14,'2026-08-01','09:00:00','18:00:00',8.00,'Present',0,0),(7,15,'2026-08-01','09:30:00','18:00:00',7.50,'Present',1,0),(8,17,'2026-08-01','09:00:00','18:00:00',8.00,'Present',0,0),(9,18,'2026-08-01','09:00:00','13:00:00',4.00,'Half Day',0,0),(10,20,'2026-08-01','09:10:00','18:00:00',7.83,'Present',1,0),(11,21,'2026-08-01',NULL,NULL,0.00,'Leave',0,0),(12,22,'2026-08-01','09:00:00','18:00:00',8.00,'Present',0,0),(13,9,'2026-08-02','09:00:00','18:00:00',8.00,'Present',0,0),(14,10,'2026-08-02','09:00:00','18:00:00',8.00,'Present',0,0),(15,11,'2026-08-02',NULL,NULL,0.00,'Leave',0,0),(16,12,'2026-08-02','09:20:00','18:00:00',7.67,'Present',1,0),(17,13,'2026-08-02','09:00:00','18:00:00',8.00,'Present',0,0),(18,14,'2026-08-02','09:00:00','17:00:00',7.00,'Present',0,1),(19,15,'2026-08-02',NULL,NULL,0.00,'Absent',0,0),(20,17,'2026-08-02','09:00:00','18:00:00',8.00,'Present',0,0),(21,18,'2026-08-02','09:00:00','13:00:00',4.00,'Half Day',0,0),(22,20,'2026-08-02','09:00:00','18:00:00',8.00,'Present',0,0),(23,21,'2026-08-02','09:15:00','18:00:00',7.75,'Present',1,0),(24,22,'2026-08-02','09:00:00','18:00:00',8.00,'Present',0,0),(25,9,'2026-08-03','09:10:00','18:00:00',7.83,'Present',1,0),(26,10,'2026-08-03','09:00:00','18:00:00',8.00,'Present',0,0),(27,11,'2026-08-03','09:00:00','17:30:00',7.50,'Present',0,1),(28,12,'2026-08-03','09:00:00','18:00:00',8.00,'Present',0,0),(29,13,'2026-08-03','09:30:00','18:00:00',7.50,'Present',1,0),(30,14,'2026-08-03',NULL,NULL,0.00,'Absent',0,0),(31,15,'2026-08-03','09:00:00','18:00:00',8.00,'Present',0,0),(32,17,'2026-08-03','09:00:00','18:00:00',8.00,'Present',0,0),(33,18,'2026-08-03','09:00:00','18:00:00',8.00,'Present',0,0),(34,20,'2026-08-03','09:20:00','18:00:00',7.67,'Present',1,0),(35,21,'2026-08-03','09:00:00','18:00:00',8.00,'Present',0,0),(36,22,'2026-08-03',NULL,NULL,0.00,'Leave',0,0);
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `department_id` int NOT NULL AUTO_INCREMENT,
  `department_name` varchar(100) NOT NULL,
  PRIMARY KEY (`department_id`),
  UNIQUE KEY `department_name` (`department_name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (3,'Finance'),(2,'Human Resources'),(1,'Information Technology'),(4,'Marketing'),(5,'Operations');
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `employee_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `date_of_joining` date DEFAULT NULL,
  `employee_status` enum('Active','Resigned','Terminated') NOT NULL DEFAULT 'Active',
  `email` varchar(150) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `department_id` int DEFAULT NULL,
  `designation` varchar(100) DEFAULT NULL,
  `salary` decimal(12,2) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `profile_image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`employee_id`),
  UNIQUE KEY `user_id` (`user_id`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_employee_department` (`department_id`),
  CONSTRAINT `fk_employee_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`department_id`),
  CONSTRAINT `fk_employee_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (9,1,'Sathish','Kumar',NULL,NULL,NULL,'Active','sathish.employee@gmail.com','9876543210',1,'Software Developer',45000.00,'Chennai, Tamil Nadu','sathish.jpg','2026-08-07 05:11:47'),(10,2,'Arun','Kumar',NULL,NULL,NULL,'Active','arun.employee@gmail.com','9876543211',1,'Backend Developer',42000.00,'Coimbatore, Tamil Nadu','arun.jpg','2026-08-07 05:11:47'),(11,3,'Priya','Devi',NULL,NULL,NULL,'Active','priya.employee@gmail.com','9876543212',2,'HR Executive',38000.00,'Chennai, Tamil Nadu','priya.jpg','2026-08-07 05:11:47'),(12,4,'Rahul','Raj',NULL,NULL,NULL,'Active','rahul.employee@gmail.com','9876543213',3,'Accountant',40000.00,'Madurai, Tamil Nadu','rahul.jpg','2026-08-07 05:11:47'),(13,5,'Divya','Sharma',NULL,NULL,NULL,'Active','divya.employee@gmail.com','9876543214',4,'Marketing Executive',36000.00,'Bangalore, Karnataka','divya.jpg','2026-08-07 05:11:47'),(14,6,'Karthik','S',NULL,NULL,NULL,'Active','karthik.employee@gmail.com','9876543215',5,'Operations Executive',39000.00,'Chennai, Tamil Nadu','karthik.jpg','2026-08-07 05:11:47'),(15,7,'Anitha','R',NULL,NULL,NULL,'Active','anitha.employee@gmail.com','9876543216',1,'Software Tester',41000.00,'Coimbatore, Tamil Nadu','anitha.jpg','2026-08-07 05:11:47'),(17,8,'Vignesh','Kumar',NULL,NULL,NULL,'Active','vignesh.employee@gmail.com','9876543217',1,'Software Developer',45000.00,'Chennai, Tamil Nadu','vignesh.jpg','2026-08-19 07:11:18'),(18,9,'Arun','Kumar',NULL,NULL,NULL,'Active','arun.kumar.employee@gmail.com','9876543218',2,'HR Executive',38000.00,'Chennai, Tamil Nadu','arun2.jpg','2026-08-19 07:11:18'),(20,11,'Vijay','Raj',NULL,NULL,NULL,'Active','vijay.raj.employee@gmail.com','9876543220',4,'Marketing Executive',40000.00,'Madurai, Tamil Nadu','vijay.jpg','2026-08-19 07:11:18'),(21,12,'Meena','Devi',NULL,NULL,NULL,'Active','meena.devi.employee@gmail.com','9876543221',5,'Operations Manager',48000.00,'Chennai, Tamil Nadu','meena.jpg','2026-08-19 07:11:18'),(22,13,'Rahul','Krishnan',NULL,NULL,NULL,'Active','rahul.krishnan.employee@gmail.com','9876543222',1,'Senior Software Engineer',55000.00,'Bangalore, Karnataka','rahul2.jpg','2026-08-19 07:11:18');
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leaves`
--

DROP TABLE IF EXISTS `leaves`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leaves` (
  `leave_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `leave_type` varchar(50) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `reason` varchar(255) NOT NULL,
  `status` enum('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending',
  `applied_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `rejection_reason` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`leave_id`),
  KEY `fk_leaves_employee` (`employee_id`),
  CONSTRAINT `fk_leaves_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leaves`
--

LOCK TABLES `leaves` WRITE;
/*!40000 ALTER TABLE `leaves` DISABLE KEYS */;
INSERT INTO `leaves` VALUES (6,9,'Sick Leave','2026-08-20','2026-08-20','Not feeling well','Rejected','2026-08-19 07:00:02','Already Taken More Leaves'),(7,10,'Casual Leave','2026-08-21','2026-08-22','Personal work','Approved','2026-08-19 07:00:02',NULL),(8,11,'Annual Leave','2026-08-25','2026-08-27','Family function','Pending','2026-08-19 07:00:02',NULL),(9,12,'Casual Leave','2026-08-10','2026-08-10','Personal work','Rejected','2026-08-19 07:00:02','Leave quota exceeded'),(10,13,'Sick Leave','2026-08-05','2026-08-06','Medical rest','Approved','2026-08-19 07:00:02',NULL),(11,14,'Annual Leave','2026-08-28','2026-08-30','Vacation with family','Pending','2026-08-19 07:00:02',NULL),(12,15,'Casual Leave','2026-08-18','2026-08-18','Personal work','Approved','2026-08-19 07:00:02',NULL),(13,9,'Sick Leave','2026-08-20','2026-08-21','Not feeliing well','Pending','2026-08-19 01:31:47',NULL),(24,17,'Sick Leave','2026-08-19','2026-08-19','Fever and cold','Approved','2026-08-19 07:13:08',NULL),(25,18,'Casual Leave','2026-08-24','2026-08-24','Personal work','Pending','2026-08-19 07:13:08',NULL),(27,20,'Sick Leave','2026-08-26','2026-08-27','Health checkup','Pending','2026-08-19 07:13:08',NULL),(28,21,'Casual Leave','2026-08-29','2026-08-29','Personal commitment','Rejected','2026-08-19 07:13:08','Leave balance is insufficient'),(29,22,'Annual Leave','2026-09-05','2026-09-07','Family function','Pending','2026-08-19 07:13:08',NULL),(30,17,'Casual Leave','2026-09-10','2026-09-10','Personal work','Approved','2026-08-19 07:13:08',NULL),(31,18,'Sick Leave','2026-09-12','2026-09-13','Medical rest','Rejected','2026-08-19 07:13:08','Leave request submitted too late'),(33,20,'Annual Leave','2026-09-20','2026-09-24','Planned vacation','Approved','2026-08-19 07:13:08',NULL),(34,9,'Sick Leave','2026-09-01','2026-09-02','Not feeling well','Pending','2026-08-19 03:23:05',NULL);
/*!40000 ALTER TABLE `leaves` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payroll`
--

DROP TABLE IF EXISTS `payroll`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payroll` (
  `payroll_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `payroll_month` date NOT NULL,
  `basic_salary` decimal(12,2) NOT NULL DEFAULT '0.00',
  `hra` decimal(12,2) NOT NULL DEFAULT '0.00',
  `da` decimal(12,2) NOT NULL DEFAULT '0.00',
  `bonus` decimal(12,2) NOT NULL DEFAULT '0.00',
  `overtime` decimal(12,2) NOT NULL DEFAULT '0.00',
  `pf` decimal(12,2) NOT NULL DEFAULT '0.00',
  `tax` decimal(12,2) NOT NULL DEFAULT '0.00',
  `gross_salary` decimal(12,2) NOT NULL DEFAULT '0.00',
  `net_salary` decimal(12,2) NOT NULL DEFAULT '0.00',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`payroll_id`),
  UNIQUE KEY `unique_employee_payroll_month` (`employee_id`,`payroll_month`),
  CONSTRAINT `fk_payroll_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payroll`
--

LOCK TABLES `payroll` WRITE;
/*!40000 ALTER TABLE `payroll` DISABLE KEYS */;
INSERT INTO `payroll` VALUES (11,9,'2026-01-01',45000.00,9000.00,4500.00,3000.00,1500.00,5400.00,4500.00,63000.00,53100.00,'2026-08-19 15:11:44'),(12,10,'2026-01-01',42000.00,8400.00,4200.00,2500.00,1200.00,5040.00,4000.00,58300.00,49260.00,'2026-08-19 15:11:44'),(13,11,'2026-01-01',38000.00,7600.00,3800.00,2000.00,1000.00,4560.00,3200.00,52400.00,44640.00,'2026-08-19 15:11:44'),(14,12,'2026-01-01',40000.00,8000.00,4000.00,2500.00,1200.00,4800.00,3500.00,55700.00,47400.00,'2026-08-19 15:11:44'),(15,13,'2026-01-01',36000.00,7200.00,3600.00,1800.00,900.00,4320.00,3000.00,49500.00,42180.00,'2026-08-19 15:11:44'),(16,14,'2026-01-01',39000.00,7800.00,3900.00,2200.00,1100.00,4680.00,3300.00,54000.00,46020.00,'2026-08-19 15:11:44'),(17,15,'2026-01-01',41000.00,8200.00,4100.00,2500.00,1300.00,4920.00,3600.00,57100.00,48580.00,'2026-08-19 15:11:44'),(18,17,'2026-01-01',45000.00,9000.00,4500.00,3000.00,1500.00,5400.00,4500.00,63000.00,53100.00,'2026-08-19 15:11:44'),(19,18,'2026-01-01',38000.00,7600.00,3800.00,2000.00,1000.00,4560.00,3200.00,52400.00,44640.00,'2026-08-19 15:11:44'),(20,20,'2026-01-01',40000.00,8000.00,4000.00,2500.00,1200.00,4800.00,3500.00,55700.00,47400.00,'2026-08-19 15:11:44'),(21,21,'2026-01-01',48000.00,9600.00,4800.00,3500.00,1800.00,5760.00,5000.00,67700.00,56940.00,'2026-08-19 15:11:44'),(22,22,'2026-01-01',55000.00,11000.00,5500.00,4000.00,2000.00,6600.00,6000.00,77500.00,64900.00,'2026-08-19 15:11:44');
/*!40000 ALTER TABLE `payroll` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `permission_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `permission_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `total_hours` decimal(5,2) DEFAULT NULL,
  `reason` varchar(255) NOT NULL,
  `status` enum('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending',
  `approved_by` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`permission_id`),
  KEY `fk_permission_employee` (`employee_id`),
  KEY `fk_permission_approver` (`approved_by`),
  CONSTRAINT `fk_permission_approver` FOREIGN KEY (`approved_by`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_permission_employee` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (1,9,'2026-08-04','10:00:00','12:00:00',2.00,'Personal work','Approved',1,'2026-08-19 15:16:27'),(2,10,'2026-08-04','14:00:00','16:00:00',2.00,'Bank work','Pending',NULL,'2026-08-19 15:16:27'),(3,11,'2026-08-05','11:00:00','13:00:00',2.00,'Medical appointment','Approved',2,'2026-08-19 15:16:27'),(4,12,'2026-08-05','15:00:00','17:00:00',2.00,'Family function','Rejected',3,'2026-08-19 15:16:27'),(5,13,'2026-08-06','10:30:00','12:30:00',2.00,'Personal work','Approved',4,'2026-08-19 15:16:27'),(6,14,'2026-08-06','13:00:00','15:00:00',2.00,'Bank appointment','Pending',NULL,'2026-08-19 15:16:27'),(7,15,'2026-08-07','09:30:00','11:30:00',2.00,'College work','Approved',5,'2026-08-19 15:16:27'),(8,17,'2026-08-07','14:00:00','16:30:00',2.50,'Personal appointment','Approved',6,'2026-08-19 15:16:27'),(9,18,'2026-08-08','10:00:00','13:00:00',3.00,'Medical appointment','Pending',NULL,'2026-08-19 15:16:27'),(10,20,'2026-08-08','15:00:00','17:00:00',2.00,'Family emergency','Approved',7,'2026-08-19 15:16:27'),(11,21,'2026-08-10','11:00:00','14:00:00',3.00,'Government office work','Rejected',8,'2026-08-19 15:16:27'),(12,22,'2026-08-10','09:00:00','11:00:00',2.00,'Personal work','Pending',NULL,'2026-08-19 15:16:27');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('Admin','User') NOT NULL DEFAULT 'User',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `profile_image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Sathish Kumar','sathish@gmail.com','$2b$12$WWr1cv38TtskwRjN8c.8w.X7MMK/qc6WMtBsNxJ0ifz3bu8bn6qqa','Admin','2026-08-07 05:08:53',NULL),(2,'Arun Kumar','arun@gmail.com','Arun@123','User','2026-08-07 05:08:53',NULL),(3,'Priya Devi','priya@gmail.com','Priya@123','User','2026-08-07 05:08:53',NULL),(4,'Rahul Raj','rahul@gmail.com','Rahul@123','User','2026-08-07 05:08:53',NULL),(5,'Divya Sharma','divya@gmail.com','Divya@123','User','2026-08-07 05:08:53',NULL),(6,'Karthik S','karthik@gmail.com','Karthik@123','User','2026-08-07 05:08:53',NULL),(7,'Anitha R','anitha@gmail.com','Anitha@123','User','2026-08-07 05:08:53',NULL),(8,'Vignesh Kumar','vignesh@gmail.com','Vignesh@123','User','2026-08-07 05:08:53',NULL),(9,'Arun Kumar','arun.kumar@company.com','arun123','User','2026-08-19 07:09:48','arun.jpg'),(10,'Priya Sharma','priya.sharma@company.com','priya123','User','2026-08-19 07:09:48','priya.jpg'),(11,'Vijay Raj','vijay.raj@company.com','vijay123','User','2026-08-19 07:09:48','vijay.jpg'),(12,'Meena Devi','meena.devi@company.com','meena123','User','2026-08-19 07:09:48','meena.jpg'),(13,'Rahul Krishnan','rahul.krishnan@company.com','rahul123','Admin','2026-08-19 07:09:48','rahul.jpg'),(14,'Test Employee','test.employee@gmail.com','$2b$12$d9YpLfyHNlrZPsuhb3ZppOGI.pNdNgPZW7g7CHmDEHy7XoNbgCpsq','User','2026-08-19 03:27:42',NULL),(15,'Praveen','praveen@gmail.com','$2b$12$mW3z0FGKef/lX4Naf82LE.uj5XICPzr88rBJMAJqEAIGG8PhJrklq','User','2026-08-19 04:55:37',NULL),(16,'Kumar','kumar@gmail.com','$2b$12$jd3b7EqX8P1TEtrM9iIWMuIQ/0U2oSaO6WSBc5nDEZ2RywP8oGhXO','User','2026-08-19 04:57:06',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-19 21:05:41
