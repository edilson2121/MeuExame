CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'TEACHER');

CREATE TABLE IF NOT EXISTS "users" (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    role "Role" DEFAULT 'USER',
    "institutionId" TEXT,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "institutions" (
    id TEXT PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    logo TEXT,
    website TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    city TEXT,
    country TEXT DEFAULT 'Mocambique',
    "isPaid" BOOLEAN DEFAULT false,
    "paidAt" TIMESTAMP,
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "courses" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "subjects" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "updatedAt" TIMESTAMP DEFAULT NOW()
);
