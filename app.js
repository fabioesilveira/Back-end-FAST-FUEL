require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const usersRoutes = require("./routes/usersRoutes");
const productsRoutes = require("./routes/productsRoutes");
const salesRoutes = require("./routes/salesRoutes");
const contactUsRoutes = require("./routes/contactUsRoutes");

const app = express();

app.use("/images", express.static(path.join(__dirname, "images")));

app.use(express.json());

app.use(
    cors({
        origin: true,
        allowedHeaders: ["Content-Type", "Authorization"],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    })
);

// Endpoints base
app.get("/", (req, res) => res.status(200).send("Fast Fuel API OK"));
app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

// Routes
app.use("/users", usersRoutes);
app.use("/products", productsRoutes);
app.use("/sales", salesRoutes);
app.use("/contact-us", contactUsRoutes);

module.exports = app;
