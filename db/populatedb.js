#! /usr/bin/env node
// If using argv[2] for the connection string
// Run the script in the terminal `node db/populatedb <db-string>`
// Local db-string: postgresql://jpvm:jpdb123@localhost:5432/membersonly
// Host db-string: 

// Run code to wipe tables in the database, run in the psql terminal inside the intended database to wipe
    // DO $$ DECLARE
    //     r RECORD;
    // BEGIN
    //     FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
    //         EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    //     END LOOP;
    // END $$;

const { argv } = require('node:process');

// Run only once to populate db, may need to delete all tables from the database
const { Client } = require("pg");

// Creates a 'session' table and a 'User' table with the appropriate columns
// Particularly, 'User' table needs to have an id, username and hash columns
const sql = `
CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  firstname varchar (255),
  lastname varchar (255),
  email varchar (255),
  hash TEXT,
  admin BOOLEAN
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title varchar (255),
  data TEXT,
  added TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users_messages (
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message_id INTEGER NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, message_id)
);

INSERT INTO users(firstname, lastname, email, hash, admin) VALUES
('John', 'Doe', 'john@gmail.com', 'testhash12312', FALSE);

INSERT INTO messages(title, data) VALUES
('Test Message Title', 'Lesgooo');

INSERT INTO users_messages(user_id, message_id) VALUES
(1,1);


`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    connectionString: argv[2]
    // connectionString: "postgresql://jpvm:jpdb123@localhost:5432/membersonly",
  });
  await client.connect();
  await client.query(sql);
  await client.end();
  console.log("done");
}

main();


