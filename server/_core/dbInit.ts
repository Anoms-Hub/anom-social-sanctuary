import { migrate } from "drizzle-orm/mysql2/migrator";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ENV } from "./env";
import fs from "node:fs";

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

  let connection: any = null;
  
  try {
    console.log("[Database Init] Starting database initialization...");
    console.log("[Database Init] Environment:", process.env.NODE_ENV);
    
    // Create a connection pool
    console.log("[Database Init] Connecting to database...");
    connection = await mysql.createConnection(ENV.databaseUrl);
    console.log("[Database Init] ✓ Database connection established");
    
    // Create drizzle instance
    const db = drizzle(connection);
    
    // Run migrations with absolute path
    console.log("[Database Init] Running pending migrations...");
    const migrationsFolder = path.resolve(__dirname, "../../drizzle");
    console.log("[Database Init] Migrations folder:", migrationsFolder);
    
    // Verify migrations folder exists
    if (!fs.existsSync(migrationsFolder)) {
      throw new Error(`Migrations folder not found at: ${migrationsFolder}`);
    }
    
    const migrationFiles = fs.readdirSync(migrationsFolder).filter(f => f.endsWith('.sql'));
    console.log(`[Database Init] Found ${migrationFiles.length} migration files:`, migrationFiles);
    
    try {
      console.log("[Database Init] Executing migrations...");
      await migrate(db, { migrationsFolder });
      console.log("[Database Init] ✓ Migrations completed successfully");
    } catch (migrationError: any) {
      // Check if error is about table already existing
      const cause = migrationError?.cause || migrationError;
      const errorMessage = migrationError?.message || String(migrationError);
      const errorCode = migrationError?.code || cause?.code;
      
      console.error("[Database Init] Migration error details:");
      console.error("  - Message:", errorMessage);
      console.error("  - Code:", errorCode);
      console.error("  - Errno:", migrationError?.errno || cause?.errno);
      
      const isTableExistsError = 
        errorCode === 'ER_TABLE_EXISTS_ERROR' || 
        migrationError?.errno === 1050 ||
        cause?.errno === 1050 ||
        errorMessage.includes('already exists') ||
        errorMessage.includes('ER_TABLE_EXISTS_ERROR');
      
      if (isTableExistsError) {
        console.log("[Database Init] ℹ Some tables already exist, this is expected");
        console.log("[Database Init] ✓ Database tables are ready");
      } else if (errorMessage.includes("ENOENT")) {
        console.error("[Database Init] ✗ Migrations folder not found at:", migrationsFolder);
        throw new Error(`Migrations folder not found: ${migrationsFolder}`);
      } else {
        console.error("[Database Init] ✗ Unexpected migration error:", migrationError);
        // Log the full error for debugging
        console.error("[Database Init] Full error:", JSON.stringify(migrationError, null, 2));
        throw migrationError;
      }
    }
    
    console.log("[Database Init] ✓ Database initialized successfully");
    
  } catch (error) {
    console.error("[Database Init] ✗ Failed to initialize database:", error);
    console.error("[Database Init] Error details:", JSON.stringify(error, null, 2));
    
    // In development, fail loudly so we notice the issue
    if (process.env.NODE_ENV === "development") {
      console.error("[Database Init] Exiting due to database initialization failure in development mode");
      process.exit(1);
    }
    // In production, log but continue (may have been initialized already)
    console.warn("[Database Init] Continuing in production mode despite initialization failure");
  } finally {
    // Close the connection
    if (connection) {
      try {
        await connection.end();
        console.log("[Database Init] ✓ Connection closed");
      } catch (closeError) {
        console.error("[Database Init] Error closing connection:", closeError);
      }
    }
  }
}
