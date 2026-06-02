import { migrate } from "drizzle-orm/mysql2/migrator";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { ENV } from "./env";

/**
 * Initialize database and run pending migrations
 * This ensures all tables exist when the app starts
 */
export async function initializeDatabase() {
  if (!ENV.databaseUrl) {
    console.warn("[Database Init] databaseUrl not set, skipping initialization");
    return;
  }

  try {
    console.log("[Database Init] Starting database initialization...");
    
    // Create a connection pool
    const connection = await mysql.createConnection(ENV.databaseUrl);
    
    // Create drizzle instance
    const db = drizzle(connection);
    
    // Run migrations
    console.log("[Database Init] Running pending migrations...");
    try {
      await migrate(db, { migrationsFolder: "./drizzle" });
      console.log("[Database Init] ✓ Migrations completed successfully");
    } catch (migrationError: any) {
      if (migrationError?.code === 'ER_TABLE_EXISTS_ERROR') {
        console.log("[Database Init] ℹ Some tables already exist, continuing...");
      } else {
        throw migrationError;
      }
    }
    
    console.log("[Database Init] ✓ Database initialized successfully");
    
    // Close the connection
    await connection.end();
  } catch (error) {
    console.error("[Database Init] ✗ Failed to initialize database:", error);
    // Don't throw - allow app to start even if migrations fail
    // This prevents deployment failures
  }
}
