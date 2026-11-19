/**
 * Test script to verify approved driver can submit quotes
 * 
 * Tests that righa Karingo (karirig@gmail.com) - who is APPROVED + verified=true
 * can correctly see the marketplace and submit quotes without the pending warning
 */

const API_BASE_URL = "http://localhost:4000/api";

interface QuoteResponse {
  data: Array<{
    id: string;
    transportRequestId: string;
    driverId: string;
    amount: number;
    status: string;
  }>;
}

async function testApprovedDriverQuote() {
  try {
    console.log("\n=== APPROVED DRIVER QUOTE TEST ===\n");

    // Step 1: Login as the approved driver
    console.log("Step 1: Logging in as approved driver (karirig@gmail.com)...");
    const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "karirig@gmail.com",
        password: "Test@1234",
      }),
    });

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.statusText}`);
    }

    const loginData: any = await loginResponse.json();
    const token = loginData.data.token;
    console.log("  ✅ Logged in successfully");

    // Step 2: Call listMyQuotes endpoint to confirm driver is verified
    console.log("\nStep 2: Verifying driver eligibility (call /api/drivers/me/quotes)...");
    const quotesResponse = await fetch(`${API_BASE_URL}/drivers/me/quotes`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (quotesResponse.ok) {
      const quotesData: QuoteResponse = await quotesResponse.json();
      console.log("  ✅ Driver is verified and eligible to submit quotes");
      console.log(`  ✅ Current quotes: ${quotesData.data.length} existing quote(s)`);
    } else if (quotesResponse.status === 403) {
      throw new Error("❌ Driver is NOT eligible - backend returned 403 (not verified)");
    } else {
      throw new Error(`❌ Unexpected error: ${quotesResponse.statusText}`);
    }

    // Step 3: Get list of available requests
    console.log("\nStep 3: Fetching available transport requests...");
    const requestsResponse = await fetch(`${API_BASE_URL}/transport-requests`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!requestsResponse.ok) {
      throw new Error(`Failed to fetch requests: ${requestsResponse.statusText}`);
    }

    const requestsData: any = await requestsResponse.json();
    const availableRequests = requestsData.data || [];
    console.log(`  ✅ Found ${availableRequests.length} available request(s)`);

    if (availableRequests.length === 0) {
      console.log("  ⚠️  No requests available to quote on");
      console.log("\n=== TEST PASSED (No errors - driver is eligible) ===\n");
      return;
    }

    // Step 4: Submit a quote for the first available request
    const requestToQuote = availableRequests[0];
    console.log(`\nStep 4: Submitting quote for request ${requestToQuote.id}...`);
    console.log(`  Route: ${requestToQuote.origin} → ${requestToQuote.destination}`);
    console.log(`  Distance: ${(requestToQuote.distanceMeters / 1000).toFixed(2)} km`);
    console.log(`  Duration: ${(requestToQuote.estimatedDurationSeconds / 60).toFixed(0)} min`);

    const quoteAmount = 5000; // KSh 5000
    const createQuoteResponse = await fetch(
      `${API_BASE_URL}/transport-requests/${requestToQuote.id}/quotes`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: quoteAmount,
          message: "Driver quote test",
        }),
      },
    );

    if (createQuoteResponse.ok) {
      const quoteData: any = await createQuoteResponse.json();
      console.log(`  ✅ Quote submitted successfully`);
      console.log(`  Quote ID: ${quoteData.data.id}`);
      console.log(`  Amount: KSh ${quoteData.data.amount}`);
      console.log(`  Status: ${quoteData.data.status}`);
    } else if (createQuoteResponse.status === 403) {
      const errorData = await createQuoteResponse.json();
      throw new Error(`❌ Quote submission rejected: ${errorData.error}`);
    } else {
      throw new Error(`❌ Quote submission failed: ${createQuoteResponse.statusText}`);
    }

    console.log("\n=== TEST PASSED ===\n");
    console.log("✅ Approved driver (karirig@gmail.com) can successfully:");
    console.log("   1. Login");
    console.log("   2. Access /api/drivers/me/quotes (passes verification check)");
    console.log("   3. View available requests");
    console.log("   4. Submit quotes");
    console.log("\nThe backend correctly recognizes this driver as verified.");
    console.log("The frontend should NOW display the quote form WITHOUT the pending warning.");
  } catch (error) {
    console.error("\n=== TEST FAILED ===\n");
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

testApprovedDriverQuote();
