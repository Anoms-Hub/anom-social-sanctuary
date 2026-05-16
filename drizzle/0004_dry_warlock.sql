CREATE TABLE `user_vip_subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`vip_tier_id` int NOT NULL,
	`stripe_subscription_id` varchar(100),
	`stripe_customer_id` varchar(100),
	`status` enum('active','canceled','past_due','unpaid') DEFAULT 'active',
	`current_period_start` timestamp,
	`current_period_end` timestamp,
	`canceled_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_vip_subscriptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_vip_subscriptions_user_id_unique` UNIQUE(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `vip_benefits_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`benefit` varchar(100) NOT NULL,
	`description` text,
	`value` decimal(10,2),
	`used_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `vip_benefits_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vip_tiers` (
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
