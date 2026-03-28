// NootropicStacker — Database Seed Script
// Seeds all supplements from the local JS data into Railway MySQL
//
// Usage: DATABASE_URL="mysql://..." node server/seed.js

import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATABASE_URL = process.env.DATABASE_URL || process.env.MYSQL_PUBLIC_URL;

if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL not set.');
  process.exit(1);
}

async function seed() {
  console.log('Connecting to MySQL...');
  const conn = await mysql.createConnection(DATABASE_URL);

  // Drop and recreate the table with our schema
  console.log('Dropping old supplements table...');
  await conn.execute('DROP TABLE IF EXISTS supplements');

  console.log('Creating new supplements table...');
  await conn.execute(`
    CREATE TABLE supplements (
      id VARCHAR(100) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(50) NOT NULL,
      description TEXT NOT NULL,
      benefits JSON NOT NULL,
      dosage_min DECIMAL(10,2),
      dosage_max DECIMAL(10,2),
      dosage_unit VARCHAR(20) DEFAULT 'mg',
      dosage_timing VARCHAR(255),
      effect_energy TINYINT DEFAULT 0,
      effect_mood TINYINT DEFAULT 0,
      effect_balance TINYINT DEFAULT 0,
      effect_creativity TINYINT DEFAULT 0,
      effect_socialness TINYINT DEFAULT 0,
      effect_learning TINYINT DEFAULT 0,
      effect_study TINYINT DEFAULT 0,
      interactions JSON,
      warnings JSON,
      image_url VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_category (category),
      INDEX idx_name (name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Import supplement data
  console.log('Loading supplement data...');
  const supplementsModule = await import('../src/data/supplements.js');
  const supplements = supplementsModule.supplements;
  console.log(`Found ${supplements.length} supplements to seed...`);

  let inserted = 0;

  for (const s of supplements) {
    try {
      await conn.execute(
        `INSERT INTO supplements (id, name, category, description, benefits,
         dosage_min, dosage_max, dosage_unit, dosage_timing,
         effect_energy, effect_mood, effect_balance, effect_creativity,
         effect_socialness, effect_learning, effect_study,
         interactions, warnings, image_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          s.id,
          s.name,
          s.category,
          s.description,
          JSON.stringify(s.benefits),
          s.dosage.min,
          s.dosage.max,
          s.dosage.unit,
          s.dosage.timing,
          s.effects.energy || 0,
          s.effects.mood || 0,
          s.effects.balance || 0,
          s.effects.creativity || 0,
          s.effects.socialness || 0,
          s.effects.learning || 0,
          s.effects.study || 0,
          JSON.stringify(s.interactions || []),
          JSON.stringify(s.warnings || []),
          s.image || null
        ]
      );
      inserted++;
      if (inserted % 50 === 0) console.log(`  ...processed ${inserted}/${supplements.length}`);
    } catch (err) {
      console.error(`  ERROR seeding ${s.id}:`, err.message);
    }
  }

  // Verify
  const [rows] = await conn.execute('SELECT COUNT(*) as count FROM supplements');
  console.log(`\nDone! Seeded ${inserted} supplements. Database has ${rows[0].count} total.`);

  await conn.end();
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
