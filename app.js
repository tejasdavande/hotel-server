const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");

const db = require("./api/common/db");
const openapiSpec = require("./api/docs/openapi.json");

const userRoutes = require("./api/routes/user");
const roomRoutes = require("./api/routes/room");
const bookingRoutes = require("./api/routes/booking");

const app = express();

// ---- Global middleware ----
app.use(morgan("dev"));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ---- MongoDB connection events ----
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("MongoDB connection open"));

// ---- API documentation (Swagger UI) ----
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));
app.get("/openapi.json", (req, res) => res.json(openapiSpec));

// ---- Service info & health ----
app.get("/", (req, res) =>
  res.json({ name: "Hotel Server API", docs: "/api-docs", health: "/health" })
);
app.get("/health", (req, res) =>
  res.json({ status: "ok", uptime: process.uptime() })
);

// ---- Routes ----
app.use("/user", userRoutes);
app.use("/room", roomRoutes);
app.use("/booking", bookingRoutes);

// ---- 404 handler ----
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

// ---- Central error handler ----
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: { message: error.message || "Internal server error" },
  });
});

module.exports = app;
