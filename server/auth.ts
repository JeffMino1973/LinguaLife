import { db } from "./db";
import { users, User } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export async function createUser(username: string, email: string, password: string, role: string = "student", parentId?: number): Promise<{ user: User | null; error?: string }> {
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    
    const [user] = await db.insert(users).values({
      username,
      email,
      password: hashedPassword,
      role,
      parentId: parentId || null,
    }).returning();

    return { user };
  } catch (error: any) {
    console.error("Error creating user:", error);
    
    // Handle unique constraint violations
    if (error.code === '23505') { // PostgreSQL unique violation
      if (error.constraint?.includes('email')) {
        return { user: null, error: "Email already in use" };
      }
      if (error.constraint?.includes('username')) {
        return { user: null, error: "Username already taken" };
      }
      return { user: null, error: "User already exists" };
    }
    
    return { user: null, error: "Registration failed" };
  }
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  try {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      return null;
    }

    return user;
  } catch (error) {
    console.error("Error authenticating user:", error);
    return null;
  }
}

export async function getUserById(userId: number): Promise<User | null> {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    return user || null;
  } catch (error) {
    console.error("Error getting user by ID:", error);
    return null;
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return user || null;
  } catch (error) {
    console.error("Error getting user by email:", error);
    return null;
  }
}

export async function getUserChildren(parentId: number): Promise<User[]> {
  try {
    const children = await db.select().from(users).where(eq(users.parentId, parentId));
    return children;
  } catch (error) {
    console.error("Error getting user children:", error);
    return [];
  }
}
