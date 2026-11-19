# CarGo Kenya Google Maps & Live Tracking - Setup Guide

## Overview

This guide covers the complete Google Maps integration for the CarGo Kenya platform, including:
- Location selection via Google Maps and Places Autocomplete
- Route calculation with distance/duration
- Live trip tracking with Socket.IO realtime driver location updates

## Prerequisites

- Node.js v22+
- PostgreSQL (cargo_kenya_dev database at localhost:5433)
- Google Cloud Platform account with Maps API enabled

## Backend Setup

### 1. Install Dependencies

```bash
cd c:\Users\USER\OneDrive\Documents\CarGo Ke
npm install
```

### 2. Configure Environment Variables

Create/update `.env`:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5433/cargo_kenya_dev

# JWT
JWT_SECRET=your-secret-key-here

# Google Maps (Server-side Route Calculation)
GOOGLE_MAPS_API_KEY=YOUR_SERVER_API_KEY

# Optional
NODE_ENV=development
PORT=4000
PAYMENT_PROVIDER_CURRENCY=KES
```

### 3. Database Setup

```bash
# Apply migrations (including Google Maps location fields)
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# (Optional) Seed data
node scripts/seed.js
```

### 4. Build and Run Backend

```bash
npm run build
npm start
```

Server runs on `http://localhost:4000`

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment Variables

Create/update `frontend/.env.local`:

```env
VITE_API_BASE_URL=http://localhost:4000/api
VITE_GOOGLE_MAPS_BROWSER_KEY=YOUR_BROWSER_API_KEY
```

### 3. Run Development Server

```bash
npm run dev
```

Server runs on `http://localhost:5174`

## Google Cloud Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable these APIs:
   - Maps JavaScript API
   - Places API
   - Routes API

### Step 2: Create API Keys

1. **For Backend (Route Calculation)**:
   - Go to Credentials
   - Create API key
   - Restrict to "Routes API"
   - Copy to `GOOGLE_MAPS_API_KEY` env var

2. **For Frontend (Maps & Places)**:
   - Create another API key
   - Restrict to "Maps JavaScript API" and "Places API"
   - Add HTTP referrers: `http://localhost:5174/*`
   - Copy to `VITE_GOOGLE_MAPS_BROWSER_KEY` env var

### Step 3: Test Keys

```bash
# Backend test
curl -X POST https://routes.googleapis.com/directions/v2:computeRoutes \
  -H "Content-Type: application/json" \
  -H "X-Goog-Api-Key: YOUR_SERVER_KEY" \
  -d '{
    "origin": {"location": {"latLng": {"latitude": -1.286389, "longitude": 36.815225}}},
    "destination": {"location": {"latLng": {"latitude": -1.3524, "longitude": 36.6906}}},
    "travelMode": "DRIVE"
  }'
```

## Testing

### 1. End-to-End Vehicle Flow

Tests vehicle details and driver marketplace safety:

```bash
node scripts/debug/e2e_vehicle_flow.js
```

Expected output:
- ✅ Customer creates request with vehicle details
- ✅ Backend persists vehicle info
- ✅ Driver marketplace shows vehicle details
- ✅ No registration number or customer PII exposed
- ✅ Pending driver cannot quote (403)
- ✅ Approved driver can quote (201)

### 2. End-to-End Google Maps Flow

Tests location selection and route calculation:

```bash
node scripts/debug/e2e_google_maps.js
```

Expected output:
- ✅ Customer registers and creates request
- ✅ Request stored with coordinates
- ✅ Route calculation (if API key configured):
  - distanceMeters: estimated kilometers
  - estimatedDurationSeconds: estimated travel time
  - routePolyline: encoded route path
- ✅ Driver marketplace displays distance/duration
- ✅ Driver can submit quote

### 3. Unit Tests

```bash
npm test
```

## API Endpoints

### Transport Requests (Customers)

```
POST   /api/transport-requests                 Create request
GET    /api/transport-requests                 List requests (customer owns)
GET    /api/transport-requests/:id             Get request details
POST   /api/transport-requests/:id/cancel      Cancel request
```

**Create Request Payload**:
```json
{
  "origin": "Nairobi CBD",
  "destination": "Karen",
  "pickupAddress": "Nairobi CBD, Kenya",
  "pickupLatitude": -1.286389,
  "pickupLongitude": 36.815225,
  "destinationAddress": "Karen, Nairobi, Kenya",
  "destinationLatitude": -1.3524,
  "destinationLongitude": 36.6906,
  "make": "Toyota",
  "model": "Hilux",
  "year": 2022,
  "registrationNumber": "KAB-123A",
  "color": "White",
  "engineCC": 2800,
  "vehicleType": "Pickup Truck",
  "capacity": 4,
  "travelDateTime": "2026-08-14T14:00:00Z",
  "notes": "Fragile cargo"
}
```

**Response**:
```json
{
  "data": {
    "id": "req-123",
    "customerId": "cust-456",
    "origin": "Nairobi CBD",
    "destination": "Karen",
    "pickupAddress": "Nairobi CBD, Kenya",
    "pickupLatitude": -1.286389,
    "pickupLongitude": 36.815225,
    "destinationAddress": "Karen, Nairobi, Kenya",
    "destinationLatitude": -1.3524,
    "destinationLongitude": 36.6906,
    "distanceMeters": 12500,
    "estimatedDurationSeconds": 1200,
    "routePolyline": "...",
    "status": "REQUESTED",
    "vehicleDetail": { ... },
    "createdAt": "2026-08-14T10:00:00Z"
  }
}
```

### Quotes (Drivers)

```
POST   /api/transport-requests/:id/quotes      Submit quote
GET    /api/transport-requests/:id/quotes      List quotes for request
GET    /api/driver-quotes                      List my quotes
```

### GPS Tracking (Drivers)

```
POST   /api/trips/:tripId/gps                  Submit driver location
GET    /api/trips/:tripId/gps                  Get all location history
GET    /api/trips/:tripId/gps/last             Get latest driver location
```

**GPS Payload**:
```json
{
  "latitude": -1.286389,
  "longitude": 36.815225,
  "accuracy": 10,
  "timestamp": "2026-08-14T10:05:00Z"
}
```

### Socket.IO Events (Realtime)

```
// Client subscribes
socket.emit('subscribe_trip', tripId)

// Server broadcasts to trip room
// Event: driver:location
{
  latitude: -1.286389,
  longitude: 36.815225,
  timestamp: "2026-08-14T10:05:00Z",
  accuracy: 10,
  driverId: "driver-123"
}

// Client unsubscribes
socket.emit('unsubscribe_trip', tripId)
```

## Frontend Pages

### 1. Create Transport Request
- **Route**: `/customer/create-request`
- **Components**:
  - LocationPicker (pickup location)
  - LocationPicker (destination location)
  - Vehicle details form
- **Features**:
  - Google Places Autocomplete for location search
  - Interactive map with point selection
  - "Use my location" button (geolocation)
  - Realtime validation

### 2. Driver Quotes Marketplace
- **Route**: `/driver/quotes`
- **Features**:
  - List available requests
  - Show vehicle details (make, model, year, etc.)
  - Display distance and estimated duration
  - Submit quote with amount

### 3. Trip Tracking
- **Route**: `/customer/trips/:tripId/track`
- **Components**:
  - Interactive map
  - Pickup/destination markers
  - Route polyline
  - Live driver location marker
- **Features**:
  - Real-time driver location updates (Socket.IO)
  - Route visualization
  - Distance/duration info

## Security Considerations

### Data Exposure Prevention

✅ **Safe**: Driver marketplace does not expose:
- Customer personal information
- Vehicle registration number
- Customer phone/email

✅ **Safe**: Backend validates:
- Driver must be verified (APPROVED status)
- Driver must be assigned to trip for GPS updates
- Trip must be active (TRIP_ACTIVE or IN_TRANSIT status)

✅ **Safe**: API keys are:
- Server-side key (GOOGLE_MAPS_API_KEY) for backend route calculation
- Browser-restricted key for frontend (HTTP referrer restriction)
- Never exposed in client-side code

### Potential Improvements

- Rate limit GPS submission (e.g., max 1 update/second per trip)
- Add IP-based geo-verification for driver locations
- Implement polyline simplification for privacy
- Add customer consent for real-time location sharing

## Troubleshooting

### "Google Maps API key not configured"
- Ensure `GOOGLE_MAPS_API_KEY` is set in `.env`
- Verify API key has Routes API enabled
- Check key restrictions and quotas in Cloud Console

### "Cannot find module 'socket.io'"
```bash
npm install socket.io http
```

### "Cannot find Google Maps in browser"
- Ensure `VITE_GOOGLE_MAPS_BROWSER_KEY` is set in `frontend/.env.local`
- Check browser console for script loading errors
- Verify API key has Maps JavaScript API and Places API enabled

### "Location updates not appearing"
- Check Socket.IO connection: `http://localhost:4000` should not require auth
- Verify driver location endpoint returns 201
- Check browser console for Socket.IO errors
- Ensure trip room subscription is active

### Database migration fails
```bash
# Force regenerate schema
npx prisma migrate deploy --skip-generate
npx prisma generate
```

## Performance Optimization

### Frontend
- Location autocomplete uses session tokens to reduce API cost
- Polyline encoded to minimize data transfer
- Map zoom adapted based on distance

### Backend
- Route calculation only triggered if coordinates provided
- Results cached via database (can add Redis layer)
- GPS location history paginated in list endpoint

### Google Cloud
- Enable response compression
- Use session tokens for Places API (33% cost reduction)
- Set appropriate API quotas

## Next Steps

1. **Set up Google Cloud project** (see Google Cloud Setup)
2. **Test backend** with `e2e_google_maps.js`
3. **Start frontend dev server** and navigate to request creation
4. **Select locations** using interactive map
5. **Submit request** and verify in marketplace
6. **Driver submits quote** and trip is created
7. **Driver sends GPS locations** from tracking API
8. **Customer views live tracking** page

## Support

For issues or questions:
1. Check logs: `npm run dev` output or browser console
2. Verify environment variables are set
3. Test API endpoints manually with curl
4. Check Google Cloud Console quotas and errors
