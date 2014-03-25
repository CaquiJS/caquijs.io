-- phpMyAdmin SQL Dump
-- version 4.1.7
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Mar 25, 2014 at 09:52 PM
-- Server version: 5.6.15
-- PHP Version: 5.3.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `caquijs`
--

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE IF NOT EXISTS `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `author_id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `description` text NOT NULL,
  `link` varchar(200) NOT NULL,
  `image` varchar(200) NOT NULL,
  `tags` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE IF NOT EXISTS `tags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slug` varchar(20) NOT NULL,
  `title` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `writers`
--

CREATE TABLE IF NOT EXISTS `writers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `picture` varchar(200) NOT NULL,
  `role` varchar(100) NOT NULL,
  `business` varchar(100) NOT NULL,
  `linkBusiness` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `facebook` varchar(100) NOT NULL,
  `twitter` varchar(100) NOT NULL,
  `skype` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `writers`
--

INSERT INTO `writers` (`id`, `name`, `picture`, `role`, `business`, `linkBusiness`, `description`, `facebook`, `twitter`, `skype`) VALUES
(1, 'Renan Vaz', 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-prn2/t5.0-1/274584_1380283944_1337521741_q.jpg', 'Lead developer', 'Luego Produtora Digital', 'http://luego.com.br/', 'PHP5, C# .NET, NodeJS, Databases (MySQL, SQLServer, PostgreSQL, MongoDB and RethinkDB), AS3 (AIR, RA, Away3D, Starling, Feathers...), JavaScript (jQuery, MVVM libs), CSS preprocessors (LESS and SASS), HTML5 (JS APIs, CSS3), XHTML (Web Standards - W3C), Mobile (Native APPs - IOS, Android and FireFox OS, WEB APPs), SEO, APIs (Facebook, Twitter, YouTube, Google Maps, 4Square, Instagram...), Arduino, Raspberry Pi.', 'renanvaz', 'renanvaz', 'vazrenan');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
