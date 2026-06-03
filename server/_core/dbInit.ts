import { migrate } from "drizzle-orm/mysql2/migrator";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ENV } from "./env";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
    
    // Run migrations with absolute path
    console.log("[Database Init] Running pending migrations...");
    const migrationsFolder = path.resolve(__dirname, "../../drizzle");
    console.log("[Database Init] Migrations folder:", migrationsFolder);
    
    try {
      await migrate(db, { migrationsFolder });
      console.log("[Database Init] ✓ Migrations completed successfully");
    } catch (migrationError: any) {
      // Check if error is about table already existing
      // The error might be nested in the cause property
      const cause = migrationError?.cause || migrationError;
      const isTableExistsError = 
        migrationError?.code === 'ER_TABLE_EXISTS_ERROR' || 
        migrationError?.errno === 1050 ||
        cause?.code === 'ER_TABLE_EXISTS_ERROR' ||
        cause?.errno === 1050 ||
        migrationError?.message?.includes('already exists') ||
        cause?.message?.includes('already exists') ||
        migrationError?.message?.includes('ER_TABLE_EXISTS_ERROR');
      
      if (isTableExistsError) {
        console.log("[Database Init] ℹ Some tables already exist, this is expected");
        console.log("[Database Init] ✓ Database tables are ready");
      } else if (migrationError?.message?.includes("ENOENT")) {
        console.error("[Database Init] ✗ Migrations folder not found at:", migrationsFolder);
        throw new Error(`Migrations folder not found: ${migrationsFolder}`);
      } else {
        console.error("[Database Init] Unexpected migration error:", migrationError);
        throw migrationError;
      }
    }
    
    console.log("[Database Init] ✓ Database initialized successfully");
    
    // Close the connection
    await connection.end();
  } catch (error) {
    console.error("[Database Init] ✗ Failed to initialize database:", error);
    // In development, fail loudly so we notice the issue
    if (process.env.NODE_ENV === "development") {
      console.error("[Database Init] Exiting due to database initialization failure in development mode");
      process.exit(1);
    }
    // In production, log but continue (may have been initialized already)
  }
}
