ALTER TABLE `user_profiles` ADD `membership_tier` enum('basic','vip','super_vip') DEFAULT 'basic';--> statement-breakpoint
ALTER TABLE `user_profiles` ADD `tier_upgraded_at` timestamp;--> statement-breakpoint
ALTER TABLE `user_profiles` ADD `tier_expires_at` timestamp;--> statement-breakpoint
ALTER TABLE `user_profiles` ADD `coin_multiplier` decimal(3,1) DEFAULT '1.0';