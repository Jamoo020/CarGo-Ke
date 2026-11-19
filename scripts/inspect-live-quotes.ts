import { prisma } from "../src/db";

async function main() {
  const quotes = await prisma.driverQuote.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      amount: true,
      fuelBudget: true,
      status: true,
      transportRequestId: true,
      createdAt: true,
    },
  });

  console.log("Recent DriverQuote rows:");
  for (const q of quotes) {
    console.log({
      id: q.id.slice(0, 8),
      amount: q.amount,
      fuelBudget: q.fuelBudget,
      status: q.status,
      transportRequestId: q.transportRequestId.slice(0, 8),
      createdAt: q.createdAt.toISOString(),
    });
  }

  const trips = await prisma.trip.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      bookingAmount: true,
      driverFee: true,
      fuelBudget: true,
      carGoFee: true,
      status: true,
      transportRequestId: true,
      createdAt: true,
    },
  });

  console.log("\nRecent Trip rows:");
  for (const t of trips) {
    console.log({
      id: t.id.slice(0, 8),
      bookingAmount: t.bookingAmount,
      driverFee: t.driverFee,
      fuelBudget: t.fuelBudget,
      carGoFee: t.carGoFee,
      status: t.status,
      createdAt: t.createdAt.toISOString(),
    });
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
