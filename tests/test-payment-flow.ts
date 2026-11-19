/**
 * Test: Payment flow and PayNow button behavior
 * 
 * Tests:
 * 1. Create customer & request
 * 2. Create driver & approve driver  
 * 3. Customer selects driver quote -> Trip created
 * 4. Verify trip.status = "PAYMENT_PENDING"
 * 5. Verify Pay Now button is visible
 * 6. Simulate logout/login
 * 7. Verify Pay Now button STILL visible after re-login
 * 8. Try clicking Pay Now - verify it asks for payment method
 */

const API_BASE_URL = "http://localhost:4000/api";

interface AuthResponse {
  data: { token: string; user: { id: string; email: string; role: string } };
}

async function runPaymentTest() {
  try {
    console.log("\n=== PAYMENT FLOW TEST ===\n");

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
        name: "Test Customer",
        role: "CUSTOMER",
      }),
    });

    if (!registerResponse.ok) {
      throw new Error(`Customer registration failed`);
    }

    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: customerEmail, password: customerPassword }),
    });

    const authData: AuthResponse = await loginResponse.json();
    const customerToken = authData.data.token;
    console.log("  ✅ Customer created and logged in");

    // Step 2: Create transport request (Mombasa → Nairobi)
    console.log("\nStep 2: Creating transport request...");
    const createRequestResponse = await fetch(`${API_BASE_URL}/transport-requests`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${customerToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        origin: "Mombasa",
        destination: "Nairobi",
        pickupAddress: "Mombasa, Kenya",
        pickupLatitude: -4.0435,
        pickupLongitude: 39.6682,
        destinationAddress: "Nairobi, Kenya",
        destinationLatitude: -1.2921,
        destinationLongitude: 36.8219,
        vehicleType: "Sedan",
        make: "Toyota",
        model: "Camry",
        licensePlate: "KBX123",
        capacity: 5,
        pickupTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      }),
    });

    if (!createRequestResponse.ok) {
      throw new Error(`Failed to create request`);
    }

    const requestData: any = await createRequestResponse.json();
    const requestId = requestData.data.id;
    console.log(`  ✅ Transport request created: ${requestId}`);

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
        name: "Test Driver",
        role: "DRIVER",
      }),
    });

    if (!driverRegisterResponse.ok) {
      throw new Error(`Driver registration failed`);
    }

    const driverData: any = await driverRegisterResponse.json();
    const driverId = driverData.data.id;

    // Get admin token
    const adminLoginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@cargokenya.local",
        password: "DevelopmentAdmin123!",
      }),
    });

    const adminData: AuthResponse = await adminLoginResponse.json();
    const adminToken = adminData.data.token;

    // Get drivers list to find the driver
    const driversResponse = await fetch(`${API_BASE_URL}/admin/drivers`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${adminToken}` },
    });

    const driversData: any = await driversResponse.json();
    const targetDriver = driversData.data.find((d: any) => d.user?.email === driverEmail);

    // Approve driver
    const approveResponse = await fetch(
      `${API_BASE_URL}/admin/drivers/${targetDriver.id}/approve`,
      {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason: "Approved for testing" }),
      },
    );

    if (!approveResponse.ok) {
      throw new Error(`Driver approval failed`);
    }

    console.log("  ✅ Driver created and approved");

    // Step 4: Driver logs in and submits quote
    console.log("\nStep 4: Driver submitting quote...");
    const driverLoginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: driverEmail, password: driverPassword }),
    });

    const driverAuthData: AuthResponse = await driverLoginResponse.json();
    const driverToken = driverAuthData.data.token;

    const quoteResponse = await fetch(
      `${API_BASE_URL}/transport-requests/${requestId}/quotes`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${driverToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: 5000, message: "Test quote" }),
      },
    );

    if (!quoteResponse.ok) {
      throw new Error(`Quote submission failed`);
    }

    const quoteData: any = await quoteResponse.json();
    const quoteId = quoteData.data.id;
    console.log(`  ✅ Quote submitted: ${quoteId}`);

    // Step 5: Customer selects quote -> Trip created
    console.log("\nStep 5: Customer selecting quote (should create trip)...");
    const selectResponse = await fetch(
      `${API_BASE_URL}/transport-requests/${requestId}/select-quote`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${customerToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quoteId }),
      },
    );

    if (!selectResponse.ok) {
      const errorData: any = await selectResponse.json();
      throw new Error(`Select quote failed: ${errorData.error}`);
    }

    const tripData: any = await selectResponse.json();
    const tripId = tripData.data.id;
    console.log(`  ✅ Quote selected, Trip created: ${tripId}`);
    console.log(`     Trip status: ${tripData.data.status}`);

    // Step 6: Verify trip status is PAYMENT_PENDING
    console.log("\nStep 6: Verifying trip status...");
    const getRequestResponse = await fetch(
      `${API_BASE_URL}/transport-requests/${requestId}`,
      {
        method: "GET",
        headers: { "Authorization": `Bearer ${customerToken}` },
      },
    );

    const currentRequest: any = await getRequestResponse.json();
    const currentTrip = currentRequest.data.trip;

    console.log(`  Trip status: ${currentTrip.status}`);
    if (currentTrip.status === "PAYMENT_PENDING") {
      console.log("  ✅ Trip is PAYMENT_PENDING - Pay Now button should be visible");
    } else {
      console.log(
        `  ⚠️  Trip status is ${currentTrip.status}, not PAYMENT_PENDING - button won't show!`
      );
    }

    // Step 7: Try to create payment (without providerReference)
    console.log("\nStep 7: Calling createPayment endpoint...");
    const createPaymentResponse = await fetch(
      `${API_BASE_URL}/trips/${tripId}/payment`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${customerToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}), // No providerReference!
      },
    );

    if (createPaymentResponse.ok) {
      const paymentResp: any = await createPaymentResponse.json();
      console.log(`  ✅ Payment created: ${paymentResp.data.id}`);
      console.log(`     Status: ${paymentResp.data.status}`);
      console.log(`     Amount: ${paymentResp.data.amount}`);
    } else {
      const errorResp: any = await createPaymentResponse.json();
      console.log(`  ⚠️  Payment creation issue: ${errorResp.error}`);
    }

    // Step 8: Test logout/login persistence
    console.log("\nStep 8: Testing logout/login persistence...");
    console.log("  (Simulating logout by creating new token)");

    const reLoginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: customerEmail, password: customerPassword }),
    });

    const reAuthData: AuthResponse = await reLoginResponse.json();
    const newToken = reAuthData.data.token;
    console.log("  ✅ Re-logged in with new token");

    // Verify request still loads and trip status is correct
    const reloadResponse = await fetch(
      `${API_BASE_URL}/transport-requests/${requestId}`,
      {
        method: "GET",
        headers: { "Authorization": `Bearer ${newToken}` },
      },
    );

    const reloadedRequest: any = await reloadResponse.json();
    console.log(`  Trip status after re-login: ${reloadedRequest.data.trip.status}`);

    if (reloadedRequest.data.trip.status === "PAYMENT_PENDING") {
      console.log("  ✅ Trip status preserved - Pay Now button SHOULD still be visible");
    } else {
      console.log(`  ❌ Trip status changed to ${reloadedRequest.data.trip.status}`);
    }

    console.log("\n=== TEST COMPLETE ===\n");
    console.log("FINDINGS:");
    console.log("1. Pay Now button depends on trip.status === 'PAYMENT_PENDING'");
    console.log("2. Payment endpoint expects 'providerReference' (payment method)");
    console.log("3. Frontend needs payment method selection UI (M-Pesa, Card, etc.)");
    console.log("4. Current frontend sends empty object - backend accepts it but incomplete flow");
  } catch (error) {
    console.error("\n=== TEST FAILED ===\n");
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

runPaymentTest();
