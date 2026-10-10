# MYEL | Responsible Fine Jewelry Store

A modern, responsive jewelry storefront built with React, Vite, Tailwind CSS, and Supabase. MYEL combines an editorial shopping experience with customer authentication, product and inventory management, simulated order processing, and an administrative analytics dashboard.

**Portfolio project:** Orders are simulated for demonstration purposes. No real payments are collected or processed.

**Live demo:** https://myelcollections.netlify.app/  
**GitHub repository:** https://github.com/Kipchumba-ke/MYEL

## Overview

MYEL is a full-stack e-commerce application inspired by contemporary fine jewelry brands. It pairs a minimalist storefront with database-backed functionality for customers and administrators.

The project demonstrates component-based frontend development, authentication, relational database design, role-based access control, and integration between a React application and a managed backend service.

## Features

### Customer storefront

- Responsive, editorial-style homepage with product photography, category highlights, new arrivals, an ethical-gold section, and footer.
- Product catalogue with category filtering and search.
- Product cards displaying product information and pricing.
- Authentication prompts for guests who attempt to purchase.
- Customer registration and login using Supabase Auth.
- Shopping cart and simulated order submission.
- Database-backed order records.

### Admin dashboard

- Overview of products, orders, and sales-related metrics.
- Analytics and chart visualizations.
- Order management and status updates.
- Create, edit, and delete products.
- Product pricing and stock management.

### Authentication and security

- Supabase authentication for customer accounts.
- Database-backed user profiles and roles.
- Role-based administrative access.
- PostgreSQL Row Level Security (RLS) policies to restrict database operations.
- Database-level protection against unauthorized account-role changes.

## Technology Stack

| Technology | Purpose |
|---|---|
| React 18 | Component-based user interface |
| Vite | Development server and production build |
| Tailwind CSS | Responsive styling and layout |
| React Router | Client-side navigation |
| Supabase Auth | User registration and authentication |
| PostgreSQL | Relational data storage |
| Supabase RLS | Database access control |
| Recharts | Admin analytics and visualizations |
| Lucide icons | Interface icons |
| Netlify | Frontend hosting and deployment |

## Architecture

The application separates reusable UI components, authentication state, database configuration, and page-level functionality.

- **Components:** Reusable interface elements such as navigation, product cards, footer, and authentication modal.
- **Context:** Shared authentication state and user information.
- **Supabase client:** Centralized configuration for communicating with Supabase.
- **Pages:** Storefront, catalogue, account, and administration views.
- **Database:** Persistent storage for user profiles, products, orders, and order items, with access controlled by database policies.

## Project Structure

```text
MYEL/
├── public/
│   └── _redirects
├── src/
│   ├── components/
│   │   ├── AuthModal.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   └── ProductCard.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── lib/
│   │   ├── data.js
│   │   └── supabase.js
│   ├── pages/
│   │   ├── About.jsx
│   │   ├── Admin.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   └── Shop.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── supabase/
│   └── schema.sql
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```



## Getting Started

### Prerequisites

- Node.js 18 or later
- npm
- A Supabase account for database-backed functionality

### 1. Clone the repository

```bash
git clone https://github.com/Kipchumba-ke/MYEL.git
cd MYEL
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a local environment file from the provided example:

```bash
cp .env.example .env.local
```

Add your Supabase project credentials to `.env.local`:

```dotenv
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

Retrieve the project URL and publishable key from your Supabase dashboard. The current application expects the variable names shown above.

**Security note:** Vite exposes variables prefixed with `VITE_` to client-side code. Use only the Supabase publishable key, or the legacy `anon` key if your project uses it. Never place a Supabase `service_role` key or secret key in frontend environment variables.

### 4. Configure the database

1. Create a Supabase project.
2. Open the Supabase SQL Editor.
3. Run `supabase/schema.sql` against the new project.
4. Verify that the expected tables, functions, triggers, and security policies were created.

The schema defines the database structures and access controls required by the application. Run it on a fresh database unless you have deliberately prepared a migration or repeatable setup procedure. Do not blindly rerun schema commands against a populated database.

### 5. Configure authentication

In Supabase, open **Authentication → URL Configuration**.

- Set the **Site URL** to your production URL when configuring the deployed application: `https://myelcollections.netlify.app`.
- Add the appropriate local and production URLs to the allowed redirect URLs where required.
- Keep `http://localhost:5173` available for local development.
- Confirm whether email verification is enabled and follow the corresponding registration flow.

If you change the deployed domain, update the Site URL and allowed redirect URLs accordingly.

### 6. Create an administrator account

1. Register through the application.
2. Confirm the email if required by your Supabase authentication settings.
3. Verify that the user and corresponding profile exist in Supabase.
4. Provision the first administrator through a controlled, database-owner-only bootstrap procedure consistent with the role-protection trigger in `supabase/schema.sql`.
5. Sign out and sign back in, then verify that the administrative dashboard is accessible.

Initial administrator provisioning is a privileged operation. Do not expose it through a public registration form or allow ordinary users to modify their own roles. Preserve the role-protection trigger and authorization policies after bootstrap.

### 7. Start the development server

```bash
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

The storefront may display sample catalogue content where supported, but authentication, persistent orders, and administrative database operations require valid Supabase configuration.

## Build and Preview

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Resolve any build errors before deployment.

## Deployment

MYEL is deployed on Netlify.

**Live application:** https://myelcollections.netlify.app/

The frontend can also be hosted on another static hosting provider that supports Vite applications and SPA routing.

### Netlify build configuration

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Publish directory | `dist` |
| Environment variables | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` |

Configure the environment variables in the Netlify project settings. Local `.env.local` values are not automatically available to Netlify builds.

The file `public/_redirects` should contain:

```text
/*    /index.html   200
```

This rule allows client-side routes to load when a visitor opens or refreshes a URL directly.

After deployment, verify:

- Customer registration and login.
- Supabase authentication redirects.
- Product catalogue and filtering.
- Shopping cart and simulated order submission.
- Administrative access and permissions.
- Product and order management.
- Direct navigation and page refreshes.
- Production environment-variable configuration.

## Order Processing and Demo Limitations

MYEL demonstrates an e-commerce workflow through simulated order submission and administrative order management. It does not integrate a real payment provider, collect card details, or process real transactions.

Orders and their statuses demonstrate application workflows; they do not represent verified financial transactions.

Before adapting this project for real commerce, implement a trusted server-side order-creation operation, such as a PostgreSQL RPC or Supabase Edge Function, that:

- Retrieves current product prices from the database instead of trusting browser-submitted totals.
- Validates product availability and manages stock consistently.
- Creates orders and order items atomically.
- Calculates applicable shipping, taxes, and discounts through a trusted server-side path.
- Integrates a payment provider and verifies payment events before marking an order as paid.

Additional production requirements would include rate limiting, password-reset and email configuration, operational monitoring, backups, privacy and returns policies, and appropriate recovery procedures.

## Security Considerations

Security should be enforced at the database level, not solely by hiding administrative interface elements.

- Use a Supabase publishable key in browser-side code.
- Keep secret and `service_role` keys out of source control and frontend code.
- Apply Row Level Security to tables exposed through the Supabase API.
- Restrict administrative product and order operations to authorized users.
- Prevent customers from accessing other customers' private order information.
- Protect account-role changes through database authorization rules.
- Keep `.env.local` out of Git and commit only a placeholder `.env.example`.
- Review database policies and privileged functions whenever access rules change.

See `supabase/schema.sql` for the database schema and its associated security controls.

## Key Learning Outcomes

This project provided practical experience with:

- Building responsive, component-driven interfaces using React.
- Managing shared authentication state and conditional UI.
- Integrating a frontend with Supabase Auth and PostgreSQL.
- Designing relational database structures for products and orders.
- Implementing role-based access and Row Level Security.
- Developing administrative CRUD workflows and analytics views.
- Deploying a Vite application to Netlify.
- Distinguishing a simulated e-commerce workflow from the security and financial requirements of real payment processing.

## License

This project is intended for portfolio and educational demonstration.

If distributing the project under the MIT License, include a `LICENSE` file containing the standard MIT License text and the appropriate copyright notice.

