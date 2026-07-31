import "dotenv/config";
import { db } from "./index";
import { products } from "./schema";
import { seedProducts } from "./seed-data";

async function seed() {
  try {
    console.log("Deleting old products...");

    await db.delete(products);

    console.log("Adding new products...");

    await db.insert(products).values(seedProducts);

    console.log("✅ Successfully added all products!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

seed();