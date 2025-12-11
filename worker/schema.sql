CREATE TABLE IF NOT EXISTS rsvps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  guests TEXT NOT NULL,
  events TEXT NOT NULL,
  message TEXT,
  submitted_at TEXT NOT NULL
);
