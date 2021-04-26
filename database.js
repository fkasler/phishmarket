const Database = require('better-sqlite3');
const db = new Database('./marketplace.db', { verbose: console.log });

let template_setup = db.prepare(`
  CREATE TABLE IF NOT EXISTS templates (
    template_id INTEGER PRIMARY KEY,
    ich_id INTEGER REFERENCES ichthyologists(ich_id),
    created_at INTEGER,
    title TEXT NOT NULL UNIQUE,
    short_description TEXT NOT NULL,
    report_description TEXT NOT NULL,
    mime_content TEXT NOT NULL,
    image TEXT NOT NULL
  )
`)
template_setup.run()

let spam_filter_setup = db.prepare(`
  CREATE TABLE IF NOT EXISTS spamfilters (
    spam_filter_id INTEGER PRIMARY KEY,
    ich_id INTEGER REFERENCES ichthyologists(ich_id),
    created_at INTEGER,
    product_name TEXT NOT NULL UNIQUE
  )
`)
spam_filter_setup.run()

let scorecard_setup = db.prepare(`
  CREATE TABLE IF NOT EXISTS scorecards (
    scorecard_id INTEGER PRIMARY KEY,
    template_id INTEGER REFERENCES templates (template_id) ON DELETE CASCADE,
    ich_id INTEGER REFERENCES ichthyologists (ich_id),
    spam_filter_id INTEGER REFERENCES spamfilters (spam_filter_id),
    created_at INTEGER,
    whitelisted INTEGER,
    stars INTEGER,
    notes TEXT,
    number_of_targets INTEGER,
    number_of_clicks INTEGER
  )
`)
scorecard_setup.run()

global.db = db
