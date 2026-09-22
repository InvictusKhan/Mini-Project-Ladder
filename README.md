# Mini CRM API

A backend CRM system built from scratch with Node.js, Express, and PostgreSQL — built as a practice project to apply real integration and CRM architecture experience to hands-on backend development.

## Overview

This API implements core CRM functionality (lead management) alongside a secure authentication system, built the way a production service would be structured rather than as a tutorial project:

- Full CRUD on leads with field-level validation and dynamic partial updates
- JWT-based authentication with access + refresh token rotation
- Refresh tokens are persisted and validated server-side (not just trusted from the client), reducing replay risk
- Email verification flow on signup
- Password hashing with bcrypt
- Rate limiting, security headers (Helmet), and request logging as standard middleware

Also includes two earlier practice resources (`games`, `persons`) built while learning the CRUD + Postgres pattern before the CRM module.

## Tech Stack

- **Runtime:** Node.js (ESM)
- **Framework:** Express 5
- **Database:** PostgreSQL (via `pg`)
- **Auth:** JWT (`jsonwebtoken`), `bcrypt` for password hashing
- **Security/Middleware:** Helmet, CORS, express-rate-limit, cookie-parser

## Project Structure

```
├── app.js                  # Entry point, middleware setup
├── db.js                   # PostgreSQL connection pool
├── routes/
│   └── router.js           # All route definitions
├── controllers/
│   ├── users.js            # Auth: signup, login, refresh, logout, email verification
│   ├── leads.js            # CRM leads: full CRUD
│   ├── person_controller.js
│   └── game_controller.js
└── middleware/
    ├── auth.js              # JWT verification
    ├── logger.js            # Request logging
    └── rateLimiter.js        # Rate limiting
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/addUser` | Register a new user |
| GET | `/api/verify-email` | Verify email via token |
| POST | `/api/login` | Log in, returns access token + refresh cookie |
| POST | `/api/refresh` | Exchange refresh token for a new access token |
| POST | `/api/logOut` | Invalidate refresh token |
| GET | `/api/getUsers` | List users |

### Leads (CRM)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/leads` | Create a lead |
| GET | `/api/leads` | List all leads |
| GET | `/api/leads/:id` | Get a single lead |
| PATCH | `/api/leads/:id` | Update a lead (partial updates supported) |
| DELETE | `/api/leads/:id` | Delete a lead |

All routes below `/api/leads`, `/api/games`, `/api/persons` require a valid Bearer access token.

## Setup

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root with:
   ```
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name
   SECRET_KEY=your_jwt_secret
   REFRESH_SECRET=your_refresh_secret
   ```

3. Set up the PostgreSQL tables (`users`, `leads`, `person`, `games`) matching the fields used in the controllers.

4. Run in dev mode:
   ```bash
   npm run dev
   ```

## Why this project

Built to pair hands-on backend implementation with existing experience designing CRM data models, business rules, and integration logic professionally — closing the gap between architecting a system and being able to build it end-to-end.

## Roadmap

- [ ] Outbound webhook on lead creation (integration pattern)
- [ ] Input validation library (e.g. Zod/Joi) instead of manual field checks
- [ ] Automated tests (Jest + Supertest)
- [ ] Consistent duplicate-record handling across all resources
