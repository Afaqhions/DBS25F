# Developer Guide

## Architecture

```
Frontend (React + Vite, :5173)
    |  Axios HTTP
    v
Backend API (ASP.NET Core, :5127)
    |
    v
Controllers -> Services -> Repositories -> EF Core -> MySQL (:3306)
```

- **Controllers** handle HTTP concerns (routing, status codes)
- **Services** contain business logic
- **Repositories** abstract data access via `GenericRepository<T>`
- **Middleware** globally catches and formats exceptions

## Backend Conventions

### Code Style
- PascalCase for classes, methods, properties
- `Async` suffix on async methods
- Interfaces prefixed with `I`
- Services implement explicit interfaces

### Adding a new entity
1. Create model in `Models/Domain/`
2. Create DTOs in `Models/DTOs/`
3. Add `DbSet<T>` to `Data/AppDbContext.cs`
4. Create migration: `dotnet ef migrations add <Name>`
5. Create repository interface + implementation (optional)
6. Create service interface + implementation
7. Create controller with REST endpoints
8. Register service in `Program.cs`

### Adding a new API endpoint
- Add to existing controller or create a new one in `Controllers/`
- Use `[Authorize(Roles = "...")]` for access control
- Return `IActionResult` with appropriate status codes
- Validate with FluentValidation validators

### Database migrations
```bash
cd backend
dotnet ef migrations add MigrationName
dotnet ef database update
```

Migrations auto-apply on startup in Development mode.

### SQL objects
Views, stored procedures, and triggers in `SQL/` are executed automatically by `DatabaseInitializer.cs` after migrations. Add new SQL scripts there.

## Frontend Conventions

### Code Style
- camelCase for variables, functions
- PascalCase for components
- JSX files use `.jsx` extension
- API modules in `src/api/` (one per resource)

### Adding a new page
1. Create page component in `src/pages/`
2. Add route in `src/App.jsx`
3. Add navigation link in sidebar/navbar
4. Add API calls in `src/api/` if needed

### Adding a new component
- Shared/reusable components go in `src/components/common/`
- Form-specific components go in `src/components/forms/`
- Table components go in `src/components/tables/`

### State management
- Auth state via `AuthContext`
- Theme (dark/light) via `ThemeContext`
- Notifications via `NotificationContext` (react-hot-toast)
- Local UI state with React hooks (useState, useReducer)

### API calls
All API modules in `src/api/` use the shared Axios instance from `src/api/axios.js` which includes:
- Base URL from `VITE_API_URL` env variable
- JWT token injection via interceptor
- 401 response handling (auto-logout)

## Environment Variables

### Backend (`backend/appsettings.json`)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=WholesaleDB;User=root;Password=root;Port=3306"
  },
  "JwtSettings": {
    "Secret": "<change-this-in-production>",
    "ExpiryMinutes": 120
  }
}
```

### Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:5127/api
VITE_APP_NAME=Wholesale Management System
```

## Available Scripts

### Backend
| Command | Description |
|---------|-------------|
| `dotnet run` | Run API server on :5127 |
| `dotnet build` | Compile project |
| `dotnet test` | Run tests (if added) |
| `dotnet ef migrations add <N>` | Create migration |
| `dotnet ef database update` | Apply migrations |

### Frontend
| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server on :5173 |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Adding dependencies

```bash
# Backend (NuGet)
cd backend
dotnet add package <PackageName>

# Frontend (npm)
cd frontend
npm install <package-name>
```
