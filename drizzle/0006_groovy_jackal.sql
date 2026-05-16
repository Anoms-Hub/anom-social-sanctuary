CREATE TABLE `chat_channel_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`channel_id` int NOT NULL,
	`user_id` int NOT NULL,
	`role` enum('member','moderator','admin') DEFAULT 'member',
	`joined_at` timestamp NOT NULL DEFAULT (now()),
	`last_read_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chat_channel_members_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `chat_channels` (
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
--> statement-breakpoint
CREATE TABLE `chat_messages` (
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
--> statement-breakpoint
CREATE TABLE `chat_notifications` (
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
--> statement-breakpoint
CREATE TABLE `chat_reactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`message_id` int NOT NULL,
	`user_id` int NOT NULL,
	`emoji` varchar(10) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chat_reactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_presence` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`status` enum('online','away','offline') DEFAULT 'offline',
	`last_seen_at` timestamp NOT NULL DEFAULT (now()),
	`current_channel_id` int,
	CONSTRAINT `user_presence_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_presence_user_id_unique` UNIQUE(`user_id`)
);
