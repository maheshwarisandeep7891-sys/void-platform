import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Check what statuses exist
  const listings = await prisma.listing.findMany({
    select: { id: true, title: true, type: true, status: true },
    orderBy: { createdAt: "desc" },
    take: 30,
  });
  
  console.log("All listings:");
  listings.forEach(l => console.log(`  ${l.type} | ${l.status} | ${l.title.slice(0, 50)}`));
  
  // Fix any non-ACTIVE listings
  const fixed = await prisma.listing.updateMany({
    where: { status: { not: "ACTIVE" } },
    data: { status: "ACTIVE" },
  });
  console.log(`\nFixed ${fixed.count} listings to ACTIVE status`);
  
  const total = await prisma.listing.count({ where: { status: "ACTIVE" } });
  console.log(`Total ACTIVE listings: ${total}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
