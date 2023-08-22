-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Aug 21, 2023 at 03:17 PM
-- Server version: 8.1.0
-- PHP Version: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `online_store`
--

--
-- Dumping data for table `item`
--

INSERT INTO `item` (`id`, `quantity`, `price`, `orderId`, `productId`) VALUES
(1, 1, 999, 1, 2),
(2, 1, 999, 2, 2),
(3, 1, 30, 2, 3),
(4, 1, 100, 3, 4),
(5, 1, 99, 4, 8),
(6, 1, 100, 5, 4),
(7, 1, 325, 6, 5);

--
-- Dumping data for table `order`
--

INSERT INTO `order` (`id`, `total`, `date`, `userId`) VALUES
(1, 999, '2023-08-19 00:07:23.128714', 6),
(2, 1029, '2023-08-19 00:47:32.004530', 6),
(3, 100, '2023-08-19 01:29:37.572998', 6),
(4, 99, '2023-08-21 12:24:14.748007', 5),
(5, 100, '2023-08-21 13:13:49.924359', 6),
(6, 325, '2023-08-21 13:15:51.798446', 6);

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `name`, `description`, `image`, `price`) VALUES
(2, 'IPHONE', 'Best iPhone', 'e635e17c264a3922ddcfc9150346554c', 999),
(3, 'CHROMECAST', 'Best Chromecast', '2e4260da0991cf15d90a9145ebd382b2', 30),
(4, 'GLASSES', 'Best Glasses', '07b56a5b2d8ede681b4a214258113b83', 100),
(5, 'SMARTWATCH', 'Best SmartWatch in the world', 'd0899dec1bc55717cf565c2e33111a8b', 325),
(7, 'Mouse', 'The best mouse in the world', 'cc978dd81412a90e1a4066f9f86d6aa5', 69),
(8, 'Kindle', 'Kindle Amazon', 'd3e568eaafe9a0c4cb8b5118b7614cc5', 99),
(10, 'TV', 'Best TV in the world', '1c524eb4173e11c063a609fe1a88b297', 1299);

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `email`, `password`, `role`, `balance`) VALUES
(3, 'test', 'test@email.com', '$2b$10$.cbbQ7/gaZKqW0IEwnVS5exDysBTmm1mO4ZzHzyJj4znL8KZlfeWG', 'client', 1000),
(5, 'admin', 'admin@gmail.com', '$2b$10$HaZZprm8s5Zga0qQxRw0nORZYP6pWmp6rG/2p2ulYrobbOCKEj2Si', 'admin', 901),
(6, 'user', 'user@gmail.com', '$2b$10$Lq0WDc0DKZgS7WVkLW4ofu5YSZUZRmgC75fW7Y3uIW5eB6evv3ufm', 'client', 475);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
