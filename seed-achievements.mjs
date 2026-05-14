import mysql from "mysql2/promise";

const achievements = [
  { name: "First Steps", description: "Create your profile and customize it", category: "social_good", icon: "👣" },
  { name: "Coin Collector", description: "Earn your first 100 Anom Coins", category: "social_good", icon: "💰" },
  { name: "Level Up!", description: "Reach level 5", category: "milestones", icon: "⬆️" },
  { name: "Family Hero", description: "Help 5 family members in a lounge", category: "social_good", icon: "👨‍👩‍👧‍👦" },
  { name: "Game Master", description: "Win 10 mini-games", category: "games", icon: "🎮" },
  { name: "Trivia Champion", description: "Score 100% on Trivia", category: "games", icon: "🧠" },
  { name: "Memory Expert", description: "Complete Neon Memory in under 30 seconds", category: "games", icon: "🧩" },
  { name: "Mood Matcher", description: "Match 50 moods correctly", category: "games", icon: "😊" },
  { name: "Snack Vault Master", description: "Collect 1000 snacks in Snack Vault Rush", category: "games", icon: "🍿" },
  { name: "Kids Corner Explorer", description: "Complete all Kids Corner lessons", category: "social_good", icon: "🎨" },
  { name: "Lounge Founder", description: "Create your first private lounge", category: "milestones", icon: "🏠" },
  { name: "Social Butterfly", description: "Earn 500 Anom Coins from social good actions", category: "social_good", icon: "🦋" },
];

async function seedAchievements() {
  const connection = await mysql.createConnection({
    host: process.env.DATABASE_URL.split("@")[1].split(":")[0],
    user: process.env.DATABASE_URL.split("://")[1].split(":")[0],
    password: process.env.DATABASE_URL.split(":")[1].split("@")[0],
    database: process.env.DATABASE_URL.split("/").pop(),
  });

  try {
    for (const achievement of achievements) {
      await connection.execute(
        "INSERT INTO achievements (name, description, category, icon) VALUES (?, ?, ?, ?)",
        [achievement.name, achievement.description, achievement.category, achievement.icon]
      );
    }
    console.log("✅ Achievements seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding achievements:", error);
  } finally {
    await connection.end();
  }
}

seedAchievements();
