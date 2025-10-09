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
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `link_id` int DEFAULT NULL,
  `is_read` int DEFAULT NULL,
  `created_at` varchar(45) DEFAULT NULL,
  `click_count` int DEFAULT NULL,
  `message` varchar(850) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,1,1,'2025-09-12 11:30:00',3,'Vai, তুমি অনেক ভালো মানুষ। সবসময় humble থাকো।Vai, তুমি অনেক ভালো মানুষ। সবসময় humble থাকো।Vai, তুমি অনেক ভালো মানুষ। সবসময় humble থাকো।Vai, তুমি অনেক ভালো মানুষ। সবসময় humble থাকো।Vai, তুমি অনেক ভালো মানুষ। সবসময় humble থাকো।Vai, তুমি অনেক ভালো মানুষ। সবসময় humble থাকো।Vai, তুমি অনেক ভালো মানুষ। সবসময় humble থাকো।Vai, তুমি অনেক ভালো মানুষ। সবসময় humble থাকো।',1),(2,1,1,'2025-09-13 09:45:00',5,'Emon ভাই, আপনার গানগুলো দারুণ লাগে ?',1),(3,1,0,'2025-09-14 16:20:00',1,'ক্লাসে সবসময় আপনাকে leader মনে হয় ?',1),(4,1,1,'2025-09-15 09:10:00',2,'Apnar handwriting অসাধারণ ✍️',1),(5,1,0,'2025-09-16 18:50:00',4,'তুমি সবসময় positive energy দাও ভাই ✨',1),(6,2,0,'2025-09-14 14:20:00',2,'Shakib, cricket খেলা বন্ধ কইরো না। তুমি inspiration.',NULL),(7,2,1,'2025-09-15 20:10:00',4,'Bro, তুমি তো খুবই talented, carry on!',NULL),(8,2,0,'2025-09-16 12:30:00',3,'Shakib ভাই, আপনি অনেক smart ?',NULL),(9,2,1,'2025-09-17 10:05:00',1,'Friendship never dies ✌️ stay blessed.',NULL),(10,2,0,'2025-09-18 21:45:00',2,'তোমার sense of humor আসলেই অসাধারণ ?',NULL),(11,3,0,'2025-09-08 18:35:00',7,'Bornita apu, class এ আপনি সবসময় smart লাগেন ❤️',3),(12,3,1,'2025-09-10 19:00:00',6,'আপনার smile টা খুব সুন্দর ?',3),(13,3,0,'2025-09-11 13:25:00',2,'আপনি সবসময় teacher দের favorite ?',3),(14,3,1,'2025-09-12 20:10:00',3,'আপনি অনেক helpful nature এর মানুষ ?',3),(15,3,0,'2025-09-13 09:50:00',5,'Class presentation এ আপনার confidence দেখে respect বেড়ে যায়।',3),(16,4,0,'2025-09-09 10:25:00',1,'Mehedi ভাই, আপনার সাথে adda দিলে সময় উড়াই যায়।',NULL),(17,4,1,'2025-09-09 15:55:00',2,'Apni খুব helpful মানুষ, respect for you!',NULL),(18,4,0,'2025-09-11 11:40:00',4,'ভাই, আপনার football খেলা মারাত্মক ⚽',NULL),(19,4,1,'2025-09-12 16:20:00',3,'ভাই, আপনার jokes গুলো সবসময় মজার ?',NULL),(20,4,0,'2025-09-13 18:10:00',6,'Mehedi ভাই, Apnar leadership quality top level ?',NULL),(21,5,0,'2025-09-20 20:30:00',0,'Tanjila, তোমার সাথে কথা বলতে খুব ভালো লাগে।',NULL),(22,5,1,'2025-09-21 10:20:00',2,'তুমি খুবই kind-hearted ?',NULL),(23,5,0,'2025-09-21 19:45:00',1,'তোমার drawings গুলো অসাধারণ ?',NULL),(24,5,1,'2025-09-22 14:15:00',3,'তুমি সবসময় হাসিখুশি থাকো, inspiration ?',NULL),(25,5,0,'2025-09-23 18:40:00',4,'Class এ তোমার voice খুবই সুন্দর ?',NULL),(26,1,0,'2025-09-17 09:25:00',2,'Vai, canteen এ তোমার সাথে cha খাওয়ার মজা অন্যরকম ☕',NULL),(27,2,1,'2025-09-17 20:10:00',1,'তুমি সবসময় support করো, thanks bro ?',NULL),(28,3,0,'2025-09-18 09:15:00',5,'Nusrat apu, group work এ আপনি সবসময় leading করেন ?',NULL),(29,4,1,'2025-09-18 12:30:00',3,'ভাই, exam time এ আপনার notes আমার লাইফ বাঁচায় ?',NULL),(30,5,0,'2025-09-18 21:00:00',6,'তুমি আসলেই একটা ভালো মানুষ ?',NULL),(31,1,1,'2025-09-19 08:40:00',2,'Emon ভাই, আপনি সবসময় inspire করেন ?',NULL),(32,2,0,'2025-09-19 10:20:00',4,'Shakib ভাই, আপনার confidence দারুণ ?',NULL),(33,3,1,'2025-09-19 13:00:00',1,'Apu, তুমি সবসময় motivate করো সবাইকে ?',NULL),(34,4,0,'2025-09-19 16:10:00',5,'Mehedi ভাই, আপনার simplicity অসাধারণ ?',NULL),(35,5,1,'2025-09-19 20:50:00',2,'তুমি অনেক inspiring মানুষ ?',NULL),(36,1,0,'2025-09-20 10:25:00',3,'ভাই, আপনার সাথে football খেলার ইচ্ছা আছে ⚽',NULL),(37,2,1,'2025-09-20 12:40:00',1,'Shakib bro, তোমার smile খুব সুন্দর ?',NULL),(38,3,0,'2025-09-20 15:00:00',2,'Nusrat apu, তুমি খুবই polite ❤️',NULL),(39,4,1,'2025-09-20 17:20:00',3,'ভাই, তোমার vibes সবসময় positive ?',NULL),(40,5,0,'2025-09-20 19:45:00',4,'তুমি অনেক talented, proud of you ?',NULL),(41,1,1,'2025-09-21 09:15:00',2,'Emon ভাই, আপনার future খুব bright দেখতেছি ?',NULL),(42,2,0,'2025-09-21 11:25:00',3,'Shakib ভাই, তোমার বন্ধুত্ব priceless ?',NULL),(43,3,1,'2025-09-21 13:40:00',1,'Apu, class এ সবসময় inspire করো ✨',NULL),(44,4,0,'2025-09-21 16:30:00',2,'ভাই, তোমার dressing sense অসাধারণ ?',NULL),(45,5,1,'2025-09-21 18:55:00',5,'তুমি সবসময় cheerful থাকো ?',NULL);
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
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
