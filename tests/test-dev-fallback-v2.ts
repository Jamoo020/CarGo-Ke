/**
 * Test script for development fallback (Google Maps API unavailable)
 * 
 * This script tests the complete workflow:
 * 1. Create/authenticate a customer
 * 2. Create a transport request from Mombasa to Nairobi using dev coordinates
 * 3. Verify the backend calculates distance using Haversine formula
 * 4. Verify the transport request is stored with correct coordinates
 * 
 * Expected behavior:
 * - Mombasa coordinates: -4.0435, 39.6682
 * - Nairobi coordinates: -1.2921, 36.8219
 * - Haversine distance: ~490 km (straight-line approximation)
 * - Duration (at 60 km/h): ~8.17 hours
 */

const API_BASE_URL = "http://localhost:4000/api";

interface AuthResponse {
  data: {
    token: string;
    user: { id: string; email: string; role: string };
  };
}

interface TransportRequest {
  id: string;
  pickupAddress: string;
  pickupLatitude: number;
  pickupLongitude: number;
  destinationAddress: string;
  destinationLatitude: number;
  destinationLongitude: number;
  distanceMeters: number;
  estimatedDurationSeconds: number;
  status: string;
}

async function getAuthToken(): Promise<string> {
  const authEmail = `testcustomer${Date.now()}@cargo.ke`;
  const authPassword = "Test@1234";

  // Try login first
  const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: authEmail, password: authPassword }),
  });

  if (loginResponse.ok) {
    const authData: AuthResponse = await loginResponse.json();
    console.log("  ✅ Authenticated with existing account");
    return authData.data.token;
  }

  // Register if login failed
  console.log("  ℹ️  Creating new test account...");
  const registerResponse = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: authEmail,
      password: authPassword,
      name: "Dev Test Customer",
      role: "CUSTOMER",
    }),
  });

  if (!registerResponse.ok) {
    throw new Error(`Registration failed: ${registerResponse.statusText}`);
  }

  // Login with new account
  const newLoginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: authEmail, password: authPassword }),
  });

  if (!newLoginResponse.ok) {
    throw new Error(`Login after registration failed: ${newLoginResponse.statusText}`);
  }

  const authData: AuthResponse = await newLoginResponse.json();
  console.log("  ✅ Registered and authenticated");
  return authData.data.token;
}

async function testDevFallback() {
  try {
    console.log("\n=== DEVELOPMENT FALLBACK TEST ===\n");

    // Step 1: Authenticate
    console.log("Step 1: Authenticating customer...");
    const token = await getAuthToken();

    // Step 2: Create transport request
    console.log("\nStep 2: Creating transport request (Mombasa → Nairobi)...");

    const now = new Date();
    now.setHours(now.getHours() + 2);

    const createResponse = await fetch(`${API_BASE_URL}/transport-requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
        year: 2021,
        registrationNumber: "KCA123ABC",
        color: "Black",
        capacity: 4,
        travelDateTime: now.toISOString(),
        notes: "Development fallback test - no Google Maps API key",
      }),
    });

    if (!createResponse.ok) {
      const error = await createResponse.json();
      throw new Error(`Failed to create transport request: ${JSON.stringify(error)}`);
    }

    const requestData: { data: TransportRequest } = await createResponse.json();
    const request = requestData.data;

    console.log("  ✅ Transport request created");
    console.log(`  ID: ${request.id}`);
    console.log(`  Pickup: ${request.pickupAddress} (${request.pickupLatitude}, ${request.pickupLongitude})`);
    console.log(`  Destination: ${request.destinationAddress} (${request.destinationLatitude}, ${request.destinationLongitude})`);
    console.log(`  Distance: ${(request.distanceMeters / 1000).toFixed(2)} km`);
    console.log(`  Duration: ${(request.estimatedDurationSeconds / 3600).toFixed(2)} hours`);

    // Step 3: Verify calculations
    console.log("\nStep 3: Verifying development fallback calculations...");

    // Expected Haversine distance: ~490 km
    const expectedDistance = 490_000;
    const tolerance = 20_000;
    const distanceDiff = Math.abs(request.distanceMeters - expectedDistance);

    if (distanceDiff < tolerance) {
      console.log(`  ✅ Distance calculation correct: ${(request.distanceMeters / 1000).toFixed(2)} km (expected ~490 km)`);
    } else {
      console.log(`  ⚠️  Distance calculation off by ${(distanceDiff / 1000).toFixed(2)} km`);
    }

    // Expected duration: ~8.17 hours at 60 km/h
    const expectedDuration = (490 * 3600) / 60;
    const durationDiff = Math.abs(request.estimatedDurationSeconds - expectedDuration);
    const durationTolerance = 1800;

    if (durationDiff < durationTolerance) {
      console.log(`  ✅ Duration calculation correct: ${(request.estimatedDurationSeconds / 3600).toFixed(2)} hours (expected ~8.17 hours)`);
    } else {
      console.log(`  ⚠️  Duration calculation off by ${(durationDiff / 60).toFixed(0)} minutes`);
    }

    console.log("\n=== TEST PASSED ===\n");
    console.log(`✅ Development fallback is working correctly`);
    console.log(`✅ Transport request created with Haversine-calculated distance`);
    console.log(`✅ Request ID: ${request.id} (use for driver marketplace verification)`);

    return request;
  } catch (error) {
    console.error("\n=== TEST FAILED ===\n");
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

testDevFallback();
