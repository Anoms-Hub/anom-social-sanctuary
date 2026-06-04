-- Anom Social Sanctuary Database Setup
-- Run these SQL commands on your TiDB instance to create all required tables
-- This combines all migrations from the /drizzle/ folder

-- ============================================================================
-- Migration 0000: Initial tables (users, profiles, achievements)
-- ============================================================================

CREATE TABLE IF NOT EXISTS `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`open_id` varchar(100) NOT NULL UNIQUE,
	`name` varchar(100) NOT NULL,
	`email` varchar(100) NOT NULL UNIQUE,
	`login_method` varchar(50),
	`role` enum('user','admin') DEFAULT 'user',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`last_signed_in` timestamp,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `user_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL UNIQUE,
	`bio` text,
	`avatar_url` text,
	`neon_theme` varchar(50) DEFAULT 'cyan',
	`level` int DEFAULT 1,
	`xp` int DEFAULT 0,
	`anom_coin_balance` int DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`decoration_package_ids` json DEFAULT ('[]'),
	CONSTRAINT `user_profiles_id` PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `achievements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`icon_url` text,
	`category` varchar(50),
	`points` int DEFAULT 10,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `achievements_id` PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `user_achievements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`achievement_id` int NOT NULL,
	`unlocked_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_achievements_id` PRIMARY KEY(`id`)
);

-- ============================================================================
-- Migration 0001: Lounges and social features
-- ============================================================================

CREATE TABLE IF NOT EXISTS `lounges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`owner_id` int NOT NULL,
	`type` enum('family','friends','coworkers','public') DEFAULT 'public',
	`neon_theme` varchar(50) DEFAULT 'cyan',
	`max_members` int DEFAULT 50,
	`is_public` boolean DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `lounges_id` PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `lounge_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`lounge_id` int NOT NULL,
	`user_id` int NOT NULL,
	`role` enum('owner','moderator','member') DEFAULT 'member',
	`joined_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `lounge_members_id` PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `lounge_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`lounge_id` int NOT NULL,
	`sender_id` int NOT NULL,
	`content` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `lounge_messages_id` PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `social_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`author_id` int NOT NULL,
	`content` text NOT NULL,
	`image_url` text,
	`likes_count` int DEFAULT 0,
	`comments_count` int DEFAULT 0,
	`shares_count` int DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `social_posts_id` PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `post_likes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`post_id` int NOT NULL,
	`user_id` int NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `post_likes_id` PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `post_comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`post_id` int NOT NULL,
	`user_id` int NOT NULL,
	`content` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `post_comments_id` PRIMARY KEY(`id`)
);

-- ============================================================================
-- Migration 0002: Games and merch
-- ============================================================================

CREATE TABLE IF NOT EXISTS `games` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`thumbnail_url` text,
	`game_url` text NOT NULL,
	`category` varchar(50),
	`min_level` int DEFAULT 1,
	`coin_reward` int DEFAULT 10,
	`xp_reward` int DEFAULT 5,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `games_id` PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `game_scores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`game_id` int NOT NULL,
	`score` int NOT NULL,
	`coins_earned` int DEFAULT 0,
	`xp_earned` int DEFAULT 0,
	`played_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `game_scores_id` PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `merch_designs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`image_url` text NOT NULL,
	`category` varchar(50),
	`price` decimal(10,2) NOT NULL,
	`stock` int DEFAULT 100,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `merch_designs_id` PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `merch_orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`design_id` int NOT NULL,
	`quantity` int NOT NULL,
	`total_price` decimal(10,2) NOT NULL,
	`status` enum('pending','processing','shipped','delivered','cancelled') DEFAULT 'pending',
	`order_date` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `merch_orders_id` PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `custom_merch_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`design_description` text NOT NULL,
	`design_image_url` text,
	`status` enum('pending','approved','rejected','completed') DEFAULT 'pending',
	`requested_at` timestamp NOT NULL DEFAULT (now()),
	`completed_at` timestamp,
	CONSTRAINT `custom_merch_requests_id` PRIMARY KEY(`id`)
);

-- ============================================================================
-- Migration 0003: Cosmetics and decorations
-- ============================================================================

CREATE TABLE IF NOT EXISTS `cosmetics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`type` enum('emote','badge','gif','border','background') DEFAULT 'emote',
	`image_url` text NOT NULL,
	`price` int NOT NULL,
	`rarity` enum('common','rare','epic','legendary') DEFAULT 'common',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cosmetics_id` PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `user_cosmetics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`cosmetic_id` int NOT NULL,
	`acquired_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_cosmetics_id` PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `user_decorations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`decoration_type` varchar(50) NOT NULL,
	`decoration_data` json NOT NULL,
	`applied_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_decorations_id` PRIMARY KEY(`id`)
);

-- ============================================================================
-- Migration 0004: Collaboration and events
-- ============================================================================

CREATE TABLE IF NOT EXISTS `collaboration_projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`owner_id` int NOT NULL,
	`status` enum('planning','active','completed','archived') DEFAULT 'planning',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `collaboration_projects_id` PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `collaboration_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`project_id` int NOT NULL,
	`user_id` int NOT NULL,
	`role` enum('owner','lead','contributor','viewer') DEFAULT 'contributor',
	`joined_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `collaboration_members_id` PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `collaboration_tasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`project_id` int NOT NULL,
	`title` varchar(100) NOT NULL,
	`description` text,
	`assigned_to` int,
	`status` enum('todo','in_progress','review','completed') DEFAULT 'todo',
	`priority` enum('low','medium','high','critical') DEFAULT 'medium',
	`due_date` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `collaboration_tasks_id` PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `collaboration_updates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`project_id` int NOT NULL,
	`user_id` int NOT NULL,
	`content` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `collaboration_updates_id` PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`start_date` timestamp NOT NULL,
	`end_date` timestamp NOT NULL,
	`location` varchar(100),
	`created_by` int NOT NULL,
	`max_attendees` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `events_id` PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `event_attendees` (
	`id` int AUTO_INCREMENT NOT NULL,
	`event_id` int NOT NULL,
	`user_id` int NOT NULL,
	`status` enum('attending','interested','not_attending') DEFAULT 'attending',
	`registered_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `event_attendees_id` PRIMARY KEY(`id`)
);

-- ============================================================================
-- Migration 0005: Admin and audit
-- ============================================================================

CREATE TABLE IF NOT EXISTS `audit_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`action` varchar(100) NOT NULL,
	`details` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_log_id` PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `platform_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`platform_name` varchar(100) DEFAULT 'Anom Social Sanctuary',
	`max_users` int DEFAULT 10000,
	`max_lounges` int DEFAULT 1000,
	`coin_reward_per_action` int DEFAULT 10,
	`coin_reward_per_game` int DEFAULT 50,
	`coin_reward_per_task` int DEFAULT 10,
	`xp_per_level` int DEFAULT 100,
	`enable_merch` boolean DEFAULT true,
	`enable_lounges` boolean DEFAULT true,
	`enable_games` boolean DEFAULT true,
	`enable_collaboration` boolean DEFAULT true,
	`enable_kids_corner` boolean DEFAULT true,
	`stripe_public_key` varchar(255),
	`stripe_secret_key` varchar(255),
	`enable_content_moderation` boolean DEFAULT true,
	`auto_moderation_threshold` int DEFAULT 5,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `platform_settings_id` PRIMARY KEY(`id`)
);

-- ============================================================================
-- Migration 0006: VIP and subscriptions
-- ============================================================================

CREATE TABLE IF NOT EXISTS `vip_tiers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`display_name` varchar(100) NOT NULL,
	`monthly_price` decimal(10,2) NOT NULL,
	`description` text,
	`benefits` json DEFAULT ('[]'),
	`coin_multiplier` decimal(3,2) DEFAULT '1.0',
	`xp_multiplier` decimal(3,2) DEFAULT '1.0',
	`badge_color` varchar(7) DEFAULT '#ff00cc',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `vip_tiers_id` PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `user_vip_subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL UNIQUE,
	`vip_tier_id` int NOT NULL,
	`stripe_subscription_id` varchar(100),
	`stripe_customer_id` varchar(100),
	`status` enum('active','canceled','past_due','unpaid') DEFAULT 'active',
	`current_period_start` timestamp,
	`current_period_end` timestamp,
	`canceled_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_vip_subscriptions_id` PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `vip_benefits_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`benefit` varchar(100) NOT NULL,
	`description` text,
	`value` decimal(10,2),
	`used_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `vip_benefits_log_id` PRIMARY KEY(`id`)
);

-- ============================================================================
-- Migration 0007: Chat and presence
-- ============================================================================

CREATE TABLE IF NOT EXISTS `chat_channels` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`type` enum('global','announcements','support','events','off_topic','private') DEFAULT 'global',
	`created_by` int NOT NULL,
	`is_public` boolean DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `chat_channels_id` PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `chat_channel_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`channel_id` int NOT NULL,
	`user_id` int NOT NULL,
	`role` enum('member','moderator','admin') DEFAULT 'member',
	`joined_at` timestamp NOT NULL DEFAULT (now()),
	`last_read_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chat_channel_members_id` PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `chat_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`channel_id` int,
	`sender_id` int NOT NULL,
	`recipient_id` int,
	`content` text NOT NULL,
	`message_type` enum('text','image','file','system') DEFAULT 'text',
	`media_url` text,
	`is_pinned` boolean DEFAULT false,
	`is_edited` boolean DEFAULT false,
	`edited_at` timestamp,
	`deleted_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chat_messages_id` PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `chat_reactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`message_id` int NOT NULL,
	`user_id` int NOT NULL,
	`emoji` varchar(10) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chat_reactions_id` PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `chat_notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`message_id` int NOT NULL,
	`channel_id` int,
	`type` enum('mention','direct_message','channel_message','system') DEFAULT 'channel_message',
	`is_read` boolean DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`read_at` timestamp,
	CONSTRAINT `chat_notifications_id` PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `user_presence` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL UNIQUE,
	`status` enum('online','away','offline') DEFAULT 'offline',
	`last_seen_at` timestamp NOT NULL DEFAULT (now()),
	`current_channel_id` int,
	CONSTRAINT `user_presence_id` PRIMARY KEY(`id`)
);

-- ============================================================================
-- Final ALTER statements to add columns
-- ============================================================================

ALTER TABLE `user_profiles` ADD COLUMN IF NOT EXISTS `name_color` varchar(7) DEFAULT '#00eaff';
ALTER TABLE `user_profiles` ADD COLUMN IF NOT EXISTS `membership_tier` enum('basic','vip','super_vip') DEFAULT 'basic';
ALTER TABLE `user_profiles` ADD COLUMN IF NOT EXISTS `tier_upgraded_at` timestamp;
ALTER TABLE `user_profiles` ADD COLUMN IF NOT EXISTS `tier_expires_at` timestamp;
ALTER TABLE `user_profiles` ADD COLUMN IF NOT EXISTS `coin_multiplier` decimal(3,1) DEFAULT '1.0';

-- ============================================================================
-- Database setup complete!
-- ============================================================================
-- All tables have been created successfully.
-- You can now run your Anom Social Sanctuary application.
