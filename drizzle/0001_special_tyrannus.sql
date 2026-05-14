CREATE TABLE `achievements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`icon_url` text,
	`category` varchar(50) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `achievements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `coin_transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`type` enum('earn','spend') NOT NULL,
	`reason` varchar(100) NOT NULL,
	`related_id` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `coin_transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `decoration_packages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`category` varchar(50) NOT NULL,
	`image_url` text,
	`cost_anom` decimal(10,2) DEFAULT '0',
	`cost_real` decimal(10,2) DEFAULT '0',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `decoration_packages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `feed_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int,
	`post_type` enum('meme','highlight','update','achievement') NOT NULL,
	`title` varchar(100),
	`content` text,
	`image_url` text,
	`likes` int DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `feed_posts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `game_scores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`game_name` varchar(50) NOT NULL,
	`score` int NOT NULL,
	`coin_reward` decimal(10,2) DEFAULT '0',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `game_scores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `kids_progress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`content_type` varchar(50) NOT NULL,
	`content_id` varchar(100) NOT NULL,
	`completed` boolean DEFAULT false,
	`completed_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `kids_progress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lounge_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`lounge_id` int NOT NULL,
	`user_id` int NOT NULL,
	`role` enum('owner','admin','member') DEFAULT 'member',
	`joined_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `lounge_members_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lounge_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`lounge_id` int NOT NULL,
	`user_id` int NOT NULL,
	`content` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `lounge_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lounges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`type` enum('family','friends','coworkers') NOT NULL,
	`owner_id` int NOT NULL,
	`description` text,
	`neon_theme` varchar(50) DEFAULT 'magenta',
	`cost_anom` decimal(10,2) DEFAULT '0',
	`cost_real` decimal(10,2) DEFAULT '0',
	`is_public` boolean DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `lounges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `merch_orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`request_id` int,
	`product_name` varchar(100) NOT NULL,
	`quantity` int DEFAULT 1,
	`total_price` decimal(10,2) NOT NULL,
	`payment_status` enum('pending','paid','failed') DEFAULT 'pending',
	`fulfillment_status` enum('pending','created','shipped','delivered') DEFAULT 'pending',
	`printful_order_id` varchar(100),
	`tracking_url` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `merch_orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `merch_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`title` varchar(100) NOT NULL,
	`description` text NOT NULL,
	`reference_images` json DEFAULT ('[]'),
	`status` enum('pending','approved','in_progress','completed','rejected') DEFAULT 'pending',
	`estimated_price` decimal(10,2),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `merch_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_achievements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`achievement_id` int NOT NULL,
	`unlocked_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_achievements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`bio` text,
	`avatar_url` text,
	`neon_theme` varchar(50) DEFAULT 'magenta',
	`decoration_package_ids` json DEFAULT ('[]'),
	`level` int DEFAULT 1,
	`xp` int DEFAULT 0,
	`anom_coin_balance` decimal(10,2) DEFAULT '0',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_profiles_user_id_unique` UNIQUE(`user_id`)
);
