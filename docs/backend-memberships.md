# Backend: PayFast subscription + per-pet membership flags

This frontend expects **per-pet** subscription state to come from `GET /api/pets` (not from `GET /api/users/me`).

## Required pet fields

In your backend `Pet` model (Mongo/Mongoose), ensure these fields exist and are returned from `GET /api/pets`:

- `userId` (`ObjectId` ref `User`, required)
- `hasMembership` (`Boolean`, default `false`)
- `membershipStartDate` (`Date`, nullable)
- `nextDebitDate` (`Date`, nullable)

The UI will also tolerate alternate names (`subscriptionStartDate`, `nextBillingDate`, `nextChargeDate`), but using the names above is recommended.

## What the frontend sends on subscription checkout creation

`POST /api/subscriptions/checkout` (auth required) payload includes:

- `planKey` (currently `"MONTHLY"`)
- `petIds` (array; can be empty when subscribing for a brand-new pet)

If the user is subscribing for a **new** pet (via Add Pet), the payload includes:

- `petDraft` (pet fields + `userId`)

Once the backend returns the PayFast `actionUrl` + signed `fields`, the frontend builds a form and auto-submits it via `POST` to PayFast (recommended).

## Tags checkout

Tags are a **separate** checkout:

- `POST /api/payment/createCheckout` is used for tag purchases only (Yoco).
- The UI requires the subscription to be active before ordering tags for any pet.

## Backend flow to make dashboard membership data correct

### 1) Create PayFast subscription checkout

When creating a checkout session, persist a record (DB) that links your internal reference to:

- `userId`
- `petIds` (optional)
- `petDraft` (optional)
- `planKey`
- expected amount

Also make sure your redirect URLs use `FRONTEND_URL` (these are UX-only; activation is via ITN):

- `${FRONTEND_URL}/subscription/success`
- `${FRONTEND_URL}/subscription/cancel`

### 2) On successful payment (PayFast ITN)

When PayFast confirms payment via ITN:

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
