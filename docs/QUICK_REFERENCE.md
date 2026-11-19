# CarGo Kenya - Quick Reference Tables

## TABLE 1: EXISTING ROUTES

| Feature | Implemented? | Backend Route | Frontend Component | Main Files |
|---------|---|---|---|---|
| **Authentication** |
| Register | ✅ | POST /api/auth/register | RegisterPage.tsx | authService.ts, authController.ts |
| Login | ✅ | POST /api/auth/login | LoginPage.tsx | authService.ts, authController.ts |
| Get Current User | ✅ | GET /api/auth/me | — | authController.ts |
| Admin Check | ✅ | GET /api/auth/admin | — | authController.ts |
| **Admin - Users** |
| List Users | ✅ | GET /api/admin/users | UsersPage.tsx | adminService.ts |
| Get User | ✅ | GET /api/admin/users/:userId | UserDetailPage.tsx | adminService.ts |
| Update User Status | ✅ | PATCH /api/admin/users/:userId/status | UserDetailPage.tsx | adminService.ts |
| **Admin - Drivers** |
| List Drivers | ✅ | GET /api/admin/drivers | DriversPage.tsx | adminService.ts |
| Get Driver | ✅ | GET /api/admin/drivers/:driverId | DriverDetailPage.tsx | adminService.ts |
| Approve Driver | ✅ | PATCH /api/admin/drivers/:driverId/approve | DriverDetailPage.tsx | adminService.ts |
| Reject Driver | ✅ | PATCH /api/admin/drivers/:driverId/reject | DriverDetailPage.tsx | adminService.ts |
| Suspend Driver | ✅ | PATCH /api/admin/drivers/:driverId/suspend | DriverDetailPage.tsx | adminService.ts |
| Reactivate Driver | ✅ | PATCH /api/admin/drivers/:driverId/reactivate | DriverDetailPage.tsx | adminService.ts |
| **Admin - Trips** |
| List Trips | ✅ | GET /api/admin/trips | TripsPage.tsx | adminService.ts |
| Get Trip | ✅ | GET /api/admin/trips/:tripId | TripDetailPage.tsx | adminService.ts |
| **Admin - Payments** |
| List Payments | ✅ | GET /api/admin/payments | PaymentsPage.tsx | adminService.ts |
| Get Payment | ✅ | GET /api/admin/payments/:paymentId | PaymentDetailPage.tsx | adminService.ts |
| **Admin - Disputes** |
| Get Dispute | ✅ | GET /api/admin/disputes/:disputeId | DisputesPage.tsx | adminService.ts |
| Update Dispute | ✅ | PATCH /api/admin/disputes/:disputeId | DisputesPage.tsx | adminService.ts |
| **Admin - Configuration** |
| List Config | ✅ | GET /api/admin/config | ConfigPage.tsx | adminService.ts |
| Get Config Value | ✅ | GET /api/admin/config/:key | ConfigPage.tsx | adminService.ts |
| Update Config | ✅ | PATCH /api/admin/config/:key | ConfigPage.tsx | adminService.ts |
| **Admin - Audit** |
| List Audit Logs | ✅ | GET /api/admin/audit-logs | AuditLogsPage.tsx | adminAuditService.ts |
| **Admin - Wallet** |
| List Transactions | ✅ | GET /api/admin/wallet-transactions | — | adminService.ts |
| **Quotations** |
| Create Quote | ✅ | POST /api/quotes/:requestId | DriverQuotesPage.tsx | quoteService.ts |

---

## TABLE 2: AUTHORIZATION HIERARCHY

### Roles (UserRole enum)
```
ADMIN (can manage system, drivers, users)
CUSTOMER (can create requests, track trips)
DRIVER (can view requests, submit quotes, track trips)
AUTHORIZED_REPRESENTATIVE (can act on behalf of customers)
```

### Admin Capabilities
```
1. USER_MANAGEMENT - Manage users, suspend/deactivate
2. DRIVER_VERIFICATION - Approve/reject/suspend drivers
3. TRIP_OVERSIGHT - View all trips, search trips
4. PAYMENT_OVERSIGHT - View all payments, search payments
5. WALLET_OVERSIGHT - View wallet transactions
6. DISPUTE_MANAGEMENT - View/update disputes
7. CONFIGURATION_MANAGEMENT - Manage app configuration
8. AUDIT_LOG_ACCESS - View audit logs
```

### Route Protection Pattern
```
1. authenticate (verify JWT token valid)
2. authorize(["ADMIN"]) (check user.role === ADMIN)
3. requireAdminCapability(CAPABILITY) (check specific capability)
4. Action executed
5. Audit logged
```

---

## TABLE 3: DRIVER VERIFICATION STATE MACHINE

### States
```
PENDING (newly registered)
  ├─ → APPROVED (admin approved)
  └─ → REJECTED (admin rejected, terminal)

APPROVED (can quote)
  └─ → SUSPENDED (admin suspended)

SUSPENDED (cannot quote)
  └─ → APPROVED (admin reactivated)

REJECTED (terminal, cannot change)
  └─ (no transitions allowed)
```

### Associated Fields
```
Driver.verified
  - false if status = PENDING, REJECTED, or SUSPENDED
  - true if status = APPROVED only

Driver.verificationStatus
  - PENDING | APPROVED | REJECTED | SUSPENDED

Driver.verificationReason
  - Optional text set on rejection/suspension

Driver.verificationNotes
  - Optional text set on any decision

Driver.lastReviewedByUserId
  - Admin ID who last changed status
```

### Quotation Eligibility
```
Driver can submit quotes IF AND ONLY IF:
  - Driver.verified === true
  - Driver.verificationStatus === APPROVED
```

---

## TABLE 4: DATA MODEL RELATIONSHIPS

### User (center)
```
User
  ├─ Driver (one-to-one via userId)
  ├─ TransportRequest (as customer)
  ├─ Trip (as customer)
  ├─ DriverQuote (as rater if dispute)
  └─ Dispute (as raiser)
```

### Driver
```
Driver
  ├─ User (required, one-to-one)
  ├─ DriverQuote (one-to-many, quotes submitted)
  ├─ Trip (one-to-many, trips accepted)
  └─ GpsLocation (one-to-many, location history)
```

### TransportRequest → Trip → Payment
```
TransportRequest (customer request)
  ├─ Customer (User)
  ├─ VehicleDetail (vehicle info)
  ├─ DriverQuote (many quotes from drivers)
  └─ Trip (one trip, after customer selects quote)

Trip (booked request)
  ├─ TransportRequest (the original request)
  ├─ Driver (assigned driver)
  ├─ Payment (payment record)
  ├─ GpsLocation (real-time locations)
  └─ Dispute (if disputed)
```

---

## TABLE 5: DATABASE ENUMS

### UserRole
```
ADMIN - System administrator
CUSTOMER - Transportation request creator
DRIVER - Accepts requests and transports
AUTHORIZED_REPRESENTATIVE - Can act for customer
```

### DriverVerificationStatus
```
PENDING - Awaiting admin review (verified=false)
APPROVED - Admin approved (verified=true)
REJECTED - Admin rejected (verified=false, terminal)
SUSPENDED - Temporarily disabled (verified=false)
```

### AccountStatus
```
ACTIVE - Account can be used
SUSPENDED - Account suspended, cannot login
DEACTIVATED - Account deactivated, cannot login
```

### TripStatus
```
REQUESTED - Customer created request
QUOTING - Drivers submitting quotes
DRIVER_SELECTED - Customer selected quote
PAYMENT_PENDING - Awaiting payment
BOOKED - Trip confirmed
PICKUP_PENDING - Waiting to pick up
PICKUP_INSPECTION - Pre-trip inspection
TRIP_START_PENDING - Ready to depart
TRIP_ACTIVE - Trip in progress
IN_TRANSIT - Driving to destination
DELIVERY_PENDING - Arrived, awaiting delivery
DELIVERED - Delivered
COMPLETED - Trip finished
CANCELLED - Cancelled
DISPUTED - Under dispute
```

---

## TABLE 6: KEY SERVICE FUNCTIONS

### authService.ts
```
hashPassword(password) → hashed string
comparePassword(password, hash) → boolean
registerUser(email, password, fullName, role) → User
createJwtToken(payload) → JWT string
verifyJwtToken(token) → {userId, role}
```

### adminService.ts
```
assertAdminCapability(user, capability) → void (throws if not admin)
listUsersAdmin(filters) → User[]
getUserAdmin(userId) → User
updateUserAccountStatusAdmin(userId, status) → User
listDriversAdmin(filters) → Driver[]
getDriverAdmin(driverId) → Driver
approveDriverAdmin(driverId) → Driver (KEY FUNCTION)
rejectDriverAdmin(driverId, reason) → Driver
suspendDriverAdmin(driverId, reason) → Driver
reactivateDriverAdmin(driverId, reason) → Driver
```

### quoteService.ts
```
createDriverQuote(requestId, payload, user) → Quote
  • Calls getDriverForCurrentUser() which checks driver.verified
  • Throws 403 if verified=false

getDriverForCurrentUser(user) → Driver
  • Throws 403 if !driver.verified
```

### adminAuditService.ts
```
createAdminAuditLog(details) → AuditLog
  • Logs admin action: what, who, when, result
```

---

## TABLE 7: MIDDLEWARE STACK

### All Protected Routes
```
┌─ authenticate ─────────────┐  Verify JWT token valid
│  (authMiddleware.ts)       │  Extract {userId, role}
└────────────────────────────┘
              ↓
┌─ authorize(roles) ─────────┐  Check user.role in allowed roles
│  (authMiddleware.ts)       │  
└────────────────────────────┘
```

### Admin Routes Additionally
```
┌─ requireAdminCapability ───┐  Check user has specific capability
│  (adminMiddleware.ts)      │  Verify user.accountStatus = ACTIVE
└────────────────────────────┘
```

---

## TABLE 8: WHAT'S NOT IMPLEMENTED

### Complete Gaps ❌
- [ ] SUPERADMIN role
- [ ] Superadmin creation/seed
- [ ] Admin user management (can't change other admin permissions)
- [ ] Google Maps API key configuration
- [ ] Trip assignment (quote → trip creation)
- [ ] Payment processing completion
- [ ] Automatic dispute resolution
- [ ] Driver rating/review system

### Partial Gaps 🔄
- [ ] Real-time driver tracking (infrastructure exists, needs frontend integration)
- [ ] Advanced search filters
- [ ] Bulk operations
- [ ] Export audit logs
- [ ] Advanced dispute analytics

---

## TABLE 9: FILE INVENTORY

### Backend Authentication (6 files)
```
src/services/authService.ts - JWT, password, registration
src/services/userService.ts - User lookup
src/controllers/authController.ts - Auth endpoints
src/routes/authRoutes.ts - Auth routing
src/middleware/authMiddleware.ts - JWT verify, role check
src/middleware/errorHandler.ts - Error responses
```

### Backend Admin (4 files)
```
src/services/adminService.ts - All admin operations
src/services/adminAuditService.ts - Audit logging
src/controllers/adminController.ts - Admin endpoint handlers
src/routes/adminRoutes.ts - Admin route definitions
src/middleware/adminMiddleware.ts - Capability checking
```

### Backend Quotations (1 file)
```
src/services/quoteService.ts - Quotation creation with verified check
```

### Frontend Auth (3 files)
```
frontend/src/lib/auth.ts - Login, getCurrentUser
frontend/src/lib/storage.ts - Token persistence
frontend/src/types/auth.ts - Type definitions
frontend/src/pages/LoginPage.tsx - Login form
frontend/src/pages/RegisterPage.tsx - Registration form
```

### Frontend Admin (13 files)
```
frontend/src/lib/admin.ts - All admin API helpers
frontend/src/pages/AdminDashboardPage.tsx - Admin home
frontend/src/pages/admin/UsersPage.tsx - List users
frontend/src/pages/admin/UserDetailPage.tsx - User detail
frontend/src/pages/admin/DriversPage.tsx - List drivers
frontend/src/pages/admin/DriverDetailPage.tsx - Driver detail + approve/reject
frontend/src/pages/admin/TripsPage.tsx - List trips
frontend/src/pages/admin/TripDetailPage.tsx - Trip detail
frontend/src/pages/admin/PaymentsPage.tsx - List payments
frontend/src/pages/admin/PaymentDetailPage.tsx - Payment detail
frontend/src/pages/admin/DisputesPage.tsx - Disputes
frontend/src/pages/admin/ConfigPage.tsx - Configuration
frontend/src/pages/admin/AuditLogsPage.tsx - Audit logs
```

### Frontend Guards (2 files)
```
frontend/src/components/guard/ProtectedRoute.tsx - Require authentication
frontend/src/components/guard/RoleRoute.tsx - Require specific roles
```

### Database (1 file)
```
prisma/schema.prisma - All models and enums
```

---

## QUICK START: APPROVE A DRIVER

### Via Frontend (Easiest)
1. Admin logs in at `/login` with email/password
2. Redirects to `/admin` dashboard
3. Click "Drivers" link
4. Click on pending driver name
5. Click "Approve" button
6. Enter optional reason
7. Confirm dialog → Driver approved!
8. Driver can now submit quotes

### Via Backend API
```bash
# 1. Get admin token
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'
# Response: {"data": {"token": "eyJh...", "user": {...}}}

# 2. List drivers
curl -X GET http://localhost:4000/api/admin/drivers?status=PENDING \
  -H "Authorization: Bearer eyJh..."
# Response: [{"id": "driver-uuid", "verificationStatus": "PENDING", ...}]

# 3. Approve driver
curl -X PATCH http://localhost:4000/api/admin/drivers/driver-uuid/approve \
  -H "Authorization: Bearer eyJh..." \
  -H "Content-Type: application/json" \
  -d '{"reason": "License verified"}'
# Response: {"data": {"verified": true, "verificationStatus": "APPROVED", ...}}

# 4. Driver can now quote!
```

---

## KEY FACTS TO REMEMBER

1. **Quotation Gate**: `driver.verified` must be `true`
2. **Approval Sets**: `verified=true` AND `verificationStatus=APPROVED`
3. **Rejection Sets**: `verified=false` AND `verificationStatus=REJECTED` (terminal)
4. **Suspension Sets**: `verified=false` AND `verificationStatus=SUSPENDED` (can reactivate)
5. **No SUPERADMIN**: Only ADMIN role exists
6. **Audit Trail**: Every admin action logged with actor, time, previous/new state
7. **8 Capabilities**: ADMIN can have subset of capabilities (currently all-or-nothing)
8. **JWT Expiry**: 8 hours
9. **Token Storage**: localStorage (frontend)
10. **Middleware Order**: authenticate → authorize → requireAdminCapability

