// import app from "./app.js";
// import { connectDB } from "./config/db.js";

// const isVercel = process.env.VERCEL === "1";

// connectDB().then(() => {
//   if (!isVercel) {
//     const PORT = process.env.PORT || 5000;
//     app.listen(PORT, () => {
//       console.log(`Server running on port ${PORT}`);
//     });
//   }
// });

// export default app;






import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  console.log("MongoDB connected");
  return cached.conn;
}
