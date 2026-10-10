# MYEL | Responsible Fine Jewelry Store

A modern, responsive jewelry storefront built with React, Vite, Tailwind CSS, and Supabase. MYEL combines an editorial shopping experience with customer authentication, product and inventory management, order workflows, and an administrative analytics dashboard.

**Portfolio project:** Orders are simulated for demonstration purposes. No real payments are collected or processed.

## Overview

MYEL is a full-stack e-commerce application inspired by contemporary fine jewelry brands. It pairs a minimalist, editorial-style storefront with database-backed functionality for customers and administrators.

The project demonstrates frontend development, authentication, relational database design, role-based access control, and the integration of a React application with a managed backend service.

## Features

### Customer storefront
- Responsive editorial homepage with product photography, category highlights, new arrivals, an ethical-gold section, newsletter area, and footer.
- Product catalogue with category filtering and search.
- Product cards with pricing and product details.
- Authentication prompts for guests who attempt to purchase.
- Customer registration and login using Supabase Auth.
- Shopping cart and simulated order submission.
- Database-backed order records.

### Admin dashboard
- Overview of orders, products, and sales-related metrics.
- Sales analytics and chart visualizations.
- Incoming order management and status updates.
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

## Architecture

The application separates the user interface, authentication state, database client, and page-level functionality.

- **Components:** Reusable interface elements, including navigation, product cards, footer, and authentication modal.
- **Context:** Shared authentication state and user information.
- **Supabase client:** Centralized configuration for communication with Supabase.
- **Pages:** Storefront, catalogue, account, and administration views.
- **Database:** Persistent storage for user profiles, products, orders, and order items, with access governed by database policies.

## Project Structure

```text
src/
├── components/
│   ├── AuthModal.jsx
│   ├── Footer.jsx
│   ├── Header.jsx
│   └── ProductCard.jsx
├── context/
│   └── AuthContext.jsx
├── lib/
│   ├── data.js
│   └── supabase.js
├── pages/
│   ├── About.jsx
│   ├── Admin.jsx
│   ├── Home.jsx
│   ├── Login.jsx
│   └── Shop.jsx
├── App.jsx
├── index.css
└── main.jsx
supabase/
└── schema.sql
```

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm
- A Supabase account for database-backed functionality

### 1. Clone the repository

```bash
git https://github.com/Kipchumba-ke/MYEL
cd MYEL
```


### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a local environment file:

```bash
cp .env.example .env.local
```

Add your Supabase project credentials to `.env.local`:

```dotenv
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

Use the project URL and publishable key from your Supabase dashboard. The application currently expects the variable name `VITE_SUPABASE_ANON_KEY`.

Never place a Supabase `service_role` key or secret key in frontend environment variables. Vite exposes variables prefixed with `VITE_` to browser-side code.

### 4. Configure the database

1. Create a Supabase project.
2. Open the Supabase SQL Editor.
3. Run `supabase/schema.sql` against the new project.
4. Verify that the expected tables and policies were created.

The schema defines the database structures and security policies required by the application. Run it once on a fresh database unless you have deliberately prepared a migration or repeatable setup procedure.

### 5. Configure authentication

In Supabase, open **Authentication → URL Configuration**.

- Set the local Site URL to `http://localhost:5173` when using the default Vite development port.
- Add the local development URL to the allowed redirect URLs where required.
- Configure your production domain after deployment.
- Confirm whether email verification is enabled and follow the corresponding registration flow.

### 6. Create an administrator account

1. Register through the application.
2. Confirm the email if required.
3. Verify that the user and corresponding profile exist in Supabase.
4. Provision the first administrator through a controlled, database-owner-only bootstrap procedure consistent with the role-protection trigger in `supabase/schema.sql`.
5. Sign out and sign back in, then verify that the administrative dashboard is accessible.

The initial administrator setup is a privileged operation. Do not expose it through a public registration form or allow ordinary users to modify their own roles. After bootstrap, preserve the database's role-protection and authorization policies.

### 7. Start the development server

```bash
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

Without Supabase configuration, the application can display sample catalogue content where supported. Authentication, persistent orders, and administrative data management require a working Supabase configuration.

## Order Processing and Demo Limitations

MYEL supports simulated order submission and administrative order management. It does not integrate a real payment provider, collect card details, or process real transactions.

Orders and order statuses are intended to demonstrate an e-commerce workflow, not to represent verified financial transactions.

Before adapting this project for real commerce, implement a trusted server-side order-creation operation, such as a PostgreSQL RPC or Supabase Edge Function, that:

- Retrieves current product prices from the database instead of trusting browser-submitted totals.
- Validates product availability and manages stock consistently.
- Creates orders and order items atomically.
- Calculates applicable shipping, tax, and discounts on a trusted server-side path.
- Integrates a payment provider and verifies payment events before marking an order as paid.

Additional production requirements would include rate limiting, email and password-reset configuration, operational monitoring, backups, privacy and returns policies, and appropriate recovery procedures.

## Security Considerations

Security is enforced at the database level, not solely by hiding administrative interface elements.

- Use the Supabase publishable key in the browser.
- Keep secret and `service_role` keys out of source control and frontend code.
- Apply Row Level Security to tables exposed through the Supabase API.
- Restrict administrative product and order operations to authorized users.
- Prevent customers from accessing other customers' private order information.
- Protect account-role changes through database authorization rules.
- Keep `.env.local` out of Git and commit only a placeholder `.env.example`.

Review the policies in `supabase/schema.sql` whenever database access rules change.

## Build and Preview

Create a production build:

```bash
npm run build
```

Preview the build locally:

```bash
npm run preview
```

Resolve build errors before deploying. The project does not include an automated test suite in this starter version.

## Deployment

The React frontend can be deployed to a static hosting provider such as Vercel or Netlify.

Before deployment:

1. Configure the production environment variables in the hosting provider.
2. Set the correct Supabase authentication Site URL and redirect URLs.
3. Verify the production build.
4. Test registration, login, customer permissions, and admin access on the deployed site.
5. Confirm that the demo-order workflow is clearly identified as simulated.
6. Ensure that no secrets or local environment files are included in the repository.

## Portfolio Links

- **Live Demo:
- **GitHub Repository: https://github.com/Kipchumba-ke/MYEL

## Key Learning Outcomes

This project provided practical experience with:

- Building responsive, component-driven interfaces in React.
- Managing shared authentication state and conditional UI.
- Integrating a frontend with Supabase Auth and PostgreSQL.
- Designing relational database structures for products and orders.
- Implementing role-based access and Row Level Security.
- Developing administrative CRUD workflows and analytics views.
- Separating demo functionality from requirements for real payment processing.

## License

Add a license if you intend to distribute or reuse the source code publicly. If this project uses third-party imagery or design assets, verify that their licenses permit the intended use.
