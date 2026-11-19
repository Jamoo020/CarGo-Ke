/**
 * Integration Test: Idempotent Payment Creation with Duplicate providerReference
 * 
 * Tests the fix for P2002 unique constraint violation on Payment.providerReference
 * when the same reference is submitted multiple times.
 */

const API_BASE_URL = "http://localhost:4000/api";

interface AuthResponse {
  data: { token: string; user: { id: string; email: string; role: string } };
}

async function testIdempotentPaymentCreation() {
  try {
    console.log("\n=== IDEMPOTENT PAYMENT CREATION TEST ===\n");

    // Step 1: Create customer
    console.log("Step 1: Creating customer...");
    const customerEmail = `customer${Date.now()}@cargo.ke`;
    const customerPassword = "Test@1234";

    const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: customerEmail,
        password: customerPassword,
        fullName: "Test Customer",
        role: "CUSTOMER",
      }),
    });

    if (!registerResponse.ok) {
      throw new Error("Customer registration failed");
    }

    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: customerEmail, password: customerPassword }),
    });

    const authData: AuthResponse = await loginResponse.json();
    const customerToken = authData.data.token;
    const customerId = authData.data.user.id;
    console.log("✅ Customer created and logged in");

    // Step 2: Create transport request
    console.log("\nStep 2: Creating transport request...");
    const createRequestResponse = await fetch(`${API_BASE_URL}/transport-requests`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${customerToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        origin: "Nairobi",
        destination: "Kisumu",
        make: "Toyota",
        model: "Hiace",
        year: 2018,
        registrationNumber: `TEST-${Date.now()}`,
        color: "White",
        engineCC: 2500,
        vehicleType: "Van",
        capacity: 14,
        travelDateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        notes: "Idempotent payment test",
      }),
    });

    if (!createRequestResponse.ok) {
      throw new Error("Failed to create request");
    }

    const requestData: any = await createRequestResponse.json();
    const requestId = requestData.data.id;
    console.log(`✅ Transport request created: ${requestId}`);

    // Step 3: Create & approve driver
    console.log("\nStep 3: Creating and approving driver...");
    const driverEmail = `driver${Date.now()}@cargo.ke`;
    const driverPassword = "Test@1234";

    const driverRegisterResponse = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: driverEmail,
        password: driverPassword,
        fullName: "Test Driver",
        role: "DRIVER",
      }),
    });

    if (!driverRegisterResponse.ok) {
      throw new Error("Driver registration failed");
    }

    const driverLoginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: driverEmail, password: driverPassword }),
    });

    const driverAuthData: AuthResponse = await driverLoginResponse.json();
    const driverToken = driverAuthData.data.token;
    const driverId = driverAuthData.data.user.id;
    console.log(`✅ Driver created: ${driverId}`);

    // Approve driver using Prisma (simulating admin approval)
    const { PrismaClient } = require("@prisma/client");
    const prisma = new PrismaClient();
    await prisma.driver.update({
      where: { userId: driverId },
      data: { verified: true, verificationStatus: "APPROVED" },
    });
    console.log("✅ Driver approved");

    // Step 4: Create and select driver quote
    console.log("\nStep 4: Creating and selecting driver quote...");
    const quoteResponse = await fetch(
      `${API_BASE_URL}/transport-requests/${requestId}/quotes`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${driverToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 10000,
          fuelBudget: 8500,
          message: "Test quote",
        }),
      },
    );

    if (!quoteResponse.ok) {
      throw new Error(`Failed to create quote: ${await quoteResponse.text()}`);
    }

    const quoteData: any = await quoteResponse.json();
    const quoteId = quoteData.data.id;
    console.log(`✅ Quote created: ${quoteId}`);

    // Select quote
    const selectResponse = await fetch(`${API_BASE_URL}/quotes/${quoteId}/select`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${customerToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!selectResponse.ok) {
      throw new Error(`Failed to select quote: ${await selectResponse.text()}`);
    }

    // Get the trip ID - need to query the database since selectQuote returns the quote
    const trip = await prisma.trip.findFirst({
      where: { transportRequestId: requestId },
      orderBy: { createdAt: "desc" },
    });

    if (!trip) {
      throw new Error("Failed to find trip");
    }

    const tripId = trip.id;
    console.log(`✅ Trip created: ${tripId}`);

    // Step 5: Test idempotent payment creation with duplicate providerReference
    console.log("\nStep 5: Testing idempotent payment creation...");
    const providerRef = `idempotent_test_${Date.now()}`;

    // First payment creation
    console.log(`  Creating payment with providerReference: ${providerRef}`);
    const paymentResponse1 = await fetch(`${API_BASE_URL}/trips/${tripId}/payments`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${customerToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ providerReference: providerRef }),
    });

    if (!paymentResponse1.ok) {
      const error = await paymentResponse1.text();
      throw new Error(
        `First payment creation failed (${paymentResponse1.status}): ${error}`,
      );
    }

    const payment1: any = await paymentResponse1.json();
    const paymentId1 = payment1.data.id;
    console.log(`  ✅ First payment created: ${paymentId1}`);
    console.log(`     providerReference: ${payment1.data.providerReference}`);

    // Second payment creation with SAME providerReference (should be idempotent)
    console.log(
      `  Retrying with same providerReference (should return existing payment)...`,
    );
    const paymentResponse2 = await fetch(`${API_BASE_URL}/trips/${tripId}/payments`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${customerToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ providerReference: providerRef }),
    });

    if (!paymentResponse2.ok) {
      const error = await paymentResponse2.text();
      console.log(`  ❌ Second payment creation failed (${paymentResponse2.status})`);
      console.log(`     Error: ${error}`);
      throw new Error("Idempotent payment creation failed - should have returned existing payment");
    }

    const payment2: any = await paymentResponse2.json();
    const paymentId2 = payment2.data.id;
    console.log(`  ✅ Second payment request succeeded`);
    console.log(`     Payment ID: ${paymentId2}`);

    // Verify it's the same payment
    if (paymentId1 === paymentId2) {
      console.log("  ✅ IDEMPOTENT: Same payment ID returned (as expected)");
    } else {
      throw new Error(
        `✗ IDEMPOTENT FAILED: Different payment IDs returned\n    First: ${paymentId1}\n    Second: ${paymentId2}`,
      );
    }

    // Step 6: Test conflict detection - different trip, same provider reference
    console.log("\nStep 6: Testing conflict detection (different trip, same reference)...");

    // Create another trip
    const createRequest2Response = await fetch(`${API_BASE_URL}/transport-requests`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${customerToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        origin: "Nairobi",
        destination: "Mombasa",
        make: "Toyota",
        model: "Camry",
        year: 2020,
        registrationNumber: `TEST2-${Date.now()}`,
        color: "Black",
        engineCC: 1800,
        vehicleType: "Sedan",
        capacity: 5,
        travelDateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        notes: "Conflict test",
      }),
    });

    const request2Data: any = await createRequest2Response.json();
    const request2Id = request2Data.data.id;

    // Create another quote and trip
    const quote2Response = await fetch(
      `${API_BASE_URL}/transport-requests/${request2Id}/quotes`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${driverToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: 5000,
          fuelBudget: 2000,
          message: "Test quote 2",
        }),
      },
    );

    const quote2Data: any = await quote2Response.json();
    const quote2Id = quote2Data.data.id;

    const select2Response = await fetch(`${API_BASE_URL}/quotes/${quote2Id}/select`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${customerToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!select2Response.ok) {
      throw new Error(`Failed to select second quote: ${await select2Response.text()}`);
    }

    // Get the trip ID - need to query the database since selectQuote returns the quote
    const trip2 = await prisma.trip.findFirst({
      where: { transportRequestId: request2Id },
      orderBy: { createdAt: "desc" },
    });

    if (!trip2) {
      throw new Error("Failed to find second trip");
    }

    const trip2Id = trip2.id;
    console.log(`  Created second trip: ${trip2Id}`);

    // Try to use the same provider reference for the second trip
    console.log(
      `  Attempting to use same providerReference for different trip (should fail)...`,
    );
    const conflictPaymentResponse = await fetch(
      `${API_BASE_URL}/trips/${trip2Id}/payments`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${customerToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ providerReference: providerRef }),
      },
    );

    if (conflictPaymentResponse.ok) {
      throw new Error("✗ CONFLICT DETECTION FAILED: Should have rejected duplicate reference for different trip");
    }

    if (conflictPaymentResponse.status === 409) {
      console.log(
        `  ✅ CONFLICT DETECTED: Correctly rejected with 409 Conflict status`,
      );
      const errorResponse: any = await conflictPaymentResponse.json();
      console.log(`     Error message: ${errorResponse.error}`);
    } else {
      const error = await conflictPaymentResponse.text();
      throw new Error(
        `✗ Wrong error status ${conflictPaymentResponse.status}: ${error}`,
      );
    }

    // Cleanup
    await prisma.$disconnect();

    console.log("\n=== ALL TESTS PASSED ===\n");
    console.log("✅ Idempotent payment creation: PASSED");
    console.log("✅ Conflict detection: PASSED");
    console.log("✅ Duplicate reference handling: PASSED");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ TEST FAILED:");
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

testIdempotentPaymentCreation();
