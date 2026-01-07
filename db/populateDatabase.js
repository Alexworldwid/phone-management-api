#! /usr/bin/env node

const { Client } = require("pg");

const SQL = `
-- EXTENSION
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL
);

-- PHONES
CREATE TABLE IF NOT EXISTS phones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES categories(id),
    model_name VARCHAR(100) NOT NULL,
    release_year INTEGER,
    price NUMERIC(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SEED DATA

INSERT INTO categories (name)
VALUES
  ('Smartphone'),
  ('Feature Phone'),
  ('Foldable')
ON CONFLICT (name) DO NOTHING;

INSERT INTO phones (category_id, model_name, release_year, price)
VALUES (
  (SELECT id FROM categories WHERE name = 'Smartphone'),
  'Galaxy S23',
  2023,
  799.99
),
(
  (SELECT id FROM categories WHERE name = 'Smartphone'),
  'iPhone 14',
  2022,
  899.99
);
`;


const databaseUrl = process.argv[2];

if (!databaseUrl) {
  console.error("❌ Please provide a database URL");
  process.exit(1);
}

async function main() {
  console.log("🌱 Seeding database...");
  const client = new Client({
    connectionString: databaseUrl,
  });

  await client.connect();
  await client.query(SQL);
  await client.end();

  console.log("✅ Done");
}

main();
