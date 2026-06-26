# Setup Guide

Follow these steps to get the Wholesale Management System running on your machine.

## Prerequisites

| Requirement | Version | Download |
|-------------|---------|----------|
| .NET SDK | 10.0+ | https://dotnet.microsoft.com/download |
| Node.js | 18+ | https://nodejs.org/ |
| MySQL Server | 8.0+ | https://dev.mysql.com/downloads/ |
| MySQL Workbench (optional) | any | https://dev.mysql.com/downloads/workbench/ |

Verify installations:
```bash
dotnet --version
node --version
npm --version
mysql --version
```

---

## Step 1: Clone & Navigate

```bash
cd "D:\Uni\Books\semester 4\DB-LAB\db project"
```

---

## Step 2: Database Setup

### Option A: Command line
```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS WholesaleDB;"
```
Enter `root` as the password when prompted.

### Option B: MySQL Workbench
1. Open MySQL Workbench
2. Connect to local instance
3. Run: `CREATE DATABASE WholesaleDB;`

---

## Step 3: Configure Database Connection

Edit `backend/appsettings.json` if your MySQL credentials differ:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=WholesaleDB;User=root;Password=root;Port=3306"
}
```

Change `User`, `Password`, or `Port` as needed.

---

## Step 4: Run the Backend

```bash
cd backend
dotnet restore
dotnet run
```

On first run this will:
- Install NuGet dependencies
- Apply EF Core migrations (creates tables)
- Execute SQL views, stored procedures, and triggers
- Seed data is **not** automatically inserted

Expected output: "Now listening on http://localhost:5127"

**Optional - Seed sample data:**
```bash
mysql -u root -p WholesaleDB < SQL/SeedData.sql
```
Default seed credentials: `admin@wms.com` / `Test@123`

---

## Step 5: Run the Frontend

Open a **new terminal** and run:

```bash
cd frontend
npm install
npm run dev
```

Expected output: "Local: http://localhost:5173/"

---

## Step 6: Access the Application

Open http://localhost:5173 in your browser.

### Test Accounts (if seed data was loaded)
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@wms.com | Test@123 |

Register a new account if you did not seed the database.

---

## Troubleshooting

### Backend won't start
- **Port conflict**: Ensure port 5127 is free or change it in `Properties/launchSettings.json`
- **MySQL not running**: Start MySQL service (`net start MySQL80` or via Services panel)
- **Wrong credentials**: Update the connection string in `appsettings.json`

### Frontend won't start
- **Port conflict**: Vite defaults to 5173; change with `npm run dev -- --port 3000`
- **Node version**: Ensure Node.js 18+ (check with `node --version`)

### CORS errors
The backend allows `localhost:3000` and `localhost:5173`. If using a different port, add it in `backend/Program.cs` under the CORS policy.

### Database errors
- Ensure MySQL is running on port 3306
- Verify the database `WholesaleDB` exists
- Check the connection string in `appsettings.json`

### EF Core migration issues
Reset the database:
```bash
cd backend
dotnet ef database drop
dotnet ef database update
```
