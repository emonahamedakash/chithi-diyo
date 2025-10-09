-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: chithi_diyo
-- ------------------------------------------------------
-- Server version	8.0.43

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
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `password` varchar(45) DEFAULT NULL,
  `role` int DEFAULT '0' COMMENT '0=pending, 1=admin, 2=user',
  `social_auth` varchar(45) DEFAULT NULL,
  `created_at` varchar(45) DEFAULT NULL,
  `updated_at` varchar(45) DEFAULT NULL,
  `token` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Emon Ahamed','test@gmail.com','1234',2,'google','2025-09-01 10:15:00','2025-09-10 09:12:00','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6MiwiaWF0IjoxNzYwMDI0MjM4fQ.kvtwbhtZsqh6gO925jzbnWUZHTdcJRJIKxe5rp5WPfU'),(2,'Shakib Hasan','shakibhasan@example.com','shakib123',2,NULL,'2025-09-05 12:45:00','2025-09-12 14:10:00',NULL),(3,'Nishat Zaman Bornita','bornita@gmail.com','1234',2,'facebook','2025-08-28 08:30:00','2025-09-10 17:40:00','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6MiwiaWF0IjoxNzYwMDA0MTc1fQ.rt1GATqHTPLtA8uiSGnT3W6XbjxwAO78qQxTg1UFCj8'),(4,'Mehedi Rahman','mehedirahman@example.com','mehedi789',2,NULL,'2025-09-03 20:25:00','2025-09-09 11:05:00',NULL),(5,'Tanjila Akter','tanjilaakter@example.com','tanjila999',0,NULL,'2025-09-15 09:00:00','2025-09-20 18:15:00',NULL),(6,'test2','test2@gmail.com','1234',0,NULL,'2025-10-06 14:25:33.562',NULL,NULL),(7,'test3','test3@gmail.com','1234',0,NULL,'2025-10-06 14:27:52.754',NULL,NULL),(8,'test','test4@gmail.com','1234',0,NULL,'2025-10-06 14:29:28.094',NULL,NULL),(9,'test','emonahamedakash@gmail.com','123',0,NULL,'2025-10-06 17:43:04.064',NULL,NULL),(10,'test','test5@gmail.com','1234',0,NULL,'2025-10-09 14:59:21.237',NULL,NULL),(11,'test','test6@gmail.com','1234',0,NULL,'2025-10-09 15:01:19.217',NULL,NULL),(12,'test','test7@gmail.com','1234',0,NULL,'2025-10-09 15:01:33.220',NULL,NULL),(13,'test','test8@gmail.com','1234',0,NULL,'2025-10-09 15:01:42.531',NULL,NULL),(14,'test','test9@gmail.com','1234',0,NULL,'2025-10-09 15:02:10.285',NULL,NULL);
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

-- Dump completed on 2025-10-10  2:45:42
