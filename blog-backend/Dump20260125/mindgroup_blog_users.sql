-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: mindgroup_blog
-- ------------------------------------------------------
-- Server version	9.6.0

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
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '0e8d60b8-f879-11f0-b536-00155d697975:1-142';

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `avatar` varchar(2555) DEFAULT NULL,
  `BIO` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Test User','test@example.com','$2b$10$YWKILj0pGjBX0OIeszTdqOuzgIqJ9gJfuaqDyvUyukwKTrqN.I96G',NULL,NULL),(2,'joao','joao@example.com','$2b$10$Ugp5/h699TVF.uqeGhdxNe8S0kHNXuMYP35qfax4hRvNdc7VZyS6i',NULL,NULL),(3,'Nicolas Eduardo Claudio','nicoedu123@gmail.com','$2b$10$hAnB30PeWMBIZtKdyTJE7..PxXjbxJRt4brvDcLtZ14cr4uCmHFKe','1769376448191-3828ae38129a4706e232e804d059ac9e.jpg','eeaaaaaaa'),(4,'John Doe','jhon@gmail.com','$2b$10$hIVs4Xu4/IplZYMMnbsKGuPhjHSReCtkQmZsRp.sxT0.kxDBaNHy6',NULL,NULL),(5,'nick','nick@gmail.com','$2b$10$UN3vyqZ9JnakmdBAMccWquY1/VLlTvDTJTliYQnPFSaqrolFln97W',NULL,NULL),(6,'nicor amorieria amsssee','nicornicolas099@gmail.com','$2b$10$17kPPLaqbch8qpFyIJfZ5.NLXzPLkvgUKXWDk3tvPbaFTi.ywOW/O',NULL,NULL),(7,'irineu meu ','irineu@gmail.com','$2b$10$6CXiwqgY/yjW.st7JY/w4eNcD7IG5Iol41dsUrJnpZIH26s4KH4iW',NULL,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-25 22:44:45
