import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();
async function main() {
  const total = await p.listing.count();
  const active = await p.listing.count({ where: { status: "ACTIVE" } });
  const borrow = await p.listing.count({ where: { type: "FOR_BORROW" } });
  const sale = await p.listing.count({ where: { type: "FOR_SALE" } });
  const rent = await p.listing.count({ where: { type: "FOR_RENT" } });
  console.log("Total:", total, "| Active:", active, "| Borrow:", borrow, "| Sale:", sale, "| Rent:", rent);
}
main().catch(console.error).finally(() => p.$disconnect());
