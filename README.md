# MYEL — Responsible Fine Jewelry Store

A responsive React + Vite + Tailwind CSS storefront inspired by the supplied MYEL Figma screenshots, with Supabase authentication, product management, order management, and an admin analytics dashboard.

## Features

- MYEL-inspired editorial homepage, product categories, new arrivals, ethical-gold section, newsletter and footer.
- Product catalogue with category filters and search.
- Purchase action prompts guests to sign in or create an account.
- Authenticated customers can add products to a cart and submit orders.
- Admin dashboard: revenue/order/product summary, sales chart, incoming orders and status updates, create/edit/delete products, pricing and stock controls.
- Supabase Auth with database-backed roles and Row Level Security (RLS).
- Demo product content when Supabase is not configured. Real auth, orders and product management require Supabase configuration.

## Stack

- React 18, Vite, React Router
- Tailwind CSS with a small custom stylesheet for exact editorial layouts
- Supabase Auth + Postgres + Row Level Security
- Recharts for admin analytics
- Lucide icons

## Run locally

Requirements: Node.js 18+ and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

The app renders a local design preview without Supabase, using sample catalogue data. To use the real store, complete the setup below and restart Vite after editing `.env.local`.

## Supabase setup

1. Create a Supabase project.
2. Open **SQL Editor** and run `supabase/schema.sql`.
3. In **Project Settings → API**, copy the Project URL and the publishable/anon key into `.env.local`:

```dotenv
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY
```

4. In **Authentication → URL Configuration**, set the local Site URL to `http://localhost:5173` and add the deployed domain to Redirect URLs after deployment.
5. Register your own account through the app. If email confirmation is enabled, confirm the address.
6. Promote only your own account to admin in the SQL Editor. Replace the email and run:

```sql
update public.profiles p
set role = 'admin'
from auth.users u
where p.id = u.id
  and u.email = 'you@example.com';
```

7. Sign out and sign back in so the client reloads the profile role.
8. Replace the sample product images with approved MYEL images and verify every product price, description and stock quantity.

**Never use the Supabase `service_role` secret in the browser.** The frontend uses only the publishable/anon key; authorization must be enforced by RLS and server-side database policies.

## Order integrity / production checklist

This starter lets authenticated users create an order and order-item records under RLS. Before accepting real payments or treating an order total as authoritative, add a trusted Postgres RPC/Edge Function that:
- reads current prices from `products` instead of trusting a browser-submitted total;
- checks stock and reserves/decrements inventory transactionally;
- inserts the order and all line items in one transaction;
- calculates tax, shipping and discounts server-side;
- optionally integrates a payment provider and verifies payment webhooks before marking an order paid.

Also configure Supabase email templates, SMTP, password reset flow, rate limits, privacy/terms, backups, monitoring, and production redirect URLs. The sample UI does not collect card details and does not process payments.

## Project structure

```text
src/
  components/
    AuthModal.jsx
    Footer.jsx
    Header.jsx
    ProductCard.jsx
  context/
    AuthContext.jsx
  lib/
    data.js
    supabase.js
  pages/
    About.jsx
    Admin.jsx
    Home.jsx
    Login.jsx
    Shop.jsx
  App.jsx
  index.css
  main.jsx
supabase/
  schema.sql
```

## Build

```bash
npm run build
npm run preview
```

No test suite is included in this production-focused starter, as requested. Run the build before deployment.
