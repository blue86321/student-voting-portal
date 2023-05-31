-- MySQL dump 10.13  Distrib 8.0.32, for macos13.0 (arm64)
--
-- Host: localhost    Database: student_voting_portal_java
-- ------------------------------------------------------
-- Server version	8.0.32

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
-- Current Database: `student_voting_portal_java`
--

/*!40000 DROP DATABASE IF EXISTS `student_voting_portal_java`*/;

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `student_voting_portal_java` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `student_voting_portal_java`;

--
-- Table structure for table `candidates`
--

DROP TABLE IF EXISTS `candidates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidates` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `create_time` datetime(6) DEFAULT NULL,
  `update_time` datetime(6) DEFAULT NULL,
  `candidate_name` varchar(255) NOT NULL,
  `candidate_desc` longtext NOT NULL,
  `photo_url` varchar(255) NOT NULL,
  `vote_count` int NOT NULL,
  `elections_id` bigint DEFAULT NULL,
  `positions_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidates`
--

LOCK TABLES `candidates` WRITE;
/*!40000 ALTER TABLE `candidates` DISABLE KEYS */;
INSERT INTO `candidates` VALUES (1,'2023-05-20 19:16:13.814992','2023-05-20 19:42:01.569579','Tim Cook','I like Apple','https://upload.wikimedia.org/wikipedia/commons/e/e1/%D0%A2%D0%B8%D0%BC_%D0%9A%D1%83%D0%BA_%2802-09-2021%29.jpg',3,1,1),(2,'2023-05-20 19:20:29.548349','2023-05-20 19:42:23.011922','Joey Tribbiani','whatever','https://i.guim.co.uk/img/media/513976d50736695ee8bd5014175e007f9980531f/0_289_2980_1788/master/2980.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=77863ec7b2622437668af3ff9ecd7ae6',1,1,1),(3,'2023-05-20 19:23:39.475300','2023-05-20 19:42:23.015220','Shohei Ohtani','Pitcher and designated hitter','https://upload.wikimedia.org/wikipedia/commons/a/a4/Shohei_Ohtani_%2852251723213%29_%28cropped_2%29.jpg',2,1,2),(4,'2023-05-20 19:25:35.517045','2023-05-20 19:42:23.017541','Lionel Messi','desc','https://upload.wikimedia.org/wikipedia/commons/b/b4/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg',4,1,2),(5,'2023-05-20 19:29:07.917116','2023-05-20 19:42:23.020065','Philip Zimbardo','Psychologist, conducted Stanford prison experiment','https://m.media-amazon.com/images/I/A1otGkzWlSL.jpg',4,1,3),(6,'2023-05-20 19:16:13.814992','2023-05-20 19:42:01.569579','Leonardo DiCaprio','I am an actor','https://media.glamourmagazine.co.uk/photos/6138ac3169a8a3323e6d88ff/1:1/w_1280,h_1280,c_limit/Leonardo-DiCaprio-_glamour_10dec13_pa_b.jpg',3,2,4),(7,'2023-05-20 19:16:13.814992','2023-05-20 19:42:01.569579','Will Smith','I am an actor too','https://the1a.org/wp-content/uploads/sites/4/2021/12/Will-Smith-new-headshot-credit-Lorenzo-Agius-e1640093317368-1500x1500.jpg',1,2,4),(8,'2023-05-20 19:16:13.814992','2023-05-20 19:42:01.569579','Taylor Swift','I am an singer','https://upload.wikimedia.org/wikipedia/commons/b/b5/191125_Taylor_Swift_at_the_2019_American_Music_Awards_%28cropped%29.png',0,3,5),(9,'2023-05-20 19:16:13.814992','2023-05-20 19:42:01.569579','Stephen Curry','I am an basketball player','https://upload.wikimedia.org/wikipedia/commons/3/36/Stephen_Curry_dribbling_2016_%28cropped%29.jpg',0,3,5);
/*!40000 ALTER TABLE `candidates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `elections`
--

DROP TABLE IF EXISTS `elections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `elections` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `create_time` datetime(6) DEFAULT NULL,
  `update_time` datetime(6) DEFAULT NULL,
  `election_name` varchar(255) NOT NULL,
  `election_desc` longtext NOT NULL,
  `start_time` datetime(6) NOT NULL,
  `end_time` datetime(6) NOT NULL,
  `university_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `elections`
--

LOCK TABLES `elections` WRITE;
/*!40000 ALTER TABLE `elections` DISABLE KEYS */;
INSERT INTO `elections` VALUES (1,'2023-05-20 18:56:55.679171','2023-05-20 18:56:55.679211','SCU student club election','election for SCU student club','2023-05-20 12:00:00.000000','2023-06-20 12:00:00.000000',1),(2,'2023-05-20 18:56:55.679171','2023-05-20 18:56:55.679211','SCU student council election','election for SCU student council','2023-05-20 12:00:00.000000','2023-05-25 12:00:00.000000',1),(3,'2023-05-20 18:56:55.679171','2023-05-20 18:56:55.679211','SCU future election test','election for SCU future election','2023-09-01 12:00:00.000000','2023-09-20 12:00:00.000000',1);
/*!40000 ALTER TABLE `elections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `positions`
--

DROP TABLE IF EXISTS `positions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `positions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `create_time` datetime(6) DEFAULT NULL,
  `update_time` datetime(6) DEFAULT NULL,
  `position_name` varchar(255) NOT NULL,
  `position_desc` longtext NOT NULL,
  `max_votes_total` int NOT NULL,
  `max_votes_per_candidate` int NOT NULL,
  `elections_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `positions`
--

LOCK TABLES `positions` WRITE;
/*!40000 ALTER TABLE `positions` DISABLE KEYS */;
INSERT INTO `positions` VALUES (1,'2023-05-20 19:10:43.463524','2023-05-20 19:10:43.463568','President','SCU student club president',1,1,1),(2,'2023-05-20 19:12:06.842052','2023-05-20 19:12:06.842134','Sport team representative','Sport team representative of SCU student club',2,1,1),(3,'2023-05-20 19:12:33.836464','2023-05-20 19:12:33.836508','Research team representative','Research team representative of SCU student club',1,1,1),(4,'2023-05-20 19:10:43.463524','2023-05-20 19:10:43.463568','Student Council President','SCU student council president',1,1,2),(5,'2023-05-20 19:10:43.463524','2023-05-20 19:10:43.463568','Test Position','SCU future election test position',1,1,3);
/*!40000 ALTER TABLE `positions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `university`
--

DROP TABLE IF EXISTS `university`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `university` (
  `create_time` datetime(6) DEFAULT NULL,
  `update_time` datetime(6) DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `university`
--

LOCK TABLES `university` WRITE;
/*!40000 ALTER TABLE `university` DISABLE KEYS */;
INSERT INTO `university` VALUES ('2023-05-20 18:39:44.877350','2023-05-20 18:39:44.877442',1,'Santa Clara University'),('2023-05-20 18:41:23.303387','2023-05-20 18:41:23.303408',2,'San Jose State University');
/*!40000 ALTER TABLE `university` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `password` varchar(255) NOT NULL,
  `superuser` bit(1) NOT NULL,
  `staff` bit(1) NOT NULL,
  `create_time` datetime(6) DEFAULT NULL,
  `update_time` datetime(6) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `dob` date NOT NULL,
  `university_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'$2a$10$V8fYPg1ahNRYXahtAjNlROiTfU7LQ/i99IHR7nZvb7sFTa1wSpNAy',_binary '\1',_binary '\1','2023-05-20 18:39:45.017082','2023-05-20 18:39:45.017098','super@gmail.com','2000-01-01',1),(2,'$2a$10$.kYZiDwTvk70qKjbVS2kZOAzYRd/zRxSh3kc2znXGuhQRytAzm9.6',_binary '\0',_binary '\1','2023-05-20 18:41:08.265612','2023-05-20 18:41:08.265634','admin@scu.edu','2000-12-20',1),(3,'$2a$10$iWHEnh.dZ9Fp.zGFyCSeeuJ5mc.uBSk5VcoNxdAnYAOJwNRIXCxJu',_binary '\0',_binary '\1','2023-05-20 18:42:10.151258','2023-05-20 18:42:10.151276','admin@sjsu.edu','1995-01-01',2),(4,'$2a$10$fnX/fzycrqJlckCf4jRyrOzLxBaUm7tnBlkRNGbVuftwWJlsC/Xxm',_binary '\0',_binary '\0','2023-05-20 18:50:36.095291','2023-05-20 18:50:36.095316','user1@scu.edu','1995-01-01',1),(5,'$2a$10$2i8qbvUeJQ1ZcC1cpYyEBOtPtz7dzQN1HXxvMtMCAb6f2wNBf1ODm',_binary '\0',_binary '\0','2023-05-20 18:51:00.366936','2023-05-20 18:51:00.366963','user2@scu.edu','2000-01-19',1),(6,'$2a$10$Zo04DS96dZOj0BTzQQsL/uWO3bGNVffsntNimRWEUjUFkHFvs5b2m',_binary '\0',_binary '\0','2023-05-20 18:51:16.175770','2023-05-20 18:51:16.175798','user3@scu.edu','2000-01-19',1),(7,'$2a$10$vT3o7N4cdiK011nmc4LsDeXYfI.uyatOhAYRKh3kEz05UkBCXNBQa',_binary '\0',_binary '\0','2023-05-20 18:51:33.802788','2023-05-20 18:51:33.802819','user4@scu.edu','2000-01-19',1),(8,'$2a$10$OI5BR1uCXvc.2ViNoJEASOcSsPwBA8JBE5CdrNdEV/FSqIuv31rHS',_binary '\0',_binary '\0','2023-05-20 18:51:46.918366','2023-05-20 18:51:46.918390','user5@scu.edu','2000-01-19',1),(9,'$2a$10$jFBzrCs61GWpg5HC10lPS.GS9VL/WXneMoLYP9ydj0AdVPyV4hRfG',_binary '\0',_binary '\0','2023-05-20 18:52:31.623202','2023-05-20 18:52:31.623231','user1@sjsu.edu','2000-01-19',2),(10,'$2a$10$0FqXoRVU7wXPzPT1bEWqHeAhxucyIV2kRtTD9EeypNZK7/AQBuLlq',_binary '\0',_binary '\0','2023-05-20 18:52:46.319871','2023-05-20 18:52:46.319898','user2@sjsu.edu','2000-01-19',2),(12,'$2a$10$lfZlQPbEuG0y8iEt7dLypOUe9Gxf4sBjAbTpTBC1WgP4B8Z5KCF9q',_binary '\0',_binary '\0','2023-05-20 19:29:49.987694','2023-05-20 19:29:49.987725','user6@scu.edu','2001-06-20',1),(13,'$2a$10$Syd171RRAZ0B0/Oc22bLiOb0.xcnb9Xgo5QaBymu67CEUPxwgE34a',_binary '\0',_binary '\0','2023-05-20 19:29:59.255833','2023-05-20 19:29:59.255859','user7@scu.edu','2001-06-20',1),(14,'$2a$10$Ndn39JD5exzrSBb0vk5PDOhbsk96vI9.py1E8jPPqkyWfT52wQqQq',_binary '\0',_binary '\0','2023-05-20 19:30:09.368635','2023-05-20 19:30:09.368660','user8@scu.edu','2001-06-20',1),(15,'$2a$10$/L8DTz35b5pIN4E9MieaGuRg9KqzQTb4E/nLP4ho.uJguZfXlbwKG',_binary '\0',_binary '\0','2023-05-20 19:30:17.612951','2023-05-20 19:30:17.612978','user9@scu.edu','2001-06-20',1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `votes`
--

DROP TABLE IF EXISTS `votes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `votes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `create_time` datetime(6) DEFAULT NULL,
  `update_time` datetime(6) DEFAULT NULL,
  `vote_count` int NOT NULL,
  `candidates_id` bigint DEFAULT NULL,
  `elections_id` bigint DEFAULT NULL,
  `positions_id` bigint DEFAULT NULL,
  `users_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `votes`
--

LOCK TABLES `votes` WRITE;
/*!40000 ALTER TABLE `votes` DISABLE KEYS */;
INSERT INTO `votes` VALUES (1,'2023-05-20 19:38:53.725781','2023-05-20 19:38:53.725809',1,1,1,1,12),(2,'2023-05-20 19:38:53.728061','2023-05-20 19:38:53.728096',1,3,1,2,12),(3,'2023-05-20 19:38:53.730501','2023-05-20 19:38:53.730534',1,4,1,2,12),(4,'2023-05-20 19:38:53.732951','2023-05-20 19:38:53.732984',1,5,1,3,12),(5,'2023-05-20 19:41:02.115594','2023-05-20 19:41:02.115655',1,1,1,1,13),(6,'2023-05-20 19:41:02.118932','2023-05-20 19:41:02.118989',1,4,1,2,13),(7,'2023-05-20 19:41:02.122869','2023-05-20 19:41:02.122938',1,5,1,3,13),(8,'2023-05-20 19:42:01.571544','2023-05-20 19:42:01.571583',1,1,1,1,14),(9,'2023-05-20 19:42:01.573987','2023-05-20 19:42:01.574022',1,4,1,2,14),(10,'2023-05-20 19:42:01.576537','2023-05-20 19:42:01.576577',1,5,1,3,14),(11,'2023-05-20 19:42:23.014260','2023-05-20 19:42:23.014301',1,2,1,1,15),(12,'2023-05-20 19:42:23.016814','2023-05-20 19:42:23.016848',1,3,1,2,15),(13,'2023-05-20 19:42:23.019156','2023-05-20 19:42:23.019189',1,4,1,2,15),(14,'2023-05-20 19:42:23.021832','2023-05-20 19:42:23.021865',1,5,1,3,15),(15,'2023-05-21 19:38:53.725781','2023-05-21 19:38:53.725809',1,6,2,4,4),(16,'2023-05-21 19:38:53.725781','2023-05-21 19:38:53.725809',1,6,2,4,5),(17,'2023-05-21 19:38:53.725781','2023-05-21 19:38:53.725809',1,6,2,4,6),(18,'2023-05-21 19:38:53.725781','2023-05-21 19:38:53.725809',1,7,2,4,7);
/*!40000 ALTER TABLE `votes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-05-22 23:41:45
