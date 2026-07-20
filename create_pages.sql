CREATE TABLE IF NOT EXISTS pages (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    description TEXT,
    keywords TEXT,
    template TEXT DEFAULT 'default',
    showInMenu BOOLEAN DEFAULT false,
    menuOrder INTEGER DEFAULT 0,
    status TEXT DEFAULT 'DRAFT',
    publishedAt TIMESTAMP,
    authorId TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW()
);
