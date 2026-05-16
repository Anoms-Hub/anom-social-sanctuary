CREATE TABLE `audit_log` (
	`id` int AUTO_INCREMENT NOT NULL,
	`admin_id` int NOT NULL,
	`action` varchar(100) NOT NULL,
	`target_type` varchar(50),
	`target_id` int,
	`details` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `audit_log_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `platform_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`site_name` varchar(255) DEFAULT 'Anom Artsy',
	`site_description` text,
	`logo_url` text,
	`favicon_url` text,
	`primary_color` varchar(7) DEFAULT '#ff00cc',
	`secondary_color` varchar(7) DEFAULT '#00eaff',
	`accent_color` varchar(7) DEFAULT '#9d4edd',
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
