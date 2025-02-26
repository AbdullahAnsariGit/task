const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const bodyParser = require("body-parser");
const paymentRoutes = require("./routes/paymentRoutes");
const authRouters = require("./routes/authRoutes");
const taskRouter = require("./routes/taskRoutes");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Connect
connectDB();

// Routes
app.use("/payment", paymentRoutes);
app.use("/auth", authRouters);
app.use("/tasks", taskRouter);

// Listen server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT # http://localhost:${PORT}`);
});

