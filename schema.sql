-- Database Schema for Travel Tracker

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    color VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- 2. Create Countries Reference Table
CREATE TABLE IF NOT EXISTS countries (
    id SERIAL PRIMARY KEY,
    country_code VARCHAR(5) UNIQUE NOT NULL,
    country_name VARCHAR(100) NOT NULL
);

-- 3. Create Visited Countries Table
CREATE TABLE IF NOT EXISTS visited_countries (
    id SERIAL PRIMARY KEY,
    country_code VARCHAR(5) NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (country_code, user_id)
);
