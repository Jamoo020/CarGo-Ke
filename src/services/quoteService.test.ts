import { calculateDriverReleasePlan, calculateTripFinancials } from "./quoteService";

describe("trip financial allocation", () => {
  it("keeps fuel and the platform fee separate from driver compensation", () => {
    const financials = calculateTripFinancials(10_000, 12_000);
    const releasePlan = calculateDriverReleasePlan(10_000, 12_000);

    expect(financials).toEqual({
      driverFee: 10_000,
      fuelBudget: 12_000,
      carGoFee: 1_540,
      subtotal: 22_000,
      bookingAmount: 23_540,
      totalDriverEntitlement: 10_000,
    });
    expect(releasePlan).toEqual({
      firstRelease: 3_000,
      finalRelease: 7_000,
      totalDriverEntitlement: 10_000,
      totalRelease: 10_000,
      fuelAllocation: 12_000,
    });
  });

  it("rounds installment cents once so the first and final releases equal the fee", () => {
    const plan = calculateDriverReleasePlan(101.01, 5.55);

    expect(plan.firstRelease).toBe(30.3);
    expect(plan.finalRelease).toBe(70.71);
    expect(Math.round((plan.firstRelease + plan.finalRelease + Number.EPSILON) * 100)).toBe(
      Math.round(plan.totalDriverEntitlement * 100),
    );
    expect(plan.fuelAllocation).toBe(5.55);
  });
});
