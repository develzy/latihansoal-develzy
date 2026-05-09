-- Schema untuk database D1
CREATE TABLE IF NOT EXISTS scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  subject TEXT,
  score INTEGER,
  date TEXT
);
