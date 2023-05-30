-- MySQL dump 10.13  Distrib 8.0.32, for macos13.0 (arm64)
--
-- Host: localhost    Database: student_voting_portal_py
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
-- Current Database: `student_voting_portal_py`
--

/*!40000 DROP DATABASE IF EXISTS `student_voting_portal_py`*/;

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `student_voting_portal_py` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `student_voting_portal_py`;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add content type',4,'add_contenttype'),(14,'Can change content type',4,'change_contenttype'),(15,'Can delete content type',4,'delete_contenttype'),(16,'Can view content type',4,'view_contenttype'),(17,'Can add session',5,'add_session'),(18,'Can change session',5,'change_session'),(19,'Can delete session',5,'delete_session'),(20,'Can view session',5,'view_session'),(21,'Can add university',6,'add_university'),(22,'Can change university',6,'change_university'),(23,'Can delete university',6,'delete_university'),(24,'Can view university',6,'view_university'),(25,'Can add user',7,'add_user'),(26,'Can change user',7,'change_user'),(27,'Can delete user',7,'delete_user'),(28,'Can view user',7,'view_user'),(29,'Can add candidate',8,'add_candidate'),(30,'Can change candidate',8,'change_candidate'),(31,'Can delete candidate',8,'delete_candidate'),(32,'Can view candidate',8,'view_candidate'),(33,'Can add election',9,'add_election'),(34,'Can change election',9,'change_election'),(35,'Can delete election',9,'delete_election'),(36,'Can view election',9,'view_election'),(37,'Can add position',10,'add_position'),(38,'Can change position',10,'change_position'),(39,'Can delete position',10,'delete_position'),(40,'Can view position',10,'view_position'),(41,'Can add vote',11,'add_vote'),(42,'Can change vote',11,'change_vote'),(43,'Can delete vote',11,'delete_vote'),(44,'Can view vote',11,'view_vote');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_users_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users_user` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(3,'auth','group'),(2,'auth','permission'),(4,'contenttypes','contenttype'),(8,'elections','candidate'),(9,'elections','election'),(10,'elections','position'),(11,'elections','vote'),(5,'sessions','session'),(6,'users','university'),(7,'users','user');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2023-05-20 18:39:31.770240'),(2,'contenttypes','0002_remove_content_type_name','2023-05-20 18:39:31.780226'),(3,'auth','0001_initial','2023-05-20 18:39:31.822462'),(4,'auth','0002_alter_permission_name_max_length','2023-05-20 18:39:31.832785'),(5,'auth','0003_alter_user_email_max_length','2023-05-20 18:39:31.835220'),(6,'auth','0004_alter_user_username_opts','2023-05-20 18:39:31.837202'),(7,'auth','0005_alter_user_last_login_null','2023-05-20 18:39:31.839109'),(8,'auth','0006_require_contenttypes_0002','2023-05-20 18:39:31.839798'),(9,'auth','0007_alter_validators_add_error_messages','2023-05-20 18:39:31.841648'),(10,'auth','0008_alter_user_username_max_length','2023-05-20 18:39:31.843771'),(11,'auth','0009_alter_user_last_name_max_length','2023-05-20 18:39:31.846680'),(12,'auth','0010_alter_group_name_max_length','2023-05-20 18:39:31.851466'),(13,'auth','0011_update_proxy_permissions','2023-05-20 18:39:31.854335'),(14,'auth','0012_alter_user_first_name_max_length','2023-05-20 18:39:31.856293'),(15,'users','0001_initial','2023-05-20 18:39:31.908953'),(16,'admin','0001_initial','2023-05-20 18:39:31.929985'),(17,'admin','0002_logentry_remove_auto_add','2023-05-20 18:39:31.932771'),(18,'admin','0003_logentry_add_action_flag_choices','2023-05-20 18:39:31.935493'),(19,'elections','0001_initial','2023-05-20 18:39:31.971465'),(20,'elections','0002_initial','2023-05-20 18:39:32.059004'),(21,'sessions','0001_initial','2023-05-20 18:39:32.064853');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `elections_candidate`
--

DROP TABLE IF EXISTS `elections_candidate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `elections_candidate` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `create_time` datetime(6) NOT NULL,
  `update_time` datetime(6) NOT NULL,
  `candidate_name` varchar(255) NOT NULL,
  `candidate_desc` longtext NOT NULL,
  `photo_url` varchar(255) NOT NULL,
  `vote_count` int NOT NULL,
  `election_id` bigint NOT NULL,
  `position_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `elections_candidate_user_id_election_id_posi_5e267b24_uniq` (`user_id`,`election_id`,`position_id`),
  KEY `elections_candidate_election_id_33d20ad1_fk_elections` (`election_id`),
  KEY `elections_candidate_position_id_cd1560ef_fk_elections` (`position_id`),
  CONSTRAINT `elections_candidate_election_id_33d20ad1_fk_elections` FOREIGN KEY (`election_id`) REFERENCES `elections_election` (`id`),
  CONSTRAINT `elections_candidate_position_id_cd1560ef_fk_elections` FOREIGN KEY (`position_id`) REFERENCES `elections_position` (`id`),
  CONSTRAINT `elections_candidate_user_id_d896d39a_fk_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `elections_candidate`
--

LOCK TABLES `elections_candidate` WRITE;
/*!40000 ALTER TABLE `elections_candidate` DISABLE KEYS */;
INSERT INTO `elections_candidate` VALUES (1,'2023-05-20 19:16:13.814992','2023-05-20 19:42:01.569579','Tim Cook','I like Apple','https://upload.wikimedia.org/wikipedia/commons/e/e1/%D0%A2%D0%B8%D0%BC_%D0%9A%D1%83%D0%BA_%2802-09-2021%29.jpg',3,1,1,4),(2,'2023-05-20 19:20:29.548349','2023-05-20 19:42:23.011922','Joey Tribbiani','whatever','https://i.guim.co.uk/img/media/513976d50736695ee8bd5014175e007f9980531f/0_289_2980_1788/master/2980.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=77863ec7b2622437668af3ff9ecd7ae6',1,1,1,5),(3,'2023-05-20 19:23:39.475300','2023-05-20 19:42:23.015220','Shohei Ohtani','Pitcher and designated hitter','https://upload.wikimedia.org/wikipedia/commons/a/a4/Shohei_Ohtani_%2852251723213%29_%28cropped_2%29.jpg',2,1,2,6),(4,'2023-05-20 19:25:35.517045','2023-05-20 19:42:23.017541','Lionel Messi','desc','https://upload.wikimedia.org/wikipedia/commons/b/b4/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg',4,1,2,7),(5,'2023-05-20 19:29:07.917116','2023-05-20 19:42:23.020065','Philip Zimbardo','Psychologist, conducted Stanford prison experiment','https://m.media-amazon.com/images/I/A1otGkzWlSL.jpg',4,1,3,8);
/*!40000 ALTER TABLE `elections_candidate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `elections_election`
--

DROP TABLE IF EXISTS `elections_election`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `elections_election` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `create_time` datetime(6) NOT NULL,
  `update_time` datetime(6) NOT NULL,
  `election_name` varchar(255) NOT NULL,
  `election_desc` longtext NOT NULL,
  `start_time` datetime(6) NOT NULL,
  `end_time` datetime(6) NOT NULL,
  `university_id` smallint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `elections_election_university_id_8dda1a2c_fk_university_id` (`university_id`),
  CONSTRAINT `elections_election_university_id_8dda1a2c_fk_university_id` FOREIGN KEY (`university_id`) REFERENCES `university` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `elections_election`
--

LOCK TABLES `elections_election` WRITE;
/*!40000 ALTER TABLE `elections_election` DISABLE KEYS */;
INSERT INTO `elections_election` VALUES (1,'2023-05-20 18:56:55.679171','2023-05-20 18:56:55.679211','SCU student club president election','election for SCU student club president','2023-05-20 12:00:00.000000','2023-06-20 12:00:00.000000',1);
/*!40000 ALTER TABLE `elections_election` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `elections_position`
--

DROP TABLE IF EXISTS `elections_position`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `elections_position` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `create_time` datetime(6) NOT NULL,
  `update_time` datetime(6) NOT NULL,
  `position_name` varchar(255) NOT NULL,
  `position_desc` longtext NOT NULL,
  `max_votes_total` int NOT NULL,
  `max_votes_per_candidate` int NOT NULL,
  `election_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `elections_position_election_id_41455f87_fk_elections_election_id` (`election_id`),
  CONSTRAINT `elections_position_election_id_41455f87_fk_elections_election_id` FOREIGN KEY (`election_id`) REFERENCES `elections_election` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `elections_position`
--

LOCK TABLES `elections_position` WRITE;
/*!40000 ALTER TABLE `elections_position` DISABLE KEYS */;
INSERT INTO `elections_position` VALUES (1,'2023-05-20 19:10:43.463524','2023-05-20 19:10:43.463568','President','SCU student club president',1,1,1),(2,'2023-05-20 19:12:06.842052','2023-05-20 19:12:06.842134','Sport team representative','Sport team representative of SCU student club',2,1,1),(3,'2023-05-20 19:12:33.836464','2023-05-20 19:12:33.836508','Research team representative','Research team representative of SCU student club',1,1,1);
/*!40000 ALTER TABLE `elections_position` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `elections_vote`
--

DROP TABLE IF EXISTS `elections_vote`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `elections_vote` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `create_time` datetime(6) NOT NULL,
  `update_time` datetime(6) NOT NULL,
  `vote_count` int NOT NULL,
  `candidate_id` bigint NOT NULL,
  `election_id` bigint NOT NULL,
  `position_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `elections_vote_user_id_election_id_posi_f04e5d2c_uniq` (`user_id`,`election_id`,`position_id`,`candidate_id`),
  KEY `elections_vote_candidate_id_987e0d2c_fk_elections_candidate_id` (`candidate_id`),
  KEY `elections_vote_election_id_3575f2eb_fk_elections_election_id` (`election_id`),
  KEY `elections_vote_position_id_5222a9ac_fk_elections_position_id` (`position_id`),
  CONSTRAINT `elections_vote_candidate_id_987e0d2c_fk_elections_candidate_id` FOREIGN KEY (`candidate_id`) REFERENCES `elections_candidate` (`id`),
  CONSTRAINT `elections_vote_election_id_3575f2eb_fk_elections_election_id` FOREIGN KEY (`election_id`) REFERENCES `elections_election` (`id`),
  CONSTRAINT `elections_vote_position_id_5222a9ac_fk_elections_position_id` FOREIGN KEY (`position_id`) REFERENCES `elections_position` (`id`),
  CONSTRAINT `elections_vote_user_id_d06f5898_fk_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `elections_vote`
--

LOCK TABLES `elections_vote` WRITE;
/*!40000 ALTER TABLE `elections_vote` DISABLE KEYS */;
INSERT INTO `elections_vote` VALUES (1,'2023-05-20 19:38:53.725781','2023-05-20 19:38:53.725809',1,1,1,1,12),(2,'2023-05-20 19:38:53.728061','2023-05-20 19:38:53.728096',1,3,1,2,12),(3,'2023-05-20 19:38:53.730501','2023-05-20 19:38:53.730534',1,4,1,2,12),(4,'2023-05-20 19:38:53.732951','2023-05-20 19:38:53.732984',1,5,1,3,12),(5,'2023-05-20 19:41:02.115594','2023-05-20 19:41:02.115655',1,1,1,1,13),(6,'2023-05-20 19:41:02.118932','2023-05-20 19:41:02.118989',1,4,1,2,13),(7,'2023-05-20 19:41:02.122869','2023-05-20 19:41:02.122938',1,5,1,3,13),(8,'2023-05-20 19:42:01.571544','2023-05-20 19:42:01.571583',1,1,1,1,14),(9,'2023-05-20 19:42:01.573987','2023-05-20 19:42:01.574022',1,4,1,2,14),(10,'2023-05-20 19:42:01.576537','2023-05-20 19:42:01.576577',1,5,1,3,14),(11,'2023-05-20 19:42:23.014260','2023-05-20 19:42:23.014301',1,2,1,1,15),(12,'2023-05-20 19:42:23.016814','2023-05-20 19:42:23.016848',1,3,1,2,15),(13,'2023-05-20 19:42:23.019156','2023-05-20 19:42:23.019189',1,4,1,2,15),(14,'2023-05-20 19:42:23.021832','2023-05-20 19:42:23.021865',1,5,1,3,15);
/*!40000 ALTER TABLE `elections_vote` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `university`
--

DROP TABLE IF EXISTS `university`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `university` (
  `create_time` datetime(6) NOT NULL,
  `update_time` datetime(6) NOT NULL,
  `id` smallint NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
-- Table structure for table `users_user`
--

DROP TABLE IF EXISTS `users_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `create_time` datetime(6) NOT NULL,
  `update_time` datetime(6) NOT NULL,
  `email` varchar(254) NOT NULL,
  `dob` date NOT NULL,
  `university_id` smallint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `users_user_university_id_94d42185_fk_university_id` (`university_id`),
  CONSTRAINT `users_user_university_id_94d42185_fk_university_id` FOREIGN KEY (`university_id`) REFERENCES `university` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_user`
--

LOCK TABLES `users_user` WRITE;
/*!40000 ALTER TABLE `users_user` DISABLE KEYS */;
INSERT INTO `users_user` VALUES (1,'pbkdf2_sha256$600000$pxWor4iAy8zJddkCu99YmU$/+Oi4TsZz9N8ABUdUQSBfRGo6FIwx1A6EE52dNrEgVU=','2023-05-20 18:39:55.521344',1,1,1,'2023-05-20 18:39:45.017082','2023-05-20 18:39:45.017098','super@gmail.com','2000-01-01',1),(2,'pbkdf2_sha256$600000$W01r7ZXrqB9Zm1dNYu7Pdy$7FtWbB1JV6P6lGpWQajvLsNQRELFEKB/sB16IL7LS3g=',NULL,0,1,1,'2023-05-20 18:41:08.265612','2023-05-20 18:41:08.265634','admin@scu.edu','2000-12-20',1),(3,'pbkdf2_sha256$600000$dV6Mu6GsZKqum91f6LtbcG$SYctbM9QCsjB0ryEg/raov7PVN4p33Ew50xwMmBneqs=',NULL,0,1,1,'2023-05-20 18:42:10.151258','2023-05-20 18:42:10.151276','admin@sjsu.edu','1995-01-01',2),(4,'pbkdf2_sha256$600000$zlznwHhS4bmEGktb9ml89M$sKjSa5A8bA0G0iSTQVYTko6oWNwDVSzGb6Ua3Rs7jc4=',NULL,0,0,1,'2023-05-20 18:50:36.095291','2023-05-20 18:50:36.095316','user1@scu.edu','1995-01-01',1),(5,'pbkdf2_sha256$600000$SuEgDf131NS0b4SbahOZSP$CQmTyvl17HR7rdGBPDInzojFm40P60Wah3sRcUHaXdo=',NULL,0,0,1,'2023-05-20 18:51:00.366936','2023-05-20 18:51:00.366963','user2@scu.edu','2000-01-19',1),(6,'pbkdf2_sha256$600000$1s30ybahILrcbluEPlSPcY$rxmfEfTAAjgP8mVMOtUhjMGfh4zNts9zi9tb1TZ/9lw=',NULL,0,0,1,'2023-05-20 18:51:16.175770','2023-05-20 18:51:16.175798','user3@scu.edu','2000-01-19',1),(7,'pbkdf2_sha256$600000$CrgM6MdWM6ZiCEbCj59vfV$SCKDNDW5UzcAtooHiiCt1mWbuBG/48tsa4SHjDL+bW0=',NULL,0,0,1,'2023-05-20 18:51:33.802788','2023-05-20 18:51:33.802819','user4@scu.edu','2000-01-19',1),(8,'pbkdf2_sha256$600000$Y4ye8V2hUL0Y12OvjLsNFg$L6ehqfOQa+gipXWTCGpo/t4GbMrfsNm7qfuYyu1AvX0=',NULL,0,0,1,'2023-05-20 18:51:46.918366','2023-05-20 18:51:46.918390','user5@scu.edu','2000-01-19',1),(9,'pbkdf2_sha256$600000$QVvcnS5yD8qMaWI9Fzt9S0$VClb5yJk8VMi/B5wjyJxUml/gnHAiC3AblDmdzMEnCA=',NULL,0,0,1,'2023-05-20 18:52:31.623202','2023-05-20 18:52:31.623231','user1@sjsu.edu','2000-01-19',2),(10,'pbkdf2_sha256$600000$nvDnyyQKpRR8oe1FivPHbr$Onc9A/VZlo3M8wRUvzWppGL8e3TBlLHkHwxujlXInNs=',NULL,0,0,1,'2023-05-20 18:52:46.319871','2023-05-20 18:52:46.319898','user2@sjsu.edu','2000-01-19',2),(12,'pbkdf2_sha256$600000$lgsQOdR1ntE6tesPUuxwZM$fTM9qHkl7Z7IPpXw71PtsvBzzJ+cci3SjnkAaLhMj0k=','2023-05-20 19:31:02.377011',0,0,1,'2023-05-20 19:29:49.987694','2023-05-20 19:29:49.987725','user6@scu.edu','2001-06-20',1),(13,'pbkdf2_sha256$600000$373G4UMbS32vl1BCJAi0l4$CIyhUXRDL4PGp/oQ+qYCV6R2s9bgn5KyUeN0scaVY/U=','2023-05-20 19:40:35.955317',0,0,1,'2023-05-20 19:29:59.255833','2023-05-20 19:29:59.255859','user7@scu.edu','2001-06-20',1),(14,'pbkdf2_sha256$600000$ybiI9gF5bxvbRBA2ReYsML$MaXwPTi2IlEos6ENPStwfSJD81I2+dQw8HkRJrLMu64=','2023-05-20 19:41:19.585391',0,0,1,'2023-05-20 19:30:09.368635','2023-05-20 19:30:09.368660','user8@scu.edu','2001-06-20',1),(15,'pbkdf2_sha256$600000$sW9UlsVJr04IMVbrcKRmeP$6a04LVziTQA85KbtXPcLSG/fFLaCts5+aYjXG3030W0=','2023-05-20 19:42:12.884816',0,0,1,'2023-05-20 19:30:17.612951','2023-05-20 19:30:17.612978','user9@scu.edu','2001-06-20',1);
/*!40000 ALTER TABLE `users_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_user_groups`
--

DROP TABLE IF EXISTS `users_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_user_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_user_groups_user_id_group_id_b88eab82_uniq` (`user_id`,`group_id`),
  KEY `users_user_groups_group_id_9afc8d0e_fk_auth_group_id` (`group_id`),
  CONSTRAINT `users_user_groups_group_id_9afc8d0e_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `users_user_groups_user_id_5f6f5a90_fk_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_user_groups`
--

LOCK TABLES `users_user_groups` WRITE;
/*!40000 ALTER TABLE `users_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_user_user_permissions`
--

DROP TABLE IF EXISTS `users_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_user_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_user_user_permissions_user_id_permission_id_43338c45_uniq` (`user_id`,`permission_id`),
  KEY `users_user_user_perm_permission_id_0b93982e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `users_user_user_perm_permission_id_0b93982e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `users_user_user_permissions_user_id_20aca447_fk_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `users_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_user_user_permissions`
--

LOCK TABLES `users_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `users_user_user_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-05-20 12:55:13
