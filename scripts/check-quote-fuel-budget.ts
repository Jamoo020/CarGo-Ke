import { prisma } from "../src/db";

async function main() {
  const quotes = await prisma.driverQuote.findMany({
    select: {
      id: true,
      amount: true,
      fuelBudget: true,
      status: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  console.log("=== Recent Quotes ===");
  quotes.forEach((q) => {
    console.log(
      `ID: ${q.id.substring(0, 8)}... | Amount: ${q.amount} | FuelBudget: ${q.fuelBudget ?? "NULL"} | Status: ${q.status}`
    );
  });

  const quotesWithoutFuel = await prisma.driverQuote.findMany({
    where: {
      fuelBudget: null,
    },
    select: {
      id: true,
      amount: true,
      status: true,
    },
  });

  console.log("\n=== Quotes WITHOUT Fuel Budget ===");
  console.log(`Count: ${quotesWithoutFuel.length}`);
  if (quotesWithoutFuel.length > 0) {
    quotesWithoutFuel.slice(0, 5).forEach((q) => {
      console.log(
        `ID: ${q.id.substring(0, 8)}... | Amount: ${q.amount} | Status: ${q.status}`
      );
    });
  }

  const trips = await prisma.trip.findMany({
    select: {
      id: true,
      driverFee: true,
      fuelBudget: true,
      carGoFee: true,
      bookingAmount: true,
      status: true,
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  console.log("\n=== Recent Trips ===");
  trips.forEach((t) => {
    const calculatedTotal = (t.driverFee ?? 0) + (t.fuelBudget ?? 0) + (t.carGoFee ?? 0);
    const match = Math.abs(t.bookingAmount - calculatedTotal) < 0.01 ? "✓" : "✗";
    console.log(
      `ID: ${t.id.substring(0, 8)}... | Driver: ${t.driverFee} | Fuel: ${t.fuelBudget ?? 0} | CarGo: ${t.carGoFee ?? 0} | Booking: ${t.bookingAmount} ${match}`
    );
  });

  process.exit(0);
}

main().catch(console.error);
