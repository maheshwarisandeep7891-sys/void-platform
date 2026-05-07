import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const total = await prisma.listing.count();
  const botListings = await prisma.listing.count({ where: { seller: { isBot: true } } });
  const borrowListings = await prisma.listing.count({ where: { type: "FOR_BORROW" } });
  const activeListings = await prisma.listing.count({ where: { status: "ACTIVE" } });
  const follows = await prisma.follow.count();
  const botFollows = await prisma.follow.count({ where: { follower: { isBot: true } } });
  console.log("Total listings:", total);
  console.log("Bot listings:", botListings);
  console.log("FOR_BORROW listings:", borrowListings);
  console.log("ACTIVE listings:", activeListings);
  console.log("Total follows:", follows);
  console.log("Bot follows:", botFollows);
}
main().catch(console.error).finally(() => prisma.$disconnect());
