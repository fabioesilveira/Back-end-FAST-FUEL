require("dotenv").config();

const express = require("express");
const cors = require("cors");

const usersRoutes = require("./routes/usersRoutes");
const productsRoutes = require("./routes/productsRoutes");
const salesRoutes = require("./routes/salesRoutes");
const contactUsRoutes = require("./routes/contactUsRoutes");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.status(200).send("Fast Fuel API OK");
});

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.use("/users", usersRoutes);
app.use("/products", productsRoutes);
app.use("/sales", salesRoutes);
app.use("/contact-us", contactUsRoutes);

module.exports = app;
