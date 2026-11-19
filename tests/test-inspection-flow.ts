/**
 * Test: Inspection creation and photo retrieval flow
 */

const API_BASE_URL = "http://localhost:4000/api";

async function testInspectionFlow() {
  try {
    console.log("\n=== INSPECTION FLOW TEST ===\n");

    // Step 1: Create customer
    console.log("Step 1: Creating customer...");
    const customerEmail = `cust_inspection_${Date.now()}@cargo.ke`;
    const customerPassword = "Test@1234";

    await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: customerEmail,
        password: customerPassword,
        fullName: "Test Customer",
        role: "CUSTOMER",
      }),
    });

    const custLoginRes = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: customerEmail, password: customerPassword }),
    });
    const custData = await custLoginRes.json();
    const customerToken = custData.data.token;
    console.log("✅ Customer created");

    // Step 2: Create transport request
    console.log("\nStep 2: Creating transport request...");
    const createReqRes = await fetch(`${API_BASE_URL}/transport-requests`, {
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
        registrationNumber: `INSP-${Date.now()}`,
        color: "White",
        engineCC: 2500,
        vehicleType: "Van",
        capacity: 14,
        travelDateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        notes: "Inspection test",
      }),
    });
    const reqData = await createReqRes.json();
    const requestId = reqData.data.id;
    console.log(`✅ Request created: ${requestId}`);

    // Step 3: Create and approve driver
    console.log("\nStep 3: Creating driver...");
    const driverEmail = `drv_inspection_${Date.now()}@cargo.ke`;
    const driverPassword = "Test@1234";

    await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: driverEmail,
        password: driverPassword,
        fullName: "Test Driver",
        role: "DRIVER",
      }),
    });

    const drvLoginRes = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: driverEmail, password: driverPassword }),
    });
    const drvData = await drvLoginRes.json();
    const driverToken = drvData.data.token;
    const driverId = drvData.data.user.id;

    const { PrismaClient } = require("@prisma/client");
    const prisma = new PrismaClient();

    await prisma.driver.update({
      where: { userId: driverId },
      data: { verified: true, verificationStatus: "APPROVED" },
    });
    console.log("✅ Driver created and approved");

    // Step 4: Create quote and select
    console.log("\nStep 4: Creating and selecting quote...");
    const quoteRes = await fetch(`${API_BASE_URL}/transport-requests/${requestId}/quotes`, {
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
    });
    const quoteData = await quoteRes.json();
    const quoteId = quoteData.data.id;

    await fetch(`${API_BASE_URL}/quotes/${quoteId}/select`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${customerToken}`,
        "Content-Type": "application/json",
      },
    });

    const trip = await prisma.trip.findFirst({
      where: { transportRequestId: requestId },
      orderBy: { createdAt: "desc" },
    });
    const tripId = trip.id;
    console.log(`✅ Trip created: ${tripId}`);

    // Step 5: Simulate payment (transition to PICKUP_PENDING)
    console.log("\nStep 5: Creating payment to move to PICKUP_PENDING...");
    const payRes = await fetch(`${API_BASE_URL}/trips/${tripId}/payments`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${customerToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ providerReference: `test_insp_${Date.now()}` }),
    });
    
    if (payRes.ok) {
      console.log("✅ Payment created");
    }

    // Get updated trip status
    let currentTrip = await prisma.trip.findUnique({ where: { id: tripId } });
    console.log(`   Trip status after payment: ${currentTrip.status}`);

    // Step 6: Test inspection submission
    console.log("\nStep 6: Submitting inspection (driver uploads photos + creates inspection)...");

    // Create a simple test image (1x1 red pixel PNG)
    const redPixelPNG = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
      0xde, 0x00, 0x00, 0x00, 0x0c, 0x49, 0x44, 0x41, 0x54, 0x08, 0x99, 0x63, 0xf8, 0xcf, 0xc0, 0x00,
      0x00, 0x00, 0x03, 0x00, 0x01, 0x6c, 0x0e, 0x4f, 0x6b, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e,
      0x44, 0xae, 0x42, 0x60, 0x82,
    ]);

    // Upload photo
    const FormData = require("form-data");
    const form = new FormData();
    form.append("files", redPixelPNG, "test-photo.png");

    const uploadRes = await fetch(`${API_BASE_URL}/trips/${tripId}/inspections/photos`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${driverToken}`,
        ...form.getHeaders(),
      },
      body: form,
    });

    if (!uploadRes.ok) {
      const err = await uploadRes.text();
      throw new Error(`Photo upload failed: ${uploadRes.status} - ${err}`);
    }

    const photoData = await uploadRes.json();
    console.log(`✅ Photo uploaded`);
    console.log(`   URL: ${photoData.data[0].url}`);

    const photoUrl = photoData.data[0].url;

    // Now create the inspection with the photo URL
    console.log("\nStep 7: Creating inspection with photo...");
    const inspectionRes = await fetch(`${API_BASE_URL}/trips/${tripId}/inspections`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${driverToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "PICKUP",
        photoUrls: [photoUrl],
        odometer: 45000,
        fuelLevel: 50,
        vehicleCondition: "Good",
        damageNotes: "None",
        observations: "Vehicle is in good condition",
        handoverConfirmed: true,
      }),
    });

    if (!inspectionRes.ok) {
      const err = await inspectionRes.json();
      throw new Error(`Inspection creation failed: ${inspectionRes.status} - ${JSON.stringify(err)}`);
    }

    const inspectionData = await inspectionRes.json();
    console.log(`✅ Inspection created`);
    console.log(`   ID: ${inspectionData.data.id}`);
    console.log(`   Type: ${inspectionData.data.type}`);
    console.log(`   Photo URLs: ${JSON.stringify(inspectionData.data.photoUrls)}`);

    // Step 8: Customer retrieves inspection
    console.log("\nStep 8: Customer retrieving inspection...");
    const getInspRes = await fetch(`${API_BASE_URL}/trips/${tripId}/inspections`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${customerToken}`,
      },
    });

    if (!getInspRes.ok) {
      throw new Error(`Failed to get inspections: ${getInspRes.status}`);
    }

    const inspections = await getInspRes.json();
    console.log(`✅ Customer retrieved inspections`);
    console.log(`   Count: ${inspections.data.length}`);

    if (inspections.data.length > 0) {
      const pickup = inspections.data.find((i) => i.type === "PICKUP");
      if (pickup) {
        console.log(`   PICKUP inspection found`);
        console.log(`   Photo URLs: ${JSON.stringify(pickup.photoUrls)}`);

        // Step 9: Test retrieving the photo
        if (pickup.photoUrls && pickup.photoUrls.length > 0) {
          console.log("\nStep 9: Customer retrieving photo...");
          const photoUrl = pickup.photoUrls[0];
          const fileName = photoUrl.split("/").pop();
          
          const photoGetRes = await fetch(
            `${API_BASE_URL}/trips/${tripId}/inspections/photos/${fileName}`,
            {
              method: "GET",
              headers: {
                "Authorization": `Bearer ${customerToken}`,
              },
            }
          );

          if (photoGetRes.ok) {
            console.log(`✅ Photo retrieved successfully (${photoGetRes.headers.get("content-type")})`);
          } else {
            console.log(`❌ Photo retrieval failed: ${photoGetRes.status}`);
          }
        }
      }
    }

    console.log("\n=== TEST COMPLETE ===");
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error("\n❌ TEST FAILED:");
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

testInspectionFlow();
