const mongoose = require("mongoose");

/**
 * Build the MongoDB connection string.
 *
 * Configure it with a full MONGODB_URI (recommended, works with Atlas or a
 * local server) or with DB_USERNAME / DB_PASSWORD / DB_NAME for Atlas. Falls
 * back to a local MongoDB so the project runs out of the box.
 */
const buildUri = () => {
  if (process.env.MONGODB_URI) return process.env.MONGODB_URI;

  const { DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;
  if (DB_USERNAME && DB_PASSWORD) {
    return `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.mongodb.net/${
      DB_NAME || "hotel"
    }?retryWrites=true&w=majority`;
  }

  return "mongodb://127.0.0.1:27017/hotel";
};

mongoose.set("strictQuery", true);

mongoose
  .connect(buildUri())
  .then(() => console.log("✅  MongoDB connected successfully"))
  .catch((err) => console.error("❌  MongoDB connection error:", err.message));

const db = mongoose.connection;
module.exports = db;
