-- ========================================================
-- Roshani Traders - Three Wheeler Auto Parts Management System
-- MySQL 8.0.46 Relational Database Schema
-- ========================================================

CREATE DATABASE IF NOT EXISTS `roshani_traders`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `roshani_traders`;

-- Disable foreign key checks during schema creation
SET FOREIGN_KEY_CHECKS = 0;

-- --------------------------------------------------------
-- 1. Table: users
-- --------------------------------------------------------
DROP TABLE IF EXISTS `quote_items`;
DROP TABLE IF EXISTS `quotes`;
DROP TABLE IF EXISTS `enquiries`;
DROP TABLE IF EXISTS `products`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `contents`;
DROP TABLE IF EXISTS `faqs`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `business_name` VARCHAR(255) NOT NULL,
  `mobile` VARCHAR(50) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `address` TEXT NOT NULL,
  `city` VARCHAR(100) NOT NULL,
  `role` ENUM('customer', 'admin') NOT NULL DEFAULT 'customer',
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_email` (`email`),
  INDEX `idx_users_role` (`role`),
  INDEX `idx_users_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 2. Table: categories
-- --------------------------------------------------------
CREATE TABLE `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL UNIQUE,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `description` TEXT NULL,
  `image` TEXT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_categories_slug` (`slug`),
  INDEX `idx_categories_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 3. Table: products
-- --------------------------------------------------------
CREATE TABLE `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `description` TEXT NULL,
  `brand` VARCHAR(100) NOT NULL DEFAULT 'Roshani Traders',
  `price` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `moq` INT NOT NULL DEFAULT 1,
  `stock` INT NOT NULL DEFAULT 0,
  `availability` TINYINT(1) NOT NULL DEFAULT 1,
  `image` TEXT NULL,
  `specifications` JSON NULL,
  `compatible_models` JSON NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_products_category_id` (`category_id`),
  INDEX `idx_products_slug` (`slug`),
  INDEX `idx_products_brand` (`brand`),
  INDEX `idx_products_price` (`price`),
  INDEX `idx_products_status` (`status`),
  FULLTEXT INDEX `idx_products_search` (`name`, `description`, `brand`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 4. Table: quotes
-- --------------------------------------------------------
CREATE TABLE `quotes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `quote_id` VARCHAR(50) NULL,
  `total_amount` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  `remarks` TEXT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'Pending',
  `tracking_status` VARCHAR(50) NOT NULL DEFAULT 'Order Placed',
  `tracking_number` VARCHAR(100) NULL,
  `current_location` VARCHAR(255) NULL DEFAULT 'Roshani Central Wholesale Hub, Bhiwandi, MH',
  `tracking_history` JSON NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_quotes_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_quotes_user_id` (`user_id`),
  INDEX `idx_quotes_status` (`status`),
  INDEX `idx_quotes_quote_id` (`quote_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 5. Table: quote_items
-- --------------------------------------------------------
CREATE TABLE `quote_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `quote_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `price_at_quote` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `subtotal` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
  CONSTRAINT `fk_quote_items_quote` FOREIGN KEY (`quote_id`) REFERENCES `quotes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_quote_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_quote_items_quote_id` (`quote_id`),
  INDEX `idx_quote_items_product_id` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 6. Table: enquiries
-- --------------------------------------------------------
CREATE TABLE `enquiries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NULL,
  `name` VARCHAR(255) NOT NULL,
  `business_name` VARCHAR(255) NOT NULL,
  `mobile` VARCHAR(50) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'New',
  `ai_summary` JSON NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_enquiries_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX `idx_enquiries_user_id` (`user_id`),
  INDEX `idx_enquiries_email` (`email`),
  INDEX `idx_enquiries_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 7. Table: contents
-- --------------------------------------------------------
CREATE TABLE `contents` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `page` VARCHAR(100) NOT NULL,
  `section` VARCHAR(100) NOT NULL DEFAULT 'main',
  `title` VARCHAR(255) NULL,
  `description` TEXT NULL,
  `image` TEXT NULL,
  `data` JSON NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_page_section` (`page`, `section`),
  INDEX `idx_contents_page` (`page`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- 8. Table: faqs
-- --------------------------------------------------------
CREATE TABLE `faqs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `question` TEXT NOT NULL,
  `answer` TEXT NOT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_faqs_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
