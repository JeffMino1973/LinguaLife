import { db } from "./db";
import { scenarios, vocabularyItems, users } from "@shared/schema";
import { scenariosData } from "./data/vocabulary";
import bcrypt from "bcrypt";

async function seedDatabase() {
  console.log("Seeding database...");

  // Create demo user if it doesn't exist
  try {
    const hashedPassword = await bcrypt.hash("demo123", 10);
    
    await db.insert(users).values({
      id: 1,
      username: "demo-user",
      email: "demo@lingualife.com",
      password: hashedPassword,
      role: "student",
    }).onConflictDoNothing();
    console.log("✓ Demo user created (password: demo123)");
  } catch (error) {
    console.log("Demo user already exists or error:", error);
  }

  // Seed scenarios and vocabulary for Spanish
  const language = "spanish";
  
  for (const [scenarioId, scenarioData] of Object.entries(scenariosData)) {
    // Insert scenario
    await db.insert(scenarios).values({
      id: scenarioId,
      title: scenarioData.title,
      description: scenarioData.description,
      imageUrl: scenarioData.imageUrl,
      icon: scenarioData.icon,
      language,
    }).onConflictDoNothing();

    // Insert vocabulary items
    for (const vocab of scenarioData.vocabulary) {
      await db.insert(vocabularyItems).values({
        id: vocab.id,
        scenarioId,
        word: vocab.word,
        translation: vocab.translation,
        pronunciation: vocab.pronunciation,
        exampleSentence: vocab.exampleSentence,
        exampleTranslation: vocab.exampleTranslation,
        imageUrl: vocab.imageUrl || null,
        difficulty: vocab.difficulty,
        language,
      }).onConflictDoNothing();
    }

    console.log(`✓ Seeded scenario: ${scenarioData.title}`);
  }

  console.log("Database seeding completed!");
  process.exit(0);
}

seedDatabase().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});
