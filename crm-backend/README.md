# Fastor7 CRM Backend

Node.js + Express + MongoDB + JWT CRM API for employee registration/login, public enquiry submission, unclaimed leads, claim, and My Leads.

## Setup

1. Install Node.js.
2. Create a MongoDB Atlas cluster, database user, and allow your IP under Network Access.
3. Copy `.env` values:
   - `PORT=5000`
   - `MONGODB_URI` — Atlas connection string with database name `crm`
   - `JWT_SECRET` — a long random secret
4. Install and run:

```bash
npm install
npm run dev
```

Server: `http://localhost:5000`

Do not commit `.env`. It contains private credentials.

## Endpoints

| Method | Endpoint | Auth |
| --- | --- | --- |
| GET | `/` | No |
| POST | `/api/auth/register` | No |
| POST | `/api/auth/login` | No |
| POST | `/api/enquiries` | No |
| GET | `/api/leads/unclaimed` | Bearer token |
| GET | `/api/leads/my` | Bearer token |
| PATCH | `/api/leads/:id/claim` | Bearer token |

Protected routes use:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Sample requests

**Register**

```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "password": "SecurePass123!"
}
```

**Login**

```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "rahul@example.com",
  "password": "SecurePass123!"
}
```

**Submit enquiry**

```http
POST http://localhost:5000/api/enquiries
Content-Type: application/json

{
  "name": "Priya Verma",
  "email": "priya@example.com",
  "courseInterest": "Full Stack Development"
}
```

**Unclaimed leads**

```http
GET http://localhost:5000/api/leads/unclaimed
Authorization: Bearer YOUR_JWT_TOKEN
```

**Claim lead**

```http
PATCH http://localhost:5000/api/leads/LEAD_ID/claim
Authorization: Bearer YOUR_JWT_TOKEN
```

**My leads**

```http
GET http://localhost:5000/api/leads/my
Authorization: Bearer YOUR_JWT_TOKEN
```

Claim uses an atomic update so only one counselor can claim a lead. A second claim on the same lead should return `409 Conflict`.
