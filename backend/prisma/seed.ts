import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const defaultCategories = [
  // Expense categories
  { name: "Makanan & Minuman", type: "expense", icon: "fastfood", color: "#ef4444" },
  { name: "Transportasi", type: "expense", icon: "directions_car", color: "#f97316" },
  { name: "Belanja", type: "expense", icon: "shopping_bag", color: "#8b5cf6" },
  { name: "Tagihan & Utilitas", type: "expense", icon: "receipt_long", color: "#06b6d4" },
  { name: "Hiburan", type: "expense", icon: "sports_esports", color: "#ec4899" },
  { name: "Kesehatan", type: "expense", icon: "local_hospital", color: "#10b981" },
  { name: "Pendidikan", type: "expense", icon: "school", color: "#3b82f6" },
  { name: "Rumah", type: "expense", icon: "home", color: "#f59e0b" },
  { name: "Pakaian", type: "expense", icon: "checkroom", color: "#6366f1" },
  { name: "Lainnya", type: "expense", icon: "category", color: "#6b7280" },
  // Income categories
  { name: "Gaji", type: "income", icon: "payments", color: "#10b981" },
  { name: "Freelance", type: "income", icon: "work", color: "#3b82f6" },
  { name: "Investasi", type: "income", icon: "trending_up", color: "#8b5cf6" },
  { name: "Transfer Masuk", type: "income", icon: "account_balance_wallet", color: "#f59e0b" },
  { name: "Bonus", type: "income", icon: "redeem", color: "#ec4899" },
  { name: "Pendapatan Lain", type: "income", icon: "monetization_on", color: "#6b7280" },
];

async function main() {
  console.log("🌱 Seeding default categories...");

  for (const category of defaultCategories) {
    // Only insert if the global category (userId: null) doesn't already exist with the same name+type
    const existing = await prisma.category.findFirst({
      where: {
        userId: null,
        name: category.name,
        type: category.type,
      },
    });

    if (!existing) {
      await prisma.category.create({
        data: {
          userId: null,
          name: category.name,
          type: category.type,
          icon: category.icon,
          color: category.color,
        },
      });
      console.log(`  ✅ Created: ${category.name} (${category.type})`);
    } else {
      console.log(`  ⏭️  Skipped: ${category.name} (already exists)`);
    }
  }

  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
