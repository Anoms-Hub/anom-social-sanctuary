import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  connectionLimit: 1,
  host: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'localhost',
  user: process.env.DATABASE_URL?.split('://')[1]?.split(':')[0] || 'root',
  password: process.env.DATABASE_URL?.split(':')[2]?.split('@')[0] || '',
  database: process.env.DATABASE_URL?.split('/').pop() || 'anom_artsy',
});

const decorations = [
  // Character Badges
  {
    name: 'Pixel Badge',
    description: 'Unlock the iconic Pixel character badge for your profile',
    category: 'character_badge',
    imageUrl: null,
    costAnom: '50',
    costReal: '0.99',
  },
  {
    name: 'Dot Badge',
    description: 'Unlock the adorable Dot character badge for your profile',
    category: 'character_badge',
    imageUrl: null,
    costAnom: '50',
    costReal: '0.99',
  },
  {
    name: 'Tater Nugget Badge',
    description: 'Unlock the Tater Nugget character badge for your profile',
    category: 'character_badge',
    imageUrl: null,
    costAnom: '50',
    costReal: '0.99',
  },
  // Mood Glows
  {
    name: 'Happy Glow',
    description: 'A cheerful magenta glow that radiates positivity',
    category: 'mood_glow',
    imageUrl: null,
    costAnom: '25',
    costReal: '0.49',
  },
  {
    name: 'Chill Glow',
    description: 'A cool cyan glow for a relaxed vibe',
    category: 'mood_glow',
    imageUrl: null,
    costAnom: '25',
    costReal: '0.49',
  },
  {
    name: 'Mystical Glow',
    description: 'A mysterious purple glow for the enigmatic',
    category: 'mood_glow',
    imageUrl: null,
    costAnom: '25',
    costReal: '0.49',
  },
  // Neon Themes
  {
    name: 'Magenta Neon Theme',
    description: 'Transform your profile with a vibrant magenta neon aesthetic',
    category: 'neon_theme',
    imageUrl: null,
    costAnom: '100',
    costReal: '1.99',
  },
  {
    name: 'Cyan Neon Theme',
    description: 'Embrace the cool cyan neon energy',
    category: 'neon_theme',
    imageUrl: null,
    costAnom: '100',
    costReal: '1.99',
  },
  {
    name: 'Purple Neon Theme',
    description: 'Dive into the deep purple neon realm',
    category: 'neon_theme',
    imageUrl: null,
    costAnom: '100',
    costReal: '1.99',
  },
  // Special Badges
  {
    name: 'Social Good Champion',
    description: 'Earned by completing 10 social good actions',
    category: 'achievement_badge',
    imageUrl: null,
    costAnom: '0',
    costReal: '0',
  },
  {
    name: 'Family Hero',
    description: 'Earned by spending 5 hours in family lounges',
    category: 'achievement_badge',
    imageUrl: null,
    costAnom: '0',
    costReal: '0',
  },
  {
    name: 'Game Master',
    description: 'Earned by winning 50 mini-games',
    category: 'achievement_badge',
    imageUrl: null,
    costAnom: '0',
    costReal: '0',
  },
];

async function seed() {
  const connection = await pool.getConnection();
  try {
    console.log('Seeding decoration packages...');
    
    for (const decoration of decorations) {
      await connection.execute(
        'INSERT INTO decoration_packages (name, description, category, imageUrl, costAnom, costReal) VALUES (?, ?, ?, ?, ?, ?)',
        [
          decoration.name,
          decoration.description,
          decoration.category,
          decoration.imageUrl,
          decoration.costAnom,
          decoration.costReal,
        ]
      );
      console.log(`✓ Added: ${decoration.name}`);
    }
    
    console.log('\n✅ Seeding complete! Added', decorations.length, 'decoration packages.');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await connection.release();
    await pool.end();
  }
}

seed();
