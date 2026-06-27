# 🏨 Hotel Server API

A **RESTful hotel-booking backend** built with **Node.js, Express and MongoDB**, with JWT authentication and interactive **Swagger / OpenAPI** documentation.

---

## 📌 Problem Statement

A hotel's most valuable resource is a room on a given night — and the one thing a booking system must never do is **sell the same room twice for overlapping dates**. Around that single guarantee sit a handful of essentials: authenticated guests, a manageable room catalogue, transparent pricing, and the ability to cancel.

Spreadsheets and ad-hoc tools fail exactly where it hurts most — they happily allow double bookings and have no concept of "is this room free between these two dates?".

**Hotel Server** provides a small, correct foundation for room reservations:

- **Authenticated guests** — sign up and log in; passwords are bcrypt-hashed and sessions are stateless JWTs.
- **Room catalogue** — create, read, update and delete rooms (type, price-per-night, capacity); reads are public, writes are protected.
- **Conflict-free bookings** — a reservation is rejected if it overlaps any existing active booking for that room, so a room can never be double-booked. The total price is computed from the number of nights.
- **Cancellations** — guests can cancel their own bookings, freeing the dates for others.
- **Self-documenting** — the whole API is browsable and testable via Swagger UI.

---

## ✨ Features

- 🔐 JWT authentication with bcrypt-hashed passwords
- 🛏️ Full room CRUD (public reads, protected writes)
- 📅 **Overlap-aware booking** — no double bookings, ever
- 💰 Automatic total-price calculation from nights × rate
- ❌ Self-service cancellation
- 🧱 Clean layered architecture (models · controllers · routes · middleware)
- 🛡️ Centralised error handling with an async wrapper
- 📚 Interactive API docs at `/api-docs` (OpenAPI 3.0)
- ❤️ Health-check endpoint

---

## 🛠️ Tech Stack

| Layer            | Technology                     |
| ---------------- | ------------------------------ |
| Runtime          | Node.js                        |
| Web framework    | Express.js                     |
| Database         | MongoDB + Mongoose             |
| Auth             | JSON Web Tokens (JWT)          |
| Password hashing | bcrypt                         |
| API docs         | swagger-ui-express (OpenAPI 3) |

---

## 🚀 Getting Started

### 1. Clone & install

```bash
git clone https://github.com/tejasdavande/hotel-server.git
cd hotel-server
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Then edit `.env`:

```env
PORT=3000
JWT_SECRET_KEY=your_long_random_secret
MONGODB_URI=mongodb://127.0.0.1:27017/hotel
```

> You need a running MongoDB — either a local instance or a MongoDB Atlas cluster.

### 3. Run

```bash
npm run dev     # auto-reload with nodemon
# or
npm start
```

You should see:

```
🚀  Server running on http://localhost:3000
📚  API docs at    http://localhost:3000/api-docs
```

---

## 📚 API Documentation

Open **<http://localhost:3000/api-docs>** for interactive Swagger UI. The raw spec is at **`/openapi.json`**.

### Endpoint overview

| Method | Endpoint                      | Auth | Description                          |
| ------ | ----------------------------- | :--: | ------------------------------------ |
| POST   | `/user/signup`                |  ❌  | Register a new user                  |
| POST   | `/user/login`                 |  ❌  | Log in, returns a JWT                |
| GET    | `/room`                       |  ❌  | List rooms                           |
| GET    | `/room/:id`                   |  ❌  | Get one room                         |
| POST   | `/room`                       |  ✅  | Create a room                        |
| PATCH  | `/room/:id`                   |  ✅  | Update a room                        |
| DELETE | `/room/:id`                   |  ✅  | Delete a room                        |
| GET    | `/booking`                    |  ✅  | List your bookings                   |
| POST   | `/booking`                    |  ✅  | Create a booking (no overlaps)       |
| PATCH  | `/booking/:id/cancel`         |  ✅  | Cancel your booking                  |
| GET    | `/health`                     |  ❌  | Service health check                 |

> Protected routes expect an `Authorization: Bearer <token>` header.

### Quick example

```bash
# 1. Register and log in
curl -X POST http://localhost:3000/user/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Tejas","email":"tejas@example.com","password":"secret123"}'

TOKEN=$(curl -s -X POST http://localhost:3000/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"tejas@example.com","password":"secret123"}' | sed 's/.*"token":"//;s/".*//')

# 2. Create a room
curl -X POST http://localhost:3000/room \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"number":"101","type":"double","pricePerNight":2500,"capacity":2}'

# 3. Book it (use the room _id from step 2)
curl -X POST http://localhost:3000/booking \
  -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" \
  -d '{"roomId":"<ROOM_ID>","guestName":"Tejas","checkIn":"2026-07-01","checkOut":"2026-07-04"}'
```

---

## 🗂️ Project Structure

```
hotel-server/
├── api/
│   ├── common/         # db connection + async handler
│   ├── controllers/    # request/response logic
│   ├── docs/           # openapi.json (Swagger spec)
│   ├── middleware/     # JWT auth
│   ├── models/         # Mongoose schemas (User, Room, Booking)
│   └── routes/         # route definitions
├── app.js              # Express app wiring
├── server.js           # HTTP server entry point
└── .env.example        # environment template
```

---

## 📝 License

ISC © Tejas Davande
