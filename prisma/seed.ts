import { PrismaClient } from "@prisma/client"
import fs from "fs"
import path from "path"
const prisma = new PrismaClient(
    //{log: ['query', 'info', 'warn', 'error']}
)

async function seed() {
    const seedFilesPath = path.join(__dirname, "/seeds/")
    const seedFiles = fs
        .readdirSync(seedFilesPath)
        .filter((file: string) => file.endsWith(".seed.ts"))
    
    for (const seedFile of seedFiles) {
        const seedFilePath = path.join(seedFilesPath, seedFile);
        const { default: seedFunction } = require(seedFilePath);
        console.log("Running seed for", "\x1b[32m", "******", seedFile, "******");
        console.log();
        await seedFunction(prisma);
    }
}

seed()
    .catch((error) => {
        console.error("Seeding error:", error)
    })
    .finally(async () => {
        await prisma.$disconnect();
    })