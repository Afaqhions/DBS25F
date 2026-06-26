# Wholesale Management System

A full-stack web application for managing wholesale business operations including products, inventory, orders, customers, suppliers, merchants, payments, reviews, and reporting.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 8, Tailwind CSS 4, React Router 7, Axios |
| **Backend** | ASP.NET Core 10, Entity Framework Core 9, MySQL 8 |
| **Auth** | JWT Bearer Tokens, BCrypt password hashing |
| **PDF** | QuestPDF for report generation |
| **Validation** | FluentValidation (backend), Zod (frontend) |

## Project Structure

```
backend/          - ASP.NET Core Web API
  Controllers/    - REST API controllers
  Services/       - Business logic layer
  Models/         - Domain entities, DTOs, Enums
  Data/           - EF Core DbContext + migrations
  Repositories/   - Generic repository pattern
  SQL/            - Views, stored procedures, triggers, seed data
frontend/         - React SPA (Vite)
  src/api/        - Axios API modules
  src/components/ - Reusable UI components
  src/contexts/   - Auth, notification, theme contexts
  src/hooks/      - Custom React hooks
  src/pages/      - Route pages (15 views)
```

## Features

- Role-based authentication (Admin, Manager, Staff, Customer)
- Product & category management with hierarchical categories
- Order processing with minimum 50-quantity business rule
- Customer management with loyalty points
- Supplier & merchant management (merchants by country)
- Inventory tracking with transaction audit
- Review & rating system
- PDF report generation
- Dashboard with charts & statistics
- Dark mode support

## Quick Start

See [SETUP.md](SETUP.md) for detailed setup instructions.

```bash
# 1. Start MySQL and create the database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS WholesaleDB;"

# 2. Start the backend
cd backend
dotnet restore && dotnet run

# 3. Start the frontend
cd frontend
npm install && npm run dev
```

Open http://localhost:5173 and log in with `admin@wms.com` / `Test@123`.
