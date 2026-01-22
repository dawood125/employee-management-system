import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
// Import routes
import authRoutes from "./routes/authRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";

dotenv.config();

// Connect to database
connectDB();
const PORT = process.env.PORT || 5000;

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/employees", employeeRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
