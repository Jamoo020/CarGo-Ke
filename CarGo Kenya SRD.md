**CarGo Kenya**

**SYSTEM REQUIREMENTS AND DESIGN DOCUMENT**

**Project Name:** CarGo Kenya  
**Document Title:** System Requirements and Design Document  
**Version:** 1.0  
**Prepared By:** Project Founder  
**Prepared For:** CarGo Kenya System Development and Implementation  
**Document Status:** Draft  
**Date:** August 2026

**1.0 INTRODUCTION**

**1.1 Purpose of the Document**

This System Requirements and Design Document defines the functional, technical, operational, and non-functional requirements for the CarGo Kenya digital vehicle transportation platform.

The document translates the business requirements and MVP scope established in the CarGo Kenya Business Requirements Document (BRD) and MVP Scope and Product Requirements Document into a structured system specification that can be used during system design and development.

The purpose of this document is to provide a clear reference for how the CarGo Kenya system should behave, how users should interact with it, how information should move through the platform, and how the major system components should work together.

The document is intended to reduce ambiguity during development and ensure that the system is built according to the business processes already defined for CarGo Kenya.

**1.2 System Purpose**

CarGo Kenya is a digital marketplace and transportation coordination platform designed to connect customers requiring vehicle transportation with verified professional drivers.

The system will allow customers to:

- Create vehicle transportation requests.
- Provide vehicle and journey information.
- Receive quotations from eligible drivers.
- Select a suitable driver.
- Make the required payment through the platform.
- Monitor transportation progress.
- Review vehicle inspection records.
- Confirm trip commencement.
- Confirm vehicle delivery.
- Rate the driver.
- Access historical transportation records.

The system will allow verified drivers to:

- Create professional accounts.
- Submit verification information.
- Build professional profiles.
- View eligible transportation opportunities.
- Submit quotations.
- Accept transportation assignments.
- Conduct digital vehicle inspections.
- Record vehicle condition, fuel level, and odometer readings.
- Update transportation milestones.
- Provide GPS location information during active trips.
- Complete vehicle delivery procedures.
- Receive eligible transportation earnings through the Driver Personal Wallet.
- Build a verifiable professional reputation.

The system will also provide administrators with the tools required to manage users, verify drivers, monitor trips, review transactions, handle disputes, and maintain operational control of the platform.

**1.3 Relationship with the BRD and MVP**

The System Requirements and Design Document is derived from the requirements established in the CarGo Kenya BRD and MVP documentation.

The relationship between the documents is:

**Business Requirements Document (BRD)**  
↓  
Defines the business problem, objectives, business rules, stakeholders, and overall requirements.

**MVP Scope and Product Requirements Document**  
↓  
Defines which capabilities are included in the first version of CarGo Kenya.

**System Requirements and Design Document**  
↓  
Defines how those approved MVP capabilities should behave within the software system.

**System Modules and Technical Implementation**  
↓  
The approved system requirements will subsequently be translated into database structures, APIs, interfaces, workflows, and application code.

The System Requirements and Design Document therefore **does not replace the BRD or MVP document**. It provides the system-level interpretation of the requirements contained in those documents.

**1.4 System Scope**

The initial system will cover the core CarGo Kenya transportation lifecycle.

The system scope will include:

1.  Customer account management.
2.  Driver account management.
3.  Driver verification.
4.  Customer transportation requests.
5.  Driver quotations.
6.  Driver selection.
7.  Booking confirmation.
8.  Customer payment.
9.  Trip Wallet management.
10. Driver Personal Wallet management.
11. Pickup coordination.
12. Vehicle inspection.
13. Inspection photography.
14. Odometer and fuel recording.
15. Trip-start confirmation.
16. GPS-based trip tracking.
17. Transportation milestones.
18. Delivery inspection.
19. Delivery confirmation.
20. Trip completion.
21. Driver payment release.
22. Customer ratings and reviews.
23. Notifications.
24. Basic dispute handling.
25. Administrator management.
26. Basic operational analytics.
27. Trip and transaction record keeping.

The system will initially focus on vehicle transportation within Kenya, particularly transportation originating from Mombasa and other locations supported by the available driver network.

**1.5 Core System Principle**

The CarGo Kenya system shall be designed around the principle of **trusted and accountable vehicle transportation**.

The system should therefore ensure that important stages of a transportation assignment produce a verifiable digital record.

For example:

**Vehicle Pickup**

→ Vehicle identification  
→ Inspection  
→ Photographs  
→ Odometer recording  
→ Fuel recording  
→ Condition confirmation  
→ Handover confirmation

**Trip Commencement**

→ Driver selects **START TRIP**  
→ Customer confirms  
→ Trip becomes **TRIP ACTIVE**  
→ First 50% of eligible driver transportation fee is released

**Vehicle Delivery**

→ Arrival  
→ Delivery inspection  
→ Photographs  
→ Odometer/fuel recording where applicable  
→ Handover  
→ Customer confirmation  
→ Driver confirmation  
→ Trip becomes **COMPLETED**  
→ Remaining eligible driver balance is released

This approach ensures that the system does not simply record that a trip happened, but also maintains evidence of important events throughout the transportation process.

**1.6 System Design Principles**

The CarGo Kenya system shall follow the following design principles.

**1.6.1 Simplicity**

The system should provide clear workflows that can be understood by customers, drivers, and administrators without requiring extensive technical knowledge.

**1.6.2 Trust and Accountability**

Important transportation activities should generate appropriate records and confirmations.

**1.6.3 Security**

Personal information, driver verification documents, vehicle information, payment records, and trip information must only be accessible to authorized users.

**1.6.4 Controlled Automation**

The system should automate repetitive and predictable processes while allowing administrator intervention where human judgment is required.

**1.6.5 Evidence-Based Operations**

The system should generate reliable records that can be used to investigate disputes, monitor performance, and improve the platform.

**1.6.6 MVP-First Development**

The initial implementation should focus on the approved MVP requirements rather than introducing unnecessary advanced functionality.

**1.6.7 Future Scalability**

The system should be structured so that additional capabilities can be introduced later without requiring a complete redesign of the platform.

**1.7 Core System Workflow**

At a high level, the CarGo Kenya system will support the following workflow:

**Customer Registration**  
↓  
**Transportation Request**  
↓  
**Eligible Drivers Receive Request**  
↓  
**Driver Quotations**  
↓  
**Customer Selects Driver**  
↓  
**Payment Pending**  
↓  
**Customer Pays Full Trip Cost**  
↓  
**Trip Wallet Created/Updated**  
↓  
**Booking Confirmed**  
↓  
**Pickup Pending**  
↓  
**Pickup Inspection**  
↓  
**Trip Start Pending**  
↓  
**Driver Selects START TRIP**  
↓  
**Customer Confirms Trip Start**  
↓  
**TRIP ACTIVE**  
↓  
**First 50% Driver Fee Released**  
↓  
**GPS Tracking + Trip Milestones**  
↓  
**Delivery Pending**  
↓  
**Delivery Inspection**  
↓  
**Customer + Driver Confirm Completion**  
↓  
**COMPLETED**  
↓  
**Remaining 50% Driver Fee Released**  
↓  
**Customer Rating**

This workflow represents the central system process around which the major CarGo Kenya modules will be designed.

**1.8 System Users**

The system will primarily support the following user categories:

**1.8.1 Customer**

The customer initiates and manages vehicle transportation requests.

**1.8.2 Driver**

The driver provides the transportation service and performs the required pickup, transportation, inspection, tracking, and delivery activities.

**1.8.3 Administrator**

The administrator manages platform operations, verification, disputes, users, trips, payments, and system configuration.

**1.8.4 Authorized Representative**

Where a customer is represented by another authorized person, such as a clearing agent arranging transportation on behalf of a vehicle owner or customer, the system must maintain an accurate record of who initiated or authorized the transportation request.

The MVP does not require a separate advanced clearing-agent ecosystem. Such functionality can be expanded in a future version.

**1.9 System Requirements Approach**

The requirements in this document will be organized according to the major system components and user workflows.

Each major requirement will identify, where applicable:

- The responsible user or system component.
- Required information.
- Expected system behaviour.
- Validation requirements.
- Resulting system status.
- Related records.
- Security or access requirements.
- Dependencies on other system components.

This structure will make it possible to subsequently convert the requirements into:

**System Modules → Database Design → API Requirements → User Interfaces → Development Tasks**

**1.10 Document Organization**

The remainder of this document will define the CarGo Kenya system in progressively greater detail.

The major sections will cover:

- System actors and roles.
- System architecture.
- Customer functionality.
- Driver functionality.
- Administrator functionality.
- Trip management.
- Payment and wallet management.
- Vehicle inspection.
- GPS and tracking.
- Notifications.
- Security and access control.
- Data requirements.
- Non-functional requirements.
- System workflows.
- MVP system boundaries.
- Future system considerations.

The detailed technical implementation will be developed only after the system requirements have been sufficiently defined and reviewed.

**1.11 Chapter Summary**

The CarGo Kenya system is intended to provide a structured digital environment for coordinating vehicle transportation between customers and verified professional drivers.

The system will support the complete transportation lifecycle, from transportation request and driver selection through payment, pickup inspection, active transportation, delivery, payment release, and customer feedback.

The system will prioritize **trust, accountability, security, simplicity, and controlled automation**, while maintaining sufficient flexibility for future expansion.

**2.0 SYSTEM ACTORS AND ROLES**

**2.1 Overview**

The CarGo Kenya platform will operate as a role-based system. Different users will have different responsibilities, permissions, and access to information.

The purpose of role-based access control is to ensure that:

1.  Users can only perform actions appropriate to their role.
2.  Sensitive information is not unnecessarily exposed.
3.  Customers cannot modify driver verification information.
4.  Drivers cannot modify customer payment records.
5.  Administrators can perform controlled operational functions.
6.  Financial transactions remain associated with the correct trip.
7.  Actions performed by users can be traced through system records.

The initial MVP will support four operational actor categories:

1.  **Customer**
2.  **Driver**
3.  **Administrator**
4.  **Authorized Representative**

The Authorized Representative does not necessarily represent a completely separate user role in the MVP. Depending on the implementation, the person may operate through a customer-type account while the system records their relationship to the vehicle owner or receiving customer.

**2.2 Customer**

**2.2.1 Definition**

A Customer is an individual or authorized party that uses CarGo Kenya to arrange transportation of a vehicle.

The customer may be:

- The vehicle owner.
- A person acting on behalf of the vehicle owner.
- A business requiring vehicle transportation.
- An authorized representative arranging transportation for another party.

The Customer is primarily responsible for:

- Creating transportation requests.
- Providing accurate vehicle information.
- Providing pickup and destination information.
- Reviewing driver quotations.
- Selecting a driver.
- Making payment.
- Confirming trip commencement.
- Monitoring the transportation process.
- Confirming delivery.
- Rating the driver.

**2.3 Customer Account**

A customer account shall contain information required to identify and communicate with the customer.

The account should contain:

| **Field** | **Purpose** |
| --- | --- |
| Customer ID | Unique system identifier |
| Full Name | Customer identification |
| Phone Number | Communication and account verification |
| Email | Notifications where applicable |
| Password/Auth Credentials | Authentication |
| Account Status | Active, suspended, etc. |
| Verification Status | Basic account verification |
| Date Created | Account history |
| Last Login | Security/activity tracking |

The system should distinguish between **account information** and **trip information**.

For example:

A customer's phone number belongs to the account.

The vehicle registration number belongs to a particular transportation request.

This prevents unnecessary duplication of account information across multiple trips.

**2.4 Customer Permissions**

A Customer shall be permitted to:

**Account Management**

- Register an account.
- Log in.
- Log out.
- Update permitted profile information.
- Change authentication credentials.
- View account status.

**Transportation Requests**

- Create a transportation request.
- Edit a request while it is still editable.
- Cancel a request where cancellation rules permit.
- View submitted requests.
- View request status.

**Driver Selection**

- View eligible driver quotations.
- Compare quotations.
- View driver professional profiles.
- View driver rating.
- View completed trips.
- View route experience.
- View years of experience.
- View Verified Driver status.
- Select a driver.

**Payments**

- View the calculated trip price.
- View the price breakdown.
- Make the required payment.
- View payment status.
- View transaction records associated with their trips.

**Active Trips**

- View trip status.
- View driver information required for trip execution.
- View GPS/tracking information.
- View trip milestones.
- Receive trip notifications.
- Confirm trip commencement.
- Report a problem.

**Delivery**

- Review delivery information.
- Review delivery inspection information.
- Confirm successful delivery.
- Raise a dispute where appropriate.

**Post-Trip**

- View completed trip.
- Rate driver.
- Submit written feedback.
- View previous trips.

**2.5 Customer Restrictions**

The Customer shall **not** be permitted to:

- Approve their own driver verification.
- Modify driver verification documents.
- Modify driver ratings.
- Release driver funds manually.
- Modify the Trip Wallet balance.
- Modify CarGo commission.
- Modify payment records.
- Mark a trip COMPLETED without satisfying the required completion workflow.
- Access another customer's trip records.
- Access another customer's payment information.
- Access private driver verification documents.
- Change historical inspection records.

These operations must either be controlled by the system or restricted to administrators.

**2.6 Driver**

**2.6.1 Definition**

A Driver is a professional vehicle transport operator who uses CarGo Kenya to obtain transportation assignments.

Because the driver is responsible for physically transporting a customer's vehicle, driver verification is a fundamental trust mechanism within the platform.

A driver must therefore complete the required verification process before becoming eligible to accept transportation assignments.

**2.7 Driver Account**

The Driver account will contain both personal and professional information.

The account should include:

| **Information** | **Purpose** |
| --- | --- |
| Driver ID | Unique system identifier |
| Full Name | Identity |
| Phone Number | Communication |
| Email | Account communication |
| Profile Photograph | Customer identification |
| National ID information | Verification |
| Driving Licence information | Verification |
| Years of Experience | Professional profile |
| Professional Biography | Customer-facing profile |
| Route Experience | Customer decision-making |
| Verification Status | Determines eligibility |
| Account Status | Determines account access |
| Rating | Reputation |
| Completed Trips | Reputation |
| Wallet Information | Earnings management |
| Registration Date | Account history |

**2.8 Driver Verification Status**

The system should maintain a distinct verification status.

Possible statuses include:

**PENDING**

Driver has registered but verification has not yet been completed.

**UNDER REVIEW**

Submitted documents are being reviewed.

**APPROVED**

Driver has passed the verification process.

**REJECTED**

Driver verification has been rejected.

**ACTION REQUIRED**

Additional or corrected information is required.

**SUSPENDED**

The driver's ability to perform platform activities has been temporarily restricted.

The exact status model should be implemented centrally so that other modules can determine whether a driver is eligible for assignments.

**2.9 Driver Eligibility Rule**

The core system rule is:

**Only an approved and active driver may accept a transportation assignment.**

Therefore, before allowing a driver to accept an assignment, the system should verify:

1.  Driver account exists.
2.  Driver account is active.
3.  Driver verification is approved.
4.  Driver has not been suspended.
5.  Driver is eligible for the relevant trip.

This validation should occur **on the server side**, not only on the user interface.

For example, hiding an "Accept Trip" button is not sufficient security.

The backend must also reject an unauthorized request to accept a trip.

**2.10 Driver Permissions**

A verified Driver shall be able to:

**Account**

- Register.
- Complete profile.
- Submit verification documents.
- View verification status.
- Update permitted profile information.

**Transportation Opportunities**

- View eligible transportation requests.
- Review relevant vehicle and journey information.
- Submit a quotation.
- Modify a quotation where the request remains open.
- Withdraw a quotation where permitted.

**Assigned Trips**

- View assigned trip.
- View required customer information.
- View vehicle information.
- View pickup location.
- View destination.
- View agreed transportation fee.
- View relevant fuel budget information.
- View trip status.

**Pickup**

- Confirm arrival at pickup location.
- Begin pickup inspection.
- Capture required photographs.
- Record odometer.
- Record fuel level.
- Record visible damage.
- Record observations.
- Complete handover confirmation.

**Trip Commencement**

- Select **START TRIP** after required pickup procedures are completed.
- Trigger the customer trip-start confirmation request.
- View whether the customer has confirmed.

**Transportation**

- Provide GPS location.
- Update trip milestones.
- Record relevant events.
- Report delays or problems.
- Submit approved trip changes.

**Delivery**

- Confirm arrival.
- Complete delivery inspection.
- Capture required photographs.
- Record odometer.
- Record fuel level where applicable.
- Record vehicle condition.
- Complete handover.
- Confirm trip completion.

**Earnings**

- View eligible earnings.
- View pending earnings.
- View released earnings.
- View wallet transactions.
- Request withdrawal of available funds.

**2.11 Driver Restrictions**

A Driver shall not be permitted to:

- Accept trips while unverified.
- Modify customer payment records.
- Modify CarGo commission.
- Release their own held funds.
- Directly withdraw funds from an active Trip Wallet.
- Modify completed inspection records.
- Modify customer ratings.
- Mark a trip completed without performing the required completion process.
- Access unrelated customer accounts.
- Access another driver's wallet.
- Modify another driver's profile.
- Approve their own disputes.

**2.12 Administrator**

**2.12.1 Definition**

The Administrator is a trusted operational user responsible for managing and supervising the CarGo Kenya platform.

The Administrator provides human oversight for processes that cannot safely or reasonably be fully automated in the MVP.

Examples include:

- Driver verification.
- Dispute resolution.
- Account suspension.
- Exceptional payment adjustments.
- Investigation of reported incidents.

**2.13 Administrator Permissions**

Administrators may:

**User Management**

- View customers.
- View drivers.
- Search users.
- Suspend accounts.
- Reactivate accounts where authorized.
- Review account activity.

**Driver Verification**

- Review submitted documents.
- Approve verification.
- Reject verification.
- Request additional information.
- Change verification status.
- Record verification decisions.

**Trip Management**

- View active trips.
- View completed trips.
- Search trips.
- Review trip status.
- Review inspection records.
- Review GPS/trip records.
- Review milestones.
- Review reported incidents.

**Payment Management**

- View payment transactions.
- View Trip Wallet records.
- View driver wallet transactions.
- Review payment failures.
- Review refunds.
- Review adjustments.
- Review payment-release records.

**Disputes**

- View disputes.
- Review submitted evidence.
- Review inspection photographs.
- Review relevant trip records.
- Record decisions.
- Apply authorized adjustments.
- Close disputes.

**Configuration**

Administrators may configure approved operational settings such as:

- Platform commission.
- Supported vehicle categories.
- Basic pricing parameters.
- Cancellation settings.
- Notification settings.

Configuration changes should be recorded in an audit trail.

**2.14 Administrator Restrictions**

Even administrators should not be treated as having unrestricted invisible access.

Sensitive administrative actions should require:

- Authentication.
- Appropriate permissions.
- Audit logging.

For example, when an administrator changes a driver's verification status, the system should record:

- Administrator ID.
- Previous status.
- New status.
- Date/time.
- Reason or administrative note where applicable.

This creates accountability within the platform itself.

**2.15 Authorized Representative**

**2.15.1 Definition**

An Authorized Representative is a person arranging transportation on behalf of the vehicle owner or receiving customer.

This may include a clearing agent or another person authorized by the customer.

The MVP does not require a fully separate Clearing Agent Portal.

Instead, the system should support the business process without introducing unnecessary complexity.

**2.16 Authorized Representative Requirements**

Where an authorized representative creates a transportation request, the system should maintain information indicating:

- Who created the request.
- Who is the customer/account holder.
- Who owns or controls the vehicle where applicable.
- Who is expected to receive the vehicle.
- Who is authorized to participate in pickup or delivery.

The exact relationship should be captured as trip-specific information rather than creating unnecessary duplicate user accounts.

**2.17 Contact Information and Communication**

The system must balance operational communication with platform protection.

Before booking, communication should primarily occur through controlled platform mechanisms where applicable.

After booking, the system may expose the contact information necessary for practical transportation coordination.

This is particularly important because the driver must be able to coordinate with the appropriate person at pickup and delivery.

The system should therefore not assume that hiding contact information permanently is practical.

The objective is to:

**Protect the platform's business model while still allowing the transportation service to function effectively.**

**2.18 Role-Based Access Control**

The system should implement role-based access control.

At minimum, the system should distinguish:

CUSTOMER

DRIVER

ADMINISTRATOR

AUTHORIZED REPRESENTATIVE

Each authenticated request should be associated with a user account and role.

The system should verify authorization before allowing access to protected resources.

For example:

Customer A

↓

Requests Trip CGK-2026-000125

↓

System checks:

Is user authenticated?

Is user the customer associated with this trip?

↓

YES → Allow access

NO → Reject request

The same principle applies to drivers and administrators.

**2.19 Resource-Level Authorization**

Role checks alone are not sufficient.

The system should also verify whether the authenticated user is authorized to access the **specific resource**.

For example:

A driver may have permission to view trips generally, but Driver A should only be able to access:

Trips assigned to Driver A or trips for which Driver A is an eligible participant.

Driver A should not be able to request:

Customer B's unrelated trip.

Similarly, Customer A should not be able to access Customer B's payment information merely because both users have the CUSTOMER role.

**2.20 Auditability**

Important actions performed by users should be recorded.

Examples include:

- Account creation.
- Login/security events where appropriate.
- Driver verification decisions.
- Driver quotation.
- Driver selection.
- Payment confirmation.
- Trip status changes.
- Inspection submission.
- START TRIP action.
- Customer trip-start confirmation.
- Payment release.
- Delivery confirmation.
- Dispute submission.
- Administrative adjustments.
- Account suspension.

An audit record should generally contain:

- Actor/user ID.
- Action.
- Related resource.
- Timestamp.
- Previous state where relevant.
- New state where relevant.
- Additional metadata where necessary.

This information will be particularly important when investigating disputes.

**2.21 Role and Permission Summary**

| **Function** | **Customer** | **Driver** | **Administrator** |
| --- | --- | --- | --- |
| Create account | ✓   | ✓   | Controlled |
| Create trip request | ✓   | —   | ✓ where necessary |
| Submit quotation | —   | ✓   | —   |
| Select driver | ✓   | —   | ✓ oversight |
| Make payment | ✓   | —   | —   |
| View own trip | ✓   | ✓   | ✓   |
| Pickup inspection | —   | ✓   | View |
| Start trip | Confirm | Initiate | Monitor |
| GPS tracking | View | Provide | View |
| Delivery inspection | Confirm/View | Perform | View |
| Confirm delivery | ✓   | ✓   | Monitor |
| Rate driver | ✓   | —   | View |
| Manage wallet | Own payment view | Own wallet | Administrative oversight |
| Verify driver | —   | —   | ✓   |
| Manage disputes | Submit | Submit | Resolve |
| Suspend account | —   | —   | ✓   |
| Configure commission | —   | —   | ✓   |
| View platform analytics | Limited | Limited | ✓   |

**2.22 Chapter Summary**

The CarGo Kenya system will use role-based access control to separate customer, driver, administrator, and authorized-representative activities.

The **Customer** initiates and manages transportation requests.

The **Driver** provides the transportation service and performs the required inspection, tracking, and delivery activities.

The **Administrator** provides operational oversight and manages exceptional situations such as verification, disputes, and administrative adjustments.

The **Authorized Representative** allows the system to support real-world transportation arrangements made on behalf of vehicle owners or customers without unnecessarily introducing a complex separate portal during the MVP.

All important system operations must be protected by authentication, authorization, and appropriate audit records.

This role structure establishes the permission foundation required for the subsequent system modules.

**3.0 SYSTEM ARCHITECTURE AND MAJOR COMPONENTS**

**3.1 Overview**

The CarGo Kenya system will use a modular web-based architecture in which different parts of the application are responsible for specific functions.

The architecture should separate:

- User interfaces.
- Business logic.
- Data storage.
- Authentication and authorization.
- Payment processing.
- Trip and wallet management.
- GPS and tracking.
- File and image storage.
- Notifications.
- Administrative operations.

The purpose of this separation is to make the system easier to:

- Develop.
- Test.
- Maintain.
- Secure.
- Debug.
- Expand in future versions.

The MVP should avoid unnecessary architectural complexity. Components should only be introduced where they provide a clear purpose within the approved MVP.

**3.2 High-Level Architecture**

The proposed architecture is:

CARGo Kenya Users

│

┌───────────────┼────────────────┐

│ │ │

▼ ▼ ▼

Customer Driver Administrator

Interface Interface Interface

│ │ │

└───────────────┼────────────────┘

│

▼

Frontend Application

│

HTTPS / API

│

▼

Backend Application

│

┌─────────────────┼──────────────────┐

│ │ │

▼ ▼ ▼

Authentication Business Logic Notification

& Authorization & Workflows Service

│ │

│ ┌─────────┼──────────┐

│ │ │ │

▼ ▼ ▼ ▼

User Trip Payment Inspection

Management Management & Wallet Records

│

┌───────┼─────────┐

│ │ │

▼ ▼ ▼

Database File GPS/

Storage Location

This is a logical architecture. The actual implementation technology may be selected during technical planning, but the responsibilities of the components should remain clearly separated.

**3.3 Frontend Application**

**3.3.1 Purpose**

The frontend is the part of CarGo Kenya that users interact with directly.

It will provide the interfaces through which:

- Customers create requests.
- Drivers manage assignments.
- Customers make payments.
- Drivers perform inspections.
- Users monitor trips.
- Administrators manage the platform.

The frontend should communicate with the backend through secure API requests.

**3.3.2 Customer Interface**

The customer interface should provide screens/pages such as:

**Account**

- Registration.
- Login.
- Profile.
- Account settings.

**Transportation**

- Dashboard.
- Create transportation request.
- Request details.
- Driver quotations.
- Driver profile.
- Driver selection.
- Booking confirmation.

**Payment**

- Payment summary.
- Price breakdown.
- Payment initiation.
- Payment status.
- Transaction history.

**Active Trip**

- Trip status.
- Driver information.
- Vehicle information.
- GPS location.
- Trip milestones.
- Inspection information.
- Trip-start confirmation.
- Delivery confirmation.

**History**

- Completed trips.
- Cancelled trips.
- Disputed trips.
- Ratings/reviews.

**3.3.3 Driver Interface**

The driver interface should provide:

**Account**

- Registration.
- Login.
- Profile.
- Verification status.
- Document submission.

**Driver Dashboard**

The dashboard should provide information such as:

- Available transportation requests.
- Active assignment.
- Completed trips.
- Earnings.
- Rating.
- Verification status.

**Trip Management**

- Available requests.
- Request details.
- Submit quotation.
- Assigned trip.
- Pickup information.
- Inspection.
- Trip milestones.
- GPS tracking.
- Delivery.

**Wallet**

- Available balance.
- Pending earnings.
- Released earnings.
- Transaction history.
- Withdrawal requests.

**3.3.4 Administrator Interface**

The administrator interface should provide access to:

- Dashboard.
- Customer management.
- Driver management.
- Driver verification.
- Trip management.
- Payment monitoring.
- Trip Wallet records.
- Driver wallet records.
- Dispute management.
- Reports.
- Basic analytics.
- Platform configuration.
- Audit records.

Administrative functions should be protected by appropriate permissions.

**3.4 Backend Application**

**3.4.1 Purpose**

The backend is responsible for implementing the business rules of CarGo Kenya.

The frontend should **not** be responsible for making critical business decisions.

For example, the frontend may display:

"Release 50% Driver Payment"

but the backend must determine whether the conditions for releasing the payment have actually been satisfied.

The backend will therefore be responsible for:

- Authentication.
- Authorization.
- User management.
- Driver verification.
- Transportation requests.
- Quotations.
- Booking.
- Payment processing.
- Trip status management.
- Wallet calculations.
- Inspection records.
- GPS records.
- Notifications.
- Ratings.
- Disputes.
- Administrative operations.

**3.5 API Layer**

The frontend and backend should communicate through APIs.

A typical request should follow:

User

↓

Frontend

↓

API Request

↓

Backend

↓

Authentication

↓

Authorization

↓

Business Logic

↓

Database / External Service

↓

API Response

↓

Frontend

↓

User

For example:

Customer clicks "Confirm Trip Start"

↓

Frontend sends request

↓

Backend verifies customer

↓

Backend verifies trip

↓

Backend verifies trip is TRIP START PENDING

↓

Backend records confirmation

↓

Trip becomes TRIP ACTIVE

↓

Payment release logic is triggered

↓

Frontend displays updated status

**3.6 Business Logic Layer**

The business logic layer will contain the rules that determine how CarGo Kenya operates.

Examples include:

**Driver Eligibility**

IF driver.verification_status = APPROVED

AND driver.account_status = ACTIVE

THEN driver may accept eligible assignments.

Otherwise:

Reject assignment.

**Trip Start**

IF

pickup inspection completed

AND required photographs completed

AND odometer recorded

AND fuel level recorded

AND handover confirmed

AND driver selects START TRIP

AND customer confirms

THEN

trip status = TRIP ACTIVE

**First Driver Payment**

When the trip becomes officially active:

50% of agreed driver transportation fee

→ released from Trip Wallet

→ Driver Personal Wallet

**Final Driver Payment**

When the required delivery conditions are satisfied:

Remaining 50%

→ released from Trip Wallet

→ Driver Personal Wallet

These rules should exist in the backend rather than being trusted to frontend behaviour.

**3.7 Database**

**3.7.1 Purpose**

The database will store the structured information required to operate the platform.

The database should maintain relationships between:

- Users.
- Drivers.
- Vehicles.
- Transportation requests.
- Quotations.
- Trips.
- Payments.
- Trip Wallets.
- Driver Wallets.
- Inspections.
- GPS records.
- Milestones.
- Notifications.
- Ratings.
- Disputes.
- Audit records.

**3.7.2 Core Data Entities**

The initial database design is expected to contain entities similar to:

users

drivers

driver_verifications

vehicles

transport_requests

driver_quotes

trips

trip_wallets

wallet_transactions

driver_wallets

inspections

inspection_photos

trip_milestones

gps_locations

payments

refunds

ratings

disputes

notifications

audit_logs

These are **logical entities at this stage**, not yet the final database schema.

The actual fields, relationships, primary keys, foreign keys, indexes, and constraints will be defined in the database design section.

**3.8 Authentication System**

Authentication determines **who a user is**.

The system should provide secure authentication for:

- Customers.
- Drivers.
- Administrators.

The authentication system should support:

- Account registration.
- Login.
- Logout.
- Password protection.
- Password recovery where implemented.
- Session/token management.
- Account status checking.

Authentication must occur before accessing protected platform resources.

**3.9 Authorization System**

Authentication answers:

"Who are you?"

Authorization answers:

"What are you allowed to do?"

For example:

Authenticated Customer

↓

Can view own trips

↓

Cannot view another customer's trips

And:

Authenticated Driver

↓

Can view assigned trips

↓

Cannot modify payment records

Authorization must therefore be enforced at the backend level.

**3.10 Payment Gateway**

CarGo Kenya will require a payment mechanism through which customers can pay the full agreed trip cost.

The payment architecture should support:

Customer

↓

Payment Initiation

↓

Payment Provider

↓

Payment Confirmation

↓

CarGo Backend

↓

Trip Payment Record

↓

Trip Wallet

The system should not consider a payment successful merely because the customer reaches a payment page.

Payment confirmation should be based on a trusted confirmation from the payment provider.

**3.11 Trip Wallet**

The Trip Wallet is a logical financial record associated with an individual trip.

It is not intended to operate as a general customer bank account.

The Trip Wallet should track relevant amounts such as:

- Customer payment.
- Driver transportation fee.
- Fuel budget.
- CarGo service fee.
- Driver amount released.
- Driver amount remaining.
- Refunds.
- Adjustments.
- Payment status.
- Release status.

For example:

TOTAL CUSTOMER PAYMENT

KSh 36,000

│

├── Driver Fee: KSh 22,000

├── Fuel Budget: KSh 12,500

└── CarGo Fee: KSh 1,500

The system must maintain a clear transaction history rather than simply changing a single balance value.

**3.12 Driver Personal Wallet**

The Driver Personal Wallet represents money that has become available to the driver after meeting the applicable release conditions.

Example:

Driver Fee = KSh 22,000

Trip Active

↓

50% released

↓

KSh 11,000 available

Trip Completed

↓

Remaining 50% released

↓

KSh 11,000 available

Final available driver earnings:

KSh 22,000

The wallet should maintain transaction records for every credit and withdrawal.

**3.13 Fuel Budget**

The fuel budget should remain distinct from driver transportation earnings.

For example:

Customer Payment

│

├── Driver Transportation Fee

│

├── Fuel Budget

│

└── CarGo Service Fee

The fuel budget should therefore not automatically increase the driver's earnings.

The exact operational handling of fuel payments and receipts should follow the MVP business rules and should not be expanded into automated fuel-station integrations at this stage.

**3.14 File and Image Storage**

Vehicle inspections require photographs.

The system therefore requires controlled file storage.

Inspection images should be associated with:

- Trip ID.
- Inspection ID.
- Vehicle.
- Inspection type.
- Uploaded by.
- Timestamp.

For example:

Trip

└── Pickup Inspection

├── Front Photo

├── Rear Photo

├── Left Side

├── Right Side

├── Odometer

├── Fuel Gauge

└── Damage Photos

The same principle applies to delivery inspections.

The system should prevent unauthorized users from accessing private inspection images.

**3.15 GPS and Location Service**

The GPS component will provide trip visibility during active transportation.

The driver application/device may provide:

- Latitude.
- Longitude.
- Timestamp.
- Accuracy where available.
- Trip reference.

The backend will associate location information with the relevant active trip.

A simplified flow is:

Driver Device

↓

GPS Location

↓

Frontend

↓

Backend API

↓

GPS Record

↓

Trip

↓

Customer / Admin

The system should retain the last known location when the driver temporarily loses connectivity.

**3.16 Trip Milestone Service**

GPS alone does not provide a complete understanding of a transportation journey.

The milestone system will therefore record important events such as:

- Pickup completed.
- Trip started.
- Fuel stop.
- Major route milestone.
- Delay.
- Destination reached.
- Delivery inspection started.
- Delivery completed.

Each milestone should be associated with:

- Trip.
- User who created it.
- Milestone type.
- Timestamp.
- Optional location.
- Optional notes.

**3.17 Notification System**

The notification system will communicate important events to users.

Notifications may be delivered through mechanisms supported by the implementation, such as:

- In-app notifications.
- Email where applicable.
- SMS where required.

The notification system should not itself determine whether an event is valid.

For example:

Backend:

Trip status changed → TRIP ACTIVE

↓

Notification Service

↓

Customer:

"Your trip has officially started."

The notification is therefore a consequence of a verified system event.

**3.18 Administrative System**

The administrative component provides operational control.

It should allow administrators to:

Monitor

↓

Investigate

↓

Approve / Reject

↓

Resolve

↓

Record

Examples:

**Driver verification**

Driver submits documents

↓

Admin reviews

↓

Approve / Reject / Request Correction

↓

System records decision

**Dispute**

Customer reports issue

↓

Dispute created

↓

Admin reviews evidence

↓

Decision

↓

Financial/system adjustment if authorized

↓

Dispute closed

**3.19 Audit Logging**

The system should maintain an audit trail for important actions.

For example:

Actor: Driver 104

Action: START_TRIP

Trip: CGK-2026-000125

Time: 2026-08-08 14:30

Previous Status: TRIP_START_PENDING

New Status: TRIP_ACTIVE

Another example:

Actor: Customer 201

Action: CONFIRM_TRIP_START

Trip: CGK-2026-000125

Time: 2026-08-08 14:32

This information will help resolve disputes and investigate unexpected system behaviour.

**3.20 External Services**

The MVP may communicate with external services for specific functions.

Potential external services include:

| **Service** | **Purpose** |
| --- | --- |
| Payment Provider | Customer payments |
| Mapping/GPS Service | Location and mapping |
| Email Provider | Email notifications |
| SMS Provider | Important notifications |
| File Storage | Inspection images/documents |

The system should isolate external integrations behind appropriate service components.

This means that replacing a payment provider later should not require rewriting the entire trip-management system.

**3.21 System Communication Principle**

The different components should communicate through defined interfaces.

For example:

Customer Frontend

│

▼

Trip API

│

▼

Trip Service

│

├──── Database

│

├──── Payment Service

│

├──── Notification Service

│

└──── GPS Service

The goal is to avoid putting all application logic into one large codebase or one uncontrolled set of routes.

**3.22 Error Handling**

Every major system operation should have predictable failure handling.

For example, if payment fails:

Payment Attempt

↓

Payment Provider

↓

FAILED

↓

Trip remains PAYMENT PENDING

↓

Customer receives failure message

The system must not mark the trip as BOOKED simply because a payment was attempted.

Similarly, if customer trip-start confirmation has not occurred:

Driver → START TRIP

↓

Customer confirmation pending

↓

Trip remains TRIP START PENDING

↓

No first 50% release yet

This prevents financial actions from occurring before their required business conditions are satisfied.

**3.23 Architectural Security**

Security should be applied across all layers.

**Frontend**

- Secure authentication handling.
- Input validation.
- No exposure of sensitive credentials.
- Secure communication.

**Backend**

- Authentication.
- Authorization.
- Input validation.
- Request validation.
- Rate limiting where appropriate.
- Secure error handling.
- Audit logging.

**Database**

- Controlled access.
- Appropriate permissions.
- Data integrity constraints.
- Backups.
- Secure credentials.

**File Storage**

- Restricted access.
- Protected documents.
- Authorized retrieval only.

**Payment**

- Trusted payment confirmation.
- Transaction records.
- No client-side manipulation of payment amounts.

**3.24 Deployment Architecture**

The initial production architecture should remain simple enough for a solo developer to maintain.

A conceptual deployment may be:

Internet

│

▼

Web Application

│

▼

Backend Server

│

┌───────────┼───────────┐

▼ ▼ ▼

Database Storage External APIs

│

┌────────┼────────┐

▼ ▼ ▼

Payment GPS Notifications

The exact hosting provider and infrastructure can be selected during implementation.

The architecture should prioritize:

- Reliability.
- Security.
- Reasonable cost.
- Ease of deployment.
- Ease of maintenance.
- Ability to scale when usage increases.

**3.25 MVP Architecture Boundary**

The MVP should **not** require:

- Microservices.
- Complex event-driven infrastructure.
- AI infrastructure.
- Automated fuel-station APIs.
- Advanced route optimization.
- Complex financial infrastructure.
- Multiple independent backend applications.

A modular monolithic backend may be sufficient for the first version, provided that the code is properly organized into logical modules.

For a solo developer, this can significantly reduce development and deployment complexity.

**3.26 Recommended Logical Backend Modules**

The backend can initially be organized into modules such as:

/auth

/users

/drivers

/driver-verification

/vehicles

/transport-requests

/quotations

/trips

/inspections

/payments

/trip-wallet

/driver-wallet

/tracking

/milestones

/notifications

/ratings

/disputes

/admin

/audit

These are **logical application modules**, not necessarily separate servers.

For example:

Backend Application

│

├── Auth

├── Users

├── Drivers

├── Vehicles

├── Transport Requests

├── Quotations

├── Trips

├── Inspections

├── Payments

├── Trip Wallet

├── Driver Wallet

├── Tracking

├── Milestones

├── Notifications

├── Ratings

├── Disputes

├── Admin

└── Audit

This structure should make the eventual development process considerably easier.

**3.27 Chapter Summary**

The CarGo Kenya system will use a modular web-based architecture consisting of a frontend application, backend/API layer, database, authentication and authorization services, payment processing, wallet management, inspection storage, GPS tracking, notifications, and administrative controls.

The architecture will remain intentionally simple during the MVP stage.

The system will place critical business logic on the backend and will use role-based and resource-level authorization to protect information.

The architecture will also maintain clear boundaries between:

**Customer Interface → Backend → Business Logic → Database/External Services**

This structure provides the technical foundation required to convert the CarGo Kenya business requirements into actual software modules.

**4.0 CUSTOMER MODULE**

**4.1 Module Overview**

The Customer Module will provide customers with the functionality required to request, book, monitor, and complete vehicle transportation through CarGo Kenya.

The module will support the complete customer journey:

**Registration → Transportation Request → Driver Quotations → Driver Selection → Payment → Booking → Pickup → Trip Monitoring → Delivery → Completion → Rating**

The customer module must integrate with other system modules, particularly:

- Authentication Module.
- Driver Module.
- Transportation Request Module.
- Quotation Module.
- Payment Module.
- Trip Module.
- Trip Wallet Module.
- GPS and Tracking Module.
- Inspection Module.
- Notification Module.
- Rating and Review Module.

The customer should not be required to understand the internal technical processes of the platform. The interface should present the transportation process in a simple and understandable manner.

**4.2 Customer Registration**

A new customer must create an account before requesting transportation services.

**Required information**

The registration form should initially capture:

- Full name.
- Phone number.
- Email address where applicable.
- Password.
- Password confirmation.

The system should automatically generate:

- Customer ID.
- Account creation date.
- Account status.
- Verification status where applicable.

**Initial account status**

A newly registered customer may have:

**ACCOUNT ACTIVE**

provided that the required registration validation has been completed.

**4.3 Customer Login**

The customer should be able to securely access the platform using their registered credentials.

The login process should:

1.  Receive customer credentials.
2.  Validate the credentials.
3.  Confirm that the account exists.
4.  Confirm that the account is active.
5.  Create an authenticated session/token.
6.  Redirect the customer to the customer dashboard.

If authentication fails, the system should display an appropriate error without exposing sensitive information.

**4.4 Customer Dashboard**

The dashboard will serve as the customer's main control centre.

It should provide a summary of important information.

**Dashboard sections**

The dashboard may include:

**Active Trip**

- Trip reference.
- Vehicle.
- Driver.
- Current trip status.
- Current/last known location.

**Pending Actions**

Examples:

- Complete payment.
- Select driver.
- Confirm trip start.
- Confirm delivery.
- Submit rating.

**Recent Trips**

- Trip reference.
- Route.
- Driver.
- Date.
- Status.
- Total cost.

**Account Information**

- Customer name.
- Phone number.
- Account status.

The dashboard should prioritize active trips and actions requiring customer attention.

**4.5 Creating a Transportation Request**

The customer will initiate a transportation request when they need a vehicle transported.

The request form should collect the information necessary for CarGo Kenya to identify the vehicle, determine the transportation requirements, and allow eligible drivers to provide quotations.

**Vehicle information**

The customer should provide:

- Vehicle make.
- Vehicle model.
- Vehicle registration number where available.
- Vehicle category/type.
- Vehicle condition.
- Any relevant special information.

**Transportation information**

The customer should provide:

- Pickup location.
- Destination.
- Preferred pickup date.
- Additional transportation instructions where applicable.

**Vehicle condition**

The customer should provide an honest description of the vehicle's known condition.

For example:

- Normal running condition.
- Minor visible damage.
- Major visible damage.
- Non-running vehicle.
- Other relevant condition.

This information is important because the driver will later perform an independent pickup inspection.

**4.6 Transportation Request Validation**

Before a request is submitted, the system should validate required information.

For example:

IF pickup location is empty

→ Reject request

IF destination is empty

→ Reject request

IF vehicle information is incomplete

→ Reject request

IF pickup date is invalid

→ Reject request

The system should clearly identify the missing or invalid information to the customer.

Once all required information has been provided, the customer may submit the request.

**4.7 Request Creation**

After successful validation, the backend creates a transportation request.

The system should generate a unique request reference.

Example:

CGK-REQ-2026-000125

The request should initially receive the status:

**REQUESTED**

The request should contain:

- Request ID.
- Customer ID.
- Vehicle information.
- Pickup location.
- Destination.
- Requested date.
- Request status.
- Creation timestamp.

**4.8 Driver Matching and Quotation**

Once a transportation request has been created, eligible verified drivers may be allowed to view the request and submit quotations.

The system should ensure that only drivers who satisfy the relevant eligibility requirements can participate.

For example:

Driver Verification = APPROVED

+

Driver Account = ACTIVE

+

Driver Eligible for Route

+

Driver Available

The driver may then submit a quotation.

**4.9 Driver Quotation**

A driver quotation should contain the driver's proposed transportation fee.

The quotation should be associated with:

- Request ID.
- Driver ID.
- Transportation fee.
- Driver message/notes where applicable.
- Submission date.
- Quotation status.

The driver transportation fee should be separate from:

- Fuel budget.
- CarGo Kenya service fee.

This distinction is important because the customer should clearly understand what each amount represents.

**4.10 Customer Quotation View**

The customer should be able to view quotations received from eligible drivers.

Each quotation should display relevant driver information such as:

- Driver name.
- Profile photograph.
- Verified Driver badge.
- Rating.
- Completed trips.
- Years of experience.
- Route experience.
- Professional biography.
- Proposed transportation fee.

This allows the customer to evaluate the driver's professional reputation rather than selecting based purely on price.

**4.11 Driver Selection**

The customer may select one driver from the available quotations.

Before selection, the customer should be shown:

- Driver information.
- Transportation fee.
- Estimated fuel budget.
- CarGo service fee.
- Total booking price.
- Important booking conditions.

The customer must explicitly confirm the selected driver.

Once the driver is selected:

**Trip Status → DRIVER SELECTED**

The system should prevent multiple drivers from simultaneously becoming the confirmed driver for the same transportation request.

**4.12 Price Breakdown**

The platform should present the customer with a clear price breakdown.

For example:

Driver Transportation Fee KSh 22,000

Fuel Budget KSh 12,500

CarGo Kenya Service Fee KSh 1,500

\-----------------------------------------

TOTAL KSh 36,000

The customer should understand that:

**Total Customer Price = Driver Fee + Fuel Budget + CarGo Service Fee**

The customer should not be expected to calculate the total manually.

**4.13 Payment Pending**

After selecting the driver, the customer proceeds to payment.

The trip status becomes:

**PAYMENT PENDING**

The system should display:

- Trip/request reference.
- Selected driver.
- Vehicle.
- Pickup location.
- Destination.
- Driver transportation fee.
- Fuel budget.
- CarGo service fee.
- Total amount payable.
- Payment instructions.

The booking should not become officially confirmed until the required payment has been successfully confirmed by the platform.

**4.14 Full Customer Payment**

For the MVP, the customer pays the **full agreed trip cost through the platform**.

This includes:

Driver Transportation Fee

+

Fuel Budget

+

CarGo Kenya Service Fee

\=

Total Trip Cost

The customer's payment is associated with the relevant Trip Wallet.

The driver does **not** immediately receive the full transportation fee.

Instead, the driver's transportation fee remains subject to the milestone-based release process already defined in the MVP.

**4.15 Booking Confirmation**

Once the payment has been successfully confirmed:

1.  The payment record is updated.
2.  The Trip Wallet is created/updated.
3.  The selected driver is confirmed.
4.  The trip record becomes active in the booking workflow.
5.  A unique trip reference is generated where not already generated.
6.  The customer receives a booking confirmation.
7.  The driver receives a booking notification.

The trip status becomes:

**BOOKED**

The customer should then be able to access the trip details.

**4.16 Customer Access to Driver Contact Information**

Once the booking has been confirmed, the customer may be provided with the driver's contact information where necessary for practical transportation coordination.

This is important because vehicle transportation requires real-world coordination between:

- Customer.
- Driver.
- Clearing agent or authorized representative where applicable.
- Vehicle receiving party.

The platform should therefore not unnecessarily prevent legitimate communication after booking.

However, the platform should continue maintaining the official trip record through its own communication, milestone, inspection, and payment systems.

**4.17 Customer Trip Details**

After booking, the customer should have access to a dedicated trip page.

The page should display:

**Trip Information**

- Trip reference.
- Vehicle.
- Pickup location.
- Destination.
- Scheduled date.
- Current status.

**Driver Information**

- Name.
- Profile photograph.
- Verified Driver badge.
- Rating.
- Completed trips.
- Experience.
- Contact information where applicable after booking.

**Financial Information**

- Driver fee.
- Fuel budget.
- CarGo service fee.
- Total payment.
- Payment status.

**Trip Progress**

- Current status.
- Milestones.
- GPS/last known location.
- Pickup information.
- Delivery information.

**4.18 Pickup Stage**

When the driver reaches the pickup location, the transportation process enters:

**PICKUP INSPECTION**

The customer or authorized representative should participate in the pickup process where applicable.

The inspection will establish the vehicle's condition before transportation.

The customer should be able to view or participate in:

- Vehicle identity confirmation.
- Odometer recording.
- Fuel-level recording.
- Vehicle photographs.
- Existing damage documentation.
- Relevant observations.
- Handover confirmation.

**4.19 Pickup Inspection Confirmation**

After the inspection has been completed, both the driver and customer/authorized representative should confirm the recorded condition.

The system should ensure that the required inspection information has been provided before allowing the process to proceed.

The trip then moves to:

**TRIP START PENDING**

This means:

The pickup process has been completed, but transportation has not yet officially started.

**4.20 Trip Start Confirmation**

The driver will select:

**START TRIP**

The system should not immediately release the driver's first payment.

Instead, the customer receives a confirmation request.

The customer reviews the trip-start information and confirms that transportation has officially commenced.

Once both conditions are satisfied:

Driver → START TRIP

+

Customer → CONFIRM TRIP START

The system changes the trip status to:

**TRIP ACTIVE**

**4.21 First Driver Payment Release**

When the trip becomes **TRIP ACTIVE**, the first 50% of the driver's transportation fee becomes eligible for release.

Example:

Driver Transportation Fee = KSh 22,000

50% = KSh 11,000

The system will:

Trip Wallet

↓

Release KSh 11,000

↓

Driver Personal Wallet

The transaction must be recorded in the wallet transaction history.

**4.22 Customer Trip Monitoring**

During transportation, the customer should be able to monitor the trip.

The system may display:

- Current/last known GPS location.
- Trip status.
- Last update time.
- Trip milestones.
- Destination.
- Driver information.

The customer should understand that GPS information may occasionally be delayed because of:

- Poor network coverage.
- Device connectivity problems.
- GPS availability.

The system should therefore display the **last known location** where live information is temporarily unavailable.

**4.23 Customer Notifications**

The customer should receive notifications for important trip events.

Examples include:

- Driver selected.
- Payment confirmed.
- Booking confirmed.
- Driver approaching pickup.
- Pickup inspection completed.
- Trip-start confirmation requested.
- Trip started.
- Significant milestone.
- Destination reached.
- Delivery inspection completed.
- Delivery confirmed.
- Trip completed.
- Driver payment released.
- Rating available.

Notifications should be generated from actual system events.

**4.24 Delivery Confirmation**

When the vehicle reaches the destination, the driver begins the delivery process.

The customer or authorized receiving party participates in the delivery confirmation.

The delivery procedure includes:

- Arrival confirmation.
- Delivery inspection.
- Vehicle photographs.
- Odometer recording.
- Fuel recording where applicable.
- Condition recording.
- Handover confirmation.

The customer should review the delivery information before confirming successful delivery.

**4.25 Trip Completion**

The trip becomes:

**COMPLETED**

when the required completion conditions have been satisfied.

These include:

- Vehicle delivered.
- Delivery inspection completed.
- Customer confirms delivery.
- Driver confirms completion.

Once completed:

Trip Status → COMPLETED

The remaining 50% of the driver's transportation fee becomes eligible for release.

**4.26 Final Driver Payment**

Example:

Driver Fee = KSh 22,000

First Release = KSh 11,000

Final Release = KSh 11,000

Total Driver Earnings = KSh 22,000

The final amount moves from:

**Trip Wallet → Driver Personal Wallet**

The system records:

- Release amount.
- Trip reference.
- Driver.
- Timestamp.
- Transaction reference.
- Wallet balances before and after release.

**4.27 Customer Rating and Review**

After the trip is completed, the customer becomes eligible to rate the driver.

The MVP may use:

**1–5 stars**

The customer may also provide optional written feedback.

The rating should only be accepted if:

Trip Status = COMPLETED

This prevents users from creating ratings unrelated to completed CarGo Kenya trips.

**4.28 Customer Trip History**

The customer should be able to view previous transportation activities.

Each record may show:

- Trip reference.
- Vehicle.
- Driver.
- Route.
- Date.
- Total cost.
- Trip status.
- Rating.
- Completion date.

Selecting a trip should open its detailed historical record.

**4.29 Customer Cancellation**

Cancellation rules will depend on the current trip stage.

For example:

Before booking

↓

Cancellation may be allowed according to applicable rules.

After booking

↓

Cancellation becomes subject to the applicable cancellation policy.

After pickup confirmation

↓

Unilateral cancellation is not permitted.

Any cancellation should record:

- Initiating party.
- Reason.
- Date/time.
- Trip status.
- Financial consequences.
- Administrative decision where applicable.

**4.30 Customer Dispute Reporting**

A customer should be able to report a problem relating to a trip.

Possible categories include:

- Vehicle condition.
- Driver conduct.
- Payment.
- Fuel.
- Delivery.
- Destination.
- Damage.
- Other issue.

The customer should provide:

- Dispute category.
- Description.
- Relevant evidence where applicable.

The system creates a dispute record and assigns it to the administrative process.

**4.31 Customer Module Permissions**

The customer should only access information belonging to:

- Their account.
- Their transportation requests.
- Their trips.
- Their payments.
- Their inspection records.
- Their disputes.
- Their ratings.

The customer must not be able to:

- Modify driver verification records.
- Modify wallet balances.
- Release driver funds manually.
- Access another customer's trip.
- Modify system trip statuses directly.
- Access administrative functions.

All sensitive operations must be validated by the backend.

**4.32 Customer Module End-to-End Flow**

The complete customer-side process can therefore be represented as:

REGISTER

↓

LOGIN

↓

CREATE TRANSPORT REQUEST

↓

REQUESTED

↓

QUOTING

↓

VIEW DRIVER QUOTATIONS

↓

SELECT DRIVER

↓

DRIVER SELECTED

↓

PAYMENT PENDING

↓

FULL PAYMENT

↓

BOOKED

↓

PICKUP PENDING

↓

PICKUP INSPECTION

↓

TRIP START PENDING

↓

DRIVER STARTS TRIP

↓

CUSTOMER CONFIRMS

↓

TRIP ACTIVE

↓

FIRST 50% DRIVER PAYMENT RELEASE

↓

IN TRANSIT

↓

DELIVERY PENDING

↓

DELIVERED

↓

CUSTOMER CONFIRMS DELIVERY

↓

COMPLETED

↓

FINAL 50% DRIVER PAYMENT RELEASE

↓

RATE DRIVER

This flow is directly aligned with the **trip statuses and payment structure we already finalized**, so we are not changing the MVP at this stage.

**5.0 DRIVER MODULE**

**5.1 Module Overview**

The Driver Module will manage the complete driver-side lifecycle within CarGo Kenya.

The module is responsible for allowing professional drivers to:

- Create an account.
- Submit verification information.
- Build a professional profile.
- Become an approved CarGo Kenya driver.
- View eligible transportation requests.
- Submit quotations.
- Accept transportation assignments.
- Coordinate vehicle pickup.
- Complete pickup inspections.
- Start trips.
- Provide GPS location.
- Record transportation milestones.
- Complete delivery procedures.
- Receive eligible payments.
- Manage their Personal Wallet.
- View completed trips.
- Build a verified professional reputation.

The Driver Module must work together with:

- Authentication Module.
- Driver Verification Module.
- Transportation Request Module.
- Quotation Module.
- Trip Module.
- Inspection Module.
- GPS and Tracking Module.
- Payment and Wallet Module.
- Notification Module.
- Rating and Reputation Module.
- Dispute Module.
- Administrator Module.

The driver should only be allowed to perform actions that correspond to their account status and the current status of the relevant trip.

**5.2 Driver Registration**

A driver must create a CarGo Kenya account before accessing driver functionality.

The registration process should collect basic account information.

**Required information**

The driver should provide:

- Full name.
- Phone number.
- Email address where applicable.
- Password.
- Password confirmation.

The system should generate:

- Driver ID.
- Account creation date.
- Account status.
- Verification status.

A newly registered driver should not automatically become eligible to accept transportation assignments.

The initial verification status should be:

**PENDING**

**5.3 Driver Account Status**

The driver's account should have a defined status.

Possible statuses include:

**PENDING**

The driver has registered but has not yet completed the required verification process.

**UNDER REVIEW**

The driver has submitted the required information and an administrator is reviewing the application.

**ACTIVE**

The driver has been approved and may participate in eligible transportation assignments.

**SUSPENDED**

The driver has temporarily lost access to transportation assignments because of an administrative action.

**REJECTED**

The driver's verification application has been rejected.

The account status must be controlled by the backend and, where applicable, administrator actions.

**5.4 Driver Profile**

Once registered, the driver should complete their professional profile.

The profile will be used by customers when evaluating driver quotations.

The profile should include:

- Full name.
- Profile photograph.
- Professional biography.
- Years of driving experience.
- Route experience.
- Completed trips.
- Average rating.
- Verified Driver status.

The profile should clearly distinguish between information provided by the driver and information generated automatically by the platform.

For example:

**Driver-provided**

Years of experience: 8

**Platform-generated**

Completed CarGo Kenya trips: 27

Average rating: 4.8/5

This distinction improves the reliability of the driver's professional reputation.

**5.5 Driver Verification**

Driver verification is a core trust feature of CarGo Kenya.

A driver must complete verification before being allowed to accept a transportation assignment.

The verification process will follow:

REGISTER

↓

PROFILE COMPLETION

↓

DOCUMENT SUBMISSION

↓

ADMINISTRATIVE REVIEW

↓

APPROVED / REJECTED / CORRECTION REQUIRED

↓

ACCOUNT ACTIVATION

**5.6 Verification Information**

The driver verification process may require information such as:

- National identification information.
- Driving licence information.
- Required professional information.
- Verification documents.
- Profile photograph.

The exact documents required may be configured as the business and regulatory requirements become clearer.

The MVP should avoid creating unnecessary verification requirements that cannot be practically reviewed.

**5.7 Document Submission**

The driver should be able to submit the required verification documents through the platform.

Each document should be associated with:

- Driver ID.
- Document type.
- Upload timestamp.
- Verification status.
- Review information.

Possible document status values may include:

- PENDING.
- APPROVED.
- REJECTED.
- REQUIRES CORRECTION.

The system should prevent unverified documents from being treated as approved simply because they were uploaded.

**5.8 Administrative Verification**

After document submission, the driver application becomes available to an administrator.

The administrator should be able to:

- Review driver information.
- Review submitted documents.
- Approve verification.
- Reject verification.
- Request corrections.
- Place the application under further review.

The administrator's decision should be recorded.

Example:

Driver

↓

Documents Submitted

↓

Administrator Review

↓

APPROVED

↓

Driver Status = ACTIVE

↓

Verified Driver Badge

**5.9 Verified Driver Status**

An approved driver should receive:

**VERIFIED DRIVER**

status.

This status should be visible to customers when reviewing driver quotations.

The Verified Driver status should not simply be a visual badge controlled by the frontend.

It must be generated from the driver's actual verification status stored by the backend.

**5.10 Driver Eligibility**

Only drivers who meet the required conditions should be able to participate in transportation assignments.

A simplified eligibility check is:

Verification = APPROVED

AND

Account = ACTIVE

AND

Driver is eligible for the request

If any required condition fails, the driver should not be allowed to accept the assignment.

**5.11 Driver Dashboard**

The driver dashboard will be the primary control centre for driver activities.

It should provide:

**Verification Status**

- Verification status.
- Account status.
- Missing documents where applicable.

**Available Requests**

- New transportation requests.
- Relevant routes.
- Pickup locations.
- Destinations.
- Vehicle information.
- Request dates.

**Active Trip**

- Current trip.
- Trip reference.
- Current status.
- Pickup information.
- Destination.
- Customer information necessary for execution.

**Earnings**

- Available wallet balance.
- Pending earnings.
- Recent transactions.

**Reputation**

- Average rating.
- Completed trips.
- Route experience.

**5.12 Viewing Available Transportation Requests**

An eligible driver should be able to view transportation requests that are available to them.

A request should display relevant information such as:

- Request reference.
- Vehicle type.
- Vehicle information.
- Pickup location.
- Destination.
- Requested pickup date.
- Relevant vehicle condition information.
- Other transportation requirements.

The driver should not be given unnecessary private customer information before the appropriate stage of the booking process.

**5.13 Driver Request Eligibility**

The system should determine which requests a driver may access.

Possible factors include:

- Driver verification.
- Account status.
- Route eligibility.
- Driver availability.
- Existing active assignment.
- Other MVP-defined operational restrictions.

For example:

IF Driver = APPROVED

AND Driver = ACTIVE

AND Driver has no conflicting active assignment

THEN

Driver may participate in eligible request.

The final matching rules can be refined during implementation.

**5.14 Submitting a Driver Quotation**

The driver should be able to submit a transportation quotation for an eligible request.

The quotation should contain at minimum:

- Driver ID.
- Request ID.
- Transportation fee.
- Optional driver message/notes.
- Submission timestamp.

The transportation fee represents the driver's proposed compensation for transporting the vehicle.

It should remain separate from the fuel budget and CarGo service fee.

**5.15 Driver Transportation Fee**

The driver is responsible for proposing the amount they require for the transportation service where the quotation model is being used.

For example:

Driver Transportation Fee

KSh 22,000

The customer may then compare this amount with quotations from other drivers.

The system should not allow the driver to alter the quotation after it has been accepted unless an approved trip modification process is used.

**5.16 Driver Quotation Status**

A quotation should have its own status.

Possible states include:

**SUBMITTED**

Driver has submitted the quotation.

**SELECTED**

Customer has selected this driver's quotation.

**NOT SELECTED**

Another driver has been selected.

**WITHDRAWN**

Driver has withdrawn the quotation before selection where permitted.

The quotation status should be automatically updated by the backend according to the relevant action.

**5.17 Customer Selects Driver**

When a customer selects the driver:

Quotation

↓

SELECTED

↓

Driver receives notification

The driver should then see:

- Customer information necessary for execution.
- Vehicle information.
- Pickup location.
- Destination.
- Agreed transportation fee.
- Fuel budget information where relevant.
- Trip reference.
- Scheduled pickup information.

The driver should also be notified that they have been selected.

**5.18 Driver Booking Confirmation**

Where the workflow requires driver confirmation after customer selection, the driver should confirm availability.

The system should verify that:

- The driver is still active.
- The driver remains eligible.
- The trip has not already been assigned elsewhere.
- The driver has not been suspended.
- The assignment is still valid.

After confirmation, the trip can proceed to the payment stage.

**5.19 Driver Access to Customer Contact Information**

Once the booking has been confirmed, the driver may access the customer or authorized representative's contact information where necessary for practical trip execution.

This is important because the driver must be able to coordinate:

- Pickup.
- Vehicle handover.
- Arrival.
- Delivery.
- Destination confirmation.

However, contact information should only expose information necessary for executing the assigned trip.

The driver should not have unrestricted access to unrelated customer information.

**5.20 Driver Preparation for Pickup**

Before travelling to collect the vehicle, the driver should review the assigned trip.

The driver should be able to see:

- Trip reference.
- Pickup location.
- Destination.
- Vehicle details.
- Customer/authorized representative information.
- Scheduled pickup time/date.
- Relevant vehicle condition information.
- Agreed transportation fee.
- Relevant fuel information.

The driver should also have access to navigation/location functionality where supported.

**5.21 Pickup Arrival**

When the driver arrives at the pickup location, the driver begins the pickup procedure.

The driver should access the assigned trip and select an appropriate action such as:

**START PICKUP INSPECTION**

The trip then enters:

**PICKUP INSPECTION**

The driver must complete the required inspection before transportation can officially begin.

**5.22 Pickup Inspection**

The driver is responsible for documenting the condition of the vehicle at pickup.

The inspection should include:

1.  Confirming vehicle identity.
2.  Confirming pickup location.
3.  Recording odometer reading.
4.  Recording fuel level.
5.  Capturing required photographs.
6.  Recording visible damage.
7.  Recording relevant observations.
8.  Confirming the recorded condition.
9.  Obtaining confirmation from the customer or authorized representative.

The inspection information must be associated with the correct trip.

**5.23 Inspection Photography**

The driver should capture standardized vehicle photographs.

The MVP should normally support photographs of:

- Front.
- Rear.
- Left side.
- Right side.
- Interior where relevant.
- Odometer.
- Fuel gauge.
- Existing visible damage.
- Other areas requiring documentation.

The system should associate each photograph with the inspection record.

The driver should not be able to simply upload unrelated photographs as proof of inspection.

**5.24 Odometer Recording**

The driver must record the vehicle's odometer reading during pickup.

Example:

Pickup Odometer

125,430 km

The value should be stored with:

- Trip ID.
- Inspection ID.
- Driver ID.
- Timestamp.

The driver should not normally be able to modify a completed inspection record without the appropriate administrative process.

**5.25 Fuel-Level Recording**

The driver must record the vehicle's fuel level during pickup.

The system may initially use a simple representation such as:

- Empty.
- ¼.
- ½.
- ¾.
- Full.

Alternatively, the implementation may support a percentage where technically practical.

The selected approach should remain consistent throughout pickup and delivery records.

**5.26 Vehicle Condition Mismatch**

The actual condition of the vehicle may differ from the condition originally declared by the customer.

The driver must document any significant discrepancy before transportation proceeds.

For example:

Customer Declaration:

No visible damage.

Pickup Inspection:

Visible damage identified on rear bumper.

The driver should capture:

- Photographs.
- Written observation.
- Timestamp.
- Location.
- Relevant inspection information.

The customer or authorized representative should be given an opportunity to acknowledge the discrepancy.

**5.27 Significant Condition Discrepancy**

If a discrepancy is significant enough to affect:

- Safety.
- Transportation requirements.
- Pricing.
- Driver willingness to proceed.

the trip may be placed under administrative review.

The driver should not be forced to proceed where the actual transportation conditions materially differ from the agreed conditions.

This protects both parties.

**5.28 Pickup Handover Confirmation**

After inspection, the driver and customer/authorized representative confirm the vehicle handover.

The system should record:

- Driver confirmation.
- Customer/representative confirmation.
- Date/time.
- Inspection record.
- Relevant photographs.
- Odometer.
- Fuel level.

Once the pickup process is successfully completed:

**Trip Status → TRIP START PENDING**

**5.29 Trip Start**

The driver is responsible for initiating the transportation stage.

The driver selects:

**START TRIP**

However, selecting START TRIP does **not by itself** make the trip fully active.

The system sends a confirmation request to the customer.

The required process is:

Pickup Completed

↓

TRIP START PENDING

↓

Driver selects START TRIP

↓

Customer receives confirmation request

↓

Customer confirms

↓

TRIP ACTIVE

**5.30 First Driver Payment Release**

Once:

- Pickup requirements are complete.
- Driver selects START TRIP.
- Customer confirms trip commencement.

the trip becomes:

**TRIP ACTIVE**

The first 50% of the driver's transportation fee becomes eligible for release.

Example:

Driver Fee = KSh 22,000

First Release = KSh 11,000

The amount moves:

**Trip Wallet → Driver Personal Wallet**

The driver should receive a transaction record showing the release.

**5.31 Driver Trip Activation**

After the trip becomes active, the driver should be able to access transportation functions including:

- GPS tracking.
- Trip milestones.
- Fuel stop recording where applicable.
- Delay reporting.
- Destination arrival.
- Delivery procedures.

The driver should not be able to manually change the trip to **COMPLETED** without completing the required workflow.

**5.32 GPS Tracking**

During the active transportation stage, the driver device may provide GPS information.

The system may capture:

- Latitude.
- Longitude.
- Timestamp.
- Location accuracy where available.
- Trip ID.

The GPS information is associated with the active trip.

The driver should not be able to manually enter arbitrary GPS coordinates as a substitute for actual location information.

**5.33 GPS Connectivity Failure**

If the driver temporarily loses network connectivity:

- The last known location should remain available.
- The application should preserve relevant information locally where technically feasible.
- Information should synchronize when connectivity returns.
- The system should record timestamps where possible.

The trip should not automatically become cancelled or failed merely because GPS connectivity is temporarily unavailable.

**5.34 Trip Milestones**

The driver will update important transportation milestones.

Examples include:

**PICKUP COMPLETED**

Vehicle has been successfully handed over.

**TRIP STARTED**

Transportation has officially commenced.

**FUEL STOP**

The driver has stopped for fuel.

**ROUTE MILESTONE**

A significant point along the route has been reached.

**DELAY**

The driver has experienced a significant delay.

**DESTINATION REACHED**

The driver has arrived at the destination.

**DELIVERY INSPECTION**

Delivery inspection has started.

**DELIVERY COMPLETED**

The vehicle has been successfully delivered.

Each milestone should record:

- Trip.
- Driver.
- Milestone type.
- Date/time.
- Optional location.
- Optional notes.

**5.35 Reporting Delays**

The driver should be able to report significant delays.

Examples include:

- Traffic.
- Mechanical issue.
- Road closure.
- Weather.
- Security concern.
- Other operational problem.

The driver should provide:

- Delay type.
- Description.
- Timestamp.
- Location where available.

The customer should receive an appropriate notification.

**5.36 Destination Changes**

A customer may request a destination change after transportation has started.

The driver should not be required to accept the change automatically.

The workflow should be:

Customer Requests Change

↓

Driver Reviews

↓

Driver Accepts / Rejects

↓

If Accepted:

New Cost Calculated

↓

Customer Accepts

↓

Change Recorded

Any additional transportation cost should be formally recorded against the trip.

The driver should not privately negotiate or modify the official trip amount outside the approved platform process where the change affects the booking.

**5.37 Driver Arrival at Destination**

When the driver reaches the destination, the driver should select an appropriate milestone such as:

**DESTINATION REACHED**

The trip then moves toward:

**DELIVERY PENDING**

The driver begins the delivery procedure.

**5.38 Delivery Inspection**

The driver must complete a delivery inspection before the trip can be completed.

The inspection should include:

- Vehicle identity confirmation.
- Vehicle photographs.
- Odometer reading.
- Fuel level where applicable.
- Visible condition.
- Relevant observations.
- Delivery handover.

The inspection should be associated with the trip's delivery inspection record.

**5.39 Delivery Handover**

The driver and receiving customer/authorized representative should confirm the delivery.

The system should record:

- Delivery date/time.
- Receiving party.
- Driver confirmation.
- Customer/representative confirmation.
- Delivery photographs.
- Odometer.
- Fuel level where applicable.
- Condition observations.

Once delivery has been successfully performed:

**Trip Status → DELIVERED**

**5.40 Trip Completion Confirmation**

After delivery:

- Customer confirms successful delivery.
- Driver confirms completion.

The system then changes:

**DELIVERED → COMPLETED**

The driver should not manually bypass required delivery confirmation steps.

**5.41 Final Driver Payment Release**

Once the trip becomes **COMPLETED**, the remaining 50% of the driver's transportation fee becomes eligible for release.

Example:

Driver Transportation Fee = KSh 22,000

Released at Trip Active = KSh 11,000

Released at Completion = KSh 11,000

Total Driver Earnings = KSh 22,000

The final release is recorded in the Driver Personal Wallet.

**5.42 Driver Personal Wallet**

The Driver Personal Wallet should provide the driver with a clear record of money that has become available.

The wallet should contain:

- Available balance.
- Pending balance where applicable.
- Released earnings.
- Transaction history.
- Withdrawal history.

The driver should not be able to manually increase their wallet balance.

All wallet credits must originate from valid system transactions.

**5.43 Wallet Transaction Example**

A completed trip might produce:

TRIP CGK-2026-000125

Driver Fee: KSh 22,000

Transaction 1:

FIRST RELEASE

\+ KSh 11,000

Status: RELEASED

Transaction 2:

FINAL RELEASE

\+ KSh 11,000

Status: RELEASED

Driver wallet:

Previous Balance: KSh 5,000

\+ First Release: KSh 11,000

\+ Final Release: KSh 11,000

\--------------------------------

Available Balance: KSh 27,000

The wallet should maintain the individual transactions rather than storing only the final balance.

**5.44 Driver Withdrawal**

Where withdrawal functionality is included in the MVP implementation, the driver may request withdrawal of available funds from their Personal Wallet.

The system should verify:

Requested Amount <= Available Balance

If valid:

Withdrawal Requested

↓

Withdrawal Record Created

↓

Processing

↓

Successful / Failed

The system should never allow a driver to withdraw:

- Funds still held in a Trip Wallet.
- Pending driver earnings.
- Funds belonging to another trip.
- Amounts exceeding the available wallet balance.

**5.45 Driver Earnings History**

The driver should be able to view earnings associated with completed and active trips.

Each transaction should show:

- Trip reference.
- Amount.
- Transaction type.
- Date/time.
- Status.

Examples:

- First driver payment.
- Final driver payment.
- Adjustment.
- Refund reversal where applicable.
- Withdrawal.

**5.46 Driver Completed Trips**

The driver should be able to view a history of completed CarGo Kenya trips.

Each trip record may include:

- Trip reference.
- Vehicle.
- Route.
- Customer where appropriate.
- Date.
- Transportation fee.
- Trip status.
- Rating received.

Only trips marked:

**COMPLETED**

should contribute to the driver's verified completed-trip count.

**5.47 Driver Reputation**

The Driver Module will maintain a professional reputation based on actual platform activity.

The customer-facing reputation may include:

- Average rating.
- Completed CarGo Kenya trips.
- Route experience.
- Years of experience.
- Professional biography.
- Verified Driver badge.

For example:

John Doe

✓ Verified Driver

Rating: 4.8/5

Completed Trips: 32

Experience: 8 years

Route Experience:

Mombasa → Nairobi

Mombasa → Kisumu

Mombasa → Nakuru

The completed-trip count and rating should be generated by the platform rather than entered manually by the driver.

**5.48 Driver Rating Protection**

Drivers should not be able to:

- Create their own ratings.
- Modify customer ratings.
- Add fake completed trips.
- Manually increase their completed-trip count.

Only eligible completed CarGo Kenya trips should contribute to the driver's platform reputation.

**5.49 Driver Notifications**

The driver should receive notifications for important events.

Examples include:

**Account**

- Registration completed.
- Verification approved.
- Verification rejected.
- Verification correction required.
- Account suspended.

**Transportation**

- New eligible request.
- Customer selected driver.
- Booking confirmed.
- Payment confirmed.
- Pickup reminder.
- Customer trip-start confirmation.
- Destination change.
- Delivery confirmation.

**Financial**

- First driver payment released.
- Final driver payment released.
- Withdrawal status.

**5.50 Driver Dispute Reporting**

A driver should be able to report problems relating to an assigned trip.

Possible issues include:

- Customer conduct.
- Vehicle condition.
- Incorrect vehicle information.
- Pickup problem.
- Destination problem.
- Fuel issue.
- Payment issue.
- Delivery problem.
- Safety concern.
- Other transportation issue.

The driver should submit:

- Dispute category.
- Description.
- Relevant evidence.
- Supporting photographs where applicable.

The dispute should then be handled through the administrator-led dispute process.

**5.51 Driver Module Permissions**

A driver should only have access to information necessary for:

- Their account.
- Their verification.
- Their quotations.
- Their assigned trips.
- Their inspections.
- Their milestones.
- Their GPS/tracking records.
- Their earnings.
- Their wallet.
- Their ratings/reputation.

The driver must not be able to:

- Modify customer payment records.
- Modify Trip Wallet balances.
- Release their own payments.
- Modify their completed-trip count.
- Approve their own verification.
- Access another driver's private information.
- Access administrative functions.

**5.52 Driver Module Error Handling**

The system should handle invalid driver actions clearly.

**Example 1: Unverified Driver**

Driver attempts to submit quotation

↓

System checks verification

↓

NOT APPROVED

↓

Action rejected

**Example 2: Suspended Driver**

Driver attempts to accept assignment

↓

Account = SUSPENDED

↓

Action rejected

**Example 3: Early Payment Attempt**

Driver attempts to access first payment

↓

Trip = PICKUP INSPECTION

↓

Conditions not satisfied

↓

Payment remains held

**Example 4: Final Payment Attempt**

Driver attempts final payment

↓

Trip ≠ COMPLETED

↓

Final payment remains held

This ensures that financial operations are controlled by verified trip events rather than user requests alone.

**5.53 Driver Module End-to-End Flow**

The complete driver-side workflow is:

REGISTER

↓

PROFILE COMPLETION

↓

DOCUMENT SUBMISSION

↓

ADMIN REVIEW

↓

VERIFIED DRIVER

↓

ACCOUNT ACTIVE

↓

VIEW ELIGIBLE REQUESTS

↓

SUBMIT QUOTATION

↓

CUSTOMER SELECTS DRIVER

↓

BOOKING CONFIRMED

↓

RECEIVE TRIP DETAILS

↓

TRAVEL TO PICKUP

↓

PICKUP INSPECTION

↓

PHOTOS + ODOMETER + FUEL

↓

VEHICLE HANDOVER

↓

TRIP START PENDING

↓

DRIVER SELECTS START TRIP

↓

CUSTOMER CONFIRMS

↓

TRIP ACTIVE

↓

FIRST 50% RELEASE

↓

GPS + MILESTONES

↓

DESTINATION REACHED

↓

DELIVERY INSPECTION

↓

VEHICLE HANDOVER

↓

DELIVERED

↓

CUSTOMER + DRIVER CONFIRM

↓

COMPLETED

↓

FINAL 50% RELEASE

↓

DRIVER RATING

↓

TRIP ADDED TO REPUTATION

**5.54 Driver Module Summary**

The Driver Module provides the complete operational workflow required for a professional driver to participate in CarGo Kenya.

The module ensures that a driver:

1.  Is properly registered.
2.  Is verified before receiving assignments.
3.  Maintains a professional profile.
4.  Can submit quotations.
5.  Can receive confirmed assignments.
6.  Can coordinate vehicle pickup.
7.  Documents vehicle condition.
8.  Officially starts transportation through the customer-confirmation workflow.
9.  Provides GPS and milestone information.
10. Completes delivery inspection.
11. Receives payment according to verified milestones.
12. Maintains a transaction history.
13. Builds a verifiable professional reputation.

The Driver Module therefore directly supports the central CarGo Kenya MVP objective:

**Connect customers with verified professional drivers and successfully coordinate vehicle transportation from pickup to delivery.**

**6.0 TRANSPORTATION REQUEST AND QUOTATION MODULE**

**6.1 Module Overview**

The Transportation Request and Quotation Module manages the process through which a customer requests vehicle transportation and receives quotations from eligible verified drivers.

The module is responsible for:

- Creating transportation requests.
- Capturing vehicle information.
- Capturing pickup and destination information.
- Capturing transportation requirements.
- Calculating or presenting the applicable fuel budget.
- Publishing requests to eligible drivers.
- Receiving driver quotations.
- Allowing customers to compare quotations.
- Allowing customers to select a driver.
- Updating quotation and trip statuses.
- Preparing the selected quotation for payment and booking confirmation.

The module forms the connection between the customer requiring transportation and the verified drivers available to provide the service.

The basic workflow is:

CUSTOMER

↓

CREATE TRANSPORTATION REQUEST

↓

REQUESTED

↓

ELIGIBLE DRIVERS VIEW REQUEST

↓

QUOTING

↓

DRIVERS SUBMIT QUOTATIONS

↓

CUSTOMER REVIEWS QUOTATIONS

↓

DRIVER SELECTED

↓

PAYMENT PENDING

↓

PAYMENT COMPLETED

↓

BOOKED

**6.2 Transportation Request Creation**

A customer must create a transportation request before drivers can submit quotations.

The customer should provide sufficient information for drivers to understand:

- What vehicle is being transported.
- Where the vehicle will be collected.
- Where the vehicle will be delivered.
- When transportation is required.
- Any special transportation requirements.

The request should be designed to collect only information necessary for the MVP.

**6.3 Transportation Request Information**

The transportation request should contain the following information.

**Customer Information**

The system should automatically associate the request with:

- Customer ID.
- Customer account.
- Contact information where required.

The customer should not need to manually re-enter their account information.

**Vehicle Information**

The request should contain:

- Vehicle make.
- Vehicle model.
- Vehicle year where applicable.
- Vehicle registration/chassis information where appropriate.
- Vehicle category/type.
- Vehicle condition.
- Existing visible damage where declared.
- Special vehicle requirements where applicable.

**Pickup Information**

The customer should provide:

- Pickup location.
- Pickup address/details.
- Preferred pickup date.
- Relevant pickup instructions.

**Destination Information**

The customer should provide:

- Destination location.
- Destination address/details.
- Relevant delivery instructions.

**6.4 Vehicle Category**

The system should classify vehicles into basic categories.

For example:

- Saloon.
- SUV.
- Pickup.
- Van.
- Truck.
- Other.

The exact categories can be configured by the administrator.

Vehicle category information may be used later to improve driver matching and pricing.

**6.5 Vehicle Condition Declaration**

The customer should declare the general condition of the vehicle when creating the request.

The customer may provide:

- General condition.
- Existing visible damage.
- Non-running vehicle status where applicable.
- Other relevant observations.

The customer should be encouraged to provide accurate information.

The declared condition becomes part of the official trip record and can later be compared against the pickup inspection.

**6.6 Pickup Location**

The customer must provide the location where the driver will collect the vehicle.

The MVP should support sufficient location information for practical pickup coordination.

This may include:

- County/town.
- Specific location.
- Address or landmark.
- GPS coordinates where available.

The system should associate the pickup location with the transportation request.

**6.7 Destination**

The customer must provide the intended destination.

The destination should contain:

- County/town.
- Specific delivery location.
- Address or landmark where applicable.
- GPS coordinates where available.

The destination forms part of the agreed transportation conditions.

A destination should not be changed informally after booking.

Any post-booking destination change must follow the destination-change workflow already defined in the MVP.

**6.8 Requested Pickup Date**

The customer should provide the preferred date for vehicle collection.

The request may also contain:

- Preferred pickup time.
- Special timing instructions.

The selected driver should receive the relevant scheduling information after selection.

The actual pickup time should be recorded separately from the requested pickup date.

**6.9 Special Transportation Requirements**

The customer should be able to provide additional information that may affect transportation.

Examples include:

- Vehicle has mechanical limitations.
- Vehicle requires special handling.
- Vehicle cannot be driven normally.
- Special delivery instructions.
- Other relevant transportation requirements.

The purpose is to ensure drivers can make informed decisions before submitting quotations.

**6.10 Request Reference**

Every transportation request should receive a unique system-generated reference.

Example:

REQ-2026-000125

The request reference should be different from the final Trip Reference.

For example:

Request:

REQ-2026-000125

Trip:

CGK-2026-000125

The request reference identifies the transportation request before a driver is selected.

The Trip Reference identifies the confirmed transportation assignment.

**6.11 Initial Request Status**

Immediately after the customer submits the request, the system should assign:

**REQUESTED**

This means:

The customer has successfully submitted a transportation request and the request is awaiting eligible driver quotations.

The system should record:

- Request ID.
- Customer ID.
- Creation date/time.
- Request information.
- Request status.

**6.12 Request Validation**

Before the request is published to drivers, the system should validate the submitted information.

The system should verify that required fields have been completed.

For example:

Vehicle Information ✓

Pickup Location ✓

Destination ✓

Pickup Date ✓

Transportation Requirements ✓

If required information is missing, the request should not be submitted.

The customer should receive a clear validation message indicating what needs to be corrected.

**6.13 Publishing the Request**

Once validation is successful, the request becomes available to eligible verified drivers.

The request should be visible only to drivers who satisfy the applicable eligibility conditions.

The system should not publish transportation requests to:

- Unverified drivers.
- Rejected drivers.
- Suspended drivers.
- Inactive accounts.

**6.14 Eligible Drivers**

A driver may participate in a transportation request when the driver:

- Has completed required verification.
- Has an ACTIVE account.
- Is not suspended.
- Is eligible for the relevant transportation assignment.
- Does not have a conflicting active assignment where applicable.

The matching system should initially remain simple.

The MVP does not need a complex AI-powered driver-matching engine.

**6.15 Driver Request Visibility**

An eligible driver should see sufficient information to decide whether to submit a quotation.

The driver should be able to view:

- Request reference.
- Vehicle category.
- Vehicle information.
- Pickup location.
- Destination.
- Requested pickup date.
- Relevant vehicle condition.
- Special requirements.
- Other information necessary to estimate the transportation fee.

The driver should not receive unnecessary private customer information before selection.

**6.16 Request Status — QUOTING**

Once eligible drivers can submit quotations, the request should move to:

**QUOTING**

This means:

The transportation request is open and drivers may submit quotations.

The request remains in this stage until:

- A driver is selected.
- The request expires.
- The customer cancels the request.
- An administrator closes the request.

**6.17 Driver Quotation**

A driver may submit a quotation against an eligible transportation request.

The quotation represents the driver's proposed transportation fee.

For example:

Driver Transportation Fee

KSh 22,000

The driver quotation should remain separate from:

- Fuel budget.
- CarGo Kenya service fee.

This distinction is important because the driver's quotation represents the driver's compensation for transportation.

**6.18 Quotation Information**

Each quotation should contain:

- Quotation ID.
- Request ID.
- Driver ID.
- Transportation fee.
- Driver message/notes where applicable.
- Submission timestamp.
- Quotation status.

The system should automatically record the driver who submitted the quotation.

**6.19 Quotation Status**

A quotation should have a defined status.

The initial MVP should support:

**SUBMITTED**

The driver has submitted a quotation.

**SELECTED**

The customer has selected the quotation.

**NOT SELECTED**

The customer selected another driver.

**WITHDRAWN**

The driver withdrew the quotation before selection where permitted.

The system should control these statuses rather than allowing drivers or customers to manually manipulate them.

**6.20 Multiple Driver Quotations**

A customer should be able to receive quotations from multiple eligible drivers.

For example:

Driver A

KSh 22,000

Driver B

KSh 20,500

Driver C

KSh 24,000

The customer should be able to compare the quotations before selecting a driver.

The platform should provide sufficient driver information to support an informed decision.

**6.21 Customer Quotation Comparison**

The customer-facing quotation view should display relevant information such as:

- Driver name.
- Profile photograph.
- Verified Driver badge.
- Rating.
- Completed trips.
- Years of experience.
- Route experience.
- Professional biography.
- Driver transportation fee.

This directly supports the driver-reputation model established in Chapter 5.

The customer should not select a driver based only on price.

**6.22 Example Quotation Display**

The customer may see:

DRIVER A

✓ Verified Driver

Rating: 4.8/5

Completed Trips: 32

Experience: 8 years

Mombasa → Nairobi

Driver Fee:

KSh 22,000

Another quotation may show:

DRIVER B

✓ Verified Driver

Rating: 4.6/5

Completed Trips: 18

Experience: 6 years

Mombasa → Nairobi

Driver Fee:

KSh 20,500

The customer then makes the final selection.

**6.23 Driver Selection**

When the customer selects a quotation:

Selected Quotation

↓

Quotation Status = SELECTED

↓

Other Quotations = NOT SELECTED

↓

Request Status = DRIVER SELECTED

The system should record:

- Selected driver.
- Selected quotation.
- Selection timestamp.
- Agreed driver transportation fee.

**6.24 Driver Selection Confirmation**

After the customer selects a driver, the selected driver should receive a notification.

The driver should be informed that:

- Their quotation was selected.
- The transportation request has been assigned to them.
- The relevant trip details are available.
- Payment is pending or awaiting completion.

The driver should not consider the transportation assignment fully active until the booking/payment workflow has been completed.

**6.25 Non-Selected Quotations**

When a customer selects a driver, other quotations should automatically become:

**NOT SELECTED**

Those drivers should no longer be able to proceed with that request.

The system may notify those drivers that another quotation was selected.

**6.26 Payment Preparation**

After driver selection, the request moves to:

**PAYMENT PENDING**

At this stage, the system has established:

- Customer.
- Vehicle.
- Pickup.
- Destination.
- Selected driver.
- Driver transportation fee.

The system can now calculate the complete customer booking amount.

**6.27 Total Booking Price**

The customer's total booking price consists of:

Driver Transportation Fee

+

Fuel Budget

+

CarGo Kenya Service Fee

\=

Total Trip Cost

Example:

Driver Transportation Fee = KSh 22,000

Fuel Budget = KSh 12,500

CarGo Kenya Service Fee = KSh 1,500

\-----------------------------------

Total Trip Cost = KSh 36,000

The customer should see this breakdown before making payment.

**6.28 Fuel Budget**

The fuel budget is treated separately from the driver's transportation fee.

The purpose of the fuel budget is to provide an agreed amount associated with fuel requirements for the transportation assignment.

The fuel budget should not automatically be treated as driver income.

The system should record the fuel budget separately within the Trip Wallet.

The exact operational process for fuel expenditure and supporting records should remain consistent with the MVP payment and trip workflow.

**6.29 CarGo Kenya Service Fee**

CarGo Kenya earns revenue through its platform service fee.

The service fee may initially be configured as:

- Fixed amount per trip; or
- Percentage of the driver transportation fee.

The administrator should be able to configure the applicable fee without modifying the application's core source code.

The fee should be clearly displayed to the customer before payment.

**6.30 Price Transparency**

Before payment, the customer should see a complete breakdown.

Example:

TRANSPORTATION COST

Driver Fee KSh 22,000

Fuel Budget KSh 12,500

CarGo Service Fee KSh 1,500

\--------------------------------

TOTAL KSh 36,000

This prevents confusion about what the customer is paying for.

The customer should not be required to make another payment to the driver for the agreed transportation fee.

**6.31 Payment Pending**

After the customer proceeds to payment, the request/trip enters:

**PAYMENT PENDING**

The system should wait for confirmation of the required payment.

The payment amount must correspond to the approved booking amount.

The system should not mark the trip as fully booked merely because the customer opened the payment page.

**6.32 Successful Payment**

Once the payment provider confirms successful payment:

Payment Confirmed

↓

Trip Wallet Record Created/Updated

↓

Payment Status = PAID

↓

Trip Status = BOOKED

The system should record the payment transaction.

The booking should then receive its official Trip Reference.

**6.33 Trip Creation**

After successful booking/payment processing, the system should create or finalize the official trip record.

The Trip Reference may follow:

CGK-2026-000125

The trip should be associated with:

- Customer.
- Selected driver.
- Vehicle.
- Pickup.
- Destination.
- Driver transportation fee.
- Fuel budget.
- CarGo service fee.
- Total payment.
- Trip Wallet.
- Trip status.

**6.34 Booking Confirmation**

Once payment has been successfully confirmed and the booking requirements are satisfied:

**Trip Status → BOOKED**

The customer should receive a booking confirmation.

The driver should also receive a confirmation notification.

At this point, both parties can access the information necessary to coordinate the pickup.

**6.35 Post-Booking Contact**

After booking confirmation, appropriate driver/customer contact information may be made available.

This allows the driver and customer or authorized representative to coordinate:

- Pickup location.
- Arrival time.
- Vehicle handover.
- Practical directions.
- Delivery arrangements.

This is necessary because CarGo Kenya is coordinating a real-world physical transportation process.

The platform should still maintain the official trip record for all important actions.

**6.36 Request Cancellation Before Driver Selection**

Before a driver is selected, the customer may be permitted to cancel the request according to the applicable cancellation rules.

The system should record:

- Cancellation initiator.
- Date/time.
- Reason.
- Request status.

The request should then become:

**CANCELLED**

where appropriate.

**6.37 Request Expiration**

The system may eventually support request expiration.

For example, a request may expire if:

- The required pickup date has passed.
- The customer closes the request.
- The administrator closes it.
- The request remains inactive for an extended period.

This functionality should remain simple in the MVP.

**6.38 Quotation Withdrawal**

A driver may be allowed to withdraw a quotation before the customer selects them.

If permitted:

SUBMITTED

↓

WITHDRAWN

Once selected, the driver should not simply withdraw from the assignment through the quotation interface.

After selection, the driver is dealing with an official transportation assignment and must follow the applicable cancellation/dispute process.

**6.39 Quotation Modification**

A submitted quotation should not be freely modified after submission.

If the driver needs to change the amount before selection, the system may allow the driver to withdraw the existing quotation and submit another quotation where appropriate.

Once selected, the agreed driver transportation fee should remain fixed unless an approved change occurs through the trip modification process.

**6.40 Preventing Price Manipulation**

The backend must be responsible for determining the final booking amount.

The frontend should not be trusted to submit arbitrary totals.

For example:

Driver Fee = 22,000

Fuel Budget = 12,500

CarGo Fee = 1,500

The backend calculates:

TOTAL = 36,000

The customer should not be able to manipulate the frontend and submit:

TOTAL = 20,000

The server must independently calculate and validate the final amount.

**6.41 Request and Quotation Data Relationship**

The basic data relationship should be:

CUSTOMER

│

└── creates

│

▼

TRANSPORTATION REQUEST

│

├── Vehicle

├── Pickup

├── Destination

└── Requirements

│

▼

QUOTATIONS

├── Driver A

├── Driver B

└── Driver C

│

▼

SELECTED QUOTATION

│

▼

TRIP

│

▼

TRIP WALLET

This relationship will be important when designing the database.

**6.42 Request-to-Trip State Flow**

The complete MVP state transition should be:

REQUESTED

↓

QUOTING

↓

DRIVER SELECTED

↓

PAYMENT PENDING

↓

BOOKED

↓

PICKUP PENDING

↓

PICKUP INSPECTION

↓

TRIP START PENDING

↓

TRIP ACTIVE

↓

IN TRANSIT

↓

DELIVERY PENDING

↓

DELIVERED

↓

COMPLETED

Exceptional states such as:

DISPUTED

CANCELLED

may occur where the applicable conditions are met.

**6.43 Important Separation of Responsibilities**

The system must keep the following concepts separate:

**Transportation Request**

What the customer wants.

**Driver Quotation**

What a driver proposes to charge for transportation.

**Trip**

The official transportation assignment after a driver has been selected and payment/booking requirements have been satisfied.

**Trip Wallet**

The accounting mechanism associated with the financial amounts of that trip.

**Driver Personal Wallet**

The driver's available earnings after the applicable payment-release conditions are satisfied.

This separation is important for both the database design and financial logic.

**6.44 Module Security and Authorization**

The backend must verify ownership and permissions for every major action.

A customer should only be able to:

- Create their own requests.
- View their own requests.
- View quotations associated with their requests.
- Select a driver for their own request.
- View their own bookings.

A driver should only be able to:

- View eligible requests.
- Submit quotations under their own account.
- View their own quotations.
- View assignments assigned to them.

Neither party should be able to modify another user's records by simply changing an ID in an API request.

**6.45 Module Summary**

The Transportation Request and Quotation Module establishes the marketplace mechanism of CarGo Kenya.

It allows the platform to move from:

**A customer needing transportation**

to:

**A verified driver being selected for an official transportation assignment.**

The module therefore provides the foundation for the subsequent Trip, Inspection, Tracking, Payment, and Delivery processes.

The complete flow is:

Customer Creates Request

↓

Request Validated

↓

Eligible Drivers Notified

↓

Drivers Submit Quotations

↓

Customer Compares Drivers

↓

Customer Selects Driver

↓

Payment Calculated

↓

Payment Pending

↓

Customer Pays Full Trip Cost

↓

Trip Wallet Records Funds

↓

Booking Confirmed

↓

Driver Receives Assignment

↓

Pickup Process Begins

**7.0 PAYMENT, TRIP WALLET AND DRIVER WALLET MODULE**

**7.1 Module Overview**

The Payment, Trip Wallet and Driver Wallet Module manages the financial transactions associated with a CarGo Kenya transportation assignment.

The module is responsible for:

- Calculating the total trip cost.
- Receiving the customer's full payment.
- Recording the payment against the correct trip.
- Creating and maintaining the Trip Wallet.
- Separating the driver's transportation fee from the fuel budget and CarGo Kenya service fee.
- Holding driver funds until the required trip milestones are completed.
- Releasing the first 50% of the driver's transportation fee when the trip becomes **TRIP ACTIVE**.
- Releasing the remaining 50% when the trip becomes **COMPLETED**.
- Recording driver earnings in the Driver Personal Wallet.
- Managing wallet transactions.
- Recording withdrawals where applicable.
- Protecting funds when a trip is cancelled, disputed, or otherwise requires administrative intervention.

The module must work closely with:

- Transportation Request Module.
- Quotation Module.
- Trip Module.
- Inspection Module.
- Notification Module.
- Dispute Module.
- Administrator Module.

**7.2 Payment Model**

CarGo Kenya will use a **full-payment-before-booking** model for the MVP.

The customer pays the full agreed trip cost through the platform before the transportation assignment becomes officially confirmed.

The total payment consists of:

Driver Transportation Fee

+

Fuel Budget

+

CarGo Kenya Service Fee

\=

Total Trip Cost

Example:

Driver Transportation Fee = KSh 22,000

Fuel Budget = KSh 12,500

CarGo Kenya Service Fee = KSh 1,500

\-----------------------------------

Total Trip Cost = KSh 36,000

The customer therefore pays:

**KSh 36,000**

through the platform.

**7.3 Why Full Payment Is Required**

The full payment requirement provides financial protection for the transportation assignment.

Once payment has been successfully confirmed:

- The customer has committed the required funds.
- The driver knows that the trip has been financially secured.
- CarGo Kenya can create the official booking.
- Driver earnings can be controlled through verified trip milestones.
- The platform can maintain a clear financial record for the trip.

The driver's transportation fee is **not immediately transferred to the driver**.

Instead, it remains associated with the Trip Wallet until the applicable release conditions are satisfied.

**7.4 Payment Components**

Every confirmed trip should contain three principal financial components.

**1\. Driver Transportation Fee**

This is the amount agreed between the customer and selected driver for transporting the vehicle.

Example:

**KSh 22,000**

**2\. Fuel Budget**

This is the amount allocated to the transportation assignment for fuel requirements.

Example:

**KSh 12,500**

The fuel budget should remain separate from the driver's transportation income.

**3\. CarGo Kenya Service Fee**

This is the amount earned by CarGo Kenya for facilitating the transportation service.

Example:

**KSh 1,500**

**7.5 Total Trip Cost Calculation**

The backend should calculate the final amount.

For example:

Driver Fee = 22,000

Fuel Budget = 12,500

Platform Fee = 1,500

\-------------------------

Total = 36,000

The formula should be:

total_trip_cost =

driver_fee +

fuel_budget +

platform_fee

The calculation must occur on the backend.

The frontend should only display the calculated result.

**7.6 Payment Breakdown Display**

Before payment, the customer should see a transparent breakdown.

Example:

CARGo Kenya Trip Payment

Driver Transportation Fee KSh 22,000

Fuel Budget KSh 12,500

CarGo Kenya Service Fee KSh 1,500

\------------------------------------------

TOTAL KSh 36,000

The customer should confirm the amount before proceeding to payment.

**7.7 Payment Status**

The payment associated with a trip should have a defined status.

The MVP should support statuses such as:

**PENDING**

Payment has not yet been successfully confirmed.

**PROCESSING**

The payment has been initiated and confirmation is pending.

**PAID**

Payment has been successfully confirmed.

**FAILED**

The payment attempt was unsuccessful.

**REFUNDED**

The payment has been refunded according to an approved process.

**PARTIALLY REFUNDED**

Only part of the original payment has been refunded.

The payment status must be determined by verified payment transactions rather than simply by frontend actions.

**7.8 Payment Initiation**

Once the customer has selected a driver, the system calculates the final trip amount.

The trip enters:

**PAYMENT PENDING**

The customer is then presented with the available payment method.

For the MVP, the implementation should use the selected payment provider supported by CarGo Kenya.

The payment process should generate a unique transaction reference.

**7.9 Payment Confirmation**

The system must not assume that payment was successful merely because the customer reached a payment-success screen.

Payment confirmation should be obtained from the payment provider through the appropriate transaction confirmation mechanism.

The backend should verify:

- Transaction reference.
- Amount.
- Payment status.
- Relevant trip.
- Customer/account.
- Payment timestamp.

Only after successful verification should the system mark:

**Payment Status = PAID**

**7.10 Preventing Duplicate Payments**

The system should protect against duplicate payment processing.

For example, if the payment provider sends the same confirmation more than once, the backend should not create multiple credits.

The system should recognize the transaction reference and determine whether it has already been processed.

Example:

Payment Reference

CGK-PAY-000125

First Confirmation

→ Process payment

Second Confirmation

→ Already processed

→ Do not process again

**7.11 Trip Wallet**

Every confirmed trip should have a dedicated Trip Wallet record.

The Trip Wallet is an internal financial-accounting mechanism associated with one specific trip.

It should track:

- Customer payment.
- Driver transportation fee.
- Fuel budget.
- CarGo Kenya service fee.
- First driver payment release.
- Remaining driver balance.
- Refunds.
- Adjustments.
- Payment status.
- Release status.

The Trip Wallet should never be treated as a general-purpose customer wallet.

**7.12 Trip Wallet Structure**

A simplified Trip Wallet could be represented as:

TRIP WALLET

────────────────────────────

Customer Payment 36,000

Driver Fee 22,000

Fuel Budget 12,500

CarGo Fee 1,500

────────────────────────────

Total 36,000

The system should maintain transaction records showing how the funds are allocated and released.

**7.13 Trip Wallet Ownership**

The Trip Wallet belongs to the **trip**, not to the customer or driver.

For example:

Trip

CGK-2026-000125

↓

Trip Wallet

TW-2026-000125

The wallet should therefore be inaccessible for arbitrary modification by either the customer or driver.

**7.14 Driver Funds Before Trip Start**

The driver's transportation fee must remain held until the required trip-start conditions are satisfied.

For example:

Customer pays KSh 36,000

↓

Trip Wallet

↓

Driver Fee = KSh 22,000

↓

Driver Personal Wallet = KSh 0 released from this trip

The driver should not be able to withdraw the KSh 22,000 simply because the customer has paid.

**7.15 First Driver Payment Release**

The first 50% of the driver's transportation fee becomes eligible for release only when the trip officially becomes:

**TRIP ACTIVE**

The following conditions must be satisfied:

- Pickup inspection completed.
- Required photographs captured.
- Odometer recorded.
- Fuel level recorded.
- Vehicle handover completed.
- Required fueling procedures completed.
- Driver selects **START TRIP**.
- Customer confirms trip commencement.

Once all required conditions are satisfied:

TRIP START PENDING

↓

Driver START TRIP

↓

Customer Confirmation

↓

TRIP ACTIVE

↓

Release First 50%

**7.16 First Payment Calculation**

The first release is based on the driver's transportation fee.

Example:

Driver Transportation Fee = KSh 22,000

50% of KSh 22,000

\= KSh 11,000

The system releases:

**KSh 11,000**

to the Driver Personal Wallet.

The fuel budget and CarGo service fee are not included in this 50% driver release calculation.

**7.17 First Payment Transaction**

The system should create a transaction similar to:

Transaction Type:

DRIVER_FIRST_RELEASE

Trip:

CGK-2026-000125

Amount:

KSh 11,000

From:

Trip Wallet

To:

Driver Personal Wallet

Status:

RELEASED

The transaction should contain a timestamp and unique transaction reference.

**7.18 Final Driver Payment Release**

The remaining 50% of the driver's transportation fee remains held until the trip becomes:

**COMPLETED**

The required completion conditions include:

- Vehicle reaches destination.
- Delivery inspection completed.
- Required delivery photographs completed.
- Vehicle handover completed.
- Customer confirms delivery.
- Driver confirms completion.

The system then changes the trip status to:

**COMPLETED**

and the remaining driver balance becomes eligible for release.

**7.19 Final Payment Calculation**

Using the same example:

Driver Transportation Fee = KSh 22,000

First Release:

KSh 11,000

Remaining:

KSh 11,000

The system therefore releases:

**KSh 11,000**

to the Driver Personal Wallet.

Total driver earnings:

KSh 11,000

+

KSh 11,000

\=

KSh 22,000

**7.20 Payment Release Flow**

The complete driver-payment flow is:

CUSTOMER PAYS FULL AMOUNT

↓

TRIP WALLET

↓

Pickup Inspection

↓

Vehicle Handover

↓

Driver START TRIP

↓

Customer Confirms

↓

TRIP ACTIVE

↓

50% DRIVER RELEASE

↓

TRIP IN TRANSIT

↓

DESTINATION

↓

DELIVERY INSPECTION

↓

CUSTOMER + DRIVER CONFIRM

↓

COMPLETED

↓

REMAINING 50% RELEASE

**7.21 Driver Personal Wallet**

The Driver Personal Wallet is separate from the Trip Wallet.

It represents funds that have become available to the driver after satisfying the applicable payment-release conditions.

The wallet should contain:

- Available balance.
- Pending balance where applicable.
- Released earnings.
- Transaction history.
- Withdrawal history.

**7.22 Trip Wallet vs Driver Wallet**

These two wallets must not be confused.

| **Feature** | **Trip Wallet** | **Driver Personal Wallet** |
| --- | --- | --- |
| Purpose | Holds/accounting for one trip | Stores driver's available earnings |
| Associated with | Trip | Driver |
| Customer payment | Recorded | No  |
| Driver pending earnings | Yes | Pending where applicable |
| Released driver earnings | Recorded as transaction | Yes |
| Withdrawal | Not allowed | Allowed where supported |
| Can driver modify balance? | No  | No  |

The Trip Wallet is therefore **trip-specific**, while the Driver Personal Wallet is **driver-specific**.

**7.23 Driver Wallet Balance**

The driver's available balance should be calculated from valid wallet transactions.

For example:

Opening Balance = KSh 5,000

Trip A First Release = +11,000

Trip A Final Release = +11,000

Available Balance = KSh 27,000

The system should not rely solely on a manually editable balance field.

Every balance change should have an associated transaction.

**7.24 Pending Driver Earnings**

Where useful, the system may show pending earnings separately.

Example:

Available Balance: KSh 5,000

Pending Earnings: KSh 11,000

The pending amount represents driver earnings that have been allocated to an active trip but have not yet satisfied the release conditions.

The driver cannot withdraw pending funds.

**7.25 Driver Withdrawal**

Where withdrawal functionality is enabled in the MVP, the driver can request withdrawal from their available Personal Wallet balance.

The backend must verify:

Requested Amount <= Available Balance

If the condition is false, the withdrawal must be rejected.

The driver must never be allowed to withdraw funds directly from:

**Trip Wallet**

or from:

**Pending Earnings**

**7.26 Withdrawal Record**

Every withdrawal request should generate a transaction record containing:

- Withdrawal ID.
- Driver ID.
- Amount.
- Date/time.
- Withdrawal status.
- Payment destination where applicable.
- Provider transaction reference where applicable.

Possible statuses include:

- REQUESTED.
- PROCESSING.
- COMPLETED.
- FAILED.
- CANCELLED.

**7.27 Financial Transaction Ledger**

The payment system should maintain a transaction ledger.

Every important financial event should create a record.

Examples include:

- Customer payment.
- Driver first release.
- Driver final release.
- Refund.
- Adjustment.
- Driver withdrawal.
- Other approved financial transactions.

Example:

TRANSACTION

──────────────────────────────

ID: TXN-000125

Type: DRIVER_FIRST_RELEASE

Trip: CGK-2026-000125

Amount: KSh 11,000

Status: RELEASED

Created: 06 Aug 2026

This creates an auditable financial history.

**7.28 Financial Transaction Immutability**

Completed financial transactions should not simply be deleted or overwritten.

If an error occurs, the system should create an appropriate adjustment or reversal transaction.

For example:

Original Transaction

\+ KSh 11,000

Correction

\- KSh 11,000

Replacement Transaction

\+ KSh 10,000

This creates an audit trail.

**7.29 CarGo Kenya Service Fee**

The CarGo Kenya service fee represents platform revenue.

For example:

Customer Payment = KSh 36,000

Driver Fee = KSh 22,000

Fuel Budget = KSh 12,500

CarGo Fee = KSh 1,500

The system should record:

**CarGo Kenya Revenue = KSh 1,500**

subject to any refunds or approved adjustments.

**7.30 Fuel Budget Accounting**

The fuel budget must remain separately identifiable.

For example:

Trip Wallet

Driver Fee KSh 22,000

Fuel Budget KSh 12,500

CarGo Fee KSh 1,500

The driver should not automatically receive:

**KSh 34,500**

as driver earnings.

The driver's transportation earnings remain:

**KSh 22,000**

unless an approved adjustment changes the amount.

**7.31 Payment Protection**

The payment system must protect funds when a trip encounters an exceptional situation.

Examples include:

- Failed pickup.
- Customer cancellation.
- Driver cancellation.
- Vehicle condition dispute.
- Delivery dispute.
- Payment dispute.
- Administrative investigation.

Affected funds should remain protected until the applicable resolution has been determined.

**7.32 Failed Pickup**

If a driver fails to collect the vehicle, the driver's payment should not automatically be released merely because the customer has already paid.

For example:

Customer Payment

↓

Trip Wallet

↓

Driver fails to complete pickup

↓

No TRIP ACTIVE

↓

First 50% NOT RELEASED

The administrator can then determine the appropriate outcome according to the cancellation/dispute rules.

**7.33 Driver Cancellation Before Trip Start**

If the driver cancels before the trip becomes active, the system should prevent the driver from receiving the first 50% release.

The trip should enter the applicable cancellation/dispute workflow.

The system should preserve the financial records until the appropriate settlement decision is made.

**7.34 Disputed Trip**

If a trip becomes:

**DISPUTED**

the system should prevent automatic financial releases that have not yet become eligible.

For example, if the customer disputes delivery before completion:

Trip = DISPUTED

Remaining 50%

↓

HELD

↓

Administrator Review

The final settlement should only occur after the dispute has been resolved.

**7.35 Refunds**

Where a refund is approved, the system should create a refund transaction associated with the original payment.

The system should record:

- Original payment.
- Refund amount.
- Refund reason.
- Approving administrator where applicable.
- Refund timestamp.
- Payment provider reference.

The original payment record should remain intact.

**7.36 Partial Refunds**

The system should support partial refunds where necessary.

Example:

Original Payment = KSh 36,000

Approved Refund = KSh 5,000

Remaining Financial Amount = KSh 31,000

The refund must be recorded as a separate transaction.

**7.37 Payment Adjustments**

An adjustment may be required when an approved change affects the financial value of a trip.

Examples include:

- Approved destination change.
- Approved additional transportation cost.
- Approved refund.
- Administrative correction.

The adjustment must be recorded against the trip.

**7.38 Backend Payment Validation**

All financial calculations and payment releases must occur on the backend.

The frontend should never be trusted to determine:

- Whether a payment was successful.
- How much the driver should receive.
- Whether 50% should be released.
- Whether the trip is completed.
- The wallet balance.
- Whether a withdrawal is allowed.

The backend must verify the relevant conditions.

**7.39 First Release Logic**

Conceptually, the backend logic should follow:

IF

pickup_inspection = COMPLETED

AND photos = COMPLETED

AND odometer = RECORDED

AND fuel_level = RECORDED

AND handover = CONFIRMED

AND driver_started_trip = TRUE

AND customer_confirmed_start = TRUE

AND trip_status = TRIP ACTIVE

AND first_release = NOT YET PROCESSED

THEN

release 50% of driver_fee

create wallet transaction

mark first_release = PROCESSED

This prevents the same payment from being released twice.

**7.40 Final Release Logic**

The final release should conceptually follow:

IF

delivery_inspection = COMPLETED

AND delivery_handover = CONFIRMED

AND customer_confirmed_delivery = TRUE

AND driver_confirmed_completion = TRUE

AND trip_status = COMPLETED

AND final_release = NOT YET PROCESSED

THEN

release remaining driver balance

create wallet transaction

mark final_release = PROCESSED

Again, the backend must ensure the transaction cannot be processed twice.

**7.41 Payment Idempotency**

Payment and wallet operations should be designed so that repeating the same request does not create duplicate financial transactions.

For example:

Release Request

TXN-DRIVER-FIRST-000125

↓

Already processed?

↓

YES

↓

Do not release again

This is particularly important when:

- Network connections fail.
- Users refresh pages.
- Payment providers resend notifications.
- API requests are retried.

**7.42 Payment Notifications**

The system should notify users when important financial events occur.

**Customer**

- Payment initiated.
- Payment successful.
- Booking confirmed.
- Refund processed where applicable.

**Driver**

- Customer payment confirmed.
- First 50% released.
- Final 50% released.
- Withdrawal successful/failed.
- Financial adjustment.

**7.43 Administrator Financial Controls**

Administrators should be able to view financial records but should not casually modify completed financial transactions.

The administrator may:

- View payments.
- View Trip Wallets.
- View driver wallet transactions.
- Review refunds.
- Approve applicable adjustments.
- Review disputed transactions.
- Monitor payment failures.

Sensitive financial actions should require appropriate authorization.

**7.44 Payment Audit Trail**

The system should maintain an audit trail for important financial actions.

The audit information should include:

- User/system responsible.
- Action.
- Amount.
- Trip.
- Transaction reference.
- Date/time.
- Previous state where applicable.
- New state where applicable.

This will help CarGo Kenya investigate payment disputes and operational errors.

**7.45 End-to-End Financial Example**

Consider a trip where:

Driver Fee = KSh 22,000

Fuel Budget = KSh 12,500

CarGo Fee = KSh 1,500

Total = KSh 36,000

**Step 1 — Customer Pays**

Customer

↓

KSh 36,000

↓

Trip Wallet

Trip status:

**BOOKED**

**Step 2 — Pickup**

Driver completes:

- Inspection.
- Photographs.
- Odometer.
- Fuel recording.
- Handover.

Driver selects:

**START TRIP**

Customer confirms.

Trip becomes:

**TRIP ACTIVE**

**Step 3 — First Release**

Driver fee:

**KSh 22,000**

50%:

**KSh 11,000**

Released:

Trip Wallet

↓

KSh 11,000

↓

Driver Personal Wallet

Remaining driver amount:

**KSh 11,000**

**Step 4 — Transportation**

The driver continues transportation.

GPS and milestones are recorded.

The remaining driver amount stays protected.

**Step 5 — Delivery**

Driver completes:

- Delivery inspection.
- Photographs.
- Odometer.
- Fuel recording where applicable.
- Handover.

Customer confirms delivery.

Driver confirms completion.

Trip becomes:

**COMPLETED**

**Step 6 — Final Release**

Remaining driver fee:

**KSh 11,000**

Released:

Trip Wallet

↓

KSh 11,000

↓

Driver Personal Wallet

Total driver earnings:

**KSh 22,000**

CarGo Kenya service fee:

**KSh 1,500**

**7.46 Module Security Requirements**

The payment module must implement strong authorization controls.

The system must prevent users from:

- Changing payment amounts.
- Increasing wallet balances.
- Triggering driver releases manually.
- Withdrawing held funds.
- Accessing another user's wallet.
- Modifying completed transactions.
- Creating fake payment confirmations.

All financial actions must be validated server-side.

**7.47 Payment Module Data Relationships**

The basic relationship is:

CUSTOMER

↓

PAYMENT

↓

TRIP

↓

TRIP WALLET

├── Driver Fee

├── Fuel Budget

├── CarGo Fee

├── First Release

├── Final Release

├── Refunds

└── Adjustments

↓

DRIVER PERSONAL WALLET

↓

WITHDRAWAL

This structure should guide the database design in the next stages.

**7.48 Payment Module Summary**

The Payment, Trip Wallet and Driver Wallet Module provides the financial foundation of CarGo Kenya.

The MVP financial model is:

**Customer pays the full trip cost upfront → funds are associated with the Trip Wallet → driver receives 50% when the trip officially becomes TRIP ACTIVE → remaining 50% is released when the trip becomes COMPLETED.**

This approach protects the customer, driver and platform while maintaining a clear financial record for every transportation assignment.

**8.0 TRIP MANAGEMENT AND LIFECYCLE MODULE**

**8.1 Module Overview**

The Trip Management and Lifecycle Module is the central operational module of CarGo Kenya.

It controls the complete transportation process from the moment a customer submits a transportation request until the vehicle is delivered, the trip is completed, and the driver's remaining eligible payment is released.

The module connects several major CarGo Kenya functions, including:

- Customer transportation requests.
- Driver quotations.
- Driver selection.
- Booking confirmation.
- Payment confirmation.
- Pickup scheduling.
- Vehicle inspection.
- Vehicle handover.
- Trip commencement.
- GPS tracking.
- Trip milestones.
- Destination changes.
- Delivery inspection.
- Delivery confirmation.
- Trip completion.
- Driver payment release.
- Customer rating.
- Dispute handling.

The Trip Management Module should act as the **source of truth for the current state of every transportation assignment**.

**8.2 Purpose of the Trip Module**

The primary purpose of this module is to ensure that every transportation assignment follows a controlled and traceable lifecycle.

A trip should never simply move from:

**BOOKED → COMPLETED**

without the required operational activities being recorded.

Instead, the platform should maintain a structured sequence of events.

The general lifecycle is:

REQUESTED

↓

QUOTING

↓

DRIVER SELECTED

↓

PAYMENT PENDING

↓

BOOKED

↓

PICKUP PENDING

↓

PICKUP INSPECTION

↓

TRIP START PENDING

↓

TRIP ACTIVE

↓

IN TRANSIT

↓

DELIVERY PENDING

↓

DELIVERED

↓

COMPLETED

A trip may also move into:

DISPUTED

or:

CANCELLED

when applicable.

**8.3 Trip Reference**

Every confirmed trip must receive a unique Trip Reference.

Example:

CGK-2026-000125

The Trip Reference will be used throughout the platform.

It should appear on:

- Customer trip records.
- Driver trip records.
- Inspection records.
- Payment records.
- Trip Wallet.
- Notifications.
- Disputes.
- Administrative records.
- Delivery records.

The Trip Reference should never change after creation.

**8.4 Trip Record**

Each trip should have a central trip record containing the information necessary to manage the transportation assignment.

The record should include:

**Customer Information**

- Customer ID.
- Customer name.
- Customer contact information where authorized.

**Driver Information**

- Driver ID.
- Driver name.
- Driver contact information where appropriate.
- Driver verification status.

**Vehicle Information**

- Vehicle ID where applicable.
- Registration number.
- Make.
- Model.
- Vehicle category.
- Relevant vehicle details.

**Transportation Information**

- Pickup location.
- Destination.
- Requested pickup date.
- Expected delivery date.
- Route.
- Trip requirements.

**Financial Information**

- Driver transportation fee.
- Fuel budget.
- CarGo Kenya service fee.
- Total trip cost.
- Payment status.
- Trip Wallet reference.

**Operational Information**

- Trip status.
- Pickup inspection.
- Delivery inspection.
- GPS tracking.
- Milestones.
- Confirmations.
- Completion information.

**8.5 Trip Status as the Source of Truth**

The system should maintain one official current status for every trip.

For example:

Trip:

CGK-2026-000125

Current Status:

TRIP ACTIVE

Other information such as GPS position, inspection records and milestones should support the status but should not create contradictory states.

For example, the system should not allow:

Trip Status: BOOKED

AND

Driver Payment Status: First 50% Released

because the first 50% release requires the trip to have become **TRIP ACTIVE**.

**8.6 Trip Statuses**

The MVP will use the following statuses.

**REQUESTED**

The customer has submitted a transportation request.

At this stage:

- The trip request exists.
- No driver has been selected.
- No payment has been confirmed.
- The request may be available for eligible drivers.

**QUOTING**

Eligible drivers may submit quotations for the request.

The system records:

- Driver.
- Quoted transportation fee.
- Date and time.
- Quote status.

Multiple drivers may quote for the same request.

**DRIVER SELECTED**

The customer has selected a driver.

At this stage:

- The selected driver is associated with the trip.
- The agreed driver fee is established.
- The customer proceeds toward payment.

The driver should receive notification of the selection.

**PAYMENT PENDING**

The customer has selected a driver but the required payment has not yet been successfully confirmed.

The system should not treat the trip as financially confirmed.

**BOOKED**

Payment has been successfully confirmed and the transportation assignment is officially booked.

The system should:

- Create/activate the Trip Wallet.
- Confirm the selected driver.
- Generate the official Trip Reference.
- Notify the relevant parties.
- Move the trip toward pickup scheduling.

**8.7 PICKUP PENDING**

The trip has been booked but the vehicle has not yet entered the pickup inspection process.

The system should display:

- Pickup location.
- Pickup date/time.
- Driver information.
- Vehicle information.
- Customer/authorized representative information.

The driver should be able to indicate readiness for pickup.

**8.8 PICKUP INSPECTION**

The driver is physically present at the pickup location and the vehicle inspection process is underway.

The required activities include:

- Vehicle identity confirmation.
- Pickup location confirmation.
- Odometer recording.
- Fuel-level recording.
- Required photographs.
- Existing damage recording.
- Vehicle condition observations.
- Vehicle handover confirmation.

The inspection information must be stored against the trip.

**8.9 TRIP START PENDING**

This status exists between pickup completion and official transportation commencement.

The purpose is to ensure that the vehicle does not become officially "in transit" simply because the driver completed the inspection.

At this stage:

- Pickup inspection is complete.
- Vehicle handover has been recorded.
- Required documentation has been captured.
- Driver is ready to begin transportation.
- Driver must select **START TRIP**.
- Customer must confirm trip commencement.

The first 50% driver payment must **not** be released merely because the inspection is complete.

**8.10 TRIP ACTIVE**

The trip becomes **TRIP ACTIVE** when:

1.  Pickup inspection has been completed.
2.  Required pickup information has been recorded.
3.  Driver selects **START TRIP**.
4.  Customer confirms trip commencement.

The system then officially recognizes that transportation has begun.

At this point:

- GPS tracking becomes active.
- The first 50% of the driver's transportation fee becomes eligible for release.
- Trip milestones can begin being recorded.
- The customer receives confirmation that the trip has started.

**8.11 IN TRANSIT**

The trip is actively underway.

The system may record:

- Current GPS location.
- Last known GPS location.
- Movement information.
- Trip milestones.
- Fuel stops.
- Route milestones.
- Delays.
- Driver updates.

The driver should be able to provide relevant updates during transportation.

**8.12 DELIVERY PENDING**

The vehicle has reached or is approaching the destination and delivery procedures have not yet been fully completed.

The driver should begin the delivery process.

The system should prompt for:

- Delivery inspection.
- Delivery photographs.
- Odometer.
- Fuel level where applicable.
- Vehicle condition.
- Handover confirmation.

**8.13 DELIVERED**

The vehicle has been physically delivered and the delivery inspection and handover procedures have been completed.

However, the trip should not automatically become **COMPLETED** until the required final confirmations have been received.

This distinction is important because:

**DELIVERED ≠ COMPLETED**

Delivery means the physical transportation process has reached its destination.

Completion means the digital transaction has been properly closed.

**8.14 COMPLETED**

A trip becomes **COMPLETED** when:

- Vehicle delivery has occurred.
- Delivery inspection is complete.
- Required delivery documentation is complete.
- Customer confirms successful delivery.
- Driver confirms completion.

Once the trip becomes COMPLETED:

- The trip is formally closed.
- Remaining eligible driver funds are released.
- The trip becomes part of the driver's completed-trip history.
- Customer rating becomes available.
- The trip becomes part of CarGo Kenya's operational records.

**8.15 DISPUTED**

A trip enters **DISPUTED** when a formal issue requires administrative intervention.

Possible reasons include:

- Vehicle damage dispute.
- Missing vehicle documentation.
- Payment issue.
- Fuel dispute.
- Delivery dispute.
- Driver conduct issue.
- Customer conduct issue.
- Unauthorized route/destination change.
- Other serious operational problems.

While disputed:

- Relevant evidence must be preserved.
- Automatic financial releases should be prevented where appropriate.
- An administrator should review the issue.

**8.16 CANCELLED**

A trip becomes **CANCELLED** when the transportation assignment is terminated according to the applicable cancellation process.

The system should record:

- Who initiated cancellation.
- Reason.
- Date/time.
- Trip status before cancellation.
- Financial consequences.
- Refund decision where applicable.
- Administrator involvement where required.

**8.17 Trip State Transition Rules**

The backend must control which statuses can follow other statuses.

A simplified transition structure is:

REQUESTED

↓

QUOTING

↓

DRIVER SELECTED

↓

PAYMENT PENDING

↓

BOOKED

↓

PICKUP PENDING

↓

PICKUP INSPECTION

↓

TRIP START PENDING

↓

TRIP ACTIVE

↓

IN TRANSIT

↓

DELIVERY PENDING

↓

DELIVERED

↓

COMPLETED

Not every user should be allowed to trigger every transition.

**8.18 Status Transition Permissions**

**Customer**

The customer may perform actions such as:

- Create request.
- Select driver.
- Make payment.
- Confirm trip start.
- Confirm delivery.
- Report dispute.
- Confirm destination changes where applicable.
- Rate driver.

**Driver**

The driver may:

- Submit quotation.
- Accept assignment where required.
- Begin pickup inspection.
- Record inspection information.
- Select START TRIP.
- Record milestones.
- Provide GPS information.
- Complete delivery inspection.
- Confirm completion.
- Report issues.

**Administrator**

The administrator may:

- Review abnormal trips.
- Resolve disputes.
- Cancel trips where authorized.
- Correct operational states under controlled procedures.
- Review evidence.
- Manage exceptional cases.

**8.19 Trip Creation**

A trip request begins when the customer submits a transportation request.

The request should contain:

- Vehicle information.
- Pickup location.
- Destination.
- Preferred pickup date.
- Relevant transportation requirements.

At this point the trip enters:

**REQUESTED**

The system should generate a unique internal ID even before the final public Trip Reference is assigned.

**8.20 Driver Matching**

The system should identify drivers who are eligible for the transportation request.

Matching factors may include:

- Driver verification status.
- Route experience.
- Driver availability.
- Vehicle/transportation requirements.
- Location.
- Driver performance.
- Other MVP-approved eligibility rules.

The MVP does not need an advanced AI matching engine.

Basic rule-based matching is sufficient.

**8.21 Driver Quotation**

Eligible drivers may submit quotations.

Each quotation should contain:

- Driver ID.
- Trip request ID.
- Transportation fee.
- Estimated availability.
- Submission time.
- Quote status.

Example:

Driver A

Transportation Fee: KSh 20,000

Driver B

Transportation Fee: KSh 22,000

Driver C

Transportation Fee: KSh 21,500

The customer can compare the available quotations.

**8.22 Customer Driver Selection**

The customer selects one driver.

The system should then:

- Mark the selected driver.
- Close or invalidate competing quotations as appropriate.
- Store the agreed driver fee.
- Calculate the remaining trip costs.
- Generate the final booking amount.
- Move the trip to PAYMENT PENDING.

**8.23 Booking Price Lock**

Once the customer proceeds to payment, the agreed financial values should be locked for that booking.

For example:

Driver Fee: KSh 22,000

Fuel Budget: KSh 12,500

CarGo Fee: KSh 1,500

Total: KSh 36,000

The system should not allow the customer or driver to silently change these values.

Any subsequent financial change must go through the approved trip-change process.

**8.24 Booking Confirmation**

Once payment has been verified:

PAYMENT PENDING

↓

PAYMENT SUCCESSFUL

↓

BOOKED

The platform should then notify:

- Customer.
- Driver.
- Administrator where required.

The booking becomes an official CarGo Kenya transportation assignment.

**8.25 Pickup Scheduling**

After booking, the system should make pickup information available to the driver.

The information should include:

- Pickup location.
- Vehicle details.
- Scheduled date/time.
- Customer/authorized representative contact information where permitted.
- Special instructions.

The driver should have sufficient information to reach the pickup location.

**8.26 Driver Contact Access**

Because physical vehicle transportation requires coordination, the system should allow appropriate communication after booking.

After a booking is confirmed, the relevant driver/customer contact information may become visible according to the platform's communication rules.

The purpose is to allow:

- Pickup coordination.
- Location clarification.
- Vehicle identification.
- Arrival coordination.
- Delivery coordination.

This does not change the requirement that payment remains within CarGo Kenya.

**8.27 Pickup Arrival**

When the driver arrives at the pickup location, the driver should begin the pickup procedure.

The driver should verify:

- Correct location.
- Correct vehicle.
- Authorized handover person.
- Vehicle registration/identity.
- Relevant trip reference.

The driver should not start transportation before completing the required inspection.

**8.28 Pickup Inspection**

The inspection process should capture the vehicle's condition before transportation.

The driver should record:

- Odometer.
- Fuel level.
- Vehicle photographs.
- Existing visible damage.
- Relevant observations.

The system should attach all evidence to the specific trip inspection.

**8.29 Inspection Confirmation**

Both relevant parties should have an opportunity to confirm the recorded condition.

The system should record:

Driver Confirmation

+

Customer/Authorized Representative Confirmation

The confirmation should include:

- User ID.
- Date/time.
- Trip reference.
- Inspection reference.

**8.30 Vehicle Condition Mismatch**

If the actual vehicle condition differs from the original request, the difference must be recorded before the trip proceeds.

Example:

Original declaration:

No visible damage

Pickup inspection:

Existing damage identified

The driver should capture:

- Photographs.
- Written description.
- Timestamp.
- Location.
- Inspection information.

The customer or authorized representative should be given an opportunity to acknowledge the discrepancy.

If the discrepancy affects safety or the agreed transportation conditions, the trip may require administrative review.

**8.31 Starting the Trip**

After pickup inspection and handover:

PICKUP INSPECTION

↓

TRIP START PENDING

The driver then selects:

**START TRIP**

The system sends a confirmation request to the customer.

The customer confirms:

**YES — START TRIP**

The system changes:

TRIP START PENDING

↓

TRIP ACTIVE

**8.32 Protection Against False Trip Start**

The system should not allow a driver to receive the first 50% payment merely by clicking START TRIP.

The backend must verify:

- Pickup inspection exists.
- Required photographs exist.
- Odometer exists.
- Fuel reading exists.
- Handover exists.
- Driver started trip.
- Customer confirmed.
- Trip status changed to TRIP ACTIVE.

Only then should the payment module release the first 50%.

**8.33 GPS Tracking Activation**

GPS tracking should become active once the trip officially enters the transportation stage.

The primary trigger is:

**TRIP ACTIVE**

The system may record:

- Latitude.
- Longitude.
- Timestamp.
- Accuracy where available.
- Last known location.

The customer should be able to view the driver's latest available trip location.

**8.34 GPS Tracking Limitations**

GPS should not be treated as perfect real-time information.

The system must account for:

- Weak network coverage.
- GPS inaccuracies.
- Battery limitations.
- Application being temporarily offline.
- Device location permissions.

If GPS stops updating temporarily, the system should retain the last known location rather than incorrectly marking the trip as failed.

**8.35 Trip Milestones**

Milestones provide a human-readable journey record.

Examples include:

PICKUP COMPLETED

TRIP STARTED

FUEL STOP

MAJOR ROUTE MILESTONE

TEMPORARY DELAY

DESTINATION REACHED

DELIVERY INSPECTION STARTED

DELIVERY COMPLETED

Each milestone should contain:

- Trip ID.
- Milestone type.
- Timestamp.
- Location where available.
- User/system that created it.
- Optional notes.

**8.36 Fuel Stop Milestone**

A fuel stop may be recorded during transportation.

The driver may record:

- Fuel stop location.
- Date/time.
- Fuel amount where applicable.
- Receipt/photo where required.
- Relevant notes.

The exact fuel accounting process remains separate from the driver's transportation earnings.

**8.37 Trip Delays**

A driver should be able to report a significant delay.

Examples:

- Traffic.
- Mechanical issue.
- Road closure.
- Weather.
- Security concern.
- Other legitimate operational reason.

A delay record should include:

- Reason.
- Timestamp.
- Location.
- Optional description.
- Supporting evidence where necessary.

The customer should receive a notification for significant delays.

**8.38 Destination Change**

A customer may request a destination change after the trip has started.

The request must go through the platform.

The system should record:

- Original destination.
- New destination.
- Reason.
- Additional cost if applicable.
- Driver response.
- Customer confirmation.
- Date/time.

The driver should not be forced to accept a materially different transportation assignment without agreement.

**8.39 Destination Change Workflow**

The process should be:

Customer Requests Change

↓

System Records Request

↓

Driver Reviews

↓

Driver Accepts/Rejects

↓

Additional Cost Calculated

↓

Customer Accepts Cost

↓

Change Confirmed

If the change requires additional payment, the payment module should handle the additional amount.

**8.40 Arrival at Destination**

When the vehicle reaches the destination, the driver should update the trip accordingly.

The trip moves toward:

**DELIVERY PENDING**

The driver should begin the delivery procedure.

**8.41 Delivery Inspection**

The delivery inspection provides evidence of vehicle condition at the end of transportation.

The system should record:

- Vehicle photographs.
- Odometer.
- Fuel level where applicable.
- Visible condition.
- New damage if any.
- Relevant observations.

The delivery inspection should be linked directly to the trip.

**8.42 Delivery Condition Comparison**

Where practical, the system should allow the pickup and delivery inspection records to be compared.

For example:

PICKUP

Odometer: 42,500 km

DELIVERY

Odometer: 43,020 km

Similarly, photographs and damage observations can be compared.

This provides useful evidence if a dispute occurs.

**8.43 Delivery Confirmation**

Once delivery inspection and handover are complete:

The customer confirms:

**VEHICLE RECEIVED**

The driver confirms:

**DELIVERY COMPLETED**

The system can then move the trip to:

**DELIVERED**

**8.44 Trip Completion**

After delivery confirmation:

DELIVERED

↓

COMPLETED

The system should verify all required completion conditions before making the final transition.

These include:

- Delivery inspection completed.
- Required photographs completed.
- Customer confirmation.
- Driver confirmation.
- No blocking dispute.

**8.45 Final Driver Payment Trigger**

Once the trip becomes:

**COMPLETED**

the Payment Module is notified.

The Payment Module then checks whether the final 50% has already been released.

If not:

Remaining Driver Fee

↓

Release

↓

Driver Personal Wallet

This ensures that the Trip Module controls the operational condition while the Payment Module controls the financial transaction.

**8.46 Customer Rating Trigger**

Once the trip becomes COMPLETED:

The customer becomes eligible to rate the driver.

The system should provide:

Rate Driver

★★★★★

Optional Review

The rating should be linked to the completed trip.

**8.47 Trip History**

Completed trips should remain accessible in trip history.

**Customer**

The customer should see:

- Trip reference.
- Vehicle.
- Driver.
- Route.
- Price.
- Payment information.
- Pickup record.
- Delivery record.
- Completion date.
- Rating.

**Driver**

The driver should see:

- Trip reference.
- Customer information necessary for history.
- Vehicle.
- Route.
- Earnings.
- Inspection records.
- Completion status.
- Rating received.

**8.48 Trip Timeline**

Each trip should have a chronological timeline.

Example:

08:15 Driver arrived at pickup

08:23 Inspection started

08:35 Inspection completed

08:40 Vehicle handover confirmed

08:42 Driver selected START TRIP

08:44 Customer confirmed trip start

08:44 TRIP ACTIVE

08:45 First 50% payment released

11:20 Fuel stop recorded

16:30 Destination reached

16:45 Delivery inspection completed

16:52 Customer confirmed delivery

16:53 Driver confirmed completion

16:53 TRIP COMPLETED

16:54 Final 50% payment released

This timeline becomes a valuable operational and audit record.

**8.49 Exception Handling**

The system must not assume that every trip proceeds perfectly.

It should support exceptional situations such as:

- Driver fails to arrive.
- Customer is unavailable.
- Vehicle condition mismatch.
- Driver cancellation.
- Customer cancellation.
- GPS failure.
- Network failure.
- Vehicle breakdown.
- Destination change.
- Delivery dispute.
- Payment failure.
- Other operational incidents.

The MVP may use administrator intervention for complex cases rather than attempting to automate every exception.

**8.50 Failed Pickup**

If the driver arrives but cannot collect the vehicle, the trip should not become TRIP ACTIVE.

Possible reasons include:

- Vehicle unavailable.
- Wrong vehicle.
- Unauthorized person.
- Vehicle condition issue.
- Customer unavailable.
- Safety issue.

The driver should record the issue.

The trip may then remain pending or enter the dispute/cancellation process depending on the circumstances.

**8.51 Vehicle Breakdown**

If a vehicle experiences a breakdown during transportation, the driver should report the incident.

The report may contain:

- Location.
- Description.
- Photographs.
- Time.
- Current trip status.
- Relevant supporting information.

The administrator may then coordinate the appropriate response.

The trip should not automatically be marked COMPLETED.

**8.52 GPS Failure During Transportation**

If GPS becomes unavailable:

- The last known location remains available.
- The driver can continue recording milestones.
- The trip remains active.
- GPS information synchronizes when connectivity returns where technically feasible.

GPS failure alone should not cancel a trip.

**8.53 Network Failure**

Where technically feasible, the application should temporarily preserve important information locally.

For example:

- Inspection information.
- Photos queued for upload.
- Milestones.
- GPS information.

When connectivity returns, the application can synchronize the pending information with the server.

**8.54 Duplicate Actions**

The backend should prevent duplicate operational actions.

For example, the driver should not be able to trigger:

START TRIP

START TRIP

START TRIP

and cause multiple payment releases.

The first valid action should be processed.

Subsequent requests should be rejected or treated as already completed.

**8.55 Unauthorized Status Changes**

Users must not be able to directly modify trip status through frontend requests.

For example, a customer should not be able to send:

status = COMPLETED

and cause the trip to become completed.

The backend must determine whether the required conditions have been satisfied.

**8.56 Trip Module and Payment Module Relationship**

The Trip Module and Payment Module should remain logically separate.

The Trip Module determines:

**Has the operational milestone been achieved?**

The Payment Module determines:

**Should the corresponding financial amount be released?**

Example:

Trip Module

TRIP ACTIVE

↓

Payment Module

Release First 50%

and:

Trip Module

COMPLETED

↓

Payment Module

Release Remaining 50%

This separation will make the system easier to maintain and expand.

**8.57 Trip Module and Inspection Module**

The Inspection Module records the vehicle condition.

The Trip Module uses the inspection completion status to determine whether the trip can progress.

For example:

Inspection Module

↓

Inspection Completed

↓

Trip Module

↓

TRIP START PENDING

The Trip Module should not duplicate the entire inspection record.

Instead, it should reference the inspection record.

**8.58 Trip Module and GPS Module**

The Trip Module determines whether GPS tracking should be active.

Once:

**TRIP ACTIVE**

the GPS service may begin recording location information.

The GPS system should associate location records with:

- Trip ID.
- Driver ID.
- Timestamp.

**8.59 Trip Module and Notification Module**

Important status changes should trigger notifications.

Examples:

BOOKED

↓

Notify Customer + Driver

TRIP ACTIVE

↓

Notify Customer

DELIVERED

↓

Notify Customer + Driver

COMPLETED

↓

Notify Customer + Driver

Notifications should be generated by system events rather than manually by users wherever possible.

**8.60 Trip Module and Dispute Module**

When a user raises a serious issue:

ACTIVE TRIP

↓

DISPUTE REPORTED

↓

DISPUTED

↓

ADMIN REVIEW

The dispute record should reference the original trip rather than creating a completely separate transportation record.

**8.61 Core Trip Actions**

The MVP should provide the following major actions.

**Customer**

- Create trip request.
- View quotations.
- Select driver.
- Make payment.
- View trip.
- Confirm trip start.
- View tracking.
- Confirm delivery.
- Report issue.
- Rate driver.

**Driver**

- View eligible requests.
- Submit quote.
- View assigned trip.
- View pickup information.
- Start inspection.
- Submit inspection.
- Select START TRIP.
- Record milestone.
- Report delay.
- Report issue.
- Complete delivery inspection.
- Confirm completion.
- View earnings.

**Administrator**

- View trips.
- Monitor active trips.
- Review inspections.
- Review disputes.
- Review payment status.
- Intervene in exceptional cases.
- View trip history.

**8.62 Core Trip Data Model**

At a high level, a trip record should contain fields similar to:

Trip

\--------------------------------

id

trip_reference

customer_id

driver_id

vehicle_id

pickup_location

destination

pickup_date

status

driver_fee

fuel_budget

platform_fee

total_amount

payment_status

trip_wallet_id

pickup_inspection_id

delivery_inspection_id

started_at

completed_at

created_at

updated_at

The exact database implementation can be refined during the database-design stage.

**8.63 Trip Milestone Data Model**

A milestone record may contain:

Trip Milestone

\--------------------------------

id

trip_id

milestone_type

description

latitude

longitude

created_by

created_at

This allows the system to maintain a chronological operational history.

**8.64 Trip Status History**

The system should maintain historical status changes.

Example:

REQUESTED

↓

QUOTING

↓

DRIVER SELECTED

↓

PAYMENT PENDING

↓

BOOKED

↓

PICKUP PENDING

↓

PICKUP INSPECTION

↓

TRIP START PENDING

↓

TRIP ACTIVE

↓

IN TRANSIT

↓

DELIVERY PENDING

↓

DELIVERED

↓

COMPLETED

The system should preserve the previous status rather than only storing the current status.

This makes the trip auditable.

**8.65 Trip Status History Record**

A status-history record may contain:

Trip Status History

\--------------------------------

id

trip_id

previous_status

new_status

changed_by

reason

created_at

For example:

Trip: CGK-2026-000125

Previous:

TRIP START PENDING

New:

TRIP ACTIVE

Changed By:

Customer

Time:

08:44

**8.66 MVP Trip Lifecycle — Final Developer Flow**

The complete operational flow can therefore be summarized as:

CUSTOMER CREATES REQUEST

↓

REQUESTED

↓

QUOTING

↓

CUSTOMER SELECTS DRIVER

↓

DRIVER SELECTED

↓

PAYMENT PENDING

↓

CUSTOMER PAYS FULL AMOUNT

↓

PAYMENT VERIFIED

↓

BOOKED

↓

PICKUP PENDING

↓

DRIVER ARRIVES

↓

PICKUP INSPECTION

↓

INSPECTION + HANDOVER COMPLETE

↓

TRIP START PENDING

↓

DRIVER SELECTS START TRIP

↓

CUSTOMER CONFIRMS

↓

TRIP ACTIVE

↓

FIRST 50% DRIVER PAYMENT RELEASE

↓

IN TRANSIT

↓

GPS + MILESTONES

↓

DESTINATION REACHED

↓

DELIVERY PENDING

↓

DELIVERY INSPECTION

↓

DELIVERED

↓

CUSTOMER + DRIVER CONFIRM

↓

COMPLETED

↓

FINAL 50% DRIVER PAYMENT RELEASE

↓

CUSTOMER RATING

↓

TRIP HISTORY

**9.0 VEHICLE INSPECTION AND HANDOVER MODULE**

**9.1 Purpose**

The Vehicle Inspection and Handover Module shall provide a structured process for documenting the condition of a vehicle before transportation and after delivery.

The module is intended to protect the customer, driver, and CarGo Kenya by creating a reliable digital record of the vehicle's condition at important points in the transportation process.

The module shall form an important part of the CarGo Kenya trust and accountability system.

The MVP shall support two primary inspection stages:

1.  **Pickup Inspection**
2.  **Delivery Inspection**

The pickup inspection shall occur before the trip officially begins.

The delivery inspection shall occur when the vehicle reaches the destination.

The inspection records shall be permanently associated with the relevant trip.

**9.2 Inspection Stages**

The system shall support the following inspection lifecycle:

PICKUP PENDING

↓

PICKUP INSPECTION

↓

TRIP START PENDING

↓

TRIP ACTIVE

↓

IN TRANSIT

↓

DELIVERY PENDING

↓

DELIVERED

↓

COMPLETED

The inspection module shall not independently change the overall trip status without satisfying the applicable trip-management rules.

For example, completing the pickup inspection does not automatically make the trip TRIP ACTIVE.

Instead:

Pickup Inspection Completed

↓

TRIP START PENDING

↓

Driver selects START TRIP

↓

Customer confirms trip commencement

↓

TRIP ACTIVE

This is important because the first 50% of the driver's transportation fee is released only after the trip officially becomes TRIP ACTIVE.

**9.3 Pickup Inspection**

The pickup inspection shall be performed when the driver arrives at the location where the vehicle is being collected.

The driver shall be required to complete the inspection before transportation officially begins.

The pickup inspection shall establish the vehicle's documented condition at the beginning of the trip.

The inspection shall include:

- Vehicle identity confirmation.
- Pickup location confirmation.
- Odometer reading.
- Fuel level.
- Vehicle photographs.
- Existing visible damage.
- Additional observations where applicable.
- Driver confirmation.
- Customer or authorized representative confirmation.
- Date and time of inspection.

**9.4 Vehicle Identity Verification**

Before completing the inspection, the driver shall confirm that the vehicle being collected corresponds to the vehicle recorded in the CarGo Kenya transportation request.

The system should provide the driver with the relevant vehicle information for verification.

Depending on the vehicle information supplied during booking, this may include:

- Registration number.
- Make.
- Model.
- Vehicle category.
- Colour.
- Other identifying information recorded in the transportation request.

The driver shall confirm that the physical vehicle corresponds to the information in the system.

If the vehicle cannot be satisfactorily identified, the inspection should not be completed until the discrepancy has been resolved.

Where necessary, the issue may be escalated to the administrator.

**9.5 Pickup Location Verification**

The pickup inspection shall be associated with the pickup location specified in the trip.

The system shall record:

- Pickup location.
- Date.
- Time.
- Driver.
- Trip reference.

Where GPS functionality is available, the system may also record the driver's location at the time the inspection is performed.

The purpose is to provide evidence that the inspection occurred in connection with the correct pickup location.

**9.6 Odometer Recording**

The driver shall record the vehicle's odometer reading during the pickup inspection.

The odometer value shall form part of the official pickup inspection record.

The system should capture:

- Odometer value.
- Date and time.
- Driver who recorded the value.
- Associated trip.
- Supporting photograph.

Where practical, the odometer photograph should be captured as part of the inspection evidence.

The recorded value shall not be silently editable after inspection confirmation.

If an error is discovered, the system should require an appropriate correction process that maintains an audit record.

**9.7 Fuel-Level Recording**

The driver shall record the vehicle's fuel level during the pickup inspection.

The fuel level may be recorded using a standardized representation such as:

EMPTY

1/4

1/2

3/4

FULL

Alternatively, a percentage value may be used where appropriate.

The system shall associate the fuel reading with:

- Trip.
- Vehicle.
- Driver.
- Inspection.
- Date and time.

A photograph of the fuel gauge should also be captured where possible.

The fuel level recorded during pickup shall provide a reference point for the delivery inspection and trip records.

**9.8 Vehicle Photography**

The system shall require standardized photographs as part of the inspection process.

The exact number of required photographs may be configurable.

The normal pickup inspection should capture major areas of the vehicle, including:

- Front.
- Rear.
- Left side.
- Right side.
- Interior where relevant.
- Odometer.
- Fuel gauge.
- Existing visible damage.

Additional photographs may be captured where a particular area requires further documentation.

The photographs shall be associated with the specific inspection rather than stored as general user uploads.

For example:

Trip

└── Pickup Inspection

├── Front Photo

├── Rear Photo

├── Left Side Photo

├── Right Side Photo

├── Interior Photo

├── Odometer Photo

├── Fuel Gauge Photo

└── Damage Photo(s)

This structure will make it easier to retrieve inspection evidence later.

**9.9 Existing Damage Recording**

The driver shall be able to record visible damage identified during pickup.

Damage may include, for example:

- Scratches.
- Dents.
- Broken or damaged exterior components.
- Damaged lights.
- Other visible vehicle-condition issues.

The system shall allow the driver to provide:

- Damage description.
- Photograph.
- Location/area of damage.
- Additional observation.

Where possible, the damage should be associated with a specific area of the vehicle.

For example:

Area: Front Left Door

Condition: Existing visible scratch

Evidence: Photograph

The purpose of this record is to establish that the condition existed before transportation.

**9.10 Inspection Observations**

The driver shall be able to record additional observations that may be relevant to transportation.

Examples include:

- Vehicle has limited fuel.
- Vehicle has a visible mechanical warning.
- Vehicle has an existing body condition.
- Vehicle contains personal items where relevant.
- Vehicle requires special handling.
- Vehicle cannot be driven normally.
- Other relevant observations.

Observations shall be stored as part of the inspection record.

The system should distinguish between:

**Required inspection information**

and

**Additional observations.**

This prevents unnecessary information from becoming mandatory for every trip.

**9.11 Vehicle Condition Mismatch**

If the actual condition of the vehicle differs from the condition declared in the transportation request, the discrepancy shall be documented before transportation proceeds.

For example:

Customer declaration:

"No visible damage."

Pickup inspection:

"Visible scratch on rear-right door."

The driver shall be able to document the discrepancy using:

- Written description.
- Photographs.
- Inspection timestamp.
- Relevant vehicle area.
- Additional observations.

The customer or authorized representative shall be given an opportunity to acknowledge the recorded condition.

The system shall preserve the original information supplied during the booking.

It shall not overwrite the customer's original declaration simply because a discrepancy was discovered.

This allows CarGo Kenya to maintain a record showing:

Original Declaration

+

Pickup Inspection

+

Recorded Discrepancy

**9.12 Significant Vehicle Condition Mismatch**

Where a condition mismatch is significant enough to affect:

- Transportation safety.
- Driver ability to perform the trip.
- Vehicle handling requirements.
- Agreed transportation conditions.
- Pricing.

the trip may require administrative review before transportation proceeds.

The system should therefore allow the inspection to be marked as requiring review.

Example:

Inspection

↓

Condition mismatch detected

↓

Is it significant?

/ \\

NO YES

| |

Proceed Admin Review

The administrator may then determine whether:

- Transportation can continue.
- Additional information is required.
- The customer and driver must agree to a change.
- The trip should be cancelled according to applicable procedures.

**9.13 Inspection Confirmation**

Once all required inspection information has been entered, the driver shall submit the inspection for confirmation.

The system shall verify that the mandatory inspection information has been provided.

For pickup, this should include:

- Vehicle identity.
- Pickup location.
- Odometer.
- Fuel level.
- Required photographs.
- Vehicle condition.
- Required observations.
- Driver confirmation.

The customer or authorized representative shall then be given an opportunity to confirm the recorded vehicle condition.

The confirmation should be associated with:

- User.
- Date.
- Time.
- Trip.
- Inspection.

**9.14 Driver Confirmation**

The driver shall confirm that:

1.  The vehicle was inspected.
2.  The recorded information is accurate to the driver's knowledge.
3.  The photographs represent the vehicle at pickup.
4.  The odometer and fuel information were recorded.
5.  Any visible damage has been documented.

The driver confirmation shall form part of the inspection record.

**9.15 Customer or Authorized Representative Confirmation**

The customer or authorized representative shall confirm the pickup inspection where they are present and able to do so.

The confirmation indicates that the recorded vehicle condition was presented to them.

The system should record:

- Confirming person's account or identity where available.
- Date.
- Time.
- Confirmation status.

The system should not require a physical handwritten signature for the MVP if implementing digital confirmation provides the same operational purpose with significantly less development complexity.

A digital confirmation action may therefore be sufficient for the initial MVP.

**9.16 Completing the Pickup Inspection**

The pickup inspection shall only be considered complete when all mandatory inspection requirements have been satisfied.

The system shall then mark the inspection as:

**COMPLETED**

The trip shall move from:

**PICKUP INSPECTION**

to:

**TRIP START PENDING**

The trip shall **not** immediately become TRIP ACTIVE.

The driver must still select:

**START TRIP**

The customer must then confirm the trip commencement.

Only after both actions are completed shall the system move the trip to:

**TRIP ACTIVE**

At that point, the first 50% of the driver's transportation fee becomes eligible for release to the Driver Personal Wallet.

**9.17 Handover Process**

The vehicle handover shall occur after the pickup inspection has been completed.

The handover confirms that responsibility for transporting the vehicle has been transferred to the driver for the purpose of the agreed trip.

The system shall record the completion of the handover as part of the pickup inspection/trip record.

The handover process should confirm:

- Correct vehicle.
- Correct pickup location.
- Inspection completed.
- Vehicle condition recorded.
- Odometer recorded.
- Fuel level recorded.
- Required photographs captured.
- Parties have confirmed the recorded condition.

**9.18 Fueling Confirmation**

Where the agreed trip includes a fuel budget and fueling is required before transportation begins, the fueling process shall be completed before the driver starts the trip.

The system may record:

- Fueling event.
- Amount spent.
- Fuel information.
- Receipt where available.
- Date and time.
- Relevant trip reference.

However, the MVP shall avoid integrating directly with petrol station systems.

As established in the MVP, **automatic fuel payment to petrol stations is out of scope**.

The system should therefore initially support controlled manual recording of fueling information.

**9.19 Delivery Inspection**

The delivery inspection shall be performed when the vehicle reaches the destination.

The delivery inspection shall provide a second documented condition record that can be compared with the pickup inspection.

The process shall include:

1.  Confirming arrival.
2.  Completing vehicle inspection.
3.  Recording photographs.
4.  Recording odometer.
5.  Recording fuel level where applicable.
6.  Recording visible condition.
7.  Recording relevant observations.
8.  Completing vehicle handover.
9.  Obtaining customer confirmation.
10. Obtaining driver confirmation.

**9.20 Delivery Photographs**

Delivery photographs shall follow a structure similar to the pickup inspection.

The system should capture relevant areas such as:

- Front.
- Rear.
- Left side.
- Right side.
- Interior where relevant.
- Odometer.
- Fuel gauge.
- Any newly observed damage.

The purpose is to allow CarGo Kenya to maintain evidence of the vehicle's condition at delivery.

The photographs shall be linked to the delivery inspection record.

**9.21 Delivery Condition Comparison**

The system should preserve both:

Pickup Condition

↓

Transportation

↓

Delivery Condition

The MVP does not need advanced automated image comparison.

Instead, the system should allow administrators and authorized users to review the two inspection records manually.

This keeps the MVP technically manageable while still creating valuable evidence.

**9.22 New Damage at Delivery**

If damage is identified during delivery that was not recorded during pickup, the issue shall be documented before the trip is fully completed where practical.

The driver and customer should be given an opportunity to review the recorded condition.

The system should allow:

- Damage description.
- Photographs.
- Written observations.
- Customer confirmation.
- Driver confirmation.

If the parties disagree regarding the condition, the trip may be marked:

**DISPUTED**

The relevant inspection evidence shall remain attached to the trip for administrative review.

**9.23 Inspection Evidence Storage**

Each inspection shall have its own digital record.

A simplified structure shall be:

TRIP

│

├── PICKUP INSPECTION

│ ├── Vehicle Information

│ ├── Odometer

│ ├── Fuel Level

│ ├── Photos

│ ├── Damage Records

│ ├── Observations

│ ├── Driver Confirmation

│ └── Customer Confirmation

│

└── DELIVERY INSPECTION

├── Vehicle Information

├── Odometer

├── Fuel Level

├── Photos

├── Damage Records

├── Observations

├── Driver Confirmation

└── Customer Confirmation

Inspection photographs should be stored using secure file storage rather than directly inside the main database.

The database should store references to the files.

**9.24 Inspection Record Requirements**

Each inspection record should contain at least:

| **Field** | **Description** |
| --- | --- |
| Inspection ID | Unique inspection identifier |
| Trip ID | Associated trip |
| Inspection Type | Pickup or delivery |
| Vehicle ID | Associated vehicle |
| Driver ID | Driver conducting inspection |
| Customer ID | Customer associated with trip |
| Location | Inspection location |
| Odometer | Recorded odometer value |
| Fuel Level | Recorded fuel level |
| Condition | General vehicle condition |
| Observations | Additional notes |
| Status | Inspection status |
| Created At | Inspection creation time |
| Completed At | Inspection completion time |
| Driver Confirmation | Driver confirmation |
| Customer Confirmation | Customer confirmation |

**9.25 Inspection Photo Requirements**

Each inspection photograph should have its own record containing information such as:

Photo ID

Inspection ID

Photo Type

File Reference

Uploaded By

Timestamp

Possible photo types include:

FRONT

REAR

LEFT_SIDE

RIGHT_SIDE

INTERIOR

ODOMETER

FUEL_GAUGE

DAMAGE

OTHER

This structure will make it easier to retrieve specific evidence later.

**9.26 Inspection Statuses**

The inspection module may use the following internal statuses:

NOT_STARTED

IN_PROGRESS

PENDING_CONFIRMATION

COMPLETED

REQUIRES_REVIEW

CANCELLED

These are **inspection statuses**, not replacements for the main trip statuses.

The main trip shall continue to use the statuses defined in the MVP.

**9.27 Inspection Validation Rules**

The backend shall validate inspection requirements before allowing completion.

For example, the system should not allow a pickup inspection to be completed when:

- Odometer has not been recorded.
- Fuel level has not been recorded.
- Required photographs are missing.
- Vehicle identity has not been confirmed.
- Required confirmation has not been completed.

The exact mandatory fields should be configurable where practical.

The backend must perform validation independently of the frontend.

**9.28 Inspection Editing Rules**

Inspection records should not be freely editable after completion.

Once an inspection has been confirmed, important information such as:

- Odometer.
- Fuel level.
- Vehicle condition.
- Damage records.
- Confirmation information.

should be protected from silent modification.

If an administrator needs to correct an error, the system should record:

- Original value.
- New value.
- Person making the correction.
- Date and time.
- Reason for correction.

This creates an audit trail.

**9.29 Failed or Incomplete Inspection**

If the inspection cannot be completed, the trip shall remain in the appropriate inspection stage.

For example:

PICKUP INSPECTION

↓

Inspection incomplete

↓

Remain in PICKUP INSPECTION

The system shall not allow the driver to bypass mandatory inspection requirements simply by selecting START TRIP.

If the issue cannot be resolved, the matter may be escalated to an administrator.

**9.30 Inspection and Payment Relationship**

The inspection module shall directly support the payment-release workflow but shall not independently release funds.

The relationship shall be:

Pickup Inspection Completed

↓

Vehicle Handover Completed

↓

Fueling Completed where applicable

↓

TRIP START PENDING

↓

Driver selects START TRIP

↓

Customer confirms

↓

TRIP ACTIVE

↓

50% Driver Fee Released

The inspection module therefore provides evidence required for the trip to proceed, while the **Payment and Wallet Module** remains responsible for the actual financial transaction.

Similarly:

Delivery Inspection

↓

Customer Confirmation

↓

Driver Confirmation

↓

COMPLETED

↓

Remaining 50% Released

**9.31 Administrator Inspection Access**

Administrators shall be able to view inspection records for operational and dispute-resolution purposes.

An administrator should be able to view:

- Pickup inspection.
- Delivery inspection.
- Photographs.
- Odometer readings.
- Fuel readings.
- Damage records.
- Observations.
- Confirmations.
- Inspection timestamps.
- Related trip information.

Administrators should not modify inspection information without creating an appropriate audit record.

**9.32 Inspection Security**

Inspection records may contain sensitive information and valuable evidence.

The system shall therefore ensure that:

- Customers can only access inspections belonging to their trips.
- Drivers can only access inspections for trips assigned to them.
- Administrators can access inspections according to their permissions.
- Unauthorized users cannot access inspection photographs.
- File references cannot be guessed to access private photographs.
- Inspection APIs require appropriate authorization.

**9.33 Inspection Module — MVP Boundary**

The following shall be included in the MVP:

**Required**

- Pickup inspection.
- Delivery inspection.
- Odometer recording.
- Fuel-level recording.
- Standardized photographs.
- Damage recording.
- Written observations.
- Vehicle identity confirmation.
- Driver confirmation.
- Customer/authorized representative confirmation.
- Inspection timestamps.
- Inspection history.
- Secure inspection evidence.
- Inspection linkage to trips.
- Administrative inspection access.

**Not Required for MVP**

The following should remain outside the initial implementation unless development proves them simple and necessary:

- AI-powered damage detection.
- Automatic image comparison.
- Computer vision vehicle assessment.
- Automated damage-cost estimation.
- Insurance claim automation.
- Advanced biometric signatures.
- Petrol-station API integration.
- Automatic fuel payment.

These may be considered in future development.

**9.34 Developer Implementation Summary**

The Vehicle Inspection and Handover Module should ultimately provide the following core functionality:

DRIVER ARRIVES

↓

PICKUP INSPECTION

↓

VERIFY VEHICLE

↓

RECORD ODOMETER

↓

RECORD FUEL

↓

CAPTURE PHOTOS

↓

RECORD DAMAGE

↓

RECORD OBSERVATIONS

↓

DRIVER CONFIRMS

↓

CUSTOMER CONFIRMS

↓

HANDOVER COMPLETED

↓

TRIP START PENDING

↓

DRIVER → START TRIP

↓

CUSTOMER → CONFIRM

↓

TRIP ACTIVE

↓

50% DRIVER FEE RELEASE

At delivery:

VEHICLE ARRIVES

↓

DELIVERY INSPECTION

↓

RECORD ODOMETER

↓

RECORD FUEL

↓

CAPTURE PHOTOS

↓

CHECK CONDITION

↓

RECORD NEW DAMAGE IF ANY

↓

CUSTOMER CONFIRMS

↓

DRIVER CONFIRMS

↓

DELIVERED

↓

COMPLETED

↓

REMAINING 50% DRIVER FEE RELEASE

**10.0 GPS AND TRIP TRACKING MODULE**

**10.1 Purpose**

The GPS and Trip Tracking Module shall provide CarGo Kenya with the ability to monitor the location and movement of a vehicle during an active transportation assignment.

The primary purpose of GPS tracking in the MVP is **visibility, accountability, and trip monitoring**.

The system should allow the customer and CarGo Kenya administrators to determine:

- Whether the trip has started.
- The vehicle's last known location.
- The general progress of the transportation.
- Whether the driver is moving toward the destination.
- When the vehicle has reached or is approaching the destination.
- Whether a significant delay or abnormal situation may require attention.

The MVP shall focus on reliable basic tracking rather than advanced logistics optimization.

**10.2 Relationship With Trip Status**

GPS tracking shall be connected to the trip lifecycle already defined in the MVP.

The important relationship is:

BOOKED

↓

PICKUP PENDING

↓

PICKUP INSPECTION

↓

TRIP START PENDING

↓

TRIP ACTIVE

↓

IN TRANSIT

↓

DELIVERY PENDING

↓

DELIVERED

↓

COMPLETED

GPS tracking shall become operational for the transportation journey once the trip officially enters:

**TRIP ACTIVE**

The system shall therefore not treat the driver merely being at the pickup location as the beginning of transportation.

The official transportation stage begins only after:

1.  Pickup procedures are completed.
2.  Required fueling procedures are completed where applicable.
3.  Driver selects **START TRIP**.
4.  Customer confirms the trip commencement.
5.  System changes the trip status to **TRIP ACTIVE**.

**10.3 GPS Tracking Objectives**

The MVP GPS system shall primarily achieve the following objectives:

**Customer Visibility**

Allow the customer to view the vehicle's last known location during transportation.

**Operational Monitoring**

Allow CarGo Kenya administrators to monitor active trips.

**Driver Accountability**

Create a digital record of the vehicle's movement during the transportation period.

**Trip Evidence**

Provide location information that can assist when reviewing:

- Delays.
- Disputes.
- Unexpected stops.
- Delivery issues.
- Other operational incidents.

**Delivery Coordination**

Help the customer and receiving party understand the general progress of the vehicle toward its destination.

**10.4 GPS Tracking Start Condition**

The system shall not start the official trip tracking process simply because the driver has arrived at the pickup location.

The tracking lifecycle shall be:

Driver Arrives

↓

Pickup Inspection

↓

Vehicle Handover

↓

Fueling where applicable

↓

TRIP START PENDING

↓

Driver selects START TRIP

↓

Customer confirms

↓

TRIP ACTIVE

↓

GPS Tracking Active

This ensures that the GPS record corresponds to the officially commenced transportation assignment.

**10.5 Driver Location Sharing**

The driver's device shall provide location information to the CarGo Kenya platform while the trip is actively being transported.

The application may use the device's location services to obtain:

- Latitude.
- Longitude.
- Timestamp.
- Location accuracy where available.
- Trip reference.
- Driver reference.

The system should avoid collecting unnecessary location information outside the relevant transportation process.

**10.6 Location Update Frequency**

The MVP shall use a practical location-update strategy rather than attempting continuous high-frequency tracking.

The system may periodically submit location updates while the trip is active.

For example, the application may send a location update:

- At a defined time interval.
- After significant movement.
- When the application determines that an important milestone has occurred.

The exact frequency should be configurable during development.

The initial implementation should prioritize:

**Reliable tracking + reasonable battery/data usage**

rather than maximum tracking precision.

**10.7 Last Known Location**

The system shall maintain the driver's most recent successfully received GPS location.

The trip record should therefore contain a concept such as:

**Last Known Location**

This shall allow the customer and administrator to determine the most recent location even if the driver's device temporarily loses connectivity.

For example:

Last Known Location:

Mombasa Road, Nairobi

Last Updated:

14:32 EAT

The system should clearly indicate when the location was last updated.

It should not present an old location as though it were the driver's current location.

**10.8 GPS Location Record**

Each received location update should be stored as a trip-location record.

A basic location record should contain:

| **Field** | **Description** |
| --- | --- |
| Location ID | Unique location record |
| Trip ID | Associated trip |
| Driver ID | Driver sending location |
| Latitude | Geographic latitude |
| Longitude | Geographic longitude |
| Accuracy | Location accuracy where available |
| Timestamp | Time location was recorded |
| Received At | Time server received update |

Additional fields may be introduced later if required.

**10.9 Customer Tracking View**

The customer shall be able to view tracking information for their active trip.

The customer view should provide:

- Trip reference.
- Driver information.
- Vehicle information.
- Current/last known location.
- Last location update time.
- Trip status.
- Pickup location.
- Destination.
- Relevant trip milestones.

Where technically feasible, the location may be displayed on a map.

The customer should not need to contact the driver simply to determine where the vehicle is.

**10.10 Administrator Tracking View**

CarGo Kenya administrators shall be able to monitor active transportation assignments.

The administrator should be able to view:

- Active trips.
- Driver.
- Vehicle.
- Pickup location.
- Destination.
- Current/last known location.
- Last location update.
- Trip status.
- Important milestones.

The administrator should be able to identify trips that may require operational attention.

**10.11 Driver Tracking Experience**

The driver's tracking experience should be kept simple.

The driver should not be required to manually enter GPS coordinates.

Instead, the application should use the device's location services where permission has been granted.

The driver should be clearly informed that location sharing is required for active CarGo Kenya transportation assignments.

The driver interface should provide an indication that tracking is active.

For example:

**TRIP ACTIVE — LOCATION SHARING ON**

The driver should not need to repeatedly interact with the application merely to keep basic location reporting active.

**10.12 Location Permission**

The application shall request the appropriate device location permission before attempting to obtain GPS information.

The system should clearly explain why location access is required.

The purpose should be communicated in terms of:

- Customer trip visibility.
- Transportation monitoring.
- Trip accountability.
- Delivery coordination.

The application shall handle situations where the driver denies or disables location access.

**10.13 GPS Permission Failure**

If the driver has not granted the required location permission, the application should notify the driver that GPS tracking cannot operate correctly.

Where GPS tracking is a required operational condition for an active trip, the system may prevent the trip from being fully started until the required permission is provided.

However, the system should distinguish between:

**Location permission unavailable**

and

**Temporary GPS/network failure.**

These are different situations.

**10.14 Temporary GPS Failure**

GPS availability may temporarily fail because of:

- Poor satellite visibility.
- Device settings.
- Network conditions.
- Indoor environments.
- Device battery-saving restrictions.
- Temporary application problems.

The platform shall not automatically mark a trip as failed because of a temporary GPS problem.

Instead, the system should maintain the last successfully received location.

For example:

GPS temporarily unavailable

Last known location:

Mariakani

Last updated:

10:42 EAT

Once location connectivity returns, the application should resume sending updates.

**10.15 Network Failure**

GPS coordinates may be available on the driver's device even when internet connectivity is temporarily unavailable.

Where technically feasible, the application should temporarily preserve location information locally.

When network connectivity returns, the application may synchronize the stored information with the server.

The system should preserve the timestamps associated with the original location readings.

The basic process should therefore be:

GPS Available

↓

Internet Available?

/ \\

YES NO

↓ ↓

Send Store Temporarily

Server Locally

↓

Connection Returns

↓

Synchronize

This supports the MVP requirement that temporary connectivity problems should not automatically cause trip failure.

**10.16 Location History**

The system may maintain a history of GPS points collected during the active transportation stage.

This history may be used to reconstruct the general movement of a trip.

The MVP does not require extremely detailed location history.

The system should prioritize useful operational information rather than storing unnecessary volumes of location data.

The location history shall be associated with the specific trip.

**10.17 GPS and Trip Milestones**

GPS tracking shall work together with the Trip Milestone Module.

For example:

TRIP ACTIVE

↓

GPS Tracking

+

Trip Milestones

↓

Fuel Stop

↓

Major Route Milestone

↓

Temporary Delay

↓

Destination Reached

GPS provides location information.

Milestones provide human-readable explanations of important events.

Neither should completely replace the other.

**10.18 Major Route Milestones**

The driver may record important milestones during transportation.

Examples include:

- Major route checkpoint.
- Fuel stop.
- Temporary delay.
- Rest stop where relevant.
- Destination reached.

The milestone should contain:

- Milestone type.
- Trip reference.
- Driver.
- Timestamp.
- Location where available.
- Optional description.

The MVP should avoid requiring the driver to report every minor event.

Only meaningful transportation events should be recorded.

**10.19 Temporary Delay**

If a significant delay occurs, the driver should be able to record a delay milestone.

For example:

**DELAY REPORTED**

The driver may provide:

- Reason.
- Description.
- Location.
- Timestamp.

Possible reasons may include:

- Traffic.
- Mechanical problem.
- Road condition.
- Weather.
- Security concern.
- Other operational issue.

The system should notify the customer when appropriate.

The driver should not be required to provide unnecessary information for ordinary traffic fluctuations.

**10.20 Destination Arrival**

When the driver reaches the destination, the system should allow the trip to move into the delivery process.

The sequence should be:

IN TRANSIT

↓

Vehicle reaches destination

↓

DELIVERY PENDING

↓

Delivery Inspection

↓

Vehicle Handover

↓

DELIVERED

↓

Customer + Driver Confirmation

↓

COMPLETED

GPS information may assist in identifying that the vehicle has reached or is near the destination, but **GPS alone shall not automatically complete the trip.**

This is important.

The delivery must still follow the inspection and confirmation process already established.

**10.21 GPS Geographical Accuracy**

The system should recognize that GPS coordinates are not always perfectly accurate.

Therefore, GPS information should be treated as location evidence rather than absolute proof of the vehicle's exact physical position.

The system should store location accuracy where provided by the device.

For example:

Latitude: -4.0435

Longitude: 39.6682

Accuracy: 15 metres

The user interface does not necessarily need to expose technical accuracy information to customers during the MVP, but the backend should preserve it where available.

**10.22 GPS Tracking and Privacy**

Because GPS information relates to the driver's location, CarGo Kenya shall limit location collection to legitimate transportation purposes.

The system should avoid unnecessary tracking outside active transportation assignments.

The basic principle should be:

No Active Trip

↓

No Continuous Trip Tracking

TRIP ACTIVE

↓

Trip Tracking Enabled

Once the transportation assignment has been completed, continuous trip tracking should stop.

The relevant historical location records may remain associated with the completed trip for legitimate operational and record-keeping purposes.

**10.23 GPS Access Control**

Location information shall only be available to authorized users.

**Customer**

The customer may view location information for their own active trip.

**Driver**

The driver may view information relating to their assigned trip.

**Administrator**

Authorized administrators may view location information for operational monitoring and dispute resolution.

**Other Customers**

A customer shall not be able to access another customer's trip location.

**Other Drivers**

A driver shall not be able to access another driver's trip location unless specifically authorized for an operational reason.

**10.24 GPS Security**

The system shall protect GPS information against unauthorized access.

The backend shall verify authorization before returning location information.

For example:

GET /trips/{tripId}/locations

↓

Authenticate User

↓

Check Trip Access

↓

Authorized?

/ \\

YES NO

↓ ↓

Return Reject

Location Request

The frontend must not be relied upon as the only security mechanism.

**10.25 GPS Data Retention**

GPS records should remain associated with their respective trip records.

The MVP should retain sufficient location information to support:

- Trip history.
- Customer visibility.
- Operational review.
- Dispute investigation.
- Basic performance analysis.

The exact long-term retention period can be defined as part of the system's data-retention and privacy policies.

**10.26 GPS Tracking Failure and Administrator Intervention**

If GPS tracking stops for an extended period during an active trip, the system should make the condition visible to administrators.

For example:

TRIP ACTIVE

Last GPS update:

2 hours ago

Status:

LOCATION UPDATE DELAYED

This should not automatically mean that the driver has done something wrong.

The administrator may investigate through the normal operational process.

Possible actions include:

- Contacting the driver.
- Reviewing the last known location.
- Checking reported milestones.
- Recording an operational note.
- Escalating if necessary.

**10.27 GPS and Disputes**

GPS information may be used as supporting evidence during disputes.

For example, if a dispute concerns whether the vehicle reached a particular area, administrators may review:

- GPS history.
- Trip milestones.
- Pickup inspection.
- Delivery inspection.
- Timestamps.
- Customer confirmations.
- Driver confirmations.

GPS should therefore be treated as **one source of evidence**, not the sole determinant of every dispute.

**10.28 GPS Tracking Notifications**

The system may generate notifications for important tracking events.

Customer notifications may include:

- Trip officially started.
- Vehicle is in transit.
- Significant delay reported.
- Destination reached.
- Delivery process started.
- Delivery completed.

The MVP should avoid excessive notifications for every individual GPS coordinate.

A customer does not need to receive:

GPS Update 1

GPS Update 2

GPS Update 3

GPS Update 4

...

Instead, GPS updates should primarily update the tracking interface while important events generate notifications.

**10.29 GPS Tracking and Battery/Data Usage**

The implementation should consider the driver's device resources.

The system should avoid unnecessarily aggressive GPS polling.

The developer should consider:

- Location update interval.
- Distance-based updates.
- Network synchronization.
- Offline storage.
- Background location limitations.
- Battery consumption.

The MVP should find a practical balance between tracking usefulness and device resource consumption.

**10.30 GPS Tracking API Requirements**

The backend should provide appropriate endpoints for GPS operations.

The exact API naming may be determined during implementation, but the system will require functionality equivalent to:

Start Trip Tracking

Submit Location

Retrieve Current Location

Retrieve Location History

Stop Trip Tracking

For example, conceptually:

POST /trips/{tripId}/tracking/start

POST /trips/{tripId}/locations

GET /trips/{tripId}/locations/latest

GET /trips/{tripId}/locations

POST /trips/{tripId}/tracking/stop

These are **functional requirements**, not mandatory final endpoint names.

The final API naming should remain consistent throughout the backend implementation.

**10.31 GPS Data Model**

A basic GPS location record should contain:

| **Field** | **Description** |
| --- | --- |
| Location ID | Unique location record |
| Trip ID | Associated trip |
| Driver ID | Driver providing location |
| Latitude | Latitude coordinate |
| Longitude | Longitude coordinate |
| Accuracy | GPS accuracy where available |
| Recorded At | Time device recorded location |
| Received At | Time server received location |
| Source | GPS/device source |
| Created At | Database record timestamp |

A separate tracking session record may be introduced if required by the implementation.

However, the MVP should avoid creating unnecessary database complexity unless it provides a clear benefit.

**10.32 GPS Tracking Rules**

The following rules shall apply:

**Rule 1**

GPS tracking is associated with a specific trip.

**Rule 2**

Official trip tracking begins when the trip becomes TRIP ACTIVE.

**Rule 3**

GPS failure does not automatically cancel or fail a trip.

**Rule 4**

The last successfully received location remains available when a new location cannot be obtained.

**Rule 5**

GPS alone cannot mark a trip as completed.

**Rule 6**

Delivery still requires the established delivery inspection and confirmation process.

**Rule 7**

Customers can only view tracking information for their own trips.

**Rule 8**

Drivers can only provide/view tracking information relating to their assigned trips.

**Rule 9**

Administrators may monitor active trips according to their permissions.

**Rule 10**

Continuous tracking should stop when the transportation assignment is completed.

**10.33 GPS Module — MVP Scope**

**Included in MVP**

The GPS and Trip Tracking Module shall include:

- Driver location sharing.
- GPS coordinates.
- Last known location.
- Timestamped location updates.
- Customer trip tracking.
- Administrator trip monitoring.
- Basic location history.
- GPS/network failure handling.
- Integration with trip statuses.
- Integration with trip milestones.
- Basic delay reporting.
- Location access controls.
- Basic tracking notifications.
- Secure location data storage.

**Not Required for MVP**

The following should remain outside the initial implementation:

- AI route optimization.
- Predictive arrival calculations.
- Automatic traffic intelligence.
- Advanced geofencing.
- Fleet optimization.
- Fuel station tracking.
- Automated route deviation penalties.
- Advanced driver behaviour analytics.
- Satellite tracking hardware.
- Real-time traffic integration.

These can be considered in future development based on actual operational requirements.

**10.34 GPS Module — Complete Operational Flow**

The complete MVP flow should therefore be:

BOOKED

↓

PICKUP PENDING

↓

PICKUP INSPECTION

↓

Vehicle Inspection

↓

Vehicle Handover

↓

Fueling Where Required

↓

TRIP START PENDING

↓

Driver START TRIP

↓

Customer Confirms Start

↓

TRIP ACTIVE

↓

GPS TRACKING ACTIVE

↓

IN TRANSIT

↓

GPS + Trip Milestones

↓

Destination Reached

↓

DELIVERY PENDING

↓

Delivery Inspection

↓

DELIVERED

↓

Customer + Driver Confirm

↓

COMPLETED

↓

GPS Tracking Ends

**Relationship with payment**

The GPS module **does not release money by itself**.

The established payment workflow remains:

TRIP ACTIVE

↓

First 50% Driver Fee

↓

Released by Payment Module

COMPLETED

↓

Remaining 50% Driver Fee

↓

Released by Payment Module

This separation is important for development: **GPS records location; Inspection records vehicle condition; Trip Management controls status; Payment/Wallet controls money.**

That keeps the modules clean and prevents the system from becoming unnecessarily complicated.

**11.0 TRIP MILESTONE MODULE**

**11.1 Purpose**

The Trip Milestone Module shall provide a structured way for CarGo Kenya to record important events that occur throughout a transportation assignment.

GPS tracking tells the system **where the vehicle is**.

Trip milestones tell the system **what is happening during the journey**.

The milestone system is therefore intended to complement GPS tracking rather than replace it.

The MVP shall use milestones to create a clear, understandable history of the transportation process for:

- Customers.
- Drivers.
- Administrators.

**11.2 Relationship With Trip Management**

Trip milestones shall operate within the trip lifecycle already defined by CarGo Kenya.

The general process is:

BOOKED

↓

PICKUP PENDING

↓

PICKUP INSPECTION

↓

TRIP START PENDING

↓

TRIP ACTIVE

↓

IN TRANSIT

↓

DELIVERY PENDING

↓

DELIVERED

↓

COMPLETED

Milestones may be generated or recorded at important points within these stages.

The milestone system shall not create an alternative trip-status system.

The **Trip Status** represents the official state of the trip.

The **Milestone** represents an important event that occurred within that state.

**11.3 Difference Between Trip Status and Milestone**

This distinction is important for development.

**Trip Status**

A trip status represents the current official state of the transportation assignment.

Example:

**TRIP ACTIVE**

**Trip Milestone**

A milestone represents a specific event that occurred during the trip.

Example:

**FUEL STOP**

Therefore:

Trip Status:

IN TRANSIT

Milestones:

✓ Trip Started

✓ Fuel Stop

✓ Temporary Delay

✓ Major Route Milestone

The system should not change the main trip status every time a milestone occurs.

**11.4 Objectives**

The Trip Milestone Module shall:

1.  Create a chronological journey record.
2.  Improve customer visibility.
3.  Help administrators monitor active trips.
4.  Provide operational evidence.
5.  Support communication between CarGo Kenya, customers, and drivers.
6.  Complement GPS tracking.
7.  Assist with dispute investigation.
8.  Provide useful historical information after trip completion.

**11.5 MVP Milestone Types**

The initial MVP should support the following important milestones:

**1\. PICKUP COMPLETED**

Indicates that the pickup inspection and vehicle handover have been completed.

**2\. TRIP STARTED**

Indicates that the driver selected **START TRIP** and the customer confirmed commencement.

**3\. FUEL STOP**

Indicates that the vehicle stopped for fueling.

**4\. MAJOR ROUTE MILESTONE**

Records an important point reached during transportation.

**5\. DELAY REPORTED**

Indicates that the driver has reported a significant delay.

**6\. DESTINATION REACHED**

Indicates that the driver has reached the destination area.

**7\. DELIVERY INSPECTION STARTED**

Indicates that the delivery inspection process has begun.

**8\. DELIVERY COMPLETED**

Indicates that delivery procedures have been completed.

These milestones should remain relatively simple during the MVP.

**11.6 Pickup Completed Milestone**

The system shall create a **PICKUP COMPLETED** milestone after the required pickup procedures have been successfully completed.

The milestone should be associated with:

- Trip.
- Driver.
- Vehicle.
- Pickup location.
- Date and time.
- Pickup inspection record.

The trip should then proceed to:

**TRIP START PENDING**

This milestone does not itself trigger the first driver payment release.

The first 50% release remains dependent on the complete conditions already established under the Payment Release Module.

**11.7 Trip Started Milestone**

Once:

1.  Pickup procedures have been completed.
2.  Required fueling procedures have been completed where applicable.
3.  Driver selects **START TRIP**.
4.  Customer confirms trip commencement.

The system shall:

- Change the trip status to **TRIP ACTIVE**.
- Create a **TRIP STARTED** milestone.
- Record the date and time.
- Record the driver's location where available.
- Activate the GPS tracking process.
- Trigger the applicable first-stage payment release process.

This milestone is therefore closely connected to the official commencement of transportation.

**11.8 Fuel Stop Milestone**

The driver may record a **FUEL STOP** milestone when the vehicle stops for fueling.

The milestone may contain:

- Date and time.
- Location.
- Fuel information where applicable.
- Optional notes.
- Supporting fuel documentation where required.

The MVP should not require the driver to create a milestone for every minor fuel-related action unless the business process requires it.

The purpose is to create a useful operational record.

**11.9 Fuel Information**

Where the fuel budget is being tracked through the platform, the fuel milestone may be associated with:

- Fuel quantity.
- Amount spent.
- Fuel station name where available.
- Receipt photograph where required.
- Odometer reading.
- Date and time.

However, the MVP should avoid unnecessarily complicated fuel accounting.

The **Fuel Budget remains a trip-level financial component**, while the fuel milestone provides supporting operational information.

**11.10 Major Route Milestone**

A driver may record a major route milestone when reaching an important point during the journey.

Examples may include:

- Entering a major town.
- Passing a major route checkpoint.
- Reaching a planned intermediate location.
- Reaching another significant transportation point.

The milestone should contain:

- Milestone type.
- Location.
- Date and time.
- Optional driver note.
- GPS coordinates where available.

The system should not require the driver to manually report every location along the route.

GPS tracking already provides continuous or periodic location information.

**11.11 Delay Report**

The driver should be able to report a significant transportation delay.

The system should provide a simple delay-reporting process.

For example:

REPORT DELAY

Reason:

\[Traffic\]

Description:

\[Heavy traffic on Mombasa Road\]

Location:

\[Automatically detected where available\]

Submit

Possible delay categories may include:

- Traffic.
- Mechanical problem.
- Road conditions.
- Weather.
- Security concern.
- Customer-related delay.
- Other.

The driver may provide an optional explanation.

**11.12 Delay Notification**

When a significant delay is reported, the system may notify the customer.

For example:

**Trip Update**

Your vehicle's driver has reported a traffic delay.

The customer should be able to view:

- Delay reason.
- Approximate location where available.
- Time reported.
- Driver's note where applicable.

This reduces the need for the customer to repeatedly contact the driver for routine journey updates.

**11.13 Destination Reached Milestone**

When the vehicle reaches the destination area, the driver may record:

**DESTINATION REACHED**

The milestone should include:

- Trip reference.
- Driver.
- Location.
- Date and time.
- GPS coordinates where available.

This milestone does **not automatically complete the trip**.

After reaching the destination, the trip should proceed through:

DESTINATION REACHED

↓

DELIVERY PENDING

↓

DELIVERY INSPECTION

↓

DELIVERED

↓

COMPLETED

**11.14 Delivery Inspection Started**

When the driver begins the delivery inspection process, the system may create:

**DELIVERY INSPECTION STARTED**

This indicates that the vehicle has entered the final verification stage.

The milestone may reference the relevant delivery inspection record.

**11.15 Delivery Completed**

Once:

- Delivery inspection is completed.
- Required photographs are captured.
- Vehicle handover is completed.
- Customer confirms delivery.
- Driver confirms completion.

The system may create:

**DELIVERY COMPLETED**

The trip then proceeds to the final completion process.

**11.16 Milestone Timeline**

The customer should be able to view milestones in chronological order.

For example:

TRIP TIMELINE

✓ Pickup Completed

08:42 AM

Mombasa

✓ Trip Started

09:15 AM

Mombasa

✓ Fuel Stop

11:30 AM

Mariakani

✓ Major Route Milestone

02:10 PM

Voi

⚠ Delay Reported

04:25 PM

Voi–Nairobi Highway

● Destination Reached

Pending

This provides the customer with an understandable journey history.

**11.17 Milestone Data Structure**

Each milestone should be associated with a specific trip.

A basic milestone record should contain:

| **Field** | **Description** |
| --- | --- |
| Milestone ID | Unique milestone identifier |
| Trip ID | Associated trip |
| Driver ID | Driver who recorded the event |
| Milestone Type | Type of event |
| Description | Optional explanation |
| Latitude | Location latitude where available |
| Longitude | Location longitude where available |
| Timestamp | Time event occurred |
| Created At | Time record was created |
| Evidence | Supporting evidence where applicable |

**11.18 Automatic and Manual Milestones**

The system may create some milestones automatically while allowing the driver to create others manually.

**System-generated milestones**

Examples:

- Trip Started.
- Pickup Completed.
- Delivery Completed.
- Trip Completed.

These should be generated from verified system actions.

**Driver-generated milestones**

Examples:

- Fuel Stop.
- Major Route Milestone.
- Delay Reported.

This distinction helps maintain the reliability of important records.

**11.19 Milestone Evidence**

Where appropriate, milestones may contain supporting evidence.

Evidence may include:

- Photograph.
- GPS coordinates.
- Timestamp.
- Inspection record.
- Fuel receipt.
- Driver note.

However, not every milestone needs an uploaded document.

The system should only require evidence where it provides meaningful operational value.

**11.20 Milestone Editing**

Once an important milestone has been submitted, the driver should not be able to silently modify the original record.

If correction is required, the system should preserve the original record and record the correction.

For example:

Original:

FUEL STOP

10:15 AM

Correction:

Location corrected by driver

10:20 AM

This supports accountability and prevents important trip records from being silently altered.

**11.21 Milestone Visibility**

Access to milestones shall follow the trip's access-control rules.

**Customer**

Can view milestones for their own trip.

**Driver**

Can view milestones relating to their assigned trip.

**Administrator**

Can view and manage milestone information for operational purposes.

Users should not be able to access milestones belonging to unrelated trips.

**11.22 Milestone Notifications**

Not every milestone needs to generate a notification.

The MVP should prioritize notifications for events that are useful to the customer.

Potential customer notifications include:

- Pickup completed.
- Trip started.
- Significant delay.
- Destination reached.
- Delivery completed.
- Trip completed.

Events such as routine GPS updates should update the tracking interface rather than generating individual notifications.

**11.23 Milestones and GPS**

The two modules shall work together.

For example:

GPS Module

↓

Vehicle Location

+

Trip Milestone Module

↓

What happened at that location?

A milestone may automatically capture the driver's current GPS location when it is created.

For example:

**FUEL STOP**

Time:

11:34 AM

Location:

Mariakani

GPS:

Available

This creates stronger operational evidence.

**11.24 Milestones and Inspection**

Inspection records and milestones should remain separate but linked.

For example:

PICKUP INSPECTION

↓

Inspection Record

↓

PICKUP COMPLETED Milestone

The milestone should reference the inspection record rather than duplicating all inspection information.

Similarly:

DELIVERY INSPECTION

↓

Inspection Record

↓

DELIVERY COMPLETED Milestone

This prevents unnecessary duplication in the database.

**11.25 Milestones and Payment**

Milestones may support payment conditions, but the milestone itself should not independently release money.

For example:

TRIP STARTED

↓

Payment Module checks:

↓

Pickup inspection ✓

Fueling ✓

Driver START TRIP ✓

Customer confirmation ✓

↓

Release 50%

Similarly:

DELIVERY COMPLETED

↓

Payment Module checks:

↓

Delivery inspection ✓

Customer confirmation ✓

Driver confirmation ✓

↓

Release remaining 50%

This keeps financial logic within the Payment and Wallet Module.

**11.26 Milestone and Trip Status Integrity**

The system shall prevent contradictory milestone records and trip statuses.

For example, the system should not allow:

Trip Status:

PICKUP PENDING

Milestone:

TRIP COMPLETED

Similarly, the system should not allow:

Trip Status:

COMPLETED

New Milestone:

TRIP STARTED

Important milestone creation should therefore respect the current trip state.

**11.27 Offline Milestone Recording**

Where technically feasible, the application may allow certain driver milestones to be recorded while temporarily offline.

For example:

Driver records:

FUEL STOP

↓

No Internet

↓

Saved Locally

↓

Internet Returns

↓

Synchronize

The original timestamp should be retained.

This is particularly important because transportation may pass through areas with unreliable connectivity.

**11.28 Administrator Controls**

Administrators should be able to:

- View milestones.
- View milestone timestamps.
- View milestone locations.
- View supporting evidence.
- Review unusual milestone patterns.
- Add administrative notes where necessary.
- Review milestone history during disputes.

Administrators should not casually alter operational records.

Any administrative correction should be auditable.

**11.29 Milestone Audit Trail**

Important milestone actions should be recorded in the system audit trail.

The audit record may contain:

- User.
- Action.
- Trip.
- Milestone.
- Date and time.
- Previous information where applicable.
- New information where applicable.

This is particularly important for:

- Payment-related milestones.
- Pickup milestones.
- Delivery milestones.
- Completion milestones.
- Administrative corrections.

**11.30 MVP Scope**

**Included in MVP**

The Trip Milestone Module shall include:

- Pickup completed milestone.
- Trip started milestone.
- Fuel stop milestone.
- Major route milestone.
- Delay reporting.
- Destination reached milestone.
- Delivery inspection started milestone.
- Delivery completed milestone.
- Chronological trip timeline.
- GPS association.
- Timestamp recording.
- Basic milestone notifications.
- Customer milestone visibility.
- Driver milestone interaction.
- Administrator milestone monitoring.
- Basic audit records.
- Offline recording where technically feasible.

**Not Required for MVP**

The following should remain future features:

- AI-generated journey summaries.
- Automatic traffic-event classification.
- Predictive delay detection.
- Advanced route intelligence.
- Automatic anomaly detection.
- Complex milestone automation.
- Predictive ETA based on machine learning.
- Advanced fleet analytics.

**11.31 Complete Operational Flow**

The complete milestone process should work as follows:

BOOKED

↓

PICKUP PENDING

↓

PICKUP INSPECTION

↓

PICKUP COMPLETED

↓

TRIP START PENDING

↓

Driver selects START TRIP

↓

Customer confirms

↓

TRIP ACTIVE

↓

TRIP STARTED

↓

IN TRANSIT

↓

┌───────────────┐

│ │

↓ ↓

FUEL STOP ROUTE MILESTONE

│ │

└───────┬───────┘

↓

DELAY REPORTED

if needed

↓

DESTINATION REACHED

↓

DELIVERY PENDING

↓

DELIVERY INSPECTION STARTED

↓

DELIVERY COMPLETED

↓

COMPLETED

**11.32 Developer Implementation Principle**

The Trip Milestone Module should remain **event-oriented**.

The developer should think of a milestone as:

**An important event that occurred during a specific trip.**

It should not become another complicated trip-management system.

The main responsibilities remain separated:

| **Module** | **Main Responsibility** |
| --- | --- |
| Trip Management | Controls trip lifecycle/status |
| Vehicle Inspection | Records vehicle condition |
| GPS Tracking | Records vehicle location |
| Trip Milestones | Records important journey events |
| Payment & Wallet | Controls customer payment and driver releases |
| Notifications | Communicates important events |
| Dispute Management | Handles exceptional cases |

This separation will make the system considerably easier for you to develop and maintain.

**12.0 PAYMENT AND WALLET MODULE**

**12.1 Purpose**

The Payment and Wallet Module shall manage all financial transactions associated with a CarGo Kenya transportation assignment.

The module shall ensure that:

- The customer pays the **full agreed trip cost through CarGo Kenya** before the trip becomes officially confirmed.
- The customer's payment is associated with the relevant **Trip Wallet**.
- The driver does **not** receive the transportation fee immediately after payment.
- The driver's transportation fee remains controlled by the trip's payment-release conditions.
- The first **50% of the driver's transportation fee** becomes eligible for release when the trip officially becomes **TRIP ACTIVE**.
- The remaining **50% of the driver's transportation fee** becomes eligible for release when the trip becomes **COMPLETED**.
- Released driver earnings move into the driver's **Personal Wallet**.
- The fuel budget remains a trip-related operational amount and is not automatically treated as driver income.
- CarGo Kenya's platform fee is recorded separately.
- Refunds, cancellations, disputes, and adjustments can be handled without compromising the financial records.

The module shall therefore provide the financial backbone of the CarGo Kenya MVP.

**12.2 Payment Philosophy**

The CarGo Kenya payment design is based on one central principle:

**The customer pays through the platform, while the driver's earnings are released according to verified transportation milestones.**

The platform should not simply receive the customer's money and immediately transfer the driver's transportation fee.

Instead, the financial lifecycle shall be:

Customer Payment

↓

Trip Wallet

↓

┌────┴─────────────┐

↓ ↓

50% Driver Fee Remaining 50%

at TRIP ACTIVE at COMPLETED

↓ ↓

Driver Wallet Driver Wallet

This provides greater protection to both the customer and CarGo Kenya.

**12.3 Total Trip Cost**

The total amount payable by the customer shall consist of the agreed financial components of the transportation assignment.

The MVP shall initially support:

1.  **Driver Transportation Fee**
2.  **Fuel Budget**
3.  **CarGo Kenya Platform Fee**

Therefore:

Total Trip Cost

\=

Driver Transportation Fee

+

Fuel Budget

+

CarGo Kenya Platform Fee

**Example**

Driver Transportation Fee = KSh 18,000

Fuel Budget = KSh 6,000

CarGo Kenya Platform Fee = KSh 900

Total Trip Cost = KSh 24,900

The customer shall see this breakdown before making payment.

**12.4 Customer Payment Requirement**

The customer shall pay the **full agreed trip cost through the platform** before the transportation assignment becomes officially confirmed.

The payment process shall therefore be:

Driver Selected

↓

Price Confirmed

↓

Payment Pending

↓

Customer Pays Full Amount

↓

Payment Successfully Confirmed

↓

BOOKED

The system shall not mark a trip as BOOKED merely because the customer has initiated a payment.

The payment must first be successfully confirmed by the payment system.

**12.5 Why the Customer Pays the Full Amount**

The full-payment model is important because it prevents the driver and customer from having to settle the agreed transportation fee privately.

For example, if the agreed trip is:

Driver Fee = KSh 18,000

Fuel = KSh 6,000

CarGo Fee = KSh 900

Total = KSh 24,900

The customer pays:

**KSh 24,900 through CarGo Kenya.**

The customer should not then separately send:

**KSh 18,000 directly to the driver.**

The driver's agreed transportation fee is already represented inside the Trip Wallet.

**12.6 Payment Breakdown Display**

Before payment, the customer shall be shown a clear breakdown.

Example:

**Trip Cost**

| **Component** | **Amount** |
| --- | --- |
| Driver Transportation Fee | KSh 18,000 |
| Fuel Budget | KSh 6,000 |
| CarGo Kenya Service Fee | KSh 900 |
| **Total** | **KSh 24,900** |

The customer should be required to confirm the amount before proceeding to payment.

**12.7 Payment Status**

The payment system shall maintain a payment status separate from the trip status.

This is important because:

**Trip Status ≠ Payment Status**

For example:

Trip Status:

PAYMENT PENDING

Payment Status:

PENDING

After successful payment:

Trip Status:

BOOKED

Payment Status:

PAID

The system should therefore maintain both pieces of information.

**12.8 Payment Statuses**

The MVP may use the following payment statuses:

**PENDING**

Payment has been initiated or is awaiting confirmation.

**PROCESSING**

The payment provider is processing the transaction.

**PAID**

The full required trip amount has been successfully received/confirmed.

**FAILED**

The payment attempt failed.

**CANCELLED**

The payment transaction was cancelled.

**REFUND PENDING**

A refund has been initiated but has not yet been confirmed.

**REFUNDED**

The applicable refund has been successfully completed.

**PARTIALLY REFUNDED**

Only part of the customer's payment has been returned.

**DISPUTED**

The payment or related transaction is subject to an unresolved financial dispute.

**12.9 Payment Transaction Record**

Every payment attempt should have its own transaction record.

A payment transaction should contain information such as:

| **Field** | **Description** |
| --- | --- |
| Transaction ID | Unique payment transaction |
| Trip ID | Associated trip |
| Customer ID | Paying customer |
| Amount | Amount involved |
| Currency | Currency used |
| Payment Method | Method used |
| Provider Reference | Payment provider transaction reference |
| Status | Payment status |
| Initiated At | Time payment started |
| Confirmed At | Time payment was confirmed |
| Failure Reason | Reason if unsuccessful |
| Created At | Database timestamp |

The exact fields may be adjusted during implementation depending on the payment provider.

**12.10 Payment Provider**

The MVP should use a suitable payment provider that can support payments from customers in Kenya.

The payment architecture should avoid tightly coupling the entire CarGo application to a single provider.

The application should ideally have a payment-service layer responsible for:

- Creating payment requests.
- Receiving payment confirmations.
- Verifying transactions.
- Recording transaction references.
- Handling payment failures.
- Initiating refunds where supported.
- Updating Trip Wallet records.

This will make future payment-provider changes easier.

**12.11 Payment Confirmation**

The system shall not rely solely on the customer's claim that payment has been made.

For example, the customer should not be able to manually enter:

"I have paid."

and cause the trip to become booked.

The payment must be verified through the appropriate payment mechanism.

The general process shall be:

Customer Initiates Payment

↓

Payment Provider

↓

Payment Result

↓

CarGo Payment Verification

↓

Transaction Recorded

↓

Trip Wallet Updated

↓

Trip Becomes BOOKED

**12.12 Payment Callback / Webhook**

Where the selected payment provider supports callbacks or webhooks, CarGo Kenya should use them to receive payment-status updates.

The backend should verify the callback before updating the payment record.

The system should not blindly trust arbitrary requests claiming that a payment succeeded.

The payment confirmation process should verify:

- Transaction reference.
- Amount.
- Trip reference.
- Payment status.
- Relevant customer information.
- Provider authenticity where supported.

**12.13 Duplicate Payment Protection**

The system shall prevent a single customer payment from being recorded more than once.

For example, if a payment provider sends the same confirmation twice:

Payment Callback 1

↓

Transaction Recorded

Payment Callback 2

↓

Already Processed

↓

Do Not Create Duplicate Payment

This is particularly important for financial systems.

The payment transaction reference should therefore be uniquely identifiable.

**12.14 Trip Wallet**

Each confirmed trip shall have a dedicated **Trip Wallet record**.

The Trip Wallet represents the financial accounting associated with one specific transportation assignment.

It shall not be treated as a general customer wallet.

The Trip Wallet should track:

- Customer payment.
- Driver transportation fee.
- Fuel budget.
- CarGo platform fee.
- First driver payment release.
- Remaining driver balance.
- Refunds.
- Adjustments.
- Payment status.
- Release status.
- Relevant transaction references.

**12.15 Trip Wallet Example**

Suppose:

Driver Fee = KSh 18,000

Fuel Budget = KSh 6,000

CarGo Fee = KSh 900

The Trip Wallet may conceptually contain:

CUSTOMER PAYMENT

KSh 24,900

\--------------------------------

DRIVER FEE

KSh 18,000

50% Released:

KSh 9,000

Remaining:

KSh 9,000

\--------------------------------

FUEL BUDGET

KSh 6,000

\--------------------------------

CARGO FEE

KSh 900

The exact implementation may represent these as ledger transactions rather than simply storing mutable balances.

**12.16 Important Wallet Design Principle**

The developer should avoid treating the Trip Wallet as simply:

balance = 24900

A financial wallet should preferably maintain a transaction history.

For example:

Trip Wallet

↓

Transaction Ledger

↓

+24,900 Customer Payment

\- 9,000 Driver Release

\- 9,000 Driver Release

\- 6,000 Fuel Allocation

\- 900 CarGo Fee

The exact accounting implementation can be refined during database design.

The important principle is:

**Every movement of money should be traceable.**

**12.17 Driver Transportation Fee**

The driver's transportation fee represents the amount agreed with the driver for transporting the vehicle.

Example:

**Driver Transportation Fee = KSh 18,000**

This amount is distinct from:

- Fuel budget.
- CarGo platform fee.

The driver's earnings should primarily represent this transportation fee.

**12.18 Fuel Budget**

The fuel budget represents the amount allocated for fuel associated with the transportation assignment.

Example:

Driver Fee = KSh 18,000

Fuel Budget = KSh 6,000

The customer pays both amounts through the platform.

However:

**KSh 6,000 fuel budget is not automatically KSh 6,000 driver income.**

This distinction must remain clear throughout the system.

**12.19 CarGo Kenya Platform Fee**

The CarGo Kenya platform fee represents the platform's revenue from the transportation transaction.

For example:

Driver Fee = KSh 18,000

Fuel = KSh 6,000

CarGo Fee = KSh 900

The platform fee:

**KSh 900**

shall be recorded separately from driver earnings.

**12.20 Commission Configuration**

The platform fee may initially be configured as:

- Fixed amount per trip; or
- Percentage of driver transportation fee.

The MVP should allow administrators to configure the applicable model.

For example:

**Fixed**

CarGo Fee = KSh 900

**Percentage**

Driver Fee = KSh 18,000

Commission = 5%

CarGo Fee = KSh 900

The exact business model can be finalized before implementation.

**12.21 Price Snapshot**

Once the customer accepts the quotation and proceeds to payment, the system should create a **price snapshot** for that trip.

The snapshot should preserve:

- Driver fee.
- Fuel budget.
- CarGo fee.
- Total amount.
- Pricing basis.
- Applicable adjustments.

This is important because the administrator may change pricing rules later.

A completed trip should not suddenly change because the global pricing configuration was changed.

**12.22 Payment and Booking Flow**

The complete initial payment process shall be:

Customer Creates Request

↓

Drivers Submit Quotations

↓

Customer Selects Driver

↓

Agreed Price Confirmed

↓

PAYMENT PENDING

↓

Customer Pays Full Trip Cost

↓

Payment Verified

↓

Trip Wallet Created/Updated

↓

BOOKED

The customer receives confirmation that the trip is officially booked.

**12.23 Driver Does Not Receive Money at Booking**

When the customer pays the full amount, the driver's transportation fee shall **not immediately become available in the driver's Personal Wallet**.

For example:

Customer Pays:

KSh 24,900

Driver Personal Wallet:

\+ KSh 0 released at this point

Instead:

Trip Wallet

↓

Driver Fee Held for Release

This protects the customer if the driver has not yet successfully commenced the transportation assignment.

**12.24 First Driver Payment Release**

The first 50% of the driver's transportation fee shall become eligible for release only after the transportation assignment officially becomes:

**TRIP ACTIVE**

The system must verify the relevant conditions.

These include:

1.  Driver arrived at pickup.
2.  Pickup inspection completed.
3.  Required photographs captured.
4.  Odometer recorded.
5.  Fuel level recorded.
6.  Vehicle handover completed.
7.  Required fueling procedures completed.
8.  Driver selects **START TRIP**.
9.  Customer confirms trip commencement.

Once the required conditions are satisfied:

**TRIP ACTIVE**

The first 50% becomes eligible for release.

**12.25 First Release Example**

Suppose:

Driver Fee = KSh 18,000

First release:

50% × KSh 18,000

\= KSh 9,000

The financial movement becomes:

Trip Wallet

↓

Release KSh 9,000

↓

Driver Personal Wallet

The remaining:

**KSh 9,000**

remains associated with the trip until completion.

**12.26 Why the First 50% Is Released at TRIP ACTIVE**

The first release is intentionally linked to verified commencement rather than simply booking.

This means a driver cannot receive the first 50% merely by being selected by the customer.

The system waits until:

Pickup

+

Inspection

+

Handover

+

Fueling where required

+

Driver Start

+

Customer Confirmation

have been completed.

This creates a stronger relationship between:

**payment release → actual transportation activity.**

**12.27 Customer Confirmation of Trip Start**

After the driver selects:

**START TRIP**

the customer shall receive a trip-start confirmation request.

For example:

**Driver has completed pickup procedures and requested to start the trip. Confirm that transportation has commenced.**

The customer may select:

**CONFIRM TRIP START**

or report an issue where applicable.

Only after confirmation should the system move the trip to:

**TRIP ACTIVE**

**12.28 Preventing Unauthorized First Release**

The backend should never rely only on the frontend button.

A driver should not be able to send:

POST /release-payment

and receive the 50%.

Instead, the backend should independently verify the required conditions.

Conceptually:

Request First Release

↓

Check Trip

↓

Inspection Complete?

↓

Handover Complete?

↓

Fueling Complete?

↓

Driver Start Confirmed?

↓

Customer Confirmed?

↓

Trip ACTIVE?

↓

YES

↓

Release 50%

If any required condition is missing, the release should not occur.

**12.29 Second Driver Payment Release**

The remaining 50% shall become eligible for release after the trip is officially completed.

The required conditions include:

1.  Vehicle reaches destination.
2.  Delivery inspection completed.
3.  Required delivery documentation completed.
4.  Vehicle handover completed.
5.  Customer confirms successful delivery.
6.  Driver confirms completion.
7.  Trip status becomes **COMPLETED**.

Only then should the remaining driver balance be released.

**12.30 Second Release Example**

Using the same driver fee:

Total Driver Fee = KSh 18,000

First Release:

KSh 9,000

Remaining:

KSh 9,000

After successful completion:

Trip Wallet

↓

Release KSh 9,000

↓

Driver Personal Wallet

Total driver earnings released:

**KSh 18,000**

**12.31 Driver Personal Wallet**

The Driver Personal Wallet shall contain funds that have become available to the driver after successful payment-release conditions.

It shall record:

- Available balance.
- Released earnings.
- Pending earnings where applicable.
- Transaction history.
- Withdrawal history.
- Relevant trip references.

The driver should be able to distinguish:

**Available Money**

from

**Money Still Pending Release.**

**12.32 Pending Driver Earnings**

The system may display pending driver earnings separately.

For example:

DRIVER WALLET

Available Balance:

KSh 9,000

Pending Earnings:

KSh 9,000

Total Trip Earnings:

KSh 18,000

This makes the payment process transparent to the driver.

**12.33 Driver Wallet Transaction**

Every release should create a wallet transaction.

For example:

Wallet Transaction

Type:

Trip Payment Release

Trip:

CGK-2026-000125

Amount:

KSh 9,000

Status:

COMPLETED

Date:

10 August 2026

The driver should be able to view the transaction history.

**12.34 Driver Withdrawal**

The Driver Personal Wallet should support withdrawal of **available** funds according to the supported withdrawal method.

The driver shall not be allowed to withdraw:

- Pending earnings.
- Money still held in a Trip Wallet.
- Funds associated with unresolved payment restrictions.

The basic rule is:

Available Wallet Balance

↓

Eligible for Withdrawal

Pending Trip Earnings

↓

NOT Eligible

**12.35 Withdrawal Process**

The withdrawal flow may be:

Driver Wallet

↓

Available Balance

↓

Withdraw

↓

Enter/Select Withdrawal Details

↓

Confirm

↓

Withdrawal Processing

↓

Withdrawal Completed

The system should create a withdrawal record for every request.

**12.36 Withdrawal Record**

A withdrawal record should contain:

| **Field** | **Description** |
| --- | --- |
| Withdrawal ID | Unique withdrawal |
| Driver ID | Driver requesting withdrawal |
| Amount | Amount requested |
| Destination | Approved withdrawal destination |
| Status | Processing/completed/failed |
| Provider Reference | Payment provider reference |
| Requested At | Request time |
| Completed At | Completion time |
| Failure Reason | If applicable |

**12.37 Insufficient Balance**

The system shall prevent withdrawals greater than the driver's available balance.

Example:

Available Balance:

KSh 5,000

Requested Withdrawal:

KSh 7,000

Result:

Withdrawal rejected

The driver may only withdraw eligible available funds.

**12.38 Trip Wallet vs Driver Wallet**

These two wallets must remain clearly separated.

| **Trip Wallet** | **Driver Personal Wallet** |
| --- | --- |
| Belongs to a specific trip | Belongs to driver |
| Holds/records trip financial allocations | Holds released driver earnings |
| Tracks customer payment | Tracks available driver funds |
| Tracks fuel budget | Tracks withdrawals |
| Tracks CarGo fee | Tracks released earnings |
| Controls release conditions | Used after funds become available |
| Not directly withdrawable by driver | Eligible funds may be withdrawn |

The distinction is fundamental to the CarGo Kenya payment architecture.

**12.39 Fuel Budget Accounting**

The system shall maintain the fuel budget as a separate trip-level financial component.

For example:

Trip Wallet

Customer Payment

KSh 24,900

Driver Fee

KSh 18,000

Fuel Budget

KSh 6,000

CarGo Fee

KSh 900

The fuel budget should not automatically increase the driver's personal earnings.

The detailed handling of unused fuel, fuel expenditure, refunds, or future direct fuel-station payment can be expanded later.

For the MVP, the system should primarily maintain the agreed fuel allocation and relevant fuel records.

**12.40 Fuel Budget and Fuel Records**

The Payment and Wallet Module shall work with the Fuel/Trip module.

For example:

Trip Wallet

↓

Fuel Budget = KSh 6,000

↓

Fuel Records

↓

Fuel Stop

↓

Receipt/Amount where applicable

The fuel records provide operational evidence.

The wallet provides financial accounting.

These should not be unnecessarily merged into one database concept.

**12.41 Refunds**

The system shall support refunds where a customer's payment must be returned.

Refunds may occur because of:

- Cancellation.
- Failed pickup.
- Approved dispute resolution.
- Driver unavailability.
- Administrative decision.
- Other approved exceptional circumstances.

The refund amount shall depend on the applicable cancellation or settlement rules.

The system should not allow arbitrary refunds without authorization.

**12.42 Refund Process**

The general process shall be:

Trip Issue

↓

Cancellation / Dispute

↓

Refund Decision

↓

Refund Amount Determined

↓

Refund Initiated

↓

Payment Provider

↓

Refund Confirmed

↓

Trip Wallet Updated

The original payment transaction should remain in the financial history.

A refund should be recorded as a separate financial transaction rather than deleting the original payment.

**12.43 Partial Refund**

The system should support partial refunds.

Example:

Customer Paid:

KSh 24,900

Approved Refund:

KSh 6,000

Remaining:

KSh 18,900

The system should clearly record:

- Original payment.
- Refund amount.
- Reason.
- Authorization.
- Refund reference.
- Remaining financial allocation.

**12.44 Cancellation Before Trip Start**

If a trip is cancelled before transportation officially starts, the system should determine the applicable financial consequences according to the cancellation rules.

The system should consider:

- Current trip status.
- Who initiated cancellation.
- Reason.
- Whether pickup has occurred.
- Whether payment releases have occurred.
- Applicable cancellation policy.

The financial outcome should then be recorded against the Trip Wallet.

**12.45 Failed Driver Pickup**

A particularly important case is when:

Customer Paid

↓

BOOKED

↓

Driver Fails to Pick Vehicle

The driver must not simply receive the full transportation fee.

Because the driver's payment is still controlled through the Trip Wallet, unreleased funds remain protected while the situation is investigated.

If the driver never reaches the required:

**TRIP ACTIVE**

condition, the first 50% should not automatically become available.

The administrator can then determine the appropriate resolution.

**12.46 Driver Cannot Withdraw From Trip Wallet**

A driver shall never directly withdraw money from a Trip Wallet.

For example:

Trip Wallet:

KSh 24,900

Driver:

"Withdraw KSh 18,000"

This request must not be permitted.

The driver can only receive money through the defined release mechanism.

**12.47 Payment Protection During Disputes**

If a dispute occurs, affected funds may remain protected until the issue has been reviewed.

For example:

Trip Active

↓

50% Released

↓

Dispute Raised

↓

Remaining 50% Protected

↓

Administrator Review

↓

Settlement Decision

The exact handling of already-released funds may depend on the dispute outcome and applicable policy.

The MVP should allow administrators to record the resulting adjustment rather than attempting to automatically resolve every dispute.

**12.48 Payment Adjustments**

An administrator may need to record a financial adjustment.

Examples include:

- Approved additional transportation charge.
- Approved refund.
- Correction of a transaction.
- Dispute settlement.
- Other authorized financial adjustment.

Every adjustment should contain:

- Trip.
- Amount.
- Reason.
- Administrator.
- Date/time.
- Related transaction.
- Supporting notes where necessary.

**12.49 Destination Change and Payment**

If the customer requests a destination change after the trip has started, the system shall not automatically modify the original payment.

The process should be:

Customer Requests Change

↓

Driver Reviews

↓

Driver Accepts

↓

Additional Cost Calculated

↓

Customer Accepts

↓

Additional Payment

↓

Trip Continues

The additional amount should be recorded as a separate transaction or adjustment associated with the trip.

The original price snapshot should remain preserved.

**12.50 Payment and Trip Status Integrity**

Payment operations must respect the official trip lifecycle.

For example:

**First 50%**

Allowed when:

Trip Status = TRIP ACTIVE

and all required commencement conditions are satisfied.

**Final 50%**

Allowed when:

Trip Status = COMPLETED

and all required completion conditions are satisfied.

The system should never release money solely because a user presses a frontend button.

**12.51 Payment Release Idempotency**

This is an important developer requirement.

The system must prevent the same payment release from happening twice.

For example, if the first 50% release request is accidentally submitted twice:

Release Request 1

↓

KSh 9,000 Released

Release Request 2

↓

Already Released

↓

Do NOT release another KSh 9,000

Each release should have a unique transaction/reference.

This protects against duplicate payments caused by:

- Network retries.
- Double clicks.
- Duplicate API requests.
- Webhook retries.
- Server retries.

**12.52 Payment Transaction Ledger**

The system should maintain an immutable or carefully controlled financial transaction history.

A simplified example:

TRIP: CGK-2026-000125

\+ KSh 24,900

Customer Payment

\- KSh 9,000

First Driver Release

\- KSh 9,000

Final Driver Release

\- KSh 6,000

Fuel Allocation

\- KSh 900

CarGo Platform Fee

The exact accounting implementation may differ, but the principle remains:

Every financial movement must be traceable to a reason and a transaction.

**12.53 Financial Reconciliation**

The administrator should be able to reconcile the financial records of a trip.

For example:

Customer Paid:

KSh 24,900

Driver Fee:

KSh 18,000

Fuel:

KSh 6,000

CarGo Fee:

KSh 900

Total:

KSh 24,900

The system should be able to identify whether:

Customer Payment

\=

Financial Allocations

If the figures do not reconcile, the system should flag the transaction for administrative review rather than silently accepting inconsistent balances.

**12.54 Payment Audit Trail**

Important financial actions should be recorded in the audit trail.

These include:

- Payment initiation.
- Payment confirmation.
- Payment failure.
- Trip Wallet creation.
- First driver release.
- Final driver release.
- Withdrawal request.
- Withdrawal completion.
- Refund.
- Adjustment.
- Cancellation settlement.
- Administrative intervention.

Each important event should record:

- User/system actor.
- Action.
- Trip.
- Amount.
- Date/time.
- Transaction reference.
- Relevant status.

**12.55 Customer Payment History**

The customer should be able to view payment information for their own trips.

The customer may see:

- Trip reference.
- Total amount.
- Driver fee.
- Fuel budget.
- CarGo fee.
- Payment status.
- Payment date.
- Transaction reference where appropriate.
- Refund information where applicable.

Sensitive internal financial information should not be exposed unnecessarily.

**12.56 Driver Earnings History**

The driver should be able to view:

- Trip earnings.
- First payment release.
- Final payment release.
- Total earnings.
- Pending earnings.
- Available balance.
- Withdrawals.

Example:

TRIP CGK-2026-000125

Driver Fee:

KSh 18,000

Released:

KSh 18,000

Status:

Fully Paid

**12.57 Administrator Payment Dashboard**

The administrator should be able to view basic payment information.

The MVP dashboard may include:

- Total customer payments.
- Pending payments.
- Successful payments.
- Failed payments.
- Driver earnings released.
- Pending driver earnings.
- Refunds.
- CarGo revenue.
- Active Trip Wallets.
- Payment disputes.

The MVP does not require advanced financial analytics.

**12.58 Payment Security**

The payment module shall be treated as a security-sensitive component.

The system should include:

- Authentication.
- Authorization.
- Secure API endpoints.
- Input validation.
- Transaction verification.
- Unique transaction references.
- Protection against duplicate processing.
- Audit logging.
- Restricted administrator access.
- Secure handling of payment-provider credentials.
- Protection against unauthorized wallet manipulation.

Payment-provider secret credentials must never be exposed in frontend code.

**12.59 Important Backend Principle**

The frontend should **never be trusted to determine how much money a user receives**.

For example, the frontend should not be able to send:

amount = 18000

and tell the server:

Release KSh 18,000.

The backend must calculate the permitted amount from the stored trip information.

For example:

Stored Driver Fee:

KSh 18,000

Allowed First Release:

50%

Backend Calculates:

KSh 9,000

This prevents users from manipulating payment amounts.

**12.60 Payment Calculation Example**

Suppose the quotation contains:

Driver Fee = KSh 22,000

Fuel Budget = KSh 12,500

CarGo Fee = KSh 1,500

The system calculates:

Total =

22,000 + 12,500 + 1,500

Total = KSh 36,000

Customer pays:

**KSh 36,000**

At TRIP ACTIVE:

22,000 × 50%

\= KSh 11,000

Driver receives:

**KSh 11,000**

Remaining:

**KSh 11,000**

At COMPLETED:

**KSh 11,000** is released.

Total driver earnings:

**KSh 22,000**

**12.61 Complete Payment Lifecycle**

The complete MVP payment lifecycle shall be:

QUOTATION

↓

DRIVER SELECTED

↓

PRICE CONFIRMED

↓

PAYMENT PENDING

↓

CUSTOMER PAYS FULL COST

↓

PAYMENT VERIFIED

↓

BOOKED

↓

TRIP WALLET

↓

PICKUP + INSPECTION

↓

FUELING

↓

DRIVER START TRIP

↓

CUSTOMER CONFIRMS

↓

TRIP ACTIVE

↓

RELEASE 50%

↓

DRIVER WALLET

↓

IN TRANSIT

↓

DELIVERY PROCESS

↓

CUSTOMER CONFIRMS

+

DRIVER CONFIRMS

↓

COMPLETED

↓

RELEASE 50%

↓

DRIVER WALLET

↓

WITHDRAWAL

**12.62 Payment Module Rules**

The following rules shall be treated as core MVP business rules.

**Rule 1**

The customer must pay the full agreed trip cost through CarGo Kenya before the trip becomes BOOKED.

**Rule 2**

The customer's full payment is associated with the relevant Trip Wallet.

**Rule 3**

The driver does not receive the transportation fee immediately after booking.

**Rule 4**

The fuel budget is separate from driver earnings.

**Rule 5**

The CarGo Kenya platform fee is recorded separately.

**Rule 6**

The first 50% of the driver's transportation fee is released only when the trip officially becomes TRIP ACTIVE and the required conditions are satisfied.

**Rule 7**

The remaining 50% is released only when the trip becomes COMPLETED and the required completion conditions are satisfied.

**Rule 8**

Driver funds become available in the Driver Personal Wallet only after the applicable release occurs.

**Rule 9**

A driver cannot withdraw money directly from a Trip Wallet.

**Rule 10**

Payment releases must be processed by the backend.

**Rule 11**

Duplicate payment releases must be prevented.

**Rule 12**

Refunds and adjustments must be recorded as separate financial transactions.

**Rule 13**

Disputed funds should remain protected until the applicable resolution process is completed.

**Rule 14**

Every important financial action must be traceable.

**12.63 MVP Scope**

**Included in MVP**

The Payment and Wallet Module shall include:

- Full customer payment.
- Payment verification.
- Payment transaction records.
- Trip Wallet.
- Driver Personal Wallet.
- Driver pending earnings.
- 50% first driver release.
- 50% final driver release.
- Fuel budget recording.
- CarGo platform fee.
- Payment status tracking.
- Refund support.
- Partial refund support.
- Payment adjustments.
- Driver withdrawal records.
- Payment audit trail.
- Basic financial reconciliation.
- Payment notifications.
- Duplicate transaction protection.
- Role-based payment access.
- Payment-provider integration.

**Not Required for MVP**

The following should remain future features:

- Automatic fuel-station payment.
- Multiple complex payment providers.
- International payments.
- Driver loans.
- Driver advances outside trip earnings.
- Customer credit facilities.
- Automated financial dispute resolution.
- Financial products.
- Cryptocurrency payments.
- Advanced accounting integrations.
- Automated tax management.
- Complex escrow infrastructure beyond the required trip-payment controls.

**12.64 Final Payment Architecture**

For the CarGo Kenya MVP, the financial architecture can therefore be understood as three main layers:

CUSTOMER

│

│ Full Payment

↓

┌──────────────┐

│ TRIP WALLET │

└──────────────┘

│

┌────────┴────────┐

│ │

TRIP ACTIVE COMPLETED

│ │

50% 50%

│ │

└────────┬────────┘

↓

DRIVER PERSONAL

WALLET

│

↓

WITHDRAWAL

Alongside this:

Customer Payment

│

├── Driver Transportation Fee

│

├── Fuel Budget

│

└── CarGo Platform Fee

This is the payment structure we have agreed on and should now remain **consistent across the remaining system-design chapters**.

**13.0 NOTIFICATION AND COMMUNICATION MODULE**

**13.1 Purpose**

The Notification and Communication Module shall manage communication between CarGo Kenya, customers, drivers, and administrators throughout the transportation lifecycle.

The module shall ensure that users receive timely and understandable information whenever an important event occurs on their trip.

The module shall support communication related to:

- Account registration.
- Driver verification.
- Transportation requests.
- Driver quotations.
- Driver selection.
- Payment.
- Booking confirmation.
- Pickup arrangements.
- Vehicle inspection.
- Trip commencement.
- GPS and trip milestones.
- Delivery.
- Driver payment releases.
- Cancellations.
- Disputes.
- System-generated operational alerts.

The module shall also support practical communication between the customer and driver after a booking has been confirmed.

The objective is not simply to send messages, but to ensure that all important events in the CarGo Kenya transportation process are communicated to the correct users at the correct stage.

**13.2 Communication Philosophy**

The CarGo Kenya communication system shall follow the principle:

**Important trip events should generate clear, timely, and traceable communication.**

The system should therefore avoid situations where:

- A customer does not know whether payment was successful.
- A driver does not know whether they have been selected.
- A customer does not know when pickup procedures are completed.
- A driver does not know whether the customer has confirmed trip commencement.
- A customer cannot determine whether the trip is currently active.
- A customer does not know when delivery has occurred.
- A driver does not know when earnings have been released.
- An administrator is unaware of an important operational problem.

Communication should therefore be connected to the underlying system events and trip statuses.

**13.3 Communication Channels**

The MVP may support multiple communication channels.

These may include:

1.  **In-app notifications**
2.  **SMS notifications**
3.  **Email notifications where applicable**
4.  **In-platform customer-driver communication**

The MVP should not require every notification to be delivered through every channel.

For example:

A payment confirmation may be displayed:

- In the application.
- Through SMS where configured.

A less important operational event may only appear as an in-app notification.

The notification priority should determine the appropriate communication channel.

**13.4 In-App Notifications**

In-app notifications shall be the primary notification mechanism within the CarGo Kenya application.

Users should have a notification area where they can view important events relating to their account and trips.

Example:

**Customer Notifications**

**Payment Successful**

Your payment of KSh 24,900 for trip CGK-2026-000125 has been successfully confirmed.

**Trip Booked**

Your trip CGK-2026-000125 has been successfully booked with your selected driver.

**Trip Started**

Your driver and you have confirmed that trip CGK-2026-000125 has officially started.

**Delivery Completed**

Vehicle delivery for trip CGK-2026-000125 has been completed.

The notification should contain enough information for the user to understand what happened without requiring unnecessary navigation.

**13.5 Notification Record**

Every system-generated notification should have a notification record.

A notification may contain:

| **Field** | **Description** |
| --- | --- |
| Notification ID | Unique notification identifier |
| User ID | Recipient |
| Trip ID | Related trip where applicable |
| Type | Notification category |
| Title | Notification heading |
| Message | Notification content |
| Channel | In-app, SMS, email, etc. |
| Status | Pending, sent, failed, read |
| Created At | Creation timestamp |
| Sent At | Delivery timestamp |
| Read At | Time user opened/read notification |
| Related Entity | Optional related system record |

The exact fields may be adjusted during database design.

**13.6 Notification Types**

The MVP should organize notifications according to the event that generated them.

Major notification categories should include:

- Account notifications.
- Verification notifications.
- Booking notifications.
- Payment notifications.
- Pickup notifications.
- Trip-start notifications.
- Tracking/milestone notifications.
- Delivery notifications.
- Earnings notifications.
- Cancellation notifications.
- Dispute notifications.
- Administrative notifications.

This classification will make it easier to manage notifications within the backend and frontend.

**13.7 Customer Notifications**

Customers should receive notifications for important events affecting their transportation requests and trips.

These may include:

**Account**

- Account successfully created.
- Account verification status where applicable.
- Password/security-related events.

**Transportation Request**

- Request successfully created.
- Request status changed.
- Driver quotation received.
- Multiple quotations available.

**Driver Selection**

- Driver selected.
- Driver accepted or confirmed the assignment.
- Driver unavailable where applicable.

**Payment**

- Payment initiated.
- Payment successful.
- Payment failed.
- Payment pending.
- Refund initiated.
- Refund completed.

**Booking**

- Trip successfully booked.
- Booking cancelled.
- Pickup scheduled.

**Pickup**

- Driver arrived at pickup location.
- Pickup inspection started.
- Pickup inspection completed.
- Vehicle condition discrepancy recorded.
- Trip-start confirmation requested.

**Trip**

- Driver selected START TRIP.
- Customer confirmation required.
- Trip officially became TRIP ACTIVE.
- Important trip milestone reached.
- Significant delay reported.
- GPS/tracking interruption where relevant.

**Delivery**

- Vehicle approaching destination where applicable.
- Delivery process started.
- Delivery confirmation required.
- Delivery completed.
- Trip completed.

**Driver Earnings**

Customers do not need to receive the driver's private wallet information.

However, where relevant, the customer may receive confirmation that the trip has been completed and the transportation process has been successfully closed.

**13.8 Driver Notifications**

Drivers should receive notifications relating to assignments, inspections, trips, and earnings.

These may include:

**Account and Verification**

- Registration successful.
- Verification submitted.
- Verification approved.
- Verification rejected.
- Verification requires correction.
- Account suspended.

**Transportation Requests**

- New eligible transportation request.
- Request closing or expiring.
- Customer selected driver.
- Customer cancelled request.

**Booking**

- Assignment confirmed.
- Customer payment confirmed.
- Pickup details available.
- Customer contact information available after booking.

**Pickup**

- Pickup approaching.
- Pickup scheduled.
- Customer has confirmed pickup details.
- Inspection required.
- Trip-start confirmation requested.

**Trip**

- Customer confirmed trip start.
- Trip became TRIP ACTIVE.
- GPS/tracking issue.
- Destination changed.
- Customer approved destination change.
- Delay reported.

**Delivery**

- Destination reached.
- Delivery inspection required.
- Customer confirmation pending.
- Delivery completed.

**Earnings**

- First 50% driver payment released.
- Final 50% driver payment released.
- Withdrawal initiated.
- Withdrawal completed.
- Withdrawal failed.

The driver should be able to distinguish between:

**Trip Notifications**

and

**Financial Notifications**

to make the wallet activity easier to understand.

**13.9 Administrator Notifications**

Administrators shall receive notifications for events requiring operational attention.

Examples include:

- New driver verification submission.
- Driver verification issue.
- Failed payment.
- Payment dispute.
- Failed pickup.
- Vehicle condition dispute.
- Destination change requiring review.
- Trip cancellation requiring intervention.
- Delivery dispute.
- Suspicious transaction activity.
- Failed refund.
- Failed driver withdrawal.
- GPS/tracking issue where operational intervention is required.
- Other system alerts.

The administrator should not receive unnecessary notifications for every routine action.

Notification rules should therefore distinguish between:

**Information**

and

**Action Required.**

**13.10 Notification Priority**

Notifications should have different levels of importance.

The MVP may use three basic priority levels:

**LOW**

Informational events that do not require immediate action.

Example:

Fuel stop recorded for trip CGK-2026-000125.

**NORMAL**

Important trip events.

Example:

Your vehicle has been picked up and the trip is now active.

**HIGH**

Events requiring immediate attention.

Example:

A vehicle condition discrepancy has been reported during pickup.

This classification can later be expanded if operational requirements justify it.

**13.11 Booking Notification Flow**

When a customer successfully completes payment:

Customer Pays

↓

Payment Verified

↓

Trip BOOKED

↓

Create Booking Notification

↓

Notify Customer

↓

Notify Driver

The customer may receive:

**Trip Confirmed**

Your trip CGK-2026-000125 has been successfully booked.

The driver may receive:

**New Trip Assignment**

You have been selected for trip CGK-2026-000125. Review the pickup and destination details.

The notification should only be generated after the backend confirms the relevant booking event.

**13.12 Payment Notification Flow**

Payment notifications shall be connected to verified payment events.

The process shall be:

Customer Initiates Payment

↓

Payment Provider

↓

Payment Verification

↓

Payment Status = PAID

↓

Trip Wallet Updated

↓

Notification Generated

↓

Customer Notified

The system should not send a successful-payment notification merely because the customer initiated payment.

The notification should be based on verified payment status.

**13.13 Trip Start Confirmation Communication**

The trip-start process is particularly important because it is linked to the first 50% driver payment release.

The communication flow shall be:

Pickup Inspection Completed

↓

Vehicle Handover Completed

↓

Driver Selects START TRIP

↓

Customer Receives Confirmation Request

↓

Customer Confirms

↓

TRIP ACTIVE

↓

50% Driver Release

The customer notification should clearly explain what is being confirmed.

Example:

**Confirm Trip Start**

The driver has completed the pickup inspection and requested to start the trip. Please confirm that transportation has officially commenced.

The customer may select:

**CONFIRM TRIP START**

or:

**REPORT AN ISSUE**

The system should not automatically assume customer confirmation.

**13.14 Trip Active Notification**

Once the customer confirms trip commencement, the backend shall:

1.  Verify the required conditions.
2.  Change the trip status to **TRIP ACTIVE**.
3.  Initiate the applicable first driver payment release.
4.  Start or activate GPS tracking according to the tracking design.
5.  Generate relevant notifications.

The customer may receive:

**Trip Active**

Trip CGK-2026-000125 is now officially active. You can monitor the vehicle's progress from your trip dashboard.

The driver may receive:

**Trip Started**

Trip CGK-2026-000125 is now officially active.

**13.15 GPS and Tracking Notifications**

GPS tracking should primarily provide live or last-known trip information through the trip interface.

The system should not unnecessarily generate notifications for every GPS position update.

Instead, notifications may be generated for meaningful tracking events such as:

- Tracking started.
- Tracking temporarily unavailable.
- Major milestone reached.
- Significant delay.
- Destination reached.
- Tracking completed.

For example:

**Tracking Update**

Your vehicle is currently being transported toward Nairobi.

The exact notification frequency should be configurable during implementation.

**13.16 GPS Failure Notification**

Temporary loss of GPS connectivity should not automatically mean that the trip has failed.

Where appropriate, the customer may receive:

**Tracking Temporarily Unavailable**

We are temporarily unable to receive the driver's latest GPS location. The last available location remains visible and tracking will resume when connectivity is restored.

This prevents unnecessary panic while maintaining transparency.

**13.17 Trip Milestone Notifications**

Important milestones may generate notifications.

Examples:

PICKUP COMPLETED

↓

TRIP START PENDING

↓

TRIP ACTIVE

↓

FUEL STOP

↓

ROUTE MILESTONE

↓

DESTINATION REACHED

↓

DELIVERY

↓

COMPLETED

The system should avoid sending excessive notifications for minor events.

The purpose of milestone notifications is to provide a clear journey record.

**13.18 Delivery Notification Flow**

When the driver reaches the destination:

Destination Reached

↓

Delivery Inspection

↓

Vehicle Handover

↓

Customer Confirmation

↓

Driver Confirmation

↓

COMPLETED

The customer should receive a delivery confirmation request.

Example:

**Delivery Confirmation Required**

The vehicle has reached the destination and the delivery procedure has been completed. Please review the delivery information and confirm receipt.

The driver should similarly receive confirmation that the delivery process has been recorded.

**13.19 Driver Payment Release Notifications**

Because driver payments are linked to trip milestones, payment-release notifications are important.

**First Release**

After TRIP ACTIVE:

**Driver Payment Released**

KSh 9,000 has been released for trip CGK-2026-000125 and added to your available wallet balance.

**Final Release**

After COMPLETED:

**Final Trip Payment Released**

KSh 9,000 has been released for trip CGK-2026-000125. Your driver earnings for this trip are now fully released.

The notification should be generated only after the backend successfully records the wallet transaction.

**13.20 Refund Notifications**

When a refund is approved or processed, the customer should be informed.

Example:

**Refund Initiated**

A refund of KSh 6,000 has been initiated for trip CGK-2026-000125.

After confirmation:

**Refund Completed**

Your refund of KSh 6,000 for trip CGK-2026-000125 has been successfully processed.

The system should distinguish between:

**Refund Pending**

and

**Refund Completed.**

**13.21 Cancellation Notifications**

When a trip is cancelled, relevant parties should be notified.

The notification should include:

- Trip reference.
- Cancellation status.
- Who initiated the cancellation where appropriate.
- Reason where appropriate.
- Financial consequences where applicable.

Example:

**Trip Cancelled**

Trip CGK-2026-000125 has been cancelled. Please review the trip record for the applicable cancellation and payment information.

The system should not expose sensitive administrative information unnecessarily.

**13.22 Dispute Notifications**

When a dispute is created:

Dispute Created

↓

Trip Status = DISPUTED

↓

Relevant Parties Notified

↓

Administrator Review

The customer may receive:

**Trip Under Review**

A dispute has been raised regarding trip CGK-2026-000125. CarGo Kenya will review the submitted information and supporting evidence.

The driver may receive an equivalent notification.

The administrator should receive an **Action Required** notification.

**13.23 Customer-Driver Communication**

CarGo Kenya shall provide a controlled method for the customer and driver to communicate about an active booking.

This is necessary because practical vehicle transportation requires coordination.

Communication may involve:

- Pickup directions.
- Arrival updates.
- Vehicle identification.
- Destination coordination.
- Delivery arrangements.
- Delays.
- Other trip-related communication.

The MVP should keep this communication connected to the relevant trip.

For example:

Trip

CGK-2026-000125

↓

Customer

↕

Driver

↓

Trip Communication

This is preferable to creating completely unrelated communication channels.

**13.24 Contact Information Visibility**

CarGo Kenya should balance platform leakage prevention with practical transportation requirements.

Before booking:

- Direct contact information should be limited.
- Communication should primarily occur through controlled platform mechanisms.

After booking:

- The customer's and driver's relevant contact information may be made available where necessary for actual pickup and delivery coordination.

This follows the previously established CarGo Kenya principle:

**The platform should not depend solely on hiding phone numbers to prevent leakage.**

The platform's primary value should remain:

- Verified drivers.
- Digital inspections.
- GPS tracking.
- Payment protection.
- Trip documentation.
- Delivery confirmation.
- Driver reputation.
- Support and dispute handling.

**13.25 Communication History**

Important communication should be associated with the relevant trip where appropriate.

A trip communication record may contain:

- Message ID.
- Trip ID.
- Sender ID.
- Recipient ID.
- Message content.
- Timestamp.
- Message status.
- Attachment reference where supported.
- Read status where applicable.

The system should avoid storing unnecessary private information.

**13.26 Message Status**

The MVP may use basic message statuses:

**SENT**

Message has been successfully submitted.

**DELIVERED**

Message has reached the intended recipient's application/device where technically supported.

**READ**

Recipient has opened the message.

**FAILED**

Message could not be delivered.

These statuses are useful for troubleshooting communication problems.

**13.27 Notification Read Status**

In-app notifications should support:

**UNREAD**

The user has not opened the notification.

**READ**

The user has viewed the notification.

Example:

Notifications

● Payment Successful

Trip CGK-2026-000125

● Driver Selected

Trip CGK-2026-000125

○ Trip Active

Trip CGK-2026-000125

The interface may display an unread count.

**13.28 Notification Preferences**

Users may eventually be allowed to configure notification preferences.

For example:

Customer:

- SMS notifications.
- Email notifications.
- In-app notifications.

Driver:

- SMS notifications.
- Email notifications.
- In-app notifications.

However, the MVP should distinguish between:

**Optional notifications**

and

**Critical system notifications.**

Users should not be able to disable critical notifications that are necessary for completing a trip or protecting their account.

**13.29 Critical Notifications**

The following notifications should generally be treated as important system notifications:

- Payment confirmation.
- Booking confirmation.
- Trip-start confirmation request.
- Trip-active confirmation.
- Delivery confirmation request.
- Cancellation.
- Dispute.
- Refund.
- Driver payment release.
- Account suspension/security events.

These should receive higher delivery priority.

**13.30 Notification Templates**

Notification messages should preferably be generated from reusable templates rather than being hard-coded throughout the application.

For example:

Template:

PAYMENT_SUCCESSFUL

Title:

Payment Successful

Message:

Your payment of {{amount}} for trip {{tripReference}}

has been successfully confirmed.

This makes it easier to:

- Maintain consistent wording.
- Change notification messages.
- Support additional languages later.
- Reduce duplicated code.
- Maintain notification consistency.

**13.31 Dynamic Notification Data**

Notifications may contain dynamic information such as:

- Customer name.
- Driver name.
- Trip reference.
- Amount.
- Pickup location.
- Destination.
- Trip status.
- Date/time.
- Relevant action.

For example:

Trip {{tripReference}} is now {{status}}.

The backend should provide the correct values when generating the notification.

**13.32 Notification Event Architecture**

Notifications should be triggered by system events rather than manually generated throughout unrelated parts of the application.

Conceptually:

SYSTEM EVENT

↓

EVENT HANDLER

↓

NOTIFICATION SERVICE

↓

Determine Recipient

↓

Determine Notification Type

↓

Determine Channel

↓

Create Notification

↓

Deliver

↓

Record Result

For example:

Payment Verified

↓

Notification Service

↓

Customer

↓

PAYMENT_SUCCESSFUL

↓

In-App / SMS

This architecture will make the system easier to maintain.

**13.33 Notification Service**

The backend should ideally contain a dedicated notification service responsible for:

- Creating notifications.
- Determining recipients.
- Selecting notification channels.
- Sending notifications.
- Recording delivery status.
- Handling failures.
- Preventing unnecessary duplicate notifications.
- Maintaining notification history.

The rest of the application should be able to trigger notifications through this service rather than directly implementing SMS or email logic in every module.

**13.34 Duplicate Notification Protection**

The system should prevent the same event from generating unnecessary duplicate notifications.

For example:

Payment Confirmed

↓

Notification Created

Payment Callback Repeated

↓

Payment Already Processed

↓

Do Not Create Duplicate Notification

This is especially important because payment providers and external services may retry callbacks.

Important notifications should therefore have identifiable event references.

**13.35 Failed Notification Handling**

If an SMS or email fails:

Notification Created

↓

Delivery Attempt

↓

FAILED

↓

Record Failure

↓

Retry Where Appropriate

A notification failure should not normally change the underlying trip status.

For example:

If payment is successfully confirmed but the SMS fails:

Payment Status = PAID

Trip Status = BOOKED

SMS Status = FAILED

The payment and booking must remain valid.

**13.36 Notification and Trip Status Integrity**

Notifications shall reflect the actual system state.

For example:

If:

Trip Status = TRIP ACTIVE

the customer should not receive a notification stating:

Trip is still awaiting pickup.

The notification service should therefore obtain important status information from the backend rather than relying on outdated frontend information.

**13.37 Communication Security**

The communication module shall protect user information.

The system should ensure that:

- Users can only access their own notifications.
- Customers can only access communication relating to their authorized trips.
- Drivers can only access communication relating to trips assigned to them.
- Administrators have controlled access according to their permissions.
- Authentication is required.
- Unauthorized users cannot retrieve private messages through API manipulation.
- Sensitive information is not unnecessarily included in notifications.

**13.38 Notification API Security**

Notification endpoints should verify authorization.

For example, the system should not allow:

GET /notifications/123

to return another user's notification merely because the notification ID is known.

The backend should verify:

Authenticated User

↓

Notification Ownership

↓

Authorized?

↓

YES → Return Notification

NO → Reject Request

The same principle applies to trip communication.

**13.39 Communication Attachments**

The MVP may support limited communication attachments where operationally necessary.

Examples could include:

- Vehicle photograph.
- Pickup location photograph.
- Delivery-related image.

However, the primary vehicle inspection photographs should remain within the **Vehicle Inspection Module**, rather than being stored only inside the communication system.

This distinction is important.

**Inspection Evidence**

Belongs to:

**Inspection Record**

**Casual Communication Image**

Belongs to:

**Trip Communication**

This prevents important evidence from becoming mixed with ordinary messages.

**13.40 Communication and Vehicle Inspection**

The communication module shall work together with the Vehicle Inspection Module.

For example:

Pickup Inspection Completed

↓

Trip Start Request

↓

Customer Notification

↓

Customer Confirmation

If a condition mismatch is recorded:

Vehicle Condition Mismatch

↓

Inspection Record Updated

↓

Customer Notified

↓

Driver Notified

↓

Administrative Review if Required

The communication system should communicate the event but should not become responsible for managing the inspection itself.

**13.41 Communication and Payment**

The communication module shall also work with the Payment and Wallet Module.

Examples:

Payment Verified

↓

Customer Notification

↓

Driver Notification

and:

50% Driver Release

↓

Driver Notification

and:

Refund Completed

↓

Customer Notification

The payment module remains responsible for financial processing.

The notification module is responsible for communicating the result.

**13.42 Communication and Delivery**

At delivery:

Destination Reached

↓

Delivery Procedure

↓

Customer Confirmation Required

↓

Customer Notification

↓

Customer Confirms

↓

Driver Confirms

↓

COMPLETED

↓

Final Payment Release

↓

Driver Notification

This ensures that communication follows the actual trip lifecycle.

**13.43 Communication and Clearing Agents**

Where a clearing agent creates or manages a transportation request on behalf of a customer, notifications should be sent to the appropriate authorized account or parties associated with the trip.

The MVP should avoid introducing a complex independent communication ecosystem for clearing agents.

Instead:

Authorized Account

↓

Transportation Request

↓

Trip

↓

Relevant Notifications

A dedicated clearing-agent communication system may be introduced later if actual operational usage demonstrates the need.

**13.44 Administrator Communication Tools**

Administrators should have basic communication capabilities for operational support.

For example, an administrator may need to:

- Contact a customer regarding a dispute.
- Contact a driver regarding a failed pickup.
- Request clarification.
- Notify parties about an administrative decision.

The MVP should keep this controlled and linked to the relevant trip or support case.

**13.45 System-Generated vs User-Generated Communication**

The system should distinguish between:

**System-Generated**

Automatically generated by system events.

Examples:

- Payment successful.
- Trip booked.
- Trip active.
- Driver payment released.

**User-Generated**

Created by a customer, driver, or administrator.

Examples:

- "I have arrived at the pickup location."
- "The vehicle is not at the stated location."
- "I will be delayed by 30 minutes."

This distinction is useful for auditing and system management.

**13.46 Communication Audit Trail**

Important communication events should be recorded where appropriate.

The system may record:

- Sender.
- Recipient.
- Trip.
- Message/event type.
- Timestamp.
- Delivery status.
- Relevant administrative action.

This creates an operational history that can be useful during disputes.

However, the system should avoid collecting unnecessary personal communication data beyond what is required to operate the platform.

**13.47 Notification Retention**

Notifications should remain available for an appropriate period so that users can review their trip history.

For example, customers should be able to revisit notifications relating to completed trips.

The exact retention period may be determined during implementation and operational policy development.

The system should distinguish between:

- Active notifications.
- Historical notifications.
- Deleted/archived notifications.

**13.48 Notification Failure Should Not Break the Trip**

A critical system rule is:

**Notification failure should not automatically cause a trip transaction to fail.**

For example:

Customer Confirms Trip Start

↓

Backend Validation

↓

TRIP ACTIVE

↓

Payment Release

↓

Notification Attempt

↓

SMS FAILED

The trip should remain:

**TRIP ACTIVE**

and the driver payment should remain correctly recorded.

The failed notification should instead be logged and retried where appropriate.

**13.49 Notification Logging**

The system should maintain logs that allow administrators/developers to determine:

- What notification was generated.
- Why it was generated.
- Who received it.
- Which channel was used.
- Whether delivery succeeded.
- Whether delivery failed.
- Whether a retry occurred.

This will be particularly useful during MVP testing.

**13.50 Notification Dashboard**

The administrator may have access to basic notification information such as:

- Total notifications.
- Successful notifications.
- Failed notifications.
- Pending notifications.
- SMS failures.
- Email failures.
- Important undelivered notifications.

Advanced notification analytics are not required for the MVP.

**13.51 Notification API Concept**

The exact API endpoints will be finalized during API design, but the system may conceptually provide operations such as:

GET /notifications

GET /notifications/:id

PATCH /notifications/:id/read

PATCH /notifications/read-all

For communication:

GET /trips/:tripId/messages

POST /trips/:tripId/messages

PATCH /messages/:id/read

These are conceptual examples.

The final API structure should be defined consistently with the overall backend architecture.

**13.52 Backend Notification Rules**

The backend should determine:

- Who receives the notification.
- Why the notification was generated.
- What information may be shown.
- Which channel should be used.
- Whether the notification is critical.
- Whether a duplicate notification already exists.

The frontend should primarily display the information provided by the backend.

**13.53 Notification Timing**

Notifications should generally be generated immediately after the underlying event has been successfully recorded.

For example:

Payment Verified

↓

Payment Record Updated

↓

Trip Updated

↓

Notification Created

The system should avoid generating a notification before the underlying transaction has successfully occurred.

This prevents situations such as:

"Payment successful"

being shown when the payment later fails.

**13.54 Notification and Transactional Consistency**

For critical events, the system should ensure that the underlying event and notification generation are handled safely.

For example, when a driver payment is released:

Validate Release

↓

Create Wallet Transaction

↓

Update Driver Balance

↓

Record Release

↓

Generate Payment Notification

If the financial transaction fails, the system must not tell the driver that money was successfully released.

The notification should reflect the final confirmed state.

**13.55 MVP Notification Scope**

**Included in MVP**

The Notification and Communication Module shall include:

- In-app notifications.
- Important customer notifications.
- Important driver notifications.
- Basic administrator alerts.
- Payment notifications.
- Booking notifications.
- Pickup notifications.
- Trip-start confirmation notifications.
- Trip-active notifications.
- Delivery notifications.
- Driver payment-release notifications.
- Cancellation notifications.
- Dispute notifications.
- Refund notifications.
- Notification read/unread status.
- Notification history.
- Basic customer-driver communication after booking.
- Contact information visibility after booking.
- Notification delivery status.
- Basic SMS integration where practical.
- Basic email notifications where applicable.
- Notification audit records.
- Duplicate notification protection.
- Notification security.

**Not Required for MVP**

The following should remain future features:

- AI-powered communication.
- Automated customer service chatbot.
- Advanced conversational AI.
- Multi-language automated communication.
- WhatsApp automation.
- Voice calling through the platform.
- Video calling.
- Advanced marketing automation.
- Complex notification analytics.
- Personalized AI-generated messages.
- Automated dispute negotiation.
- Advanced communication sentiment analysis.

These can be introduced after the core marketplace has been validated.

**13.56 Complete Communication Lifecycle**

The overall notification lifecycle shall operate alongside the CarGo Kenya trip lifecycle:

CUSTOMER REQUEST

↓

Request Notification

↓

QUOTING

↓

Quotation Notification

↓

DRIVER SELECTED

↓

Driver Selection Notification

↓

PAYMENT PENDING

↓

Payment Instructions

↓

PAYMENT VERIFIED

↓

Payment Confirmation

↓

BOOKED

↓

Booking Confirmation

↓

PICKUP PENDING

↓

Pickup Notification

↓

PICKUP INSPECTION

↓

Inspection Updates

↓

TRIP START PENDING

↓

Trip-Start Confirmation Request

↓

TRIP ACTIVE

↓

Trip Active Notification

↓

IN TRANSIT

↓

Milestone / Tracking Notifications

↓

DELIVERY PENDING

↓

Delivery Notification

↓

DELIVERED

↓

Delivery Confirmation

↓

COMPLETED

↓

Completion Notification

↓

Final Driver Payment Release

↓

Driver Earnings Notification

↓

Rating Notification

**13.57 Notification Module Business Rules**

The following rules shall be treated as core MVP requirements.

**Rule 1**  
Important system events shall generate appropriate notifications.

**Rule 2**  
Notifications shall be sent only to authorized recipients.

**Rule 3**  
Payment notifications shall be based on verified payment events.

**Rule 4**  
Trip-start confirmation shall be communicated to the customer after the driver selects START TRIP.

**Rule 5**  
The trip shall not become TRIP ACTIVE merely because a notification was sent.

**Rule 6**  
Notification failure shall not automatically invalidate a successful underlying transaction.

**Rule 7**  
Driver payment-release notifications shall only be generated after the corresponding wallet transaction has been successfully recorded.

**Rule 8**  
Customers and drivers shall have access to relevant communication after booking where necessary for practical trip coordination.

**Rule 9**  
Before booking, communication should primarily use controlled platform mechanisms.

**Rule 10**  
The platform should not rely solely on hiding contact information to prevent platform leakage.

**Rule 11**  
Notifications should be associated with the relevant trip where applicable.

**Rule 12**  
Duplicate notifications for the same event should be prevented where practical.

**Rule 13**  
Users should only access their own notifications and authorized trip communication.

**Rule 14**  
Important communication events should be traceable through appropriate records.

**Rule 15**  
Inspection evidence should remain associated with inspection records rather than being treated as ordinary chat content.

**13.58 Final Notification Architecture**

The CarGo Kenya Notification and Communication Module can therefore be understood as:

SYSTEM EVENT

│

↓

NOTIFICATION SERVICE

│

┌──────────────┼──────────────┐

↓ ↓ ↓

CUSTOMER DRIVER ADMIN

│ │ │

└──────────────┼──────────────┘

↓

┌────────────────────┐

│ COMMUNICATION │

│ CHANNELS │

├────────────────────┤

│ In-App │

│ SMS │

│ Email │

│ Trip Communication │

└────────────────────┘

│

↓

DELIVERY RECORD

│

┌──────────┴──────────┐

↓ ↓

DELIVERED FAILED

│ │

↓ ↓

Read / History Retry / Log

The module therefore acts as the **communication layer connecting the different CarGo Kenya system modules**.

**14.0 DISPUTE, CANCELLATION AND RESOLUTION MODULE**

**14.1 Purpose**

The Dispute, Cancellation and Resolution Module shall manage situations where a CarGo Kenya transportation assignment cannot proceed normally or where a customer, driver, or administrator raises a formal issue requiring review.

The module shall ensure that:

- Customers can cancel trips according to the applicable cancellation rules.
- Drivers can report operational problems that prevent normal trip progression.
- Customers can report problems with pickup, vehicle condition, delivery, or transportation.
- Payment-related disputes can be formally recorded.
- Vehicle-condition disputes can be linked to inspection evidence.
- Delivery disputes can be linked to delivery records and confirmations.
- Administrators can review disputed trips.
- Relevant evidence can be attached to a dispute.
- Disputed trips can be placed into the DISPUTED status where appropriate.
- Financial amounts affected by a dispute can remain protected until resolution.
- Approved refunds can be processed through the Payment and Wallet Module.
- Approved adjustments can be recorded without destroying the original financial records.
- Every important dispute and administrative action is traceable.

The module shall therefore provide the formal resolution mechanism for exceptional situations within the CarGo Kenya transportation lifecycle.

**14.2 Dispute and Cancellation Philosophy**

The CarGo Kenya system shall follow the principle:

**Normal trip operations should proceed automatically where possible, while exceptional situations should be formally recorded, evidenced, reviewed, and resolved.**

The system should therefore avoid informal resolution processes such as:

Customer  
↓  
Calls driver  
↓  
Driver agrees privately  
↓  
No system record

Instead, important issues should follow a controlled process:

PROBLEM OCCURS

↓

ISSUE REPORTED

↓

DISPUTE / CANCELLATION RECORD

↓

EVIDENCE COLLECTED

↓

ADMINISTRATIVE REVIEW

↓

DECISION

↓

FINANCIAL / TRIP ACTION

↓

CASE RESOLVED

This ensures that CarGo Kenya maintains a reliable operational history.

**14.3 Types of Cases**

The MVP shall support the major categories of exceptional cases required for transportation operations.

These shall include:

1.  Customer cancellation
2.  Driver cancellation
3.  Failed pickup
4.  Vehicle condition dispute
5.  Pickup dispute
6.  Trip-start dispute
7.  Destination-change dispute
8.  Delivery dispute
9.  Payment dispute
10. Refund request
11. Driver conduct complaint
12. Customer conduct complaint
13. GPS/tracking-related issue
14. Other operational dispute

The exact categories may be expanded later without changing the basic dispute architecture.

**14.4 Cancellation vs Dispute**

The system shall distinguish between a **cancellation** and a **dispute**.

**Cancellation**

A cancellation occurs when a transportation assignment is intentionally stopped before normal completion.

Example:

BOOKED

↓

Customer Cancels

↓

CANCELLATION REVIEW

↓

Financial Rules Applied

↓

CANCELLED

**Dispute**

A dispute occurs when there is disagreement, alleged failure, damage, financial disagreement, or another issue requiring investigation.

Example:

DELIVERED

↓

Customer Reports Problem

↓

DISPUTE

↓

ADMINISTRATIVE REVIEW

A cancellation may therefore happen without a dispute, while a dispute may occur during or after a trip.

**14.5 Cancellation Initiators**

The system shall identify who initiated a cancellation.

Possible initiators include:

- Customer
- Driver
- Administrator
- System

The cancellation record should preserve the initiator.

Example:

Cancellation ID: CAN-2026-000042

Trip:

CGK-2026-000125

Initiated By:

CUSTOMER

Reason:

Change of plans

Date:

10 August 2026

This information shall be used when determining the applicable financial and operational consequences.

**14.6 Customer Cancellation**

A customer may request cancellation of a trip where permitted by the applicable cancellation rules.

The general process shall be:

Customer Opens Trip

↓

Selects CANCEL TRIP

↓

System Checks Cancellation Eligibility

↓

Customer Selects Reason

↓

Cancellation Request Recorded

↓

Financial Consequences Determined

↓

Trip CANCELLED

The system shall not allow cancellation to bypass required financial controls.

**14.7 Driver Cancellation**

A driver may need to cancel or withdraw from an assignment because of legitimate operational circumstances.

Examples include:

- Vehicle problem.
- Emergency.
- Inability to reach pickup.
- Unexpected operational issue.
- Safety concern.
- Other approved reason.

The system should require the driver to provide a cancellation reason.

Example:

Driver Cancellation

Reason:

Unable to reach pickup location

Additional Details:

Vehicle developed mechanical issue.

The cancellation should then be recorded for administrative review where necessary.

**14.8 Cancellation Eligibility**

Before allowing cancellation, the backend should determine whether cancellation is permitted at the current trip stage.

For example:

Trip Status

↓

Check Cancellation Rules

↓

Allowed?

↙ ↘

YES NO

↓ ↓

Continue Reject

The frontend should not independently determine whether cancellation is allowed.

The backend shall evaluate:

- Current trip status.
- Cancellation initiator.
- Time of cancellation.
- Whether pickup has occurred.
- Whether inspection has started.
- Whether TRIP ACTIVE has been reached.
- Whether payment releases have occurred.
- Whether delivery has occurred.
- Applicable cancellation rules.

**14.9 Cancellation Reasons**

The MVP should provide predefined cancellation reasons while allowing additional explanation.

Example customer reasons:

- Change of plans.
- Incorrect trip details.
- Driver delay.
- Driver unavailable.
- Other.

Example driver reasons:

- Vehicle problem.
- Emergency.
- Pickup unavailable.
- Customer unavailable.
- Unsafe conditions.
- Other.

The system should store both:

**Reason Code**

and

**Additional Explanation**

where applicable.

**14.10 Cancellation Record**

Each cancellation shall have its own record.

A cancellation record may contain:

| **Field** | **Description** |
| --- | --- |
| Cancellation ID | Unique cancellation identifier |
| Trip ID | Related trip |
| Initiated By | Customer, driver, admin, system |
| Reason Code | Selected cancellation reason |
| Description | Additional explanation |
| Trip Status Before | Status before cancellation |
| Financial Status | Financial state |
| Refund Amount | Approved refund where applicable |
| Cancellation Status | Pending, approved, rejected, completed |
| Created At | Date/time |
| Resolved At | Resolution timestamp |
| Resolved By | Administrator where applicable |

**14.11 Cancellation Status**

The MVP may use:

**REQUESTED**

Cancellation has been requested but not yet processed.

**UNDER REVIEW**

Administrative review is required.

**APPROVED**

Cancellation has been approved.

**REJECTED**

Cancellation request has been rejected.

**COMPLETED**

Cancellation has been successfully applied to the trip and relevant financial actions completed.

These statuses are separate from the official Trip Status.

**14.12 Trip Status After Cancellation**

Where a cancellation has been successfully processed, the trip shall move to:

**CANCELLED**

The system should not simply delete the trip.

The complete history must remain available.

For example:

REQUESTED

↓

QUOTING

↓

DRIVER SELECTED

↓

PAYMENT PENDING

↓

BOOKED

↓

Customer Cancellation

↓

CANCELLED

The original trip information should remain accessible for audit and reporting.

**14.13 Cancellation Before Payment**

If a customer cancels before payment has been completed:

PAYMENT PENDING

↓

Cancellation

↓

CANCELLED

Since the full customer payment has not been successfully received, there may be no customer refund transaction.

However, the cancellation should still be recorded.

**14.14 Cancellation After Payment but Before TRIP ACTIVE**

This is an important financial scenario.

Example:

BOOKED

↓

Customer Cancels

↓

TRIP ACTIVE = NO

The driver has not reached the condition required for the first 50% release.

Therefore, the system shall determine the financial outcome according to the applicable cancellation rules.

The system should consider:

- Who cancelled.
- Reason.
- Timing.
- Whether pickup occurred.
- Whether inspection occurred.
- Whether any approved costs exist.
- Applicable cancellation policy.

The system shall not automatically release the driver's 50% merely because payment was received.

**14.15 Cancellation After TRIP ACTIVE**

If cancellation occurs after the trip has officially become TRIP ACTIVE, the financial situation is different.

At this stage:

TRIP ACTIVE

↓

50% Driver Fee Eligible/Released

Therefore, cancellation processing must consider already-released funds.

Example:

Driver Fee = KSh 18,000

First Release:

KSh 9,000

Trip Later Cancelled

The remaining KSh 9,000 shall remain subject to the applicable cancellation/dispute resolution process.

The system shall not automatically release the remaining 50% simply because the trip reached TRIP ACTIVE.

**14.16 Cancellation After Delivery**

Once the trip has reached DELIVERED, normal cancellation should generally no longer be available.

Instead, any subsequent problem should normally be handled through:

**DISPUTE**

This preserves the meaning of the trip lifecycle.

For example:

DELIVERED

↓

Customer Reports Damage

↓

DISPUTE

rather than:

DELIVERED

↓

CANCELLED

**14.17 Failed Pickup**

A failed pickup occurs when the vehicle transportation assignment cannot properly begin.

Examples:

- Driver cannot locate vehicle.
- Customer is unavailable.
- Vehicle is unavailable.
- Pickup location is inaccessible.
- Required documents are missing.
- Vehicle condition prevents transportation.
- Driver fails to appear.
- Other operational failure.

The system shall record the failed pickup rather than simply changing the trip status without explanation.

**14.18 Failed Pickup Process**

The process may be:

PICKUP PENDING

↓

Driver Arrives

↓

Pickup Problem

↓

FAILED PICKUP REPORTED

↓

Evidence Recorded

↓

Customer / Driver Notified

↓

Administrative Review Where Required

↓

Resolution

Possible outcomes include:

- Pickup rescheduled.
- Driver replaced.
- Trip cancelled.
- Customer instructed to correct an issue.
- Dispute opened.
- Financial adjustment.

**14.19 Vehicle Condition Dispute**

Vehicle condition disputes are especially important because CarGo Kenya uses digital vehicle inspection evidence.

A dispute may arise when:

- Customer claims damage existed before pickup.
- Driver claims damage occurred after pickup.
- Customer disputes delivery condition.
- Odometer information is disputed.
- Fuel level is disputed.
- Inspection information is incomplete.

The dispute should reference the relevant inspection records.

**14.20 Inspection Evidence in Disputes**

The dispute system should be able to reference:

- Pickup inspection.
- Delivery inspection.
- Photographs.
- Odometer reading.
- Fuel level.
- Damage records.
- Driver confirmation.
- Customer confirmation.
- Inspection timestamp.
- Location information where available.

The dispute module should **not duplicate inspection evidence unnecessarily**.

Instead:

DISPUTE

↓

Inspection Reference

↓

Pickup / Delivery Inspection

↓

Evidence

This maintains one authoritative inspection record.

**14.21 Damage Dispute**

If a customer reports new damage after delivery, the system may create a dispute.

Example:

Vehicle Delivered

↓

Customer Reports Damage

↓

Create DISPUTE

↓

Compare:

Pickup Inspection

+

Delivery Inspection

↓

Administrative Review

The administrator can then review the available evidence.

The system should not automatically assume that either party is responsible.

**14.22 Delivery Dispute**

A delivery dispute may occur when:

- Customer claims vehicle was not delivered.
- Customer disputes delivery condition.
- Driver claims customer refused handover.
- Required delivery confirmation was not completed.
- Destination differs from agreed destination.
- Delivery documentation is incomplete.

The dispute shall be associated with the relevant trip and delivery records.

**14.23 Payment Dispute**

A payment dispute may involve:

- Customer claiming payment was not correctly processed.
- Duplicate payment.
- Incorrect amount.
- Refund disagreement.
- Driver earnings disagreement.
- Withdrawal issue.
- Platform fee disagreement.

Payment disputes shall reference the relevant financial records.

The system should not modify financial records simply because a dispute has been created.

**14.24 Dispute Creation**

A dispute may be created by:

- Customer.
- Driver.
- Administrator.

The dispute record should contain:

| **Field** | **Description** |
| --- | --- |
| Dispute ID | Unique dispute |
| Trip ID | Related trip |
| Raised By | Customer, driver, administrator |
| Category | Type of dispute |
| Description | Issue description |
| Priority | Low, normal, high |
| Status | Current dispute state |
| Evidence References | Related records |
| Financial Impact | Amount potentially affected |
| Created At | Date/time |
| Resolved At | Resolution time |
| Resolved By | Administrator |

**14.25 Dispute Statuses**

The MVP may use:

**OPEN**

A dispute has been created.

**UNDER REVIEW**

An administrator is actively investigating it.

**AWAITING INFORMATION**

Additional information is required.

**RESOLUTION PROPOSED**

An administrative resolution has been determined but has not yet been finalized where confirmation is required.

**RESOLVED**

The dispute has been resolved.

**CLOSED**

All associated actions have been completed.

**REJECTED**

The dispute was determined not to have sufficient grounds.

The exact status workflow can be simplified during implementation if necessary.

**14.26 Dispute Priority**

The MVP should support basic priority levels.

**LOW**

Minor issue requiring normal review.

**NORMAL**

Standard operational dispute.

**HIGH**

Issue that may affect:

- Vehicle safety.
- Significant financial amounts.
- Trip continuation.
- Customer or driver protection.

Priority should help administrators determine which cases require faster attention.

**14.27 Evidence Collection**

Disputes should support evidence references.

Possible evidence includes:

- Inspection photographs.
- Delivery photographs.
- Payment transactions.
- Trip records.
- GPS records.
- Communication records.
- Uploaded documents.
- Customer statements.
- Driver statements.
- Administrator notes.

The system should identify the source of each piece of evidence.

**14.28 Evidence Integrity**

Important evidence should not be silently replaced or deleted during dispute handling.

For example:

Pickup Photo

↓

Inspection Record

↓

Dispute Reference

The dispute should reference the original record.

If an administrator adds a new document, it should be stored as additional evidence rather than overwriting the original.

**14.29 Customer Dispute Process**

A customer may report a problem through the trip interface.

Example:

My Trips

↓

Select Trip

↓

Report an Issue

↓

Select Category

↓

Describe Problem

↓

Attach Evidence Where Applicable

↓

Submit

↓

DISPUTE Created

The customer should receive confirmation that the issue has been recorded.

**14.30 Driver Dispute Process**

Drivers should have a similar process.

Driver Trips

↓

Select Trip

↓

Report an Issue

↓

Select Category

↓

Provide Details

↓

Attach Evidence

↓

Submit

↓

DISPUTE Created

The driver should not be required to resolve serious disputes privately with the customer.

**14.31 Administrator Review**

The administrator shall be able to review dispute cases.

The review interface should provide access to:

- Trip details.
- Customer information.
- Driver information.
- Trip timeline.
- Inspection records.
- Payment records.
- GPS/tracking information where available.
- Communication history.
- Submitted evidence.
- Previous administrative actions.
- Cancellation records.

This allows the administrator to make a decision using the complete trip context.

**14.32 Dispute Timeline**

Each dispute should maintain a timeline.

Example:

10 Aug 2026 10:30

Customer reported vehicle damage.

10 Aug 2026 10:32

Dispute created.

10 Aug 2026 11:00

Driver submitted response.

10 Aug 2026 11:20

Pickup inspection reviewed.

10 Aug 2026 12:00

Delivery inspection reviewed.

10 Aug 2026 13:30

Administrator recorded resolution.

10 Aug 2026 13:35

Refund initiated.

This timeline is important for auditability.

**14.33 Administrator Decision**

After reviewing the case, an administrator may determine an appropriate outcome.

Possible outcomes include:

- No action required.
- Trip continues.
- Trip cancelled.
- Driver replaced.
- Customer refund.
- Partial refund.
- Payment adjustment.
- Driver payment released.
- Driver payment withheld.
- Additional evidence required.
- Case escalated.

The system should require the administrator to provide a reason for important decisions.

**14.34 Financial Resolution**

The Dispute Module shall **not directly manipulate wallet balances**.

Instead:

Dispute Decision

↓

Financial Resolution

↓

Payment & Wallet Module

↓

Refund / Adjustment / Release

↓

Financial Record

This maintains a clear separation between:

**Dispute Management**

and

**Financial Processing**

**14.35 Refund Through Dispute Resolution**

If a dispute results in an approved refund:

Dispute

↓

Administrator Decision

↓

Refund Approved

↓

Payment & Wallet Module

↓

Refund Transaction

↓

Customer Notified

The original customer payment shall remain in the financial history.

The refund should be recorded separately.

**14.36 Driver Payment Protection**

When a dispute affects a driver's remaining earnings, the system should prevent automatic release of disputed funds where applicable.

For example:

TRIP ACTIVE

↓

50% Released

↓

Delivery Problem

↓

DISPUTE

↓

Remaining 50% Protected

↓

Review

The dispute therefore acts as a control mechanism over unresolved financial obligations.

**14.37 Already Released Driver Funds**

If 50% has already been released before a dispute is raised, the system should not silently remove that money from the Driver Personal Wallet.

Any financial recovery, adjustment, or settlement should be explicitly recorded through the Payment and Wallet Module.

For example:

Driver Received:

KSh 9,000

Dispute Raised

↓

Review

↓

Approved Adjustment

↓

Financial Transaction

This preserves the audit trail.

**14.38 Dispute and Trip Status**

Where a dispute materially affects the trip, the official trip status may become:

**DISPUTED**

The system should preserve the previous status in the trip history.

Example:

IN TRANSIT

↓

Major Issue Reported

↓

DISPUTED

After resolution, the system should determine the appropriate next state.

For example:

DISPUTED

↓

Resolved

↓

IN TRANSIT

or:

DISPUTED

↓

Resolved

↓

COMPLETED

or:

DISPUTED

↓

Resolved

↓

CANCELLED

The system should not blindly return every dispute to the same status.

**14.39 Dispute During Pickup**

If a dispute occurs during pickup:

PICKUP INSPECTION

↓

Problem Detected

↓

DISPUTE

The system may prevent the trip from progressing to:

TRIP START PENDING

until the issue is resolved where the issue materially affects transportation.

**14.40 Dispute During Trip**

If a serious issue occurs after TRIP ACTIVE:

TRIP ACTIVE

↓

Problem Reported

↓

DISPUTE

The system should record the issue while preserving the trip's operational history.

Depending on the resolution:

- Trip may continue.
- Trip may be paused operationally.
- Driver may be replaced where feasible.
- Trip may be cancelled.
- Financial settlement may be required.

**14.41 Dispute After Delivery**

A dispute may still be raised after DELIVERED or COMPLETED within the applicable dispute period.

Example:

COMPLETED

↓

Customer Reports Issue

↓

DISPUTE

↓

Administrative Review

This means that completion of a trip does not necessarily prevent legitimate post-trip dispute handling.

However, the applicable dispute period should be defined by CarGo Kenya's operational policy.

**14.42 Dispute Time Limit**

The system should support a configurable dispute window.

For example:

Trip Completed

↓

Dispute Window

↓

Dispute Allowed

After the configured period expires:

Dispute Window Expired

↓

Normal Dispute Submission Disabled

The administrator may still have controlled authority to open a case manually where exceptional circumstances justify it.

The exact number of days should be configured as a business rule rather than hard-coded.

**14.43 Cancellation and Refund Rules**

The cancellation system shall not hard-code financial assumptions throughout the application.

Instead, cancellation rules should ideally be represented as configurable policies.

A policy may consider:

- Trip status.
- Cancellation initiator.
- Time before pickup.
- Time after pickup.
- Whether TRIP ACTIVE occurred.
- Whether driver payment was released.
- Other approved conditions.

This allows CarGo Kenya to change its commercial policies without rewriting the entire payment system.

**14.44 Cancellation Policy Example**

A conceptual policy might operate as:

Cancellation Request

↓

Identify Trip Status

↓

Identify Initiator

↓

Check Policy

↓

Determine Financial Outcome

↓

Create Settlement

The exact percentages or fees should be defined separately by the business.

They should not be invented inside the software architecture.

**14.45 No Silent Financial Changes**

A critical rule is:

**A dispute or cancellation must never silently change financial records.**

For example, the system must not simply change:

Driver Earnings:

KSh 18,000

to:

Driver Earnings:

KSh 12,000

without creating a corresponding financial transaction explaining the change.

Every adjustment must have:

- Amount.
- Reason.
- Related trip.
- Related dispute/cancellation.
- Actor.
- Date/time.
- Transaction reference.

**14.46 Cancellation Settlement**

When a cancellation has financial consequences, the system should create a settlement record.

Example:

Cancellation

↓

Settlement Calculation

↓

Customer Refund

+

Driver Compensation

+

CarGo Fee Adjustment

↓

Payment Module

The exact components depend on the approved business policy.

**14.47 Dispute Resolution Record**

A dispute resolution record should contain:

| **Field** | **Description** |
| --- | --- |
| Resolution ID | Unique resolution |
| Dispute ID | Related dispute |
| Decision | Outcome |
| Explanation | Reason for decision |
| Financial Action | Refund/adjustment/etc. |
| Amount | Financial amount where applicable |
| Administrator ID | Decision maker |
| Created At | Date/time |
| Supporting Evidence | Relevant evidence |
| Status | Resolution state |

**14.48 Administrator Authorization**

Not every administrator should necessarily have permission to perform every resolution action.

The system should support role-based permissions.

For example:

**Support Administrator**

May:

- View disputes.
- Request information.
- Communicate with users.

**Operations Administrator**

May:

- Resolve operational issues.
- Cancel trips.
- Approve operational adjustments.

**Financial Administrator**

May:

- Approve financial adjustments.
- Process refunds.
- Review payment disputes.

The exact administrator roles may be finalized during authorization design.

**14.49 Administrative Notes**

Administrators should be able to add internal notes to a dispute.

Example:

Internal Note

Reviewed pickup and delivery photographs.

No visible damage was recorded during pickup.

Customer's submitted photograph requires further review.

Internal notes should not automatically become visible to customers or drivers.

The system must distinguish between:

**Internal Administrative Notes**

and

**User-Facing Messages**

**14.50 Customer and Driver Responses**

Where additional information is required, the administrator may request a response.

Example:

Administrator

↓

Information Request

↓

Customer

↓

Response

↓

Dispute Record Updated

The same process may be used with drivers.

**14.51 Dispute Communication**

The Notification and Communication Module shall handle notifications associated with disputes.

For example:

Dispute Created

↓

Notification Service

↓

Customer

Driver

Administrator

The Dispute Module remains responsible for the case itself.

This preserves module separation.

**14.52 Dispute Notifications**

Important dispute notifications may include:

**Customer**

- Dispute received.
- Additional information requested.
- Dispute under review.
- Dispute resolved.
- Refund initiated.
- Refund completed.

**Driver**

- Dispute raised.
- Response required.
- Additional information requested.
- Dispute resolved.
- Financial action recorded.

**Administrator**

- New dispute.
- High-priority dispute.
- Payment dispute.
- Vehicle-condition dispute.
- Unresolved case requiring action.

**14.53 Dispute Security**

Dispute information may contain sensitive operational and financial information.

The system shall therefore ensure that:

- Customers only see their authorized disputes.
- Drivers only see disputes involving their trips.
- Administrators see disputes according to their permissions.
- Evidence is protected.
- Internal notes are not exposed to unauthorized users.
- Financial information is appropriately restricted.
- API requests are authorized server-side.

**14.54 Dispute API Authorization**

The backend must not rely solely on knowing a dispute ID.

For example:

GET /disputes/DSP-123

must verify:

Authenticated User

↓

Dispute Ownership / Authorization

↓

Authorized?

↙ ↘

YES NO

↓ ↓

Return Reject

This prevents unauthorized access to dispute information.

**14.55 Evidence Upload Security**

Where users can upload evidence, the system should apply appropriate controls.

These may include:

- Authentication.
- Authorization.
- File-type validation.
- File-size limits.
- Secure storage.
- Unique file identifiers.
- Malware/security scanning where practical.
- Access-controlled retrieval.

Evidence should not become publicly accessible simply because a file URL is known.

**14.56 Dispute Audit Trail**

Every important dispute action shall be auditable.

The audit trail may include:

- Dispute creation.
- Status change.
- Evidence upload.
- Administrator assignment.
- Information request.
- Response.
- Financial decision.
- Refund approval.
- Adjustment.
- Resolution.
- Closure.

Example:

DISPUTE CREATED

↓

ASSIGNED

↓

UNDER REVIEW

↓

EVIDENCE ADDED

↓

DECISION RECORDED

↓

FINANCIAL ACTION

↓

RESOLVED

↓

CLOSED

**14.57 Dispute Assignment**

The system may assign disputes to specific administrators.

Example:

New Dispute

↓

Administrator Queue

↓

Assigned To:

Operations Admin

↓

UNDER REVIEW

Assignment should prevent multiple administrators from unknowingly working on the same case without coordination.

**14.58 Dispute Escalation**

Some disputes may require escalation.

Examples:

- High financial value.
- Repeated driver complaints.
- Serious vehicle condition issue.
- Repeated customer complaints.
- Fraud suspicion.
- Safety-related concern.

The process may be:

Dispute

↓

Normal Review

↓

Requires Escalation?

↓

YES

↓

Senior Administrator

The exact escalation levels can be expanded later.

**14.59 Fraud and Suspicious Activity**

The MVP does not require a sophisticated automated fraud-detection system.

However, administrators should be able to flag suspicious cases.

Examples:

- Repeated cancellation patterns.
- Duplicate payment claims.
- Suspicious refund requests.
- Repeated vehicle-condition disputes.
- Unusual wallet activity.

The system should record the flag without automatically accusing the user of fraud.

**14.60 Dispute Resolution and Payment Release**

The Dispute Module must respect the Payment and Wallet Module's release rules.

For example:

TRIP ACTIVE

↓

50% Driver Release

↓

DISPUTE

↓

Remaining 50%

↓

PROTECTED

The dispute system cannot simply command:

Release Full Driver Payment

without satisfying the payment module's financial rules.

**14.61 Dispute Resolution and Vehicle Inspection**

The Dispute Module shall rely on the Vehicle Inspection Module for vehicle-condition evidence.

For example:

Customer Claims Damage

↓

Dispute Created

↓

Inspection Records Retrieved

↓

Pickup Evidence

+

Delivery Evidence

↓

Administrator Review

The dispute module should not create a second competing inspection record.

**14.62 Dispute Resolution and GPS**

Where a dispute involves location or route information, the administrator may review available tracking information.

Examples:

- Driver claims they reached pickup.
- Customer claims driver never arrived.
- Driver claims destination was reached.
- Customer claims delivery occurred at a different location.

The GPS module remains responsible for tracking data.

The dispute module references that evidence.

**14.63 Dispute Resolution and Communication**

The communication module shall preserve relevant communication that may help resolve the case.

For example:

Customer:

"Driver has not arrived."

Driver:

"I am at the pickup location."

↓

Dispute

↓

Communication History Reviewed

Communication evidence should be accessed according to the relevant privacy and authorization rules.

**14.64 Case Closure**

A dispute should only be marked CLOSED when all required actions have been completed.

For example:

RESOLVED

↓

Refund Completed

↓

Notifications Sent

↓

Audit Records Created

↓

CLOSED

A dispute should not be closed merely because an administrator entered a decision while required financial actions remain pending.

**14.65 Resolution Confirmation**

Where necessary, the system may allow the affected party to acknowledge the resolution.

For example:

Resolution Issued

↓

Customer Notified

↓

Customer Acknowledges

↓

Case Closed

However, user acknowledgement should not prevent CarGo Kenya from closing a case where the applicable administrative process has been completed.

**14.66 Dispute Dashboard**

The administrator should have a dispute dashboard showing:

- Open disputes.
- Under-review disputes.
- High-priority disputes.
- Payment disputes.
- Vehicle-condition disputes.
- Delivery disputes.
- Cancellation cases.
- Awaiting-information cases.
- Resolved cases.
- Closed cases.

The dashboard should allow filtering by:

- Date.
- Status.
- Category.
- Priority.
- Customer.
- Driver.
- Trip reference.

**14.67 Customer Dispute History**

Customers should be able to view disputes associated with their own trips.

Example:

My Disputes

DSP-2026-000012

Trip: CGK-2026-000125

Category: Vehicle Condition

Status: Under Review

Created: 10 August 2026

Customers should not see internal administrative notes or unauthorized evidence.

**14.68 Driver Dispute History**

Drivers should similarly be able to view disputes relating to their trips.

They may see:

- Dispute reference.
- Trip reference.
- Category.
- Status.
- Information requests.
- Their submitted responses.
- Resolution outcome where appropriate.

**14.69 Dispute Retention**

Dispute records should remain available after resolution for an appropriate operational and audit period.

The system should preserve:

- Original complaint.
- Evidence.
- Responses.
- Administrative actions.
- Resolution.
- Financial actions.

The exact retention period should be determined by CarGo Kenya's operational and legal requirements.

**14.70 Dispute and Notification Failure**

Notification failure must not invalidate dispute creation.

For example:

Customer Submits Dispute

↓

Dispute Successfully Created

↓

SMS Attempt

↓

SMS FAILED

The dispute remains:

**OPEN**

The communication failure is logged separately.

**14.71 Dispute Idempotency**

The system should prevent accidental duplicate disputes caused by repeated requests.

For example:

Submit Dispute

↓

Dispute Created

↓

Repeated Request

↓

Existing Submission Detected

↓

Do Not Create Duplicate Case

Where appropriate, the system should use a unique request/reference or idempotency mechanism.

**14.72 Cancellation Idempotency**

Cancellation requests should also be protected against duplicate processing.

For example:

Cancel Request 1

↓

Cancellation Processed

Cancel Request 2

↓

Trip Already Cancelled

↓

Do Not Process Again

This is especially important where cancellation triggers refunds or other financial actions.

**14.73 Financial Consistency**

A cancellation or dispute must not cause financial inconsistencies.

For example:

Customer Paid

KSh 24,900

Driver Fee

KSh 18,000

Fuel

KSh 6,000

CarGo Fee

KSh 900

If a refund of KSh 6,000 is approved, the system should record:

Original Payment

\+ KSh 24,900

Refund

\- KSh 6,000

rather than modifying or deleting the original payment.

**14.74 Resolution and Trip History**

The trip history should preserve all major state changes.

Example:

BOOKED

10 Aug 10:00

PICKUP INSPECTION

10 Aug 11:30

TRIP ACTIVE

10 Aug 12:00

DISPUTED

10 Aug 16:00

RESOLVED

10 Aug 18:30

COMPLETED

11 Aug 09:00

This gives administrators and developers a complete operational history.

**14.75 Developer Principle: Separate Case Management from Financial Processing**

The developer should maintain clear module boundaries.

**Dispute Module**

Responsible for:

- Creating disputes.
- Managing case status.
- Collecting evidence references.
- Recording decisions.
- Managing resolution workflow.

**Payment Module**

Responsible for:

- Payments.
- Wallets.
- Refund transactions.
- Financial adjustments.
- Payment releases.
- Reconciliation.

**Notification Module**

Responsible for:

- Notifications.
- SMS.
- Email.
- Communication.

This prevents one module from becoming responsible for everything.

**14.76 Conceptual Dispute Architecture**

The module can be represented as:

CUSTOMER / DRIVER

│

↓

REPORT ISSUE

│

↓

┌─────────────────┐

│ DISPUTE MODULE │

└─────────────────┘

│

├──────────────→ EVIDENCE

│ │

│ ├── Inspection

│ ├── Payment

│ ├── GPS

│ └── Communication

│

↓

ADMINISTRATIVE REVIEW

│

↓

RESOLUTION

│

┌──────┼─────────┐

↓ ↓ ↓

TRIP PAYMENT NOTIFICATION

ACTION ACTION ACTION

**14.77 Suggested Dispute Data Structure**

At database-design level, the system may eventually require concepts such as:

disputes

dispute_evidence

dispute_messages

dispute_resolutions

cancellations

cancellation_settlements

admin_case_assignments

These are conceptual entities at this stage.

The final database schema should be developed after the complete system requirements have been defined.

**14.78 Suggested Dispute API Operations**

The exact API will be finalized during API design, but conceptually the system may provide:

POST /trips/:tripId/disputes

GET /trips/:tripId/disputes

GET /disputes/:id

PATCH /disputes/:id

POST /disputes/:id/evidence

POST /disputes/:id/respond

POST /disputes/:id/resolve

POST /trips/:tripId/cancel

GET /cancellations/:id

Administrator operations may include:

GET /admin/disputes

PATCH /admin/disputes/:id/assign

PATCH /admin/disputes/:id/status

POST /admin/disputes/:id/resolve

These remain conceptual until the API architecture is finalized.

**14.79 Backend Resolution Principle**

The frontend should never determine the final outcome of a dispute.

For example, the frontend should not be able to send:

resolution = "REFUND_FULL"

amount = 24900

and cause an automatic refund.

Instead:

Administrator Request

↓

Backend Authorization

↓

Dispute Validation

↓

Resolution Rules

↓

Authorized Decision

↓

Payment Module

↓

Financial Transaction

The backend remains the authority.

**14.80 Cancellation and Dispute Audit Trail**

Every important action should be recorded.

The audit trail should include:

- Actor.
- Action.
- Trip ID.
- Dispute ID where applicable.
- Cancellation ID where applicable.
- Previous status.
- New status.
- Amount where applicable.
- Reason.
- Timestamp.
- Related transaction.

This is especially important because dispute outcomes can affect money and user trust.

**14.81 MVP Scope**

**Included in MVP**

The Dispute, Cancellation and Resolution Module shall include:

- Customer cancellation.
- Driver cancellation.
- Administrator cancellation.
- Cancellation reasons.
- Cancellation records.
- Cancellation status tracking.
- Failed pickup reporting.
- Customer dispute creation.
- Driver dispute creation.
- Administrator dispute creation.
- Vehicle-condition disputes.
- Pickup disputes.
- Delivery disputes.
- Payment disputes.
- Operational disputes.
- Dispute evidence references.
- Inspection evidence references.
- Payment evidence references.
- Communication evidence references.
- GPS evidence references where available.
- Dispute priority.
- Dispute assignment.
- Administrator review.
- Administrator notes.
- Customer/driver responses.
- Resolution records.
- Refund requests arising from disputes.
- Financial adjustment requests.
- Dispute notifications.
- Dispute audit trail.
- Role-based access.
- Duplicate dispute protection.
- Cancellation idempotency.
- Basic dispute dashboard.
- Basic dispute history.
- Configurable dispute period.

**14.82 Not Required for MVP**

The following should remain future features:

- Automated AI dispute resolution.
- AI-based fraud determination.
- Automated compensation negotiation.
- Insurance claim automation.
- External legal-case integration.
- Advanced arbitration workflows.
- Predictive dispute detection.
- Automated liability determination.
- Blockchain evidence storage.
- Advanced evidence-forensics tools.
- Court/legal document automation.
- Multi-level external arbitration.
- Complex insurance settlement processing.

These can be considered after the core CarGo Kenya platform has been validated.

**14.83 Core Dispute Business Rules**

The following rules shall be treated as core MVP requirements.

**Rule 1**

Customers and drivers shall be able to report relevant operational problems.

**Rule 2**

Cancellations and disputes shall be recorded separately.

**Rule 3**

A cancellation shall not silently delete or destroy the trip record.

**Rule 4**

A dispute shall retain the relevant trip reference.

**Rule 5**

Vehicle-condition disputes shall reference the appropriate inspection records.

**Rule 6**

Payment disputes shall reference the appropriate payment and wallet records.

**Rule 7**

The Dispute Module shall not directly manipulate wallet balances.

**Rule 8**

Financial consequences shall be processed through the Payment and Wallet Module.

**Rule 9**

Disputed funds may remain protected until the applicable review process is completed.

**Rule 10**

Already-released driver funds shall not be silently removed because of a dispute.

**Rule 11**

Important administrative decisions shall contain a reason.

**Rule 12**

Users shall only access disputes and evidence they are authorized to access.

**Rule 13**

Internal administrator notes shall not automatically be visible to customers or drivers.

**Rule 14**

Duplicate cancellation and dispute processing shall be prevented.

**Rule 15**

All important dispute and cancellation actions shall be auditable.

**Rule 16**

A trip should normally use DISPUTED when a formal issue materially affects the transportation assignment.

**Rule 17**

A completed trip should normally be handled through a post-trip dispute rather than being changed back to CANCELLED.

**Rule 18**

Notification failure shall not invalidate a successfully created dispute or cancellation.

**Rule 19**

The backend shall remain the final authority for dispute and cancellation processing.

**Rule 20**

The original financial transactions shall remain traceable after refunds or adjustments.

**14.84 Complete Dispute Lifecycle**

The complete MVP dispute lifecycle shall operate as follows:

NORMAL TRIP OPERATION

↓

PROBLEM OCCURS

↓

CUSTOMER / DRIVER REPORTS ISSUE

↓

DISPUTE CREATED

↓

STATUS = OPEN

↓

ADMINISTRATOR NOTIFIED

↓

EVIDENCE COLLECTED

↓

STATUS = UNDER REVIEW

↓

ADDITIONAL INFORMATION?

↙ ↘

YES NO

↓ ↓

REQUEST INFO REVIEW

↓ ↓

RESPONSE DECISION

└──────┬────┘

↓

RESOLUTION

↓

┌───────────┼────────────┐

↓ ↓ ↓

TRIP FINANCIAL NO FINANCIAL

ACTION ACTION ACTION

↓ ↓ ↓

Trip Refund / Case

Updated Adjustment Resolved

↓

↓

NOTIFICATIONS

↓

RESOLVED

↓

CLOSED

**14.85 Complete Cancellation Lifecycle**

The cancellation lifecycle shall be:

TRIP

↓

CANCELLATION REQUEST

↓

IDENTIFY INITIATOR

↓

CHECK CURRENT TRIP STATUS

↓

CHECK CANCELLATION POLICY

↓

FINANCIAL CONSEQUENCES

↓

ADMIN REVIEW WHERE REQUIRED

↓

CANCELLATION APPROVED

↓

TRIP = CANCELLED

↓

REFUND / ADJUSTMENT WHERE APPLICABLE

↓

FINANCIAL RECORD UPDATED

↓

RELEVANT USERS NOTIFIED

↓

AUDIT RECORD CREATED

**14.86 Final Architecture**

The Dispute, Cancellation and Resolution Module can therefore be understood as the **exception-management layer** of CarGo Kenya:

CARGo KENYA TRIP

│

↓

NORMAL OPERATIONS

│

↓

┌─────────────────┐

│ PROBLEM OCCURS │

└─────────────────┘

│

↓

┌────────────────────────────┐

│ DISPUTE / CANCELLATION │

│ MODULE │

└────────────────────────────┘

│ │ │

↓ ↓ ↓

EVIDENCE REVIEW COMMUNICATION

│ │ │

└──────────┼──────────┘

↓

RESOLUTION

│

┌──────────┼───────────┐

↓ ↓ ↓

TRIP PAYMENT NO ACTION

ACTION ACTION

│ │

↓ ↓

STATUS REFUND /

UPDATE ADJUSTMENT

│ │

└────┬─────┘

↓

AUDIT TRAIL

↓

CLOSED

**14.87 Relationship With Previous Modules**

This chapter now connects the previous modules without changing their responsibilities:

**Vehicle Inspection Module**  
→ provides vehicle-condition evidence.

**GPS/Tracking Module**  
→ provides location/trip evidence.

**Fuel/Trip Operations Module**  
→ provides operational fuel and trip records.

**Payment and Wallet Module (12.0)**  
→ controls payments, refunds, wallet releases and financial adjustments.

**Notification and Communication Module (13.0)**  
→ communicates dispute/cancellation events.

**Dispute, Cancellation and Resolution Module (14.0)**  
→ coordinates the exceptional case and administrative resolution.

**15.0 ADMINISTRATION AND SYSTEM MANAGEMENT MODULE**

**15.1 Purpose**

The Administration and System Management Module shall provide CarGo Kenya administrators with the tools required to monitor, manage, control, and support the operation of the platform.

The module shall allow authorized administrators to manage the operational aspects of the CarGo Kenya platform without directly interfering with normal customer and driver workflows unless administrative intervention is required.

The module shall support:

- User management.
- Driver verification and approval.
- Customer account management.
- Trip monitoring.
- Transportation request monitoring.
- Quotation monitoring.
- Payment monitoring.
- Trip Wallet monitoring.
- Driver Personal Wallet monitoring.
- Vehicle inspection oversight.
- GPS/trip monitoring.
- Dispute management.
- Cancellation management.
- Refund and financial adjustment management.
- Notification monitoring.
- Platform configuration.
- Audit-log access.
- Administrative actions.
- Account suspension and restriction.
- Operational reporting.

The purpose of this module is therefore to provide the administrative control layer of CarGo Kenya.

**15.2 Administration Philosophy**

The CarGo Kenya administration system shall follow the principle:

**Administrators control and supervise the platform, but important actions must remain traceable, authorized, and consistent with the underlying business rules.**

An administrator should not be able to arbitrarily change important system information without leaving an appropriate record.

For example, an administrator should not simply change:

TRIP ACTIVE → COMPLETED

without recording:

- Who performed the action.
- Why the action was performed.
- When it was performed.
- The previous status.
- The new status.
- Any relevant supporting information.

This is particularly important because administrators may have access to sensitive:

- User information.
- Financial information.
- Vehicle information.
- Inspection evidence.
- Trip information.
- Location information.
- Dispute information.

**15.3 Administrator Roles**

The MVP should support role-based administrative access.

The basic administrative structure may include:

**SUPER ADMIN**

The Super Admin shall have the highest level of platform-management access.

The Super Admin may manage:

- Administrator accounts.
- System configuration.
- Platform fees.
- User restrictions.
- Driver verification.
- Financial settings.
- Operational settings.
- Administrative permissions.
- Critical system actions.

**OPERATIONS ADMIN**

The Operations Administrator shall primarily manage transportation operations.

Responsibilities may include:

- Monitoring active trips.
- Reviewing failed pickups.
- Monitoring delivery issues.
- Reviewing inspection problems.
- Monitoring GPS/tracking problems.
- Handling operational disputes.
- Supporting customers and drivers.

**FINANCE ADMIN**

The Finance Administrator shall primarily manage financial operations.

Responsibilities may include:

- Payment monitoring.
- Refunds.
- Financial adjustments.
- Driver payment releases where authorized.
- Wallet reconciliation.
- Withdrawal monitoring.
- Financial transaction review.

**SUPPORT ADMIN**

The Support Administrator shall primarily handle customer and driver support.

Responsibilities may include:

- Customer account assistance.
- Driver account assistance.
- Trip support.
- Communication support.
- Basic dispute handling.
- Notification issues.

The exact role structure may be expanded later.

**15.4 Role-Based Access Control**

Administrative permissions shall be controlled using Role-Based Access Control (RBAC).

Conceptually:

ADMINISTRATOR

↓

ROLE

↓

PERMISSIONS

↓

AUTHORIZED ACTIONS

For example:

Finance Admin

↓

Payment Permission

↓

View Payment

↓

View Wallet

↓

Process Refund

A support administrator should not automatically receive permission to modify financial transactions merely because they can view a trip.

**15.5 Administrator Authentication**

Administrators shall be required to authenticate before accessing administrative functionality.

The system should support:

- Secure login.
- Password protection.
- Session/token management.
- Account status checking.
- Role verification.
- Permission verification.
- Logout.
- Security event logging.

For sensitive administrative operations, additional authentication controls may be introduced.

**15.6 Administrator Dashboard**

The administrator dashboard shall provide an overview of the current state of the CarGo Kenya platform.

The MVP dashboard may display:

**Users**

- Total customers.
- Total drivers.
- Pending driver verification.
- Suspended accounts.

**Trips**

- Active trips.
- Pending trips.
- Trips awaiting pickup.
- Trips in transit.
- Trips awaiting delivery.
- Completed trips.
- Disputed trips.
- Cancelled trips.

**Financial**

- Pending payments.
- Successful payments.
- Failed payments.
- Driver earnings pending release.
- Driver earnings released.
- Refunds.
- Withdrawals requiring attention.

**Operations**

- Failed pickups.
- Inspection discrepancies.
- GPS problems.
- Delivery disputes.
- Support cases.

The dashboard should provide summary information without attempting to replace the detailed modules.

**15.7 Administrative Dashboard Principle**

The dashboard shall provide administrators with an overview rather than becoming the primary place where every operation is performed.

For example:

Dashboard

↓

Active Trips: 27

↓

Administrator selects

↓

Active Trip Management

This keeps the system organized and easier to use.

**15.8 Customer Management**

Administrators shall be able to view and manage customer accounts.

The administrator may view:

- Customer ID.
- Name.
- Email.
- Phone number.
- Account status.
- Registration date.
- Number of transportation requests.
- Number of completed trips.
- Number of cancelled trips.
- Relevant disputes.
- Relevant payment history.

The administrator should not have unrestricted access to information that is not necessary for their role.

**15.9 Customer Account Status**

Customer accounts may have statuses such as:

**ACTIVE**

The customer can use the platform normally.

**RESTRICTED**

The customer's access to certain functionality has been limited.

**SUSPENDED**

The customer cannot use the platform normally until the suspension is removed.

**DEACTIVATED**

The account has been disabled according to applicable procedures.

Any change to account status should be recorded in the audit trail.

**15.10 Driver Management**

Administrators shall be able to manage driver accounts.

The administrator may view:

- Driver profile.
- Verification status.
- Driving/vehicle documentation where applicable.
- Vehicle information.
- Completed trips.
- Cancelled trips.
- Disputes.
- Ratings/reputation information.
- Payment information according to role permissions.
- Account status.

The administrator shall not be able to bypass verification requirements without appropriate authorization and audit records.

**15.11 Driver Verification Management**

The administration module shall support driver verification.

The process shall be:

Driver Registration

↓

Verification Submitted

↓

Administrator Review

↓

APPROVED / REJECTED / CORRECTION REQUIRED

The administrator should be able to review the required verification information and supporting documents.

**15.12 Driver Verification Decision**

An administrator may select:

**APPROVE**

Driver satisfies the required verification conditions.

**REJECT**

Driver does not satisfy the required conditions.

**CORRECTION REQUIRED**

Additional or corrected information is required.

The decision should include:

- Administrator ID.
- Date/time.
- Decision.
- Reason where applicable.
- Supporting notes.

**15.13 Driver Suspension**

An administrator may suspend a driver when there is a legitimate operational or policy reason.

Examples may include:

- Serious verification issue.
- Repeated failed pickups.
- Fraud concerns.
- Serious customer complaints.
- Operational misconduct.
- Administrative investigation.

The suspension should record:

- Driver.
- Reason.
- Administrator.
- Date/time.
- Suspension status.
- Optional review date.

**15.14 Trip Management**

Administrators shall be able to search and view transportation assignments.

The administrator should be able to search using:

- Trip reference.
- Customer.
- Driver.
- Status.
- Pickup location.
- Destination.
- Date.
- Payment status.

The administrator should be able to open the relevant trip record and view its operational history.

**15.15 Trip Overview**

The administrator's trip view should provide a consolidated overview.

Example:

TRIP

CGK-2026-000125

Customer:

John Doe

Driver:

Driver Name

Pickup:

Mombasa

Destination:

Nairobi

Status:

IN TRANSIT

Payment:

PAID

Driver Fee:

KSh 18,000

First Release:

KSh 9,000

Remaining:

KSh 9,000

Inspection:

Completed

Tracking:

Active

Dispute:

None

This gives the administrator a single operational view.

**15.16 Trip Status Management**

Administrators may view the current trip status and its history.

The standard trip statuses remain:

- REQUESTED
- QUOTING
- DRIVER SELECTED
- PAYMENT PENDING
- BOOKED
- PICKUP PENDING
- PICKUP INSPECTION
- TRIP START PENDING
- TRIP ACTIVE
- IN TRANSIT
- DELIVERY PENDING
- DELIVERED
- COMPLETED
- DISPUTED
- CANCELLED

The administrator interface must use the same statuses established in the previous chapters.

**15.17 Administrative Trip Status Changes**

Administrative status changes should be restricted.

An administrator should not be able to arbitrarily modify statuses simply because the interface provides a dropdown.

Where a manual status intervention is permitted, the system should verify:

- Current status.
- Requested status.
- Required permissions.
- Business-rule compatibility.
- Reason for intervention.

The system should then record the action.

**15.18 Trip Timeline**

Each trip should have an administrative timeline.

Example:

10 Aug 2026 08:15

Request Created

10 Aug 2026 09:05

Driver Quotation Submitted

10 Aug 2026 09:40

Driver Selected

10 Aug 2026 10:20

Payment Confirmed

10 Aug 2026 10:21

Trip Booked

10 Aug 2026 13:10

Pickup Inspection Started

10 Aug 2026 13:35

Pickup Inspection Completed

10 Aug 2026 13:42

Trip Active

10 Aug 2026 13:43

First Driver Release

11 Aug 2026 17:20

Delivery Completed

11 Aug 2026 17:25

Trip Completed

11 Aug 2026 17:26

Final Driver Release

This timeline will be particularly useful when investigating disputes.

**15.19 Quotation Management**

Administrators should be able to view quotations associated with a transportation request.

The administrator may view:

- Driver.
- Quoted transportation fee.
- Fuel budget.
- Total price.
- Quotation status.
- Submission time.
- Acceptance status.

The administrator should not normally modify a quotation after acceptance unless an authorized adjustment is required.

**15.20 Payment Administration**

Authorized finance administrators shall be able to monitor payment activity.

The payment administration interface may include:

- Payment ID.
- Trip ID.
- Customer.
- Amount.
- Payment status.
- Provider reference.
- Date.
- Refund status.
- Related wallet records.

The Payment and Wallet Module remains responsible for the actual financial rules.

The Administration Module provides controlled oversight.

**15.21 Wallet Administration**

Authorized administrators may view:

**Trip Wallet**

- Customer payment.
- Driver fee.
- Fuel budget.
- CarGo fee.
- Released amounts.
- Remaining amounts.
- Refunds.
- Adjustments.

**Driver Personal Wallet**

- Available balance.
- Pending earnings.
- Released earnings.
- Withdrawals.
- Wallet transactions.

Administrators must not be allowed to silently alter wallet balances.

**15.22 Financial Adjustment**

Where an authorized financial adjustment is required, the administrator shall create a separate adjustment transaction.

The adjustment should contain:

- Trip ID.
- Amount.
- Type.
- Reason.
- Administrator.
- Date/time.
- Related transaction.
- Supporting notes.

The original transaction should remain preserved.

**15.23 Refund Administration**

Authorized administrators may initiate refunds where permitted.

The process shall be:

Refund Request

↓

Review

↓

Refund Decision

↓

Amount Confirmed

↓

Refund Initiated

↓

Provider Confirmation

↓

Refund Recorded

The administrator should not be able to delete the original payment transaction.

**15.24 Driver Withdrawal Management**

Authorized finance administrators shall be able to monitor driver withdrawals.

The administrator may view:

- Withdrawal ID.
- Driver.
- Amount.
- Status.
- Destination.
- Provider reference.
- Request time.
- Completion time.
- Failure reason.

Where a withdrawal requires intervention, the administrator may review and resolve it according to the supported process.

**15.25 Vehicle Inspection Oversight**

Administrators shall be able to review vehicle inspection records.

The administrator should be able to view:

- Trip.
- Vehicle.
- Driver.
- Inspection type.
- Odometer.
- Fuel level.
- Damage records.
- Photographs.
- Driver confirmation.
- Customer confirmation.
- Inspection timestamp.

Inspection evidence should remain linked to the appropriate inspection record.

**15.26 Inspection Discrepancy Management**

Where a vehicle condition discrepancy is reported:

Inspection Discrepancy

↓

Trip Flagged

↓

Relevant Parties Notified

↓

Administrator Review

↓

Resolution

The administrator may record:

- Issue.
- Evidence.
- Parties involved.
- Decision.
- Resolution.
- Financial consequence where applicable.

**15.27 GPS and Tracking Administration**

Administrators should be able to monitor active trips where tracking is enabled.

The administrator may view:

- Current/last-known location.
- Tracking status.
- Last update time.
- Route progress.
- Significant tracking interruptions.
- Destination status.

The administration system should not expose unnecessary location information to unauthorized users.

**15.28 GPS Failure Management**

If GPS tracking becomes unavailable, the administrator should be able to see:

Tracking Status:

TEMPORARILY UNAVAILABLE

Last Known Location:

Mombasa

Last Update:

14:32

Trip:

CGK-2026-000125

A tracking failure should not automatically cancel or fail the trip.

**15.29 Dispute Management**

Administrators shall have a dedicated interface for managing disputes.

A dispute record should contain:

- Dispute ID.
- Trip ID.
- Customer.
- Driver.
- Dispute category.
- Description.
- Supporting evidence.
- Current status.
- Assigned administrator.
- Decision.
- Resolution.
- Date/time.

**15.30 Dispute Status**

The MVP may use:

**OPEN**

Dispute has been submitted.

**UNDER REVIEW**

Administrator is investigating.

**RESOLVED**

A final decision has been recorded.

**REJECTED**

The dispute was reviewed and found not to require corrective action.

The exact statuses may be refined during implementation.

**15.31 Dispute Evidence**

Administrators should be able to review relevant evidence, including:

- Inspection photographs.
- Trip timeline.
- GPS information.
- Communication records where authorized.
- Payment records.
- Delivery confirmation.
- User-submitted evidence.

Evidence should remain associated with its original module.

**15.32 Cancellation Management**

Administrators should be able to review cancelled trips.

The system should show:

- Trip status before cancellation.
- Cancellation initiator.
- Cancellation reason.
- Cancellation time.
- Financial consequences.
- Refund information.
- Driver release status.

This information will help determine whether additional action is required.

**15.33 Notification Administration**

Administrators should be able to monitor important notification activity.

The interface may show:

- Notification type.
- Recipient.
- Channel.
- Status.
- Created time.
- Delivery time.
- Failure reason.
- Retry status.

The administrator should not normally modify historical notification records.

**15.34 Communication Oversight**

Authorized administrators may access trip-related communication where necessary for:

- Dispute investigation.
- Operational support.
- Safety-related issues.
- Fraud investigation.
- Customer support.

Access to private communication should be controlled and logged.

**15.35 System Configuration**

The administration module shall provide controlled configuration of selected platform settings.

Possible MVP configurations include:

- CarGo platform fee.
- Commission model.
- Cancellation settings.
- Supported payment settings.
- Supported notification channels.
- Operational thresholds.
- System defaults.

Configuration changes should be logged.

**15.36 Platform Fee Configuration**

The administrator may configure the CarGo Kenya platform fee according to the approved business model.

For example:

Commission Type:

PERCENTAGE

Commission:

5%

or:

Commission Type:

FIXED

Platform Fee:

KSh 900

Changing the global configuration must not alter existing trip price snapshots.

**15.37 Configuration Versioning**

Important configuration changes should maintain a history.

Example:

Previous Platform Fee:

5%

New Platform Fee:

6%

Changed By:

Super Admin

Changed At:

10 Aug 2026 09:30

Existing transactions should continue using their stored price snapshot.

**15.38 Audit Trail**

The Administration Module shall integrate with the system-wide audit trail.

Important administrative actions should record:

- Administrator ID.
- Role.
- Action.
- Entity.
- Entity ID.
- Previous value where applicable.
- New value where applicable.
- Reason.
- IP/device information where appropriate.
- Date/time.

Example:

ADMIN ACTION

Administrator:

Admin-001

Action:

DRIVER SUSPENDED

Driver:

DRV-000125

Reason:

Verification issue

Date:

10 Aug 2026 14:22

**15.39 Administrative Action Integrity**

The system should avoid allowing administrators to perform actions that contradict core business rules.

For example, an administrator should not accidentally release the full driver transportation fee when only the first 50% is eligible.

Administrative tools must therefore operate through the same underlying service/business logic wherever practical.

**15.40 Search and Filtering**

The administration interface should provide efficient search and filtering.

Administrators should be able to filter:

**Users**

- Customer.
- Driver.
- Status.
- Verification.

**Trips**

- Status.
- Date.
- Driver.
- Customer.
- Location.

**Payments**

- Status.
- Date.
- Amount.
- Provider.

**Disputes**

- Status.
- Type.
- Date.
- Assigned administrator.

This is necessary as the platform grows.

**15.41 Administrative Notifications**

Administrators should receive notifications for events requiring attention.

Examples:

- New driver verification.
- Payment dispute.
- Failed payment.
- Failed pickup.
- Inspection discrepancy.
- Delivery dispute.
- Failed refund.
- Failed withdrawal.
- Suspicious activity.
- Critical GPS interruption.

The system should distinguish:

INFORMATION

from:

ACTION REQUIRED

**15.42 Administrative Activity Dashboard**

The system may provide administrators with an activity feed.

Example:

RECENT ACTIVITY

09:42

Driver DRV-00125 verified.

09:48

Trip CGK-2026-000125 became BOOKED.

10:12

Payment KSh 24,900 confirmed.

13:40

Pickup inspection completed.

13:45

Trip became TRIP ACTIVE.

13:46

First driver payment released.

15:20

Dispute opened for Trip CGK-2026-000119.

This provides operational awareness without requiring administrators to inspect every module individually.

**15.43 Administrative Security**

The administration module shall have stronger security requirements than ordinary user functionality.

The system should implement:

- Strong authentication.
- Role-based authorization.
- Permission checks.
- Secure sessions/tokens.
- Audit logging.
- Input validation.
- Protection against unauthorized API access.
- Restricted financial operations.
- Restricted user-management operations.
- Secure handling of sensitive information.

Administrative APIs must never rely solely on frontend restrictions.

**15.44 Backend Authorization**

The backend shall independently verify administrator permissions.

For example:

Administrator Request

↓

Authenticate

↓

Identify Role

↓

Check Permission

↓

Authorized?

↓ ↓

YES NO

↓ ↓

Execute Reject

A hidden frontend button is not sufficient security.

**15.45 Sensitive Administrative Actions**

The following actions should receive additional protection:

- Refund.
- Financial adjustment.
- Driver suspension.
- Customer suspension.
- Manual payment intervention.
- Wallet adjustment.
- Manual trip intervention.
- Configuration changes.
- Administrator account changes.

Depending on the implementation, these actions may require:

- Confirmation.
- Reason.
- Additional authentication.
- Approval by another administrator.

**15.46 Administrator Account Management**

Super Admins shall be able to manage administrator accounts.

The system should support:

- Create administrator.
- Assign role.
- Change permissions where authorized.
- Disable administrator.
- Reset access where appropriate.
- View administrative activity.

Administrators should not share accounts.

Every administrative action must be attributable to an individual administrator account.

**15.47 Administrator Deactivation**

When an administrator leaves the organization or no longer requires access:

Administrator Account

↓

DEACTIVATED

The system should preserve historical audit records associated with that administrator.

Deactivating the account must not delete historical actions.

**15.48 Operational Reporting**

The Administration Module shall provide basic operational reports.

The MVP may support:

- Number of trips.
- Completed trips.
- Cancelled trips.
- Disputed trips.
- Active trips.
- Driver verification statistics.
- Payment statistics.
- Refund statistics.
- Driver earnings released.
- Failed pickups.
- Inspection discrepancies.

Advanced business intelligence is not required for the MVP.

**15.49 Administrative Export**

Where appropriate, authorized administrators may export selected operational data.

Possible exports include:

- Trip records.
- Payment records.
- Driver records.
- Customer records.
- Inspection records.
- Dispute records.

Exports must respect administrator permissions and should not expose unauthorized sensitive information.

**15.50 Data Protection**

The Administration Module shall follow the principle of minimum necessary access.

An administrator should only access information necessary for their assigned responsibilities.

For example:

Support Admin

↓

Customer + Trip Information

↓

Limited Financial Information

while:

Finance Admin

↓

Payment + Wallet Information

This reduces unnecessary exposure of sensitive information.

**15.51 Administrative API Design**

The exact API endpoints shall be finalized during API design.

Conceptually, administrative operations may include:

GET /admin/dashboard

GET /admin/users

GET /admin/users/:id

GET /admin/drivers

GET /admin/drivers/:id

PATCH /admin/drivers/:id/verification

GET /admin/trips

GET /admin/trips/:id

GET /admin/payments

GET /admin/wallets

GET /admin/disputes

PATCH /admin/disputes/:id

GET /admin/notifications

GET /admin/audit-logs

These are conceptual examples only. Final endpoints should follow the overall API architecture.

**15.52 Administrative Database Considerations**

The administration system should maintain relationships with existing entities such as:

Users

Drivers

Customers

Vehicles

Trips

Quotations

Payments

Trip Wallets

Driver Wallets

Inspections

GPS Records

Notifications

Messages

Disputes

Refunds

Withdrawals

Audit Logs

System Configuration

The administration module should not unnecessarily duplicate these records.

Instead, it should provide controlled management interfaces over the underlying system data.

**15.53 Administrative Event Logging**

Important administrative events should be recorded as structured events.

For example:

EVENT:

DRIVER_VERIFICATION_APPROVED

ACTOR:

ADMIN-001

ENTITY:

DRIVER-000125

TIMESTAMP:

2026-08-10 09:30

RESULT:

SUCCESS

This allows developers to investigate system behavior later.

**15.54 Failure Handling**

If an administrative action fails, the system should:

1.  Prevent partial updates where possible.
2.  Return a meaningful error.
3.  Record the failure where appropriate.
4.  Preserve the existing valid state.
5.  Avoid misleading the administrator.

For example, if a refund fails:

Refund Request

↓

Provider Failure

↓

Refund = FAILED

↓

Original Payment Remains

The system should not falsely mark the refund as completed.

**15.55 Administrative Transaction Integrity**

Financial administrative actions should use transactional database operations where appropriate.

For example:

Refund

↓

Create Refund Transaction

↓

Update Refund Status

↓

Update Relevant Wallet Records

↓

Create Audit Record

If a critical operation fails halfway through, the system should avoid leaving inconsistent financial records.

**15.56 Administration and Other Modules**

The Administration Module shall interact with the other CarGo Kenya modules.

**User Management**

Administration

↓

Customers / Drivers

**Trip Management**

Administration

↓

Transportation Lifecycle

**Vehicle Inspection**

Administration

↓

Inspection Evidence

**GPS**

Administration

↓

Trip Tracking

**Payment**

Administration

↓

Payment / Wallet Oversight

**Notification**

Administration

↓

Communication Monitoring

The Administration Module therefore acts as the supervisory layer rather than replacing the underlying modules.

**15.57 Administrator Intervention Principle**

Administrative intervention should be treated as an exception rather than the normal method of operating the platform.

Normal operation should remain:

Customer

↓

System

↓

Driver

↓

System

Administrative intervention occurs when:

Exception

↓

Administrator Review

↓

Decision

↓

Controlled Intervention

↓

Audit Record

This prevents the platform from becoming dependent on manual administrator actions.

**15.58 MVP Scope**

**Included in MVP**

The Administration and System Management Module shall include:

- Administrator authentication.
- Role-based access control.
- Administrator dashboard.
- Customer management.
- Driver management.
- Driver verification.
- Driver suspension/restriction.
- Trip monitoring.
- Quotation monitoring.
- Payment monitoring.
- Trip Wallet monitoring.
- Driver Wallet monitoring.
- Inspection oversight.
- GPS/tracking oversight.
- Dispute management.
- Cancellation monitoring.
- Refund management.
- Financial adjustment management.
- Withdrawal monitoring.
- Notification monitoring.
- Basic system configuration.
- Audit logs.
- Administrative activity history.
- Basic operational reporting.
- Search and filtering.
- Administrative notifications.
- Secure administrative APIs.

**15.59 Not Required for MVP**

The following should remain future features:

- Advanced business intelligence.
- AI-powered administrator recommendations.
- Automated fraud detection.
- Predictive operational analytics.
- Complex workflow automation.
- Advanced accounting integrations.
- Automated tax management.
- Multi-level enterprise administration.
- Advanced staff scheduling.
- Advanced call-center management.
- Automated dispute resolution.
- AI-generated administrative reports.
- Advanced geographic analytics.

These can be introduced after the core CarGo Kenya platform has been validated.

**15.60 Administration Business Rules**

The following rules shall be treated as core MVP requirements.

**Rule 1**

Only authenticated administrators may access administrative functionality.

**Rule 2**

Administrative permissions shall be controlled through roles and permissions.

**Rule 3**

Administrators shall only access information required by their assigned permissions.

**Rule 4**

Important administrative actions must be recorded in the audit trail.

**Rule 5**

Financial administrators must not be able to bypass the underlying Payment and Wallet business rules.

**Rule 6**

Administrative actions must not silently alter historical financial transactions.

**Rule 7**

Existing trip price snapshots must remain unchanged when global pricing configuration changes.

**Rule 8**

Driver verification decisions must be recorded.

**Rule 9**

Account suspensions and restrictions must be traceable.

**Rule 10**

Manual trip-status intervention must be restricted and auditable.

**Rule 11**

Administrators must not be able to directly withdraw funds from Trip Wallets on behalf of users without an authorized financial process.

**Rule 12**

Inspection evidence must remain associated with the relevant inspection record.

**Rule 13**

Administrative access to customer-driver communication must be controlled and logged.

**Rule 14**

Administrative intervention should be used primarily for exceptions and operational support.

**Rule 15**

The backend must independently enforce administrator permissions.

**Rule 16**

Disabling an administrator account must not delete historical audit records.

**Rule 17**

Failed administrative transactions must not leave the system in an inconsistent state.

**Rule 18**

The Administration Module shall use the same official trip statuses and terminology defined throughout the CarGo Kenya system design.

**15.61 Complete Administration Lifecycle**

The overall administrative lifecycle can therefore be understood as:

USER / DRIVER / TRIP EVENT

↓

SYSTEM RECORD

↓

ADMIN DASHBOARD

↓

REVIEW / MONITOR

↓

┌────────┴─────────┐

↓ ↓

NO ACTION ACTION REQUIRED

↓ ↓

CONTINUE REVIEW

↓

ADMIN DECISION

↓

CONTROLLED ACTION

↓

SYSTEM UPDATE

↓

AUDIT LOG

↓

RELEVANT USERS

NOTIFIED

**15.62 Final Administration Architecture**

The CarGo Kenya Administration and System Management Module can therefore be understood as the supervisory layer of the platform:

CARGo KENYA

│

ADMINISTRATION LAYER

│

┌─────────────────┼─────────────────┐

↓ ↓ ↓

USERS TRIPS FINANCE

│ │ │

↓ ↓ ↓

Drivers Inspections Payments

Customers GPS Tracking Wallets

Delivery Refunds

Withdrawals

│ │ │

└─────────────────┼─────────────────┘

↓

DISPUTES / SUPPORT

│

↓

NOTIFICATIONS

│

↓

AUDIT TRAIL

**16.0 SECURITY, AUTHENTICATION AND AUTHORIZATION MODULE**

**16.1 Purpose**

The Security, Authentication and Authorization Module shall protect the CarGo Kenya platform, its users, transportation assignments, financial records, vehicle information, communication records, and administrative functions from unauthorized access or manipulation.

The module shall ensure that:

- Only registered and authenticated users can access protected system functions.
- Users can only perform actions permitted by their roles and account status.
- Customers can access only their own transportation requests, trips, payments, and related information.
- Drivers can access only transportation assignments and information for which they are authorized.
- Administrators have controlled access to administrative functions according to their permissions.
- Sensitive financial operations cannot be manipulated through the frontend.
- Trip status transitions cannot be bypassed through unauthorized API requests.
- Driver payment releases cannot be manually triggered by users.
- Vehicle inspection evidence cannot be altered by unauthorized users.
- Authentication credentials and security-sensitive information are protected.
- Important security events are recorded in the audit trail.
- Suspicious or unauthorized activities can be detected and investigated.

The module shall therefore provide the security foundation for all other CarGo Kenya MVP modules.

**16.2 Security Philosophy**

The CarGo Kenya security architecture shall follow the principle:

**Never trust the client; verify every sensitive operation on the server.**

The frontend may request an action, but the backend shall determine whether that action is permitted.

For example:

A driver may press:

**START TRIP**

However, the backend must independently verify:

Authenticated Driver

↓

Driver belongs to Trip

↓

Trip is BOOKED

↓

Pickup procedures completed

↓

Inspection completed

↓

Handover completed

↓

Required fueling procedures completed

↓

Driver authorized to start

↓

Customer confirmation required

↓

TRIP START PENDING

The frontend button itself shall never be treated as proof that the operation is valid.

The same principle shall apply to:

- Payments.
- Wallet releases.
- Withdrawals.
- Trip status changes.
- Inspections.
- Cancellations.
- Disputes.
- User management.
- Driver verification.
- Administrative actions.

**16.3 Security Responsibilities**

The Security Module shall be responsible for:

1.  User authentication.
2.  Password security.
3.  Session/token management.
4.  Role-based access control.
5.  Permission enforcement.
6.  Account status enforcement.
7.  Authentication attempt protection.
8.  Secure password reset.
9.  Email/phone verification where implemented.
10. Administrative access protection.
11. API authorization.
12. Sensitive operation authorization.
13. Security event logging.
14. Suspicious activity detection.
15. Account suspension controls.
16. Protection of sensitive system information.
17. Secure handling of authentication credentials.

**16.4 User Authentication**

Authentication shall determine whether a person accessing CarGo Kenya is actually the account owner.

The general authentication process shall be:

User

↓

Login

↓

Submit Credentials

↓

Backend Validation

↓

Credentials Verified

↓

Account Status Checked

↓

Authentication Successful

↓

Access Token / Session Created

↓

User Access Granted

If authentication fails:

Invalid Credentials

↓

Authentication Rejected

↓

Security Event Recorded

↓

User Notified

The system shall not reveal unnecessary information about why authentication failed.

For example, instead of:

"The email exists but the password is wrong."

the system may simply return:

"Invalid email or password."

This reduces unnecessary information disclosure.

**16.5 User Registration**

The system shall allow users to create accounts according to the supported CarGo Kenya roles.

The MVP may support:

- Customer registration.
- Driver registration.
- Clearing-agent registration where applicable.
- Administrator accounts created through controlled administrative procedures.

A registration process may follow:

Registration

↓

Basic Information

↓

Contact Information

↓

Password

↓

Terms / Consent

↓

Account Created

↓

Verification Where Required

↓

Account Activated

The exact information collected shall depend on the user's role.

**16.6 Customer Registration**

A customer account may require:

- Full name.
- Phone number.
- Email address where applicable.
- Password.
- Account status.
- Verification status.
- Date of registration.

Additional information may be collected when creating a transportation request.

The customer should not be required to provide driver-specific information.

**16.7 Driver Registration**

Driver registration shall require additional information because drivers perform transportation assignments.

The system may require:

- Full name.
- Phone number.
- Email address where applicable.
- Password.
- Driver identification information.
- Driving licence information.
- Relevant verification documents.
- Account status.
- Verification status.
- Registration date.

Driver registration does not automatically mean the driver is eligible to receive transportation assignments.

The driver must satisfy the applicable verification requirements established by the Driver Management Module.

**16.8 Driver Verification and Authentication**

Authentication and verification shall remain separate concepts.

For example:

Authentication:

"Is this person logged into their account?"

Verification:

"Has CarGo Kenya approved this person to operate as a driver?"

A driver may successfully log into the platform while still being:

VERIFICATION PENDING

Such a driver may access permitted account functions but should not automatically receive eligible transportation assignments.

**16.9 Account Status**

Every user account shall have an account status.

The MVP may use:

**ACTIVE**

The account is operational and may use authorized platform functions.

**PENDING VERIFICATION**

The account is awaiting required verification.

**SUSPENDED**

The account has temporarily lost access to some or all platform functions.

**DEACTIVATED**

The account is no longer active.

**LOCKED**

The account has been temporarily locked because of security conditions, such as repeated failed authentication attempts.

The exact implementation may use additional statuses where required.

**16.10 Authentication Status vs Account Status**

The system should distinguish between:

**Authentication State**

and:

**Account State**

For example:

Account Status:

ACTIVE

Authentication:

NOT LOGGED IN

After successful login:

Account Status:

ACTIVE

Authentication:

AUTHENTICATED

If the account becomes suspended:

Account Status:

SUSPENDED

Authentication:

ACCESS RESTRICTED

This distinction will help developers implement security logic correctly.

**16.11 Password Requirements**

Passwords shall be stored securely.

The system shall never store user passwords as plain text.

Instead:

User Password

↓

Secure Password Hashing

↓

Stored Password Hash

When logging in:

Entered Password

↓

Password Verification

↓

Stored Hash

↓

Match?

The implementation should use a modern password hashing mechanism such as an appropriate adaptive password-hashing algorithm.

The exact algorithm can be finalized during technical implementation.

**16.12 Password Storage**

The database shall never contain:

password = "mypassword123"

Instead, it should contain a securely generated password hash.

The original password should not be recoverable from the database through normal application functionality.

Even administrators should not be able to view users' original passwords.

**16.13 Password Reset**

The system shall provide a secure password-reset mechanism.

The process may be:

Forgot Password

↓

Enter Email / Phone

↓

Verification Request

↓

Secure Reset Token / OTP

↓

Identity Verification

↓

New Password

↓

Password Updated

↓

Previous Authentication Sessions Invalidated Where Appropriate

The reset mechanism should not reveal whether an account exists.

For example:

"If an account matching the information exists, reset instructions will be provided."

This reduces account enumeration risk.

**16.14 Password Reset Token**

If password-reset tokens are used, they should:

- Be sufficiently unpredictable.
- Have a limited validity period.
- Be single-use.
- Be invalidated after successful password reset.
- Not expose sensitive information.
- Not be stored insecurely.

A used or expired reset token must not be accepted again.

**16.15 Authentication Tokens / Sessions**

After successful authentication, the system shall establish an authenticated session.

Depending on the final architecture, CarGo Kenya may use:

- Secure session-based authentication; or
- Access and refresh tokens.

The implementation should ensure that authentication credentials are:

- Securely generated.
- Properly validated.
- Protected from unauthorized access.
- Expired or revoked where appropriate.

The exact authentication implementation shall be finalized during API and backend architecture design.

**16.16 Token Expiration**

Authentication credentials should not remain valid indefinitely.

The system should use appropriate expiration rules.

Conceptually:

Login

↓

Authentication Token Created

↓

Token Valid

↓

Token Expires

↓

Re-authentication / Refresh

This reduces the risk associated with stolen or forgotten authentication credentials.

**16.17 Logout**

Users shall be able to log out of their accounts.

The logout process shall terminate or invalidate the applicable authentication session/token according to the selected authentication architecture.

For example:

Authenticated Session

↓

Logout

↓

Session Invalidated

↓

Protected Requests Rejected

Where refresh tokens are used, the relevant refresh credential should also be invalidated.

**16.18 Role-Based Access Control**

CarGo Kenya shall use role-based access control (RBAC).

A user's role determines the broad set of functions they may access.

The MVP may include roles such as:

- CUSTOMER
- DRIVER
- CLEARING_AGENT
- ADMINISTRATOR

Additional administrative roles may be introduced if required.

The system should not rely solely on frontend route hiding.

The backend must enforce authorization.

**16.19 Customer Permissions**

A customer may be permitted to:

- Manage their own profile.
- Create transportation requests.
- View their own requests.
- Review driver quotations.
- Select an eligible driver.
- Make payments.
- View their own Trip Wallet information where appropriate.
- Confirm trip commencement.
- Monitor their own trip.
- Communicate with the assigned driver after booking.
- Confirm delivery.
- Raise disputes.
- Request cancellation.
- View their own payment history.
- View relevant notifications.
- Rate the completed transportation service.

A customer must not be able to:

- Access another customer's trip.
- Modify another user's payment.
- Release driver funds.
- Modify inspection records.
- Change system trip statuses arbitrarily.
- Access administrator functions.

**16.20 Driver Permissions**

A driver may be permitted to:

- Manage their own profile.
- Submit verification information.
- View eligible transportation requests.
- Submit quotations.
- View assignments assigned to them.
- Access pickup information after authorization.
- Perform required pickup procedures.
- Submit inspection information.
- Upload authorized inspection evidence.
- Request trip commencement.
- Record operational trip information.
- Record fuel information where applicable.
- Complete delivery procedures.
- View released earnings.
- Request withdrawal of available funds.
- Communicate with assigned customers.
- View relevant notifications.

A driver must not be able to:

- Release their own payments.
- Modify their own wallet balance.
- Access another driver's wallet.
- Modify another driver's inspection.
- Modify customer payment records.
- Access administrator functions.
- Change a completed trip back to an earlier status without authorized procedures.

**16.21 Clearing Agent Permissions**

Where clearing agents are supported in the MVP, their access shall be limited to transportation assignments they are authorized to manage.

A clearing agent may be permitted to:

- Create transportation requests on behalf of an authorized customer.
- View requests they created or are authorized to manage.
- Monitor relevant trip progress.
- View applicable operational information.
- Receive relevant notifications.

The clearing agent should not automatically gain access to:

- Driver private financial information.
- Unrelated customer accounts.
- Administrative controls.
- Driver wallet operations.

**16.22 Administrator Permissions**

Administrators shall have broader access because they are responsible for platform operations.

Depending on the administrator's permission level, an administrator may be able to:

- Review users.
- Review driver verification.
- Manage transportation requests.
- Review trips.
- Review inspections.
- Review disputes.
- Review payments.
- Review refunds.
- Review wallet transactions.
- Review withdrawals.
- Manage cancellations.
- Review audit records.
- Manage operational configuration.
- Suspend accounts.
- Investigate security events.

Administrative access must itself be controlled.

**16.23 Administrator Roles**

The system may eventually support different administrator roles.

For example:

**SUPER ADMIN**

Broad system-level authority.

**OPERATIONS ADMIN**

Manages trips, users, inspections, and operational issues.

**FINANCE ADMIN**

Manages payment-related operations, refunds, wallet reconciliation, and withdrawals.

**SUPPORT ADMIN**

Handles customer and driver support issues.

The MVP may initially use a simpler administrator role if the operational team is small.

The permission architecture should nevertheless allow additional administrative roles to be introduced later.

**16.24 Permission-Based Authorization**

Roles should preferably map to permissions rather than having authorization logic scattered throughout the application.

Conceptually:

ROLE

↓

PERMISSIONS

↓

AUTHORIZED ACTIONS

For example:

FINANCE_ADMIN

↓

VIEW_PAYMENTS

VIEW_REFUNDS

APPROVE_REFUNDS

VIEW_WALLETS

VIEW_WITHDRAWALS

This makes the system easier to maintain as CarGo Kenya grows.

**16.25 Object-Level Authorization**

Role authorization alone is not sufficient.

The system must also determine whether the user is authorized to access the specific object.

For example:

Driver A

Role = DRIVER

does not mean Driver A can access:

Trip CGK-2026-000999

The backend must verify:

Authenticated User

↓

User Role

↓

User Relationship to Trip

↓

Authorized?

Only then should the resource be returned.

**16.26 Example: Trip Access**

A customer requests:

GET /trips/CGK-2026-000125

The backend should verify:

Authenticated?

↓

YES

↓

Is user the customer associated with trip?

↓

YES

↓

Return permitted trip information

If the user is unrelated:

NO

↓

Reject Access

The system should not return the trip simply because the user knows its reference.

**16.27 API Authorization**

Every protected API endpoint shall perform appropriate authorization.

For example:

POST /trips/:tripId/start

must verify:

- User is authenticated.
- User is a driver.
- Driver is assigned to the trip.
- Trip is at the correct lifecycle stage.
- Required inspection procedures are complete.
- Driver is authorized to initiate the next step.

The endpoint must not simply trust:

role = DRIVER

**16.28 Financial Authorization**

Financial operations shall receive additional protection.

Examples include:

- Payment confirmation.
- Refund.
- Driver payment release.
- Wallet adjustment.
- Withdrawal.
- Financial reconciliation.

The system shall verify authorization at the backend.

For example:

Driver

↓

Request Release

↓

Backend Checks

↓

Eligible?

↓

YES

↓

Release Exactly Permitted Amount

A driver must never be able to specify an arbitrary amount to receive.

**16.29 Trip Status Authorization**

Trip status changes shall be controlled by the backend.

For example:

BOOKED

↓

PICKUP PENDING

↓

PICKUP INSPECTION

↓

TRIP START PENDING

↓

TRIP ACTIVE

A user must not be able to submit:

status = COMPLETED

and cause the trip to become completed.

The backend shall validate the permitted transition.

**16.30 Status Transition Protection**

The system should maintain a defined transition model.

For example:

REQUESTED

↓

QUOTING

↓

DRIVER SELECTED

↓

PAYMENT PENDING

↓

BOOKED

↓

PICKUP PENDING

↓

PICKUP INSPECTION

↓

TRIP START PENDING

↓

TRIP ACTIVE

↓

IN TRANSIT

↓

DELIVERY PENDING

↓

DELIVERED

↓

COMPLETED

Exceptions such as:

DISPUTED

CANCELLED

shall follow controlled business rules.

This prevents users from bypassing required operational steps.

**16.31 Authorization for Vehicle Inspection**

Vehicle inspection records contain important operational and potentially dispute-related evidence.

Therefore:

- Drivers may create permitted inspection records for their assigned trip.
- Customers may view permitted inspection information.
- Administrators may review inspection information.
- Users must not modify historical inspection evidence without authorization.
- Inspection photographs must be associated with the correct inspection record.
- Inspection records should be protected against unauthorized deletion.

**16.32 Authorization for GPS Information**

GPS information shall be accessible only to authorized users.

For example:

Customer

↓

Own Active Trip

↓

Authorized GPS Information

A customer must not be able to query another customer's driver's location.

Similarly, drivers should not automatically have access to unrelated drivers' tracking information.

**16.33 Communication Authorization**

Trip communication shall be protected at the trip level.

For example:

Customer A

↕

Trip 125

↕

Driver B

Customer A should be able to access the communication for Trip 125.

Customer A should not be able to access:

Trip 126

Customer C

Driver D

even if the message ID is known.

**16.34 Wallet Authorization**

The Driver Personal Wallet shall be private to the driver.

A driver should only be able to access:

- Their own balance.
- Their own released earnings.
- Their own withdrawal records.
- Their own wallet transactions.

The driver should not be able to query:

GET /wallets/another-driver-id

and obtain another driver's financial information.

Administrators may have controlled access according to their permissions.

**16.35 Sensitive Financial Information**

The system shall minimize exposure of sensitive financial information.

For example, a customer may see:

Total Trip Cost

Driver Transportation Fee

Fuel Budget

CarGo Platform Fee

Payment Status

where appropriate.

However, the customer should not automatically see:

- Internal accounting records.
- Other drivers' earnings.
- Administrative wallet adjustments.
- Internal reconciliation notes.

Information visibility shall be based on role and business necessity.

**16.36 Authentication Rate Limiting**

The authentication endpoints should be protected against excessive attempts.

For example:

Repeated Failed Login Attempts

↓

Rate Limiting / Temporary Protection

↓

Further Requests Restricted

This reduces the risk of automated password-guessing attacks.

The exact thresholds can be configured during implementation.

**16.37 Account Locking**

Where appropriate, repeated suspicious authentication failures may cause temporary account locking.

Example:

Multiple Failed Attempts

↓

Security Threshold Reached

↓

Account Temporarily Locked

↓

User Verification / Waiting Period

↓

Account Restored

The system should ensure that account-locking mechanisms cannot be abused to unnecessarily lock other users' accounts.

**16.38 Multi-Factor Authentication**

Multi-factor authentication may be introduced for sensitive accounts.

For example:

Password

+

Verification Code

MFA should be considered particularly valuable for:

- Administrators.
- Finance administrators.
- Super administrators.

For the MVP, MFA may initially be optional for ordinary users while administrator accounts receive stronger protection.

**16.39 Administrator Authentication**

Administrative authentication shall receive stronger security controls than ordinary user authentication.

Administrative accounts should use:

- Strong passwords.
- Secure authentication.
- Restricted access.
- Session protection.
- Additional verification where practical.
- Detailed audit logging.

Administrator credentials must never be shared between multiple individuals.

**16.40 Session Security**

Authenticated sessions should be protected against unauthorized reuse.

The implementation should consider:

- Secure token/session storage.
- Appropriate expiration.
- Token rotation where applicable.
- Revocation.
- Secure logout.
- Protection against session theft.

Authentication credentials should not be unnecessarily exposed in application logs.

**16.41 Secure Transport**

All production communication between the client and backend should use secure encrypted transport.

Conceptually:

User Device

│

│ HTTPS

↓

CarGo Kenya API

│

↓

Database / Services

Sensitive information such as:

- Passwords.
- Authentication tokens.
- Payment information.
- Personal information.

must not be transmitted through insecure production connections.

**16.42 API Input Validation**

The backend shall validate incoming API requests.

For example, if an endpoint expects:

amount

the backend must validate:

- Data type.
- Range.
- Required status.
- Associated transaction.
- User authorization.
- Business rules.

Input validation should not be left entirely to the frontend.

**16.43 Protection Against Unauthorized Parameter Manipulation**

The backend shall not trust client-supplied identifiers or financial values.

For example, a driver should not be able to modify:

driverId = another-driver

through a request body.

The backend should derive sensitive ownership information from the authenticated account and stored database relationships.

**16.44 Protection of API Responses**

The backend should return only information the authenticated user is authorized to receive.

For example, an API should not return an entire database record containing:

- Password hashes.
- Internal security information.
- Private administrative notes.
- Payment-provider credentials.
- Internal system metadata.

Response objects should be deliberately designed.

**16.45 Security of Payment Credentials**

Payment-provider credentials shall be treated as highly sensitive.

They must:

- Never be stored in frontend code.
- Never be committed to source control.
- Not appear in ordinary application logs.
- Be stored through secure environment/configuration mechanisms.
- Be accessible only to services that require them.

For example:

Frontend

X

Payment Provider Secret

Backend

✓ Payment Provider Secret

**16.46 Environment Variables and Secrets**

Sensitive configuration should be stored using secure environment configuration.

Examples include:

DATABASE_URL

JWT_SECRET

PAYMENT_PROVIDER_SECRET

SMS_API_KEY

EMAIL_API_KEY

These values should not be hard-coded into source files.

Developers should also ensure that secret files are excluded from source-control repositories where appropriate.

**16.47 Database Security**

Database access shall be restricted to authorized backend services.

Users should not directly connect to the production database through the frontend.

The architecture should therefore be:

Frontend

↓

Backend API

↓

Authorization

↓

Database

rather than:

Frontend

↓

Direct Database Access

Database credentials should be securely managed.

**16.48 Database-Level Ownership Controls**

Where practical, database design should support strong ownership relationships.

For example:

Customer

↓

Transportation Request

↓

Trip

↓

Payment

and:

Driver

↓

Trip Assignment

↓

Driver Earnings

These relationships help the backend determine who is authorized to access a resource.

**16.49 Audit Logging**

Important security and administrative actions shall be recorded.

Examples include:

- Login.
- Failed login.
- Logout where relevant.
- Password reset.
- Account suspension.
- Account activation.
- Role change.
- Permission change.
- Driver verification.
- Payment intervention.
- Refund approval.
- Wallet adjustment.
- Trip status override.
- Dispute resolution.
- Administrative access to sensitive records.

The audit record should contain appropriate information such as:

- Actor.
- Action.
- Resource.
- Timestamp.
- Result.
- Relevant reference.
- IP/device information where appropriate and legally permissible.

**16.50 Security Event Types**

The system may classify security events such as:

**AUTHENTICATION**

Login and authentication activity.

**AUTHORIZATION**

Access granted or denied.

**ACCOUNT**

Account status changes.

**PASSWORD**

Password and reset events.

**ADMINISTRATIVE**

Administrative security actions.

**FINANCIAL**

Sensitive financial actions.

**SYSTEM**

Security-related system events.

This classification will help administrators investigate incidents.

**16.51 Failed Authorization Logging**

Unauthorized attempts should be logged where appropriate.

For example:

Driver A

↓

Attempts to access Driver B's wallet

↓

Authorization Failed

↓

Access Denied

↓

Security Event Logged

The system should not expose unnecessary internal information to the requesting user.

**16.52 Account Suspension**

Administrators with appropriate permissions may suspend accounts.

The process may be:

Security / Operational Issue

↓

Administrator Review

↓

Suspension Decision

↓

Account = SUSPENDED

↓

Active Access Restricted

↓

User Notified

↓

Audit Record Created

Suspension should not automatically delete the user's historical records.

**16.53 Suspended Driver**

If a driver becomes suspended while they have active or upcoming trips, the system should flag the affected assignments for operational review.

For example:

Driver Suspended

↓

Active Trip Exists

↓

Operational Alert

↓

Administrator Review

The system should not silently leave customers without information.

The exact reassignment or cancellation procedure shall follow the relevant operational module.

**16.54 Role Change Protection**

Changing a user's role is a sensitive administrative operation.

For example:

CUSTOMER

↓

ADMINISTRATOR

must never happen through a normal customer API request.

Role changes shall require:

- Authorized administrator.
- Backend authorization.
- Validation.
- Audit record.

**16.55 Privilege Escalation Protection**

A user must not be able to elevate their own permissions by manipulating request parameters.

For example, a customer must not be able to submit:

role = ADMINISTRATOR

and become an administrator.

The backend must control role assignment.

**16.56 Administrative API Protection**

Administrative API routes should be explicitly protected.

Conceptually:

Authenticated User

↓

Administrator Check

↓

Permission Check

↓

Administrative Endpoint

If the user does not have the required permission:

403 Forbidden

or the application's equivalent authorization response shall be returned.

**16.57 Security and Notifications**

Security events may generate notifications.

Examples:

- New login from an unfamiliar environment where supported.
- Password changed.
- Password reset.
- Account suspended.
- Security verification required.

The notification system remains responsible for communication, while the Security Module remains responsible for detecting and recording the underlying event.

**16.58 Security and Payment Module**

The Security Module shall protect the Payment and Wallet Module.

For example:

Payment Release Request

↓

Authentication

↓

Authorization

↓

Trip Validation

↓

Payment Business Rules

↓

Release

Security authorization must occur before sensitive financial operations are executed.

**16.59 Security and Vehicle Inspection**

The same principle applies to inspection records.

Inspection Update Request

↓

Authenticated User

↓

Assigned Driver?

↓

Correct Trip?

↓

Inspection Stage Valid?

↓

Authorized?

↓

Save

A driver should not be able to modify an inspection belonging to another trip.

**16.60 Security and Communication**

Communication endpoints must verify:

- Sender identity.
- Trip membership.
- Recipient authorization.
- Message permissions.

The backend should not allow arbitrary users to send messages into another trip.

**16.61 Security and GPS Tracking**

GPS data is sensitive operational information.

The system shall ensure that:

- Only authorized users can view tracking information.
- Drivers cannot access unrelated trip locations.
- Customers can access tracking for their authorized trip.
- Administrators have controlled operational access.
- GPS data is not exposed through predictable unauthorized API requests.

**16.62 Security and Trip Completion**

Trip completion shall be protected because it triggers the remaining 50% driver payment release.

The system should therefore require:

Authenticated User

↓

Correct Driver / Customer

↓

Delivery Procedures Completed

↓

Required Confirmations

↓

Trip Completion Validation

↓

COMPLETED

↓

Final Payment Release

No single frontend request should be capable of bypassing these conditions.

**16.63 Security and Wallet Withdrawal**

Driver withdrawal shall require:

Authenticated Driver

↓

Own Wallet

↓

Available Balance

↓

Amount Validation

↓

Withdrawal Eligibility

↓

Withdrawal Created

The driver must not be able to:

- Withdraw another driver's money.
- Withdraw pending earnings.
- Change the wallet balance.
- Specify an unauthorized payout destination.

**16.64 Security Error Handling**

Security-related errors should avoid revealing sensitive internal information.

For example, the system should avoid returning:

Database query failed because user ID 125 does not belong to trip 125.

Instead, it should return a safe application-level response.

Detailed technical information should remain in protected server logs.

**16.65 Security Logging vs Personal Data**

Security logging should be sufficient for investigation without collecting unnecessary personal information.

The system should follow the principle:

**Collect and retain what is necessary for security, operation, and accountability.**

The exact retention periods and privacy requirements should be finalized according to applicable legal and operational requirements.

**16.66 Security Monitoring**

The administrator system may provide basic security monitoring.

The MVP may identify:

- Repeated failed logins.
- Suspicious account activity.
- Unauthorized API attempts.
- Repeated payment-operation failures.
- Unexpected administrative actions.
- Multiple account-security events.

Advanced automated threat detection is not required for the MVP.

**16.67 Security Incident Handling**

If a significant security issue occurs:

Security Event

↓

Detection

↓

Logging

↓

Administrator Review

↓

Account / Resource Protection

↓

Resolution

↓

Audit Record

The system should allow administrators to identify the affected user, trip, transaction, or resource.

**16.68 Security and Data Integrity**

Security controls shall also protect data integrity.

Users must not be able to manipulate:

- Trip status.
- Payment amounts.
- Wallet balances.
- Inspection results.
- Driver verification status.
- Delivery confirmation.
- Administrative decisions.

Where an authorized correction is necessary, it should be performed through a controlled operation and recorded in the audit trail.

**16.69 Security and Immutable Financial Records**

Financial records should receive stronger integrity protection.

For example:

Customer Payment

↓

Transaction Recorded

↓

Financial History

The original transaction should not simply be deleted or overwritten.

Corrections should preferably occur through:

Original Transaction

+

Authorized Adjustment

This maintains traceability.

**16.70 Data Encryption**

Sensitive information should be protected appropriately both:

- During transmission.
- At rest where necessary.

Encryption requirements shall be finalized based on the sensitivity of each data category and the final infrastructure architecture.

Particular attention should be given to:

- Authentication credentials.
- Payment-related information.
- Personal information.
- Verification documents.
- Inspection evidence.
- Authentication/session secrets.

**16.71 File Security**

Uploaded files such as:

- Driver verification documents.
- Vehicle documents.
- Inspection photographs.

shall not automatically be exposed through publicly predictable URLs.

The system should verify authorization before serving sensitive files.

Conceptually:

Request File

↓

Authenticate User

↓

Verify Resource Ownership / Permission

↓

Authorized?

↓

Return File

Otherwise:

Reject Access

**16.72 Upload Validation**

Uploaded files should be validated.

Validation may include:

- File type.
- File size.
- File extension.
- MIME type where appropriate.
- Upload authorization.
- Associated trip/user.
- Storage location.

The backend should not trust the filename supplied by the client.

**16.73 Security Headers and API Protection**

The production application should implement appropriate web-security protections, including suitable security headers and API protections.

The exact configuration shall be finalized during backend implementation.

The objective is to reduce common risks associated with:

- Unauthorized browser behavior.
- Malicious requests.
- Improper content handling.
- Cross-origin misuse.

**16.74 Cross-Origin Protection**

The backend shall control which frontend applications are permitted to communicate with protected APIs.

The production environment should not simply allow unrestricted origins unless there is a justified requirement.

The final allowed origins should be configured according to the deployed CarGo Kenya frontend and backend architecture.

**16.75 Request Validation and Sanitization**

The backend should validate and appropriately sanitize user-controlled input.

This applies to:

- Names.
- Addresses.
- Trip descriptions.
- Messages.
- Search terms.
- Payment references.
- Vehicle information.
- Administrative notes.

The objective is to prevent malicious or malformed data from affecting system operations.

**16.76 Security and Database Queries**

Database queries shall be constructed using safe mechanisms.

The system must protect against malicious input being interpreted as database commands.

Developers should use appropriate parameterized queries or ORM/query-builder mechanisms rather than directly concatenating untrusted input into SQL statements.

**16.77 Security and Business Logic**

Security must not be considered only as login protection.

For CarGo Kenya, business-logic security is equally important.

For example:

User is authenticated

does not automatically mean:

User can release payment.

The backend must evaluate:

Authentication

+

Role

+

Resource Ownership

+

Trip Status

+

Business Conditions

+

Permission

before sensitive actions are executed.

**16.78 Security Testing Requirements**

The MVP shall include security testing of critical functions.

Testing should include:

- Invalid login.
- Repeated login attempts.
- Unauthorized trip access.
- Unauthorized wallet access.
- Unauthorized payment release.
- Unauthorized inspection modification.
- Unauthorized GPS access.
- Unauthorized communication access.
- Role manipulation.
- Parameter manipulation.
- Expired authentication.
- Password reset misuse.
- Duplicate sensitive requests.

**16.79 Security Test Example — Wallet**

A developer should test:

Driver A

↓

Attempts to access Driver B wallet

↓

Request Rejected

Expected result:

Driver A:

No access

and:

Security Event:

Recorded where appropriate

**16.80 Security Test Example — Payment Release**

The developer should test:

Driver sends release request

↓

Trip = BOOKED

↓

Required inspection incomplete

↓

Release rejected

Expected:

Driver receives:

No payment release

Trip:

Remains BOOKED / appropriate lifecycle state

No wallet transaction should be created.

**16.81 Security Test Example — Trip Completion**

The developer should test:

Customer attempts to directly set:

status = COMPLETED

Expected:

Request rejected

The trip should only become COMPLETED after the defined delivery and confirmation requirements are satisfied.

**16.82 Security Test Example — Role Manipulation**

The developer should test:

Customer Request:

role = ADMINISTRATOR

Expected:

Role change rejected

The user's role must remain CUSTOMER unless changed through an authorized administrative process.

**16.83 Security Test Example — Duplicate Request**

A sensitive operation such as payment release may be submitted twice:

Request 1

↓

Release KSh 9,000

Request 2

↓

Duplicate

Expected:

Only one wallet transaction

Only KSh 9,000 released

This complements the idempotency requirements already established in the Payment Module.

**16.84 Security and Audit Trail Relationship**

The Security Module shall work closely with the Audit Module.

For example:

Administrator Approves Refund

↓

Refund Processed

↓

Audit Record

↓

Security / Administrative History

The audit system should provide sufficient information to determine who performed sensitive operations.

**16.85 Security Administration Dashboard**

The MVP administrator interface may provide basic security information such as:

- Recent failed login attempts.
- Suspended accounts.
- Locked accounts.
- Recent administrative actions.
- Security-related alerts.
- Password/security events where appropriate.
- Unauthorized access attempts.
- Active security incidents.

Advanced security analytics are not required for the MVP.

**16.86 Security Notifications**

Important security events may generate notifications.

Examples:

**Password Changed**

Your CarGo Kenya account password has been successfully changed.

**Account Suspended**

Your CarGo Kenya account has been temporarily suspended. Please contact support for assistance.

**Security Verification**

Additional verification is required to continue using your account.

The exact messages shall be implemented through the Notification Module.

**16.87 Security Module Business Rules**

The following rules shall be treated as core MVP requirements.

**Rule 1**

Protected system resources shall require authentication.

**Rule 2**

Authentication shall not automatically grant permission to perform every operation.

**Rule 3**

Authorization shall be enforced by the backend.

**Rule 4**

Users shall only access resources they are authorized to access.

**Rule 5**

Customers shall not access other customers' trips or financial information.

**Rule 6**

Drivers shall not access other drivers' private information or wallets.

**Rule 7**

Drivers shall not manually release their own transportation payments.

**Rule 8**

Users shall not directly manipulate trip statuses through unauthorized requests.

**Rule 9**

Financial operations shall be validated independently by the backend.

**Rule 10**

Administrator privileges shall be restricted to authorized accounts.

**Rule 11**

Role changes shall require authorized administrative action.

**Rule 12**

Passwords shall never be stored in plain text.

**Rule 13**

Authentication credentials and payment-provider secrets shall be protected.

**Rule 14**

Sensitive API operations shall validate both authentication and authorization.

**Rule 15**

Important security and administrative events shall be auditable.

**Rule 16**

Suspended or locked accounts shall not continue receiving unrestricted protected access.

**Rule 17**

Sensitive uploaded documents and inspection evidence shall be protected from unauthorized access.

**Rule 18**

Security controls shall not depend solely on frontend restrictions.

**Rule 19**

Critical business operations shall be protected against parameter manipulation.

**Rule 20**

Security failures shall not silently alter the underlying trip, payment, or wallet state.

**16.88 MVP Scope**

**Included in MVP**

The Security, Authentication and Authorization Module shall include:

- Customer authentication.
- Driver authentication.
- Clearing-agent authentication where applicable.
- Administrator authentication.
- Secure password hashing.
- Login.
- Logout.
- Password reset.
- Authentication/session management.
- Role-based access control.
- Permission-based authorization where required.
- Account status management.
- Driver verification access controls.
- Protected API endpoints.
- Resource-level authorization.
- Trip-level authorization.
- Wallet authorization.
- Payment-operation authorization.
- Inspection authorization.
- GPS access authorization.
- Communication authorization.
- Administrative access controls.
- Authentication rate limiting.
- Account locking/protection where required.
- Security event logging.
- Audit integration.
- Secure file access.
- Input validation.
- Secure secret management.
- HTTPS in production.
- Basic security monitoring.
- Protection against unauthorized status changes.
- Protection against privilege escalation.
- Protection against unauthorized financial operations.

**16.89 Not Required for MVP**

The following should remain future enhancements unless implementation requirements change:

- Advanced biometric authentication.
- Facial recognition.
- Hardware security keys.
- Advanced behavioral fraud detection.
- AI-powered threat detection.
- Complex security analytics.
- Enterprise single sign-on.
- Multiple identity providers.
- Advanced device fingerprinting.
- Automated security incident response.
- Advanced security information and event management (SIEM).
- Blockchain-based identity.
- Biometric driver verification.
- Advanced fraud-scoring systems.

These can be introduced after the core CarGo Kenya platform has been validated.

**16.90 Complete Security Architecture**

The CarGo Kenya security architecture can therefore be understood as:

USER

│

↓

AUTHENTICATION

│

┌───────┴────────┐

↓ ↓

ACCOUNT STATUS SESSION

│ │

└───────┬────────┘

↓

AUTHORIZATION

│

┌───────────┼────────────┐

↓ ↓ ↓

ROLE PERMISSION OWNERSHIP

│ │ │

└───────────┼────────────┘

↓

BUSINESS RULES

│

┌───────────┼───────────────┐

↓ ↓ ↓

TRIPS PAYMENTS INSPECTIONS

│ │ │

↓ ↓ ↓

GPS / WALLETS EVIDENCE

TRACKING

│ │ │

└───────────┼───────────────┘

↓

AUDIT TRAIL

│

↓

SECURITY MONITORING

**17.0 REPORTING, DASHBOARDS AND ANALYTICS MODULE**

**17.1 Purpose**

The Reporting, Dashboards and Analytics Module shall provide CarGo Kenya with tools for monitoring, understanding, and evaluating the operational and financial performance of the platform.

The module shall transform information generated by other system modules into understandable reports, dashboards, summaries, and operational indicators.

The module shall provide information relating to:

- Transportation requests.
- Driver quotations.
- Bookings.
- Active trips.
- Completed trips.
- Cancelled trips.
- Disputed trips.
- Vehicle inspections.
- GPS/trip progress.
- Fuel records.
- Customer payments.
- Driver earnings.
- Driver wallet activity.
- Refunds.
- Platform revenue.
- Driver performance.
- Customer activity.
- Trip completion performance.
- Operational exceptions.
- System activity.

The objective of the module is to ensure that CarGo Kenya can answer questions such as:

How many trips are currently active?

How many trips were completed this month?

How much revenue has the platform generated?

How much has been released to drivers?

Which drivers are handling the most trips?

How many trips have been cancelled?

How many disputes are currently unresolved?

Are there operational delays or recurring problems?

The module shall therefore act as the **information and decision-support layer** of the CarGo Kenya MVP.

**17.2 Reporting Philosophy**

The reporting architecture shall follow the principle:

**Operational data should be converted into accurate, understandable, and actionable information.**

Reports must therefore be based on actual system records rather than manually entered figures wherever possible.

For example:

Trip Completed

↓

Trip Record Updated

↓

Reporting Data

↓

Completed Trip Count

↓

Dashboard

Similarly:

Customer Payment

↓

Payment Transaction

↓

Trip Wallet

↓

Financial Reporting

↓

Administrator Dashboard

The reporting system should not create a second independent version of operational data unnecessarily.

The underlying modules remain the authoritative sources of their respective information.

**17.3 Reporting Users**

The MVP shall provide reporting capabilities according to user roles.

The primary reporting users shall be:

1.  Administrators.
2.  Customers.
3.  Drivers.

Different users shall see different information.

For example:

**Administrator**

May view:

- Platform-wide trips.
- Revenue.
- Driver performance.
- Customer activity.
- Disputes.
- Cancellations.
- Payment activity.

**Customer**

May view information relating to their own trips.

**Driver**

May view information relating to their own assignments and earnings.

A user shall never receive access to reports containing information they are not authorized to view.

**17.4 Administrator Dashboard**

The Administrator Dashboard shall provide a high-level overview of the current state of the CarGo Kenya platform.

The dashboard should provide important operational indicators without requiring the administrator to open individual records.

The initial dashboard may include:

- Total registered customers.
- Total registered drivers.
- Pending driver verifications.
- Active transportation requests.
- Trips awaiting driver selection.
- Trips awaiting payment.
- Booked trips.
- Active trips.
- Trips in transit.
- Deliveries pending.
- Completed trips.
- Cancelled trips.
- Disputed trips.
- Pending payments.
- Successful payments.
- Pending driver earnings.
- Released driver earnings.
- Platform revenue.

**17.5 Dashboard Summary Cards**

The administrator dashboard may display important statistics using summary cards.

Example:

┌──────────────────┐

│ ACTIVE TRIPS │

│ 24 │

└──────────────────┘

┌──────────────────┐

│ COMPLETED │

│ 186 │

└──────────────────┘

┌──────────────────┐

│ REVENUE │

│ KSh 167,400 │

└──────────────────┘

┌──────────────────┐

│ DISPUTES │

│ 7 │

└──────────────────┘

These values should be calculated from actual database records.

The frontend should not contain hard-coded dashboard figures.

**17.6 Trip Statistics**

The system shall provide statistics relating to transportation assignments.

The administrator should be able to view:

- Total trips.
- Requested trips.
- Trips in quoting.
- Driver-selected trips.
- Payment-pending trips.
- Booked trips.
- Pickup-pending trips.
- Pickup-inspection trips.
- Trip-start-pending trips.
- Active trips.
- In-transit trips.
- Delivery-pending trips.
- Delivered trips.
- Completed trips.
- Disputed trips.
- Cancelled trips.

These statistics should correspond to the official CarGo Kenya trip statuses defined earlier.

**17.7 Trip Status Distribution**

The dashboard may provide a visual distribution of trips by status.

For example:

Trip Status

REQUESTED 12

QUOTING 18

PAYMENT PENDING 6

BOOKED 15

TRIP ACTIVE 8

IN TRANSIT 11

DELIVERY PENDING 4

COMPLETED 186

DISPUTED 7

CANCELLED 21

This allows administrators to quickly identify where trips are concentrated within the lifecycle.

**17.8 Trip Completion Reporting**

The system shall provide completed-trip statistics.

The administrator may view:

- Number of completed trips.
- Completion rate.
- Average completion time.
- Completed trips by date.
- Completed trips by driver.
- Completed trips by destination.
- Completed trips by pickup location.

The exact metrics may be expanded after MVP validation.

**17.9 Cancellation Reporting**

The reporting module shall provide information about cancelled trips.

Reports may include:

- Total cancellations.
- Cancellations by customer.
- Cancellations by driver.
- Cancellations by trip status.
- Cancellation reasons.
- Cancellation dates.
- Financial consequences of cancellations.

For example:

Cancellations This Month

Customer Cancellation 12

Driver Cancellation 7

Administrative 3

System/Other 1

Total 23

The system should preserve the original cancellation record.

**17.10 Dispute Reporting**

The dashboard shall provide information about disputes.

Administrators should be able to see:

- Open disputes.
- Resolved disputes.
- Disputes awaiting evidence.
- Disputes awaiting administrator action.
- Disputes by category.
- Disputes by trip.
- Disputes by customer.
- Disputes by driver.

Example:

DISPUTES

Open 7

Under Review 4

Resolved 31

Escalated 2

This information should be derived from the Dispute Module.

**17.11 Driver Performance Reporting**

The system shall provide basic driver performance information.

Possible indicators include:

- Number of trips completed.
- Number of trips cancelled.
- Number of disputes.
- Average rating.
- Total driver earnings.
- Pending earnings.
- Completed assignments.
- Failed pickups.
- Delivery completion rate.
- Inspection compliance.
- GPS/tracking compliance where applicable.

The purpose is not to create an unnecessarily complex driver scoring system.

The MVP should primarily provide factual operational information.

**17.12 Driver Ranking**

The system may provide basic driver rankings based on approved metrics.

For example:

Driver Performance

Driver Trips Rating Completion

Driver A 42 4.8 98%

Driver B 37 4.7 95%

Driver C 31 4.6 94%

Any ranking displayed to administrators should be based on clearly defined metrics.

The MVP should avoid hidden or unexplained scoring formulas.

**17.13 Customer Activity Reporting**

The system shall provide basic customer activity information.

Administrators may view:

- Number of transportation requests.
- Number of quotations received.
- Number of booked trips.
- Number of completed trips.
- Number of cancelled trips.
- Total amount paid.
- Active trips.
- Disputes raised.

Customers themselves should only see information associated with their own account.

**17.14 Payment Reporting**

The Reporting Module shall integrate with the Payment and Wallet Module to provide financial summaries.

The administrator may view:

- Total customer payments.
- Successful payments.
- Failed payments.
- Pending payments.
- Refunds.
- Partial refunds.
- Driver payments released.
- Pending driver earnings.
- Platform fees.
- Financial adjustments.

Example:

Financial Summary

Customer Payments KSh 850,000

Driver Earnings KSh 620,000

Fuel Allocations KSh 190,000

CarGo Fees KSh 40,000

Refunds KSh 15,000

The exact accounting presentation shall follow the financial architecture defined in Chapter 12.

**17.15 Platform Revenue Reporting**

The system shall provide basic information regarding CarGo Kenya's platform revenue.

Revenue should primarily be derived from recorded platform fees.

For example:

Trip 001 → Platform Fee = KSh 900

Trip 002 → Platform Fee = KSh 1,100

Trip 003 → Platform Fee = KSh 750

Total platform revenue:

KSh 2,750

The system should distinguish:

**Platform Revenue**

from:

**Customer Payment**

and:

**Driver Earnings**

This distinction is important because the customer's total payment is not equivalent to CarGo Kenya's revenue.

**17.16 Driver Earnings Reporting**

The system shall provide driver earnings information.

A driver may view:

- Total earnings.
- Released earnings.
- Pending earnings.
- First 50% releases.
- Final 50% releases.
- Withdrawals.
- Available wallet balance.

Example:

Driver Earnings

Total Trip Earnings KSh 48,000

Released KSh 36,000

Pending KSh 12,000

Withdrawn KSh 25,000

Available KSh 11,000

The reporting layer must obtain these values from the Driver Personal Wallet and related transaction records.

**17.17 Fuel Reporting**

The system shall provide basic fuel-related reports.

Reports may include:

- Total fuel budgets.
- Fuel records.
- Fuel expenditure where recorded.
- Fuel stops.
- Fuel amounts.
- Fuel receipts where applicable.
- Trips with missing fuel records.

The system should distinguish:

**Fuel Budget**

from:

**Actual Fuel Expenditure**

where actual expenditure information exists.

The MVP should not claim that allocated fuel was consumed unless supporting records exist.

**17.18 Vehicle Inspection Reporting**

The reporting module shall provide information derived from vehicle inspections.

Administrators may view:

- Completed pickup inspections.
- Completed delivery inspections.
- Pending inspections.
- Inspection discrepancies.
- Missing photographs.
- Missing odometer readings.
- Missing fuel records.
- Vehicle condition disputes.

Example:

Inspection Summary

Pickup Inspections 180

Delivery Inspections 162

Pending 8

Discrepancies 6

The Vehicle Inspection Module remains responsible for the actual inspection records.

**17.19 GPS and Trip Monitoring Reports**

The reporting module may provide summary information from the GPS/Tracking Module.

Examples include:

- Active tracked trips.
- Trips with tracking enabled.
- Trips with tracking interruptions.
- Last-known tracking status.
- Major route deviations where supported.
- Tracking completion.

The reporting module should not become responsible for collecting raw GPS coordinates.

The GPS module remains responsible for tracking.

**17.20 Operational Exception Dashboard**

The administrator dashboard should highlight situations requiring attention.

Examples include:

- Failed payments.
- Failed pickups.
- Inspection discrepancies.
- Tracking interruptions.
- Unresolved disputes.
- Failed refunds.
- Failed withdrawals.
- Trips stuck in a status for unusually long periods.
- Driver verification problems.

Example:

ACTION REQUIRED

⚠ 4 Payment Failures

⚠ 2 Pickup Issues

⚠ 3 Inspection Discrepancies

⚠ 7 Open Disputes

⚠ 2 Failed Withdrawals

This allows administrators to focus on exceptions instead of manually reviewing every trip.

**17.21 Date and Time Filtering**

Reports should support basic date filtering.

The administrator may select:

- Today.
- Yesterday.
- Last 7 days.
- Last 30 days.
- This month.
- Previous month.
- Custom date range.

For example:

From: 01/08/2026

To: 08/08/2026

The system should return records falling within the selected period according to the relevant timestamp.

**17.22 Report Filtering**

Reports should support relevant filters.

Depending on the report, filters may include:

- Trip status.
- Driver.
- Customer.
- Location.
- Destination.
- Payment status.
- Date.
- Dispute status.
- Cancellation reason.
- Vehicle.
- Inspection status.

Filtering should occur through the backend where appropriate rather than loading an unnecessarily large dataset into the browser.

**17.23 Report Search**

Administrators should be able to search for specific records.

Examples:

Search:

CGK-2026-000125

or:

Search:

Driver Name

or:

Payment Reference

The system should return only records the administrator is authorized to access.

**17.24 Report Export**

The MVP may support exporting selected reports.

Possible formats include:

- CSV.
- Excel-compatible spreadsheet.
- PDF where practical.

For example:

Completed Trips

↓

Apply Filters

↓

Generate Report

↓

Export CSV

Export functionality should respect administrator permissions.

Sensitive information should not be included unnecessarily.

**17.25 Dashboard Refresh**

Dashboard information should be refreshed from current system data.

The MVP may support:

- Manual refresh.
- Automatic refresh for selected operational indicators.

For example, active-trip information may refresh periodically.

However, the system should avoid unnecessary high-frequency requests that could place excessive load on the backend.

**17.26 Real-Time vs Historical Reporting**

The system should distinguish between:

**Operational/near-real-time information**

and:

**Historical reporting.**

For example:

Active Trips should reflect relatively current system state.

Monthly revenue is historical information calculated from recorded financial transactions.

This distinction will help developers determine when data should be queried directly and when aggregated reporting data may be appropriate.

**17.27 Reporting Data Sources**

The Reporting Module shall obtain information from existing system modules.

Conceptually:

USER MODULE

↓

TRIP MODULE

↓

INSPECTION MODULE

↓

GPS MODULE

↓

PAYMENT MODULE

↓

WALLET MODULE

↓

DISPUTE MODULE

↓

RATING MODULE

↓

REPORTING MODULE

↓

DASHBOARDS / REPORTS

The Reporting Module should not unnecessarily duplicate the complete datasets of other modules.

**17.28 Reporting Service**

The backend should ideally provide a dedicated reporting service responsible for:

- Retrieving reporting data.
- Applying filters.
- Calculating permitted metrics.
- Generating summaries.
- Preparing export datasets.
- Enforcing reporting permissions.
- Supporting dashboard queries.

This keeps reporting logic separate from transactional business logic.

**17.29 Reporting API Concept**

The exact API endpoints shall be finalized during API design.

Conceptual examples include:

GET /admin/dashboard

GET /admin/reports/trips

GET /admin/reports/payments

GET /admin/reports/drivers

GET /admin/reports/customers

GET /admin/reports/disputes

GET /admin/reports/inspections

GET /admin/reports/fuel

GET /admin/reports/revenue

Export operations may conceptually include:

GET /admin/reports/trips/export

GET /admin/reports/payments/export

These are architectural examples rather than final API specifications.

**17.30 Dashboard Authorization**

Dashboard access shall be role-based.

For example:

Administrator

↓

Full Administrative Dashboard

Driver

↓

Personal Driver Dashboard

Customer

↓

Personal Customer Dashboard

A driver must not be able to modify the URL or API request to obtain the administrator dashboard.

The backend must independently enforce authorization.

**17.31 Customer Dashboard**

The customer dashboard shall provide information relevant to the customer's transportation activity.

It may include:

- Active trips.
- Pending requests.
- Available quotations.
- Booked trips.
- Completed trips.
- Cancelled trips.
- Pending payments.
- Recent notifications.

Example:

MY TRIPS

Active 1

Awaiting Payment 2

Completed 14

Cancelled 1

The customer should not see platform-wide statistics.

**17.32 Driver Dashboard**

The driver dashboard shall provide information relevant to the driver's activities.

It may include:

- Available transportation requests.
- Active assignment.
- Upcoming pickup.
- Completed trips.
- Total earnings.
- Pending earnings.
- Available wallet balance.
- Ratings.
- Notifications.

Example:

DRIVER DASHBOARD

Active Trip 1

Completed Trips 28

Pending Earnings KSh 9,000

Available Wallet KSh 24,000

Rating 4.8

**17.33 Analytics Principles**

The MVP analytics functionality shall focus on **descriptive analytics**.

This means the system primarily answers:

What has happened?

Examples:

- How many trips were completed?
- How much revenue was generated?
- How many drivers are active?
- How many cancellations occurred?

The MVP does not need advanced predictive analytics.

**17.34 Future Predictive Analytics**

Future versions may introduce:

- Demand forecasting.
- Driver demand prediction.
- Route performance analysis.
- Cancellation prediction.
- Revenue forecasting.
- Driver availability prediction.
- Automated operational recommendations.

These features should remain outside the core MVP unless specifically approved.

**17.35 Performance Metrics**

The system may calculate basic operational performance indicators.

Examples include:

**Trip Completion Rate**

Completed Trips

\-------------------------- × 100

Total Eligible Trips

**Cancellation Rate**

Cancelled Trips

\-------------------------- × 100

Total Trips

**Driver Completion Rate**

Driver Completed Trips

\-------------------------- × 100

Driver Assigned Trips

The exact definitions must be fixed before implementation so that different parts of the system do not calculate the same metric differently.

**17.36 Metric Consistency**

A major developer requirement is that the same metric should have one official definition.

For example, if:

**Completed Trips**

means trips whose status is:

COMPLETED

then all dashboards and reports should use that definition.

The system should avoid having one dashboard treat DELIVERED as completed while another treats only COMPLETED as completed.

This ensures consistency across CarGo Kenya.

**17.37 Financial Reporting Integrity**

Financial reports shall use recorded financial transactions rather than relying only on mutable wallet balances.

For example:

Payment Transactions

↓

Transaction Ledger

↓

Financial Report

The system should preserve the financial history defined in Chapter 12.

Reports must not silently alter financial records.

**17.38 Reporting Auditability**

Important reports should be traceable back to their source records.

For example:

Revenue Report

↓

Payment Transactions

↓

Trip Wallet

↓

Specific Trip

If an administrator sees:

Platform Revenue = KSh 90,000

the underlying transactions should be identifiable.

**17.39 Dashboard Error Handling**

If reporting data cannot be retrieved, the system should display an appropriate error rather than showing misleading values.

For example:

Unable to load payment statistics.

Please try again.

The system should not display:

Revenue = KSh 0

when the database query actually failed.

This distinction is important because zero and unavailable are not the same thing.

**17.40 Report Generation Performance**

Reports involving large datasets should be designed carefully.

The system should use:

- Pagination.
- Filtering.
- Indexed database queries.
- Aggregation where appropriate.
- Date restrictions.
- Efficient database queries.

The system should avoid loading thousands of records into the frontend unnecessarily.

**17.41 Reporting and Data Privacy**

Reports may contain sensitive information.

The system should therefore restrict access to:

- Customer information.
- Driver information.
- Payment information.
- Wallet information.
- Contact information.
- Dispute information.

Users should only receive information required for their role.

**17.42 Reporting and Notifications**

The Reporting Module may work with the Notification Module for important operational alerts.

For example:

Reporting System

↓

Detect Operational Exception

↓

Notification Service

↓

Administrator Alert

Example:

5 trips have remained in PICKUP PENDING

for longer than the configured operational threshold.

The reporting module identifies the condition, while the notification module communicates it.

**17.43 Reporting and Administration**

The Administration Module shall remain responsible for administrative control.

The Reporting Module shall provide the information administrators need to make decisions.

Therefore:

**Administration = Control**

**Reporting = Information**

For example:

Reporting:

7 unresolved disputes.

Administration:

Administrator opens and manages those disputes.

This separation prevents the two modules from becoming unnecessarily duplicated.

**17.44 Reporting and Payment**

The Payment Module remains responsible for financial transactions.

The Reporting Module summarizes those transactions.

For example:

Payment Module

↓

KSh 24,900 Customer Payment

↓

Reporting Module

↓

Successful Payments Report

The Reporting Module must never independently create or modify a payment.

**17.45 Reporting and Trip Lifecycle**

The Reporting Module shall follow the official trip statuses:

REQUESTED

↓

QUOTING

↓

DRIVER SELECTED

↓

PAYMENT PENDING

↓

BOOKED

↓

PICKUP PENDING

↓

PICKUP INSPECTION

↓

TRIP START PENDING

↓

TRIP ACTIVE

↓

IN TRANSIT

↓

DELIVERY PENDING

↓

DELIVERED

↓

COMPLETED

It shall also report:

DISPUTED

CANCELLED

where applicable.

This ensures consistency with the trip lifecycle established in the earlier chapters.

**17.46 Report Historical Accuracy**

Historical reports should preserve information based on the state of the transaction at the relevant time.

For example, if a trip originally had:

Driver Fee = KSh 18,000

Fuel = KSh 6,000

CarGo Fee = KSh 900

a later change to global pricing configuration must not rewrite the historical trip's financial report.

This follows the price-snapshot principle established in Chapter 12.

**17.47 Dashboard and Reporting Business Rules**

The following rules shall be treated as core MVP requirements.

**Rule 1**

Reports shall be based on actual system records.

**Rule 2**

Dashboard statistics shall use officially defined metrics.

**Rule 3**

Users shall only access reports they are authorized to view.

**Rule 4**

Financial reports shall use recorded payment and wallet transactions.

**Rule 5**

Reporting shall not modify the underlying operational transactions.

**Rule 6**

Trip reports shall follow the official CarGo Kenya trip statuses.

**Rule 7**

Historical financial information shall remain consistent with the original transaction records.

**Rule 8**

Report filtering shall be performed securely.

**Rule 9**

Sensitive information shall not be exposed unnecessarily.

**Rule 10**

Failed reporting queries shall not be presented as zero values.

**Rule 11**

Important reported figures should be traceable to their underlying records.

**Rule 12**

The Reporting Module shall remain separate from administrative control functions.

**17.48 MVP Reporting Scope**

**Included in MVP**

The Reporting, Dashboards and Analytics Module shall include:

- Administrator dashboard.
- Customer dashboard.
- Driver dashboard.
- Trip statistics.
- Trip-status reporting.
- Completed-trip reporting.
- Cancellation reporting.
- Dispute reporting.
- Driver performance information.
- Customer activity information.
- Payment summaries.
- Platform revenue summaries.
- Driver earnings summaries.
- Fuel summaries.
- Vehicle inspection summaries.
- Basic GPS/tracking summaries.
- Operational exception indicators.
- Date filtering.
- Basic report filtering.
- Search.
- Basic report export.
- Dashboard summary cards.
- Basic descriptive analytics.
- Role-based reporting access.
- Financial reporting consistency.
- Reporting auditability.

**17.49 Not Required for MVP**

The following should remain future features:

- Predictive analytics.
- AI-powered business recommendations.
- Machine-learning demand forecasting.
- Advanced financial forecasting.
- Complex BI/data warehouse infrastructure.
- Automated anomaly prediction.
- Advanced driver scoring algorithms.
- Real-time enterprise analytics.
- Advanced visualization systems.
- Automated strategic recommendations.
- Advanced customer segmentation.
- Predictive cancellation models.
- Complex geographic analytics.
- AI-generated management reports.

These features may be introduced after the CarGo Kenya marketplace has sufficient operational data.

**17.50 Complete Reporting Lifecycle**

The Reporting Module shall operate as an information layer across the entire CarGo Kenya system:

CUSTOMER

↓

TRANSPORTATION REQUEST

↓

QUOTATIONS

↓

DRIVER SELECTED

↓

PAYMENT

↓

BOOKING

↓

PICKUP / INSPECTION

↓

TRIP ACTIVE

↓

GPS / IN TRANSIT

↓

DELIVERY

↓

COMPLETED

↓

PAYMENT RELEASE

↓

RATING

↓

REPORTING

↓

DASHBOARDS

↓

ADMINISTRATIVE DECISION-MAKING

**17.51 Final Reporting Architecture**

The CarGo Kenya Reporting, Dashboards and Analytics Module can therefore be understood as:

CARGo KENYA SYSTEM

│

┌────────────────┼────────────────┐

↓ ↓ ↓

TRIPS PAYMENTS OPERATIONS

│ │ │

↓ ↓ ↓

INSPECTIONS WALLETS GPS

│ │ │

└────────────────┼────────────────┘

↓

REPORTING SERVICE

│

┌──────────────┼──────────────┐

↓ ↓ ↓

DASHBOARD REPORTS ANALYTICS

│ │ │

└──────────────┼──────────────┘

↓

AUTHORIZED USERS

│

┌──────────────┼──────────────┐

↓ ↓ ↓

ADMIN DRIVER CUSTOMER

**18.0 DATABASE & DATA MANAGEMENT MODULE**

**18.1 Purpose**

The Database and Data Management Module shall provide the central data foundation for the CarGo Kenya platform.

The module shall define how information is:

- Created.
- Stored.
- Related.
- Updated.
- Retrieved.
- Protected.
- Audited.
- Archived.
- Maintained.
- Used by the different system modules.

The database shall support the complete CarGo Kenya transportation lifecycle, including:

- Customer accounts.
- Driver accounts.
- Driver verification.
- Transportation requests.
- Driver quotations.
- Driver selection.
- Trips.
- Vehicles.
- Vehicle inspections.
- Pickup and delivery records.
- GPS/tracking information.
- Fuel records.
- Payments.
- Trip Wallets.
- Driver Personal Wallets.
- Wallet transactions.
- Refunds.
- Withdrawals.
- Notifications.
- Trip communication.
- Disputes.
- Ratings and reviews.
- Reports and dashboards.
- Audit records.

The database shall therefore act as the **single source of truth** for the CarGo Kenya MVP.

**18.2 Database Design Philosophy**

The database shall be designed around the principle:

**Every important CarGo Kenya operation must have a reliable, traceable, and properly related data record.**

The system should not depend on information existing only in:

- Frontend screens.
- Browser storage.
- Temporary application variables.
- User-submitted text.
- External payment-provider responses.
- GPS devices.
- Notification services.

Important information must ultimately be recorded in the CarGo Kenya backend database.

For example:

Customer selects driver

↓

Database records selected driver

↓

Trip updated

↓

Price snapshot preserved

↓

Payment created

↓

Trip Wallet created

↓

Booking confirmed

This ensures that the complete operation can later be reconstructed from the database.

**18.3 Database Technology**

The CarGo Kenya MVP should use a relational database management system.

A suitable implementation may use:

**PostgreSQL**

PostgreSQL is appropriate because the CarGo Kenya system contains highly related transactional data involving:

- Users.
- Trips.
- Payments.
- Wallets.
- Inspections.
- Vehicles.
- Notifications.
- Financial transactions.

The relational model will allow the system to enforce relationships and data integrity.

The final production configuration may include:

- PostgreSQL database.
- Database connection pooling.
- Database migrations.
- Automated backups.
- Transaction management.
- Indexing.
- Monitoring.

**18.4 Database Architecture**

The overall database architecture shall conceptually operate as:

CARGo Kenya Application

│

↓

Backend/API Layer

│

↓

Database Access Layer

│

↓

PostgreSQL Database

│

├── User Data

├── Trip Data

├── Vehicle Data

├── Inspection Data

├── Payment Data

├── Wallet Data

├── Communication Data

├── Tracking Data

├── Reporting Data

└── Audit Data

The frontend should not connect directly to the database.

The correct architecture is:

Frontend

↓

API

↓

Business Logic

↓

Database

This prevents users from bypassing application-level authorization and business rules.

**18.5 Database as the System of Record**

The database shall be treated as the authoritative source for important system information.

For example:

If the frontend displays:

TRIP ACTIVE

the backend should obtain the authoritative trip status from the database.

Similarly:

If the driver sees:

Available Wallet Balance:

KSh 9,000

the balance must be derived from the authoritative wallet records rather than from a value stored only in the browser.

The frontend should therefore be considered a presentation layer rather than the source of truth.

**18.6 Core Data Domains**

The CarGo Kenya database shall be organized conceptually around the following major data domains:

1.  User and Account Data
2.  Driver Verification Data
3.  Customer Data
4.  Driver Data
5.  Vehicle Data
6.  Transportation Request Data
7.  Quotation Data
8.  Trip Data
9.  Inspection Data
10. Fuel and Operational Data
11. GPS and Tracking Data
12. Payment Data
13. Trip Wallet Data
14. Driver Wallet Data
15. Refund and Adjustment Data
16. Withdrawal Data
17. Notification Data
18. Communication Data
19. Dispute Data
20. Rating and Review Data
21. Reporting Data
22. Audit Data
23. System Configuration Data

These domains should remain logically separated even where they interact.

**18.7 User Data**

The system shall maintain a central user record for every registered platform user.

A user record may contain:

| **Field** | **Description** |
| --- | --- |
| User ID | Unique user identifier |
| Role | Customer, Driver, Administrator, etc. |
| Full Name | User's registered name |
| Email | Registered email |
| Phone | Registered phone number |
| Password Hash | Securely stored password hash |
| Account Status | Active, suspended, pending, etc. |
| Verification Status | Applicable verification state |
| Created At | Account creation time |
| Updated At | Last update time |
| Last Login At | Most recent login |

The exact implementation may separate role-specific information into additional tables.

**18.8 User Roles**

The database shall support the roles established in the CarGo Kenya system.

At minimum, the MVP shall support:

- Customer.
- Driver.
- Administrator.

Where applicable, additional controlled roles may include:

- Clearing Agent.
- Support/Operations Administrator.
- Finance Administrator.

However, additional roles should only be implemented where required by the approved MVP scope.

A user should not receive permissions simply because a frontend screen is available to them.

Role authorization must be enforced by the backend.

**18.9 Customer Data**

Customer-specific information may be maintained separately from the central user record.

Customer data may include:

- Customer ID.
- User ID.
- Customer type.
- Organization/company information where applicable.
- Preferred contact information.
- Account status.
- Registration details.
- Created At.
- Updated At.

A customer may create multiple transportation requests and trips.

Therefore:

CUSTOMER

│

├── Request 1

├── Request 2

├── Request 3

└── Request N

**18.10 Driver Data**

Driver-specific information shall be stored separately from the central user account where appropriate.

Driver data may include:

- Driver ID.
- User ID.
- License information.
- Verification status.
- Availability status.
- Driver rating.
- Completed trip count.
- Registration information.
- Emergency/contact information where required.
- Created At.
- Updated At.

The system should avoid storing sensitive driver information unnecessarily.

**18.11 Driver Verification Data**

Driver verification shall have its own records so that verification history can be maintained.

A verification record may contain:

| **Field** | **Description** |
| --- | --- |
| Verification ID | Unique verification record |
| Driver ID | Driver being verified |
| Document Type | Type of submitted document |
| Document Reference | Secure document reference |
| Status | Pending, approved, rejected |
| Submitted At | Submission time |
| Reviewed At | Review time |
| Reviewed By | Administrator |
| Rejection Reason | Reason where applicable |

The system should not simply overwrite verification history.

For example:

Verification 1 → REJECTED

Verification 2 → RESUBMITTED

Verification 3 → APPROVED

This provides an audit history.

**18.12 Vehicle Data**

The database shall maintain vehicle information relevant to transportation assignments.

A vehicle record may contain:

- Vehicle ID.
- Registration number.
- Make.
- Model.
- Year.
- Vehicle type.
- Fuel type.
- Current odometer where applicable.
- Ownership information.
- Vehicle status.
- Created At.
- Updated At.

A vehicle may participate in multiple trips over time.

Therefore, vehicle information should not be duplicated unnecessarily inside every trip record.

**18.13 Transportation Request Data**

Every customer transportation request shall have a persistent database record.

A request may contain:

- Request ID.
- Customer ID.
- Vehicle ID.
- Pickup location.
- Destination.
- Requested pickup date/time.
- Vehicle information.
- Special instructions.
- Request status.
- Created At.
- Updated At.

The request represents the customer's original transportation requirement.

It should remain distinguishable from the eventual Trip record.

**18.14 Request Status**

The database shall store the current request status.

Possible statuses may include:

- REQUESTED.
- QUOTING.
- DRIVER SELECTED.
- PAYMENT PENDING.
- BOOKED.
- CANCELLED.

Once a request becomes an active trip, the relevant Trip record becomes the primary operational record.

The original request should nevertheless remain preserved for historical purposes.

**18.15 Quotation Data**

Each driver quotation shall be stored as a separate record.

A quotation may contain:

- Quotation ID.
- Request ID.
- Driver ID.
- Transportation fee.
- Fuel budget.
- Platform fee where applicable.
- Total quoted amount.
- Quotation notes.
- Quotation status.
- Submitted At.
- Updated At.

A request may therefore have:

REQUEST

│

├── DRIVER QUOTATION 1

├── DRIVER QUOTATION 2

├── DRIVER QUOTATION 3

└── DRIVER QUOTATION N

**18.16 Quotation Status**

The quotation record should maintain its own status.

Possible statuses include:

- SUBMITTED.
- ACCEPTED.
- REJECTED.
- WITHDRAWN.
- EXPIRED.

Only the appropriate quotation should become associated with the selected driver.

**18.17 Trip Data**

The Trip table shall represent the actual transportation assignment.

A Trip record may contain:

| **Field** | **Description** |
| --- | --- |
| Trip ID | Unique trip identifier |
| Trip Reference | Human-readable reference such as CGK-2026-000125 |
| Request ID | Original transportation request |
| Customer ID | Customer |
| Driver ID | Assigned driver |
| Vehicle ID | Vehicle being transported |
| Pickup Location | Pickup point |
| Destination | Delivery destination |
| Trip Status | Current official status |
| Scheduled Pickup | Planned pickup time |
| Actual Pickup | Actual pickup time |
| Trip Started At | Official start |
| Delivered At | Delivery completion |
| Completed At | Final completion |
| Created At | Creation timestamp |
| Updated At | Last update |

The Trip record is central to the system.

**18.18 Trip Status Integrity**

The Trip Status field shall follow the official CarGo Kenya lifecycle established earlier.

The MVP statuses are:

REQUESTED

QUOTING

DRIVER SELECTED

PAYMENT PENDING

BOOKED

PICKUP PENDING

PICKUP INSPECTION

TRIP START PENDING

TRIP ACTIVE

IN TRANSIT

DELIVERY PENDING

DELIVERED

COMPLETED

DISPUTED

CANCELLED

The database should prevent invalid state transitions through backend business logic.

For example:

PAYMENT PENDING

↓

BOOKED

is valid after successful payment.

But:

PAYMENT PENDING

↓

COMPLETED

should not be permitted.

**18.19 Trip Status History**

The system should maintain a Trip Status History record.

This is important because storing only the current status does not show how the trip reached that status.

A status-history record may contain:

- History ID.
- Trip ID.
- Previous Status.
- New Status.
- Changed By.
- Change Reason.
- Timestamp.
- Related Event.

Example:

REQUESTED

↓

QUOTING

↓

DRIVER SELECTED

↓

PAYMENT PENDING

↓

BOOKED

↓

PICKUP PENDING

↓

PICKUP INSPECTION

↓

TRIP START PENDING

↓

TRIP ACTIVE

↓

IN TRANSIT

↓

DELIVERY PENDING

↓

DELIVERED

↓

COMPLETED

This is valuable for debugging, reporting, and disputes.

**18.20 Price Snapshot Data**

Once a quotation is accepted and payment is being processed, the system shall preserve the agreed financial values.

The price snapshot shall contain:

- Driver transportation fee.
- Fuel budget.
- CarGo Kenya platform fee.
- Total trip cost.
- Pricing basis.
- Applicable adjustments.
- Currency.
- Snapshot creation time.

The purpose is to prevent future configuration changes from modifying historical trips.

For example:

Original Driver Fee:

KSh 18,000

Original Fuel:

KSh 6,000

Original CarGo Fee:

KSh 900

These values should remain associated with the trip even if future pricing rules change.

**18.21 Vehicle Inspection Data**

Vehicle inspections shall be stored independently from normal trip information.

An inspection record may contain:

- Inspection ID.
- Trip ID.
- Vehicle ID.
- Inspection Type.
- Inspector/Driver ID.
- Odometer Reading.
- Fuel Level.
- Vehicle Condition.
- Damage Information.
- Inspection Status.
- Inspection Date/Time.
- Customer Confirmation.
- Driver Confirmation.

Inspection types should include at minimum:

- PICKUP.
- DELIVERY.

**18.22 Inspection Evidence**

Inspection photographs and supporting evidence shall have dedicated records.

An evidence record may contain:

- Evidence ID.
- Inspection ID.
- File reference.
- Evidence type.
- Capture time.
- Uploaded by.
- Description.
- File integrity/reference information.

Inspection evidence should not be stored only as ordinary chat attachments.

The relationship should be:

TRIP

↓

INSPECTION

↓

INSPECTION EVIDENCE

├── Front

├── Rear

├── Left

├── Right

├── Interior

└── Damage Evidence

**18.23 Fuel Data**

Fuel information shall be maintained separately from financial wallet records.

A fuel record may contain:

- Fuel Record ID.
- Trip ID.
- Driver ID.
- Location.
- Fuel amount.
- Fuel quantity where captured.
- Odometer reading.
- Receipt reference.
- Supporting evidence.
- Recorded At.

The fuel record represents operational evidence.

The Trip Wallet represents financial allocation.

These concepts should remain separate.

**18.24 GPS and Tracking Data**

The system may maintain GPS/tracking records associated with active trips.

A tracking record may contain:

- Tracking ID.
- Trip ID.
- Driver ID.
- Latitude.
- Longitude.
- Timestamp.
- Accuracy.
- Speed where available.
- Heading where available.
- Source.
- Tracking status.

The system should avoid storing GPS data at unnecessarily high frequency if that would create excessive database growth.

The final tracking frequency should be determined during implementation and testing.

**18.25 Payment Data**

Payment information shall be separated into appropriate financial records.

The database should support:

- Payment transactions.
- Payment provider references.
- Payment status.
- Payment amounts.
- Payment dates.
- Refunds.
- Adjustments.

A payment transaction may contain:

- Transaction ID.
- Trip ID.
- Customer ID.
- Amount.
- Currency.
- Payment Method.
- Provider.
- Provider Reference.
- Status.
- Initiated At.
- Confirmed At.
- Failure Reason.

**18.26 Trip Wallet Data**

Each trip shall have a dedicated Trip Wallet.

Conceptually:

TRIP

↓

TRIP WALLET

↓

TRANSACTION LEDGER

The Trip Wallet shall be associated with only one trip.

It shall track the financial activity associated with that trip, including:

- Customer payment.
- Driver transportation fee.
- Fuel budget.
- CarGo platform fee.
- Driver release amounts.
- Refunds.
- Adjustments.

**18.27 Driver Personal Wallet Data**

The Driver Personal Wallet shall belong to the driver rather than to an individual trip.

The relationship is:

DRIVER

↓

PERSONAL WALLET

↓

WALLET TRANSACTIONS

The wallet shall contain or derive:

- Available balance.
- Pending earnings where applicable.
- Released earnings.
- Withdrawal transactions.

A driver should normally have one active Personal Wallet in the MVP.

**18.28 Financial Ledger**

Financial movements should be recorded through transaction records rather than relying solely on mutable balance fields.

For example:

CUSTOMER PAYMENT

+24,900

DRIVER RELEASE

\-9,000

DRIVER RELEASE

\-9,000

FUEL ALLOCATION

\-6,000

CARGO PLATFORM FEE

\-900

The exact accounting representation may differ during implementation.

However, every financial movement should have:

- Amount.
- Direction.
- Type.
- Related trip.
- Related user/wallet.
- Reference.
- Timestamp.
- Status.

**18.29 Financial Transaction Immutability**

Financial transaction records should not normally be deleted.

If a correction is required, the system should preferably create a correcting transaction or adjustment.

For example:

Original Transaction

KSh 6,000

Correction

\-KSh 1,000

Adjustment

+KSh 1,000

This preserves the history.

Deleting the original financial transaction would make reconciliation and auditing difficult.

**18.30 Refund Data**

Refunds shall be stored separately from the original payment.

A refund record may contain:

- Refund ID.
- Original payment ID.
- Trip ID.
- Customer ID.
- Refund amount.
- Reason.
- Status.
- Authorized By.
- Provider Reference.
- Initiated At.
- Completed At.

Possible statuses include:

- REFUND PENDING.
- REFUNDED.
- FAILED.

**18.31 Withdrawal Data**

Driver withdrawals shall have their own records.

A withdrawal record may contain:

- Withdrawal ID.
- Driver ID.
- Wallet ID.
- Amount.
- Destination.
- Status.
- Provider Reference.
- Requested At.
- Completed At.
- Failure Reason.

The system must verify wallet availability before creating a successful withdrawal.

**18.32 Notification Data**

Notifications shall be stored so that users can access their notification history.

A notification record may contain:

- Notification ID.
- User ID.
- Trip ID.
- Notification Type.
- Title.
- Message.
- Channel.
- Status.
- Priority.
- Created At.
- Sent At.
- Read At.

The database should support unread/read tracking.

**18.33 Communication Data**

Trip communication shall be associated with the relevant trip.

A message record may contain:

- Message ID.
- Trip ID.
- Sender ID.
- Recipient ID.
- Message Content.
- Message Type.
- Status.
- Sent At.
- Delivered At.
- Read At.
- Attachment Reference where applicable.

The system must verify that both sender and recipient are authorized to communicate within the relevant trip.

**18.34 Dispute Data**

Disputes shall have dedicated records.

A dispute record may contain:

- Dispute ID.
- Trip ID.
- Raised By.
- Dispute Type.
- Description.
- Status.
- Priority.
- Assigned Administrator.
- Resolution.
- Created At.
- Resolved At.

Supporting evidence should be associated with the dispute without altering the original trip records.

**18.35 Rating and Review Data**

After successful completion, customers and drivers may provide ratings according to the approved rating design.

A rating record may contain:

- Rating ID.
- Trip ID.
- Reviewer ID.
- Reviewed User ID.
- Rating Value.
- Review Comment.
- Created At.

The database should prevent unauthorized duplicate ratings for the same trip where the business rules require one rating per party.

**18.36 Audit Log Data**

Important system actions shall be recorded in an Audit Log.

An audit record may contain:

| **Field** | **Description** |
| --- | --- |
| Audit ID | Unique audit record |
| Actor ID | User/system performing action |
| Action | Action performed |
| Entity Type | Affected entity |
| Entity ID | Affected record |
| Previous Value | Previous state where appropriate |
| New Value | New state where appropriate |
| IP Address | Source address where appropriate |
| Timestamp | Date/time |
| Metadata | Additional information |

Examples:

ADMIN APPROVED DRIVER

ADMIN REFUNDED TRIP

DRIVER STARTED TRIP

CUSTOMER CONFIRMED TRIP START

ADMIN CHANGED TRIP STATUS

PAYMENT RELEASED

**18.37 Database Relationships**

The major relationships should conceptually follow:

USER

│

├── CUSTOMER

│ │

│ └── REQUEST

│ │

│ ├── QUOTATIONS

│ │ │

│ │ └── DRIVER

│ │

│ └── TRIP

│ │

│ ├── VEHICLE

│ ├── INSPECTIONS

│ ├── FUEL RECORDS

│ ├── GPS RECORDS

│ ├── PAYMENTS

│ ├── TRIP WALLET

│ ├── NOTIFICATIONS

│ ├── COMMUNICATION

│ ├── DISPUTES

│ ├── RATINGS

│ └── AUDIT RECORDS

│

└── DRIVER

│

└── PERSONAL WALLET

│

├── WALLET TRANSACTIONS

└── WITHDRAWALS

This provides a high-level view of how the major database entities interact.

**18.38 Primary Keys**

Every major database entity shall have a unique primary key.

Examples:

user_id

customer_id

driver_id

vehicle_id

request_id

quotation_id

trip_id

inspection_id

payment_id

wallet_id

transaction_id

notification_id

message_id

dispute_id

withdrawal_id

audit_id

The implementation may use UUIDs or another appropriate identifier strategy.

The important requirement is that identifiers must be unique and difficult to guess where security requires it.

**18.39 Human-Readable References**

Database IDs and user-facing references should be treated separately where appropriate.

For example:

Internal:

UUID:

550e8400-e29b-41d4-a716-446655440000

User-facing:

CGK-2026-000125

The user-facing Trip Reference should be easier to communicate while the internal database ID remains suitable for system relationships.

**18.40 Foreign Keys**

Relationships between records should be enforced using foreign keys where appropriate.

For example:

trip.customer_id

↓

customer.id

and:

trip.driver_id

↓

driver.id

Foreign keys help prevent orphaned records and invalid relationships.

**18.41 Referential Integrity**

The database shall maintain referential integrity.

For example:

A Trip should not reference a Driver that does not exist.

Similarly:

A Payment should not reference a Trip that does not exist.

The system should therefore carefully define:

- Foreign keys.
- Cascade rules.
- Restriction rules.
- Nullability.
- Deletion behavior.

Financial and historical records should generally not be cascade-deleted.

**18.42 Soft Deletion**

For important business records, the system should consider soft deletion rather than physical deletion.

For example:

is_deleted = true

or:

deleted_at = timestamp

This may be appropriate for:

- User accounts.
- Vehicles.
- Notifications.
- Communication records where policy allows.
- Certain configuration records.

However, financial records and audit records should generally remain preserved.

**18.43 Data Validation**

Database and backend validation shall work together.

Examples:

Driver transportation fee:

Must be >= 0

Fuel budget:

Must be >= 0

Rating:

Must be within approved rating range

Trip status:

Must be a valid defined status

Payment amount:

Must be positive

The backend must perform validation before database insertion or modification.

**18.44 Database Constraints**

Where appropriate, the database should enforce constraints such as:

- NOT NULL.
- UNIQUE.
- CHECK.
- FOREIGN KEY.
- PRIMARY KEY.

For example, a payment provider reference that must be unique should have a unique constraint where appropriate.

This provides another layer of protection against duplicate records.

**18.45 Transaction Management**

Financial and critical trip operations should use database transactions where necessary.

For example, first driver payment release may involve:

BEGIN TRANSACTION

↓

Validate Trip

↓

Validate Release Conditions

↓

Create Wallet Transaction

↓

Update Wallet Balance/Projection

↓

Record Release

↓

Commit

If an essential operation fails:

ROLLBACK

This prevents partially completed financial operations.

**18.46 Payment Release Transaction**

The first 50% release should be treated as one controlled transaction.

Conceptually:

TRIP ACTIVE

↓

Validate Release

↓

Check Already Released?

↓

NO

↓

Calculate 50%

↓

Create Driver Wallet Transaction

↓

Record Trip Wallet Movement

↓

Update Financial State

↓

Commit

If the release has already been recorded:

Already Released

↓

Do Not Release Again

**18.47 Database-Level Idempotency**

Critical operations should support idempotency.

Examples include:

- Payment confirmation.
- Payment release.
- Refund.
- Withdrawal.
- Notification generation.

An idempotency/reference key can prevent duplicate processing.

For example:

release_reference:

CGK-2026-000125-FIRST-RELEASE

If the same operation is received again, the backend can determine that it has already been processed.

**18.48 Indexing Strategy**

The database shall use indexes on fields that are frequently searched or joined.

Potential indexes include:

users.email

users.phone

trips.trip_reference

trips.customer_id

trips.driver_id

trips.status

trips.created_at

requests.customer_id

quotations.request_id

payments.trip_id

payments.provider_reference

wallet_transactions.wallet_id

notifications.user_id

notifications.trip_id

messages.trip_id

audit_logs.entity_id

Indexes should be introduced based on actual query requirements rather than indiscriminately indexing every column.

**18.49 Search and Filtering**

The database should support efficient filtering for common operations.

Examples:

Customer:

Show my active trips

Driver:

Show my available assignments

Administrator:

Show all disputed trips

Finance:

Show failed payments

Operations:

Show trips awaiting pickup

The database structure should therefore support efficient querying by:

- User.
- Role.
- Status.
- Date.
- Trip.
- Driver.
- Customer.
- Payment state.

**18.50 Historical Data**

The system should preserve historical information needed to understand completed trips.

For example, a completed trip should preserve:

- Original customer.
- Assigned driver.
- Vehicle.
- Original quotation.
- Price snapshot.
- Payment.
- Inspections.
- GPS/tracking history where retained.
- Delivery record.
- Driver releases.
- Refunds/adjustments.
- Communications where applicable.
- Ratings.
- Status history.

Historical records should not unexpectedly change because a current user profile has been updated.

**18.51 Snapshot Principle**

Where historical accuracy matters, the system should preserve snapshots.

For example, if a driver's name changes after a trip:

Current Driver Name:

John Mwangi

the completed trip should still retain the relevant historical association.

Similarly, if pricing rules change:

Old Trip:

Driver Fee = KSh 18,000

should remain unchanged.

This principle is especially important for:

- Financial data.
- Pricing.
- Trip records.
- Inspection records.
- Audit records.

**18.52 Data Consistency Between Modules**

The database shall ensure that modules work from the same underlying records.

For example:

**Payment Module**

Reads:

Trip

Price Snapshot

Payment

Trip Wallet

**Reporting Module**

Reads:

Trip

Payment

Wallet Transactions

Driver

Customer

**Notification Module**

Reads:

Trip

Payment

Inspection

Delivery

Wallet Transactions

This avoids separate conflicting versions of the same information.

**18.53 Reporting Data**

The Reporting, Dashboards and Analytics Module should primarily obtain data from operational database records.

For example:

Completed Trips

↓

Trip Database

↓

Reporting Query

↓

Dashboard

The reporting system should not manually duplicate operational data unless a later analytics architecture requires it.

**18.54 Data Aggregation**

Reports may calculate information such as:

- Total trips.
- Completed trips.
- Cancelled trips.
- Revenue.
- Driver earnings.
- Payment totals.
- Refund totals.
- Average trip values.
- Active drivers.
- Customer activity.

These values should be calculated from authoritative records.

For example:

Total Driver Earnings

\=

SUM(valid driver release transactions)

rather than a manually maintained number.

**18.55 Database Backup**

The production database shall have a backup strategy.

Backups should protect against:

- Hardware failure.
- Application errors.
- Database corruption.
- Accidental deletion.
- Security incidents.
- Infrastructure failure.

The backup strategy should include appropriate:

- Backup frequency.
- Retention period.
- Backup storage.
- Encryption.
- Restoration testing.

A backup that has never been tested for restoration should not be considered sufficient.

**18.56 Disaster Recovery**

The system should have a basic disaster-recovery strategy.

If the production database becomes unavailable:

Database Failure

↓

Detect Incident

↓

Restore Database / Failover

↓

Verify Data Integrity

↓

Resume Application

The exact recovery architecture can be expanded as the platform grows.

**18.57 Database Security**

The database shall be protected against unauthorized access.

The production database should:

- Not be publicly exposed unnecessarily.
- Use authenticated database connections.
- Use encrypted connections where supported.
- Restrict database users by permissions.
- Store credentials securely.
- Restrict administrative access.
- Maintain logs.
- Apply security updates.

The application should use a dedicated database user with only the permissions required by the application.

**18.58 Password Storage**

Passwords must never be stored as plain text.

The system shall store password hashes generated using an approved password-hashing mechanism.

Conceptually:

User Password

↓

Password Hashing

↓

Stored Password Hash

When the user logs in:

Entered Password

↓

Hash Verification

↓

Match?

↓

Authenticated

**18.59 Sensitive Data Protection**

Sensitive information should be minimized and protected.

The system should carefully handle:

- Password hashes.
- Driver verification documents.
- Payment references.
- Phone numbers.
- Personal information.
- Financial information.
- GPS data.
- Communication records.

Only authorized users should access sensitive information.

**18.60 Data Access Control**

Database access should follow the principle:

**Users should only access data required for their role and authorized activities.**

For example:

Customer:

Own Requests

Own Trips

Own Payments

Own Notifications

Driver:

Own Assignments

Own Trips

Own Wallet

Own Earnings

Administrator:

Authorized Operational Records

A customer must not be able to retrieve another customer's trip by simply changing:

tripId

in an API request.

Authorization must be checked on the backend.

**18.61 Data Ownership**

Each major data object shall have a clearly defined owner or controlling role.

Examples:

| **Data** | **Primary Owner** |
| --- | --- |
| Customer Account | Customer |
| Driver Account | Driver |
| Driver Verification | Administrator |
| Transportation Request | Customer |
| Quotation | Driver |
| Trip | System/Authorized Parties |
| Inspection | Driver/Operational Process |
| Payment | System/Finance |
| Trip Wallet | System |
| Driver Wallet | Driver/System |
| Dispute | Administrator |
| Audit Record | System |

This helps prevent unauthorized modifications.

**18.62 Concurrent Updates**

The system must consider situations where multiple users attempt to modify the same record.

Example:

Customer confirms trip

+

Driver performs another trip action

↓

Both requests reach server simultaneously

The backend must ensure that only valid state transitions succeed.

For financial operations, appropriate database locking or transactional controls may be required.

**18.63 Race Condition Protection**

The system must protect against race conditions in important operations.

Example:

Driver payment:

Request A → Release 50%

Request B → Release 50%

Both requests must not independently conclude:

"No payment has been released."

and release money twice.

The database transaction and unique release reference should prevent this.

**18.64 Data Migration**

Database structure should be managed through migrations rather than manually modifying production tables.

For example:

Migration 001

Create users

Migration 002

Create drivers

Migration 003

Create vehicles

Migration 004

Create requests

Migration 005

Create trips

Future changes should also be represented through migrations.

This makes development environments and production environments easier to keep synchronized.

**18.65 Seed Data**

The development environment may use controlled seed data for testing.

Examples:

- Test administrator.
- Test customer.
- Test driver.
- Test vehicle.
- Test trip.
- Test payment.
- Test inspection.

Production should never contain careless development seed data.

**18.66 Data Validation During Development**

Developers should test database behavior using realistic scenarios.

For example:

**Scenario 1 — Successful Trip**

Request

↓

Quotation

↓

Driver Selected

↓

Payment

↓

BOOKED

↓

Inspection

↓

TRIP ACTIVE

↓

50% Release

↓

Delivery

↓

COMPLETED

↓

Final 50% Release

The database should contain consistent records at every stage.

**18.67 Scenario 2 — Failed Payment**

Payment Pending

↓

Payment Attempt

↓

FAILED

Expected:

Payment = FAILED

Trip ≠ BOOKED

Driver Release = 0

**18.68 Scenario 3 — Driver Fails Pickup**

Customer Paid

↓

BOOKED

↓

Driver Fails Pickup

↓

Cancellation/Dispute

Expected:

First Driver Release = 0

unless an authorized settlement subsequently determines otherwise.

**18.69 Scenario 4 — Successful First Release**

TRIP ACTIVE

↓

First Release Validation

↓

50% Driver Fee

↓

Driver Wallet

Expected:

Driver Fee = KSh 18,000

First Release = KSh 9,000

Remaining = KSh 9,000

**18.70 Scenario 5 — Successful Completion**

COMPLETED

↓

Final Release Validation

↓

Remaining 50%

↓

Driver Wallet

Expected:

Total Released = KSh 18,000

Pending = KSh 0

**18.71 Scenario 6 — Duplicate Payment Callback**

Payment Callback

↓

Transaction Recorded

Same Callback Again

↓

Existing Provider Reference

↓

Ignore Duplicate

The database must not create a second successful payment.

**18.72 Scenario 7 — Duplicate Payment Release**

First Release Request

↓

KSh 9,000 Released

Repeated Request

↓

Release Already Recorded

↓

No Additional Release

This scenario must be included in testing.

**18.73 Data Retention**

Different types of data may require different retention periods.

The system should distinguish between:

- Financial records.
- Audit records.
- Operational records.
- Notifications.
- Communication.
- GPS data.
- Temporary system logs.

The exact retention periods should be defined according to operational, legal, and privacy requirements before production deployment.

**18.74 Data Archiving**

Older records may eventually be archived to improve operational database performance.

For example:

Active Data

↓

Operational Database

Older Historical Data

↓

Archive Storage

However, archiving should not make legally or operationally required records inaccessible.

**18.75 Data Deletion**

Deletion should be carefully controlled.

The system should distinguish between:

DELETE

and:

DEACTIVATE / ARCHIVE

For example, deleting a completed trip would be inappropriate because it could destroy financial and operational history.

Important records should therefore normally be preserved.

**18.76 Database Monitoring**

The production database should be monitored for:

- Connection usage.
- Query performance.
- Storage growth.
- Failed queries.
- Locking.
- Slow queries.
- CPU usage.
- Memory usage.
- Backup status.

Monitoring will become increasingly important as the number of trips increases.

**18.77 Database Performance**

The database should be optimized for the most common CarGo Kenya operations.

Examples:

Customer → My Active Trips

Driver → My Current Assignment

Driver → Available Requests

Admin → Pending Verifications

Admin → Active Trips

Finance → Pending Payments

Finance → Pending Withdrawals

Indexes and query design should support these operations efficiently.

**18.78 Pagination**

Large datasets should not be returned in one API response.

For example:

GET /admin/trips

should support pagination.

Conceptually:

Page 1

Trips 1–20

Page 2

Trips 21–40

Page 3

Trips 41–60

This reduces database and API load.

**18.79 API and Database Separation**

The database structure should not automatically dictate the public API structure.

For example, the database may contain:

trip

trip_status_history

trip_price_snapshot

trip_wallet

The API may return a combined Trip response containing relevant information.

This allows the backend to maintain a clean separation between:

Database Model

and:

API Response Model

**18.80 Database Error Handling**

Database errors should not expose sensitive technical information to users.

Instead of:

PostgreSQL foreign key constraint failed:

fk_trip_driver_93f8...

the user should receive an understandable message such as:

We could not complete this operation. Please try again.

Developers should still receive detailed technical logs for debugging.

**18.81 Database Logging**

The application should maintain appropriate technical logs for database-related problems.

Logs may include:

- Error type.
- Endpoint.
- User/session reference where appropriate.
- Query operation.
- Timestamp.
- Correlation/request ID.
- Error details.

Sensitive information such as passwords and payment credentials must not be written to logs.

**18.82 Data Consistency During Notifications**

When a critical event occurs, the system should ensure that the database state is authoritative before communication is generated.

For example:

Wallet Transaction Successfully Created

↓

Driver Balance Updated

↓

Payment Release Confirmed

↓

Notification Generated

Not:

Notification Sent

↓

Attempt to Create Wallet Transaction

This maintains consistency between what the system does and what it tells the user.

**18.83 Database and Audit Consistency**

Important changes should be traceable.

For example:

ADMIN changes trip from:

DELIVERY PENDING

to

DISPUTED

The system should preserve:

Previous Status

New Status

Actor

Reason

Timestamp

This is particularly important for disputes and financial operations.

**18.84 Database Environment Separation**

The development architecture should separate:

- Development database.
- Testing/staging database.
- Production database.

Developers should not normally test destructive operations directly against production.

The environments should have separate credentials and appropriate access controls.

**18.85 Production Database Access**

Production database access should be restricted.

Developers should normally interact with production data through:

- Application APIs.
- Controlled administrative tools.
- Authorized database administration procedures.

Direct production database modification should be limited to authorized personnel.

**18.86 Data Privacy**

The system should collect only information necessary for CarGo Kenya operations.

For example, if the platform does not require a particular personal attribute, it should not collect it simply because the database can store it.

The system should also provide appropriate mechanisms for:

- Privacy protection.
- Access control.
- Data correction.
- Account deactivation.
- Controlled deletion where applicable.

The exact legal/privacy requirements should be confirmed before production launch.

**18.87 MVP Database Scope**

**Included in MVP**

The Database and Data Management Module shall include:

- User records.
- Customer records.
- Driver records.
- Driver verification records.
- Vehicle records.
- Transportation requests.
- Driver quotations.
- Trip records.
- Trip status history.
- Price snapshots.
- Vehicle inspection records.
- Inspection evidence references.
- Fuel records.
- GPS/tracking records where implemented.
- Payment records.
- Trip Wallet.
- Driver Personal Wallet.
- Wallet transaction ledger.
- Refund records.
- Withdrawal records.
- Notification records.
- Trip communication records.
- Dispute records.
- Rating/review records.
- Audit logs.
- Database migrations.
- Validation constraints.
- Foreign-key relationships.
- Indexing.
- Transaction management.
- Backup strategy.
- Role-based data access.
- Duplicate transaction protection.
- Basic database monitoring.

**Not Required for MVP**

The following should remain future enhancements:

- Full data warehouse.
- Advanced data lake architecture.
- Complex ETL pipelines.
- Real-time analytical database.
- Machine-learning feature store.
- Advanced geographic database optimization.
- Multi-region database deployment.
- Automatic database sharding.
- Global distributed database architecture.
- Advanced predictive data infrastructure.

These may be introduced only when the platform's scale justifies them.

**18.88 Core Database Business Rules**

The following rules shall be treated as core MVP database requirements.

**Rule 1**

Every major CarGo Kenya entity shall have a unique identifier.

**Rule 2**

Important relationships shall be enforced through appropriate database relationships and backend validation.

**Rule 3**

The database shall be the authoritative source of operational information.

**Rule 4**

The frontend shall never directly access the production database.

**Rule 5**

Financial transactions shall be traceable and should not simply be deleted.

**Rule 6**

Trip status changes shall follow the approved CarGo Kenya lifecycle.

**Rule 7**

Payment releases shall be protected against duplicate processing.

**Rule 8**

Payment-provider transaction references shall be appropriately protected against duplicate recording.

**Rule 9**

Historical financial and operational information shall remain preserved.

**Rule 10**

Sensitive information shall only be accessible to authorized users.

**Rule 11**

Database transactions shall be used for operations where partial completion could create inconsistent financial or operational states.

**Rule 12**

Database migrations shall be used to manage structural changes.

**Rule 13**

Production and development databases shall remain separated.

**Rule 14**

The database shall maintain appropriate audit information for critical operations.

**Rule 15**

Backups shall be maintained and restoration procedures tested.

**Rule 16**

The system shall prevent unauthorized access to another user's data through API manipulation.

**Rule 17**

Important records should preferably be deactivated or archived rather than physically deleted when historical integrity is required.

**Rule 18**

Operational, financial, communication, inspection, and audit records shall remain logically distinguishable.

**18.89 Complete Database Relationship Overview**

The complete MVP database can therefore be understood as:

USERS

│

┌────────────┼────────────┐

↓ ↓ ↓

CUSTOMER DRIVER ADMIN

│ │

↓ ↓

REQUEST DRIVER

│ VERIFICATION

↓

QUOTATIONS

│

↓

DRIVER SELECTED

│

↓

TRIP

│

┌────────┼────────┬─────────┬─────────┐

↓ ↓ ↓ ↓ ↓

VEHICLE INSPECTION FUEL GPS STATUS

│ │ HISTORY

│ │

└────┬────┘

↓

OPERATIONAL

RECORDS

TRIP

│

┌───────┼────────┐

↓ ↓ ↓

PAYMENT TRIP PRICE

WALLET SNAPSHOT

│

↓

TRANSACTION LEDGER

│

┌──────┴───────┐

↓ ↓

DRIVER RELEASE REFUND /

│ ADJUSTMENT

↓

DRIVER PERSONAL

WALLET

│

↓

WITHDRAWALS

TRIP

│

┌───────┼──────────┐

↓ ↓ ↓

NOTIFICATIONS MESSAGES DISPUTES

│ │ │

└───────┼──────────┘

↓

AUDIT TRAIL

TRIP

│

↓

RATING/REVIEW

ALL DATA

│

↓

REPORTING & ANALYTICS

**18.90 Final Database Architecture**

The CarGo Kenya MVP database architecture shall therefore be understood as a centralized relational data system supporting all major platform operations.

CARGO KENYA

│

↓

APPLICATION/API

│

↓

BUSINESS LOGIC LAYER

│

↓

DATABASE ACCESS

│

↓

POSTGRESQL DB

│

┌───────────────────┼────────────────────┐

↓ ↓ ↓

ACCOUNTS OPERATIONS FINANCE

│ │ │

Users Requests Payments

Customers Quotations Trip Wallet

Drivers Trips Driver Wallet

Vehicles Inspections Transactions

Verification Fuel Refunds

GPS Withdrawals

Delivery

│ │ │

└───────────────────┼────────────────────┘

↓

COMMUNICATION

│

Notifications/Messages

│

↓

DISPUTES

│

↓

AUDIT LOG

│

↓

REPORTING & ANALYTICS

The database is therefore not simply a storage mechanism. It provides the **structural foundation that connects the entire CarGo Kenya MVP**.

Every major operational action should ultimately result in a reliable database state that can be:

- Verified.
- Retrieved.
- Audited.
- Reported.
- Reconciled.
- Protected.
- Used by other authorized system modules.

This database architecture shall remain consistent with the previously defined CarGo Kenya MVP lifecycle, particularly the relationship between:

**REQUEST → QUOTATION → DRIVER SELECTION → PAYMENT → BOOKING → INSPECTION → TRIP ACTIVE → IN TRANSIT → DELIVERY → COMPLETION → PAYMENT RELEASE → DRIVER WALLET.**

**19.0 API & BACKEND ARCHITECTURE**

**19.1 Purpose**

The API and Backend Architecture shall define how the CarGo Kenya backend receives requests, processes business operations, communicates with the database, integrates with external services, enforces business rules, and returns controlled responses to the frontend applications.

The backend shall act as the central processing layer of the CarGo Kenya system.

The backend shall be responsible for:

- Authentication and authorization.
- User and profile management.
- Driver verification.
- Transportation request management.
- Driver quotation management.
- Driver selection.
- Trip lifecycle management.
- Vehicle inspection processing.
- GPS and trip tracking.
- Payment processing.
- Trip Wallet management.
- Driver Personal Wallet management.
- Notification processing.
- Customer-driver communication.
- Delivery and completion processing.
- Ratings and reviews.
- Disputes.
- Administrative operations.
- File and image management.
- Audit logging.
- Data validation.
- Business-rule enforcement.

The frontend shall therefore not be responsible for making final decisions about sensitive operations.

For example, the frontend may display a **RELEASE 50%** button, but the backend shall independently determine whether the first payment release is actually permitted.

**19.2 Backend Architecture**

The CarGo Kenya MVP shall use a structured backend architecture separating:

**Client Applications**

↓

**API Layer**

↓

**Authentication & Authorization**

↓

**Business Logic / Services**

↓

**Data Access Layer**

↓

**Database**

Alongside the backend shall be controlled integrations with:

- Payment provider.
- SMS provider.
- Email provider.
- GPS/location services where required.
- File/object storage where required.

A conceptual architecture is:

CUSTOMER APP

│

DRIVER APP

│

ADMIN DASHBOARD

│

▼

┌─────────────────────────┐

│ API LAYER │

└────────────┬────────────┘

│

▼

┌─────────────────────────┐

│ AUTHENTICATION / │

│ AUTHORIZATION │

└────────────┬────────────┘

│

▼

┌─────────────────────────┐

│ BUSINESS LOGIC / │

│ SERVICE LAYER │

└────────────┬────────────┘

│

▼

┌─────────────────────────┐

│ DATA ACCESS / │

│ REPOSITORY LAYER │

└────────────┬────────────┘

│

▼

DATABASE

External services shall communicate with the backend through controlled integration layers.

**19.3 Architectural Principles**

The backend shall follow the following principles.

**Principle 1 — Backend Is the Source of Truth**

The backend shall determine the authoritative state of the system.

The frontend shall not be trusted to determine:

- Trip status.
- Payment status.
- Driver earnings.
- Wallet balances.
- Inspection completion.
- Delivery completion.
- User permissions.
- Administrative privileges.

**Principle 2 — Business Rules Belong in the Backend**

Critical business rules shall be enforced server-side.

For example:

Driver requests first payment release

↓

Backend checks conditions

↓

Pickup inspection complete?

↓

Handover complete?

↓

Required confirmations complete?

↓

Trip = TRIP ACTIVE?

↓

YES

↓

Release 50%

**Principle 3 — Database Integrity**

The backend shall protect the database against:

- Invalid records.
- Duplicate transactions.
- Unauthorized updates.
- Inconsistent relationships.
- Invalid status transitions.

**Principle 4 — Traceability**

Important operations shall generate records that allow developers and administrators to determine:

- Who performed the action.
- What was performed.
- When it occurred.
- Which trip was affected.
- Which transaction was involved.
- What the previous state was where applicable.
- What the resulting state was.

**Principle 5 — Modular Design**

The backend shall be organized into logical modules so that changes to one area do not unnecessarily affect unrelated modules.

**19.4 Backend Technology Stack**

The CarGo Kenya MVP backend shall be designed to support the previously established technology direction.

The preferred stack shall include:

**Runtime**

**Node.js**

**Backend Framework**

**Express.js**

**Primary Database**

**PostgreSQL**

**Authentication**

Token-based authentication using secure authentication mechanisms.

**Password Security**

Passwords shall be securely hashed before storage.

**File Processing**

A controlled file-upload mechanism shall be used for:

- Driver documents.
- Vehicle documents.
- Inspection photographs.
- Delivery evidence where applicable.

**External Services**

The backend shall provide integration layers for:

- Payment services.
- SMS.
- Email.
- GPS/location services.
- File storage.

The exact external provider may be selected during implementation without changing the internal API architecture.

**19.5 Application Structure**

The backend should use a modular structure.

A recommended structure is:

backend/

│

├── src/

│ ├── config/

│ ├── controllers/

│ ├── routes/

│ ├── services/

│ ├── repositories/

│ ├── models/

│ ├── middleware/

│ ├── validators/

│ ├── integrations/

│ ├── jobs/

│ ├── utils/

│ └── app/

│

├── tests/

├── uploads/

├── migrations/

├── seeds/

├── logs/

└── package.json

The exact folder structure may change during implementation, but the separation of responsibilities should remain.

**19.6 API Design Principles**

The API shall follow a consistent REST-style design.

Resources should be represented using predictable endpoints.

For example:

/users

/drivers

/requests

/quotations

/trips

/payments

/wallets

/notifications

/messages

/inspections

/disputes

/ratings

The API should use appropriate HTTP methods.

**GET**

Retrieve information.

**POST**

Create a new resource or initiate an operation.

**PATCH**

Update part of an existing resource.

**DELETE**

Delete a resource only where deletion is permitted.

Financial and operational records should generally not be physically deleted where deletion would destroy required audit history.

**19.7 API Versioning**

The backend should use API versioning.

The recommended MVP structure is:

/api/v1/

Examples:

/api/v1/auth/login

/api/v1/trips

/api/v1/payments

/api/v1/notifications

Versioning will allow future API changes without immediately breaking existing clients.

**19.8 Authentication APIs**

Authentication APIs shall manage account access.

The MVP should support operations such as:

POST /api/v1/auth/register

POST /api/v1/auth/login

POST /api/v1/auth/logout

POST /api/v1/auth/refresh

POST /api/v1/auth/forgot-password

POST /api/v1/auth/reset-password

GET /api/v1/auth/me

The backend shall validate:

- Account credentials.
- Account status.
- Authentication tokens.
- User identity.
- Required verification state where applicable.

A suspended account shall not be allowed to perform restricted operations.

**19.9 User and Profile APIs**

The system shall provide APIs for managing user profiles.

Example:

GET /api/v1/users/me

PATCH /api/v1/users/me

GET /api/v1/users/me/trips

GET /api/v1/users/me/notifications

The backend shall ensure that users can only modify information they are authorized to modify.

Sensitive fields shall require additional authorization or verification where appropriate.

**19.10 Driver APIs**

Driver APIs shall support driver-specific functionality.

Examples:

GET /api/v1/drivers/me

PATCH /api/v1/drivers/me

POST /api/v1/drivers/verification

GET /api/v1/drivers/verification

GET /api/v1/drivers/requests

GET /api/v1/drivers/trips

GET /api/v1/drivers/earnings

Driver APIs shall also support:

- Availability.
- Eligibility.
- Verification.
- Quotations.
- Assigned trips.
- Inspections.
- Trip commencement.
- Delivery.
- Earnings.

The backend shall ensure that a driver can only access transportation requests for which the driver is eligible.

**19.11 Transportation Request APIs**

Transportation requests represent the customer's initial request for vehicle transportation.

Example endpoints:

POST /api/v1/requests

GET /api/v1/requests/:requestId

PATCH /api/v1/requests/:requestId

POST /api/v1/requests/:requestId/cancel

GET /api/v1/requests/:requestId/quotations

The backend shall validate:

- Customer ownership.
- Pickup information.
- Destination.
- Vehicle information.
- Requested transportation details.
- Request status.
- Cancellation eligibility.

A request shall not be modified arbitrarily after it has progressed into later stages.

**19.12 Quotation APIs**

Drivers shall submit quotations through controlled APIs.

Example:

POST /api/v1/requests/:requestId/quotations

GET /api/v1/requests/:requestId/quotations

GET /api/v1/quotations/:quotationId

PATCH /api/v1/quotations/:quotationId

The backend shall validate:

- Driver eligibility.
- Request status.
- Quotation amount.
- Fuel budget.
- Quotation validity.
- Duplicate quotations.
- Quotation submission deadlines where applicable.

The backend shall not allow a driver to submit a quotation for an ineligible request.

**19.13 Driver Selection APIs**

The customer shall select a driver through a backend-controlled operation.

Example:

POST /api/v1/requests/:requestId/select-driver

The backend shall verify:

1.  The request belongs to the customer.
2.  The quotation belongs to the request.
3.  The driver is eligible.
4.  The quotation is still valid.
5.  The request is still in a selectable state.
6.  The driver has not become unavailable.
7.  The price information is valid.

After successful selection:

DRIVER SELECTED

↓

PRICE CONFIRMED

↓

PAYMENT PENDING

**19.14 Trip APIs**

Trip APIs shall manage the transportation assignment after driver selection.

Examples:

GET /api/v1/trips

POST /api/v1/trips

GET /api/v1/trips/:tripId

PATCH /api/v1/trips/:tripId

Trip operations may include:

POST /api/v1/trips/:tripId/confirm

POST /api/v1/trips/:tripId/cancel

POST /api/v1/trips/:tripId/start

POST /api/v1/trips/:tripId/confirm-start

POST /api/v1/trips/:tripId/arrive-pickup

POST /api/v1/trips/:tripId/arrive-destination

POST /api/v1/trips/:tripId/confirm-delivery

POST /api/v1/trips/:tripId/complete

However, these operations shall not directly change trip status without backend validation.

**19.15 Trip Status Transition Enforcement**

The backend shall enforce the previously defined CarGo Kenya trip lifecycle.

The primary lifecycle shall remain:

REQUESTED

↓

QUOTING

↓

DRIVER SELECTED

↓

PAYMENT PENDING

↓

BOOKED

↓

PICKUP PENDING

↓

PICKUP INSPECTION

↓

TRIP START PENDING

↓

TRIP ACTIVE

↓

IN TRANSIT

↓

DELIVERY PENDING

↓

DELIVERED

↓

COMPLETED

Exceptional states include:

DISPUTED

CANCELLED

The backend shall prevent invalid transitions.

For example:

PAYMENT PENDING

↓

TRIP ACTIVE

shall not be permitted.

The required intermediate conditions must be completed.

**19.16 Vehicle Inspection APIs**

The backend shall provide APIs for pickup and delivery inspections.

Example:

POST /api/v1/trips/:tripId/inspections

GET /api/v1/trips/:tripId/inspections

GET /api/v1/inspections/:inspectionId

PATCH /api/v1/inspections/:inspectionId

Inspection information may include:

- Inspection type.
- Vehicle condition.
- Photographs.
- Odometer reading.
- Fuel level.
- Damage observations.
- Inspection checklist.
- Driver confirmation.
- Customer confirmation.
- Timestamp.
- Location.
- Inspection status.

The backend shall verify that inspection records belong to the relevant trip.

**19.17 Inspection Evidence Upload APIs**

Inspection photographs and supporting files shall be uploaded through controlled endpoints.

Example:

POST /api/v1/inspections/:inspectionId/evidence

GET /api/v1/inspections/:inspectionId/evidence

The backend shall validate:

- User authorization.
- File type.
- File size.
- Associated inspection.
- Associated trip.
- Upload purpose.

Inspection evidence shall not be treated as ordinary chat attachments.

**19.18 GPS and Tracking APIs**

The backend shall support trip-location information where GPS tracking is enabled.

Example:

POST /api/v1/trips/:tripId/location

GET /api/v1/trips/:tripId/location

GET /api/v1/trips/:tripId/tracking

The backend shall validate that:

- The driver is assigned to the trip.
- The trip is in an appropriate active state.
- The submitted location is valid.
- The timestamp is acceptable.
- Unauthorized users cannot submit tracking data.

The system may store:

- Latitude.
- Longitude.
- Timestamp.
- Accuracy where available.
- Speed where available.
- Heading where available.

The frontend shall not be treated as the authoritative source for tracking status.

**19.19 Payment APIs**

Payment APIs shall be tightly controlled because they involve financial transactions.

Example:

POST /api/v1/trips/:tripId/payment

GET /api/v1/trips/:tripId/payment

GET /api/v1/payments/:paymentId

POST /api/v1/payments/:paymentId/refund

Payment operations shall support:

- Payment initiation.
- Payment verification.
- Transaction recording.
- Payment status.
- Refunds.
- Partial refunds.
- Payment references.

The backend shall calculate the required amount from the stored trip price snapshot.

The frontend shall not be permitted to dictate the final payable amount.

**19.20 Payment Webhook APIs**

Where supported by the selected payment provider, the backend shall expose a controlled webhook endpoint.

Conceptually:

POST /api/v1/payments/webhook

The webhook handler shall:

1.  Receive the provider notification.
2.  Verify authenticity.
3.  Validate the transaction reference.
4.  Validate the amount.
5.  Validate the trip association.
6.  Check whether the transaction has already been processed.
7.  Update the payment transaction.
8.  Update the relevant Trip Wallet.
9.  Update the trip where appropriate.
10. Generate the relevant notification.

Webhook processing shall be idempotent.

**19.21 Trip Wallet APIs**

The Trip Wallet shall remain associated with one specific trip.

Example:

GET /api/v1/trips/:tripId/wallet

GET /api/v1/trips/:tripId/wallet/transactions

The Trip Wallet shall track:

- Customer payment.
- Driver transportation fee.
- Fuel budget.
- CarGo Kenya platform fee.
- Driver release transactions.
- Refunds.
- Adjustments.
- Financial status.

The driver shall not be allowed to withdraw directly from a Trip Wallet.

**19.22 Driver Personal Wallet APIs**

The Driver Personal Wallet shall contain released driver earnings.

Example:

GET /api/v1/wallet

GET /api/v1/wallet/transactions

GET /api/v1/wallet/pending

POST /api/v1/wallet/withdrawals

GET /api/v1/wallet/withdrawals

The backend shall distinguish:

AVAILABLE BALANCE

from:

PENDING EARNINGS

Only eligible available funds may be withdrawn.

**19.23 Payment Release API**

Payment release shall be a backend-controlled operation.

A conceptual internal operation may be:

POST /api/v1/trips/:tripId/payment-releases

However, the backend shall determine the permitted release automatically.

For the first release:

Trip = TRIP ACTIVE

+

Required commencement conditions complete

↓

Release 50%

For the final release:

Trip = COMPLETED

+

Required completion conditions complete

↓

Release remaining 50%

The client shall not submit:

amount = 18000

to determine the driver's payment.

The backend shall calculate the permitted amount from the stored driver fee.

**19.24 Payment Release Idempotency**

The backend shall prevent duplicate payment releases.

For example:

First Request

↓

Release KSh 9,000

↓

Transaction Recorded

Second Request

↓

Release Already Recorded

↓

No Additional Release

Each release shall have a unique transaction/reference.

This protects the system against:

- Double-clicks.
- Network retries.
- API retries.
- Webhook retries.
- Server retries.

**19.25 Notification APIs**

The Notification Module shall expose APIs for users to retrieve and manage their notifications.

Example:

GET /api/v1/notifications

GET /api/v1/notifications/:notificationId

PATCH /api/v1/notifications/:notificationId/read

PATCH /api/v1/notifications/read-all

The backend shall determine:

- Recipient.
- Notification type.
- Notification priority.
- Notification content.
- Related trip.
- Delivery channel.

**19.26 Communication APIs**

Customer-driver communication shall be associated with an authorized trip.

Example:

GET /api/v1/trips/:tripId/messages

POST /api/v1/trips/:tripId/messages

PATCH /api/v1/messages/:messageId/read

The backend shall verify that the sender is authorized to communicate within the trip.

A user shall not gain access to another trip's messages merely by changing a Trip ID in the request.

**19.27 Delivery APIs**

Delivery operations shall be backend controlled.

Example:

POST /api/v1/trips/:tripId/delivery/start

POST /api/v1/trips/:tripId/delivery/confirm

POST /api/v1/trips/:tripId/delivery/complete

The backend shall verify:

- Trip is at the appropriate stage.
- Delivery inspection is complete.
- Required evidence is available.
- Customer confirmation is complete where required.
- Driver confirmation is complete where required.

Only then may the trip progress toward:

COMPLETED

**19.28 Rating and Review APIs**

After completion, authorized users may submit ratings and reviews.

Example:

POST /api/v1/trips/:tripId/rating

GET /api/v1/drivers/:driverId/ratings

The backend shall ensure:

- The trip actually occurred.
- The user participated in the trip.
- A rating has not already been submitted where only one rating is allowed.
- The rating belongs to the correct trip.

Ratings shall not be accepted for arbitrary unrelated trips.

**19.29 Dispute APIs**

Dispute functionality shall be backend controlled.

Example:

POST /api/v1/trips/:tripId/disputes

GET /api/v1/trips/:tripId/disputes

GET /api/v1/disputes/:disputeId

POST /api/v1/disputes/:disputeId/evidence

Administrators may have additional operations:

PATCH /api/v1/admin/disputes/:disputeId

POST /api/v1/admin/disputes/:disputeId/resolve

The backend shall record:

- Dispute reason.
- Reporter.
- Trip.
- Evidence.
- Status.
- Administrator handling the dispute.
- Resolution.
- Financial adjustment where applicable.

**19.30 Administrator APIs**

Administrator APIs shall provide controlled operational management.

Examples:

GET /api/v1/admin/users

GET /api/v1/admin/drivers

GET /api/v1/admin/trips

GET /api/v1/admin/payments

GET /api/v1/admin/disputes

GET /api/v1/admin/inspections

GET /api/v1/admin/reports

Administrative actions may include:

- Driver verification.
- Account suspension.
- Trip intervention.
- Dispute resolution.
- Refund authorization.
- Financial adjustment.
- Verification review.
- Operational monitoring.

Administrator permissions shall be based on role and authorization level.

**19.31 API Request Structure**

Requests should use a consistent structure.

For example:

{

"pickupLocation": {

"address": "Mombasa",

"latitude": -4.0435,

"longitude": 39.6682

},

"destination": {

"address": "Nairobi",

"latitude": -1.2921,

"longitude": 36.8219

}

}

The exact fields will depend on the relevant endpoint.

The backend shall validate every incoming request before processing it.

**19.32 API Response Structure**

API responses should follow a consistent format.

Successful response:

{

"success": true,

"data": {},

"message": "Operation completed successfully"

}

Error response:

{

"success": false,

"error": {

"code": "TRIP_INVALID_STATUS",

"message": "The requested operation is not permitted in the current trip status."

}

}

The exact implementation may vary, but response structures should remain consistent across modules.

**19.33 HTTP Status Codes**

The backend should use appropriate HTTP status codes.

**200 — OK**

Successful request.

**201 — Created**

New resource successfully created.

**400 — Bad Request**

Invalid request data.

**401 — Unauthorized**

Authentication required or invalid.

**403 — Forbidden**

User authenticated but not authorized.

**404 — Not Found**

Requested resource does not exist or is not accessible.

**409 — Conflict**

Operation conflicts with the current state.

Example:

Trip already completed.

**422 — Unprocessable Entity**

Request is syntactically valid but violates business validation.

**429 — Too Many Requests**

Rate limit exceeded.

**500 — Internal Server Error**

Unexpected server failure.

External provider failures should be handled without exposing internal implementation details.

**19.34 Validation and Error Handling**

All API inputs shall be validated before reaching business logic.

Validation should cover:

- Required fields.
- Data types.
- String lengths.
- Numeric ranges.
- Valid IDs.
- Valid dates.
- Valid coordinates.
- File types.
- File sizes.
- Allowed status values.

Example:

POST /trips/:tripId/start

↓

Authentication

↓

Authorization

↓

Request Validation

↓

Trip Validation

↓

Business Rule Validation

↓

Operation

The backend shall return understandable errors without exposing sensitive implementation details.

**19.35 Role-Based Authorization**

The backend shall enforce role-based access.

The primary roles shall remain consistent with the wider CarGo Kenya system.

Examples include:

- Customer.
- Driver.
- Administrator.

Where other specialized roles exist, they shall receive only the permissions necessary for their responsibilities.

Example:

CUSTOMER

Can:

\- Create request

\- View own trips

\- Select driver

\- Make payment

\- Confirm trip start

\- Confirm delivery

Cannot:

\- Release driver funds

\- Approve refunds

\- Modify another user's trip

Driver permissions shall similarly be restricted.

Administrators shall have broader operational permissions according to their assigned role.

**19.36 Transaction Management**

Operations involving multiple related database changes should use database transactions.

For example, first driver payment release may require:

BEGIN TRANSACTION

↓

Validate Trip

↓

Validate Release Conditions

↓

Create Wallet Transaction

↓

Update Driver Wallet

↓

Record Release

↓

Record Audit Event

↓

COMMIT

If a critical operation fails:

ROLLBACK

This prevents partial financial updates.

**19.37 Financial Transaction Integrity**

Financial operations shall be treated differently from ordinary profile updates.

The backend shall avoid simply changing:

driver.balance = driver.balance + 9000

without recording why the change occurred.

Instead, the system should create a traceable wallet transaction associated with:

- Driver.
- Trip.
- Amount.
- Transaction type.
- Reference.
- Timestamp.
- Source.
- Status.

The driver's available balance may then be derived or safely maintained from controlled financial transactions.

**19.38 Idempotency**

Critical operations should support idempotency.

Operations requiring particular attention include:

- Payment confirmation.
- Payment webhooks.
- Payment releases.
- Refunds.
- Withdrawals.
- Trip completion.
- Notification generation.

For example:

Request ID: ABC123

First request:

PROCESS

Second request:

ABC123 already processed

Result:

Return existing result

This prevents duplicate operations.

**19.39 Webhook Architecture**

External systems may send callbacks to CarGo Kenya.

Examples include:

- Payment provider.
- SMS provider.
- Email provider.
- Other future services.

Webhook processing should:

1.  Receive request.
2.  Verify authenticity.
3.  Validate payload.
4.  Identify the relevant internal record.
5.  Check idempotency.
6.  Process the event.
7.  Record the result.
8.  Return an appropriate response.

The system should not assume that an external webhook will arrive only once.

**19.40 Background Jobs**

Some operations should not unnecessarily block the main API request.

The backend may use background jobs for:

- SMS delivery.
- Email delivery.
- Notification retries.
- Large file processing.
- Report generation.
- Cleanup tasks.
- Other non-immediate processing.

For example:

Payment Confirmed

↓

Create Notification

↓

Queue SMS

↓

API Continues

↓

Background Worker Sends SMS

The underlying payment transaction should not depend on successful SMS delivery.

**19.41 File and Image Management**

The backend shall control all uploaded files.

Files may include:

- Driver identification documents.
- Driving licence documents.
- Vehicle documents.
- Pickup photographs.
- Delivery photographs.
- Inspection evidence.
- Dispute evidence.

The backend shall:

- Authenticate the uploader.
- Validate file type.
- Validate file size.
- Associate the file with the correct entity.
- Store metadata.
- Prevent unauthorized access.
- Record upload events where appropriate.

Sensitive files should not be publicly exposed through predictable URLs.

**19.42 Location Data Handling**

GPS and location information shall be treated as operationally sensitive data.

The backend shall ensure that location information is only available to authorized users.

For example:

Customer

↓

Authorized Trip

↓

View Trip Location

A customer shall not be able to request the location of a vehicle belonging to another trip.

The backend should also distinguish between:

- Current location.
- Last known location.
- Historical location.
- Pickup location.
- Destination location.

**19.43 API Logging**

The backend should maintain appropriate application logs.

Logs may include:

- Request method.
- Endpoint.
- Request timestamp.
- Response status.
- Processing time.
- User ID where appropriate.
- Error information.
- Correlation/request ID.

Sensitive information such as:

- Passwords.
- Payment secrets.
- Authentication tokens.
- Private credentials.

must not be written into ordinary logs.

**19.44 Audit Trail**

Important business actions shall be recorded in the audit system.

Examples:

DRIVER_VERIFIED

DRIVER_SUSPENDED

DRIVER_SELECTED

PAYMENT_CONFIRMED

TRIP_BOOKED

INSPECTION_COMPLETED

TRIP_STARTED

FIRST_PAYMENT_RELEASED

DELIVERY_CONFIRMED

TRIP_COMPLETED

FINAL_PAYMENT_RELEASED

REFUND_APPROVED

DISPUTE_RESOLVED

An audit record should contain:

- Actor.
- Action.
- Entity.
- Entity ID.
- Timestamp.
- Relevant information.
- Request/correlation reference where appropriate.

Audit records should not be casually deleted.

**19.45 Rate Limiting**

The backend should apply rate limits to protect APIs from abuse.

Higher protection should be applied to:

- Login.
- Password reset.
- Payment endpoints.
- OTP/verification endpoints where applicable.
- File uploads.
- Messaging.
- Public endpoints.

Rate limiting should reduce:

- Brute-force attacks.
- Automated abuse.
- Excessive requests.
- API resource exhaustion.

**19.46 Performance Requirements**

The backend should be designed to provide acceptable response times for normal operations.

The system should avoid:

- Unnecessary database queries.
- Repeated API calls.
- Large unpaginated responses.
- Heavy processing inside ordinary request handlers.

Lists should support pagination.

For example:

GET /api/v1/trips?page=1&limit=20

Large datasets should not be returned in a single response.

**19.47 Pagination, Filtering and Sorting**

Administrative and user-facing list endpoints should support pagination where necessary.

Examples:

GET /api/v1/trips?page=1&limit=20

GET /api/v1/drivers?status=VERIFIED

GET /api/v1/payments?status=PAID

GET /api/v1/disputes?status=OPEN

The backend should validate filtering parameters rather than allowing arbitrary database queries.

**19.48 API Security**

The API shall implement appropriate security controls.

These should include:

- Authentication.
- Authorization.
- Input validation.
- Rate limiting.
- Secure password handling.
- Secure token handling.
- HTTPS in production.
- Secure file handling.
- Database access controls.
- Protection against injection attacks.
- CORS configuration.
- Security headers.
- Audit logging.
- Payment webhook verification.

Secrets must be stored in secure environment configuration rather than source code.

**19.49 Environment Configuration**

The backend should separate environment-specific configuration.

Examples:

DATABASE_URL

JWT_SECRET

PAYMENT_API_KEY

PAYMENT_WEBHOOK_SECRET

SMS_API_KEY

EMAIL_API_KEY

STORAGE_ACCESS_KEY

Development, testing, and production environments should use separate credentials and configuration.

Production credentials must never be committed to source control.

**19.50 Database Access**

Application modules should not directly execute arbitrary database queries throughout controllers.

A preferred flow is:

Route

↓

Controller

↓

Service

↓

Repository / Data Access

↓

Database

This makes business logic easier to test and maintain.

**19.51 Controller Responsibilities**

Controllers should primarily:

- Receive requests.
- Extract authenticated user information.
- Validate request input through validators.
- Call the appropriate service.
- Return the appropriate response.

Controllers should not contain large amounts of business logic.

For example, a payment controller should not independently calculate the entire financial settlement process.

**19.52 Service Layer Responsibilities**

Services shall contain business logic.

Examples:

TripService

PaymentService

WalletService

InspectionService

NotificationService

DisputeService

DriverService

QuotationService

For example:

PaymentService.releaseFirstDriverPayment()

may perform:

1.  Retrieve trip.
2.  Verify trip state.
3.  Verify inspection.
4.  Verify handover.
5.  Verify required confirmations.
6.  Calculate 50%.
7.  Check previous release.
8.  Create wallet transaction.
9.  Update wallet.
10. Record audit event.
11. Trigger notification.

**19.53 Repository / Data Access Layer**

The repository layer should handle database interaction.

Examples:

TripRepository

PaymentRepository

WalletRepository

DriverRepository

InspectionRepository

NotificationRepository

The repository should provide controlled database operations rather than exposing arbitrary database manipulation to controllers.

**19.54 Middleware**

The backend shall use middleware for cross-cutting concerns.

Examples:

authenticationMiddleware

authorizationMiddleware

validationMiddleware

errorMiddleware

rateLimitMiddleware

loggingMiddleware

Example request flow:

Request

↓

Logging

↓

Authentication

↓

Authorization

↓

Validation

↓

Controller

↓

Service

↓

Repository

**19.55 Error Handling Architecture**

The backend should use centralized error handling.

Instead of every controller independently formatting errors, the application should provide a common error-handling mechanism.

Example:

Service Error

↓

Controller

↓

Central Error Handler

↓

Standard API Error Response

Internal errors should be logged for developers while the user receives an appropriate safe message.

**19.56 API and Trip Lifecycle Integration**

The API architecture shall respect the complete CarGo Kenya trip lifecycle.

For example:

REQUESTED

↓

Request API

↓

QUOTING

↓

Quotation API

↓

DRIVER SELECTED

↓

Selection API

↓

PAYMENT PENDING

↓

Payment API

↓

BOOKED

↓

Pickup / Inspection APIs

↓

TRIP START PENDING

↓

Start Confirmation APIs

↓

TRIP ACTIVE

↓

Payment Release

↓

IN TRANSIT

↓

Tracking APIs

↓

DELIVERY PENDING

↓

Delivery APIs

↓

DELIVERED

↓

COMPLETED

↓

Final Payment Release

This relationship shall remain consistent throughout the backend.

**19.57 API and Payment Release Integration**

The Payment and Wallet Module shall remain the financial authority for payment releases.

The API layer shall only initiate the operation.

For example:

Driver

↓

START TRIP

↓

Customer Confirmation

↓

Trip Service

↓

TRIP ACTIVE

↓

Payment Service

↓

Calculate 50%

↓

Wallet Transaction

↓

Driver Personal Wallet

↓

Notification Service

The API must not bypass the Payment Service.

**19.58 API and Notification Integration**

Important backend events should trigger the Notification Service.

For example:

Driver Selected

↓

Trip Service

↓

Notification Service

↓

Customer + Driver

Similarly:

Payment Confirmed

↓

Payment Service

↓

Notification Service

↓

Customer + Driver

Notifications should therefore be consequences of confirmed system events.

**19.59 API and Audit Integration**

Critical operations should produce audit records.

For example:

Payment Release

↓

Wallet Transaction

↓

Audit Event

↓

Notification

This creates a traceable sequence for financial and operational review.

**19.60 API Testing Requirements**

The backend shall be tested at multiple levels.

**Unit Testing**

Individual services and functions.

Examples:

- Payment calculation.
- Status validation.
- Wallet calculation.
- Permission checks.

**Integration Testing**

Interaction between:

- API.
- Services.
- Database.
- External providers.

**API Testing**

Testing complete endpoints.

Examples:

POST /api/v1/requests

POST /api/v1/quotations

POST /api/v1/payments

POST /api/v1/trips/:id/start

**Security Testing**

Testing:

- Unauthorized access.
- Role escalation.
- Invalid tokens.
- API manipulation.
- Duplicate requests.
- Injection attempts.

**19.61 Critical Backend Test Scenarios**

The MVP should specifically test the following scenarios.

**Scenario 1 — Successful Payment**

Customer Pays

↓

Payment Verified

↓

Trip BOOKED

**Scenario 2 — Failed Payment**

Payment Failed

↓

Trip remains PAYMENT PENDING

**Scenario 3 — Duplicate Payment Callback**

Callback 1

↓

Payment Recorded

Callback 2

↓

Already Processed

**Scenario 4 — Unauthorized Payment Release**

Driver Requests Release

↓

Trip Not TRIP ACTIVE

↓

Reject

**Scenario 5 — Correct First Release**

TRIP ACTIVE

↓

Driver Fee = KSh 18,000

↓

Release = KSh 9,000

**Scenario 6 — Duplicate Release**

First Release = KSh 9,000

Second Request

↓

Rejected / Existing Result Returned

**Scenario 7 — Final Release**

COMPLETED

↓

Remaining KSh 9,000

↓

Driver Wallet

**Scenario 8 — Unauthorized Trip Access**

User A requests User B's trip

↓

403 / appropriate authorization response

**19.62 API Documentation**

The backend shall maintain API documentation for developers.

Documentation should describe:

- Endpoint.
- HTTP method.
- Authentication requirement.
- Required permissions.
- Request parameters.
- Request body.
- Response structure.
- Error responses.
- Business rules.
- Example requests.
- Example responses.

A standardized API documentation system may be used during implementation.

**19.63 Backend Monitoring**

The production backend should provide basic monitoring for:

- API errors.
- Database failures.
- Payment failures.
- Webhook failures.
- Notification failures.
- High response times.
- Background job failures.
- Authentication failures.

The purpose is to allow developers and administrators to identify operational problems early.

**19.64 Backend Availability and Failure Handling**

The backend should handle temporary external-service failures gracefully.

For example:

Payment Provider Temporarily Unavailable

should not cause the entire application to crash.

Similarly:

SMS Provider Failed

should result in:

Notification = FAILED

rather than:

Trip = FAILED

Critical business transactions should be separated from non-critical communication operations.

**19.65 API Data Ownership**

Each module shall remain responsible for its own primary business data.

Examples:

Payment Module

→ Payment records

Wallet Module

→ Wallet transactions

Inspection Module

→ Inspection records

Notification Module

→ Notification records

Trip Module

→ Trip lifecycle

Modules may reference one another, but should not unnecessarily duplicate authoritative data.

**19.66 API Consistency Rules**

All backend modules should follow consistent conventions for:

- Naming.
- Authentication.
- Authorization.
- Error handling.
- Response structures.
- Pagination.
- Validation.
- Logging.
- Audit events.
- API versioning.

This is important because the CarGo Kenya backend is intended to be maintained and expanded after the MVP.

**19.67 MVP Backend Scope**

The following shall be included in the CarGo Kenya MVP backend.

**Authentication**

- Registration.
- Login.
- Authentication.
- Password management.
- Role-based authorization.

**Customer**

- Profile management.
- Transportation requests.
- Quotation viewing.
- Driver selection.
- Payment.
- Trip management.
- Trip confirmations.

**Driver**

- Driver profile.
- Verification.
- Request viewing.
- Quotations.
- Assigned trips.
- Pickup procedures.
- Inspection.
- Trip commencement.
- Delivery.
- Earnings.
- Wallet.
- Withdrawal.

**Trip**

- Trip creation.
- Trip lifecycle.
- Status transitions.
- Pickup.
- Inspection.
- Start confirmation.
- Tracking.
- Delivery.
- Completion.
- Cancellation.
- Dispute.

**Financial**

- Customer payment.
- Payment verification.
- Trip Wallet.
- Driver Personal Wallet.
- First 50% release.
- Final 50% release.
- Refunds.
- Adjustments.
- Withdrawals.

**Communication**

- Notifications.
- Customer-driver messaging.
- SMS where practical.
- Email where applicable.

**Administration**

- Driver verification.
- Trip monitoring.
- Payment monitoring.
- Dispute handling.
- Refund/adjustment management.
- Basic reporting.

**19.68 Backend Features Not Required for MVP**

The following shall remain outside the initial MVP unless implementation requirements change:

- Microservice architecture.
- Multiple independent backend applications.
- Advanced event-streaming infrastructure.
- AI-based backend decision making.
- Complex recommendation engines.
- International payment infrastructure.
- Advanced accounting integrations.
- Automated tax management.
- Advanced fraud-detection systems.
- Advanced financial products.
- Complex multi-provider payment routing.
- Voice communication infrastructure.
- Video communication infrastructure.
- Advanced analytics processing pipelines.

The MVP should prioritize reliability and simplicity over unnecessary architectural complexity.

**19.69 Backend Business Rules**

The following shall be treated as core backend rules.

**Rule 1**

The backend is the authoritative source of system state.

**Rule 2**

Frontend requests shall never bypass backend business validation.

**Rule 3**

Trip status transitions shall follow the approved CarGo Kenya lifecycle.

**Rule 4**

A customer must successfully pay the required trip amount before the trip becomes BOOKED.

**Rule 5**

The driver shall not receive transportation earnings immediately at booking.

**Rule 6**

The first 50% of the driver transportation fee shall only become releasable after the trip officially becomes TRIP ACTIVE and the required conditions are satisfied.

**Rule 7**

The remaining 50% shall only become releasable after the trip becomes COMPLETED and the required completion conditions are satisfied.

**Rule 8**

The backend shall calculate payment-release amounts.

**Rule 9**

Drivers shall not withdraw directly from Trip Wallets.

**Rule 10**

Only eligible funds in the Driver Personal Wallet may be withdrawn.

**Rule 11**

Financial transactions shall be traceable.

**Rule 12**

Critical financial operations shall be idempotent.

**Rule 13**

Payment-provider callbacks shall be verified.

**Rule 14**

Users shall only access resources for which they are authorized.

**Rule 15**

Inspection evidence shall remain associated with inspection records.

**Rule 16**

Notification failure shall not automatically invalidate a successful business transaction.

**Rule 17**

Important system operations shall generate appropriate audit records.

**Rule 18**

The backend shall prevent duplicate processing of critical operations.

**19.70 Complete Backend Architecture**

The complete CarGo Kenya MVP backend can therefore be represented as:

CARGo KENYA CLIENTS

│

┌──────────────┼──────────────┐

↓ ↓ ↓

CUSTOMER DRIVER ADMIN

APP APP DASHBOARD

│ │ │

└──────────────┼──────────────┘

↓

┌─────────────┐

│ API / ROUTES│

└──────┬──────┘

↓

┌────────────────────────┐

│ AUTHENTICATION & │

│ AUTHORIZATION │

└────────────┬───────────┘

↓

┌────────────────────────┐

│ CONTROLLERS │

└────────────┬───────────┘

↓

┌────────────────────────┐

│ SERVICE LAYER │

├────────────────────────┤

│ User Service │

│ Driver Service │

│ Request Service │

│ Quotation Service │

│ Trip Service │

│ Inspection Service │

│ Tracking Service │

│ Payment Service │

│ Wallet Service │

│ Notification Service │

│ Communication Service │

│ Delivery Service │

│ Rating Service │

│ Dispute Service │

│ Admin Service │

└────────────┬───────────┘

↓

┌────────────────────────┐

│ REPOSITORY / DATA │

│ ACCESS LAYER │

└────────────┬───────────┘

↓

┌─────────────┐

│ PostgreSQL │

└─────────────┘

External Integrations:

│

├── Payment Provider

├── SMS Provider

├── Email Provider

├── Location/GPS Services

└── File/Object Storage

The backend shall therefore operate as the central authority connecting the CarGo Kenya frontend applications, database, financial systems, operational modules, communication services, and external integrations.

**19.71 Final Backend Request Flow**

A typical critical CarGo Kenya operation shall follow:

CLIENT REQUEST

↓

API ROUTE

↓

AUTHENTICATION

↓

AUTHORIZATION

↓

VALIDATION

↓

CONTROLLER

↓

SERVICE

↓

BUSINESS RULE CHECK

↓

DATABASE TRANSACTION

↓

AUDIT RECORD

↓

EVENT / NOTIFICATION

↓

API RESPONSE

For financial operations:

CLIENT REQUEST

↓

AUTHENTICATION

↓

AUTHORIZATION

↓

VALIDATION

↓

PAYMENT / WALLET SERVICE

↓

BUSINESS RULE CHECK

↓

DATABASE TRANSACTION

↓

WALLET LEDGER

↓

AUDIT RECORD

↓

NOTIFICATION

↓

RESPONSE

This structure shall remain the foundation for the implementation of the CarGo Kenya MVP backend.

**19.72 Final Developer Principle**

The most important implementation principle for the CarGo Kenya backend shall be:

**The frontend requests an action; the backend decides whether that action is permitted.**

For example:

Frontend:

"Start Trip"

Backend:

"Is the driver authorized?"

"Is this the correct trip?"

"Is the pickup inspection complete?"

"Is the vehicle handover complete?"

"Has the required customer confirmation occurred?"

"Can the trip legally become TRIP ACTIVE?"

Only after the backend confirms all applicable requirements should the operation proceed.

The same principle applies to:

- Payments.
- Wallet releases.
- Withdrawals.
- Trip completion.
- Refunds.
- Disputes.
- Driver verification.
- Inspections.
- Communication access.
- Administrative actions.

This ensures that the CarGo Kenya backend remains secure, traceable, consistent with the approved MVP lifecycle, and suitable for implementation by multiple developers.

**20.0 NON-FUNCTIONAL REQUIREMENTS**

**20.1 Purpose**

The Non-Functional Requirements define the quality attributes, operational standards, performance expectations, security expectations, reliability requirements, usability requirements, and technical constraints that shall govern the development of the CarGo Kenya MVP.

While the functional requirements describe **what the system shall do**, the non-functional requirements describe **how well the system shall perform those functions**.

The CarGo Kenya system shall therefore not only provide transportation-request, quotation, booking, inspection, payment, tracking, communication, delivery, wallet, and reporting functionality, but shall also ensure that these functions operate in a manner that is:

- Secure.
- Reliable.
- Available.
- Responsive.
- Scalable within the MVP's expected operating range.
- Maintainable.
- Usable.
- Auditable.
- Consistent.
- Recoverable.
- Accessible through supported devices and networks.

These requirements shall apply across the entire CarGo Kenya platform and shall be considered during system architecture, database design, API development, frontend development, testing, deployment, and maintenance.

**20.2 Non-Functional Requirements Philosophy**

The CarGo Kenya MVP shall follow the principle:

**The system must not only perform the required operation; it must perform the operation safely, consistently, predictably, and in a way that users can understand.**

For example, it is not sufficient for the system to provide a payment button.

The payment process must also:

- Protect the transaction.
- Verify the payment.
- Prevent duplicate processing.
- Record the transaction.
- Maintain financial traceability.
- Update the appropriate trip status.
- Remain consistent if the payment provider retries a callback.

Similarly, it is not sufficient for the system to display GPS information.

The system should also:

- Handle temporary connectivity problems.
- Distinguish current information from last-known information.
- Avoid unnecessary system load.
- Protect location information.
- Continue operating appropriately when GPS data becomes temporarily unavailable.

**20.3 Performance Requirements**

The system shall provide acceptable response times for normal user and administrative operations.

Performance requirements shall primarily apply to:

- Web pages.
- Mobile-responsive interfaces.
- API requests.
- Database operations.
- Authentication.
- Trip searches.
- Quotation submission.
- Booking operations.
- Payment-status updates.
- Notification retrieval.
- Wallet transactions.
- Inspection records.
- Reporting dashboards.

For normal operations under expected MVP load, the system should target:

- Approximately **1–3 seconds** for ordinary user-interface/API operations.
- Longer processing times may be acceptable for operations involving external services such as payment providers, SMS providers, email providers, or map/GPS services.
- Long-running operations should not unnecessarily block the user's interface.

The frontend should provide appropriate loading indicators where an operation requires additional processing.

**20.4 API Response Performance**

The backend API shall be designed to provide efficient responses.

For normal authenticated API requests:

- The system should target a response time of approximately **1–2 seconds** under normal operating conditions.
- Requests involving complex reports, external payment providers, or large datasets may take longer.
- API endpoints should avoid returning unnecessary data.
- Pagination should be used for potentially large collections.
- Database queries should be optimized for commonly accessed records.

For example:

Instead of returning every trip belonging to a driver in one response:

GET /driver/trips

the system should support controlled retrieval such as:

GET /driver/trips?page=1&limit=20

This reduces unnecessary database and network load.

**20.5 Page and Interface Loading**

The application interface should load efficiently on supported devices.

The frontend should:

- Minimize unnecessary JavaScript execution.
- Optimize images.
- Avoid unnecessarily large assets.
- Load critical content first.
- Use lazy loading where appropriate.
- Avoid blocking the entire interface while non-critical information is loading.
- Provide meaningful loading states.

The system should remain usable on common mobile devices because customers, drivers, and administrators may not always access the platform using high-performance computers.

**20.6 Scalability Requirements**

The CarGo Kenya MVP shall be designed so that the system can grow beyond the initial MVP user base without requiring a complete architectural replacement.

The architecture should allow growth in:

- Customers.
- Drivers.
- Transportation requests.
- Quotations.
- Trips.
- Inspection records.
- Photographs.
- GPS records.
- Payment transactions.
- Notifications.
- Wallet transactions.
- Reports.

The MVP does not require massive enterprise-scale infrastructure.

However, the implementation should avoid architectural decisions that make future scaling unnecessarily difficult.

Examples include:

- Proper database indexing.
- Modular backend services.
- Separation of business logic from presentation logic.
- Efficient API design.
- Pagination.
- Appropriate file-storage architecture.
- Controlled background processing.
- Transaction-safe financial operations.

**20.7 Expected MVP Load**

The exact production load may not be known during initial development.

Therefore, the MVP should initially be designed to support a reasonable small-to-medium operational environment.

The system should be capable of supporting, subject to hosting infrastructure:

- Multiple simultaneous customers.
- Multiple active drivers.
- Multiple concurrent transportation requests.
- Multiple quotations.
- Active trips.
- Payment transactions.
- Notifications.
- Administrative operations.

The exact numerical capacity shall be validated during deployment testing rather than assumed without evidence.

**20.8 Availability Requirements**

The CarGo Kenya platform should be available whenever customers and drivers are expected to create, manage, and monitor transportation assignments.

The target MVP availability should be approximately:

**99% monthly availability**, excluding:

- Planned maintenance.
- Third-party service outages.
- Unavoidable infrastructure failures.
- Force majeure events.

The system should provide appropriate error handling when a dependent service becomes unavailable.

For example:

If the payment provider is temporarily unavailable:

Customer

↓

Payment Request

↓

Payment Provider Unavailable

↓

Payment = PROCESSING / FAILED

↓

Customer Informed

The system should not incorrectly mark the trip as BOOKED.

**20.9 Reliability Requirements**

The system shall preserve reliable operation even when individual requests fail.

The application should handle:

- Network interruptions.
- Duplicate requests.
- Browser refreshes.
- API retries.
- Payment callbacks arriving more than once.
- Notification delivery failures.
- Temporary external-service failures.
- Database transaction failures.

A failed operation should not leave the system in an inconsistent state.

For example:

If a driver payment release fails halfway through processing, the system must not record:

Driver Balance + KSh 9,000

without also recording the corresponding financial transaction.

Financial operations should therefore use appropriate database transactions and consistency controls.

**20.10 Data Consistency**

The system shall maintain consistency between related records.

Examples include:

Trip

↓

Payment

↓

Trip Wallet

↓

Driver Release

↓

Driver Wallet

and:

Trip

↓

Pickup Inspection

↓

Trip Start Confirmation

↓

TRIP ACTIVE

The system shall prevent situations where one part of the system indicates that an operation has occurred while the underlying required record does not exist.

For example:

A trip must not become BOOKED merely because a frontend payment button was clicked.

The backend must verify the actual payment result.

**20.11 Transaction Integrity**

Critical operations shall be processed atomically where appropriate.

Transactions that require strong consistency include:

- Booking confirmation.
- Payment recording.
- Trip Wallet updates.
- Driver payment release.
- Driver wallet updates.
- Refund recording.
- Financial adjustments.
- Important trip-status transitions.

For example, the first driver payment release should conceptually operate as:

Validate Conditions

↓

Create Release Transaction

↓

Update Trip Wallet

↓

Update Driver Wallet

↓

Record Release

↓

Commit Transaction

If a required operation fails, the transaction should be rolled back where appropriate.

**20.12 Idempotency Requirements**

Critical operations shall be protected against duplicate execution.

This is particularly important for:

- Payment callbacks.
- Payment confirmation.
- Driver payment releases.
- Refund processing.
- Wallet transactions.
- Booking operations.
- Notification generation.

For example:

Payment Callback

↓

Transaction Reference

↓

Already Processed?

/ \\

YES NO

↓ ↓

Ignore Process

The system shall use unique references or equivalent mechanisms to prevent duplicate financial processing.

**20.13 Security Requirements**

Security shall be treated as a cross-cutting requirement throughout the CarGo Kenya platform.

The system shall protect:

- User accounts.
- Passwords.
- Personal information.
- Driver verification information.
- Vehicle information.
- Payment information.
- Wallet information.
- GPS/location information.
- Inspection photographs.
- Communication records.
- Administrative functions.
- System credentials.

Security controls shall include, as applicable:

- Authentication.
- Authorization.
- Role-based access control.
- Secure password storage.
- Input validation.
- Secure session/token handling.
- API authorization.
- Protection against unauthorized database access.
- Secure payment-provider integration.
- Audit logging.
- Restricted administrative access.

Detailed security architecture shall be defined in the dedicated security section.

**20.14 Authentication Performance and Reliability**

Authentication operations shall be reliable and secure.

The system shall:

- Validate credentials securely.
- Avoid exposing password information.
- Prevent unauthorized account access.
- Handle expired authentication sessions/tokens.
- Return appropriate authentication errors.
- Avoid revealing sensitive information through error messages.

The system should also avoid unnecessarily expensive authentication operations that negatively affect normal user experience.

**20.15 Authorization Requirements**

The system shall ensure that users can only perform actions appropriate to their role and permissions.

The primary roles established by the CarGo Kenya system shall include relevant categories such as:

- Customer.
- Driver.
- Administrator.
- Other authorized operational roles where applicable.

For example:

A customer must not be able to:

- Approve driver verification.
- Release driver funds.
- Modify another customer's trip.
- Access another driver's wallet.
- Access administrative reports.

A driver must not be able to:

- Access another driver's earnings.
- Modify payment-release amounts.
- Approve their own verification.
- Access unrelated customer trips.

**20.16 Usability Requirements**

The system shall be understandable to users with different levels of technical experience.

The interface should:

- Use clear labels.
- Use consistent terminology.
- Provide understandable instructions.
- Avoid unnecessary technical language.
- Clearly display trip status.
- Clearly display payment status.
- Clearly distinguish pending and completed actions.
- Provide confirmation before important irreversible actions.
- Provide meaningful error messages.

For example, instead of:

Error 409

the user should receive an understandable message such as:

This trip has already been booked and cannot be selected again.

**20.17 Consistency of User Interface**

The system shall maintain consistent terminology and interaction patterns across modules.

The following terms shall retain their established meanings:

- REQUESTED
- QUOTING
- DRIVER SELECTED
- PAYMENT PENDING
- BOOKED
- PICKUP PENDING
- PICKUP INSPECTION
- TRIP START PENDING
- TRIP ACTIVE
- IN TRANSIT
- DELIVERY PENDING
- DELIVERED
- COMPLETED
- DISPUTED
- CANCELLED

The same terminology should be used across:

- Frontend.
- Backend.
- Database where appropriate.
- Notifications.
- Reports.
- Administrative dashboards.
- Documentation.

This prevents confusion between developers and users.

**20.18 Mobile Responsiveness**

The CarGo Kenya system shall be responsive and usable on:

- Smartphones.
- Tablets.
- Laptops.
- Desktop computers.

Mobile responsiveness is particularly important for drivers because many operational activities may occur while the driver is away from a computer.

Driver interfaces should therefore prioritize:

- Large actionable buttons.
- Simple navigation.
- Readable text.
- Clear trip status.
- Easy access to inspection actions.
- Camera/photo functionality.
- GPS/tracking functions.
- Trip-start confirmation.
- Delivery confirmation.
- Wallet information.

**20.19 Network Resilience**

The system shall account for unstable or limited internet connectivity.

This is particularly important for:

- Drivers travelling between locations.
- GPS tracking.
- Vehicle inspections.
- Photograph uploads.
- Trip communication.
- Payment confirmations.

Where practical, the application should:

- Detect connectivity problems.
- Inform the user when an operation has not yet reached the server.
- Prevent accidental duplicate submissions.
- Retry appropriate operations.
- Preserve locally entered information temporarily where technically safe.
- Clearly distinguish between saved and unsaved information.

The system must not falsely indicate that an operation has been completed when the server has not confirmed it.

**20.20 GPS and Connectivity Resilience**

GPS functionality shall tolerate temporary connectivity interruptions.

For example:

GPS Available

↓

Location Recorded

↓

Network Lost

↓

Last Known Location Maintained

↓

Network Restored

↓

Tracking Resumes

Temporary GPS failure should not automatically change the trip status to a failed state.

The system should clearly identify when displayed location information represents the last known location rather than a current location.

**20.21 File and Image Performance**

Vehicle inspection photographs may generate significant amounts of data.

The system should therefore optimize image storage and transfer.

Requirements should include:

- Reasonable image-size limits.
- Image compression where appropriate.
- Secure storage.
- Controlled access.
- Unique file references.
- Prevention of unauthorized access.
- Appropriate upload validation.

The system should avoid storing large uncompressed images unnecessarily.

Inspection evidence must remain associated with the appropriate inspection record.

**20.22 Data Storage Requirements**

Structured system data shall be stored in an appropriate relational database or equivalent persistent data store according to the database architecture.

Important data shall not depend solely on browser storage or temporary application memory.

Persistent records shall include, where applicable:

- Users.
- Driver profiles.
- Vehicles.
- Transportation requests.
- Quotations.
- Trips.
- Inspections.
- Payments.
- Trip Wallet transactions.
- Driver Wallet transactions.
- Withdrawals.
- Notifications.
- Messages.
- GPS/tracking information.
- Reports.
- Audit records.

**20.23 Data Integrity**

The database shall enforce appropriate integrity constraints.

These may include:

- Primary keys.
- Foreign keys.
- Unique constraints.
- Required fields.
- Appropriate data types.
- Check constraints where applicable.
- Transaction controls.

For example:

A wallet transaction should not reference a Trip ID that does not exist.

A quotation should not reference a nonexistent transportation request.

An inspection record should not reference an unrelated trip.

**20.24 Maintainability**

The system shall be designed so that developers can understand, modify, test, and extend the application without unnecessarily affecting unrelated modules.

The implementation should encourage:

- Modular architecture.
- Clear separation of concerns.
- Reusable services.
- Consistent naming conventions.
- Clear API contracts.
- Centralized configuration.
- Proper error handling.
- Meaningful code documentation.
- Version control.
- Automated testing where practical.

The Payment and Wallet Module, for example, should not contain unrelated notification-delivery logic directly inside every payment function.

Instead:

Payment Service

↓

Payment Result

↓

Notification Service

This improves maintainability.

**20.25 Modularity**

The system shall maintain clear boundaries between major functional areas.

The established modules include areas such as:

- User and Account Management.
- Transportation Requests.
- Driver Quotations.
- Trip Management.
- Vehicle Inspection and Handover.
- GPS and Trip Tracking.
- Payment and Wallet.
- Notification and Communication.
- Reporting, Dashboards and Analytics.
- Database and Data Management.
- API and Backend Architecture.

A change to one module should have minimal unintended impact on unrelated modules.

**20.26 Extensibility**

The MVP should provide a reasonable foundation for future functionality without implementing unnecessary future features prematurely.

The architecture should allow future expansion such as:

- Additional payment providers.
- Additional notification channels.
- Advanced analytics.
- Additional user roles.
- Additional vehicle categories.
- Automated fuel payments.
- Advanced accounting integrations.
- Mobile applications.
- Additional geographic regions.

However, extensibility shall not be used as a reason to over-engineer the MVP.

The immediate priority remains delivering the agreed CarGo Kenya MVP.

**20.27 Interoperability**

The system should be capable of communicating with external services through well-defined interfaces.

Potential external services include:

- Payment providers.
- SMS providers.
- Email services.
- Mapping/GPS services.
- Cloud storage services.

External integrations should preferably be implemented through service abstractions rather than spreading provider-specific logic throughout the application.

For example:

CarGo Application

↓

Payment Service

↓

Payment Provider

rather than:

Trip Module

Wallet Module

Booking Module

Customer Module

↓

Direct Provider-Specific Code

**20.28 Error Handling**

The system shall provide controlled error handling for expected and unexpected failures.

Errors should:

- Be logged appropriately.
- Return understandable responses.
- Avoid exposing sensitive technical information.
- Avoid crashing unrelated services.
- Allow developers to diagnose the underlying problem.

User-facing errors should be understandable.

Developer/system logs may contain more technical information where appropriate.

**20.29 Logging Requirements**

The system shall maintain appropriate application logs.

Important events may include:

- Authentication failures.
- API errors.
- Payment failures.
- Payment callbacks.
- Wallet transactions.
- Trip-status changes.
- Inspection submissions.
- GPS failures.
- Notification failures.
- Administrative actions.
- System exceptions.

Logs should contain sufficient information for troubleshooting without unnecessarily storing sensitive information.

**20.30 Auditability**

Important business and financial actions shall be traceable.

The system should be able to determine:

- Who performed an action.
- What action occurred.
- Which trip was affected.
- Which financial transaction was affected where applicable.
- When the action occurred.
- What the previous and resulting state was where appropriate.

This is especially important for:

- Payment releases.
- Refunds.
- Financial adjustments.
- Disputes.
- Trip-status changes.
- Driver verification.
- Administrative intervention.

**20.31 Backup Requirements**

Important persistent system data shall be backed up regularly.

Backup coverage should include, where applicable:

- Database records.
- Payment records.
- Wallet records.
- Trip records.
- Inspection metadata.
- Important uploaded evidence.
- Configuration required for system recovery.

Backups should be stored separately from the primary application environment where practical.

The exact backup frequency shall depend on the selected hosting infrastructure and operational requirements.

**20.32 Disaster Recovery**

The system should have a basic recovery procedure for major failures.

Potential failures include:

- Database corruption.
- Server failure.
- Hosting failure.
- Accidental data deletion.
- Application deployment failure.
- External infrastructure failure.

The recovery process should provide a means of restoring:

1.  Application services.
2.  Database records.
3.  Required uploaded evidence.
4.  Configuration.
5.  Critical integrations.

Financial and trip records should receive particular priority during recovery.

**20.33 Recovery Point Objective**

For the MVP, the system should aim to minimize the amount of data that could be lost following a major failure.

The exact Recovery Point Objective (RPO) shall depend on the hosting and database infrastructure selected for deployment.

Financial transactions should receive stronger protection than temporary non-critical interface information.

**20.34 Recovery Time Objective**

The system should aim to restore critical services within a reasonable operational period following a major failure.

The exact Recovery Time Objective (RTO) shall be established according to:

- Hosting infrastructure.
- Database backup strategy.
- Development resources.
- Operational requirements.

The MVP does not require enterprise-level disaster-recovery infrastructure unless operational scale later justifies it.

**20.35 Data Privacy**

The system shall protect user information and only expose information necessary for the relevant operation.

Examples of sensitive or potentially sensitive information include:

- Phone numbers.
- Email addresses.
- Identification information.
- Driver verification documents.
- Vehicle information.
- GPS location.
- Payment references.
- Wallet balances.
- Communication records.

Users should only access information for which they are authorized.

**20.36 Data Minimization**

The CarGo Kenya platform should avoid collecting unnecessary information.

For every data field, the development team should be able to identify:

- Why it is required.
- Which module uses it.
- Who can access it.
- How long it needs to be retained.

This reduces:

- Privacy risks.
- Storage requirements.
- Security exposure.
- Unnecessary development complexity.

**20.37 Financial Data Protection**

Financial information shall receive stronger integrity and security controls.

The system shall protect:

- Customer payment records.
- Trip Wallet transactions.
- Driver earnings.
- Wallet balances.
- Withdrawal records.
- Refunds.
- Financial adjustments.

Frontend users must never be trusted to determine financial amounts.

For example:

Frontend:

Release Amount = KSh 18,000

shall not automatically result in an KSh 18,000 release.

The backend must calculate the permitted amount using trusted database records and business rules.

**20.38 Time and Date Consistency**

The system shall use a consistent approach to storing and displaying timestamps.

Database timestamps should preferably be stored in a consistent timezone such as UTC.

The frontend may display dates and times according to the user's applicable timezone.

Important timestamps include:

- Account creation.
- Quotation submission.
- Driver selection.
- Payment initiation.
- Payment confirmation.
- Pickup.
- Inspection.
- Trip start.
- GPS events.
- Delivery.
- Completion.
- Payment release.
- Withdrawal.
- Refund.
- Administrative actions.

This is particularly important when investigating disputes.

**20.39 Data Validation**

All user-submitted information shall be validated on the backend.

Frontend validation may improve user experience, but it shall not replace backend validation.

Validation should apply to:

- Names.
- Phone numbers.
- Email addresses.
- Locations.
- Quotation amounts.
- Payment information.
- Inspection values.
- Odometer readings.
- Fuel levels.
- Messages.
- Uploaded files.
- Administrative inputs.

The backend shall treat all client-provided information as untrusted until validated.

**20.40 API Security and Reliability**

The API shall:

- Authenticate protected requests.
- Authorize access.
- Validate request bodies.
- Validate path and query parameters.
- Return appropriate HTTP status codes.
- Prevent unauthorized resource access.
- Apply rate limiting where appropriate.
- Avoid exposing sensitive internal information.
- Handle malformed requests safely.

API operations affecting financial or trip-critical data should have stronger validation and authorization controls.

**20.41 Rate Limiting**

The system should apply rate limiting to operations vulnerable to abuse.

Potential targets include:

- Login.
- Account registration.
- Password recovery.
- OTP/verification operations where applicable.
- Payment initiation.
- API requests.
- Messaging.
- Administrative endpoints.

Rate limits should be configured according to actual usage requirements.

The purpose is to reduce:

- Automated abuse.
- Brute-force attempts.
- Accidental request flooding.
- Denial-of-service risk.

**20.42 Concurrent Access**

The system shall safely handle situations where multiple users attempt to modify the same record.

Examples include:

- Two drivers attempting to accept the same assignment where applicable.
- Customer and administrator modifying a trip.
- Driver and customer confirming trip completion.
- Duplicate payment callbacks.
- Multiple withdrawal requests.
- Multiple administrative actions.

The backend should use appropriate transaction and concurrency controls to ensure that only valid state transitions are accepted.

**20.43 Trip Status Integrity**

The trip lifecycle shall be protected from invalid transitions.

For example:

PAYMENT PENDING

↓

BOOKED

↓

PICKUP PENDING

↓

PICKUP INSPECTION

↓

TRIP START PENDING

↓

TRIP ACTIVE

↓

IN TRANSIT

↓

DELIVERY PENDING

↓

DELIVERED

↓

COMPLETED

The system should prevent users from arbitrarily changing a trip from one state to another.

For example:

PAYMENT PENDING

↓

COMPLETED

should not be accepted unless the required intermediate business conditions have been satisfied or an authorized administrative override exists.

**20.44 Notification Reliability**

Notification delivery should be treated as a supporting service rather than the source of truth.

For example:

Payment Confirmed

↓

Payment Record = PAID

↓

Trip = BOOKED

↓

Notification Attempt

If the notification fails:

Notification = FAILED

the payment and booking should remain valid.

This ensures that communication problems do not corrupt core business transactions.

**20.45 Monitoring Requirements**

The production system should provide basic monitoring for:

- Application availability.
- Server health.
- Database health.
- API errors.
- Payment failures.
- Notification failures.
- Storage usage.
- GPS service failures.
- System resource usage.

Monitoring should help developers identify problems before they become widespread operational failures.

**20.46 Observability**

The system should provide enough operational information to answer questions such as:

- Why did this payment fail?
- Why did this trip not become BOOKED?
- Why was the driver's first payment not released?
- Why did an SMS fail?
- Why is the driver's GPS unavailable?
- Why was a withdrawal rejected?
- Who changed the trip status?
- When was the inspection completed?

This should be achieved through appropriate:

- Logs.
- Audit records.
- Transaction references.
- Error records.
- System metrics.

**20.47 Compatibility Requirements**

The web application should support commonly used modern browsers.

The MVP should prioritize current versions of:

- Google Chrome.
- Microsoft Edge.
- Mozilla Firefox.
- Safari where applicable.

The system should use standard web technologies and avoid unnecessary dependence on obsolete browser functionality.

**20.48 Deployment Requirements**

The application shall be deployable in a production environment using the selected technology stack.

The deployment process should support:

- Environment configuration.
- Database configuration.
- Secure secrets management.
- Application startup.
- Database migrations.
- Logging.
- Error monitoring.
- Backup configuration.
- Controlled updates.

Production credentials must not be stored directly in publicly accessible source code.

**20.49 Environment Separation**

Where practical, the development team should maintain separate environments for:

Development

↓

Testing / Staging

↓

Production

Development and testing activities should not unnecessarily affect production financial or customer data.

Production payment credentials should not be casually used during development.

**20.50 Configuration Management**

Environment-specific values should be managed through appropriate configuration mechanisms.

Examples include:

- Database credentials.
- API keys.
- Payment-provider credentials.
- SMS credentials.
- Email credentials.
- JWT/security secrets.
- Storage configuration.

Sensitive configuration values shall not be committed to public repositories.

**20.51 Testing Requirements**

The system shall be tested at multiple levels.

Testing should include, where applicable:

**Unit Testing**

Testing individual functions or services.

Example:

calculateDriverFirstRelease()

should correctly calculate 50% of the stored driver fee.

**Integration Testing**

Testing interactions between modules.

Example:

Payment Verified

↓

Trip Wallet Updated

↓

Trip BOOKED

↓

Notification Generated

**API Testing**

Testing:

- Authentication.
- Authorization.
- Validation.
- Error responses.
- Business rules.

**User Interface Testing**

Testing:

- Forms.
- Buttons.
- Navigation.
- Responsive layouts.
- Status displays.

**End-to-End Testing**

Testing complete workflows such as:

Customer Request

↓

Driver Quotation

↓

Driver Selection

↓

Payment

↓

Booking

↓

Inspection

↓

Trip Start

↓

Delivery

↓

Completion

↓

Driver Payment

**20.52 Financial Testing**

Financial functionality shall receive additional testing because incorrect financial processing can cause direct operational and monetary consequences.

Testing shall include:

- Successful payments.
- Failed payments.
- Duplicate payment callbacks.
- Partial refunds.
- Full refunds.
- First 50% release.
- Final 50% release.
- Duplicate release attempts.
- Insufficient wallet balance.
- Withdrawal failures.
- Financial adjustments.
- Disputed payments.
- Cancellation before trip start.
- Failed driver pickup.

**20.53 Security Testing**

Security testing should include:

- Authentication testing.
- Authorization testing.
- Input validation.
- API access control.
- Session/token security.
- File-upload validation.
- Rate-limit testing.
- Unauthorized resource access.
- Wallet manipulation attempts.
- Payment manipulation attempts.
- Administrative privilege testing.

The objective is to verify that users cannot bypass the application's business rules simply by manipulating frontend requests.

**20.54 Usability Testing**

The MVP should be tested with representative users where practical.

Testing should determine whether users can understand and complete important workflows such as:

**Customer**

Create Request

↓

Review Quotations

↓

Select Driver

↓

Pay

↓

Confirm Trip Start

↓

Monitor Trip

↓

Confirm Delivery

**Driver**

View Request

↓

Submit Quotation

↓

Receive Assignment

↓

Perform Inspection

↓

Start Trip

↓

Update Trip

↓

Complete Delivery

↓

View Earnings

↓

Withdraw

The objective is to identify confusing interfaces before production deployment.

**20.55 Accessibility**

The system should follow reasonable accessibility practices.

The interface should provide:

- Readable text.
- Adequate contrast.
- Clearly identifiable buttons.
- Labels for form fields.
- Understandable error messages.
- Keyboard accessibility where practical.
- Alternative text for meaningful images where appropriate.
- Logical navigation.

Accessibility should be considered during frontend development rather than added only after implementation.

**20.56 Documentation Requirements**

The system shall be accompanied by sufficient technical documentation for developers and administrators.

Documentation should include:

- System architecture.
- Database structure.
- API documentation.
- Authentication requirements.
- Environment variables.
- Deployment instructions.
- Payment integration.
- Notification integration.
- Trip lifecycle.
- Wallet rules.
- Inspection workflow.
- Administrative functions.
- Troubleshooting procedures.

Documentation should remain consistent with the implemented system.

**20.57 Code Quality Requirements**

The implementation should follow consistent coding standards.

Developers should maintain:

- Meaningful variable names.
- Consistent naming conventions.
- Modular functions.
- Appropriate comments.
- Avoidance of unnecessary duplicated code.
- Clear error handling.
- Separation of business logic.
- Consistent API response structures.

The objective is to ensure that another developer can understand and maintain the codebase.

**20.58 Version Control**

All production code should be maintained using version control.

The development process should support:

- Commit history.
- Branching where appropriate.
- Code review where practical.
- Rollback to previous stable versions.
- Controlled production releases.

Sensitive credentials and secrets shall not be committed to the repository.

**20.59 Dependency Management**

Third-party libraries and packages should be managed carefully.

The development team should:

- Use supported versions.
- Avoid unnecessary dependencies.
- Monitor important security vulnerabilities.
- Keep dependency versions controlled.
- Remove unused packages.

The objective is to reduce unnecessary security and maintenance risks.

**20.60 Resource Efficiency**

The MVP should use infrastructure resources efficiently.

The system should avoid:

- Unnecessary database queries.
- Repeated API calls.
- Excessive GPS updates.
- Uncompressed large files.
- Unnecessary notification delivery.
- Unbounded data retrieval.

This is particularly important because the initial system should remain affordable to operate.

**20.61 Cost Efficiency**

The CarGo Kenya MVP shall be designed with operational cost in mind.

The architecture should avoid unnecessarily expensive infrastructure during the MVP phase.

Cost considerations shall include:

- Hosting.
- Database resources.
- File storage.
- GPS/map services.
- SMS costs.
- Email services.
- Payment-provider charges.
- Monitoring services.

The system should scale infrastructure according to actual usage rather than assuming enterprise-level requirements from the beginning.

**20.62 Third-Party Service Dependency**

The system should recognize that external services may fail independently of CarGo Kenya.

Potential dependencies include:

CarGo Kenya

├── Payment Provider

├── SMS Provider

├── Email Provider

├── Maps/GPS Provider

└── Cloud Storage

The failure of one external service should not unnecessarily bring down unrelated parts of the system.

For example:

SMS Provider Down

↓

Notifications Delayed

↓

Core Trip System Continues

provided that the underlying business operation itself remains valid.

**20.63 Graceful Degradation**

Where possible, the system should continue providing core functionality when non-critical supporting services become temporarily unavailable.

Examples:

**SMS unavailable**

In-app notifications may continue.

**GPS temporarily unavailable**

Last-known location may remain visible.

**Email unavailable**

Critical information may remain available in-app.

**Mapping service temporarily unavailable**

Stored trip addresses may still be displayed.

However, the system must not falsely claim that unavailable information is current.

**20.64 Business Rule Enforcement**

Critical business rules shall be enforced at the backend level.

The frontend may guide users, but it shall not be considered a security boundary.

Examples include:

- Driver quotation rules.
- Driver selection.
- Booking requirements.
- Inspection requirements.
- Trip-start confirmation.
- Payment-release conditions.
- Wallet withdrawal rules.
- Cancellation rules.
- Administrative permissions.

This requirement is particularly important because a malicious or technically knowledgeable user can bypass frontend restrictions by directly calling the API.

**20.65 Administrative Override Controls**

Authorized administrators may need to intervene in exceptional situations.

Administrative overrides should therefore:

- Require appropriate authorization.
- Record the administrator.
- Record the action.
- Record the affected trip.
- Record the reason.
- Create an audit record.
- Avoid silently modifying financial history.

Administrative intervention should be treated as an exception rather than the normal operating mechanism.

**20.66 Non-Functional Requirements and MVP Boundaries**

The non-functional requirements shall support the MVP without unnecessarily turning the project into an enterprise platform.

The MVP shall prioritize:

- Security.
- Reliability.
- Data integrity.
- Financial consistency.
- Usability.
- Reasonable performance.
- Maintainability.
- Basic scalability.
- Backup and recovery.
- Monitoring.
- Auditability.

The MVP does not require:

- Global-scale infrastructure.
- Multi-region deployment.
- Enterprise disaster-recovery architecture.
- Advanced artificial intelligence.
- Complex microservice infrastructure.
- Unlimited horizontal scaling.
- Enterprise-grade data warehousing.

Such capabilities may be introduced later if actual business requirements justify them.

**20.67 Non-Functional Requirements Acceptance Criteria**

The following criteria shall be used to determine whether the MVP satisfies the major non-functional requirements.

**Performance**

The system should respond within acceptable time under normal expected MVP load.

**Security**

Unauthorized users must not be able to access protected resources or manipulate protected business operations.

**Reliability**

Failed requests must not leave critical records in inconsistent states.

**Financial Integrity**

Payment and wallet transactions must be traceable and protected against duplicate processing.

**Usability**

Customers, drivers, and administrators should be able to complete their primary workflows without requiring technical knowledge.

**Availability**

The production system should target approximately 99% monthly availability, excluding defined exceptions.

**Maintainability**

Developers should be able to modify individual modules without unnecessarily breaking unrelated functionality.

**Data Integrity**

Related records must maintain valid relationships and consistent states.

**Recoverability**

Critical data should be backed up and recoverable following major system failure.

**Auditability**

Important operational and financial actions must be traceable to an actor, event, time, and relevant record.

**20.68 Summary of Non-Functional Requirements**

The CarGo Kenya MVP shall be developed as a secure, reliable, maintainable, responsive, and operationally consistent transportation platform.

The major non-functional requirements can be summarized as:

| **Category** | **Requirement** |
| --- | --- |
| Performance | Responsive operation under expected MVP load |
| Availability | Target approximately 99% monthly availability |
| Reliability | Prevent inconsistent system states |
| Scalability | Support reasonable growth without architectural replacement |
| Security | Protect accounts, payments, wallets, data, and APIs |
| Usability | Provide clear and understandable workflows |
| Mobile Support | Responsive operation on smartphones and computers |
| Data Integrity | Maintain valid and consistent records |
| Financial Integrity | Protect payment and wallet transactions |
| Idempotency | Prevent duplicate critical operations |
| Maintainability | Use modular and understandable architecture |
| Interoperability | Support controlled external service integrations |
| Error Handling | Handle failures safely and clearly |
| Logging | Record important technical and operational events |
| Auditability | Trace important actions and financial events |
| Backup | Protect critical persistent data |
| Recovery | Provide a basic disaster-recovery capability |
| Privacy | Restrict access to personal and operational information |
| Testing | Test functional, integration, security, financial, and usability behavior |
| Monitoring | Monitor application and infrastructure health |
| Cost Efficiency | Avoid unnecessary infrastructure and service costs |
| Accessibility | Follow reasonable accessibility practices |
| Documentation | Maintain sufficient technical and operational documentation |

**20.69 Final Non-Functional Architecture Principle**

The CarGo Kenya system shall follow the following overall principle:

CARGO KENYA MVP

│

┌───────────────┼────────────────┐

│ │ │

FUNCTIONAL DATA NON-FUNCTIONAL

FEATURES MANAGEMENT QUALITY

│ │ │

│ │ ┌────────┼────────┐

│ │ │ │ │

│ │ SECURITY RELIABILITY PERFORMANCE

│ │ │ │ │

│ │ USABILITY SCALABILITY

│ │ │ │

│ │ MAINTAINABILITY

│ │ │

└───────────────┼───────┘

│

CONSISTENT SYSTEM

│

↓

OPERATIONAL MVP

The purpose of these requirements is therefore not to introduce additional business functionality. Instead, they establish the **quality and technical standards under which the functionality defined in Chapters 1–19 must operate**.

All subsequent system-design decisions should remain consistent with these requirements.

**21.0 SYSTEM INTEGRATIONS & EXTERNAL SERVICES**

**21.1 Purpose**

The System Integrations and External Services Module shall define how the CarGo Kenya platform communicates with external systems and third-party service providers required to operate the MVP.

The purpose of this module is to ensure that external services are integrated in a controlled, secure, reliable, and replaceable manner.

The CarGo Kenya MVP may depend on external services for:

- Customer payments.
- Driver wallet withdrawals.
- SMS notifications.
- Email notifications.
- GPS and mapping.
- Geolocation.
- Address and route information.
- File and image storage.
- Authentication-related services where applicable.
- Hosting and infrastructure.
- Monitoring and error reporting.

The system shall not allow external services to directly control the core business logic of CarGo Kenya.

The CarGo Kenya backend shall remain the central authority for:

- User accounts.
- Driver verification.
- Transportation requests.
- Quotations.
- Driver selection.
- Trip statuses.
- Vehicle inspections.
- Trip-start confirmation.
- Delivery confirmation.
- Payment-release conditions.
- Wallet balances.
- Disputes.
- Notifications.
- Audit records.

External services shall provide supporting capabilities while the CarGo Kenya backend controls how those capabilities are used.

**21.2 Integration Philosophy**

The CarGo Kenya integration architecture shall follow the principle:

**External services provide capabilities; CarGo Kenya controls the business process.**

For example:

Payment Provider  
↓  
Payment Result  
↓  
CarGo Kenya Backend  
↓  
Verify Payment  
↓  
Update Payment Record  
↓  
Update Trip  
↓  
Create Notification

The payment provider should not directly decide:

"This trip is now BOOKED."

Instead, the payment provider reports the payment result and the CarGo Kenya backend determines whether the business conditions for booking have been satisfied.

The same principle shall apply to:

- GPS providers.
- SMS providers.
- Email providers.
- Storage providers.
- Mapping services.

**21.3 External Service Categories**

The MVP integration architecture shall primarily consider the following categories:

| **Integration** | **Primary Purpose** |
| --- | --- |
| Payment Provider | Customer payments and financial transactions |
| Withdrawal Provider | Driver wallet withdrawals |
| SMS Provider | Critical SMS communication |
| Email Provider | Email communication |
| Maps/GPS Provider | Location, mapping and tracking |
| Geocoding Service | Address/location conversion |
| File Storage | Inspection photographs and documents |
| Hosting/Infrastructure | Application operation |
| Monitoring | Errors, system health and diagnostics |

The exact service providers may be selected during implementation based on:

- Cost.
- Availability in Kenya.
- API reliability.
- Documentation.
- Security.
- Transaction fees.
- Developer support.
- Scalability.
- Regulatory considerations.

**21.4 Payment Provider Integration**

The payment provider shall support the customer payment process defined in Chapter 12.

The general flow shall be:

Customer  
↓  
CarGo Kenya  
↓  
Payment Request  
↓  
Payment Provider  
↓  
Payment Processing  
↓  
Provider Confirmation  
↓  
CarGo Kenya Verification  
↓  
Payment Transaction Recorded  
↓  
Trip Wallet Updated  
↓  
Trip BOOKED

The payment provider shall not directly modify the trip status.

**21.5 Payment Provider Responsibilities**

The payment provider may be responsible for:

- Initiating payment requests.
- Processing customer payments.
- Providing transaction references.
- Returning payment status.
- Sending payment callbacks/webhooks.
- Providing transaction verification.
- Supporting refunds where available.

CarGo Kenya shall remain responsible for:

- Associating payment with the correct Trip.
- Validating the expected amount.
- Recording the transaction.
- Updating the Trip Wallet.
- Updating payment status.
- Moving the trip to BOOKED after successful verification.
- Creating audit records.
- Generating payment notifications.

**21.6 Payment Integration Layer**

The backend should use a dedicated payment-service layer rather than embedding payment-provider logic throughout the application.

Conceptually:

CarGo Application

↓

Payment Service

↓

Payment Provider Adapter

↓

External Payment Provider

This approach allows the application to replace the payment provider without rewriting the entire payment system.

For example:

PaymentService

↓

ProviderAdapter

↓

M-Pesa Provider

A future implementation could support another provider through another adapter.

**21.7 Payment Provider Abstraction**

The payment service should expose internal operations such as:

createPayment()

verifyPayment()

processCallback()

initiateRefund()

checkTransactionStatus()

The exact function names may change during implementation.

The important architectural principle is that the rest of the application should communicate with the internal payment service rather than directly communicating with the external provider.

**21.8 Payment Callback / Webhook Integration**

Where supported, the payment provider shall send transaction updates to a secure CarGo Kenya backend endpoint.

Conceptually:

Payment Provider

↓

Webhook

↓

CarGo Backend

↓

Validate Request

↓

Verify Transaction

↓

Update Payment

The webhook endpoint shall:

1.  Receive the provider notification.
2.  Validate the request.
3.  Identify the transaction.
4.  Verify the transaction where required.
5.  Confirm the amount.
6.  Confirm the relevant trip.
7.  Prevent duplicate processing.
8.  Update the payment record.
9.  Update the Trip Wallet.
10. Update the trip status where appropriate.
11. Trigger relevant notifications.
12. Record the event in the audit trail.

**21.9 Payment Integration Security**

Payment credentials shall never be stored directly in frontend code.

Sensitive values such as:

- API keys.
- Secret keys.
- Provider credentials.
- Webhook secrets.
- Access tokens.

shall be stored using secure server-side environment configuration or an appropriate secrets-management mechanism.

Example:

PAYMENT_PROVIDER_KEY

PAYMENT_PROVIDER_SECRET

PAYMENT_CALLBACK_SECRET

The exact environment variable names shall be determined during implementation.

**21.10 Payment Idempotency**

Payment requests and callbacks must support duplicate protection.

For example:

Payment Callback

↓

Transaction Reference

↓

Already Processed?

↙ ↘

YES NO

↓ ↓

Ignore Process

The same transaction must never cause:

- Duplicate customer payment records.
- Duplicate Trip Wallet credits.
- Duplicate bookings.
- Duplicate driver releases.

This requirement is consistent with the payment rules established in Chapter 12.

**21.11 Driver Withdrawal Integration**

The Driver Personal Wallet may require an external payment or withdrawal service to transfer available funds to the driver's approved withdrawal destination.

The flow shall be:

Driver Wallet

↓

Available Balance

↓

Withdrawal Request

↓

Backend Validation

↓

Withdrawal Provider

↓

Processing

↓

Confirmation

↓

Wallet Transaction Updated

The system shall never send pending trip earnings for withdrawal.

Only funds in the driver's **Available Balance** shall be eligible.

**21.12 Withdrawal Provider Responsibilities**

The external withdrawal provider may handle:

- Transfer initiation.
- Destination validation.
- Transaction processing.
- Transaction reference generation.
- Transfer status.
- Transfer failure reporting.

CarGo Kenya shall handle:

- Balance validation.
- Withdrawal authorization.
- Withdrawal record creation.
- Duplicate protection.
- Transaction status tracking.
- Wallet balance updates.
- Audit logging.

**21.13 Withdrawal Failure**

If the external withdrawal service fails:

Driver Requests Withdrawal

↓

Provider

↓

FAILED

↓

Withdrawal Record = FAILED

↓

Funds Remain Available

The system should not permanently remove the driver's funds merely because a withdrawal attempt failed.

**21.14 SMS Integration**

SMS may be used for important communication events.

The SMS service may be used for:

- Payment confirmation.
- Booking confirmation.
- Trip-start confirmation requests.
- Trip-active notification.
- Delivery confirmation.
- Cancellation.
- Dispute notifications.
- Refund notifications.
- Driver payment-release notifications.
- Security/account alerts.

In-app notifications shall remain the primary notification mechanism.

SMS shall serve as a supplementary communication channel.

**21.15 SMS Service Architecture**

The notification service should communicate with the SMS provider through an abstraction layer.

System Event

↓

Notification Service

↓

SMS Service

↓

SMS Provider

↓

Customer / Driver

The application should not place SMS-provider API calls directly inside every business module.

**21.16 SMS Delivery Status**

The system should record the status of SMS delivery where the provider supports delivery reporting.

Possible statuses include:

- PENDING.
- SENT.
- DELIVERED.
- FAILED.

A failed SMS should not normally change the underlying trip or payment status.

For example:

Payment = PAID

Trip = BOOKED

SMS = FAILED

The booking remains valid.

**21.17 SMS Retry**

Where appropriate, failed SMS messages may be retried.

However, the system should avoid uncontrolled repeated messages.

A notification may contain:

- Notification ID.
- Event ID.
- Attempt count.
- Last attempt.
- Failure reason.

The retry policy shall be finalized during implementation.

**21.18 Email Integration**

Email may be used for:

- Account notifications.
- Verification notifications.
- Payment receipts.
- Booking confirmations.
- Trip summaries.
- Refund notifications.
- Administrative communication.
- Driver earnings information.
- Security notifications.

Email shall not be considered the only channel for time-sensitive trip operations.

Important operational events should also be available through the application.

**21.19 Email Service Architecture**

The architecture should follow:

System Event

↓

Notification Service

↓

Email Service

↓

Email Provider

↓

Recipient

Email templates should be centrally managed to maintain consistent communication.

**21.20 Maps and GPS Integration**

The CarGo Kenya platform shall require mapping and location functionality to support transportation operations.

Mapping functionality may include:

- Pickup location.
- Destination.
- Driver location.
- Trip route.
- Distance estimation.
- Location display.
- Geolocation.
- Route progress.
- Destination arrival.
- Last-known driver location.

The exact mapping provider shall be selected during implementation.

**21.21 GPS Tracking Architecture**

GPS tracking shall operate primarily through the driver's mobile device.

Conceptually:

Driver Mobile Device

↓

GPS Coordinates

↓

CarGo Backend

↓

Trip Tracking Service

↓

Customer Dashboard

The backend should associate GPS information with the relevant active trip.

**21.22 GPS Activation**

GPS tracking should be associated with the transportation lifecycle.

The intended flow is:

PICKUP INSPECTION

↓

TRIP START PENDING

↓

Customer Confirms

↓

TRIP ACTIVE

↓

GPS Tracking Active

↓

IN TRANSIT

The system should not unnecessarily track a driver continuously when they are not operating an active transportation assignment.

**21.23 GPS Location Data**

A tracking record may contain:

| **Field** | **Description** |
| --- | --- |
| Tracking ID | Unique tracking record |
| Trip ID | Associated trip |
| Driver ID | Driver providing location |
| Latitude | GPS latitude |
| Longitude | GPS longitude |
| Accuracy | Location accuracy where available |
| Recorded At | Time location was recorded |
| Source | Device/GPS source |

The exact implementation may store tracking points differently for performance reasons.

**21.24 GPS Update Frequency**

The system should avoid sending GPS updates unnecessarily frequently because this can increase:

- Battery usage.
- Mobile data consumption.
- Server load.
- Database storage.
- Processing requirements.

The update interval should therefore be configurable.

For example, the implementation may initially use periodic location updates while the trip is active.

The exact interval shall be determined through testing.

**21.25 GPS Failure Handling**

Loss of GPS connectivity shall not automatically cancel or terminate a trip.

For example:

TRIP ACTIVE

↓

GPS Connection Lost

↓

Last Known Location Stored

↓

Tracking Temporarily Unavailable

↓

Attempt Reconnection

The system should retain the last known location where available.

An operational alert may be generated when tracking remains unavailable for a defined period.

**21.26 Geocoding Integration**

A geocoding service may be used to convert:

Address → Coordinates

and, where supported:

Coordinates → Address

This may assist with:

- Pickup location identification.
- Destination identification.
- Location display.
- Map markers.
- Route calculation.

The system should store the important location information associated with a trip rather than depending entirely on the external provider to reconstruct historical locations later.

**21.27 Location Snapshot**

When a trip is created, important location information should be preserved.

A location snapshot may contain:

- Original address.
- Latitude.
- Longitude.
- Location description.
- Location instructions.
- Timestamp where appropriate.

This is important because an external map service may later return different information for the same location.

The trip's historical location information should therefore remain part of CarGo Kenya's own records.

**21.28 Route and Distance Services**

Where route calculation is required, the system may use an external routing service to calculate:

- Estimated distance.
- Estimated travel time.
- Route geometry.
- Suggested route.

The external routing service shall be treated as a supporting service.

The backend should store important results used in financial or operational decisions.

For example, if distance affects a quotation, the calculated distance used for that quotation should be preserved.

**21.29 File and Image Storage Integration**

The Vehicle Inspection Module requires storage for:

- Pickup photographs.
- Delivery photographs.
- Vehicle condition photographs.
- Supporting documents.
- Inspection evidence.

These files may be stored using a secure object-storage service.

Conceptually:

Driver Device

↓

Upload

↓

CarGo Backend

↓

File Storage Service

↓

Secure File Reference

↓

Inspection Record

The database should preferably store file metadata and references rather than storing large image files directly inside ordinary relational database records.

**21.30 Inspection Evidence Storage**

Inspection photographs must remain associated with the correct inspection record.

For example:

Trip

↓

Pickup Inspection

↓

Inspection Evidence

├── Front

├── Rear

├── Left Side

├── Right Side

├── Odometer

├── Fuel

└── Damage Evidence

The communication module should not become the primary storage location for official inspection evidence.

**21.31 File Security**

Inspection files may contain sensitive operational evidence.

The storage architecture should therefore provide:

- Access control.
- Authenticated retrieval.
- Secure upload.
- File-type validation.
- File-size restrictions.
- Safe file naming.
- Protection against unauthorized access.
- Appropriate retention controls.

A user should not be able to access another trip's inspection photograph simply by changing an ID in a URL.

**21.32 Document Storage**

Where required, the platform may store documents associated with:

- Driver verification.
- Vehicle verification.
- Insurance.
- Inspection.
- Trip documentation.
- Administrative decisions.

Documents should be associated with the appropriate entity and access permissions.

For example:

Driver

└── Verification Documents

Vehicle

└── Vehicle Documents

Trip

└── Trip Documents

**21.33 Hosting and Infrastructure Integration**

The CarGo Kenya application shall operate on hosting/infrastructure services capable of supporting:

- Frontend application.
- Backend API.
- Database.
- File storage.
- Background jobs.
- Notification processing.
- Secure networking.
- Monitoring.

The exact hosting architecture may evolve as the system grows.

The MVP should prioritize:

- Reliability.
- Reasonable cost.
- Security.
- Simplicity.
- Easy deployment.
- Developer maintainability.

**21.34 Database Infrastructure**

The primary application database shall remain controlled by CarGo Kenya's backend architecture.

External services should not receive unrestricted direct database access.

The preferred architecture is:

External Service

↓

CarGo Backend API

↓

Application Services

↓

Database

The external service should never be granted unnecessary database credentials.

**21.35 Redis / Caching Integration**

If Redis is used within the CarGo Kenya architecture, it may support:

- Session-related temporary data where appropriate.
- Rate limiting.
- Caching.
- Temporary OTP information.
- Background job queues.
- Notification queues.
- Short-lived tracking information.

Redis should not become the authoritative permanent financial database.

Important financial records shall remain in the primary database.

**21.36 Background Job Integration**

Some external-service operations should be processed asynchronously.

Examples include:

- SMS sending.
- Email sending.
- Notification retries.
- Image processing.
- Non-critical background tasks.
- GPS processing where appropriate.

Conceptually:

Business Event

↓

Create Job

↓

Queue

↓

Worker

↓

External Service

↓

Result

↓

Update Record

This prevents slow external services from unnecessarily blocking important user requests.

**21.37 External Service Failure Principle**

An external service failure should not automatically corrupt the CarGo Kenya system state.

For example:

Trip = BOOKED

SMS = FAILED

The trip remains BOOKED.

Similarly:

Trip = TRIP ACTIVE

GPS = TEMPORARILY UNAVAILABLE

The trip does not automatically become CANCELLED.

The backend must distinguish between:

**Business transaction failure**

and

**Communication/service failure.**

**21.38 External Service Timeout**

Every external API request should have an appropriate timeout.

The application should not wait indefinitely for an external service.

For example:

CarGo Backend

↓

External API

↓

Timeout

↓

Record Failure

↓

Retry / Manual Review

The timeout values shall be determined during implementation and testing.

**21.39 Retry Strategy**

External operations that fail temporarily may be retried.

Examples:

- SMS.
- Email.
- Payment-status checks.
- Withdrawal-status checks.
- Temporary storage operations.

However, retries must be designed carefully to avoid duplicate financial transactions.

Financial operations shall use idempotency controls before retries are permitted.

**21.40 External API Rate Limits**

The system shall account for external provider rate limits.

For example, mapping or SMS providers may restrict the number of requests that can be made within a given period.

The backend should therefore implement appropriate:

- Caching.
- Request throttling.
- Queueing.
- Retry delays.
- Rate-limit handling.

**21.41 API Credential Management**

External credentials shall be managed securely.

Credentials shall:

- Never be committed to source control.
- Never be exposed to frontend users.
- Never be included in client-side JavaScript.
- Be stored through environment variables or secrets management.
- Be rotated where appropriate.
- Be restricted according to the principle of least privilege.

Example configuration:

PAYMENT_API_KEY

PAYMENT_API_SECRET

SMS_API_KEY

SMS_API_SECRET

EMAIL_API_KEY

MAPS_API_KEY

STORAGE_ACCESS_KEY

STORAGE_SECRET_KEY

These are conceptual examples only.

**21.42 Environment Separation**

External integrations should support separate configurations for:

- Development.
- Testing.
- Staging.
- Production.

For example:

Development

↓

Sandbox/Test Provider

Staging

↓

Sandbox/Test Provider

Production

↓

Live Provider

Developers should not accidentally process real customer payments while testing.

**21.43 Sandbox and Test Environments**

Where external providers offer sandbox environments, CarGo Kenya should use them during development and testing.

The development environment should allow testing of:

- Successful payments.
- Failed payments.
- Duplicate callbacks.
- Refunds.
- SMS failures.
- Email failures.
- GPS failures.
- Withdrawal failures.

This is particularly important for the Payment and Wallet Module.

**21.44 Integration Logging**

External service interactions should be logged sufficiently for troubleshooting.

The system may record:

- Service name.
- Request type.
- Internal reference.
- External reference.
- Timestamp.
- Response status.
- Processing result.
- Error code.
- Failure reason.

Sensitive credentials and confidential payment information must not be written into ordinary logs.

**21.45 External Reference Mapping**

Every important external transaction should be associated with both:

**CarGo Internal Reference**

and

**External Provider Reference**

Example:

CarGo Transaction:

CGK-PAY-000125

Provider Reference:

EXT-92837465

This allows administrators and developers to reconcile CarGo records with provider records.

**21.46 Integration Audit Trail**

Important external interactions should be included in the audit trail.

Examples include:

- Payment confirmation.
- Refund request.
- Refund confirmation.
- Withdrawal request.
- Withdrawal completion.
- SMS failure.
- External verification.
- GPS tracking events where required.

The audit trail should identify:

- Actor/system.
- Service.
- Action.
- Internal reference.
- External reference.
- Timestamp.
- Result.

**21.47 Data Ownership**

CarGo Kenya shall remain the owner of its core operational data.

External providers may process information required to provide their service, but the application should not depend on an external provider as the sole source of important historical business information.

For example, CarGo Kenya should retain:

- Trip information.
- Payment records.
- Wallet transactions.
- Inspection records.
- GPS history required by policy.
- Notification records.
- Audit records.

**21.48 Data Synchronization**

Where information exists both internally and externally, the system should define which system is authoritative.

Example:

**Payment**

External Provider:  
Payment processing result.

CarGo Kenya:  
Final business interpretation and internal transaction record.

**GPS**

Driver Device:  
Location source.

CarGo Kenya:  
Trip tracking record.

**SMS**

SMS Provider:  
Delivery result.

CarGo Kenya:  
Notification record and communication history.

This prevents ambiguity about which system controls the final state.

**21.49 Integration With Trip Lifecycle**

External services shall operate according to the CarGo Kenya trip lifecycle.

REQUESTED

↓

QUOTING

↓

DRIVER SELECTED

↓

PAYMENT PENDING

↓

Payment Provider

↓

BOOKED

↓

PICKUP PENDING

↓

PICKUP INSPECTION

↓

TRIP START PENDING

↓

TRIP ACTIVE

↓

GPS / Tracking

↓

IN TRANSIT

↓

DELIVERY PENDING

↓

DELIVERED

↓

COMPLETED

External services support these stages but do not redefine them.

**21.50 Integration With Payment and Wallet Module**

The integration relationship shall be:

Customer

↓

Payment Provider

↓

Payment Service

↓

Payment Verification

↓

Trip Wallet

↓

Trip BOOKED

Later:

TRIP ACTIVE

↓

Payment Release Service

↓

Driver Wallet

and:

COMPLETED

↓

Payment Release Service

↓

Driver Wallet

The Payment and Wallet Module remains the authority for financial state.

**21.51 Integration With Notification Module**

The relationship shall be:

System Event

↓

Notification Service

↓

┌────────┬────────┬────────┐

↓ ↓ ↓

In-App SMS Email

For example:

Payment Verified

↓

Notification Service

↓

Customer

↓

In-App + SMS

The notification service should handle delivery rather than the payment module directly sending SMS.

**21.52 Integration With Vehicle Inspection Module**

The Vehicle Inspection Module may use external file storage for inspection photographs.

Inspection

↓

Capture Evidence

↓

Upload

↓

Storage Service

↓

File Reference

↓

Inspection Record

The inspection record remains in the CarGo database.

**21.53 Integration With GPS and Tracking Module**

The tracking architecture shall connect:

Driver Device

↓

Location Data

↓

CarGo Tracking API

↓

Trip Tracking Record

↓

Customer Dashboard

The system should ensure that only the authorized driver associated with an active trip can submit tracking information for that trip.

**21.54 Integration With Reporting and Analytics**

Reporting should primarily use CarGo Kenya's internal records rather than directly querying external providers every time a dashboard is displayed.

For example:

Payment Provider

↓

Payment Records

↓

CarGo Database

↓

Reporting Module

This improves performance and ensures reports are based on the platform's own transaction history.

**21.55 Integration With Database Module**

External service identifiers should be stored in appropriate database records.

For example:

payment_transactions

├── internal_transaction_id

├── trip_id

├── provider

└── provider_reference

Similarly:

notification_deliveries

├── notification_id

├── channel

├── provider

└── provider_reference

The exact database schema shall follow Chapter 18.

**21.56 Integration With API and Backend Architecture**

External integrations shall be exposed internally through backend services.

A conceptual architecture is:

Frontend

↓

CarGo API

↓

Business Services

↓

Integration Services

↓

External Providers

Example:

POST /payments

↓

Payment Controller

↓

Payment Service

↓

Payment Provider Adapter

↓

External Provider

The frontend should never communicate directly with sensitive external services where doing so would bypass CarGo business rules.

**21.57 Integration Authorization**

External services must not be granted more access than necessary.

For example:

- SMS provider does not need database access.
- Mapping provider does not need wallet access.
- Storage provider does not need customer payment credentials.
- Payment provider does not need unrestricted trip access.

Each integration should receive only the permissions necessary for its function.

**21.58 Personal Data Protection**

External services may receive personal information such as:

- Customer name.
- Phone number.
- Email address.
- Driver name.
- Location information.
- Payment-related information.

The system should therefore minimize the information sent to external services.

For example, an SMS provider only needs information required to deliver the SMS.

The application should not send unnecessary internal records.

**21.59 Sensitive Payment Information**

CarGo Kenya should avoid storing unnecessary sensitive payment credentials.

Where possible, the system should rely on the payment provider's secure payment mechanisms.

The backend should store references and transaction information required for reconciliation rather than unnecessary payment secrets.

**21.60 External Service Availability**

The MVP should identify which integrations are:

**Critical**

Failure can affect the ability to complete an important business transaction.

Examples:

- Payment processing.
- Driver withdrawal processing.

**Important**

Failure affects user communication or operations but does not necessarily invalidate the trip.

Examples:

- SMS.
- Email.
- GPS.

**Supporting**

Failure affects convenience but can potentially be handled through fallback mechanisms.

Examples:

- Some mapping functions.
- Non-critical analytics services.

**21.61 Integration Fallbacks**

Where practical, the system should have fallback behavior.

For example:

**SMS Failure**

SMS Failed

↓

In-App Notification Remains Available

**GPS Failure**

GPS Unavailable

↓

Last Known Location

↓

Tracking Recovery

**Email Failure**

Email Failed

↓

In-App Notification

Not every integration requires a replacement provider.

The fallback strategy shall depend on the importance of the service.

**21.62 Integration Monitoring**

The system should monitor important external integrations.

The monitoring system should help identify:

- Payment failures.
- Increased API latency.
- SMS failures.
- Email failures.
- GPS interruptions.
- Storage errors.
- Provider authentication failures.
- Excessive retries.
- Provider outages.

This information may be visible to administrators or developers depending on the issue.

**21.63 Integration Health Status**

Where practical, the administrator or system-monitoring environment may display:

Payment Provider OPERATIONAL

SMS Provider OPERATIONAL

Email Provider OPERATIONAL

Maps Provider OPERATIONAL

Storage Provider OPERATIONAL

If a service is unavailable:

SMS Provider DEGRADED

This allows operational issues to be identified before they become widespread.

**21.64 External Service Error Handling**

Errors returned by external providers should be translated into controlled internal errors.

The application should avoid exposing raw provider errors directly to users.

Instead of:

Provider Error 40098273

the customer may receive:

We were unable to confirm your payment at this time. Please try again or contact support.

The detailed provider error should remain available to authorized administrators/developers through logs.

**21.65 External Service Versioning**

Where an external provider uses versioned APIs, the integration should explicitly identify the API version being used.

The system should avoid depending on undocumented provider behavior.

Provider upgrades should be tested before being introduced into production.

**21.66 Integration Testing**

Every external integration shall be tested independently and as part of the complete workflow.

**Payment Testing**

Test:

- Successful payment.
- Failed payment.
- Delayed payment.
- Duplicate callback.
- Incorrect amount.
- Invalid reference.
- Refund.
- Partial refund.

**SMS Testing**

Test:

- Successful delivery.
- Failed delivery.
- Retry.
- Invalid number.

**GPS Testing**

Test:

- Normal tracking.
- Poor connectivity.
- GPS unavailable.
- App restart.
- Tracking recovery.

**Storage Testing**

Test:

- Valid upload.
- Invalid file.
- Large file.
- Failed upload.
- Unauthorized retrieval.

**21.67 Integration Testing Environment**

External integrations should be tested using:

- Sandbox providers.
- Mock services.
- Test credentials.
- Test payment references.
- Controlled test accounts.

Production credentials must not be used for ordinary development testing.

**21.68 Integration Transaction Traceability**

A developer should be able to trace an external transaction from beginning to end.

For example:

Trip

CGK-2026-000125

↓

Payment

CGK-PAY-000125

↓

Provider Reference

EXT-92837465

↓

Webhook

↓

Payment Verification

↓

Trip Wallet

↓

BOOKED

↓

Notification

This traceability is essential for debugging financial and operational problems.

**21.69 Integration Data Consistency**

External integrations shall not silently overwrite authoritative internal records.

For example, if an external payment provider reports:

PAID

the backend must still verify that:

- The transaction exists.
- The transaction belongs to the correct trip.
- The amount is correct.
- The transaction has not already been processed.

Only then should the internal payment state be updated.

**21.70 Integration Business Rules**

The following rules shall be treated as core MVP requirements.

**Rule 1**

External services shall support CarGo Kenya functionality but shall not replace the CarGo Kenya backend as the business authority.

**Rule 2**

Payment-provider confirmations must be verified before changing payment or trip status.

**Rule 3**

Payment transactions must have duplicate-processing protection.

**Rule 4**

External provider credentials must remain server-side and secure.

**Rule 5**

The frontend shall not directly control sensitive external financial operations.

**Rule 6**

External service failures shall be handled without unnecessarily corrupting trip state.

**Rule 7**

Important external transactions must have both internal and external references where applicable.

**Rule 8**

External service interactions shall be logged sufficiently for troubleshooting and reconciliation.

**Rule 9**

External services shall receive only the information required for their function.

**Rule 10**

Production and development integrations shall be separated.

**Rule 11**

External service retries must not create duplicate financial transactions.

**Rule 12**

Important operational data must remain available within CarGo Kenya's own records.

**Rule 13**

Inspection evidence shall remain associated with the appropriate inspection records.

**Rule 14**

GPS failure shall not automatically terminate an active trip.

**Rule 15**

Notification failure shall not automatically invalidate a successful business transaction.

**Rule 16**

External integrations shall use appropriate authentication and authorization.

**Rule 17**

The system should use service abstractions or adapters where practical to reduce dependency on a single provider.

**21.71 MVP Integration Scope**

**Included in MVP**

The System Integrations and External Services Module shall include:

- Customer payment-provider integration.
- Payment callback/webhook handling.
- Payment verification.
- Payment duplicate protection.
- Driver withdrawal integration where applicable.
- SMS integration for critical notifications where practical.
- Email integration where applicable.
- Mapping functionality.
- GPS/location support.
- Geocoding/location services where required.
- Secure image/file storage.
- External-service credentials management.
- Sandbox/test integrations.
- Integration error handling.
- Integration logging.
- External transaction references.
- Retry handling where appropriate.
- Integration security.
- Basic service monitoring.
- Integration audit records.

**Not Required for MVP**

The following should remain future features:

- Multiple simultaneous payment providers.
- International payment providers.
- Advanced payment routing.
- Cryptocurrency integration.
- AI communication providers.
- Advanced telematics systems.
- Dedicated vehicle IoT trackers.
- Automated fuel-station APIs.
- Advanced third-party accounting integrations.
- Advanced business intelligence platforms.
- Automated provider switching.
- Complex multi-cloud architecture.
- Voice communication APIs.
- Video communication services.
- Advanced external identity-verification providers unless required by the final verification process.

**21.72 Recommended Integration Architecture**

The overall integration architecture can therefore be represented as:

CARGO KENYA PLATFORM

│

┌──────┴──────┐

│ BACKEND │

│ API │

└──────┬──────┘

│

┌──────────────┼──────────────┐

│ │ │

↓ ↓ ↓

Payment Service Notification Tracking Service

│ │ │

↓ ┌────┼────┐ ↓

Payment Provider │ │ │ Maps / GPS

↓ ↓ ↓

SMS Email

│

↓

Storage Service

│

↓

Inspection Evidence

The application database remains the central source of CarGo Kenya's internal operational records.

**21.73 Complete External Integration Lifecycle**

The overall integration lifecycle shall operate as follows:

CUSTOMER REQUEST

↓

CarGo Backend

↓

Maps / Location Services

↓

QUOTING

↓

DRIVER SELECTED

↓

PAYMENT PENDING

↓

Payment Provider

↓

Payment Verification

↓

BOOKED

↓

Notification Service

↓

PICKUP

↓

Inspection

↓

File Storage

↓

TRIP START

↓

GPS / Tracking

↓

TRIP ACTIVE

↓

50% Driver Release

↓

Driver Wallet

↓

IN TRANSIT

↓

GPS / Maps

↓

DELIVERY

↓

Inspection Evidence

↓

COMPLETED

↓

Final 50% Release

↓

Driver Wallet

↓

Withdrawal Provider

↓

Driver

**21.74 Final Integration Principle**

The CarGo Kenya MVP shall be designed so that external services strengthen the platform without becoming the platform itself.

The core architecture remains:

CARGO KENYA BACKEND

│

┌───────────────┼────────────────┐

↓ ↓ ↓

Payments Notifications Tracking

│ │ │

↓ ↓ ↓

External SMS / Email Maps / GPS

Provider Provider Provider

│

↓

Wallets

│

↓

Driver Earnings

│

↓

Withdrawal

The most important architectural rule is:

**CarGo Kenya owns the business logic, while external providers supply specialized services.**

Therefore, the system must always be able to determine internally:

- What the trip status is.
- Whether payment is confirmed.
- Whether a Trip Wallet exists.
- Whether the driver is eligible for a payment release.
- How much the driver has earned.
- Whether a driver withdrawal is permitted.
- Whether an inspection has been completed.
- Whether a trip has officially started.
- Whether delivery has been confirmed.
- Whether a dispute exists.
- What notifications have been generated.
- What external transaction corresponds to each internal transaction.

This ensures that the CarGo Kenya MVP remains maintainable, auditable, secure, and capable of replacing or adding external service providers without redesigning the entire system.

**22.0 ERROR HANDLING, LOGGING & AUDIT**

**22.1 Purpose**

The Error Handling, Logging and Audit Module shall provide CarGo Kenya with a consistent mechanism for detecting, handling, recording, monitoring, and investigating system errors and important operational activities.

The module shall ensure that:

- System errors are handled consistently.
- Users receive understandable error messages.
- Developers receive sufficient technical information for troubleshooting.
- Sensitive technical information is not exposed to users.
- Important system activities are recorded.
- Security-sensitive and business-critical actions are auditable.
- Administrators can investigate operational incidents.
- Financial, trip, inspection, verification, and account-related events remain traceable.
- Errors do not unnecessarily corrupt or partially modify system data.
- Duplicate operations are controlled where necessary.
- System failures can be diagnosed using logs and audit records.

The purpose of this module is therefore to provide the **observability and accountability layer** of the CarGo Kenya MVP.

**22.2 Error Handling Philosophy**

CarGo Kenya shall follow the principle:

**An error should be handled safely, communicated clearly, and recorded sufficiently for investigation.**

The system should avoid situations where an error:

- Causes the application to crash unnecessarily.
- Displays technical database information to users.
- Leaves a trip in an invalid state.
- Creates duplicate financial transactions.
- Performs only half of a critical operation.
- Removes important records.
- Makes an administrator unable to determine what happened.
- Allows a user to retry a failed operation in a way that creates duplicate data.

The system should therefore separate:

**User-facing error handling**

from:

**Developer/system error logging**

and:

**Business audit records.**

**22.3 Types of Errors**

The MVP should recognize several major categories of errors.

**22.3.1 Validation Errors**

These occur when submitted information does not satisfy system requirements.

Examples:

- Missing pickup location.
- Invalid phone number.
- Invalid email address.
- Missing vehicle registration number.
- Invalid quotation amount.
- Missing required inspection photograph.
- Invalid payment amount.

Example:

ERROR

Pickup location is required.

Validation errors should normally be returned to the user without being treated as system failures.

**22.3.2 Authentication Errors**

These occur when a user cannot be authenticated.

Examples:

- Invalid login credentials.
- Expired authentication token.
- Invalid authentication token.
- Missing authentication token.

Example:

Authentication required.

Please log in and try again.

The system should not reveal whether a particular account exists where doing so could create a security risk.

**22.3.3 Authorization Errors**

These occur when an authenticated user attempts to perform an action they are not permitted to perform.

Examples:

- Customer attempts to access another customer's trip.
- Driver attempts to modify an unrelated trip.
- Driver attempts to release their own payment manually.
- Customer attempts to access administrative functions.
- Administrator without appropriate permission attempts a restricted action.

Example:

You do not have permission to perform this action.

The system should not expose internal authorization rules unnecessarily.

**22.4 Business Rule Errors**

A business-rule error occurs when an operation violates the defined CarGo Kenya workflow.

Examples:

- Customer attempts to select a driver after the quotation period has closed.
- Driver attempts to start a trip before pickup inspection is completed.
- Customer attempts to confirm delivery before the vehicle reaches the destination.
- Driver attempts to release payment before TRIP ACTIVE.
- Final payment release is attempted before COMPLETED.
- A cancelled trip is being modified as though it were active.

Example:

Action unavailable.

The trip must complete pickup inspection before it can be started.

Business-rule errors should be clearly communicated without exposing unnecessary backend details.

**22.5 Payment and Financial Errors**

Financial operations require particularly careful error handling.

Examples include:

- Payment provider timeout.
- Payment failure.
- Payment verification failure.
- Duplicate payment callback.
- Refund failure.
- Wallet transaction failure.
- Withdrawal failure.
- Invalid release request.
- Financial reconciliation mismatch.

The system shall never assume that a financial operation succeeded merely because a request was submitted.

For example:

Customer Initiates Payment

↓

Payment Provider

↓

Verification

↓

SUCCESS / FAILED / UNKNOWN

Where the result is uncertain, the system should avoid creating duplicate financial transactions.

**22.6 Trip State Errors**

The system shall prevent invalid transitions between trip statuses.

For example:

REQUESTED

↓

QUOTING

↓

DRIVER SELECTED

↓

PAYMENT PENDING

↓

BOOKED

↓

PICKUP PENDING

↓

PICKUP INSPECTION

↓

TRIP START PENDING

↓

TRIP ACTIVE

↓

IN TRANSIT

↓

DELIVERY PENDING

↓

DELIVERED

↓

COMPLETED

A request attempting to move a trip from:

PAYMENT PENDING

directly to:

TRIP ACTIVE

must be rejected.

The system should record the attempted invalid operation where appropriate.

**22.7 System Errors**

System errors are unexpected technical failures.

Examples:

- Database unavailable.
- Database connection timeout.
- Internal server exception.
- External service unavailable.
- Storage failure.
- Unexpected application exception.
- Background-job failure.
- Configuration error.

The user should receive a generic message such as:

Something went wrong.

Please try again later.

The technical details should instead be recorded in the system logs.

**22.8 External Service Errors**

CarGo Kenya depends on external services such as:

- Payment provider.
- SMS provider.
- Email provider.
- GPS/location services where applicable.
- File/object storage.
- Other approved integrations.

If an external service fails, the system should distinguish between:

**CarGo operation failed**

and:

**External service communication failed.**

For example:

Payment Request

↓

Payment Provider

↓

Timeout

↓

Payment Status = PROCESSING / UNKNOWN

↓

Verification / Retry

The system should not automatically mark a payment as failed simply because the provider did not respond immediately.

**22.9 User-Facing Error Messages**

Error messages displayed to customers, drivers, or administrators should be:

- Clear.
- Short.
- Understandable.
- Action-oriented where possible.
- Free from unnecessary technical terminology.

Bad:

PostgreSQL error: foreign key constraint violation.

Better:

We could not complete this action because the trip information is no longer valid.

Please refresh the page and try again.

The technical error should remain in the developer/system log.

**22.10 Error Response Structure**

The backend should use a consistent error-response structure.

A conceptual response may contain:

{

"success": false,

"error": {

"code": "TRIP_INVALID_STATE",

"message": "This action cannot be performed at the current trip stage.",

"requestId": "REQ-..."

}

}

The exact API structure will be finalized during implementation.

The important requirement is consistency.

**22.11 Error Codes**

Important application errors should have identifiable error codes.

Examples:

AUTH_REQUIRED

AUTH_INVALID

ACCESS_DENIED

VALIDATION_ERROR

INVALID_TRIP

TRIP_INVALID_STATE

PAYMENT_FAILED

PAYMENT_PENDING

PAYMENT_VERIFICATION_FAILED

WALLET_RELEASE_DENIED

DUPLICATE_TRANSACTION

INSPECTION_INCOMPLETE

DELIVERY_CONFIRMATION_REQUIRED

RESOURCE_NOT_FOUND

EXTERNAL_SERVICE_ERROR

INTERNAL_SERVER_ERROR

Error codes allow developers to identify the type of failure without relying entirely on message text.

**22.12 Request ID / Correlation ID**

Each important backend request should have a unique request identifier.

Example:

Request ID:

REQ-2026-08-0001827

If an error occurs, the user-facing message may provide the reference:

We could not complete your request.

Reference:

REQ-2026-08-0001827

The developer or administrator can then use the reference to locate the relevant log.

This is particularly useful when a customer reports:

"My payment failed."

The support team can search the request ID and determine what happened.

**22.13 Error Logging**

The system shall maintain technical logs for important application events and failures.

A log entry may contain:

| **Field** | **Description** |
| --- | --- |
| Log ID | Unique log record |
| Timestamp | When event occurred |
| Severity | DEBUG/INFO/WARN/ERROR |
| Service | Application service |
| Request ID | Correlation identifier |
| User ID | User involved where applicable |
| Trip ID | Related trip where applicable |
| Error Code | Application error code |
| Message | Technical description |
| Stack Trace | Technical failure information where applicable |
| IP/Request Metadata | Relevant request information |
| Environment | Development/staging/production |

The exact fields may be adjusted during implementation.

**22.14 Log Severity Levels**

The MVP should support basic severity levels.

**DEBUG**

Detailed information mainly useful during development.

Example:

Trip validation started.

**INFO**

Normal important application events.

Example:

Trip CGK-2026-000125 changed to BOOKED.

**WARN**

An unusual situation that did not necessarily cause failure.

Example:

Payment provider response delayed.

**ERROR**

A failure that prevented an operation from completing normally.

Example:

Refund request failed.

**CRITICAL**

A severe failure requiring immediate attention.

Example:

Database unavailable for production application.

The exact logging framework may be selected during implementation.

**22.15 What Should Be Logged**

The system should log events that help developers understand system behavior.

Examples include:

- Authentication failures.
- Authorization failures.
- Important trip-status changes.
- Payment-provider errors.
- Payment verification failures.
- Wallet transaction failures.
- Notification delivery failures.
- File upload failures.
- GPS/tracking service failures.
- Database errors.
- External API failures.
- Unexpected application exceptions.
- Background-job failures.

Not every normal frontend interaction needs to generate a technical log.

**22.16 What Should Not Be Logged**

The system shall avoid logging sensitive information unnecessarily.

Developers should not log:

- Passwords.
- Password hashes unnecessarily.
- Authentication secrets.
- Payment-provider secret keys.
- JWT secrets.
- Full payment credentials.
- Sensitive personal information without a legitimate purpose.
- Complete private message content unnecessarily.
- Security tokens.

For example, the system should never produce:

User password = \*\*\*\*\*\*\*\*

in application logs.

**22.17 Audit Trail**

Logging and auditing shall remain separate concepts.

**Logs** primarily help developers understand technical system behavior.

**Audit records** provide an accountable record of important business and security actions.

For example:

LOG

Payment API request failed because provider timed out.

AUDIT

Payment transaction CGK-PAY-00123 changed to PROCESSING.

Both may be important, but they serve different purposes.

**22.18 Auditable Actions**

The following important activities should generate audit records where applicable:

**Account**

- Account creation.
- Account suspension.
- Account activation.
- Important security changes.

**Driver Verification**

- Verification submission.
- Verification approval.
- Verification rejection.
- Verification correction request.

**Trips**

- Trip creation.
- Driver quotation.
- Driver selection.
- Booking.
- Cancellation.
- Important status transitions.
- Dispute creation.
- Dispute resolution.

**Inspection**

- Pickup inspection completion.
- Delivery inspection completion.
- Damage recording.
- Important inspection modifications.

**Payments**

- Payment confirmation.
- Refund.
- Partial refund.
- Financial adjustment.
- First driver release.
- Final driver release.
- Withdrawal.

**Administration**

- Administrative intervention.
- Manual status change.
- Manual financial adjustment.
- User suspension.
- Dispute decision.

**22.19 Audit Record Structure**

An audit record should contain information such as:

| **Field** | **Description** |
| --- | --- |
| Audit ID | Unique audit record |
| Actor ID | User/system performing action |
| Actor Role | Customer/Driver/Admin/System |
| Action | Action performed |
| Entity Type | Trip/Payment/User/etc. |
| Entity ID | Related record |
| Previous State | State before action where applicable |
| New State | State after action where applicable |
| Reason | Reason where required |
| Timestamp | Date/time |
| Request ID | Related request |
| Metadata | Additional structured information |

Example:

Audit ID:

AUD-000182

Actor:

Admin 104

Action:

TRIP_STATUS_CHANGED

Trip:

CGK-2026-000125

Previous:

DISPUTED

New:

COMPLETED

Reason:

Delivery evidence verified.

Timestamp:

2026-08-10 14:32

**22.20 System Actor vs Human Actor**

The audit system shall distinguish between actions performed by:

**Human users**

and:

**System processes.**

For example:

Actor:

SYSTEM

may be used when a background process automatically performs an operation.

Example:

SYSTEM

↓

Payment verification completed

↓

Trip updated

Where an administrator manually changes a trip:

Actor:

ADMIN-104

This distinction is important for accountability.

**22.21 Audit Immutability**

Important audit records should not be casually edited or deleted.

Once an important audit event has been recorded:

Audit Record Created

↓

Historical Record

The system should preferably preserve the original event.

If an incorrect administrative action needs correction, the system should record a **new corrective action** rather than silently rewriting history.

Example:

Admin changed status:

BOOKED → CANCELLED

Later correction:

Admin changed status:

CANCELLED → BOOKED

Both events remain visible in the audit history.

**22.22 Trip Audit Timeline**

The system should be capable of reconstructing the important history of a trip.

For example:

09:02

Trip Created

09:14

Driver Quotation Submitted

09:20

Driver Selected

09:27

Payment Confirmed

09:27

Trip Booked

10:45

Pickup Inspection Started

11:05

Pickup Inspection Completed

11:08

Driver Selected START TRIP

11:10

Customer Confirmed Trip Start

11:10

Trip Became TRIP ACTIVE

11:10

First 50% Released

16:20

Delivery Completed

16:30

Trip Became COMPLETED

16:30

Final 50% Released

This timeline will be extremely useful when investigating disputes.

**22.23 Error and Transaction Relationship**

For important operations, the system should be able to associate technical errors with the relevant business transaction.

For example:

Payment Request

↓

Request ID

↓

Payment Transaction

↓

Provider Request

↓

Provider Timeout

↓

ERROR LOG

This allows developers to trace the entire operation.

**22.24 Failed Payment Handling**

If a payment fails:

Payment Initiated

↓

Provider

↓

FAILED

↓

Payment Record Updated

↓

Customer Notified

The trip should remain:

PAYMENT PENDING

unless the applicable business rules require another state.

The system must not mark the trip as BOOKED simply because a payment attempt was made.

**22.25 Unknown Payment Result**

A particularly important case occurs when the payment provider does not return a definite result.

Example:

Customer Pays

↓

Provider

↓

Timeout

The system should not immediately assume:

FAILED

because the payment may actually have succeeded.

Instead, the transaction may temporarily remain:

PROCESSING

or another appropriate intermediate state.

The system can then perform verification.

This prevents customers from being charged while CarGo incorrectly records the payment as failed.

**22.26 Duplicate Operation Protection**

Important operations should be protected against accidental repetition.

Examples:

- Duplicate payment callback.
- Duplicate wallet release.
- Duplicate refund.
- Duplicate withdrawal.
- Duplicate trip confirmation.
- Duplicate inspection submission.

Example:

First Release Request

↓

KSh 9,000 Released

Second Identical Request

↓

Already Processed

↓

No Additional Release

The operation should be idempotent where appropriate.

**22.27 Database Transaction Safety**

Critical multi-step operations should use appropriate database transaction mechanisms.

For example, releasing the first 50% should conceptually involve:

BEGIN TRANSACTION

Validate Trip

↓

Validate TRIP ACTIVE

↓

Check First Release Not Already Processed

↓

Calculate Allowed Amount

↓

Create Wallet Transaction

↓

Update Driver Available Balance

↓

Record Release

↓

Commit

If a critical step fails:

ROLLBACK

where technically appropriate.

The system should avoid situations such as:

Wallet transaction created

BUT

Driver balance not updated

without the discrepancy being detected and handled.

**22.28 Error Handling During Payment Release**

For example:

TRIP ACTIVE

↓

Release 50%

↓

Database Failure

The system must not report:

Payment Released Successfully

unless the financial transaction has actually been recorded successfully.

The operation should either:

- Complete safely; or
- Fail safely and be retried/reconciled.

**22.29 Error Handling During Trip Status Changes**

Trip status transitions should be validated before being committed.

Example:

Driver selects START TRIP

↓

Backend validates:

Inspection?

Handover?

Customer confirmation?

Required conditions?

↓

YES

↓

TRIP ACTIVE

If validation fails:

TRIP START REJECTED

The trip should remain at the correct previous status.

**22.30 Error Handling During Inspection**

If a required inspection operation fails:

Example:

Pickup Inspection

↓

Photo Upload

↓

Upload Failed

The system should not falsely mark the inspection as completed.

Instead:

Inspection

Status = INCOMPLETE

and the user should receive an understandable message.

The technical upload failure should be logged.

**22.31 Error Handling During Delivery**

If delivery confirmation cannot be completed:

Delivery Procedure

↓

Customer Confirmation

↓

Confirmation Failed

The system should not automatically mark the trip as COMPLETED unless the required business conditions have been satisfied.

The issue should remain visible to the appropriate user or administrator.

**22.32 Notification Failure and Business State**

A notification failure must not normally reverse a successfully completed business transaction.

Example:

Customer Confirms Trip Start

↓

Backend Validation

↓

TRIP ACTIVE

↓

50% Released

↓

Notification Attempt

↓

SMS FAILED

The final state remains:

TRIP ACTIVE

50% RELEASED

The failed notification is separately recorded.

This preserves the distinction between:

**Business transaction**

and:

**Communication delivery.**

**22.33 External Service Retry**

Where an external service supports safe retries, the system may retry failed operations.

Examples:

- SMS delivery.
- Email delivery.
- Payment-status verification.
- Temporary GPS-service failure.

Retries should be controlled.

The system should avoid unlimited retry loops.

A conceptual process is:

Operation Failed

↓

Retry 1

↓

Failed

↓

Retry 2

↓

Failed

↓

Retry Limit Reached

↓

Mark Failed

↓

Alert / Log

**22.34 Background Job Errors**

If the MVP uses background jobs for:

- Notifications.
- Payment verification.
- Retry operations.
- Scheduled cleanup.
- Other asynchronous processes.

Job failures should be recorded.

Example:

JOB

Payment Verification

Status:

FAILED

Reason:

Provider unavailable

Retry:

YES

The system should prevent failed jobs from disappearing without trace.

**22.35 Error Monitoring**

The production environment should provide a mechanism for monitoring important application errors.

Developers/administrators should be able to identify:

- Increasing error rates.
- Repeated payment failures.
- Repeated database failures.
- External service outages.
- Notification failures.
- Authentication abuse.
- Repeated API errors.

Advanced monitoring platforms are not mandatory for the MVP, but the architecture should allow them to be introduced later.

**22.36 Administrative Error Visibility**

Administrators should have appropriate visibility into operational problems.

The MVP may provide an administrative error/incident view containing:

- Error reference.
- Error category.
- Severity.
- Timestamp.
- Related trip.
- Related user where appropriate.
- Status.
- Number of occurrences.
- Resolution information.

Sensitive technical details should only be visible to authorized administrators/developers.

**22.37 Incident Status**

Where an error requires investigation, the system may use basic incident states:

OPEN

↓

INVESTIGATING

↓

RESOLVED

Optionally:

CLOSED

Example:

INC-000124

Issue:

Payment verification repeatedly failing.

Status:

INVESTIGATING

Related Trip:

CGK-2026-000125

This is particularly useful for recurring operational problems.

**22.38 Error Resolution Record**

When an important error is resolved, the system should retain relevant information.

The resolution record may contain:

- Incident ID.
- Error reference.
- Resolution status.
- Resolved by.
- Resolution date/time.
- Resolution notes.
- Related corrective action.

Example:

Incident:

INC-000124

Resolved By:

ADMIN-104

Resolution:

Payment provider reference manually verified.

Resolved At:

2026-08-10 15:20

**22.39 Audit and Security Events**

Security-related activities should also be auditable.

Examples:

- Failed login attempts.
- Successful login.
- Account suspension.
- Password/security changes.
- Permission changes.
- Administrative access.
- Unauthorized access attempts.
- Sensitive administrative operations.

The system should avoid exposing security logs to ordinary customers or drivers.

**22.40 Access to Logs**

Technical logs should not be available to ordinary application users.

Access should be restricted to authorized:

- Developers.
- System administrators.
- Authorized technical personnel.

Business audit information may be available to administrators according to their permissions.

Customers and drivers should only see information appropriate to their own trips and accounts.

**22.41 Log Retention**

Logs and audit records should have defined retention policies.

The system should distinguish between:

**Technical logs**

and:

**Business audit records.**

Technical logs may be retained for a shorter operational period depending on storage requirements.

Important business audit records should be retained for a longer period because they may be needed for:

- Disputes.
- Financial investigations.
- Security investigations.
- Operational review.
- Compliance requirements.

The exact retention period should be finalized as part of operational and legal policy.

**22.42 Log Storage**

The application should avoid storing unlimited logs inside ordinary transactional tables where this could negatively affect application performance.

Depending on implementation, logs may be stored using:

- Structured application logging.
- Dedicated log storage.
- Cloud logging infrastructure.
- Rotating log files.
- Monitoring platforms.

The architecture should allow the logging mechanism to be changed without rewriting the entire application.

**22.43 Structured Logging**

Where possible, logs should use structured information rather than only plain text.

Example:

{

"level": "ERROR",

"event": "PAYMENT_VERIFICATION_FAILED",

"tripId": "CGK-2026-000125",

"transactionId": "PAY-00125",

"requestId": "REQ-0001827"

}

Structured logs make searching and filtering easier.

**22.44 Audit Event Naming**

Audit actions should use consistent names.

Examples:

USER_CREATED

DRIVER_VERIFICATION_SUBMITTED

DRIVER_VERIFICATION_APPROVED

TRIP_CREATED

DRIVER_SELECTED

TRIP_BOOKED

TRIP_STATUS_CHANGED

PICKUP_INSPECTION_COMPLETED

DELIVERY_INSPECTION_COMPLETED

PAYMENT_CONFIRMED

REFUND_CREATED

DRIVER_PAYMENT_RELEASED

WITHDRAWAL_CREATED

DISPUTE_CREATED

DISPUTE_RESOLVED

ADMIN_ACTION_PERFORMED

The final naming convention should remain consistent across the backend.

**22.45 Audit and Trip Status History**

Trip status changes should have their own historical record.

For example:

REQUESTED

↓

QUOTING

↓

DRIVER SELECTED

↓

PAYMENT PENDING

↓

BOOKED

↓

PICKUP PENDING

↓

PICKUP INSPECTION

↓

TRIP START PENDING

↓

TRIP ACTIVE

↓

IN TRANSIT

↓

DELIVERY PENDING

↓

DELIVERED

↓

COMPLETED

For each important transition, the system should be able to determine:

- Previous status.
- New status.
- Actor.
- Timestamp.
- Reason where applicable.
- Related request/action.

This prevents the current status from becoming the only available history.

**22.46 Manual Administrative Actions**

Administrators may sometimes need to intervene manually.

Examples:

- Resolve a dispute.
- Correct an operational issue.
- Approve an exceptional refund.
- Suspend an account.
- Correct a trip state where justified.

Such actions should always require appropriate authorization and should create audit records.

The system should never silently change important records without recording who performed the action and why.

**22.47 Administrative Override**

Where administrative overrides are permitted, the system should require:

1.  Authorized administrator.
2.  Valid permission.
3.  Reason for override.
4.  Relevant record.
5.  Timestamp.
6.  Audit entry.

Example:

Admin Override

Trip:

CGK-2026-000125

Previous:

DISPUTED

New:

COMPLETED

Reason:

Delivery evidence reviewed and verified.

**22.48 Error Handling and Data Integrity**

An error should never intentionally leave critical data in an inconsistent state.

For example, the system should avoid:

Trip = COMPLETED

BUT

Final Driver Payment = Missing

without the system detecting the inconsistency.

Where a dependent operation fails, the system should either:

- Roll back the relevant transaction;
- Retry safely;
- Mark the operation as pending;
- Or create an exception requiring reconciliation.

The correct behavior depends on the specific operation.

**22.49 Financial Reconciliation Errors**

If the system detects a mismatch such as:

Customer Payment:

KSh 24,900

Expected Allocation:

KSh 24,900

Recorded Allocation:

KSh 23,900

the system should flag the discrepancy.

It should not silently modify financial values merely to make the numbers balance.

The discrepancy should be available for authorized investigation.

**22.50 Error Handling During Refunds**

If a refund request fails:

Refund Requested

↓

Payment Provider

↓

FAILED

the original payment should remain intact.

The refund should be recorded with an appropriate status such as:

REFUND PENDING

or:

REFUND FAILED

depending on the implementation.

The customer should not receive a message saying:

Refund Completed

unless the refund has actually been confirmed.

**22.51 Error Handling During Withdrawals**

If a driver withdrawal fails:

Withdrawal Requested

↓

Provider

↓

FAILED

the system should not permanently deduct the driver's available funds as though the withdrawal succeeded.

The withdrawal record should reflect the actual result.

Example:

Withdrawal:

KSh 5,000

Status:

FAILED

Reason:

Provider transaction failure

The available wallet balance should remain consistent with the actual financial state.

**22.52 Error Handling During File Uploads**

The system may receive files such as:

- Driver verification documents.
- Vehicle photographs.
- Inspection photographs.
- Delivery evidence.

If a file upload fails:

Upload Started

↓

Upload Failed

the related business record should not incorrectly indicate that the required file exists.

The system should validate:

- File type.
- File size.
- Upload result.
- Storage reference.

Where appropriate, failed uploads should be logged.

**22.53 Error Handling During GPS Tracking**

Temporary GPS failures should not automatically invalidate the trip.

For example:

GPS Connection Lost

↓

Last Known Location Retained

↓

Tracking Status = TEMPORARILY UNAVAILABLE

↓

Retry

The system should distinguish between:

**GPS unavailable**

and:

**Trip failed.**

If the tracking problem becomes significant, the appropriate users or administrators may be notified.

**22.54 Error Handling During Communication**

If a message cannot be delivered:

Message Created

↓

Delivery Attempt

↓

FAILED

the message should remain recorded with the appropriate delivery status.

The system may retry where appropriate.

A communication failure should not automatically change the trip status.

**22.55 Error Handling Principle for Developers**

Developers should follow this general pattern:

RECEIVE REQUEST

↓

VALIDATE INPUT

↓

AUTHENTICATE USER

↓

AUTHORIZE ACTION

↓

VALIDATE BUSINESS RULES

↓

PERFORM OPERATION

↓

COMMIT SUCCESS

↓

RECORD AUDIT EVENT

↓

TRIGGER NOTIFICATION WHERE REQUIRED

If an error occurs:

ERROR

↓

ROLLBACK / SAFE FAILURE

↓

LOG TECHNICAL DETAILS

↓

RETURN SAFE USER MESSAGE

↓

RETRY / ESCALATE WHERE APPROPRIATE

**22.56 Developer Error Handling Requirements**

Developers implementing the CarGo Kenya backend shall:

- Validate all user input.
- Validate authorization server-side.
- Validate business rules server-side.
- Use consistent error codes.
- Avoid exposing stack traces to users.
- Log unexpected failures.
- Include request/correlation identifiers.
- Protect sensitive information in logs.
- Use database transactions for critical multi-step operations.
- Prevent duplicate financial operations.
- Preserve important audit history.
- Handle external service failures safely.
- Implement appropriate retry mechanisms.
- Avoid silently swallowing exceptions.
- Return consistent API error responses.

**22.57 Frontend Error Handling Requirements**

The frontend shall:

- Display understandable error messages.
- Display validation errors near the relevant fields where appropriate.
- Prevent unnecessary repeated submissions.
- Show loading/processing states for long-running operations.
- Inform users when an operation is still being processed.
- Avoid displaying raw backend exceptions.
- Handle expired sessions appropriately.
- Provide retry options where appropriate.
- Preserve entered information where practical after non-destructive failures.

For example:

Payment Processing

Your payment is being verified.

Please do not submit another payment request.

This is preferable to immediately presenting a generic failure when the payment status is actually uncertain.

**22.58 Backend Error Handling Requirements**

The backend shall be the final authority for:

- Authentication.
- Authorization.
- Trip status transitions.
- Payment calculations.
- Payment release.
- Wallet transactions.
- Inspection completion.
- Delivery completion.
- Refund authorization.
- Withdrawal eligibility.
- Administrative actions.

The frontend shall never be treated as proof that an important operation has occurred.

**22.59 Error Notification Rules**

Not every error should generate a user notification.

**User notification required where appropriate:**

- Payment failure.
- Payment pending.
- Failed withdrawal.
- Failed refund.
- Important trip operation failure.
- Account/security issue.
- Action requiring user attention.

**Developer/system logging required:**

- Database errors.
- Internal exceptions.
- External API errors.
- Unexpected failures.
- Background job failures.

**Administrator alert may be required:**

- Repeated payment failures.
- Financial reconciliation mismatch.
- Serious security event.
- Critical system outage.
- Failed dispute operation.
- Repeated external service failures.

**22.60 Error and Audit Testing**

The MVP shall include testing of important error and audit scenarios.

Examples:

**Payment**

Successful payment

Failed payment

Duplicate callback

Provider timeout

Unknown payment status

Refund failure

**Trip**

Invalid status transition

Unauthorized trip modification

Duplicate trip confirmation

**Wallet**

Duplicate release

Unauthorized release

Insufficient withdrawal balance

Withdrawal failure

**Inspection**

Missing required photo

Failed upload

Incomplete inspection

**Security**

Unauthorized API request

Expired authentication

Unauthorized administrator action

**Notifications**

SMS failure

Duplicate notification

Notification retry

The expected outcome of each test should be documented.

**22.61 Audit Testing**

The system should verify that important actions create the appropriate audit records.

For example:

Admin Approves Driver

↓

Driver Status Updated

↓

Audit Record Created

Similarly:

50% Driver Payment Released

↓

Wallet Transaction

↓

Audit Record

↓

Driver Notification

The system should not consider an important operation fully implemented if the required audit trail is missing.

**22.62 Operational Troubleshooting Flow**

When a user reports a problem, the support/development team should be able to investigate using:

User Report

↓

Request ID / Trip ID

↓

Application Logs

↓

Transaction Records

↓

Audit Trail

↓

External Service Reference

↓

Determine Cause

↓

Resolve / Escalate

Example:

Customer reports:

"I paid but my trip is still not booked."

The investigation should be able to trace:

Trip ID

↓

Payment Transaction

↓

Provider Reference

↓

Payment Status

↓

Verification Log

↓

Trip Status History

↓

Error / Audit Record

**22.63 Error Recovery**

Where recovery is possible, the system should provide controlled recovery mechanisms.

Examples:

- Retry payment verification.
- Retry notification delivery.
- Retry external API request.
- Resume incomplete upload.
- Reconcile wallet transaction.
- Reprocess failed background job.

Recovery actions should themselves be logged where important.

**22.64 Error Recovery Must Not Create Duplicates**

A retry must not automatically create another financial transaction.

For example:

First Release

↓

Transaction Created

↓

Response Lost

Retry

↓

Check Existing Transaction

↓

Already Exists

↓

Return Existing Result

This principle is particularly important for:

- Payments.
- Refunds.
- Wallet releases.
- Withdrawals.

**22.65 Audit and Dispute Resolution**

Audit records should support dispute investigation.

For example, if a customer claims:

"I never confirmed the trip start."

the administrator should be able to review:

Driver START TRIP

↓

Customer Confirmation Request

↓

Customer Confirmation

↓

TRIP ACTIVE

↓

First 50% Release

The audit trail should provide evidence of the recorded system events without altering the original records.

**22.66 Audit and Vehicle Condition Disputes**

If a customer later disputes vehicle condition, the system should allow the administrator to trace:

Pickup Inspection

↓

Pickup Photographs

↓

Odometer

↓

Fuel Level

↓

Damage Records

↓

Customer/Driver Confirmation

↓

Delivery Inspection

↓

Delivery Photographs

The Error Handling and Audit Module does not own these inspection records.

It ensures that important inspection-related actions are traceable.

**22.67 Audit and Payment Disputes**

For financial disputes, the system should allow investigation of:

Quotation

↓

Price Snapshot

↓

Customer Payment

↓

Trip Wallet

↓

First Release

↓

Final Release

↓

Refund / Adjustment

This provides a complete financial history without changing the responsibility of the Payment and Wallet Module.

**22.68 Audit and Administrative Accountability**

Administrative actions shall be attributable to a specific administrator account.

The system should avoid generic records such as:

Admin changed trip.

Instead:

Admin ID:

ADMIN-104

Action:

TRIP_STATUS_CHANGED

Trip:

CGK-2026-000125

Reason:

Delivery evidence verified.

This improves accountability.

**22.69 MVP Error Handling Scope**

**Included in MVP**

The Error Handling, Logging and Audit Module shall include:

- Standardized error handling.
- Validation errors.
- Authentication errors.
- Authorization errors.
- Business-rule errors.
- System-error handling.
- Payment error handling.
- External-service error handling.
- Consistent API error responses.
- Error codes.
- Request/correlation IDs.
- Application logging.
- Log severity levels.
- Important audit records.
- Trip status history.
- Payment-related audit records.
- Wallet-related audit records.
- Inspection-related audit records.
- Administrative action audit.
- Security-event audit.
- Error tracking.
- Duplicate-operation protection.
- Basic retry handling.
- Basic incident/error visibility.
- Financial discrepancy detection.
- Audit trail for important operations.
- Controlled administrator access to operational information.

**22.70 Not Required for MVP**

The following should remain future enhancements:

- Advanced AI-powered error diagnosis.
- Fully automated incident resolution.
- Advanced observability analytics.
- Machine-learning anomaly detection.
- Complex distributed tracing infrastructure.
- Automated root-cause analysis.
- Advanced security information and event management.
- Predictive failure detection.
- Automated financial reconciliation across multiple providers.
- Advanced compliance reporting.
- Complex incident-management workflows.
- Automated customer compensation based on errors.

These may be introduced as CarGo Kenya grows.

**22.71 Core Error Handling Business Rules**

The following rules shall be treated as core MVP requirements.

**Rule 1**

User-facing errors shall not expose sensitive technical information.

**Rule 2**

Important system errors shall be logged.

**Rule 3**

Critical business operations shall validate the current system state before execution.

**Rule 4**

The backend shall remain the final authority for business-critical operations.

**Rule 5**

Financial operations shall not be considered successful until successfully recorded.

**Rule 6**

Duplicate financial operations shall be prevented.

**Rule 7**

Critical multi-step operations shall maintain data consistency.

**Rule 8**

Important business actions shall create appropriate audit records.

**Rule 9**

Audit records shall identify the actor responsible for an action where applicable.

**Rule 10**

System-generated actions shall be distinguishable from human actions.

**Rule 11**

Important audit history shall not be silently overwritten.

**Rule 12**

External service failures shall be handled separately from underlying business-state changes.

**Rule 13**

Notification failure shall not automatically invalidate a successful underlying transaction.

**Rule 14**

Errors requiring investigation shall be traceable using identifiers such as Trip ID, Transaction ID, Audit ID, or Request ID.

**Rule 15**

Sensitive credentials and secrets shall never be exposed through application logs.

**Rule 16**

Retries shall be implemented safely and shall not create duplicate financial transactions.

**Rule 17**

Administrative overrides shall require authorization and an audit record.

**Rule 18**

Data inconsistencies affecting important business or financial records shall be flagged for investigation.

**22.72 Complete Error, Logging and Audit Lifecycle**

The complete architecture can be understood as:

USER / SYSTEM REQUEST

↓

INPUT VALIDATION

↓

AUTHENTICATION

↓

AUTHORIZATION

↓

BUSINESS RULE VALIDATION

↓

BUSINESS OPERATION

↓

┌─────────────────────────┐

│ SUCCESS │

└─────────────────────────┘

↓

DATABASE COMMIT

↓

AUDIT RECORD

↓

NOTIFICATION / EVENT

↓

USER RESULT

If an error occurs:

BUSINESS OPERATION

↓

ERROR

↓

SAFE FAILURE / ROLLBACK

↓

TECHNICAL LOG

↓

ERROR RESPONSE

↓

USER MESSAGE

↓

RETRY / ADMIN REVIEW

↓

RESOLUTION

For important operations:

REQUEST

↓

REQUEST ID

↓

OPERATION

↓

TRANSACTION RECORD

↓

AUDIT RECORD

↓

LOGS

↓

NOTIFICATION

This provides multiple layers of traceability.

**22.73 Final Architecture**

The CarGo Kenya Error Handling, Logging and Audit Module can therefore be understood as three connected layers:

CARGO KENYA SYSTEM

│

┌─────────────┴─────────────┐

↓ ↓

ERROR HANDLING AUDIT TRAIL

│ │

↓ ↓

User-Safe Response Business Activity History

│ │

↓ ↓

ERROR LOGGING Actor + Action + Time

│ │

↓ ↓

Developer Troubleshooting Accountability

│ │

└─────────────┬─────────────┘

↓

ADMIN / DEVELOPER

INVESTIGATION

│

↓

RESOLUTION

**23.0 TESTING & QUALITY REQUIREMENTS**

**23.1 Purpose**

The Testing and Quality Requirements Module shall define how the CarGo Kenya system will be tested, validated, and verified before and during deployment.

The purpose of testing is to ensure that the system:

- Performs the required business functions correctly.
- Enforces the defined CarGo Kenya business rules.
- Protects customer, driver, administrator, and financial information.
- Maintains consistency between related modules.
- Prevents unauthorized operations.
- Handles errors safely.
- Maintains correct trip-status transitions.
- Maintains correct payment and wallet transactions.
- Correctly records vehicle inspection evidence.
- Provides reliable GPS and trip-tracking functionality.
- Sends accurate notifications.
- Performs adequately under expected MVP usage.
- Remains usable on supported devices.
- Does not introduce data corruption during normal or abnormal operations.

Testing shall therefore cover both individual system components and the complete CarGo Kenya transportation lifecycle.

**23.2 Testing Philosophy**

CarGo Kenya shall follow a layered testing approach.

Testing should not only ask:

"Does the button work?"

It should also verify:

"Does the underlying business operation occur correctly, securely, and consistently?"

For example, when a driver selects:

**START TRIP**

testing must verify more than the frontend response.

The system must verify:

Driver authorized?

↓

Pickup inspection completed?

↓

Vehicle handover completed?

↓

Required evidence captured?

↓

Fueling requirements satisfied?

↓

Customer confirmation received?

↓

Trip status changed to TRIP ACTIVE?

↓

50% driver release correctly calculated?

↓

Wallet transaction recorded?

↓

Notification generated?

A successful test therefore requires the entire underlying operation to remain consistent.

**23.3 Testing Objectives**

The testing process shall aim to verify that:

1.  Functional requirements have been implemented correctly.
2.  Business rules are enforced by the backend.
3.  Users can only perform authorized actions.
4.  Trip statuses transition correctly.
5.  Financial transactions are accurate.
6.  Wallet balances remain consistent.
7.  Inspection records remain complete and traceable.
8.  GPS and tracking functions operate correctly.
9.  Notifications correspond to actual system events.
10. APIs return correct responses.
11. Database constraints protect data integrity.
12. Errors are handled without corrupting system state.
13. The system performs adequately under expected load.
14. Security controls operate correctly.
15. The system remains usable across supported devices and browsers.

**23.4 Testing Levels**

The CarGo Kenya MVP shall use multiple levels of testing.

The main testing levels shall be:

1.  Unit Testing
2.  Integration Testing
3.  API Testing
4.  System Testing
5.  End-to-End Testing
6.  User Acceptance Testing
7.  Security Testing
8.  Performance Testing
9.  Usability Testing
10. Regression Testing

Each level addresses a different part of system quality.

**23.5 Unit Testing**

Unit testing shall verify individual functions, services, utilities, and components independently.

Examples include:

- Price calculation.
- Platform-fee calculation.
- Driver-fee calculation.
- Fuel-budget calculation.
- Payment-release calculation.
- Trip-status validation.
- Permission checks.
- Notification-template generation.
- Wallet-balance calculation.
- GPS-distance calculation where applicable.
- Input validation.

For example, if the driver fee is:

KSh 18,000

the first release should be:

KSh 9,000.

The calculation function should therefore be tested independently before being used by the payment service.

**23.6 Unit Testing Requirements**

Important backend business functions should have automated unit tests.

Tests should cover:

**Normal cases**

Valid information produces the expected result.

**Boundary cases**

Values at the allowed limits are handled correctly.

**Invalid cases**

Incorrect information is rejected.

**Exceptional cases**

Unexpected conditions are handled safely.

For example, the payment-release service should be tested for:

- Valid TRIP ACTIVE trip.
- Already released first payment.
- Missing inspection.
- Missing customer confirmation.
- Missing driver confirmation.
- Invalid trip.
- Unauthorized driver.
- Incorrect payment amount.
- Duplicate release request.

**23.7 Integration Testing**

Integration testing shall verify that different CarGo Kenya modules work correctly together.

Important integrations include:

Customer Request

↓

Quotation

↓

Driver Selection

↓

Payment

↓

Trip Wallet

↓

Vehicle Inspection

↓

Trip Start

↓

GPS Tracking

↓

Delivery

↓

Trip Completion

↓

Driver Wallet

↓

Withdrawal

The test should confirm that information passed between modules remains accurate.

**23.8 Payment Integration Testing**

The payment system shall receive dedicated integration testing.

Testing shall verify:

- Payment initiation.
- Payment-provider response.
- Successful payment.
- Failed payment.
- Pending payment.
- Duplicate callback.
- Invalid callback.
- Incorrect amount.
- Incorrect trip reference.
- Payment timeout.
- Refund.
- Partial refund.
- Payment reconciliation.

The system must not mark a trip as:

**BOOKED**

until the required payment has been successfully verified.

**23.9 Payment Release Testing**

The payment-release mechanism shall receive particularly strict testing because it directly affects driver funds.

**First release test**

Given:

Driver Fee = KSh 18,000

Trip Status = TRIP ACTIVE

Expected:

First Release = KSh 9,000.

The test must verify that:

- Exactly KSh 9,000 is released.
- The driver wallet receives KSh 9,000.
- The Trip Wallet records the release.
- The release cannot be repeated.
- A notification is generated only after successful recording.

**Final release test**

Given:

Driver Fee = KSh 18,000

First Release = KSh 9,000

Trip Status = COMPLETED

Expected:

Final Release = KSh 9,000.

Total Driver Earnings:

KSh 18,000.

**23.10 Trip Lifecycle Testing**

The complete trip-status lifecycle shall be tested.

The expected lifecycle is:

**REQUESTED**

↓

**QUOTING**

↓

**DRIVER SELECTED**

↓

**PAYMENT PENDING**

↓

**BOOKED**

↓

**PICKUP PENDING**

↓

**PICKUP INSPECTION**

↓

**TRIP START PENDING**

↓

**TRIP ACTIVE**

↓

**IN TRANSIT**

↓

**DELIVERY PENDING**

↓

**DELIVERED**

↓

**COMPLETED**

The system shall also support appropriate exceptional states such as:

- DISPUTED
- CANCELLED

Testing must verify that users cannot arbitrarily jump between statuses.

For example:

**BOOKED → COMPLETED**

should not be allowed unless the required intermediate conditions have been satisfied or an authorized administrative process explicitly permits the transition.

**23.11 Trip Status Transition Testing**

Each transition shall have its own test conditions.

Example:

**BOOKED → PICKUP PENDING**

Verify:

- Payment confirmed.
- Driver assigned.
- Trip booking valid.

**PICKUP PENDING → PICKUP INSPECTION**

Verify:

- Driver has reached the pickup process.
- Driver is authorized for the trip.

**PICKUP INSPECTION → TRIP START PENDING**

Verify:

- Inspection completed.
- Required evidence captured.
- Handover recorded.

**TRIP START PENDING → TRIP ACTIVE**

Verify:

- Driver selected START TRIP.
- Customer confirmed commencement.
- Required pickup procedures completed.

**DELIVERY PENDING → DELIVERED**

Verify:

- Delivery inspection completed.
- Handover completed.
- Required confirmations recorded.

**DELIVERED → COMPLETED**

Verify:

- Customer confirmation.
- Driver confirmation.
- Required completion conditions satisfied.

**23.12 Vehicle Inspection Testing**

Vehicle inspection functionality shall be tested at both pickup and delivery.

Testing shall verify that the system correctly records:

- Odometer reading.
- Fuel level.
- Vehicle condition.
- Damage observations.
- Inspection photographs.
- Inspection timestamp.
- Inspector/driver identity.
- Pickup or delivery inspection type.
- Customer confirmation where required.
- Handover confirmation.

The system should not mark an inspection as complete if mandatory information is missing.

**23.13 Inspection Evidence Testing**

Testing shall verify that inspection evidence:

- Is associated with the correct trip.
- Is associated with the correct inspection.
- Cannot be incorrectly attached to another trip.
- Is accessible only to authorized users.
- Retains the correct timestamp.
- Cannot be silently replaced without appropriate recordkeeping.
- Remains available for dispute investigation.

The test should also verify that ordinary chat images are not incorrectly treated as official inspection evidence.

**23.14 GPS and Tracking Testing**

GPS functionality shall be tested under different conditions.

Tests should include:

- GPS available.
- GPS temporarily unavailable.
- Poor network connectivity.
- Driver moving.
- Driver stationary.
- Location update received.
- Location update delayed.
- Tracking resumed after interruption.
- Invalid location data.
- Unauthorized access to tracking information.

A temporary GPS failure should not automatically change:

**TRIP ACTIVE**

to:

**CANCELLED**

or:

**COMPLETED**.

**23.15 Notification Testing**

Notification testing shall verify that notifications correspond to actual system events.

Examples:

Payment verified

↓

Payment notification.

Trip booked

↓

Booking notification.

Driver selects START TRIP

↓

Customer receives confirmation request.

Customer confirms

↓

TRIP ACTIVE notification.

First payment released

↓

Driver earnings notification.

Trip completed

↓

Completion notification.

Testing must also verify that duplicate events do not unnecessarily generate duplicate notifications.

**23.16 Communication Testing**

Customer-driver communication shall be tested to ensure that:

- Authorized users can send messages.
- Unauthorized users cannot access messages.
- Messages are associated with the correct trip.
- Messages cannot be accessed through another user's trip ID.
- Message status is correctly recorded.
- Failed messages are recorded.
- Attachments, where supported, are properly associated.
- Communication remains available after the relevant booking where required.

**23.17 API Testing**

All important backend APIs shall be tested independently.

API testing shall verify:

- Request validation.
- Authentication.
- Authorization.
- Required fields.
- Response status codes.
- Response structure.
- Error responses.
- Database changes.
- Business-rule enforcement.
- Duplicate-request handling.

For example:

POST /payment/release

must not release funds merely because a valid request was received.

The backend must independently verify the trip's eligibility.

**23.18 Authentication Testing**

Authentication functionality shall be tested for:

- Valid login.
- Invalid password.
- Invalid email/phone.
- Expired session/token.
- Invalid token.
- Logout.
- Password reset.
- Account verification.
- Suspended account.
- Unauthorized API access.

The system must reject protected requests from unauthenticated users.

**23.19 Authorization and Role Testing**

Role-based access control shall be tested for:

**Customer**

Should access:

- Own requests.
- Own trips.
- Own payments.
- Own notifications.
- Authorized trip communication.

**Driver**

Should access:

- Eligible requests.
- Assigned trips.
- Own inspections.
- Own earnings.
- Own wallet.
- Authorized communication.

**Administrator**

Should access:

- Authorized operational management functions.
- Verification processes.
- Dispute management.
- Financial review.
- System monitoring.

Tests should specifically attempt unauthorized actions.

For example:

A customer attempting to access another customer's trip should receive an authorization failure.

**23.20 Database Testing**

Database testing shall verify:

- Required fields.
- Foreign-key relationships.
- Unique constraints.
- Status values.
- Transaction integrity.
- Cascade/restriction rules.
- Indexes.
- Duplicate prevention.
- Timestamp consistency.

For example, a payment transaction should not reference a nonexistent trip.

**23.21 Transaction Integrity Testing**

Financial and critical operations should be tested as atomic transactions where appropriate.

For example:

First Driver Release

↓

Create wallet transaction

↓

Update applicable balance

↓

Record release

↓

Commit transaction

If a critical database operation fails, the system should avoid a partial financial update.

The test should deliberately introduce failure conditions to confirm that the database does not become inconsistent.

**23.22 Wallet Reconciliation Testing**

The system shall test whether:

**Trip Financial Records = Wallet Transactions = Released Amounts**

For example:

Driver Fee:

KSh 18,000

First Release:

KSh 9,000

Final Release:

KSh 9,000

Total Released:

KSh 18,000

The system should identify inconsistencies such as:

- KSh 27,000 released from an KSh 18,000 driver fee.
- First release recorded twice.
- Final release recorded before completion.
- Wallet balance not matching transaction history.

**23.23 Refund Testing**

Refund testing shall cover:

- Full refund.
- Partial refund.
- Failed refund.
- Duplicate refund request.
- Refund exceeding original payment.
- Refund after driver release.
- Refund during dispute.
- Refund confirmation.

The system must not allow an unauthorized user to create arbitrary refunds.

**23.24 Cancellation Testing**

Cancellation scenarios shall be tested at different stages.

Examples:

**Before driver selection**

Cancellation should follow the appropriate request rules.

**After driver selection**

The system should apply the applicable cancellation process.

**After payment**

Financial consequences must be correctly recorded.

**After TRIP ACTIVE**

Cancellation should not simply behave like a pre-trip cancellation.

**During dispute**

The system should preserve relevant financial and operational records.

**23.25 Dispute Testing**

The dispute system shall be tested for:

- Dispute creation.
- Evidence submission.
- Customer dispute.
- Driver dispute.
- Administrator review.
- Status changes.
- Financial protection.
- Resolution.
- Adjustment.
- Notifications.

The test must confirm that disputed funds are handled according to the defined business rules.

**23.26 Security Testing**

Security testing shall verify that the application cannot easily be manipulated through unauthorized requests.

Testing shall include:

- Authentication bypass attempts.
- Authorization bypass attempts.
- Invalid token testing.
- Input manipulation.
- SQL injection testing.
- Cross-site scripting testing.
- Malicious file upload testing.
- API abuse testing.
- Rate-limit testing where implemented.
- Sensitive-data exposure testing.
- Session/token security testing.

Financial endpoints shall receive additional security testing.

**23.27 Input Validation Testing**

All user-controlled input shall be tested.

Examples include:

- Names.
- Phone numbers.
- Email addresses.
- Pickup locations.
- Destination.
- Vehicle details.
- Quotation amounts.
- Fuel amounts.
- Odometer readings.
- Messages.
- Payment references.
- Withdrawal amounts.

The system should reject:

- Missing required values.
- Invalid formats.
- Negative financial values where prohibited.
- Impossible odometer values.
- Invalid status values.
- Oversized uploads.
- Unsupported file types.

**23.28 File Upload Testing**

Vehicle inspection photographs and other supported uploads shall be tested for:

- Valid file type.
- Invalid file type.
- File size.
- Multiple uploads.
- Duplicate uploads.
- Corrupted files.
- Unauthorized access.
- Storage failure.
- Upload interruption.

The system should never trust a filename or client-provided file type alone when determining whether a file is safe.

**23.29 Performance Testing**

Performance testing shall determine whether the system responds adequately under expected MVP usage.

Important areas include:

- Login.
- Dashboard loading.
- Trip search.
- Quotation submission.
- Payment processing.
- Notification retrieval.
- GPS updates.
- Inspection uploads.
- Wallet queries.
- Administrator dashboards.

The objective is to identify slow operations before production deployment.

**23.30 Load Testing**

Load testing shall simulate multiple users interacting with the system.

Examples include:

- Multiple customers creating requests.
- Multiple drivers submitting quotations.
- Multiple customers making payments.
- Multiple drivers updating trip status.
- Multiple GPS updates.
- Multiple notifications.
- Multiple administrators reviewing trips.

The test should identify:

- Database bottlenecks.
- API bottlenecks.
- Memory problems.
- Excessive CPU usage.
- Slow queries.
- Connection-pool exhaustion.

**23.31 Stress Testing**

Stress testing shall determine how the system behaves beyond its expected normal operating conditions.

The system should be tested with unusually high:

- API requests.
- Concurrent users.
- GPS updates.
- File uploads.
- Notification events.
- Payment callbacks.

The objective is not necessarily to make the system remain fully operational under unlimited load.

Instead, testing should determine whether the system:

- Fails gracefully.
- Protects data.
- Recovers correctly.
- Avoids corruption.
- Provides useful error responses.

**23.32 Usability Testing**

Usability testing shall verify that customers, drivers, and administrators can understand and operate the system.

The following workflows should be tested with representative users:

**Customer**

Create request

↓

Review quotations

↓

Select driver

↓

Make payment

↓

Monitor trip

↓

Confirm trip start

↓

Confirm delivery

↓

View trip history

**Driver**

Register

↓

Complete verification

↓

View requests

↓

Submit quotation

↓

Accept assignment

↓

Complete pickup inspection

↓

Start trip

↓

Track trip

↓

Complete delivery

↓

View earnings

↓

Request withdrawal

**Administrator**

Review users

↓

Verify drivers

↓

Monitor trips

↓

Review disputes

↓

Review payments

↓

Manage operational issues

The objective is to identify confusing screens, unclear terminology, missing information, and unnecessary steps.

**23.33 Mobile and Responsive Testing**

Because customers and drivers may primarily use mobile devices, the MVP shall be tested across different screen sizes.

Testing should include:

- Mobile phones.
- Tablets where supported.
- Desktop browsers.

Important interfaces include:

- Login.
- Trip creation.
- Quotation interface.
- Driver trip interface.
- Inspection interface.
- GPS tracking.
- Wallet.
- Notifications.
- Communication.

**23.34 Browser Compatibility Testing**

The MVP should be tested on the supported modern browsers.

At minimum, testing should consider:

- Google Chrome.
- Microsoft Edge.
- Mozilla Firefox.
- Safari where applicable.

The exact supported browser matrix should be documented before production release.

**23.35 Offline and Poor-Network Testing**

Because transportation operations may occur in areas with unstable connectivity, the system should be tested under poor network conditions.

Tests should include:

- Temporary network loss.
- Slow network.
- Intermittent connectivity.
- Request timeout.
- Duplicate request caused by retry.
- GPS interruption.
- Inspection upload interruption.
- Payment callback delay.

The system should avoid creating duplicate records when a user retries an operation after a timeout.

**23.36 Recovery Testing**

The system shall be tested for recovery from failures.

Examples include:

- Server restart.
- Database connection loss.
- Payment provider interruption.
- Notification-service failure.
- GPS service interruption.
- File-storage failure.

The system should recover without losing critical records.

Financial transactions require particular attention during recovery.

**23.37 Backup and Restore Testing**

Database backup procedures shall be tested periodically.

Testing shall verify that:

- Backups are created.
- Backups are readable.
- Backups contain required data.
- Restoration is possible.
- Restored data remains consistent.
- Financial records remain intact.

A backup that cannot be successfully restored should not be treated as a reliable backup.

**23.38 Regression Testing**

Whenever an important feature is changed, previously working functionality shall be retested.

For example, if the Payment Module is modified, regression testing should include:

- Driver selection.
- Payment.
- Booking.
- Trip Wallet.
- Trip Active.
- First driver release.
- Driver wallet.
- Completion.
- Final driver release.
- Notifications.

This is necessary because changes in one module can affect other modules.

**23.39 End-to-End Testing**

The complete CarGo Kenya transportation process shall be tested from beginning to end.

A primary MVP end-to-end test should follow:

Customer Registration

↓

Transportation Request

↓

Driver Quotations

↓

Customer Selects Driver

↓

Price Confirmation

↓

Customer Payment

↓

Payment Verification

↓

BOOKED

↓

Pickup

↓

Vehicle Inspection

↓

Vehicle Handover

↓

Trip Start

↓

Customer Confirmation

↓

TRIP ACTIVE

↓

50% Driver Release

↓

IN TRANSIT

↓

Destination

↓

Delivery Inspection

↓

Customer Confirmation

↓

Driver Confirmation

↓

COMPLETED

↓

Final 50% Driver Release

↓

Driver Wallet

↓

Withdrawal

Every stage must produce the expected system state.

**23.40 Negative Testing**

The system shall also be tested by deliberately providing invalid or unauthorized actions.

Examples include:

- Customer attempts to select an unavailable driver.
- Driver attempts to quote on an unauthorized request.
- Driver attempts to start a trip without inspection.
- Customer attempts to confirm a nonexistent trip.
- Driver attempts to release money manually.
- Driver attempts to withdraw pending earnings.
- Customer attempts to access another customer's trip.
- User submits invalid payment information.
- Duplicate payment callback is received.
- Duplicate wallet release request is received.

The expected result should be safe rejection rather than unexpected system behavior.

**23.41 Boundary Testing**

Boundary values shall be tested.

Examples include:

- Minimum quotation.
- Maximum quotation.
- Minimum fuel budget.
- Maximum permitted file size.
- Maximum message length.
- Minimum withdrawal amount.
- Maximum withdrawal amount.
- Empty required field.
- Maximum permitted characters.
- Maximum number of inspection photographs.

Boundary testing helps identify errors that may not appear during normal use.

**23.42 Concurrency Testing**

The system shall be tested when multiple users perform operations simultaneously.

Examples:

Two customers attempting to select the same driver.

↓

Two payment callbacks arriving simultaneously.

↓

Two requests attempting the same wallet release.

↓

Driver and customer updating the same trip at nearly the same time.

↓

Two administrators modifying the same dispute.

The backend must use appropriate transaction and concurrency controls to prevent inconsistent states.

**23.43 Idempotency Testing**

Important operations shall be tested for idempotency.

Examples include:

- Payment confirmation.
- Payment callback processing.
- Wallet release.
- Refund processing.
- Withdrawal processing.
- Notification generation.

If the same request is received twice, the system should not create duplicate financial or operational records.

**23.44 Audit Testing**

Audit records shall be tested to verify that important actions are correctly recorded.

Examples:

- Driver verification.
- Payment confirmation.
- First payment release.
- Final payment release.
- Refund.
- Cancellation.
- Dispute resolution.
- Administrative adjustment.
- Account suspension.

The test should verify:

- Actor.
- Action.
- Date/time.
- Related record.
- Relevant status.
- Transaction reference where applicable.

**23.45 Data Integrity Testing**

The system shall verify that related data remains consistent.

Examples:

A trip must reference a valid customer.

↓

A selected driver must exist.

↓

A payment must reference the correct trip.

↓

A Trip Wallet must reference the correct trip.

↓

A driver release must reference the correct wallet and trip.

↓

A driver wallet transaction must reference the correct driver.

This prevents orphaned and incorrectly associated records.

**23.46 Notification and Transaction Consistency Testing**

Critical notifications shall only be generated after the underlying event has succeeded.

For example:

Payment

↓

Payment Verified

↓

Trip Updated

↓

Wallet Updated

↓

Notification

If wallet release fails:

**No successful payment-release notification should be sent.**

Similarly:

If payment fails:

**No successful-payment notification should be sent.**

**23.47 Test Data Requirements**

Testing shall use controlled test data.

Test data should include:

- Test customers.
- Test drivers.
- Test administrators.
- Test vehicles.
- Test trips.
- Test quotations.
- Test payments.
- Test wallet transactions.
- Test inspection records.
- Test disputes.
- Test notifications.

Production customer or financial information should not be used unnecessarily for testing.

**23.48 Test Environment**

The development team should maintain a testing environment that is separated from production.

The testing environment should ideally contain:

- Test database.
- Test payment configuration.
- Test notification configuration.
- Test file storage.
- Test API credentials.
- Test user accounts.

Production credentials should never be casually used during development testing.

**23.49 Test Case Structure**

Each important test case should document:

| **Field** | **Description** |
| --- | --- |
| Test Case ID | Unique test identifier |
| Module | System module being tested |
| Feature | Specific feature |
| Preconditions | Conditions required before testing |
| Test Steps | Actions to perform |
| Test Data | Data used |
| Expected Result | Expected system behavior |
| Actual Result | Observed behavior |
| Status | Pass/Fail |
| Tester | Person conducting test |
| Date | Test date |
| Notes | Additional information |

This will make testing repeatable and traceable.

**23.50 Example Test Case**

**Test Case ID**

PAY-001

**Feature**

First Driver Payment Release

**Preconditions**

- Valid trip exists.
- Driver is assigned.
- Customer payment is confirmed.
- Pickup inspection is complete.
- Vehicle handover is complete.
- Driver has selected START TRIP.
- Customer has confirmed trip commencement.
- Trip status is TRIP ACTIVE.
- Driver fee is KSh 18,000.

**Test Steps**

1.  Request first driver payment release.
2.  Backend validates trip conditions.
3.  Backend calculates permitted release.
4.  Wallet transaction is created.
5.  Driver wallet is updated.
6.  Notification is generated.

**Expected Result**

KSh 9,000 is released to the driver's available wallet balance.

No additional amount is released.

The release cannot be repeated.

**23.51 Acceptance Criteria**

A feature shall not be considered complete merely because the code has been implemented.

A feature should satisfy:

1.  Functional requirements.
2.  Business rules.
3.  Security requirements.
4.  Data-integrity requirements.
5.  Usability requirements.
6.  Relevant performance requirements.
7.  Relevant error-handling requirements.
8.  Required audit requirements.
9.  Required notification behavior.
10. Relevant integration requirements.

**23.52 Definition of Done**

For the CarGo Kenya MVP, a development task should generally be considered complete when:

- Required functionality is implemented.
- Backend validation is implemented.
- Database changes are complete.
- API behavior is tested.
- Relevant frontend behavior is tested.
- Error handling is implemented.
- Authorization is verified.
- Unit tests pass where applicable.
- Integration tests pass where applicable.
- Regression testing has been completed.
- Documentation has been updated.
- No critical unresolved defects remain.

**23.53 Defect Classification**

Discovered defects should be classified according to severity.

**Critical**

Prevents a core business process or causes serious financial/security/data-integrity problems.

Examples:

- Duplicate driver payment.
- Unauthorized wallet withdrawal.
- Customer payment recorded incorrectly.
- Unauthorized access to another customer's trip.

**High**

Major functionality is unavailable or significantly incorrect.

Examples:

- Customer cannot complete payment.
- Driver cannot start an assigned trip.
- Vehicle inspection cannot be completed.

**Medium**

Important functionality is affected but a workaround exists.

**Low**

Minor usability or presentation issue.

Examples:

- Incorrect spacing.
- Minor wording issue.
- Non-critical visual inconsistency.

**23.54 Critical Defect Rules**

Critical defects shall be resolved before production deployment.

Particular attention shall be given to defects involving:

- Money.
- Authentication.
- Authorization.
- Personal information.
- Trip-status integrity.
- Inspection evidence.
- Duplicate transactions.
- Database corruption.
- Unauthorized administrative actions.

**23.55 Quality Gates**

The MVP should pass defined quality gates before deployment.

**Gate 1 — Functional**

Core features operate according to requirements.

**Gate 2 — Integration**

Modules communicate correctly.

**Gate 3 — Security**

No known critical security vulnerabilities remain.

**Gate 4 — Financial**

Payment and wallet calculations reconcile correctly.

**Gate 5 — Data**

Database integrity has been verified.

**Gate 6 — Performance**

Expected MVP workload can be handled satisfactorily.

**Gate 7 — User Acceptance**

Representative users can complete important workflows.

**Gate 8 — Release**

No unresolved critical defects remain.

**23.56 User Acceptance Testing**

User Acceptance Testing (UAT) shall verify that the completed MVP satisfies practical business requirements.

Representative users should test:

**Customer**

- Registration.
- Request creation.
- Quotation review.
- Driver selection.
- Payment.
- Trip tracking.
- Trip-start confirmation.
- Delivery confirmation.
- Trip history.

**Driver**

- Registration.
- Verification.
- Quotation.
- Assignment.
- Pickup.
- Inspection.
- Trip start.
- Delivery.
- Earnings.
- Withdrawal.

**Administrator**

- Driver verification.
- Trip monitoring.
- Payment monitoring.
- Dispute management.
- Financial review.
- Operational intervention.

**23.57 UAT Acceptance**

A workflow shall be considered accepted when the intended user can complete it successfully and the resulting system state matches the defined business requirements.

For example:

Customer selects driver

↓

Customer pays

↓

Payment verified

↓

BOOKED

The UAT should verify both:

**User experience**

and

**actual backend/database result**.

**23.58 Production Readiness Testing**

Before production deployment, the team shall confirm:

- Core tests pass.
- Critical APIs pass.
- Payment integration is verified.
- Wallet calculations reconcile.
- Database migrations work.
- Backups are functioning.
- Authentication works.
- Authorization works.
- Notifications work.
- Inspection uploads work.
- GPS tracking works.
- Error logging works.
- Audit logging works.
- Monitoring is available.
- Production environment variables are correctly configured.
- No test credentials remain active.

**23.59 Post-Deployment Verification**

Testing shall continue immediately after production deployment.

The team should perform controlled verification of:

- Login.
- User registration.
- Trip creation.
- Driver selection.
- Payment.
- Booking.
- Inspection.
- Trip start.
- GPS tracking.
- Delivery.
- Driver payment release.
- Notifications.

The purpose is to confirm that the production environment behaves like the tested environment.

**23.60 Regression After Deployment**

If a production defect is corrected, the affected functionality and related workflows shall be retested.

For example:

If a wallet-release defect is corrected:

Payment

↓

Booking

↓

Trip Active

↓

First Release

↓

Driver Wallet

↓

Completion

↓

Final Release

should all be retested.

This prevents a fix in one area from silently breaking another.

**23.61 Quality Monitoring**

After deployment, the system should monitor indicators such as:

- Failed payments.
- Failed API requests.
- Failed notifications.
- Failed uploads.
- GPS failures.
- Wallet inconsistencies.
- Database errors.
- Authentication failures.
- Critical application errors.
- Failed withdrawals.

These indicators can help identify problems before they become widespread.

**23.62 Testing Documentation**

The development team shall maintain appropriate testing documentation.

This may include:

- Test plans.
- Test cases.
- Test results.
- Defect reports.
- UAT results.
- Regression results.
- Security-test results.
- Performance-test results.
- Production verification results.

The documentation should allow developers to understand:

**What was tested → How it was tested → What happened → Whether it passed.**

**23.63 Testing Business Rules**

The most important CarGo Kenya business rules shall have dedicated test cases.

Examples include:

**Rule 1**

Customer must pay the full agreed trip cost before BOOKED.

**Rule 2**

Driver does not receive payment immediately after booking.

**Rule 3**

First 50% is released only at TRIP ACTIVE.

**Rule 4**

Final 50% is released only at COMPLETED.

**Rule 5**

Fuel budget is separate from driver earnings.

**Rule 6**

Driver cannot withdraw pending earnings.

**Rule 7**

Duplicate payment releases are prohibited.

**Rule 8**

Unauthorized users cannot access another user's trip.

**Rule 9**

Inspection evidence must remain associated with the relevant inspection.

**Rule 10**

Notifications must reflect actual system events.

These rules should be treated as high-priority acceptance tests.

**23.64 Complete MVP Testing Lifecycle**

The complete CarGo Kenya testing lifecycle shall be:

REQUIREMENT

↓

TEST CASE DESIGN

↓

UNIT TESTING

↓

INTEGRATION TESTING

↓

API TESTING

↓

SYSTEM TESTING

↓

SECURITY TESTING

↓

PERFORMANCE TESTING

↓

END-TO-END TESTING

↓

USER ACCEPTANCE TESTING

↓

DEFECT FIXING

↓

REGRESSION TESTING

↓

PRODUCTION READINESS

↓

DEPLOYMENT

↓

POST-DEPLOYMENT VERIFICATION

This ensures that testing is treated as a continuous development activity rather than something performed only at the end.

**23.65 MVP Testing Scope**

**Included in MVP**

The Testing and Quality Requirements shall include:

- Unit testing.
- Integration testing.
- API testing.
- System testing.
- End-to-end testing.
- User acceptance testing.
- Security testing.
- Performance testing.
- Regression testing.
- Authentication testing.
- Authorization testing.
- Payment testing.
- Wallet testing.
- Trip lifecycle testing.
- Vehicle inspection testing.
- GPS/tracking testing.
- Notification testing.
- Database integrity testing.
- Error-handling testing.
- Audit testing.
- Backup and recovery testing.
- Responsive/mobile testing.
- Poor-network testing.
- Idempotency testing.
- Concurrency testing.
- Defect tracking.
- Production-readiness testing.

**Not Required for MVP**

The following should remain future enhancements:

- Large-scale distributed load testing.
- Advanced chaos engineering.
- AI-based automated testing.
- Fully automated visual regression testing.
- Advanced predictive failure analysis.
- International compliance testing.
- Multi-region disaster-recovery testing.
- Complex financial certification.
- Large-scale penetration-testing programs beyond the MVP security assessment.

**23.66 Testing Business Rules Summary**

The following principles shall remain consistent throughout implementation:

**Rule 1**

Every critical business function must be testable.

**Rule 2**

Financial operations require dedicated testing.

**Rule 3**

Backend business rules must be tested independently of the frontend.

**Rule 4**

Trip-status transitions must be tested against their required conditions.

**Rule 5**

Duplicate financial operations must be prevented and tested.

**Rule 6**

Unauthorized operations must be rejected.

**Rule 7**

Critical database operations must preserve transaction integrity.

**Rule 8**

Inspection evidence must remain correctly associated with its inspection record.

**Rule 9**

Notifications must reflect successful underlying events.

**Rule 10**

Poor connectivity must not create duplicate or inconsistent transactions.

**Rule 11**

Critical defects must be resolved before production deployment.

**Rule 12**

Changes to existing functionality must undergo regression testing.

**23.67 Final Testing Architecture**

The CarGo Kenya testing architecture can therefore be understood as:

**REQUIREMENTS**

↓

**TEST CASES**

↓

┌─────────────────────────────┐  
**UNIT TESTING**  
└──────────────┬──────────────┘  
↓  
┌─────────────────────────────┐  
**INTEGRATION TESTING**  
└──────────────┬──────────────┘  
↓  
┌─────────────────────────────┐  
**API & SYSTEM TESTING**  
└──────────────┬──────────────┘  
↓  
┌─────────────────────────────┐  
**SECURITY & PERFORMANCE**  
└──────────────┬──────────────┘  
↓  
┌─────────────────────────────┐  
**END-TO-END TESTING**  
└──────────────┬──────────────┘  
↓  
┌─────────────────────────────┐  
**USER ACCEPTANCE TESTING**  
└──────────────┬──────────────┘  
↓  
**DEFECT FIXING**

↓

**REGRESSION TESTING**

↓

**PRODUCTION READINESS**

↓

**DEPLOYMENT**

↓

**POST-DEPLOYMENT VERIFICATION**

The objective is to ensure that the CarGo Kenya MVP is not only **functional**, but also **secure, reliable, consistent, testable, maintainable, and suitable for real operational use**.

**23.0 TESTING & QUALITY REQUIREMENTS**

**23.1 Purpose**

The Testing and Quality Requirements Module shall define how the CarGo Kenya system will be tested, validated, and verified before and during deployment.

The purpose of testing is to ensure that the system:

- Performs the required business functions correctly.
- Enforces the defined CarGo Kenya business rules.
- Protects customer, driver, administrator, and financial information.
- Maintains consistency between related modules.
- Prevents unauthorized operations.
- Handles errors safely.
- Maintains correct trip-status transitions.
- Maintains correct payment and wallet transactions.
- Correctly records vehicle inspection evidence.
- Provides reliable GPS and trip-tracking functionality.
- Sends accurate notifications.
- Performs adequately under expected MVP usage.
- Remains usable on supported devices.
- Does not introduce data corruption during normal or abnormal operations.

Testing shall therefore cover both individual system components and the complete CarGo Kenya transportation lifecycle.

**23.2 Testing Philosophy**

CarGo Kenya shall follow a layered testing approach.

Testing should not only ask:

"Does the button work?"

It should also verify:

"Does the underlying business operation occur correctly, securely, and consistently?"

For example, when a driver selects:

**START TRIP**

testing must verify more than the frontend response.

The system must verify:

Driver authorized?

↓

Pickup inspection completed?

↓

Vehicle handover completed?

↓

Required evidence captured?

↓

Fueling requirements satisfied?

↓

Customer confirmation received?

↓

Trip status changed to TRIP ACTIVE?

↓

50% driver release correctly calculated?

↓

Wallet transaction recorded?

↓

Notification generated?

A successful test therefore requires the entire underlying operation to remain consistent.

**23.3 Testing Objectives**

The testing process shall aim to verify that:

1.  Functional requirements have been implemented correctly.
2.  Business rules are enforced by the backend.
3.  Users can only perform authorized actions.
4.  Trip statuses transition correctly.
5.  Financial transactions are accurate.
6.  Wallet balances remain consistent.
7.  Inspection records remain complete and traceable.
8.  GPS and tracking functions operate correctly.
9.  Notifications correspond to actual system events.
10. APIs return correct responses.
11. Database constraints protect data integrity.
12. Errors are handled without corrupting system state.
13. The system performs adequately under expected load.
14. Security controls operate correctly.
15. The system remains usable across supported devices and browsers.

**23.4 Testing Levels**

The CarGo Kenya MVP shall use multiple levels of testing.

The main testing levels shall be:

1.  Unit Testing
2.  Integration Testing
3.  API Testing
4.  System Testing
5.  End-to-End Testing
6.  User Acceptance Testing
7.  Security Testing
8.  Performance Testing
9.  Usability Testing
10. Regression Testing

Each level addresses a different part of system quality.

**23.5 Unit Testing**

Unit testing shall verify individual functions, services, utilities, and components independently.

Examples include:

- Price calculation.
- Platform-fee calculation.
- Driver-fee calculation.
- Fuel-budget calculation.
- Payment-release calculation.
- Trip-status validation.
- Permission checks.
- Notification-template generation.
- Wallet-balance calculation.
- GPS-distance calculation where applicable.
- Input validation.

For example, if the driver fee is:

KSh 18,000

the first release should be:

KSh 9,000.

The calculation function should therefore be tested independently before being used by the payment service.

**23.6 Unit Testing Requirements**

Important backend business functions should have automated unit tests.

Tests should cover:

**Normal cases**

Valid information produces the expected result.

**Boundary cases**

Values at the allowed limits are handled correctly.

**Invalid cases**

Incorrect information is rejected.

**Exceptional cases**

Unexpected conditions are handled safely.

For example, the payment-release service should be tested for:

- Valid TRIP ACTIVE trip.
- Already released first payment.
- Missing inspection.
- Missing customer confirmation.
- Missing driver confirmation.
- Invalid trip.
- Unauthorized driver.
- Incorrect payment amount.
- Duplicate release request.

**23.7 Integration Testing**

Integration testing shall verify that different CarGo Kenya modules work correctly together.

Important integrations include:

Customer Request

↓

Quotation

↓

Driver Selection

↓

Payment

↓

Trip Wallet

↓

Vehicle Inspection

↓

Trip Start

↓

GPS Tracking

↓

Delivery

↓

Trip Completion

↓

Driver Wallet

↓

Withdrawal

The test should confirm that information passed between modules remains accurate.

**23.8 Payment Integration Testing**

The payment system shall receive dedicated integration testing.

Testing shall verify:

- Payment initiation.
- Payment-provider response.
- Successful payment.
- Failed payment.
- Pending payment.
- Duplicate callback.
- Invalid callback.
- Incorrect amount.
- Incorrect trip reference.
- Payment timeout.
- Refund.
- Partial refund.
- Payment reconciliation.

The system must not mark a trip as:

**BOOKED**

until the required payment has been successfully verified.

**23.9 Payment Release Testing**

The payment-release mechanism shall receive particularly strict testing because it directly affects driver funds.

**First release test**

Given:

Driver Fee = KSh 18,000

Trip Status = TRIP ACTIVE

Expected:

First Release = KSh 9,000.

The test must verify that:

- Exactly KSh 9,000 is released.
- The driver wallet receives KSh 9,000.
- The Trip Wallet records the release.
- The release cannot be repeated.
- A notification is generated only after successful recording.

**Final release test**

Given:

Driver Fee = KSh 18,000

First Release = KSh 9,000

Trip Status = COMPLETED

Expected:

Final Release = KSh 9,000.

Total Driver Earnings:

KSh 18,000.

**23.10 Trip Lifecycle Testing**

The complete trip-status lifecycle shall be tested.

The expected lifecycle is:

**REQUESTED**

↓

**QUOTING**

↓

**DRIVER SELECTED**

↓

**PAYMENT PENDING**

↓

**BOOKED**

↓

**PICKUP PENDING**

↓

**PICKUP INSPECTION**

↓

**TRIP START PENDING**

↓

**TRIP ACTIVE**

↓

**IN TRANSIT**

↓

**DELIVERY PENDING**

↓

**DELIVERED**

↓

**COMPLETED**

The system shall also support appropriate exceptional states such as:

- DISPUTED
- CANCELLED

Testing must verify that users cannot arbitrarily jump between statuses.

For example:

**BOOKED → COMPLETED**

should not be allowed unless the required intermediate conditions have been satisfied or an authorized administrative process explicitly permits the transition.

**23.11 Trip Status Transition Testing**

Each transition shall have its own test conditions.

Example:

**BOOKED → PICKUP PENDING**

Verify:

- Payment confirmed.
- Driver assigned.
- Trip booking valid.

**PICKUP PENDING → PICKUP INSPECTION**

Verify:

- Driver has reached the pickup process.
- Driver is authorized for the trip.

**PICKUP INSPECTION → TRIP START PENDING**

Verify:

- Inspection completed.
- Required evidence captured.
- Handover recorded.

**TRIP START PENDING → TRIP ACTIVE**

Verify:

- Driver selected START TRIP.
- Customer confirmed commencement.
- Required pickup procedures completed.

**DELIVERY PENDING → DELIVERED**

Verify:

- Delivery inspection completed.
- Handover completed.
- Required confirmations recorded.

**DELIVERED → COMPLETED**

Verify:

- Customer confirmation.
- Driver confirmation.
- Required completion conditions satisfied.

**23.12 Vehicle Inspection Testing**

Vehicle inspection functionality shall be tested at both pickup and delivery.

Testing shall verify that the system correctly records:

- Odometer reading.
- Fuel level.
- Vehicle condition.
- Damage observations.
- Inspection photographs.
- Inspection timestamp.
- Inspector/driver identity.
- Pickup or delivery inspection type.
- Customer confirmation where required.
- Handover confirmation.

The system should not mark an inspection as complete if mandatory information is missing.

**23.13 Inspection Evidence Testing**

Testing shall verify that inspection evidence:

- Is associated with the correct trip.
- Is associated with the correct inspection.
- Cannot be incorrectly attached to another trip.
- Is accessible only to authorized users.
- Retains the correct timestamp.
- Cannot be silently replaced without appropriate recordkeeping.
- Remains available for dispute investigation.

The test should also verify that ordinary chat images are not incorrectly treated as official inspection evidence.

**23.14 GPS and Tracking Testing**

GPS functionality shall be tested under different conditions.

Tests should include:

- GPS available.
- GPS temporarily unavailable.
- Poor network connectivity.
- Driver moving.
- Driver stationary.
- Location update received.
- Location update delayed.
- Tracking resumed after interruption.
- Invalid location data.
- Unauthorized access to tracking information.

A temporary GPS failure should not automatically change:

**TRIP ACTIVE**

to:

**CANCELLED**

or:

**COMPLETED**.

**23.15 Notification Testing**

Notification testing shall verify that notifications correspond to actual system events.

Examples:

Payment verified

↓

Payment notification.

Trip booked

↓

Booking notification.

Driver selects START TRIP

↓

Customer receives confirmation request.

Customer confirms

↓

TRIP ACTIVE notification.

First payment released

↓

Driver earnings notification.

Trip completed

↓

Completion notification.

Testing must also verify that duplicate events do not unnecessarily generate duplicate notifications.

**23.16 Communication Testing**

Customer-driver communication shall be tested to ensure that:

- Authorized users can send messages.
- Unauthorized users cannot access messages.
- Messages are associated with the correct trip.
- Messages cannot be accessed through another user's trip ID.
- Message status is correctly recorded.
- Failed messages are recorded.
- Attachments, where supported, are properly associated.
- Communication remains available after the relevant booking where required.

**23.17 API Testing**

All important backend APIs shall be tested independently.

API testing shall verify:

- Request validation.
- Authentication.
- Authorization.
- Required fields.
- Response status codes.
- Response structure.
- Error responses.
- Database changes.
- Business-rule enforcement.
- Duplicate-request handling.

For example:

POST /payment/release

must not release funds merely because a valid request was received.

The backend must independently verify the trip's eligibility.

**23.18 Authentication Testing**

Authentication functionality shall be tested for:

- Valid login.
- Invalid password.
- Invalid email/phone.
- Expired session/token.
- Invalid token.
- Logout.
- Password reset.
- Account verification.
- Suspended account.
- Unauthorized API access.

The system must reject protected requests from unauthenticated users.

**23.19 Authorization and Role Testing**

Role-based access control shall be tested for:

**Customer**

Should access:

- Own requests.
- Own trips.
- Own payments.
- Own notifications.
- Authorized trip communication.

**Driver**

Should access:

- Eligible requests.
- Assigned trips.
- Own inspections.
- Own earnings.
- Own wallet.
- Authorized communication.

**Administrator**

Should access:

- Authorized operational management functions.
- Verification processes.
- Dispute management.
- Financial review.
- System monitoring.

Tests should specifically attempt unauthorized actions.

For example:

A customer attempting to access another customer's trip should receive an authorization failure.

**23.20 Database Testing**

Database testing shall verify:

- Required fields.
- Foreign-key relationships.
- Unique constraints.
- Status values.
- Transaction integrity.
- Cascade/restriction rules.
- Indexes.
- Duplicate prevention.
- Timestamp consistency.

For example, a payment transaction should not reference a nonexistent trip.

**23.21 Transaction Integrity Testing**

Financial and critical operations should be tested as atomic transactions where appropriate.

For example:

First Driver Release

↓

Create wallet transaction

↓

Update applicable balance

↓

Record release

↓

Commit transaction

If a critical database operation fails, the system should avoid a partial financial update.

The test should deliberately introduce failure conditions to confirm that the database does not become inconsistent.

**23.22 Wallet Reconciliation Testing**

The system shall test whether:

**Trip Financial Records = Wallet Transactions = Released Amounts**

For example:

Driver Fee:

KSh 18,000

First Release:

KSh 9,000

Final Release:

KSh 9,000

Total Released:

KSh 18,000

The system should identify inconsistencies such as:

- KSh 27,000 released from an KSh 18,000 driver fee.
- First release recorded twice.
- Final release recorded before completion.
- Wallet balance not matching transaction history.

**23.23 Refund Testing**

Refund testing shall cover:

- Full refund.
- Partial refund.
- Failed refund.
- Duplicate refund request.
- Refund exceeding original payment.
- Refund after driver release.
- Refund during dispute.
- Refund confirmation.

The system must not allow an unauthorized user to create arbitrary refunds.

**23.24 Cancellation Testing**

Cancellation scenarios shall be tested at different stages.

Examples:

**Before driver selection**

Cancellation should follow the appropriate request rules.

**After driver selection**

The system should apply the applicable cancellation process.

**After payment**

Financial consequences must be correctly recorded.

**After TRIP ACTIVE**

Cancellation should not simply behave like a pre-trip cancellation.

**During dispute**

The system should preserve relevant financial and operational records.

**23.25 Dispute Testing**

The dispute system shall be tested for:

- Dispute creation.
- Evidence submission.
- Customer dispute.
- Driver dispute.
- Administrator review.
- Status changes.
- Financial protection.
- Resolution.
- Adjustment.
- Notifications.

The test must confirm that disputed funds are handled according to the defined business rules.

**23.26 Security Testing**

Security testing shall verify that the application cannot easily be manipulated through unauthorized requests.

Testing shall include:

- Authentication bypass attempts.
- Authorization bypass attempts.
- Invalid token testing.
- Input manipulation.
- SQL injection testing.
- Cross-site scripting testing.
- Malicious file upload testing.
- API abuse testing.
- Rate-limit testing where implemented.
- Sensitive-data exposure testing.
- Session/token security testing.

Financial endpoints shall receive additional security testing.

**23.27 Input Validation Testing**

All user-controlled input shall be tested.

Examples include:

- Names.
- Phone numbers.
- Email addresses.
- Pickup locations.
- Destination.
- Vehicle details.
- Quotation amounts.
- Fuel amounts.
- Odometer readings.
- Messages.
- Payment references.
- Withdrawal amounts.

The system should reject:

- Missing required values.
- Invalid formats.
- Negative financial values where prohibited.
- Impossible odometer values.
- Invalid status values.
- Oversized uploads.
- Unsupported file types.

**23.28 File Upload Testing**

Vehicle inspection photographs and other supported uploads shall be tested for:

- Valid file type.
- Invalid file type.
- File size.
- Multiple uploads.
- Duplicate uploads.
- Corrupted files.
- Unauthorized access.
- Storage failure.
- Upload interruption.

The system should never trust a filename or client-provided file type alone when determining whether a file is safe.

**23.29 Performance Testing**

Performance testing shall determine whether the system responds adequately under expected MVP usage.

Important areas include:

- Login.
- Dashboard loading.
- Trip search.
- Quotation submission.
- Payment processing.
- Notification retrieval.
- GPS updates.
- Inspection uploads.
- Wallet queries.
- Administrator dashboards.

The objective is to identify slow operations before production deployment.

**23.30 Load Testing**

Load testing shall simulate multiple users interacting with the system.

Examples include:

- Multiple customers creating requests.
- Multiple drivers submitting quotations.
- Multiple customers making payments.
- Multiple drivers updating trip status.
- Multiple GPS updates.
- Multiple notifications.
- Multiple administrators reviewing trips.

The test should identify:

- Database bottlenecks.
- API bottlenecks.
- Memory problems.
- Excessive CPU usage.
- Slow queries.
- Connection-pool exhaustion.

**23.31 Stress Testing**

Stress testing shall determine how the system behaves beyond its expected normal operating conditions.

The system should be tested with unusually high:

- API requests.
- Concurrent users.
- GPS updates.
- File uploads.
- Notification events.
- Payment callbacks.

The objective is not necessarily to make the system remain fully operational under unlimited load.

Instead, testing should determine whether the system:

- Fails gracefully.
- Protects data.
- Recovers correctly.
- Avoids corruption.
- Provides useful error responses.

**23.32 Usability Testing**

Usability testing shall verify that customers, drivers, and administrators can understand and operate the system.

The following workflows should be tested with representative users:

**Customer**

Create request

↓

Review quotations

↓

Select driver

↓

Make payment

↓

Monitor trip

↓

Confirm trip start

↓

Confirm delivery

↓

View trip history

**Driver**

Register

↓

Complete verification

↓

View requests

↓

Submit quotation

↓

Accept assignment

↓

Complete pickup inspection

↓

Start trip

↓

Track trip

↓

Complete delivery

↓

View earnings

↓

Request withdrawal

**Administrator**

Review users

↓

Verify drivers

↓

Monitor trips

↓

Review disputes

↓

Review payments

↓

Manage operational issues

The objective is to identify confusing screens, unclear terminology, missing information, and unnecessary steps.

**23.33 Mobile and Responsive Testing**

Because customers and drivers may primarily use mobile devices, the MVP shall be tested across different screen sizes.

Testing should include:

- Mobile phones.
- Tablets where supported.
- Desktop browsers.

Important interfaces include:

- Login.
- Trip creation.
- Quotation interface.
- Driver trip interface.
- Inspection interface.
- GPS tracking.
- Wallet.
- Notifications.
- Communication.

**23.34 Browser Compatibility Testing**

The MVP should be tested on the supported modern browsers.

At minimum, testing should consider:

- Google Chrome.
- Microsoft Edge.
- Mozilla Firefox.
- Safari where applicable.

The exact supported browser matrix should be documented before production release.

**23.35 Offline and Poor-Network Testing**

Because transportation operations may occur in areas with unstable connectivity, the system should be tested under poor network conditions.

Tests should include:

- Temporary network loss.
- Slow network.
- Intermittent connectivity.
- Request timeout.
- Duplicate request caused by retry.
- GPS interruption.
- Inspection upload interruption.
- Payment callback delay.

The system should avoid creating duplicate records when a user retries an operation after a timeout.

**23.36 Recovery Testing**

The system shall be tested for recovery from failures.

Examples include:

- Server restart.
- Database connection loss.
- Payment provider interruption.
- Notification-service failure.
- GPS service interruption.
- File-storage failure.

The system should recover without losing critical records.

Financial transactions require particular attention during recovery.

**23.37 Backup and Restore Testing**

Database backup procedures shall be tested periodically.

Testing shall verify that:

- Backups are created.
- Backups are readable.
- Backups contain required data.
- Restoration is possible.
- Restored data remains consistent.
- Financial records remain intact.

A backup that cannot be successfully restored should not be treated as a reliable backup.

**23.38 Regression Testing**

Whenever an important feature is changed, previously working functionality shall be retested.

For example, if the Payment Module is modified, regression testing should include:

- Driver selection.
- Payment.
- Booking.
- Trip Wallet.
- Trip Active.
- First driver release.
- Driver wallet.
- Completion.
- Final driver release.
- Notifications.

This is necessary because changes in one module can affect other modules.

**23.39 End-to-End Testing**

The complete CarGo Kenya transportation process shall be tested from beginning to end.

A primary MVP end-to-end test should follow:

Customer Registration

↓

Transportation Request

↓

Driver Quotations

↓

Customer Selects Driver

↓

Price Confirmation

↓

Customer Payment

↓

Payment Verification

↓

BOOKED

↓

Pickup

↓

Vehicle Inspection

↓

Vehicle Handover

↓

Trip Start

↓

Customer Confirmation

↓

TRIP ACTIVE

↓

50% Driver Release

↓

IN TRANSIT

↓

Destination

↓

Delivery Inspection

↓

Customer Confirmation

↓

Driver Confirmation

↓

COMPLETED

↓

Final 50% Driver Release

↓

Driver Wallet

↓

Withdrawal

Every stage must produce the expected system state.

**23.40 Negative Testing**

The system shall also be tested by deliberately providing invalid or unauthorized actions.

Examples include:

- Customer attempts to select an unavailable driver.
- Driver attempts to quote on an unauthorized request.
- Driver attempts to start a trip without inspection.
- Customer attempts to confirm a nonexistent trip.
- Driver attempts to release money manually.
- Driver attempts to withdraw pending earnings.
- Customer attempts to access another customer's trip.
- User submits invalid payment information.
- Duplicate payment callback is received.
- Duplicate wallet release request is received.

The expected result should be safe rejection rather than unexpected system behavior.

**23.41 Boundary Testing**

Boundary values shall be tested.

Examples include:

- Minimum quotation.
- Maximum quotation.
- Minimum fuel budget.
- Maximum permitted file size.
- Maximum message length.
- Minimum withdrawal amount.
- Maximum withdrawal amount.
- Empty required field.
- Maximum permitted characters.
- Maximum number of inspection photographs.

Boundary testing helps identify errors that may not appear during normal use.

**23.42 Concurrency Testing**

The system shall be tested when multiple users perform operations simultaneously.

Examples:

Two customers attempting to select the same driver.

↓

Two payment callbacks arriving simultaneously.

↓

Two requests attempting the same wallet release.

↓

Driver and customer updating the same trip at nearly the same time.

↓

Two administrators modifying the same dispute.

The backend must use appropriate transaction and concurrency controls to prevent inconsistent states.

**23.43 Idempotency Testing**

Important operations shall be tested for idempotency.

Examples include:

- Payment confirmation.
- Payment callback processing.
- Wallet release.
- Refund processing.
- Withdrawal processing.
- Notification generation.

If the same request is received twice, the system should not create duplicate financial or operational records.

**23.44 Audit Testing**

Audit records shall be tested to verify that important actions are correctly recorded.

Examples:

- Driver verification.
- Payment confirmation.
- First payment release.
- Final payment release.
- Refund.
- Cancellation.
- Dispute resolution.
- Administrative adjustment.
- Account suspension.

The test should verify:

- Actor.
- Action.
- Date/time.
- Related record.
- Relevant status.
- Transaction reference where applicable.

**23.45 Data Integrity Testing**

The system shall verify that related data remains consistent.

Examples:

A trip must reference a valid customer.

↓

A selected driver must exist.

↓

A payment must reference the correct trip.

↓

A Trip Wallet must reference the correct trip.

↓

A driver release must reference the correct wallet and trip.

↓

A driver wallet transaction must reference the correct driver.

This prevents orphaned and incorrectly associated records.

**23.46 Notification and Transaction Consistency Testing**

Critical notifications shall only be generated after the underlying event has succeeded.

For example:

Payment

↓

Payment Verified

↓

Trip Updated

↓

Wallet Updated

↓

Notification

If wallet release fails:

**No successful payment-release notification should be sent.**

Similarly:

If payment fails:

**No successful-payment notification should be sent.**

**23.47 Test Data Requirements**

Testing shall use controlled test data.

Test data should include:

- Test customers.
- Test drivers.
- Test administrators.
- Test vehicles.
- Test trips.
- Test quotations.
- Test payments.
- Test wallet transactions.
- Test inspection records.
- Test disputes.
- Test notifications.

Production customer or financial information should not be used unnecessarily for testing.

**23.48 Test Environment**

The development team should maintain a testing environment that is separated from production.

The testing environment should ideally contain:

- Test database.
- Test payment configuration.
- Test notification configuration.
- Test file storage.
- Test API credentials.
- Test user accounts.

Production credentials should never be casually used during development testing.

**23.49 Test Case Structure**

Each important test case should document:

| **Field** | **Description** |
| --- | --- |
| Test Case ID | Unique test identifier |
| Module | System module being tested |
| Feature | Specific feature |
| Preconditions | Conditions required before testing |
| Test Steps | Actions to perform |
| Test Data | Data used |
| Expected Result | Expected system behavior |
| Actual Result | Observed behavior |
| Status | Pass/Fail |
| Tester | Person conducting test |
| Date | Test date |
| Notes | Additional information |

This will make testing repeatable and traceable.

**23.50 Example Test Case**

**Test Case ID**

PAY-001

**Feature**

First Driver Payment Release

**Preconditions**

- Valid trip exists.
- Driver is assigned.
- Customer payment is confirmed.
- Pickup inspection is complete.
- Vehicle handover is complete.
- Driver has selected START TRIP.
- Customer has confirmed trip commencement.
- Trip status is TRIP ACTIVE.
- Driver fee is KSh 18,000.

**Test Steps**

1.  Request first driver payment release.
2.  Backend validates trip conditions.
3.  Backend calculates permitted release.
4.  Wallet transaction is created.
5.  Driver wallet is updated.
6.  Notification is generated.

**Expected Result**

KSh 9,000 is released to the driver's available wallet balance.

No additional amount is released.

The release cannot be repeated.

**23.51 Acceptance Criteria**

A feature shall not be considered complete merely because the code has been implemented.

A feature should satisfy:

1.  Functional requirements.
2.  Business rules.
3.  Security requirements.
4.  Data-integrity requirements.
5.  Usability requirements.
6.  Relevant performance requirements.
7.  Relevant error-handling requirements.
8.  Required audit requirements.
9.  Required notification behavior.
10. Relevant integration requirements.

**23.52 Definition of Done**

For the CarGo Kenya MVP, a development task should generally be considered complete when:

- Required functionality is implemented.
- Backend validation is implemented.
- Database changes are complete.
- API behavior is tested.
- Relevant frontend behavior is tested.
- Error handling is implemented.
- Authorization is verified.
- Unit tests pass where applicable.
- Integration tests pass where applicable.
- Regression testing has been completed.
- Documentation has been updated.
- No critical unresolved defects remain.

**23.53 Defect Classification**

Discovered defects should be classified according to severity.

**Critical**

Prevents a core business process or causes serious financial/security/data-integrity problems.

Examples:

- Duplicate driver payment.
- Unauthorized wallet withdrawal.
- Customer payment recorded incorrectly.
- Unauthorized access to another customer's trip.

**High**

Major functionality is unavailable or significantly incorrect.

Examples:

- Customer cannot complete payment.
- Driver cannot start an assigned trip.
- Vehicle inspection cannot be completed.

**Medium**

Important functionality is affected but a workaround exists.

**Low**

Minor usability or presentation issue.

Examples:

- Incorrect spacing.
- Minor wording issue.
- Non-critical visual inconsistency.

**23.54 Critical Defect Rules**

Critical defects shall be resolved before production deployment.

Particular attention shall be given to defects involving:

- Money.
- Authentication.
- Authorization.
- Personal information.
- Trip-status integrity.
- Inspection evidence.
- Duplicate transactions.
- Database corruption.
- Unauthorized administrative actions.

**23.55 Quality Gates**

The MVP should pass defined quality gates before deployment.

**Gate 1 — Functional**

Core features operate according to requirements.

**Gate 2 — Integration**

Modules communicate correctly.

**Gate 3 — Security**

No known critical security vulnerabilities remain.

**Gate 4 — Financial**

Payment and wallet calculations reconcile correctly.

**Gate 5 — Data**

Database integrity has been verified.

**Gate 6 — Performance**

Expected MVP workload can be handled satisfactorily.

**Gate 7 — User Acceptance**

Representative users can complete important workflows.

**Gate 8 — Release**

No unresolved critical defects remain.

**23.56 User Acceptance Testing**

User Acceptance Testing (UAT) shall verify that the completed MVP satisfies practical business requirements.

Representative users should test:

**Customer**

- Registration.
- Request creation.
- Quotation review.
- Driver selection.
- Payment.
- Trip tracking.
- Trip-start confirmation.
- Delivery confirmation.
- Trip history.

**Driver**

- Registration.
- Verification.
- Quotation.
- Assignment.
- Pickup.
- Inspection.
- Trip start.
- Delivery.
- Earnings.
- Withdrawal.

**Administrator**

- Driver verification.
- Trip monitoring.
- Payment monitoring.
- Dispute management.
- Financial review.
- Operational intervention.

**23.57 UAT Acceptance**

A workflow shall be considered accepted when the intended user can complete it successfully and the resulting system state matches the defined business requirements.

For example:

Customer selects driver

↓

Customer pays

↓

Payment verified

↓

BOOKED

The UAT should verify both:

**User experience**

and

**actual backend/database result**.

**23.58 Production Readiness Testing**

Before production deployment, the team shall confirm:

- Core tests pass.
- Critical APIs pass.
- Payment integration is verified.
- Wallet calculations reconcile.
- Database migrations work.
- Backups are functioning.
- Authentication works.
- Authorization works.
- Notifications work.
- Inspection uploads work.
- GPS tracking works.
- Error logging works.
- Audit logging works.
- Monitoring is available.
- Production environment variables are correctly configured.
- No test credentials remain active.

**23.59 Post-Deployment Verification**

Testing shall continue immediately after production deployment.

The team should perform controlled verification of:

- Login.
- User registration.
- Trip creation.
- Driver selection.
- Payment.
- Booking.
- Inspection.
- Trip start.
- GPS tracking.
- Delivery.
- Driver payment release.
- Notifications.

The purpose is to confirm that the production environment behaves like the tested environment.

**23.60 Regression After Deployment**

If a production defect is corrected, the affected functionality and related workflows shall be retested.

For example:

If a wallet-release defect is corrected:

Payment

↓

Booking

↓

Trip Active

↓

First Release

↓

Driver Wallet

↓

Completion

↓

Final Release

should all be retested.

This prevents a fix in one area from silently breaking another.

**23.61 Quality Monitoring**

After deployment, the system should monitor indicators such as:

- Failed payments.
- Failed API requests.
- Failed notifications.
- Failed uploads.
- GPS failures.
- Wallet inconsistencies.
- Database errors.
- Authentication failures.
- Critical application errors.
- Failed withdrawals.

These indicators can help identify problems before they become widespread.

**23.62 Testing Documentation**

The development team shall maintain appropriate testing documentation.

This may include:

- Test plans.
- Test cases.
- Test results.
- Defect reports.
- UAT results.
- Regression results.
- Security-test results.
- Performance-test results.
- Production verification results.

The documentation should allow developers to understand:

**What was tested → How it was tested → What happened → Whether it passed.**

**23.63 Testing Business Rules**

The most important CarGo Kenya business rules shall have dedicated test cases.

Examples include:

**Rule 1**

Customer must pay the full agreed trip cost before BOOKED.

**Rule 2**

Driver does not receive payment immediately after booking.

**Rule 3**

First 50% is released only at TRIP ACTIVE.

**Rule 4**

Final 50% is released only at COMPLETED.

**Rule 5**

Fuel budget is separate from driver earnings.

**Rule 6**

Driver cannot withdraw pending earnings.

**Rule 7**

Duplicate payment releases are prohibited.

**Rule 8**

Unauthorized users cannot access another user's trip.

**Rule 9**

Inspection evidence must remain associated with the relevant inspection.

**Rule 10**

Notifications must reflect actual system events.

These rules should be treated as high-priority acceptance tests.

**23.64 Complete MVP Testing Lifecycle**

The complete CarGo Kenya testing lifecycle shall be:

REQUIREMENT

↓

TEST CASE DESIGN

↓

UNIT TESTING

↓

INTEGRATION TESTING

↓

API TESTING

↓

SYSTEM TESTING

↓

SECURITY TESTING

↓

PERFORMANCE TESTING

↓

END-TO-END TESTING

↓

USER ACCEPTANCE TESTING

↓

DEFECT FIXING

↓

REGRESSION TESTING

↓

PRODUCTION READINESS

↓

DEPLOYMENT

↓

POST-DEPLOYMENT VERIFICATION

This ensures that testing is treated as a continuous development activity rather than something performed only at the end.

**23.65 MVP Testing Scope**

**Included in MVP**

The Testing and Quality Requirements shall include:

- Unit testing.
- Integration testing.
- API testing.
- System testing.
- End-to-end testing.
- User acceptance testing.
- Security testing.
- Performance testing.
- Regression testing.
- Authentication testing.
- Authorization testing.
- Payment testing.
- Wallet testing.
- Trip lifecycle testing.
- Vehicle inspection testing.
- GPS/tracking testing.
- Notification testing.
- Database integrity testing.
- Error-handling testing.
- Audit testing.
- Backup and recovery testing.
- Responsive/mobile testing.
- Poor-network testing.
- Idempotency testing.
- Concurrency testing.
- Defect tracking.
- Production-readiness testing.

**Not Required for MVP**

The following should remain future enhancements:

- Large-scale distributed load testing.
- Advanced chaos engineering.
- AI-based automated testing.
- Fully automated visual regression testing.
- Advanced predictive failure analysis.
- International compliance testing.
- Multi-region disaster-recovery testing.
- Complex financial certification.
- Large-scale penetration-testing programs beyond the MVP security assessment.

**23.66 Testing Business Rules Summary**

The following principles shall remain consistent throughout implementation:

**Rule 1**

Every critical business function must be testable.

**Rule 2**

Financial operations require dedicated testing.

**Rule 3**

Backend business rules must be tested independently of the frontend.

**Rule 4**

Trip-status transitions must be tested against their required conditions.

**Rule 5**

Duplicate financial operations must be prevented and tested.

**Rule 6**

Unauthorized operations must be rejected.

**Rule 7**

Critical database operations must preserve transaction integrity.

**Rule 8**

Inspection evidence must remain correctly associated with its inspection record.

**Rule 9**

Notifications must reflect successful underlying events.

**Rule 10**

Poor connectivity must not create duplicate or inconsistent transactions.

**Rule 11**

Critical defects must be resolved before production deployment.

**Rule 12**

Changes to existing functionality must undergo regression testing.

**23.67 Final Testing Architecture**

The CarGo Kenya testing architecture can therefore be understood as:

**REQUIREMENTS**

↓

**TEST CASES**

↓

┌─────────────────────────────┐  
**UNIT TESTING**  
└──────────────┬──────────────┘  
↓  
┌─────────────────────────────┐  
**INTEGRATION TESTING**  
└──────────────┬──────────────┘  
↓  
┌─────────────────────────────┐  
**API & SYSTEM TESTING**  
└──────────────┬──────────────┘  
↓  
┌─────────────────────────────┐  
**SECURITY & PERFORMANCE**  
└──────────────┬──────────────┘  
↓  
┌─────────────────────────────┐  
**END-TO-END TESTING**  
└──────────────┬──────────────┘  
↓  
┌─────────────────────────────┐  
**USER ACCEPTANCE TESTING**  
└──────────────┬──────────────┘  
↓  
**DEFECT FIXING**

↓

**REGRESSION TESTING**

↓

**PRODUCTION READINESS**

↓

**DEPLOYMENT**

↓

**POST-DEPLOYMENT VERIFICATION**

The objective is to ensure that the CarGo Kenya MVP is not only **functional**, but also **secure, reliable, consistent, testable, maintainable, and suitable for real operational use**.

**24.0 DEPLOYMENT, HOSTING AND MAINTENANCE**

**24.1 Purpose**

The Deployment, Hosting and Maintenance Module shall define how the CarGo Kenya system is prepared, deployed, configured, operated, monitored, updated, backed up, and maintained after development.

The purpose of this module is to ensure that the CarGo Kenya platform can move from the development environment into a reliable production environment without compromising:

- System availability.
- Data integrity.
- Security.
- Performance.
- Payment processing.
- GPS and trip operations.
- Vehicle inspection evidence.
- User authentication.
- Database reliability.
- Financial records.
- Audit records.
- Notification services.

The deployment architecture shall support the operational requirements of the CarGo Kenya MVP while remaining simple enough for the development team to manage.

The MVP deployment should avoid unnecessary infrastructure complexity. The system should use a practical architecture that can later be scaled as the number of customers, drivers, trips, payments, photographs, and tracking records increases.

**24.2 Deployment Philosophy**

The CarGo Kenya deployment approach shall follow the principle:

**Develop safely → Test thoroughly → Deploy predictably → Monitor continuously → Maintain systematically.**

The production environment shall not be treated as an extension of the developer's local computer.

The system should therefore maintain clear separation between:

1.  Development Environment.
2.  Testing/Staging Environment.
3.  Production Environment.

Conceptually:

DEVELOPMENT

↓

Code Changes

↓

TESTING

↓

Validation

↓

STAGING

↓

Final Verification

↓

PRODUCTION

This separation reduces the risk of unfinished or incorrectly tested functionality being deployed directly to real customers and drivers.

**24.3 Deployment Environments**

The MVP should use at least the following environments.

**Development Environment**

Used by developers while building and modifying the system.

It may contain:

- Local application server.
- Local or development database.
- Development API configuration.
- Test payment credentials.
- Test notification services.
- Sample users.
- Sample trips.
- Sample inspection records.

Development data should not be treated as production data.

**Staging/Test Environment**

Used to test the application in an environment that closely resembles production.

It should be used for:

- Integration testing.
- Payment testing.
- Notification testing.
- Database migration testing.
- Deployment testing.
- Security testing.
- User acceptance testing.
- Regression testing.

**Production Environment**

Used by actual CarGo Kenya customers, drivers, administrators, and operational staff.

Production shall contain:

- Live application.
- Production database.
- Production authentication configuration.
- Production payment integration.
- Production notification services.
- Production file storage.
- Production monitoring.
- Production backups.

**24.4 Environment Separation**

The system shall ensure that development, staging, and production environments are logically separated.

The following should not be shared unnecessarily between environments:

- Database.
- Authentication secrets.
- Payment credentials.
- API keys.
- File storage.
- JWT secrets.
- Encryption keys.
- Production user information.

For example:

DEVELOPMENT

Database → cargokenya_dev

STAGING

Database → cargokenya_staging

PRODUCTION

Database → cargokenya_production

A developer testing a new feature must not accidentally modify the production database.

**24.5 Production Architecture**

The initial CarGo Kenya production architecture may be structured as:

INTERNET

│

↓

DOMAIN / HTTPS

│

↓

WEB APPLICATION

│

↓

BACKEND API SERVER

│

┌─────────────┼─────────────┐

↓ ↓ ↓

DATABASE FILE STORAGE EXTERNAL APIs

│ │ │

│ │ ┌─────┼─────┐

│ │ ↓ ↓ ↓

│ │ PAYMENT GPS SMS/EMAIL

│ │

└─────────────┴───────────────┐

↓

MONITORING

The exact hosting provider may be selected during implementation based on:

- Cost.
- Reliability.
- Database support.
- Storage requirements.
- Geographic availability.
- Scalability.
- Developer familiarity.
- Backup facilities.
- Security capabilities.

**24.6 Domain and HTTPS**

The production CarGo Kenya system shall use a properly configured domain.

For example:

www.cargokenya.example

api.cargokenya.example

The exact domain shall be determined during deployment.

The production system shall use HTTPS.

HTTPS is required because the system will handle:

- User credentials.
- Personal information.
- Trip information.
- Payment information.
- Driver information.
- Vehicle information.
- GPS-related information.
- Communication.
- Authentication tokens.

The application should redirect insecure HTTP requests to HTTPS where appropriate.

**24.7 SSL/TLS Certificates**

The production environment shall use a valid SSL/TLS certificate.

The deployment configuration should ensure that:

- Certificates are valid.
- Certificates are renewed before expiration.
- HTTPS is enabled for the web application.
- HTTPS is enabled for API communication.
- Sensitive information is never transmitted through unencrypted HTTP.

The development team should monitor certificate expiration to prevent unexpected production outages.

**24.8 Backend Deployment**

The CarGo Kenya backend shall be deployed as a production application separate from the frontend where appropriate.

The backend shall provide:

- Authentication.
- Authorization.
- Trip management.
- Driver management.
- Customer management.
- Vehicle inspection operations.
- Payment operations.
- Wallet operations.
- Notification operations.
- GPS/tracking APIs.
- Reporting APIs.
- Administrative APIs.

The backend shall run using a production-grade process rather than a development server.

**24.9 Frontend Deployment**

The frontend shall be deployed using an appropriate production hosting environment.

The production frontend should:

- Use the production API endpoint.
- Use HTTPS.
- Load environment-specific configuration.
- Avoid exposing private backend secrets.
- Use optimized production assets.
- Handle API failures gracefully.
- Support responsive layouts.
- Provide appropriate loading and error states.

The frontend must never contain sensitive credentials such as:

- Payment provider secret keys.
- Database credentials.
- JWT signing secrets.
- Private API keys.
- Administrative secrets.

**24.10 Database Deployment**

The production database shall be deployed using a reliable database service.

The database shall contain the operational information required by the CarGo Kenya system, including:

- Users.
- Customers.
- Drivers.
- Vehicles.
- Driver verification records.
- Transportation requests.
- Quotations.
- Trips.
- Inspection records.
- Inspection photographs metadata.
- GPS/tracking records.
- Payments.
- Trip Wallet transactions.
- Driver Wallet transactions.
- Notifications.
- Communication records.
- Ratings.
- Disputes.
- Audit records.

The production database shall not be directly exposed to the public internet unless technically required and properly secured.

**24.11 Database Migrations**

Changes to the database structure shall be managed through controlled database migrations.

Examples include:

- Creating a new table.
- Adding a column.
- Adding an index.
- Modifying a constraint.
- Creating a relationship.
- Changing an enumeration.
- Adding a new status.

The developer should not manually modify production database structures without recording the change.

The preferred process shall be:

Database Change Required

↓

Migration Created

↓

Migration Tested

↓

Migration Applied to Staging

↓

Staging Verified

↓

Migration Applied to Production

**24.12 Database Backup**

The production database shall be backed up regularly.

Backups shall protect against:

- Accidental deletion.
- Database corruption.
- Application errors.
- Infrastructure failure.
- Security incidents.
- Failed migrations.
- Operational mistakes.

The backup strategy should include automated backups where supported by the selected hosting provider.

**24.13 Backup Frequency**

The exact backup frequency shall be determined during implementation based on the hosting environment and operational requirements.

For the MVP, the system should preferably support:

- Regular automated database backups.
- Retention of multiple backup points.
- Periodic backup verification.
- Secure backup storage.

Financial and operational data should receive particular attention because losing payment or trip records could affect customers, drivers, and CarGo Kenya.

**24.14 Backup Restoration Testing**

Creating backups is not sufficient.

The development/operations team shall periodically verify that backups can actually be restored.

The process should be:

Backup Created

↓

Backup Stored

↓

Restore Test

↓

Database Recovered

↓

Data Integrity Checked

A backup that cannot be restored should not be considered a reliable backup.

**24.15 File and Image Storage**

The CarGo Kenya system will generate files such as:

- Driver verification documents.
- Vehicle photographs.
- Pickup inspection photographs.
- Delivery inspection photographs.
- Supporting evidence.
- Receipts where applicable.

These files should preferably be stored using dedicated file/object storage rather than directly inside the primary database.

The database should store metadata such as:

- File ID.
- Trip ID.
- Inspection ID.
- File type.
- Storage reference.
- Upload date.
- Uploader.
- File status.

Conceptually:

DATABASE

│

└── File Metadata

│

↓

OBJECT STORAGE

│

└── Actual File

**24.16 File Storage Security**

Inspection photographs and documents may contain sensitive operational information.

The storage system shall therefore restrict unauthorized access.

The application should avoid exposing permanent unrestricted file URLs where sensitive evidence is involved.

Access should preferably be controlled through:

- Authentication.
- Authorization.
- Signed URLs where appropriate.
- Access expiration.
- File ownership validation.

For example:

User Requests Inspection Image

↓

Authenticate User

↓

Verify Trip Access

↓

Verify Inspection Access

↓

Generate Authorized Access

↓

Return Image

**24.17 Environment Variables**

Environment-specific configuration shall be stored securely.

Examples include:

DATABASE_URL

JWT_SECRET

PAYMENT_API_KEY

PAYMENT_SECRET

SMS_API_KEY

EMAIL_API_KEY

STORAGE_ACCESS_KEY

STORAGE_SECRET

GPS_SERVICE_KEY

Sensitive environment variables shall not be committed to public source-control repositories.

The project should use an environment configuration mechanism appropriate for the selected deployment platform.

**24.18 Production Secrets**

Production secrets shall be different from development and testing secrets.

For example:

Development JWT Secret

≠

Production JWT Secret

Similarly:

Test Payment Credentials

≠

Production Payment Credentials

If a production secret is exposed, it should be rotated immediately.

**24.19 Source Code Repository**

The CarGo Kenya source code should be maintained using a version-control system such as Git.

The repository should contain:

- Frontend source code.
- Backend source code.
- Database migration files.
- Configuration templates.
- Documentation.
- Tests.
- Deployment configuration.

The repository should not contain:

- Production passwords.
- Private payment credentials.
- Database passwords.
- Private API keys.
- User personal information.
- Production database dumps.

**24.20 Branching Strategy**

The development team should maintain a simple and understandable branching strategy.

For example:

main

│

├── development

│

└── feature/\*

Feature branches may be used for individual changes.

Example:

feature/payment-release

feature/vehicle-inspection

feature/gps-tracking

feature/driver-wallet

Changes should be reviewed and tested before being merged into the production branch.

The exact branching strategy may be simplified for a small MVP development team.

**24.21 Continuous Integration**

Where practical, the project should use automated checks whenever code is pushed to the repository.

These checks may include:

- Dependency installation.
- Code linting.
- Unit tests.
- Integration tests.
- Build verification.
- Type checking where applicable.
- Security checks.

Conceptually:

Developer Pushes Code

↓

CI Pipeline

↓

Install Dependencies

↓

Run Tests

↓

Build Application

↓

PASS / FAIL

A failed build should not automatically be deployed to production.

**24.22 Production Deployment Process**

A standard production deployment should follow a controlled process.

Code Completed

↓

Code Review

↓

Automated Tests

↓

Build

↓

Staging Deployment

↓

Staging Verification

↓

Production Approval

↓

Database Migration if Required

↓

Production Deployment

↓

Health Check

↓

Monitoring

This process should be followed for important releases.

**24.23 Deployment Verification**

After deployment, the system shall be checked to confirm that essential functions are working.

The verification should include:

- Website availability.
- Backend availability.
- Database connectivity.
- Authentication.
- Customer login.
- Driver login.
- Trip creation.
- Quotation functionality.
- Payment integration.
- Notification service.
- File uploads.
- Vehicle inspection.
- GPS/tracking functionality.
- Wallet operations.
- Administrative dashboard.

A deployment should not be considered successful merely because the server starts.

**24.24 Health Checks**

The backend should provide a basic health-check mechanism.

Conceptually:

GET /health

The endpoint may verify basic service availability.

A more detailed internal health check may verify:

- Application availability.
- Database connectivity.
- Required service availability.

The health check should not expose sensitive information.

For example, it should not return:

- Database passwords.
- API keys.
- Internal credentials.

**24.25 Monitoring**

The production environment shall be monitored for operational problems.

Monitoring should cover:

- Server availability.
- CPU usage.
- Memory usage.
- Disk usage.
- Database health.
- API response times.
- Error rates.
- Failed payment requests.
- Failed notifications.
- File storage problems.
- GPS service failures.

Monitoring should help the development team identify problems before they become widespread.

**24.26 Application Performance Monitoring**

The system should monitor important backend performance indicators.

Examples include:

- Average API response time.
- Slow API requests.
- Database query performance.
- Request volume.
- Failed requests.
- Authentication failures.
- Payment processing delays.

The objective is not advanced analytics during the MVP but early identification of technical problems.

**24.27 Server Resource Monitoring**

The hosting environment should be monitored for:

**CPU**

High CPU utilization may indicate:

- Excessive application processing.
- Inefficient code.
- Unexpected traffic.
- Background jobs consuming resources.

**Memory**

High memory usage may indicate:

- Memory leaks.
- Excessive concurrent requests.
- Large file processing.
- Inefficient application processes.

**Storage**

Low disk space may affect:

- Logs.
- Temporary files.
- Application deployment.
- Database operations.

**24.28 Logging in Production**

Production logs shall be enabled for troubleshooting.

Important logs may include:

- Application errors.
- Authentication failures.
- Payment events.
- Notification failures.
- API errors.
- Database errors.
- Background job failures.
- File upload failures.

Logs should not contain sensitive information such as:

- Passwords.
- Payment secrets.
- Authentication secrets.
- Full payment credentials.

**24.29 Log Retention**

Production logs should be retained for an appropriate period based on:

- Operational requirements.
- Security requirements.
- Storage costs.
- Legal requirements.

The system should prevent unlimited log growth.

Old logs may be:

- Archived.
- Rotated.
- Deleted according to policy.

**24.30 Application Updates**

System updates should be performed through controlled deployment procedures.

Updates may include:

- Bug fixes.
- Security patches.
- New MVP functionality.
- Performance improvements.
- Database changes.
- Dependency updates.

The team should avoid directly editing production application files unless necessary for emergency recovery.

**24.31 Dependency Management**

The system will depend on third-party libraries and frameworks.

Dependencies shall be monitored and updated periodically.

The development team should:

- Keep dependencies reasonably current.
- Review security advisories.
- Remove unnecessary dependencies.
- Test dependency updates before production deployment.
- Avoid blindly upgrading critical dependencies without testing.

**24.32 Security Updates**

Security-related updates shall receive high priority.

Examples include:

- Framework security patches.
- Authentication vulnerabilities.
- Database vulnerabilities.
- Dependency vulnerabilities.
- Operating-system security updates.
- Payment-library vulnerabilities.

A known critical vulnerability should not remain unaddressed simply because the application is already deployed.

**24.33 Rollback Strategy**

The deployment process should provide a method of returning to a previous stable version if a release causes serious problems.

Conceptually:

Production Release

↓

Problem Detected

↓

Assess Severity

↓

Rollback Required

↓

Previous Stable Version

↓

Health Check

↓

System Restored

Database rollback shall be handled carefully because reverting application code does not necessarily mean that database changes can safely be reversed.

**24.34 Database Migration Safety**

Before applying significant database migrations to production:

1.  Backup the database.
2.  Test the migration in staging.
3.  Confirm compatibility with the application version.
4.  Apply the migration.
5.  Verify the database.
6.  Verify application functionality.

This is particularly important for tables containing:

- Payments.
- Wallet transactions.
- Trips.
- Inspection records.
- Audit logs.

**24.35 Maintenance Windows**

Where maintenance could interrupt service, the administrator/development team should schedule a maintenance window.

Users may receive a maintenance notification such as:

CarGo Kenya is temporarily unavailable while scheduled system maintenance is being performed.

The maintenance message should be displayed before planned downtime where practical.

**24.36 Zero or Minimal Downtime**

The MVP does not require sophisticated zero-downtime infrastructure.

However, deployment should aim to minimize service interruption.

For example:

Prepare New Version

↓

Deploy

↓

Health Check

↓

Switch Traffic

As the platform grows, more advanced deployment methods may be introduced.

**24.37 Maintenance Mode**

The system may provide an administrative maintenance mode.

When enabled:

Maintenance Mode = ON

The public application may display a controlled maintenance message while administrators and developers perform required work.

The system should ensure that maintenance mode does not accidentally expose administrative functions to unauthorized users.

**24.38 Scheduled Background Jobs**

Certain CarGo Kenya functions may require background processing.

Examples include:

- Notification retries.
- Email delivery.
- SMS retries.
- Cleanup of temporary files.
- Scheduled reports.
- Payment-status reconciliation.
- Tracking data processing.
- Expired request handling.

These jobs should not unnecessarily block normal user requests.

Conceptually:

User Request

↓

Backend

↓

Immediate Response

Background Task

↓

Queue / Worker

↓

Process

**24.39 Background Job Failure**

If a background task fails, the system should record the failure and retry where appropriate.

For example:

Notification Job

↓

Send SMS

↓

FAILED

↓

Retry

↓

SUCCESS

The system should avoid unlimited retries.

A maximum retry policy should be established during implementation.

**24.40 Payment Reconciliation Jobs**

Because payment processing is financially sensitive, the system may periodically reconcile internal payment records with the payment provider.

For example:

CarGo Payment Record

↓

Payment Provider Record

↓

Compare

↓

MATCH

If the records do not match:

MISMATCH

↓

Financial Alert

↓

Administrative Review

The system should not silently change financial records simply because an automated reconciliation detects a mismatch.

**24.41 GPS Service Maintenance**

GPS/tracking services may depend on:

- Device connectivity.
- Browser/device permissions.
- External location services.
- Backend tracking APIs.

If the GPS service becomes unavailable, the trip should not automatically become cancelled.

The system should record the tracking problem and continue the trip according to the established operational rules.

**24.42 Payment Provider Maintenance**

If the payment provider becomes temporarily unavailable:

Customer Attempts Payment

↓

Provider Unavailable

↓

Payment Not Confirmed

↓

Trip Remains PAYMENT PENDING

The system should not mark the trip as BOOKED until payment is successfully verified.

The customer should receive an appropriate message explaining that payment is currently unavailable or pending.

**24.43 Notification Provider Maintenance**

If SMS or email services become temporarily unavailable:

Trip Event

↓

Notification Created

↓

SMS Provider Unavailable

↓

Notification Logged

↓

Retry Where Appropriate

The underlying trip event must remain valid.

This follows the established rule:

**Notification failure must not automatically invalidate the underlying transaction.**

**24.44 Disaster Recovery**

The CarGo Kenya system should have a basic disaster-recovery plan.

Potential disaster scenarios include:

- Hosting failure.
- Database corruption.
- Accidental deletion.
- Security incident.
- Major software failure.
- File-storage failure.
- Payment-service outage.

The recovery process should include:

1.  Identify the incident.
2.  Protect remaining data.
3.  Determine affected services.
4.  Restore infrastructure where necessary.
5.  Restore database backup if required.
6.  Restore file access.
7.  Verify data integrity.
8.  Restart services.
9.  Perform functional checks.
10. Document the incident.

**24.45 Recovery Priority**

Not all services have equal operational priority.

For CarGo Kenya, critical services should generally include:

1.  Authentication.
2.  Trip management.
3.  Payment processing.
4.  Trip Wallet.
5.  Driver Wallet.
6.  Vehicle inspection records.
7.  Database.
8.  GPS/tracking.
9.  Notifications.
10. Reporting.

The database and financial records should receive particularly strong recovery protection.

**24.46 Recovery Point Objective**

The development team should define how much recent data could potentially be lost during a serious failure.

For example:

Recovery Point Objective

\=

Maximum acceptable period of data loss

The exact value shall be finalized based on:

- Hosting capabilities.
- Backup frequency.
- Cost.
- Operational requirements.

Financial and trip information should have a stricter recovery requirement than non-critical temporary information.

**24.47 Recovery Time Objective**

The system should also define how quickly critical services should be restored after a major failure.

Recovery Time Objective

\=

Target time for restoring service

The MVP should establish practical targets based on available infrastructure rather than promising unrealistic uptime or recovery times.

**24.48 Data Retention**

The system shall retain important operational records for an appropriate period.

Records may include:

- Completed trips.
- Payment transactions.
- Wallet transactions.
- Inspection records.
- Audit logs.
- Dispute records.
- Communication records.
- Notifications.

The exact retention periods shall be determined according to:

- Business requirements.
- Legal requirements.
- Privacy requirements.
- Storage limitations.

**24.49 Data Deletion**

Data deletion shall be handled carefully.

Deleting a user account should not automatically destroy important financial or operational records where those records are required for:

- Financial reconciliation.
- Audit.
- Dispute resolution.
- Legal compliance.
- Historical trip records.

Where necessary, personal information may be anonymized or restricted rather than physically deleting the entire associated financial record.

**24.50 Production Access Control**

Only authorized personnel should have access to production infrastructure.

Access should be restricted according to role.

For example:

Developer

↓

Application Code Access

Database Administrator

↓

Database Access

System Administrator

↓

Infrastructure Access

Finance Administrator

↓

Financial Records Access

The exact roles may be simplified for the MVP team, but production access should not be shared unnecessarily.

**24.51 Administrative Access**

Administrative access to the CarGo Kenya application should use:

- Authentication.
- Role-based authorization.
- Strong credentials.
- Secure sessions/tokens.
- Audit logging.

Sensitive administrative operations should be traceable.

Examples include:

- Refund approval.
- Payment adjustment.
- Driver suspension.
- Dispute resolution.
- Wallet adjustment.
- Trip status intervention.

**24.52 Maintenance Audit Trail**

Important maintenance actions should be recorded.

Examples include:

- Deployment.
- Rollback.
- Database migration.
- Configuration change.
- Security update.
- Production restart.
- Administrative intervention.

The record should include:

- Actor.
- Action.
- Date/time.
- Environment.
- Description.
- Result where applicable.

**24.53 Monitoring Alerts**

The monitoring system should generate alerts when important thresholds are exceeded.

Examples include:

- Application unavailable.
- Database unavailable.
- High error rate.
- Excessive API response time.
- Low disk space.
- High memory usage.
- Failed payment processing.
- Failed background jobs.
- Excessive authentication failures.

The purpose of alerts is to enable timely intervention.

**24.54 Incident Management**

When a production problem occurs, the development/operations team should follow a structured process.

Problem Detected

↓

Incident Recorded

↓

Severity Determined

↓

Immediate Containment

↓

Investigation

↓

Resolution

↓

System Verification

↓

Incident Closed

Serious incidents should be documented for future prevention.

**24.55 Incident Severity**

The MVP may use three basic incident levels.

**HIGH**

Major functionality is unavailable.

Examples:

- Payment system unavailable.
- Production database unavailable.
- Users cannot log in.
- Trips cannot be processed.

**MEDIUM**

Important functionality is affected but the platform remains partially usable.

Examples:

- SMS delivery unavailable.
- Reporting unavailable.
- GPS temporarily degraded.

**LOW**

Minor issue with limited operational impact.

Examples:

- Cosmetic interface issue.
- Non-critical notification delay.
- Minor reporting display problem.

**24.56 Maintenance Testing**

Before major maintenance changes are released, the development team should test:

- Authentication.
- Trip creation.
- Driver quotation.
- Driver selection.
- Payment.
- Booking.
- Inspection.
- Trip activation.
- Wallet release.
- Delivery.
- Notifications.
- Reporting.

The exact test scope should depend on the change being introduced.

**24.57 Production Smoke Testing**

After every significant deployment, a small set of critical functions should be tested immediately.

For example:

Open Website

↓

Login

↓

Create/Test Request

↓

Check API

↓

Check Database

↓

Check Payment Service

↓

Check Notification

↓

Deployment Confirmed

The smoke test should use appropriate test accounts and should not accidentally create real financial transactions.

**24.58 Maintenance Documentation**

The project should maintain documentation describing:

- Deployment process.
- Environment configuration.
- Database setup.
- Database migration process.
- Backup procedure.
- Restore procedure.
- Monitoring setup.
- Payment configuration.
- Notification configuration.
- File storage configuration.
- Emergency procedures.

This prevents the system from depending entirely on one developer's personal knowledge.

**24.59 Developer Handover**

If another developer takes over the CarGo Kenya system, they should be able to understand:

- How the application is structured.
- How to run the project.
- How to configure the environment.
- How to deploy the frontend.
- How to deploy the backend.
- How to connect the database.
- How to run migrations.
- How to restore backups.
- How payment integration works.
- How notifications work.
- How GPS integration works.
- How to monitor production.

The project should therefore maintain clear technical documentation.

**24.60 Maintenance Responsibilities**

The exact operational responsibilities may be divided as follows.

**Developer**

Responsible for:

- Code maintenance.
- Bug fixes.
- Dependency updates.
- Deployment.
- Application monitoring.
- Database migrations.
- Technical troubleshooting.

**System Administrator / DevOps**

Where applicable, responsible for:

- Server infrastructure.
- Hosting.
- SSL certificates.
- Backups.
- Monitoring.
- Infrastructure security.

**CarGo Kenya Administrator**

Responsible for:

- Operational decisions.
- User management.
- Disputes.
- Financial approvals.
- Driver verification.
- Business configuration.

These responsibilities may overlap in the early MVP because the team may be small.

**24.61 Maintenance of Financial Records**

Financial records shall receive special protection during maintenance.

The development team shall avoid destructive changes to:

- Payment transactions.
- Trip Wallet transactions.
- Driver Wallet transactions.
- Refund records.
- Withdrawal records.
- Financial audit records.

Any structural change affecting financial data should be:

1.  Backed up.
2.  Tested.
3.  Reviewed.
4.  Migrated carefully.
5.  Verified after deployment.

**24.62 Maintenance of Inspection Evidence**

Vehicle inspection photographs and related evidence should also be protected during maintenance.

The system should ensure that application updates do not accidentally:

- Delete inspection photographs.
- Break inspection-file references.
- Remove inspection metadata.
- Change ownership.
- Make evidence inaccessible.

Inspection records should remain linked to their relevant:

Trip

↓

Inspection

↓

Vehicle

↓

Photographs

↓

Inspection Evidence

**24.63 Maintenance of Trip History**

Completed trips should remain accessible according to the system's retention policy.

Maintenance operations should not accidentally change:

- Trip status.
- Trip dates.
- Customer information.
- Driver assignment.
- Financial allocations.
- Inspection history.
- Delivery confirmation.
- Dispute records.

Historical trip information should be treated as operational records.

**24.64 Versioning**

The system should use identifiable software versions.

For example:

CarGo Kenya MVP v1.0

CarGo Kenya v1.1

CarGo Kenya v1.2

Version information helps administrators and developers determine which software release is currently deployed.

**24.65 Configuration Management**

Business configuration should be separated from application code where practical.

Examples include:

- Platform fee.
- Notification settings.
- Trip timeout values.
- Maximum quotation period.
- Operational thresholds.

However, configuration changes affecting financial rules should be carefully controlled and audited.

**24.66 Production Configuration Changes**

Important production configuration changes should not be made casually.

For example, changing:

Platform Fee = 5%

to:

Platform Fee = 10%

may affect future trips.

The system should preserve historical price snapshots so that already-created trips are not unexpectedly recalculated.

This is consistent with the Payment and Wallet Module.

**24.67 Deployment and Price Snapshot Integrity**

When a new deployment changes pricing logic, existing trips must continue using their stored price snapshots.

For example:

Trip Created

Driver Fee = KSh 18,000

Platform Fee = KSh 900

↓

Price Snapshot Stored

↓

Pricing Configuration Changes

↓

Existing Trip

↓

Still Uses Original Snapshot

This prevents deployment changes from altering historical financial commitments.

**24.68 Maintenance and Trip Status Integrity**

System maintenance must not arbitrarily alter trip statuses.

For example, restarting the backend must not change:

TRIP ACTIVE

to:

BOOKED

or:

COMPLETED

Trip status changes shall occur only through the defined business rules and authorized backend processes.

**24.69 Maintenance and Wallet Integrity**

Similarly, application maintenance shall not automatically change wallet balances.

A server restart must not cause:

Driver Wallet

KSh 9,000

to become:

KSh 0

Wallet balances should be derived from properly stored financial transactions and protected against accidental modification.

**24.70 Maintenance and Idempotency**

Important operations must remain idempotent after deployment.

This includes:

- Payment confirmation.
- Payment release.
- Refund processing.
- Wallet transactions.
- Notification creation.
- Withdrawal processing.

If an external service retries an operation after a deployment or temporary failure, the system should not create duplicate financial transactions.

**24.71 Maintenance and Security**

Every production maintenance activity shall consider security.

The team should verify:

- Authentication remains functional.
- Authorization remains functional.
- API security remains active.
- HTTPS remains enabled.
- Secrets remain protected.
- Database access remains restricted.
- File storage remains protected.
- Audit logging remains operational.

A deployment should not be considered successful if it introduces a major security weakness.

**24.72 Maintenance and External Services**

The CarGo Kenya application depends on external services such as:

- Payment provider.
- SMS provider.
- Email provider.
- GPS/location services.
- File/object storage.
- Hosting infrastructure.

The system should therefore be designed so that temporary failure of one external service does not unnecessarily bring down the entire application.

For example:

SMS FAILURE

↓

Trip System Continues

↓

Notification Logged

↓

Retry Later

**24.73 Maintenance Testing Checklist**

Before considering a major deployment complete, the following checklist should be considered:

**Application**

- Frontend loads.
- Backend responds.
- Authentication works.
- Authorization works.

**Trips**

- Requests work.
- Quotations work.
- Driver selection works.
- Booking works.
- Trip status transitions work.

**Inspection**

- Inspection records load.
- Photographs upload.
- Photographs can be retrieved.
- Inspection evidence remains linked to trips.

**Payments**

- Payment integration works.
- Payment confirmation works.
- Trip Wallet works.
- Driver release logic works.
- Wallet balances remain correct.

**Notifications**

- In-app notifications work.
- Critical notifications are generated.
- Notification history works.

**GPS**

- Tracking starts correctly.
- Location data is received where supported.
- Temporary tracking failure is handled.

**Administration**

- Admin dashboard works.
- Important records are accessible.
- Audit records are being created.

**24.74 MVP Deployment Scope**

**Included in MVP**

The Deployment, Hosting and Maintenance requirements shall include:

- Production hosting.
- Development environment.
- Staging/test environment where practical.
- HTTPS.
- Production database.
- Database backups.
- Database migration process.
- Secure environment configuration.
- Production logging.
- Basic monitoring.
- Health checks.
- Application deployment process.
- Basic rollback procedure.
- File/object storage.
- Inspection evidence protection.
- Production access control.
- Security updates.
- Dependency management.
- Basic disaster recovery.
- Incident handling.
- Maintenance documentation.
- Production smoke testing.
- Payment-service availability monitoring.
- Notification-service monitoring.
- Basic background-job management.

**Not Required for MVP**

The following should remain future enhancements:

- Multi-region deployment.
- Global load balancing.
- Kubernetes orchestration.
- Complex microservice infrastructure.
- Multi-cloud deployment.
- Advanced auto-scaling.
- Global CDN architecture beyond practical requirements.
- Fully automated disaster recovery.
- Advanced DevOps observability platforms.
- Blue-green deployment infrastructure.
- Complex service mesh architecture.
- Multi-region active-active databases.

These features may be introduced when the CarGo Kenya platform reaches a scale that justifies the additional complexity and cost.

**24.75 Final Deployment Architecture**

The CarGo Kenya deployment architecture can therefore be understood as:

USERS

│

↓

HTTPS / DOMAIN

│

┌───────────┴───────────┐

↓ ↓

FRONTEND BACKEND API

│

┌─────────────────┼─────────────────┐

↓ ↓ ↓

DATABASE FILE STORAGE BACKGROUND

JOBS

│ │ │

└─────────────────┼─────────────────┘

↓

EXTERNAL SERVICES

┌─────────────┼─────────────┐

↓ ↓ ↓

PAYMENT GPS SMS / EMAIL

│ │ │

└─────────────┼─────────────┘

↓

MONITORING

│

↓

ADMIN / DEVOPS

The deployment architecture shall support the previously defined CarGo Kenya modules without changing their established business rules.

**24.76 Core Deployment and Maintenance Rules**

The following rules shall be treated as core MVP requirements.

**Rule 1**

Development, testing, and production environments should be separated.

**Rule 2**

Production shall use HTTPS.

**Rule 3**

Production secrets shall not be stored in source code.

**Rule 4**

The production database shall be backed up regularly.

**Rule 5**

Database migrations shall be tested before production deployment.

**Rule 6**

Important financial records shall be protected during deployment and maintenance.

**Rule 7**

Inspection evidence shall remain accessible and correctly associated with its inspection records.

**Rule 8**

Production deployments shall include post-deployment verification.

**Rule 9**

The system shall provide a basic rollback or recovery procedure.

**Rule 10**

Production application errors shall be logged.

**Rule 11**

Critical infrastructure shall be monitored.

**Rule 12**

External-service failures shall be handled without unnecessarily corrupting the underlying CarGo Kenya transaction.

**Rule 13**

Payment records shall not be modified merely because an external service temporarily becomes unavailable.

**Rule 14**

Trip statuses shall only change according to the established trip lifecycle and business rules.

**Rule 15**

Wallet balances shall not be changed directly as part of ordinary maintenance.

**Rule 16**

Important maintenance and administrative actions shall be traceable.

**Rule 17**

Production configuration changes affecting financial rules shall be controlled and audited.

**Rule 18**

Historical price snapshots shall remain unchanged after deployment or pricing configuration changes.

**Rule 19**

The deployment process shall prioritize security, data integrity, and service availability.

**Rule 20**

The MVP infrastructure shall remain sufficiently simple for the development team to understand, operate, and maintain.

**24.77 Final MVP Maintenance Principle**

The CarGo Kenya MVP shall not attempt to build an unnecessarily complex enterprise infrastructure from the beginning.

The deployment strategy should instead provide a reliable foundation:

SECURE

+

BACKED UP

+

MONITORED

+

TESTED

+

DOCUMENTED

+

RECOVERABLE

The system should be capable of operating reliably in production while leaving room for future scaling.

As the number of:

- Customers,
- Drivers,
- Transportation requests,
- Trips,
- Payments,
- GPS records,
- Inspection photographs,
- Notifications,

increases, the infrastructure can gradually evolve toward more advanced:

- Auto-scaling.
- Load balancing.
- Distributed processing.
- Advanced monitoring.
- High-availability databases.
- Multi-region infrastructure.

These should be introduced based on actual operational requirements rather than unnecessarily complicating the initial MVP.

**24.78 Relationship With Previous Modules**

The Deployment, Hosting and Maintenance requirements shall support all previously defined CarGo Kenya modules.

In particular:

MVP

│

├── User & Account Management

├── Driver Verification

├── Transportation Requests

├── Quotation & Driver Selection

├── Trip Management

├── Vehicle Inspection & Handover

├── GPS & Trip Tracking

├── Fuel & Trip Operations

├── Payment & Wallet

├── Notification & Communication

├── Ratings & Reputation

├── Reporting & Analytics

├── Database & Data Management

├── API & Backend Architecture

├── Non-Functional Requirements

├── System Integrations

├── Error Handling, Logging & Audit

├── Testing & Quality Requirements

└── Deployment, Hosting & Maintenance

The deployment environment therefore does not introduce a separate business workflow. Instead, it provides the technical environment required for all previously defined modules to operate safely and reliably.

**24.79 Final Architecture Summary**

The complete operational principle of the CarGo Kenya MVP is:

DEVELOP

↓

TEST

↓

STAGE

↓

DEPLOY

↓

MONITOR

↓

BACKUP

↓

MAINTAIN

↓

IMPROVE

All production changes shall preserve the established CarGo Kenya business rules, particularly:

- Trip status integrity.
- Inspection evidence integrity.
- Payment integrity.
- Wallet-release conditions.
- Driver earnings rules.
- Customer payment protection.
- GPS/trip tracking records.
- Notification integrity.
- Auditability.

The deployment and maintenance architecture shall therefore provide the foundation upon which the entire CarGo Kenya MVP can operate in a controlled production environment.

**25.0 MVP TRACEABILITY / FINAL SYSTEM REQUIREMENTS**

**25.1 Purpose**

The MVP Traceability and Final System Requirements section shall provide the final consolidated reference for the CarGo Kenya MVP.

The purpose of this section is to ensure that every major business requirement established in the CarGo Kenya BRD and MVP definition can be traced to a corresponding system requirement, functional module, business rule, data requirement, API requirement, security requirement, testing requirement, and operational requirement.

This section shall therefore serve as the final requirements checkpoint before implementation.

The development team shall use this section to confirm that:

- Every approved MVP capability has been represented in the system design.
- Every major business process has a corresponding system process.
- Trip statuses remain consistent throughout the system.
- Payment and wallet rules remain consistent with the approved financial model.
- Vehicle inspection requirements are represented in the system.
- Driver and customer responsibilities are clearly defined.
- Notifications correspond to actual system events.
- GPS and trip tracking requirements are represented.
- Delivery and completion requirements are represented.
- Disputes and cancellations are supported.
- Administrative controls are represented.
- Security and authorization requirements are enforced.
- Important system actions are auditable.
- The database contains the information required by the operational modules.
- APIs support the approved system workflows.
- The MVP does not accidentally expand into unnecessary future functionality.

The final implementation shall therefore be based on the requirements established throughout Chapters 1–24 and consolidated in this chapter.

**25.2 MVP Requirements Traceability Principle**

The CarGo Kenya system shall follow the principle:

**Every approved business requirement must have a corresponding technical implementation path.**

The relationship shall generally be:

BUSINESS REQUIREMENT

↓

MVP REQUIREMENT

↓

SYSTEM REQUIREMENT

↓

MODULE

↓

DATABASE / API

↓

USER INTERFACE

↓

TEST

↓

DEPLOYED FEATURE

A requirement shall not be considered fully implemented merely because a screen exists.

The underlying:

- business rule,
- database record,
- API operation,
- authorization,
- validation,
- status transition,
- notification,
- audit record,
- and testing requirement

must also be considered where applicable.

**25.3 Final MVP Scope**

The CarGo Kenya MVP shall provide the core digital platform required to manage vehicle transportation assignments from request creation through completion.

The MVP shall primarily support:

1.  Customer registration and account management.
2.  Driver registration and verification.
3.  Transportation requests.
4.  Driver quotation.
5.  Driver selection.
6.  Trip management.
7.  Payment processing.
8.  Trip Wallet management.
9.  Driver Personal Wallet management.
10. Vehicle pickup inspection.
11. Vehicle delivery inspection.
12. Vehicle handover procedures.
13. Fuel recording.
14. Trip commencement confirmation.
15. GPS/trip tracking.
16. Delivery confirmation.
17. Trip completion.
18. Notifications.
19. Customer-driver communication.
20. Cancellations.
21. Disputes.
22. Driver earnings.
23. Withdrawals.
24. Administration.
25. Reporting and dashboards.
26. Database management.
27. API and backend services.
28. Security.
29. Error handling and audit logging.
30. Testing.
31. Deployment and maintenance.

These capabilities shall remain connected to the agreed CarGo Kenya transportation lifecycle.

**25.4 Core Trip Lifecycle Traceability**

The official trip lifecycle shall remain consistent throughout the system.

The MVP shall use the following primary trip statuses:

REQUESTED

↓

QUOTING

↓

DRIVER SELECTED

↓

PAYMENT PENDING

↓

BOOKED

↓

PICKUP PENDING

↓

PICKUP INSPECTION

↓

TRIP START PENDING

↓

TRIP ACTIVE

↓

IN TRANSIT

↓

DELIVERY PENDING

↓

DELIVERED

↓

COMPLETED

The system shall also support exceptional states:

DISPUTED

CANCELLED

These statuses shall not be independently reinvented by individual modules.

The Trip Management Module shall remain the authoritative source for the official trip status.

Other modules shall reference the trip status rather than creating conflicting independent trip lifecycles.

**25.5 Trip Status Definitions**

The following definitions shall remain authoritative for the MVP.

**REQUESTED**

The customer has submitted a transportation request.

**QUOTING**

Eligible drivers may submit quotations for the request.

**DRIVER SELECTED**

The customer has selected a driver.

**PAYMENT PENDING**

The required payment has not yet been successfully completed.

**BOOKED**

The customer's required payment has been successfully verified and the trip has been officially confirmed.

**PICKUP PENDING**

The vehicle has not yet undergone the required pickup procedures.

**PICKUP INSPECTION**

The driver is at the pickup location and the required inspection, photographs, odometer, fuel recording, and vehicle handover procedures are being completed.

**TRIP START PENDING**

Pickup procedures have been completed, but the trip has not yet officially started because the required trip-start confirmation has not been completed.

**TRIP ACTIVE**

The driver has selected START TRIP and the customer has confirmed commencement after the required pickup procedures have been completed.

At this stage, the first 50% of the driver's transportation fee becomes eligible for release.

**IN TRANSIT**

The vehicle is actively being transported toward the destination.

**DELIVERY PENDING**

The vehicle has reached or is approaching the destination and delivery procedures remain to be completed.

**DELIVERED**

The vehicle has been delivered and the required delivery inspection and handover procedures have been completed.

**COMPLETED**

The required customer and driver completion confirmations have been completed and the trip has been formally closed.

The remaining 50% of the driver's transportation fee becomes eligible for release.

**DISPUTED**

A formal issue has been raised that requires administrative review.

**CANCELLED**

The trip has been cancelled according to the applicable cancellation procedures.

**25.6 Requirement Traceability Matrix**

The following matrix provides the final high-level mapping of the major MVP requirements.

| **Requirement Area** | **Primary Module** | **Supporting Modules** | **Final MVP Requirement** |
| --- | --- | --- | --- |
| Customer Accounts | User/Account Module | Security, Notification | Customers can register and manage accounts |
| Driver Accounts | Driver Module | Verification, Security | Drivers can register and submit required information |
| Driver Verification | Driver Verification | Admin, Notification | Drivers must satisfy required verification procedures |
| Transportation Request | Trip Management | Customer, Notification | Customers can create transportation requests |
| Driver Quotation | Quotation/Trip Module | Notification | Eligible drivers can submit quotations |
| Driver Selection | Trip Management | Notification | Customer can select an eligible driver |
| Payment | Payment Module | Trip Wallet, Integration | Customer pays full agreed amount |
| Booking | Trip Management | Payment, Notification | Successful payment causes booking confirmation |
| Pickup | Pickup/Inspection | Trip, GPS | Driver can execute pickup procedures |
| Vehicle Inspection | Inspection Module | Evidence, Communication | Required vehicle condition data is captured |
| Fuel | Fuel/Trip Operations | Payment | Fuel allocation and records are maintained |
| Trip Start | Trip Management | Inspection, Notification, Payment | Trip starts only after required confirmation |
| First Payment Release | Wallet | Trip, Inspection | 50% released at TRIP ACTIVE |
| GPS Tracking | Tracking | Trip, Notification | Trip location/progress can be monitored |
| Delivery | Delivery Module | Inspection, Notification | Delivery procedures are recorded |
| Final Payment Release | Wallet | Trip, Delivery | Remaining 50% released at COMPLETED |
| Driver Wallet | Wallet Module | Payment | Released earnings become available |
| Withdrawal | Wallet Module | Payment Integration | Driver can request withdrawal of available funds |
| Notifications | Notification Module | All major modules | Important events are communicated |
| Communication | Communication Module | Trip | Customer and driver can communicate after booking |
| Cancellation | Trip/Dispute | Payment, Notification | Cancellation is recorded and financially processed |
| Disputes | Dispute Module | Inspection, Payment, Admin | Disputes can be raised and reviewed |
| Administration | Admin Module | All modules | Authorized administrators can manage operations |
| Reporting | Reporting Module | Database | Operational information can be viewed |
| Audit | Audit Module | All sensitive modules | Important actions are traceable |
| Security | Security/NFR | All modules | Access is authenticated and authorized |
| API | Backend Architecture | All modules | Core system functionality is exposed through controlled APIs |
| Database | Data Management | All modules | System data is stored consistently |
| Testing | QA  | All modules | MVP requirements are testable |
| Deployment | Infrastructure | All modules | MVP can be deployed and maintained |

**25.7 Customer Journey Traceability**

The complete customer journey shall be supported as follows:

REGISTER

↓

CREATE TRANSPORTATION REQUEST

↓

WAIT FOR QUOTATIONS

↓

REVIEW QUOTATIONS

↓

SELECT DRIVER

↓

REVIEW AGREED PRICE

↓

PAY FULL TRIP COST

↓

BOOKING CONFIRMED

↓

MONITOR PICKUP

↓

REVIEW INSPECTION INFORMATION

↓

CONFIRM TRIP START

↓

MONITOR TRIP

↓

RECEIVE DELIVERY NOTIFICATION

↓

CONFIRM DELIVERY

↓

TRIP COMPLETED

↓

REVIEW PAYMENT / TRIP HISTORY

↓

RATE DRIVER WHERE APPLICABLE

The customer shall not be required to perform technical system operations that belong to the backend.

For example, the customer shall not manually update:

- payment status,
- trip status,
- driver earnings,
- wallet balances,
- inspection completion,
- or GPS status.

These shall be controlled by the appropriate backend processes.

**25.8 Driver Journey Traceability**

The complete driver journey shall be:

REGISTER

↓

SUBMIT VERIFICATION INFORMATION

↓

ACCOUNT VERIFIED

↓

VIEW ELIGIBLE REQUESTS

↓

SUBMIT QUOTATION

↓

CUSTOMER SELECTS DRIVER

↓

BOOKING CONFIRMED

↓

VIEW PICKUP DETAILS

↓

ARRIVE AT PICKUP

↓

PERFORM PICKUP INSPECTION

↓

CAPTURE REQUIRED EVIDENCE

↓

COMPLETE HANDOVER

↓

COMPLETE FUEL PROCEDURES WHERE REQUIRED

↓

SELECT START TRIP

↓

CUSTOMER CONFIRMS

↓

TRIP ACTIVE

↓

FIRST 50% RELEASE

↓

IN TRANSIT

↓

ARRIVE AT DESTINATION

↓

PERFORM DELIVERY PROCEDURES

↓

CUSTOMER CONFIRMS DELIVERY

↓

DRIVER CONFIRMS COMPLETION

↓

COMPLETED

↓

FINAL 50% RELEASE

↓

DRIVER WALLET

↓

WITHDRAW AVAILABLE FUNDS

**25.9 Payment Traceability**

The approved payment architecture shall remain:

CUSTOMER

│

│ FULL PAYMENT

↓

TRIP WALLET

│

├───────────────┐

↓ ↓

TRIP ACTIVE COMPLETED

↓ ↓

50% RELEASE 50% RELEASE

│ │

└───────┬───────┘

↓

DRIVER PERSONAL WALLET

↓

WITHDRAWAL

The customer's payment shall consist of the approved financial components:

Driver Transportation Fee

+

Fuel Budget

+

CarGo Kenya Platform Fee

\=

Total Trip Cost

The driver's Personal Wallet shall only receive released driver earnings.

The fuel budget shall not automatically be treated as driver income.

The CarGo Kenya platform fee shall remain separately identifiable.

**25.10 Payment Release Traceability**

The first 50% release shall require:

PICKUP COMPLETED

+

INSPECTION COMPLETED

+

REQUIRED EVIDENCE CAPTURED

+

HANDOVER COMPLETED

+

FUELING REQUIREMENTS COMPLETED

+

DRIVER START TRIP

+

CUSTOMER CONFIRMATION

+

TRIP = TRIP ACTIVE

Only after the required conditions have been verified shall the backend release the first 50%.

The final 50% shall require:

DESTINATION REACHED

+

DELIVERY INSPECTION COMPLETED

+

DELIVERY HANDOVER COMPLETED

+

CUSTOMER CONFIRMATION

+

DRIVER CONFIRMATION

+

TRIP = COMPLETED

The frontend shall never determine the release amount.

The backend shall calculate the permitted amount from the stored trip financial information.

**25.11 Vehicle Inspection Traceability**

The inspection requirements established in the Vehicle Inspection and Handover Module shall remain mandatory where applicable.

The pickup inspection shall support recording of:

- Vehicle identity.
- Vehicle condition.
- Photographs.
- Odometer reading.
- Fuel level.
- Existing damage.
- New damage where identified.
- Inspection timestamp.
- Inspector/driver identity.
- Handover confirmation.

The delivery inspection shall support equivalent completion information required to establish the vehicle's condition at delivery.

Inspection evidence shall remain associated with the inspection record.

It shall not be treated as ordinary chat content.

**25.12 GPS and Tracking Traceability**

GPS functionality shall support the operational requirement of monitoring an active transportation assignment.

The system shall support, where applicable:

- Tracking activation.
- Current location.
- Last known location.
- Tracking status.
- Tracking interruptions.
- Meaningful trip milestones.
- Destination arrival.
- Tracking completion.

The system shall not treat temporary GPS loss as automatic trip failure.

The last known location may remain available while tracking is temporarily unavailable.

**25.13 Notification Traceability**

Notifications shall be generated from verified system events.

Examples include:

Payment Verified

↓

Payment Notification

Driver Selected

↓

Driver Selection Notification

Pickup Completed

↓

Trip-Start Notification

TRIP ACTIVE

↓

Trip Active Notification

+

First Payment Release Notification

COMPLETED

↓

Completion Notification

+

Final Payment Release Notification

A notification shall not create the underlying event.

For example:

Notification Sent

≠

Trip Active

The actual trip state shall be determined by the backend.

**25.14 Communication Traceability**

Customer-driver communication shall primarily be associated with a confirmed trip.

The communication system shall support practical transportation coordination such as:

- Pickup directions.
- Arrival updates.
- Vehicle identification.
- Destination coordination.
- Delivery arrangements.
- Delay communication.
- Operational clarification.

Important inspection evidence shall remain in the inspection module.

Important financial information shall remain in the payment module.

Communication shall communicate these events rather than replace the modules responsible for them.

**25.15 Cancellation Traceability**

Cancellation shall remain subject to the approved cancellation rules.

The system shall consider:

- Current trip status.
- Cancellation initiator.
- Cancellation reason.
- Whether pickup occurred.
- Whether trip became active.
- Whether driver payments were released.
- Applicable financial consequences.
- Refund requirements.

The cancellation process shall not simply delete the trip.

The system shall preserve the trip and financial history.

**25.16 Dispute Traceability**

A dispute shall create a formal record associated with the relevant trip.

A dispute may involve:

- Vehicle condition.
- Pickup failure.
- Delivery issue.
- Payment issue.
- Driver conduct.
- Customer conduct.
- Destination issue.
- Other operational problems.

The dispute process shall be:

ISSUE IDENTIFIED

↓

DISPUTE CREATED

↓

TRIP = DISPUTED

↓

EVIDENCE REVIEW

↓

ADMINISTRATIVE DECISION

↓

FINANCIAL / OPERATIONAL ADJUSTMENT

↓

DISPUTE RESOLVED

The system shall preserve the original records while recording the resulting decision or adjustment.

**25.17 Administrative Traceability**

The administrator shall have controlled access to operational functions required to manage the MVP.

These may include:

- Driver verification.
- User management.
- Trip monitoring.
- Payment monitoring.
- Refund processing.
- Dispute management.
- Cancellation review.
- Inspection review.
- Financial reconciliation.
- Notification monitoring.
- Reporting.
- Audit review.
- System configuration where permitted.

Administrative privileges shall be role-based.

Not every administrator should automatically have unrestricted access to every operation.

**25.18 Database Traceability**

The database design shall provide persistent records for the major entities required by the MVP.

The final implementation shall accommodate, at minimum, records corresponding to:

- Users.
- Customers.
- Drivers.
- Driver verification.
- Vehicles.
- Transportation requests.
- Quotations.
- Trips.
- Trip statuses.
- Pickup inspections.
- Delivery inspections.
- Inspection photographs/evidence.
- Fuel records.
- Payments.
- Payment transactions.
- Trip Wallet transactions.
- Driver Wallet transactions.
- Withdrawals.
- Refunds.
- Adjustments.
- Disputes.
- Notifications.
- Communication messages.
- GPS/tracking records where applicable.
- Ratings/reviews where applicable.
- Audit logs.

The exact table structure shall follow the database design established in the relevant technical chapter.

**25.19 API Traceability**

The backend API shall provide controlled operations for the major system functions.

The API shall support, where applicable:

- Authentication.
- User management.
- Driver verification.
- Transportation requests.
- Quotations.
- Driver selection.
- Trip management.
- Payment processing.
- Wallet operations.
- Inspection operations.
- Fuel records.
- Tracking.
- Delivery.
- Notifications.
- Communication.
- Disputes.
- Cancellations.
- Ratings.
- Reporting.
- Administration.

The final endpoint structure shall remain consistent with the API and Backend Architecture requirements.

The frontend shall not directly manipulate protected database records.

**25.20 Security Traceability**

All MVP modules shall follow the established security requirements.

The system shall enforce:

- Authentication.
- Authorization.
- Role-based access control.
- Input validation.
- Secure API access.
- Protected financial operations.
- Protected administrative operations.
- Secure password handling.
- Secure payment-provider credentials.
- Protection against unauthorized wallet manipulation.
- Protection against duplicate financial operations.
- Audit logging.
- Appropriate session/token controls.

Security shall be implemented at the backend rather than relying solely on frontend restrictions.

**25.21 Financial Integrity Traceability**

Financial records shall be treated as sensitive and traceable system data.

The system shall ensure that:

Customer Payment

\=

Recorded Financial Transaction

and that:

Driver Release

\=

Authorized Wallet Transaction

and:

Withdrawal

\=

Available Driver Wallet Funds

The system shall prevent:

- Duplicate payment recording.
- Duplicate driver releases.
- Unauthorized withdrawals.
- Direct manipulation of wallet balances.
- Release of unavailable funds.
- Deletion of original financial transactions.

Financial corrections shall preferably be recorded as new adjustment or reversal transactions rather than silently modifying historical transactions.

**25.22 Audit Traceability**

Important system actions shall be traceable.

The audit trail shall capture, where applicable:

- Actor.
- Action.
- Entity.
- Entity ID.
- Previous state.
- New state.
- Timestamp.
- Relevant transaction/reference.
- IP/device information where appropriate.
- Additional context where required.

Important events shall include:

- Login/security events.
- Driver verification decisions.
- Driver selection.
- Payment confirmation.
- Booking.
- Inspection completion.
- Trip activation.
- Payment release.
- Refund.
- Withdrawal.
- Cancellation.
- Dispute decision.
- Administrative adjustment.

**25.23 Error Handling Traceability**

The system shall handle failures without corrupting the underlying business process.

Examples:

**Payment Failure**

Payment Attempt

↓

FAILED

↓

Trip Remains PAYMENT PENDING

↓

Customer May Retry

**Notification Failure**

Trip Event Successful

↓

Notification Attempt

↓

Notification FAILED

↓

Trip Event Remains Successful

**GPS Failure**

GPS Connection Lost

↓

Tracking Temporarily Unavailable

↓

Last Known Location Maintained

↓

Tracking Resumes

**Duplicate Payment Callback**

Callback Received

↓

Transaction Reference Checked

↓

Already Processed

↓

No Duplicate Transaction

**Duplicate Payment Release**

Release Request

↓

Release Reference Checked

↓

Already Released

↓

No Second Release

These principles shall remain consistent with the Error Handling, Logging and Audit requirements.

**25.24 Non-Functional Requirement Traceability**

The MVP shall satisfy the approved non-functional requirements relating to:

- Performance.
- Availability.
- Scalability.
- Security.
- Reliability.
- Maintainability.
- Usability.
- Data integrity.
- Auditability.
- Backup and recovery.
- Compatibility.
- Monitoring.

The implementation shall not focus solely on functional features while ignoring the operational requirements defined in Chapter 20.

**25.25 Integration Traceability**

The MVP may depend on external services for functions such as:

- Payment processing.
- SMS.
- Email.
- GPS/location services.
- Mapping.
- File/image storage.

Each external integration shall be isolated through appropriate service interfaces where practical.

The application should not become unnecessarily dependent on provider-specific implementation details.

External-service failures shall be handled according to the error-handling requirements.

**25.26 Testing Traceability**

Every critical MVP requirement shall be testable.

Testing shall cover at minimum:

**Functional Testing**

Verify that the system performs the required operations.

**Integration Testing**

Verify that connected modules operate correctly together.

**Security Testing**

Verify that unauthorized operations are rejected.

**Payment Testing**

Verify:

- Successful payment.
- Failed payment.
- Duplicate callback.
- Refund.
- Partial refund.
- First release.
- Final release.
- Withdrawal.
- Insufficient balance.

**Trip Lifecycle Testing**

Verify that invalid status transitions are rejected.

**Inspection Testing**

Verify that required inspection information cannot be incorrectly bypassed.

**Notification Testing**

Verify that important events generate appropriate notifications.

**Communication Testing**

Verify that users cannot access unauthorized trip communication.

**Performance Testing**

Verify that the system performs adequately under expected MVP load.

**25.27 Deployment Traceability**

The production deployment shall provide the infrastructure required for:

- Frontend application.
- Backend/API.
- Database.
- File storage where required.
- External integrations.
- Environment configuration.
- Logging.
- Monitoring.
- Backups.
- Security controls.

Production credentials shall not be hard-coded into the source code.

Environment-specific configuration shall be managed securely.

**25.28 MVP Acceptance Criteria**

The CarGo Kenya MVP shall not be considered functionally complete until the core transportation lifecycle can successfully operate from request to completion.

At minimum, the following scenario shall work:

CUSTOMER REGISTERS

↓

CREATES REQUEST

↓

DRIVER SUBMITS QUOTATION

↓

CUSTOMER SELECTS DRIVER

↓

PRICE CONFIRMED

↓

CUSTOMER PAYS

↓

PAYMENT VERIFIED

↓

TRIP BOOKED

↓

DRIVER ARRIVES

↓

PICKUP INSPECTION

↓

VEHICLE HANDOVER

↓

FUEL PROCEDURES

↓

DRIVER SELECTS START TRIP

↓

CUSTOMER CONFIRMS

↓

TRIP ACTIVE

↓

FIRST 50% RELEASED

↓

IN TRANSIT

↓

DESTINATION REACHED

↓

DELIVERY INSPECTION

↓

VEHICLE HANDOVER

↓

CUSTOMER CONFIRMS

↓

DRIVER CONFIRMS

↓

COMPLETED

↓

FINAL 50% RELEASED

↓

DRIVER WALLET

↓

WITHDRAWAL

If this complete lifecycle cannot be successfully executed, the core MVP shall not be considered complete.

**25.29 MVP Completion Checklist**

Before declaring the MVP ready, the development team shall verify the following.

**Customer**

- Customer registration works.
- Customer authentication works.
- Customer can create a transportation request.
- Customer can view quotations.
- Customer can select a driver.
- Customer can make payment.
- Customer can view trip status.
- Customer can confirm trip commencement.
- Customer can monitor the trip.
- Customer can confirm delivery.
- Customer can view payment history.
- Customer can receive notifications.
- Customer can communicate with the assigned driver after booking.

**Driver**

- Driver registration works.
- Driver verification works.
- Driver can view eligible requests.
- Driver can submit quotations.
- Driver receives selection notification.
- Driver can view assigned trip.
- Driver can complete pickup procedures.
- Driver can perform vehicle inspection.
- Driver can capture required evidence.
- Driver can record odometer and fuel.
- Driver can select START TRIP.
- Driver can operate the active trip.
- Driver can complete delivery.
- Driver can view earnings.
- Driver can view pending earnings.
- Driver can withdraw available earnings.

**Trip**

- Trip statuses are correctly implemented.
- Invalid status transitions are rejected.
- Trip references are unique.
- Trip history is preserved.
- Cancellation is supported.
- Disputes are supported.
- Trip completion is controlled.

**Inspection**

- Pickup inspection is supported.
- Delivery inspection is supported.
- Photographs are stored correctly.
- Odometer readings are recorded.
- Fuel level is recorded.
- Damage is recorded.
- Handover confirmation is recorded.
- Inspection evidence is linked to the correct trip.

**Payment**

- Full customer payment is supported.
- Payment verification works.
- Payment transactions are recorded.
- Trip Wallet is created/maintained.
- Driver fee is separated from fuel.
- CarGo fee is recorded separately.
- First 50% release works.
- Final 50% release works.
- Duplicate releases are prevented.
- Refunds are supported.
- Adjustments are supported.
- Financial reconciliation is possible.

**Driver Wallet**

- Released earnings are recorded.
- Pending earnings are displayed separately.
- Available balance is correct.
- Withdrawal is supported.
- Withdrawal cannot exceed available balance.
- Wallet transactions are traceable.

**Communication**

- Important notifications are generated.
- Notifications have read/unread status.
- Notification failures are logged.
- Duplicate notifications are prevented where applicable.
- Customer-driver communication is protected.
- Unauthorized messages cannot be accessed.

**Administration**

- Administrator authentication works.
- Role-based permissions work.
- Driver verification can be reviewed.
- Trips can be monitored.
- Disputes can be reviewed.
- Refunds can be processed according to authorization.
- Financial information can be reconciled.
- Audit records can be reviewed.
- Reports can be accessed.

**Technical**

- Database relationships are correct.
- APIs are secured.
- Validation is implemented.
- Errors are handled consistently.
- Logging is implemented.
- Audit trail is implemented.
- Backups are configured.
- Production environment is secured.
- External integrations are tested.
- Deployment process is documented.

**25.30 Requirements That Are Explicitly Outside the MVP**

The following shall not be treated as mandatory MVP requirements unless separately approved.

These include:

- AI-powered customer service.
- Automated dispute negotiation.
- Advanced financial products.
- Cryptocurrency payments.
- International payment processing.
- Driver loans.
- Customer credit facilities.
- Complex automated accounting integrations.
- Advanced tax automation.
- Automated fuel-station settlement.
- Voice calling infrastructure.
- Video calling.
- WhatsApp automation.
- Advanced marketing automation.
- Advanced AI-generated communication.
- Complex predictive analytics beyond the approved MVP reporting requirements.
- Large-scale multi-provider payment infrastructure.

These features may be considered during future development phases.

Their exclusion from the MVP is intentional and shall prevent unnecessary scope expansion.

**25.31 MVP Scope-Control Principle**

The development team shall follow the principle:

**If a feature is not required to complete, secure, operate, monitor, or support the approved MVP transportation lifecycle, it should not automatically be added to the MVP.**

New functionality should therefore be evaluated against:

1.  Business necessity.
2.  MVP scope.
3.  Security implications.
4.  Database impact.
5.  API impact.
6.  Testing impact.
7.  Operational impact.
8.  Development effort.
9.  Whether the feature can reasonably be deferred.

This prevents scope creep during implementation.

**25.32 Final System Requirement Baseline**

After approval of Chapters 1–25, the requirements contained in these chapters shall form the baseline for the CarGo Kenya MVP system design.

The baseline shall consist of:

BRD / MVP

↓

SYSTEM REQUIREMENTS

↓

FUNCTIONAL MODULES

↓

DATABASE DESIGN

↓

API DESIGN

↓

UI/UX IMPLEMENTATION

↓

TESTING

↓

DEPLOYMENT

Changes to core requirements after this point should be treated as controlled changes rather than informal modifications.

Any significant change should identify:

- Requirement affected.
- Module affected.
- Database impact.
- API impact.
- UI impact.
- Security impact.
- Testing impact.
- Deployment impact.

**25.33 Final CarGo Kenya MVP Architecture**

The complete MVP can now be represented as:

CARGO KENYA MVP

│

┌──────────────────────┼──────────────────────┐

│ │ │

CUSTOMER DRIVER ADMIN

│ │ │

└───────────────┬──────┴──────────────┬───────┘

│ │

↓ ↓

TRANSPORTATION REQUEST ADMINISTRATION

│

↓

QUOTATIONS

│

↓

DRIVER SELECTED

│

↓

PAYMENT PENDING

│

↓

PAYMENT VERIFIED

│

↓

BOOKED

│

↓

PICKUP PENDING

│

↓

PICKUP INSPECTION

│

↓

TRIP START PENDING

│

↓

TRIP ACTIVE

│

┌───────┴────────┐

↓ ↓

FIRST 50% GPS/TRACKING

RELEASE

│ │

└───────┬────────┘

↓

IN TRANSIT

│

↓

DELIVERY PENDING

│

↓

DELIVERED

│

↓

COMPLETED

│

↓

FINAL 50%

RELEASE

│

↓

DRIVER WALLET

│

↓

WITHDRAWAL

Supporting every stage are:

PAYMENT & WALLET

VEHICLE INSPECTION

FUEL MANAGEMENT

GPS / TRACKING

NOTIFICATIONS

COMMUNICATION

DISPUTES

REPORTING

AUDIT & LOGGING

SECURITY

DATABASE

API

INTEGRATIONS

TESTING

DEPLOYMENT

**25.34 Final MVP Business Rules**

The following rules shall be treated as the final consolidated business rules for the MVP.

**Rule 1**

A customer must create a valid transportation request before receiving quotations.

**Rule 2**

Only eligible drivers may submit quotations.

**Rule 3**

The customer selects the driver.

**Rule 4**

The agreed price must be confirmed before payment.

**Rule 5**

The customer must successfully pay the required full trip amount before the trip becomes BOOKED.

**Rule 6**

The driver's transportation fee shall not be immediately released at booking.

**Rule 7**

The Trip Wallet shall maintain the financial records associated with the trip.

**Rule 8**

The fuel budget shall remain separate from driver transportation earnings.

**Rule 9**

The CarGo Kenya platform fee shall be separately recorded.

**Rule 10**

Pickup procedures and inspection requirements must be completed before the trip can proceed to trip-start confirmation.

**Rule 11**

The trip shall not become TRIP ACTIVE solely because the driver presses START TRIP.

**Rule 12**

Customer confirmation is required for official trip commencement.

**Rule 13**

The first 50% of the driver's transportation fee shall only become eligible for release when TRIP ACTIVE requirements have been satisfied.

**Rule 14**

The final 50% shall only become eligible for release after the trip becomes COMPLETED and the required delivery/completion conditions are satisfied.

**Rule 15**

Released driver earnings shall move into the driver's Personal Wallet.

**Rule 16**

Pending driver earnings shall not be withdrawable.

**Rule 17**

A driver shall not withdraw directly from a Trip Wallet.

**Rule 18**

The backend shall determine all financial release amounts.

**Rule 19**

Duplicate financial transactions shall be prevented.

**Rule 20**

Refunds and adjustments shall be recorded as separate financial transactions.

**Rule 21**

Disputes shall preserve the underlying trip and financial history.

**Rule 22**

Important system events shall generate appropriate notifications.

**Rule 23**

Notification failure shall not automatically invalidate a successful underlying transaction.

**Rule 24**

Users shall only access information and communication for which they are authorized.

**Rule 25**

Important financial, operational, and administrative actions shall be auditable.

**Rule 26**

The system shall maintain consistent trip status across all modules.

**Rule 27**

The system shall prevent invalid state transitions.

**Rule 28**

Inspection evidence shall remain linked to the relevant inspection record.

**Rule 29**

The system shall preserve important historical records rather than silently deleting them.

**Rule 30**

Features outside the approved MVP scope shall not be introduced without controlled approval.

**25.0 MVP TRACEABILITY / FINAL SYSTEM REQUIREMENTS**

**25.1 Purpose**

The MVP Traceability and Final System Requirements section shall provide the final consolidated reference for the CarGo Kenya MVP.

The purpose of this section is to ensure that every major business requirement established in the CarGo Kenya BRD and MVP definition can be traced to a corresponding system requirement, functional module, business rule, data requirement, API requirement, security requirement, testing requirement, and operational requirement.

This section shall therefore serve as the final requirements checkpoint before implementation.

The development team shall use this section to confirm that:

- Every approved MVP capability has been represented in the system design.
- Every major business process has a corresponding system process.
- Trip statuses remain consistent throughout the system.
- Payment and wallet rules remain consistent with the approved financial model.
- Vehicle inspection requirements are represented in the system.
- Driver and customer responsibilities are clearly defined.
- Notifications correspond to actual system events.
- GPS and trip tracking requirements are represented.
- Delivery and completion requirements are represented.
- Disputes and cancellations are supported.
- Administrative controls are represented.
- Security and authorization requirements are enforced.
- Important system actions are auditable.
- The database contains the information required by the operational modules.
- APIs support the approved system workflows.
- The MVP does not accidentally expand into unnecessary future functionality.

The final implementation shall therefore be based on the requirements established throughout Chapters 1–24 and consolidated in this chapter.

**25.2 MVP Requirements Traceability Principle**

The CarGo Kenya system shall follow the principle:

**Every approved business requirement must have a corresponding technical implementation path.**

The relationship shall generally be:

BUSINESS REQUIREMENT

↓

MVP REQUIREMENT

↓

SYSTEM REQUIREMENT

↓

MODULE

↓

DATABASE / API

↓

USER INTERFACE

↓

TEST

↓

DEPLOYED FEATURE

A requirement shall not be considered fully implemented merely because a screen exists.

The underlying:

- business rule,
- database record,
- API operation,
- authorization,
- validation,
- status transition,
- notification,
- audit record,
- and testing requirement

must also be considered where applicable.

**25.3 Final MVP Scope**

The CarGo Kenya MVP shall provide the core digital platform required to manage vehicle transportation assignments from request creation through completion.

The MVP shall primarily support:

1.  Customer registration and account management.
2.  Driver registration and verification.
3.  Transportation requests.
4.  Driver quotation.
5.  Driver selection.
6.  Trip management.
7.  Payment processing.
8.  Trip Wallet management.
9.  Driver Personal Wallet management.
10. Vehicle pickup inspection.
11. Vehicle delivery inspection.
12. Vehicle handover procedures.
13. Fuel recording.
14. Trip commencement confirmation.
15. GPS/trip tracking.
16. Delivery confirmation.
17. Trip completion.
18. Notifications.
19. Customer-driver communication.
20. Cancellations.
21. Disputes.
22. Driver earnings.
23. Withdrawals.
24. Administration.
25. Reporting and dashboards.
26. Database management.
27. API and backend services.
28. Security.
29. Error handling and audit logging.
30. Testing.
31. Deployment and maintenance.

These capabilities shall remain connected to the agreed CarGo Kenya transportation lifecycle.

**25.4 Core Trip Lifecycle Traceability**

The official trip lifecycle shall remain consistent throughout the system.

The MVP shall use the following primary trip statuses:

REQUESTED

↓

QUOTING

↓

DRIVER SELECTED

↓

PAYMENT PENDING

↓

BOOKED

↓

PICKUP PENDING

↓

PICKUP INSPECTION

↓

TRIP START PENDING

↓

TRIP ACTIVE

↓

IN TRANSIT

↓

DELIVERY PENDING

↓

DELIVERED

↓

COMPLETED

The system shall also support exceptional states:

DISPUTED

CANCELLED

These statuses shall not be independently reinvented by individual modules.

The Trip Management Module shall remain the authoritative source for the official trip status.

Other modules shall reference the trip status rather than creating conflicting independent trip lifecycles.

**25.5 Trip Status Definitions**

The following definitions shall remain authoritative for the MVP.

**REQUESTED**

The customer has submitted a transportation request.

**QUOTING**

Eligible drivers may submit quotations for the request.

**DRIVER SELECTED**

The customer has selected a driver.

**PAYMENT PENDING**

The required payment has not yet been successfully completed.

**BOOKED**

The customer's required payment has been successfully verified and the trip has been officially confirmed.

**PICKUP PENDING**

The vehicle has not yet undergone the required pickup procedures.

**PICKUP INSPECTION**

The driver is at the pickup location and the required inspection, photographs, odometer, fuel recording, and vehicle handover procedures are being completed.

**TRIP START PENDING**

Pickup procedures have been completed, but the trip has not yet officially started because the required trip-start confirmation has not been completed.

**TRIP ACTIVE**

The driver has selected START TRIP and the customer has confirmed commencement after the required pickup procedures have been completed.

At this stage, the first 50% of the driver's transportation fee becomes eligible for release.

**IN TRANSIT**

The vehicle is actively being transported toward the destination.

**DELIVERY PENDING**

The vehicle has reached or is approaching the destination and delivery procedures remain to be completed.

**DELIVERED**

The vehicle has been delivered and the required delivery inspection and handover procedures have been completed.

**COMPLETED**

The required customer and driver completion confirmations have been completed and the trip has been formally closed.

The remaining 50% of the driver's transportation fee becomes eligible for release.

**DISPUTED**

A formal issue has been raised that requires administrative review.

**CANCELLED**

The trip has been cancelled according to the applicable cancellation procedures.

**25.6 Requirement Traceability Matrix**

The following matrix provides the final high-level mapping of the major MVP requirements.

| **Requirement Area** | **Primary Module** | **Supporting Modules** | **Final MVP Requirement** |
| --- | --- | --- | --- |
| Customer Accounts | User/Account Module | Security, Notification | Customers can register and manage accounts |
| Driver Accounts | Driver Module | Verification, Security | Drivers can register and submit required information |
| Driver Verification | Driver Verification | Admin, Notification | Drivers must satisfy required verification procedures |
| Transportation Request | Trip Management | Customer, Notification | Customers can create transportation requests |
| Driver Quotation | Quotation/Trip Module | Notification | Eligible drivers can submit quotations |
| Driver Selection | Trip Management | Notification | Customer can select an eligible driver |
| Payment | Payment Module | Trip Wallet, Integration | Customer pays full agreed amount |
| Booking | Trip Management | Payment, Notification | Successful payment causes booking confirmation |
| Pickup | Pickup/Inspection | Trip, GPS | Driver can execute pickup procedures |
| Vehicle Inspection | Inspection Module | Evidence, Communication | Required vehicle condition data is captured |
| Fuel | Fuel/Trip Operations | Payment | Fuel allocation and records are maintained |
| Trip Start | Trip Management | Inspection, Notification, Payment | Trip starts only after required confirmation |
| First Payment Release | Wallet | Trip, Inspection | 50% released at TRIP ACTIVE |
| GPS Tracking | Tracking | Trip, Notification | Trip location/progress can be monitored |
| Delivery | Delivery Module | Inspection, Notification | Delivery procedures are recorded |
| Final Payment Release | Wallet | Trip, Delivery | Remaining 50% released at COMPLETED |
| Driver Wallet | Wallet Module | Payment | Released earnings become available |
| Withdrawal | Wallet Module | Payment Integration | Driver can request withdrawal of available funds |
| Notifications | Notification Module | All major modules | Important events are communicated |
| Communication | Communication Module | Trip | Customer and driver can communicate after booking |
| Cancellation | Trip/Dispute | Payment, Notification | Cancellation is recorded and financially processed |
| Disputes | Dispute Module | Inspection, Payment, Admin | Disputes can be raised and reviewed |
| Administration | Admin Module | All modules | Authorized administrators can manage operations |
| Reporting | Reporting Module | Database | Operational information can be viewed |
| Audit | Audit Module | All sensitive modules | Important actions are traceable |
| Security | Security/NFR | All modules | Access is authenticated and authorized |
| API | Backend Architecture | All modules | Core system functionality is exposed through controlled APIs |
| Database | Data Management | All modules | System data is stored consistently |
| Testing | QA  | All modules | MVP requirements are testable |
| Deployment | Infrastructure | All modules | MVP can be deployed and maintained |

**25.7 Customer Journey Traceability**

The complete customer journey shall be supported as follows:

REGISTER

↓

CREATE TRANSPORTATION REQUEST

↓

WAIT FOR QUOTATIONS

↓

REVIEW QUOTATIONS

↓

SELECT DRIVER

↓

REVIEW AGREED PRICE

↓

PAY FULL TRIP COST

↓

BOOKING CONFIRMED

↓

MONITOR PICKUP

↓

REVIEW INSPECTION INFORMATION

↓

CONFIRM TRIP START

↓

MONITOR TRIP

↓

RECEIVE DELIVERY NOTIFICATION

↓

CONFIRM DELIVERY

↓

TRIP COMPLETED

↓

REVIEW PAYMENT / TRIP HISTORY

↓

RATE DRIVER WHERE APPLICABLE

The customer shall not be required to perform technical system operations that belong to the backend.

For example, the customer shall not manually update:

- payment status,
- trip status,
- driver earnings,
- wallet balances,
- inspection completion,
- or GPS status.

These shall be controlled by the appropriate backend processes.

**25.8 Driver Journey Traceability**

The complete driver journey shall be:

REGISTER

↓

SUBMIT VERIFICATION INFORMATION

↓

ACCOUNT VERIFIED

↓

VIEW ELIGIBLE REQUESTS

↓

SUBMIT QUOTATION

↓

CUSTOMER SELECTS DRIVER

↓

BOOKING CONFIRMED

↓

VIEW PICKUP DETAILS

↓

ARRIVE AT PICKUP

↓

PERFORM PICKUP INSPECTION

↓

CAPTURE REQUIRED EVIDENCE

↓

COMPLETE HANDOVER

↓

COMPLETE FUEL PROCEDURES WHERE REQUIRED

↓

SELECT START TRIP

↓

CUSTOMER CONFIRMS

↓

TRIP ACTIVE

↓

FIRST 50% RELEASE

↓

IN TRANSIT

↓

ARRIVE AT DESTINATION

↓

PERFORM DELIVERY PROCEDURES

↓

CUSTOMER CONFIRMS DELIVERY

↓

DRIVER CONFIRMS COMPLETION

↓

COMPLETED

↓

FINAL 50% RELEASE

↓

DRIVER WALLET

↓

WITHDRAW AVAILABLE FUNDS

**25.9 Payment Traceability**

The approved payment architecture shall remain:

CUSTOMER

│

│ FULL PAYMENT

↓

TRIP WALLET

│

├───────────────┐

↓ ↓

TRIP ACTIVE COMPLETED

↓ ↓

50% RELEASE 50% RELEASE

│ │

└───────┬───────┘

↓

DRIVER PERSONAL WALLET

↓

WITHDRAWAL

The customer's payment shall consist of the approved financial components:

Driver Transportation Fee

+

Fuel Budget

+

CarGo Kenya Platform Fee

\=

Total Trip Cost

The driver's Personal Wallet shall only receive released driver earnings.

The fuel budget shall not automatically be treated as driver income.

The CarGo Kenya platform fee shall remain separately identifiable.

**25.10 Payment Release Traceability**

The first 50% release shall require:

PICKUP COMPLETED

+

INSPECTION COMPLETED

+

REQUIRED EVIDENCE CAPTURED

+

HANDOVER COMPLETED

+

FUELING REQUIREMENTS COMPLETED

+

DRIVER START TRIP

+

CUSTOMER CONFIRMATION

+

TRIP = TRIP ACTIVE

Only after the required conditions have been verified shall the backend release the first 50%.

The final 50% shall require:

DESTINATION REACHED

+

DELIVERY INSPECTION COMPLETED

+

DELIVERY HANDOVER COMPLETED

+

CUSTOMER CONFIRMATION

+

DRIVER CONFIRMATION

+

TRIP = COMPLETED

The frontend shall never determine the release amount.

The backend shall calculate the permitted amount from the stored trip financial information.

**25.11 Vehicle Inspection Traceability**

The inspection requirements established in the Vehicle Inspection and Handover Module shall remain mandatory where applicable.

The pickup inspection shall support recording of:

- Vehicle identity.
- Vehicle condition.
- Photographs.
- Odometer reading.
- Fuel level.
- Existing damage.
- New damage where identified.
- Inspection timestamp.
- Inspector/driver identity.
- Handover confirmation.

The delivery inspection shall support equivalent completion information required to establish the vehicle's condition at delivery.

Inspection evidence shall remain associated with the inspection record.

It shall not be treated as ordinary chat content.

**25.12 GPS and Tracking Traceability**

GPS functionality shall support the operational requirement of monitoring an active transportation assignment.

The system shall support, where applicable:

- Tracking activation.
- Current location.
- Last known location.
- Tracking status.
- Tracking interruptions.
- Meaningful trip milestones.
- Destination arrival.
- Tracking completion.

The system shall not treat temporary GPS loss as automatic trip failure.

The last known location may remain available while tracking is temporarily unavailable.

**25.13 Notification Traceability**

Notifications shall be generated from verified system events.

Examples include:

Payment Verified

↓

Payment Notification

Driver Selected

↓

Driver Selection Notification

Pickup Completed

↓

Trip-Start Notification

TRIP ACTIVE

↓

Trip Active Notification

+

First Payment Release Notification

COMPLETED

↓

Completion Notification

+

Final Payment Release Notification

A notification shall not create the underlying event.

For example:

Notification Sent

≠

Trip Active

The actual trip state shall be determined by the backend.

**25.14 Communication Traceability**

Customer-driver communication shall primarily be associated with a confirmed trip.

The communication system shall support practical transportation coordination such as:

- Pickup directions.
- Arrival updates.
- Vehicle identification.
- Destination coordination.
- Delivery arrangements.
- Delay communication.
- Operational clarification.

Important inspection evidence shall remain in the inspection module.

Important financial information shall remain in the payment module.

Communication shall communicate these events rather than replace the modules responsible for them.

**25.15 Cancellation Traceability**

Cancellation shall remain subject to the approved cancellation rules.

The system shall consider:

- Current trip status.
- Cancellation initiator.
- Cancellation reason.
- Whether pickup occurred.
- Whether trip became active.
- Whether driver payments were released.
- Applicable financial consequences.
- Refund requirements.

The cancellation process shall not simply delete the trip.

The system shall preserve the trip and financial history.

**25.16 Dispute Traceability**

A dispute shall create a formal record associated with the relevant trip.

A dispute may involve:

- Vehicle condition.
- Pickup failure.
- Delivery issue.
- Payment issue.
- Driver conduct.
- Customer conduct.
- Destination issue.
- Other operational problems.

The dispute process shall be:

ISSUE IDENTIFIED

↓

DISPUTE CREATED

↓

TRIP = DISPUTED

↓

EVIDENCE REVIEW

↓

ADMINISTRATIVE DECISION

↓

FINANCIAL / OPERATIONAL ADJUSTMENT

↓

DISPUTE RESOLVED

The system shall preserve the original records while recording the resulting decision or adjustment.

**25.17 Administrative Traceability**

The administrator shall have controlled access to operational functions required to manage the MVP.

These may include:

- Driver verification.
- User management.
- Trip monitoring.
- Payment monitoring.
- Refund processing.
- Dispute management.
- Cancellation review.
- Inspection review.
- Financial reconciliation.
- Notification monitoring.
- Reporting.
- Audit review.
- System configuration where permitted.

Administrative privileges shall be role-based.

Not every administrator should automatically have unrestricted access to every operation.

**25.18 Database Traceability**

The database design shall provide persistent records for the major entities required by the MVP.

The final implementation shall accommodate, at minimum, records corresponding to:

- Users.
- Customers.
- Drivers.
- Driver verification.
- Vehicles.
- Transportation requests.
- Quotations.
- Trips.
- Trip statuses.
- Pickup inspections.
- Delivery inspections.
- Inspection photographs/evidence.
- Fuel records.
- Payments.
- Payment transactions.
- Trip Wallet transactions.
- Driver Wallet transactions.
- Withdrawals.
- Refunds.
- Adjustments.
- Disputes.
- Notifications.
- Communication messages.
- GPS/tracking records where applicable.
- Ratings/reviews where applicable.
- Audit logs.

The exact table structure shall follow the database design established in the relevant technical chapter.

**25.19 API Traceability**

The backend API shall provide controlled operations for the major system functions.

The API shall support, where applicable:

- Authentication.
- User management.
- Driver verification.
- Transportation requests.
- Quotations.
- Driver selection.
- Trip management.
- Payment processing.
- Wallet operations.
- Inspection operations.
- Fuel records.
- Tracking.
- Delivery.
- Notifications.
- Communication.
- Disputes.
- Cancellations.
- Ratings.
- Reporting.
- Administration.

The final endpoint structure shall remain consistent with the API and Backend Architecture requirements.

The frontend shall not directly manipulate protected database records.

**25.20 Security Traceability**

All MVP modules shall follow the established security requirements.

The system shall enforce:

- Authentication.
- Authorization.
- Role-based access control.
- Input validation.
- Secure API access.
- Protected financial operations.
- Protected administrative operations.
- Secure password handling.
- Secure payment-provider credentials.
- Protection against unauthorized wallet manipulation.
- Protection against duplicate financial operations.
- Audit logging.
- Appropriate session/token controls.

Security shall be implemented at the backend rather than relying solely on frontend restrictions.

**25.21 Financial Integrity Traceability**

Financial records shall be treated as sensitive and traceable system data.

The system shall ensure that:

Customer Payment

\=

Recorded Financial Transaction

and that:

Driver Release

\=

Authorized Wallet Transaction

and:

Withdrawal

\=

Available Driver Wallet Funds

The system shall prevent:

- Duplicate payment recording.
- Duplicate driver releases.
- Unauthorized withdrawals.
- Direct manipulation of wallet balances.
- Release of unavailable funds.
- Deletion of original financial transactions.

Financial corrections shall preferably be recorded as new adjustment or reversal transactions rather than silently modifying historical transactions.

**25.22 Audit Traceability**

Important system actions shall be traceable.

The audit trail shall capture, where applicable:

- Actor.
- Action.
- Entity.
- Entity ID.
- Previous state.
- New state.
- Timestamp.
- Relevant transaction/reference.
- IP/device information where appropriate.
- Additional context where required.

Important events shall include:

- Login/security events.
- Driver verification decisions.
- Driver selection.
- Payment confirmation.
- Booking.
- Inspection completion.
- Trip activation.
- Payment release.
- Refund.
- Withdrawal.
- Cancellation.
- Dispute decision.
- Administrative adjustment.

**25.23 Error Handling Traceability**

The system shall handle failures without corrupting the underlying business process.

Examples:

**Payment Failure**

Payment Attempt

↓

FAILED

↓

Trip Remains PAYMENT PENDING

↓

Customer May Retry

**Notification Failure**

Trip Event Successful

↓

Notification Attempt

↓

Notification FAILED

↓

Trip Event Remains Successful

**GPS Failure**

GPS Connection Lost

↓

Tracking Temporarily Unavailable

↓

Last Known Location Maintained

↓

Tracking Resumes

**Duplicate Payment Callback**

Callback Received

↓

Transaction Reference Checked

↓

Already Processed

↓

No Duplicate Transaction

**Duplicate Payment Release**

Release Request

↓

Release Reference Checked

↓

Already Released

↓

No Second Release

These principles shall remain consistent with the Error Handling, Logging and Audit requirements.

**25.24 Non-Functional Requirement Traceability**

The MVP shall satisfy the approved non-functional requirements relating to:

- Performance.
- Availability.
- Scalability.
- Security.
- Reliability.
- Maintainability.
- Usability.
- Data integrity.
- Auditability.
- Backup and recovery.
- Compatibility.
- Monitoring.

The implementation shall not focus solely on functional features while ignoring the operational requirements defined in Chapter 20.

**25.25 Integration Traceability**

The MVP may depend on external services for functions such as:

- Payment processing.
- SMS.
- Email.
- GPS/location services.
- Mapping.
- File/image storage.

Each external integration shall be isolated through appropriate service interfaces where practical.

The application should not become unnecessarily dependent on provider-specific implementation details.

External-service failures shall be handled according to the error-handling requirements.

**25.26 Testing Traceability**

Every critical MVP requirement shall be testable.

Testing shall cover at minimum:

**Functional Testing**

Verify that the system performs the required operations.

**Integration Testing**

Verify that connected modules operate correctly together.

**Security Testing**

Verify that unauthorized operations are rejected.

**Payment Testing**

Verify:

- Successful payment.
- Failed payment.
- Duplicate callback.
- Refund.
- Partial refund.
- First release.
- Final release.
- Withdrawal.
- Insufficient balance.

**Trip Lifecycle Testing**

Verify that invalid status transitions are rejected.

**Inspection Testing**

Verify that required inspection information cannot be incorrectly bypassed.

**Notification Testing**

Verify that important events generate appropriate notifications.

**Communication Testing**

Verify that users cannot access unauthorized trip communication.

**Performance Testing**

Verify that the system performs adequately under expected MVP load.

**25.27 Deployment Traceability**

The production deployment shall provide the infrastructure required for:

- Frontend application.
- Backend/API.
- Database.
- File storage where required.
- External integrations.
- Environment configuration.
- Logging.
- Monitoring.
- Backups.
- Security controls.

Production credentials shall not be hard-coded into the source code.

Environment-specific configuration shall be managed securely.

**25.28 MVP Acceptance Criteria**

The CarGo Kenya MVP shall not be considered functionally complete until the core transportation lifecycle can successfully operate from request to completion.

At minimum, the following scenario shall work:

CUSTOMER REGISTERS

↓

CREATES REQUEST

↓

DRIVER SUBMITS QUOTATION

↓

CUSTOMER SELECTS DRIVER

↓

PRICE CONFIRMED

↓

CUSTOMER PAYS

↓

PAYMENT VERIFIED

↓

TRIP BOOKED

↓

DRIVER ARRIVES

↓

PICKUP INSPECTION

↓

VEHICLE HANDOVER

↓

FUEL PROCEDURES

↓

DRIVER SELECTS START TRIP

↓

CUSTOMER CONFIRMS

↓

TRIP ACTIVE

↓

FIRST 50% RELEASED

↓

IN TRANSIT

↓

DESTINATION REACHED

↓

DELIVERY INSPECTION

↓

VEHICLE HANDOVER

↓

CUSTOMER CONFIRMS

↓

DRIVER CONFIRMS

↓

COMPLETED

↓

FINAL 50% RELEASED

↓

DRIVER WALLET

↓

WITHDRAWAL

If this complete lifecycle cannot be successfully executed, the core MVP shall not be considered complete.

**25.29 MVP Completion Checklist**

Before declaring the MVP ready, the development team shall verify the following.

**Customer**

- Customer registration works.
- Customer authentication works.
- Customer can create a transportation request.
- Customer can view quotations.
- Customer can select a driver.
- Customer can make payment.
- Customer can view trip status.
- Customer can confirm trip commencement.
- Customer can monitor the trip.
- Customer can confirm delivery.
- Customer can view payment history.
- Customer can receive notifications.
- Customer can communicate with the assigned driver after booking.

**Driver**

- Driver registration works.
- Driver verification works.
- Driver can view eligible requests.
- Driver can submit quotations.
- Driver receives selection notification.
- Driver can view assigned trip.
- Driver can complete pickup procedures.
- Driver can perform vehicle inspection.
- Driver can capture required evidence.
- Driver can record odometer and fuel.
- Driver can select START TRIP.
- Driver can operate the active trip.
- Driver can complete delivery.
- Driver can view earnings.
- Driver can view pending earnings.
- Driver can withdraw available earnings.

**Trip**

- Trip statuses are correctly implemented.
- Invalid status transitions are rejected.
- Trip references are unique.
- Trip history is preserved.
- Cancellation is supported.
- Disputes are supported.
- Trip completion is controlled.

**Inspection**

- Pickup inspection is supported.
- Delivery inspection is supported.
- Photographs are stored correctly.
- Odometer readings are recorded.
- Fuel level is recorded.
- Damage is recorded.
- Handover confirmation is recorded.
- Inspection evidence is linked to the correct trip.

**Payment**

- Full customer payment is supported.
- Payment verification works.
- Payment transactions are recorded.
- Trip Wallet is created/maintained.
- Driver fee is separated from fuel.
- CarGo fee is recorded separately.
- First 50% release works.
- Final 50% release works.
- Duplicate releases are prevented.
- Refunds are supported.
- Adjustments are supported.
- Financial reconciliation is possible.

**Driver Wallet**

- Released earnings are recorded.
- Pending earnings are displayed separately.
- Available balance is correct.
- Withdrawal is supported.
- Withdrawal cannot exceed available balance.
- Wallet transactions are traceable.

**Communication**

- Important notifications are generated.
- Notifications have read/unread status.
- Notification failures are logged.
- Duplicate notifications are prevented where applicable.
- Customer-driver communication is protected.
- Unauthorized messages cannot be accessed.

**Administration**

- Administrator authentication works.
- Role-based permissions work.
- Driver verification can be reviewed.
- Trips can be monitored.
- Disputes can be reviewed.
- Refunds can be processed according to authorization.
- Financial information can be reconciled.
- Audit records can be reviewed.
- Reports can be accessed.

**Technical**

- Database relationships are correct.
- APIs are secured.
- Validation is implemented.
- Errors are handled consistently.
- Logging is implemented.
- Audit trail is implemented.
- Backups are configured.
- Production environment is secured.
- External integrations are tested.
- Deployment process is documented.

**25.30 Requirements That Are Explicitly Outside the MVP**

The following shall not be treated as mandatory MVP requirements unless separately approved.

These include:

- AI-powered customer service.
- Automated dispute negotiation.
- Advanced financial products.
- Cryptocurrency payments.
- International payment processing.
- Driver loans.
- Customer credit facilities.
- Complex automated accounting integrations.
- Advanced tax automation.
- Automated fuel-station settlement.
- Voice calling infrastructure.
- Video calling.
- WhatsApp automation.
- Advanced marketing automation.
- Advanced AI-generated communication.
- Complex predictive analytics beyond the approved MVP reporting requirements.
- Large-scale multi-provider payment infrastructure.

These features may be considered during future development phases.

Their exclusion from the MVP is intentional and shall prevent unnecessary scope expansion.

**25.31 MVP Scope-Control Principle**

The development team shall follow the principle:

**If a feature is not required to complete, secure, operate, monitor, or support the approved MVP transportation lifecycle, it should not automatically be added to the MVP.**

New functionality should therefore be evaluated against:

1.  Business necessity.
2.  MVP scope.
3.  Security implications.
4.  Database impact.
5.  API impact.
6.  Testing impact.
7.  Operational impact.
8.  Development effort.
9.  Whether the feature can reasonably be deferred.

This prevents scope creep during implementation.

**25.32 Final System Requirement Baseline**

After approval of Chapters 1–25, the requirements contained in these chapters shall form the baseline for the CarGo Kenya MVP system design.

The baseline shall consist of:

BRD / MVP

↓

SYSTEM REQUIREMENTS

↓

FUNCTIONAL MODULES

↓

DATABASE DESIGN

↓

API DESIGN

↓

UI/UX IMPLEMENTATION

↓

TESTING

↓

DEPLOYMENT

Changes to core requirements after this point should be treated as controlled changes rather than informal modifications.

Any significant change should identify:

- Requirement affected.
- Module affected.
- Database impact.
- API impact.
- UI impact.
- Security impact.
- Testing impact.
- Deployment impact.

**25.33 Final CarGo Kenya MVP Architecture**

The complete MVP can now be represented as:

CARGO KENYA MVP

│

┌──────────────────────┼──────────────────────┐

│ │ │

CUSTOMER DRIVER ADMIN

│ │ │

└───────────────┬──────┴──────────────┬───────┘

│ │

↓ ↓

TRANSPORTATION REQUEST ADMINISTRATION

│

↓

QUOTATIONS

│

↓

DRIVER SELECTED

│

↓

PAYMENT PENDING

│

↓

PAYMENT VERIFIED

│

↓

BOOKED

│

↓

PICKUP PENDING

│

↓

PICKUP INSPECTION

│

↓

TRIP START PENDING

│

↓

TRIP ACTIVE

│

┌───────┴────────┐

↓ ↓

FIRST 50% GPS/TRACKING

RELEASE

│ │

└───────┬────────┘

↓

IN TRANSIT

│

↓

DELIVERY PENDING

│

↓

DELIVERED

│

↓

COMPLETED

│

↓

FINAL 50%

RELEASE

│

↓

DRIVER WALLET

│

↓

WITHDRAWAL

Supporting every stage are:

PAYMENT & WALLET

VEHICLE INSPECTION

FUEL MANAGEMENT

GPS / TRACKING

NOTIFICATIONS

COMMUNICATION

DISPUTES

REPORTING

AUDIT & LOGGING

SECURITY

DATABASE

API

INTEGRATIONS

TESTING

DEPLOYMENT

**25.34 Final MVP Business Rules**

The following rules shall be treated as the final consolidated business rules for the MVP.

**Rule 1**

A customer must create a valid transportation request before receiving quotations.

**Rule 2**

Only eligible drivers may submit quotations.

**Rule 3**

The customer selects the driver.

**Rule 4**

The agreed price must be confirmed before payment.

**Rule 5**

The customer must successfully pay the required full trip amount before the trip becomes BOOKED.

**Rule 6**

The driver's transportation fee shall not be immediately released at booking.

**Rule 7**

The Trip Wallet shall maintain the financial records associated with the trip.

**Rule 8**

The fuel budget shall remain separate from driver transportation earnings.

**Rule 9**

The CarGo Kenya platform fee shall be separately recorded.

**Rule 10**

Pickup procedures and inspection requirements must be completed before the trip can proceed to trip-start confirmation.

**Rule 11**

The trip shall not become TRIP ACTIVE solely because the driver presses START TRIP.

**Rule 12**

Customer confirmation is required for official trip commencement.

**Rule 13**

The first 50% of the driver's transportation fee shall only become eligible for release when TRIP ACTIVE requirements have been satisfied.

**Rule 14**

The final 50% shall only become eligible for release after the trip becomes COMPLETED and the required delivery/completion conditions are satisfied.

**Rule 15**

Released driver earnings shall move into the driver's Personal Wallet.

**Rule 16**

Pending driver earnings shall not be withdrawable.

**Rule 17**

A driver shall not withdraw directly from a Trip Wallet.

**Rule 18**

The backend shall determine all financial release amounts.

**Rule 19**

Duplicate financial transactions shall be prevented.

**Rule 20**

Refunds and adjustments shall be recorded as separate financial transactions.

**Rule 21**

Disputes shall preserve the underlying trip and financial history.

**Rule 22**

Important system events shall generate appropriate notifications.

**Rule 23**

Notification failure shall not automatically invalidate a successful underlying transaction.

**Rule 24**

Users shall only access information and communication for which they are authorized.

**Rule 25**

Important financial, operational, and administrative actions shall be auditable.

**Rule 26**

The system shall maintain consistent trip status across all modules.

**Rule 27**

The system shall prevent invalid state transitions.

**Rule 28**

Inspection evidence shall remain linked to the relevant inspection record.

**Rule 29**

The system shall preserve important historical records rather than silently deleting them.

**Rule 30**

Features outside the approved MVP scope shall not be introduced without controlled approval.

**25.35 Final Developer Requirement**

The development team shall treat Chapters 1–25 as the functional and technical baseline for implementation.

Developers shall not independently reinterpret a major business rule during implementation.

Where implementation details are not explicitly defined, the development team may make reasonable technical decisions provided that such decisions:

- Do not contradict the approved business rules.
- Do not alter the agreed trip lifecycle.
- Do not alter the payment-release model.
- Do not weaken security.
- Do not bypass required inspections.
- Do not expose unauthorized information.
- Do not create uncontrolled financial operations.
- Do not introduce unnecessary MVP scope.

Where a technical decision would change an established business requirement, the requirement shall be reviewed before implementation.

**25.36 Final System Readiness Statement**

The CarGo Kenya MVP shall be considered ready for implementation when the requirements defined throughout Chapters 1–25 have been reviewed and accepted as a consistent system baseline.

The final implementation objective is:

REQUEST

↓

QUOTATION

↓

DRIVER SELECTION

↓

PAYMENT

↓

BOOKING

↓

PICKUP

↓

INSPECTION

↓

TRIP START CONFIRMATION

↓

TRIP ACTIVE

↓

50% DRIVER RELEASE

↓

IN TRANSIT

↓

DELIVERY

↓

COMPLETION

↓

50% DRIVER RELEASE

↓

DRIVER WALLET

↓

WITHDRAWAL

Throughout this lifecycle:

PAYMENTS → PROTECTED

INSPECTIONS → DOCUMENTED

GPS → TRACKED

COMMUNICATION → CONTROLLED

NOTIFICATIONS → TRACEABLE

DISPUTES → REVIEWABLE

DATA → CONSISTENT

ACTIONS → AUDITABLE

ACCESS → AUTHORIZED

FINANCIAL FLOWS → CONTROLLED

This completes the **MVP Traceability / Final System Requirements** baseline for the CarGo Kenya system.

**25.35 Final Developer Requirement**

The development team shall treat Chapters 1–25 as the functional and technical baseline for implementation.

Developers shall not independently reinterpret a major business rule during implementation.

Where implementation details are not explicitly defined, the development team may make reasonable technical decisions provided that such decisions:

- Do not contradict the approved business rules.
- Do not alter the agreed trip lifecycle.
- Do not alter the payment-release model.
- Do not weaken security.
- Do not bypass required inspections.
- Do not expose unauthorized information.
- Do not create uncontrolled financial operations.
- Do not introduce unnecessary MVP scope.

Where a technical decision would change an established business requirement, the requirement shall be reviewed before implementation.

**25.36 Final System Readiness Statement**

The CarGo Kenya MVP shall be considered ready for implementation when the requirements defined throughout Chapters 1–25 have been reviewed and accepted as a consistent system baseline.

The final implementation objective is:

REQUEST

↓

QUOTATION

↓

DRIVER SELECTION

↓

PAYMENT

↓

BOOKING

↓

PICKUP

↓

INSPECTION

↓

TRIP START CONFIRMATION

↓

TRIP ACTIVE

↓

50% DRIVER RELEASE

↓

IN TRANSIT

↓

DELIVERY

↓

COMPLETION

↓

50% DRIVER RELEASE

↓

DRIVER WALLET

↓

WITHDRAWAL

Throughout this lifecycle:

PAYMENTS → PROTECTED

INSPECTIONS → DOCUMENTED

GPS → TRACKED

COMMUNICATION → CONTROLLED

NOTIFICATIONS → TRACEABLE

DISPUTES → REVIEWABLE

DATA → CONSISTENT

ACTIONS → AUDITABLE

ACCESS → AUTHORIZED

FINANCIAL FLOWS → CONTROLLED

This completes the **MVP Traceability / Final System Requirements** baseline for the CarGo Kenya system.