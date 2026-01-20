# Backend: per-pet membership + billing dates

This frontend expects **per-pet** subscription state to come from `GET /api/pets` (not from `GET /api/users/me`).

## Required pet fields

In your backend `Pet` model (Mongo/Mongoose), ensure these fields exist and are returned from `GET /api/pets`:

- `userId` (`ObjectId` ref `User`, required)
- `hasMembership` (`Boolean`, default `false`)
- `membershipStartDate` (`Date`, nullable)
- `nextDebitDate` (`Date`, nullable)

The UI will also tolerate alternate names (`subscriptionStartDate`, `nextBillingDate`, `nextChargeDate`), but using the names above is recommended.

## What the frontend sends on checkout creation

`POST /api/payment/createCheckout` payload always includes:

- `userId`
- `petIds` (array; can be empty when paying for a brand-new pet)
- `membership` (boolean)
- `packageType`
- `billingDetails`

If the user is subscribing for a **new** pet, the payload includes:

- `petDraft` (pet fields + `userId`)

## Backend flow to make dashboard membership data correct

### 1) Create checkout

When creating a checkout session, persist a record (DB) that links the provider payment/session id to:

- `userId`
- `petIds` (optional)
- `petDraft` (optional)
- `membership` flag
- `amountInCents`

Also make sure your redirect URLs use `FRONTEND_URL`:

- `${FRONTEND_URL}/payment-success?paymentId=<id>`
- `${FRONTEND_URL}/payment-failure?paymentId=<id>`
- `${FRONTEND_URL}/payment-cancel?paymentId=<id>`

### 2) On successful payment (webhook or verification callback)

When the provider confirms payment:

- Determine `paidAt` (provider timestamp or `new Date()`).
- If `petDraft` exists:
  - Create the pet with `userId = petDraft.userId` and the rest of the draft fields.
  - Set membership fields on the created pet.
- If `petIds` exist:
  - Update each pet (scoped to the same `userId`) to set membership fields.

Recommended membership field updates:

- `hasMembership = true`
- `membershipStartDate = paidAt`
- `nextDebitDate = addOneMonth(paidAt)` (same day-of-month where possible)

### 3) `GET /api/pets`

Return only pets belonging to the authenticated user (recommended), and include:

- `hasMembership`
- `membershipStartDate`
- `nextDebitDate`

This is what powers the dashboard “Subscription active”, “Started”, and “Next debit” labels.

## Seed data consistency

If you have seed scripts:

- Ensure every pet has a valid `userId` that matches an existing user `_id`.
- If you seed subscriptions, set `hasMembership`, `membershipStartDate`, and `nextDebitDate` accordingly.

