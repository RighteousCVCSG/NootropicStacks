-- NootropicStacker.com Database Schema
-- MySQL on Railway

CREATE TABLE IF NOT EXISTS supplements (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  benefits JSON NOT NULL,
  dosage_min DECIMAL(10,2),
  dosage_max DECIMAL(10,2),
  dosage_unit VARCHAR(20) DEFAULT 'mg',
  dosage_timing VARCHAR(255),
  effect_energy TINYINT DEFAULT 0,
  effect_mood TINYINT DEFAULT 0,
  effect_balance TINYINT DEFAULT 0,
  effect_creativity TINYINT DEFAULT 0,
  effect_socialness TINYINT DEFAULT 0,
  effect_learning TINYINT DEFAULT 0,
  effect_study TINYINT DEFAULT 0,
  interactions JSON,
  warnings JSON,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Future tables for premium features
-- CREATE TABLE IF NOT EXISTS users ( ... );
-- CREATE TABLE IF NOT EXISTS saved_stacks ( ... );
-- CREATE TABLE IF NOT EXISTS affiliate_clicks ( ... );
