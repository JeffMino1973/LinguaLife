import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { Pool } from "@neondatabase/serverless";

const PgSession = connectPgSimple(session);

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

// Default session secret for development
const SESSION_SECRET = process.env.SESSION_SECRET || "dev-secret-change-in-production";

if (!process.env.SESSION_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("SESSION_SECRET is required in production");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const sessionMiddleware = session({
  store: new PgSession({
    pool,
    createTableIfMissing: true,
  }),
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  },
});

// Extend Express session type
declare module "express-session" {
  interface SessionData {
    userId?: number;
  }
}
