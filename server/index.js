import express from "express";
import cors from "cors";
const app = express();

import dotenv from "dotenv";
import dbConnect from "./utils/dbConnect.js";

import productsRoute from './routes/products.js';
import registrationRoute from "./routes/registration.js";
import authRoute from "./routes/auth.js";
import staffsRoute from "./routes/staff.js";
import storesRoute from "./routes/store.js";
import categoriesRoute from './routes/category.js'
import ordersRoute from './routes/order.js'
import suppliersRoute from './routes/supplier.js';
import suppliesRoute from './routes/supply.js';
// import sessionRoute from './routes/session.js';
// import aggregatesRoute from './routes/aggregates.js';

let PORT = process.env.PORT;

dotenv.config();
// ===connect to database
dbConnect();
// ===accept json files
app.use(express.json());
app.use(cors({ credentials: true, origin: true }));
// ===register the routes=======
app.use('/api/v1', suppliesRoute);
app.use('/api/v1', categoriesRoute);
app.use('/api/v1', productsRoute);
app.use("/api/v1", registrationRoute);
app.use("/api/v1", authRoute);
app.use("/api/v1", staffsRoute);
app.use("/api/v1", storesRoute);
app.use('/api/v1', ordersRoute);
app.use('/api/v1', suppliersRoute);

app.listen(PORT, () => {
  console.log("Backend server is running on http://localhost:" + PORT);
});